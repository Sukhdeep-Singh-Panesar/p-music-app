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

            <form action="/search" method="get" className="flex gap-3">
                <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Search for a song or artist"
                    className="rounded-lg bg-slate-800 px-4 py-3 text-white"
                />

                <button
                    type="submit"
                    className="rounded-lg bg-indigo-500 px-5 text-white"
                >
                    Search
                </button>
            </form>

            {q && <p className="mt-6 text-gray-300">Searching for: {q}</p>}

            <div className="mt-8">
                <h2 className="text-xl font-bold text-white">Search Results</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {tracks.map((track) => (
                        <div key={track.id} className="rounded-lg bg-slate-800 p-4">
                            <h3 className="text-lg font-bold text-white">{track.title}</h3>
                            <p className="text-gray-300">by {track.user.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}