"use client";

/** Shift midnight-UTC dates to noon so getDate() etc. stay on the correct
 *  calendar day regardless of the browser's local timezone offset.  */
function parseEventDate(dateStr: string): Date {
    const normalized = dateStr.replace("T00:00:00", "T12:00:00");
    return new Date(normalized);
}

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getEvents, type Event } from "@/lib/supabase";

/* ─── Category config ─── */
const CATEGORIES = [
    { value: "naturaleza", label: "Naturaleza", color: "from-forest-500 to-forest-700", bg: "bg-forest-50", text: "text-forest-700", dot: "bg-forest-400" },
    { value: "cultura", label: "Cultura", color: "from-earth-500 to-earth-700", bg: "bg-earth-50", text: "text-earth-700", dot: "bg-earth-400" },
    { value: "talleres", label: "Talleres", color: "from-amber-500 to-amber-700", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
];

function getCategoryStyle(category: string) {
    return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
}

/* ─── Fallback mock events ─── */
const fallbackEvents: Event[] = [
    { id: "1", title: "Senderismo en la Reserva", description: "Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.", date: "2026-03-15T09:00:00-06:00", category: "naturaleza", tags: ["senderismo", "avistamientos"], registration_link: "https://example.com/register-senderismo", image_url: null, created_at: "" },
    { id: "2", title: "Taller de Lengua Otomí", description: "Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.", date: "2026-03-22T10:00:00-06:00", category: "cultura", tags: ["lengua", "comunidad"], registration_link: null, image_url: null, created_at: "" },
    { id: "3", title: "Jornada de Reforestación", description: "Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.", date: "2026-04-05T08:00:00-06:00", category: "naturaleza", tags: ["reforestación", "voluntariado"], registration_link: "https://example.com/register-reforestacion", image_url: null, created_at: "" },
    { id: "4", title: "Taller de Medicina Tradicional", description: "Conoce las plantas medicinales de la región y sus usos ancestrales.", date: "2026-04-12T11:00:00-06:00", category: "talleres", tags: ["medicina", "herbolaria"], registration_link: null, image_url: null, created_at: "" },
];

/* ─── Helpers ─── */
function formatDate(dateStr: string) {
    const d = parseEventDate(dateStr);
    return { day: d.getDate(), month: d.toLocaleDateString("es-MX", { month: "short" }).toUpperCase() };
}

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

/* ─── Event Detail Modal ─── */
function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
    const style = getCategoryStyle(event.category);
    const dateObj = parseEventDate(event.date);
    const fullDate = dateObj.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });


    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-forest-950 shadow-2xl animate-[scale-in_0.25s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image or gradient header */}
                {event.image_url ? (
                    <div className="relative h-56 w-full">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 512px) 100vw, 512px"
                            unoptimized={event.image_url.startsWith("http")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                    </div>
                ) : (
                    <div className={`relative h-32 bg-gradient-to-br ${style.color}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent" />
                    </div>
                )}

                {/* Content */}
                <div className="relative -mt-8 px-7 pb-7">
                    {/* Category + date */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                            className={`${style.bg} ${style.text} rounded-full px-3 py-1 text-xs font-semibold`}
                        >
                            {style.label}
                        </span>
                        <span className="text-xs text-white/40">
                            {fullDate}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading mb-4 text-2xl font-bold text-white">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-5 text-sm leading-relaxed text-white/60">
                        {event.description}
                    </p>

                    {/* Tags */}
                    {event.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {event.registration_link && event.registration_link.trim() && (
                        <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-block rounded-xl bg-forest-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-400"
                        >
                            Registrarse
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Single event card ─── */
function EventCard({ event, onSelect }: { event: Event; onSelect: (e: Event) => void }) {
    const { day, month } = formatDate(event.date);
    const style = getCategoryStyle(event.category);
    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            onClick={() => onSelect(event)}
        >
            <div className={`bg-gradient-to-br ${style.color} p-4 text-center`}>
                <div className="text-3xl font-bold text-white">{day}</div>
                <div className="text-xs font-semibold tracking-wider text-white/80 uppercase">{month}</div>
            </div>
            <div className="p-5">
                <span className={`${style.bg} ${style.text} mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold`}>
                    {style.label}
                </span>
                <h3 className="font-heading mb-2 text-lg font-bold text-white">{event.title}</h3>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-white/55">{event.description}</p>
                {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/50">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {event.registration_link && event.registration_link.trim() && (
                    <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 inline-block rounded-xl bg-forest-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-400"
                    >
                        Registrarse
                    </a>
                )}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-5`} />
            </div>
        </div>
    );
}

