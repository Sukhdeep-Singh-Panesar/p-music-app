type AudiusTrack = {
    id: string;
    title: string;
    user: {
        name: string;
    };
};

type AudiusTrackResponse = {
    data: AudiusTrack;
};

export default async function NowPlayingPage({
                                                 searchParams,
                                             }: {
    searchParams: Promise<{ trackId?: string }>;
}) {
    const { trackId } = await searchParams;

    if (!trackId) {
        return (
            <main className="p-8 text-white">
                <h1 className="text-3xl font-bold">Now Playing</h1>
                <p className="mt-4 text-gray-400">
                    Choose a track from Discover or Search.
                </p>
            </main>
        );
    }

    const response = await fetch(
        `https://api.audius.co/v1/tracks/${encodeURIComponent(trackId)}`,
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error("Failed to load the selected track");
    }

    const result: AudiusTrackResponse = await response.json();
    const track = result.data;

    const streamUrl =
        `https://api.audius.co/v1/tracks/${encodeURIComponent(track.id)}/stream`;

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold text-white">
                Now Playing
            </h1>

            <div className="mt-6 flex flex-col items-center text-center">
                <div className="mb-6 flex aspect-square w-64 items-center justify-center rounded-xl bg-[#27264c]">
                    <span className="text-6xl" aria-hidden="true">🎵</span>
                </div>

                <h2 className="text-3xl font-bold text-white">
                    {track.title}
                </h2>

                <p className="mt-2 text-gray-400">
                    by {track.user.name}
                </p>

                <audio
                    key={track.id}
                    controls
                    preload="metadata"
                    src={streamUrl}
                    className="mt-8 w-full max-w-md"
                >
                    Your browser does not support audio playback.
                </audio>
            </div>
        </main>
    );
}