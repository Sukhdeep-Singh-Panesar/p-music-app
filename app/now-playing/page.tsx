"use client";
import { useState } from "react";

type Track = {
    id: string;
    title: string;
    artist: string;
};

const currentTrack: Track = {
    id: "afterglow",
    title: "Afterglow",
    artist: "P Music Sessions",
};

export default function NowPlayingPage() {

    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Now Playing
            </h1>

            <div className="mt-3 flex flex-col items-center text-center">
                <div className="mb-6 flex aspect-square w-64 items-center justify-center rounded-xl bg-[#27264c]">
                    <span className="text-6xl" aria-hidden="true">🎵</span>
                </div>

                <h2 className="text-3xl font-bold text-white">
                    {currentTrack.title}
                </h2>

                <p className="mt-2 text-gray-400">
                    by {currentTrack.artist}
                </p>

                <div className="mx-auto mt-8 w-full max-w-md">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                        <div className="h-full w-1/3 rounded-full bg-indigo-400" />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                        <span>0:00</span>
                        <span>--:--</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-8">

                    <button
                        type="button"
                        className="text-2xl text-white hover:text-indigo-300"
                    >
                        <span className="sr-only">Previous</span>
                        <span aria-hidden="true">⏮</span>
                    </button>
                    <button
                        type="button"
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-2xl text-white hover:bg-indigo-400"
                        onClick={() => setIsPlaying((previous) => !previous)}
                    >
                        <span className="sr-only">
                          {isPlaying ? "Pause" : "Play"}
                        </span>
                        <span aria-hidden="true">
                          {isPlaying ? "⏸" : "▶"}
                        </span>
                    </button>
                    <button type="button"
                            className="text-2xl text-white hover:text-indigo-300"
                    >
                        <span className="sr-only">Next</span>
                        <span aria-hidden="true">⏭</span>
                    </button>
                </div>

            </div>
        </main>
    );
}