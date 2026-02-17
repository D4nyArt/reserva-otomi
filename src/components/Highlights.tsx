import SectionCard from "./SectionCard";

const raicesItems = [
    {
        image: "/images/lengua.png",
        title: "Lengua Hñähñu",
        description:
            "Preservamos la lengua Otomí a través de talleres, materiales educativos y programas intergeneracionales.",
        tag: "Raíces",
        tagColor: "bg-earth-500",
    },
    {
        image: "/images/gastronomia.png",
        title: "Gastronomía Ancestral",
        description:
            "La cocina Otomí refleja siglos de sabiduría: ingredientes locales, técnicas prehispánicas y sabores únicos.",
        tag: "Raíces",
        tagColor: "bg-earth-500",
    },
    {
        image: "/images/medicina.png",
        title: "Medicina Tradicional",
        description:
            "Herbolaria y conocimientos medicinales transmitidos de generación en generación para el bienestar comunitario.",
        tag: "Raíces",
        tagColor: "bg-earth-500",
    },
];

const preservacionItems = [
    {
        image: "/images/hongos.png",
        title: "Biodiversidad: Hongos",
        description:
            "Documentamos y protegemos la extraordinaria diversidad de hongos del bosque de niebla.",
        tag: "Preservación",
        tagColor: "bg-water-600",
    },
    {
        image: "/images/reforestacion.png",
        title: "Reforestación",
        description:
            "Programas activos de reforestación con árboles nativos para restaurar los ecosistemas.",
        tag: "Preservación",
        tagColor: "bg-water-600",
    },
    {
        image: "/images/agua.png",
        title: "Conservación del Agua",
        description:
            "Protegemos los manantiales, ríos y el embalse natural que abastecen a toda la región.",
        tag: "Preservación",
        tagColor: "bg-water-600",
    },
];

export default function Highlights() {
    return (
        <>
            {/* Raíces Section */}
            <section id="raices" className="relative bg-warm-gray py-24">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-earth-300/40 to-transparent" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-earth-600 uppercase">
                            Nuestras Raíces
                        </span>
                        <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                            Cultura{" "}
                            <span className="bg-gradient-to-r from-earth-500 to-earth-700 bg-clip-text text-transparent">
                                Viva
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-charcoal/60">
                            Las tradiciones Otomíes son el corazón de nuestra identidad.
                            Trabajamos para que su lengua, gastronomía y medicina continúen
                            floreciendo.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {raicesItems.map((item) => (
                            <SectionCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Preservación Section */}
            <section id="preservacion" className="relative bg-cream py-24">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-water-400/40 to-transparent" />
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <span className="mb-3 inline-block text-sm font-semibold tracking-widest text-water-600 uppercase">
                            Preservación
                        </span>
                        <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                            Protegiendo Nuestro{" "}
                            <span className="bg-gradient-to-r from-water-500 to-forest-600 bg-clip-text text-transparent">
                                Ecosistema
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-charcoal/60">
                            Cada acción cuenta. Desde la reforestación hasta la conservación
                            del agua, trabajamos para garantizar un futuro sustentable.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {preservacionItems.map((item) => (
                            <SectionCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
