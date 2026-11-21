"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import IconButton from "./ui/IconButton";

type SavedSongRowProps = {
    track: PlayerTrack;
    tracks: PlayerTrack[];
    index: number;
};

export default function SavedSongRow({
                                         track,
                                         tracks,
                                         index,
                                     }: SavedSongRowProps) {
    const {
        currentTrack,
        selectTrack,
        toggleFavorite,
        favoritesLoaded,
    } = usePlayer();

    const isSelected = currentTrack?.id === track.id;

    return (
        <li
            className={`grid min-h-16
                grid-cols-[24px_minmax(0,1fr)_40px]
                items-center gap-3 rounded-control
                px-3.5 py-2 transition-colors
                ${isSelected ? "bg-selected" : "hover:bg-raised"}`}
        >
            <span className="text-xs tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
            </span>

            <Link
                href={`/now-playing?trackId=${encodeURIComponent(track.id)}`}
                onClick={() => selectTrack(track, tracks)}
                className="flex min-w-0 items-center gap-3
                    rounded-control focus-visible:outline-2
                    focus-visible:outline-accent"
            >
                <Image
                    src="/artwork/default-cover.svg"
                    alt=""
                    width={42}
                    height={42}
                    className="shrink-0 rounded-control"
                />

                <div className="flex min-w-0 flex-col gap-[3px]">
                    <span
                        className={`truncate text-sm font-medium
                            ${isSelected ? "text-accent" : "text-foreground"}`}
                    >
                        {track.title}
                    </span>

                    <span className="truncate text-xs text-secondary">
                        {track.artist}
                    </span>
                </div>
            </Link>

            <IconButton
                variant="ghost"
                onClick={() => void toggleFavorite(track)}
                aria-label={`Remove ${track.title} from favorites`}
                disabled={!favoritesLoaded}
                title="Remove from favorites"
            >
                <Image
                    src="/icons/heart-active.svg"
                    alt=""
                    width={20}
                    height={20}
                />
            </IconButton>
        </li>
    );
}