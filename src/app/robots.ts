import type { MetadataRoute } from "next";

import { loadContent } from "@/content/load";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { site } = loadContent();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/print", "/print/"] }],
    sitemap: site.siteUrl ? `${site.siteUrl}/sitemap.xml` : "/sitemap.xml",
    host: site.siteUrl,
  };
}
