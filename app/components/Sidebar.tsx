"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const playlists = [
    {
        id: "afterglow",
        name: "Afterglow",
        tracks: 24,
    },
    {
        id: "violet-frequency",
        name: "Violet Frequency",
        tracks: 32,
    },
    {
        id: "blue-hour",
        name: "Blue Hour",
        tracks: 18,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 border-r border-[#2a3650] bg-[#0b1120] px-[18px] pt-8 text-[#f7f8ff] md:flex md:flex-col md:gap-7">

            <Link href="/" className="text-[22px] font-bold">
                P Music<span className="text-[#6366f1]">.</span>
            </Link>

            <nav aria-label="Primary navigation" className="flex flex-col gap-1">
                <p className="mb-1 text-[10px] font-semibold text-[#7786a4]">
                    YOUR SOUND, YOUR SPACE
                </p>

                <Link
                    href="/"
                    aria-current={pathname === "/" ? "page" : undefined}
                    className={`flex h-11.5 items-center rounded-lg px-3.5 text-[13px] font-semibold ${
                        pathname === "/"
                            ? "bg-[#262647] text-white"
                            : "text-[#a6b2ca] hover:text-white"
                    }`}
                >
                    Discover
                </Link>


                <Link
                    href="/library"
                    aria-current={pathname === "/library" ? "page" : undefined}
                    className={`flex h-11.5 items-center rounded-lg px-3.5 text-[13px] font-semibold ${
                        pathname === "/library"
                            ? "bg-[#262647] text-white"
                            : "text-[#a6b2ca] hover:text-white"
                    }`}
                >
                    Your Library
                </Link>

                <span className="px-[14px] py-3 text-[13px] text-[#a6b2ca]">
          Now Playing
        </span>
            </nav>
            <section className="border-t border-[#2a3650] pt-5">
                <h2 className="text-[10px] font-semibold text-[#7786a4]">
                    YOUR PLAYLISTS
                </h2>

              <ul className="mt-3 flex flex-col gap-2">
                    {playlists.map((playlist) =>
                        <li
                            key={playlist.id}
                            className="rounded-lg px-3.5 py-2 text-[13px] text-[#a6b2ca]"
                        >
                            {playlist.name} ({playlist.tracks} tracks)
                        </li>
                    )}
                </ul>

            </section>

        </aside>
    );
}