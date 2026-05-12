import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

async function readPostFile(file: string): Promise<Post | null> {
  const ext = path.extname(file);
  if (ext !== ".md" && ext !== ".mdx") return null;

  const slug = file.slice(0, -ext.length);
  const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  if (data.draft === true) return null;

  return {
    slug,
    title: String(data.title ?? slug),
    date: data.date instanceof Date ? data.date.toISOString() : String(data.date ?? ""),
    description: data.description ? String(data.description) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let files: string[];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const posts = (await Promise.all(files.map(readPostFile))).filter(
    (p): p is Post => p !== null,
  );

  return posts
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  for (const ext of [".mdx", ".md"]) {
    try {
      const raw = await fs.readFile(path.join(BLOG_DIR, slug + ext), "utf8");
      const { data, content } = matter(raw);
      if (data.draft === true) return null;
      return {
        slug,
        title: String(data.title ?? slug),
        date: data.date instanceof Date ? data.date.toISOString() : String(data.date ?? ""),
        description: data.description ? String(data.description) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        content,
      };
    } catch {
      // try next extension
    }
  }
  return null;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
