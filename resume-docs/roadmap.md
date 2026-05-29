# Roadmap

| Field        | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Status       | Active                                                                       |
| Last updated | 2026-05-29 (A4 + A5 complete)                                                |
| Successor to | [dod-reports/dod-report-2026-05-28.md](dod-reports/dod-report-2026-05-28.md) |

## Context

The initial build (Steps 0–7) and the DoD pass closed every item that an
agent could close. This file enumerates everything still to do, organized
by lifecycle phase relative to v1's public release. Items are pulled from
[tooling-notes.md](tooling-notes.md) (where the historical context lives)
and grouped here by phase.

Conventions:

- Two active phases: **Phase A** is v1 launch scope; **Phase B** is the
  parking lot for everything currently outside that scope.
- Each item carries a status (`Pending`, `Approved — ready to build`,
  `Open for owner feedback`, `Not pursued for v1`, `Not on the path`,
  `Parked`).
- As an item ships, move it to the "Completed" table at the end with a
  `Resolved` date. Do not delete rows.
- An item can be promoted from Phase B to Phase A by the owner at any
  time — move the row and renumber as `A<next>`.
- Items that turn into architectural decisions get an ADR. Items that turn
  into new features get a feature spec under `features/`.

## Phase A — v1 launch scope

Everything that should ship before the site is linked publicly. The original
release-blocker (A1) plus the accepted pre-release feature additions from
the 2026-05-29 scoping pass.

### A1. Replace placeholder content with the owner's real history

| Field      | Value                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Pending (paused per owner)                                                                                                                                                                                                         |
| Owner      | Site owner                                                                                                                                                                                                                         |
| Source     | [tooling-notes §4](tooling-notes.md)                                                                                                                                                                                               |
| Acceptance | `/content/*.json` reflects the actual owner across all six entity files. `pnpm build` succeeds (the loader catches any schema or reference issues at this step).                                                                   |
| Notes      | Largest content-shape risk; doing this first means subsequent fixes are checked against real data. If a position genuinely spans two tracks, model it as two overlapping positions per [ADR-0003](adr/ADR-0003-career-tagging.md). |

### A6. Now page (FEAT-009)

| Field      | Value                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Approved — ready to build                                                                                                                               |
| Owner      | Site builder                                                                                                                                            |
| Spec       | [features/now-page.md](features/now-page.md)                                                                                                            |
| Acceptance | Per FEAT-009 §4 — `/now` shows owner-curated current focus plus a machine-readable `<time>` last-updated stamp. Sourced from `content/now.json`.        |
| Notes      | New `Now` entity (additive). Surfaced via footer link only in v1 (not in primary nav). Plain text body to start; Markdown can come later if owner asks. |

### A7. Dark mode — auto-only (FEAT-010)

| Field      | Value                                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Approved — ready to build                                                                                                                                                                                                                                              |
| Owner      | Site builder                                                                                                                                                                                                                                                           |
| Spec       | [features/dark-mode.md](features/dark-mode.md)                                                                                                                                                                                                                         |
| Acceptance | Per FEAT-010 §4 — Auto-mode via `prefers-color-scheme`. Every component has `dark:` variants. Print routes stay light. WCAG AA contrast preserved in both themes.                                                                                                      |
| Notes      | No toggle in v1; auto-only keeps the "zero `'use client'`" property from ADR-0004 intact. Adding a toggle in v2 would warrant a fresh ADR. Materially expands the visual-regression surface — Playwright dark-mode snapshots would catch future drift (see B16 below). |

### A8. Education coursework (FEAT-011)

| Field      | Value                                                                                                                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Approved, conditional on **A1** (real coursework data shapes the field set)                                                                                                                                                                                                              |
| Owner      | Site owner → site builder                                                                                                                                                                                                                                                                |
| Spec       | [features/education-coursework.md](features/education-coursework.md)                                                                                                                                                                                                                     |
| Acceptance | Per FEAT-011 §4 — New `Coursework` entity with `educationId` FK, surfaced under `/education` and a new `/education/[id]` route, and indexed in `skillUsage`.                                                                                                                             |
| Notes      | New entity → loader / schema / content-schema / Domain Model changes. No ADR required if Coursework stays off the unified timeline; if it joins the timeline, FEAT-001 changes and an ADR is needed. Defer specific field tuning (grades, credit hours) until A1 surfaces real examples. |

