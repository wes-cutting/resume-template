# ADR-0001: Tech stack — Next.js + TypeScript + Tailwind

| Field    | Value      |
| -------- | ---------- |
| Status   | Accepted   |
| Date     | 2026-05-27 |
| Deciders | Owner      |

## Context

The site is a single-owner, content-driven, public-read-only resume. It needs:
strong typing for structured content, excellent static export, first-class print
support, fast iteration on layout, easy deployment, and a small surface area
that one person can maintain.

## Decision

We will build with **Next.js (App Router) in TypeScript strict mode, styled with
Tailwind CSS, deployed as a static export** to Vercel or Cloudflare Pages.

## Alternatives considered

| Option                      | Pros                                                  | Cons                                                                        | Why not chosen                                                        |
| --------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Astro                       | Excellent for content sites, ships zero JS by default | Less mature ecosystem for some patterns; team-print/PDF tooling less proven | Next.js print + routing story is more battle-tested for this use case |
| Plain HTML + CSS            | Zero build, ultimate simplicity                       | No type safety on content; manual joins across data; tedious for 6 entities | Loses build-time validation of content references                     |
| Gatsby                      | Strong content-graph model                            | Declining ecosystem momentum                                                | Future maintenance risk                                               |
| SvelteKit                   | Lean, ergonomic                                       | Smaller ecosystem; owner’s primary stack is React                           | Higher friction for the owner                                         |
| React + Vite (no framework) | Lightweight                                           | Have to assemble routing, static export, image opt                          | Re-implementing what Next gives for free                              |

## Consequences

- **Positive**: Strong types end-to-end, file-system routing, easy static
  export, mature print/CSS story, large ecosystem for components and tooling.
- **Negative / trade-offs**: Ships some React runtime even for purely static
  pages. Acceptable given the small size of the site.
- **Follow-up actions**: Configure `output: 'export'` (or equivalent platform
  config), enable TS strict mode, set up Tailwind with print-specific utilities.
