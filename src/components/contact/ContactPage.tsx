import type { Site } from "@/content/types";

export function ContactPage({ site }: { site: Site }) {
  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Get in touch</p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Contact</h1>
        <p className="text-sm leading-relaxed text-neutral-700">
          The fastest way to reach {site.ownerName} is by email. If you’d like a real-time
          conversation, the scheduling link is the next-fastest path.
        </p>
      </header>

      <section aria-labelledby="contact-email-heading" className="space-y-2">
        <h2
          id="contact-email-heading"
          className="text-sm font-medium uppercase tracking-wide text-neutral-500"
        >
          Email
        </h2>
        <p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            {site.contactEmail}
          </a>
        </p>
        <p className="text-xs text-neutral-500">
          Opens your default mail client with the address pre-filled.
        </p>
      </section>

      {site.bookingUrl ? (
        <section aria-labelledby="contact-booking-heading" className="space-y-2">
          <h2
            id="contact-booking-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Book a call
          </h2>
          <p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Book a time on {site.ownerName}’s calendar →
            </a>
          </p>
          <p className="text-xs text-neutral-500">Opens in a new tab.</p>
        </section>
      ) : null}

      {site.socialLinks && site.socialLinks.length > 0 ? (
        <section aria-labelledby="contact-elsewhere-heading" className="space-y-2">
          <h2
            id="contact-elsewhere-heading"
            className="text-sm font-medium uppercase tracking-wide text-neutral-500"
          >
            Elsewhere
          </h2>
          <ul className="space-y-1 text-sm">
            {site.socialLinks.map((link) => (
              <li key={link.url} className="list-none">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 underline-offset-2 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
