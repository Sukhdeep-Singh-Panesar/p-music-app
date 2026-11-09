"use client";

import { usePlayer } from "../components/PlayerProvider";
import TrackCard from "../components/TrackCard";
export default function LibraryPage() {
    const { favorites } = usePlayer();
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Your Library
            </h1>
            <p className="mt-3 text-gray-400">
                {favorites.length} saved songs
            </p>

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
                    />
                ))}
            </div>

        </main>
    );
}