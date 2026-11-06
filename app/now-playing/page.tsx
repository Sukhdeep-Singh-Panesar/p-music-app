import NowPlayingDetails from "../components/NowPlayingDetails";

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
        return <NowPlayingDetails />;
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

    return (
        <NowPlayingDetails
            routeTrack={{
                id: track.id,
                title: track.title,
                artist: track.user.name,
            }}
        />
    );
}