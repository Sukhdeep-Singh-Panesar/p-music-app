
"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "./PlayerProvider";

type Props = {
    value: string;
    onChange: (id: string) => void;
};

export default function PlaylistDropdown({ value, onChange }: Props) {
    const { playlists } = usePlayer();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selected = playlists.find(
        (playlist) => playlist.id === value
    );

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: PointerEvent) {
            if (
                !dropdownRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleClickOutside
            );
        };
    }, [isOpen]);

    return (
        <div
            ref={dropdownRef}
            className="relative mt-4 w-full max-w-md"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setIsOpen(false);
                    dropdownRef.current?.querySelector("button")?.focus();
                }
            }}
        >
            <p className="mb-2 text-xs font-semibold text-secondary">
                ADD TO PLAYLIST
            </p>

            <button
                type="button"
                disabled={playlists.length === 0}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="playlist-options"
                className="flex w-full items-center justify-between
                    gap-3 rounded-xl border border-border
                    bg-surface px-4 py-3 text-left text-sm
                    text-foreground transition-colors
                    hover:border-primary
                    focus-visible:outline-2
                    focus-visible:outline-accent
                    disabled:opacity-50"
            >
                <span className="min-w-0 truncate">
                    {selected?.name ?? "Choose a playlist"}
                </span>

                <span aria-hidden="true" className="text-accent">
                    {isOpen ? "⌃" : "⌄"}
                </span>
            </button>

            {isOpen && (
                <div
                    id="playlist-options"
                    className="absolute left-0 right-0 top-full z-30
                        mt-2 max-h-64 overflow-y-auto rounded-xl
                        border border-border bg-sidebar p-2 shadow-2xl"
                >
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.id}
                            type="button"
                            onClick={() => {
                                onChange(playlist.id);
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center
                                justify-between gap-3 rounded-lg
                                px-3 py-2.5 text-left
                                text-foreground transition-colors
                                hover:bg-selected
                                focus-visible:bg-selected"
                        >
                            <div className="flex min-w-0 flex-col gap-1">
                                <span className="truncate text-sm font-medium">
                                    {playlist.name}
                                </span>

                                <span className="text-xs text-secondary">
                                    {playlist.tracks.length} tracks
                                </span>
                            </div>

                            {value === playlist.id && (
                                <span className="text-accent" aria-hidden="true">
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
