import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { getCareerById } from "@/lib/careers";
import { positionsByCareer } from "@/lib/position-filter";
import { skillsReferencedBy } from "@/lib/skill-filtering";
import { PrintInstructions } from "@/components/print/PrintInstructions";
import { PrintResume } from "@/components/print/PrintResume";

type Params = { variant: string };

export function generateStaticParams(): Params[] {
  const { site } = loadContent();
  return site.careers.map((c) => ({ variant: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { variant } = await params;
  const { site } = loadContent();
  const career = getCareerById(site, variant);
  if (!career) return {};
  const title = `Printable ${career.label} resume`;
  return {
    title,
    description: `${career.label} resume for ${site.ownerName}.`,
    alternates: { canonical: `/print/${career.id}` },
    openGraph: { type: "website", url: `/print/${career.id}`, title },
    robots: { index: false, follow: true },
  };
}

export default async function PrintVariantPage({ params }: { params: Promise<Params> }) {
  const { variant } = await params;
  const { site, positions, skills, education } = loadContent();
  const career = getCareerById(site, variant);
  if (!career) notFound();

  const trackPositions = positionsByCareer(positions, career.id);
  const trackProjects = trackPositions.flatMap((p) => p.projects);
  const trackEvents = trackPositions.flatMap((p) => p.events);
  const trackSkills = skillsReferencedBy(trackPositions, trackProjects, trackEvents, skills);

  return (
    <>
      <PrintInstructions label={`${career.label} resume`} />
      <PrintResume
        site={site}
        positions={trackPositions}
        skills={trackSkills}
        education={education}
        variantLabel={career.label}
      />
    </>
  );
}
