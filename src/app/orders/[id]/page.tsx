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
                <p className="text-sm text-gray-400 tracking-wider">CHARGEMENT...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <p className="text-red-600 mb-6">{error || "Commande introuvable"}</p>
                <button
                    onClick={() => router.push("/account")}
                    className="px-8 py-3 border border-black text-sm tracking-wider hover:bg-black hover:text-white transition-colors"
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
        <div className="min-h-screen bg-white text-black py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-12 border-b border-gray-200 pb-6">
                    <h1 className="text-2xl sm:text-3xl font-light tracking-widest uppercase">
                        Commande #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Timeline */}
                <div className="mb-16">
                    <div className="relative">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                            <div
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500"
                            ></div>
                        </div>
                        <div className="flex justify-between w-full">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.id} className="flex flex-col items-center w-1/4">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 border-2 transition-colors ${isCurrent ? 'bg-black text-white border-black' :
                                                isCompleted ? 'bg-white text-black border-black' :
                                                    'bg-white text-gray-300 border-gray-200'
                                            }`}>
                                            <Icon size={14} strokeWidth={isCurrent ? 2 : 1.5} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs tracking-wider uppercase font-medium text-center ${isCompleted ? 'text-black' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Articles */}
                    <div>
                        <h2 className="text-sm tracking-[0.15em] uppercase font-semibold mb-6">
                            Articles commandés
                        </h2>
                        <div className="space-y-6">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xs tracking-wider uppercase font-medium mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">Taille : {item.size}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
                                            <p className="text-sm font-medium">{item.price.toFixed(2)} €</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center text-lg font-medium">
                                <span>Total</span>
                                <span>{order.total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Livraison */}
                    <div className="bg-gray-50 p-8 rounded-sm">
                        <h2 className="text-sm tracking-[0.15em] uppercase font-semibold mb-6">
                            Informations de livraison
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Adresse</h3>
                                <p className="text-sm leading-relaxed">
                                    {order.shippingFirstName} {order.shippingLastName}<br />
                                    {order.shippingAddress}<br />
                                    {order.shippingZipCode} {order.shippingCity}<br />
                                    {order.shippingCountry}
                                </p>
                                <p className="text-sm mt-2 text-gray-600">
                                    {order.shippingPhone}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expédition</h3>
                                <p className="text-sm text-green-600 font-medium">
                                    LIVRAISON STANDARD — 5 à 7 jours ouvrés
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => router.push("/account")}
                        className="text-sm tracking-wider underline underline-offset-4 text-gray-500 hover:text-black transition-colors"
                    >
                        RETOURNER À MON COMPTE
                    </button>
                </div>
            </div>
        </div>
    );
}
