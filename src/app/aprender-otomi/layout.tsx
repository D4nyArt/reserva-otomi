import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aprende Otomí — Reserva Natural Otomí",
    description:
        "Herramienta interactiva para aprender vocabulario en lengua Otomí. Explora escenarios temáticos y descubre las palabras de esta lengua originaria.",
    keywords: [
        "otomí",
        "lengua otomí",
        "aprender otomí",
        "vocabulario otomí",
        "lengua indígena",
    ],
};

export default function AprenderOtomiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
