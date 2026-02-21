"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function OrderTrackingPage() {
    const { status } = useSession();
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && params?.id) {
            const fetchOrder = async () => {
                try {
                    const res = await fetch(`/api/orders/${params.id}`);
                    const data = await res.json();

                    if (!res.ok) throw new Error(data.error);

                    setOrder(data.order);
                } catch (err: any) {
                    setError(err.message || "Impossible de charger la commande.");
                } finally {
                    setLoading(false);
                }
            };

            fetchOrder();
        }
    }, [status, params, router]);

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p style={{ fontSize: "14px", color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Chargement...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <p style={{ color: "#dc2626", marginBottom: "24px", fontSize: "15px" }}>{error || "Commande introuvable"}</p>
                <button
                    onClick={() => router.push("/account")}
                    style={{
                        padding: "16px 32px",
                        fontSize: "14px",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        borderRadius: "8px",
                        border: "1px solid #1a1a2e",
                        backgroundColor: "transparent",
                        color: "#1a1a2e",
                        transition: "all 0.3s",
                    }}
                >
                    RETOUR AU COMPTE
                </button>
            </div>
        );
    }

    const orderStatus = order.status;
    const steps = [
        { id: 'PENDING', label: 'En attente', icon: Clock },
        { id: 'CONFIRMED', label: 'Confirmée', icon: CheckCircle },
        { id: 'SHIPPED', label: 'Expédiée', icon: Truck },
        { id: 'DELIVERED', label: 'Livrée', icon: Package },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === orderStatus) || 1; // Default to confirmed if not found

    return (
        <div className="min-h-screen bg-white text-black flex justify-center">
            <div className="w-full" style={{ maxWidth: "900px", padding: "0 24px", paddingTop: "60px", paddingBottom: "100px" }}>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between" style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "24px", marginBottom: "48px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: 300, letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Commande #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: "80px", padding: "0 16px" }}>
                    <div className="relative">
                        <div style={{ height: "4px", backgroundColor: "#f3f4f6", borderRadius: "2px", marginBottom: "24px", overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                                    height: "100%",
                                    backgroundColor: "#1a1a2e",
                                    transition: "width 0.5s ease-in-out"
                                }}
                            />
                        </div>
                        <div className="flex justify-between w-full">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.id} className="flex flex-col items-center" style={{ width: "25%" }}>
                                        <div style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            width: "40px", height: "40px", borderRadius: "50%", marginBottom: "12px",
                                            border: `2px solid ${isCurrent ? '#1a1a2e' : isCompleted ? '#1a1a2e' : '#e5e7eb'}`,
                                            backgroundColor: isCurrent ? '#1a1a2e' : '#fff',
                                            color: isCurrent ? '#fff' : isCompleted ? '#1a1a2e' : '#d1d5db',
                                            transition: "all 0.3s"
                                        }}>
                                            <Icon size={18} strokeWidth={isCurrent ? 2 : 1.5} />
                                        </div>
                                        <span style={{
                                            fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500, textAlign: "center",
                                            color: isCompleted ? '#000' : '#9ca3af'
                                        }}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
                    {/* Articles */}
                    <div className="flex-1 w-full" style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px", backgroundColor: "#fafafa" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
                            Articles commandés
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                            {order.items.map((item: any) => (
                                <div key={item.id} style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "24px" }}>
                                    <div style={{ position: "relative", width: "80px", height: "100px", backgroundColor: "#fff", border: "1px solid #f3f4f6", flexShrink: 0, borderRadius: "6px", overflow: "hidden" }}>
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div style={{ flex: 1, paddingTop: "4px" }}>
                                        <h3 style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px" }}>
                                            {item.product.name}
                                        </h3>
                                        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>Taille : {item.size}</p>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <p style={{ fontSize: "13px", color: "#6b7280" }}>Qté : {item.quantity}</p>
                                            <p style={{ fontSize: "14px", fontWeight: 500 }}>{item.price.toFixed(2)} €</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px", fontWeight: 500 }}>
                                <span>Total</span>
                                <span>{order.total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Livraison */}
                    <div className="w-full md:w-[360px]" style={{ padding: "32px", borderRadius: "12px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "32px" }}>
                            Informations de livraison
                        </h2>

                        <div style={{ marginBottom: "32px" }}>
                            <h3 style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Adresse</h3>
                            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#111827", margin: 0 }}>
                                {order.shippingFirstName} {order.shippingLastName}<br />
                                {order.shippingAddress}<br />
                                {order.shippingZipCode} {order.shippingCity}<br />
                                {order.shippingCountry}
                            </p>
                            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", margin: 0 }}>
                                {order.shippingPhone}
                            </p>
                        </div>

                        <div style={{ paddingTop: "32px", borderTop: "1px solid #f3f4f6" }}>
                            <h3 style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Expédition</h3>
                            <p style={{ fontSize: "14px", color: "#10b981", fontWeight: 500, margin: 0 }}>
                                LIVRAISON STANDARD — 5 à 7 jours ouvrés
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "80px", textAlign: "center" }}>
                    <button
                        onClick={() => router.push("/account")}
                        style={{
                            fontSize: "14px",
                            letterSpacing: "0.05em",
                            textDecoration: "underline",
                            textUnderlineOffset: "4px",
                            color: "#6b7280",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
                    >
                        RETOURNER À MON COMPTE
                    </button>
                </div>
            </div>
        </div>
    );
}
