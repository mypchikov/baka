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

                if (recentTrack && recentTrack['@attr']?.nowplaying) {
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
        return null;
    }

    return (
        <div className="text-white p-2 rounded-lg">
            <div className="flex items-center mb-4">
                <img
                    src={track.image[2]['#text']}
                    alt="Album art"
                    className="w-16 h-16 rounded mr-4"
                />
                <div>
                    <h3 className="font-bold">{track.name}</h3>
                    <p className="text-sm text-gray-400">{track.artist['#text']}</p>
                    <p className="text-xs text-gray-500">{track.album['#text']}</p>
                </div>
            </div>
        </div>
    );
};

export default ListeningCard;