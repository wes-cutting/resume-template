# Definition of Done — Report (2026-05-29)

| Field        | Value                                                                               |
| ------------ | ----------------------------------------------------------------------------------- |
| Status       | Snapshot                                                                            |
| Date         | 2026-05-29                                                                          |
| Scope        | Delta since [dod-report-2026-05-28.md](./dod-report-2026-05-28.md) (Phase A/B work) |
| Build target | Initial six features (FEAT-001..006) + roadmap A2, A3, A4, A5; roadmap B2           |

A delta snapshot following two roadmap completion clusters since the prior
DoD pass. Like its predecessor, this file is a one-time snapshot and is
not maintained over time. Future DoD passes add a new
`dod-report-YYYY-MM-DD.md` rather than editing this one.

## 1. Delta since 2026-05-28

Items that landed between the prior pass and this one, in order:

| Item                                                    | Notes                                                                                                                                                                                                                                                               | Source                                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **A2** — Primary navigation in the header               | New `PrimaryNav` component with Skills · Education · Print pills; same-day refinement moved `CareerSwitcher` above the timeline on `/` and `/career/[id]`. SiteHeader props simplified to `{ site, activeNav }`.                                                    | [roadmap.md → Completed](../roadmap.md)                                                                                                |
| **A3** — Lighthouse mobile performance gap              | Accepted via [ADR-0004](../adr/ADR-0004-accept-mobile-perf-gap.md). [PRD §5](../01_PRD.md) metric row relaxed to a per-category, per-platform table. Phase B2 (PPR; formerly C1) marked "Not pursued for v1."                                                       | [ADR-0004](../adr/ADR-0004-accept-mobile-perf-gap.md), [01_PRD.md §5](../01_PRD.md)                                                    |
| **B2** — Migrate `pnpm lint` to the ESLint CLI          | `next lint` deprecation cleared; `pnpm lint` now runs `eslint .` directly. Codemod produced a broken config; hand-fixed (see [tooling-notes §3](../tooling-notes.md)).                                                                                              | [tooling-notes §3](../tooling-notes.md)                                                                                                |
| **A4** — Site polish & shareability (FEAT-007)          | OG/Twitter Card meta, JSON-LD `Person`, sitemap.ts + robots.ts, favicon + apple-icon + manifest (generated at build via `next/og` `ImageResponse`), custom 404, SiteFooter. Non-print routes moved to a `src/app/(site)/` route group.                              | [features/site-polish.md](../features/site-polish.md)                                                                                  |
| **A5** — Contact page (FEAT-008)                        | New `/contact` route with mailto + optional booking link + social links. PrimaryNav gains a fourth `Contact` pill. Schema gains `Site.bookingUrl`. Explicitly respects [PRD §3 non-goal](../01_PRD.md) "no form, no backend."                                       | [features/contact-page.md](../features/contact-page.md)                                                                                |
| Feature specs for FEAT-007..011                         | Five new specs drafted to lock down the pre-release feature set. Three of those (A4 / A5 / A3-via-ADR) shipped. A6 / A7 / A8 still pending in Phase A.                                                                                                              | [features/](../features/)                                                                                                              |
| Roadmap restructured                                    | Phases B (post-v1 polish), C (strategic) and D (parking lot) collapsed into a single Phase B "Considered / parking lot" with sequential B1..B16. Conventions block simplified to a two-phase model.                                                                 | [roadmap.md](../roadmap.md)                                                                                                            |
| `Site` schema gained three optional fields              | `siteUrl`, `repoUrl` (FEAT-007), `bookingUrl` (FEAT-008). All additive optional per [06_API_CONTRACT.md §5](../06_API_CONTRACT.md). Reconciled across Zod, JSON Schema, and Domain Model in the same change.                                                        | [03_DOMAIN_MODEL.md](../03_DOMAIN_MODEL.md), [content-schema.json](../content-schema.json), [schemas.ts](../../src/content/schemas.ts) |
| Tooling notes §3, §5, §7 marked Resolved; §8 + §9 added | §3 (next lint) resolved via B2; §5 (nav gap) resolved via A2; §7 (mobile perf) resolved via ADR-0004. §8 captures the `dynamic = "force-static"` requirement for every file-convention route under `output: "export"`; §9 captures host-dependent 404 status codes. | [tooling-notes.md](../tooling-notes.md)                                                                                                |

