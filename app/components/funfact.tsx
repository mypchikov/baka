'use client';

import { useRef, useState } from 'react';

const FUN_FACTS = [
    "для улучшения качества жизни этот сайт не использует Cookies",
    "этот сайт использует nextjs",
    "этот сайт теперь cодержит больше информации",
    "этот факт я наполняю абсолютно бесполезным текстом, чтобы вы могли  посмотреть, как выглядит длинный текст на странице",
    "⛄",
    "windows сломала мне вход по пинкоду после входа в микрослоп аккаунт...",
    "не все факты здесь — утверждения.",
    "«привет, мир!»",
    "я не умею разговаривать с людьми",
];

const pickFact = (current: string | null) => {
    if (FUN_FACTS.length <= 1) return FUN_FACTS[0];
    let next = current;
    while (next === current) {
        next = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    }
    return next!;
};

const FADE_MS = 700;

const FunFact = () => {
    const [fact, setFact] = useState<string>(() => pickFact(null));
    const [visible, setVisible] = useState(true);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reroll = () => {
        if (timer.current) clearTimeout(timer.current);
        setVisible(false);
        timer.current = setTimeout(() => {
            setFact((cur) => pickFact(cur));
            setVisible(true);
        }, FADE_MS);
    };

    return (
        <button
            type="button"
            onClick={reroll}
            className="text-left text-gray-400 italic transition-opacity hover:opacity-70"
            aria-label="показать следующий факт"
        >
            <span
                className={`transition-opacity duration-700 ease-in-out ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {fact}
            </span>{' '}
            <span className="not-italic" aria-hidden>↻</span>
        </button>
    );
};

export default FunFact;
