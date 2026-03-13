"use client";

import Image from "next/image";
import { ScenarioElement } from "../data/scenarios";

interface ScenarioSceneProps {
    bgGradient: string;
    bgImageUrl?: string;
    bgEmoji: string;
    elements: ScenarioElement[];
    onElementClick: (element: ScenarioElement) => void;
}

export default function ScenarioScene({
    bgGradient,
    bgImageUrl,
    bgEmoji,
    elements,
    onElementClick,
}: ScenarioSceneProps) {
    return (
        <div
            className="relative w-full h-full overflow-hidden select-none"
            style={{ background: bgGradient }}
        >
            {/* Background image */}
            {bgImageUrl && (
                <Image
                    src={bgImageUrl}
                    alt="Fondo del escenario"
                    fill
                    className="object-cover pointer-events-none"
                    unoptimized
                    priority
                />
            )}
            {/* Decorative Background Emojis */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-wrap items-center justify-center gap-16 text-7xl">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span
                        key={i}
                        className="transform rotate-12"
                        style={{
                            transform: `rotate(${i * 30}deg) scale(${0.8 + Math.random() * 0.6})`,
                        }}
                    >
                        {bgEmoji}
                    </span>
                ))}
            </div>

            {/* Clickable Elements */}
            {elements.map((el) => (
                <button
                    key={el.id}
                    onClick={() => onElementClick(el)}
                    className="absolute group cursor-pointer transition-all duration-300 hover:scale-125 focus:scale-125 focus:outline-none"
                    style={{
                        left: `${el.position.x}%`,
                        top: `${el.position.y}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                    aria-label={`${el.spanishWord} — click para aprender en Otomí`}
                    title={el.spanishWord}
                >
                    {/* Glow ring on hover */}
                    <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 group-focus:bg-white/20 transition-all duration-300 scale-150 blur-md" />

                    {/* Element container */}
                    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-white/60 group-hover:border-amber-400 group-focus:border-amber-400 group-hover:shadow-amber-400/30 group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {el.imageUrl ? (
                            <Image
                                src={el.imageUrl}
                                alt={el.spanishWord}
                                width={80}
                                height={80}
                                className="object-contain scale-130 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
                                unoptimized
                            />
                        ) : (
                            <span className="text-3xl sm:text-4xl md:text-5xl select-none leading-none">
                                {el.emoji}
                            </span>
                        )}
                    </div>

                    {/* Label tooltip */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                        <span className="px-2 py-0.5 text-xs font-semibold text-white bg-black/60 rounded-full backdrop-blur-sm">
                            {el.spanishWord}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}
