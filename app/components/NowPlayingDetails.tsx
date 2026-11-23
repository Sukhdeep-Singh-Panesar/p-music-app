"use client";
import PlaylistDropdown from "./PlaylistDropdown";
import { useEffect, useState } from "react";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import { Show, SignInButton } from "@clerk/nextjs";
import TrackCard from "./TrackCard";
import NowPlayingArtwork from "./NowPlayingArtwork";
import Image from "next/image";
import IconButton from "./ui/IconButton";
import { useAudio } from "./AudioProvider";

function formatTime(time: number): string {
    if (!Number.isFinite(time) || time < 0) {
        return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function NowPlayingDetails({
                                              routeTrack,
                                          }: {
    routeTrack?: PlayerTrack;
}) {
    const {
        currentTrack,
        selectTrack,
        favorites,
        toggleFavorite,
        playlists,
        addTrackToPlaylist,
        queue,
        currentIndex,
        playPrevious,
        playNext,
        repeatMode,
        cycleRepeatMode,
        shuffleEnabled,
        toggleShuffle,
        favoritesLoaded,
    } = usePlayer();

    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

    useEffect(() => {
        if (routeTrack) {
            selectTrack(routeTrack);
        }
    }, [routeTrack, selectTrack]);

    const track = currentTrack ?? routeTrack;

    const isFavorite = track
        ? favorites.some(fav => fav.id === track.id)
        : false;

    const {
        isPlaying,
        togglePlayback,
        currentTime,
        duration,
        progress,
        volume,
        seekTo,
        changeVolume,
    } = useAudio();
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
        <main className="flex w-full flex-col gap-6 px-5 pb-12 pt-4 lg:px-desktop-gutter">
            <h1 className="text-page-title font-bold text-foreground">
                Now Playing
            </h1>

            <div className="grid min-w-0 grid-cols-1 items-start gap-6
                            xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)]">

                <section className="flex min-w-0 flex-col items-center
                                   gap-4 rounded-hero border border-border
                                    bg-surface p-4 text-center sm:gap-6 sm:p-8">
                    <NowPlayingArtwork />

                    <div className="flex w-full min-w-0 items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1.5 text-left">
                            <h2 className="break-words text-[24px] font-bold
                                            leading-[1.12] text-foreground
                                            sm:text-[34px]">
                                {track.title}
                            </h2>

                            <p className="text-[17px] leading-[1.4] text-secondary">
                                {track.artist}
                            </p>
                        </div>

                        <Show when="signed-in">
                            <IconButton
                                variant={isFavorite ? "selected" : "ghost"}
                                onClick={() => void toggleFavorite(track)}
                                aria-label={
                                    isFavorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                }
                                aria-pressed={isFavorite}
                                disabled={!favoritesLoaded}
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
                        </Show>
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
                            aria-label="Now Playing progress"
                            className="player-progress rounded
                                        focus-visible:outline-2
                                        focus-visible:outline-accent"
                            style={{
                                backgroundImage: `linear-gradient(
                                                    to right,
                                                    var(--primary) ${progress}%,
                                                    var(--border) ${progress}%
                                                )`,
                            }}
                        />

                        <div className="flex justify-between
                                text-[10px] text-secondary tabular-nums">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 sm:gap-2">
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
                            size="large"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            <Image
                                src={
                                    isPlaying
                                        ? "/icons/pause.svg"
                                        : "/icons/play.svg"
                                }
                                alt=""
                                width={24}
                                height={24}
                            />
                        </IconButton>

                        <IconButton
                            onClick={playNext}
                            aria-label="Next track"
                            disabled={
                                queue.length <= 1 ||
                                (repeatMode !== "all" &&
                                    currentIndex >= queue.length - 1)
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
                            aria-pressed={repeatMode !== "off"}
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
                    <div className="flex w-full items-center justify-end gap-3">
                        <Image
                            src="/icons/volume.svg"
                            alt=""
                            width={18}
                            height={18}
                        />

                        <div className="w-[110px]">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={volume}
                                onChange={(event) =>
                                    changeVolume(Number(event.currentTarget.value))
                                }
                                aria-label="Now Playing volume"
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

                        <span className="text-xs text-secondary tabular-nums">
                            {volume}%
                        </span>
                    </div>
                <Show when="signed-in">
                {playlists.length === 0 && (
                    <p className="mt-4 text-sm text-gray-400">
                        Create a playlist in Your Library first.
                    </p>
                )}

                    <PlaylistDropdown
                        value={selectedPlaylistId}
                        onChange={setSelectedPlaylistId}
                    />
                <button
                    type="button"
                    onClick={() => addTrackToPlaylist(selectedPlaylistId, track)}
                    disabled={!selectedPlaylistId}
                    className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Add to Playlist
                </button>
                </Show>

                    <Show when="signed-out">
                        <SignInButton>
                            <button
                                type="button"
                                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
                            >
                                Sign in to save your music
                            </button>
                        </SignInButton>
                    </Show>

                </section>

                <aside className="flex min-w-0 flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-section-title text-foreground">
                            Up next
                        </h2>

                        <span className="text-xs text-secondary">
                {Math.max(queue.length - currentIndex - 1, 0)} tracks remaining
            </span>
                    </div>

                    {queue.length <= currentIndex + 1 ? (
                        <p className="text-sm text-secondary">
                            No more tracks in the queue.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {queue.slice(currentIndex + 1, currentIndex + 6).map((song) => (
                                <TrackCard
                                    key={song.id}
                                    id={song.id}
                                    title={song.title}
                                    artist={song.artist}
                                    tracks={queue}
                                />
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
}