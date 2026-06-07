import Link from "next/link";
import { getAllPosts, formatDate } from "../lib/blog";
import Window from "../components/window";

export const metadata = {
  title: "блог • @murchikov",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen justify-center bg-bg py-12 font-sans text-text">
      <main className="w-full max-w-xl px-4">
        <Window title="блог">
          <div className="space-y-6 p-5">
            <header>
              <Link href="/" className="text-sm text-accent transition-opacity duration-100 hover:opacity-70">
                ← домой
              </Link>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">блог</h1>
            </header>

            {posts.length === 0 ? (
              <p className="text-sm text-muted">пока пусто.</p>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="block hover:opacity-70">
                      <div className="text-base">{post.title}</div>
                      <div className="text-xs text-muted">
                        {formatDate(post.date)}
                        {post.description ? ` — ${post.description}` : ""}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Window>
      </main>
    </div>
  );
}
