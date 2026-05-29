import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { getCareers } from "@/lib/careers";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SkillDetail } from "@/components/skills/SkillDetail";

type Params = { skillId: string };

export function generateStaticParams(): Params[] {
  const { skills } = loadContent();
  return skills.map((s) => ({ skillId: s.id }));
}

export const dynamicParams = false;

export default async function SkillDetailPage({ params }: { params: Promise<Params> }) {
  const { skillId } = await params;
  const { site, skills, skillUsage } = loadContent();
  const skill = skills.find((s) => s.id === skillId);
  const usage = skillUsage[skillId];
  if (!skill || !usage) notFound();

  const careers = getCareers(site);

  return (
    <>
      <SiteHeader site={site} activeNav="skills" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <SkillDetail skill={skill} usage={usage} careers={careers} />
      </main>
    </>
  );
}
