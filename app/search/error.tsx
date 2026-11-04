"use client";

export default function SearchError() {
    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-white">
                Couldn&#39;t load music results
            </h2>

            <p className="mt-3 text-gray-400">
                The music service may be temporarily unavailable.
                Please try searching again.
            </p>
        </div>
    );
}