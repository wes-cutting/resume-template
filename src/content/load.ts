import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z, type ZodTypeAny } from "zod";

import { buildSkillUsage, unreferencedSkillIds } from "@/lib/skill-usage";
import {
  EducationFileSchema,
  EmployersFileSchema,
  EventsFileSchema,
  PositionsFileSchema,
  ProjectsFileSchema,
  SiteSchema,
  SkillsFileSchema,
} from "./schemas";
import type {
  Education,
  Employer,
  Event,
  EventJoined,
  JoinedContent,
  Position,
  PositionJoined,
  Project,
  ProjectJoined,
  Site,
  Skill,
} from "./types";

const CONTENT_FILES = {
  site: "site.json",
  employers: "employers.json",
  positions: "positions.json",
  projects: "projects.json",
  events: "events.json",
  skills: "skills.json",
  education: "education.json",
} as const;

const cache = new Map<string, JoinedContent>();

export function loadContent(opts?: { contentDir?: string; cache?: boolean }): JoinedContent {
  const contentDir = opts?.contentDir ?? join(process.cwd(), "content");
  const useCache = opts?.cache ?? true;

  if (useCache) {
    const cached = cache.get(contentDir);
    if (cached) return cached;
  }

  const errors: string[] = [];

  const site = parseFile(contentDir, CONTENT_FILES.site, SiteSchema, errors);
  const employers = parseFile(contentDir, CONTENT_FILES.employers, EmployersFileSchema, errors);
  const positions = parseFile(contentDir, CONTENT_FILES.positions, PositionsFileSchema, errors);
  const projects = parseFile(contentDir, CONTENT_FILES.projects, ProjectsFileSchema, errors);
  const events = parseFile(contentDir, CONTENT_FILES.events, EventsFileSchema, errors);
  const skills = parseFile(contentDir, CONTENT_FILES.skills, SkillsFileSchema, errors);
  const education = parseFile(contentDir, CONTENT_FILES.education, EducationFileSchema, errors);

  if (errors.length > 0) throw new Error(errors.join("\n"));

  const validatedSite = site as Site;
  const validatedEmployers = employers as Employer[];
  const validatedPositions = positions as Position[];
  const validatedProjects = projects as Project[];
  const validatedEvents = events as Event[];
  const validatedSkills = skills as Skill[];
  const validatedEducation = education as Education[];

  checkUniqueIds(CONTENT_FILES.employers, validatedEmployers, errors);
  checkUniqueIds(CONTENT_FILES.positions, validatedPositions, errors);
  checkUniqueIds(CONTENT_FILES.projects, validatedProjects, errors);
  checkUniqueIds(CONTENT_FILES.events, validatedEvents, errors);
  checkUniqueIds(CONTENT_FILES.skills, validatedSkills, errors);
  checkUniqueIds(CONTENT_FILES.education, validatedEducation, errors);
  checkUniqueIds(
    `${CONTENT_FILES.site}:careers`,
    validatedSite.careers.map((c) => ({ id: c.id })),
    errors,
  );

  if (errors.length > 0) throw new Error(errors.join("\n"));

  const employerById = new Map(validatedEmployers.map((e) => [e.id, e]));
  const skillById = new Map(validatedSkills.map((s) => [s.id, s]));
  const careerIds = new Set(validatedSite.careers.map((c) => c.id));

  validatedPositions.forEach((p, i) => {
    if (!employerById.has(p.employerId)) {
      errors.push(
        formatError(
          CONTENT_FILES.positions,
          [i, "employerId"],
          `value '${p.employerId}' does not match any employer id`,
        ),
      );
    }
    if (!careerIds.has(p.career)) {
      errors.push(
        formatError(
          CONTENT_FILES.positions,
          [i, "career"],
          `value '${p.career}' is not in Site.careers`,
        ),
      );
    }
    (p.skillIds ?? []).forEach((sid, j) => {
      if (!skillById.has(sid)) {
        errors.push(
          formatError(
            CONTENT_FILES.positions,
            [i, "skillIds", j],
            `value '${sid}' does not match any skill id`,
          ),
        );
      }
    });
  });

  const positionById = new Map(validatedPositions.map((p) => [p.id, p]));

  validatedProjects.forEach((pr, i) => {
    if (!positionById.has(pr.positionId)) {
      errors.push(
        formatError(
          CONTENT_FILES.projects,
          [i, "positionId"],
          `value '${pr.positionId}' does not match any position id`,
        ),
      );
    }
    (pr.skillIds ?? []).forEach((sid, j) => {
      if (!skillById.has(sid)) {
        errors.push(
          formatError(
            CONTENT_FILES.projects,
            [i, "skillIds", j],
            `value '${sid}' does not match any skill id`,
          ),
        );
      }
    });
  });

  validatedEvents.forEach((ev, i) => {
    if (!positionById.has(ev.positionId)) {
      errors.push(
        formatError(
          CONTENT_FILES.events,
          [i, "positionId"],
          `value '${ev.positionId}' does not match any position id`,
        ),
      );
    }
    (ev.skillIds ?? []).forEach((sid, j) => {
      if (!skillById.has(sid)) {
        errors.push(
          formatError(
            CONTENT_FILES.events,
            [i, "skillIds", j],
            `value '${sid}' does not match any skill id`,
          ),
        );
      }
    });
  });

  if (errors.length > 0) throw new Error(errors.join("\n"));

  const positionsJoined: PositionJoined[] = validatedPositions.map((p) => {
    const employer = employerById.get(p.employerId);
    if (!employer)
      throw new Error(`unreachable: employer ${p.employerId} missing after validation`);
    return {
      ...p,
      employer,
      projects: [],
      events: [],
      skills: (p.skillIds ?? []).map((id) => requireSkill(skillById, id)),
    };
  });

  const positionJoinedById = new Map(positionsJoined.map((p) => [p.id, p]));

  const projectsJoined: ProjectJoined[] = validatedProjects.map((pr) => {
    const position = positionJoinedById.get(pr.positionId);
    if (!position)
      throw new Error(`unreachable: position ${pr.positionId} missing after validation`);
    return {
      ...pr,
      position,
      skills: (pr.skillIds ?? []).map((id) => requireSkill(skillById, id)),
    };
  });

  const eventsJoined: EventJoined[] = validatedEvents.map((ev) => {
    const position = positionJoinedById.get(ev.positionId);
    if (!position)
      throw new Error(`unreachable: position ${ev.positionId} missing after validation`);
    return {
      ...ev,
      position,
      skills: (ev.skillIds ?? []).map((id) => requireSkill(skillById, id)),
    };
  });

  for (const proj of projectsJoined) proj.position.projects.push(proj);
  for (const ev of eventsJoined) ev.position.events.push(ev);

  const skillUsage = buildSkillUsage(
    validatedSkills,
    positionsJoined,
    projectsJoined,
    eventsJoined,
  );

  const result: JoinedContent = {
    site: validatedSite,
    employers: validatedEmployers,
    positions: positionsJoined,
    projects: projectsJoined,
    events: eventsJoined,
    skills: validatedSkills,
    skillUsage,
    education: validatedEducation,
  };

  const unused = unreferencedSkillIds(skillUsage);
  if (unused.length > 0) {
    console.warn(
      `[content] skills.json — ${unused.length} skill(s) not referenced by any position, project, or event: ${unused.join(", ")}`,
    );
  }

  if (useCache) cache.set(contentDir, result);
  return result;
}

