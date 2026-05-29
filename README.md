# Resume Site

A small, file-based resume website built for people whose career doesn't fit
on one column. Configure one or more **career tracks** (e.g. Software
Engineering, Event Production, Consulting), and the site renders:

- A unified, reverse-chronological timeline interleaving every track
- One filtered timeline per track (`/career/<id>`)
- A skills index linked to every position, project, and event that uses each
  skill
- An education page
- A `/contact` page (mailto + socials + optional scheduling link — no form,
  no backend)
- Three print routes that produce browser-PDF-ready resumes: one unified, one
  per track

Content lives in seven JSON files under `/content/`. Edit a file, commit,
deploy. There is no admin UI, no database, no runtime server.

## Why this exists

Most resume-site templates assume a single career narrative. This one
treats multiple tracks as first-class: every Position carries a `career`
tag, and the filtering machinery (unified vs. split timelines, per-track
print outputs, skills cross-references) derives from that tag. Adding a
third track is content-only — no code change.

## Tech stack

| Layer       | Choice                                           |
| ----------- | ------------------------------------------------ |
| Framework   | Next.js 15 (App Router) with `output: "export"`  |
| Language    | TypeScript 5 strict + `noUncheckedIndexedAccess` |
| Styling     | Tailwind CSS v4                                  |
| Validation  | Zod (build-time, fails the build on bad content) |
| Testing     | Vitest (unit + integration) + Playwright (e2e)   |
| Node        | 20 LTS                                           |
| Package mgr | pnpm 9                                           |
| Output      | Static HTML/CSS/JS — deploys to any CDN          |

Per-route OG metadata, JSON-LD `Person`, sitemap, robots, favicon, web
manifest, and an OG card image are all generated at build time.

## Quick start

### Prerequisites

- **Node.js 20 LTS.** A `.nvmrc` is included; if you use `nvm`, run
  `nvm use` from the project root.
- **pnpm 9.** Install once with `npm install -g pnpm@9`.

### Install and run

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```sh
pnpm build
```

The static export lands in `out/`. Upload that directory to any CDN —
Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, Netlify, anywhere.

### Run the test suites

```sh
pnpm test         # vitest (unit + integration)
pnpm test:e2e     # playwright (browser smoke tests)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format:check # prettier
```

## Use this as your own resume

The project ships with realistic placeholder content for one "Alex Rivera"
with two career tracks (software, events). To make it yours:

### 1. Update the site config — `content/site.json`

```jsonc
{
  "ownerName": "Your Name",
  "tagline": "Short professional tagline.",
  "contactEmail": "you@example.com",
  "location": "City, Region",
  "socialLinks": [
    { "label": "GitHub", "url": "https://github.com/your-handle" },
    { "label": "LinkedIn", "url": "https://www.linkedin.com/in/your-handle" },
  ],
  "careers": [{ "id": "software", "label": "Software Engineering", "order": 0 }],
  "siteUrl": "https://your-domain.example",
  "repoUrl": "https://github.com/your-handle/this-repo",
  "bookingUrl": "https://cal.com/your-handle/intro",
}
```

- `careers` can have one entry or many. Each Position references one via
  its `career` field.
- `siteUrl`, `repoUrl`, `bookingUrl` are optional. Omit `bookingUrl` and
  the "Book a call" button disappears from `/contact`.

### 2. Fill in the entity files

Each file is a JSON array. Ids are kebab-case slugs (`acme-corp`,
`senior-engineer-acme-2024`). The build fails with a precise file +
field error if any reference is broken or any required field is
missing, so you'll know exactly what to fix.

| File                     | What it holds                                                    |
| ------------------------ | ---------------------------------------------------------------- |
| `content/employers.json` | Companies / organizations you've worked for                      |
| `content/positions.json` | Roles. Each references an `employerId` and a `career` track      |
| `content/projects.json`  | Software-flavored bodies of work; each references a `positionId` |
| `content/events.json`    | Production-flavored events; each references a `positionId`       |
| `content/skills.json`    | Named capabilities (language / framework / operations / etc.)    |
| `content/education.json` | Degrees and credentials                                          |

The placeholder data in this repo is a complete, working example. Easiest
path: edit each file in place using the existing entries as a template.

The full domain model (every field, every constraint) is in
[`resume-docs/03_DOMAIN_MODEL.md`](resume-docs/03_DOMAIN_MODEL.md). The
machine-readable JSON Schema is
[`resume-docs/content-schema.json`](resume-docs/content-schema.json).

### 3. Print resumes

Open `/print`, `/print/<career-id>` in your browser and use the browser's
print → save as PDF. The print stylesheet hides nav, switches to a
serif/sans hybrid, and respects per-position page breaks.

### 4. Deploy

The build produces a static export in `out/`. Standard options:

- **Vercel** — `vercel` from the project root. Auto-detects Next.js,
  deploys the static export.
- **Cloudflare Pages** — connect the repo; set build command
  `pnpm build`, output directory `out/`.
- **GitHub Pages** — push the contents of `out/` to a `gh-pages` branch.
- **Any S3-compatible bucket + CDN** — sync `out/` and front it with a CDN.

If you set `Site.siteUrl` in `content/site.json`, OG / canonical / sitemap
URLs become absolute against that domain. Otherwise they're relative.

## Project layout

