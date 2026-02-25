"use client";

import { Scenario } from "../data/scenarios";

interface ScenarioSelectorProps {
    scenarios: Scenario[];
    activeIndex: number;
    onSelect: (index: number) => void;
}

export default function ScenarioSelector({
    scenarios,
    activeIndex,
    onSelect,
}: ScenarioSelectorProps) {
    return (
        <div className="flex items-center gap-3 sm:gap-4">
            {scenarios.map((scenario, i) => (
                <button
                    key={scenario.id}
                    onClick={() => onSelect(i)}
                    className={`
            relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5
            rounded-full font-heading text-sm sm:text-base font-semibold
            transition-all duration-300 cursor-pointer
            ${i === activeIndex
                            ? "bg-white text-forest-800 shadow-lg shadow-white/20 scale-105"
                            : "bg-white/15 text-white/80 hover:bg-white/25 hover:text-white"
                        }
          `}
                    aria-label={`Escenario: ${scenario.subtitle}`}
                >
                    <span className="text-lg">{scenario.bgEmoji}</span>
                    <span className="hidden sm:inline">{scenario.subtitle}</span>
                </button>
            ))}
        </div>
    );
}
