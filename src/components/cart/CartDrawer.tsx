"use client";

import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } =
        useCartStore();
    const router = useRouter();

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
                        <div className="flex items-center justify-between" style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
                            <h2 className="text-sm tracking-[0.2em] uppercase flex items-center gap-2" style={{ fontWeight: 400 }}>
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
                        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: "16px 24px" }}>
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag
                                        size={40}
                                        strokeWidth={1}
                                        style={{ color: "#9ca3af", marginBottom: "16px" }}
                                    />
                                    <p className="text-sm tracking-wider" style={{ color: "#9ca3af" }}>
                                        Votre panier est vide
                                    </p>
                                </div>
                            ) : (
                                <div style={{ paddingBottom: "24px" }}>
                                    {items.map((item, index) => (
                                        <div
                                            key={`${item.id}-${item.size}`}
                                            className="flex gap-4"
                                            style={{
                                                paddingBottom: "24px",
                                                marginBottom: index !== items.length - 1 ? "24px" : "0",
                                                borderBottom: index !== items.length - 1 ? "1px solid #e5e7eb" : "none"
                                            }}
                                        >
                                            <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: "#f9fafb" }}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <div>
                                                    <h3 className="text-xs tracking-wider uppercase font-medium truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs tracking-wider" style={{ color: "#6b7280", marginTop: "4px" }}>
                                                        Taille: {item.size}
                                                    </p>
                                                    <p className="text-xs tracking-wider mt-1">
                                                        {item.price.toFixed(2)} €
                                                    </p>
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <div className="flex items-center gap-3">
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
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="ml-auto p-0.5 hover:opacity-50 transition-colors"
                                                        style={{ color: "#9ca3af", transition: "color 0.2s" }}
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
                            <div style={{ borderTop: "1px solid #e5e7eb", padding: "20px 24px" }}>
                                <div className="flex items-center justify-between" style={{ paddingBottom: "16px" }}>
                                    <span style={{ fontSize: "14px", color: "#6b7280" }}>
                                        Sous-total
                                    </span>
                                    <span style={{ fontSize: "14px", color: "#000" }}>
                                        {total().toFixed(2)} €
                                    </span>
                                </div>
                                <div className="flex items-center justify-between" style={{ paddingBottom: "24px" }}>
                                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                                        Taxes et livraison calculées à l'étape suivante
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        closeCart();
                                        router.push("/checkout");
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "16px 0",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        letterSpacing: "0.05em",
                                        border: "none",
                                        cursor: "pointer",
                                        backgroundColor: "black",
                                        color: "white",
                                        transition: "opacity 0.3s",
                                        borderRadius: "8px",
                                    }}
                                    className="hover:opacity-80"
                                >
                                    PASSER LA COMMANDE
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
