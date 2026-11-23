"use client";

import { usePlayer } from "./PlayerProvider";
import Image from "next/image";
import IconButton from "./ui/IconButton";
import Link from "next/link";

export default function PlayerStatus() {
    const {
            currentTrack,
            favorites,
            toggleFavorite,
            favoritesLoaded,
        } = usePlayer();

    if (!currentTrack) {
        return (
            <p className="text-sm text-secondary">
                No track selected
            </p>
        );
    }

    const isFavorite = favorites.some(
        (track) => track.id === currentTrack.id
    );


    return (
        <div className="flex min-w-0 items-center gap-3.5">
            <Link
                href="/now-playing"
                className="flex min-w-0 flex-1 items-center gap-3.5"
            >
                <Image
                    src="/artwork/default-cover.svg"
                    alt=""
                    width={60}
                    height={60}
                    className="h-10 w-10 shrink-0 rounded-card
                    sm:h-[60px] sm:w-[60px]"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {currentTrack.title}
                    </p>

                    <p className="truncate text-xs text-secondary">
                        {currentTrack.artist}
                    </p>
                </div>
            </Link>

            <IconButton
                variant={isFavorite ? "selected" : "ghost"}
                onClick={() => void toggleFavorite(currentTrack)}
                aria-label="Favorite track"
                aria-pressed={isFavorite}
                disabled={!favoritesLoaded}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Image
                    src={
                        isFavorite
                            ? "/icons/heart-active.svg"
                            : "/icons/heart.svg"
                    }
                    alt=""
                    width={20}
                    height={20}
                />
            </IconButton>
        </div>
    );

}