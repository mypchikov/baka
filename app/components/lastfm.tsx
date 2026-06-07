"use client";

import { useState, useEffect } from 'react';

interface Track {
    name: string;
    artist: { '#text': string };
    album: { '#text': string };
    image: { '#text': string }[];
    '@attr'?: { nowplaying: string };
}

const UPDATE_INTERVAL_MS = 30 * 1000; // 30 seconds

const ListeningCard = () => {
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        const fetchTrack = async () => {
            const apiKey = 'fa3a2ea96a5d06805621316ece3f23f5';
            const username = 'murchikov';
            try {
                const response = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
                );
                if (!response.ok) {
                    setTrack(null);
                    return;
                }
                const data = await response.json();
                const recentTrack: Track | undefined = data.recenttracks.track[0];

                if (recentTrack) {
                    setTrack(recentTrack);
                } else {
                    setTrack(null);
                }
            } catch (error) {
                console.error('Error fetching track:', error);
                setTrack(null);
            }
        };

        fetchTrack();
        const interval = setInterval(fetchTrack, UPDATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    if (!track) {
        return <p className="text-sm text-muted">ничего не играет</p>;
    }

    const nowPlaying = track['@attr']?.nowplaying === 'true';
    const cover = track.image?.[2]?.['#text'];

    return (
        <div className="flex items-center gap-3">
            {cover ? (
                <img
                    src={cover}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded border border-border"
                />
            ) : (
                <div className="h-14 w-14 shrink-0 rounded border border-border bg-bg" />
            )}
            <div className="min-w-0">
                <p className="truncate text-sm font-medium">{track.name}</p>
                <p className="truncate text-sm text-muted">{track.artist['#text']}</p>
                {nowPlaying ? (
                    <p className="font-mono text-xs text-accent">▶ играет сейчас</p>
                ) : (
                    <p className="truncate text-xs text-muted">{track.album['#text']}</p>
                )}
            </div>
        </div>
    );
};

export default ListeningCard;