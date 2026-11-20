"use client";
import Link from "next/link";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import Image from "next/image";
type TrackCardProps = {
    id: string;
    title: string;
    artist: string;
    tracks: PlayerTrack[];
};

export default function TrackCard({
                                     id,
                                     title,
                                      artist,
                                      tracks,
                                  }: TrackCardProps) {
    const { selectTrack, currentTrack } = usePlayer();

    const isSelected = currentTrack?.id === id;    return (

        <Link
            onClick={() => selectTrack({ id, title, artist }, tracks)}
            href={`/now-playing?trackId=${encodeURIComponent(id)}`}
            className={`flex min-h-16 items-center gap-4
                        rounded-control px-3.5 py-2 transition-colors
                        focus-visible:outline-solid
                        focus-visible:outline-2
                        focus-visible:outline-accent
                        ${isSelected ? "bg-selected" : "hover:bg-raised"}`}        >
            <Image
                src="/artwork/default-cover.svg"
                alt=""
                width={42}
                height={42}
                className="shrink-0 rounded-control object-cover"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <h2 className={`truncate text-sm font-medium leading-[1.4] ${isSelected ? "text-accent" : "text-foreground"}`}>
                    {title}
                </h2>

                <p className="truncate text-xs leading-[1.4] text-secondary">
                    {artist}
                </p>
            </div>
        </Link>
    );
}