import { loadContent } from "@/content/load";
import { groupSkillsByCategory } from "@/lib/skill-grouping";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SkillsIndex } from "@/components/skills/SkillsIndex";

export default function SkillsPage() {
  const { site, skills, skillUsage } = loadContent();
  const groups = groupSkillsByCategory(skills);

  return (
    <>
      <SiteHeader site={site} activeNav="skills" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-wider text-neutral-500">Capabilities</p>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Grouped by category. Click a skill to see where it was practiced.
          </p>
        </section>
        <SkillsIndex groups={groups} skillUsage={skillUsage} />
      </main>
    </>
  );
}
