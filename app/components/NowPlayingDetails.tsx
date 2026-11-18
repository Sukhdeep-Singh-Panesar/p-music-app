"use client";

import { useEffect, useState } from "react";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import { Show, SignInButton } from "@clerk/nextjs";
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
    } = usePlayer();

    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

    useEffect(() => {
        if (routeTrack && currentTrack?.id !== routeTrack.id) {
            selectTrack(routeTrack);
        }
    }, [routeTrack, currentTrack?.id, selectTrack]);

    const track = routeTrack ?? currentTrack;

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

            </div>
        </main>
    );
}