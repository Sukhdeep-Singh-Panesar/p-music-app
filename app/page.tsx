import WelcomeMessage from "./components/WelcomeMessage";
import TrackCard from "./components/TrackCard";

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
        "https://api.audius.co/v1/tracks/trending?limit=3",
        { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch trending tracks");
    }

    const result: AudiusResponse = await response.json();

    return result.data;
}

export default async function Home() {
    const tracks = await getTrendingTracks();
    const message = "Discover your next favorite track";
  return (
      <div className="flex flex-col items-center justify-center mt-0 min-h-screen">
        <h1 className="text-6xl font-bold mb-4 text-blue-300">
          P Music App
        </h1>
        <WelcomeMessage message={message} />
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              title={track.title}
              artist={track.user.name}
            />
          ))}
        <div className="text-4xl"></div>
      </div>
  );
}




 