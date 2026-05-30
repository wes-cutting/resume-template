import Link from "next/link";

import type { Site } from "@/content/types";
import {
  BUILD_TIMESTAMP_ISO,
  SITE_START_YEAR,
  buildDateLabel,
  copyrightYears,
  yearOf,
} from "@/lib/footer";

export function SiteFooter({ site }: { site: Site }) {
  const buildYear = yearOf(BUILD_TIMESTAMP_ISO);
  const updated = buildDateLabel(BUILD_TIMESTAMP_ISO);
  const years = copyrightYears(SITE_START_YEAR, buildYear);

  return (
    <footer
      data-print="hide"
      className="mt-16 border-t border-neutral-200 px-6 py-6 text-xs text-neutral-600"
    >
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p>
          © {years} {site.ownerName}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            Updated <time dateTime={updated}>{updated}</time>
          </span>
          <Link href="/now" className="underline-offset-2 hover:underline">
            Now
          </Link>
          {site.repoUrl ? (
            <Link
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              View source
            </Link>
          ) : null}
        </p>
      </div>
    </footer>
  );
}
