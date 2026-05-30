import Link from "next/link";

export function PrintInstructions({ label }: { label: string }) {
  return (
    <div
      data-print="hide"
      className="border-b border-print-border bg-print-background px-6 py-3 text-xs text-print-foreground"
    >
      <div className="mx-auto flex max-w-[8.5in] flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span>
          <span className="font-medium">{label}</span> · Press{" "}
          <kbd className="rounded border border-print-border bg-print-background px-1">Cmd</kbd>/
          <kbd className="rounded border border-print-border bg-print-background px-1">Ctrl</kbd> +{" "}
          <kbd className="rounded border border-print-border bg-print-background px-1">P</kbd> to
          print or save as PDF.
        </span>
        <Link href="/" className="text-print-muted-foreground hover:text-print-foreground">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
