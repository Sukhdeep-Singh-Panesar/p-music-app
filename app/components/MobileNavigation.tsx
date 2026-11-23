
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
    {
        href: "/",
        label: "Discover",
        icon: "/icons/compass.svg",
        activeIcon: "/icons/compass-active.svg",
    },
    {
        href: "/library",
        label: "Library",
        icon: "/icons/library.svg",
        activeIcon: "/icons/library-active.svg",
    },
    {
        href: "/now-playing",
        label: "Now Playing",
        icon: "/icons/audio-lines.svg",
        activeIcon: "/icons/audio-lines-active.svg",
    },
];

export default function MobileNavigation() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 z-40
                flex h-[calc(64px+env(safe-area-inset-bottom))]
                items-start border-t border-border bg-sidebar
                px-2 pt-2 pb-[env(safe-area-inset-bottom)]
                md:hidden"
        >
            {links.map((link) => {
                const active =
                    pathname === link.href ||
                    (link.href === "/library" &&
                        pathname.startsWith("/playlist/"));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-12 min-w-0 flex-1
                            flex-col items-center justify-center
                            gap-1 rounded-control text-[11px]
                            font-medium transition-colors
                            focus-visible:outline-2
                            focus-visible:outline-accent
                            ${active
                            ? "bg-selected text-accent"
                            : "text-secondary hover:bg-raised"
                        }`}
                    >
                        <Image
                            src={active ? link.activeIcon : link.icon}
                            alt=""
                            width={20}
                            height={20}
                        />

                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
