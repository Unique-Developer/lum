import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBlogCategories, readBlogPosts, writeBlogCategories, writeBlogPosts } from "@/lib/storage";
import { clearBlogCategoryCache } from "@/lib/blog-categories";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categories = await readBlogCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeBlogCategories(filtered);

  // Keep posts valid by clearing category assignment if the category is removed.
  const posts = await readBlogPosts();
  const updatedPosts = posts.map((post) =>
    post.category === id ? { ...post, category: undefined } : post
  );
  await writeBlogPosts(updatedPosts);

  clearBlogCategoryCache();
  return NextResponse.json({ success: true });
}
