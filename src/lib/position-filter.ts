import type { Position } from "@/content/types";

export function positionsByCareer<T extends Pick<Position, "career">>(
  positions: readonly T[],
  careerId: string,
): T[] {
  return positions.filter((p) => p.career === careerId);
}
