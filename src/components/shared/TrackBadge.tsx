import type { SiteCareer } from "@/content/types";

// FEAT-010 — `chip` carries the light-mode tint; `chipDark` carries the dark-mode
// inversion (deeper background, brighter text, dimmer ring). The two are
// merged at render time so any consumer gets both in one string.
const TRACK_STYLES = [
  {
    chip: "bg-sky-50 text-sky-900 ring-sky-200",
    chipDark: "dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-800",
    border: "border-sky-600",
  },
  {
    chip: "bg-amber-50 text-amber-900 ring-amber-200",
    chipDark: "dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800",
    border: "border-amber-600",
  },
  {
    chip: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    chipDark: "dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800",
    border: "border-emerald-600",
  },
  {
    chip: "bg-violet-50 text-violet-900 ring-violet-200",
    chipDark: "dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-800",
    border: "border-violet-600",
  },
] as const;

export type TrackStyle = (typeof TRACK_STYLES)[number];

export function getTrackStyle(orderIndex: number): TrackStyle {
  const len = TRACK_STYLES.length;
  const idx = ((orderIndex % len) + len) % len;
  const style = TRACK_STYLES[idx];
  if (!style) throw new Error("unreachable: TRACK_STYLES index out of range");
  return style;
}

function monogramFor(career: SiteCareer): string {
  const first = career.label.trim().charAt(0);
  return first ? first.toUpperCase() : career.id.charAt(0).toUpperCase();
}

export function TrackBadge({ career }: { career: SiteCareer }) {
  const style = getTrackStyle(career.order);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.chip} ${style.chipDark}`}
      data-track-id={career.id}
    >
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full bg-white/70 text-[10px] font-bold leading-none dark:bg-white/15"
      >
        {monogramFor(career)}
      </span>
      <span>{career.label}</span>
    </span>
  );
}
