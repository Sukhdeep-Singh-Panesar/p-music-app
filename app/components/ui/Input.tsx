"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
    label?: string;
    error?: string;
};

export default function Input({
                                  label,
                                  error,
                                  id,
                                  className = "",
                                  "aria-describedby": describedBy,
                                  ...props
                              }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="flex min-w-0 w-full flex-col gap-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[12px] font-medium leading-[1.4] text-foreground"
                >
                    {label}
                </label>
            )}

                <input
                    {...props}
                    id={inputId}
                    aria-invalid={error ? true : props["aria-invalid"]}
                    aria-describedby={
                        [describedBy, error ? errorId : undefined]
                            .filter(Boolean).join(" ") || undefined
                    }
                    className={`h-12 w-full rounded-control border
                    bg-surface px-3.5 text-[13px] leading-[1.4]
                    text-foreground placeholder:text-secondary
                    focus:outline-solid focus:outline-2
                    focus:-outline-offset-2
                    ${error
                        ? "border-error focus:outline-error"
                        : "border-border focus:outline-input-focus"}
                    ${className}`}
                />

                {error && (
                    <p id={errorId} className="text-[11px] leading-[1.4] text-error">
                        {error}
                    </p>
                )}
        </div>
    );
}