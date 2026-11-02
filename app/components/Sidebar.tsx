import Link from "next/link";

export default function Sidebar() {
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
                    aria-current="page"
                    className="flex h-[46px] items-center rounded-lg bg-[#262647] px-[14px] text-[13px] font-semibold"
                >
                    Discover
                </Link>

                <span className="px-[14px] py-3 text-[13px] text-[#a6b2ca]">
          Your Library
        </span>

                <span className="px-[14px] py-3 text-[13px] text-[#a6b2ca]">
          Now Playing
        </span>
            </nav>
        </aside>
    );
}