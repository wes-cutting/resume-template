import { describe, expect, it } from "vitest";

import { ownerInitials } from "@/lib/owner-name";

describe("ownerInitials", () => {
  it("returns two-letter monogram from a two-word name", () => {
    expect(ownerInitials("Alex Rivera")).toBe("AR");
    expect(ownerInitials("ada lovelace")).toBe("AL");
  });

  it("returns a single letter for one-word names", () => {
    expect(ownerInitials("Madonna")).toBe("M");
  });

  it("uses only the first two words for longer names", () => {
    expect(ownerInitials("Jean-Luc Picard Captain")).toBe("JP");
  });

  it("ignores excess whitespace", () => {
    expect(ownerInitials("  Alex   Rivera  ")).toBe("AR");
  });

  it("falls back to a placeholder for nameless input", () => {
    expect(ownerInitials("")).toBe("•");
    expect(ownerInitials("   ")).toBe("•");
  });
});
