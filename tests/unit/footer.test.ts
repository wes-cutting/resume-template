import { describe, expect, it } from "vitest";

import { buildDateLabel, copyrightYears, yearOf } from "@/lib/footer";

describe("copyrightYears", () => {
  it("renders a single year when build year matches start year", () => {
    expect(copyrightYears(2026, 2026)).toBe("2026");
  });

  it("renders a range when build year is later than start year", () => {
    expect(copyrightYears(2026, 2027)).toBe("2026–2027");
    expect(copyrightYears(2026, 2031)).toBe("2026–2031");
  });

  it("falls back to single year when build year is earlier (clock skew safety)", () => {
    expect(copyrightYears(2026, 2025)).toBe("2026");
    expect(copyrightYears(2026, 2024)).toBe("2026");
  });
});

describe("yearOf", () => {
  it("extracts the 4-digit year from an ISO timestamp", () => {
    expect(yearOf("2026-05-29T18:30:00Z")).toBe(2026);
    expect(yearOf("2031-12-31T23:59:59-05:00")).toBe(2031);
  });

  it("falls back to SITE_START_YEAR (2026) for unparseable input", () => {
    expect(yearOf("garbage")).toBe(2026);
    expect(yearOf("")).toBe(2026);
  });
});

describe("buildDateLabel", () => {
  it("returns the date portion of an ISO timestamp", () => {
    expect(buildDateLabel("2026-05-29T18:30:00Z")).toBe("2026-05-29");
    expect(buildDateLabel("2031-12-31T00:00:00.000Z")).toBe("2031-12-31");
  });
});
