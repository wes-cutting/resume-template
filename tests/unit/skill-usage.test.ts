import { describe, expect, it } from "vitest";

import { buildSkillUsage, unreferencedSkillIds } from "@/lib/skill-usage";
import type { EventJoined, PositionJoined, ProjectJoined, Skill } from "@/content/types";

function mkSkill(id: string): Skill {
  return { id, name: id, category: "test" };
}

function mkPosition(id: string, skillIds: string[]): PositionJoined {
  return {
    id,
    employerId: "emp",
    title: "T",
    career: "software",
    startDate: "2020-01",
    summary: "s",
    skillIds,
    employer: { id: "emp", name: "Emp" },
    projects: [],
    events: [],
    skills: [],
  };
}

function mkProject(id: string, position: PositionJoined, skillIds: string[]): ProjectJoined {
  return {
    id,
    positionId: position.id,
    name: id,
    summary: "s",
    skillIds,
    confidential: false,
    position,
    skills: [],
  };
}

function mkEvent(id: string, position: PositionJoined, skillIds: string[]): EventJoined {
  return {
    id,
    positionId: position.id,
    name: id,
    date: "2024-01-01",
    role: "r",
    summary: "s",
    skillIds,
    position,
    skills: [],
  };
}

describe("buildSkillUsage", () => {
  it("indexes every skill, including unreferenced ones", () => {
    const skills = [mkSkill("a"), mkSkill("b"), mkSkill("c")];
    const position = mkPosition("p1", ["a"]);
    const project = mkProject("pr1", position, ["b"]);
    const event = mkEvent("ev1", position, ["a"]);

    const usage = buildSkillUsage(skills, [position], [project], [event]);

    expect(Object.keys(usage).sort()).toEqual(["a", "b", "c"]);
    expect(usage.a?.positions.map((p) => p.id)).toEqual(["p1"]);
    expect(usage.a?.events.map((e) => e.id)).toEqual(["ev1"]);
    expect(usage.b?.projects.map((p) => p.id)).toEqual(["pr1"]);
    expect(usage.c?.positions).toEqual([]);
    expect(usage.c?.projects).toEqual([]);
    expect(usage.c?.events).toEqual([]);
  });

  it("silently ignores skillIds that reference unknown skills", () => {
    // Reference validation happens in the loader; buildSkillUsage just indexes what's there.
    const skills = [mkSkill("a")];
    const position = mkPosition("p1", ["a", "ghost"]);
    const usage = buildSkillUsage(skills, [position], [], []);
    expect(usage.a?.positions).toHaveLength(1);
    expect(usage.ghost).toBeUndefined();
  });
});

describe("unreferencedSkillIds", () => {
  it("returns ids with zero references across all three entity types", () => {
    const skills = [mkSkill("a"), mkSkill("b"), mkSkill("c")];
    const position = mkPosition("p1", ["a"]);
    const project = mkProject("pr1", position, ["b"]);

    const usage = buildSkillUsage(skills, [position], [project], []);
    expect(unreferencedSkillIds(usage)).toEqual(["c"]);
  });

  it("returns empty when every skill is referenced", () => {
    const skills = [mkSkill("a")];
    const position = mkPosition("p1", ["a"]);
    const usage = buildSkillUsage(skills, [position], [], []);
    expect(unreferencedSkillIds(usage)).toEqual([]);
  });
});
