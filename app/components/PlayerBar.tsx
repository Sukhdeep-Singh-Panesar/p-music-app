"use client";

import { usePlayer } from "./PlayerProvider";
import PlayerStatus from "./PlayerStatus";
import { useRef, useState } from "react";

export default function PlayerBar() {
    const { currentTrack } = usePlayer();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [playingTrackId, setPlayingTrackId] =
        useState<string | null>(null);

    const isPlaying =
        currentTrack !== null && playingTrackId === currentTrack.id;

    function togglePlayback() {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.paused) {
            void audio.play().catch((error) => {
                console.error("Audio playback failed:", error);
            });
        } else {
            audio.pause();
        }
    }
    return (
        <footer
            aria-label="Music player"
            className="fixed inset-x-0 bottom-0 z-50 flex min-h-20 flex-col gap-3 border-t border-gray-800 bg-gray-950 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
            <div className="min-w-0 sm:w-72">
                <PlayerStatus />
            </div>

            {currentTrack  ? (

                <div className="flex flex-col items-center gap-2">
                    <button
                        type="button"
                        onClick={togglePlayback}
                        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                <audio
                    ref={audioRef}
                    onPlay={() => setPlayingTrackId(currentTrack.id)}
                    onPause={() => setPlayingTrackId(null)}
                    onEnded={() => setPlayingTrackId(null)}
                    key={currentTrack.id}
                    controls
                    preload="metadata"
                    src={`https://api.audius.co/v1/tracks/${encodeURIComponent(currentTrack.id)}/stream`}
                    className="h-10 w-full max-w-md sm:w-80"
                    aria-label={`Audio player for ${currentTrack.title}`}
                >
                    Your browser does not support audio playback.
                </audio>
              </div>
            ) : (
                <p className="text-sm text-gray-400">
                    Choose a track to start listening
                </p>
            )}
        </footer>
    );
}