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
    useSyncExternalStore,
    type ReactNode,
} from "react";
import type { Playlist } from "../types/playlist";

import { useAuth } from "@clerk/nextjs";
function subscribe() {
    return () => {};
}

function getClientSnapshot() {
    return true;
}

function getServerSnapshot() {
    return false;
}

export type PlayerTrack = {
    id: string;
    title: string;
    artist: string;
};

type PlayerContextType = {
    currentTrack: PlayerTrack | null;
    selectTrack: (track: PlayerTrack) => void;
    favorites: PlayerTrack[];
    toggleFavorite: (track: PlayerTrack) => Promise<void>;
    playlists: Playlist[];
    createPlaylist: (name: string) => void;
    deletePlaylist: (playlistId: string) => void;
    addTrackToPlaylist: (playlistId: string, track: PlayerTrack) => void;
    removeTrackFromPlaylist: (
        playlistId: string,
        trackId: string
    ) => void;
    renamePlaylist: (playlistId: string, name: string) => void;
    playlistsLoaded: boolean;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const { isLoaded, isSignedIn, userId, sessionId } = useAuth();
    const pendingFavorites = useRef<Set<string>>(new Set());
    const [currentTrack, setCurrentTrack] =
        useState<PlayerTrack | null>(null);

    const [playlists, setPlaylists] = useState<Playlist[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const saved = localStorage.getItem("p-music-playlists");
            const parsed: unknown = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Failed to load playlists:", error);
            return [];
        }
    });

    const [favoriteState, setFavoriteState] = useState<{
        owner: string;
        tracks: PlayerTrack[];
        session: string;
    } | null>(null);

    const favorites = favoriteState?.tracks ?? [];
    const favoritesOwner = favoriteState?.owner ?? null;

    const hasHydrated = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot
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
        if (!hasHydrated) return;

        try {
            localStorage.setItem(
                "p-music-playlists",
                JSON.stringify(playlists)
            );
        } catch (error) {
            console.error("Failed to save playlists:", error);
        }
    }, [playlists, hasHydrated]);

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

    function createPlaylist(name: string) {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const newPlaylist: Playlist = {
            id: crypto.randomUUID(),
            name: trimmedName,
            tracks: [],
        };
        setPlaylists((previous) => [...previous, newPlaylist]);
    }

    function deletePlaylist(playlistId: string) {
        setPlaylists((previous) =>
            previous.filter((playlist) => playlist.id !== playlistId)
        );
    }

    function addTrackToPlaylist(
        playlistId: string,
        track: PlayerTrack
    ) {
        setPlaylists((previous) => {
            return previous.map((playlist) => {
                if (playlist.id === playlistId) {
                    const alreadyAdded = playlist.tracks.some(
                        (t) => t.id === track.id
                    );
                    if (alreadyAdded) return playlist;

                    return {
                        ...playlist,
                        tracks: [...playlist.tracks, track],
                    };
                }
                return playlist;
            });
        });
    }

    function removeTrackFromPlaylist(
        playlistId: string,
        trackId: string
    ) {
        setPlaylists((previous) => {
            return previous.map((playlist) => {
                if (playlist.id === playlistId) {
                    return {
                        ...playlist,
                        tracks: playlist.tracks.filter(
                            (t) => t.id !== trackId
                        ),
                    };
                }
                return playlist;
            });
        });
    }

    function renamePlaylist(playlistId: string, name: string) {
        const trimmedName = name.trim();

        if (!trimmedName) return;

        setPlaylists((previous) => {
            return previous.map((playlist) => {
                if (playlist.id === playlistId) {
                    return {
                        ...playlist,
                        name: trimmedName,
                    };
                }
                return playlist;
            });
        });
    }
    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                selectTrack: setCurrentTrack,
                favorites: isLoaded && isSignedIn &&
                favoritesOwner === userId &&
                favoriteState?.session === sessionId
                    ? favorites
                    : [],
                toggleFavorite,
                playlists: hasHydrated ? playlists : [],
                createPlaylist,
                deletePlaylist,
                addTrackToPlaylist,
                removeTrackFromPlaylist,
                renamePlaylist,
                playlistsLoaded: hasHydrated,
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