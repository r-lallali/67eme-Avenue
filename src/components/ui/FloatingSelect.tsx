import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface FloatingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { label: string; value: string }[];
}

export const FloatingSelect = forwardRef<HTMLSelectElement, FloatingSelectProps>(
    ({ label, id, options, className = "", ...props }, ref) => {
        const selectId = id || `floating-select-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className={`relative w-full ${className}`}>
                <select
                    id={selectId}
                    ref={ref}
                    className="peer w-full rounded-[10px] border border-gray-300 px-4 pt-[20px] pb-[8px] text-[15px] text-black outline-none transition-colors focus:border-black appearance-none bg-transparent cursor-pointer disabled:bg-gray-50 disabled:text-gray-500"
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <label
                    htmlFor={selectId}
                    className="absolute left-4 top-[8px] text-[11px] text-gray-500 transition-all pointer-events-none"
                >
                    {label}
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                </div>
            </div>
        );
    }
);

FloatingSelect.displayName = "FloatingSelect";
