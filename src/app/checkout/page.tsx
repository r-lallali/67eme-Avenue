"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, total, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [addresses, setAddresses] = useState<any[]>([]);

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
                shippingFirstName: prev.shippingFirstName || parts[0] || "",
                shippingLastName: prev.shippingLastName || parts.slice(1).join(" ") || "",
            }));
        }
    }, [session]);

    // Fetch user addresses
    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user/addresses")
                .then(res => res.json())
                .then(data => {
                    if (data.addresses && data.addresses.length > 0) {
                        setAddresses(data.addresses);

                        // Auto-fill default address
                        const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
                        setForm({
                            shippingFirstName: defaultAddr.firstName,
                            shippingLastName: defaultAddr.lastName,
                            shippingAddress: defaultAddr.address,
                            shippingCity: defaultAddr.city,
                            shippingZipCode: defaultAddr.zipCode,
                            shippingCountry: defaultAddr.country,
                            shippingPhone: defaultAddr.phone,
                        });
                    }
                })
                .catch(err => console.error("Could not fetch addresses:", err));
        }
    }, [status]);

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
                <p style={{ fontSize: "16px", marginBottom: "32px", color: "#6b7280" }}>Votre panier est vide.</p>
                <button
                    onClick={() => router.push("/collections/all")}
                    style={{
                        padding: "16px 32px",
                        fontSize: "14px",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        borderRadius: "8px",
                        backgroundColor: "#1a1a2e",
                        color: "white",
                        transition: "opacity 0.3s",
                    }}
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

    const inputStyle = {
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        fontSize: "14px",
        outline: "none",
        backgroundColor: "transparent",
        transition: "border-color 0.2s"
    };

    const labelStyle = {
        display: "block",
        fontSize: "12px",
        fontWeight: 500,
        color: "#6b7280",
        marginBottom: "8px",
        letterSpacing: "0.03em"
    };

    return (
        <div className="min-h-screen bg-white text-black flex justify-center">
            <div className="w-full" style={{ maxWidth: "1000px", padding: "0 24px", paddingTop: "60px", paddingBottom: "100px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "48px", textTransform: "uppercase" }}>
                    Finaliser la commande
                </h1>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left side: Form */}
                    <div className="flex-1 w-full lg:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Livraison section */}
                            <div>
                                <h2 style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.05em", marginBottom: "32px", textTransform: "uppercase" }}>
                                    1. Adresse de livraison
                                </h2>

                                {addresses.length > 0 && (
                                    <div className="mb-8">
                                        <FloatingSelect
                                            id="address-selector"
                                            label="Sélectionner une adresse enregistrée"
                                            options={[
                                                { label: "-- Utiliser une autre adresse --", value: "" },
                                                ...addresses.map((addr) => ({
                                                    label: `${addr.firstName} ${addr.lastName} - ${addr.address}, ${addr.city} ${addr.isDefault ? "(Principale)" : ""}`,
                                                    value: addr.id
                                                }))
                                            ]}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                if (selectedId) {
                                                    const addr = addresses.find(a => a.id === selectedId);
                                                    if (addr) {
                                                        setForm({
                                                            shippingFirstName: addr.firstName,
                                                            shippingLastName: addr.lastName,
                                                            shippingAddress: addr.address,
                                                            shippingCity: addr.city,
                                                            shippingZipCode: addr.zipCode,
                                                            shippingCountry: addr.country,
                                                            shippingPhone: addr.phone,
                                                        });
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" }}>
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="shippingFirstName"
                                            label="Prénom"
                                            value={form.shippingFirstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="shippingLastName"
                                            label="Nom"
                                            value={form.shippingLastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-5 relative z-40">
                                    <AddressAutocomplete
                                        required
                                        name="shippingAddress"
                                        label="Adresse (Numéro et nom de rue...)"
                                        value={form.shippingAddress}
                                        onChange={handleChange}
                                        mode="address"
                                        onAddressSelect={(data) => {
                                            setForm(prev => ({
                                                ...prev,
                                                shippingAddress: data.address,
                                                shippingCity: data.city || prev.shippingCity,
                                                shippingZipCode: data.zipCode || prev.shippingZipCode
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 relative z-30">
                                    <div>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="shippingZipCode"
                                            label="Code postal"
                                            value={form.shippingZipCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <AddressAutocomplete
                                            required
                                            name="shippingCity"
                                            label="Ville"
                                            value={form.shippingCity}
                                            onChange={handleChange}
                                            mode="city"
                                            onAddressSelect={(data) => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    shippingCity: data.city,
                                                    shippingZipCode: data.zipCode || prev.shippingZipCode
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <FloatingSelect
                                            name="shippingCountry"
                                            label="Pays/région"
                                            value={form.shippingCountry}
                                            onChange={handleChange}
                                            options={[
                                                { label: "France", value: "France" },
                                                { label: "Belgique", value: "Belgique" },
                                                { label: "Suisse", value: "Suisse" },
                                                { label: "Luxembourg", value: "Luxembourg" },
                                                { label: "Canada", value: "Canada" },
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <FloatingInput
                                            required
                                            type="tel"
                                            name="shippingPhone"
                                            label="Téléphone"
                                            value={form.shippingPhone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Paiement section factice */}
                            <div style={{ paddingTop: "12px" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.05em", marginBottom: "32px", textTransform: "uppercase" }}>
                                    2. Paiement
                                </h2>
                                <div style={{ backgroundColor: "#f9fafb", padding: "32px 24px", borderRadius: "10px", border: "1px solid #f3f4f6", textAlign: "center" }}>
                                    <p style={{ fontSize: "15px", color: "#374151", marginBottom: "8px", fontWeight: 500 }}>
                                        Aucun paiement n'est requis.
                                    </p>
                                    <p style={{ fontSize: "13px", color: "#6b7280" }}>
                                        Il s'agit d'une commande de démonstration. Vous recevrez un email de confirmation récapitulatif avec l'expédition.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "18px 0",
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    letterSpacing: "0.03em",
                                    borderRadius: "12px",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    backgroundColor: "#1a1a2e",
                                    color: "white",
                                    transition: "all 0.3s",
                                    opacity: loading ? 0.7 : 1,
                                    marginTop: "24px"
                                }}
                            >
                                {loading ? "TRAITEMENT EN COURS..." : "CONFIRMER LA COMMANDE"}
                            </button>
                        </form>
                    </div>

                    {/* Right side: Recaps */}
                    <div className="w-full lg:w-2/5 mt-12 lg:mt-0">
                        <div style={{ backgroundColor: "#fafafa", padding: "32px", borderRadius: "12px", border: "1px solid #f3f4f6", position: "sticky", top: "40px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.05em", marginBottom: "32px", textTransform: "uppercase", paddingBottom: "24px", borderBottom: "1px solid #e5e7eb" }}>
                                Résumé
                            </h2>

                            <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "8px", marginBottom: "32px" }} className="scrollbar-none">
                                {items.map((item) => (
                                    <div key={item.id + item.size} style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                                        <div style={{ position: "relative", width: "80px", height: "100px", backgroundColor: "#fff", border: "1px solid #f3f4f6", flexShrink: 0, borderRadius: "6px", overflow: "hidden" }}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#1a1a2e", color: "white", fontSize: "10px", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1, paddingTop: "4px" }}>
                                            <h3 style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px" }}>
                                                {item.name}
                                            </h3>
                                            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Taille: {item.size}</p>
                                            <p style={{ fontSize: "14px", fontWeight: 500 }}>{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
                                    <span>Sous-total</span>
                                    <span style={{ color: "#000" }}>{total().toFixed(2)} €</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
                                    <span>Livraison standard (5-7 jours)</span>
                                    <span style={{ color: "#10b981", fontWeight: 500 }}>Offerte</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 500, paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
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
