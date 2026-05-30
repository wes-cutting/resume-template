# Resume Website — Documentation

Documentation for a personal resume website that presents two career tracks
(Software Engineering and Event Production & Operations) from a single set of
content files.

## Document map

```
01_PRD.md                          Problem, users, scope
02_ARCHITECTURE.md                 System structure, stack, cross-cutting concerns
   adr/ADR-0001-tech-stack.md      Why Next.js + TS + Tailwind
   adr/ADR-0002-content-as-files.md Why git-tracked content, no database
   adr/ADR-0003-career-tagging.md  Why Position.career drives all filtering
   adr/ADR-0004-accept-mobile-perf-gap.md  Why v1 ships sub-95 mobile Performance
03_DOMAIN_MODEL.md                 Employer, Position, Project, Event, Skill, Education
04_FEATURE_SPEC.md (template)      Copy per feature
features/
   unified-timeline.md             FEAT-001
   split-timeline.md               FEAT-002
   skills-page.md                  FEAT-003
   education-section.md            FEAT-004
   print-views.md                  FEAT-005
   detail-pages.md                 FEAT-006
   site-polish.md                  FEAT-007 — pre-release additions
   contact-page.md                 FEAT-008 — pre-release additions
   now-page.md                     FEAT-009 — pre-release additions
   dark-mode.md                    FEAT-010 — pre-release additions
   education-coursework.md         FEAT-011 — conditional on roadmap A1
05_ENGINEERING_STANDARDS.md        Conventions, testing, Definition of Done
06_API_CONTRACT.md                 Internal data contract (Zod schemas)
content-schema.json                Machine-readable schema for content files
tooling-notes.md                   Operational caveats from initial scaffolding
roadmap.md                         Active roadmap — what's left, phased by lifecycle
dod-reports/                       Definition-of-Done snapshots (append new dated files; do not edit prior ones).
                                    Filename: `dod-report-YYYY-MM-DD-NN.md` where `NN` is a zero-padded
                                    sequence number (`-01`, `-02`, …) for the Nth report on that date.
                                    Allows multiple reports to land on the same day. The single
                                    `dod-report-2026-05-28.md` predates the convention; everything from
                                    `2026-05-29` onward uses the `-NN` suffix.
```

## Reading order for an agent

1. `01_PRD.md` + `05_ENGINEERING_STANDARDS.md` on every task.
1. `02_ARCHITECTURE.md` + relevant ADRs when touching structure or stack.
1. `03_DOMAIN_MODEL.md` + `content-schema.json` when touching content or types.
1. The specific `features/<name>.md` for the feature being worked on.
1. `06_API_CONTRACT.md` when changing the internal data loading contract.

## Conventions

- Content lives under `/content/*.json` and is validated by Zod at build time.
- Every position carries a `career` tag (`software` | `events`) — this single
  field drives unified vs split views and the three print outputs.
- Docs are updated in the same change as the code they describe.
