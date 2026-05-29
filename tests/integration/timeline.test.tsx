import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Timeline } from "@/components/timeline/Timeline";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { DEFAULT_CAREERS, makePosition } from "./fixtures";

afterEach(() => cleanup());

function renderSorted(positions: ReturnType<typeof makePosition>[]) {
  return render(
    <Timeline positions={sortPositionsForTimeline(positions)} careers={DEFAULT_CAREERS} />,
  );
}

describe("Timeline", () => {
  it("interleaves positions from both tracks in reverse-chronological order", () => {
    renderSorted([
      makePosition({
        id: "old-sw",
        title: "Junior Engineer",
        career: "software",
        startDate: "2017-06",
        endDate: "2019-12",
      }),
      makePosition({
        id: "now-ev",
        title: "Lead Producer",
        career: "events",
        startDate: "2023-06",
      }),
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
    ]);

    const items = screen.getAllByRole("listitem");
    const titles = items.map((li) => within(li).getByRole("heading", { level: 2 }).textContent);
    expect(titles).toEqual([
      "Lead Producer",
      "Senior Engineer",
      "Production Manager",
      "Junior Engineer",
    ]);
  });

  it("renders the open-ended position with 'Present'", () => {
    renderSorted([
      makePosition({
        id: "open",
        title: "Senior Engineer",
        career: "software",
        startDate: "2022-03",
      }),
    ]);
    expect(screen.getByText(/Mar 2022 – Present/)).toBeInTheDocument();
  });

  it("labels every card with its career track for non-color-only differentiation", () => {
    renderSorted([
      makePosition({ id: "sw", title: "Engineer", career: "software", startDate: "2022-01" }),
      makePosition({ id: "ev", title: "Producer", career: "events", startDate: "2023-01" }),
    ]);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText("Event Production & Operations")).toBeInTheDocument();
    expect(within(items[1]!).getByText("Software Engineering")).toBeInTheDocument();
  });

  it("links each card to its position detail route", () => {
    renderSorted([
      makePosition({ id: "abc-123", title: "Engineer", career: "software", startDate: "2022-01" }),
    ]);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/position/abc-123");
  });

  it("shows a friendly empty state when there are no positions", () => {
    render(<Timeline positions={[]} careers={DEFAULT_CAREERS} />);
    expect(screen.getByRole("status")).toHaveTextContent(/no positions yet/i);
  });
});
