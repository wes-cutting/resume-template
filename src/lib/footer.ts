import { execSync } from "node:child_process";

/**
 * Year the site itself started shipping. Used as the lower bound of the
 * copyright range. Hard-coded because (a) it shouldn't change on every build
 * and (b) it isn't worth a Site schema field for one immutable number.
 */
export const SITE_START_YEAR = 2026;

/**
 * Build-time-resolved ISO timestamp of the latest git commit, if available;
 * falls back to the current date when git isn't reachable (fresh clone with
 * no history, CI sandbox without .git, etc.).
 *
 * Resolved once at module load so build-time-only execution stays constant
 * across all renders in a single build.
 */
export const BUILD_TIMESTAMP_ISO: string = readGitTimestamp();

function readGitTimestamp(): string {
  try {
    const iso = execSync("git log -1 --format=%cI", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return iso;
  } catch {
    // fall through
  }
  return new Date().toISOString();
}

/**
 * Year portion of an ISO timestamp. Returns `SITE_START_YEAR` on parse
 * failure so the footer never renders "NaN".
 */
export function yearOf(iso: string): number {
  const slice = iso.slice(0, 4);
  if (slice.length < 4) return SITE_START_YEAR;
  const parsed = Number(slice);
  if (!Number.isFinite(parsed) || parsed === 0) return SITE_START_YEAR;
  return parsed;
}

/**
 * "2026" if both years match, otherwise "2026–2027". Pure function for unit
 * testing.
 */
export function copyrightYears(startYear: number, buildYear: number): string {
  if (buildYear <= startYear) return `${startYear}`;
  return `${startYear}–${buildYear}`;
}

/**
 * YYYY-MM-DD slice of an ISO timestamp.
 */
export function buildDateLabel(iso: string): string {
  return iso.slice(0, 10);
}
