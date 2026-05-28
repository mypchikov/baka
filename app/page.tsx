/* eslint-disable @next/next/no-img-element */
import Webring from "./components/webring";
import Lastfm from "./components/lastfm";
import AgeTimer from "./components/agetimer";
import FunFact from "./components/funfact";
import Contacts from "./components/contacts";
import Dvd from "./components/dvd";
import Banners from "./components/banners";
import { getBanners } from "./lib/banners";
import type { ReactNode } from "react";

interface PageProps {
  searchParams: Promise<{ dvd?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const banners = getBanners();
  const dvdMode = "dvd" in (await searchParams);

  const dvdItems: ReactNode[] = dvdMode
    ? [
        ...banners.map((b) => {
          const img = (
            <img
              src={b.src}
              alt=""
              width={88}
              height={31}
              className="pointer-events-none block"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
          );
          return b.href ? (
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto block h-full w-full"
            >
              {img}
            </a>
          ) : (
            img
          );
        }),
        <a
          key="exit"
          href="/"
          className="ascii-link pointer-events-auto flex h-full w-full items-center justify-center border border-current text-xs"
          aria-label="выключить DVD-режим"
        >
          [exit dvd]
        </a>,
      ]
    : [];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      {dvdMode && <Dvd items={dvdItems} />}
      <main className="relative z-10 flex w-full max-w-xs flex-col items-stretch space-y-4">
        <section>
          <h1 className="text-xl tracking-tight text-text">мурчиков</h1>
          <AgeTimer />
          <p className="mt-1 text-sm text-muted">Россия, Комсомольск-на-Амуре</p>
          <p className="mt-1 text-sm">
            я мурчиков, я люблю что-то делать :P
            <br />
            я не знаю, что я хочу ещё тут написать
          </p>
          <p className="mt-1 text-sm">
            рандомный факт: <FunFact />
          </p>
        </section>

        <Contacts />
        <Lastfm />
        {!dvdMode && <Banners banners={banners} />}
        <Webring />
      </main>
    </div>
  );
}
