import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";

import { loadContent } from "@/content/load";
import "../styles/globals.css";
import "../styles/print.css";

/**
 * FEAT-012 — Fraunces variable serif powers the headings face.
 * Subset to Latin; load the optical-size and weight axes the site uses.
 * `display: swap` keeps text visible during the font request; `next/font`
 * self-hosts the file at build time so there's no runtime CDN fetch and no
 * CLS. Adopters can swap this for any `next/font/google` family by changing
 * the import and the `--font-serif-display` variable name stays stable.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-display",
  // Use the full variable axis (weight + opsz) rather than fixed instances.
  // next/font rejects `weight: [...]` when `axes` is set on a variable face;
  // omitting `weight` enables the variable weight range so the headings face
  // can scale across 400–700 from CSS.
  axes: ["opsz"],
});

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
    <html lang="en" className={fraunces.variable}>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
