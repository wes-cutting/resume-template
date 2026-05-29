import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SkillDetail } from "@/components/skills/SkillDetail";
import { DEFAULT_CAREERS, makeEvent, makePosition, makeProject, makeSkill } from "./fixtures";

afterEach(() => cleanup());

describe("SkillDetail", () => {
  it("renders the three reference sections with track badges", () => {
    const skill = makeSkill("ts", "TypeScript", "language");
    const softwarePos = makePosition({
      id: "pos-sw",
      title: "Senior Engineer",
      career: "software",
      startDate: "2022-03",
      employerName: "Aurora Stack Co.",
      skills: [skill],
    });
    const eventsPos = makePosition({
      id: "pos-ev",
      title: "Producer",
      career: "events",
      startDate: "2023-06",
      employerName: "Lumenfield Productions",
    });
    const project = makeProject({
      id: "pr-1",
      name: "Ingest Rewrite",
      position: softwarePos,
      skills: [skill],
    });
    const event = makeEvent({
      id: "ev-1",
      name: "Festival",
      position: eventsPos,
      date: "2024-07-13",
      role: "Producer",
      skills: [skill],
    });

    render(
      <SkillDetail
        skill={skill}
        usage={{ positions: [softwarePos], projects: [project], events: [event] }}
        careers={DEFAULT_CAREERS}
      />,
    );

    const positions = screen.getByRole("region", { name: /positions/i });
    expect(within(positions).getByRole("link", { name: /Senior Engineer/ })).toHaveAttribute(
      "href",
      "/position/pos-sw",
    );
    expect(within(positions).getByText("Software Engineering")).toBeInTheDocument();

    const projects = screen.getByRole("region", { name: /projects/i });
    expect(within(projects).getByRole("link", { name: /Ingest Rewrite/ })).toHaveAttribute(
      "href",
      "/project/pr-1",
    );

    const events = screen.getByRole("region", { name: /events/i });
    expect(within(events).getByRole("link", { name: /Festival/ })).toHaveAttribute(
      "href",
      "/event/ev-1",
    );
    expect(within(events).getByText("Event Production & Operations")).toBeInTheDocument();
  });

  it("hides a section that has no references", () => {
    const skill = makeSkill("solo");
    const pos = makePosition({
      id: "p",
      title: "T",
      career: "software",
      startDate: "2022-01",
      skills: [skill],
    });
    render(
      <SkillDetail
        skill={skill}
        usage={{ positions: [pos], projects: [], events: [] }}
        careers={DEFAULT_CAREERS}
      />,
    );
    expect(screen.queryByRole("region", { name: /projects/i })).toBeNull();
    expect(screen.queryByRole("region", { name: /events/i })).toBeNull();
  });

  it("renders a friendly empty state when nothing references the skill", () => {
    const skill = makeSkill("ghost");
    render(
      <SkillDetail
        skill={skill}
        usage={{ positions: [], projects: [], events: [] }}
        careers={DEFAULT_CAREERS}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(/not yet referenced/i);
  });

  it("renders proficiency dots only when the skill has a proficiency value", () => {
    const rated = { ...makeSkill("a"), proficiency: 4 };
    const unrated = makeSkill("b");
    const empty = { positions: [], projects: [], events: [] };

    const { rerender } = render(
      <SkillDetail skill={rated} usage={empty} careers={DEFAULT_CAREERS} />,
    );
    expect(screen.getByLabelText(/Proficiency: 4 out of 5/)).toBeInTheDocument();

    rerender(<SkillDetail skill={unrated} usage={empty} careers={DEFAULT_CAREERS} />);
    expect(screen.queryByLabelText(/Proficiency:/)).toBeNull();
  });
});
