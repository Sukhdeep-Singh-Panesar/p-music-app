"use client";
import {
    getFavoritesAction,
    addFavoriteAction,
    removeFavoriteAction,
} from "@/app/actions/favorites";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    type ReactNode,
} from "react";

import {
    getPlaylistsAction,
    createPlaylistAction,
    deletePlaylistAction,
    renamePlaylistAction,
    addTrackToPlaylistAction,
    removeTrackFromPlaylistAction,
} from "@/app/actions/playlists";

import type { Playlist } from "../types/playlist";

import { useAuth } from "@clerk/nextjs";

export type PlayerTrack = {
    id: string;
    title: string;
    artist: string;
};

type RepeatMode = "off" | "all" | "one";

type PlayerContextType = {
    currentTrack: PlayerTrack | null;
    selectTrack: (track: PlayerTrack, tracks?: PlayerTrack[]) => void;
    queue: PlayerTrack[];
    currentIndex: number;
    playNext: () => void;
    playPrevious: () => void;
    favorites: PlayerTrack[];
    toggleFavorite: (track: PlayerTrack) => Promise<void>;
    playlists: Playlist[];
    createPlaylist: (name: string) => Promise<boolean>;
    deletePlaylist: (playlistId: string) => Promise<void>;
    addTrackToPlaylist: (playlistId: string, track: PlayerTrack) => Promise<void>;
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
    renamePlaylist: (playlistId: string, name: string) => Promise<void>;
    playlistsLoaded: boolean;
    repeatMode: RepeatMode;
    cycleRepeatMode: () => void;
    shuffleEnabled: boolean;
    toggleShuffle: () => void;
    favoritesLoaded: boolean;
};


const PlayerContext = createContext<PlayerContextType | null>(null);

