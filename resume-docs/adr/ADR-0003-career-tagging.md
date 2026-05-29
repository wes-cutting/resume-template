# ADR-0003: `Position.career` as the single tag driving all filtering

| Field    | Value      |
| -------- | ---------- |
| Status   | Accepted   |
| Date     | 2026-05-27 |
| Deciders | Owner      |

> **Editorial clarification 2026-05-28**: an earlier draft of the “Decision”
> section said the career list was "derived from the distinct `career` values
> present in `positions.json`." That contradicted the Domain Model and FEAT-002,
> which treat `Site.careers` as authoritative. The wording below is corrected;
> the underlying decision is unchanged. ADR remains in `Accepted` status.

## Context

The site presents two career tracks (software, events) with a stated intent to
add more in the future. The unified timeline, split timelines, and three print
outputs all need to filter or partition content by track.

There are several places we could attach the track tag: Employer, Position,
Project/Event, or Skill. We need a single canonical source.

## Decision

The **`Position` entity carries a required `career` field** with values from a
configured enum (initially `software` | `events`). All filtering — timelines,
print views, skill cross-references — derives from this field.

Rationale:

- An Employer may host positions on more than one track (e.g. a company where
  the owner started as an engineer and moved into event production).
- A Skill is naturally cross-track (e.g. “Project management”).
- A Project or Event inherits its track from the Position it belongs to.
- Adding a new track is a one-line schema change plus content.

No view component hard-codes the list of careers. The authoritative list lives
in `site.json` as `Site.careers[]`, which carries each track's `id`, display
`label`, and `order`. Every `Position.career` must reference an id in that list
(enforced at build time by the loader). Views — the career switcher, the
`/career/[careerId]` static params, and the print variants — derive their track
list from `Site.careers` so adding a third track is content-only.

If a configured career has no positions, its route still renders an empty
state (see `features/split-timeline.md`) and the loader emits a warning.

## Alternatives considered

| Option                                      | Pros                        | Cons                                             | Why not chosen                    |
| ------------------------------------------- | --------------------------- | ------------------------------------------------ | --------------------------------- |
| Tag on Employer                             | Fewest tags to maintain     | Wrong when one employer spans tracks             | Loses fidelity                    |
| Tag on Skill                                | Lets skills be track-scoped | Forces duplication of cross-track skills         | Wrong granularity                 |
| Tags on every entity                        | Maximum flexibility         | Many tags to keep in sync; ambiguity on conflict | Over-engineered                   |
| Hard-coded `['software', 'events']` in code | Simplest to start           | Future track requires code edits across views    | Conflicts with extensibility goal |

## Consequences

- **Positive**: Single source of truth. Adding a track is content-only. All
  views, including print, work uniformly.
- **Negative / trade-offs**: A position that genuinely spans two tracks (rare)
  must be modeled as two overlapping positions, one per track. Acceptable.
- **Follow-up actions**: Validate `Position.career` against `Site.careers[].id`
  at load time. Provide a helper `getCareers(site)` that returns
  `Site.careers` sorted by `order` for the UI.
