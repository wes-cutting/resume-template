import type { Position } from "@/content/types";

const OPEN_SENTINEL = "9999-99";

export function comparePositionsForTimeline(
  a: Pick<Position, "startDate" | "endDate" | "title">,
  b: Pick<Position, "startDate" | "endDate" | "title">,
): number {
  const startCmp = b.startDate.localeCompare(a.startDate);
  if (startCmp !== 0) return startCmp;

  const aEnd = a.endDate ?? OPEN_SENTINEL;
  const bEnd = b.endDate ?? OPEN_SENTINEL;
  const endCmp = bEnd.localeCompare(aEnd);
  if (endCmp !== 0) return endCmp;

  return a.title.localeCompare(b.title);
}

export function sortPositionsForTimeline<
  T extends Pick<Position, "startDate" | "endDate" | "title">,
>(positions: readonly T[]): T[] {
  return [...positions].sort(comparePositionsForTimeline);
}
