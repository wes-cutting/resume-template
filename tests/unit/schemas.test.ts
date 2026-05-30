import { describe, expect, it } from "vitest";

import {
  EmployerSchema,
  EventSchema,
  NowSchema,
  PositionSchema,
  ProjectSchema,
  SiteSchema,
  SkillSchema,
  dayDate,
  httpsUrl,
  monthDate,
  slug,
} from "@/content/schemas";

describe("primitives", () => {
  it("slug accepts kebab-case", () => {
    expect(slug.safeParse("aurora-stack").success).toBe(true);
    expect(slug.safeParse("a1-b2-c3").success).toBe(true);
  });

  it("slug rejects uppercase, underscores, leading/trailing dashes", () => {
    for (const bad of ["Aurora", "aurora_stack", "-aurora", "aurora-", "a--b"]) {
      expect(slug.safeParse(bad).success).toBe(false);
    }
  });

  it("monthDate enforces YYYY-MM", () => {
    expect(monthDate.safeParse("2024-01").success).toBe(true);
    expect(monthDate.safeParse("2024-13").success).toBe(false);
    expect(monthDate.safeParse("2024-1").success).toBe(false);
    expect(monthDate.safeParse("2024-01-01").success).toBe(false);
  });

  it("dayDate enforces YYYY-MM-DD", () => {
    expect(dayDate.safeParse("2024-07-13").success).toBe(true);
    expect(dayDate.safeParse("2024-02-30").success).toBe(true); // pattern-level only
    expect(dayDate.safeParse("2024-13-01").success).toBe(false);
    expect(dayDate.safeParse("2024-07").success).toBe(false);
  });

  it("httpsUrl requires https://", () => {
    expect(httpsUrl.safeParse("https://example.com").success).toBe(true);
    expect(httpsUrl.safeParse("http://example.com").success).toBe(false);
    expect(httpsUrl.safeParse("ftp://example.com").success).toBe(false);
    expect(httpsUrl.safeParse("not a url").success).toBe(false);
  });
});

