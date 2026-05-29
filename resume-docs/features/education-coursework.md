# Feature Spec — Education Coursework (Projects on Education)

| Field            | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| Feature ID       | FEAT-011                                                            |
| Status           | Approved (conditional)                                              |
| Owner            | Site owner                                                          |
| Last updated     | 2026-05-29                                                          |
| Related PRD goal | Surface coursework and academic projects alongside formal education |
| Related ADRs     | TBD — see §11                                                       |

## 1. Summary

Attach a list of **Coursework** entries to each Education record so that
notable classes, theses, and practica can show up the same way Projects show
up under Positions. Each Coursework can carry skill references, so the
skills page indexes academic work alongside professional work.

This spec is **conditional on roadmap A1 (placeholder content swap)**:
the field set will be shaped around the owner's real coursework. The shape
below is a defensible default and may be refined when A1 runs.

## 2. Scope

- **In scope**
  - A new `Coursework` entity with `educationId` foreign key.
  - New `content/coursework.json` file under `/content/`.
  - Display on `/education` and on a new `/education/[id]` detail page.
  - Skill cross-references: Coursework's `skillIds` participate in the
    `skillUsage` reverse index, and Coursework appears on
    `/skills/[skillId]` alongside Positions, Projects, and Events.
  - Coursework skill tags link to `/skills/[skillId]` like other entities.
- **Out of scope**
  - A dedicated `/coursework/[id]` route. Coursework lives under its
    parent Education entry; rendering happens in-place. Promote later if
    the owner has substantial coursework worth its own URL.
  - Grades, GPA, credit hours. These can be added as optional fields in a
    later additive change if the owner wants them.
  - Linking Coursework to Positions (cross-track / "applied this class
    later at this job"). Future work; track as an open question.

## 3. User stories

| ID   | Story                                                                                                                                  | Priority |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-1 | As the owner, I want notable courses or theses to appear under each Education entry without forcing them into a Position.              | Must     |
| US-2 | As a recruiter scanning skills, I want academic uses of a skill to appear alongside professional ones, so my mental tally is complete. | Must     |
| US-3 | As any visitor, I want to click an Education entry to see its full coursework list.                                                    | Should   |

## 4. Acceptance criteria

### US-1

- **Given** an Education entry with at least one Coursework entry,
  **when** I load `/education`, **then** the entry shows a compact
  "Notable coursework: N items" line.
- **Given** the same entry, **when** I load `/education/[id]`, **then**
  the full Coursework list renders with name, summary, optional highlights
  and skills.

### US-2

- **Given** a skill referenced by both a Position and a Coursework entry,
  **when** I load `/skills/[skillId]`, **then** both reference types appear
  in their own grouping (or in a unified list with a "via Coursework"
  label).

### US-3

- **Given** any Education card on `/education`, **then** clicking it
  navigates to `/education/[id]` for that record.

## 5. Edge cases & error handling

| Scenario                                                         | Expected behavior                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Coursework references an `educationId` that doesn't exist        | Loader throws with the existing reference-error format.                                                 |
| Education entry has zero Coursework                              | `/education` omits the coursework line. `/education/[id]` renders the Education entry without the list. |
| Coursework references a `skillId` that doesn't exist             | Loader throws (consistent with the existing skill-reference behavior).                                  |
| The same skill is referenced by both a Position and a Coursework | Both appear on `/skills/[id]`, grouped by entity type.                                                  |

## 6. Data changes

- **New** content file `content/coursework.json`.
- **New** entity (additive). Proposed shape:

  | Attribute   | Type     | Required | Description                 | Constraints        |
  | ----------- | -------- | -------- | --------------------------- | ------------------ |
  | id          | string   | yes      | Stable slug                 | unique, kebab-case |
  | educationId | string   | yes      | FK to `Education.id`        | must exist         |
  | name        | string   | yes      | Course / thesis name        | 1–160 chars        |
  | summary     | string   | yes      | Short description           | ≤ 500 chars        |
  | highlights  | string[] | no       | Achievement bullets         | each ≤ 200 chars   |
  | skillIds    | string[] | no       | Skills practiced or studied | each must exist    |

- **Loader changes**:
  - Read and validate `content/coursework.json`.
  - Reference-check `educationId` and `skillIds`.
  - Resolve coursework into `EducationJoined` (new shape — Education
    gains a `coursework: CourseworkJoined[]` field).
  - Extend `skillUsage` to include `coursework: CourseworkJoined[]` per
    skill.

- **Schema files updated**: `schemas.ts`, `content-schema.json`,
  `03_DOMAIN_MODEL.md`.

Per `06_API_CONTRACT.md` §4, adding an entity type is a structural change
and requires the above plus a "new ADR if the entity changes how
filtering or routing works." Coursework does not change filtering or
routing, so **no ADR is strictly required**, but if Coursework should
later appear on the unified timeline (currently positions-only), that
would warrant one.

## 7. Interface changes

- `JoinedContent` gains `coursework: CourseworkJoined[]`. `Education`
  becomes `EducationJoined` with `coursework: CourseworkJoined[]`.
- `SkillUsage` gains a fourth array `coursework: CourseworkJoined[]`.
- New route: `src/app/education/[id]/page.tsx`.
- New component: `src/components/education/CourseworkList.tsx`.

## 8. Dependencies

- FEAT-004 (Education list — Coursework attaches to it).
- FEAT-003 (Skills page — Coursework rows appear in the reverse index).
- Roadmap A1 — the final shape of Coursework should be informed by the
  owner's real coursework.

## 9. Test plan

- **Unit**: Zod schema accepts / rejects per the spec.
- **Loader unit tests**: bad `educationId` → throws with the existing
  format; valid graph builds with Coursework attached and reverse-indexed
  in `skillUsage`.
- **Integration**:
  - `/education` shows the coursework line when present, omits when not.
  - `/education/[id]` renders the full coursework list with skill tags
    linking to `/skills/[id]`.
  - `/skills/[id]` includes the Coursework section when referenced.
- **Playwright**: extend the smoke suite to cover at least one
  `/education/[id]` route.

## 10. Rollout & observability

N/A.

## 11. Open questions

- **Single ADR vs. additive-only.** If the owner wants Coursework to appear
  on the unified timeline (e.g., a senior thesis dated in 2017 sitting next
  to a position from the same year), that affects FEAT-001's "positions only"
  acceptance — needs an ADR superseding the relevant scope line. Default
  assumption: **Coursework does not appear on the unified timeline.**
- **Optional fields the owner may want.** Grade, instructor, course code,
  credit hours. None are present in the default shape above. Add as
  additive options once A1 surfaces real examples.
- **Linking Coursework to later Positions.** "Applied learning from this
  thesis at this job" is a meaningful narrative but a circular reference.
  Defer.
- **Naming.** `Coursework` is the working entity name. `Course`, `Class`,
  `AcademicProject` are alternatives. — assumed `Coursework`.
