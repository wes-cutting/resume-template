# Tooling notes

| Field        | Value                             |
| ------------ | --------------------------------- |
| Status       | Active                            |
| Last updated | 2026-05-29 (§8 + §9 added for A4) |

Operational caveats and known follow-ups surfaced during implementation.
Captured here so the same issues are not rediscovered later. Anything that
turns into a real architectural decision should graduate to an ADR; anything
that becomes a feature requirement should move into a feature spec; and
anything that becomes a planned next step lives in
[roadmap.md](roadmap.md). Each section below is tagged either with no
status (still open as a caveat) or `**Resolved YYYY-MM-DD.**` (kept here for
historical context — current state lives in the roadmap).

## 1. pnpm pinned to 9.x

The project uses **pnpm 9** (installed via `npm install -g pnpm@9`). The
latest pnpm (11.x as of 2026-05-28) requires Node ≥ 22.13, but
`05_ENGINEERING_STANDARDS.md` §1 specifies Node 20 LTS, and pnpm 9 is the
highest major that supports Node 20.

**Follow-up:** when the project moves to a newer Node major (no plan for v1),
`pnpm self-update` will pick up pnpm 10 or 11. No code change needed.

## 2. Corepack signing-key failure on this machine

**Resolved 2026-05-28.** Kept for context.

`corepack enable` and `corepack prepare pnpm@latest --activate` both failed
with "Cannot find matching keyid: …" — the corepack bundled with
Node 20.14.0 has an expired or missing signing key for verifying pnpm
releases. This is a known upstream issue and unrelated to this project.

**Workaround applied:** removed the corepack pnpm/pnpx shims at
`~/.nvm/versions/node/v20.14.0/bin/{pnpm,pnpx}` and installed pnpm directly
with `npm install -g pnpm@9`. The project has been running cleanly on this
setup ever since.

**Optional long-term fix if you want corepack back:**
`npm install -g corepack@latest` followed by `corepack enable`. Not
required.

## 3. `next lint` is deprecated

**Resolved 2026-05-29 (roadmap B2).** Kept for context.

`pnpm lint` previously ran `next lint`, which Next.js 15 shipped with a
deprecation warning ("will be removed in Next.js 16"). The upstream codemod
(`npx @next/codemod@canary next-lint-to-eslint-cli .`) ran successfully on
the script but produced an `eslint.config.mjs` that didn't actually work
here — two issues worth recording for anyone running the same codemod in
the future:

1. The codemod's bare-specifier imports
   (`import nextCoreWebVitals from "eslint-config-next/core-web-vitals";`)
   don't resolve under ESM because `eslint-config-next` v15 has no
   `exports` field; explicit `.js` extensions are required.
2. Even with the imports fixed, `eslint-config-next/core-web-vitals.js`
   and `eslint-config-next/typescript.js` still export **legacy** config
   objects (`{ extends, rules }`), not flat-config arrays. They're not
   iterable, so the codemod's `...` spread fails. The pre-codemod
   `FlatCompat` bridge is still the correct shape.

Final state: `pnpm lint` runs `eslint .` directly; the deprecation banner
is gone; the project keeps the FlatCompat bridge with `@eslint/eslintrc`;
`next-env.d.ts` was added to the ignore list since `next lint` had
implicitly excluded it.

## 4. Seed content shape

Initial placeholder content under `/content/` covers both career tracks and
exercises every entity type so that each feature (FEAT-001 through FEAT-006)
will have something to render once built.

| Entity    | Count | Notes                                                                                                              |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| Site      | 1     | Owner = "Alex Rivera" — placeholder. Two careers configured.                                                       |
| Employers | 3     | One software-leaning, one events-leaning, one hybrid (positions on both tracks).                                   |
| Positions | 5     | One open per track. Hybrid employer hosts a software and an events position.                                       |
| Projects  | 3     | Spread across two software positions.                                                                              |
| Events    | 3     | Spread across the two events positions.                                                                            |
| Skills    | 12    | Across 7 categories: `language`, `framework`, `database`, `platform`, `operations`, `vendor-tools`, `cross-track`. |
| Education | 2     | One completed degree, one completed certificate.                                                                   |

Replace `/content/*.json` with real data when the owner is ready; no code
changes are required as long as the existing entity shapes are honored
(`03_DOMAIN_MODEL.md` and `content-schema.json` are authoritative).

## 5. Top-level pages are missing from the site header nav

**Resolved 2026-05-29 (roadmap A2).** Kept for context.

After Steps 5 and 6, both top-level destinations added by FEAT-003 and
FEAT-004 are reachable only by direct URL or by following a contextual
cross-link:

| Route        | Lands from                                                                         |
| ------------ | ---------------------------------------------------------------------------------- |
| `/skills`    | Direct URL only. Skill tags on detail pages link to `/skills/[id]`, not `/skills`. |
| `/education` | Direct URL only. No other page links to it.                                        |

None of FEAT-001, FEAT-002, FEAT-003, or FEAT-004 explicitly require these
links in the sticky header, so the nav still only carries the career
switcher (`All` / `Software Engineering` / `Event Production & Operations`).
For a recruiter or owner sharing the site, both pages are effectively
hidden.

**Action — update the nav.** Before public release, the `SiteHeader` should
expose at least `Skills` and `Education` as primary navigation alongside the
career switcher. Likely shape:

- Owner name (existing) on the left.
- A right-hand group containing the career switcher plus two pill links
  (`Skills`, `Education`) styled like the switcher entries, with
  `aria-current="page"` set on whichever page is active.

