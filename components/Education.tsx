import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

/**
 * The date sits on the same baseline as the school rather than marooned in
 * a far-right column — the wide gap between them was reading as a layout
 * accident rather than as alignment.
 */
export default function Education() {
  return (
    <section id="education" className="scroll-mt-24">
      <SectionHeading
        label="Education"
        title="Where I studied"
        srTitle="Education: B.E. Computer Engineering, UT Arlington"
      />

      <ul>
        {profile.education.map((ed) => (
          <li key={ed.school} className="border-b border-rule py-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-lg text-ink">{ed.school}</h3>
              <span className="h-px min-w-8 flex-1 bg-rule" aria-hidden="true" />
              <span className="label whitespace-nowrap">{ed.period}</span>
            </div>

            <p className="mt-2 text-sm text-muted">
              {ed.degree} &middot; {ed.location}
            </p>

            {ed.coursework.length > 0 ? (
              <p className="mt-3 max-w-measure text-sm text-muted">
                {ed.coursework.join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
