"use client";

import { usePlayer } from "../components/PlayerProvider";
import TrackCard from "../components/TrackCard";
import { useState } from "react";
export default function LibraryPage() {
    const { favorites, playlists, createPlaylist, deletePlaylist } = usePlayer();
    const [playlistName, setPlaylistName] = useState("");

    function handleCreatePlaylist() {
        createPlaylist(playlistName);
        setPlaylistName("");
    }
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Your Library
            </h1>
            <p className="mt-3 text-gray-400">
                {favorites.length} saved songs
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleCreatePlaylist();
                }}
                className="mt-6 flex gap-3"
            >
                <input
                    type="text"
                    value={playlistName}
                    onChange={(event) => setPlaylistName(event.target.value)}
                    placeholder="Enter playlist name"
                    className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                />

                <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                >
                    Create Playlist
                </button>
            </form>

            <section className="mt-8">
                <h2 className="text-xl font-semibold text-white">
                    Your Playlists
                </h2>

                <div className="mt-4 space-y-3">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="rounded-lg bg-gray-800 p-4 text-white"
                        >
                            <h3 className="font-medium">{playlist.name}</h3>
                            <p className="text-sm text-gray-400">
                                {playlist.tracks.length} songs
                            </p>
                            <button
                                type="button"
                                onClick={() => deletePlaylist(playlist.id)}
                                className="mt-3 text-sm text-red-400 hover:text-red-300"
                            >
                                Delete Playlist
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {favorites.length === 0 && (
                <p className="mt-6 text-gray-400">
                    No favorite songs yet. Discover music and save
                    your favorite tracks!
                </p>
            )}

            <div className="mt-6 space-y-3">
                {favorites.map((track) => (
                    <TrackCard
                        key={track.id}
                        id={track.id}
                        title={track.title}
                        artist={track.artist}
                    />
                ))}
            </div>

        </main>
    );
}