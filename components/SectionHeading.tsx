/**
 * A label, a rule, and a heading. No reference designators, no ornament —
 * the hairline is the only structural device on the site.
 */
export default function SectionHeading({
  label,
  title,
  srTitle,
  intro,
}: {
  label: string;
  title: string;
  /** Plain-language heading text for screen readers and search engines. */
  srTitle?: string;
  intro?: string;
}) {
  return (
    <header className="mb-10">
      <p className="label">{label}</p>
      <div className="mt-4 hairline" />

      <h2 className="mt-6 max-w-[20ch] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        <span aria-hidden={srTitle ? "true" : undefined}>{title}</span>
        {srTitle ? <span className="sr-only">{srTitle}</span> : null}
      </h2>

      {intro ? (
        <p className="mt-4 max-w-measure leading-relaxed text-muted">{intro}</p>
      ) : null}
    </header>
  );
}
