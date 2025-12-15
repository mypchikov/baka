"use client";

import { useEffect, useState, useMemo } from 'react';

const NIGHTSCOUT_API_URL = 'https://nightscout.murchikov.com/api/v1/entries/current.json';
const UPDATE_INTERVAL_MS = 60 * 1000;
const GLUCOSE_CONVERSION_FACTOR = 18; // mg/dL to mmol/L
const TREND_THRESHOLD_MG_DL = 2;

interface NightscoutApiReading {
    dateString: string;
    sgv: number;
}

interface GlucoseReading {
    date: number;
    value: number;
}

const MOCK_GLUCOSE_DATA: GlucoseReading[] = [
    { date: Date.now() - 300000, value: 7.0 },
    { date: Date.now(), value: 6.8 },
];

const getTrendArrow = (readings: GlucoseReading[]): string => {
    if (readings.length < 2) return '→';
    const last = readings[readings.length - 1].value;
    const prev = readings[readings.length - 2].value;
    const diffInMgDl = (last - prev) * GLUCOSE_CONVERSION_FACTOR;
    if (diffInMgDl > TREND_THRESHOLD_MG_DL) return '↑';
    if (diffInMgDl < -TREND_THRESHOLD_MG_DL) return '↓';
    return '→';
};

function useGlucoseData() {
    const [data, setData] = useState<GlucoseReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGlucose = async () => {
            setError(null);
            try {
                const response = await fetch(NIGHTSCOUT_API_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const apiReadings: NightscoutApiReading[] = await response.json();

                if (apiReadings && apiReadings.length > 0) {
                    const formattedData = apiReadings.reverse().map((reading) => ({
                        date: new Date(reading.dateString).getTime(),
                        value: reading.sgv / GLUCOSE_CONVERSION_FACTOR,
                    }));
                    setData(formattedData);
                } else {
                    throw new Error("API returned no data");
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : "An unknown error occurred";
                console.error('Failed to fetch glucose data:', message);
                setError("error loading");
                setData(MOCK_GLUCOSE_DATA);
            } finally {
                setLoading(false);
            }
        };

        fetchGlucose();
        const interval = setInterval(fetchGlucose, UPDATE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
}

export default function GlucoseComponent() {
    const { data, loading, error } = useGlucoseData();
    const currentGlucose = useMemo(() => data[data.length - 1]?.value, [data]);
    const trend = useMemo(() => getTrendArrow(data), [data]);
    if (error && !currentGlucose) return <p>{error}</p>;
    if (!currentGlucose) return null;

    return (
        <div className="" title={error ?? undefined}>
            {error && <span className="text-yellow-500">!</span>}
            {currentGlucose.toFixed(1)} mmol
        </div>
    );
}