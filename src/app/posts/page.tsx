import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getBlogPosts, filterPostsBySearch } from "@/lib/blog";
import { getBlogCategories } from "@/lib/blog-categories";
import { PostsSearchForm } from "@/components/posts/PostsSearchForm";
import { BlogPostCard } from "@/components/posts/BlogPostCard";
import { SocialPostCard } from "@/components/posts/SocialPostCard";
import type { BlogPost } from "@/lib/blog";

export const metadata = {
  title: "Posts | Lumin Art",
  description:
    "Insights, updates, and resources — articles, guides, photos, and more from Lumin Art.",
};

export const dynamic = "force-dynamic";

function getPostType(post: BlogPost): "blog" | "social" {
  return post.postType === "social" ? "social" : "blog";
}

type Props = { searchParams: Promise<{ q?: string; cat?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  const { q, cat } = await searchParams;
  const allPosts = await getBlogPosts();
  const categories = await getBlogCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const postsByCategory = cat ? allPosts.filter((post) => post.category === cat) : allPosts;
  const posts = filterPostsBySearch(postsByCategory, q ?? "");

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-3 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-14 md:mb-16">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Posts
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-sm text-foreground/70 sm:text-base md:text-lg">
              Articles, insights, photos, and updates — one place for everything we share.
            </p>
            <PostsSearchForm
              defaultValue={q ?? ""}
              defaultCategory={cat ?? ""}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) =>
              getPostType(post) === "social" ? (
                <SocialPostCard key={post.id} post={post} />
              ) : (
                <BlogPostCard key={post.id} post={post} />
              )
            )}
          </div>

          {posts.length === 0 && (
            <div className="py-20 text-center text-foreground/60">
              {q ? (
                <p>No posts match your search. Try different keywords.</p>
              ) : cat ? (
                <p>No posts found in category &quot;{categoryMap.get(cat) ?? cat}&quot;.</p>
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
