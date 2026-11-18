"use server";

import {
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
} from "@/lib/playlists";

function validateText(value: unknown) {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error("Invalid input");
    }
}

export async function getPlaylistsAction() {
    return await getPlaylists();
}

export async function createPlaylistAction(name: string) {
    validateText(name);
    return await createPlaylist(name);
}

export async function deletePlaylistAction(playlistId: string) {
    validateText(playlistId);

    const result = await deletePlaylist(playlistId);

    if (result.count === 0) {
        throw new Error("Playlist not found");
    }

    return result;
}

export async function renamePlaylistAction(
    playlistId: string,
    name: string
) {
    validateText(playlistId);
    validateText(name);
    return await renamePlaylist(playlistId, name);
}

export async function addTrackToPlaylistAction(
    playlistId: string,
    trackId: string,
    title: string,
    artist: string
) {
    validateText(playlistId);
    validateText(trackId);
    validateText(title);
    validateText(artist);
    return await addTrackToPlaylist(playlistId, trackId, title, artist);
}

export async function removeTrackFromPlaylistAction(
    playlistId: string,
    trackId: string
) {
    validateText(playlistId);
    validateText(trackId);
    return await removeTrackFromPlaylist(playlistId, trackId);
}