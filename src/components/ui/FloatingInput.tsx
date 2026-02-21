import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    rightIcon?: React.ReactNode;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ label, id, className = "", rightIcon, onFocus, onBlur, value, defaultValue, onChange, ...props }, ref) => {
        const inputId = id || `floating-input-${Math.random().toString(36).substring(2, 9)}`;
        const [isFocused, setIsFocused] = useState(false);
        const [internalValue, setInternalValue] = useState(value || defaultValue || "");

        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        const isActive = isFocused || (internalValue !== undefined && internalValue !== null && internalValue !== "");

        return (
            <div className={`relative w-full h-[50px] bg-white border border-[#d1d5db] rounded-[5px] transition-colors ${isFocused ? "border-black ring-1 ring-black" : ""} ${className}`}>
                <input
                    id={inputId}
                    ref={ref}
                    value={value}
                    defaultValue={defaultValue}
                    className="w-full h-full bg-transparent pt-[16px] pb-[2px] text-[14px] text-[#111827] outline-none disabled:bg-gray-50 disabled:text-[#6b7280] rounded-[5px]"
                    style={{ paddingLeft: "14px", paddingTop: "10px", paddingRight: rightIcon ? "40px" : "14px" }}
                    onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e);
                    }}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={`absolute pointer-events-none transition-all duration-200 ease-out text-[#6b7280]`}
                    style={{
                        left: "14px",
                        top: isActive ? "6px" : "15px",
                        fontSize: isActive ? "11px" : "14px"
                    }}
                >
                    {label}
                </label>
                {rightIcon && (
                    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#6b7280]" style={{ right: "14px" }}>
                        {rightIcon}
                    </div>
                )}
            </div>
        );
    }
);

FloatingInput.displayName = "FloatingInput";
