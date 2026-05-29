# Feature Spec — Detail Pages

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Feature ID       | FEAT-006                                                         |
| Status           | Approved                                                         |
| Owner            | Site owner                                                       |
| Last updated     | 2026-05-28                                                       |
| Related PRD goal | Let visitors drill into specific positions, projects, and events |
| Related ADRs     | —                                                                |

## 1. Summary

Dedicated detail pages for each position, project, and event, so visitors can
expand on what they see on the timelines and the skills page.

## 2. Scope

- **In scope**
  - `/position/<positionId>` — title, employer, dates, summary, highlights,
    list of related projects and events, skill tags.
  - `/project/<projectId>` — name, summary, highlights, skill tags, links.
  - `/event/<eventId>` — name, client, date, venue, attendance, role, summary,
    highlights, skill tags.
  - All skill tags link to `/skills/<skillId>` (FEAT-003).
  - Position detail links to each child project/event detail.
  - Project and event detail link back to parent position.
- **Out of scope**
  - Image galleries.
  - Embedded media.
  - Comments / interaction.

## 3. User stories

| ID   | Story                                                                                 | Priority |
| ---- | ------------------------------------------------------------------------------------- | -------- |
| US-1 | As a recruiter, I want to drill into a position to see what I actually did there.     | Must     |
| US-2 | As an events client, I want to see specifics of a production (scale, venue, role).    | Must     |
| US-3 | As any visitor, I want to navigate easily between a position and its projects/events. | Must     |

## 4. Acceptance criteria

### US-1

- **Given** a position with id `P`, **when** I load `/position/P`, **then** I
  see all required fields and a list of every Project and Event whose
  `positionId === P`.

### US-2

- **Given** an event with id `E`, **when** I load `/event/E`, **then** I see
  `client`, `date`, `venue`, `attendance`, and `role` rendered when present
  and omitted gracefully when absent.

### US-3

- **Given** any project or event detail page, **then** there is a visible link
  back to the parent position.

## 5. Edge cases & error handling

| Scenario                                  | Expected behavior                                                                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Project.confidential === true`           | Mask the employer name with a generic label (e.g. “Confidential — Fortune 500 retailer”) if the source data provides one; otherwise omit |
| Position with no child projects or events | Render detail without the children sections                                                                                              |
| Detail id not present at build            | Route does not exist (404 via static export); content loader does not generate orphan routes                                             |

## 6. Data changes

None.

## 7. Interface changes

None.

## 8. Dependencies

- Domain model entities Position, Project, Event, Skill.
- Content loader’s joined data graph.

## 9. Test plan

- **Unit**: detail-data helpers (`getPositionWithChildren(id)`, etc.).
- **Integration**: render each detail type with fixture content covering
  optional-field permutations.
- **Playwright**: navigate timeline → position → project → skill → back.

## 10. Rollout & observability

N/A.

## 11. Open questions

- Should event detail pages support a richer media block (e.g. a photo or
  embedded video)? — owner — **resolved 2026-05-28**: deferred for v1.
