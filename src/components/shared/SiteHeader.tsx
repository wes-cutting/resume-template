import Link from "next/link";

import type { Site } from "@/content/types";
import { PrimaryNav, type PrimaryNavId } from "./PrimaryNav";

export function SiteHeader({ site, activeNav }: { site: Site; activeNav?: PrimaryNavId }) {
  return (
    <>
      <header
        data-print="hide"
        className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-3">
          <Link
            href="/"
            className="font-headings text-base font-semibold tracking-tight text-foreground hover:text-muted-foreground"
          >
            {site.ownerName}
          </Link>
          <PrimaryNav activeNav={activeNav} />
        </div>
      </header>
      <aside
        role="note"
        className="hidden border-b border-input px-6 py-2 text-xs text-muted-foreground print:block"
      >
        For a paginated resume, visit /print, /print/software, or /print/events.
      </aside>
    </>
  );
}
