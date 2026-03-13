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
        short_description:
            "Preservamos la lengua Otomí a través de talleres y programas intergeneracionales.",
        long_description:
            "Preservamos la lengua Otomí a través de talleres, materiales educativos y programas intergeneracionales que conectan a las nuevas generaciones con sus raíces lingüísticas.",
        display_order: 1,
        category: "cultura",
        created_at: "",
    },
    {
        id: "f-2",
        section: "raices" as const,
        image_url: "/images/gastronomia.png",
        title: "Gastronomía Ancestral",
        short_description:
            "Ingredientes locales, técnicas prehispánicas y sabores únicos de la cocina Otomí.",
        long_description:
            "La cocina Otomí refleja siglos de sabiduría: ingredientes locales, técnicas prehispánicas y sabores únicos que son parte fundamental de nuestra identidad cultural.",
        display_order: 2,
        category: "cultura",
        created_at: "",
    },
    {
        id: "f-3",
        section: "raices" as const,
        image_url: "/images/medicina.png",
        title: "Medicina Tradicional",
        short_description:
            "Herbolaria y conocimientos medicinales transmitidos de generación en generación.",
        long_description:
            "Herbolaria y conocimientos medicinales transmitidos de generación en generación para el bienestar comunitario, preservando el saber ancestral de nuestros pueblos.",
        display_order: 3,
        category: "talleres",
        created_at: "",
    },
];

const fallbackPreservacion = [
    {
        id: "f-4",
        section: "preservacion" as const,
        image_url: "/images/hongos.png",
        title: "Biodiversidad: Hongos",
        short_description:
            "Documentamos la extraordinaria diversidad de hongos del bosque de niebla.",
        long_description:
            "Documentamos y protegemos la extraordinaria diversidad de hongos del bosque de niebla, un ecosistema único que alberga especies endémicas de gran valor ecológico.",
        display_order: 1,
        category: "naturaleza",
        created_at: "",
    },
    {
        id: "f-5",
        section: "preservacion" as const,
        image_url: "/images/reforestacion.png",
        title: "Reforestación",
        short_description:
            "Programas de reforestación con árboles nativos para restaurar ecosistemas.",
        long_description:
            "Programas activos de reforestación con árboles nativos para restaurar los ecosistemas degradados y garantizar la biodiversidad de la región.",
        display_order: 2,
        category: "naturaleza",
        created_at: "",
    },
    {
        id: "f-6",
        section: "preservacion" as const,
        image_url: "/images/agua.png",
        title: "Conservación del Agua",
        short_description:
            "Protegemos los manantiales y ríos que abastecen a toda la región.",
        long_description:
            "Protegemos los manantiales, ríos y el embalse natural que abastecen a toda la región, asegurando el acceso al agua para las generaciones futuras.",
        display_order: 3,
        category: "naturaleza",
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
    youtubeVideoId,
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
    youtubeVideoId?: string;
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

                {youtubeVideoId && (
                    <div className="mx-auto mb-16 w-full max-w-4xl">
                        <div className="overflow-hidden rounded-2xl border border-forest-100 shadow-lg" style={{ aspectRatio: '16/9' }}>
                            <iframe
                                title="Video de la Reserva Ecológica Otomí"
                                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}

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
                                shortDescription={card.short_description}
                                longDescription={card.long_description}
                                tag={tagLabel}
                                tagColor={tagColor}
                                category={card.category}
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
                subtitle="Las tradiciones otomíes son el corazón de nuestra identidad. Trabajamos para que nuestra historia, lengua y gastronomía continúen floreciendo."
                borderGradient="from-transparent via-earth-300/40 to-transparent"
                cards={raices}
                loading={loading}
                tagLabel="Raíces"
                tagColor="bg-earth-500"
                youtubeVideoId="OHNnaI9dcAQ"
            />
            <HighlightSection
                id="preservacion"
                bgClass="bg-cream"
                label="Preservación"
                labelColor="text-water-600"
                titlePrefix="Nuestro compromiso con la"
                titleHighlight="casa común"
                titleGradient="from-water-500 to-forest-600"
                subtitle="Buscamos regresarle a la tierra un poco de lo que ella nos ha regalado, a través de la preservación de los recursos naturales."
                borderGradient="from-transparent via-water-400/40 to-transparent"
                cards={preservacion}
                loading={loading}
                tagLabel="Preservación"
                tagColor="bg-water-600"
            />
        </>
    );
}
