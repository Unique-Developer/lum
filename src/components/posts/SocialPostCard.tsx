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

export function SocialPostCard({ post }: { post: Post }) {
  const cardImage = getCardImage(post);
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card shadow-sm transition-all duration-300 hover:border-foreground/12 hover:shadow-xl"
    >
      {/* Header: avatar + author + date — Instagram-style */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 to-primary-300 text-sm font-semibold text-primary-900">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-foreground">{post.author}</span>
          <span className="block text-xs text-foreground/50">{date}</span>
        </div>
      </div>
      {/* Square media */}
      {cardImage ? (
        <div className="relative aspect-square w-full overflow-hidden bg-black/5">
          <img
            src={cardImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          {post.media?.some((m) => m.type === "video") && (
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </div>
      ) : (
        <div className="aspect-square w-full bg-gradient-to-br from-primary-100/60 to-primary-200/40" />
      )}
      {/* Caption preview */}
      <div className="border-t border-foreground/[0.06] px-4 py-3">
        <p className="line-clamp-2 text-sm text-foreground/80">
          {post.excerpt || post.title}
        </p>
      </div>
    </Link>
  );
}
