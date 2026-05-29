import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PositionDetail } from "@/components/detail/PositionDetail";
import { SOFTWARE_CAREER, makeEvent, makePosition, makeProject, makeSkill } from "./fixtures";

afterEach(() => cleanup());

describe("PositionDetail", () => {
  it("renders all required fields and lists every child project and event", () => {
    const skills = [makeSkill("ts", "TypeScript"), makeSkill("aws", "AWS")];
    const position = makePosition({
      id: "p1",
      title: "Senior Engineer",
      career: "software",
      startDate: "2022-03",
      employerName: "Aurora Stack Co.",
      employerWebsite: "https://aurorastack.example.com",
      summary: "Lead engineer on the streaming pipeline.",
      highlights: ["Cut p99 by 42%", "Mentored four juniors"],
      location: "Remote",
      skills,
    });
    makeProject({ id: "pr-a", name: "Ingest Rewrite", position });
    makeProject({ id: "pr-b", name: "Dashboard v2", position });
    makeEvent({
      id: "ev-a",
      name: "Internal Demo Day",
      position,
      date: "2024-04-12",
      role: "Speaker",
    });

    render(<PositionDetail position={position} career={SOFTWARE_CAREER} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Senior Engineer");
    expect(screen.getByText("Aurora Stack Co.")).toBeInTheDocument();
    expect(screen.getByText(/Mar 2022 – Present/)).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText(/Lead engineer on the streaming pipeline/)).toBeInTheDocument();

    expect(screen.getByText("Cut p99 by 42%")).toBeInTheDocument();
    expect(screen.getByText("Mentored four juniors")).toBeInTheDocument();

    const projectsSection = screen.getByRole("region", { name: /projects/i });
    expect(within(projectsSection).getByText("Ingest Rewrite")).toBeInTheDocument();
    expect(within(projectsSection).getByText("Dashboard v2")).toBeInTheDocument();

    const eventsSection = screen.getByRole("region", { name: /events/i });
    expect(within(eventsSection).getByText("Internal Demo Day")).toBeInTheDocument();

    const skillsSection = screen.getByRole("region", { name: /skills/i });
    expect(within(skillsSection).getByRole("link", { name: "TypeScript" })).toHaveAttribute(
      "href",
      "/skills/ts",
    );
    expect(within(skillsSection).getByRole("link", { name: "AWS" })).toHaveAttribute(
      "href",
      "/skills/aws",
    );
  });

  it("renders without children sections when a position has no projects or events", () => {
    const position = makePosition({
      id: "p2",
      title: "Engineer",
      career: "software",
      startDate: "2020-01",
    });
    render(<PositionDetail position={position} career={SOFTWARE_CAREER} />);
    expect(screen.queryByRole("region", { name: /projects/i })).toBeNull();
    expect(screen.queryByRole("region", { name: /events/i })).toBeNull();
  });

  it("links the employer name out when employer.website is set", () => {
    const position = makePosition({
      id: "p3",
      title: "Engineer",
      career: "software",
      startDate: "2020-01",
      employerName: "Aurora Stack Co.",
      employerWebsite: "https://aurorastack.example.com",
    });
    render(<PositionDetail position={position} career={SOFTWARE_CAREER} />);
    const link = screen.getByRole("link", { name: "Aurora Stack Co." });
    expect(link).toHaveAttribute("href", "https://aurorastack.example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
