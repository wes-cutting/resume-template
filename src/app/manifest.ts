import type { MetadataRoute } from "next";

import { loadContent } from "@/content/load";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const { site } = loadContent();
  return {
    name: `${site.ownerName} — Resume`,
    short_name: site.ownerName,
    description: site.tagline,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
