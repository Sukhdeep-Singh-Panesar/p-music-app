import "server-only";
import { prisma } from "./prisma";
import { getOrCreateUser } from "./user";

export async function getFavorites() {
    const user = await getOrCreateUser();

    const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: {
            trackId: true,
            title: true,
            artist: true,
        },
    });

    return favorites;
}

export async function addFavorite(trackId: string, title: string, artist: string) {
    const user = await getOrCreateUser();

    const favorite = await prisma.favorite.upsert({
        create: {
            userId: user.id,
            trackId,
            title,
            artist,
        },
        update: {
            title,
            artist,
        },
        where: {
            userId_trackId: {
                userId: user.id,
                trackId,
            },
        },
    });

    return favorite;
}

export async function removeFavorite(trackId: string) {
    const user = await getOrCreateUser();

    return await prisma.favorite.deleteMany({
        where: {
            userId: user.id,
            trackId,
        },
    });
}