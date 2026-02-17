const testimonials = [
    {
        author: "María González",
        role: "Asistente - Senderismo en la Reserva",
        content:
            "Una experiencia increíble. Aprendí tanto sobre la flora y fauna de nuestra reserva. Los guías son apasionados y conocedores. ¡Volveré pronto!",
        avatar: "MG",
    },
    {
        author: "Carlos Ramírez",
        role: "Asistente - Taller de Lengua Otomí",
        content:
            "El taller de lengua Otomí me conectó con mis raíces de una forma que nunca imaginé. Escuchar a los mayores hablar en Hñähñu fue conmovedor.",
        avatar: "CR",
    },
    {
        author: "Ana Martínez",
        role: "Voluntaria - Jornada de Reforestación",
        content:
            "Plantar árboles con la comunidad fue una experiencia transformadora. La organización es excelente y el impacto es real y visible.",
        avatar: "AM",
    },
];

export default function Testimonials() {
    return (
        <section className="relative bg-warm-gray py-24">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-300/30 to-transparent" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-forest-600 uppercase">
                        Testimonios
                    </span>
                    <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                        Voces de la{" "}
                        <span className="bg-gradient-to-r from-forest-600 to-earth-600 bg-clip-text text-transparent">
                            Comunidad
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-charcoal/60">
                        Lo que dicen quienes han vivido nuestras experiencias de ecoturismo,
                        cultura y conservación.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.author}
                            className="group relative rounded-2xl border border-forest-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                            style={{ animationDelay: `${i * 200}ms` }}
                        >
                            {/* Quote mark */}
                            <div className="mb-4 text-5xl font-bold leading-none text-forest-200 select-none">
                                &ldquo;
                            </div>

                            {/* Content */}
                            <p className="mb-6 text-sm italic leading-relaxed text-charcoal/70">
                                {t.content}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-water-500 text-sm font-bold text-white">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-heading text-sm font-bold text-forest-900">
                                        {t.author}
                                    </div>
                                    <div className="text-xs text-charcoal/50">{t.role}</div>
                                </div>
                            </div>

                            {/* Decorative corner */}
                            <div className="absolute bottom-0 right-0 h-20 w-20 overflow-hidden rounded-tl-2xl opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="absolute -bottom-10 -right-10 h-20 w-20 rotate-45 bg-gradient-to-br from-forest-50 to-transparent" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
