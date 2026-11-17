"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlayer } from "../../components/PlayerProvider";
import TrackCard from "../../components/TrackCard";

export default function PlaylistPage() {
    const { playlistId } = useParams<{ playlistId: string }>();
    const { playlists, removeTrackFromPlaylist, renamePlaylist } = usePlayer();

    const playlist = playlists.find(
        (p) => p.id === playlistId
    );

    const [newName, setNewName] = useState("");
    if (!playlist) {
        return (
            <main className="p-8 text-white">
                Playlist not found.
            </main>
        );
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                {playlist.name}
            </h1>

            <p className="mt-3 text-gray-400">
                {playlist.tracks.length} songs
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    renamePlaylist(playlist.id, newName);
                    setNewName("");
                }}
                className="mt-4 flex gap-3"
            >
                <input
                    type="text"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="New playlist name"
                    aria-label="New playlist name"
                    className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                />

                <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Rename
                </button>
            </form>

            {playlist.tracks.length === 0 && (
                <p className="mt-6 text-gray-400">
                    This playlist is empty.
                </p>
            )}

            <div className="mt-6 space-y-3">
                {playlist.tracks.map((track) => (
                    <div key={track.id}>
                        <TrackCard
                            id={track.id}
                            title={track.title}
                            artist={track.artist}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                removeTrackFromPlaylist(
                                    playlist.id,
                                    track.id
                                )
                            }
                            className="mt-2 text-sm text-red-400"
                        >
                            Remove from Playlist
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}