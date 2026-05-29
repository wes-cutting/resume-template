import type { ReactNode } from "react";

import { loadContent } from "@/content/load";
import { SiteFooter } from "@/components/shared/SiteFooter";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { site } = loadContent();
  return (
    <>
      {children}
      <SiteFooter site={site} />
    </>
  );
}
