import type { Education } from "@/content/types";
import { formatMonth } from "@/lib/format-date";
import { Highlights } from "@/components/shared/Highlights";

function formatEducationDates(entry: Education): string | undefined {
  const { startDate, endDate } = entry;
  if (!startDate && !endDate) return undefined;
  if (startDate && endDate) return `${formatMonth(startDate)} – ${formatMonth(endDate)}`;
  if (startDate) return `${formatMonth(startDate)} – Present`;
  if (endDate) return formatMonth(endDate);
  return undefined;
}

export function EducationEntry({ entry }: { entry: Education }) {
  const dateRange = formatEducationDates(entry);
  const earliestIso = entry.startDate ?? entry.endDate;
  return (
    <article className="space-y-2">
      <header>
        <h2 className="font-headings text-lg font-semibold tracking-tight text-foreground">
          {entry.credential}
        </h2>
        <p className="text-sm text-muted-foreground">
          {entry.institution}
          {entry.field ? <span className="text-muted-foreground"> · {entry.field}</span> : null}
        </p>
        {dateRange ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {earliestIso ? <time dateTime={earliestIso}>{dateRange}</time> : dateRange}
          </p>
        ) : null}
      </header>
      <Highlights items={entry.highlights} />
    </article>
  );
}
