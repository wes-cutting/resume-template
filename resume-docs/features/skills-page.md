# Feature Spec — Skills Page

| Field            | Value                                               |
| ---------------- | --------------------------------------------------- |
| Feature ID       | FEAT-003                                            |
| Status           | Approved                                            |
| Owner            | Site owner                                          |
| Last updated     | 2026-05-28                                          |
| Related PRD goal | Surface skills with traceability to where practiced |
| Related ADRs     | —                                                   |

## 1. Summary

A dedicated page (`/skills`) listing skills grouped by `category`. Each skill
links to the positions, projects, and events where it was practiced. Visitors
can also click a skill from a position or project detail to land here filtered
to that skill.

## 2. Scope

- **In scope**
  - `/skills` route listing all skills grouped by `category`, alphabetical
    within group.
  - Each skill row shows: name, optional proficiency indicator, and a count of
    where it was practiced (e.g. “3 positions • 5 projects • 2 events”).
  - Each skill links to a per-skill detail at `/skills/<skillId>` showing every
    entity that references it, grouped by entity type.
  - Cross-links: position/project/event detail pages link skill tags to
    `/skills/<skillId>`.
- **Out of scope**
  - Free-text search.
  - Tag-based filtering combinators (e.g. “show skills used in both A and B”).
  - Endorsements or external skill verification.

## 3. User stories

| ID   | Story                                                                             | Priority |
| ---- | --------------------------------------------------------------------------------- | -------- |
| US-1 | As a recruiter, I want to scan all skills grouped by category.                    | Must     |
| US-2 | As a recruiter, I want to click a skill and see where it was actually used.       | Must     |
| US-3 | As any visitor on a position detail, I want skill tags to link to the skill view. | Must     |

## 4. Acceptance criteria

### US-1

- **Given** `/skills`, **then** I see skills grouped under their `category`
  headings; categories appear in alphabetical order; skills within each are
  alphabetical by name.

### US-2

- **Given** I am on `/skills` and click a skill, **then** I land on
  `/skills/<skillId>` showing three sections — Positions, Projects, Events —
  each listing the referencing entities with links.
- **Given** a skill referenced by zero entities, **then** the build emits a
  warning. (It still renders; the warning surfaces unused entries.)

### US-3

- **Given** a position, project, or event detail page renders a skill tag,
  **when** I click it, **then** I land on the matching `/skills/<skillId>`.

## 5. Edge cases & error handling

| Scenario                                                   | Expected behavior                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Skill referenced by a Project whose Position is in track A | The skill appears in `/skills/<id>` regardless of track; track is shown on each listing |
| Skill with no `category`                                   | Validation fails at build (category is required)                                        |
| Skill id referenced but not defined                        | Build fails with the offending file/field                                               |

## 6. Data changes

None.

## 7. Interface changes

None.

## 8. Dependencies

- Domain model: `Skill`, plus reverse lookup from `Position.skillIds`,
  `Project.skillIds`, `Event.skillIds`.
- Content loader provides a `skillUsage` index: `{ [skillId]: { positions, projects, events } }`.

## 9. Test plan

- **Unit**: `buildSkillUsage(positions, projects, events)` returns correct
  reverse index, including skills with zero references.
- **Integration**: render `/skills` and `/skills/<id>` against fixture content
  and assert grouping, sorting, and cross-references.
- **Playwright**: smoke test linking from a position detail’s skill tag to the
  matching skill page.

## 10. Rollout & observability

N/A.

## 11. Open questions

- Should proficiency be shown on the skill page (e.g. as small dots)? — owner —
  **resolved 2026-05-28**: yes, render as small dots when `Skill.proficiency`
  is set; omit the indicator entirely when absent.
