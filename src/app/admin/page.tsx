"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
    getHighlightCards,
    addHighlightCard,
    deleteHighlightCard,
    updateHighlightCard,
    uploadHighlightImage,
    getEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    type HighlightCard,
    type Event,
} from "@/lib/supabase";
import EscenariosPanel from "./components/EscenariosPanel";
import UsagePanel from "./components/UsagePanel";
import StoragePreviewBar from "./components/StoragePreviewBar";
import DictionaryManagerPanel from "./components/DictionaryManagerPanel";


type Section = "raices" | "preservacion";
type AdminTab = "tarjetas" | "eventos" | "escenarios" | "uso" | "diccionario";

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
                sessionStorage.setItem("admin_pw", password);

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
    onCardUpdated,
    onPendingFileChange,
    initialCard,
    onCancelEdit,
}: {
    section: Section;
    onCardAdded?: () => void;
    onCardUpdated?: () => void;
    onPendingFileChange?: (bytes: number) => void;
    initialCard?: HighlightCard;
    onCancelEdit?: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // populate when editing
    useEffect(() => {
        if (initialCard) {
            setTitle(initialCard.title);
            setDescription(initialCard.description);
            setCategory(initialCard.category || "");
            setPreview(initialCard.image_url);
        }
    }, [initialCard]);

    const handleFileSelect = (f: File) => {
        setFile(f);
        setPreview(URL.createObjectURL(f));
        onPendingFileChange?.(f.size);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialCard && !file) {
            setError("Por favor selecciona una imagen.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            let imageUrl: string | null = null;
            if (file) {
                imageUrl = await uploadHighlightImage(file);
                if (!imageUrl) {
                    setError(
                        "Error al subir la imagen. Verifica que el bucket 'highlight-images' existe en Supabase."
                    );
                    setSaving(false);
                    return;
                }
            } else if (initialCard) {
                imageUrl = initialCard.image_url;
            }

            if (initialCard) {
                // update path
                const updates: any = {
                    title,
                    description,
                    category: category || null,
                };
                if (imageUrl) updates.image_url = imageUrl;
                const updated = await updateHighlightCard(initialCard.id, updates);
                if (!updated) {
                    setError("Error al actualizar la tarjeta.");
                    setSaving(false);
                    return;
                }
                // Reset form
                setTitle("");
                setDescription("");
                setCategory("");
                setFile(null);
                setPreview(null);
                onPendingFileChange?.(0);
                onCardUpdated?.();
                onCancelEdit?.();
            } else {
                const card = await addHighlightCard({
                    section,
                    title,
                    description,
                    image_url: imageUrl!,
                    category: category || null,
                });

                if (!card) {
                    setError("Error al crear la tarjeta.");
                    setSaving(false);
                    return;
                }

                setTitle("");
                setDescription("");
                setCategory("");
                setFile(null);
                setPreview(null);
                onPendingFileChange?.(0);
                onCardAdded?.();
            }
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
                {initialCard ? "Editar Tarjeta" : "Agregar Tarjeta"}
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
                <label className="mb-1 block text-sm text-white/60">Categoría de evento <span className="text-white/30">(opcional)</span></label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-forest-400 [color-scheme:dark]"
                >
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm text-white/60">Imagen</label>
                <ImageUpload onFileSelect={handleFileSelect} preview={preview} />
            </div>

            {error && (
                <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center justify-between">
                    <span>{error}</span>
                    {initialCard && onCancelEdit && (
                        <button
                            type="button"
                            className="ml-4 text-sm underline text-white/90 hover:text-white"
                            onClick={onCancelEdit}
                        >
                            Cancelar
                        </button>
                    )}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
            >
                {saving ? "Guardando..." : initialCard ? "Actualizar Tarjeta" : "Agregar Tarjeta"}
            </button>

            {initialCard && onCancelEdit && (
                <button
                    type="button"
                    className="mt-2 w-full rounded-xl border border-white/15 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5"
                    onClick={onCancelEdit}
                >
                    Cancelar
                </button>
            )}
        </form>
    );
}

/* ─── Card List Item ─── */
function CardListItem({
    card,
    onDelete,
    onEdit,
}: {
    card: HighlightCard;
    onDelete: (id: string) => void;
    onEdit?: (card: HighlightCard) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);

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
            {onEdit && (
                <EditButton
                    editing={editing}
                    onClick={() => {
                        setEditing(true);
                        onEdit(card);
                        setEditing(false);
                    }}
                />
            )}
            <DeleteButton deleting={deleting} onClick={handleDelete} />
        </div>
    );
}

/* ─── Highlight Cards Panel ─── */
function HighlightCardsPanel() {
    const [activeSection, setActiveSection] = useState<Section>("raices");
    const [cards, setCards] = useState<HighlightCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingFileSize, setPendingFileSize] = useState(0);
    const [editingCard, setEditingCard] = useState<HighlightCard | null>(null);

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

    const handleEdit = (card: HighlightCard) => {
        setEditingCard(card);
    };

    const handleSaved = () => {
        fetchCards();
        setEditingCard(null);
    };

    const handleCancelEdit = () => {
        setEditingCard(null);
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
            {/* Storage preview bar */}
            <div className="mb-6">
                <StoragePreviewBar pendingBytes={pendingFileSize} />
            </div>

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
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Card Form */}
                <AddCardForm
                    section={activeSection}
                    initialCard={editingCard || undefined}
                    onCardAdded={editingCard ? undefined : fetchCards}
                    onCardUpdated={editingCard ? handleSaved : undefined}
                    onCancelEdit={handleCancelEdit}
                    onPendingFileChange={setPendingFileSize}
                />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  EVENTS MANAGEMENT  ════════════════ */
/* ═══════════════════════════════════════════ */

/* ─── Edit Button (shared) ─── */
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
            className="shrink-0 rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/20 disabled:opacity-50"
            title="Editar"
        >
            {editing ? (
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
                        d="M16.862 3.487l3.651 3.651m-12.12 2.122l6.363-6.364a1.5 1.5 0 012.121 0l3.535 3.535a1.5 1.5 0 010 2.121l-6.364 6.364a1.5 1.5 0 01-1.06.44H7.5v-3.535a1.5 1.5 0 01.44-1.06z"
                    />
                </svg>
            )}
        </button>
    );
}

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
    onEdit,
}: {
    event: Event;
    onDelete: (id: string) => void;
    onEdit?: (event: Event) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
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
                {event.registration_link && (
                    <p className="truncate text-xs text-white/40">
                        Registro: <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white"
                        >
                            enlace
                        </a>
                    </p>
                )}
            </div> {/* end info */}

            {onEdit && (
                <EditButton
                    editing={editing}
                    onClick={() => {
                        setEditing(true);
                        onEdit(event);
                        setEditing(false);
                    }}
                />
            )}
            <DeleteButton deleting={deleting} onClick={handleDelete} />
        </div>
    );
}

