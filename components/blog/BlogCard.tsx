import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import { Badge } from "@/components/ui/badge";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{CATEGORY_LABELS[post.category]}</Badge>
        <span className="text-xs text-muted">{post.readingTime} read</span>
      </div>
      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
        {post.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
        {post.description}
      </p>
      <p className="mt-4 text-xs text-muted">
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </Link>
  );
}
