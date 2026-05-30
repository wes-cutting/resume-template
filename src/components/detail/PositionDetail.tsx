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
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {position.title}
            </h1>
            <p className="mt-1 text-neutral-700 dark:text-neutral-300">
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
        <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          <time dateTime={position.startDate}>
            {formatMonthRange(position.startDate, position.endDate)}
          </time>
          {position.location ? <span className="ml-3 normal-case">{position.location}</span> : null}
        </p>
        <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {position.summary}
        </p>
      </header>

      <Highlights items={position.highlights} />

      {position.projects.length > 0 ? (
        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Projects
          </h2>
          <ul className="mt-2 space-y-2">
            {position.projects.map((project) => (
              <li key={project.id} className="list-none">
                <Link
                  href={`/project/${project.id}`}
                  className="block rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {project.summary}
                  </p>
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
            className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Events
          </h2>
          <ul className="mt-2 space-y-2">
            {position.events.map((event) => (
              <li key={event.id} className="list-none">
                <Link
                  href={`/event/${event.id}`}
                  className="block rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {event.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {event.summary}
                  </p>
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
