import Image from "next/image";

export default function Hero() {
    return (
        <section id="hero" className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <Image
                src="/images/hero.png"
                alt="Vista panorámica de la Reserva Natural Otomí"
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/30 to-forest-950/80" />

            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                {/* Badge */}
                <div className="animate-fade-in mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm">
                    <span className="text-sm font-medium tracking-widest text-forest-300 uppercase">
                        Zona Otomí • Reserva Natural
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="animate-fade-in-up font-heading max-w-4xl text-5xl leading-tight font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
                    style={{ animationDelay: "200ms" }}
                >
                    Agua{" "}
                    <span className="bg-gradient-to-r from-forest-300 to-water-400 bg-clip-text text-transparent">
                        Barranca
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    className="animate-fade-in-up mt-6 max-w-2xl text-lg text-white/80 md:text-xl"
                    style={{ animationDelay: "400ms" }}
                >
                    Preservando el patrimonio natural y cultural de la zona Otomí.
                    Protegemos el agua, la tierra y las tradiciones que nos definen.
                </p>

                {/* CTA Buttons */}
                <div
                    className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row"
                    style={{ animationDelay: "600ms" }}
                >
                    <a
                        href="#quienes-somos"
                        className="rounded-full bg-forest-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-forest-400 hover:shadow-forest-500/30 hover:shadow-xl active:scale-95"
                    >
                        Descubre Nuestra Misión
                    </a>
                    <a
                        href="#eventos"
                        className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                    >
                        Próximos Eventos
                    </a>
                </div>

                {/* Scroll indicator */}
                <div className="animate-fade-in absolute bottom-20 flex flex-col items-center gap-2" style={{ animationDelay: "1s" }}>
                    <span className="text-xs tracking-widest text-white/50 uppercase">
                        Explorar
                    </span>
                    <div className="h-10 w-6 rounded-full border-2 border-white/30 p-1">
                        <div className="h-2 w-full animate-bounce rounded-full bg-forest-400" />
                    </div>
                </div>
            </div>
        </section>
    );
}
