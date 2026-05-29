# Feature Spec — Dark Mode (auto-only, v1)

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Feature ID       | FEAT-010                                             |
| Status           | Approved                                             |
| Owner            | Site owner                                           |
| Last updated     | 2026-05-29                                           |
| Related PRD goal | Match visitor system preferences; modern visual feel |
| Related ADRs     | —                                                    |

## 1. Summary

Automatic dark / light mode via the `prefers-color-scheme` media query — no
toggle, no persistence, no JavaScript. Every on-screen surface gets a
dark-mode treatment. Print routes stay light regardless of system theme so
the PDFs remain readable on paper.

The toggle (with `localStorage` persistence) is intentionally deferred. The
auto-only path keeps the project's "zero `'use client'` components" property
from ADR-0004 intact.

## 2. Scope

- **In scope**
  - Tailwind v4 dark mode configured to use the `media` strategy
    (`prefers-color-scheme: dark`), not the `class` strategy.
  - Every component that uses light-mode color utilities (`bg-white`,
    `text-neutral-900`, border / hover / status colors, etc.) gets a
    matching `dark:` variant.
  - Print routes (`/print`, `/print/*`) and the print-only advisory remain
    light, achieved by scoping the print CSS to override dark colors
    inside `@media print`.
  - Accessibility: WCAG 2.1 AA contrast preserved in both themes.
- **Out of scope**
  - Manual toggle. Adding one in v2 will need a `'use client'` boundary
    plus `localStorage` persistence and a small ADR superseding ADR-0004's
    "no client components" consequence.
  - Per-track accent color tweaks for dark mode beyond what the existing
    `TrackBadge` style needs.

## 3. User stories

| ID   | Story                                                                                                  | Priority |
| ---- | ------------------------------------------------------------------------------------------------------ | -------- |
| US-1 | As a visitor whose OS is set to dark mode, I want the site to load in dark mode automatically.         | Must     |
| US-2 | As a visitor whose OS is set to light mode, I want the site to load in light mode (existing behavior). | Must     |
| US-3 | As anyone printing the resume, I want the output to stay light regardless of system theme.             | Must     |
| US-4 | As any visitor, I want both themes to meet WCAG AA contrast on all text and interactive states.        | Must     |

## 4. Acceptance criteria

### US-1 / US-2

- **Given** the OS preference is dark, **then** the root `<html>` element
  picks up dark styling automatically (Tailwind's `media` strategy).
- **Given** the OS preference is light, **then** the rendering matches the
  current v1 output (no visual regression on light).

### US-3

- **Given** any print route or any non-print route under `@media print`,
  **then** colors are forced to a light treatment (white background, black
  text) — confirmed by the existing print stylesheet rules in
  `src/styles/print.css`, extended if needed.

### US-4

- **Given** dark mode, **then** every text/background combination meets the
  WCAG AA contrast minimum (4.5:1 body, 3:1 large text and UI components).
  Validated manually using DevTools' contrast inspector on the home,
  career, skills, education, and detail pages.

## 5. Edge cases & error handling

| Scenario                                                    | Expected behavior                                                                                                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visitor toggles OS theme while the page is open             | The page repaints in the new theme automatically — `prefers-color-scheme` media-query reactivity. No reload required.                                           |
| Browser doesn't support `prefers-color-scheme` (very old)   | Falls back to light. Acceptable for v1.                                                                                                                         |
| A component is added later but missing its `dark:` variants | Visual regression on dark only. No build-time enforcement; surfaced by manual review and (optionally) the visual regression item in roadmap **D**.              |
| Career-track color cues become indistinguishable in dark    | `TrackBadge` already uses non-color affordances (initial monogram) per ADR-style "don't rely on color alone." Re-verify contrast for both badge color palettes. |

## 6. Data changes

None.

## 7. Interface changes

- `src/styles/globals.css` extended with the Tailwind v4 dark-mode
  configuration. Exact syntax: `@theme` block + a `@custom-variant dark
(@media (prefers-color-scheme: dark))` declaration so existing
  `dark:` utility classes resolve via the media query.
- Component files across `src/components/**` and `src/app/**` gain `dark:`
  variants on color utilities. No new components, no new props.

## 8. Dependencies

- Tailwind v4 (already in use).
- No new runtime deps.

## 9. Test plan

- **Integration**: jsdom tests are not color-aware, so no useful coverage
  here.
- **Playwright**:
  - Set `colorScheme: 'dark'` on the browser context and visit `/`, then
    `/career/software`, then `/skills`, and capture a screenshot of each.
    First-run captures form the baseline; subsequent runs assert no
    pixel-level regression beyond a small threshold.
  - One assertion under `page.emulateMedia({ media: "print",
colorScheme: "dark" })` on `/print/software` confirming the print
    output is still light-themed.
- **Manual contrast check** on every page once before launch. Capture
  results in the PR description.

## 10. Rollout & observability

Manual cross-browser smoke (Chrome, Firefox, Safari) on launch. No runtime
telemetry.

## 11. Open questions

- **Toggle in v2?** Not in v1 scope, but document the deferred path:
  client component + `localStorage` + class strategy. Worth a fresh ADR if
  pursued, since it intersects ADR-0004's hydration / TBT discussion. —
  deferred.
- **Specific dark-mode accent palette.** Off-white-on-near-black is the
  baseline; whether to use `neutral-950` (very dark) or `neutral-900`
  (slightly softer) for the background, and whether links pick up a
  brighter accent — owner aesthetic call. — assumed `neutral-950` base,
  `neutral-100` body text, neutral-200 borders. Adjustable.
