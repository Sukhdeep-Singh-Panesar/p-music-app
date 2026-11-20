import type { ComponentPropsWithoutRef } from "react";

type IconButtonVariant = "ghost" | "selected" | "primary";

type IconButtonSize = "default" | "large";

type IconButtonProps = ComponentPropsWithoutRef<"button"> & {
    "aria-label": string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
};

const variants: Record<IconButtonVariant, string> = {
    ghost: "bg-transparent text-foreground enabled:hover:bg-raised",
    selected: "bg-selected text-accent",
    primary: "bg-primary text-foreground enabled:hover:bg-primary-hover",
};

const sizes: Record<IconButtonSize, string> = {
    default: "size-10",
    large: "size-[58px]",
};

export default function IconButton({
                                       children,
                                       variant = "ghost",
                                       size = "default",
                                       type = "button",
                                       className = "",
                                       ...props
                                   }: IconButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex shrink-0 items-center
                justify-center rounded-pill cursor-pointer
                transition-colors
                focus-visible:outline-solid
                focus-visible:outline-2
                focus-visible:outline-accent
                disabled:opacity-40
                disabled:cursor-not-allowed
                ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}