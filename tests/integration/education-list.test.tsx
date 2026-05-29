import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Education } from "@/content/types";
import { EducationList } from "@/components/education/EducationList";

afterEach(() => cleanup());

const SAMPLE: Education[] = [
  {
    id: "bs-cs",
    institution: "State University",
    credential: "B.S. Computer Science",
    field: "Computer Science",
    startDate: "2013-09",
    endDate: "2017-05",
    highlights: ["Senior thesis on streaming joins"],
  },
  {
    id: "current-cert",
    institution: "Online Institute",
    credential: "Certificate, Stage Design",
    startDate: "2025-01",
  },
];

describe("EducationList", () => {
  it("renders entries sorted with current (no-endDate) entries first", () => {
    render(<EducationList entries={SAMPLE} />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["Certificate, Stage Design", "B.S. Computer Science"]);
  });

  it("renders 'Present' for an entry with no endDate", () => {
    render(<EducationList entries={SAMPLE} />);
    const items = screen.getAllByRole("listitem");
    expect(within(items[0]!).getByText(/Jan 2025 – Present/)).toBeInTheDocument();
  });

  it("renders a date range for a completed entry", () => {
    render(<EducationList entries={SAMPLE} />);
    const items = screen.getAllByRole("listitem");
    expect(within(items[1]!).getByText(/Sep 2013 – May 2017/)).toBeInTheDocument();
  });

  it("renders the institution and optional field with a separator", () => {
    render(<EducationList entries={SAMPLE} />);
    const items = screen.getAllByRole("listitem");
    expect(within(items[1]!).getByText(/State University/)).toBeInTheDocument();
    expect(within(items[1]!).getByText(/· Computer Science/)).toBeInTheDocument();
  });

  it("renders highlights when present", () => {
    render(<EducationList entries={SAMPLE} />);
    expect(screen.getByText("Senior thesis on streaming joins")).toBeInTheDocument();
  });

  it("renders an entry without dates and without a date range (FEAT-004 §5)", () => {
    render(<EducationList entries={[{ id: "no-dates", institution: "U", credential: "Cert" }]} />);
    const item = screen.getByRole("listitem");
    expect(within(item).getByText("Cert")).toBeInTheDocument();
    expect(within(item).queryByText(/Present|–/)).toBeNull();
    expect(within(item).queryByRole("time")).toBeNull();
  });

  it("renders a friendly empty state when there are no entries", () => {
    render(<EducationList entries={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent(/no education entries yet/i);
  });
});
