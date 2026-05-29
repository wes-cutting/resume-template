import type { ProjectJoined } from "@/content/types";
import { BackLink } from "@/components/shared/BackLink";
import { Highlights } from "@/components/shared/Highlights";
import { SkillTags } from "@/components/shared/SkillTags";

function employerAttribution(project: ProjectJoined): string | undefined {
  if (project.confidential) return project.confidentialLabel;
  return project.position.employer.name;
}

export function ProjectDetail({ project }: { project: ProjectJoined }) {
  const attribution = employerAttribution(project);
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <BackLink
          href={`/position/${project.position.id}`}
          label={`Back to ${project.position.title}`}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{project.name}</h1>
        {attribution ? <p className="text-sm text-neutral-700">{attribution}</p> : null}
        <p className="pt-2 text-sm leading-relaxed text-neutral-800">{project.summary}</p>
      </header>

      <Highlights items={project.highlights} />

      {project.links && project.links.length > 0 ? (
        <section aria-labelledby="links-heading">
          <h3
            id="links-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Links
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {project.links.map((link, i) => (
              <li key={i} className="list-none">
                <a
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-neutral-700 underline-offset-2 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SkillTags skills={project.skills} />
    </article>
  );
}
