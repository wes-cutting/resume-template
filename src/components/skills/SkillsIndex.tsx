import Link from "next/link";

import type { SkillUsage } from "@/content/types";
import { ProficiencyDots } from "@/components/shared/ProficiencyDots";
import type { SkillGroup } from "@/lib/skill-grouping";

function countLine(usage: SkillUsage | undefined): string {
  const p = usage?.positions.length ?? 0;
  const pr = usage?.projects.length ?? 0;
  const ev = usage?.events.length ?? 0;
  return `${p} position${p === 1 ? "" : "s"} • ${pr} project${pr === 1 ? "" : "s"} • ${ev} event${ev === 1 ? "" : "s"}`;
}

export function SkillsIndex({
  groups,
  skillUsage,
}: {
  groups: readonly SkillGroup[];
  skillUsage: Record<string, SkillUsage>;
}) {
  if (groups.length === 0) {
    return (
      <p
        role="status"
        className="rounded-md border border-dashed border-input bg-card px-4 py-6 text-center text-sm text-muted-foreground"
      >
        No skills yet.
      </p>
    );
  }
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`cat-${group.category}`}>
          <h2
            id={`cat-${group.category}`}
            className="font-headings text-sm font-medium uppercase tracking-wide text-muted-foreground"
          >
            {group.category}
          </h2>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {group.skills.map((skill) => (
              <li key={skill.id} className="list-none">
                <Link
                  href={`/skills/${skill.id}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 py-2 hover:bg-card"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <ProficiencyDots value={skill.proficiency} />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {countLine(skillUsage[skill.id])}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
