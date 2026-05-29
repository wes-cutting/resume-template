import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { getCareerById } from "@/lib/careers";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PositionDetail } from "@/components/detail/PositionDetail";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  const { positions } = loadContent();
  return positions.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const { positions } = loadContent();
  const position = positions.find((p) => p.id === id);
  if (!position) return {};
  const title = `${position.title} at ${position.employer.name}`;
  return {
    title,
    description: position.summary,
    alternates: { canonical: `/position/${position.id}` },
    openGraph: { type: "article", url: `/position/${position.id}`, title },
  };
}

export default async function PositionDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { site, positions } = loadContent();
  const position = positions.find((p) => p.id === id);
  if (!position) notFound();

  const career = getCareerById(site, position.career);
  if (!career) notFound();

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <PositionDetail position={position} career={career} />
      </main>
    </>
  );
}
