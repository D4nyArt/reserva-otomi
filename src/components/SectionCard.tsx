"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, string> = {
    ecoturismo: "Ecoturismo",
    cultura: "Cultura",
    talleres: "Talleres",
    activismo: "Activismo",
};

interface SectionCardProps {
    image: string;
    title: string;
    description: string;
    tag?: string;
    tagColor?: string;
    category?: string | null;
}

/* ─── Card Detail Modal ─── */
function CardModal({
    image,
    title,
    description,
    tag,
    tagColor,
    category,
    onClose,
}: SectionCardProps & { onClose: () => void }) {
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

    const handleViewEvents = () => {
        onClose();
        // Dispatch custom event so Eventos component sets its filter
        window.dispatchEvent(
            new CustomEvent("filterEvents", { detail: { category } })
        );
        // Scroll to the eventos section
        const eventosSection = document.getElementById("eventos");
        if (eventosSection) {
            eventosSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-[scale-in_0.25s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <div className="relative h-64 w-full">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 512px) 100vw, 512px"
                        unoptimized={image.startsWith("http")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                    {/* Tag Badge */}
                    {tag && (
                        <div className="absolute top-4 left-4">
                            <span className={`${tagColor} rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md`}>
                                {tag}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="relative -mt-4 px-7 pb-7">
                    <h3 className="font-heading mb-3 text-2xl font-bold text-forest-900">
                        {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal/70">
                        {description}
                    </p>

                    {/* View Events button */}
                    {category && (
                        <button
                            onClick={handleViewEvents}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-600 active:scale-[0.98]"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            Ver eventos de {categoryLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Section Card ─── */
export default function SectionCard({
    image,
    title,
    description,
    tag,
    tagColor = "bg-forest-500",
    category,
}: SectionCardProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                onClick={() => setShowModal(true)}
            >
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
                    <p className="line-clamp-3 text-sm leading-relaxed text-charcoal/70">
                        {description}
                    </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-forest-500 to-water-500 transition-all duration-500 group-hover:w-full" />
            </div>

            {/* Detail modal */}
            {showModal && (
                <CardModal
                    image={image}
                    title={title}
                    description={description}
                    tag={tag}
                    tagColor={tagColor}
                    category={category}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
