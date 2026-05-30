import type { Education } from "@/content/types";
import { sortEducationForList } from "@/lib/education-sort";
import { EducationEntry } from "./EducationEntry";

export function EducationList({
  entries,
  emptyMessage = "No education entries yet.",
}: {
  entries: readonly Education[];
  emptyMessage?: string;
}) {
  if (entries.length === 0) {
    return (
      <p
        role="status"
        className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
      >
        {emptyMessage}
      </p>
    );
  }
  const sorted = sortEducationForList(entries);
  return (
    <ol aria-label="Education" className="space-y-6">
      {sorted.map((entry) => (
        <li key={entry.id} className="list-none">
          <EducationEntry entry={entry} />
        </li>
      ))}
    </ol>
  );
}
