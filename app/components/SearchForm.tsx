"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Image from "next/image";
import { useId, useEffect, useRef } from "react";

export default function SearchForm({
                                       initialQuery,
                                       variant = "default",
                                   }: {
    initialQuery: string;
    variant?: "default" | "header";
}) {
    const router = useRouter();
    const inputId = useId();
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (variant !== "header") return;

        function handleKeyDown(event: KeyboardEvent) {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                searchRef.current?.focus();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [variant]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const query = String(formData.get("q") ?? "").trim();

        const params = new URLSearchParams({ q: query });

        router.push(
            query ? `/search?${params.toString()}` : "/search"
        );
    }

    if (variant === "header") {
        return (
            <form
                onSubmit={handleSubmit}
                className="flex h-11 w-full min-w-0 max-w-[420px]
                items-center gap-2.5 rounded-pill
                border border-border bg-surface px-4
                focus-within:border-input-focus"
            >
                <button
                    type="submit"
                    aria-label="Search music"
                    className="cursor-pointer"
                >
                    <Image
                        src="/icons/search.svg"
                        alt=""
                        width={18}
                        height={18}
                    />
                </button>

                <input
                    type="search"
                    name="q"
                    ref={searchRef}
                    aria-keyshortcuts="Control+K Meta+K"
                    aria-label="Search songs or artists"
                    defaultValue={initialQuery}
                    placeholder="Search songs or artists"
                    className="search-input min-w-0 flex-1 bg-transparent
                               text-xs text-foreground outline-none
                               placeholder:text-secondary"
                />
                <kbd className="hidden shrink-0 font-sans text-[10px] text-muted xl:block">
                    Ctrl K
                </kbd>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <label htmlFor={inputId} className="sr-only">
                Search music
            </label>

            <input
                id={inputId}
                type="search"
                name="q"
                defaultValue={initialQuery}
                placeholder="Search for a song or artist"
                className="min-w-0 flex-1 rounded-lg bg-slate-800 px-4 py-3 text-white"
            />

            <button
                type="submit"
                className="shrink-0 rounded-lg bg-indigo-500 px-5 text-white cursor-pointer"
            >
                Search
            </button>
        </form>
    );
}