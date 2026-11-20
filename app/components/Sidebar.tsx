"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "./PlayerProvider";
import { useAuth } from "@clerk/nextjs";
import NavigationItem from "./ui/NavigationItem";

export default function Sidebar() {
    const pathname = usePathname();
    const { playlists, playlistsLoaded } = usePlayer();
    const { isLoaded, isSignedIn } = useAuth();
    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 border-r border-[#2a3650] bg-[#0b1120] px-4.5 pt-8 text-[#f7f8ff] md:flex md:flex-col md:gap-7">

            <Link href="/" className="text-[22px] font-bold">
                P Music<span className="text-[#6366f1]">.</span>
            </Link>

            <nav aria-label="Primary navigation" className="flex flex-col gap-1">
                <p className="mb-1 text-[10px] font-semibold text-[#7786a4]">
                    YOUR SOUND, YOUR SPACE
                </p>

                <NavigationItem
                    href="/"
                    label="Discover"
                    active={pathname === "/"}
                    icon="/icons/compass.svg"
                    activeIcon="/icons/compass-active.svg"
                />

                <NavigationItem
                    href="/library"
                    label="Your Library"
                    active={pathname === "/library"}
                    icon="/icons/library.svg"
                    activeIcon="/icons/library-active.svg"
                />

                <NavigationItem
                    href="/now-playing"
                    label="Now Playing"
                    active={pathname === "/now-playing"}
                    icon="/icons/audio-lines.svg"
                    activeIcon="/icons/audio-lines-active.svg"
                />

                <NavigationItem
                    href="/search"
                    label="Search"
                    active={pathname === "/search"}
                    icon="/icons/search.svg"
                    iconSize={18}
                />


            </nav>
            {playlistsLoaded && isLoaded && isSignedIn && (
                <section className="border-t border-[#2a3650] pt-5">
                <h2 className="text-[10px] font-semibold text-[#7786a4]">
                    YOUR PLAYLISTS
                </h2>
                {playlists.length === 0 && (
                    <p className="mt-3 text-sm text-gray-500">
                        No playlists yet.
                    </p>
                )}
                <ul className="mt-3 flex flex-col gap-2">
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            <Link
                                href={`/playlist/${playlist.id}`}
                                aria-current={
                                    pathname === `/playlist/${playlist.id}`
                                        ? "page"
                                        : undefined
                                }
                                className={`block rounded-lg px-3.5 py-2 text-[13px] ${
                                    pathname === `/playlist/${playlist.id}`
                                        ? "bg-[#262647] text-white"
                                        : "text-[#a6b2ca] hover:text-white"
                                }`}
                            >
                                {playlist.name} ({playlist.tracks.length} tracks)
                            </Link>
                        </li>
                    ))}
                </ul>

            </section>
            )}
        </aside>
    );
}