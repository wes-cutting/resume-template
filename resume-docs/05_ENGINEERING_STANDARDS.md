# Engineering Standards — Resume Website

| Field        | Value      |
| ------------ | ---------- |
| Status       | Active     |
| Last updated | 2026-05-29 |

## 1. Languages & versions

| Language   | Version             | Notes                                            |
| ---------- | ------------------- | ------------------------------------------------ |
| TypeScript | 5.x                 | `strict: true`, `noUncheckedIndexedAccess: true` |
| Node.js    | 20 LTS              | Pinned in `.nvmrc`                               |
| Next.js    | latest stable major | App Router                                       |

## 2. Project structure

```
resume-site/
  content/                 # Source-of-truth content (JSON)
    site.json
    employers.json
    positions.json
    projects.json
    events.json
    skills.json
    education.json
    now.json               # Single object (FEAT-009)
  public/                  # Static assets (favicon, images)
  src/
    app/                   # Next.js App Router routes
      (site)/              # Route group — non-print routes (SiteHeader + SiteFooter)
        page.tsx             # Unified timeline (FEAT-001)
        career/[careerId]/   # Split timelines (FEAT-002)
        skills/              # Skills index + [skillId] detail (FEAT-003)
        education/           # Education page (FEAT-004)
        position/[id]/       # Position detail (FEAT-006)
        project/[id]/        # Project detail (FEAT-006)
        event/[id]/          # Event detail (FEAT-006)
        contact/             # Contact page (FEAT-008)
        now/                 # Now page (FEAT-009)
      print/               # Print routes (FEAT-005) — outside the (site) group
        page.tsx                 # /print (unified)
        [variant]/page.tsx       # /print/software, /print/events
      sitemap.ts           # FEAT-007
      robots.ts            # FEAT-007
      manifest.ts          # FEAT-007
      icon.tsx / apple-icon.tsx / opengraph-image.tsx  # FEAT-007
      not-found.tsx        # Custom 404 (FEAT-007)
    content/               # Content loader, schemas, types
      schemas.ts           # Zod schemas
      load.ts              # Read + validate + join
      types.ts             # Inferred TS types
    components/            # Presentational components only
      timeline/
      skill/
      print/
      shared/              # SiteHeader, SiteFooter, PrimaryNav, etc.
      contact/             # FEAT-008
      now/                 # FEAT-009
      education/
      detail/
    styles/
      globals.css
      print.css
    lib/                   # Pure helpers (sorting, filtering, derivations)
  tests/
    unit/
    integration/
    e2e/
  resume-docs/             # The documents this project ships with
    01_PRD.md
    ...
```

**Rules**

- Only `src/content/load.ts` reads from `/content/`. Every other module imports
  via that loader.
- `src/components/` is presentational only. No content imports, no data fetching.
- `src/lib/` holds pure functions, no React. They are easy to unit test.
- No hard-coding of career-track ids in components. Derive from data.

## 3. Naming conventions

| Thing               | Convention           | Example                            |
| ------------------- | -------------------- | ---------------------------------- |
| Files               | kebab-case           | `unified-timeline.tsx`             |
| React components    | PascalCase           | `UnifiedTimeline`                  |
| Functions / vars    | camelCase            | `positionsByCareer`                |
| Constants           | UPPER_SNAKE_CASE     | `DEFAULT_PAGE_SIZE`                |
| Content ids (slugs) | kebab-case           | `acme-corp`, `concert-2024-q3`     |
| Career ids          | kebab-case lowercase | `software`, `events`, `consulting` |

## 4. Code style

- **Formatter**: Prettier with project default config (no overrides unless
  justified in an ADR).
- **Linter**: ESLint with `next/core-web-vitals` and `@typescript-eslint`
  strict-type-checked rules.
- **Max function length**: aim for < 50 lines; extract helpers in `lib/`.
- **No `any`** — use `unknown` and narrow, or define a Zod schema.
- **Prefer composition over inheritance** for components.
- **No default exports for components** (named exports only) — exception is
  required for Next.js route files.

## 5. Error handling

The site has two error surfaces:

1. **Build time** (content loading): a Zod validation failure or unresolved
   reference throws an error including file path and field path. The build
   fails. There is no fallback rendering for invalid content.
1. **Runtime** (browser): essentially presentation-only. Use Next.js error
   boundaries for unexpected client errors. No bespoke error reporting in v1.

## 6. Logging & observability

- Build script may log progress to stdout. No PII.
- No runtime logging. No analytics scripts in v1 beyond hosting defaults.

## 7. Testing requirements

| Test type    | Tool           | Required for                                      | Coverage target        |
| ------------ | -------------- | ------------------------------------------------- | ---------------------- |
| Unit         | Vitest         | All `src/lib/` helpers and `src/content/` loader  | ≥ 90% on these dirs    |
| Integration  | Vitest + jsdom | Route components rendering with fixture content   | One test per route     |
| Visual / E2E | Playwright     | Smoke test of every route + print-media snapshots | Critical paths covered |

**Rules**

- Each feature spec’s acceptance criteria must map to at least one test.
- A failing or skipped test blocks merge.
- Content fixtures live under `tests/fixtures/content/`; mirror the production
  layout but with safe placeholder names.
- Print routes are tested under `page.emulateMedia({ media: 'print' })`.

## 8. Dependencies

- Adding a runtime dependency requires a one-line note in the PR description
  explaining why a built-in does not suffice.
- Disallowed: any package that requires a runtime server, database client, or
  network call from the site itself.
- Lockfile is committed. Use `pnpm` (one tool, fast, strict).

## 9. Version control & commits

- Branching: trunk-based. Short-lived feature branches off `main`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`,
  `refactor:`, `test:`).
- PR requirements: green CI (typecheck, lint, tests, schema validation,
  Playwright); doc updates in same PR as code; reviewer = owner (self-review
  acceptable for a single-owner project).

## 10. Documentation discipline

- Any change to content shape, routes, or architecture **must** update the
  corresponding doc (`03_DOMAIN_MODEL.md`, route conventions, or
  `02_ARCHITECTURE.md`) in the **same PR**.
- New features start by adding a `features/<slug>.md` file from the template.
- Significant decisions get a new `adr/ADR-NNNN-*.md`. ADRs are append-only;
  to change a decision, supersede it with a new ADR.

## 11. Security practices

- No user input is processed; no forms.
- No secrets in the repo. The site has none in v1.
- All external links use `rel="noopener noreferrer"`.
- Hosting platform enforces HTTPS and modern security headers.

## 12. Accessibility

- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<time>`).
- All interactive elements reachable and operable by keyboard.
- Color contrast meets WCAG 2.1 AA.
- Career-track differentiation never relies on color alone.
- `prefers-reduced-motion` respected for any animation.

## 13. Definition of Done

- [ ] All acceptance criteria from the feature spec are met.
- [ ] Unit + integration tests cover the new behavior; all tests pass.
- [ ] Lint, typecheck, and Prettier are clean.
- [ ] Schema validation passes on `content/` in CI.
- [ ] Playwright smoke tests pass; new routes added to the smoke list.
- [ ] Relevant docs updated (`03_DOMAIN_MODEL.md`, feature spec, ADR if needed).
- [ ] Lighthouse score ≥ 95 on the main routes.
- [ ] Manual print check on at least one print route after any print-affecting change.