```
content/                    Source-of-truth resume data (7 JSON files)
public/                     Static assets you serve as-is
src/
  app/
    (site)/                 Routes that render the SiteHeader + SiteFooter chrome
      page.tsx              Home — unified timeline
      career/[careerId]/    Per-track timeline
      skills/               Skills index + skill detail
      education/            Education page
      contact/              Contact page (mailto + socials + booking)
      position/[id]/        Position detail
      project/[id]/         Project detail
      event/[id]/           Event detail
    print/                  Standalone print routes (no header / footer)
      page.tsx              Unified print
      [variant]/page.tsx    Per-track print
    layout.tsx              Root layout: <html>, <body>, metadata
    not-found.tsx           Custom 404
    icon.tsx                Favicon (initials, generated at build)
    apple-icon.tsx          Apple touch icon
    opengraph-image.tsx     OG card (1200×630, generated at build)
    sitemap.ts              Static sitemap
    robots.ts               robots.txt
    manifest.ts             Web manifest
  components/               Presentational components only — no content imports
  content/
    load.ts                 The one module that reads /content/. Everything
                            else gets data through it.
    schemas.ts              Zod schemas, source of runtime truth
    types.ts                Inferred TypeScript types
  lib/                      Pure helpers (sorts, filters, formatters)
  styles/
    globals.css             Tailwind import
    print.css               @media print rules
tests/
  unit/                     Vitest unit tests
  integration/              Vitest + jsdom component tests
  e2e/                      Playwright smoke + flow tests
resume-docs/                Project documentation (PRD, ADRs, feature specs)
```

## Important conventions

- **The content loader is the only module that reads `/content/`.** Routes
  and components receive already-validated, already-joined data.
- **No hard-coded career ids in components.** Lists are derived from
  `Site.careers`. Adding a third track is content-only.
- **TypeScript strict mode everywhere.** No `any` — use `unknown` and
  narrow, or define a schema.
- **Accessibility WCAG 2.1 AA.** Color is never the only differentiator
  for career tracks. `prefers-reduced-motion` respected for any animation.

Full standards in
[`resume-docs/05_ENGINEERING_STANDARDS.md`](resume-docs/05_ENGINEERING_STANDARDS.md).

## Project documentation

This repo ships with substantive design and decision documentation. If
you're customizing beyond content, read these in order:

1. [`resume-docs/01_PRD.md`](resume-docs/01_PRD.md) — scope, users,
   non-goals
2. [`resume-docs/02_ARCHITECTURE.md`](resume-docs/02_ARCHITECTURE.md) —
   stack and cross-cutting concerns
3. [`resume-docs/adr/`](resume-docs/adr/) — four architectural decisions
   (tech stack, content-as-files, career-tagging, accepted mobile-perf
   gap)
4. [`resume-docs/03_DOMAIN_MODEL.md`](resume-docs/03_DOMAIN_MODEL.md) —
   every entity and field
5. [`resume-docs/features/`](resume-docs/features/) — eleven feature
   specs, one per surface
6. [`resume-docs/05_ENGINEERING_STANDARDS.md`](resume-docs/05_ENGINEERING_STANDARDS.md) — conventions, testing, Definition of Done
7. [`resume-docs/06_API_CONTRACT.md`](resume-docs/06_API_CONTRACT.md) —
   the loader's contract

Plus:

- [`resume-docs/tooling-notes.md`](resume-docs/tooling-notes.md) — known
  caveats (pnpm 9, ESLint config, `dynamic = "force-static"` on
  file-convention routes, static-export 404 status codes)
- [`resume-docs/roadmap.md`](resume-docs/roadmap.md) — planned work and
  parking lot
- [`resume-docs/dod-reports/`](resume-docs/dod-reports/) — DoD pass
  snapshots

## Commands cheat sheet

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Dev server with hot reload on `localhost:3000`                |
| `pnpm build`        | Production static export → `out/`                             |
| `pnpm test`         | Vitest unit + integration                                     |
| `pnpm test:watch`   | Vitest in watch mode                                          |
| `pnpm test:e2e`     | Playwright (requires `npx playwright install chromium` first) |
| `pnpm typecheck`    | `tsc --noEmit`                                                |
| `pnpm lint`         | ESLint                                                        |
| `pnpm format`       | Prettier write                                                |
| `pnpm format:check` | Prettier check                                                |

## Customizing beyond content

- **Colors / typography.** Tailwind v4. Theme tokens live in
  `src/styles/globals.css`. Print typography is in `src/styles/print.css`.
- **Components.** All presentational, no content imports. Live under
  `src/components/`. Each is small and self-documenting.
- **Adding a new entity type.** This is a structural change. Procedure
  documented in
  [`resume-docs/06_API_CONTRACT.md`](resume-docs/06_API_CONTRACT.md) §4 —
  Zod schema, loader, types, Domain Model, content-schema, all in one
  change.

## License

The code in this repository is released under the MIT License (see
[`LICENSE`](LICENSE) if present, otherwise add one for your fork).

The placeholder content under `/content/` is sample data — replace it
before publishing your own version of the site. The owner of the
deployed site retains all rights to their own content.

## Acknowledgements

The architecture and feature specs were drafted from scratch for this
project. The `/now` page convention (planned, see roadmap) comes from
Derek Sivers' [nownownow.com](https://nownownow.com/about).
