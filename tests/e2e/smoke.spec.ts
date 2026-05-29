import { test, expect, type Page } from "@playwright/test";

const routes = [
  { path: "/", h1: /Alex Rivera/ },
  { path: "/career/software", h1: /Software Engineering/ },
  { path: "/career/events", h1: /Event Production/ },
  { path: "/skills", h1: /^Skills$/ },
  { path: "/skills/typescript", h1: /TypeScript/ },
  { path: "/position/aurora-senior-engineer", h1: /Senior Software Engineer/ },
  { path: "/project/ingest-rewrite", h1: /Ingest Rewrite/ },
  { path: "/event/harborlights-festival-2024", h1: /Harborlights/ },
  { path: "/education", h1: /^Education$/ },
  // Print routes share an owner-name h1; the variant label is checked via body text below.
  { path: "/print", h1: /Alex Rivera/, body: /Experience/ },
  { path: "/print/software", h1: /Alex Rivera/, body: /Software Engineering/ },
  { path: "/print/events", h1: /Alex Rivera/, body: /Event Production/ },
] as const;

async function attachConsoleAssertion(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  return errors;
}

for (const route of routes) {
  test(`route ${route.path} renders without errors`, async ({ page }) => {
    const errors = await attachConsoleAssertion(page);
    const response = await page.goto(route.path);
    expect(response?.status(), `status for ${route.path}`).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(route.h1);
    if ("body" in route && route.body) {
      await expect(page.locator("body")).toContainText(route.body);
    }
    expect(errors, `runtime errors on ${route.path}`).toEqual([]);
  });
}

test("404 page renders for an unknown route", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  // Static export serves the 404 page as 200 in some configs; we just check the body.
  expect(response?.status()).toBeLessThan(500);
  await expect(page.locator("body")).toContainText(/404|not.found/i);
});

test.describe("print media", () => {
  for (const variant of ["/print", "/print/software", "/print/events"] as const) {
    test(`${variant} renders under print media without console errors`, async ({ page }) => {
      const errors = await attachConsoleAssertion(page);
      await page.goto(variant);
      await page.emulateMedia({ media: "print" });
      // Sticky site header (data-print="hide") is not on print routes — the page should still render.
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      // Print instructions banner has data-print="hide", so it should be hidden in print emulation.
      const banner = page.getByText(/Press.*to print/);
      await expect(banner).toBeHidden();
      expect(errors, `runtime errors on ${variant}`).toEqual([]);
    });
  }

  test("non-print route shows the print-only advisory under print media", async ({ page }) => {
    await page.goto("/");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByText(/For a paginated resume, visit \/print/)).toBeVisible();
  });
});

test("can navigate timeline → position → skill → back", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href*="aurora-senior-engineer"]').first().click();
  await expect(page).toHaveURL(/\/position\/aurora-senior-engineer/);
  await page.locator('a[href*="/skills/typescript"]').first().click();
  await expect(page).toHaveURL(/\/skills\/typescript/);
  await page.locator('a[href*="aurora-senior-engineer"]').first().click();
  await expect(page).toHaveURL(/\/position\/aurora-senior-engineer/);
});

test.describe("primary nav", () => {
  test("home exposes Skills / Education / Print pills that navigate correctly", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary pages" });
    await expect(nav.getByRole("link", { name: "Skills" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Education" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Print" })).toBeVisible();

    await nav.getByRole("link", { name: "Skills" }).click();
    await expect(page).toHaveURL(/\/skills\/?$/);
    await page.goBack();
    await nav.getByRole("link", { name: "Education" }).click();
    await expect(page).toHaveURL(/\/education\/?$/);
    await page.goBack();
    await nav.getByRole("link", { name: "Print" }).click();
    await expect(page).toHaveURL(/\/print\/?$/);
  });

  test("active page is marked with aria-current on the matching pill", async ({ page }) => {
    await page.goto("/skills");
    const nav = page.getByRole("navigation", { name: "Primary pages" });
    await expect(nav.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Education" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.goto("/education");
    await expect(
      page
        .getByRole("navigation", { name: "Primary pages" })
        .getByRole("link", { name: "Education" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("skill detail page keeps the Skills pill active", async ({ page }) => {
    await page.goto("/skills/typescript");
    const nav = page.getByRole("navigation", { name: "Primary pages" });
    await expect(nav.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "page");
  });

  test("home and career pages do not mark any primary pill as active", async ({ page }) => {
    for (const path of ["/", "/career/software", "/career/events"]) {
      await page.goto(path);
      const nav = page.getByRole("navigation", { name: "Primary pages" });
      await expect(nav.getByRole("link", { name: "Skills" })).not.toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(nav.getByRole("link", { name: "Education" })).not.toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(nav.getByRole("link", { name: "Print" })).not.toHaveAttribute(
        "aria-current",
        "page",
      );
    }
  });
});

test.describe("career switcher placement", () => {
  test("renders above the timeline on the home route", async ({ page }) => {
    await page.goto("/");
    const switcher = page.getByRole("navigation", { name: "Career view" });
    await expect(switcher).toBeVisible();
    await expect(switcher.getByRole("link", { name: "All" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("renders above the timeline on /career/[id] with the matching pill active", async ({
    page,
  }) => {
    await page.goto("/career/software");
    const switcher = page.getByRole("navigation", { name: "Career view" });
    await expect(switcher).toBeVisible();
    await expect(switcher.getByRole("link", { name: "Software Engineering" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(switcher.getByRole("link", { name: "All" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("is absent from skills, education, and detail routes", async ({ page }) => {
    for (const path of [
      "/skills",
      "/skills/typescript",
      "/education",
      "/position/aurora-senior-engineer",
      "/project/ingest-rewrite",
      "/event/harborlights-festival-2024",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("navigation", { name: "Career view" })).toHaveCount(0);
    }
  });

  test("clicking a switcher pill navigates to the matching timeline view", async ({ page }) => {
    await page.goto("/");
    const switcher = page.getByRole("navigation", { name: "Career view" });
    await switcher.getByRole("link", { name: "Software Engineering" }).click();
    await expect(page).toHaveURL(/\/career\/software\/?$/);
    await page
      .getByRole("navigation", { name: "Career view" })
      .getByRole("link", { name: "All" })
      .click();
    await expect(page).toHaveURL(/\/?$/);
  });
});
