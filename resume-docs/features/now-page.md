# Feature Spec — Now Page

| Field            | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| Feature ID       | FEAT-009                                                           |
| Status           | Shipped                                                            |
| Owner            | Site owner                                                         |
| Last updated     | 2026-05-29 (post-ship: §11 open question resolved, see below)      |
| Related PRD goal | Signal that the site is maintained; give a fresh hook for visitors |
| Related ADRs     | —                                                                  |

## 1. Summary

A `/now` page (the [nownownow.com][1] convention popularized by Derek
Sivers): one paragraph or short list of what the owner is currently working
on, learning, or prioritizing — and a "last updated" timestamp. Cheap to
maintain, gives the site a freshness signal, and provides recruiters a
non-resume hook into the owner's current focus.

[1]: https://nownownow.com/about

## 2. Scope

- **In scope**
  - One static route at `/now`.
  - Content sourced from a new file under `/content/`.
  - Shows the "last updated" date prominently at the top.
  - Surfaced from both the site footer (FEAT-007) **and** the primary
    nav (between `Education` and `Contact`). The §11 open question
    that originally proposed footer-only has been resolved in favor of
    primary-nav inclusion — see §11.
- **Out of scope**
  - History / archive of past Now states.
  - RSS feed of Now changes.
  - Multiple Now pages (e.g. "Now" + "Reading").

## 3. User stories

| ID   | Story                                                                                                  | Priority |
| ---- | ------------------------------------------------------------------------------------------------------ | -------- |
| US-1 | As any visitor, I want to see what the owner is currently doing so I know the site isn't years-stale.  | Must     |
| US-2 | As the owner, I want editing the Now page to be a single-file commit, not a multi-step process.        | Must     |
| US-3 | As a search crawler, I want a clear `<time>` element on the page so the freshness is machine-readable. | Should   |

## 4. Acceptance criteria

### US-1

- **Given** `/now`, **then** the page shows:
  - The owner name (consistent with other pages — likely via SiteHeader).
  - The Now page heading.
  - The "last updated" date in human format (e.g. "May 29, 2026") plus a
    machine-readable `<time datetime="2026-05-29">`.
  - The Now body content.

### US-2

- **Given** the owner edits `content/now.json` (or `content/now.md`) and
  commits, **then** the next build picks up the new content and the
  `/now` route renders it. No other file change required.

### US-3

- **Given** `/now`, **then** exactly one `<time>` element appears at the
  top with `datetime` set to the `lastUpdated` value.

## 5. Edge cases & error handling

| Scenario                                  | Expected behavior                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `content/now.json` is missing             | Build fails at content load (the loader enforces presence; see §6).                                 |
| `lastUpdated` is in the future            | Build emits a warning. Render as-is.                                                                |
| Body is empty                             | Render the page with a placeholder line ("No update yet.") rather than a blank page.                |
| `content/now.json` is older than 6 months | No automatic flag in v1. Owner is on the hook for updating. (A "stale Now" warning is future work.) |

## 6. Data changes

- **New** content file: `content/now.json`.
- **New** entity in `03_DOMAIN_MODEL.md` and `content-schema.json`:

  | Attribute   | Type              | Required | Description                                  | Constraints      |
  | ----------- | ----------------- | -------- | -------------------------------------------- | ---------------- |
  | lastUpdated | date (YYYY-MM-DD) | yes      | When the Now content was last touched        | valid day date   |
  | body        | string            | yes      | Free-form prose. Markdown allowed (see §11). | 1–2000 chars     |
  | bullets     | string[]          | no       | Optional list rendered after `body`          | each 1–200 chars |

This is a new entity, so per `06_API_CONTRACT.md` §4 it requires:

- New Zod schema in `src/content/schemas.ts`.
- Loader updates to read and validate (no cross-references; flat entity).
- New `Now` type exported via `src/content/types.ts`.
- Update to `03_DOMAIN_MODEL.md` and `content-schema.json`.

No ADR required (entity addition does not change filtering or routing
semantics).

## 7. Interface changes

- `JoinedContent` gains `now: Now`.
- New route: `src/app/(site)/now/page.tsx`.
- New component: `src/components/now/NowPanel.tsx`.
- `PrimaryNav` (`src/components/shared/PrimaryNav.tsx`) gains a fifth
  `Now` pill between `Education` and `Contact`; the `PrimaryNavId`
  union widens automatically. The `/now` route passes
  `activeNav="now"` so the matching pill receives
  `aria-current="page"`.
- `SiteFooter` (FEAT-007) also renders a `Now` link — the primary nav
  is the discoverable surface, the footer link is the conventional
  one (per the `/now` page convention's "linked from footer" tradition).

## 8. Dependencies

- Domain model: new `Now` entity.
- FEAT-007 footer (where the link surfaces by default).

## 9. Test plan

- **Unit**: Zod schema accepts the documented shape, rejects future-dated
  values silently (warning, not error), enforces length caps.
- **Integration**: render `/now` with fixture content and assert the
  `<time>` element + body content + bullets.
- **Playwright**: smoke test the route; assert it returns 200 and the
  heading reads "Now".

## 10. Rollout & observability

N/A.

## 11. Open questions

- **Markdown vs. plain text in `body`.** Markdown gives bold/italic/links,
  which recruiters expect. Plain text is simpler and keeps the schema
  trivial. — proposed: Markdown via a minimal renderer (e.g.
  `marked` or `micromark`), but only if the value is worth the dep. Default
  to plain text in v1; revisit if the owner asks.
- **Should `/now` be in the primary nav?** ~~Most "/now" sites are linked
  only from the footer to keep the page slightly hidden — discovering it
  feels like a small reward. Proposed: footer-only in v1.~~ —
  **Resolved (2026-05-29, post-ship)**: surfaced in the primary nav too,
  between `Education` and `Contact`. The discoverability win outweighs
  the "small reward" framing for this site. The footer link is retained
  so the conventional `/now` discoverability still works for visitors
  who scroll. The five-pill primary nav order is now:
  `Skills · Education · Now · Contact · Print`.
