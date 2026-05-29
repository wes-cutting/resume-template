import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { PositionJoined } from "@/content/types";
import { ProjectDetail } from "@/components/detail/ProjectDetail";
import { makePosition, makeProject, makeSkill } from "./fixtures";

afterEach(() => cleanup());

function parentPosition(): PositionJoined {
  return makePosition({
    id: "parent-pos",
    title: "Senior Engineer",
    career: "software",
    startDate: "2022-03",
    employerName: "Aurora Stack Co.",
  });
}

describe("ProjectDetail", () => {
  it("renders name, summary, employer name (when not confidential), links, and skill tags", () => {
    const project = makeProject({
      position: parentPosition(),
      id: "pr1",
      name: "Ingest Rewrite",
      summary: "Replaced the legacy ingest workers.",
      highlights: ["Cut p99 by 42%"],
      links: [{ label: "Internal RFC", url: "https://example.com/rfc" }],
      skills: [makeSkill("ts", "TypeScript")],
    });

    render(<ProjectDetail project={project} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ingest Rewrite");
    expect(screen.getByText("Aurora Stack Co.")).toBeInTheDocument();
    expect(screen.getByText(/Replaced the legacy ingest workers/)).toBeInTheDocument();
    expect(screen.getByText("Cut p99 by 42%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Internal RFC" })).toHaveAttribute(
      "href",
      "https://example.com/rfc",
    );
    expect(screen.getByRole("link", { name: "TypeScript" })).toHaveAttribute("href", "/skills/ts");
  });

  it("includes a visible back-link to the parent position (US-3)", () => {
    const project = makeProject({ position: parentPosition(), id: "pr1", name: "X" });
    render(<ProjectDetail project={project} />);
    const back = screen.getByRole("link", { name: /Senior Engineer/ });
    expect(back).toHaveAttribute("href", "/position/parent-pos");
  });

  it("renders the confidentialLabel in place of the employer when confidential", () => {
    const project = makeProject({
      position: parentPosition(),
      id: "pr1",
      name: "Secret Engagement",
      confidential: true,
      confidentialLabel: "Confidential — Fortune 500 retailer",
    });
    render(<ProjectDetail project={project} />);
    expect(screen.getByText("Confidential — Fortune 500 retailer")).toBeInTheDocument();
    expect(screen.queryByText("Aurora Stack Co.")).not.toBeInTheDocument();
  });

  it("omits the employer attribution entirely when confidential and no label is provided", () => {
    const project = makeProject({
      position: parentPosition(),
      id: "pr1",
      name: "Anonymous Work",
      confidential: true,
    });
    render(<ProjectDetail project={project} />);
    expect(screen.queryByText("Aurora Stack Co.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Confidential/)).not.toBeInTheDocument();
  });

  it("omits the links section when no links are present", () => {
    const project = makeProject({ position: parentPosition(), id: "pr1", name: "Plain" });
    render(<ProjectDetail project={project} />);
    expect(screen.queryByRole("region", { name: /links/i })).toBeNull();
  });
});
