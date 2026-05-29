import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/footer", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/footer")>();
  return { ...real, BUILD_TIMESTAMP_ISO: "2027-08-15T10:00:00Z" };
});

import { SiteFooter } from "@/components/shared/SiteFooter";
import type { Site } from "@/content/types";

afterEach(() => cleanup());

const baseSite: Site = {
  ownerName: "Alex Rivera",
  tagline: "Engineer and producer.",
  contactEmail: "alex@example.com",
  careers: [{ id: "software", label: "Software Engineering", order: 0 }],
};

describe("SiteFooter", () => {
  it("renders the owner name and a year range when the build year is newer than 2026", () => {
    render(<SiteFooter site={baseSite} />);
    expect(screen.getByText(/© 2026–2027 Alex Rivera/)).toBeInTheDocument();
  });

  it("renders a machine-readable Updated date", () => {
    render(<SiteFooter site={baseSite} />);
    const time = screen.getByText("2027-08-15");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2027-08-15");
  });

  it("renders the View source link only when site.repoUrl is set", () => {
    const { rerender } = render(<SiteFooter site={baseSite} />);
    expect(screen.queryByRole("link", { name: /view source/i })).toBeNull();

    rerender(<SiteFooter site={{ ...baseSite, repoUrl: "https://github.com/example/repo" }} />);
    const link = screen.getByRole("link", { name: /view source/i });
    expect(link).toHaveAttribute("href", "https://github.com/example/repo");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("has data-print=hide so it's suppressed in print output", () => {
    const { container } = render(<SiteFooter site={baseSite} />);
    expect(container.querySelector("footer")).toHaveAttribute("data-print", "hide");
  });
});