export function clearContentCache(): void {
  cache.clear();
}

function parseFile<S extends ZodTypeAny>(
  dir: string,
  filename: string,
  schema: S,
  errors: string[],
): z.infer<S> | undefined {
  const filepath = join(dir, filename);
  let raw: string;
  try {
    raw = readFileSync(filepath, "utf8");
  } catch {
    errors.push(formatError(filename, [], `file not found at ${filepath}`));
    return undefined;
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    errors.push(formatError(filename, [], `invalid JSON — ${message}`));
    return undefined;
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(formatError(filename, [...issue.path], issue.message));
    }
    return undefined;
  }
  return parsed.data;
}

function checkUniqueIds(label: string, items: readonly { id: string }[], errors: string[]): void {
  const seen = new Map<string, number>();
  items.forEach((item, i) => {
    const prev = seen.get(item.id);
    if (prev !== undefined) {
      errors.push(
        formatError(label, [i, "id"], `duplicate id '${item.id}' (also at index ${prev})`),
      );
    } else {
      seen.set(item.id, i);
    }
  });
}

function requireSkill(skillById: Map<string, Skill>, id: string): Skill {
  const s = skillById.get(id);
  if (!s) throw new Error(`unreachable: skill ${id} missing after validation`);
  return s;
}

function formatError(file: string, path: (string | number)[], message: string): string {
  return `[content] ${file}:${formatJsonPath(path)} — ${message}`;
}

function formatJsonPath(path: (string | number)[]): string {
  if (path.length === 0) return "";
  return path
    .map((segment, i) => {
      if (typeof segment === "number") return `[${segment}]`;
      return i === 0 ? segment : `.${segment}`;
    })
    .join("");
}
