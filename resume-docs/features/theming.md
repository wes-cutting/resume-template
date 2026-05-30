# Feature Spec — Theming via semantic tokens

| Field            | Value                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| Feature ID       | FEAT-012                                                                   |
| Status           | Shipped                                                                    |
| Owner            | Site builder                                                               |
| Last updated     | 2026-05-30                                                                 |
| Related PRD goal | Be re-skinnable in a single file ([01_PRD.md §2](../01_PRD.md))            |
| Related ADRs     | [ADR-0005](../adr/ADR-0005-semantic-token-theming.md) (binding decision)   |
| Supersedes       | [FEAT-010 (Dark Mode auto-only, v1)](./dark-mode.md) — implementation only |

## 1. Summary

Extract the entire visual identity of the site into a single source of
truth — `src/styles/theme.css` — using **semantic design tokens defined
as CSS custom properties**, projected to Tailwind utility class names
via Tailwind v4's `@theme` directive. Components stop carrying raw
Tailwind color utilities (`bg-white`, `text-neutral-700`) and stop
carrying `dark:` variants; they only reference semantic tokens
(`bg-surface`, `text-text-secondary`).

Re-skinning the entire site — including the dark-mode treatment, the
four track tints, and the typography stack — becomes a single-file
edit to `theme.css`. No component code edits required.

The auto-mode dark-mode capability shipped in
[FEAT-010 / A7](./dark-mode.md) is preserved: the visitor sees identical
behavior. Only the source of the rules changes.

## 2. Scope

- **In scope**
  - One file as the re-skin point: `src/styles/theme.css`.
  - A semantic token vocabulary (~12–15 tokens, listed in §6).
  - `@media (prefers-color-scheme: dark)` overrides folded directly
    into the token definitions in `theme.css`. No `dark:` utility
    variants anywhere else in the codebase.
  - Tailwind v4 `@theme` block that exposes each token as a usable
    utility class (`bg-surface`, `text-text-primary`, etc.).
  - Component sweep: every file under `src/components/**` and
    `src/app/**` migrated from raw Tailwind color utilities to
    semantic tokens.
  - Print-route force-light invariant from FEAT-010 §4 preserved via
    print-specific tokens (`text-print-*`, `bg-print-*`) that the
    print layout uses. Print components carry no `dark:` and don't
    respond to system theme.
  - Updated default look — restated track tint palette, a small
    accent personality (warmth), preserved typography stack for v1.
- **Out of scope**
  - Multiple shipped theme presets (e.g. `themes/warm.css`,
    `themes/editorial.css`). Possible Phase B follow-up; the
    architecture in this spec is the prerequisite, not the
    deliverable.
  - A typed theme schema (Zod-validated theme objects). Considered
    and rejected for v1 in
    [ADR-0005](../adr/ADR-0005-semantic-token-theming.md) "Alternatives
    considered". Possible Phase B candidate.
  - A theme picker UI. Per [01_PRD.md §3](../01_PRD.md) non-goal: no
    runtime toggle, no client-side theme switching. Each forked
    deployment ships with the single theme its `theme.css` defines.
  - Build-time contrast validation. The manual WCAG-AA carry from
    [FEAT-010 §4 US-4](./dark-mode.md) and
    [dod-report-2026-05-29-02 §6](../dod-reports/dod-report-2026-05-29-02.md)
    remains a manual check, but with the token vocabulary in one
    file, a single review pass over `theme.css` validates the whole
    site. Automating that check is a Phase B candidate.
  - Replacing the typography stack with a custom display font.
    Tokens for fonts (`--font-sans-body`, `--font-sans-headings`)
    ship as part of the vocabulary in §6 so a template adopter can
    swap them, but the default values stay on the system stack for
    v1.

## 3. User stories

| ID   | Story                                                                                                                                                                                         | Priority |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-1 | As a template adopter, I want to change the entire site's look by editing one file (`src/styles/theme.css`), without touching any component code, so I can match my personal brand.           | Must     |
| US-2 | As the owner, I want auto dark mode to keep working exactly as it does today (per FEAT-010), so visitors with dark OS preference see a dark site automatically.                               | Must     |
| US-3 | As a site builder, I want components to read in semantic terms (`bg-surface`, `text-text-muted`) rather than color terms (`bg-white dark:bg-neutral-950`), for legibility and re-skin safety. | Must     |
| US-4 | As anyone printing the resume, I want the print output to stay light regardless of theme — exactly as FEAT-010 §4 US-3 required.                                                              | Must     |
| US-5 | As a future contributor, I want the token vocabulary to be small and stable, so renaming or removing tokens doesn't break forks downstream.                                                   | Should   |

