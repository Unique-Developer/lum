import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getBlogPosts, filterPostsBySearch } from "@/lib/blog";
import { PostsSearchForm } from "@/components/posts/PostsSearchForm";

export const metadata = {
  title: "Posts | Lumin Art",
  description:
    "Insights, updates, and resources — articles, guides, photos, and more from Lumin Art.",
};

function getCardImage(post: { thumbnail?: string; media?: { type: string; url: string }[] }) {
  if (post.thumbnail) return post.thumbnail;
  const firstImage = post.media?.find((m) => m.type === "image");
  return firstImage?.url ?? null;
}

type Props = { searchParams: Promise<{ q?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allPosts = await getBlogPosts();
  const posts = filterPostsBySearch(allPosts, q ?? "");

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-3 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-12 md:mb-16">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Posts
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-sm text-foreground/70 sm:mt-3 sm:text-base md:text-lg">
              Articles, insights, photos, files, and updates — one place for everything we share.
            </p>
            <PostsSearchForm defaultValue={q ?? ""} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {posts.map((post) => {
              const cardImage = getCardImage(post);
              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-lg sm:rounded-2xl"
                >
                  {cardImage ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
                      <img
                        src={cardImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      {post.media?.some((m) => m.type === "video") && (
                        <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                          Video
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary-100 to-primary-200" />
                  )}
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs font-medium uppercase tracking-wider text-foreground/50"
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary-main sm:mt-3 sm:text-lg md:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 flex-1 text-sm text-foreground/70 line-clamp-2 sm:mt-2 sm:line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-main sm:mt-4">
                      View
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {posts.length === 0 && (
            <div className="py-20 text-center text-foreground/60">
              {q ? (
                <p>No posts match your search. Try different keywords.</p>
              ) : (
                <p>No posts yet. Check back soon.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