## Phase B — Considered / parking lot

Everything currently outside the v1 launch scope. This phase intentionally
collapses what was previously three separate phases (post-v1 polish,
strategic investments, and brainstorm leftovers) into a single list so
"not in Phase A" has one home. Items vary widely in how close they are to
being picked up — read the `Status` field on each row before assuming.

The first three items (B1–B3) carry the full planning detail because they
represent specific deliberation; B4–B16 are brainstorm captures with a
one-line "why parked" rationale and can be expanded into full rows when
they're considered seriously.

### B1. Print layout refinements

| Field      | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Open for owner feedback                                                                                                                                                                                                                                                                                                               |
| Owner      | Site owner → site builder                                                                                                                                                                                                                                                                                                             |
| Source     | Owner notes after manual print check (2026-05-28)                                                                                                                                                                                                                                                                                     |
| Acceptance | Defined per change request. Likely touches `src/styles/print.css` and `src/components/print/Print*.tsx`. Per-variant page caps from [features/print-views.md §4](features/print-views.md) must still hold (events ≤ 2, software ≤ 3, unified ≤ 3).                                                                                    |
| Notes      | Manual print-to-PDF check on 2026-05-28 confirmed v1 prints look great with placeholder content. Owner expressed interest in possibly shifting the format later; this slot collects specific change requests as they arise. Spec's "top categories only" trim for very long skills lists also lives here if it ever becomes relevant. |

### B2. Enable Next.js Partial Prerendering (PPR) for mobile perf

| Field      | Value                                                                                                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | **Not pursued for v1** (per [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md)). Re-open by superseding ADR-0004.                                                                                                                                                                                                 |
| Owner      | Site builder                                                                                                                                                                                                                                                                                                      |
| Source     | [tooling-notes §7](tooling-notes.md), [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md)                                                                                                                                                                                                                          |
| Acceptance | Mobile Lighthouse Performance on `/` and `/skills` ≥ 95. Build still produces a static-deployable export. New ADR added documenting the migration and superseding the relevant part of [ADR-0001](adr/ADR-0001-tech-stack.md) if anything beyond a config flag changed.                                           |
| Notes      | Trigger condition (A3 picking path b) did not fire — A3 chose path (a) on 2026-05-29. Kept here in case a future ADR supersedes ADR-0004. PPR is still experimental in Next 15; the static-export constraint (`output: 'export'`) is incompatible with PPR's streaming model, which would force a hosting change. |

### B3. Framework swap to Astro

| Field      | Value                                                                                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Not on the path                                                                                                                                                                                                                                                                                                        |
| Owner      | Site builder                                                                                                                                                                                                                                                                                                           |
| Source     | [tooling-notes §7](tooling-notes.md), [ADR-0001](adr/ADR-0001-tech-stack.md)                                                                                                                                                                                                                                           |
| Acceptance | Site rewritten in Astro; all six features preserved; all e2e + integration tests ported; Lighthouse mobile ≥ 95 on every main route. New ADR supersedes [ADR-0001](adr/ADR-0001-tech-stack.md).                                                                                                                        |
| Notes      | Probably overkill for a single-owner resume. Listed for completeness as the "nuclear option" if mobile performance becomes a critical product requirement and PPR (B2) isn't enough. Materially changes the developer experience and the file layout in [05_ENGINEERING_STANDARDS.md §2](05_ENGINEERING_STANDARDS.md). |

### B4. Hamburger menu for primary nav

| Field      | Value                                                                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                                                                                                                    |
| Why parked | Current `flex-wrap` PrimaryNav already wraps on narrow widths. Adopting a hamburger would add the project's first `'use client'` boundary (focus trap, `aria-expanded`, escape key, scroll lock). Real mobile observation should drive this — not theory. |

### B5. Print page numbers + footer

