import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getBlogPostBySlug, getHeadingsFromHtml } from "@/lib/blog";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogContent } from "@/components/blog/BlogContent";
import { SocialPostContent } from "@/components/posts/SocialPostContent";
import { absoluteUrl, getArticleJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

function isSocialPost(post: BlogPost): boolean {
  return post.postType === "social";
}

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

  const social = isSocialPost(post);
  const headings = getHeadingsFromHtml(post.content);
  const articleJsonLd = getArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt,
    author: post.author,
    url: absoluteUrl(`/posts/${post.slug}`),
  });

  const hasMedia = post.media && post.media.length > 0;
  const publishedLabel = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const publishedShort = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {!social && <ReadingProgress />}
      <SiteHeader />

      {social ? (
        /* Social post: single-screen layout — image + text together; side-by-side on large, stacked on mobile */
        <article className="min-h-0 px-4 py-4 sm:px-6 sm:py-6 lg:flex lg:min-h-[calc(100vh-8rem)] lg:items-center lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Link
              href="/posts"
              className="mb-3 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors sm:mb-4"
            >
              ← Back to Posts
            </Link>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8 lg:min-h-0">
              {/* Media: capped height so text stays in view — mobile 40vh, desktop ~60vh in row */}
              {hasMedia && (
                <div className="shrink-0 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-black/[0.02] lg:max-h-[min(70vh,560px)] lg:w-[48%] lg:min-w-0">
                  <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto">
                    {post.media!.map((m, i) => (
                      <div
                        key={i}
                        className="relative flex min-w-full shrink-0 snap-center items-center justify-center overflow-hidden py-2"
                      >
                        {m.type === "image" ? (
                          <img
                            src={m.url}
                            alt={`${post.title} – media ${i + 1}`}
                            className="h-auto max-h-[40vh] w-auto max-w-full object-contain sm:max-h-[45vh] lg:max-h-[min(68vh,520px)]"
                          />
                        ) : (
                          <video
                            src={m.url}
                            controls
                            playsInline
                            title={`${post.title} – video ${i + 1}`}
                            className="h-auto max-h-[40vh] w-auto max-w-full object-contain bg-black sm:max-h-[45vh] lg:max-h-[min(68vh,520px)]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text: always visible on same screen */}
              <div className="min-w-0 flex-1 space-y-3 lg:max-h-[min(70vh,560px)] lg:overflow-y-auto lg:py-2">
                <header className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 to-primary-300 text-sm font-semibold text-primary-900 sm:h-11 sm:w-11">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <time dateTime={post.publishedAt} className="text-xs text-foreground/50 sm:text-sm">
                      {publishedShort}
                    </time>
                  </div>
                </header>
                <h1 className="text-lg font-semibold leading-snug text-foreground sm:text-xl lg:text-2xl">
                  {post.title}
                </h1>
                <div className="text-sm text-foreground/85">
                  <SocialPostContent html={post.content} />
                </div>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* Blog article layout */
        <article className="px-3 py-8 sm:px-6 sm:py-10 md:py-12">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/posts"
              className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors sm:mb-8"
            >
              ← Back to Posts
            </Link>

            {hasMedia && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-foreground/[0.08] sm:mb-12">
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4">
                  {post.media!.map((m, i) => (
                    <div
                      key={i}
                      className="relative h-[260px] min-w-[85vw] shrink-0 snap-center overflow-hidden rounded-xl bg-muted sm:h-[380px] sm:min-w-[480px]"
                    >
                      {m.type === "image" ? (
                        <img
                          src={m.url}
                          alt={`${post.title} – media ${i + 1}`}
                          className="h-full w-full object-contain object-center bg-black/[0.04]"
                        />
                      ) : (
                        <video
                          src={m.url}
                          controls
                          playsInline
                          title={`${post.title} – video ${i + 1}`}
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
                  className="block text-sm font-medium uppercase tracking-wider text-foreground/50"
                >
                  {publishedLabel}
                </time>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-tight">
                  {post.title}
                </h1>
                <p className="mt-3 text-foreground/70">{post.author}</p>

                <div className="mt-10 max-w-3xl text-foreground sm:mt-12 [&_img]:max-w-full">
                  <BlogContent html={post.content} headings={headings} />
                </div>
              </div>

              {headings.length > 0 && (
                <aside className="w-full shrink-0 lg:w-56">
                  <TableOfContents headings={headings} />
                </aside>
              )}
            </div>
          </div>
        </article>
      )}

      <SiteFooter />
    </main>
  );
}
