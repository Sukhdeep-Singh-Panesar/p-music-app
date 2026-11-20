import Link from "next/link";
import Image from "next/image";

type NavigationItemProps = {
    href: string;
    label: string;
    active?: boolean;
    icon: string;
    activeIcon?: string;
    iconSize?: number;
};

export default function NavigationItem({
                                           href,
                                           label,
                                           active = false,
                                           icon,
                                           activeIcon,
                                           iconSize = 19,
                                       }: NavigationItemProps) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-11.5 items-center gap-3.25
                rounded-control px-3.5 text-[13px]
                leading-[1.4] transition-colors
                focus-visible:outline-solid
                focus-visible:outline-2
                focus-visible:outline-accent
                ${active
                ? "bg-selected font-semibold text-foreground"
                : "font-normal text-secondary hover:bg-raised"
            }`}
        >
            <Image
                src={active && activeIcon ? activeIcon : icon}
                alt=""
                width={iconSize}
                height={iconSize}
                className="shrink-0"
            />

            <span>{label}</span>


            {active && (
                <span className="size-1 shrink-0 rounded-full bg-accent" />
            )}
        </Link>
    );
}