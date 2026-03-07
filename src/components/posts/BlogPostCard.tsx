import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  thumbnail?: string;
  media?: { type: string; url: string }[];
};

function getCardImage(post: Post): string | null {
  if (post.thumbnail) return post.thumbnail;
  const first = post.media?.find((m) => m.type === "image");
  return first?.url ?? null;
}

export function BlogPostCard({ post }: { post: Post }) {
  const cardImage = getCardImage(post);
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card shadow-sm transition-all duration-300 hover:border-foreground/15 hover:shadow-lg"
    >
      {cardImage ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={cardImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {post.media?.some((m) => m.type === "video") && (
            <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Video
            </span>
          )}
        </div>
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary-100/80 to-primary-200/60" />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/50">
          <time dateTime={post.publishedAt}>{date}</time>
          <span className="text-foreground/30">·</span>
          <span>{post.author}</span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary-main sm:text-xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/70 sm:line-clamp-3">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-main">
          Read article
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
