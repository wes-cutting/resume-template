# ADR-0002: Content as git-tracked files, validated by Zod

| Field    | Value      |
| -------- | ---------- |
| Status   | Accepted   |
| Date     | 2026-05-27 |
| Deciders | Owner      |

## Context

The site’s data — employers, positions, projects, events, skills, education —
is owned by one person, changes infrequently, and benefits from review and
history. There is no need for runtime mutation, no multi-user concerns, and no
admin UI is in scope (per PRD non-goals).

## Decision

We will store all content as **JSON files under `/content/`**, validated at
build time by **Zod schemas**. The build fails if any content file is invalid
or references a missing entity.

File layout:

```
content/
  site.json          # site-level config: name, tagline, contact
  employers.json     # array of Employer
  positions.json     # array of Position (each refs an employer)
  projects.json      # array of Project (each refs a position)
  events.json        # array of Event (each refs a position)
  skills.json        # array of Skill
  education.json     # array of Education
```

## Alternatives considered

| Option                             | Pros                           | Cons                                                           | Why not chosen                             |
| ---------------------------------- | ------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| MDX per entity                     | Rich prose, co-located content | Harder to enforce structured fields; cross-refs awkward        | Structure > prose for resume data          |
| Headless CMS (Contentful / Sanity) | Nice editor UI                 | Adds external dependency, cost, secrets; overkill for one user | Conflicts with PRD non-goals               |
| SQLite in repo                     | Queryable                      | Diffs are unreadable; merge conflicts ugly                     | Loses the “edit and commit” simplicity     |
| YAML files                         | More human-friendly            | Whitespace pitfalls; weaker tooling than JSON in TS            | JSON + schema is unambiguous and TS-native |

## Consequences

- **Positive**: Edits are diffable, reviewable, and reversible. Build-time
  validation catches typos and broken references before deploy. No runtime
  data layer to operate. Agents can update content the same way they update code.
- **Negative / trade-offs**: No nice editing UI. Owner edits JSON directly. This
  matches their stated preference.
- **Follow-up actions**: Define Zod schemas in `src/content/schemas.ts`. Add a
  build step that loads, validates, and resolves cross-references, failing the
  build on any error with precise file/field locations.