describe("SiteSchema", () => {
  const valid = {
    ownerName: "Alex Rivera",
    tagline: "Engineer and producer.",
    contactEmail: "alex@example.com",
    careers: [{ id: "software", label: "Software", order: 0 }],
  };

  it("accepts a minimal valid site", () => {
    expect(SiteSchema.safeParse(valid).success).toBe(true);
  });

  it("requires at least one career", () => {
    const result = SiteSchema.safeParse({ ...valid, careers: [] });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (strict)", () => {
    const result = SiteSchema.safeParse({ ...valid, extra: "nope" });
    expect(result.success).toBe(false);
  });

  it("accepts optional siteUrl and repoUrl when they are https URLs", () => {
    const result = SiteSchema.safeParse({
      ...valid,
      siteUrl: "https://alex.example",
      repoUrl: "https://github.com/example/repo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects siteUrl that isn't https", () => {
    const result = SiteSchema.safeParse({ ...valid, siteUrl: "http://insecure.example" });
    expect(result.success).toBe(false);
  });

  it("accepts an optional bookingUrl when it's an https URL", () => {
    const result = SiteSchema.safeParse({
      ...valid,
      bookingUrl: "https://cal.com/alex/intro",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bookingUrl that isn't https", () => {
    const result = SiteSchema.safeParse({ ...valid, bookingUrl: "http://insecure.example" });
    expect(result.success).toBe(false);
  });
});

describe("PositionSchema", () => {
  const base = {
    id: "pos-1",
    employerId: "emp-1",
    title: "Engineer",
    career: "software",
    startDate: "2020-01",
    summary: "Did things.",
  };

  it("accepts a valid current position (no endDate)", () => {
    expect(PositionSchema.safeParse(base).success).toBe(true);
  });

  it("rejects endDate before startDate", () => {
    const result = PositionSchema.safeParse({ ...base, endDate: "2019-12" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["endDate"]);
    }
  });

  it("accepts endDate equal to startDate", () => {
    expect(PositionSchema.safeParse({ ...base, endDate: "2020-01" }).success).toBe(true);
  });
});

describe("ProjectSchema", () => {
  it("defaults confidential to false", () => {
    const result = ProjectSchema.safeParse({
      id: "pr-1",
      positionId: "pos-1",
      name: "Thing",
      summary: "Did it.",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.confidential).toBe(false);
  });

  it("accepts confidentialLabel as an optional masking string", () => {
    const result = ProjectSchema.safeParse({
      id: "pr-1",
      positionId: "pos-1",
      name: "Thing",
      summary: "Did it.",
      confidential: true,
      confidentialLabel: "Confidential — Fortune 500 retailer",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a confidentialLabel longer than 120 chars", () => {
    const result = ProjectSchema.safeParse({
      id: "pr-1",
      positionId: "pos-1",
      name: "Thing",
      summary: "Did it.",
      confidentialLabel: "x".repeat(121),
    });
    expect(result.success).toBe(false);
  });
});

describe("EventSchema, EmployerSchema, SkillSchema", () => {
  it("EventSchema requires role and date", () => {
    expect(
      EventSchema.safeParse({
        id: "ev-1",
        positionId: "pos-1",
        name: "Gala",
        date: "2024-01-01",
        role: "Producer",
        summary: "Did it.",
      }).success,
    ).toBe(true);
    expect(
      EventSchema.safeParse({
        id: "ev-1",
        positionId: "pos-1",
        name: "Gala",
        date: "2024-01-01",
        summary: "Did it.",
      }).success,
    ).toBe(false);
  });

  it("EmployerSchema accepts minimal fields", () => {
    expect(EmployerSchema.safeParse({ id: "e", name: "Co." }).success).toBe(true);
  });

  it("SkillSchema rejects proficiency outside 1..5", () => {
    expect(
      SkillSchema.safeParse({ id: "s", name: "S", category: "c", proficiency: 0 }).success,
    ).toBe(false);
    expect(
      SkillSchema.safeParse({ id: "s", name: "S", category: "c", proficiency: 6 }).success,
    ).toBe(false);
    expect(
      SkillSchema.safeParse({ id: "s", name: "S", category: "c", proficiency: 3 }).success,
    ).toBe(true);
  });
});

describe("NowSchema (FEAT-009)", () => {
  const valid = { lastUpdated: "2026-05-29", body: "Working on the resume site." };

  it("accepts a minimal valid Now record", () => {
    expect(NowSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional bullets", () => {
    const result = NowSchema.safeParse({ ...valid, bullets: ["a", "b"] });
    expect(result.success).toBe(true);
  });

  it("rejects an empty body", () => {
    expect(NowSchema.safeParse({ ...valid, body: "" }).success).toBe(false);
  });

  it("rejects a body longer than 2000 chars", () => {
    expect(NowSchema.safeParse({ ...valid, body: "x".repeat(2001) }).success).toBe(false);
  });

  it("rejects a bullet longer than 200 chars", () => {
    expect(NowSchema.safeParse({ ...valid, bullets: ["x".repeat(201)] }).success).toBe(false);
  });

  it("rejects a lastUpdated that isn't YYYY-MM-DD", () => {
    expect(NowSchema.safeParse({ ...valid, lastUpdated: "2026-05" }).success).toBe(false);
    expect(NowSchema.safeParse({ ...valid, lastUpdated: "not-a-date" }).success).toBe(false);
  });

  it("accepts a future-dated lastUpdated at the schema layer (loader handles warning)", () => {
    expect(NowSchema.safeParse({ ...valid, lastUpdated: "2999-01-01" }).success).toBe(true);
  });

  it("rejects unknown fields (strict)", () => {
    expect(NowSchema.safeParse({ ...valid, extra: 1 }).success).toBe(false);
  });
});
