"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
    { label: "Quiénes Somos", href: "#quienes-somos" },
    { label: "Raíces", href: "#raices" },
    { label: "Preservación", href: "#preservacion" },
    { label: "Eventos", href: "#eventos" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "bg-forest-950/95 backdrop-blur-md shadow-lg py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-heading text-2xl font-bold tracking-tight text-white"
                >
                    <span className="text-forest-400">Agua</span> Barranca
                </Link>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="relative text-sm font-medium text-white/80 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-forest-400 after:transition-all hover:after:w-full"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contacto"
                        className="rounded-full bg-forest-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-forest-400 hover:shadow-forest-500/30 hover:shadow-xl active:scale-95"
                    >
                        Contacto
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
                    aria-label="Toggle menu"
                >
                    <span
                        className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMobileOpen ? "translate-y-2 rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMobileOpen ? "opacity-0" : ""
                            }`}
                    />
                    <span
                        className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMobileOpen ? "-translate-y-2 -rotate-45" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-forest-950/98 backdrop-blur-xl transition-all duration-500 md:hidden ${isMobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
            >
                <div className="flex flex-col items-center gap-8">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="font-heading text-3xl font-light text-white/90 transition-colors hover:text-forest-400"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contacto"
                        onClick={() => setIsMobileOpen(false)}
                        className="mt-4 rounded-full bg-forest-500 px-10 py-3.5 text-lg font-semibold text-white shadow-xl transition-all hover:bg-forest-400"
                    >
                        Contacto
                    </a>
                </div>
            </div>
        </nav>
    );
}
