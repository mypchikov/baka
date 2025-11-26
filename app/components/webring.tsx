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
            .then((res) => res.json())
            .then((d) => setData(d))
            .catch(() => {
                setData(null)
            })
    }, [])

    if (!data) {
        return (
            <div className="mt-2 flex justify-center gap-2">
                <a
                    href="https://webring.otomir23.me/murchikov/prev"
                    className="ascii-link"
                >
                    prev
                </a>
                <span>otoring</span>
                <a
                    href="https://webring.otomir23.me/murchikov/next"
                    className="ascii-link"
                >
                    next
                </a>
            </div>
        )
    }

    return (
        <div className="mt-2 flex justify-center gap-4">
            <a href={data.prev.url} className="ascii-link flex items-center">
                <span>← {data.prev.name}</span>
            </a>
            <span>otoring</span>
            <a href={data.next.url} className="ascii-link flex items-center">
                <span>{data.next.name} →</span>
            </a>
        </div>
    )
}