"use client";
import { usePlayer } from "../components/PlayerProvider";
import TrackCard from "../components/TrackCard";
import { useState } from "react";
import Button from "../components/ui/Button";
import MusicCard from "../components/ui/MusicCard";
import CreatePlaylistDialog from "../components/CreatePlaylistDialog";
export default function LibraryPage() {
    const { favorites, playlists, createPlaylist, deletePlaylist } = usePlayer();
    const [playlistName, setPlaylistName] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [playlistError, setPlaylistError] = useState("");

    async function handleCreatePlaylist() {
        if (!playlistName.trim() || isCreating) return;

        setIsCreating(true);
        setPlaylistError("");

        try {
            const success = await createPlaylist(playlistName);

            if (success) {
                setPlaylistName("");
                setDialogOpen(false);
            } else {
                setPlaylistError("Unable to create playlist. Try again.");
            }
        } finally {
            setIsCreating(false);
        }
    }
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Your Library
            </h1>
            <p className="mt-3 text-gray-400">
                {favorites.length} saved songs
            </p>

            <div className="mt-6">
                <Button onClick={() => setDialogOpen(true)}>
                    Create playlist
                </Button>
            </div>

            <CreatePlaylistDialog
                open={dialogOpen}
                name={playlistName}
                onNameChange={setPlaylistName}
                isCreating={isCreating}
                error={playlistError}
                onClose={() => {
                    if (isCreating) return;

                    setDialogOpen(false);
                    setPlaylistName("");
                    setPlaylistError("");
                }}
                onCreate={handleCreatePlaylist}
            />

            <section className="mt-8">
                <h2 className="text-xl font-semibold text-white">
                    Your Playlists
                </h2>
                {playlists.length === 0 && (
                    <p className="mt-4 text-gray-400">
                        Create your first playlist to organize your favorite music.
                    </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {playlists.map((playlist) => (
                        <div key={playlist.id} className="min-w-0">
                            <MusicCard
                                title={playlist.name}
                                description={`${playlist.tracks.length} tracks · By you`}
                                href={`/playlist/${playlist.id}`}
                            />

                            <button
                                type="button"
                                onClick={() => deletePlaylist(playlist.id)}
                                className="mt-2 px-2 text-xs text-error"
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
                        tracks={favorites}
                    />
                ))}
            </div>

        </main>
    );
}