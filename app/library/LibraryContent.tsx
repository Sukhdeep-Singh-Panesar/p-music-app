"use client";
import { usePlayer } from "../components/PlayerProvider";
import SavedSongRow from "../components/SavedSongRow";
import { useState } from "react";
import Button from "../components/ui/Button";
import MusicCard from "../components/ui/MusicCard";
import CreatePlaylistDialog from "../components/CreatePlaylistDialog";
import Image from "next/image";
import Link from "next/link";
export default function LibraryPage() {
    const { favorites, playlists, createPlaylist, deletePlaylist, selectTrack, } = usePlayer();
    const [playlistName, setPlaylistName] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [playlistError, setPlaylistError] = useState("");
    const featuredPlaylist = playlists[0] ?? null;
    const [activeFilter, setActiveFilter] = useState<"all" | "playlists" | "favorites">("all");
    const libraryArtworks = [
        "/artwork/library-playlist-1.svg",
        "/artwork/library-playlist-2.svg",
        "/artwork/library-playlist-3.svg",
        "/artwork/library-playlist-4.svg",
    ];
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
        <main className="flex w-full flex-col gap-6
                px-5 pb-12 pt-4 lg:px-desktop-gutter">

            <header className="flex flex-col gap-4
                                sm:flex-row sm:items-start sm:justify-between">

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-page-title font-bold
                text-foreground">
                        Your Library
                    </h1>

                    <p className="text-sm leading-[1.4] text-secondary">
                        The sounds you keep coming back to.
                    </p>
                </div>

                <Button
                    onClick={() => setDialogOpen(true)}
                    className="shrink-0 self-start"
                >
                    <Image
                        src="/icons/plus.svg"
                        alt=""
                        width={17}
                        height={17}
                    />
                    Create playlist
                </Button>
            </header>

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

            <div
                role="group"
                aria-label="Filter library"
                className="flex flex-wrap items-center gap-2"
            >
                {(["all", "playlists", "favorites"] as const).map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        aria-pressed={activeFilter === filter}
                        className={`h-9 rounded-pill border px-[18px]
                                    text-xs font-medium transition-colors
                                    focus-visible:outline-2
                                    focus-visible:outline-accent
                            ${
                            activeFilter === filter
                                ? "border-primary bg-primary text-foreground"
                                : "border-border bg-surface text-secondary hover:bg-raised"
                        }`}
                    >
                        {filter === "all"
                            ? "All"
                            : filter === "playlists"
                                ? "Playlists"
                                : "Favorites"}
                    </button>
                ))}
            </div>
            {activeFilter === "all" && (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_286px]">

                    <section className="flex min-w-0 flex-col gap-6
                                        rounded-card bg-surface p-4
                                        sm:flex-row sm:items-center sm:p-6">

                        <Image
                            src="/artwork/library-highlight.svg"
                            alt=""
                            width={154}
                            height={154}
                            className="h-[112px] w-[112px] shrink-0 rounded-card sm:h-[154px] sm:w-[154px]"/>

                        <div className="flex min-w-0 flex-col items-start gap-3">
                            <p className="text-[10px] font-semibold text-accent">
                                FROM YOUR LIBRARY
                            </p>

                            {featuredPlaylist ? (
                                <>
                                    <Link
                                        href={`/playlist/${featuredPlaylist.id}`}
                                        className="text-[30px] font-semibold
                                                   leading-[1.12] text-foreground hover:text-accent"
                                    >
                                        {featuredPlaylist.name}
                                    </Link>

                                    <p className="text-[13px] text-secondary">
                                        {featuredPlaylist.tracks.length} tracks · By you
                                    </p>

                                    <Button
                                        disabled={featuredPlaylist.tracks.length === 0}
                                        onClick={() =>
                                            selectTrack(
                                                featuredPlaylist.tracks[0],
                                                featuredPlaylist.tracks
                                            )
                                        }
                                    >
                                        Play playlist
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Your music starts here.
                                    </h2>

                                    <p className="text-sm text-secondary">
                                        Create your first playlist to build your collection.
                                    </p>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="flex flex-col items-start
                                        justify-center gap-4 rounded-card bg-selected p-6">

                        <Image
                            src="/icons/heart.svg"
                            alt=""
                            width={20}
                            height={20}
                        />

                        <h2 className="text-[26px] font-semibold
                                        leading-[1.25] text-foreground">
                            All your favorites.
                        </h2>

                        <p className="text-[13px] text-secondary">
                            {favorites.length} saved songs. Every one a keeper.
                        </p>

                        <Button
                            variant="secondary"
                            disabled={favorites.length === 0}
                            onClick={() => selectTrack(favorites[0], favorites)}
                        >
                            Play favorites
                        </Button>
                    </section>
                </div>
            )}
            {(activeFilter === "all" || activeFilter === "playlists") && (
                <section className="mt-8">{
            <section className="mt-8">
                <h2 className="text-section-title text-foreground">
                    Made by you
                </h2>
                {playlists.length === 0 && (
                    <p className="mt-4 text-gray-400">
                        Create your first playlist to organize your favorite music.
                    </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
                    {playlists.map((playlist, index) => (
                        <div key={playlist.id} className="min-w-0">
                            <MusicCard
                                title={playlist.name}
                                description={`${playlist.tracks.length} tracks · By you`}
                                artwork={libraryArtworks[index % libraryArtworks.length]}
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
            </section>  }
                </section>
            )}
            {(activeFilter === "all" || activeFilter === "favorites") && (
                <>
                    <section className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-section-title text-foreground">
                                Saved songs
                            </h2>

                            <span className="text-xs text-accent">
                                {favorites.length} songs
                            </span>
                        </div>

                        <div className="grid grid-cols-[24px_minmax(0,1fr)_40px]
                                        gap-3 border-b border-border px-3.5 py-3
                                        text-[11px] text-muted"
                        >
                            <span>#</span>
                            <span>TITLE / ARTIST</span>
                            <span className="text-center">♡</span>
                        </div>

                        {favorites.length === 0 ? (
                            <p className="py-6 text-sm text-secondary">
                                No favorite songs yet. Discover music and save
                                your favorite tracks!
                            </p>
                        ) : (
                            <ol className="flex flex-col gap-1">
                                {favorites.map((track, index) => (
                                    <SavedSongRow
                                        key={track.id}
                                        track={track}
                                        tracks={favorites}
                                        index={index}
                                    />
                                ))}
                            </ol>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}