import type { Skill } from "@/content/types";
import { groupSkillsByCategory } from "@/lib/skill-grouping";

export function PrintSkillsSection({ skills }: { skills: readonly Skill[] }) {
  if (skills.length === 0) return null;
  const groups = groupSkillsByCategory(skills);
  return (
    <section aria-labelledby="print-skills-heading" className="break-inside-avoid">
      <h2
        id="print-skills-heading"
        className="font-headings break-after-avoid text-sm font-semibold uppercase tracking-wider text-print-foreground"
      >
        Skills
      </h2>
      <dl className="mt-2 space-y-0.5">
        {groups.map((group) => (
          <div
            key={group.category}
            className="flex flex-wrap gap-x-2 text-xs text-print-foreground"
          >
            <dt className="font-medium capitalize">{group.category.replace(/-/g, " ")}:</dt>
            <dd>{group.skills.map((s) => s.name).join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
