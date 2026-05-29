import { describe, expect, it } from "vitest";

import { skillsReferencedBy } from "@/lib/skill-filtering";
import type { EventJoined, PositionJoined, ProjectJoined, Skill } from "@/content/types";

const skill = (id: string): Skill => ({ id, name: id, category: "x" });

function position(id: string, skillIds: string[]): PositionJoined {
  return {
    id,
    employerId: "e",
    title: "t",
    career: "software",
    startDate: "2020-01",
    summary: "s",
    skillIds,
    employer: { id: "e", name: "E" },
    projects: [],
    events: [],
    skills: [],
  };
}

function project(id: string, skillIds: string[]): ProjectJoined {
  return {
    id,
    positionId: "p",
    name: id,
    summary: "s",
    skillIds,
    confidential: false,
    position: position("p", []),
    skills: [],
  };
}

function event(id: string, skillIds: string[]): EventJoined {
  return {
    id,
    positionId: "p",
    name: id,
    date: "2024-01-01",
    role: "r",
    summary: "s",
    skillIds,
    position: position("p", []),
    skills: [],
  };
}

describe("skillsReferencedBy", () => {
  it("returns skills referenced by any of the three entity types, deduped", () => {
    const all = [skill("a"), skill("b"), skill("c"), skill("d"), skill("unused")];
    const positions = [position("p1", ["a", "b"])];
    const projects = [project("pr1", ["b", "c"])];
    const events = [event("ev1", ["c", "d"])];
    const result = skillsReferencedBy(positions, projects, events, all);
    expect(result.map((s) => s.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("preserves the order of allSkills (caller decides sort)", () => {
    const all = [skill("c"), skill("a"), skill("b")];
    const positions = [position("p", ["a", "b", "c"])];
    const result = skillsReferencedBy(positions, [], [], all);
    expect(result.map((s) => s.id)).toEqual(["c", "a", "b"]);
  });

  it("returns an empty array when nothing references any skills", () => {
    expect(skillsReferencedBy([], [], [], [skill("a")])).toEqual([]);
  });

  it("excludes skills that aren't in the allSkills list (referenced but unknown)", () => {
    const positions = [position("p", ["ghost", "a"])];
    const result = skillsReferencedBy(positions, [], [], [skill("a")]);
    expect(result.map((s) => s.id)).toEqual(["a"]);
  });
});
