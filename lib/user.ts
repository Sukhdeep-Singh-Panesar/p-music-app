import "server-only";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";


export async function getOrCreateUser(): Promise<{ id: string }> {
    const { userId } = await auth.protect();

    return await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
            clerkId: userId,
        },
        select: {
            id: true,
        },
    });
}