| Field      | Value                                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                                            |
| Why parked | `@page` CSS rules for "Page X of Y" and a small owner-name footer in print output. Owner accepted v1 print as-is on 2026-05-28; revisit if printed copies become a common output. |

### B6. Position next/previous within track

| Field      | Value                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                            |
| Why parked | "← Previous · Next →" nav at the bottom of `/position/[id]`. Quality-of-life on long careers. Modest value until the real history (A1) is larger. |

### B7. "Currently" pill on open positions

| Field      | Value                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                              |
| Why parked | Implicit today via the "Present" end date. A small green badge would make it scan faster but isn't required for v1. |

### B8. Cross-track employer indicator

| Field      | Value                                                                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked (same as FEAT-002 §11 open question)                                                                                                                                                                     |
| Why parked | "→ see this employer's events work" link when an employer hosts positions on both tracks. Useful when narrative is "same company, both hats." Unblock when the real history (A1) actually has such an employer. |

### B9. Embedded media on event details

| Field      | Value                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status     | Parked (same as FEAT-006 §11 deferred)                                                                                                                                               |
| Why parked | Photo grid / Vimeo embed on `/event/[id]`. Events benefit visually more than software roles. Schema change + media-hosting decision. Worth doing once real events have media assets. |

### B10. Testimonials / references

| Field      | Value                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                          |
| Why parked | New `Testimonial` entity attached to positions. Strong trust signal, especially for events. Needs ADR (new entity changes the graph) and real quote collection. |

### B11. Pre-rendered PDF downloads

| Field      | Value                                                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked (would supersede a PRD non-goal — needs ADR)                                                                                                                                                                                                               |
| Why parked | `/resume-software.pdf`, `/resume-events.pdf`, `/resume.pdf` as static files, regenerated at build via Puppeteer. Smoother for visitors than "press Cmd+P." Conflicts with FEAT-005's "no server-side PDF" scope-out and PRD §3 "no PDF generation"; needs an ADR. |

### B12. Calendly / scheduling embed

| Field      | Value                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked — partially absorbed                                                                                                                                                     |
| Why parked | The contact page (FEAT-008) already accepts an optional `bookingUrl` and renders it as a button. An embedded scheduling iframe is a separate, heavier follow-up if ever needed. |

### B13. Timeline search / filter

| Field      | Value                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status     | Parked                                                                                                                                                                                     |
| Why parked | Free-text search across positions/projects/events. PRD §3 non-goal'd this for the skills page, but didn't speak to the timeline. Useful only once the real history grows past ~10 entries. |

### B14. GitHub Actions CI

