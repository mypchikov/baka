'use client';

import { useState } from 'react';

const FUN_FACTS = [
    "для улучшения качества жизни этот сайт не использует Cookies",
    "этот сайт использует nextjs",
    "этот сайт теперь cодержит больше информации",
    "этот факт я наполняю абсолютно бесполезным текстом, чтобы вы могли  посмотреть, как выглядит длинный текст на странице",
    "некоторые факты врут!",
    "⛄",
    "домен murchikov.ru был зарегестрирован в 2025 году",
    "windows сломала мне вход по пинкоду после входа в микрослоп аккаунт...",
    "не все факты здесь — утверждения.",
    "«привет, мир!»",
    "я не умею разговаривать с людьми",
];

const FunFact = () => {
    const [fact, setFact] = useState<string>(() => {
        return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    });
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) return null;

    return (
        <span className="text-gray-400 italic">
            {fact}
        </span>
    );
};

export default FunFact;
