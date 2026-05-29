import type { Education } from "@/content/types";

const MIN_DATE = "0000-00";

function startKey(e: Pick<Education, "startDate">): string {
  return e.startDate ?? MIN_DATE;
}

export function compareEducationForList(
  a: Pick<Education, "startDate" | "endDate">,
  b: Pick<Education, "startDate" | "endDate">,
): number {
  const aOpen = a.endDate === undefined;
  const bOpen = b.endDate === undefined;
  if (aOpen && !bOpen) return -1;
  if (bOpen && !aOpen) return 1;
  if (!aOpen && !bOpen) {
    const endCmp = (b.endDate as string).localeCompare(a.endDate as string);
    if (endCmp !== 0) return endCmp;
  }
  return startKey(b).localeCompare(startKey(a));
}

export function sortEducationForList<T extends Pick<Education, "startDate" | "endDate">>(
  entries: readonly T[],
): T[] {
  return [...entries].sort(compareEducationForList);
}
