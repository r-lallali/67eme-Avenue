"use client";

import React, { useState, useEffect, useRef } from "react";
import { FloatingInput } from "./FloatingInput";
import { Search, X } from "lucide-react";

interface AddressFeature {
    properties: {
        id: string;
        label: string;
        name: string;
        postcode: string;
        city: string;
        context: string;
        type: string;
    };
}

interface AddressAutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
    label: string;
    mode?: "address" | "city";
    onAddressSelect: (data: { address: string; zipCode: string; city: string; }) => void;
}

export const AddressAutocomplete = ({ label, mode = "address", onAddressSelect, value, onChange, ...props }: AddressAutocompleteProps) => {
    const [query, setQuery] = useState(value as string || "");
    const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync external value changes block
    useEffect(() => {
        if (value !== undefined && value !== query) {
            setQuery(value as string);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                // Determine API parameters
                let url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`;
                if (mode === "city") {
                    url += `&type=municipality`;
                }

                const response = await fetch(url);
                const data = await response.json();
                setSuggestions(data.features || []);
                if (data.features && data.features.length > 0) {
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Erreur gouv API:", error);
            }
        };

        const timeoutId = setTimeout(() => {
            if (document.activeElement?.id === props.id || document.activeElement?.getAttribute('name') === props.name) {
                fetchSuggestions();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, mode, props.id, props.name]);

    const handleSelect = (feature: AddressFeature) => {
        const { name, postcode, city, label } = feature.properties;

        let addressStr = "";
        let finalQuery = "";

        if (mode === "address") {
            addressStr = name;
            finalQuery = label;
        } else {
            addressStr = "";
            finalQuery = `${postcode} ${city}`;
        }

        setQuery(finalQuery);
        setIsOpen(false);
        onAddressSelect({ address: addressStr, zipCode: postcode, city: city });
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <FloatingInput
                {...props}
                label={label}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    if (onChange) onChange(e);
                }}
                onFocus={(e) => {
                    if (suggestions.length > 0) setIsOpen(true);
                    if (props.onFocus) props.onFocus(e);
                }}
                rightIcon={mode === "address" ? <Search size={18} /> : undefined}
            />

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-[8px] shadow-lg overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                        <span className="text-[12px] text-gray-500 font-medium tracking-wide">SUGGESTIONS</span>
                        <button onClick={() => setIsOpen(false)} type="button" className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {suggestions.map((feature) => (
                            <li
                                key={feature.properties.id}
                                onClick={() => handleSelect(feature)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-[14px]"
                            >
                                {mode === "address" ? (
                                    <>
                                        <span className="font-semibold text-gray-900">{feature.properties.name}</span>
                                        <span className="text-gray-500">, {feature.properties.city}, France</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold text-gray-900">{feature.properties.postcode}</span>
                                        <span className="text-gray-500"> {feature.properties.city}, France</span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="px-4 py-3 bg-gray-50 text-[12px] text-gray-500 flex items-center border-t border-gray-100">
                        powered by <span className="font-semibold ml-1 text-gray-700 font-sans tracking-tight" style={{ fontSize: "14px" }}>Google</span>
                    </div>
                </div>
            )}
        </div>
    );
};
