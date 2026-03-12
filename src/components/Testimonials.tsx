import { getTestimonials, getEvents } from "@/lib/supabase";

export default async function Testimonials() {
    const [testimonials, events] = await Promise.all([
        getTestimonials(),
        getEvents(),
    ]);

    if (testimonials.length === 0) {
        return null;
    }

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
                        Conoce las experiencias de las personas que han participado en nuestras actividades
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((t, i) => {
                        // Generate avatar initials
                        const authParts = t.author.trim().split(" ");
                        const avatar =
                            authParts.length > 1
                                ? `${authParts[0][0]}${authParts[1][0]}`.toUpperCase()
                                : t.author.substring(0, 2).toUpperCase();

                        // Find linked event title
                        const linkedEvent = t.event_id
                            ? events.find(e => e.id === t.event_id)
                            : null;

                        return (
                            <div
                                key={t.id}
                                className="group relative rounded-2xl border border-forest-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                                style={{ animationDelay: `${(i % 3) * 200}ms` }}
                            >
                                {/* Quote mark */}
                                <div className="mb-4 text-5xl font-bold leading-none text-forest-200 select-none">
                                    &ldquo;
                                </div>

                                {/* Content */}
                                <p className="mb-6 whitespace-pre-wrap text-sm italic leading-relaxed text-charcoal/70">
                                    {t.content}
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-water-500 text-sm font-bold text-white shrink-0">
                                        {avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-heading text-sm font-bold text-forest-900 truncate">
                                            {t.author}
                                        </div>
                                        <div className="text-xs text-charcoal/50">
                                            {linkedEvent
                                                ? `Participante en: ${linkedEvent.title}`
                                                : "Miembro de la Comunidad"}
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative corner */}
                                <div className="absolute bottom-0 right-0 h-20 w-20 overflow-hidden rounded-tl-2xl opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="absolute -bottom-10 -right-10 h-20 w-20 rotate-45 bg-gradient-to-br from-forest-50 to-transparent" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
