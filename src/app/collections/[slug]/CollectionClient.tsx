"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/data";

export default function CollectionClient({
    products,
    categoryName,
    categoryDescription,
}: {
    products: Product[];
    categoryName: string;
    categoryDescription: string;
}) {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="py-12 sm:py-16 px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="heading-xl"
                >
                    {categoryName}
                </motion.h1>
                {categoryDescription && (
                    <p className="body-text text-muted mt-3 max-w-md mx-auto">
                        {categoryDescription}
                    </p>
                )}
            </div>

            {/* Product grid */}
            <div className="max-w-7xl mx-auto py-8 sm:py-12" style={{ paddingLeft: 24, paddingRight: 24 }}>
                {products.length === 0 ? (
                    <p className="text-center text-muted body-text py-20">
                        Aucun produit dans cette catégorie pour le moment.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
