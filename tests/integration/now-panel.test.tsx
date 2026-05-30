import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NowPanel } from "@/components/now/NowPanel";
import type { Now } from "@/content/types";

afterEach(() => cleanup());

const baseNow: Now = {
  lastUpdated: "2026-05-29",
  body: "Working on the resume site.",
};

describe("NowPanel (FEAT-009)", () => {
  it("renders the Now heading", () => {
    render(<NowPanel now={baseNow} />);
    expect(screen.getByRole("heading", { level: 1, name: "Now" })).toBeInTheDocument();
  });

  it("renders a machine-readable <time> with the lastUpdated value (US-3)", () => {
    const { container } = render(<NowPanel now={baseNow} />);
    const time = container.querySelector("time");
    expect(time).not.toBeNull();
    expect(time?.getAttribute("datetime")).toBe("2026-05-29");
  });

  it("renders the lastUpdated date in a human-readable format (US-1)", () => {
    const { container } = render(<NowPanel now={baseNow} />);
    expect(container.querySelector("time")?.textContent).toBe("May 29, 2026");
  });

  it("renders the body text (US-1)", () => {
    render(<NowPanel now={baseNow} />);
    expect(screen.getByText("Working on the resume site.")).toBeInTheDocument();
  });

  it("splits the body into paragraphs on blank-line boundaries", () => {
    render(<NowPanel now={{ ...baseNow, body: "First paragraph.\n\nSecond paragraph." }} />);
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders bullets as a list when provided", () => {
    render(
      <NowPanel now={{ ...baseNow, bullets: ["First bullet", "Second bullet", "Third bullet"] }} />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      "First bullet",
      "Second bullet",
      "Third bullet",
    ]);
  });

  it("omits the bullets section entirely when no bullets are provided", () => {
    render(<NowPanel now={baseNow} />);
    expect(screen.queryByRole("region", { name: /Currently/i })).toBeNull();
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("includes a link to the /now page convention with target=_blank", () => {
    render(<NowPanel now={baseNow} />);
    const link = screen.getByRole("link", { name: /\/now page/ });
    expect(link).toHaveAttribute("href", "https://nownownow.com/about");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders exactly one <time> element at the top (US-3)", () => {
    const { container } = render(<NowPanel now={baseNow} />);
    expect(container.querySelectorAll("time")).toHaveLength(1);
  });
});
