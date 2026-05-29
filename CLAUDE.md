# CLAUDE.md

This file is auto-loaded by Claude Code on every session. It tells you how to
work in this repository. The full specification lives in `resume-docs/`.

## What this project is

A personal resume website presenting two (and potentially more) career tracks —
Software Engineering and Event Production & Operations — from a single set of
git-tracked content files. Static site, no database, no admin UI. Full scope
and rationale are in `resume-docs/01_PRD.md`.

## Source of truth

The documents in `resume-docs/` are authoritative. If your intended approach
conflicts with a doc, STOP and flag it rather than diverging silently.

Read these as needed:

- `resume-docs/README.md` — document map and reading order
- `resume-docs/01_PRD.md` — scope, goals, explicit non-goals
- `resume-docs/02_ARCHITECTURE.md` + `resume-docs/adr/*` — stack and binding decisions
- `resume-docs/03_DOMAIN_MODEL.md` + `resume-docs/content-schema.json` — entities + validation
- `resume-docs/06_API_CONTRACT.md` — internal content-loader contract
- `resume-docs/features/*.md` — the six features (one file each)
- `resume-docs/05_ENGINEERING_STANDARDS.md` — the conventions below in full

## Non-negotiable rules (from the standards and architecture)

- **Stack**: Next.js (App Router) + TypeScript strict mode + Tailwind CSS,
  static export. Do not introduce a runtime server, database, or external CMS.
- **Content boundary**: Only `src/content/load.ts` may import from `/content/`.
  Every other module gets data through that loader.
- **Components are presentational**: no content imports, no data fetching in
  `src/components/`. Pure helpers go in `src/lib/` (no React).
- **No hard-coded career ids**: never write `['software', 'events']` in a
  component. Derive the track list from `Site.careers` / the data. Adding a
  third track must be content-only. (See ADR-0003.)
- **Validation**: Zod schemas in `src/content/schemas.ts` must match
  `resume-docs/content-schema.json` and `03_DOMAIN_MODEL.md`. The build fails
  on invalid content or unresolved references, with file + field in the error.
- **No `any`**: use `unknown` and narrow, or define a schema.
- **Accessibility**: WCAG 2.1 AA. Career-track differentiation never relies on
  color alone. Respect `prefers-reduced-motion`.

## Naming & structure

Follow `resume-docs/05_ENGINEERING_STANDARDS.md` sections 2–3 exactly:
files kebab-case, components PascalCase, content ids kebab-case slugs.
The canonical directory layout is in that doc; place new files accordingly.

## Testing

- Vitest for unit (`src/lib/`, `src/content/`) and integration (route render).
- Playwright for E2E + print-media snapshots (`page.emulateMedia({ media: 'print' })`).
- Every feature spec’s acceptance criteria map to at least one test.
- A failing or skipped test blocks completion.

## Definition of Done (check before declaring a task complete)

- [ ] Acceptance criteria from the feature spec are met and covered by tests.
- [ ] Lint, typecheck, Prettier clean; schema validation passes on `/content/`.
- [ ] Playwright smoke tests pass; new routes added to the smoke list.
- [ ] Relevant docs updated in the SAME change (domain model, feature spec,
      or a new ADR for significant decisions).
- [ ] Lighthouse ≥ 95 on main routes; manual print check after print-affecting changes.

## Documentation discipline

Any change to content shape, routes, or architecture updates the corresponding
doc in the same commit. New features start by adding a `resume-docs/features/<slug>.md`
from the template. ADRs are append-only; supersede rather than edit.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
Use `pnpm`. Node 20 LTS.

## Build order for the initial implementation

content loader + Zod schemas → FEAT-001 (unified timeline) → FEAT-002 (split
timelines) → FEAT-006 (detail pages) → FEAT-003 (skills) → FEAT-004 (education)
→ FEAT-005 (print views). Print is last because it depends on the filtering
established by FEAT-001/002.
