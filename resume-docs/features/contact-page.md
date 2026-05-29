# Feature Spec — Contact Page

| Field            | Value                             |
| ---------------- | --------------------------------- |
| Feature ID       | FEAT-008                          |
| Status           | Approved                          |
| Owner            | Site owner                        |
| Last updated     | 2026-05-29                        |
| Related PRD goal | Make it easy to contact the owner |
| Related ADRs     | —                                 |

## 1. Summary

A dedicated `/contact` route that surfaces every way to reach the owner in
one place: email (mailto), social links, and (optionally) a scheduling link.
No form, no backend. The page is reachable from the primary nav and from
the footer.

## 2. Scope

- **In scope**
  - One static route at `/contact`.
  - Renders `site.contactEmail` as a primary `mailto:` link.
  - Renders `site.socialLinks` as a list with proper `rel="noopener noreferrer"`.
  - Renders an optional `site.bookingUrl` (e.g. Calendly, Cal.com) as a
    prominent button if set.
  - Added to `PrimaryNav` as a fourth pill alongside Skills / Education /
    Print, with `activeNav="contact"` wired through.
- **Out of scope**
  - Any contact form. **PRD §3 non-goal** explicitly says
    "No contact form with email backend. A `mailto:` link is sufficient."
    This spec respects that.
  - PGP key, alternate email addresses, phone numbers.
  - Anti-bot obfuscation on the email — the email is already public via
    `site.contactEmail`.

## 3. User stories

| ID   | Story                                                                                         | Priority |
| ---- | --------------------------------------------------------------------------------------------- | -------- |
| US-1 | As a recruiter, I want to email the owner directly from the site without copying the address. | Must     |
| US-2 | As any visitor, I want to find the owner on LinkedIn / GitHub from one obvious place.         | Must     |
| US-3 | As the owner, I want recruiters to be able to book time with me if I publish a link.          | Should   |
| US-4 | As any visitor, I want the contact page to be one click from anywhere on the site.            | Must     |

## 4. Acceptance criteria

### US-1

- **Given** `/contact`, **then** the email link reads as the email address
  text, and clicking opens the visitor's default mail client with the
  address pre-filled.

### US-2

- **Given** at least one entry in `site.socialLinks`, **then** each is
  rendered as a labeled link with `target="_blank" rel="noopener noreferrer"`.

### US-3

- **Given** `site.bookingUrl` is set, **then** a prominent "Book a call"
  button is shown linking to it (new tab).
- **Given** `site.bookingUrl` is not set, **then** no booking button is shown
  (no broken link, no empty section).

### US-4

- **Given** any non-print page, **then** the primary nav includes a "Contact"
  pill linking to `/contact`. The pill carries `aria-current="page"` when on
  `/contact`.

## 5. Edge cases & error handling

| Scenario                               | Expected behavior                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `site.contactEmail` is missing         | Validation fails at content load (already required by current schema).                   |
| `site.socialLinks` is missing or empty | The "Find me elsewhere" section is omitted entirely; no empty list.                      |
| `site.bookingUrl` is a non-https URL   | Validation fails at load via the existing `httpsUrl` schema; build fails with the field. |

## 6. Data changes

- **Optional** new field on `Site`:
  - `bookingUrl?: string` (https URL, ≤ 200 chars). Surfaces the "Book a call"
    button when set.

Additive optional per `06_API_CONTRACT.md` §5 — no ADR required. Update
`schemas.ts`, `content-schema.json`, and `03_DOMAIN_MODEL.md` Site table in
the same change.

## 7. Interface changes

- New route: `src/app/contact/page.tsx`.
- `PrimaryNav` adds a fourth item with id `"contact"`; `PrimaryNavId` union
  extended to `"skills" | "education" | "print" | "contact"`.

## 8. Dependencies

- Existing `Site` entity (`contactEmail`, `socialLinks`).
- FEAT-007 (footer) — the footer is a natural second surface for the
  contact link.

## 9. Test plan

- **Integration**: render `/contact` with a fixture site that has each
  combination of (bookingUrl set / not set, socialLinks present / absent)
  and assert the right things render / don't render.
- **Playwright** (extension of existing smoke suite):
  - `/contact` returns 200 and shows the email.
  - Primary nav exposes a "Contact" pill that navigates correctly.
  - `aria-current="page"` lands on the Contact pill on `/contact`.

## 10. Rollout & observability

N/A.

## 11. Open questions

- **Should `Contact` come before or after `Print` in the nav?** Suggested
  order: Skills · Education · Contact · Print. Contact is more visitor-
  relevant than Print. — assumed.
- **Calendly vs. Cal.com vs. owner-hosted booking link?** Field is a free
  `httpsUrl` — owner picks. — open, no code impact.
