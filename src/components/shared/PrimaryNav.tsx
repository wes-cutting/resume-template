import Link from "next/link";

const ACTIVE_CLASSES = "bg-accent text-accent-foreground";
const INACTIVE_CLASSES = "bg-background text-muted-foreground hover:bg-muted";

const ITEMS = [
  { id: "skills", label: "Skills", href: "/skills" },
  { id: "education", label: "Education", href: "/education" },
  { id: "now", label: "Now", href: "/now" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "print", label: "Print", href: "/print" },
] as const;

export type PrimaryNavId = (typeof ITEMS)[number]["id"];

export function PrimaryNav({ activeNav }: { activeNav?: PrimaryNavId }) {
  return (
    <nav aria-label="Primary pages" className="flex flex-wrap items-center gap-2">
      {ITEMS.map((item) => {
        const isActive = item.id === activeNav;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ring-border ${
              isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
