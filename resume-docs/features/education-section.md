# Feature Spec — Education Section

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| Feature ID       | FEAT-004                               |
| Status           | Approved                               |
| Owner            | Site owner                             |
| Last updated     | 2026-05-28                             |
| Related PRD goal | Include education alongside experience |
| Related ADRs     | —                                      |

## 1. Summary

A short, flat education section rendered on a dedicated page (`/education`) and
included in every print variant.

## 2. Scope

- **In scope**
  - `/education` route listing all entries in `education.json`.
  - Entries sorted by `endDate` descending (current entries first).
  - Each entry shows institution, credential, optional field, dates, and
    optional highlights.
  - Included in all print outputs (FEAT-005).
- **Out of scope**
  - Linking individual courses to skills (v1 keeps it flat).
  - Logos / images of institutions.

## 3. User stories

| ID   | Story                                                               | Priority |
| ---- | ------------------------------------------------------------------- | -------- |
| US-1 | As a recruiter, I want to see formal education.                     | Must     |
| US-2 | As any visitor, I want education to appear on every printed resume. | Must     |

## 4. Acceptance criteria

### US-1

- **Given** content in `education.json`, **when** I load `/education`, **then**
  I see one entry per record, sorted by `endDate` desc (entries with no
  `endDate` first, sorted by `startDate` desc as tiebreaker).

### US-2

- **Given** any of the three print routes, **then** education renders in a
  dedicated section near the end of the document.

## 5. Edge cases & error handling

| Scenario                           | Expected behavior                                                           |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `education.json` is an empty array | `/education` renders a friendly empty state; print outputs omit the section |
| Entry missing both dates           | Render the entry without a date range                                       |

## 6. Data changes

None beyond Domain Model.

## 7. Interface changes

None.

## 8. Dependencies

- Domain model: `Education`.

## 9. Test plan

- **Unit**: sort comparator (no-endDate first, then endDate desc, then
  startDate desc).
- **Integration**: render with fixture content including a current entry and a
  completed entry.

## 10. Rollout & observability

N/A.

## 11. Open questions

None.
