"use client";

import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } =
        useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                            <h2 className="text-sm tracking-[0.2em] uppercase font-light flex items-center gap-2">
                                <ShoppingBag size={16} strokeWidth={1.5} />
                                Panier ({items.length})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-1 hover:opacity-50 transition-opacity"
                            >
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag
                                        size={40}
                                        strokeWidth={1}
                                        className="text-muted mb-4"
                                    />
                                    <p className="text-sm tracking-wider text-muted">
                                        Votre panier est vide
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.id}-${item.size}`}
                                            className="flex gap-4"
                                        >
                                            <div className="w-20 h-20 bg-surface flex-shrink-0 relative overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs tracking-wider uppercase font-medium truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-muted mt-1 tracking-wider">
                                                    Taille: {item.size}
                                                </p>
                                                <p className="text-xs tracking-wider mt-1">
                                                    €{item.price.toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.size,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="p-0.5 hover:opacity-50 transition-opacity"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs tracking-wider w-4 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.size,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="p-0.5 hover:opacity-50 transition-opacity"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="ml-auto p-0.5 text-muted hover:text-foreground transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-border px-6 py-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs tracking-[0.15em] uppercase font-light">
                                        Total
                                    </span>
                                    <span className="text-sm tracking-wider font-medium">
                                        €{total().toFixed(2)} EUR
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        closeCart();
                                        window.location.href = "/checkout";
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "18px 0",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        letterSpacing: "0.03em",
                                        border: "none",
                                        cursor: "pointer",
                                        backgroundColor: "#000000ff",
                                        color: "white",
                                        transition: "all 0.3s",
                                    }}
                                >
                                    Commander
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
