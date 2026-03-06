"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
    getOtomiScenarios,
    getOtomiElements,
    addOtomiScenario,
    updateOtomiScenario,
    deleteOtomiScenario,
    addOtomiElement,
    updateOtomiElement,
    deleteOtomiElement,
    uploadOtomiElementImage,
    uploadOtomiScenarioBgImage,
    type OtomiScenario,
    type OtomiElement,
} from "@/lib/supabase";
import StoragePreviewBar from "./StoragePreviewBar";

/* ─── Gradient Presets ─── */
const GRADIENT_PRESETS = [
    { label: "Cielo / Tierra", value: "linear-gradient(180deg, #87CEEB 0%, #F5DEB3 60%, #8B7355 100%)" },
    { label: "Bosque", value: "linear-gradient(180deg, #4A7C59 0%, #2D5016 40%, #1A3A0A 100%)" },
    { label: "Ciudad", value: "linear-gradient(180deg, #6B7B8D 0%, #A8B5C2 40%, #D4D4D4 100%)" },
    { label: "Atardecer", value: "linear-gradient(180deg, #FF6B35 0%, #D4A574 50%, #2D1B00 100%)" },
    { label: "Noche", value: "linear-gradient(180deg, #0F0C29 0%, #302B63 50%, #24243E 100%)" },
    { label: "Lago", value: "linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #2F4F4F 100%)" },
];

const EMOJI_OPTIONS = ["🏠", "🌲", "🏙️", "🌾", "🏔️", "🌊", "🌺", "🎪", "🏫", "🌿"];

