import type { EventJoined } from "@/content/types";
import { BackLink } from "@/components/shared/BackLink";
import { Highlights } from "@/components/shared/Highlights";
import { SkillTags } from "@/components/shared/SkillTags";

function formatEventDate(date: string): string {
  const [yearStr, monthStr, dayStr] = date.split("-");
  if (!yearStr || !monthStr || !dayStr) return date;
  const d = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr)));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function EventDetail({ event }: { event: EventJoined }) {
  const facts: { label: string; value: string }[] = [];
  facts.push({ label: "Date", value: formatEventDate(event.date) });
  facts.push({ label: "Role", value: event.role });
  if (event.client) facts.push({ label: "Client", value: event.client });
  if (event.venue) facts.push({ label: "Venue", value: event.venue });
  if (event.attendance !== undefined) {
    facts.push({ label: "Attendance", value: event.attendance.toLocaleString("en-US") });
  }

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <BackLink
          href={`/position/${event.position.id}`}
          label={`Back to ${event.position.title}`}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {event.name}
        </h1>
        <p className="pt-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {event.summary}
        </p>
      </header>

      <section aria-labelledby="event-facts-heading">
        <h3
          id="event-facts-heading"
          className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Details
        </h3>
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {fact.label}
              </dt>
              <dd className="text-sm text-neutral-800 dark:text-neutral-200">
                {fact.label === "Date" ? (
                  <time dateTime={event.date}>{fact.value}</time>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Highlights items={event.highlights} />

      <SkillTags skills={event.skills} />
    </article>
  );
}
