import { describe, expect, it } from "vitest";

import { positionsByCareer } from "@/lib/position-filter";

type Pos = { id: string; career: string };

const positions: Pos[] = [
  { id: "p1", career: "software" },
  { id: "p2", career: "events" },
  { id: "p3", career: "software" },
  { id: "p4", career: "consulting" },
];

describe("positionsByCareer", () => {
  it("returns only positions matching the careerId", () => {
    expect(positionsByCareer(positions, "software").map((p) => p.id)).toEqual(["p1", "p3"]);
    expect(positionsByCareer(positions, "events").map((p) => p.id)).toEqual(["p2"]);
  });

  it("preserves input order (caller decides sort)", () => {
    const input: Pos[] = [
      { id: "z", career: "software" },
      { id: "a", career: "software" },
    ];
    expect(positionsByCareer(input, "software").map((p) => p.id)).toEqual(["z", "a"]);
  });

  it("returns an empty array when no positions match", () => {
    expect(positionsByCareer(positions, "ghost")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const before = [...positions];
    positionsByCareer(positions, "software");
    expect(positions).toEqual(before);
  });

  it("works for a third career configured at content time (FEAT-002 US-3)", () => {
    const withThird: Pos[] = [...positions, { id: "p5", career: "consulting" }];
    expect(positionsByCareer(withThird, "consulting").map((p) => p.id)).toEqual(["p4", "p5"]);
  });
});
