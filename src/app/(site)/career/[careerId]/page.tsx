import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { getCareerById, getCareers } from "@/lib/careers";
import { positionsByCareer } from "@/lib/position-filter";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { CareerSwitcher } from "@/components/shared/CareerSwitcher";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Timeline } from "@/components/timeline/Timeline";

type Params = { careerId: string };

export function generateStaticParams(): Params[] {
  const { site } = loadContent();
  return site.careers.map((c) => ({ careerId: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { careerId } = await params;
  const { site } = loadContent();
  const career = getCareerById(site, careerId);
  if (!career) return {};
  return {
    title: career.label,
    description: `${site.ownerName}'s positions on the ${career.label} track.`,
    alternates: { canonical: `/career/${career.id}` },
    openGraph: { type: "website", url: `/career/${career.id}`, title: career.label },
  };
}

export default async function CareerPage({ params }: { params: Promise<Params> }) {
  const { careerId } = await params;
  const { site, positions } = loadContent();
  const career = getCareerById(site, careerId);
  if (!career) notFound();

  const careers = getCareers(site);
  const filtered = positionsByCareer(positions, career.id);
  const sorted = sortPositionsForTimeline(filtered);

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Career</p>
            <h1 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
              {career.label}
            </h1>
          </div>
          <Link
            href={`/print/${career.id}`}
            className="rounded-full border border-input px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Print resume
          </Link>
        </section>
        <div className="mb-4">
          <CareerSwitcher careers={careers} activeCareerId={career.id} />
        </div>
        <Timeline
          positions={sorted}
          careers={careers}
          emptyMessage={`No ${career.label} positions yet.`}
        />
      </main>
    </>
  );
}
