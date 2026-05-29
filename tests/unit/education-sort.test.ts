import { describe, expect, it } from "vitest";

import { sortEducationForList } from "@/lib/education-sort";

type Entry = { id: string; startDate?: string; endDate?: string };

const ids = (xs: readonly Entry[]) => xs.map((x) => x.id);

describe("sortEducationForList", () => {
  it("puts entries with no endDate first (current programs)", () => {
    const sorted = sortEducationForList<Entry>([
      { id: "completed", startDate: "2017-09", endDate: "2021-05" },
      { id: "current", startDate: "2022-01" },
    ]);
    expect(ids(sorted)).toEqual(["current", "completed"]);
  });

  it("among completed entries, sorts by endDate descending", () => {
    const sorted = sortEducationForList<Entry>([
      { id: "old", startDate: "2010-01", endDate: "2014-05" },
      { id: "newer", startDate: "2018-01", endDate: "2021-05" },
      { id: "mid", startDate: "2015-01", endDate: "2019-06" },
    ]);
    expect(ids(sorted)).toEqual(["newer", "mid", "old"]);
  });

  it("breaks endDate ties by startDate descending", () => {
    const sorted = sortEducationForList<Entry>([
      { id: "earlier-start", startDate: "2018-09", endDate: "2022-05" },
      { id: "later-start", startDate: "2020-09", endDate: "2022-05" },
    ]);
    expect(ids(sorted)).toEqual(["later-start", "earlier-start"]);
  });

  it("among open entries, sorts by startDate descending", () => {
    const sorted = sortEducationForList<Entry>([
      { id: "old-current", startDate: "2018-01" },
      { id: "new-current", startDate: "2024-01" },
    ]);
    expect(ids(sorted)).toEqual(["new-current", "old-current"]);
  });

  it("handles entries with no dates at all (FEAT-004 §5)", () => {
    const sorted = sortEducationForList<Entry>([
      { id: "dated", startDate: "2018-01", endDate: "2022-05" },
      { id: "undated" },
      { id: "current", startDate: "2024-01" },
    ]);
    // 'undated' has no endDate so it ranks as open; among the two open entries,
    // 'current' wins the startDate-desc tiebreak.
    expect(ids(sorted)).toEqual(["current", "undated", "dated"]);
  });

  it("does not mutate the input array", () => {
    const input: Entry[] = [
      { id: "a", startDate: "2018-01", endDate: "2022-05" },
      { id: "b", startDate: "2024-01" },
    ];
    const before = [...input];
    sortEducationForList(input);
    expect(input).toEqual(before);
  });
});
