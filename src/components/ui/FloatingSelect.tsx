import React, { SelectHTMLAttributes, forwardRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FloatingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { label: string; value: string }[];
}

export const FloatingSelect = forwardRef<HTMLSelectElement, FloatingSelectProps>(
    ({ label, id, options, className = "", onFocus, onBlur, onChange, value, defaultValue, ...props }, ref) => {
        const selectId = id || `floating-select-${Math.random().toString(36).substring(2, 9)}`;
        const [isFocused, setIsFocused] = useState(false);
        const [internalValue, setInternalValue] = useState(value || defaultValue || "");

        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        const hasValue = internalValue !== undefined && internalValue !== null && internalValue !== "";
        const isActive = isFocused || hasValue;

        return (
            <div className={`relative w-full h-[50px] bg-white border border-[#d1d5db] rounded-[5px] transition-colors focus-within:border-black focus-within:ring-1 focus-within:ring-black ${className}`}>
                <select
                    id={selectId}
                    ref={ref}
                    value={value}
                    defaultValue={defaultValue}
                    className="w-full h-full bg-transparent pt-[16px] pb-[2px] text-[14px] text-[#111827] outline-none appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-[#6b7280] rounded-[5px]"
                    style={{ paddingLeft: "14px", paddingTop: "10px", paddingRight: "40px" }}
                    onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e);
                    }}
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
                    className={`absolute pointer-events-none transition-all duration-200 ease-out text-[#6b7280]`}
                    style={{
                        left: "14px",
                        top: isActive ? "5px" : "14px",
                        fontSize: isActive ? "11px" : "14px"
                    }}
                >
                    {label}
                </label>
                <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]" style={{ right: "14px" }}>
                    <ChevronDown size={16} />
                </div>
            </div>
        );
    }
);

FloatingSelect.displayName = "FloatingSelect";
