"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";

interface SearchProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

const navLinks = [
    { href: "/collections/all", label: "ALL" },
    { href: "/collections/tops", label: "TOPS" },
    { href: "/collections/pants", label: "PANTS" },
    { href: "/collections/accessoires", label: "ACCESSOIRES" },
    { href: "/contact", label: "CONTACT" },
    { href: "/faq", label: "F.A.Q." },
];

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { openCart, itemCount } = useCartStore();
    const { data: session } = useSession();
    const count = itemCount();

    // Search states
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setVisible(window.scrollY <= 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Search effect
    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Close search on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setSearchQuery("");
    }, [pathname]);

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
                    <div className="flex-1 flex items-center justify-end" style={{ paddingRight: 100 }}>
                        <Link
                            href="/"
                            className="inline-flex p-2 hover:opacity-80 transition-opacity"
                        >
                            <Image
                                src="/icon.svg"
                                alt="Ralys"
                                width={72}
                                height={72}
                                priority
                                className="w-auto h-[72px] object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop nav - centered */}
                    <nav className="flex items-center justify-center shrink-0" style={{ gap: 32 }}>
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
                    <div className="flex-1 flex items-center justify-end" style={{ gap: 16 }}>
                        <button
                            onClick={() => setIsSearchOpen(true)}
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
                            {mounted && count > 0 && (
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

            {/* Mobile header: hamburger | Logo | icons */}
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
                        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/icon.svg"
                            alt="Ralys"
                            width={48}
                            height={48}
                            priority
                            className="w-auto h-[48px] object-contain"
                        />
                    </Link>

                    {/* Right — 3 icons */}
                    <div className="flex items-center" style={{ gap: 8 }}>
                        <button
                            onClick={() => setIsSearchOpen(true)}
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
                            {mounted && count > 0 && (
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

            {/* Search Overlay & Backdrop */}
            {isSearchOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                        onClick={() => setIsSearchOpen(false)}
                    />

                    {/* Search Panel */}
                    <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-xl" style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <div className="max-w-[800px] mx-auto">
                            {/* Search Input Area */}
                            <div className="flex items-center justify-between" style={{ padding: "16px 24px", height: "64px" }}>
                                <div className="flex-1 flex items-center gap-4">
                                    <Search size={20} className="text-gray-400" strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Rechercher des produits..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent outline-none text-[16px] placeholder-gray-400 font-light"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="hover:opacity-50 transition-opacity p-2 text-gray-500 hover:text-black"
                                >
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Search Results Area */}
                            {searchQuery.trim() !== "" && (
                                <div className="overflow-y-auto max-h-[45vh] custom-scrollbar" style={{ padding: "0 24px 24px 24px" }}>
                                    {isSearching ? (
                                        <div className="text-center text-gray-500 py-8 text-sm">Recherche en cours...</div>
                                    ) : searchResults.length > 0 ? (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">
                                                {searchResults.length} {searchResults.length > 1 ? "résultats" : "résultat"}
                                            </p>
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {searchResults.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/products/${product.slug}`}
                                                        onClick={() => setIsSearchOpen(false)}
                                                        className="group block"
                                                    >
                                                        <div className="relative aspect-[3/4] bg-[#f9f9f9] rounded-md overflow-hidden mb-3">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                            />
                                                        </div>
                                                        <h3 className="text-[11px] font-medium uppercase tracking-widest mb-1 text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-[11px] text-gray-500">
                                                            {product.price.toFixed(2)} €
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 py-12 text-sm">
                                            Aucun résultat pour "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
