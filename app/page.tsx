import WelcomeMessage from "./components/WelcomeMessage";
import TrackCard from "./components/TrackCard";
import FeaturedBanner from "./components/FeaturedBanner";
import MusicCard from "./components/ui/MusicCard";

type AudiusTrack = {
    id: string;
    title: string;
    user: {
        name: string;
    };
};

type AudiusResponse = {
    data: AudiusTrack[];
};


async function getTrendingTracks(): Promise<AudiusTrack[]> {
    const response = await fetch(
        "https://api.audius.co/v1/tracks/trending?limit=12",
        { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch trending tracks");
    }

    const result: AudiusResponse = await response.json();

    return result.data;
}

const featuredArtworks = [
    "/artwork/frequency-1.svg",
    "/artwork/frequency-2.svg",
    "/artwork/frequency-3.svg",
    "/artwork/frequency-4.svg",
];

export default async function Home() {
    const tracks = await getTrendingTracks();

    const playbackTracks = tracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.user.name,
    }));

    const message = "Discover your next favorite track";
    return (
        <main className="flex w-full flex-col gap-6 px-5 pb-12 pt-4 lg:px-desktop-gutter">
            <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-overline uppercase tracking-wider text-muted">
                        Discover your sound
                    </p>

                    <h1 className="text-page-title font-bold text-foreground">
                        Find your next feeling.
                    </h1>
                </div>

                <WelcomeMessage message={message} />
            </section>
            {playbackTracks.length > 0 && (
                <FeaturedBanner
                    track={playbackTracks[0]}
                    tracks={playbackTracks}
                />
            )}

            <section className="flex w-full flex-col gap-[18px]">
                <h2 className="text-section-title text-foreground">
                    Find your frequency
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
                    {playbackTracks.slice(1, 5).map((track, index) => (
                        <MusicCard
                            key={track.id}
                            title={track.title}
                            description={track.artist}
                            artwork={featuredArtworks[index]}
                            href={`/now-playing?trackId=${encodeURIComponent(track.id)}`}
                        />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,390px)]">

                <section
                    id="on-the-rise"
                    className="flex min-w-0 flex-col gap-4"
                >
                    <h2 className="text-section-title text-foreground">
                        On the rise
                    </h2>

                    <div className="flex flex-col gap-1">
                        {tracks.slice(0, 4).map((track) => (
                            <TrackCard
                                key={track.id}
                                id={track.id}
                                title={track.title}
                                artist={track.user.name}
                                tracks={playbackTracks}
                            />
                        ))}
                    </div>
                </section>

                <aside
                    aria-label="More music to discover"
                    className="flex min-w-0 flex-col gap-4 rounded-card
                                border border-border bg-surface p-4"
                >
                    <p className="text-overline font-semibold
                                   uppercase text-accent">
                        More to discover
                    </p>

                    <h2 className="text-[25px] font-semibold
                                   leading-[1.25] text-foreground">
                        A little outside your usual orbit.
                    </h2>

                    <p className="text-[13px] leading-[1.4]
                                    text-secondary">
                        Explore more tracks from today&#39;s trending music.
                    </p>

                    <div className="flex flex-col gap-1">
                        {tracks.slice(4, 6).map((track) => (
                            <TrackCard
                                key={track.id}
                                id={track.id}
                                title={track.title}
                                artist={track.user.name}
                                tracks={playbackTracks}
                            />
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    );
}




 