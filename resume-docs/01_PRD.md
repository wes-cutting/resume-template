# Product Requirements Document — Resume Website

| Field        | Value                            |
| ------------ | -------------------------------- |
| Status       | Active                           |
| Owner        | Site owner (single-user project) |
| Last updated | 2026-05-28                       |
| Version      | 0.2.0                            |

## 1. Problem statement

The owner has two parallel career tracks — Software Engineering (primary) and
Event Production & Operations (secondary) — with potential for additional tracks
in the future. A standard single-column resume forces these tracks to compete
for space and obscures the cross-pollination between them. The site needs to
present both tracks coherently while letting visitors focus on whichever is
relevant to them, and produce traditional resume documents on demand.

## 2. Goals

- Present a complete professional history with two (and potentially more) career
  tracks visible side-by-side or in isolation.
- Surface technical and operational skills with traceability back to where they
  were practiced (employer, project, or event).
- Generate role-appropriate printed resumes from the same underlying data.
- Be trivially editable by the owner: edit content files, commit, deploy.
- Be extensible to a third career track without structural rewrites.

## 3. Non-goals / out of scope

- No admin / CMS UI. Content is edited as files in the repository.
- No authentication, user accounts, or per-visitor personalization.
- No database. All content is static, version-controlled in the repo.
- No analytics beyond what the hosting platform provides by default.
- No blog, articles, or long-form writing surface (may be added later; not now).
- No contact form with email backend. A `mailto:` link is sufficient.
- No multi-language support in v1.

## 4. Target users / personas

| Persona                   | Description                              | Primary needs                                                            |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| Technical recruiter       | Hiring for software roles                | Quick scan of software experience, technical skills, downloadable resume |
| Events recruiter / client | Hiring for production / operations roles | Events history, scale of productions, downloadable resume                |
| Hybrid hiring manager     | Roles where both skill sets apply        | Unified view, evidence of cross-domain ability                           |
| Owner                     | Maintains and shares the site            | Easy editing, accurate print output, professional appearance             |

## 5. Success metrics

| Metric                          | Target                                                                            | How measured                                  |
| ------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| Time to add a new position      | < 5 minutes                                                                       | Manual timing: edit JSON, commit, see live    |
| Time to add a new career track  | < 1 day                                                                           | Effort to add a new `career` value end-to-end |
| Print fidelity                  | Events resume ≤ 2 pages; software and unified resumes ≤ 3 pages; no manual tweaks | Manual review of each of 3 print outputs      |
| Build time                      | < 30 seconds                                                                      | CI build duration                             |
| Lighthouse performance (mobile) | ≥ 95                                                                              | Lighthouse CI on production build             |

## 6. Key user journeys

1. **Recruiter scans for software experience**: Lands on home, switches to
   software-only view, scrolls timeline, taps a position to see projects and
   skills, downloads software resume.
1. **Events client evaluates production scope**: Switches to events-only view,
   scrolls timeline, opens an event detail to see scale and role, downloads
   events resume.
1. **Hybrid evaluator wants the full picture**: Stays on the unified timeline,
   sees both tracks interleaved chronologically, opens the skills page to see
   the breadth across both tracks, downloads the unified resume.
1. **Owner adds a new project**: Opens `content/projects.json`, adds an entry
   referencing an existing position and skills, commits. Site rebuilds.

## 7. Constraints & assumptions

- **Constraints**
  - Static site — no runtime server logic required.
  - Content lives in the repo as structured files (see Domain Model).
  - Single owner; no concurrent editing concerns.
  - Print outputs must work in default browser print-to-PDF without extensions.
- **Assumptions**
  - The owner is comfortable editing JSON files and using git.
  - Visitors use a modern evergreen browser.
  - A third career track, if added, will be structurally similar to the
    existing two (chronological, employer-anchored, skill-tagged).

## 8. Open questions

All v1 open questions have been resolved. Resolutions are recorded below for
traceability; new questions raised during implementation should be appended
with status `open`.

- Will the site use a custom domain or a hosting-provider subdomain? — owner — **resolved 2026-05-28**: the site will live at the root of a custom domain. No code impact for v1; domain is selected at deploy time.
- Should the unified print output try to fit one page, or is two pages acceptable? — owner — **resolved 2026-05-28**: print page limits are per variant — events ≤ 2 pages, software ≤ 3 pages, unified ≤ 3 pages. See `features/print-views.md`.
- Do events need a `client` field separate from `employer` (for cases where the production company employs the owner but a different organization is the visible client)? — owner — **resolved 2026-05-28**: yes; modeled as `Event.client` in `03_DOMAIN_MODEL.md`.

## 9. Glossary

| Term         | Definition                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Career track | A high-level professional path. v1 values: `software`, `events`.                 |
| Position     | A held role at an Employer over a date range. The unit of work history.          |
| Project      | A discrete body of work, typically within a Position, software-flavored.         |
| Event        | A discrete production, typically within a Position, events-flavored.             |
| Skill        | A named capability (technical or operational) tagged to where it was practiced.  |
| Print view   | A dedicated route that renders a paginated, printable resume from the same data. |
