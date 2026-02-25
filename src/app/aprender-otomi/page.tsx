"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { scenarios as staticScenarios } from "./data/scenarios";
import type { ScenarioElement } from "./data/scenarios";
import ScenarioScene from "./components/ScenarioScene";
import VocabularyPopup from "./components/VocabularyPopup";
import ScenarioSelector from "./components/ScenarioSelector";
import {
    getOtomiScenarios,
    getOtomiElements,
    type OtomiScenario,
    type OtomiElement,
} from "@/lib/supabase";

/* ─── Transform DB records into the shape our components expect ─── */

interface DisplayScenario {
    id: string;
    title: string;
    subtitle: string;
    bgGradient: string;
    bgImageUrl?: string;
    bgEmoji: string;
    elements: ScenarioElement[];
}

function dbToDisplay(
    scenario: OtomiScenario,
    elements: OtomiElement[]
): DisplayScenario {
    return {
        id: scenario.id,
        title: scenario.title,
        subtitle: scenario.subtitle,
        bgGradient: scenario.bg_gradient,
        bgImageUrl: scenario.bg_image_url ?? undefined,
        bgEmoji: scenario.bg_emoji,
        elements: elements.map((el) => ({
            id: el.id,
            otomiWord: el.otomi_word,
            spanishWord: el.spanish_word,
            emoji: el.image_url
                ? el.emoji // Emoji is kept but image_url takes priority in the component
                : el.emoji,
            imageUrl: el.image_url ?? undefined,
            position: { x: el.position_x, y: el.position_y },
        })),
    };
}

function staticToDisplay(): DisplayScenario[] {
    return staticScenarios.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        bgGradient: s.bgGradient,
        bgEmoji: s.bgEmoji,
        elements: s.elements,
    }));
}

export default function AprenderOtomiPage() {
    const [scenarios, setScenarios] = useState<DisplayScenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
    const [selectedElement, setSelectedElement] =
        useState<ScenarioElement | null>(null);

    // Fetch from Supabase, fall back to static data
    useEffect(() => {
        async function load() {
            try {
                const dbScenarios = await getOtomiScenarios();
                if (dbScenarios.length > 0) {
                    const all = await Promise.all(
                        dbScenarios.map(async (s) => {
                            const elements = await getOtomiElements(s.id);
                            return dbToDisplay(s, elements);
                        })
                    );
                    setScenarios(all);
                } else {
                    setScenarios(staticToDisplay());
                }
            } catch {
                setScenarios(staticToDisplay());
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const activeScenario = scenarios[activeScenarioIndex] ?? null;

    const handleElementClick = useCallback((element: ScenarioElement) => {
        setSelectedElement(element);
    }, []);

    const handleClosePopup = useCallback(() => {
        setSelectedElement(null);
    }, []);

    const handleNavigateElement = useCallback((element: ScenarioElement) => {
        setSelectedElement(element);
    }, []);

    const handleScenarioChange = useCallback((index: number) => {
        setActiveScenarioIndex(index);
        setSelectedElement(null);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-forest-950">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50 text-sm">Cargando escenarios...</p>
                </div>
            </div>
        );
    }

    if (!activeScenario || scenarios.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-forest-950 px-4">
                <span className="text-5xl mb-4">🌿</span>
                <h1 className="font-heading text-2xl font-bold text-white mb-2">
                    Aprende Otomí
                </h1>
                <p className="text-white/50 text-sm mb-6 text-center">
                    Aún no hay escenarios disponibles. ¡Pronto agregaremos contenido!
                </p>
                <Link
                    href="/"
                    className="text-sm text-forest-400 hover:text-forest-300 transition-colors"
                >
                    ← Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-screen bg-charcoal overflow-hidden">
            {/* Top Header Bar */}
            <header className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-forest-950/95 backdrop-blur-md shadow-lg">
                {/* Back link */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="hidden sm:inline">Volver al inicio</span>
                </Link>

                {/* Title */}
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <h1 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                        <span className="text-forest-400">Aprende</span> Otomí
                    </h1>
                </div>

                {/* Scenario info - right side */}
                <div className="text-right">
                    <p className="text-xs text-white/50 font-medium">
                        {activeScenario.elements.length} palabras
                    </p>
                </div>
            </header>

            {/* Scenario Title Bar */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-forest-900/80 to-earth-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeScenario.bgEmoji}</span>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-amber-400 tracking-wide">
                            {activeScenario.title}
                        </h2>
                        <p className="text-sm text-white/70">
                            {activeScenario.subtitle}
                        </p>
                    </div>
                </div>

                {/* Scenario Selector */}
                <ScenarioSelector
                    scenarios={scenarios.map((s) => ({
                        id: s.id,
                        title: s.title,
                        subtitle: s.subtitle,
                        bgGradient: s.bgGradient,
                        bgEmoji: s.bgEmoji,
                        elements: s.elements,
                    }))}
                    activeIndex={activeScenarioIndex}
                    onSelect={handleScenarioChange}
                />
            </div>

            {/* Instruction hint */}
            <div className="relative z-20 flex justify-center py-2 pointer-events-none">
                <div className="px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/60 font-medium animate-fade-in">
                    👆 Toca un elemento para aprender su nombre en Otomí
                </div>
            </div>

            {/* Scenario Scene */}
            <div className="flex-1 relative z-10">
                <ScenarioScene
                    bgGradient={activeScenario.bgGradient}
                    bgImageUrl={activeScenario.bgImageUrl}
                    bgEmoji={activeScenario.bgEmoji}
                    elements={activeScenario.elements}
                    onElementClick={handleElementClick}
                />
            </div>

            {/* Vocabulary Popup */}
            {selectedElement && (
                <VocabularyPopup
                    element={selectedElement}
                    allElements={activeScenario.elements}
                    onClose={handleClosePopup}
                    onNavigate={handleNavigateElement}
                />
            )}
        </div>
    );
}
