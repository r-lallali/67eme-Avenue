"use client";

import { ChevronDown } from "lucide-react";

const faqCategories = [
    {
        title: "PRODUITS",
        items: [
            {
                question: "Comment choisir ma taille ?",
                answer: "Nos vêtements sont taillés en coupe oversize. Si vous hésitez entre deux tailles, nous vous recommandons de prendre la taille inférieure pour un fit plus ajusté, ou la taille supérieure pour un look plus ample.",
            },
            {
                question: "Comment entretenir mes vêtements RALYS ?",
                answer: "Nous recommandons un lavage en machine à 30°C, à l'envers, avec des couleurs similaires. Ne pas utiliser de sèche-linge. Un repassage à basse température est possible si nécessaire.",
            },
            {
                question: "Allez-vous restocker d'anciens produits ?",
                answer: "Certaines pièces signature peuvent être restockées, mais la majorité de nos collections sont des éditions limitées (drops). Inscrivez-vous à la newsletter pour ne rien rater.",
            },
            {
                question: "Comment connaître les dimensions des articles ?",
                answer: "Les dimensions sont indiquées dans la description du produit sur le site internet. Si vous souhaitez plus de détails, veuillez contacter le service client.",
            }
        ]
    },
    {
        title: "LIVRAISON",
        items: [
            {
                question: "Quels sont les délais de livraison ?",
                answer: "La livraison standard prend 3 à 5 jours ouvrés en France métropolitaine. La livraison express est disponible sous 1 à 2 jours ouvrés.",
            },
            {
                question: "J'ai commandé il y a un certain temps, mais je n'ai pas encore reçu mon colis ?",
                answer: "Si votre colis n'est pas arrivé dans les délais annoncés, veuillez vérifier votre numéro de suivi. Si le problème persiste, contactez notre service client avec votre numéro de commande.",
            },
            {
                question: "Proposez-vous la livraison internationale ?",
                answer: "Oui, nous livrons dans toute l'Union Européenne et à l'international. Les délais et frais de livraison varient selon le pays de destination.",
            },
        ]
    },
    {
        title: "RETOUR / ECHANGE",
        items: [
            {
                question: "Puis-je faire un retour ou un échange ?",
                answer: "Oui, vous disposez de 14 jours après réception pour retourner un article. L'article doit être dans son état d'origine, non porté et avec ses étiquettes.",
            },
            {
                question: "Comment puis-je retourner un article ?",
                answer: "Pour initier un retour, veuillez contacter notre service client par e-mail. Nous vous enverrons une étiquette de retour prépayée. Les retours sont gratuits en France métropolitaine.",
            },
            {
                question: "Quels sont les délais de remboursement ?",
                answer: "Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification de l'article retourné.",
            }
        ]
    }
];

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <div className="flex justify-center px-6 sm:px-8" style={{ paddingLeft: 24, paddingRight: 24 }}>
                <div className="w-full max-w-[720px] py-20 sm:py-32">

                    {/* Title */}
                    <h1 className="text-[40px] sm:text-[52px] font-light tracking-wide mb-12">
                        F.A.Q.
                    </h1>

                    {/* Subtitle */}
                    <div className="text-center mb-20">
                        <p className="text-sm font-semibold tracking-wider">
                            Des questions ?
                        </p>
                    </div>

                    {/* Categories & Accordions */}
                    <div className="space-y-20">
                        {faqCategories.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h2 className="text-base font-bold tracking-wider mb-4" style={{ paddingBottom: "10px", paddingTop: "30px" }}>
                                    {category.title}
                                </h2>
                                <div className="border-t border-gray-200">
                                    {category.items.map((item, itemIndex) => (
                                        <details
                                            key={itemIndex}
                                            className="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden"
                                        >
                                            <summary style={{ paddingTop: "12px", paddingBottom: "12px" }} className="text-sm tracking-wide cursor-pointer flex items-center justify-between gap-4 list-none select-none">
                                                <span>{item.question}</span>
                                                <ChevronDown
                                                    size={16}
                                                    strokeWidth={1.5}
                                                    className="flex-shrink-0 group-open:rotate-180 transition-transform duration-300 text-gray-400"
                                                />
                                            </summary>
                                            <div className="text-sm text-gray-500 tracking-wide pb-6 pr-8 leading-relaxed" style={{ paddingBottom: "20px" }}>
                                                {item.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
