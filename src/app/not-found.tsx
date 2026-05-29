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
        <p className="text-xs uppercase tracking-wider text-neutral-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          That page doesn’t exist.
        </h1>
        <p className="mt-4 text-sm text-neutral-700">
          Sorry — there’s nothing at this URL on {site.ownerName}’s resume site.
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 underline-offset-2 hover:underline"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </p>
      </main>
      <SiteFooter site={site} />
    </>
  );
}
