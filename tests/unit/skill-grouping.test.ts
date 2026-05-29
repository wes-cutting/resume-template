import { describe, expect, it } from "vitest";

import { groupSkillsByCategory } from "@/lib/skill-grouping";
import type { Skill } from "@/content/types";

const skill = (id: string, name: string, category: string): Skill => ({ id, name, category });

describe("groupSkillsByCategory", () => {
  it("groups skills by category and sorts groups + skills alphabetically", () => {
    const groups = groupSkillsByCategory([
      skill("ts", "TypeScript", "language"),
      skill("av", "AV systems", "vendor-tools"),
      skill("py", "Python", "language"),
      skill("react", "React", "framework"),
      skill("next", "Next.js", "framework"),
    ]);
    expect(groups.map((g) => g.category)).toEqual(["framework", "language", "vendor-tools"]);
    expect(groups[0]!.skills.map((s) => s.name)).toEqual(["Next.js", "React"]);
    expect(groups[1]!.skills.map((s) => s.name)).toEqual(["Python", "TypeScript"]);
  });

  it("returns an empty array when there are no skills", () => {
    expect(groupSkillsByCategory([])).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [skill("b", "B", "x"), skill("a", "A", "x")];
    const before = [...input];
    groupSkillsByCategory(input);
    expect(input).toEqual(before);
  });
});
