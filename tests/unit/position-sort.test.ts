import { describe, expect, it } from "vitest";

import { sortPositionsForTimeline } from "@/lib/position-sort";

type TestPos = { id: string; startDate: string; endDate?: string; title: string };

const ids = (positions: readonly TestPos[]) => positions.map((p) => p.id);

describe("sortPositionsForTimeline", () => {
  it("sorts by startDate descending (most recent first)", () => {
    const result = sortPositionsForTimeline<TestPos>([
      { id: "old", startDate: "2018-01", title: "A" },
      { id: "new", startDate: "2024-01", title: "A" },
      { id: "mid", startDate: "2021-01", title: "A" },
    ]);
    expect(ids(result)).toEqual(["new", "mid", "old"]);
  });

  it("treats an open position (no endDate) as more recent on the endDate tiebreak", () => {
    const result = sortPositionsForTimeline<TestPos>([
      { id: "closed", startDate: "2022-01", endDate: "2023-06", title: "A" },
      { id: "open", startDate: "2022-01", title: "A" },
    ]);
    expect(ids(result)).toEqual(["open", "closed"]);
  });

  it("breaks endDate ties by title ascending", () => {
    const result = sortPositionsForTimeline<TestPos>([
      { id: "z", startDate: "2022-01", endDate: "2023-01", title: "Zebra" },
      { id: "a", startDate: "2022-01", endDate: "2023-01", title: "Alpha" },
      { id: "m", startDate: "2022-01", endDate: "2023-01", title: "Mango" },
    ]);
    expect(ids(result)).toEqual(["a", "m", "z"]);
  });

  it("does not mutate the input array", () => {
    const input: TestPos[] = [
      { id: "old", startDate: "2018-01", title: "A" },
      { id: "new", startDate: "2024-01", title: "B" },
    ];
    const before = [...input];
    sortPositionsForTimeline(input);
    expect(input).toEqual(before);
  });
});
