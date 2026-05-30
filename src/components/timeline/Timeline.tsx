import type { PositionJoined, SiteCareer } from "@/content/types";
import { PositionCard } from "./PositionCard";

export function Timeline({
  positions,
  careers,
  emptyMessage = "No positions yet — check back soon.",
}: {
  positions: readonly PositionJoined[];
  careers: readonly SiteCareer[];
  emptyMessage?: string;
}) {
  if (positions.length === 0) {
    return (
      <p
        role="status"
        className="rounded-md border border-dashed border-input bg-card px-4 py-6 text-center text-sm text-muted-foreground"
      >
        {emptyMessage}
      </p>
    );
  }

  const careerById = new Map(careers.map((c) => [c.id, c]));

  return (
    <ol aria-label="Career timeline" className="space-y-4">
      {positions.map((position) => {
        const career = careerById.get(position.career);
        if (!career)
          throw new Error(`unreachable: position ${position.id} references unknown career`);
        return <PositionCard key={position.id} position={position} career={career} />;
      })}
    </ol>
  );
}
