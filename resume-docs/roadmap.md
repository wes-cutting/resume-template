# Roadmap

| Field        | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Status       | Active                                                                       |
| Last updated | 2026-05-29 (A2 + A3 + B2 complete)                                           |
| Successor to | [dod-reports/dod-report-2026-05-28.md](dod-reports/dod-report-2026-05-28.md) |

## Context

The initial build (Steps 0–7) and the DoD pass closed every item that an
agent could close. This file enumerates everything still to do, organized
by lifecycle phase relative to v1's public release. Items are pulled from
[tooling-notes.md](tooling-notes.md) (where the historical context lives)
and grouped here by phase.

Conventions:

- Each item carries a status (`Pending`, `Pending decision`, `Open for
feedback`, `Deferred`, `Not on the path`).
- As an item ships, move it to the "Completed" table at the end with a
  `Resolved` date. Do not delete rows.
- Items that turn into architectural decisions get an ADR. Items that turn
  into new features get a feature spec under `features/`.

## Phase A — Pre-publish (blocks public release)

These must be addressed before the site can be linked publicly at its
custom domain.

### A1. Replace placeholder content with the owner's real history

| Field      | Value                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Pending                                                                                                                                                                                                                            |
| Owner      | Site owner                                                                                                                                                                                                                         |
| Source     | [tooling-notes §4](tooling-notes.md)                                                                                                                                                                                               |
| Acceptance | `/content/*.json` reflects the actual owner across all six entity files. `pnpm build` succeeds (the loader catches any schema or reference issues at this step).                                                                   |
| Notes      | Largest content-shape risk; doing this first means subsequent fixes are checked against real data. If a position genuinely spans two tracks, model it as two overlapping positions per [ADR-0003](adr/ADR-0003-career-tagging.md). |

## Phase B — Post-v1 polish

These can land in v1.x patch releases. Not release blockers.

### B1. Print layout refinements

| Field      | Value                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Open for owner feedback                                                                                                                                                                                                                                                                                                               |
| Owner      | Site owner → site builder                                                                                                                                                                                                                                                                                                             |
| Source     | Owner notes after manual print check (2026-05-28)                                                                                                                                                                                                                                                                                     |
| Acceptance | Defined per change request. Likely touches `src/styles/print.css` and `src/components/print/Print*.tsx`. Per-variant page caps from [features/print-views.md §4](features/print-views.md) must still hold (events ≤ 2, software ≤ 3, unified ≤ 3).                                                                                    |
| Notes      | Manual print-to-PDF check on 2026-05-28 confirmed v1 prints look great with placeholder content. Owner expressed interest in possibly shifting the format later; this slot collects specific change requests as they arise. Spec's "top categories only" trim for very long skills lists also lives here if it ever becomes relevant. |

## Phase C — Strategic / larger investments

Out of scope for v1; listed for completeness and future planning.

### C1. Enable Next.js Partial Prerendering (PPR) for mobile perf

| Field      | Value                                                                                                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | **Not pursued for v1** (per [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md)). Re-open by superseding ADR-0004.                                                                                                                                                                                                 |
| Owner      | Site builder                                                                                                                                                                                                                                                                                                      |
| Source     | [tooling-notes §7](tooling-notes.md), [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md)                                                                                                                                                                                                                          |
| Acceptance | Mobile Lighthouse Performance on `/` and `/skills` ≥ 95. Build still produces a static-deployable export. New ADR added documenting the migration and superseding the relevant part of [ADR-0001](adr/ADR-0001-tech-stack.md) if anything beyond a config flag changed.                                           |
| Notes      | Trigger condition (A3 picking path b) did not fire — A3 chose path (a) on 2026-05-29. Kept here in case a future ADR supersedes ADR-0004. PPR is still experimental in Next 15; the static-export constraint (`output: 'export'`) is incompatible with PPR's streaming model, which would force a hosting change. |

### C2. Framework swap to Astro

