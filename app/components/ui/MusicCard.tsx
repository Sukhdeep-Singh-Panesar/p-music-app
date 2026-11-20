import Image from "next/image";
import Link from "next/link";

type MusicCardProps = {
    title: string;
    description: string;
    artwork?: string;
    href: string;
};

export default function MusicCard({
                                      title,
                                      description,
                                      artwork = "/artwork/default-cover.svg",
                                      href
                                  }: MusicCardProps) {
    return (
        <Link
            href={href}
            className="flex w-full min-w-0 flex-col gap-2.5
        rounded-card p-2 transition-colors
        hover:bg-raised
        focus-visible:outline-solid
        focus-visible:outline-2
        focus-visible:outline-accent"
        >
            <Image
                src={artwork}
                alt=""
                width={220}
                height={220}
                className="aspect-square h-auto w-full rounded-card object-cover"
            />

            <div className="flex flex-col gap-[3px]">
                <h3 className="truncate text-[15px] font-semibold leading-[1.4] text-foreground">
                    {title}
                </h3>

                <p className="truncate text-xs leading-[1.4] text-secondary">
                    {description}
                </p>
            </div>
        </Link>
    );
}