/**
 * Client-safe blog types and utilities.
 * Do NOT import storage or mongodb here - this file is used in Client Components.
 */

export type PostMediaItem = {
  type: "image" | "video";
  url: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  thumbnail?: string;
  media?: PostMediaItem[];
  adminNotes?: string;
};

/** Filter posts by search query (pure function, no DB). Safe for client. */
export function filterPostsBySearch(
  posts: BlogPost[],
  q: string,
  options?: { includeAdminNotes?: boolean }
): BlogPost[] {
  const term = q?.trim().toLowerCase();
  if (!term) return posts;
  return posts.filter((p) => {
    const inTitle = p.title.toLowerCase().includes(term);
    const inExcerpt = p.excerpt.toLowerCase().includes(term);
    const inAdminNotes =
      options?.includeAdminNotes && p.adminNotes?.toLowerCase().includes(term);
    return inTitle || inExcerpt || inAdminNotes;
  });
}
