"use client";
import Link from "next/link";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
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
    const { selectTrack } = usePlayer();
    return (

        <Link
            onClick={() => selectTrack({ id, title, artist }, tracks)}
            href={`/now-playing?trackId=${encodeURIComponent(id)}`}
            className="block rounded-lg bg-indigo-950 p-4 hover:bg-indigo-900"
        >
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-400">{artist}</p>
        </Link>
    );
}