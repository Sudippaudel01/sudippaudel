/**
 * Section header with a silkscreen reference designator (U1, U2, …) and
 * a copper trace running out to the edge of the board.
 */
export default function SectionHeading({
  designator,
  eyebrow,
  title,
  intro,
}: {
  designator: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-3">
        <span className="pad h-2.5 w-2.5" />
        <span className="eyebrow">
          {designator} &middot; {eyebrow}
        </span>
        <span className="h-px flex-1 bg-copper/25" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-3xl font-semibold text-silk sm:text-4xl">
        {title}
      </h2>

      {intro ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mint">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
