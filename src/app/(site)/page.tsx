import type { Metadata } from "next";

import { loadContent } from "@/content/load";
import { getCareers } from "@/lib/careers";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { CareerSwitcher } from "@/components/shared/CareerSwitcher";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Timeline } from "@/components/timeline/Timeline";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "profile", url: "/" },
};

function buildPersonJsonLd(site: ReturnType<typeof loadContent>["site"]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.ownerName,
    description: site.tagline,
    email: `mailto:${site.contactEmail}`,
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
    ...(site.location
      ? { address: { "@type": "PostalAddress", addressLocality: site.location } }
      : {}),
    ...(site.socialLinks && site.socialLinks.length > 0
      ? { sameAs: site.socialLinks.map((link) => link.url) }
      : {}),
    knowsAbout: site.careers.map((c) => c.label),
  };
}

export default function HomePage() {
  const { site, positions } = loadContent();
  const careers = getCareers(site);
  const sortedPositions = sortPositionsForTimeline(positions);
  const personJsonLd = buildPersonJsonLd(site);

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{site.ownerName}</h1>
          <p className="mt-1 text-neutral-700 dark:text-neutral-300">{site.tagline}</p>
          {site.location ? (
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{site.location}</p>
          ) : null}
        </section>
        <div className="mb-4">
          <CareerSwitcher careers={careers} />
        </div>
        <Timeline positions={sortedPositions} careers={careers} />
      </main>
      <script
        type="application/ld+json"
        // Inline JSON-LD is safe — values come from validated content, no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
