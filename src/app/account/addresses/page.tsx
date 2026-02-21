"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Plus, X } from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

export default function AddressesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const initialFormState = {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        country: "France",
        phone: "",
        isDefault: false,
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/account/addresses");
        }
    }, [status, router]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error("Error fetching addresses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchAddresses();
        }
    }, [status]);

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p style={{ fontSize: "14px", color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Chargement...</p>
            </div>
        );
    }

    const openModal = (address?: any) => {
        if (address) {
            setForm({
                firstName: address.firstName,
                lastName: address.lastName,
                address: address.address,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
                phone: address.phone,
                isDefault: address.isDefault,
            });
            setEditingId(address.id);
        } else {
            setForm(initialFormState);
            setEditingId(null);
        }
        setFormError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");

        try {
            const url = editingId ? `/api/user/addresses/${editingId}` : "/api/user/addresses";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Une erreur est survenue");
            }

            await fetchAddresses();
            closeModal();
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;

        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error("Error deleting address", error);
        }
    };

    const handleSetDefault = async (address: any) => {
        if (address.isDefault) return;

        try {
            const res = await fetch(`/api/user/addresses/${address.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...address, isDefault: true }),
            });

            if (res.ok) {
                await fetchAddresses();
            }
        } catch (error) {
            console.error("Error setting default address", error);
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

    return (
        <div className="min-h-screen bg-white text-black flex justify-center">
            <div className="w-full relative" style={{ maxWidth: "1000px", padding: "0 24px", paddingTop: "60px", paddingBottom: "100px" }}>

                {/* Header Section */}
                <div style={{ paddingBottom: "32px", marginBottom: "48px", borderBottom: "1px solid #e5e7eb" }}>
                    <button
                        onClick={() => router.push("/account")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#6b7280",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            marginBottom: "24px",
                            padding: 0,
                            transition: "color 0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
                    >
                        <ChevronLeft size={14} />
                        Retour au compte
                    </button>

                    <h1 style={{ fontSize: "28px", fontWeight: 300, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                        Mes Adresses
                    </h1>
                </div>

                {loading ? (
                    <p style={{ fontSize: "14px", color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>Chargement des adresses...</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {addresses.length === 0 ? (
                            <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "12px" }}>Vous n'avez pas encore d'adresse enregistrée.</p>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} style={{ border: addr.isDefault ? "1px solid #1a1a2e" : "1px solid #e5e7eb", borderRadius: "12px", padding: "32px", position: "relative" }}>
                                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            {addr.isDefault && <MapPin size={18} color="#1a1a2e" strokeWidth={1.5} />}
                                            <h2 style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                                {addr.firstName} {addr.lastName}
                                            </h2>
                                        </div>
                                        {addr.isDefault && (
                                            <span style={{ fontSize: "10px", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "100px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#374151" }}>
                                                Principale
                                            </span>
                                        )}
                                    </div>

                                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151", margin: 0 }}>
                                        {addr.address}<br />
                                        {addr.zipCode} {addr.city}<br />
                                        {addr.country}
                                    </p>
                                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", margin: 0 }}>
                                        {addr.phone}
                                    </p>

                                    <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f3f4f6", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                        <button onClick={() => openModal(addr)} style={{ fontSize: "13px", color: "#000", textDecoration: "underline", textUnderlineOffset: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(addr.id)} style={{ fontSize: "13px", color: "#dc2626", textDecoration: "underline", textUnderlineOffset: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                            Supprimer
                                        </button>
                                        {!addr.isDefault && (
                                            <button onClick={() => handleSetDefault(addr)} style={{ fontSize: "13px", color: "#6b7280", textDecoration: "underline", textUnderlineOffset: "4px", background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}>
                                                Définir par défaut
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add New Address Button */}
                        <button
                            onClick={() => openModal()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                border: "1px dashed #d1d5db",
                                borderRadius: "12px",
                                padding: "32px",
                                backgroundColor: "#fafafa",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                width: "100%",
                                marginTop: "12px"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = "#000";
                                e.currentTarget.style.backgroundColor = "#fff";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = "#d1d5db";
                                e.currentTarget.style.backgroundColor = "#fafafa";
                            }}
                        >
                            <Plus size={18} color="#6b7280" strokeWidth={1.5} />
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>Ajouter une nouvelle adresse</span>
                        </button>
                    </div>
                )}

                {/* Modal for Add / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ padding: "40px" }}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                    {editingId ? "Modifier l'adresse" : "Nouvelle adresse"}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {formError && (
                                <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" }}>
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 relative z-50" style={{ marginBottom: "20px" }}>
                                    <div style={{ paddingRight: "10px" }}>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="firstName"
                                            label="Prénom"
                                            value={form.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }}>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="lastName"
                                            label="Nom"
                                            value={form.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="relative z-40" style={{ marginBottom: "20px" }}>
                                    <AddressAutocomplete
                                        required
                                        name="address"
                                        label="Adresse (Numéro et nom de rue...)"
                                        value={form.address}
                                        onChange={handleChange}
                                        mode="address"
                                        onAddressSelect={(data) => {
                                            setForm(prev => ({
                                                ...prev,
                                                address: data.address,
                                                city: data.city || prev.city,
                                                zipCode: data.zipCode || prev.zipCode
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 relative z-30" style={{ marginBottom: "20px" }}>
                                    <div style={{ paddingRight: "10px" }}>
                                        <FloatingInput
                                            required
                                            type="text"
                                            name="zipCode"
                                            label="Code postal"
                                            value={form.zipCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }}>
                                        <AddressAutocomplete
                                            required
                                            name="city"
                                            label="Ville"
                                            value={form.city}
                                            onChange={handleChange}
                                            mode="city"
                                            onAddressSelect={(data) => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    city: data.city,
                                                    zipCode: data.zipCode || prev.zipCode
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ marginBottom: "20px" }}>
                                    <div style={{ paddingRight: "10px" }}>
                                        <FloatingSelect
                                            name="country"
                                            label="Pays/région"
                                            value={form.country}
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
                                    <div style={{ paddingLeft: "10px" }}>
                                        <FloatingInput
                                            required
                                            type="tel"
                                            name="phone"
                                            label="Téléphone"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", marginBottom: "32px" }}>
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        name="isDefault"
                                        checked={form.isDefault}
                                        onChange={handleChange}
                                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                    <label htmlFor="isDefault" style={{ fontSize: "14px", color: "#374151", cursor: "pointer" }}>
                                        Définir comme adresse principale
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    style={{
                                        width: "100%",
                                        padding: "18px 0",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        letterSpacing: "0.03em",
                                        borderRadius: "12px",
                                        border: "none",
                                        cursor: formLoading ? "not-allowed" : "pointer",
                                        backgroundColor: "#1a1a2e",
                                        color: "white",
                                        transition: "all 0.3s",
                                        opacity: formLoading ? 0.7 : 1,
                                    }}
                                >
                                    {formLoading ? "ENREGISTREMENT..." : "ENREGISTRER L'ADRESSE"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
