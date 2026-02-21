"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";

const navLinks = [
    { href: "/collections/all", label: "ALL" },
    { href: "/collections/tops", label: "TOPS" },
    { href: "/collections/pants", label: "PANTS" },
    { href: "/collections/accessoires", label: "ACCESSOIRES" },
    { href: "/contact", label: "CONTACT" },
    { href: "/faq", label: "F.A.Q." },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const { openCart, itemCount } = useCartStore();
    const { data: session } = useSession();
    const count = itemCount();

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY <= 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className="relative z-50 bg-white transition-opacity duration-300"
            style={{
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            {/* Desktop header */}
            <div className="hidden lg:block" style={{ padding: "0 50px" }}>
                <div
                    className="flex items-center"
                    style={{ height: 120 }}
                >
                    {/* Logo - left */}
                    <Link
                        href="/"
                        className="uppercase"
                        style={{
                            fontSize: 28,
                            fontWeight: 400,
                            letterSpacing: "0.35em",
                        }}
                    >
                        RALYS
                    </Link>

                    {/* Desktop nav - centered */}
                    <nav className="flex items-center flex-1 justify-center" style={{ gap: 32 }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="uppercase hover:opacity-50 transition-opacity duration-300"
                                style={{
                                    fontSize: 14,
                                    fontWeight: 400,
                                    letterSpacing: "0.06em",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons - right */}
                    <div className="flex items-center" style={{ gap: 16 }}>
                        <button
                            className="hover:opacity-50 transition-opacity flex items-center justify-center"
                            aria-label="Rechercher"
                            style={{ padding: 8 }}
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <Link
                            href={session ? "/account" : "/login"}
                            className="hover:opacity-50 transition-opacity flex items-center justify-center"
                            aria-label="Compte"
                            style={{ padding: 8 }}
                        >
                            <User size={20} strokeWidth={1.5} />
                        </Link>
                        <button
                            onClick={openCart}
                            className="hover:opacity-50 transition-opacity relative flex items-center justify-center"
                            aria-label="Panier"
                            style={{ padding: 8 }}
                        >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {count > 0 && (
                                <span
                                    className="absolute bg-black text-white rounded-full flex items-center justify-center font-medium"
                                    style={{
                                        top: 0,
                                        right: 0,
                                        width: 16,
                                        height: 16,
                                        fontSize: 10,
                                    }}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile header: hamburger | RALYS | icons */}
            <div className="lg:hidden" style={{ padding: "0 16px" }}>
                <div
                    className="flex items-center justify-between"
                    style={{ height: 64 }}
                >
                    {/* Left — Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex items-center justify-center"
                        aria-label="Menu"
                        style={{ padding: 8, width: 40 }}
                    >
                        {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                    </button>

                    {/* Center — Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2 uppercase"
                        style={{
                            fontSize: 22,
                            fontWeight: 400,
                            letterSpacing: "0.35em",
                        }}
                    >
                        RALYS
                    </Link>

                    {/* Right — 3 icons */}
                    <div className="flex items-center" style={{ gap: 8 }}>
                        <button
                            className="hover:opacity-50 transition-opacity flex items-center justify-center"
                            aria-label="Rechercher"
                            style={{ padding: 6 }}
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <Link
                            href={session ? "/account" : "/login"}
                            className="hover:opacity-50 transition-opacity flex items-center justify-center"
                            aria-label="Compte"
                            style={{ padding: 6 }}
                        >
                            <User size={20} strokeWidth={1.5} />
                        </Link>
                        <button
                            onClick={openCart}
                            className="hover:opacity-50 transition-opacity relative flex items-center justify-center"
                            aria-label="Panier"
                            style={{ padding: 6 }}
                        >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {count > 0 && (
                                <span
                                    className="absolute bg-black text-white rounded-full flex items-center justify-center font-medium"
                                    style={{
                                        top: 0,
                                        right: 0,
                                        width: 16,
                                        height: 16,
                                        fontSize: 10,
                                    }}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white z-50" style={{ top: 64 }}>
                    <nav className="flex flex-col items-center py-16 gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="uppercase hover:opacity-50 transition-opacity"
                                style={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    letterSpacing: "0.15em",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
