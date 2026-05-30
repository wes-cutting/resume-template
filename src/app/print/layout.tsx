import type { ReactNode } from "react";

/**
 * FEAT-010 — print routes stay light regardless of system theme.
 *
 * The root layout's <body> picks up `dark:bg-neutral-950` so the rest of the
 * site auto-darkens via `prefers-color-scheme`. Print routes intentionally do
 * not, because the route's purpose is to render the resume as it will look on
 * paper. This wrapper overrides the body's dark background and forces a light
 * surface for the entire viewport, on screen and in print alike. The
 * `@media print` rules in `src/styles/print.css` cover the same invariant
 * during actual printing.
 *
 * Print components (under `src/components/print/`) intentionally carry no
 * `dark:` variants for the same reason.
 */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="print-shell"
      className="min-h-screen bg-print-background text-print-foreground"
    >
      {children}
    </div>
  );
}
