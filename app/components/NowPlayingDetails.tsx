"use client";

import { useEffect } from "react";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";

export default function NowPlayingDetails({
                                              routeTrack,
                                          }: {
    routeTrack?: PlayerTrack;
}) {
    const { currentTrack, selectTrack } = usePlayer();

    useEffect(() => {
        if (routeTrack && currentTrack?.id !== routeTrack.id) {
            selectTrack(routeTrack);
        }
    }, [routeTrack, currentTrack?.id, selectTrack]);

    const track = routeTrack ?? currentTrack;

    if (!track) {
        return (
            <main className="p-8 text-white">
                <h1 className="text-3xl font-bold">Now Playing</h1>
                <p className="mt-4 text-gray-400">
                    Choose a track from Discover or Search.
                </p>
            </main>
        );
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Now Playing
            </h1>

            <div className="mt-6 flex flex-col items-center text-center">
                <div className="mb-6 flex aspect-square w-64 items-center justify-center rounded-xl bg-[#27264c]">
                    <span className="text-6xl" aria-hidden="true">🎵</span>
                </div>

                <h2 className="text-3xl font-bold text-white">
                    {track.title}
                </h2>

                <p className="mt-2 text-gray-400">
                    by {track.artist}
                </p>
            </div>
        </main>
    );
}