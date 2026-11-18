import { auth } from "@clerk/nextjs/server";
import LibraryContent from "./LibraryContent";

export default async function LibraryPage() {
    await auth.protect();

    return <LibraryContent />;
}