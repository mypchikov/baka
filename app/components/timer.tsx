'use client';

import { useState, useEffect } from 'react';

const AgeTimer = () => {
    const [age, setAge] = useState(0);

    useEffect(() => {
        const birthDate = new Date('2009-11-10T00:00:00Z').getTime();

        const updateAge = () => {
            const now = Date.now();
            const diffMs = now - birthDate;
            const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
            setAge(diffYears);
        };

        updateAge();
        const interval = setInterval(updateAge, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-1xl font-mono">
            {age.toFixed(8)} yo.
        </div>
    );
};

export default AgeTimer;