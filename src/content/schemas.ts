import { z } from "zod";

export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug");

export const monthDate = z.string().regex(/^[0-9]{4}-(0[1-9]|1[0-2])$/, "must be YYYY-MM");

export const dayDate = z
  .string()
  .regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, "must be YYYY-MM-DD");

export const httpsUrl = z
  .string()
  .url("must be a valid URL")
  .refine((v) => v.startsWith("https://"), { message: "must use https://" });

export const SiteCareerSchema = z
  .object({
    id: slug,
    label: z.string().min(1),
    order: z.number().int().nonnegative(),
  })
  .strict();

export const SiteSchema = z
  .object({
    ownerName: z.string().min(1).max(100),
    tagline: z.string().min(1).max(160),
    contactEmail: z.string().email(),
    location: z.string().optional(),
    socialLinks: z
      .array(
        z
          .object({
            label: z.string().min(1),
            url: httpsUrl,
          })
          .strict(),
      )
      .optional(),
    careers: z.array(SiteCareerSchema).min(1),
    siteUrl: httpsUrl.optional(),
    repoUrl: httpsUrl.optional(),
    bookingUrl: httpsUrl.optional(),
  })
  .strict();

export const EmployerSchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(100),
    website: httpsUrl.optional(),
    location: z.string().optional(),
    description: z.string().max(200).optional(),
  })
  .strict();

export const PositionSchema = z
  .object({
    id: slug,
    employerId: slug,
    title: z.string().min(1).max(120),
    career: slug,
    startDate: monthDate,
    endDate: monthDate.optional(),
    summary: z.string().min(1).max(500),
    highlights: z.array(z.string().min(1).max(200)).optional(),
    skillIds: z.array(slug).optional(),
    location: z.string().optional(),
  })
  .strict()
  .refine((p) => p.endDate === undefined || p.endDate >= p.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

export const ProjectSchema = z
  .object({
    id: slug,
    positionId: slug,
    name: z.string().min(1).max(120),
    summary: z.string().min(1).max(500),
    highlights: z.array(z.string().min(1).max(200)).optional(),
    skillIds: z.array(slug).optional(),
    links: z
      .array(
        z
          .object({
            label: z.string().min(1),
            url: httpsUrl,
          })
          .strict(),
      )
      .optional(),
    confidential: z.boolean().optional().default(false),
    confidentialLabel: z.string().min(1).max(120).optional(),
  })
  .strict();

export const EventSchema = z
  .object({
    id: slug,
    positionId: slug,
    name: z.string().min(1).max(160),
    client: z.string().optional(),
    date: dayDate,
    venue: z.string().optional(),
    attendance: z.number().int().nonnegative().optional(),
    role: z.string().min(1).max(120),
    summary: z.string().min(1).max(500),
    highlights: z.array(z.string().min(1).max(200)).optional(),
    skillIds: z.array(slug).optional(),
  })
  .strict();

export const SkillSchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(80),
    category: z.string().min(1),
    proficiency: z.number().int().min(1).max(5).optional(),
    description: z.string().max(200).optional(),
  })
  .strict();

export const EducationSchema = z
  .object({
    id: slug,
    institution: z.string().min(1),
    credential: z.string().min(1),
    field: z.string().optional(),
    startDate: monthDate.optional(),
    endDate: monthDate.optional(),
    highlights: z.array(z.string().min(1).max(200)).optional(),
  })
  .strict();

export const NowSchema = z
  .object({
    lastUpdated: dayDate,
    body: z.string().min(1).max(2000),
    bullets: z.array(z.string().min(1).max(200)).optional(),
  })
  .strict();

export const EmployersFileSchema = z.array(EmployerSchema);
export const PositionsFileSchema = z.array(PositionSchema);
export const ProjectsFileSchema = z.array(ProjectSchema);
export const EventsFileSchema = z.array(EventSchema);
export const SkillsFileSchema = z.array(SkillSchema);
export const EducationFileSchema = z.array(EducationSchema);