| Field      | Value                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                                                                            |
| Why parked | Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm format:check`, `pnpm build` on push, and `pnpm test:e2e` in a separate workflow. Closes the "broken commit makes it to main" gap. Recommended after launch. |

### B15. Lighthouse CI

| Field      | Value                                                                                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                                                                                                          |
| Why parked | Now that [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md) has explicit per-category floors, automating the check would catch regressions to the agreed floor. Run against the static export, no live deploy needed. Logical follow-up to B14. |

### B16. Visual regression snapshots

| Field      | Value                                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Parked                                                                                                                                                                           |
| Why parked | Playwright `toHaveScreenshot` baselines for the home, both careers, skills, education, and each print variant. Especially valuable once dark mode (A7) doubles the surface area. |

## Completed

For posterity. Each entry links back to the original work.

| Item                                                | Resolved   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A5 — Contact page (FEAT-008)                        | 2026-05-29 | New `/contact` route under the `(site)` route group. Page surfaces a primary mailto button for `site.contactEmail`, a "Book a call" link for the optional `site.bookingUrl` (added to schema in same change), and a list of social links with `target="_blank" rel="noopener noreferrer"`. `PrimaryNav` extended to four pills (Skills · Education · **Contact** · Print) with `aria-current="page"` on the active pill. Explicitly respects [01_PRD.md §3](01_PRD.md) non-goal — no form, no backend. Adds 2 schema tests + 5 ContactPage integration tests + 3 new Playwright tests in the `contact page (FEAT-008)` block (plus updates to the existing primary-nav tests to assert the 4-pill set). 129 vitest + 37 Playwright total.                                                                            |
| A4 — Site polish & shareability (FEAT-007)          | 2026-05-29 | All six FEAT-007 sub-items shipped together: per-route OG/Twitter Card meta with `title.template`, inline JSON-LD `Person` on `/`, `app/sitemap.ts` + `app/robots.ts` (both `dynamic = "force-static"` for the static export), favicon + apple-icon + web manifest generated at build via `next/og` `ImageResponse` driven by the owner's initials, custom `app/not-found.tsx`, and `SiteFooter` with auto-derived `© 2026[–YYYY]` years from the latest git commit timestamp (with current-date fallback). Two additive optional `Site` fields (`siteUrl`, `repoUrl`). Non-print routes restructured into a `src/app/(site)/` route group so the new `SiteFooter` only renders there. 17 new tests (3 unit + 4 integration + 7 Playwright in the `site polish (FEAT-007)` block); 122 vitest + 33 Playwright total. |
| B2 — Migrate `pnpm lint` to the ESLint CLI          | 2026-05-29 | `pnpm lint` now runs `eslint .` directly; the `next lint` deprecation banner is gone. Ran Next's `next-lint-to-eslint-cli` codemod, then hand-fixed two of its mistakes: (a) the codemod's bare-specifier imports of `eslint-config-next/core-web-vitals` don't resolve under ESM (no `exports` field in the package; needs the `.js` extension), and (b) `eslint-config-next` v15 still ships **legacy** config objects, not flat-config arrays, so `FlatCompat` is still required — re-added `@eslint/eslintrc` to devDeps. Also expanded ESLint ignores to include `next-env.d.ts` (auto-generated by Next), `playwright-report/`, and `test-results/`. 105 vitest + 22 Playwright still green; typecheck and Prettier clean.                                                                                     |
| A3 — Lighthouse mobile performance gap              | 2026-05-29 | Accepted via [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md). PRD §5 metric row relaxed to a per-category, per-platform table (Performance ≥ 75 mobile / ≥ 90 desktop; the other three categories ≥ 95 on both). Architecture decision log updated. **B2** (PPR; formerly Phase C1) marked "Not pursued for v1" since its trigger condition no longer applies. Reversible by superseding ADR-0004.                                                                                                                                                                                                                                                                                                                                                                                                                |
| A2 — Primary navigation in the site header          | 2026-05-29 | New `PrimaryNav` component renders `Skills` / `Education` / `Print` pills in the sticky site header; `aria-current="page"` on the active page. `/skills`, `/skills/[id]`, and `/education` pass `activeNav`. **Refinement (same day):** `CareerSwitcher` (All / Software / Events) moved out of the header and re-homed directly above the `Timeline` on `/` and `/career/[id]` — it's contextual to the timeline view, so it's absent on skills, education, and detail routes. SiteHeader props simplified to `{ site, activeNav }`. Tests in `tests/e2e/smoke.spec.ts` extended to 26: 4 cover the primary nav, 4 cover switcher placement (presence, active state, absence on detail/skills/education, navigation).                                                                                               |
| Manual print check (Chrome + Firefox × Letter + A4) | 2026-05-28 | Owner confirmed v1 print output looks great with placeholder content. Per-variant page caps held. Future formatting adjustments tracked under **B1**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Playwright smoke tests                              | 2026-05-28 | 22 tests (was 18 at DoD pass; +4 for the A2 nav) covering every static route + 404 + print-media behavior + navigation flow. Lives in `tests/e2e/smoke.spec.ts`. Originally deferred per [tooling-notes §6](tooling-notes.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `confidentialLabel` field added to Project schema   | 2026-05-28 | Additive optional field, reconciled across [schemas.ts](../src/content/schemas.ts), [content-schema.json](content-schema.json), and [03_DOMAIN_MODEL.md](03_DOMAIN_MODEL.md) during Step 4.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Corepack signing-key workaround                     | 2026-05-28 | Removed broken corepack shims and installed pnpm 9 via `npm install -g pnpm@9`. See [tooling-notes §2](tooling-notes.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
