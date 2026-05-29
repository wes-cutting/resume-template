import type {
  Employer,
  EventJoined,
  PositionJoined,
  ProjectJoined,
  Skill,
  SiteCareer,
} from "@/content/types";

export const SOFTWARE_CAREER: SiteCareer = {
  id: "software",
  label: "Software Engineering",
  order: 0,
};

export const EVENTS_CAREER: SiteCareer = {
  id: "events",
  label: "Event Production & Operations",
  order: 1,
};

export const DEFAULT_CAREERS: SiteCareer[] = [SOFTWARE_CAREER, EVENTS_CAREER];

const sampleEmployer = (id: string, name: string): Employer => ({ id, name });

export function makePosition(input: {
  id: string;
  title: string;
  career: string;
  startDate: string;
  endDate?: string;
  employerId?: string;
  employerName?: string;
  employerWebsite?: string;
  summary?: string;
  highlights?: string[];
  location?: string;
  skills?: Skill[];
}): PositionJoined {
  const employer: Employer = {
    ...sampleEmployer(input.employerId ?? `${input.id}-emp`, input.employerName ?? "Test Employer"),
    ...(input.employerWebsite ? { website: input.employerWebsite } : {}),
  };
  return {
    id: input.id,
    employerId: employer.id,
    title: input.title,
    career: input.career,
    startDate: input.startDate,
    endDate: input.endDate,
    summary: input.summary ?? "A short summary.",
    highlights: input.highlights,
    location: input.location,
    employer,
    projects: [],
    events: [],
    skills: input.skills ?? [],
  };
}

export function makeSkill(id: string, name?: string, category: string = "test"): Skill {
  return { id, name: name ?? id, category };
}

export function makeProject(input: {
  id: string;
  name: string;
  position: PositionJoined;
  summary?: string;
  highlights?: string[];
  skills?: Skill[];
  links?: { label: string; url: string }[];
  confidential?: boolean;
  confidentialLabel?: string;
}): ProjectJoined {
  const project: ProjectJoined = {
    id: input.id,
    positionId: input.position.id,
    name: input.name,
    summary: input.summary ?? "A short summary.",
    highlights: input.highlights,
    skillIds: input.skills?.map((s) => s.id),
    links: input.links,
    confidential: input.confidential ?? false,
    confidentialLabel: input.confidentialLabel,
    position: input.position,
    skills: input.skills ?? [],
  };
  input.position.projects.push(project);
  return project;
}

export function makeEvent(input: {
  id: string;
  name: string;
  position: PositionJoined;
  date: string;
  role: string;
  summary?: string;
  client?: string;
  venue?: string;
  attendance?: number;
  highlights?: string[];
  skills?: Skill[];
}): EventJoined {
  const event: EventJoined = {
    id: input.id,
    positionId: input.position.id,
    name: input.name,
    client: input.client,
    date: input.date,
    venue: input.venue,
    attendance: input.attendance,
    role: input.role,
    summary: input.summary ?? "A short summary.",
    highlights: input.highlights,
    skillIds: input.skills?.map((s) => s.id),
    position: input.position,
    skills: input.skills ?? [],
  };
  input.position.events.push(event);
  return event;
}
