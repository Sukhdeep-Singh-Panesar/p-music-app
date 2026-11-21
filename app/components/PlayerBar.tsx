"use client";

import { usePlayer } from "./PlayerProvider";
import PlayerStatus from "./PlayerStatus";
import { useRef, useState, type ChangeEvent } from "react";
import IconButton from "./ui/IconButton";
import Image from "next/image";
import { useAudio } from "./AudioProvider";
export default function PlayerBar() {
    const {
        currentTrack,
        queue,
        currentIndex,
        playNext,
        playPrevious,
        repeatMode,
        cycleRepeatMode,
        shuffleEnabled,
        toggleShuffle,
    } = usePlayer();

    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        progress,
        playbackError,
        togglePlayback,
        seekTo,
        changeVolume,
    } = useAudio();

    function formatTime(time: number): string {
        if (!Number.isFinite(time) || time < 0) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }


    return (
        <footer
            aria-label="Music player"
            className="fixed inset-x-0 bottom-0 z-50
                        flex min-h-desktop-player flex-col gap-3
                        border-t border-border bg-sidebar
                        px-4 py-3 text-foreground
                        xl:h-desktop-player xl:flex-row
                        xl:items-center xl:justify-between
                        xl:gap-6 xl:px-7 xl:py-0">
            <div className="w-full min-w-0 xl:w-75 xl:shrink-0">
                <PlayerStatus />
            </div>

            {currentTrack ? (
                <>
                    <div className="flex w-full min-w-0 flex-col
                                    items-center gap-2 xl:w-[440px] xl:shrink-0">

                        <div className="flex items-center justify-center gap-1">

                        <IconButton
                            variant={shuffleEnabled ? "selected" : "ghost"}
                            onClick={toggleShuffle}
                            aria-label="Shuffle"
                            aria-pressed={shuffleEnabled}
                        >
                            <Image
                                src="/icons/shuffle.svg"
                                alt=""
                                width={16}
                                height={16}
                            />
                        </IconButton>

                        <IconButton
                            onClick={playPrevious}
                            aria-label="Previous track"
                            disabled={
                                queue.length <= 1 ||
                                (repeatMode !== "all" && currentIndex === 0)
                            }
                        >
                            <Image
                                src="/icons/skip-back.svg"
                                alt=""
                                width={18}
                                height={18}
                            />
                        </IconButton>

                        <IconButton
                            variant="primary"
                            size="compact"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            <Image
                                src={isPlaying
                                    ? "/icons/pause-small.svg"
                                    : "/icons/play-small.svg"}
                                alt=""
                                width={17}
                                height={17}
                            />
                        </IconButton>

                        <IconButton
                            onClick={playNext}
                            aria-label="Next track"
                            disabled={
                                queue.length <= 1 ||
                                (repeatMode !== "all" && currentIndex >= queue.length - 1)
                            }
                        >
                            <Image
                                src="/icons/skip-forward.svg"
                                alt=""
                                width={18}
                                height={18}
                            />
                        </IconButton>

                        <IconButton
                            variant={repeatMode !== "off" ? "selected" : "ghost"}
                            onClick={cycleRepeatMode}
                            aria-label={`Repeat: ${repeatMode}`}
                            title={`Repeat: ${repeatMode}`}
                            className="relative"
                        >
                            <Image
                                src="/icons/repeat.svg"
                                alt=""
                                width={16}
                                height={16}
                            />

                            {repeatMode === "one" && (
                                <span className="absolute right-1 top-1 text-[10px] text-accent">
                                    1
                                </span>
                            )}
                        </IconButton>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={0.1}
                            value={progress}
                            onChange={(event) =>
                                seekTo(Number(event.currentTarget.value))
                            }
                            disabled={!Number.isFinite(duration) || duration <= 0}
                            aria-label="Seek through song"
                            className="player-progress rounded
                                    focus-visible:outline-2
                                    focus-visible:outline-accent
                                    disabled:cursor-not-allowed"
                            style={{
                                backgroundImage: `linear-gradient(
                                                to right,
                                                var(--primary) ${progress}%,
                                                var(--border) ${progress}%
                                            )`,
                                     }}
                        />

                        <div className="flex justify-between text-[10px]
                                        leading-[1.4] text-secondary tabular-nums">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    {playbackError && (
                        <p role="alert" className="text-sm text-red-400">
                            {playbackError}
                        </p>
                    )}

                        </div>

                        <div className="flex w-full items-center
                        justify-center xl:w-[300px]
                        xl:shrink-0 xl:justify-end">

                        <div className="flex items-center gap-3">
                            <Image
                                src="/icons/volume.svg"
                                alt=""
                                width={18}
                                height={18}
                            />

                            <div className="w-[74px]">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={volume}
                                    onChange={(event) =>
                                        changeVolume(Number(event.currentTarget.value))
                                    }
                                    aria-label="Volume"
                                    className="player-progress rounded
                                focus-visible:outline-2
                                focus-visible:outline-accent"
                                    style={{
                                        backgroundImage: `linear-gradient(
                                                        to right,
                                                        var(--primary) ${volume}%,
                                                        var(--border) ${volume}%
                                                    )`,
                                    }}
                                />
                            </div>

                            <span className="text-[10px] text-secondary tabular-nums">
                            {volume}%
                        </span>
                        </div>
                </div>
                </>
            ) : (
                <p className="text-sm text-gray-400">
                    Choose a track to start listening
                </p>
            )}
        </footer>
    );
}