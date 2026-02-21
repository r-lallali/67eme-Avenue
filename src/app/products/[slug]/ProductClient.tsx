"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronDown, Minus, Plus, Shirt, Truck, Ruler } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCartStore } from "@/lib/store";

export default function ProductClient({
    product,
    related,
}: {
    product: Product;
    related: Product[];
}) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addItem, openCart } = useCartStore();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: product.colors[0],
            slug: product.slug,
            quantity: quantity,
        });
        openCart();
    };

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="py-6 max-w-7xl mx-auto" style={{ padding: "0 24px" }}>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 text-xs tracking-wider text-muted hover:text-foreground transition-colors"
                >
                    <ChevronLeft size={12} />
                    Retour
                </button>
            </div>

            {/* Product */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto pb-16"
                style={{ padding: "0 24px" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Images */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square relative overflow-hidden bg-surface">
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border-2 transition-colors ${currentImageIndex === index ? 'border-black' : 'border-transparent hover:border-black/50'}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col" style={{ paddingTop: "16px", paddingBottom: "32px" }}>
                        {/* Product title */}
                        <h1 style={{ fontSize: "28px", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.2 }}>
                            {product.name}
                        </h1>

                        {/* Product bullet points */}
                        <ul style={{ paddingLeft: "18px", marginTop: "24px" }}>
                            <li style={{ fontSize: "14px", color: "#374151", marginBottom: "6px", listStyleType: "disc" }}>{product.description}</li>
                            <li style={{ fontSize: "14px", color: "#374151", marginBottom: "6px", listStyleType: "disc" }}>Coupe oversize</li>
                            <li style={{ fontSize: "14px", color: "#374151", marginBottom: "0", listStyleType: "disc" }}>Logo brodé</li>
                        </ul>

                        {/* Price */}
                        <div style={{ marginTop: "28px" }}>
                            <p style={{ fontSize: "20px", fontWeight: 700 }}>
                                €{product.price.toFixed(2)} EUR
                            </p>
                            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Taxes incluses.</p>
                        </div>

                        {/* Size selector */}
                        <div style={{ marginTop: "32px" }}>
                            <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>Taille</p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            border: selectedSize === size ? "2px solid black" : "1px solid #d1d5db",
                                            borderRadius: "10px",
                                            fontSize: "12px",
                                            letterSpacing: "0.05em",
                                            backgroundColor: selectedSize === size ? "black" : "white",
                                            color: selectedSize === size ? "white" : "black",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>Sélectionnez une taille</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div style={{ marginTop: "28px" }}>
                            <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>Quantité</p>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                border: "1px solid #d1d5db",
                                borderRadius: "999px",
                                overflow: "hidden",
                            }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ padding: "14px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ width: "48px", textAlign: "center", fontSize: "16px", fontWeight: 500 }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ padding: "14px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Add to cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                            style={{
                                marginTop: "32px",
                                width: "100%",
                                padding: "18px 0",
                                fontSize: "15px",
                                fontWeight: 500,
                                letterSpacing: "0.03em",
                                borderRadius: "12px",
                                border: "none",
                                cursor: selectedSize ? "pointer" : "not-allowed",
                                backgroundColor: selectedSize ? "#1a1a2e" : "#e5e7eb",
                                color: selectedSize ? "white" : "#9ca3af",
                                transition: "all 0.3s",
                            }}
                        >
                            Ajouter au panier
                        </button>

                        {/* Accordion sections with icons - like Le Club */}
                        <div className="mt-10 border-t border-gray-200">
                            {/* Entretiens */}
                            <details className="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                                <summary style={{ paddingTop: "24px", paddingBottom: "24px" }} className="cursor-pointer flex items-center justify-between list-none select-none">
                                    <div className="flex items-center gap-3">
                                        <Shirt size={18} strokeWidth={1.5} className="text-gray-600" />
                                        <span className="text-sm font-medium">Entretiens</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        strokeWidth={1.5}
                                        className="text-gray-400 group-open:rotate-180 transition-transform duration-300"
                                    />
                                </summary>
                                <div className="text-sm text-gray-500 pb-6 leading-relaxed space-y-1.5">
                                    <p>Lavage en machine à 30°C, à l&apos;envers.</p>
                                    <p>Ne pas utiliser de sèche-linge.</p>
                                    <p>Repassage à basse température si nécessaire.</p>
                                </div>
                            </details>

                            {/* Livraisons */}
                            <details className="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                                <summary style={{ paddingTop: "24px", paddingBottom: "24px" }} className="cursor-pointer flex items-center justify-between list-none select-none">
                                    <div className="flex items-center gap-3">
                                        <Truck size={18} strokeWidth={1.5} className="text-gray-600" />
                                        <span className="text-sm font-medium">Livraisons</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        strokeWidth={1.5}
                                        className="text-gray-400 group-open:rotate-180 transition-transform duration-300"
                                    />
                                </summary>
                                <div className="text-sm text-gray-500 pb-6 leading-relaxed space-y-1.5">
                                    <p>Livraison gratuite dès 100€ d&apos;achat.</p>
                                    <p>Expédition sous 2-3 jours ouvrés.</p>
                                    <p>Retours gratuits sous 14 jours.</p>
                                </div>
                            </details>

                            {/* Sizing */}
                            <details className="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                                <summary style={{ paddingTop: "24px", paddingBottom: "24px" }} className="cursor-pointer flex items-center justify-between list-none select-none">
                                    <div className="flex items-center gap-3">
                                        <Ruler size={18} strokeWidth={1.5} className="text-gray-600" />
                                        <span className="text-sm font-medium">Sizing</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        strokeWidth={1.5}
                                        className="text-gray-400 group-open:rotate-180 transition-transform duration-300"
                                    />
                                </summary>
                                <div className="text-sm text-gray-500 pb-6 leading-relaxed space-y-1.5">
                                    <p>S — Tour de poitrine: 96cm</p>
                                    <p>M — Tour de poitrine: 102cm</p>
                                    <p>L — Tour de poitrine: 108cm</p>
                                    <p>XL — Tour de poitrine: 114cm</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-border">
                        <h2 className="heading-md mb-8">Vous aimerez aussi</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {related.map((p) => (
                                <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                                    <div className="relative aspect-square overflow-hidden bg-surface mb-3">
                                        <Image
                                            src={p.images[0]}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <h3 className="text-xs tracking-[0.1em] uppercase font-light">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs tracking-wider text-muted mt-1">
                                        €{p.price.toFixed(2)} EUR
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
