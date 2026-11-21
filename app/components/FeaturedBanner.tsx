"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import Button from "./ui/Button";

type FeaturedBannerProps = {
    track: PlayerTrack;
    tracks: PlayerTrack[];
};

export default function FeaturedBanner({
                                           track,
                                           tracks,
                                       }: FeaturedBannerProps) {
    const { selectTrack } = usePlayer();

    return (
        <section
            aria-label="Featured music"
            className="flex w-full flex-col overflow-hidden
                rounded-hero bg-selected xl:min-h-[320px]
                xl:flex-row"
        >
            <div className="flex min-w-0 flex-1 flex-col
                justify-center gap-4 p-6 xl:p-8">

                <p className="text-[10px] font-semibold
                    text-focus">
                    FEATURED / TRENDING NOW
                </p>

                <h2 className="text-[34px] font-bold
                    leading-[1.12] text-foreground
                    xl:text-[46px]">
                    Let the world fade out.
                </h2>

                <p className="text-sm leading-[1.4]
                    text-[#c2c6e0]">
                    Start with {track.title} by {track.artist}.
                    Discover your next favorite sound.
                </p>

                <div className="flex flex-wrap gap-2.5">
                    <Button
                        onClick={() => selectTrack(track, tracks)}
                    >
                        <Image
                            src="/icons/play-small.svg"
                            alt=""
                            width={17}
                            height={17}
                        />
                        Play featured track
                    </Button>

                    <Link
                        href="#on-the-rise"
                        className="inline-flex h-11 items-center
                            rounded-pill border border-border
                            bg-raised px-5 text-[13px]
                            font-semibold text-foreground
                            hover:bg-raised-hover"
                    >
                        Explore tracks
                    </Link>
                </div>
            </div>

            <Image
                src="/artwork/discover-hero.svg"
                alt=""
                width={440}
                height={320}
                className="h-[220px] w-full object-cover
                    xl:h-[320px] xl:w-[440px]
                    xl:shrink-0"
            />
        </section>
    );
}