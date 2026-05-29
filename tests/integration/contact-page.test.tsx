import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ContactPage } from "@/components/contact/ContactPage";
import type { Site } from "@/content/types";

afterEach(() => cleanup());

const baseSite: Site = {
  ownerName: "Alex Rivera",
  tagline: "Engineer and producer.",
  contactEmail: "alex@example.com",
  careers: [{ id: "software", label: "Software Engineering", order: 0 }],
};

describe("ContactPage", () => {
  it("renders a mailto link as the primary email affordance (US-1)", () => {
    render(<ContactPage site={baseSite} />);
    const link = screen.getByRole("link", { name: "alex@example.com" });
    expect(link).toHaveAttribute("href", "mailto:alex@example.com");
  });

  it("renders the Book a call button only when bookingUrl is set (US-3)", () => {
    const { rerender } = render(<ContactPage site={baseSite} />);
    expect(screen.queryByRole("region", { name: /Book a call/i })).toBeNull();

    rerender(<ContactPage site={{ ...baseSite, bookingUrl: "https://cal.com/alex/intro" }} />);
    const region = screen.getByRole("region", { name: /Book a call/i });
    const link = screen.getByRole("link", { name: /Book a time on .* calendar/ });
    expect(region).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://cal.com/alex/intro");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders social links with noopener noreferrer + target=_blank (US-2)", () => {
    render(
      <ContactPage
        site={{
          ...baseSite,
          socialLinks: [
            { label: "GitHub", url: "https://github.com/alex" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/alex" },
          ],
        }}
      />,
    );
    const gh = screen.getByRole("link", { name: "GitHub" });
    expect(gh).toHaveAttribute("href", "https://github.com/alex");
    expect(gh).toHaveAttribute("target", "_blank");
    expect(gh).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
  });

  it("omits the Elsewhere section entirely when there are no socialLinks", () => {
    render(<ContactPage site={baseSite} />);
    expect(screen.queryByRole("region", { name: /Elsewhere/i })).toBeNull();
  });

  it("renders all three sections when every optional field is populated", () => {
    render(
      <ContactPage
        site={{
          ...baseSite,
          bookingUrl: "https://cal.com/alex/intro",
          socialLinks: [{ label: "GitHub", url: "https://github.com/alex" }],
        }}
      />,
    );
    expect(screen.getByRole("region", { name: /^Email$/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Book a call/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Elsewhere/i })).toBeInTheDocument();
  });
});
