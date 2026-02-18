"use client";

import { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import { getHighlightCards, type HighlightCard } from "@/lib/supabase";

/* ─── Fallback data used when Supabase is not configured ─── */
const fallbackRaices = [
    {
        id: "f-1",
        section: "raices" as const,
        image_url: "/images/lengua.png",
        title: "Lengua Hñähñu",
        description:
            "Preservamos la lengua Otomí a través de talleres, materiales educativos y programas intergeneracionales.",
        display_order: 1,
        created_at: "",
    },
    {
        id: "f-2",
        section: "raices" as const,
        image_url: "/images/gastronomia.png",
        title: "Gastronomía Ancestral",
        description:
            "La cocina Otomí refleja siglos de sabiduría: ingredientes locales, técnicas prehispánicas y sabores únicos.",
        display_order: 2,
        created_at: "",
    },
    {
        id: "f-3",
        section: "raices" as const,
        image_url: "/images/medicina.png",
        title: "Medicina Tradicional",
        description:
            "Herbolaria y conocimientos medicinales transmitidos de generación en generación para el bienestar comunitario.",
        display_order: 3,
        created_at: "",
    },
];

const fallbackPreservacion = [
    {
        id: "f-4",
        section: "preservacion" as const,
        image_url: "/images/hongos.png",
        title: "Biodiversidad: Hongos",
        description:
            "Documentamos y protegemos la extraordinaria diversidad de hongos del bosque de niebla.",
        display_order: 1,
        created_at: "",
    },
    {
        id: "f-5",
        section: "preservacion" as const,
        image_url: "/images/reforestacion.png",
        title: "Reforestación",
        description:
            "Programas activos de reforestación con árboles nativos para restaurar los ecosistemas.",
        display_order: 2,
        created_at: "",
    },
    {
        id: "f-6",
        section: "preservacion" as const,
        image_url: "/images/agua.png",
        title: "Conservación del Agua",
        description:
            "Protegemos los manantiales, ríos y el embalse natural que abastecen a toda la región.",
        display_order: 3,
        created_at: "",
    },
];

/* ─── Skeleton loader ─── */
function CardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="h-56 bg-forest-100" />
            <div className="p-6">
                <div className="mb-3 h-5 w-3/4 rounded bg-forest-100" />
                <div className="h-3 w-full rounded bg-forest-50" />
                <div className="mt-2 h-3 w-5/6 rounded bg-forest-50" />
            </div>
        </div>
    );
}

/* ─── Section renderer ─── */
function HighlightSection({
    id,
    bgClass,
    label,
    labelColor,
    titlePrefix,
    titleHighlight,
    titleGradient,
    subtitle,
    borderGradient,
    cards,
    loading,
    tagLabel,
    tagColor,
}: {
    id: string;
    bgClass: string;
    label: string;
    labelColor: string;
    titlePrefix: string;
    titleHighlight: string;
    titleGradient: string;
    subtitle: string;
    borderGradient: string;
    cards: HighlightCard[];
    loading: boolean;
    tagLabel: string;
    tagColor: string;
}) {
    return (
        <section id={id} className={`relative ${bgClass} py-24`}>
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${borderGradient}`}
            />
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span
                        className={`mb-3 inline-block text-sm font-semibold tracking-widest ${labelColor} uppercase`}
                    >
                        {label}
                    </span>
                    <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                        {titlePrefix}{" "}
                        <span
                            className={`bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
                        >
                            {titleHighlight}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-charcoal/60">{subtitle}</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))
                        : cards.map((card) => (
                            <SectionCard
                                key={card.id}
                                image={card.image_url}
                                title={card.title}
                                description={card.description}
                                tag={tagLabel}
                                tagColor={tagColor}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Main Component ─── */
export default function Highlights() {
    const [raices, setRaices] = useState<HighlightCard[]>([]);
    const [preservacion, setPreservacion] = useState<HighlightCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCards() {
            try {
                const [r, p] = await Promise.all([
                    getHighlightCards("raices"),
                    getHighlightCards("preservacion"),
                ]);

                setRaices(r.length > 0 ? r : fallbackRaices);
                setPreservacion(p.length > 0 ? p : fallbackPreservacion);
            } catch {
                // Supabase not configured — use fallbacks
                setRaices(fallbackRaices);
                setPreservacion(fallbackPreservacion);
            } finally {
                setLoading(false);
            }
        }

        fetchCards();
    }, []);

    return (
        <>
            <HighlightSection
                id="raices"
                bgClass="bg-warm-gray"
                label="Nuestras Raíces"
                labelColor="text-earth-600"
                titlePrefix="Cultura"
                titleHighlight="Viva"
                titleGradient="from-earth-500 to-earth-700"
                subtitle="Las tradiciones Otomíes son el corazón de nuestra identidad. Trabajamos para que su lengua, gastronomía y medicina continúen floreciendo."
                borderGradient="from-transparent via-earth-300/40 to-transparent"
                cards={raices}
                loading={loading}
                tagLabel="Raíces"
                tagColor="bg-earth-500"
            />
            <HighlightSection
                id="preservacion"
                bgClass="bg-cream"
                label="Preservación"
                labelColor="text-water-600"
                titlePrefix="Protegiendo Nuestro"
                titleHighlight="Ecosistema"
                titleGradient="from-water-500 to-forest-600"
                subtitle="Cada acción cuenta. Desde la reforestación hasta la conservación del agua, trabajamos para garantizar un futuro sustentable."
                borderGradient="from-transparent via-water-400/40 to-transparent"
                cards={preservacion}
                loading={loading}
                tagLabel="Preservación"
                tagColor="bg-water-600"
            />
        </>
    );
}
