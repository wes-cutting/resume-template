import { loadContent } from "@/content/load";
import { getCareers } from "@/lib/careers";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { CareerSwitcher } from "@/components/shared/CareerSwitcher";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Timeline } from "@/components/timeline/Timeline";

export default function HomePage() {
  const { site, positions } = loadContent();
  const careers = getCareers(site);
  const sortedPositions = sortPositionsForTimeline(positions);

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{site.ownerName}</h1>
          <p className="mt-1 text-neutral-700">{site.tagline}</p>
          {site.location ? (
            <p className="mt-0.5 text-sm text-neutral-500">{site.location}</p>
          ) : null}
        </section>
        <div className="mb-4">
          <CareerSwitcher careers={careers} />
        </div>
        <Timeline positions={sortedPositions} careers={careers} />
      </main>
    </>
  );
}
