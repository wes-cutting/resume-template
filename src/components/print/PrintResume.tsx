import type { Education, PositionJoined, Site, Skill } from "@/content/types";
import { sortPositionsForTimeline } from "@/lib/position-sort";
import { PrintHeader } from "./PrintHeader";
import { PrintPositionBlock } from "./PrintPositionBlock";
import { PrintSkillsSection } from "./PrintSkillsSection";
import { PrintEducationSection } from "./PrintEducationSection";

export function PrintResume({
  site,
  positions,
  skills,
  education,
  variantLabel,
}: {
  site: Site;
  positions: readonly PositionJoined[];
  skills: readonly Skill[];
  education: readonly Education[];
  variantLabel?: string;
}) {
  const sorted = sortPositionsForTimeline(positions);
  return (
    <article className="print-resume mx-auto max-w-[8.5in] space-y-5 px-6 py-8 text-neutral-900">
      <PrintHeader site={site} variantLabel={variantLabel} />

      <section aria-labelledby="print-experience-heading" className="space-y-4">
        <h2
          id="print-experience-heading"
          className="break-after-avoid text-sm font-semibold uppercase tracking-wider text-neutral-900"
        >
          Experience
        </h2>
        {sorted.length === 0 ? (
          <p className="text-xs text-neutral-700">No experience entries yet.</p>
        ) : (
          sorted.map((position) => <PrintPositionBlock key={position.id} position={position} />)
        )}
      </section>

      <PrintSkillsSection skills={skills} />
      <PrintEducationSection education={education} />
    </article>
  );
}
