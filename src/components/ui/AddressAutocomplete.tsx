"use client";

import React, { useState, useEffect, useRef } from "react";
import { FloatingInput } from "./FloatingInput";

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
                setIsOpen(true);
            } catch (error) {
                console.error("Erreur gouv API:", error);
            }
        };

        // Debounce to avoid spamming the API
        const timeoutId = setTimeout(() => {
            // Only fetch if exactly focused/typing
            if (document.activeElement?.id === props.id) {
                fetchSuggestions();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, mode]);

    const handleSelect = (feature: AddressFeature) => {
        const { name, postcode, city, label } = feature.properties;

        let addressStr = "";
        let finalQuery = "";

        if (mode === "address") {
            addressStr = name;
            finalQuery = label;
        } else {
            // mode city
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
                onFocus={() => {
                    if (suggestions.length > 0) setIsOpen(true);
                }}
            />

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((feature) => (
                        <li
                            key={feature.properties.id}
                            onClick={() => handleSelect(feature)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                        >
                            <p className="text-[14px] text-gray-900 font-medium">
                                {mode === "address" ? feature.properties.name : `${feature.properties.postcode} ${feature.properties.city}`}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-0.5">
                                {mode === "address" ? `${feature.properties.postcode} ${feature.properties.city}` : feature.properties.context}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
