const MAX = 5;

export function ProficiencyDots({ value }: { value: number | undefined }) {
  if (value === undefined) return null;
  const clamped = Math.max(1, Math.min(MAX, value));
  return (
    <span
      role="img"
      aria-label={`Proficiency: ${clamped} out of ${MAX}`}
      className="inline-flex items-center gap-0.5 align-middle"
    >
      {Array.from({ length: MAX }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < clamped ? "bg-foreground" : "bg-input"
          }`}
        />
      ))}
    </span>
  );
}
