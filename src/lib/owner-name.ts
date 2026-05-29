/**
 * Up to two uppercase initials extracted from the owner name. Falls back to
 * a single `•` when no letters are present (defensive — schema requires
 * 1+ chars).
 */
export function ownerInitials(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .filter(Boolean);
  return parts.length > 0 ? parts.join("") : "•";
}
