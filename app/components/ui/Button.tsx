import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary enabled:hover:bg-primary-hover",
    secondary: "bg-raised border border-border enabled:hover:bg-raised-hover",
    ghost: "bg-transparent enabled:hover:bg-raised",
};

export default function Button({
                                   children,
                                   variant = "primary",
                                   type = "button",
                                   className = "",
                                   ...props
                               }: ButtonProps) {
    return (
        <button
            type={type}
            className={`
            inline-flex h-11 items-center justify-center cursor-pointer
            transition-colors
            focus-visible:outline-solid
            focus-visible:outline-3
            focus-visible:outline-focus
            focus-visible:-outline-offset-3
            disabled:opacity-40
            disabled:cursor-not-allowed gap-2 rounded-pill px-5 text-[13px] font-semibold leading-[1.4] text-foreground ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}