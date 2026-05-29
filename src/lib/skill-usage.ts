import type {
  EventJoined,
  PositionJoined,
  ProjectJoined,
  Skill,
  SkillUsage,
} from "@/content/types";

export function buildSkillUsage(
  skills: readonly Skill[],
  positions: readonly PositionJoined[],
  projects: readonly ProjectJoined[],
  events: readonly EventJoined[],
): Record<string, SkillUsage> {
  const usage: Record<string, SkillUsage> = {};

  for (const skill of skills) {
    usage[skill.id] = { positions: [], projects: [], events: [] };
  }

  for (const position of positions) {
    for (const skillId of position.skillIds ?? []) {
      usage[skillId]?.positions.push(position);
    }
  }
  for (const project of projects) {
    for (const skillId of project.skillIds ?? []) {
      usage[skillId]?.projects.push(project);
    }
  }
  for (const event of events) {
    for (const skillId of event.skillIds ?? []) {
      usage[skillId]?.events.push(event);
    }
  }

  return usage;
}

export function unreferencedSkillIds(usage: Record<string, SkillUsage>): string[] {
  return Object.entries(usage)
    .filter(([, u]) => u.positions.length === 0 && u.projects.length === 0 && u.events.length === 0)
    .map(([id]) => id);
}
