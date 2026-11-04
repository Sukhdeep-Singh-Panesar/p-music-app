"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function SearchForm({
                                       initialQuery,
                                   }: {
    initialQuery: string;
}) {
    const router = useRouter();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const query = String(formData.get("q") ?? "").trim();

        const params = new URLSearchParams({ q: query });

        router.push(
            query ? `/search?${params.toString()}` : "/search"
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <label htmlFor="music-query" className="sr-only">
                Search music
            </label>

            <input
                id="music-query"
                type="search"
                name="q"
                defaultValue={initialQuery}
                placeholder="Search for a song or artist"
                className="min-w-0 flex-1 rounded-lg bg-slate-800 px-4 py-3 text-white"
            />

            <button
                type="submit"
                className="shrink-0 rounded-lg bg-indigo-500 px-5 text-white"
            >
                Search
            </button>
        </form>
    );
}