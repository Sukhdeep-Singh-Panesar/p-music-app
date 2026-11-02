type TrackCardProps = {
    title: string;
    artist: string;
};

export default function TrackCard({
                                      title,
                                      artist,
                                  }: TrackCardProps) {
    return (
        <div className="rounded-lg bg-indigo-950 p-4">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-400">{artist}</p>
        </div>
    );
}