## 2. Checklist (current state)

Re-evaluating the Engineering Standards §13 checklist against the post-A5
state:

| Check                                                                        | State        | Evidence                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Acceptance criteria from each feature spec met                               | ✅           | FEAT-001..006 built initial pass. FEAT-007 + FEAT-008 covered by this delta; FEAT-009..011 specced but not yet built. Each shipped item maps acceptance criteria to tests.                                 |
| Unit + integration tests cover new behavior; all pass                        | ✅           | 129 / 129 Vitest across 23 files (was 105 / 19 at the prior DoD). Run with `pnpm test`.                                                                                                                    |
| Lint clean                                                                   | ✅           | `pnpm lint` — `eslint .` runs directly (B2). The `next lint` deprecation banner is gone.                                                                                                                   |
| Typecheck clean                                                              | ✅           | `pnpm typecheck`. TypeScript strict + `noUncheckedIndexedAccess`.                                                                                                                                          |
| Prettier clean                                                               | ✅           | `pnpm format:check`.                                                                                                                                                                                       |
| Schema validation passes on `/content/`                                      | ✅           | The loader runs at build via the App Router; `pnpm build` succeeds with no `[content] <file>:<jsonPath> — <message>` errors and no unreferenced-skill warnings. Three new optional fields validated.       |
| Playwright smoke tests pass; routes added to smoke list                      | ✅           | `tests/e2e/smoke.spec.ts` — 37 / 37 passing (was 18 at prior DoD; +4 for A2, +7 for A4, +1 per-route for /contact, +3 for A5 dedicated block, plus updates to the existing primary-nav cases). See §4.     |
| Relevant docs updated in same change                                         | ✅           | Schema additions reconciled in the same change as the feature code (`siteUrl`, `repoUrl`, `bookingUrl`). ADR-0004 added in the same change as the PRD §5 + Architecture log updates.                       |
| Lighthouse ≥ targets ([ADR-0004](../adr/ADR-0004-accept-mobile-perf-gap.md)) | ✅           | All categories hit the relaxed floor on every sampled route. Desktop scores jumped from 91–98 perf to **100** on `/` after A4. Full numbers in §4.                                                         |
| Manual print check                                                           | ✅ (carried) | Owner confirmed v1 print output looks great on 2026-05-28 with placeholder content. No print-affecting changes since (A4 footer is `data-print="hide"`; A5 contact page isn't included in print variants). |

Every checklist item is now green. (The prior DoD pass was 6 green + 1 partial + 1 owner-action; this pass is 10 / 10.)

## 3. Test totals

| Surface                    | 2026-05-28 | 2026-05-29 | Δ       |
| -------------------------- | ---------- | ---------- | ------- |
| Vitest unit                | 56         | 67         | +11     |
| Vitest integration (jsdom) | 49         | 62         | +13     |
| **Vitest total**           | **105**    | **129**    | **+24** |
| **Playwright e2e**         | **18**     | **37**     | **+19** |
| Static export routes built | 34         | 41         | +7      |

Run with `pnpm test` and `pnpm test:e2e`. Static export count is `find out -name index.html | wc -l` minus the 404 wrapper.

## 4. Lighthouse results (re-run for this report)

Run via Playwright-installed Chromium against the static export served by
`npx serve out -p 4173`. Cold cache. Both Lighthouse default mobile preset
and default desktop preset.

### Comparing the home route

| Category       | 2026-05-28 desktop | 2026-05-29 desktop | Δ desktop | 2026-05-28 mobile | 2026-05-29 mobile | Δ mobile |
| -------------- | ------------------ | ------------------ | --------- | ----------------- | ----------------- | -------- |
| Performance    | 93                 | **100**            | **+7**    | 79                | 79                | 0        |
| Accessibility  | 100                | 100                | 0         | 100               | 100               | 0        |
| Best Practices | 96                 | **100**            | **+4**    | 96                | **100**           | **+4**   |
| SEO            | 100                | 100                | 0         | 100               | 100               | 0        |

Best Practices and Performance on desktop both reached 100 after A4 —
attributable to the new per-route metadata, JSON-LD `Person`,
favicon/manifest, custom 404, and proper canonical URLs. Mobile
Performance stayed at 79 (still TBT-dominated; this is the score
ADR-0004 explicitly accepts).

### New route sampled

| Route      | Performance | Accessibility | Best Practices | SEO |
| ---------- | ----------- | ------------- | -------------- | --- |
| `/contact` | 100         | 100           | 100            | 100 |

### Against ADR-0004 floors

| Category       | Floor (mobile / desktop) | Worst observed | Pass? |
| -------------- | ------------------------ | -------------- | ----- |
| Performance    | ≥ 75 / ≥ 90              | 79 / 100       | ✅    |
| Accessibility  | ≥ 95 / ≥ 95              | 100 / 100      | ✅    |
| Best Practices | ≥ 95 / ≥ 95              | 100 / 100      | ✅    |
| SEO            | ≥ 95 / ≥ 95              | 100 / 100      | ✅    |

## 5. Playwright route coverage (current)

The smoke suite now covers every static route emitted by `pnpm build`:

- `/`, `/career/software`, `/career/events`
- `/skills`, `/skills/typescript`
- `/position/aurora-senior-engineer`, `/project/ingest-rewrite`, `/event/harborlights-festival-2024`
- `/education`
- **`/contact`** (new)
- `/print`, `/print/software`, `/print/events`
- 404 for an unknown route
- Print-media emulation on each print route + the print-only advisory on `/`
- The timeline → position → skill → back navigation walk
- **Primary nav** (Skills · Education · Contact · Print) — pill presence, navigation, and `aria-current="page"` on the active page
- **Career switcher** placement — visible on `/` and `/career/[id]`, absent on detail / skills / education / contact routes
- **Site polish** — OG and Twitter Card meta on `/`, JSON-LD `Person` parse, favicon link, footer presence on non-print routes and absence on print, custom 404 wording, sitemap.xml + robots.txt served

## 6. Outstanding items

Phase A — still pending:

| Item   | Status                      | Notes                                                                                                            |
| ------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **A1** | Pending (paused per owner)  | Placeholder content swap. Owner-side; no builder work blocked on it.                                             |
| **A6** | Approved — ready to build   | Now page (FEAT-009). Surfaced via footer link only.                                                              |
| **A7** | Approved — ready to build   | Dark mode auto-only (FEAT-010). Recommended to land last so the `dark:` variant sweep is over the final surface. |
| **A8** | Approved, conditional on A1 | Education coursework (FEAT-011). Field set tuned to A1's real coursework.                                        |

Phase B — parking lot, unchanged structure since the 2026-05-29 restructure. See [roadmap.md](../roadmap.md) §"Phase B — Considered / parking lot" for the 16 entries.

## 7. Commands used in this pass

```sh
pnpm lint                        # eslint . (B2)
pnpm typecheck                   # tsc --noEmit
pnpm format:check                # prettier --check .
pnpm test                        # vitest run — 129/129
pnpm test:e2e                    # playwright test — 37/37
pnpm build                       # next build — static export, 41 routes
npx --yes serve out -p 4173      # serve the static export
npx --yes lighthouse <url> \
  --quiet --output=json --output-path=/tmp/lh2-*.json \
  --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=performance,accessibility,best-practices,seo \
  [--preset=desktop]
```
