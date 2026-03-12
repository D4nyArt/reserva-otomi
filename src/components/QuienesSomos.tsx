import SectionCard from "./SectionCard";

const values = [
    {
        image: "/images/arraigo.png",
        title: "Arraigo: Nuestro puente con el origen",
        description:
            "Nacimos a finales de 2017 bajo el nombre de “Ntejë Ñie Lengü”, que en otomí significa ‘Agua en la barranca chica’.  Somos un puente vivo que busca reconectar a la gente de San Jerónimo Acazulco con su bosque. Nuestro arraigo surge de una necesidad profunda por defender el territorio que habitamos. Trabajamos para que las nuevas generaciones vuelvan a mirar hacia la montaña, y reconozcan en ella su propia historia así como que adquieran el sentido de pertenencia hacia la tierra y los recursos naturales que siempre nos han dado sustento. ",
    },
    {
        image: "/images/agradar.png",
        title: "Agradecimiento: El agradecimiento por lo que somos",
        description:
            "Proteger nuestro hogar nace de una reciprocidad profunda. Así como bajo la tierra las raíces se entrelazan con fuerza, como manos invisibles que se sostienen para mantener vivo al bosque, nuestro colectivo busca fundirse con la naturaleza. Nuestro interés va más allá de sembrar árboles o rescatar técnicas agrícolas; sino que se concentra en reconocer que somos uno mismo con nuestro entorno. Agradecemos a los guardianes del lugar devolviéndoles cuidado y respeto, honrando la lengua y la sabiduría que nos han arropado desde siempre. Queremos ser ese tejido firme donde las voces de nuestros antepasos y las ideas de las nuevas mentes se sostengan mutuamente para construir nuestro futuro.",
    },
    {
        image: "/images/comunidad.png",
        title: "Comunidad: Avanzar en el mismo camino",
        description:
            "Sabemos que los grandes cambios no ocurren desde el individuo, sino en comunidad. Frente al desinterés o los objetivos personales que a veces nos dividen, nosotros oponemos la fuerza del trabajo en equipo. Nuestra filosofía es directa e inquebrantable: si alguien tropieza, le damos la mano, lo levantamos y avanzamos todos juntos. Queremos demostrar todos los días que, unidos, somos capaces de transformar nuestro entorno, creando un espacio donde cada persona pueda aportar, organizarse y caminar hacia un propósito común.",
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
                        Sobre Nosotros
                    </span>
                    <h2 className="font-heading mb-4 text-4xl font-bold text-forest-950 md:text-5xl">
                        Preocupados por{" "}
                        <span className="bg-gradient-to-r from-forest-600 to-water-600 bg-clip-text text-transparent">
                            nuestras raíces
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-charcoal/60">
                        Somos un colectivo comprometido con la preservación ecológica
                        y la revitalización de la cultura Hñähñu.
                    </p>
                </div>

                {/* YouTube Video */}
                <div className="mx-auto mb-16 w-full max-w-4xl">
                    <div className="overflow-hidden rounded-2xl border border-forest-100 shadow-lg" style={{ aspectRatio: '16/9' }}>
                        <iframe
                            title="Video de la Reserva Ecológica Otomí"
                            src="https://www.youtube.com/embed/zhtbnEFweN8?si=3_FV9xT13MvTfAgk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Cards — static, not clickable */}
                <div className="grid gap-8 md:grid-cols-3">
                    {values.map((item) => (
                        <SectionCard
                            key={item.title}
                            image={item.image}
                            title={item.title}
                            shortDescription={item.description}
                            longDescription={item.description}
                            clickable={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
