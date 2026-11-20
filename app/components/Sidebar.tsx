"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePlayer } from "./PlayerProvider";
import { useAuth } from "@clerk/nextjs";
import NavigationItem from "./ui/NavigationItem";
import Image from "next/image";
export default function Sidebar() {
    const pathname = usePathname();
    const { playlists, playlistsLoaded } = usePlayer();
    const { isLoaded, isSignedIn } = useAuth();
    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden
                            w-desktop-sidebar border-r border-border
                            bg-sidebar px-4.5 pt-8 pb-7 text-foreground
                            md:flex md:flex-col md:gap-7">

            <Link href="/" className="flex items-center gap-2.5">
                <Image
                    src="/icons/brand.svg"
                    alt=""
                    width={36}
                    height={36}
                />

                <span className="text-[22px] font-bold leading-[1.25]">
        P Music<span className="text-primary">.</span>
    </span>
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
                                className={`flex items-center gap-2.5 rounded-control
                                            transition-colors
                                            focus-visible:outline-solid
                                            focus-visible:outline-2
                                            focus-visible:outline-accent
                                            ${pathname === `/playlist/${playlist.id}`
                                            ? "bg-selected"
                                            : "hover:bg-raised"
                                        }`}
                            >
                                <Image
                                    src="/artwork/default-cover.svg"
                                    alt=""
                                    width={34}
                                    height={34}
                                    className="shrink-0 rounded-control"
                                />

                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <p className="truncate text-xs font-medium leading-[1.4] text-foreground">
                                        {playlist.name}
                                    </p>

                                    <p className="text-[10px] leading-[1.4] text-muted">
                                        {playlist.tracks.length} tracks
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

            </section>
            )}
        </aside>
    );
}