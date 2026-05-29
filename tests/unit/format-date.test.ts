import { describe, expect, it } from "vitest";

import { formatMonth, formatMonthRange } from "@/lib/format-date";

describe("formatMonth", () => {
  it("formats YYYY-MM as 'Mon YYYY'", () => {
    expect(formatMonth("2024-03")).toBe("Mar 2024");
    expect(formatMonth("2020-01")).toBe("Jan 2020");
    expect(formatMonth("1999-12")).toBe("Dec 1999");
  });

  it("throws on malformed input", () => {
    expect(() => formatMonth("bad")).toThrow();
    expect(() => formatMonth("2024-13")).toThrow();
  });
});

describe("formatMonthRange", () => {
  it("renders 'Present' when endDate is undefined", () => {
    expect(formatMonthRange("2024-03", undefined)).toBe("Mar 2024 – Present");
  });

  it("collapses single-month range to one label", () => {
    expect(formatMonthRange("2024-03", "2024-03")).toBe("Mar 2024");
  });

  it("renders 'start – end' for multi-month ranges", () => {
    expect(formatMonthRange("2024-03", "2024-08")).toBe("Mar 2024 – Aug 2024");
    expect(formatMonthRange("2020-01", "2022-02")).toBe("Jan 2020 – Feb 2022");
  });
});