| Field      | Value                                                                                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status     | Not on the path                                                                                                                                                                                                                                                                                                        |
| Owner      | Site builder                                                                                                                                                                                                                                                                                                           |
| Source     | [tooling-notes §7](tooling-notes.md), [ADR-0001](adr/ADR-0001-tech-stack.md)                                                                                                                                                                                                                                           |
| Acceptance | Site rewritten in Astro; all six features preserved; all e2e + integration tests ported; Lighthouse mobile ≥ 95 on every main route. New ADR supersedes [ADR-0001](adr/ADR-0001-tech-stack.md).                                                                                                                        |
| Notes      | Probably overkill for a single-owner resume. Listed for completeness as the "nuclear option" if mobile performance becomes a critical product requirement and PPR (C1) isn't enough. Materially changes the developer experience and the file layout in [05_ENGINEERING_STANDARDS.md §2](05_ENGINEERING_STANDARDS.md). |

## Completed

For posterity. Each entry links back to the original work.

| Item                                                | Resolved   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B2 — Migrate `pnpm lint` to the ESLint CLI          | 2026-05-29 | `pnpm lint` now runs `eslint .` directly; the `next lint` deprecation banner is gone. Ran Next's `next-lint-to-eslint-cli` codemod, then hand-fixed two of its mistakes: (a) the codemod's bare-specifier imports of `eslint-config-next/core-web-vitals` don't resolve under ESM (no `exports` field in the package; needs the `.js` extension), and (b) `eslint-config-next` v15 still ships **legacy** config objects, not flat-config arrays, so `FlatCompat` is still required — re-added `@eslint/eslintrc` to devDeps. Also expanded ESLint ignores to include `next-env.d.ts` (auto-generated by Next), `playwright-report/`, and `test-results/`. 105 vitest + 22 Playwright still green; typecheck and Prettier clean. |
| A3 — Lighthouse mobile performance gap              | 2026-05-29 | Accepted via [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md). PRD §5 metric row relaxed to a per-category, per-platform table (Performance ≥ 75 mobile / ≥ 90 desktop; the other three categories ≥ 95 on both). Architecture decision log updated. Phase **C1** moved to "Not pursued for v1" since its trigger condition no longer applies. Reversible by superseding ADR-0004.                                                                                                                                                                                                                                                                                                                                             |
| A2 — Primary navigation in the site header          | 2026-05-29 | New `PrimaryNav` component renders `Skills` / `Education` / `Print` pills in the sticky site header; `aria-current="page"` on the active page. `/skills`, `/skills/[id]`, and `/education` pass `activeNav`. **Refinement (same day):** `CareerSwitcher` (All / Software / Events) moved out of the header and re-homed directly above the `Timeline` on `/` and `/career/[id]` — it's contextual to the timeline view, so it's absent on skills, education, and detail routes. SiteHeader props simplified to `{ site, activeNav }`. Tests in `tests/e2e/smoke.spec.ts` extended to 26: 4 cover the primary nav, 4 cover switcher placement (presence, active state, absence on detail/skills/education, navigation).           |
| Manual print check (Chrome + Firefox × Letter + A4) | 2026-05-28 | Owner confirmed v1 print output looks great with placeholder content. Per-variant page caps held. Future formatting adjustments tracked under **B1**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Playwright smoke tests                              | 2026-05-28 | 22 tests (was 18 at DoD pass; +4 for the A2 nav) covering every static route + 404 + print-media behavior + navigation flow. Lives in `tests/e2e/smoke.spec.ts`. Originally deferred per [tooling-notes §6](tooling-notes.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `confidentialLabel` field added to Project schema   | 2026-05-28 | Additive optional field, reconciled across [schemas.ts](../src/content/schemas.ts), [content-schema.json](content-schema.json), and [03_DOMAIN_MODEL.md](03_DOMAIN_MODEL.md) during Step 4.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Corepack signing-key workaround                     | 2026-05-28 | Removed broken corepack shims and installed pnpm 9 via `npm install -g pnpm@9`. See [tooling-notes §2](tooling-notes.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
