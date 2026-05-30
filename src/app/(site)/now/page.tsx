import type { Metadata } from "next";

import { loadContent } from "@/content/load";
import { NowPanel } from "@/components/now/NowPanel";
import { SiteHeader } from "@/components/shared/SiteHeader";

export function generateMetadata(): Metadata {
  const { site } = loadContent();
  return {
    title: "Now",
    description: `What ${site.ownerName} is currently working on, learning, and prioritizing.`,
    alternates: { canonical: "/now" },
    openGraph: { type: "website", url: "/now", title: "Now" },
  };
}

export default function NowRoute() {
  const { site, now } = loadContent();
  return (
    <>
      <SiteHeader site={site} activeNav="now" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <NowPanel now={now} />
      </main>
    </>
  );
}
