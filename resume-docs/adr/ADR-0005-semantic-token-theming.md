# ADR-0005: Semantic token theming via CSS custom properties

| Field    | Value      |
| -------- | ---------- |
| Status   | Accepted   |
| Date     | 2026-05-30 |
| Deciders | Owner      |

## Context

Two pressures converged in late May 2026 to make the current styling
approach the wrong shape for v1:

1. **Project framing shift.** [`01_PRD.md`](../01_PRD.md) (v0.3.0) framed
   this as the owner's personal resume site. The owner has since
   reframed the intent: the project is **a resume template that the
   owner is the first user of**, and that other people should be able to
   clone, fill with their own content, and re-skin to fit their own
   personal brand. The companion edit to PRD §2 / §3 / §7 captures the
   new framing; this ADR captures the architectural consequence.

2. **The A7 dark-mode sweep is correct output, wrong source.** A7
   (FEAT-010) shipped 2026-05-29 and added explicit `dark:` Tailwind
   utility variants to roughly thirty component and route files
   (e.g. `bg-white dark:bg-neutral-950`, `text-neutral-700 dark:text-neutral-300`).
   The rendered output is fine — the floors in [ADR-0004](./ADR-0004-accept-mobile-perf-gap.md)
   still hold, and Playwright covers both themes. But every component
   now carries dark-mode bookkeeping, and a template user who wants to
   re-skin would have to grep ~30 files to change a single color
   relationship. That doesn't satisfy the new PRD goal of "re-skinning
   is a single-file edit, no component code changes."

Beyond the immediate template motivation, the scattered `dark:`
approach also makes:

- adding a third or fourth career track's tint colors awkward (currently
  hard-coded in [`TrackBadge.tsx`](../../src/components/shared/TrackBadge.tsx));
- changing the contrast posture of the entire site (e.g. from neutral-on-neutral
  to a warmer base) a many-file sweep;
- shipping additional theme presets later (a follow-up Phase B item)
  blocked on this refactor anyway.

## Decision

Adopt **semantic design tokens defined as CSS custom properties,
exposed to Tailwind v4 via `@theme`**, and **forbid raw Tailwind color
utilities and `dark:` variants in components**. Every component
references semantic tokens (`bg-surface`, `text-text-primary`,
`border-default`); the tokens themselves live in a single
`src/styles/theme.css` and know how to respond to
`prefers-color-scheme: dark`.

Sketch of the source file:

```css
/* src/styles/theme.css */
:root {
  --color-surface: oklch(1 0 0);
  --color-text-primary: oklch(0.2 0 0);
  --color-border-default: oklch(0.92 0 0);
  /* …~12–15 tokens total — full vocabulary in FEAT-012 */
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(0.18 0 0);
    --color-text-primary: oklch(0.97 0 0);
    --color-border-default: oklch(0.3 0 0);
    /* …matching overrides */
  }
}
@theme {
  --color-surface: var(--color-surface);
  --color-text-primary: var(--color-text-primary);
  --color-border-default: var(--color-border-default);
  /* …all tokens projected as Tailwind classes */
}
```

Component delta is a pure simplification:

```tsx
// Before (A7)
<header className="border-b border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-950/90">

// After (this ADR)
<header className="border-b border-default bg-surface/90">
```

The full token vocabulary, migration plan, and component contract are
specified in [FEAT-012](../features/theming.md). This ADR is the
binding decision; the spec is the implementation contract.

## Consequences

### Positive

- **Re-skinning is a one-file edit.** Template users edit
  `src/styles/theme.css`; no component code touched. Directly satisfies
  the new PRD §2 goal.
- **Net code simplification.** All `dark:` utility variants (added in
  A7 across ~30 files) disappear. Component className strings get
  noticeably shorter and read in semantic, not color, terms.
- **Track tints become parameterizable.** Adding a third career track's
  colors becomes a `theme.css` edit rather than a code edit in
  [`TrackBadge.tsx`](../../src/components/shared/TrackBadge.tsx).
- **ADR-0004's "zero `'use client'`" property is preserved.** Still
  CSS-only, still no client component boundary, still no toggle.
  Dark mode keeps working exactly as A7 shipped — only the _source_ of
  the rule changes.
- **Future theme presets are unlocked.** Shipping additional
  `themes/*.css` files later (Phase B candidate) is now a content
  problem, not a refactoring problem.
- **WCAG contrast becomes auditable in one place.** Currently
  documented as a manual carry in
  [`dod-report-2026-05-29-02.md`](../dod-reports/dod-report-2026-05-29-02.md) §6;
  with tokens in one file, a single contrast pass over `theme.css`
  validates the whole site.

### Negative / cost

