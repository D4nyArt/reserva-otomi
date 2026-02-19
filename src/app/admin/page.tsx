"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
    getHighlightCards,
    addHighlightCard,
    deleteHighlightCard,
    uploadHighlightImage,
    getEvents,
    addEvent,
    deleteEvent,
    type HighlightCard,
    type Event,
} from "@/lib/supabase";

type Section = "raices" | "preservacion";
type AdminTab = "tarjetas" | "eventos";

const CATEGORIES = [
    { value: "ecoturismo", label: "Ecoturismo", color: "from-forest-500 to-forest-700", bg: "bg-forest-50", text: "text-forest-700" },
    { value: "cultura", label: "Cultura", color: "from-earth-500 to-earth-700", bg: "bg-earth-50", text: "text-earth-700" },
    { value: "talleres", label: "Talleres", color: "from-amber-500 to-amber-700", bg: "bg-amber-50", text: "text-amber-700" },
    { value: "activismo", label: "Activismo", color: "from-water-500 to-water-700", bg: "bg-water-50", text: "text-water-700" },
];

function getCategoryStyle(category: string) {
    return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
}

/* ─── Login Gate ─── */
function LoginGate({ onAuthenticated }: { onAuthenticated: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                sessionStorage.setItem("admin_auth", "true");
                onAuthenticated();
            } else {
                const data = await res.json();
                setError(data.error || "Error de autenticación.");
            }
        } catch {
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-forest-950 px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold text-white">
                        <span className="text-forest-400">Agua</span> Barranca
                    </h1>
                    <p className="mt-2 text-sm text-white/50">Panel de Administración</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
                >
                    <label className="mb-2 block text-sm font-medium text-white/70">
                        Contraseña de administrador
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa la contraseña"
                        className="mb-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-forest-400"
                        required
                    />

                    {error && (
                        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
                    >
                        {loading ? "Verificando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ─── Image Upload Dropzone ─── */
function ImageUpload({
    onFileSelect,
    preview,
    label,
}: {
    onFileSelect: (file: File) => void;
    preview: string | null;
    label?: string;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) onFileSelect(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${isDragging
                    ? "border-forest-400 bg-forest-400/10"
                    : preview
                        ? "border-forest-500/30 bg-forest-500/5"
                        : "border-white/15 hover:border-white/30"
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {preview ? (
                <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            ) : (
                <>
                    <svg
                        className="mb-2 h-8 w-8 text-white/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                    </svg>
                    <p className="text-sm text-white/40">
                        {label || "Arrastra una imagen o haz clic para seleccionar"}
                    </p>
                </>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  HIGHLIGHT CARDS MANAGEMENT  ═══════ */
/* ═══════════════════════════════════════════ */

/* ─── Add Card Form ─── */
function AddCardForm({
    section,
    onCardAdded,
}: {
    section: Section;
    onCardAdded: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleFileSelect = (f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Por favor selecciona una imagen.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const imageUrl = await uploadHighlightImage(file);
            if (!imageUrl) {
                setError(
                    "Error al subir la imagen. Verifica que el bucket 'highlight-images' existe en Supabase."
                );
                setSaving(false);
                return;
            }

            const card = await addHighlightCard({
                section,
                title,
                description,
                image_url: imageUrl,
            });

            if (!card) {
                setError("Error al crear la tarjeta.");
                setSaving(false);
                return;
            }

            setTitle("");
            setDescription("");
            setFile(null);
            setPreview(null);
            onCardAdded();
        } catch {
            setError("Error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
            <h3 className="font-heading mb-4 text-lg font-bold text-white">
                Agregar Tarjeta
            </h3>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre de la tarjeta"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción de la tarjeta"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Imagen</label>
                <ImageUpload onFileSelect={handleFileSelect} preview={preview} />
            </div>

            {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
            >
                {saving ? "Guardando..." : "Agregar Tarjeta"}
            </button>
        </form>
    );
}

/* ─── Card List Item ─── */
function CardListItem({
    card,
    onDelete,
}: {
    card: HighlightCard;
    onDelete: (id: string) => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            !confirm(
                `¿Eliminar "${card.title}"? Esta acción no se puede deshacer.`
            )
        )
            return;

        setDeleting(true);
        const success = await deleteHighlightCard(card.id);
        if (success) onDelete(card.id);
        setDeleting(false);
    };

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                    src={card.image_url}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized={card.image_url.startsWith("http")}
                />
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-white">
                    {card.title}
                </h4>
                <p className="truncate text-xs text-white/40">{card.description}</p>
            </div>
            <DeleteButton deleting={deleting} onClick={handleDelete} />
        </div>
    );
}

/* ─── Highlight Cards Panel ─── */
function HighlightCardsPanel() {
    const [activeSection, setActiveSection] = useState<Section>("raices");
    const [cards, setCards] = useState<HighlightCard[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCards = useCallback(async () => {
        setLoading(true);
        const data = await getHighlightCards(activeSection);
        setCards(data);
        setLoading(false);
    }, [activeSection]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleDelete = (id: string) => {
        setCards((prev) => prev.filter((c) => c.id !== id));
    };

    const sectionConfig = {
        raices: { label: "Raíces", color: "from-earth-500 to-earth-700" },
        preservacion: {
            label: "Preservación",
            color: "from-water-500 to-water-700",
        },
    };

    return (
        <div>
            {/* Sub-tabs */}
            <div className="mb-8 flex gap-3">
                {(["raices", "preservacion"] as Section[]).map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${activeSection === section
                                ? `bg-gradient-to-r ${sectionConfig[section].color} text-white shadow-lg`
                                : "border border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                            }`}
                    >
                        {sectionConfig[section].label}
                    </button>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Card List */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-lg font-bold text-white">
                            Tarjetas actuales
                        </h2>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                            {cards.length} {cards.length === 1 ? "tarjeta" : "tarjetas"}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-3"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-24 rounded-lg bg-white/10" />
                                        <div className="flex-1">
                                            <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                                            <div className="h-3 w-full rounded bg-white/5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
                            <p className="text-sm text-white/40">
                                No hay tarjetas en esta sección. ¡Agrega la primera!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cards.map((card) => (
                                <CardListItem
                                    key={card.id}
                                    card={card}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Card Form */}
                <AddCardForm section={activeSection} onCardAdded={fetchCards} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  EVENTS MANAGEMENT  ════════════════ */
/* ═══════════════════════════════════════════ */

/* ─── Delete Button (shared) ─── */
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
            className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50"
            title="Eliminar"
        >
            {deleting ? (
                <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                    />
                    <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            ) : (
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
            )}
        </button>
    );
}

/* ─── Calendar Mini-View ─── */
function CalendarMini({ events }: { events: Event[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = currentMonth.toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
    });

    // Days that have events
    const eventDays = new Set(
        events
            .filter((e) => {
                const d = new Date(e.date);
                return d.getFullYear() === year && d.getMonth() === month;
            })
            .map((e) => new Date(e.date).getDate())
    );

    const prev = () => setCurrentMonth(new Date(year, month - 1, 1));
    const next = () => setCurrentMonth(new Date(year, month + 1, 1));

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {/* Month navigation */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={prev}
                    className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <span className="text-sm font-semibold capitalize text-white">
                    {monthLabel}
                </span>
                <button
                    onClick={next}
                    className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 text-center">
                {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                    <div key={d} className="text-xs font-medium text-white/30">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty leading cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}
                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = eventDays.has(day);
                    const isToday =
                        new Date().getDate() === day &&
                        new Date().getMonth() === month &&
                        new Date().getFullYear() === year;

                    return (
                        <div
                            key={day}
                            className={`relative flex h-8 items-center justify-center rounded-lg text-xs transition-colors ${isToday
                                    ? "bg-forest-500/20 font-bold text-forest-400"
                                    : "text-white/50"
                                } ${hasEvent ? "font-semibold text-white" : ""}`}
                        >
                            {day}
                            {hasEvent && (
                                <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-forest-400" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Event List Item ─── */
function EventListItem({
    event,
    onDelete,
}: {
    event: Event;
    onDelete: (id: string) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const style = getCategoryStyle(event.category);
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const handleDelete = async () => {
        if (
            !confirm(
                `¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`
            )
        )
            return;
        setDeleting(true);
        const success = await deleteEvent(event.id);
        if (success) onDelete(event.id);
        setDeleting(false);
    };

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20">
            {/* Date badge */}
            <div
                className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${style.color} text-white`}
            >
                <span className="text-lg font-bold leading-none">
                    {date.getDate()}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                    {date.toLocaleDateString("es-MX", { month: "short" })}
                </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-white">
                        {event.title}
                    </h4>
                    <span
                        className={`${style.bg} ${style.text} shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold`}
                    >
                        {style.label}
                    </span>
                </div>
                <p className="truncate text-xs text-white/40">
                    {dateStr}
                    {event.tags?.length > 0 && ` · ${event.tags.join(", ")}`}
                </p>
            </div>

            <DeleteButton deleting={deleting} onClick={handleDelete} />
        </div>
    );
}

/* ─── Add Event Form ─── */
function AddEventForm({ onEventAdded }: { onEventAdded: () => void }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("ecoturismo");
    const [tagsInput, setTagsInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleFileSelect = (f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let imageUrl: string | null = null;

            if (file) {
                imageUrl = await uploadHighlightImage(file);
                if (!imageUrl) {
                    setError("Error al subir la imagen.");
                    setSaving(false);
                    return;
                }
            }

            const tags = tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);

            const result = await addEvent({
                title,
                description,
                date: new Date(date).toISOString(),
                category,
                tags,
                image_url: imageUrl,
            });

            if (!result) {
                setError("Error al crear el evento.");
                setSaving(false);
                return;
            }

            // Reset
            setTitle("");
            setDescription("");
            setDate("");
            setCategory("ecoturismo");
            setTagsInput("");
            setFile(null);
            setPreview(null);
            onEventAdded();
        } catch {
            setError("Error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
            <h3 className="font-heading mb-4 text-lg font-bold text-white">
                Agregar Evento
            </h3>

            {/* Title */}
            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre del evento"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del evento"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                    required
                />
            </div>

            {/* Date + Category row */}
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm text-white/60">Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400 [color-scheme:dark]"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm text-white/60">Categoría</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400 [color-scheme:dark]"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">
                    Tags <span className="text-white/30">(separados por coma)</span>
                </label>
                <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="senderismo, naturaleza, avistamientos"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                />
                {/* Tag preview */}
                {tagsInput.trim() && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {tagsInput
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t)
                            .map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-forest-500/30 bg-forest-500/10 px-2.5 py-0.5 text-xs text-forest-400"
                                >
                                    #{tag}
                                </span>
                            ))}
                    </div>
                )}
            </div>

            {/* Image (optional) */}
            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">
                    Imagen <span className="text-white/30">(opcional)</span>
                </label>
                <ImageUpload
                    onFileSelect={handleFileSelect}
                    preview={preview}
                    label="Imagen del evento (opcional)"
                />
            </div>

            {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
            >
                {saving ? "Guardando..." : "Agregar Evento"}
            </button>
        </form>
    );
}

/* ─── Events Panel ─── */
function EventsPanel() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = (id: string) => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
    };

    return (
        <div>
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Event List */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-lg font-bold text-white">
                            Eventos
                        </h2>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                            {events.length} {events.length === 1 ? "evento" : "eventos"}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-3"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-xl bg-white/10" />
                                        <div className="flex-1">
                                            <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                                            <div className="h-3 w-full rounded bg-white/5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
                            <p className="text-sm text-white/40">
                                No hay eventos. ¡Agrega el primero!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <EventListItem
                                    key={event.id}
                                    event={event}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column: Calendar + Add form */}
                <div className="space-y-6">
                    <CalendarMini events={events} />
                    <AddEventForm onEventAdded={fetchEvents} />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  ADMIN DASHBOARD  ══════════════════ */
/* ═══════════════════════════════════════════ */

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("tarjetas");

    const tabConfig = {
        tarjetas: {
            label: "Tarjetas",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
            ),
        },
        eventos: {
            label: "Eventos",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
        },
    };

    return (
        <div className="min-h-screen bg-forest-950">
            {/* Header */}
            <header className="border-b border-white/10 bg-forest-950/80 px-6 py-5 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="font-heading text-xl font-bold text-white">
                            <span className="text-forest-400">Agua</span> Barranca — Admin
                        </h1>
                        <p className="mt-1 text-xs text-white/40">
                            Gestión de contenido del sitio
                        </p>
                    </div>
                    <a
                        href="/"
                        className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/60 transition-all hover:border-white/30 hover:text-white"
                    >
                        ← Ver sitio
                    </a>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Top-level Tabs */}
                <div className="mb-10 flex gap-3">
                    {(Object.keys(tabConfig) as AdminTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${activeTab === tab
                                    ? "bg-gradient-to-r from-forest-500 to-forest-700 text-white shadow-lg"
                                    : "border border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {tabConfig[tab].icon}
                            {tabConfig[tab].label}
                        </button>
                    ))}
                </div>

                {/* Panel content */}
                {activeTab === "tarjetas" && <HighlightCardsPanel />}
                {activeTab === "eventos" && <EventsPanel />}
            </div>
        </div>
    );
}

/* ─── Page Export ─── */
export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("admin_auth") === "true") {
            setAuthenticated(true);
        }
    }, []);

    if (!authenticated) {
        return <LoginGate onAuthenticated={() => setAuthenticated(true)} />;
    }

    return <AdminDashboard />;
}
