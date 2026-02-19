"use client";

import { useEffect, useState } from "react";
import { getEvents, type Event } from "@/lib/supabase";

/* ─── Category config ─── */
const CATEGORIES = [
    { value: "ecoturismo", label: "Ecoturismo", color: "from-forest-500 to-forest-700", bg: "bg-forest-50", text: "text-forest-700" },
    { value: "cultura", label: "Cultura", color: "from-earth-500 to-earth-700", bg: "bg-earth-50", text: "text-earth-700" },
    { value: "talleres", label: "Talleres", color: "from-amber-500 to-amber-700", bg: "bg-amber-50", text: "text-amber-700" },
    { value: "activismo", label: "Activismo", color: "from-water-500 to-water-700", bg: "bg-water-50", text: "text-water-700" },
];

function getCategoryStyle(category: string) {
    return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
}

/* ─── Fallback mock events ─── */
const fallbackEvents: Event[] = [
    {
        id: "1",
        title: "Senderismo en la Reserva",
        description: "Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.",
        date: "2026-03-15T09:00:00-06:00",
        category: "ecoturismo",
        tags: ["senderismo", "avistamientos"],
        image_url: null,
        created_at: "",
    },
    {
        id: "2",
        title: "Taller de Lengua Otomí",
        description: "Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.",
        date: "2026-03-22T10:00:00-06:00",
        category: "cultura",
        tags: ["lengua", "comunidad"],
        image_url: null,
        created_at: "",
    },
    {
        id: "3",
        title: "Jornada de Reforestación",
        description: "Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.",
        date: "2026-04-05T08:00:00-06:00",
        category: "activismo",
        tags: ["reforestación", "voluntariado"],
        image_url: null,
        created_at: "",
    },
    {
        id: "4",
        title: "Taller de Medicina Tradicional",
        description: "Conoce las plantas medicinales de la región y sus usos ancestrales.",
        date: "2026-04-12T11:00:00-06:00",
        category: "talleres",
        tags: ["medicina", "herbolaria"],
        image_url: null,
        created_at: "",
    },
];

/* ─── Skeleton ─── */
function EventSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="h-20 bg-white/5" />
            <div className="p-5">
                <div className="mb-3 h-5 w-20 rounded-full bg-white/10" />
                <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
            </div>
        </div>
    );
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date
        .toLocaleDateString("es-MX", { month: "short" })
        .toUpperCase();
    return { day, month };
}

export default function Eventos() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getEvents();
                setEvents(data.length > 0 ? data : fallbackEvents);
            } catch {
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const filteredEvents = activeFilter
        ? events.filter((e) => e.category === activeFilter)
        : events;

    return (
        <section id="eventos" className="relative bg-forest-950 py-24">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.3),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.2),transparent_50%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-forest-400 uppercase">
                        Calendario
                    </span>
                    <h2 className="font-heading mb-4 text-4xl font-bold text-white md:text-5xl">
                        Próximos{" "}
                        <span className="bg-gradient-to-r from-forest-400 to-water-400 bg-clip-text text-transparent">
                            Eventos
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-white/60">
                        Únete a nuestras actividades de ecoturismo, cultura, talleres y
                        activismo. Cada evento es una oportunidad para conectar con la
                        naturaleza y la comunidad.
                    </p>
                </div>

                {/* Category filters */}
                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setActiveFilter(null)}
                        className={`rounded-full px-5 py-2 text-sm font-medium backdrop-blur-sm transition-all ${activeFilter === null
                                ? "bg-forest-500 text-white shadow-lg shadow-forest-500/20"
                                : "border border-white/15 bg-white/5 text-white/80 hover:border-forest-400/50 hover:bg-forest-400/10 hover:text-white"
                            }`}
                    >
                        Todos
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() =>
                                setActiveFilter(
                                    activeFilter === cat.value ? null : cat.value
                                )
                            }
                            className={`rounded-full px-5 py-2 text-sm font-medium backdrop-blur-sm transition-all ${activeFilter === cat.value
                                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                    : "border border-white/15 bg-white/5 text-white/80 hover:border-forest-400/50 hover:bg-forest-400/10 hover:text-white"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Event Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <EventSkeleton key={i} />
                        ))
                        : filteredEvents.length === 0
                            ? (
                                <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-12 text-center">
                                    <p className="text-white/40">
                                        No hay eventos en esta categoría.
                                    </p>
                                </div>
                            )
                            : filteredEvents.map((event) => {
                                const { day, month } = formatDate(event.date);
                                const style = getCategoryStyle(event.category);
                                return (
                                    <div
                                        key={event.id}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                                    >
                                        {/* Date Badge */}
                                        <div
                                            className={`bg-gradient-to-br ${style.color} p-4 text-center`}
                                        >
                                            <div className="text-3xl font-bold text-white">
                                                {day}
                                            </div>
                                            <div className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                                                {month}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            {/* Category tag */}
                                            <span
                                                className={`${style.bg} ${style.text} mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold`}
                                            >
                                                {style.label}
                                            </span>

                                            <h3 className="font-heading mb-2 text-lg font-bold text-white">
                                                {event.title}
                                            </h3>
                                            <p className="mb-4 text-sm leading-relaxed text-white/55">
                                                {event.description}
                                            </p>

                                            {/* Tags */}
                                            {event.tags && event.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {event.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/50"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover glow */}
                                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-5`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                </div>
            </div>
        </section>
    );
}
