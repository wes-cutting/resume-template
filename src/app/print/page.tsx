import type { Metadata } from "next";

import { loadContent } from "@/content/load";
import { PrintInstructions } from "@/components/print/PrintInstructions";
import { PrintResume } from "@/components/print/PrintResume";

export function generateMetadata(): Metadata {
  const { site } = loadContent();
  return {
    title: "Printable resume",
    description: `Printable resume for ${site.ownerName}.`,
    alternates: { canonical: "/print" },
    openGraph: { type: "website", url: "/print", title: "Printable resume" },
    robots: { index: false, follow: true },
  };
}

export default function PrintUnifiedPage() {
  const { site, positions, skills, education } = loadContent();
  return (
    <>
      <PrintInstructions label="Unified resume" />
      <PrintResume site={site} positions={positions} skills={skills} education={education} />
    </>
  );
}
