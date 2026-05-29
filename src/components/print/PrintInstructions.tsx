import Link from "next/link";

export function PrintInstructions({ label }: { label: string }) {
  return (
    <div
      data-print="hide"
      className="border-b border-neutral-200 bg-neutral-50 px-6 py-3 text-xs text-neutral-700"
    >
      <div className="mx-auto flex max-w-[8.5in] flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span>
          <span className="font-medium">{label}</span> · Press{" "}
          <kbd className="rounded border border-neutral-300 bg-white px-1">Cmd</kbd>/
          <kbd className="rounded border border-neutral-300 bg-white px-1">Ctrl</kbd> +{" "}
          <kbd className="rounded border border-neutral-300 bg-white px-1">P</kbd> to print or save
          as PDF.
        </span>
        <Link href="/" className="text-neutral-600 hover:text-neutral-900">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
