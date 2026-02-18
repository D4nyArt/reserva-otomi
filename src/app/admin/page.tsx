"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
    getHighlightCards,
    addHighlightCard,
    deleteHighlightCard,
    uploadHighlightImage,
    type HighlightCard,
} from "@/lib/supabase";

type Section = "raices" | "preservacion";

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
}: {
    onFileSelect: (file: File) => void;
    preview: string | null;
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
                        Arrastra una imagen o haz clic para seleccionar
                    </p>
                </>
            )}
        </div>
    );
}

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
            // Upload image
            const imageUrl = await uploadHighlightImage(file);
            if (!imageUrl) {
                setError("Error al subir la imagen. Verifica que el bucket 'highlight-images' existe en Supabase.");
                setSaving(false);
                return;
            }

            // Create card
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

            // Reset form
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
        if (!confirm(`¿Eliminar "${card.title}"? Esta acción no se puede deshacer.`))
            return;

        setDeleting(true);
        const success = await deleteHighlightCard(card.id);
        if (success) {
            onDelete(card.id);
        }
        setDeleting(false);
    };

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-white/20">
            {/* Thumbnail */}
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

            {/* Info */}
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-white">
                    {card.title}
                </h4>
                <p className="truncate text-xs text-white/40">{card.description}</p>
            </div>

            {/* Delete button */}
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50"
                title="Eliminar tarjeta"
            >
                {deleting ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                )}
            </button>
        </div>
    );
}

/* ─── Admin Dashboard ─── */
function AdminDashboard() {
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
        preservacion: { label: "Preservación", color: "from-water-500 to-water-700" },
    };

    return (
        <div className="min-h-screen bg-forest-950">
            {/* Header */}
            <header className="border-b border-white/10 bg-forest-950/80 px-6 py-5 backdrop-blur-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div>
                        <h1 className="font-heading text-xl font-bold text-white">
                            <span className="text-forest-400">Agua</span> Barranca — Admin
                        </h1>
                        <p className="mt-1 text-xs text-white/40">
                            Gestión de tarjetas de Raíces y Preservación
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

            <div className="mx-auto max-w-5xl px-6 py-10">
                {/* Section Tabs */}
                <div className="mb-8 flex gap-3">
                    {(["raices", "preservacion"] as Section[]).map((section) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${activeSection === section
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
                                        className="h-22 animate-pulse rounded-xl border border-white/10 bg-white/5 p-3"
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
