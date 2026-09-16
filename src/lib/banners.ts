import fs from "node:fs";
import path from "node:path";

export interface Banner {
  src: string;
  href?: string;
}

const DIR = path.join(process.cwd(), "public", "88x31");

export function getBanners(): Banner[] {
  let links: Record<string, string> = {};
  try {
    const raw = fs.readFileSync(path.join(DIR, "links.json"), "utf-8");
    links = JSON.parse(raw);
  } catch {
    links = {};
  }

  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => /\.(gif|png|jpe?g|webp|avif)$/i.test(f))
      .map((f) => ({ src: `/88x31/${f}`, href: links[f] }));
  } catch {
    return [];
  }
}