Implementation lives in `src/components/shared/SiteHeader.tsx` and
`src/components/shared/CareerSwitcher.tsx` (or a new
`PrimaryNav.tsx`). No schema, content, or feature-spec change required —
this is a pure presentation update. Add this either right after Step 7
(once all top-level routes exist) or as a small dedicated change once Step 8
(if any) and the design pass are complete.

## 6. Playwright / browser verification deferred to Step 7

**Resolved 2026-05-28.** Kept for context.

`features/unified-timeline.md`, `features/split-timeline.md`, and the
`code-review` / `verify` skills all anticipate Playwright snapshots and a
manual browser pass. Through Step 5 I've held off on Playwright because
several routes that the flows want to exercise (print variants) don't exist
until FEAT-005 in Step 7, and skill cross-links only resolved as of Step 5.

**Plan:** add a single Playwright pass once Step 7 lands, covering the full
visitor flow (home → split timeline → position detail → skill detail →
back → print route → print-media snapshot). Until then, integration tests
under `tests/integration/**` cover component-level behavior with jsdom and
build verification confirms each route renders without runtime errors. The
owner should still do a manual `pnpm dev` pass after Step 7 because no
agent in this project actually opens a browser.

**Update (Step 7 + DoD pass):** the Playwright pass is now in
`tests/e2e/smoke.spec.ts` — 18 tests covering every route plus the
print-media advisory and a timeline → position → skill → back navigation
walk. Run with `pnpm test:e2e`.

## 7. Lighthouse mobile performance is below the ≥ 95 target on the home and skills routes

**Resolved 2026-05-29** via [ADR-0004](adr/ADR-0004-accept-mobile-perf-gap.md)
— PRD §5's mobile ≥ 95 Performance target was relaxed to a per-category,
per-platform table that reflects what the current Next.js stack reliably
delivers. Kept here for the historical measurement context.

Lighthouse desktop preset (Lighthouse defaults — Chromium headless, cold
cache, no throttling) over the five main routes:

| Route              | Performance | Accessibility | Best Practices | SEO |
| ------------------ | ----------- | ------------- | -------------- | --- |
| `/`                | 93          | 100           | 96             | 100 |
| `/skills`          | 91          | 100           | 96             | 100 |
| `/education`       | 98          | 100           | 96             | 100 |
| `/career/software` | 97          | 100           | 96             | 100 |
| `/print/software`  | 93          | 98            | 96             | 100 |

Lighthouse mobile preset on `/` (the busiest route) — Performance **79**,
Accessibility 100, Best Practices 96, SEO 100. The single failing audit is
**Total Blocking Time = 600 ms** (score 50) on the throttled mobile CPU,
caused by React hydration of the Next.js App Router runtime. LCP at 2.7s
contributes too.

**Root cause:** even with `output: "export"` and zero `'use client'`
components in the codebase, Next.js 15 still ships the React + framework
runtime to every page so client-side navigation works. On a 4× slowdown
mobile CPU profile, hydration takes ~600 ms which pulls the score below 95. This is a known Next.js characteristic for content-only sites.

**`05_ENGINEERING_STANDARDS.md` §13 and `01_PRD.md` §5 both target Lighthouse
≥ 95.** The PRD specifically calls out the mobile number. We are not
hitting that on the home and skills routes under mobile throttling.

**Possible paths if the gap matters:**

- Enable Next.js 15 Partial Prerendering (`experimental.ppr`) once it
  stabilizes; current status is experimental.
- Move to a framework with lighter runtime cost for content sites (Astro
  would likely score 99+ on a setup like this — material rewrite, not a
  quick fix).
- Accept the gap and document publicly. For a single-owner resume that's
  primarily linked to from desktop and read on mid-range or better mobile
  devices, the real-world impact is small.

**Status:** documented, not blocking. Treat the ≥ 95 mobile target as
aspirational pending a future ADR.

## 8. `export const dynamic = "force-static"` is required on every file-convention route under `output: "export"`

Surfaced while building FEAT-007. Every Next.js App Router file-convention
route that runs server-side at build time — `sitemap.ts`, `robots.ts`,
`manifest.ts`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`, plus
any future `twitter-image.tsx` — fails the static export with this error
unless it explicitly opts in to static generation:

```
Error: export const dynamic = "force-static"/export const revalidate not
configured on route "/manifest.webmanifest" with "output: export".
```

The fix is one line per file: `export const dynamic = "force-static";`.

**Why this happens:** Next 15 treats these convention routes as Route
Handlers by default, and Route Handlers are dynamic-by-default. Static
export requires every route to be statically resolvable; without the
`dynamic` opt-in, Next can't prove the handler is deterministic at build
time.

**Action when adding a new file-convention route:** add
`export const dynamic = "force-static";` alongside the other module-level
exports (`size`, `contentType`, etc.). Otherwise `pnpm build` fails with
the error above and the convention silently doesn't ship.

## 9. Static-export 404 status code varies by host

Surfaced while writing the Playwright smoke test for the custom 404
([src/app/not-found.tsx](../src/app/not-found.tsx)). Different static
hosts emit different status codes for the missing-route page:

- Vercel returns `404` and serves `out/404.html`.
- Cloudflare Pages, GitHub Pages, and `npx serve` typically return `200`
  with the same HTML.

The smoke test deliberately asserts `response.status() < 500` rather than
`=== 404` so it doesn't break depending on which host the test runs
against. If you want a stricter assertion later, gate it on a known host.
