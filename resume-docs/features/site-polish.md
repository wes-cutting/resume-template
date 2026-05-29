# Feature Spec — Site Polish & Shareability

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| Feature ID       | FEAT-007                                                     |
| Status           | Approved                                                     |
| Owner            | Site owner                                                   |
| Last updated     | 2026-05-29                                                   |
| Related PRD goal | Look professional when shared; be discoverable by recruiters |
| Related ADRs     | —                                                            |

## 1. Summary

Six small additions that, together, take the site from "functional" to "looks
intentional when shared." All are content-and-layout level; none touch the
loader, the domain model, or any feature spec already shipped.

The six items live in one spec because they all answer the same question —
"what makes this URL feel finished?" — and they should ship together so the
launch link doesn't fail in any one of them.

## 2. Scope

- **In scope**
  - OpenGraph + Twitter Card metadata on every public route.
  - JSON-LD `Person` structured data on `/`.
  - `app/sitemap.ts` listing every static + SSG route.
  - `app/robots.ts` allowing all (no privacy concerns).
  - Favicon set: SVG, ICO fallback, `apple-touch-icon`, web app manifest.
  - Custom 404 page (`app/not-found.tsx`) carrying the owner name + a link home.
  - Site footer rendered on every non-print page: owner name, copyright
    year (auto-derived at build time), and a "view source" link if the
    repo is public.
- **Out of scope**
  - OG image generation (Vercel's `@vercel/og` etc.) — a single static
    image is enough for v1. Per-page dynamic OG images can come later.
  - JSON-LD beyond the `Person` type. `JobPosting` / `Organization` is
    arguably overkill for a single-owner resume.
  - PWA features beyond a basic web manifest (no service worker, no
    offline mode).

## 3. User stories

| ID   | Story                                                                                                       | Priority |
| ---- | ----------------------------------------------------------------------------------------------------------- | -------- |
| US-1 | As anyone sharing the URL in Slack/iMessage/LinkedIn, I want a rich preview card with name, tagline, image. | Must     |
| US-2 | As Google or another crawler, I want structured data so my result is richer than a plain `<title>`.         | Should   |
| US-3 | As a search crawler, I want a sitemap and a robots policy so I know what to index.                          | Should   |
| US-4 | As anyone bookmarking or pinning the tab, I want a real favicon, not the Next.js default.                   | Must     |
| US-5 | As a visitor who hit a typo'd URL, I want a friendly branded 404 that gets me back home.                    | Should   |
| US-6 | As the owner, I want a footer that signals "this is mine and was updated recently."                         | Should   |

## 4. Acceptance criteria

### US-1 — OG / Twitter Card meta

- **Given** any public route, **then** `<head>` contains:
  - `og:title` = page title (route-specific)
  - `og:description` = page-specific description, falling back to `site.tagline`
  - `og:image` = one absolute URL pointing at `public/og.png` (1200×630)
  - `og:url` = the canonical URL of the route
  - `og:type` = `profile` on `/`, `article` on detail pages, `website` elsewhere
  - `twitter:card` = `summary_large_image`
  - `twitter:title` / `twitter:description` mirroring the OG values
- Implemented via Next 15 `generateMetadata` per route (or static `metadata`
  exports for routes without dynamic content).

### US-2 — JSON-LD Person

- **Given** `/`, **then** a `<script type="application/ld+json">` block
  exists with at least `@type: Person`, `name`, `description` (tagline),
  `email` (contactEmail), and `sameAs` populated from `site.socialLinks`.

### US-3 — sitemap + robots

- **Given** the static export, **then** `out/sitemap.xml` lists every
  prerendered URL (home, both careers, all positions, all projects, all
  events, all skills, education, all print variants, contact, now).
- **Given** the export, **then** `out/robots.txt` allows all user-agents and
  references the sitemap.

### US-4 — Favicon set

- **Given** any page, **then** the `<head>` references:
  - `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` (preferred)
  - `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">`
  - `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` (180×180)
  - `<link rel="manifest" href="/site.webmanifest">`
- A bookmark in Chrome / Safari / Firefox shows the favicon, not the Next.js
  default.

### US-5 — Custom 404

- **Given** any unmatched route, **then** `app/not-found.tsx` renders a page
  with the owner name, a one-line apology, and a link back to `/`.
- Status code is the platform's static-export 404 default; no change.

### US-6 — Footer

- **Given** any non-print page, **then** a footer renders below `<main>`
  containing:
  - The owner name and `© YYYY` (year derived at build time).
  - A small "Updated YYYY-MM-DD" timestamp (build date is fine; no need for
    per-route timestamps).
  - Optional "View source" link if `site.repoUrl` is set in content.
- The footer has `data-print="hide"` so it doesn't appear in print routes.

## 5. Edge cases & error handling

| Scenario                                                | Expected behavior                                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `public/og.png` is missing at build time                | Build emits a warning; `og:image` is omitted (graceful degradation).                     |
| `site.repoUrl` is not configured                        | Footer renders without the View source link; no error.                                   |
| Static export does not produce a `sitemap.xml` file     | Build fails; `app/sitemap.ts` is required to emit a valid file.                          |
| A new route is added but not listed in `app/sitemap.ts` | Use Next.js's automatic enumeration where possible; otherwise covered by the test below. |

## 6. Data changes

- **Optional** new fields on `Site`:
  - `siteUrl?: string` — canonical site URL (e.g. `https://owner.example`).
    Required if any OG / canonical / sitemap output is built; if absent, the
    loader warns and the OG image / canonical / sitemap URLs are emitted
    relative.
  - `repoUrl?: string` — used by the footer's optional "View source" link.

Both fields are additive optional per `06_API_CONTRACT.md` §5 — no ADR
required.

## 7. Interface changes

- New convention: route components export `generateMetadata` (or static
  `metadata`) to supply the per-route OG / Twitter / canonical values.
- New top-level files: `src/app/sitemap.ts`, `src/app/robots.ts`,
  `src/app/not-found.tsx`.
- New shared component: `src/components/shared/SiteFooter.tsx`. Layout puts
  it inside the root layout, below `{children}`.

## 8. Dependencies

- None new at runtime. May add `sharp` (already a transitive dep via Next
  image optimization) for any OG image processing if we ever pursue
  dynamic images.

## 9. Test plan

- **Unit**: render-helper for footer copyright (year derivation pure-function).
- **Integration**: snapshot a generated 404 page; assert it contains the owner
  name.
- **Build assertion**: a Vitest test reads `out/sitemap.xml` after a build
  and asserts every URL from a known list is present.
- **Playwright**: existing smoke tests get a one-time addition checking the
  favicon link is present and the footer renders on `/`.

## 10. Rollout & observability

Manual share-preview check using the LinkedIn Post Inspector, Twitter Card
Validator, and Facebook Sharing Debugger before announcing the URL.

## 11. Open questions

- **Source for the OG image (1200×630).** Plain rendered text on a brand
  color is fine for v1; owner can replace later. Who provides the asset? —
  owner.
- **Favicon design.** Initials monogram, full-name wordmark, or owner-supplied
  asset? — owner.
- **Build-time `Updated YYYY-MM-DD` source.** Use `new Date().toISOString()`
  at build time, or read the last `git log -1 --format=%cI` of the repo? The
  former is simpler but resets on rebuilds. — assumed git timestamp.
