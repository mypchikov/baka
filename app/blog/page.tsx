import Link from "next/link";
import { getAllPosts, formatDate } from "../lib/blog";

export const metadata = {
  title: "блог • @murchikov",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 py-12 dark:bg-black">
      <main className="w-full max-w-xl px-4">
        <header className="mb-8">
          <Link href="/" className="text-sm underline underline-offset-2 hover:opacity-70">
            ← домой
          </Link>
          <h1 className="mt-4 text-2xl tracking-tight">блог</h1>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">пока пусто. положи .mdx в content/blog/</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="block hover:opacity-70">
                  <div className="text-base">{post.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(post.date)}
                    {post.description ? ` — ${post.description}` : ""}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
