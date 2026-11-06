"use client";

import { usePlayer } from "./PlayerProvider";
import PlayerStatus from "./PlayerStatus";
import { useRef, useState, type ChangeEvent } from "react";

export default function PlayerBar() {
    const { currentTrack } = usePlayer();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [playingTrackId, setPlayingTrackId] =
        useState<string | null>(null);

    const [currentTime, setCurrentTime] = useState(0);

    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(100);

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


    const progress =
        Number.isFinite(duration) && duration > 0
            ? Math.min(100, (currentTime / duration) * 100)
            : 0;


    function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
        const audio = audioRef.current;

        if (!audio || !Number.isFinite(duration) || duration <= 0) {
            return;
        }

        const percentage = Number(event.currentTarget.value);

        const newTime = (percentage / 100) * duration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }

    function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
        const newVolume = Number(event.currentTarget.value);

        setVolume(newVolume);

        const audio = audioRef.current;

        if (audio) {
            audio.volume = newVolume / 100;
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
                    <p className="text-sm text-gray-400">
                        {Math.floor(currentTime)} seconds
                    </p>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress}
                        onChange={handleSeek}
                        disabled={!Number.isFinite(duration) || duration <= 0}
                        aria-label="Seek through song"
                        className="w-full max-w-md cursor-pointer"
                    />
                    <div className="flex items-center gap-3">
                        <label htmlFor="player-volume" className="text-sm">
                            Volume
                        </label>

                        <input
                            id="player-volume"
                            type="range"
                            min={0}
                            max={100}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-28"
                        />

                        <span className="text-sm">{volume}%</span>
                    </div>
                <audio
                    ref={audioRef}
                    onPlay={() => setPlayingTrackId(currentTrack.id)}
                    onPause={() => setPlayingTrackId(null)}
                    onEnded={() => setPlayingTrackId(null)}
                    onTimeUpdate={(event) => {
                        setCurrentTime(event.currentTarget.currentTime);
                    }}
                    onLoadedMetadata={(event) => {
                        setDuration(event.currentTarget.duration);
                        setCurrentTime(0);
                    }}
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