import "server-only";
import { prisma } from "./prisma";
import { getOrCreateUser } from "./user";

export async function getPlaylists() {
    const user = await getOrCreateUser();

    return await prisma.playlist.findMany({
        where: { userId: user.id },
        select: {
            id: true,
            name: true,
            playlistTracks: {
                select: {
                    trackId: true,
                    title: true,
                    artist: true,
                },
            },
        },
    });
}

export async function createPlaylist(name: string) {
    const user = await getOrCreateUser();

    return await prisma.playlist.create({
        data: {
            name: name,
            userId: user.id,
        },
    });
}

export async function deletePlaylist(playlistId: string) {
    const user = await getOrCreateUser();

    return await prisma.playlist.deleteMany({
        where: {
            id: playlistId,
            userId: user.id,
        },
    });
}

export async function renamePlaylist(
    playlistId: string,
    name: string
) {
    const user = await getOrCreateUser();

    return await prisma.playlist.update({
        where: {
            id: playlistId,
            userId: user.id,
        },
        data: {
            name: name,
        },
    });
}

export async function addTrackToPlaylist(
    playlistId: string,
    trackId: string,
    title: string,
    artist: string
) {
    const user = await getOrCreateUser();

    return await prisma.playlist.update({
        where: {
            id: playlistId,
            userId: user.id,
        },
        data: {
            playlistTracks: {
                upsert: {
                    where: {
                        playlistId_trackId: {
                            playlistId,
                            trackId,
                        },
                    },
                    create: { trackId, title, artist },
                    update: { title, artist },
                },
            },
        },
    });
}

export async function removeTrackFromPlaylist(
    playlistId: string,
    trackId: string
) {
    const user = await getOrCreateUser();

    return await prisma.playlist.update({
        where: {
            id: playlistId,
            userId: user.id,
        },
        data: {
            playlistTracks: {
                deleteMany: {
                    trackId,
                },
            },
        },
    });
}