import Link from "next/link";

import type { Skill, SiteCareer, SkillUsage } from "@/content/types";
import { formatMonthRange } from "@/lib/format-date";
import { ProficiencyDots } from "@/components/shared/ProficiencyDots";
import { TrackBadge } from "@/components/shared/TrackBadge";

export function SkillDetail({
  skill,
  usage,
  careers,
}: {
  skill: Skill;
  usage: SkillUsage;
  careers: readonly SiteCareer[];
}) {
  const careerById = new Map(careers.map((c) => [c.id, c]));
  const totalReferences = usage.positions.length + usage.projects.length + usage.events.length;

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Skill · {skill.category}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{skill.name}</h1>
          <ProficiencyDots value={skill.proficiency} />
        </div>
        {skill.description ? <p className="text-sm text-neutral-700">{skill.description}</p> : null}
      </header>

      {totalReferences === 0 ? (
        <p
          role="status"
          className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600"
        >
          This skill is configured but not yet referenced by any position, project, or event.
        </p>
      ) : null}

      {usage.positions.length > 0 ? (
        <section aria-labelledby="positions-heading">
          <h2
            id="positions-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Positions
          </h2>
          <ul className="mt-2 space-y-2">
            {usage.positions.map((position) => {
              const career = careerById.get(position.career);
              return (
                <li key={position.id} className="list-none">
                  <Link
                    href={`/position/${position.id}`}
                    className="block rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{position.title}</h3>
                        <p className="text-xs text-neutral-600">{position.employer.name}</p>
                      </div>
                      {career ? <TrackBadge career={career} /> : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
                      <time dateTime={position.startDate}>
                        {formatMonthRange(position.startDate, position.endDate)}
                      </time>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {usage.projects.length > 0 ? (
        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Projects
          </h2>
          <ul className="mt-2 space-y-2">
            {usage.projects.map((project) => {
              const career = careerById.get(project.position.career);
              return (
                <li key={project.id} className="list-none">
                  <Link
                    href={`/project/${project.id}`}
                    className="block rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{project.name}</h3>
                        <p className="text-xs text-neutral-600">
                          at {project.position.title}
                          {project.confidential ? "" : ` · ${project.position.employer.name}`}
                        </p>
                      </div>
                      {career ? <TrackBadge career={career} /> : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {usage.events.length > 0 ? (
        <section aria-labelledby="events-heading">
          <h2
            id="events-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Events
          </h2>
          <ul className="mt-2 space-y-2">
            {usage.events.map((event) => {
              const career = careerById.get(event.position.career);
              return (
                <li key={event.id} className="list-none">
                  <Link
                    href={`/event/${event.id}`}
                    className="block rounded-md border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{event.name}</h3>
                        <p className="text-xs text-neutral-600">
                          <time dateTime={event.date}>{event.date}</time> · {event.role}
                        </p>
                      </div>
                      {career ? <TrackBadge career={career} /> : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
