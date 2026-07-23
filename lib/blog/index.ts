import type { BlogPost } from "@/lib/blog/types";
import { aiToolsPosts } from "@/lib/blog/posts-ai-tools";
import { nichePosts } from "@/lib/blog/posts-niche";
import { strategyPosts } from "@/lib/blog/posts-strategy";
import { tier1Posts } from "@/lib/blog/posts-tier1";

const allPosts: BlogPost[] = [
  ...tier1Posts,
  ...nichePosts,
  ...strategyPosts,
  ...aiToolsPosts,
];

function sortByDateDesc(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllBlogPosts() {
  return sortByDateDesc(allPosts);
}

export function getBlogPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug) || null;
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getBlogPostBySlug(slug);
  if (!current) return getAllBlogPosts().slice(0, limit);

  const sameCategory = allPosts.filter(
    (post) => post.slug !== slug && post.category === current.category
  );

  const others = allPosts.filter(
    (post) => post.slug !== slug && post.category !== current.category
  );

  return sortByDateDesc([...sameCategory, ...others]).slice(0, limit);
}

export function getBlogSlugs() {
  return allPosts.map((post) => post.slug);
}
