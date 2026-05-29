import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadContent } from "@/content/load";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { EventDetail } from "@/components/detail/EventDetail";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  const { events } = loadContent();
  return events.map((e) => ({ id: e.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const { events } = loadContent();
  const event = events.find((e) => e.id === id);
  if (!event) return {};
  return {
    title: event.name,
    description: event.summary,
    alternates: { canonical: `/event/${event.id}` },
    openGraph: { type: "article", url: `/event/${event.id}`, title: event.name },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const { site, events } = loadContent();
  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  return (
    <>
      <SiteHeader site={site} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <EventDetail event={event} />
      </main>
    </>
  );
}
