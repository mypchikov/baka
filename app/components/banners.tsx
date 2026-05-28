/* eslint-disable @next/next/no-img-element */

import type { Banner } from "../lib/banners"

const WRAP =
  "group relative inline-block h-[31px] w-[88px] hover:z-10"
const INNER =
  "pointer-events-none absolute inset-0 transition-transform duration-100 group-hover:scale-200"

export default function Banners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null
  return (
    <section>
      <h2 className="text-sm text-muted">баннеры</h2>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {banners.map((b) => {
          const inner = (
            <span className={INNER}>
              <img
                src={b.src}
                alt=""
                width={88}
                height={31}
                style={{ imageRendering: "pixelated" }}
                draggable={false}
              />
            </span>
          )
          return b.href ? (
            <a
              key={b.src}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className={WRAP}
            >
              {inner}
            </a>
          ) : (
            <span key={b.src} className={WRAP}>
              {inner}
            </span>
          )
        })}
        <a
          href="/?dvd"
          className={`ascii-link ${WRAP}`}
          aria-label="включить DVD-режим"
        >
          <span
            className={`${INNER} flex items-center justify-center border border-current text-xs`}
          >
            [dvd mode]
          </span>
        </a>
      </div>
    </section>
  )
}
