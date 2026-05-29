import type { EventJoined, PositionJoined, ProjectJoined, Skill } from "@/content/types";

export function skillsReferencedBy(
  positions: readonly PositionJoined[],
  projects: readonly ProjectJoined[],
  events: readonly EventJoined[],
  allSkills: readonly Skill[],
): Skill[] {
  const referenced = new Set<string>();
  for (const p of positions) for (const id of p.skillIds ?? []) referenced.add(id);
  for (const pr of projects) for (const id of pr.skillIds ?? []) referenced.add(id);
  for (const ev of events) for (const id of ev.skillIds ?? []) referenced.add(id);
  return allSkills.filter((s) => referenced.has(s.id));
}
