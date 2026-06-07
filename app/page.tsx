/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Webring from "./components/webring";
import Lastfm from "./components/lastfm";
import AgeTimer from "./components/agetimer";
import FunFact from "./components/funfact";
import Contacts from "./components/contacts";
import Dvd from "./components/dvd";
import Banners from "./components/banners";
import Window from "./components/window";
import { getBanners } from "./lib/banners";
import { getAllPosts, formatDate } from "./lib/blog";
import type { ReactNode } from "react";

interface PageProps {
  searchParams: Promise<{ dvd?: string }>;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="section-label">{label}</h2>
      {children}
    </section>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const banners = getBanners();
  const recentPosts = (await getAllPosts()).slice(0, 3);
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
          className="pointer-events-auto flex h-full w-full items-center justify-center border border-current text-xs text-accent transition-opacity duration-100 hover:opacity-70"
          aria-label="выключить DVD-режим"
        >
          [exit dvd]
        </a>,
      ]
    : [];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10 font-sans text-text">
      {dvdMode && <Dvd items={dvdItems} />}

      <main className="relative z-10 w-full max-w-md">
        <Window title="root@musya: ~">
          <div className="space-y-6 p-5">
            <section className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">мурчиков</h1>
              <div className="font-mono text-xs text-accent">
                <AgeTimer />
              </div>
              <p className="text-sm text-muted">Россия, Комсомольск-на-Амуре</p>
              <p className="pt-2 text-sm leading-relaxed">
                я мурчиков, я люблю что-то делать :P
                <br />
                я не знаю, что я хочу ещё тут написать
              </p>
              <p className="pt-1 text-sm">
                рандомный факт: <FunFact />
              </p>
            </section>

            {recentPosts.length > 0 && (
              <Section label="последние статьи">
                <ul className="space-y-3">
                  {recentPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block hover:opacity-70"
                      >
                        <div className="text-sm">{post.title}</div>
                        <div className="text-xs text-muted">
                          {formatDate(post.date)}
                          {post.description ? ` — ${post.description}` : ""}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/blog"
                      className="text-xs text-accent transition-opacity duration-100 hover:opacity-70"
                    >
                      все статьи →
                    </Link>
                  </li>
                </ul>
              </Section>
            )}

            <Section label="контакты">
              <Contacts />
            </Section>

            <Section label="сейчас играет">
              <Lastfm />
            </Section>

            {!dvdMode && (
              <Section label="баннеры">
                <Banners banners={banners} />
              </Section>
            )}
          </div>

          <div className="border-t border-border px-5 py-3">
            <Webring />
          </div>
        </Window>
      </main>
    </div>
  );
}