- **Migration cost.** ~30 component files swept once. Mechanical
  search-and-replace, but it touches almost every visible surface.
- **Test churn.** Playwright dark-mode tests added in A7 (FEAT-010 §9)
  still pass because the _capability_ doesn't change, but the
  underlying CSS they assert against does. No new test work expected;
  the existing assertions are written against computed background
  lightness, not specific class names.
- **Token vocabulary is a design API.** Once a name like `--color-surface-raised`
  ships, renaming it is a breaking change for any forked template
  user. The initial vocabulary needs care; covered in FEAT-012 §6.
- **A small layer of indirection.** Reading a component className no
  longer tells you the exact color; you have to consult `theme.css`.
  Mitigated by: semantic names are more informative than color names
  (`bg-surface-raised` says "this is an elevated card", `bg-neutral-50`
  doesn't); the vocabulary is small.

### Neutral

- **FEAT-010 status.** The auto-dark capability is preserved unchanged
  from the visitor's perspective. FEAT-010's spec gets marked
  Superseded by FEAT-012 as the implementation contract; FEAT-010's
  text stays intact as historical documentation of the original sweep
  and the palette decisions, both of which inform FEAT-012's default
  theme.

## Alternatives considered

### Keep the `dark:` utility approach, leave it for template users to grep

Rejected. Directly contradicts the new PRD goal. Also leaves the
existing pain points (hard-coded track tints, scattered hover state
mappings) unresolved.

### Multi-preset theme files at the file level (e.g. `themes/{warm,editorial,minimal}.css`) with no shared token vocabulary

Rejected as the _only_ approach because it doesn't actually fix the
problem — components would still need to use raw color utilities; each
preset would have to ship a different component sweep. Multi-preset
files become a natural Phase B follow-up _built on top of_ the token
vocabulary in this ADR, not an alternative to it.

### Typed theme schema (Zod-validated theme objects, JS/TS source of truth)

Considered. Lets non-developers ship themes by editing a JSON file,
and unlocks build-time validation of contrast ratios. Heavier:
introduces a JS layer for what's natively CSS; complicates the
zero-`'use client'` story; and is overkill for the realistic v1
audience (forked-repo developers, not designer-marketplace users).
Reasonable Phase B follow-up if the template gets enough traction to
warrant a non-developer authoring path. Recorded as **B17 candidate**
in [`roadmap.md`](../roadmap.md) if pursued.

### `@theme` directly with no intermediate `:root` custom properties

Tailwind v4's `@theme` directive supports defining color tokens
directly, but **conditional values per media query are not first-class**:
`@theme` is a build-time directive, while `prefers-color-scheme` is a
runtime media query. The `:root` + `var()` indirection used in the
shipped approach is the standard pattern for making `@theme` tokens
respond to the dark-mode media query at runtime. We pay one extra
line per token in `theme.css` for full runtime theme reactivity.

### Class-strategy dark mode with a runtime toggle

Out of scope — requires a `'use client'` boundary and supersedes
ADR-0004. Documented in FEAT-010 §11 as a deferred v2 path; this ADR
does not change that posture.

## Compliance

- All components must use semantic tokens. Raw Tailwind color
  utilities (`bg-white`, `text-neutral-700`, etc.) and `dark:` variants
  are forbidden in `src/components/**` and `src/app/**` once FEAT-012
  ships. **Enforced by a custom ESLint rule shipped with FEAT-012**
  (see [FEAT-012 §10](../features/theming.md)); §11's open question on
  the rule was resolved in favor of shipping it with v1.
- Print components are exempt: they intentionally do not respond to
  dark mode and use their own light-only token namespace
  (`text-print-*`, `bg-print-*`) so the print-light invariant from
  FEAT-010 §4 / A7 stays guaranteed. The ESLint rule exempts the
  print directories via `eslint.config.mjs` path overrides.

## Supersedes

This ADR supersedes the implementation portion of
[FEAT-010 (Dark Mode auto-only, v1)](../features/dark-mode.md). The
auto-mode dark capability is unchanged from the visitor perspective.
FEAT-010 remains as historical documentation of the original sweep
and the palette decisions; FEAT-012 is the binding contract going
forward.

This ADR does **not** supersede [ADR-0004](./ADR-0004-accept-mobile-perf-gap.md);
the zero-`'use client'` property and the per-category Lighthouse
floors both still hold.

## Follow-ups

- New feature spec: [FEAT-012 — Theming via semantic tokens](../features/theming.md).
- Roadmap item: **A9 — Extract styling into a theme system** (Phase A,
  queued pending sign-off on this ADR).
- Optional Phase B candidates unlocked by this ADR: shipping
  additional theme presets (a `themes/*.css` directory pattern); a
  typed theme schema for non-developer authoring (per the alternative
  considered above).