## 4. Acceptance criteria

### US-1

- **Given** a fork of the repo, **when** the adopter edits any token
  in `src/styles/theme.css` (e.g. changes `--color-surface` to a warm
  cream), **then** running `pnpm build` produces a site with the new
  color applied everywhere it semantically belongs, with no
  component code edited.
- **Given** the adopter wants both a different light look AND a
  different dark look, **then** both light and dark values live in
  `theme.css` (under `:root` and the `@media (prefers-color-scheme: dark)` block
  respectively) and can be edited independently.

### US-2

- **Given** the OS preference is dark, **then** the rendered page is
  dark — identical behavior to FEAT-010, validated by the existing
  Playwright dark-mode tests passing unchanged after migration.
- **Given** the OS preference is light, **then** the rendered page is
  light — no visual regression from the post-A7 light treatment, beyond
  the intentional default-theme refresh.

### US-3

- **Given** a `git grep -E '(bg|text|border|ring|divide|from|to)-(white|neutral|red|amber|green|blue|emerald|sky|indigo|violet|rose)-?[0-9]*'`
  across `src/components/**` and `src/app/**`, **then** zero matches
  outside of `src/components/print/**` and `src/app/print/**`. (Print
  components keep their explicit light styling; see US-4.)
- **Given** the same grep restricted to `dark:` variants, **then** zero
  matches anywhere in `src/components/**` or `src/app/**`.

### US-4

- **Given** any print route (`/print`, `/print/software`, `/print/events`),
  **then** the route renders light regardless of system theme — the
  same invariant FEAT-010 §4 US-3 / A7 established. Print components
  use `bg-print-surface` / `text-print-primary` tokens whose values
  do not respond to `prefers-color-scheme`.

### US-5

- **Given** the token vocabulary documented in §6 below, **then** every
  token name shipped in v1 is either retained verbatim or only
  _added_ to (additive change) in subsequent versions. Removing or
  renaming a token is a **breaking** change and requires a new ADR.

## 5. Edge cases & error handling

