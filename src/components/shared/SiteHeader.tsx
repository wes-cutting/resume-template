import Link from "next/link";

import type { Site } from "@/content/types";
import { PrimaryNav, type PrimaryNavId } from "./PrimaryNav";

export function SiteHeader({ site, activeNav }: { site: Site; activeNav?: PrimaryNavId }) {
  return (
    <>
      <header
        data-print="hide"
        className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-3">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-neutral-900 hover:text-neutral-700"
          >
            {site.ownerName}
          </Link>
          <PrimaryNav activeNav={activeNav} />
        </div>
      </header>
      <aside
        role="note"
        className="hidden border-b border-neutral-300 px-6 py-2 text-xs text-neutral-700 print:block"
      >
        For a paginated resume, visit /print, /print/software, or /print/events.
      </aside>
    </>
  );
}
