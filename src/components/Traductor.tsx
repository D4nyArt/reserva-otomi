"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Direction = "ES_TO_OT" | "OT_TO_ES";

type Entry = {
    es: string;
    ot: string[];
};

const DICT_URL = "/es-oto.txt";
const MAX_SUGGESTIONS = 8;

function stripAccents(s: string) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normKey(s: string) {
    return stripAccents(s.trim().toLowerCase());
}

function parseDictionary(raw: string): Entry[] {
    const lines = raw.split(/\r?\n/);
    const entries: Entry[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const idx = trimmed.indexOf(":");
        if (idx === -1) continue;

        const left = trimmed.slice(0, idx).trim();
        const right = trimmed.slice(idx + 1).trim();

        if (!left || !right) continue;

        const otVariants = right
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);

        if (otVariants.length === 0) continue;
        entries.push({ es: left, ot: otVariants });
    }

    return entries;
}

async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // continue to fallback
    }

    // Fallback: execCommand
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

export default function Traductor() {
    const [direction, setDirection] = useState<Direction>("ES_TO_OT");
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Autocomplete UI state
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Copy feedback
    const [copyStatus, setCopyStatus] = useState<null | "ok" | "fail">(null);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(DICT_URL);
                if (!res.ok) throw new Error(`No se pudo cargar el diccionario (${res.status})`);

                const text = await res.text();
                const parsed = parseDictionary(text);

                if (alive) setEntries(parsed);
            } catch (e: any) {
                if (alive) setError(e?.message ?? "Error cargando diccionario");
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const { esToOtMap, otToEsMap, esKeys, otKeys } = useMemo(() => {
        const esMap = new Map<string, string[]>();
        const otMap = new Map<string, string[]>();

        for (const e of entries) {
            const esKey = normKey(e.es);
            const currentEs = esMap.get(esKey) ?? [];
            esMap.set(esKey, Array.from(new Set([...currentEs, ...e.ot])));

            for (const ot of e.ot) {
                const otKey = normKey(ot);
                const currentOt = otMap.get(otKey) ?? [];
                otMap.set(otKey, Array.from(new Set([...currentOt, e.es])));
            }
        }

        const esK = Array.from(esMap.keys()).sort();
        const otK = Array.from(otMap.keys()).sort();

        return { esToOtMap: esMap, otToEsMap: otMap, esKeys: esK, otKeys: otK };
    }, [entries]);

    const exactResult = useMemo(() => {
        const q = normKey(query);
        if (!q) return null;

        if (direction === "ES_TO_OT") {
            const exact = esToOtMap.get(q);
            if (exact) return { from: q, to: exact };
        } else {
            const exact = otToEsMap.get(q);
            if (exact) return { from: q, to: exact };
        }

        return null;
    }, [query, direction, esToOtMap, otToEsMap]);

    const suggestions = useMemo(() => {
        const q = normKey(query);
        if (!q) return [];

        const keys = direction === "ES_TO_OT" ? esKeys : otKeys;

        const starts: string[] = [];
        const contains: string[] = [];

        for (const k of keys) {
            if (k.startsWith(q)) starts.push(k);
            else if (k.includes(q)) contains.push(k);

            if (starts.length + contains.length >= MAX_SUGGESTIONS) break;
        }

        return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
    }, [query, direction, esKeys, otKeys]);

    const results = useMemo(() => {
        const q = normKey(query);
        if (!q) return [];

        // 1) exacto
        if (direction === "ES_TO_OT") {
            const exact = esToOtMap.get(q);
            if (exact) return [{ from: q, to: exact }];
        } else {
            const exact = otToEsMap.get(q);
            if (exact) return [{ from: q, to: exact }];
        }

        // 2) top suggestions -> mostrar su traducción
        const out: Array<{ from: string; to: string[] }> = [];

        for (const s of suggestions) {
            if (direction === "ES_TO_OT") {
                const v = esToOtMap.get(s);
                if (v) out.push({ from: s, to: v });
            } else {
                const v = otToEsMap.get(s);
                if (v) out.push({ from: s, to: v });
            }
        }

        return out;
    }, [query, direction, esToOtMap, otToEsMap, suggestions]);

    function swapDirection() {
        setDirection((d) => (d === "ES_TO_OT" ? "OT_TO_ES" : "ES_TO_OT"));
        setQuery("");
        setIsOpen(false);
        setActiveIndex(-1);
        setCopyStatus(null);
        // reenfocar
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function applySuggestion(value: string) {
        setQuery(value);
        setIsOpen(false);
        setActiveIndex(-1);
        setCopyStatus(null);
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    async function handleCopy(text: string) {
        const ok = await copyToClipboard(text);
        setCopyStatus(ok ? "ok" : "fail");
        setTimeout(() => setCopyStatus(null), 1500);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            if (suggestions.length > 0) setIsOpen(true);
            return;
        }

        if (!isOpen) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => {
                const next = prev + 1;
                return next >= suggestions.length ? 0 : next;
            });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => {
                const next = prev - 1;
                return next < 0 ? suggestions.length - 1 : next;
            });
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                e.preventDefault();
                applySuggestion(suggestions[activeIndex]);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    }

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function onDocMouseDown(ev: MouseEvent) {
            const t = ev.target as Node;
            if (!t) return;

            const inInput = inputRef.current?.contains(t);
            const inDrop = dropdownRef.current?.contains(t);
            if (!inInput && !inDrop) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        }

        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    const placeholder =
        direction === "ES_TO_OT"
            ? "Ej. agua, diccionario, desierto..."
            : "Ej. dehe, pünts’a noya...";

    return (
        <section className="mx-auto max-w-4xl px-6 py-12">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-forest-950">Traductor Español ↔ Otomí</h1>
                <p className="mt-2 text-sm text-charcoal/70">
                    Busca una palabra y obtén su contraparte. Incluye autocompletado y copiar traducción.
                </p>
            </div>

            <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="relative flex-1">
                        <label className="mb-2 block text-xs font-semibold tracking-widest text-forest-600 uppercase">
                            {direction === "ES_TO_OT" ? "Español → Otomí" : "Otomí → Español"}
                        </label>

                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCopyStatus(null);
                                const next = e.target.value.trim();
                                if (next) {
                                    setIsOpen(true);
                                } else {
                                    setIsOpen(false);
                                    setActiveIndex(-1);
                                }
                            }}
                            onFocus={() => {
                                if (query.trim() && suggestions.length > 0) setIsOpen(true);
                            }}
                            onKeyDown={onKeyDown}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-forest-100 px-4 py-3 text-sm outline-none focus:border-forest-300"
                            autoComplete="off"
                        />

                        {/* Dropdown */}
                        {isOpen && suggestions.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-forest-100 bg-white shadow-lg"
                                role="listbox"
                            >
                                {suggestions.map((s, idx) => {
                                    const active = idx === activeIndex;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            onMouseDown={(e) => {
                                                // evita que el input pierda focus antes de aplicar
                                                e.preventDefault();
                                                applySuggestion(s);
                                            }}
                                            className={[
                                                "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                                                active ? "bg-warm-gray" : "bg-white",
                                            ].join(" ")}
                                        >
                                            <span className="text-forest-900">{s}</span>
                                            <span className="text-xs text-charcoal/50">Enter</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={swapDirection}
                        className="rounded-xl border border-forest-100 bg-warm-gray px-4 py-3 text-sm font-semibold text-forest-900 transition hover:opacity-90"
                        type="button"
                    >
                        Cambiar dirección
                    </button>
                </div>

                <div className="mt-6">
                    {loading && <div className="text-sm text-charcoal/60">Cargando diccionario…</div>}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error} (revisa que exista <code className="font-mono">public/es-oto.txt</code>)
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {query.trim() === "" ? (
                                <div className="text-sm text-charcoal/60">Escribe una palabra para comenzar.</div>
                            ) : results.length === 0 ? (
                                <div className="text-sm text-charcoal/60">
                                    No encontré coincidencias. Prueba con menos texto o sin acentos.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {results.map((r, idx) => {
                                        const translated = r.to.join(", ");
                                        return (
                                            <div key={`${r.from}-${idx}`} className="rounded-xl border border-forest-100 p-4">
                                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                    <div>
                                                        <div className="text-xs font-semibold tracking-widest text-forest-600 uppercase">
                                                            Resultado
                                                        </div>

                                                        <div className="mt-2 text-sm">
                                                            <span className="font-semibold text-forest-900">Entrada:</span>{" "}
                                                            <span className="text-charcoal/80">{r.from}</span>
                                                        </div>

                                                        <div className="mt-1 text-sm">
                                                            <span className="font-semibold text-forest-900">Traducción:</span>{" "}
                                                            <span className="text-charcoal/80">{translated}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(translated)}
                                                            className="rounded-xl border border-forest-100 bg-white px-3 py-2 text-xs font-semibold text-forest-900 shadow-sm transition hover:bg-warm-gray"
                                                        >
                                                            Copiar traducción
                                                        </button>

                                                        {copyStatus === "ok" && (
                                                            <span className="text-xs font-semibold text-forest-600">¡Copiado!</span>
                                                        )}
                                                        {copyStatus === "fail" && (
                                                            <span className="text-xs font-semibold text-red-600">No se pudo copiar</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}