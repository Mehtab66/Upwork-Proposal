import type { MetadataRoute } from "next";
import { LEGAL_WEBSITE_URL } from "@/lib/legal/site";

export default function robots(): MetadataRoute.Robots {
  const base = LEGAL_WEBSITE_URL.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/generate",
        "/history",
        "/settings",
        "/create-profile",
        "/analyze",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
