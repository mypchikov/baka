import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug, formatDate } from "../../lib/blog";
import Window from "../../components/window";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `https://murchikov.ru/blog/${post.slug}`;
  return {
    title: `${post.title} • @murchikov`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      siteName: "murchikov.ru",
    },
    other: post.date ? { "article:published_time": post.date } : undefined,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen justify-center bg-bg py-12 font-sans text-text">
      <main className="w-full max-w-xl px-4">
        <Window title={post.title}>
          <div className="p-5">
            <Link href="/blog" className="text-sm text-accent transition-opacity duration-100 hover:opacity-70">
              ← к списку
            </Link>
            <article className="mt-6">
              <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
                {post.date && (
                  <p className="mt-1 text-xs text-muted">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                )}
              </header>
              <div className="prose-blog space-y-4 text-sm leading-relaxed">
                <MDXRemote
                  source={post.content}
                  options={{
                    mdxOptions: {
                      rehypePlugins: [
                        [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
                      ],
                    },
                  }}
                />
              </div>
            </article>
          </div>
        </Window>
      </main>
    </div>
  );
}
