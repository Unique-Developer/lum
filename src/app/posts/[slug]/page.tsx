import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getBlogPostBySlug, getHeadingsFromHtml } from "@/lib/blog";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogContent } from "@/components/blog/BlogContent";
import { absoluteUrl, getArticleJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/posts/${post.slug}`);
  const ogImage =
    post.thumbnail ??
    post.media?.find((m) => m.type === "image")?.url ??
    "/opengraph-image";
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const headings = getHeadingsFromHtml(post.content);
  const articleJsonLd = getArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt,
    author: post.author,
    url: absoluteUrl(`/posts/${post.slug}`),
  });

  const hasMedia = post.media && post.media.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress />
      <SiteHeader />

      <article className="px-3 py-8 sm:px-6 sm:py-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/posts"
            className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors sm:mb-8"
          >
            ← Back to Posts
          </Link>

          {hasMedia && (
            <div className="mb-8 overflow-hidden rounded-xl sm:mb-12 sm:rounded-2xl">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4">
                {post.media!.map((m, i) => (
                  <div
                    key={i}
                    className="relative h-[240px] min-w-[85vw] shrink-0 snap-center overflow-hidden rounded-lg bg-foreground/5 sm:h-[360px] sm:min-w-[420px]"
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <video
                        src={m.url}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
            <div className="min-w-0 flex-1">
              <time
                dateTime={post.publishedAt}
                className="block text-sm text-foreground/50"
              >
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-2 text-foreground/70">{post.author}</p>

              <div className="mt-8 max-w-3xl text-foreground sm:mt-12 [&_img]:max-w-full">
                <BlogContent html={post.content} headings={headings} />
              </div>
            </div>

            {headings.length > 0 && (
              <aside className="w-full shrink-0 lg:w-52">
                <TableOfContents headings={headings} />
              </aside>
            )}
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
