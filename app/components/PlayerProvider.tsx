"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

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
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const [currentTrack, setCurrentTrack] =
        useState<PlayerTrack | null>(null);
    const [favorites, setFavorites] =
        useState<PlayerTrack[]>([]);

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
    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                selectTrack: setCurrentTrack,
                favorites,
                toggleFavorite,
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