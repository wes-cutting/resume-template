import type { Education } from "@/content/types";
import { sortEducationForList } from "@/lib/education-sort";
import { formatMonth } from "@/lib/format-date";

function dateRange(entry: Education): string | undefined {
  const { startDate, endDate } = entry;
  if (!startDate && !endDate) return undefined;
  if (startDate && endDate) return `${formatMonth(startDate)} – ${formatMonth(endDate)}`;
  if (startDate) return `${formatMonth(startDate)} – Present`;
  if (endDate) return formatMonth(endDate);
  return undefined;
}

export function PrintEducationSection({ education }: { education: readonly Education[] }) {
  if (education.length === 0) return null;
  const sorted = sortEducationForList(education);
  return (
    <section aria-labelledby="print-education-heading" className="break-inside-avoid">
      <h2
        id="print-education-heading"
        className="font-headings break-after-avoid text-sm font-semibold uppercase tracking-wider text-print-foreground"
      >
        Education
      </h2>
      <ul className="mt-2 space-y-1">
        {sorted.map((entry) => {
          const range = dateRange(entry);
          return (
            <li
              key={entry.id}
              className="break-inside-avoid list-none text-xs text-print-foreground"
            >
              <span className="font-semibold">{entry.credential}</span>
              <span> — {entry.institution}</span>
              {entry.field ? (
                <span className="text-print-muted-foreground"> · {entry.field}</span>
              ) : null}
              {range ? <span className="text-print-muted-foreground"> · {range}</span> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
