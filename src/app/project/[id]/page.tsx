import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { ProjectDetail } from "@/components/detail/ProjectDetail";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  const { projects } = loadContent();
  return projects.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { site, projects } = loadContent();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ProjectDetail project={project} />
      </main>
    </>
  );
}