/* ─── Full Calendar View ─── */
function CalendarView({ events, activeFilter, onSelect }: { events: Event[]; activeFilter: string | null; onSelect: (e: Event) => void }) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        // Default to the month of the first upcoming event, or current month
        const now = new Date();
        const first = events.find((e) => parseEventDate(e.date) >= now);
        return first ? new Date(parseEventDate(first.date).getFullYear(), parseEventDate(first.date).getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const monthLabel = currentMonth.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

    const prev = () => { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDay(null); };
    const next = () => { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDay(null); };

    // Group events by date-key "YYYY-MM-DD"
    const eventsByDay: Record<string, Event[]> = {};
    for (const event of events) {
        if (activeFilter && event.category !== activeFilter) continue;
        const d = parseEventDate(event.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const key = d.getDate().toString();
            eventsByDay[key] = [...(eventsByDay[key] ?? []), event];
        }
    }

    const selectedEvents = selectedDay ? (eventsByDay[selectedDay.toString()] ?? []) : [];

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* ── Month grid ── */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                {/* Nav */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={prev}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h3 className="font-heading text-lg font-bold capitalize text-white">{monthLabel}</h3>
                    <button
                        onClick={next}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                {/* Day-of-week headers */}
                <div className="mb-2 grid grid-cols-7 text-center">
                    {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                        <div key={d} className="py-1 text-xs font-semibold text-white/30 uppercase tracking-widest">{d}</div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1.5">
                    {/* Leading empty cells */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`e-${i}`} />
                    ))}
                    {/* Numbered cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = eventsByDay[day.toString()] ?? [];
                        const hasEvents = dayEvents.length > 0;
                        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                        const isSelected = selectedDay === day;

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(isSelected ? null : day)}
                                className={`relative flex flex-col items-center justify-start rounded-xl p-1.5 pt-2 transition-all min-h-[52px] ${isSelected
                                    ? "bg-forest-500/20 ring-1 ring-forest-400/60"
                                    : hasEvents
                                        ? "hover:bg-white/10 cursor-pointer"
                                        : "cursor-default opacity-60"
                                    } ${isToday ? "ring-1 ring-white/20" : ""}`}
                            >
                                <span className={`text-sm font-medium leading-none ${isToday ? "text-forest-400 font-bold" :
                                    isSelected ? "text-white font-bold" :
                                        hasEvents ? "text-white" : "text-white/30"
                                    }`}>
                                    {day}
                                </span>

                                {/* Event dots — one per category present */}
                                {hasEvents && (
                                    <div className="mt-1.5 flex flex-wrap justify-center gap-0.5">
                                        {dayEvents.slice(0, 3).map((ev) => {
                                            const catStyle = getCategoryStyle(ev.category);
                                            return (
                                                <div
                                                    key={ev.id}
                                                    className={`h-1.5 w-1.5 rounded-full ${catStyle.dot}`}
                                                    title={ev.title}
                                                />
                                            );
                                        })}
                                        {dayEvents.length > 3 && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-4">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.value} className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${cat.dot}`} />
                            <span className="text-xs text-white/40">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Day detail panel ── */}
            <div className="flex flex-col gap-4">
                {selectedDay && selectedEvents.length > 0 ? (
                    <>
                        <div className="rounded-xl border border-forest-500/20 bg-forest-500/5 px-4 py-3">
                            <p className="text-sm font-semibold text-forest-400">
                                {selectedDay} de{" "}
                                {currentMonth.toLocaleDateString("es-MX", { month: "long" })},
                                {" "}{year}
                            </p>
                            <p className="text-xs text-white/40">{selectedEvents.length} evento{selectedEvents.length > 1 ? "s" : ""}</p>
                        </div>
                        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "480px" }}>
                            {selectedEvents.map((ev) => {
                                const style = getCategoryStyle(ev.category);
                                return (
                                    <div
                                        key={ev.id}
                                        onClick={() => onSelect(ev)}
                                        className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                                    >
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className={`${style.bg} ${style.text} rounded-full px-2.5 py-0.5 text-xs font-semibold`}>
                                                {style.label}
                                            </span>
                                        </div>
                                        <h4 className="font-heading mb-1 text-sm font-bold text-white">{ev.title}</h4>
                                        <p className="mb-3 text-xs leading-relaxed text-white/50">{ev.description}</p>
                                        {ev.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {ev.tags.map((tag) => (
                                                    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-10 text-center">
                        <div className="mb-3 text-4xl">📅</div>
                        <p className="text-sm text-white/40">
                            {selectedDay
                                ? "Sin eventos este día."
                                : "Selecciona un día para ver los eventos."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── View toggle button ─── */
function ViewToggle({ view, setView }: { view: "cards" | "calendar"; setView: (v: "cards" | "calendar") => void }) {
    return (
        <div className="flex rounded-xl border border-white/15 bg-white/5 p-1">
            {(["cards", "calendar"] as const).map((v) => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${view === v
                        ? "bg-forest-500 text-white shadow"
                        : "text-white/50 hover:text-white"
                        }`}
                >
                    {v === "cards" ? (
                        <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            Tarjetas
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            Calendario
                        </>
                    )}
                </button>
            ))}
        </div>
    );
}

/* ─── Main section ─── */
export default function Eventos() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [view, setView] = useState<"cards" | "calendar">("cards");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

    // Listen for filterEvents custom event (dispatched from SectionCard popup)
    useEffect(() => {
        const handler = ((e: CustomEvent<{ category: string }>) => {
            if (e.detail?.category) {
                setActiveFilter(e.detail.category);
                setView("cards");
            }
        }) as EventListener;
        window.addEventListener("filterEvents", handler);
        return () => window.removeEventListener("filterEvents", handler);
    }, []);

    const filteredEvents = activeFilter
        ? events.filter((e) => e.category === activeFilter)
        : events;

    return (
        <>
            <section id="eventos" className="relative bg-forest-950 py-24">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.3),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.2),transparent_50%)]" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
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
                            Únete a nuestras actividades de naturaleza, cultura y talleres.
                            Cada evento es una oportunidad para conectar con la
                            naturaleza y la comunidad.
                        </p>
                    </div>

                    {/* Controls row: filters + view toggle */}
                    <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        {/* Category filters */}
                        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                            <button
                                onClick={() => setActiveFilter(null)}
                                className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all ${activeFilter === null
                                    ? "bg-forest-500 text-white shadow-lg shadow-forest-500/20"
                                    : "border border-white/15 bg-white/5 text-white/80 hover:border-forest-400/50 hover:bg-forest-400/10 hover:text-white"
                                    }`}
                            >
                                Todos
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setActiveFilter(activeFilter === cat.value ? null : cat.value)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all ${activeFilter === cat.value
                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                        : "border border-white/15 bg-white/5 text-white/80 hover:border-forest-400/50 hover:bg-forest-400/10 hover:text-white"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* View toggle */}
                        <ViewToggle view={view} setView={setView} />
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)}
                        </div>
                    ) : view === "cards" ? (
                        filteredEvents.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
                                <p className="text-white/40">No hay eventos en esta categoría.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
                                ))}
                            </div>
                        )
                    ) : (
                        <CalendarView events={events} activeFilter={activeFilter} onSelect={setSelectedEvent} />
                    )}
                </div>
            </section>

            {/* Event detail modal */}
            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </>
    );
}
