export function Highlights({
  items,
  label = "Highlights",
}: {
  items: readonly string[] | undefined;
  label?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section aria-labelledby="highlights-heading">
      <h3
        id="highlights-heading"
        className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
