import type { Metadata } from "next";
import Link from "next/link";

import { loadContent } from "@/content/load";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const { site } = loadContent();
  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">404</p>
        <h1 className="mt-2 font-headings text-2xl font-semibold tracking-tight text-foreground">
          That page doesn’t exist.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Sorry — there’s nothing at this URL on {site.ownerName}’s resume site.
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-2 hover:underline"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </p>
      </main>
      <SiteFooter site={site} />
    </>
  );
}
