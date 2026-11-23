"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlayer } from "../../components/PlayerProvider";
import IconButton from "../../components/ui/IconButton";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/ui/Button";

export default function PlaylistPage() {
    const { playlistId } = useParams<{ playlistId: string }>();
    const { playlists, removeTrackFromPlaylist, renamePlaylist, playlistsLoaded, selectTrack, currentTrack, favorites,
            favoritesLoaded,
            toggleFavorite,} = usePlayer();
    const [isEditing, setIsEditing] = useState(false);
    const playlist = playlists.find(
        (p) => p.id === playlistId
    );

    const [newName, setNewName] = useState("");
    if (!playlistsLoaded) {
        return (
            <main className="p-8 text-gray-400">
                Loading playlist...
            </main>
        );
    }
    if (!playlist) {
        return (
            <main className="p-8 text-white">
                Playlist not found.
            </main>
        );
    }

    function handleShuffle() {
        if (!playlist || playlist.tracks.length === 0) return;

        const shuffled = [...playlist.tracks];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        selectTrack(shuffled[0], shuffled);
    }
    return (
        <main className="flex w-full flex-col gap-6
                         px-5 pb-12 pt-4 lg:px-desktop-gutter">
            <nav className="flex items-center gap-2 text-xs text-secondary">
                <Link href="/library" className="hover:text-accent">
                    Your Library
                </Link>

                <span aria-hidden="true">›</span>

                <span className="truncate text-foreground">
                    {playlist.name}
                </span>
            </nav>

            <section className="flex flex-col items-start gap-4
                                rounded-hero bg-selected p-4
                                sm:flex-row sm:items-center sm:gap-8 sm:p-7">
                <Image
                    src="/artwork/playlist-hero.svg"
                    alt=""
                    width={224}
                    height={224}
                    className="h-auto w-full max-w-[224px]
                                shrink-0 rounded-card"
                />

                <div className="flex min-w-0 flex-col gap-3">
                    <p className="text-[10px] font-semibold
                                    uppercase tracking-wide text-accent">
                        Your private playlist
                    </p>

                    <h1 className="break-words text-[clamp(2rem,4vw,3.75rem)]
                                    font-bold leading-[1.12] text-foreground">
                        {playlist.name}
                    </h1>

                    <p className="text-sm text-secondary">
                        By you · {playlist.tracks.length} tracks
                    </p>
                </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        disabled={playlist.tracks.length === 0}
                        onClick={() =>
                            selectTrack(playlist.tracks[0], playlist.tracks)
                        }
                    >
                        <Image
                            src="/icons/play-small.svg"
                            alt=""
                            width={17}
                            height={17}
                        />
                        Play playlist
                    </Button>

                    <Button
                        variant="secondary"
                        disabled={playlist.tracks.length === 0}
                        onClick={handleShuffle}
                    >
                        <Image
                            src="/icons/shuffle.svg"
                            alt=""
                            width={17}
                            height={17}
                        />
                        Shuffle
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsEditing(!isEditing)}
                        aria-expanded={isEditing}
                    >
                        Edit playlist
                    </Button>

                    <Link
                        href="/search"
                        className="inline-flex h-11 items-center justify-center
                                    gap-2 rounded-pill border border-border
                                    bg-raised px-5 text-[13px] font-semibold
                                    text-foreground transition-colors
                                    hover:bg-raised-hover
                                    focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <Image
                            src="/icons/plus.svg"
                            alt=""
                            width={17}
                            height={17}
                        />
                        Add songs
                    </Link>
                </div>
            </div>
            {isEditing && (
                <form
                onSubmit={(event) => {
                    event.preventDefault();
                    renamePlaylist(playlist.id, newName);
                    setNewName("");
                }}
                className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface p-4"
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

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setIsEditing(false);
                            setNewName("");
                        }}
                    >
                        Cancel
                    </Button>
            </form>
            )}


            <section className="flex min-w-0 flex-col gap-2">
                <div className="grid grid-cols-[18px_minmax(0,1fr)_36px_36px]
                                sm:grid-cols-[24px_minmax(0,1fr)_40px_40px]
                                items-center gap-2 sm:gap-3 border-b border-border px-3.5 py-3
                                text-[11px] text-muted">

                    <span>#</span>
                    <span>TITLE / ARTIST</span>
                    <span className="text-center">♡</span>
                    <span className="sr-only">Remove</span>
                </div>

                {playlist.tracks.length === 0 ? (
                    <p className="py-6 text-sm text-secondary">
                        This playlist is empty.
                    </p>
                ) : (
                    <ol className="flex flex-col gap-1">
                        {playlist.tracks.map((track, index) => {
                            const isSelected = currentTrack?.id === track.id;

                            const isFavorite = favorites.some(
                                (favorite) => favorite.id === track.id
                            );

                            return (
                                <li
                                    key={track.id}
                                    className={`grid min-h-16
                                                grid-cols-[18px_minmax(0,1fr)_36px_36px]
                                                sm:grid-cols-[24px_minmax(0,1fr)_40px_40px]
                                                items-center gap-2 sm:gap-3 rounded-control
                                                px-3.5 py-2 transition-colors
                                                ${isSelected ? "bg-selected" : "hover:bg-raised"
                                    }`}
                                >
                        <span className="text-xs tabular-nums text-muted">
                            {isSelected ? (
                                <Image
                                    src="/icons/audio-lines-active.svg"
                                    alt="Current track"
                                    width={17}
                                    height={17}
                                />
                            ) : (
                                String(index + 1).padStart(2, "0")
                            )}
                        </span>

                                    <Link
                                        href={`/now-playing?trackId=${encodeURIComponent(track.id)}`}
                                        onClick={() =>
                                            selectTrack(track, playlist.tracks)
                                        }
                                        className="flex min-w-0 items-center gap-3
                                            rounded-control focus-visible:outline-2
                                            focus-visible:outline-accent"
                                              >
                                     <Image
                                            src="/artwork/default-cover.svg"
                                            alt=""
                                            width={42}
                                            height={42}
                                            className="shrink-0 rounded-control"
                                        />

                                        <div className="flex min-w-0 flex-col gap-[3px]">
                                <span
                                    className={`truncate text-sm font-medium
                                        ${isSelected
                                        ? "text-accent"
                                        : "text-foreground"
                                    }`}
                                >
                                    {track.title}
                                </span>

                                            <span className="truncate text-xs text-secondary">
                                    {track.artist}
                                </span>
                                        </div>
                                    </Link>

                                    <IconButton
                                        className="max-sm:size-9"
                                        variant={isFavorite ? "selected" : "ghost"}
                                        aria-label={
                                            isFavorite
                                                ? `Remove ${track.title} from favorites`
                                                : `Add ${track.title} to favorites`
                                        }
                                        aria-pressed={isFavorite}
                                        disabled={!favoritesLoaded}
                                        onClick={() => void toggleFavorite(track)}
                                    >
                                        <Image
                                            src={
                                                isFavorite
                                                    ? "/icons/heart-active.svg"
                                                    : "/icons/heart.svg"
                                            }
                                            alt=""
                                            width={18}
                                            height={18}
                                        />
                                    </IconButton>

                                    <IconButton
                                        variant="ghost"
                                        className="max-sm:size-9"
                                        aria-label={`Remove ${track.title} from playlist`}
                                        onClick={() =>
                                            void removeTrackFromPlaylist(
                                                playlist.id,
                                                track.id
                                            )
                                        }
                                    >
                                        <Image
                                            src="/icons/circle-minus.svg"
                                            alt=""
                                            width={18}
                                            height={18}
                                        />
                                    </IconButton>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </section>
            <section className="flex flex-col gap-4
                                rounded-card border border-border bg-surface
                                p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex flex-col gap-1.5">
                    <h2 className="text-base font-semibold text-foreground">
                        There’s more in your orbit.
                    </h2>

                    <p className="text-xs text-secondary">
                        Discover new music to add to your playlist.
                    </p>
                </div>

                <Link
                    href="/search"
                    className="inline-flex h-11 shrink-0 items-center
                                justify-center rounded-pill border border-border
                                bg-raised px-5 text-[13px] font-semibold
                                text-foreground hover:bg-raised-hover"
                                >
                    Find more songs
                </Link>
            </section>
        </main>
    );
}