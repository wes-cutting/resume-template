import type { MetadataRoute } from "next";

import { loadContent } from "@/content/load";
import { BUILD_TIMESTAMP_ISO } from "@/lib/footer";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site, positions, projects, events, skills } = loadContent();
  const base = site.siteUrl ?? "";
  const lastModified = new Date(BUILD_TIMESTAMP_ISO);
  const url = (path: string) => `${base}${path}`;

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: url("/skills"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/education"), lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/print"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...site.careers.map((c) => ({
      url: url(`/career/${c.id}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...site.careers.map((c) => ({
      url: url(`/print/${c.id}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...positions.map((p) => ({
      url: url(`/position/${p.id}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: url(`/project/${p.id}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...events.map((e) => ({
      url: url(`/event/${e.id}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...skills.map((s) => ({
      url: url(`/skills/${s.id}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
