import type { Metadata } from "next";

import { loadContent } from "@/content/load";
import { ContactPage } from "@/components/contact/ContactPage";
import { SiteHeader } from "@/components/shared/SiteHeader";

export function generateMetadata(): Metadata {
  const { site } = loadContent();
  return {
    title: "Contact",
    description: `Get in touch with ${site.ownerName}.`,
    alternates: { canonical: "/contact" },
    openGraph: { type: "website", url: "/contact", title: "Contact" },
  };
}

export default function ContactRoute() {
  const { site } = loadContent();
  return (
    <>
      <SiteHeader site={site} activeNav="contact" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <ContactPage site={site} />
      </main>
    </>
  );
}
