import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearContentCache, loadContent } from "@/content/load";

type ContentFiles = {
  site?: unknown;
  employers?: unknown;
  positions?: unknown;
  projects?: unknown;
  events?: unknown;
  skills?: unknown;
  education?: unknown;
  now?: unknown;
};

const VALID: Required<ContentFiles> = {
  site: {
    ownerName: "Alex Rivera",
    tagline: "Engineer and producer.",
    contactEmail: "alex@example.com",
    careers: [
      { id: "software", label: "Software", order: 0 },
      { id: "events", label: "Events", order: 1 },
    ],
  },
  employers: [{ id: "emp", name: "Emp Co." }],
  positions: [
    {
      id: "pos-soft",
      employerId: "emp",
      title: "Engineer",
      career: "software",
      startDate: "2020-01",
      summary: "Did things.",
      skillIds: ["ts"],
    },
    {
      id: "pos-events",
      employerId: "emp",
      title: "Producer",
      career: "events",
      startDate: "2022-01",
      summary: "Did events.",
    },
  ],
  projects: [
    {
      id: "pr1",
      positionId: "pos-soft",
      name: "Thing",
      summary: "Did it.",
      skillIds: ["ts"],
    },
  ],
  events: [
    {
      id: "ev1",
      positionId: "pos-events",
      name: "Gala",
      date: "2024-01-01",
      role: "Producer",
      summary: "Did it.",
    },
  ],
  skills: [{ id: "ts", name: "TypeScript", category: "language" }],
  education: [{ id: "edu1", institution: "U", credential: "BS" }],
  now: { lastUpdated: "2024-01-15", body: "Doing things." },
};

function writeFixture(files: ContentFiles): string {
  const dir = mkdtempSync(join(tmpdir(), "resume-content-"));
  const all: ContentFiles = { ...VALID, ...files };
  writeFileSync(join(dir, "site.json"), JSON.stringify(all.site));
  writeFileSync(join(dir, "employers.json"), JSON.stringify(all.employers));
  writeFileSync(join(dir, "positions.json"), JSON.stringify(all.positions));
  writeFileSync(join(dir, "projects.json"), JSON.stringify(all.projects));
  writeFileSync(join(dir, "events.json"), JSON.stringify(all.events));
  writeFileSync(join(dir, "skills.json"), JSON.stringify(all.skills));
  writeFileSync(join(dir, "education.json"), JSON.stringify(all.education));
  writeFileSync(join(dir, "now.json"), JSON.stringify(all.now));
  return dir;
}

const dirs: string[] = [];
function fixture(files: ContentFiles = {}): string {
  const dir = writeFixture(files);
  dirs.push(dir);
  return dir;
}

beforeEach(() => clearContentCache());
afterEach(() => {
  while (dirs.length > 0) {
    const d = dirs.pop();
    if (d) rmSync(d, { recursive: true, force: true });
  }
});

describe("loadContent — happy path", () => {
  it("loads, validates, and joins the graph", () => {
    const content = loadContent({ contentDir: fixture(), cache: false });

    expect(content.site.ownerName).toBe("Alex Rivera");
    expect(content.positions).toHaveLength(2);

    const soft = content.positions.find((p) => p.id === "pos-soft");
    expect(soft?.employer.name).toBe("Emp Co.");
    expect(soft?.projects.map((p) => p.id)).toEqual(["pr1"]);
    expect(soft?.skills.map((s) => s.id)).toEqual(["ts"]);

    const events = content.positions.find((p) => p.id === "pos-events");
    expect(events?.events.map((e) => e.id)).toEqual(["ev1"]);

    expect(content.skillUsage.ts?.positions.map((p) => p.id)).toEqual(["pos-soft"]);
    expect(content.skillUsage.ts?.projects.map((p) => p.id)).toEqual(["pr1"]);
  });

  it("loads the project's seed content under /content/", () => {
    const content = loadContent({ cache: false });
    expect(content.site.ownerName.length).toBeGreaterThan(0);
    expect(content.positions.length).toBeGreaterThan(0);
    expect(content.skills.length).toBeGreaterThan(0);
  });

  it("memoizes per directory when cache is enabled", () => {
    const dir = fixture();
    const a = loadContent({ contentDir: dir });
    const b = loadContent({ contentDir: dir });
    expect(a).toBe(b);
  });
});

