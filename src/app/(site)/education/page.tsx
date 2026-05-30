import type { Metadata } from "next";

import { loadContent } from "@/content/load";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { EducationList } from "@/components/education/EducationList";

export function generateMetadata(): Metadata {
  const { site } = loadContent();
  return {
    title: "Education",
    description: `Education and credentials of ${site.ownerName}.`,
    alternates: { canonical: "/education" },
    openGraph: { type: "website", url: "/education", title: "Education" },
  };
}

export default function EducationPage() {
  const { site, education } = loadContent();

  return (
    <>
      <SiteHeader site={site} activeNav="education" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Credentials</p>
          <h1 className="font-headings text-2xl font-semibold tracking-tight text-foreground">
            Education
          </h1>
        </section>
        <EducationList entries={education} />
      </main>
    </>
  );
}
