import Link from "next/link";

import type { Skill } from "@/content/types";

export function SkillTags({
  skills,
  label = "Skills",
}: {
  skills: readonly Skill[];
  label?: string;
}) {
  if (skills.length === 0) return null;
  return (
    <section aria-labelledby="skill-tags-heading">
      <h3
        id="skill-tags-heading"
        className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <li key={skill.id} className="list-none">
            <Link
              href={`/skills/${skill.id}`}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-input focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {skill.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
