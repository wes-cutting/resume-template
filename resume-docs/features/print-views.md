# Feature Spec — Print Views

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Feature ID       | FEAT-005                                             |
| Status           | Approved                                             |
| Owner            | Site owner                                           |
| Last updated     | 2026-05-28                                           |
| Related PRD goal | Generate role-appropriate resumes from the same data |
| Related ADRs     | ADR-0003                                             |

## 1. Summary

Three dedicated print routes generate paginated, printer-friendly resumes from
the same content: unified, software-only, and events-only. The visitor (or
owner) uses the browser’s native print-to-PDF; no extensions or server
generation required.

## 2. Scope

- **In scope**
  - Routes: `/print`, `/print/software`, `/print/events`.
  - Each route renders a paginated layout optimized for letter and A4 paper.
  - Print stylesheet (`@media print`) hides nav, applies serif/sans hybrid for
    readability, and uses page-break-friendly section breaks.
  - All three include: header (name, contact, tagline), experience section
    (positions filtered per variant), skills (filtered per variant), education.
  - Unified variant interleaves both career tracks chronologically; the others
    include only their track.
- **Out of scope**
  - PDF generation on the server (e.g. Puppeteer).
  - Custom themes or color palettes for print.
  - Download buttons that trigger custom export logic — link points to the
    print route and instructs the visitor to use browser print.

## 3. User stories

| ID   | Story                                                                                         | Priority |
| ---- | --------------------------------------------------------------------------------------------- | -------- |
| US-1 | As a recruiter, I want a printable software resume.                                           | Must     |
| US-2 | As an events client, I want a printable events resume.                                        | Must     |
| US-3 | As a hybrid evaluator, I want a printable unified resume.                                     | Must     |
| US-4 | As the owner, I want print output to stay within per-variant page caps without manual tweaks. | Must     |

## 4. Acceptance criteria

### US-1 / US-2 / US-3

- **Given** the site is built, **then** `/print`, `/print/software`, and
  `/print/events` exist as static routes.
- **Given** `/print/software`, **then** only positions with `career === 'software'`
  are included; skills shown are limited to those referenced by the included
  positions, projects, and events.
- **Given** `/print/events`, **then** the same filtering applies for `events`.
- **Given** `/print`, **then** all tracks are included.

### US-4

- **Given** I open any print route in Chrome and Firefox and trigger print-to-PDF
  at Letter and A4 sizes with default margins, **then** the resulting PDF stays
  within the following per-variant page caps:
  - `/print/events` — ≤ 2 pages
  - `/print/software` — ≤ 3 pages
  - `/print` (unified) — ≤ 3 pages

  …with no orphaned section headers and no position entries split across pages.

### Cross-cutting

- **Given** I trigger print on a non-print route (e.g. `/`), **then** the
  resulting output uses the `@media print` rules, hiding navigation and
  applying print-safe typography, but the visitor is advised in the UI to use
  the `/print/*` routes for paginated output.

## 5. Edge cases & error handling

| Scenario                                                        | Expected behavior                                                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| A position has many highlight bullets, causing an awkward break | Use CSS `break-inside: avoid` on position entries                                                                       |
| Skill list is very long for unified variant                     | Limit print skills section to top categories; reference site for the full list                                          |
| New career track added                                          | A future ADR decides whether to add a fourth print route or only include the new track in unified — out of scope for v1 |

## 6. Data changes

None.

## 7. Interface changes

None.

## 8. Dependencies

- FEAT-001, FEAT-002 for the underlying filtering.
- FEAT-004 for the education section.
- Engineering Standards: print CSS conventions documented there.

## 9. Test plan

- **Unit**: filtering helpers used by each print route.
- **Integration**: render each print route in jsdom and assert presence of
  required sections.
- **Playwright**: emulate print media (`page.emulateMedia({ media: 'print' })`)
  and snapshot each variant; assert page count via PDF generation on Chromium.

## 10. Rollout & observability

Manual print-to-PDF test in Chrome and Firefox on first release.

## 11. Open questions

- Should the unified print attempt to fit two pages, or is three acceptable
  given two tracks? — owner — **resolved 2026-05-28**: per-variant page caps
  are events ≤ 2, software ≤ 3, unified ≤ 3. See US-4 acceptance criterion.
