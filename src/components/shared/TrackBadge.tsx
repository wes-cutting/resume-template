import type { SiteCareer } from "@/content/types";

// FEAT-012 — track tint classes reference --color-track-N-* tokens defined in
// src/styles/theme.css. Light + dark values are folded into the token
// definitions, so this lookup never carries `dark:` variants. The site ships
// four track slots; getTrackStyle(orderIndex) modulo-wraps if a site adds a
// fifth-or-later track. Template adopters can extend by adding more
// `--color-track-N-*` tokens to theme.css and a corresponding row below.
const TRACK_STYLES = [
  {
    chip: "bg-track-1 text-track-1-foreground ring-track-1-edge",
    border: "border-track-1-edge",
  },
  {
    chip: "bg-track-2 text-track-2-foreground ring-track-2-edge",
    border: "border-track-2-edge",
  },
  {
    chip: "bg-track-3 text-track-3-foreground ring-track-3-edge",
    border: "border-track-3-edge",
  },
  {
    chip: "bg-track-4 text-track-4-foreground ring-track-4-edge",
    border: "border-track-4-edge",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.chip}`}
      data-track-id={career.id}
    >
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full bg-background/60 text-[10px] font-bold leading-none"
      >
        {monogramFor(career)}
      </span>
      <span>{career.label}</span>
    </span>
  );
}
