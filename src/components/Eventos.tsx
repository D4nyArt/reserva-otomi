const mockEvents = [
    {
        id: "1",
        title: "Senderismo en la Reserva",
        description:
            "Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.",
        date: "2026-03-15",
        category: "Ecoturismo",
        tags: ["Senderismo", "Avistamientos"],
        color: "from-forest-500 to-forest-700",
        bgColor: "bg-forest-50",
        textColor: "text-forest-700",
    },
    {
        id: "2",
        title: "Taller de Lengua Otomí",
        description:
            "Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.",
        date: "2026-03-22",
        category: "Cultura",
        tags: ["Lengua", "Comunidad"],
        color: "from-earth-500 to-earth-700",
        bgColor: "bg-earth-50",
        textColor: "text-earth-700",
    },
    {
        id: "3",
        title: "Jornada de Reforestación",
        description:
            "Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.",
        date: "2026-04-05",
        category: "Activismo",
        tags: ["Reforestación", "Voluntariado"],
        color: "from-water-500 to-water-700",
        bgColor: "bg-water-50",
        textColor: "text-water-700",
    },
    {
        id: "4",
        title: "Taller de Medicina Tradicional",
        description:
            "Conoce las plantas medicinales de la región y sus usos ancestrales.",
        date: "2026-04-12",
        category: "Talleres",
        tags: ["Medicina", "Herbolaria"],
        color: "from-amber-500 to-amber-700",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
    },
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    const day = date.getDate();
    const month = date.toLocaleDateString("es-MX", { month: "short" }).toUpperCase();
    return { day, month };
}

export default function Eventos() {
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

                {/* Category pills */}
                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    {["Ecoturismo", "Cultura", "Talleres", "Activismo"].map(
                        (cat) => (
                            <button
                                key={cat}
                                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-forest-400/50 hover:bg-forest-400/10 hover:text-white"
                            >
                                {cat}
                            </button>
                        )
                    )}
                </div>

                {/* Event Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {mockEvents.map((event) => {
                        const { day, month } = formatDate(event.date);
                        return (
                            <div
                                key={event.id}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                            >
                                {/* Date Badge */}
                                <div className={`bg-gradient-to-br ${event.color} p-4 text-center`}>
                                    <div className="text-3xl font-bold text-white">{day}</div>
                                    <div className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                                        {month}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Category tag */}
                                    <span
                                        className={`${event.bgColor} ${event.textColor} mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold`}
                                    >
                                        {event.category}
                                    </span>

                                    <h3 className="font-heading mb-2 text-lg font-bold text-white">
                                        {event.title}
                                    </h3>
                                    <p className="mb-4 text-sm leading-relaxed text-white/55">
                                        {event.description}
                                    </p>

                                    {/* Tags */}
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
                                </div>

                                {/* Hover glow */}
                                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-5`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