| Scenario                                                                                | Expected behavior                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Template adopter sets a token to an invalid CSS color (`--color-surface: not-a-color;`) | Browser ignores the value; the cascade falls back to the default Tailwind base. No build error (CSS doesn't fail on invalid values). Documented in the template README as "your colors should be valid CSS color values." |
| Adopter forgets to update the dark-mode override for a token they changed               | Light mode reflects their change; dark mode retains the v1 default. Documented in `theme.css` comments and in the migration guide so it's a noticed-on-purpose state, not a silent bug.                                   |
| Adopter wants to disable dark mode entirely                                             | Delete the `@media (prefers-color-scheme: dark)` block from `theme.css`. Site renders light in both system preferences. No code changes required. Documented.                                                             |
| Component author adds a new component using raw Tailwind colors                         | Caught manually in review for v1 (no enforcement layer). §11 open question: add an ESLint rule to flag forbidden patterns. Recorded as B-candidate.                                                                       |
| Dark-mode token value lands a color with insufficient WCAG AA contrast                  | Manual carry from FEAT-010 §4 US-4. A contrast pass over `theme.css` before public launch is in the DoD checklist; automating it is the B-candidate from FEAT-010 / ADR-0005.                                             |

## 6. Token vocabulary

The full v1 vocabulary. Every token defined here MUST have both a
`:root` (light) value and a `@media (prefers-color-scheme: dark)`
override, unless explicitly marked "light-only" (print tokens).

The v1 default values follow the **"professional, warm but restrained"**
direction confirmed by the owner on 2026-05-30:

- **Light surface** carries a subtle warm-neutral tilt — `oklch(0.99 0.005 80)`
  rather than pure white — so the page reads less clinical without losing
  the neutral baseline a resume needs.
- **Dark surface** carries a slight cool-neutral bias — `oklch(0.18 0.005 250)`
  — to take the edge off pure-black and improve eye comfort on OLED panels.
- **Track tints** stay in the sky / amber / emerald / violet family that
  shipped in A7 (FEAT-010 §12), but the light-mode shade lifts one step
  toward saturation for a touch more personality and the dark-mode
  text lightens slightly to compensate for the warmer background.

Concrete OKLCH values land in `src/styles/theme.css`. Template adopters
override them there.

**Naming convention.** Tokens follow the **shadcn / Tailwind v4 `@theme`**
convention: a token named `--color-foo` becomes available as `bg-foo`,
`text-foo`, `border-foo`, `ring-foo`, etc. — Tailwind v4 generates the
full utility family from a single `--color-*` token. To name the
foreground (text) color of a surface, we suffix `-foreground` rather
than prefixing `text-` (so the generated class is `text-foreground`,
not `text-text-primary`). This matches the most widely-used semantic
token convention in the React/Tailwind ecosystem and template adopters
who've worked with shadcn will feel at home.

### Surfaces and their text

| Token                      | Generated classes (selected) | Purpose                                                                                                     |
| -------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--color-background`       | `bg-background`              | Page background. Light: subtle warm-white; dark: cool near-black.                                           |
| `--color-foreground`       | `text-foreground`            | Body / headings text on `background`. Light: deep neutral; dark: off-white.                                 |
| `--color-card`             | `bg-card`                    | Card / hover background. Light: one step warmer than `background`; dark: one step lifted from `background`. |
| `--color-card-foreground`  | `text-card-foreground`       | Text on `card`. In v1 this equals `--color-foreground`; the token exists so future themes can diverge.      |
| `--color-muted`            | `bg-muted`                   | Subtle inset (skill tags, sticky-header backdrop). One step further inset than `card`.                      |
| `--color-muted-foreground` | `text-muted-foreground`      | Eyebrow labels, captions, dates, secondary paragraph text.                                                  |

### Borders and rings

| Token            | Generated classes                | Purpose                                                                           |
| ---------------- | -------------------------------- | --------------------------------------------------------------------------------- |
| `--color-border` | `border-border`, `divide-border` | Most borders + dividers. (Class doubles — accepted shadcn convention.)            |
| `--color-input`  | `border-input`                   | Emphasized borders (e.g. "Print resume" button). Slightly stronger than `border`. |
| `--color-ring`   | `ring-ring`                      | `focus-visible` ring color.                                                       |

### Accent / call-to-action

| Token                       | Generated classes        | Purpose                                                                          |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| `--color-accent`            | `bg-accent`              | Active pill bg, primary CTA bg. Light: deep neutral; dark: inverts to off-white. |
| `--color-accent-foreground` | `text-accent-foreground` | Text on `accent`. Light: white; dark: deep neutral (inverts with `accent`).      |
| `--color-accent-hover`      | `bg-accent-hover`        | Hover state for `accent` CTAs. One step softer than `accent`.                    |

### Track tints

A small repeating palette. **v1 ships four track-tint sets** —
generous headroom for the v1 two-track use case (`software` / `events`)
and the third / fourth track case from
[01_PRD.md §2 Goals](../01_PRD.md). `TrackBadge.getTrackStyle`
retains its modulo-wrap so any number of tracks renders cleanly;
adopters who need more than four distinct tints can extend
`theme.css` by adding `--color-track-5-*` etc. and the lookup will
pick them up automatically.

Each track ships three tokens — `chip`, `foreground`, `edge` — to
cover the bg / text / border-and-ring split TrackBadge needs.

| Token group                                                               | Generated classes (selected)                                                         | Purpose                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------- |
| `--color-track-1` / `--color-track-1-foreground` / `--color-track-1-edge` | `bg-track-1` / `text-track-1-foreground` / `border-track-1-edge` `ring-track-1-edge` | First career's TrackBadge tint.  |
| `--color-track-2` / `--color-track-2-foreground` / `--color-track-2-edge` | as above                                                                             | Second career's tint.            |
| `--color-track-3` / `--color-track-3-foreground` / `--color-track-3-edge` | as above                                                                             | Third career's tint (if added).  |
| `--color-track-4` / `--color-track-4-foreground` / `--color-track-4-edge` | as above                                                                             | Fourth career's tint (if added). |

`TrackBadge.getTrackStyle(orderIndex)` reads `Site.careers[].order`
and returns the appropriate `track-N` class set, exactly as it does
today — only the source of the colors moves. The hard-coded
`TRACK_STYLES` array in [`TrackBadge.tsx`](../../src/components/shared/TrackBadge.tsx)
is replaced by a small lookup that returns class names referencing
the `--color-track-N-*` tokens.

### Print (light-only, no dark-mode override)

| Token                            | Generated classes             | Purpose                                   |
| -------------------------------- | ----------------------------- | ----------------------------------------- |
| `--color-print-background`       | `bg-print-background`         | Print page background. Always white.      |
| `--color-print-foreground`       | `text-print-foreground`       | Print body / headings. Always near-black. |
| `--color-print-muted-foreground` | `text-print-muted-foreground` | Print secondary text. Always dark grey.   |
| `--color-print-border`           | `border-print-border`         | Print dividers. Always light grey.        |

Print tokens are deliberately separate from the screen tokens so the
print components don't accidentally inherit any future dark-mode value.

### Typography

| Token                  | Tailwind class  | Purpose                                                                                                          |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `--font-sans-body`     | `font-body`     | Body text default. Ships as system stack in v1 (kept light; the headings face carries the personality).          |
| `--font-serif-display` | `font-headings` | Display face for `<h1>`/`<h2>`. v1 ships **Fraunces** (variable serif via `next/font/google`) — see notes below. |
| `--font-serif-print`   | `font-print`    | Print body serif. Currently inline in `print.css`; promoted to a token for swappability.                         |

**Why Fraunces.** Resolved 2026-05-30 per owner sign-off. Fraunces is a
variable serif on Google Fonts with optical-size and "softness" axes
that let it scale from a quiet body face to a characterful display face
without changing the family. It carries the warmth the "warm but
restrained" direction asks for, pairs cleanly with the system stack
for body, and self-hosts via `next/font/google` so there's no runtime
CDN fetch and no CLS. Subsetted to Latin + the weight + optical-size
axes the site uses, the payload lands well under 50 kB woff2 — no
material Lighthouse impact (the headings face is a single asset
preloaded once).

Headings get `font-headings` applied in components; body inherits
the default `font-body` from `<body>`. The component sweep in §8 adds
`font-headings` to the four `<h1>` sites and the two-three `<h2>`
sites that benefit from display weight; everything else stays on the
body face.

### Spacing / radii / shadows

Out of scope for v1. The current Tailwind defaults are kept. If a
future theme wants different rounding or a more generous default
spacing scale, those tokens become a v2 additive change.

## 7. Interface changes

### New / changed files

- **New**: `src/styles/theme.css` — the entire token vocabulary in §6,
  with `:root` light values and `@media (prefers-color-scheme: dark)`
  overrides. Imported from `src/app/layout.tsx` after `globals.css`.
- **Changed**: `src/styles/globals.css` — keeps the
  `@import "tailwindcss";` line. The `@custom-variant dark` declaration
  added in A7 is **removed** — no longer needed since components
  don't use `dark:` variants.
- **Changed**: `src/styles/print.css` — `!important` rules from A7
  retained as defense in depth. Tokens used inline in
  `@media print` reference the `--color-print-*` set.
- **New**: `src/app/print/layout.tsx` — kept from A7 (force-light
  shell), but the class names migrate to `bg-print-surface`
  `text-print-primary`.
- **Sweep**: every file in `src/components/**` and `src/app/**` migrated
  from raw Tailwind color utilities + `dark:` variants to semantic
  tokens. Approximately 30 files; mechanical search-and-replace with
  the mapping table in §8.

### Component contract

Components MUST:

- Use only semantic tokens from §6 for color, font, and (eventually)
  spacing.
- NOT use raw Tailwind color utilities (`bg-white`, `text-neutral-700`,
  `border-amber-200`, etc.).
- NOT use `dark:` utility variants.
- Print components are exempt from the screen-token rule: they use the
  `text-print-*` / `bg-print-*` tokens instead.

Enforced at lint time by a custom ESLint rule shipped with this
feature — see §10 (test plan) and §11 (open question resolved). The
rule fires on JSX `className` literals containing forbidden patterns;
print files under `src/components/print/**` and `src/app/print/**`
are exempted via `eslint.config.mjs` overrides.

## 8. Migration mapping (component sweep reference)

Concrete mapping from the A7 sweep's `class dark:variant` pairs to the
new semantic tokens. Builder uses this as the search-and-replace
reference during the migration.

| A7 pattern                                              | New semantic token                                           |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `bg-white dark:bg-neutral-950`                          | `bg-background`                                              |
| `bg-white/90 dark:bg-neutral-950/90`                    | `bg-background/90`                                           |
| `bg-neutral-50 dark:bg-neutral-900`                     | `bg-card`                                                    |
| `bg-neutral-100 dark:bg-neutral-800`                    | `bg-muted`                                                   |
| `bg-neutral-900 dark:bg-neutral-100`                    | `bg-accent`                                                  |
| `bg-neutral-800 dark:bg-neutral-300`                    | `bg-accent-hover`                                            |
| `text-neutral-900 dark:text-neutral-100`                | `text-foreground`                                            |
| `text-neutral-800 dark:text-neutral-200`                | `text-foreground` (no separate `text-secondary` token in v1) |
| `text-neutral-700 dark:text-neutral-300`                | `text-muted-foreground`                                      |
| `text-neutral-600 dark:text-neutral-400`                | `text-muted-foreground`                                      |
| `text-neutral-500 dark:text-neutral-400`                | `text-muted-foreground`                                      |
| `text-white dark:text-neutral-900`                      | `text-accent-foreground`                                     |
| `border-neutral-200 dark:border-neutral-800`            | `border-border`                                              |
| `border-neutral-300 dark:border-neutral-700`            | `border-input`                                               |
| `ring-neutral-200 dark:ring-neutral-800`                | `ring-border`                                                |
| `ring-neutral-900 dark:ring-neutral-100`                | `ring-ring`                                                  |
| `divide-neutral-100 dark:divide-neutral-800`            | `divide-border`                                              |
| `hover:bg-neutral-50 dark:hover:bg-neutral-900`         | `hover:bg-card`                                              |
| `hover:bg-neutral-100 dark:hover:bg-neutral-800`        | `hover:bg-muted`                                             |
| `bg-sky-50 ... dark:bg-sky-950 ...` (TrackBadge tint 1) | `bg-track-1 text-track-1-foreground ring-track-1-edge`       |
| `bg-amber-50 ... dark:bg-amber-950 ...` (tint 2)        | `bg-track-2 text-track-2-foreground ring-track-2-edge`       |
| `bg-emerald-50 ... dark:bg-emerald-950 ...` (tint 3)    | `bg-track-3 text-track-3-foreground ring-track-3-edge`       |
| `bg-violet-50 ... dark:bg-violet-950 ...` (tint 4)      | `bg-track-4 text-track-4-foreground ring-track-4-edge`       |

The "two grey shades collapse to one token" pattern (e.g.
`text-neutral-700` and `text-neutral-600` both map to
`text-muted-foreground`) is intentional. A7's sweep used finer-grained
shades than the design called for; the refactor collapses to a smaller
vocabulary on purpose. If a real design need emerges for a third text
shade, it lands as an additive token (`--color-foreground-soft`) in
v1.1 without breaking forks.

## 9. Dependencies

- Tailwind v4 (already in use). `@theme` is the v4 feature this spec
  leans on.
- **Fraunces** display serif, loaded via `next/font/google` (no new
  runtime dependency; `next/font` is a built-in Next.js feature).
  Subsetted to Latin + the optical-size and weight axes used by the
  site; self-hosted as a build artifact so there's no runtime CDN
  request and no CLS.
- No new runtime JavaScript dependencies.
- No content shape changes; the loader and schemas are untouched.

## 10. Test plan

- **Unit (Vitest)**: jsdom isn't color-aware, so no Vitest tests added.
  Same posture as FEAT-010 §9.
- **Playwright** (assertion-based, not snapshot-based):
  - The 7 existing dark-mode tests from FEAT-010 §9 / A7 are expected
    to pass unchanged. They assert computed background lightness
    rather than specific class names, so the underlying class
    migration is transparent to them. If any fail, the token values
    for that surface need adjustment.
  - **New**: a token-override regression test. The test temporarily
    rewrites `--color-surface` in a `<style>` element (via
    `page.addStyleTag`), reloads, and asserts the body background
    has changed. Confirms the re-skin path works end-to-end.
- **ESLint (build-time)**: the custom rule shipped with this feature
  fires on JSX `className` literals containing forbidden patterns
  (raw color utilities, `dark:` variants). Print files are exempted
  via path-based overrides in `eslint.config.mjs`. `pnpm lint`
  catches contract violations on every commit.
- **Manual contrast pass**: one review over `theme.css` against
  WCAG AA — body 4.5:1, large-text 3:1. Carried forward from
  FEAT-010 §4 US-4. Now a one-file review instead of a many-file
  review; documented in the DoD checklist.
- **Manual print smoke**: Cmd-P on `/print/software` under dark OS
  preference, confirm the rendered PDF is light. Carried forward
  from FEAT-010 (and the manual carry in
  [dod-report-2026-05-29-02 §6](../dod-reports/dod-report-2026-05-29-02.md)).

## 11. Open questions

All four v1 open questions were resolved on 2026-05-30 by owner
sign-off. Resolutions recorded inline below.

- **ESLint rule to forbid raw color utilities and `dark:` variants?** ~~A
  custom rule (or a configured `no-restricted-syntax` / className
  pattern check) would catch contract violations at lint time rather
  than review time. Modest upfront cost; pays for itself the first
  time a new component author forgets.~~ —
  **Resolved (2026-05-30, owner)**: ship the rule with FEAT-012.
  Configured via `no-restricted-syntax` against JSX `className`
  attribute literals, scoped via `eslint.config.mjs` path overrides
  to exempt `src/components/print/**` and `src/app/print/**`.
  Updated rule recipe documented in
  [`05_ENGINEERING_STANDARDS.md`](../05_ENGINEERING_STANDARDS.md) §4
  once the migration lands.
- **Track count parameterization.** ~~The v1 vocabulary ships four
  track-tint sets. The actual data model in
  [`03_DOMAIN_MODEL.md`](../03_DOMAIN_MODEL.md) supports any number of
  careers via `Site.careers[]`. If a fork has more than four careers,
  `TrackBadge.getTrackStyle` modulo-wraps (as it does today). Is
  shipping four enough headroom?~~ — **Resolved (2026-05-30, owner)**:
  track count varies by deployment; **baseline guarantees at least two
  tracks** (the current `software` / `events` pair). The shipped
  vocabulary still includes four `--color-track-N-*` sets to leave
  visual headroom for the third / fourth track use case from
  [01_PRD.md §2](../01_PRD.md), and `TrackBadge.getTrackStyle`
  retains its modulo-wrap so any number of tracks renders cleanly.
  Adopters who need more than four distinct tints can extend
  `theme.css` by adding more `--color-track-5-*` etc.; the
  `TrackBadge` lookup will pick them up automatically.
- **Default theme aesthetic.** ~~The v1 default in this refactor adds
  a small warmth (subtle warm-neutral surface in light, slight
  blue-neutral bias in dark) and freshens the four track tints, but
  stays neutral-leaning so adopters can swap freely without re-skinning
  their content.~~ — **Resolved (2026-05-30, owner)**: confirmed.
  Default direction is "professional, warm but restrained" with the
  subtle warm-neutral / cool-dark tilt described in §6. Concrete OKLCH
  values land in `src/styles/theme.css`.
- **Typography swap a v1 deliverable?** ~~v1 ships system stack
  defaults. Picking a display font for headings is the highest-impact
  personality lever for adopters and could be a v1 deliverable rather
  than a "swappable later" — would add ~20kb of font payload if
  shipped with the default.~~ — **Resolved (2026-05-30, owner)**: ship
  a display font with v1. **Fraunces** (variable serif via
  `next/font/google`) loaded as `--font-serif-display` / used via the
  `font-headings` class on `<h1>`/`<h2>` sites. Body stays on system
  stack (`--font-sans-body`). Subsetted to Latin + the optical-size
  and weight axes the site uses. Rationale in §6 typography notes.

## 12. Relationship to other features and ADRs

- **Supersedes the implementation of [FEAT-010](./dark-mode.md)** (Dark
  Mode auto-only). The auto-dark capability is preserved; only the
  source of the styling moves. FEAT-010's spec is marked Superseded
  but kept intact for historical context and as the source of the
  palette decisions.
- **Bound by [ADR-0005](../adr/ADR-0005-semantic-token-theming.md)**,
  which captures the architectural decision and the constraints on
  future change.
- **Preserves [ADR-0004](../adr/ADR-0004-accept-mobile-perf-gap.md)**:
  zero `'use client'` boundary, no JS payload added, Lighthouse
  floors unchanged.
- **Does not change** any content-shape feature (FEAT-001..FEAT-008,
  FEAT-009, FEAT-011), the domain model, or the loader contract.
  Theming is purely presentational.
