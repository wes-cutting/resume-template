import type { Site } from "@/content/types";

export function PrintHeader({ site, variantLabel }: { site: Site; variantLabel?: string }) {
  return (
    <header className="border-b border-neutral-300 pb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{site.ownerName}</h1>
        {variantLabel ? (
          <p className="text-xs uppercase tracking-wider text-neutral-600">{variantLabel}</p>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-neutral-800">{site.tagline}</p>
      <p className="mt-2 text-xs text-neutral-700">
        <span>{site.contactEmail}</span>
        {site.location ? <span> · {site.location}</span> : null}
        {site.socialLinks?.map((link) => (
          <span key={link.url}>
            {" "}
            · {link.label}: {link.url.replace(/^https?:\/\//, "")}
          </span>
        ))}
      </p>
    </header>
  );
}
