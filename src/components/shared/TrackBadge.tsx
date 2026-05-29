import type { SiteCareer } from "@/content/types";

const TRACK_STYLES = [
  { chip: "bg-sky-50 text-sky-900 ring-sky-200", border: "border-sky-600" },
  { chip: "bg-amber-50 text-amber-900 ring-amber-200", border: "border-amber-600" },
  { chip: "bg-emerald-50 text-emerald-900 ring-emerald-200", border: "border-emerald-600" },
  { chip: "bg-violet-50 text-violet-900 ring-violet-200", border: "border-violet-600" },
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.chip}`}
      data-track-id={career.id}
    >
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full bg-white/70 text-[10px] font-bold leading-none"
      >
        {monogramFor(career)}
      </span>
      <span>{career.label}</span>
    </span>
  );
}
