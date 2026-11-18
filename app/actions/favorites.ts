"use server";

import { addFavorite, removeFavorite, getFavorites } from "@/lib/favorites";

export async function addFavoriteAction(
    trackId: string,
    title: string,
    artist: string
) {
    if (
        typeof trackId !== "string" ||
        typeof title !== "string" ||
        typeof artist !== "string" ||
        !trackId.trim() ||
        !title.trim() ||
        !artist.trim()
    ) {
        throw new Error("Invalid track information");
    }
    return await addFavorite(trackId, title, artist);
}

export async function removeFavoriteAction(trackId: string) {
    if (typeof trackId !== "string" || !trackId.trim()) {
        throw new Error("Invalid track ID");
    }
    return await removeFavorite(trackId);
}

export async function getFavoritesAction() {
    return await getFavorites();
}