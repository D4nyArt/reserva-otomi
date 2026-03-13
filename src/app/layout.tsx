import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reserva Natural Otomí — Agua Barranca",
  description:
    "Organización dedicada a la preservación del embalse natural y la cultura Otomí. Descubre nuestras raíces, eventos de naturaleza, talleres culturales y esfuerzos de conservación.",
  keywords: [
    "reserva natural",
    "otomí",
    "naturaleza",
    "conservación",
    "cultura indígena",
    "agua barranca",
  ],
  openGraph: {
    title: "Reserva ecológica | Acazulco",
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
        className={`${montserrat.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
