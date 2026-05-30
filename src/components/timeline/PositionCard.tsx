import Link from "next/link";

import type { PositionJoined, SiteCareer } from "@/content/types";
import { formatMonthRange } from "@/lib/format-date";
import { TrackBadge, getTrackStyle } from "@/components/shared/TrackBadge";

export function PositionCard({
  position,
  career,
}: {
  position: PositionJoined;
  career: SiteCareer;
}) {
  const style = getTrackStyle(career.order);
  return (
    <li className="list-none">
      <Link
        href={`/position/${position.id}`}
        className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <article
          className={`group rounded-md border-l-4 bg-card py-4 pl-5 pr-4 transition-colors hover:bg-muted ${style.border}`}
          data-track-id={career.id}
        >
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <h2 className="font-headings text-lg font-semibold tracking-tight text-foreground">
                {position.title}
              </h2>
              <p className="text-sm text-muted-foreground">{position.employer.name}</p>
            </div>
            <TrackBadge career={career} />
          </header>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            <time dateTime={position.startDate}>
              {formatMonthRange(position.startDate, position.endDate)}
            </time>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{position.summary}</p>
        </article>
      </Link>
    </li>
  );
}
