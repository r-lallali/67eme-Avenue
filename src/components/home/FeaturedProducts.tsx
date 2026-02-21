"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts({ products }: { products: Product[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollTo = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const cardWidth = container.offsetWidth / (window.innerWidth >= 768 ? 3 : 1.5);
        const newIndex =
            direction === "left"
                ? Math.max(0, currentIndex - 1)
                : Math.min(products.length - 1, currentIndex + 1);
        setCurrentIndex(newIndex);
        container.scrollTo({
            left: cardWidth * newIndex,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-12 sm:py-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 24 }}>
                    <h2 className="heading-md" style={{ paddingBottom: 24 }}>Collection</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs tracking-wider text-muted">
                            {currentIndex + 1}/{products.length}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollTo("left")}
                                className="p-2 border border-border hover:border-foreground transition-colors"
                                aria-label="Précédent"
                            >
                                <ChevronLeft size={14} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={() => scrollTo("right")}
                                className="p-2 border border-border hover:border-foreground transition-colors"
                                aria-label="Suivant"
                            >
                                <ChevronRight size={14} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
                    style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-[30vw] lg:w-[23vw]"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
