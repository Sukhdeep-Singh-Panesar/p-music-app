"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import type { Playlist } from "../types/playlist";
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
    toggleFavorite: (track: PlayerTrack) => void;
    playlists: Playlist[];
    createPlaylist: (name: string) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const [currentTrack, setCurrentTrack] =
        useState<PlayerTrack | null>(null);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [favorites, setFavorites] = useState<PlayerTrack[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const saved = localStorage.getItem("p-music-favorites");
            const parsed: unknown = saved ? JSON.parse(saved) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Failed to load favorites:", error);
            return [];
        }
    });

    const hasHydrated = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot
    );

    useEffect(() => {
        if (!hasHydrated) return;

        try {
            localStorage.setItem(
                "p-music-favorites",
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.error("Failed to save favorites:", error);
        }
    }, [favorites, hasHydrated]);

    function toggleFavorite(track: PlayerTrack) {
        setFavorites((previous) => {
            const alreadySaved = previous.some(
                (saved) => saved.id === track.id
            );

            if (alreadySaved) {
                return previous.filter(
                    (saved) => saved.id !== track.id
                );
            }

            return [...previous, track];
        });
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
    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                selectTrack: setCurrentTrack,
                favorites: hasHydrated ? favorites : [],
                toggleFavorite,
                playlists,
                createPlaylist,
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