/* ─── Add Event Form ─── */
function AddEventForm({
    onEventAdded,
    onEventUpdated,
    initialEvent,
    onCancelEdit,
}: {
    onEventAdded?: () => void;
    onEventUpdated?: () => void;
    initialEvent?: Event;
    onCancelEdit?: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("ecoturismo");
    const [tagsInput, setTagsInput] = useState("");
    const [registrationLink, setRegistrationLink] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialEvent) {
            setTitle(initialEvent.title);
            setDescription(initialEvent.description);
            setDate(initialEvent.date.substring(0, 10));
            setCategory(initialEvent.category);
            setTagsInput(initialEvent.tags.join(", "));
            setRegistrationLink(initialEvent.registration_link || "");
            setPreview(initialEvent.image_url);
        }
    }, [initialEvent]);

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
            } else if (initialEvent) {
                // Use existing image if not uploading a new one
                imageUrl = initialEvent.image_url;
            }

            //valida la url de registro, si se proporcionó
            if (registrationLink.trim()) {
                try {
                    new URL(registrationLink);
                } catch {
                    setError("La URL de registro no es válida.");
                    setSaving(false);
                    return;
                }
            }

            const tags = tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);

            const payload: any = {
                title,
                description,
                date: new Date(date).toISOString(),
                category,
                tags,
            };

            if (imageUrl) {
                payload.image_url = imageUrl;
            }

            if (registrationLink.trim()) {
                payload.registration_link = registrationLink;
            }

            let result;
            if (initialEvent) {
                // Update existing event
                result = await updateEvent(initialEvent.id, payload);
            } else {
                // Create new event
                result = await addEvent(payload);
            }

            if (!result) {
                setError(initialEvent ? "Error al actualizar el evento." : "Error al crear el evento.");
                setSaving(false);
                return;
            }

            // Reset and notify
            setTitle("");
            setDescription("");
            setDate("");
            setCategory("ecoturismo");
            setTagsInput("");
            setRegistrationLink("");
            setFile(null);
            setPreview(null);
            if (initialEvent) {
                onEventUpdated?.();
                onCancelEdit?.();
            } else {
                onEventAdded?.();
            }
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
                {initialEvent ? "Editar Evento" : "Agregar Evento"}
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
                <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center justify-between">
                    <span>{error}</span>
                    {initialEvent && onCancelEdit && (
                        <button
                            type="button"
                            className="ml-4 text-sm underline text-white/90 hover:text-white"
                            onClick={onCancelEdit}
                        >
                            Cancelar
                        </button>
                    )}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-forest-500 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
            >
                {saving ? "Guardando..." : initialEvent ? "Actualizar Evento" : "Agregar Evento"}
            </button>

            {initialEvent && onCancelEdit && (
                <button
                    type="button"
                    className="mt-2 w-full rounded-xl border border-white/15 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5"
                    onClick={onCancelEdit}
                >
                    Cancelar
                </button>
            )}
        </form>
    );
}

/* ─── Events Panel ─── */
function EventsPanel() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
    };

    const handleSaved = () => {
        fetchEvents();
        setEditingEvent(null);
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
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
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column: Calendar + Add form */}
                <div className="space-y-6">
                    <CalendarMini events={events} />
                    <AddEventForm
                        initialEvent={editingEvent || undefined}
                        onEventAdded={editingEvent ? undefined : fetchEvents}
                        onEventUpdated={editingEvent ? handleSaved : undefined}
                        onCancelEdit={handleCancelEdit}
                    />
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
        escenarios: {
            label: "Escenarios Otomí",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
            ),
        },
        uso: {
            label: "Uso",
            icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
            ),
        },
        diccionario: {
          label: "Diccionario",
          icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75h8.25M12 12h8.25M12 17.25h8.25M3.75 6.75h3.5v14.5h-3.5V6.75zm0 0V3.75h3.5v3" />
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
                {activeTab === "escenarios" && <EscenariosPanel />}
                {activeTab === "uso" && <UsagePanel />}
                {activeTab === "diccionario" && <DictionaryManagerPanel />}
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
