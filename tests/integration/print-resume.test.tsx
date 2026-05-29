import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Education, Site } from "@/content/types";
import { PrintResume } from "@/components/print/PrintResume";
import { positionsByCareer } from "@/lib/position-filter";
import { skillsReferencedBy } from "@/lib/skill-filtering";
import { makeEvent, makePosition, makeProject, makeSkill } from "./fixtures";

afterEach(() => cleanup());

const SITE: Site = {
  ownerName: "Alex Rivera",
  tagline: "Engineer and producer.",
  contactEmail: "alex@example.com",
  location: "Brooklyn, NY",
  socialLinks: [{ label: "GitHub", url: "https://github.com/alex" }],
  careers: [
    { id: "software", label: "Software Engineering", order: 0 },
    { id: "events", label: "Event Production & Operations", order: 1 },
  ],
};

const TS = makeSkill("ts", "TypeScript", "language");
const PY = makeSkill("py", "Python", "language");
const AV = makeSkill("av", "AV systems", "vendor-tools");
const UNUSED = makeSkill("ghost", "Ghost", "language");
const ALL_SKILLS = [TS, PY, AV, UNUSED];

function buildFixtures() {
  const softwarePos = makePosition({
    id: "sw-pos",
    title: "Senior Engineer",
    career: "software",
    startDate: "2022-03",
    employerName: "Aurora Stack Co.",
    skills: [TS, PY],
  });
  const eventsPos = makePosition({
    id: "ev-pos",
    title: "Lead Producer",
    career: "events",
    startDate: "2023-06",
    employerName: "Lumenfield Productions",
    skills: [AV],
  });
  makeProject({ id: "ing", name: "Ingest Rewrite", position: softwarePos, skills: [TS] });
  makeEvent({
    id: "fest",
    name: "Harborlights Festival",
    position: eventsPos,
    date: "2024-07-13",
    role: "Producer",
    skills: [AV],
  });
  return { softwarePos, eventsPos };
}

const EDUCATION: Education[] = [
  {
    id: "bs",
    institution: "State University",
    credential: "B.S. Computer Science",
    field: "Computer Science",
    startDate: "2013-09",
    endDate: "2017-05",
  },
];

describe("PrintResume — unified variant (/print)", () => {
  it("renders header, both tracks of experience, all referenced skills, and education", () => {
    const { softwarePos, eventsPos } = buildFixtures();
    render(
      <PrintResume
        site={SITE}
        positions={[softwarePos, eventsPos]}
        skills={[TS, PY, AV]}
        education={EDUCATION}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Alex Rivera");
    expect(screen.getByText("alex@example.com", { exact: false })).toBeInTheDocument();

    const experience = screen.getByRole("region", { name: /experience/i });
    expect(within(experience).getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(within(experience).getByText(/Lead Producer/)).toBeInTheDocument();

    const skills = screen.getByRole("region", { name: /skills/i });
    expect(within(skills).getByText(/TypeScript/)).toBeInTheDocument();
    expect(within(skills).getByText(/AV systems/)).toBeInTheDocument();

    const education = screen.getByRole("region", { name: /education/i });
    expect(within(education).getByText(/B\.S\. Computer Science/)).toBeInTheDocument();
  });

  it("does not show a per-variant label in unified", () => {
    const { softwarePos } = buildFixtures();
    render(
      <PrintResume site={SITE} positions={[softwarePos]} skills={[TS]} education={EDUCATION} />,
    );
    expect(screen.queryByText("Software Engineering")).not.toBeInTheDocument();
    expect(screen.queryByText("Event Production & Operations")).not.toBeInTheDocument();
  });
});

describe("PrintResume — per-variant (/print/software, /print/events)", () => {
  it("limits experience to the matching career", () => {
    const { softwarePos, eventsPos } = buildFixtures();
    const allPositions = [softwarePos, eventsPos];
    const trackPositions = positionsByCareer(allPositions, "software");
    render(
      <PrintResume
        site={SITE}
        positions={trackPositions}
        skills={ALL_SKILLS}
        education={EDUCATION}
        variantLabel="Software Engineering"
      />,
    );
    expect(screen.getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(screen.queryByText(/Lead Producer/)).toBeNull();
    expect(screen.getByText("Software Engineering")).toBeInTheDocument();
  });

  it("limits the skills section to skills referenced by the included entities", () => {
    const { softwarePos, eventsPos } = buildFixtures();
    const trackPositions = positionsByCareer([softwarePos, eventsPos], "events");
    const trackProjects = trackPositions.flatMap((p) => p.projects);
    const trackEvents = trackPositions.flatMap((p) => p.events);
    const trackSkills = skillsReferencedBy(trackPositions, trackProjects, trackEvents, ALL_SKILLS);
    render(
      <PrintResume
        site={SITE}
        positions={trackPositions}
        skills={trackSkills}
        education={EDUCATION}
        variantLabel="Event Production & Operations"
      />,
    );
    const skills = screen.getByRole("region", { name: /skills/i });
    expect(within(skills).getByText(/AV systems/)).toBeInTheDocument();
    expect(within(skills).queryByText(/TypeScript/)).toBeNull();
    expect(within(skills).queryByText(/Python/)).toBeNull();
  });

  it("always includes the education section regardless of variant", () => {
    const { softwarePos } = buildFixtures();
    render(
      <PrintResume
        site={SITE}
        positions={[softwarePos]}
        skills={[TS]}
        education={EDUCATION}
        variantLabel="Software Engineering"
      />,
    );
    expect(screen.getByRole("region", { name: /education/i })).toBeInTheDocument();
  });
});
