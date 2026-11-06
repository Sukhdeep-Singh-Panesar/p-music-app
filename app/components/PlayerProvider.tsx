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
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
                                   children,
                               }: {
    children: ReactNode;
}) {
    const [currentTrack, setCurrentTrack] =
        useState<PlayerTrack | null>(null);

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                selectTrack: setCurrentTrack,
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