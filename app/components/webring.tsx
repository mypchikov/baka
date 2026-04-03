"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Site {
  id: number
  name: string
  url: string
  favicon: string | null
}

interface SiteData {
  prev: Site
  curr: Site
  next: Site
}


export default function Webring() {
  const [data, setData] = useState<SiteData | null>(null)

  useEffect(() => {
    fetch("https://webring.otomir23.me/murchikov/data")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  const renderLink = (site: Site, faviconAfter: boolean = true) => (
    <a
      key={site.id}
      href={site.url}
      className="ascii-link flex items-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      {!faviconAfter && site.favicon && (
        <Image
          src={`https://webring.otomir23.me/media/${site.favicon}`}
          alt=""
          width={16}
          height={16}
          className="mr-1 shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      )}
      <span>{site.name}</span>
      {faviconAfter && site.favicon && (
        <Image
          src={`https://webring.otomir23.me/media/${site.favicon}`}
          alt=""
          width={16}
          height={16}
          className="ml-1 shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      )}
    </a>
  )

  if (!data) {
    return (
      <div className="mt-2 flex justify-center gap-2">
        <a href="https://webring.otomir23.me/murchikov/prev" className="ascii-link">
          prev
        </a>
        <span>otoring</span>
        <a href="https://webring.otomir23.me/murchikov/next" className="ascii-link">
          next
        </a>
      </div>
    )
  }

  return (
    <div className="mt-2 flex justify-center items-center gap-2">
      <span>←</span>
      {renderLink(data.prev, true)}
      <a href="https://webring.otomir23.me">[otoring]</a>
      {renderLink(data.next, false)}
      <span>→</span>
    </div>
  )
}