# Feature Spec — Unified Timeline

| Field            | Value                                               |
| ---------------- | --------------------------------------------------- |
| Feature ID       | FEAT-001                                            |
| Status           | Approved                                            |
| Owner            | Site owner                                          |
| Last updated     | 2026-05-28                                          |
| Related PRD goal | Present a complete history with both tracks visible |
| Related ADRs     | ADR-0003                                            |

## 1. Summary

The home page presents a single, vertically scrollable chronological timeline
that interleaves positions from every configured career track. Each entry is
visually labeled with its track and links to a detail view.

## 2. Scope

- **In scope**
  - One page (home / `/`) with a vertical timeline of all positions.
  - Reverse-chronological order (most recent first).
  - Visual differentiation of career tracks (color, label, or icon).
  - Each position shows: title, employer, dates, summary, track label.
  - Each position links to its detail page (FEAT-006).
  - Sticky header with a career-track switcher that links to split views (FEAT-002).
- **Out of scope**
  - Filtering within the unified timeline (use the split timelines instead).
  - Horizontal timeline layout.
  - Pagination — the full list renders on one page.

## 3. User stories

| ID   | Story                                                                                                           | Priority |
| ---- | --------------------------------------------------------------------------------------------------------------- | -------- |
| US-1 | As a hybrid hiring manager, I want to see both careers interleaved chronologically so I can grasp the full arc. | Must     |
| US-2 | As a recruiter, I want to switch quickly to a single-track view if the unified view is too broad.               | Must     |
| US-3 | As any visitor, I want each entry to be clearly labeled with its track so I never confuse them.                 | Must     |

## 4. Acceptance criteria

### US-1

- **Given** content with positions from at least two career tracks, **when** I load `/`, **then** I see all positions in a single timeline ordered by `startDate` descending.
- **Given** a position with no `endDate`, **then** its end is displayed as `Present`.

### US-2

- **Given** I am on `/`, **when** I activate the track switcher and choose a track, **then** I navigate to `/career/<careerId>` (FEAT-002).

### US-3

- **Given** any position in the timeline, **then** its rendered card contains a visible label or icon for its `career` value.
- **Given** two adjacent positions on different tracks, **then** they are visually distinguishable without reading the label text alone (per accessibility: not color-only).

## 5. Edge cases & error handling

| Scenario                                            | Expected behavior                                             |
| --------------------------------------------------- | ------------------------------------------------------------- |
| Two positions with the same `startDate`             | Tiebreak by `endDate` desc, then by `title` asc; stable order |
| Position with `startDate == endDate` (single month) | Render as the same month label, e.g. `Mar 2024`               |
| Career list with > 2 tracks                         | UI renders all tracks; no hard-coded list of two              |
| Empty positions list                                | Render a friendly empty state, not a broken layout            |

## 6. Data changes

None. Uses existing `Position` + `Employer` entities.

## 7. Interface changes

None — no public API. Internal data contract: timeline component receives
`Position[]` already joined to `Employer`.

## 8. Dependencies

- Domain model entities: `Position`, `Employer`, `Site.careers`.
- Content loader providing joined data.

## 9. Test plan

- **Unit**: sort comparator (date desc, tiebreakers); `Present`-label rendering for open positions; track-derivation helper produces tracks in `Site.careers[].order`.
- **Integration**: render with fixture content covering two tracks and verify interleaving and labels.
- **Visual / Playwright**: snapshot of `/` at desktop and mobile widths.

## 10. Rollout & observability

Not applicable (static site, single owner). Manual review on first build.

## 11. Open questions

- Should the timeline show employer logos? — owner — **resolved 2026-05-28**: deferred for v1. Timeline shows no logos.
