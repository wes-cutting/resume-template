# Feature Spec — Split Timeline Views

| Field            | Value                           |
| ---------------- | ------------------------------- |
| Feature ID       | FEAT-002                        |
| Status           | Approved                        |
| Owner            | Site owner                      |
| Last updated     | 2026-05-28                      |
| Related PRD goal | Present each track in isolation |
| Related ADRs     | ADR-0003                        |

## 1. Summary

A per-track timeline page that renders only the positions for one career track,
at `/career/<careerId>`. The list of tracks is derived from configured careers,
not hard-coded.

## 2. Scope

- **In scope**
  - One route, `/career/[careerId]`, generated statically for every value in
    `Site.careers[].id`.
  - Reuses the timeline component from FEAT-001, filtered by track.
  - Header shows track label and (optionally) a short blurb.
  - Switcher in the page header to jump to the unified view or other tracks.
  - Link to the matching print variant (FEAT-005).
- **Out of scope**
  - Per-track customization of the timeline component beyond filtering.
  - A landing index of tracks (the unified timeline already serves this purpose).

## 3. User stories

| ID   | Story                                                                                                  | Priority |
| ---- | ------------------------------------------------------------------------------------------------------ | -------- |
| US-1 | As a technical recruiter, I want a software-only view so I can scan relevant experience without noise. | Must     |
| US-2 | As an events client, I want an events-only view for the same reason.                                   | Must     |
| US-3 | As the owner, I want adding a third track to “just work” with no view changes.                         | Must     |

## 4. Acceptance criteria

### US-1 / US-2

- **Given** `Site.careers` contains `software` and `events`, **when** the site
  is built, **then** static routes `/career/software` and `/career/events` exist.
- **Given** I am on `/career/<careerId>`, **then** I see only positions whose
  `career` matches `careerId`, in reverse-chronological order.

### US-3

- **Given** a new career id `consulting` is added to `Site.careers` and at
  least one position references it, **when** the site is rebuilt, **then**
  `/career/consulting` exists with no code changes.

### Error cases

- **Given** a request for `/career/unknown` where `unknown` is not in
  `Site.careers`, **then** Next.js returns a 404 (handled by static export).

## 5. Edge cases & error handling

| Scenario                                       | Expected behavior                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Track configured but no positions reference it | Render an empty state with a friendly message                                  |
| Track id contains non-URL-safe characters      | Validated at build time (kebab-case slug)                                      |
| Same employer appears in multiple tracks       | Each track’s view shows only its own positions; not deduplicated across tracks |

## 6. Data changes

None.

## 7. Interface changes

None.

## 8. Dependencies

- FEAT-001 (timeline component).
- Domain model: `Site.careers`, `Position.career`.

## 9. Test plan

- **Unit**: filter helper `positionsByCareer(positions, careerId)`.
- **Integration**: build with fixture content covering 2 and 3 careers; verify
  routes are generated and content is correctly filtered.
- **Playwright**: snapshot `/career/software` and `/career/events`.

## 10. Rollout & observability

N/A.

## 11. Open questions

- Should split views show a “see related work in <other-track>” link when an
  employer appears in both? — owner — **resolved 2026-05-28**: deferred for v1. Not built.
