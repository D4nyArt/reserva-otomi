"use client";

import { useState, useEffect } from "react";
import {
    getTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getEvents,
    type Testimonial,
    type Event,
} from "@/lib/supabase";

/* ─── Shared Components ─── */

function DeleteButton({
    deleting,
    onClick,
}: {
    deleting: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={deleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            title="Eliminar"
        >
            {deleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
}

function EditButton({
    editing,
    onClick,
}: {
    editing: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={editing}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest-500/10 text-forest-500 transition-colors hover:bg-forest-500/20 disabled:opacity-50"
            title="Editar"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        </button>
    );
}

/* ─── Testimonial List Item ─── */

function TestimonialListItem({
    testimonial,
    events,
    onDelete,
    onEdit,
}: {
    testimonial: Testimonial;
    events: Event[];
    onDelete: (id: string) => void;
    onEdit?: (testimonial: Testimonial) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`¿Eliminar testimonio de "${testimonial.author}"? Esta acción no se puede deshacer.`)) return;

        setDeleting(true);
        const success = await deleteTestimonial(testimonial.id);
        if (success) onDelete(testimonial.id);
        setDeleting(false);
    };

    return (
        <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-500/20 text-forest-400">
                <span className="font-bold">{testimonial.author.charAt(0).toUpperCase()}</span>
            </div>

            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-white">
                    {testimonial.author}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                    "{testimonial.content}"
                </p>
                {testimonial.event_id && (
                    <span className="mt-2 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                        Vinculado a: {events.find(e => e.id === testimonial.event_id)?.title || "Evento Desconocido"}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {onEdit && (
                    <EditButton
                        editing={editing}
                        onClick={() => {
                            setEditing(true);
                            onEdit(testimonial);
                            setEditing(false);
                        }}
                    />
                )}
                <DeleteButton deleting={deleting} onClick={handleDelete} />
            </div>
        </div>
    );
}

/* ─── Add / Edit Testimonial Form ─── */

function TestimonialForm({
    initialTestimonial,
    events,
    onTestimonialAdded,
    onTestimonialUpdated,
    onCancelEdit,
}: {
    initialTestimonial?: Testimonial | null;
    events: Event[];
    onTestimonialAdded?: () => void;
    onTestimonialUpdated?: () => void;
    onCancelEdit?: () => void;
}) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [eventId, setEventId] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialTestimonial) {
            setAuthor(initialTestimonial.author);
            setContent(initialTestimonial.content);
            setEventId(initialTestimonial.event_id || "");
        } else {
            setAuthor("");
            setContent("");
            setEventId("");
        }
    }, [initialTestimonial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            if (initialTestimonial) {
                const updated = await updateTestimonial(initialTestimonial.id, {
                    author,
                    content,
                    event_id: eventId || null,
                });

                if (!updated) {
                    setError("Error al actualizar el testimonio.");
                } else {
                    setAuthor("");
                    setContent("");
                    setEventId("");
                    onTestimonialUpdated?.();
                    onCancelEdit?.();
                }
            } else {
                const added = await addTestimonial({
                    author,
                    content,
                    event_id: eventId || null,
                });

                if (!added) {
                    setError("Error al agregar el testimonio.");
                } else {
                    setAuthor("");
                    setContent("");
                    setEventId("");
                    onTestimonialAdded?.();
                }
            }
        } catch {
            setError("Error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-heading mb-4 text-lg font-bold text-white">
                {initialTestimonial ? "Editar Testimonio" : "Agregar Testimonio"}
            </h3>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Autor / Nombre</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ej. María Sánchez"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Testimonio</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escribe la experiencia o comentario..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Vincular a Evento (Opcional)</label>
                <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400 [&>option]:text-black"
                >
                    <option value="">-- General (Sin evento) --</option>
                    {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                            {ev.title}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm flex items-center justify-between text-red-400">
                    <span>{error}</span>
                    {initialTestimonial && onCancelEdit && (
                        <button type="button" onClick={onCancelEdit} className="text-white/60 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </p>
            )}

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-600 disabled:opacity-50"
                >
                    {saving ? "Guardando..." : initialTestimonial ? "Actualizar" : "Agregar Testimonio"}
                </button>
                {initialTestimonial && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

/* ─── Main Panel Component ─── */

export default function TestimonialsPanel() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const loadData = async () => {
        setLoading(true);
        const [testData, evData] = await Promise.all([
            getTestimonials(),
            getEvents(),
        ]);
        setTestimonials(testData);
        setEvents(evData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = (id: string) => {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        if (editingTestimonial?.id === id) {
            setEditingTestimonial(null);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Col: Form */}
            <div className="lg:col-span-1">
                <div className="sticky top-8">
                    <TestimonialForm
                        initialTestimonial={editingTestimonial}
                        events={events}
                        onTestimonialAdded={loadData}
                        onTestimonialUpdated={loadData}
                        onCancelEdit={() => setEditingTestimonial(null)}
                    />
                </div>
            </div>

            {/* Right Col: List */}
            <div className="lg:col-span-2">
                <h3 className="font-heading mb-6 text-xl font-bold text-white">
                    Testimonios Existentes
                </h3>
                {loading ? (
                    <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest-500 border-t-transparent" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <p className="text-sm text-white/40">No hay testimonios todavía.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {testimonials.map((t) => (
                            <TestimonialListItem
                                key={t.id}
                                testimonial={t}
                                events={events}
                                onDelete={handleDelete}
                                onEdit={setEditingTestimonial}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
