import { auth } from "@clerk/nextjs/server";
import PlaylistContent from "./PlaylistContent";

export default async function PlaylistPage() {
    await auth.protect();

    return <PlaylistContent />;
}