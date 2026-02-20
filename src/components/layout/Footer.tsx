"use client";

import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer>
            {/* ─── Newsletter Section ─── */}
            <section className="bg-black text-white" style={{ padding: "90px 24px 80px" }}>
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-normal tracking-wide mb-4">
                        Inscris toi à la newsletter !
                    </h2>
                    <p
                        className="text-base text-white/60 leading-[1.8]"
                        style={{ maxWidth: 520, marginBottom: "40px" }}
                    >
                        Seuls les inscrits peuvent profiter de réductions, d&apos;un accès
                        anticipé aux drops et d&apos;autres avantages. Promis qu&apos;on va pas te spam.
                    </p>
                    <div className="w-full" style={{ maxWidth: 440 }}>
                        <input
                            type="email"
                            placeholder="E-mail"
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                color: "white",
                                fontSize: "14px",
                                padding: "16px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "10px",
                                outline: "none",
                                marginBottom: "16px",
                            }}
                        />
                        <button
                            type="button"
                            style={{
                                width: "100%",
                                padding: "18px 0",
                                fontSize: "15px",
                                fontWeight: 500,
                                letterSpacing: "0.03em",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.3)",
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                color: "white",
                                transition: "all 0.3s",
                            }}
                        >
                            S&apos;inscrire
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Social Icons ─── */}
            <div className="bg-white" style={{ paddingTop: 40, paddingBottom: 50 }}>
                <div className="flex items-center justify-center gap-5">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-800 hover:text-black transition-colors duration-300"
                        aria-label="Instagram"
                    >
                        <Instagram size={22} strokeWidth={1.5} />
                    </a>
                    <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-800 hover:text-black transition-colors duration-300"
                        aria-label="TikTok"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* ─── Bottom Bar ─── */}
            <div
                className="bg-white"
                style={{
                    borderTop: "1px solid rgba(18,18,18,0.08)",
                    padding: "30px 40px 24px",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Selectors + Payment row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-8">
                        {/* Country & Language */}
                        <div className="flex flex-wrap items-end gap-5">
                            <div>
                                <p className="text-xs text-neutral-500 mb-2" style={{ fontSize: 13 }}>
                                    Pays/région
                                </p>
                                <div className="relative inline-block">
                                    <select
                                        className="appearance-none bg-white cursor-pointer text-sm focus:outline-none transition-colors"
                                        style={{
                                            border: "1px solid rgba(18,18,18,0.08)",
                                            borderRadius: 6,
                                            padding: "10px 36px 10px 14px",
                                            fontSize: 14,
                                        }}
                                    >
                                        <option>France | EUR €</option>
                                    </select>
                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M3 4.5L6 7.5L9 4.5" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 mb-2" style={{ fontSize: 13 }}>
                                    Langue
                                </p>
                                <div className="relative inline-block">
                                    <select
                                        className="appearance-none bg-white cursor-pointer text-sm focus:outline-none transition-colors"
                                        style={{
                                            border: "1px solid rgba(18,18,18,0.08)",
                                            borderRadius: 6,
                                            padding: "10px 36px 10px 14px",
                                            fontSize: 14,
                                        }}
                                    >
                                        <option>Français</option>
                                    </select>
                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M3 4.5L6 7.5L9 4.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Payment icons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, backgroundColor: "#006FCF" }}>
                                <span className="text-white font-bold" style={{ fontSize: 8 }}>AMEX</span>
                            </div>
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, backgroundColor: "#000" }}>
                                <span className="text-white font-semibold" style={{ fontSize: 10 }}>Pay</span>
                            </div>
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, backgroundColor: "#1A7F37" }}>
                                <span className="text-white font-bold" style={{ fontSize: 10 }}>CB</span>
                            </div>
                            <div className="flex items-center justify-center rounded overflow-hidden" style={{ width: 50, height: 34, backgroundColor: "#1A1F71" }}>
                                <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
                                    <circle cx="11" cy="9" r="8" fill="#EB001B" />
                                    <circle cx="19" cy="9" r="8" fill="#F79E1B" />
                                    <path d="M15 2.6A7.96 7.96 0 0 1 17.5 9 7.96 7.96 0 0 1 15 15.4 7.96 7.96 0 0 1 12.5 9 7.96 7.96 0 0 1 15 2.6Z" fill="#FF5F00" />
                                </svg>
                            </div>
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, border: "1px solid rgba(18,18,18,0.08)", backgroundColor: "#fff" }}>
                                <span style={{ fontSize: 10 }} className="font-bold">
                                    <span style={{ color: "#003087" }}>Pay</span>
                                    <span style={{ color: "#009CDE" }}>Pal</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, backgroundColor: "#5A31F4" }}>
                                <span className="text-white font-bold" style={{ fontSize: 9 }}>Shop</span>
                            </div>
                            <div className="flex items-center justify-center rounded" style={{ width: 50, height: 34, backgroundColor: "#1A1F71" }}>
                                <span className="text-white font-bold italic" style={{ fontSize: 11 }}>VISA</span>
                            </div>
                        </div>
                    </div>

                    {/* Copyright + Legal */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                        <span className="text-neutral-500" style={{ fontSize: 13 }}>
                            © {new Date().getFullYear()}, Ralys
                        </span>
                        <span className="hidden sm:inline text-neutral-400 mx-2">·</span>
                        <nav className="flex flex-wrap items-center">
                            {[
                                { href: "#", label: "Politique de confidentialité" },
                                { href: "#", label: "Mentions légales" },
                                { href: "/contact", label: "Coordonnées" },
                            ].map((link, i) => (
                                <span key={link.label} className="flex items-center">
                                    {i > 0 && <span className="text-neutral-400 mx-2">·</span>}
                                    <Link
                                        href={link.href}
                                        className="text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                                        style={{ fontSize: 13 }}
                                    >
                                        {link.label}
                                    </Link>
                                </span>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
