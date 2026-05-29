import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Timeline } from "@/components/timeline/Timeline";
import { positionsByCareer } from "@/lib/position-filter";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { DEFAULT_CAREERS, makePosition } from "./fixtures";

afterEach(() => cleanup());

const POSITIONS = [
  makePosition({
    id: "old-sw",
    title: "Junior Engineer",
    career: "software",
    startDate: "2017-06",
    endDate: "2019-12",
  }),
  makePosition({ id: "now-ev", title: "Lead Producer", career: "events", startDate: "2023-06" }),
  makePosition({
    id: "now-sw",
    title: "Senior Engineer",
    career: "software",
    startDate: "2022-03",
  }),
  makePosition({
    id: "old-ev",
    title: "Production Manager",
    career: "events",
    startDate: "2018-09",
    endDate: "2020-05",
  }),
];

function renderTrack(careerId: string, emptyMessage?: string) {
  const filtered = positionsByCareer(POSITIONS, careerId);
  return render(
    <Timeline
      positions={sortPositionsForTimeline(filtered)}
      careers={DEFAULT_CAREERS}
      emptyMessage={emptyMessage}
    />,
  );
}

describe("split timeline filtering", () => {
  it("shows only software positions on /career/software, in reverse-chronological order", () => {
    renderTrack("software");
    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual(["Senior Engineer", "Junior Engineer"]);
  });

  it("shows only events positions on /career/events", () => {
    renderTrack("events");
    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual(["Lead Producer", "Production Manager"]);
  });

  it("does not leak the opposite track's labels into a filtered view", () => {
    renderTrack("software");
    expect(screen.queryByText("Event Production & Operations")).not.toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    for (const item of items) {
      expect(within(item).getByText("Software Engineering")).toBeInTheDocument();
    }
  });

  it("renders a track-specific empty state when no positions match (FEAT-002 §5)", () => {
    renderTrack("consulting", "No Consulting positions yet.");
    expect(screen.getByRole("status")).toHaveTextContent("No Consulting positions yet.");
  });

  it("works for an arbitrary third career id with no code changes (US-3)", () => {
    const withThird = [
      ...POSITIONS,
      makePosition({
        id: "now-co",
        title: "Principal Consultant",
        career: "consulting",
        startDate: "2025-01",
      }),
    ];
    const filtered = positionsByCareer(withThird, "consulting");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe("Principal Consultant");
  });
});
