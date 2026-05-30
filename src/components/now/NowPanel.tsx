import type { Now } from "@/content/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatLastUpdated(date: string): string {
  const [yearStr, monthStr, dayStr] = date.split("-");
  if (!yearStr || !monthStr || !dayStr) return date;
  const monthIndex = Number(monthStr) - 1;
  const month = MONTHS[monthIndex];
  if (!month) return date;
  return `${month} ${Number(dayStr)}, ${yearStr}`;
}

export function NowPanel({ now }: { now: Now }) {
  const updatedLabel = formatLastUpdated(now.lastUpdated);
  // FEAT-009 §5 — defensive fallback. Schema enforces a non-empty body,
  // but we still want a graceful render if that ever changes.
  const body = now.body.trim().length > 0 ? now.body : "No update yet.";
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          What I&rsquo;m up to
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Now
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Updated <time dateTime={now.lastUpdated}>{updatedLabel}</time>
        </p>
      </header>

      <section className="space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </section>

      {now.bullets && now.bullets.length > 0 ? (
        <section aria-labelledby="now-currently-heading" className="space-y-2">
          <h2
            id="now-currently-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Currently
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {now.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="border-t border-neutral-200 pt-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          This page follows the{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            /now page
          </a>{" "}
          convention &mdash; a snapshot of current focus, not a feed.
        </p>
      </footer>
    </article>
  );
}
