import type { Skill } from "@/content/types";

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

export function groupSkillsByCategory(skills: readonly Skill[]): SkillGroup[] {
  const byCategory = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = byCategory.get(skill.category);
    if (list) list.push(skill);
    else byCategory.set(skill.category, [skill]);
  }

  const groups: SkillGroup[] = Array.from(byCategory.entries()).map(([category, list]) => ({
    category,
    skills: [...list].sort((a, b) => a.name.localeCompare(b.name)),
  }));
  groups.sort((a, b) => a.category.localeCompare(b.category));
  return groups;
}
