"use client";

import {
    createContext,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { usePlayer } from "./PlayerProvider";

type AudioContextType = {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    progress: number;
    playbackError: string | null;
    togglePlayback: () => void;
    seekTo: (percentage: number) => void;
    changeVolume: (percentage: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
    const { currentTrack, queue, repeatMode, playNext } = usePlayer();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [playingTrackId, setPlayingTrackId] =
        useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [playbackError, setPlaybackError] =
        useState<string | null>(null);

    const isPlaying =
        currentTrack !== null && playingTrackId === currentTrack.id;

    const progress =
        Number.isFinite(duration) && duration > 0
            ? Math.min(100, (currentTime / duration) * 100)
            : 0;

    function togglePlayback() {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            void audio.play().catch((error) => {
                setPlaybackError("Unable to play this track.");
                console.error("Audio playback failed:", error);
            });
        } else {
            audio.pause();
        }
    }

    function seekTo(percentage: number) {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(duration) || duration <= 0) {
            return;
        }

        const newTime =
            (Math.max(0, Math.min(100, percentage)) / 100) * duration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }

    function changeVolume(percentage: number) {
        const newVolume = Math.max(0, Math.min(100, percentage));
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    }

    return (
        <AudioContext.Provider
            value={{
                isPlaying,
                currentTime,
                duration,
                volume,
                progress,
                playbackError,
                togglePlayback,
                seekTo,
                changeVolume,
            }}
        >
            {children}

            {currentTrack && (
                <audio
                    key={currentTrack.id}
                    ref={audioRef}
                    autoPlay
                    preload="metadata"
                    className="hidden"
                    src={`https://api.audius.co/v1/tracks/${encodeURIComponent(currentTrack.id)}/stream`}
                    aria-label={`Audio player for ${currentTrack.title}`}
                    loop={
                        repeatMode === "one" ||
                        (repeatMode === "all" && queue.length === 1)
                    }
                    onPlay={() => {
                        setPlayingTrackId(currentTrack.id);
                        setPlaybackError(null);
                    }}
                    onPause={() => setPlayingTrackId(null)}
                    onLoadStart={() => {
                        setCurrentTime(0);
                        setDuration(0);
                        setPlaybackError(null);
                        setPlayingTrackId(null);
                    }}
                    onError={() => {
                        setPlayingTrackId(null);
                        setPlaybackError("This track could not be loaded.");
                    }}
                    onEnded={() => {
                        setPlayingTrackId(null);
                        playNext();
                    }}
                    onTimeUpdate={(event) => {
                        setCurrentTime(event.currentTarget.currentTime);
                    }}
                    onLoadedMetadata={(event) => {
                        setDuration(event.currentTarget.duration);
                        setCurrentTime(event.currentTarget.currentTime);
                        event.currentTarget.volume = volume / 100;
                    }}
                    onVolumeChange={(event) => {
                        setVolume(
                            Math.round(event.currentTarget.volume * 100)
                        );
                    }}
                >
                    Your browser does not support audio playback.
                </audio>
            )}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);

    if (!context) {
        throw new Error("useAudio must be used inside AudioProvider");
    }

    return context;
}
