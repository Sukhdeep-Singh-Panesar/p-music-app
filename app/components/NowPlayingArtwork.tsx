import Image from "next/image";

function ArtworkLayer({
                          src,
                      }: {
    src: string;
}) {
    return (
        <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 432px"
            className="object-fill"
        />
    );
}

export default function NowPlayingArtwork() {
    return (
        <div
            role="img"
            aria-label="Abstract purple album artwork"
            className="relative aspect-square w-full max-w-[432px]
                overflow-hidden rounded-card bg-[#181638]"
        >
            <div
                className="absolute inset-0
                    bg-[linear-gradient(90deg,#181638,#8b5cf6_65%,#181638)]"
            />

            <div className="absolute -left-[11%] top-[3%] h-[95%] w-[115%]">
                <ArtworkLayer src="/artwork/now-playing-ambient.svg" />
            </div>

            <div className="absolute -top-[23.5%] left-[9%]
                flex h-[105.3%] w-[108.7%]
                items-center justify-center">
                <div className="relative h-[73%] w-[77%] -rotate-[25deg]">
                    <ArtworkLayer src="/artwork/now-playing-halo.svg" />
                </div>
            </div>

            <div className="absolute left-[24%] top-[28%]
                h-[45%] w-[53%]">
                <ArtworkLayer src="/artwork/now-playing-eclipse.svg" />
            </div>

            <div className="absolute left-0 top-[45%]
                h-[40%] w-full">
                <ArtworkLayer src="/artwork/now-playing-arcs.svg" />
            </div>

            <div className="absolute bottom-[5%] left-[5.5%]
                flex flex-col gap-1 text-left text-foreground">
                <span className="text-[10px] font-semibold">
                    P MUSIC
                </span>
                <span className="text-[21px] font-semibold leading-[1.25]">
                    NOW PLAYING
                </span>
            </div>
        </div>
    );
}