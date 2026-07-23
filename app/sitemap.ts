import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { LEGAL_WEBSITE_URL } from "@/lib/legal/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = LEGAL_WEBSITE_URL.replace(/\/$/, "");
  const posts = getAllBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
