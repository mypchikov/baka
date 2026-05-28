import fs from "fs"
import path from "path"

export interface Banner {
  src: string
  href?: string
}

export function getBanners(): Banner[] {
  const dir = path.join(process.cwd(), "public", "88x31")
  let links: Record<string, string> = {}
  try {
    const raw = fs.readFileSync(path.join(dir, "links.json"), "utf-8")
    links = JSON.parse(raw)
  } catch {
    links = {}
  }

  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(gif|png|jpe?g|webp|avif)$/i.test(f))
      .map((f) => ({ src: `/88x31/${f}`, href: links[f] }))
  } catch {
    return []
  }
}