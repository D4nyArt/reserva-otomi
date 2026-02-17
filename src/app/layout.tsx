import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reserva Natural Otomí — Agua Barranca",
  description:
    "Organización dedicada a la preservación del embalse natural y la cultura Otomí. Descubre nuestras raíces, eventos de ecoturismo, talleres culturales y esfuerzos de conservación.",
  keywords: [
    "reserva natural",
    "otomí",
    "ecoturismo",
    "conservación",
    "cultura indígena",
    "agua barranca",
  ],
  openGraph: {
    title: "Reserva Natural Otomí — Agua Barranca",
    description:
      "Preservando el patrimonio natural y cultural de la zona Otomí.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
