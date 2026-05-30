import Link from "next/link";

import type { PositionJoined, SiteCareer } from "@/content/types";
import { formatMonthRange } from "@/lib/format-date";
import { Highlights } from "@/components/shared/Highlights";
import { SkillTags } from "@/components/shared/SkillTags";
import { TrackBadge } from "@/components/shared/TrackBadge";

export function PositionDetail({
  position,
  career,
}: {
  position: PositionJoined;
  career: SiteCareer;
}) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <h1 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
              {position.title}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {position.employer.website ? (
                <a
                  href={position.employer.website}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline-offset-2 hover:underline"
                >
                  {position.employer.name}
                </a>
              ) : (
                position.employer.name
              )}
            </p>
          </div>
          <TrackBadge career={career} />
        </div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          <time dateTime={position.startDate}>
            {formatMonthRange(position.startDate, position.endDate)}
          </time>
          {position.location ? <span className="ml-3 normal-case">{position.location}</span> : null}
        </p>
        <p className="text-sm leading-relaxed text-foreground">{position.summary}</p>
      </header>

      <Highlights items={position.highlights} />

      {position.projects.length > 0 ? (
        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
          >
            Projects
          </h2>
          <ul className="mt-2 space-y-2">
            {position.projects.map((project) => (
              <li key={project.id} className="list-none">
                <Link
                  href={`/project/${project.id}`}
                  className="block rounded-md border border-border px-4 py-3 hover:bg-card"
                >
                  <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {position.events.length > 0 ? (
        <section aria-labelledby="events-heading">
          <h2
            id="events-heading"
            className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
          >
            Events
          </h2>
          <ul className="mt-2 space-y-2">
            {position.events.map((event) => (
              <li key={event.id} className="list-none">
                <Link
                  href={`/event/${event.id}`}
                  className="block rounded-md border border-border px-4 py-3 hover:bg-card"
                >
                  <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SkillTags skills={position.skills} />
    </article>
  );
}
