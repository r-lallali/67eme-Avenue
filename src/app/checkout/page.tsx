"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/lib/store";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [form, setForm] = useState({
        shippingFirstName: "",
        shippingLastName: "",
        shippingAddress: "",
        shippingCity: "",
        shippingZipCode: "",
        shippingCountry: "France",
        shippingPhone: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        }
    }, [status, router]);

    // Pre-fill name from session if available
    useEffect(() => {
        if (session?.user?.name) {
            const parts = session.user.name.split(" ");
            setForm((prev) => ({
                ...prev,
                shippingFirstName: parts[0] || "",
                shippingLastName: parts.slice(1).join(" ") || "",
            }));
        }
    }, [session]);

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-sm text-gray-400">Chargement...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <p className="text-lg mb-6">Votre panier est vide.</p>
                <button
                    onClick={() => router.push("/collections/all")}
                    className="px-8 py-4 bg-black text-white text-sm tracking-wider hover:opacity-80 transition-opacity"
                >
                    CONTINUER MES ACHATS
                </button>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.id,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                    shippingAddress: {
                        firstName: form.shippingFirstName,
                        lastName: form.shippingLastName,
                        address: form.shippingAddress,
                        city: form.shippingCity,
                        zipCode: form.shippingZipCode,
                        country: form.shippingCountry,
                        phone: form.shippingPhone,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue");
            }

            clearCart();
            router.push(`/orders/${data.orderId}`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-light tracking-widest uppercase mb-12 border-b border-gray-200 pb-6">
                    Finaliser la commande
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left side: Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Livraison section */}
                            <div>
                                <h2 className="text-lg font-medium tracking-wide mb-6">
                                    1. Adresse de livraison
                                </h2>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Prénom</label>
                                        <input
                                            required
                                            type="text"
                                            name="shippingFirstName"
                                            value={form.shippingFirstName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Nom</label>
                                        <input
                                            required
                                            type="text"
                                            name="shippingLastName"
                                            value={form.shippingLastName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs text-gray-500 mb-1">Adresse complète</label>
                                    <input
                                        required
                                        type="text"
                                        name="shippingAddress"
                                        value={form.shippingAddress}
                                        onChange={handleChange}
                                        placeholder="Numéro et nom de rue, bâtiment, appartement..."
                                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Code postal</label>
                                        <input
                                            required
                                            type="text"
                                            name="shippingZipCode"
                                            value={form.shippingZipCode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Ville</label>
                                        <input
                                            required
                                            type="text"
                                            name="shippingCity"
                                            value={form.shippingCity}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Pays</label>
                                        <select
                                            name="shippingCountry"
                                            value={form.shippingCountry}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors bg-white"
                                        >
                                            <option value="France">France</option>
                                            <option value="Belgique">Belgique</option>
                                            <option value="Suisse">Suisse</option>
                                            <option value="Luxembourg">Luxembourg</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Téléphone</label>
                                        <input
                                            required
                                            type="tel"
                                            name="shippingPhone"
                                            value={form.shippingPhone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Paiement section factice */}
                            <div className="pt-8 border-t border-gray-200">
                                <h2 className="text-lg font-medium tracking-wide mb-6">
                                    2. Paiement
                                </h2>
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-200 text-center">
                                    <p className="text-sm text-gray-600 mb-2">Aucun paiement n'est requis.</p>
                                    <p className="text-xs text-gray-500">
                                        Il s'agit d'une commande de démonstration. Vous recevrez un email de confirmation.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 mt-8 text-sm tracking-widest font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "TRAITEMENT..." : "CONFIRMER LA COMMANDE"}
                            </button>
                        </form>
                    </div>

                    {/* Right side: Recaps */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-medium tracking-wide mb-6 border-b border-gray-200 pb-4">
                                Résumé de la commande
                            </h2>

                            <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id + item.size} className="flex gap-4">
                                        <div className="relative w-20 h-24 bg-white border border-gray-100 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-semibold tracking-wider uppercase mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-2">Taille: {item.size}</p>
                                            <p className="text-sm">{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Sous-total</span>
                                    <span>{total().toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Livraison standard (5-7 jours)</span>
                                    <span className="text-green-600 font-medium">Offerte</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>{total().toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
