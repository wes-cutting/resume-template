import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { PositionJoined } from "@/content/types";
import { EventDetail } from "@/components/detail/EventDetail";
import { makeEvent, makePosition, makeSkill } from "./fixtures";

afterEach(() => cleanup());

function parentPosition(): PositionJoined {
  return makePosition({
    id: "parent-pos",
    title: "Lead Producer",
    career: "events",
    startDate: "2023-06",
    employerName: "Lumenfield Productions",
  });
}

describe("EventDetail", () => {
  it("renders all required and present optional fields", () => {
    const event = makeEvent({
      position: parentPosition(),
      id: "ev1",
      name: "Harborlights Festival",
      date: "2024-07-13",
      role: "Producer of Record",
      client: "Harborlights Foundation",
      venue: "Brooklyn Bridge Park",
      attendance: 14000,
      summary: "Two-stage outdoor festival.",
      highlights: ["Hit load-in window with zero overage"],
      skills: [makeSkill("av-systems", "AV systems")],
    });

    render(<EventDetail event={event} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Harborlights Festival");
    expect(screen.getByText(/Two-stage outdoor festival/)).toBeInTheDocument();

    const details = screen.getByRole("region", { name: /details/i });
    expect(within(details).getByText("July 13, 2024")).toBeInTheDocument();
    expect(within(details).getByText("Producer of Record")).toBeInTheDocument();
    expect(within(details).getByText("Harborlights Foundation")).toBeInTheDocument();
    expect(within(details).getByText("Brooklyn Bridge Park")).toBeInTheDocument();
    expect(within(details).getByText("14,000")).toBeInTheDocument();

    expect(screen.getByText("Hit load-in window with zero overage")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "AV systems" })).toHaveAttribute(
      "href",
      "/skills/av-systems",
    );
  });

  it("omits absent optional fields gracefully (US-2)", () => {
    const event = makeEvent({
      position: parentPosition(),
      id: "ev2",
      name: "Quiet Event",
      date: "2024-05-01",
      role: "Coordinator",
      summary: "Minimal data.",
    });
    render(<EventDetail event={event} />);
    const details = screen.getByRole("region", { name: /details/i });
    expect(within(details).queryByText(/Client/i)).toBeNull();
    expect(within(details).queryByText(/Venue/i)).toBeNull();
    expect(within(details).queryByText(/Attendance/i)).toBeNull();
    expect(within(details).getByText("Coordinator")).toBeInTheDocument();
  });

  it("includes a visible back-link to the parent position (US-3)", () => {
    const event = makeEvent({
      position: parentPosition(),
      id: "ev3",
      name: "X",
      date: "2024-01-01",
      role: "Producer",
    });
    render(<EventDetail event={event} />);
    const back = screen.getByRole("link", { name: /Lead Producer/ });
    expect(back).toHaveAttribute("href", "/position/parent-pos");
  });
});
