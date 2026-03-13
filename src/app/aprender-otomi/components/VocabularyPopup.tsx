"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { ScenarioElement } from "../data/scenarios";

interface VocabularyPopupProps {
    element: ScenarioElement;
    allElements: ScenarioElement[];
    onClose: () => void;
    onNavigate: (element: ScenarioElement) => void;
}

export default function VocabularyPopup({
    element,
    allElements,
    onClose,
    onNavigate,
}: VocabularyPopupProps) {
    const currentIndex = allElements.findIndex((el) => el.id === element.id);

    const goToPrev = useCallback(() => {
        const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : allElements.length - 1;
        onNavigate(allElements[prevIndex]);
    }, [currentIndex, allElements, onNavigate]);

    const goToNext = useCallback(() => {
        const nextIndex =
            currentIndex < allElements.length - 1 ? currentIndex + 1 : 0;
        onNavigate(allElements[nextIndex]);
    }, [currentIndex, allElements, onNavigate]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "ArrowRight") goToNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose, goToPrev, goToNext]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Cerrar"
            >
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* Left Arrow */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                }}
                className="absolute left-4 sm:left-8 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Elemento anterior"
            >
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Right Arrow */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                }}
                className="absolute right-4 sm:right-8 z-60 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Siguiente elemento"
            >
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Content Card */}
            <div
                className="relative z-50 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Circular element display */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-white/95 border-4 border-amber-500 shadow-2xl shadow-amber-500/20 flex items-center justify-center mb-8 animate-scale-in overflow-hidden">
                    {element.imageUrl ? (
                        <Image
                            src={element.imageUrl}
                            alt={element.spanishWord}
                            width={300}
                            height={300}
                            className="object-contain scale-[1.3] w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64"
                            unoptimized
                        />
                    ) : (
                        <span className="text-7xl sm:text-8xl md:text-9xl select-none leading-none">
                            {element.emoji}
                        </span>
                    )}
                </div>

                {/* Words */}
                <div className="text-center animate-fade-in-up">
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 tracking-wide uppercase mb-2">
                        {element.otomiWord}
                    </h2>
                    <p className="text-xl sm:text-2xl text-white/80 font-light">
                        {element.spanishWord}
                    </p>
                </div>

                {/* Element counter */}
                <div className="mt-6 flex items-center gap-2">
                    {allElements.map((el, i) => (
                        <button
                            key={el.id}
                            onClick={() => onNavigate(el)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex
                                ? "bg-amber-400 scale-125"
                                : "bg-white/30 hover:bg-white/50"
                                }`}
                            aria-label={`Ir a ${el.spanishWord}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
