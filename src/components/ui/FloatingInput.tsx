import React, { InputHTMLAttributes, forwardRef } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ label, id, className = "", ...props }, ref) => {
        // Generate a random ID if none is provided to link label and input
        const inputId = id || `floating-input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className={`relative w-full ${className}`}>
                <input
                    id={inputId}
                    ref={ref}
                    className="peer w-full rounded-[10px] border border-gray-300 px-4 pt-[20px] pb-[8px] text-[15px] text-black outline-none transition-colors focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder=" " // Required for peer-placeholder-shown to work
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className="absolute left-4 top-[8px] text-[11px] text-gray-500 transition-all peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-[14px] peer-focus:top-[8px] peer-focus:text-[11px] cursor-text"
                >
                    {label}
                </label>
            </div>
        );
    }
);

FloatingInput.displayName = "FloatingInput";
