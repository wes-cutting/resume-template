# ADR-0004: Accept the v1 Lighthouse mobile Performance gap

| Field    | Value      |
| -------- | ---------- |
| Status   | Accepted   |
| Date     | 2026-05-29 |
| Deciders | Owner      |

> **Editorial clarification (same day):** roadmap items originally labeled
> `C1` (PPR) and `C2` (Astro) were renumbered to `B2` and `B3` respectively
> when Phases B / C / D were collapsed into a single Phase B parking lot.
> All references in this ADR have been updated. The decision itself is
> unchanged.

## Context

[`01_PRD.md` §5](../01_PRD.md) (v0.2.0) defined a success metric of
**Lighthouse performance (mobile) ≥ 95**. The Definition-of-Done pass on
2026-05-28 measured the built static export under Lighthouse's default
mobile preset (Chromium headless, cold cache, ~1.6 Mbps throttle, 4× CPU
slowdown) and recorded the following on the busiest route:

| Route | Performance | Accessibility | Best Practices | SEO |
| ----- | ----------- | ------------- | -------------- | --- |
| `/`   | **79**      | 100           | 96             | 100 |

Performance audits attribute the gap to **Total Blocking Time = 600 ms**
(audit score 50), with LCP and Speed Index also contributing.

Root cause: even with `output: "export"` and zero `'use client'` components
in the codebase, Next.js 15 ships the React + framework runtime to every
page so client-side navigation can work. On Lighthouse's throttled mobile
profile, hydration takes ~600 ms which alone drops the Performance score
below 95. This is structural to Next.js content sites — not a regression in
this project. Documented in detail in
[`tooling-notes.md` §7](../tooling-notes.md) and
[`dod-reports/dod-report-2026-05-28.md` §4](../dod-reports/dod-report-2026-05-28.md).

Desktop scores on the same five main routes are 91–98 Performance / 98–100
Accessibility / 96 Best Practices / 100 SEO — comfortably within or near the
PRD target.

## Decision

We **accept** the mobile Performance gap for v1. The PRD success-metric row
is relaxed from a single `≥ 95 mobile` to a more nuanced table reflecting
what the current stack reliably hits:

| Category       | Mobile | Desktop | Notes                                     |
| -------------- | ------ | ------- | ----------------------------------------- |
| Performance    | ≥ 75   | ≥ 90    | Mobile dominated by Next.js hydration TBT |
| Accessibility  | ≥ 95   | ≥ 95    | Currently 96–100 across the board         |
| Best Practices | ≥ 95   | ≥ 95    | Currently 96                              |
| SEO            | ≥ 95   | ≥ 95    | Currently 100                             |

The PRD is updated in the same change as this ADR to reflect the new
targets and to reference this document.

## Alternatives considered

| Option                                                | Pros                                                                | Cons                                                                                                                                                          | Why not chosen                                                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Adopt experimental Next.js 15 Partial Prerendering    | Could plausibly raise mobile Performance into the 90s               | Currently experimental (no stability guarantee). Streams from a Node runtime — incompatible with `output: "export"`, supersedes ADR-0001's hosting assumption | Too much risk and architectural disruption for a single-owner content site. Tracked as roadmap **B2**; the trigger condition no longer applies. |
| Swap framework to Astro                               | Likely scores ≥ 95 on every category for a content-only resume site | Full rewrite. Supersedes ADR-0001 wholesale. Materially changes the developer experience.                                                                     | Disproportionate cost for the visitor-impact gain. Tracked as roadmap **B3** as the "nuclear option".                                           |
| Leave the PRD target as stated, ship with stated miss | No documentation work                                               | Accumulates undeclared technical debt; first reviewer will ask why a stated target is unmet                                                                   | Worst-of-both: same shipping state as accepted, without the rationale.                                                                          |
| Accept the gap, document it formally **(this ADR)**   | Zero engineering cost; honest about the trade-off; reversible later | Public-facing Lighthouse run shows a sub-95 mobile Performance score                                                                                          | Chosen.                                                                                                                                         |

## Consequences

- **Positive**
  - Static export (`output: "export"`) stays. The hosting story in
    [ADR-0001](ADR-0001-tech-stack.md) is unchanged — deploy to Vercel or
    Cloudflare Pages as a pure CDN-served site.
  - No experimental features in the dependency tree.
  - DoD becomes honest: when a future pass runs Lighthouse, the targets
    declared here are the ones it should compare against.
- **Negative / trade-offs**
  - The site will publicly score 79 mobile Performance on `/` if a
    recruiter runs Lighthouse against it. The accompanying audit detail
    (TBT 600 ms) explains why; the rest of the categories stay at 96–100.
  - If a mobile-heavy audience emerges (e.g., the site starts getting
    significant traffic from low-end Android devices), this ADR should be
    revisited; the obvious next step is roadmap **B2**.
- **Reversibility**: high. Reopening this decision means superseding this
  ADR with a new one that picks (a) PPR or (b) framework swap.

## Follow-up actions

- [x] Update [`01_PRD.md` §5](../01_PRD.md) to reflect the table above and
      to reference this ADR.
- [x] Mark [`tooling-notes.md` §7](../tooling-notes.md) as resolved.
- [x] Move roadmap **A3** to Completed; mark roadmap **B2** as not pursued
      for v1.
- [ ] Re-run Lighthouse against the real owner content once roadmap **A1**
      ships, and confirm the relaxed targets still hold. Update PRD or
      open a follow-up ADR if anything regresses below the floor.
