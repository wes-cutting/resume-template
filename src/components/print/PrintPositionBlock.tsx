import type { PositionJoined } from "@/content/types";
import { formatMonthRange } from "@/lib/format-date";

export function PrintPositionBlock({ position }: { position: PositionJoined }) {
  return (
    <article className="break-inside-avoid space-y-1">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="text-sm font-semibold text-print-foreground">
          {position.title} — <span className="font-normal">{position.employer.name}</span>
        </h3>
        <p className="text-xs uppercase tracking-wide text-print-muted-foreground">
          <time dateTime={position.startDate}>
            {formatMonthRange(position.startDate, position.endDate)}
          </time>
          {position.location ? <span className="ml-2 normal-case">{position.location}</span> : null}
        </p>
      </header>
      <p className="text-xs leading-snug text-print-foreground">{position.summary}</p>
      {position.highlights && position.highlights.length > 0 ? (
        <ul className="ml-4 list-disc text-xs leading-snug text-print-foreground">
          {position.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null}
      {position.projects.length > 0 ? (
        <div className="mt-1 text-xs text-print-foreground">
          <span className="font-medium">Projects:</span>{" "}
          {position.projects.map((p, i) => (
            <span key={p.id}>
              {i > 0 ? "; " : ""}
              <span className="italic">{p.name}</span>
              {p.summary ? ` — ${p.summary}` : ""}
            </span>
          ))}
        </div>
      ) : null}
      {position.events.length > 0 ? (
        <div className="mt-1 text-xs text-print-foreground">
          <span className="font-medium">Events:</span>{" "}
          {position.events.map((e, i) => (
            <span key={e.id}>
              {i > 0 ? "; " : ""}
              <span className="italic">{e.name}</span>
              {e.summary ? ` — ${e.summary}` : ""}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
