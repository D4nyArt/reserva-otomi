import Image from "next/image";

interface SectionCardProps {
    image: string;
    title: string;
    description: string;
    tag?: string;
    tagColor?: string;
}

export default function SectionCard({
    image,
    title,
    description,
    tag,
    tagColor = "bg-forest-500",
}: SectionCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Tag Badge */}
                {tag && (
                    <div className="absolute top-4 left-4">
                        <span
                            className={`${tagColor} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md`}
                        >
                            {tag}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-heading mb-2 text-xl font-bold text-forest-900 transition-colors group-hover:text-forest-600">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-charcoal/70">
                    {description}
                </p>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-forest-500 to-water-500 transition-all duration-500 group-hover:w-full" />
        </div>
    );
}
