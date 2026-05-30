import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/* ----------------------------------------------------------------------------
 * FEAT-012 — component theming contract enforcement
 * --------------------------------------------------------------------------
 * Components reference semantic tokens (bg-background, text-foreground,
 * bg-track-1, etc.) never raw Tailwind color utilities and never `dark:`
 * variants. Print components are exempt and use the print-* token namespace.
 *
 * The rule fires on JSX `className` attribute values (both string Literals
 * and TemplateLiteral chunks) containing forbidden patterns. Two patterns:
 *
 *   1. RAW_COLOR — any Tailwind color-prefix paired with one of the built-in
 *      palette names (neutral, sky, amber, etc.). Generated classes like
 *      `text-foreground`, `bg-track-1`, `border-input` are NOT matched
 *      because their second segment is not in the palette name list.
 *
 *   2. DARK_VARIANT — the `dark:` utility-variant prefix.
 *
 * Path-based override below exempts src/components/print/** and
 * src/app/print/** since print components intentionally do not theme.
 * -------------------------------------------------------------------------- */

const RAW_COLOR_REGEX =
  "(bg|text|border|ring|divide|from|to|via|outline|decoration|fill|stroke|shadow|caret|placeholder|accent)-(white|black|neutral|slate|zinc|stone|gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";

const DARK_VARIANT_REGEX = "dark:";

const TOKEN_VIOLATION_MESSAGE =
  "FEAT-012: components must use semantic tokens (e.g. bg-background, text-foreground, bg-card, bg-track-1) instead of raw Tailwind color utilities or `dark:` variants. See resume-docs/features/theming.md §8 for the migration mapping.";

const tokenContractRule = [
  "error",
  {
    selector: `JSXAttribute[name.name='className'] Literal[value=/${RAW_COLOR_REGEX}/]`,
    message: TOKEN_VIOLATION_MESSAGE,
  },
  {
    selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${RAW_COLOR_REGEX}/]`,
    message: TOKEN_VIOLATION_MESSAGE,
  },
  {
    selector: `JSXAttribute[name.name='className'] Literal[value=/${DARK_VARIANT_REGEX}/]`,
    message: TOKEN_VIOLATION_MESSAGE,
  },
  {
    selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${DARK_VARIANT_REGEX}/]`,
    message: TOKEN_VIOLATION_MESSAGE,
  },
];

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    /* FEAT-012 contract for theme-aware components */
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": tokenContractRule },
  },
  {
    /* Print components carry their own light-only token namespace. */
    files: ["src/components/print/**/*.{ts,tsx}", "src/app/print/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": "off" },
  },
];

export default eslintConfig;
