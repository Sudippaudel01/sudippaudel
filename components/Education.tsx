import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

/**
 * Dates sit in their own column with a consistent left edge, and the content
 * starts at a fixed point beside them.
 *
 * Two earlier attempts were worse: the date marooned in a far-right column
 * (a wide gap that read as a layout accident), then a leader rule bridging
 * that gap (a table-of-contents device stretched across 700px, which drew
 * more attention than either the school or the date). Alignment does the job
 * that the rule was doing, so the rule isn't needed.
 *
 * Stacks to a single column on small screens, where a fixed date column
 * would squeeze the school names.
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
          <li
            key={ed.school}
            className="grid gap-x-10 gap-y-2 border-b border-rule py-7 last:border-0 md:grid-cols-[10rem_1fr]"
          >
            <p className="label md:pt-1.5">{ed.period}</p>

            <div>
              <h3 className="text-lg text-ink">{ed.school}</h3>
              <p className="mt-1 text-sm text-muted">
                {ed.degree} &middot; {ed.location}
              </p>

              {ed.coursework.length > 0 ? (
                <p className="mt-3 max-w-measure text-sm leading-relaxed text-muted">
                  {ed.coursework.join(", ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