describe("loadContent — reference errors", () => {
  it("flags an unknown employerId with file and field path", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          positions: [
            {
              id: "pos-soft",
              employerId: "ghost",
              title: "Engineer",
              career: "software",
              startDate: "2020-01",
              summary: "Did things.",
            },
          ],
        }),
        cache: false,
      }),
    ).toThrow(/positions\.json:\[0\]\.employerId.*ghost.*does not match any employer id/);
  });

  it("flags an unknown skillId from a position", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          positions: [
            {
              id: "pos-soft",
              employerId: "emp",
              title: "Engineer",
              career: "software",
              startDate: "2020-01",
              summary: "Did things.",
              skillIds: ["ts", "ghost"],
            },
          ],
        }),
        cache: false,
      }),
    ).toThrow(/positions\.json:\[0\]\.skillIds\[1\].*ghost.*does not match any skill id/);
  });

  it("flags a position whose career is not in Site.careers", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          positions: [
            {
              id: "pos-soft",
              employerId: "emp",
              title: "Engineer",
              career: "consulting",
              startDate: "2020-01",
              summary: "Did things.",
            },
          ],
        }),
        cache: false,
      }),
    ).toThrow(/positions\.json:\[0\]\.career.*consulting.*is not in Site\.careers/);
  });

  it("flags an unknown positionId from a project", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          projects: [{ id: "pr1", positionId: "ghost", name: "Thing", summary: "Did it." }],
        }),
        cache: false,
      }),
    ).toThrow(/projects\.json:\[0\]\.positionId.*ghost/);
  });
});

describe("loadContent — uniqueness and schema errors", () => {
  it("flags duplicate ids within an entity file", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          employers: [
            { id: "emp", name: "A" },
            { id: "emp", name: "B" },
          ],
        }),
        cache: false,
      }),
    ).toThrow(/employers\.json:\[1\]\.id.*duplicate id 'emp'/);
  });

  it("emits the [content] <file>:<jsonPath> — <message> error format for schema failures", () => {
    try {
      loadContent({
        contentDir: fixture({
          positions: [
            {
              id: "Pos-Bad",
              employerId: "emp",
              title: "Engineer",
              career: "software",
              startDate: "2020-01",
              summary: "Did things.",
            },
          ],
        }),
        cache: false,
      });
      throw new Error("expected loadContent to throw");
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).toMatch(/^\[content\] positions\.json:\[0\]\.id — /);
    }
  });

  it("rejects unknown fields via strict objects", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          employers: [{ id: "emp", name: "A", bogus: 1 }],
        }),
        cache: false,
      }),
    ).toThrow(/employers\.json:\[0\]/);
  });
});

describe("loadContent — unreferenced skills warning (FEAT-003 US-2)", () => {
  it("emits a console.warn listing unused skill ids and still loads successfully", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const content = loadContent({
        contentDir: fixture({
          skills: [
            { id: "ts", name: "TypeScript", category: "language" },
            { id: "ghost", name: "Ghost", category: "language" },
          ],
        }),
        cache: false,
      });
      expect(content.skills).toHaveLength(2);
      expect(warn).toHaveBeenCalledTimes(1);
      const message = warn.mock.calls[0]?.[0];
      expect(message).toMatch(/skills\.json/);
      expect(message).toMatch(/ghost/);
      expect(message).not.toMatch(/\bts\b(?!,)/); // 'ts' is referenced, must not appear
    } finally {
      warn.mockRestore();
    }
  });

  it("does not warn when every skill is referenced", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      loadContent({ contentDir: fixture(), cache: false });
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});

describe("loadContent — now.json (FEAT-009)", () => {
  it("loads the Now record and exposes it on JoinedContent", () => {
    const content = loadContent({
      contentDir: fixture({
        now: {
          lastUpdated: "2025-03-04",
          body: "Working on the resume site.",
          bullets: ["Bullet one"],
        },
      }),
      cache: false,
    });
    expect(content.now.lastUpdated).toBe("2025-03-04");
    expect(content.now.body).toBe("Working on the resume site.");
    expect(content.now.bullets).toEqual(["Bullet one"]);
  });

  it("emits a console.warn (not an error) when lastUpdated is in the future", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      loadContent({
        contentDir: fixture({
          now: { lastUpdated: "2999-01-01", body: "Future-dated." },
        }),
        cache: false,
      });
      const messages = warn.mock.calls.map((c) => String(c[0]));
      expect(messages.some((m) => /now\.json:lastUpdated.*future/.test(m))).toBe(true);
    } finally {
      warn.mockRestore();
    }
  });

  it("does not warn when lastUpdated is today or in the past", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      loadContent({
        contentDir: fixture({
          now: { lastUpdated: "2020-01-01", body: "Old." },
        }),
        cache: false,
      });
      const messages = warn.mock.calls.map((c) => String(c[0]));
      expect(messages.some((m) => /now\.json:lastUpdated.*future/.test(m))).toBe(false);
    } finally {
      warn.mockRestore();
    }
  });

  it("fails the build when now.json is missing", () => {
    // Build a fixture that includes everything BUT now.json by deleting after writeFixture.
    const dir = fixture();
    rmSync(join(dir, "now.json"));
    expect(() => loadContent({ contentDir: dir, cache: false })).toThrow(/now\.json/);
  });

  it("fails the build with the [content] file:path — message format when now.json is malformed", () => {
    expect(() =>
      loadContent({
        contentDir: fixture({
          now: { lastUpdated: "not-a-date", body: "x" },
        }),
        cache: false,
      }),
    ).toThrow(/^\[content\] now\.json:lastUpdated — /m);
  });
});
