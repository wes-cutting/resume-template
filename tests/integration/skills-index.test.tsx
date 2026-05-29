import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Skill, SkillUsage } from "@/content/types";
import { groupSkillsByCategory } from "@/lib/skill-grouping";
import { SkillsIndex } from "@/components/skills/SkillsIndex";

afterEach(() => cleanup());

const SKILLS: Skill[] = [
  { id: "ts", name: "TypeScript", category: "language", proficiency: 5 },
  { id: "py", name: "Python", category: "language" },
  { id: "react", name: "React", category: "framework", proficiency: 4 },
  { id: "av", name: "AV systems", category: "vendor-tools" },
];

const USAGE: Record<string, SkillUsage> = {
  ts: { positions: [{} as never, {} as never], projects: [{} as never], events: [] },
  py: { positions: [{} as never], projects: [], events: [] },
  react: { positions: [{} as never], projects: [{} as never, {} as never], events: [] },
  av: { positions: [{} as never], projects: [], events: [{} as never] },
};

describe("SkillsIndex", () => {
  it("renders categories alphabetically and skills alphabetically within each", () => {
    render(<SkillsIndex groups={groupSkillsByCategory(SKILLS)} skillUsage={USAGE} />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["framework", "language", "vendor-tools"]);

    const langSection = screen.getByRole("region", { name: /^language$/i });
    const skillNames = within(langSection)
      .getAllByRole("link")
      .map((link) => link.textContent ?? "");
    expect(skillNames[0]).toMatch(/^Python/);
    expect(skillNames[1]).toMatch(/^TypeScript/);
  });

  it("renders count line and links each row to /skills/[id]", () => {
    render(<SkillsIndex groups={groupSkillsByCategory(SKILLS)} skillUsage={USAGE} />);
    const tsLink = screen.getByRole("link", { name: /TypeScript/ });
    expect(tsLink).toHaveAttribute("href", "/skills/ts");
    expect(tsLink).toHaveTextContent(/2 positions • 1 project • 0 events/);
  });

  it("only renders proficiency dots when the skill has a proficiency value", () => {
    render(<SkillsIndex groups={groupSkillsByCategory(SKILLS)} skillUsage={USAGE} />);
    const tsRow = screen.getByRole("link", { name: /TypeScript/ });
    expect(within(tsRow).getByLabelText(/Proficiency:/)).toBeInTheDocument();

    const pyRow = screen.getByRole("link", { name: /Python/ });
    expect(within(pyRow).queryByLabelText(/Proficiency:/)).toBeNull();
  });

  it("renders an empty state when there are no skills", () => {
    render(<SkillsIndex groups={[]} skillUsage={{}} />);
    expect(screen.getByRole("status")).toHaveTextContent(/no skills yet/i);
  });
});
