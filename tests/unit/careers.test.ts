import { describe, expect, it } from "vitest";

import { getCareerById, getCareers } from "@/lib/careers";
import type { Site } from "@/content/types";

const site: Site = {
  ownerName: "Alex Rivera",
  tagline: "t",
  contactEmail: "alex@example.com",
  careers: [
    { id: "events", label: "Events", order: 1 },
    { id: "software", label: "Software", order: 0 },
    { id: "consulting", label: "Consulting", order: 2 },
  ],
};

describe("getCareers", () => {
  it("returns careers sorted by Site.careers[].order", () => {
    expect(getCareers(site).map((c) => c.id)).toEqual(["software", "events", "consulting"]);
  });

  it("does not mutate site.careers", () => {
    const before = site.careers.map((c) => c.id);
    getCareers(site);
    expect(site.careers.map((c) => c.id)).toEqual(before);
  });
});

describe("getCareerById", () => {
  it("returns the matching career", () => {
    expect(getCareerById(site, "events")?.label).toBe("Events");
  });

  it("returns undefined for unknown id", () => {
    expect(getCareerById(site, "ghost")).toBeUndefined();
  });
});
