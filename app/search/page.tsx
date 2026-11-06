import TrackCard from "../components/TrackCard";
import SearchForm from "../components/SearchForm";
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


async function searchTracks(query: string): Promise<AudiusTrack[]> {
    const url = new URL("https://api.audius.co/v1/tracks/search");

    url.searchParams.set("query", query);
    url.searchParams.set("limit", "6");

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error("Failed to search tracks");
    }

    const result: AudiusResponse = await response.json();
    return result.data;
}

export default async function SearchPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q = "" } = await searchParams;
    const tracks = q.trim() ? await searchTracks(q.trim()) : [];

    return (
        <main className="p-8">
            <h1 className="mb-6 text-3xl font-bold text-white">
                Search Music
            </h1>

            <SearchForm initialQuery={q} />

            {q && <p className="mt-6 text-gray-300">Searching for: {q}</p>}

            <div className="mt-8">
                <h2 className="text-xl font-bold text-white">Search Results</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

                    {q.trim() && tracks.length === 0 && (
                        <p className="col-span-full mt-6 text-gray-400">
                            No tracks found. Try another song or artist.
                        </p>
                    )}
                    {tracks.map((track) => (
                        <TrackCard
                            id={track.id}
                            key={track.id}
                            title={track.title}
                            artist={track.user.name}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}