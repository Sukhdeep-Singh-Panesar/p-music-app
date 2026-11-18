import LibraryContent from "./LibraryContent";
import { getOrCreateUser } from "@/lib/user";

export default async function LibraryPage() {

    await getOrCreateUser();

    return <LibraryContent />;
}