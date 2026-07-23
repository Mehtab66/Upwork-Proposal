export type BlogCategory =
  | "guides"
  | "templates"
  | "examples"
  | "strategy"
  | "ai-tools";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  faqs: { question: string; answer: string }[];
  /** Markdown-lite body: ## headings, paragraphs, - lists */
  content: string;
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  guides: "Guides",
  templates: "Templates",
  examples: "Examples",
  strategy: "Strategy",
  "ai-tools": "AI Tools",
};
