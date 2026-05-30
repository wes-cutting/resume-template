import Link from "next/link";

import type { SiteCareer } from "@/content/types";
import { getTrackStyle } from "./TrackBadge";

const ACTIVE_CLASSES = "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900";
const INACTIVE_CLASSES =
  "bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900";

export function CareerSwitcher({
  careers,
  activeCareerId,
}: {
  careers: readonly SiteCareer[];
  activeCareerId?: string;
}) {
  const allActive = activeCareerId === undefined;
  return (
    <nav aria-label="Career view" className="flex flex-wrap items-center gap-2">
      <Link
        href="/"
        aria-current={allActive ? "page" : undefined}
        className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 ${
          allActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
        }`}
      >
        All
      </Link>
      {careers.map((career) => {
        const isActive = career.id === activeCareerId;
        const style = getTrackStyle(career.order);
        return (
          <Link
            key={career.id}
            href={`/career/${career.id}`}
            aria-current={isActive ? "page" : undefined}
            data-track-id={career.id}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800 ${
              isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
            } ${isActive ? "" : `${style.chip} ${style.chipDark}`}`}
          >
            {career.label}
          </Link>
        );
      })}
    </nav>
  );
}
