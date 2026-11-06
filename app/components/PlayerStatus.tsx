"use client";

import { usePlayer } from "./PlayerProvider";

export default function PlayerStatus() {
    const { currentTrack } = usePlayer();

    if (!currentTrack) {
        return (
            <p className="text-sm text-gray-400">
                No track selected
            </p>
        );
    }

    return (
        <div>
            <p className="text-sm font-medium">
                {currentTrack.title}
            </p>
            <p className="text-xs text-gray-400">
                {currentTrack.artist}
            </p>
        </div>
    );
}