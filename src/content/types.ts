import type { z } from "zod";
import type {
  EducationSchema,
  EmployerSchema,
  EventSchema,
  PositionSchema,
  ProjectSchema,
  SiteCareerSchema,
  SiteSchema,
  SkillSchema,
} from "./schemas";

export type Site = z.infer<typeof SiteSchema>;
export type SiteCareer = z.infer<typeof SiteCareerSchema>;
export type Employer = z.infer<typeof EmployerSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Education = z.infer<typeof EducationSchema>;

export type PositionJoined = Position & {
  employer: Employer;
  projects: ProjectJoined[];
  events: EventJoined[];
  skills: Skill[];
};

export type ProjectJoined = Project & {
  position: PositionJoined;
  skills: Skill[];
};

export type EventJoined = Event & {
  position: PositionJoined;
  skills: Skill[];
};

export type SkillUsage = {
  positions: PositionJoined[];
  projects: ProjectJoined[];
  events: EventJoined[];
};

export type JoinedContent = {
  site: Site;
  employers: Employer[];
  positions: PositionJoined[];
  projects: ProjectJoined[];
  events: EventJoined[];
  skills: Skill[];
  skillUsage: Record<string, SkillUsage>;
  education: Education[];
};
