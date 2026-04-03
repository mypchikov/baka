import type { Metadata, Viewport } from 'next';
import { Onest } from 'next/font/google';
import './styles/globals.css';

const onest = Onest({
    subsets: ['latin'],
    weight: ['400', '500', '600']
});

export const metadata: Metadata = {
    title: 'Портфолио • @murchikov',
    icons: {
        icon: '/static/nachoneko_crab.png',
        shortcut: '/static/nachoneko_crab.png',
        apple: '/static/nachoneko_crab.png'
    },
    openGraph: {
        title: 'Портфолио • @murchikov',
        description: 'Человек, Диабетик, Фронтэнд на пол шышечки',
        url: 'https://murchikov.ru',
        siteName: 'murchikov.ru',
        images: 'https://murchikov.ru/static/nachoneko_crab.png'
    },
    twitter: {
        card: 'summary'
    },
    other: {
        'theme-color': '#0b5000'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 0.8
};

export default function RootLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru">
            <body className={onest.className}>{children}</body>
        </html>
    );
}