const values = [
    {
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        title: "Fundación",
        description:
            "Nacimos del compromiso comunitario por proteger el embalse natural y preservar las tradiciones Otomíes para las futuras generaciones.",
    },
    {
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: "Misión",
        description:
            "Conservar el ecosistema del embalse, promover el ecoturismo responsable y empoderar a la comunidad Otomí a través de la educación y cultura.",
    },
    {
        icon: (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        title: "Valores",
        description:
            "Respeto por la naturaleza, identidad cultural, trabajo comunitario, transparencia y compromiso con el desarrollo sostenible.",
    },
];

export default function QuienesSomos() {
    return (
        <section id="quienes-somos" className="relative bg-cream py-24">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-300/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-forest-600 uppercase">
                        Quiénes Somos
                    </span>
                    <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                        Guardianes del{" "}
                        <span className="bg-gradient-to-r from-forest-600 to-water-600 bg-clip-text text-transparent">
                            Patrimonio Natural
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-charcoal/60">
                        Somos una organización comunitaria comprometida con la conservación
                        del embalse natural y la revitalización de la cultura Hñähñu.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {values.map((item, i) => (
                        <div
                            key={item.title}
                            className="group relative rounded-2xl border border-forest-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-forest-200 hover:shadow-xl"
                            style={{ animationDelay: `${i * 200}ms` }}
                        >
                            {/* Icon */}
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-500 group-hover:text-white">
                                {item.icon}
                            </div>

                            <h3 className="font-heading mb-3 text-xl font-bold text-forest-900">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-charcoal/65">
                                {item.description}
                            </p>

                            {/* Corner decoration */}
                            <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden rounded-bl-2xl">
                                <div className="absolute -top-8 -right-8 h-16 w-16 rotate-45 bg-gradient-to-br from-forest-100 to-transparent transition-colors group-hover:from-forest-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
