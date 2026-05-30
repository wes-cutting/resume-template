# Internal Data Contract — Resume Website

| Field                   | Value                                                 |
| ----------------------- | ----------------------------------------------------- |
| Status                  | Active                                                |
| Last updated            | 2026-05-29                                            |
| Machine-readable schema | `content-schema.json` (JSON Schema for content files) |

The site exposes no public HTTP API. This document defines the **internal data
contract** between the content loader and the rest of the application. The
machine-readable companion is `content-schema.json`. Zod schemas in
`src/content/schemas.ts` are the runtime source of truth and must match this
document.

## 1. Conventions

- Content lives in `/content/*.json`.
- Each file holds an array (with two exceptions that hold a single object:
  `site.json` and `now.json`).
- Ids are kebab-case, unique within their entity type, and immutable.
- Dates: `YYYY-MM` for month precision (`startDate`, `endDate` on positions and
  education), `YYYY-MM-DD` for day precision (events; `now.lastUpdated`).
- URLs must use `https://`.

## 2. Loader contract

`src/content/load.ts` exposes one function:

```ts
export function loadContent(): JoinedContent;
```

`JoinedContent` is a fully-resolved, in-memory graph:

```ts
type JoinedContent = {
  site: Site;
  employers: Employer[];
  positions: PositionJoined[]; // each .employer, .projects, .events resolved
  projects: ProjectJoined[]; // each .position, .skills resolved
  events: EventJoined[]; // each .position, .skills resolved
  skills: Skill[];
  skillUsage: Record<
    string,
    {
      positions: PositionJoined[];
      projects: ProjectJoined[];
      events: EventJoined[];
    }
  >;
  education: Education[];
  now: Now; // flat, no cross-references
};
```

- The loader fully validates every file with Zod before joining.
- The loader fails the build on any unresolved reference (e.g. a position whose
  `employerId` does not exist) with a precise error message including file
  path and offending field.
- The loader is the only module that imports from `/content/`.

## 3. Validation error format

When validation fails, the build prints and exits non-zero with:

```
[content] <file>:<jsonPath> — <message>
```

Example:

```
[content] positions.json:[2].employerId — value 'acmee-corp' does not match any employer id
```

## 4. Adding a new entity type

Adding an entity type is a structural change and requires:

1. New Zod schema in `src/content/schemas.ts`.
1. Loader updates to read, validate, join, and reverse-index.
1. Type updates exported via `src/content/types.ts`.
1. New content file `/content/<entity>.json`.
1. Update to `03_DOMAIN_MODEL.md` and `content-schema.json` in the same PR.
1. New ADR if the entity changes how filtering or routing works.

## 5. Change policy

- **Additive changes** (new optional fields, new entity types): allowed without
  a version bump on the data contract. Update docs in the same PR.
- **Breaking changes** (renaming a field, removing a field, changing types,
  changing id formats): require an ADR and a migration of all content files
  in the same PR.
- Every change to the contract must be reflected in both
  `src/content/schemas.ts` and `content-schema.json` in the same PR.