function shuffleTracks(tracks: PlayerTrack[]): PlayerTrack[] {
    const shuffled = [...tracks];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function PlayerProvider({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const { isLoaded, isSignedIn, userId, sessionId } = useAuth();
    const pendingFavorites = useRef<Set<string>>(new Set());
    const pendingPlaylists = useRef<Set<string>>(new Set());
    const [playback, setPlayback] = useState<{
        queue: PlayerTrack[];
        originalQueue: PlayerTrack[];
        index: number;
        shuffleEnabled: boolean;
    }>({
        queue: [],
        originalQueue: [],
        index: 0,
        shuffleEnabled: false,
    });

    const queue = playback.queue;
    const currentIndex = playback.index;
    const currentTrack = queue[currentIndex] ?? null;

    const [playlistState, setPlaylistState] = useState<{
        owner: string;
        playlists: Playlist[];
        session: string;
    } | null>(null);

    const playlistsLoaded = Boolean(
        isLoaded &&
        isSignedIn &&
        userId &&
        sessionId &&
        playlistState?.owner === userId &&
        playlistState?.session === sessionId
    );

    const playlists = playlistsLoaded
        ? playlistState?.playlists ?? []
        : [];

    const [favoriteState, setFavoriteState] = useState<{
        owner: string;
        tracks: PlayerTrack[];
        session: string;
    } | null>(null);

    const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

    const favorites = favoriteState?.tracks ?? [];
    const favoritesOwner = favoriteState?.owner ?? null;

    const favoritesLoaded = Boolean(
        isLoaded &&
        isSignedIn &&
        userId &&
        sessionId &&
        favoritesOwner === userId &&
        favoriteState?.session === sessionId
    );

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId || !sessionId) return;

        const owner = userId;
        const session = sessionId;

        let ignore = false;

        async function loadFavorites() {
            try {
                const data = await getFavoritesAction();

                if (!ignore) {
                    setFavoriteState({
                        owner: owner,
                        tracks: data.map((track) => ({
                            id: track.trackId,
                            title: track.title,
                            artist: track.artist,
                        })),
                        session: session,
                    });
                }
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
        }

        void loadFavorites();
        return () => {
            ignore = true;
        };
    }, [isLoaded, isSignedIn, userId, sessionId]);


    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId || !sessionId) return;

        const owner = userId;
        const session = sessionId;

        let ignore = false;

        async function loadPlaylists() {
            try {
                const data = await getPlaylistsAction();

                if (!ignore) {
                    setPlaylistState({
                        owner: owner,
                        playlists: data.map((playlist) => ({
                            id: playlist.id,
                            name: playlist.name,
                            tracks: playlist.playlistTracks.map((track) => ({
                                id: track.trackId,
                                title: track.title,
                                artist: track.artist,
                            })),
                        })),
                        session: session,
                    });
                }
            } catch (error) {
                console.error("Failed to load playlists:", error);
            }
        }

        void loadPlaylists();

        return () => {
            ignore = true;
        };
    }, [isLoaded, isSignedIn, userId, sessionId]);


    async function toggleFavorite(track: PlayerTrack) {
        if (!isLoaded || !isSignedIn || !userId || !sessionId ||
            !favoriteState || favoritesOwner !== userId ||
            favoriteState.session !== sessionId) {
            return;
        }
        const requestKey = `${userId}:${track.id}`;

        if (pendingFavorites.current.has(requestKey)) {
            return;
        }

        pendingFavorites.current.add(requestKey);
            try {
                const isFavorite = favorites.some(
                    (saved) => saved.id === track.id
                );

                if (isFavorite) {
                    await removeFavoriteAction(track.id);
                } else {
                    await addFavoriteAction(track.id, track.title, track.artist);
                }
                setFavoriteState((previous) => {
                    if (!previous || previous.owner !== userId ||
                        previous.session !== sessionId) {
                        return previous;
                    }

                    return {
                        ...previous,
                        tracks: isFavorite
                            ? previous.tracks.filter(
                                (saved) => saved.id !== track.id
                            )
                            : [...previous.tracks, track],
                    };
                });
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
            }
            finally {
                pendingFavorites.current.delete(requestKey);
            }
    }

    function updatePlaylists(
        updater: (previous: Playlist[]) => Playlist[]
    ) {
        setPlaylistState((previous) => {
            if (!previous ||
                previous.owner !== userId ||
                previous.session !== sessionId) {
                return previous;
            }

            return {
                ...previous,
                playlists: updater(previous.playlists),
            };
        });
    }

    async function createPlaylist(name: string): Promise<boolean> {
        const trimmedName = name.trim();

        if (!trimmedName || !playlistsLoaded) return false;

        const requestKey = `${sessionId}:create`;

        if (pendingPlaylists.current.has(requestKey)) {
            return false;
        }

        pendingPlaylists.current.add(requestKey);

        try {
            const created = await createPlaylistAction(trimmedName);

            setPlaylistState((previous) => {
                if (!previous ||
                    previous.owner !== userId ||
                    previous.session !== sessionId) {
                    return previous;
                }

                return {
                    ...previous,
                    playlists: [
                        ...previous.playlists,
                        {
                            id: created.id,
                            name: created.name,
                            tracks: [],
                        },
                    ],
                };
            });

            return true;

        } catch (error) {
            console.error("Failed to create playlist:", error);
            return false;
        } finally {
            pendingPlaylists.current.delete(requestKey);
        }
    }

    async function deletePlaylist(playlistId: string) {
        if (!playlistsLoaded) return;
        const requestKey = `${sessionId}:${playlistId}`;

        if (pendingPlaylists.current.has(requestKey)) {
            return;
        }

        pendingPlaylists.current.add(requestKey);
        try {
            await deletePlaylistAction(playlistId);

            updatePlaylists((previous) =>
                previous.filter((playlist) => playlist.id !== playlistId)
            );
        } catch (error) {
            console.error("Failed to delete playlist:", error);
        }
        finally {
            pendingPlaylists.current.delete(requestKey);
        }
    }

    async function addTrackToPlaylist(
        playlistId: string,
        track: PlayerTrack
    ) {
        if (!playlistsLoaded) return;
        const requestKey = `${sessionId}:${playlistId}`;

        if (pendingPlaylists.current.has(requestKey)) {
            return;
        }

        pendingPlaylists.current.add(requestKey);
        try {
            await addTrackToPlaylistAction(
                playlistId,
                track.id,
                track.title,
                track.artist
            );

            updatePlaylists((previous) =>
                previous.map((playlist) => {
                    if (playlist.id !== playlistId) return playlist;

                    return {
                        ...playlist,
                        tracks: [
                            ...playlist.tracks.filter((t) => t.id !== track.id),
                            track,
                        ],
                    };
                })
            );
        } catch (error) {
            console.error("Failed to add track to playlist:", error);
        }
        finally {
            pendingPlaylists.current.delete(requestKey);
        }
    }

    async function removeTrackFromPlaylist(
        playlistId: string,
        trackId: string
    ) {
        if (!playlistsLoaded) return;
        const requestKey = `${sessionId}:${playlistId}`;

        if (pendingPlaylists.current.has(requestKey)) {
            return;
        }

        pendingPlaylists.current.add(requestKey);
        try {
            await removeTrackFromPlaylistAction(playlistId, trackId);

            updatePlaylists((previous) =>
                previous.map((playlist) => {
                    if (playlist.id !== playlistId) return playlist;

                    return {
                        ...playlist,
                        tracks: playlist.tracks.filter(
                            (track) => track.id !== trackId
                        ),
                    };
                })
            );
        } catch (error) {
            console.error("Failed to remove track from playlist:", error);
        }
        finally {
            pendingPlaylists.current.delete(requestKey);
        }
    }

    async function renamePlaylist(playlistId: string, name: string) {
        const trimmedName = name.trim();

        if (!trimmedName || !playlistsLoaded) return;
        const requestKey = `${sessionId}:${playlistId}`;

        if (pendingPlaylists.current.has(requestKey)) {
            return;
        }

        pendingPlaylists.current.add(requestKey);
        try {
            await renamePlaylistAction(playlistId, trimmedName);

            updatePlaylists((previous) =>
                previous.map((playlist) =>
                    playlist.id === playlistId
                        ? { ...playlist, name: trimmedName }
                        : playlist
                )
            );
        } catch (error) {
            console.error("Failed to rename playlist:", error);
        }
        finally {
            pendingPlaylists.current.delete(requestKey);
        }
    }

    const selectTrack = useCallback(
        (track: PlayerTrack, tracks?: PlayerTrack[]) => {
            const originalQueue = tracks?.some(
                (song) => song.id === track.id
            ) ? tracks : [track];

            const shuffledQueue = [
                track,
                ...shuffleTracks(
                    originalQueue.filter(
                        (song) => song.id !== track.id
                    )
                ),
            ];

            setPlayback((previous) => {
                if (!tracks &&
                    previous.queue[previous.index]?.id === track.id) {
                    return previous;
                }

                return {
                    ...previous,
                    originalQueue,
                    queue: previous.shuffleEnabled
                        ? shuffledQueue
                        : originalQueue,
                    index: previous.shuffleEnabled
                        ? 0
                        : originalQueue.findIndex(
                            (song) => song.id === track.id
                        ),
                };
            });
        },
        []
    );

    const playNext = useCallback(() => {
        setPlayback((previous) => {
            if (previous.queue.length === 0) return previous;

            if (previous.index >= previous.queue.length - 1) {
                return repeatMode === "all"
                    ? { ...previous, index: 0 }
                    : previous;
            }

            return { ...previous, index: previous.index + 1 };
        });
    }, [repeatMode]);

    const playPrevious = useCallback(() => {
        setPlayback((previous) => {
            if (previous.queue.length === 0) return previous;

            if (previous.index === 0) {
                return repeatMode === "all"
                    ? { ...previous, index: previous.queue.length - 1 }
                    : previous;
            }

            return { ...previous, index: previous.index - 1 };
        });
    }, [repeatMode]);

    function cycleRepeatMode() {
        setRepeatMode((previous) => {
            if (previous === "off") return "all";
            if (previous === "all") return "one";

            return "off";
        });
    }

    function toggleShuffle() {
        if (!currentTrack) return;

        if (playback.shuffleEnabled) {
            setPlayback({
                ...playback,
                queue: playback.originalQueue,
                index: playback.originalQueue.findIndex(
                    (track) => track.id === currentTrack.id
                ),
                shuffleEnabled: false,
            });
        } else {
            const remainingTracks = queue.filter(
                (track) => track.id !== currentTrack.id
            );

            setPlayback({
                ...playback,
                queue: [
                    currentTrack,
                    ...shuffleTracks(remainingTracks),
                ],
                index: 0,
                shuffleEnabled: true,
            });
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                selectTrack,
                queue,
                currentIndex,
                playNext,
                playPrevious,
                favorites: isLoaded && isSignedIn &&
                favoritesOwner === userId &&
                favoriteState?.session === sessionId
                    ? favorites
                    : [],
                toggleFavorite,
                playlists,
                createPlaylist,
                deletePlaylist,
                addTrackToPlaylist,
                removeTrackFromPlaylist,
                renamePlaylist,
                playlistsLoaded,
                repeatMode,
                cycleRepeatMode,
                shuffleEnabled: playback.shuffleEnabled,
                toggleShuffle,
                favoritesLoaded,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error("usePlayer must be used inside PlayerProvider");
    }

    return context;
}