export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

export interface Post extends PostMeta {
  Content: new () => { render(): unknown };
}

interface RawModule {
  frontmatter: Record<string, unknown>;
  default: new () => { render(): unknown };
}

const modules = import.meta.glob<RawModule>("../../content/blog/*.{md,mdx}", {
  eager: true,
});

function sliceExtension(file: string): string {
  return file.replace(/\.(md|mdx)$/i, "");
}

function toPost(slug: string, mod: RawModule): Post | null {
  const fm = mod.frontmatter;
  if (fm.draft === true) return null;
  return {
    slug,
    title: typeof fm.title === "string" && fm.title ? fm.title : slug,
    date: fm.date instanceof Date ? fm.date.toISOString() : String(fm.date ?? ""),
    description: typeof fm.description === "string" ? fm.description : undefined,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : undefined,
    Content: mod.default,
  };
}

export function getAllPosts(): PostMeta[] {
  return Object.entries(modules)
    .map(([key, mod]) => toPost(sliceExtension(key.split("/").pop() ?? key), mod))
    .filter((p): p is Post => p !== null)
    .map(({ Content: _Content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  for (const [key, mod] of Object.entries(modules)) {
    if (sliceExtension(key.split("/").pop() ?? key) === slug) {
      return toPost(slug, mod);
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