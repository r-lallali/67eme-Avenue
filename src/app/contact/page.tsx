"use client";

import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "+33",
        message: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "phone") {
            // Prevent deleting the +33 prefix if it's the only thing left or user is backspacing into it
            if (!value.startsWith("+33")) {
                setForm({ ...form, phone: "+33" });
                return;
            }
        }

        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Strict frontend validation
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError("Veuillez saisir une adresse email valide.");
            return;
        }

        // Phone validation
        const phoneStr = form.phone.replace(/\s+/g, '');
        const phoneRegex = /^\+33[1-9]\d{8}$/;
        if (!phoneRegex.test(phoneStr)) {
            setError("Le numéro de téléphone doit être sous la forme +33 suivi de 9 chiffres (ex: +33612345678).");
            return;
        }

        setError("");

        // Form would typically be sent to an API here
        console.log("Formulaire valide prêt à être envoyé:", form);

        // Simulate success
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);

        // Reset form
        setForm({
            name: "",
            email: "",
            phone: "+33",
            message: "",
        });
    };

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const isPhoneValid = /^\+33[1-9]\d{8}$/.test(form.phone.replace(/\s+/g, ''));
    const isFormValid = form.name.trim() !== "" && isEmailValid && isPhoneValid && form.message.trim() !== "";

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="flex justify-center" style={{ padding: "0 24px" }}>
                <div className="w-full" style={{ maxWidth: "720px", paddingTop: "0px", paddingBottom: "80px" }}>

                    {/* Title */}
                    <h1 style={{ fontSize: "52px", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "48px", textAlign: "center" }}>
                        CONTACT
                    </h1>

                    {/* Subtitle */}
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em" }}>
                            Contactez-nous
                        </h2>
                    </div>

                    {/* Description */}
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.8, letterSpacing: "0.03em", maxWidth: "480px", margin: "0 auto" }}>
                            Besoin de changer de taille ? Une erreur dans votre commande ?
                            Ou simplement une question sur un produit ? N&apos;hésitez pas
                            à nous écrire, nous vous guiderons dans les démarches à suivre :)
                        </p>
                    </div>

                    {/* Email */}
                    <p style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.03em", marginBottom: "40px", textAlign: "center" }}>
                        contact@shop.ralys.ovh
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{ backgroundColor: "#f0fdf4", color: "#166534", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px" }}>
                                Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.
                            </div>
                        )}

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <input
                                required
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={form.name}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "10px",
                                    padding: "16px",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "transparent",
                                }}
                            />
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={form.email}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "10px",
                                    padding: "16px",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "transparent",
                                }}
                            />
                        </div>

                        <input
                            required
                            type="tel"
                            name="phone"
                            placeholder="Numéro de téléphone"
                            value={form.phone}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                border: "1px solid #e5e7eb",
                                borderRadius: "10px",
                                padding: "16px",
                                fontSize: "14px",
                                outline: "none",
                                backgroundColor: "transparent",
                                marginBottom: "20px",
                            }}
                        />

                        <textarea
                            required
                            name="message"
                            rows={6}
                            placeholder="Commentaire"
                            value={form.message}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                border: "1px solid #e5e7eb",
                                borderRadius: "10px",
                                padding: "16px",
                                fontSize: "14px",
                                outline: "none",
                                backgroundColor: "transparent",
                                resize: "none",
                                marginBottom: "28px",
                            }}
                        />

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            style={{
                                width: "100%",
                                padding: "18px 0",
                                fontSize: "15px",
                                fontWeight: 500,
                                letterSpacing: "0.03em",
                                borderRadius: "12px",
                                border: "none",
                                cursor: isFormValid ? "pointer" : "not-allowed",
                                backgroundColor: isFormValid ? "black" : "#e5e7eb",
                                color: isFormValid ? "white" : "#9ca3af",
                                transition: "all 0.3s",
                            }}
                        >
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
