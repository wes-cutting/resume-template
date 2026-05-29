import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
    >
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
