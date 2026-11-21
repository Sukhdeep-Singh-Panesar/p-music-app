"use client";

import { useEffect, useState } from "react";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import { Show, SignInButton } from "@clerk/nextjs";
import TrackCard from "./TrackCard";
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
                                    gap-6 rounded-hero border border-border
                                    bg-surface p-6 text-center sm:p-8">
                <div className="mb-6 flex aspect-square w-64 items-center justify-center rounded-xl bg-[#27264c]">
                    <span className="text-6xl" aria-hidden="true">🎵</span>
                </div>

                <h2 className="text-3xl font-bold text-white">
                    {track.title}
                </h2>

                <p className="mt-2 text-gray-400">
                    by {track.artist}
                </p>

                <Show when="signed-in">
                <button
                    type="button"
                    onClick={() => toggleFavorite(track)}
                    aria-pressed={isFavorite}
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
                >
                    {isFavorite ? "♥ Saved" : "♡ Save to Favorites"}
                </button>

                {playlists.length === 0 && (
                    <p className="mt-4 text-sm text-gray-400">
                        Create a playlist in Your Library first.
                    </p>
                )}

                <select
                    disabled={playlists.length === 0}
                    value={selectedPlaylistId}
                    onChange={(event) => setSelectedPlaylistId(event.target.value)}
                    className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white"
                >
                    <option value="">Select a playlist</option>

                    {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id}>
                            {playlist.name}
                        </option>
                    ))}
                </select>
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