
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
    { href: "/", label: "Discover" },
    { href: "/library", label: "Your Library" },
    { href: "/now-playing", label: "Now Playing" },
];

export default function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div
            className="relative md:hidden"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setIsOpen(false);
                }
            }}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="flex h-11 items-center gap-2
                    rounded-control border border-border
                    bg-surface px-4 text-sm text-foreground"
            >
                <span aria-hidden="true">☰</span>
                Menu
            </button>

            {isOpen && (
                <nav
                    id="mobile-navigation"
                    aria-label="Mobile navigation"
                    className="absolute left-0 top-full z-60 mt-2
                        w-56 rounded-card border border-border
                        bg-sidebar p-2 shadow-xl"
                >
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            aria-current={
                                pathname === link.href
                                    ? "page"
                                    : undefined
                            }
                            className={`block rounded-control px-4 py-3
                                text-sm transition-colors
                                ${pathname === link.href
                                ? "bg-selected text-accent"
                                : "text-foreground hover:bg-raised"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </div>
    );
}