/* ─── Delete Button ─── */
function DeleteBtn({
    deleting,
    onClick,
    small,
}: {
    deleting: boolean;
    onClick: () => void;
    small?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={deleting}
            className={`shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50 ${small ? "p-1" : "p-2"}`}
            title="Eliminar"
        >
            {deleting ? (
                <svg className={`${small ? "h-3 w-3" : "h-4 w-4"} animate-spin`} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
            ) : (
                <svg className={`${small ? "h-3 w-3" : "h-4 w-4"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            )}
        </button>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  POSITION GRID  ═══════════════════ */
/* ═══════════════════════════════════════════ */

function PositionGrid({
    elements,
    activeElementId,
    bgGradient,
    bgImageUrl,
    onPositionClick,
}: {
    elements: OtomiElement[];
    activeElementId: string | null;
    bgGradient: string;
    bgImageUrl?: string | null;
    onPositionClick: (x: number, y: number) => void;
}) {
    const gridRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        if (!gridRef.current || !activeElementId) return;
        const rect = gridRef.current.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        onPositionClick(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
    };

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="px-3 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">
                    Vista previa del escenario
                </span>
                {activeElementId ? (
                    <span className="text-xs text-amber-400 animate-pulse">
                        👆 Haz clic para posicionar el elemento
                    </span>
                ) : (
                    <span className="text-xs text-white/30">
                        Selecciona un elemento para posicionarlo
                    </span>
                )}
            </div>
            <div
                ref={gridRef}
                onClick={handleClick}
                className={`relative w-full aspect-[16/9] ${activeElementId ? "cursor-crosshair" : "cursor-default"}`}
                style={{ background: bgGradient }}
            >
                {/* Background image */}
                {bgImageUrl && (
                    <Image
                        src={bgImageUrl}
                        alt="Fondo del escenario"
                        fill
                        className="object-cover pointer-events-none"
                        unoptimized
                    />
                )}
                {/* Grid lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={`h-${i}`}
                            className="absolute left-0 right-0 border-t border-white/30"
                            style={{ top: `${(i + 1) * 10}%` }}
                        />
                    ))}
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={`v-${i}`}
                            className="absolute top-0 bottom-0 border-l border-white/30"
                            style={{ left: `${(i + 1) * 10}%` }}
                        />
                    ))}
                </div>

                {/* Element markers */}
                {elements.map((el) => (
                    <div
                        key={el.id}
                        className={`absolute flex items-center justify-center transition-all duration-200 ${el.id === activeElementId
                            ? "z-20 scale-125"
                            : "z-10"
                            }`}
                        style={{
                            left: `${el.position_x}%`,
                            top: `${el.position_y}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${el.id === activeElementId
                                ? "border-amber-400 bg-white ring-2 ring-amber-400/50"
                                : "border-white/60 bg-white/90"
                                }`}
                        >
                            {el.image_url ? (
                                <Image
                                    src={el.image_url}
                                    alt={el.spanish_word}
                                    width={28}
                                    height={28}
                                    className="rounded-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <span className="text-lg leading-none">{el.emoji}</span>
                            )}
                        </div>
                        {/* Label */}
                        <div className="absolute -bottom-5 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold text-white bg-black/50 rounded-full">
                                {el.spanish_word}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  ADD ELEMENT FORM  ═════════════════ */
/* ═══════════════════════════════════════════ */

function AddElementForm({
    scenarioId,
    onElementAdded,
    onPendingFileChange,
}: {
    scenarioId: string;
    onElementAdded: () => void;
    onPendingFileChange?: (bytes: number) => void;
}) {
    const [otomiWord, setOtomiWord] = useState("");
    const [spanishWord, setSpanishWord] = useState("");
    const [emoji, setEmoji] = useState("❓");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
            onPendingFileChange?.(f.size);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let imageUrl: string | null = null;

            if (file) {
                imageUrl = await uploadOtomiElementImage(file);
                if (!imageUrl) {
                    setError("Error al subir la imagen. Verifica que el bucket 'otomi-element-images' existe.");
                    setSaving(false);
                    return;
                }
            }

            const result = await addOtomiElement({
                scenario_id: scenarioId,
                otomi_word: otomiWord,
                spanish_word: spanishWord,
                emoji,
                image_url: imageUrl,
                position_x: 50,
                position_y: 50,
            });

            if (!result) {
                setError("Error al crear el elemento.");
                setSaving(false);
                return;
            }

            setOtomiWord("");
            setSpanishWord("");
            setEmoji("❓");
            setFile(null);
            setPreview(null);
            onPendingFileChange?.(0);
            onElementAdded();
        } catch {
            setError("Error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="font-heading text-sm font-bold text-white mb-3">
                Agregar Elemento
            </h4>

            <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                    <label className="mb-1 block text-xs text-white/50">Palabra Otomí</label>
                    <input
                        type="text"
                        value={otomiWord}
                        onChange={(e) => setOtomiWord(e.target.value)}
                        placeholder="Ra Dada"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-white/50">Español</label>
                    <input
                        type="text"
                        value={spanishWord}
                        onChange={(e) => setSpanishWord(e.target.value)}
                        placeholder="Papá"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                        required
                    />
                </div>
            </div>

            {/* Emoji selector */}
            <div className="mb-3">
                <label className="mb-1 block text-xs text-white/50">Emoji (si no hay imagen)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        className="w-16 rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-center text-lg text-white outline-none focus:border-forest-400"
                        maxLength={4}
                    />
                    <div className="flex flex-wrap gap-1">
                        {["👨", "👩", "👦", "👧", "🐕", "🌳", "🏠", "🚗", "🌸", "❓"].map((e) => (
                            <button
                                key={e}
                                type="button"
                                onClick={() => setEmoji(e)}
                                className={`w-7 h-7 rounded text-sm flex items-center justify-center transition-all ${emoji === e ? "bg-amber-500/30 ring-1 ring-amber-400" : "bg-white/5 hover:bg-white/10"}`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image upload */}
            <div className="mb-3">
                <label className="mb-1 block text-xs text-white/50">
                    Imagen <span className="text-white/30">(opcional, PNG transparente recomendado)</span>
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-2 text-xs text-white/50 hover:border-white/30 transition-colors"
                    >
                        {preview ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    {preview && (
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-white/20">
                            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-forest-500 py-2 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
            >
                {saving ? "Guardando..." : "Agregar Elemento"}
            </button>
        </form>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  ELEMENT LIST ITEM  ════════════════ */
/* ═══════════════════════════════════════════ */

function ElementListItem({
    element,
    isActive,
    onSelect,
    onDelete,
}: {
    element: OtomiElement;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`¿Eliminar "${element.spanish_word}"?`)) return;
        setDeleting(true);
        const success = await deleteOtomiElement(element.id);
        if (success) onDelete(element.id);
        setDeleting(false);
    };

    return (
        <div
            className={`group flex items-center gap-2 rounded-lg p-2 transition-all cursor-pointer ${isActive
                ? "border border-amber-400/50 bg-amber-500/10"
                : "border border-white/10 bg-white/5 hover:border-white/20"
                }`}
            onClick={() => onSelect(element.id)}
        >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                {element.image_url ? (
                    <Image
                        src={element.image_url}
                        alt={element.spanish_word}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                        unoptimized
                    />
                ) : (
                    <span className="text-sm">{element.emoji}</span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-amber-400 truncate">{element.otomi_word}</p>
                <p className="text-xs text-white/50 truncate">{element.spanish_word}</p>
            </div>
            <span className="text-[10px] text-white/30 shrink-0">
                ({element.position_x},{element.position_y})
            </span>
            <div onClick={(e) => e.stopPropagation()}>
                <DeleteBtn deleting={deleting} onClick={handleDelete} small />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  ADD SCENARIO FORM  ════════════════ */
/* ═══════════════════════════════════════════ */

function AddScenarioForm({ onScenarioAdded, onPendingFileChange }: { onScenarioAdded: () => void; onPendingFileChange?: (bytes: number) => void }) {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [bgGradient, setBgGradient] = useState(GRADIENT_PRESETS[0].value);
    const [bgEmoji, setBgEmoji] = useState("🌿");
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const bgInputRef = useRef<HTMLInputElement>(null);

    const handleBgFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setBgFile(f);
            setBgPreview(URL.createObjectURL(f));
            onPendingFileChange?.(f.size);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let bgImageUrl: string | null = null;

            if (bgFile) {
                bgImageUrl = await uploadOtomiScenarioBgImage(bgFile);
                if (!bgImageUrl) {
                    setError("Error al subir la imagen de fondo.");
                    setSaving(false);
                    return;
                }
            }

            const result = await addOtomiScenario({
                title,
                subtitle,
                bg_gradient: bgGradient,
                bg_image_url: bgImageUrl,
                bg_emoji: bgEmoji,
            });

            if (!result) {
                setError("Error al crear el escenario.");
                setSaving(false);
                return;
            }

            setTitle("");
            setSubtitle("");
            setBgGradient(GRADIENT_PRESETS[0].value);
            setBgEmoji("🌿");
            setBgFile(null);
            setBgPreview(null);
            setIsOpen(false);
            setSaving(false);
            onPendingFileChange?.(0);
            onScenarioAdded();
        } catch {
            setError("Error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full rounded-xl border-2 border-dashed border-white/15 py-4 text-sm text-white/40 font-medium hover:border-white/30 hover:text-white/60 transition-all"
            >
                + Agregar Escenario
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="font-heading text-sm font-bold text-white mb-3">Nuevo Escenario</h4>

            <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                    <label className="mb-1 block text-xs text-white/50">Título (Otomí)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ra Ngu"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-white/50">Subtítulo (Español)</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="La Familia"
                        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-forest-400"
                        required
                    />
                </div>
            </div>

            {/* Gradient picker */}
            <div className="mb-3">
                <label className="mb-1 block text-xs text-white/50">Fondo del escenario</label>
                <div className="grid grid-cols-3 gap-2">
                    {GRADIENT_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => setBgGradient(preset.value)}
                            className={`rounded-lg p-1 transition-all ${bgGradient === preset.value ? "ring-2 ring-amber-400" : "ring-1 ring-white/10"}`}
                        >
                            <div
                                className="h-8 rounded-md"
                                style={{ background: preset.value }}
                            />
                            <span className="text-[10px] text-white/50 mt-0.5 block">{preset.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Emoji picker */}
            <div className="mb-3">
                <label className="mb-1 block text-xs text-white/50">Emoji decorativo</label>
                <div className="flex gap-1.5">
                    {EMOJI_OPTIONS.map((e) => (
                        <button
                            key={e}
                            type="button"
                            onClick={() => setBgEmoji(e)}
                            className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${bgEmoji === e ? "bg-amber-500/30 ring-1 ring-amber-400" : "bg-white/5 hover:bg-white/10"}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            {/* Background image upload */}
            <div className="mb-3">
                <label className="mb-1 block text-xs text-white/50">
                    Imagen de fondo <span className="text-white/30">(opcional, reemplaza el gradiente)</span>
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => bgInputRef.current?.click()}
                        className="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-2 text-xs text-white/50 hover:border-white/30 transition-colors"
                    >
                        {bgPreview ? "Cambiar imagen" : "Seleccionar imagen"}
                    </button>
                    <input
                        ref={bgInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBgFileSelect}
                    />
                    {bgPreview && (
                        <div className="relative h-10 w-20 rounded-lg overflow-hidden border border-white/20">
                            <Image src={bgPreview} alt="Preview fondo" fill className="object-cover" unoptimized />
                        </div>
                    )}
                    {bgPreview && (
                        <button
                            type="button"
                            onClick={() => { setBgFile(null); setBgPreview(null); }}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                            Quitar
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg border border-white/15 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-lg bg-forest-500 py-2 text-sm font-semibold text-white transition-all hover:bg-forest-400 disabled:opacity-50"
                >
                    {saving ? "Guardando..." : "Crear"}
                </button>
            </div>
        </form>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  SCENARIO EDITOR (right panel)  ════ */
/* ═══════════════════════════════════════════ */

function ScenarioEditor({
    scenario,
    onUpdate,
    onPendingFileChange,
}: {
    scenario: OtomiScenario;
    onUpdate: () => void;
    onPendingFileChange?: (bytes: number) => void;
}) {
    const [elements, setElements] = useState<OtomiElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeElementId, setActiveElementId] = useState<string | null>(null);

    const fetchElements = useCallback(async () => {
        setLoading(true);
        const data = await getOtomiElements(scenario.id);
        setElements(data);
        setLoading(false);
    }, [scenario.id]);

    useEffect(() => {
        fetchElements();
        setActiveElementId(null);
    }, [fetchElements]);

    const handlePositionClick = async (x: number, y: number) => {
        if (!activeElementId) return;
        const success = await updateOtomiElement(activeElementId, {
            position_x: x,
            position_y: y,
        });
        if (success) {
            setElements((prev) =>
                prev.map((el) =>
                    el.id === activeElementId ? { ...el, position_x: x, position_y: y } : el
                )
            );
        }
    };

    const handleDeleteElement = (id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
        if (activeElementId === id) setActiveElementId(null);
    };

    return (
        <div>
            {/* Scenario header */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{scenario.bg_emoji}</span>
                <div>
                    <h3 className="font-heading text-lg font-bold text-amber-400">{scenario.title}</h3>
                    <p className="text-sm text-white/50">{scenario.subtitle}</p>
                </div>
                <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                    {elements.length} {elements.length === 1 ? "elemento" : "elementos"}
                </span>
            </div>

            {/* Position Grid */}
            <div className="mb-4">
                <PositionGrid
                    elements={elements}
                    activeElementId={activeElementId}
                    bgGradient={scenario.bg_gradient}
                    bgImageUrl={scenario.bg_image_url}
                    onPositionClick={handlePositionClick}
                />
            </div>

            {/* Elements List */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/70 mb-2">Elementos</h4>
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-lg border border-white/10 bg-white/5 p-2 h-12" />
                        ))}
                    </div>
                ) : elements.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/15 p-4 text-center">
                        <p className="text-xs text-white/40">
                            No hay elementos. ¡Agrega el primero!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {elements.map((el) => (
                            <ElementListItem
                                key={el.id}
                                element={el}
                                isActive={el.id === activeElementId}
                                onSelect={setActiveElementId}
                                onDelete={handleDeleteElement}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Element Form */}
            <AddElementForm scenarioId={scenario.id} onElementAdded={fetchElements} onPendingFileChange={onPendingFileChange} />
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* ═══  MAIN PANEL  ═══════════════════════ */
/* ═══════════════════════════════════════════ */

export default function EscenariosPanel() {
    const [scenarios, setScenarios] = useState<OtomiScenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [pendingFileSize, setPendingFileSize] = useState(0);

    const fetchScenarios = useCallback(async () => {
        setLoading(true);
        const data = await getOtomiScenarios();
        setScenarios(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchScenarios();
    }, [fetchScenarios]);

    const selectedScenario = scenarios.find((s) => s.id === selectedId) ?? null;

    const handleDeleteScenario = async (id: string) => {
        if (!confirm("¿Eliminar este escenario y todos sus elementos?")) return;
        const success = await deleteOtomiScenario(id);
        if (success) {
            setScenarios((prev) => prev.filter((s) => s.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    return (
        <div>
            {/* Storage preview bar */}
            <div className="mb-6">
                <StoragePreviewBar pendingBytes={pendingFileSize} />
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                {/* Left: Scenario List */}
                <div className="lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-heading text-lg font-bold text-white">Escenarios</h2>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                            {scenarios.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-4 h-20" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2 mb-4">
                            {scenarios.map((scenario) => (
                                <div
                                    key={scenario.id}
                                    onClick={() => setSelectedId(scenario.id)}
                                    className={`group flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all ${selectedId === scenario.id
                                        ? "border border-forest-500/50 bg-forest-500/10"
                                        : "border border-white/10 bg-white/5 hover:border-white/20"
                                        }`}
                                >
                                    {/* Mini preview */}
                                    <div
                                        className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl overflow-hidden relative"
                                        style={{ background: scenario.bg_gradient }}
                                    >
                                        {scenario.bg_image_url ? (
                                            <Image
                                                src={scenario.bg_image_url}
                                                alt={scenario.subtitle}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            scenario.bg_emoji
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-semibold text-white truncate">{scenario.title}</h4>
                                        <p className="text-xs text-white/40 truncate">{scenario.subtitle}</p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <DeleteBtn
                                            deleting={false}
                                            onClick={() => handleDeleteScenario(scenario.id)}
                                            small
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <AddScenarioForm onScenarioAdded={fetchScenarios} onPendingFileChange={setPendingFileSize} />
                </div>

                {/* Right: Scenario Editor */}
                <div className="lg:col-span-3">
                    {selectedScenario ? (
                        <ScenarioEditor
                            key={selectedScenario.id}
                            scenario={selectedScenario}
                            onUpdate={fetchScenarios}
                            onPendingFileChange={setPendingFileSize}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-12 text-center">
                            <span className="text-4xl mb-3">🌿</span>
                            <p className="text-sm text-white/40 font-medium">
                                Selecciona un escenario para editarlo
                            </p>
                            <p className="text-xs text-white/25 mt-1">
                                O crea uno nuevo con el botón de la izquierda
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
