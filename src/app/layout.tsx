import type { Metadata } from "next";
import type { ReactNode } from "react";

import { loadContent } from "@/content/load";
import "../styles/globals.css";
import "../styles/print.css";

export function generateMetadata(): Metadata {
  const { site } = loadContent();
  const siteName = `${site.ownerName} — Resume`;
  return {
    metadataBase: site.siteUrl ? new URL(site.siteUrl) : undefined,
    title: {
      default: siteName,
      template: `%s · ${site.ownerName}`,
    },
    description: site.tagline,
    applicationName: siteName,
    authors: [{ name: site.ownerName }],
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description: site.tagline,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: site.tagline,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
