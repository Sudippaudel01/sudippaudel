import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24">
      <SectionHeading designator="U3" eyebrow="Education" title="Coursework" />

      <ol className="relative space-y-8 border-l border-copper/25 pl-8">
        {profile.education.map((ed) => (
          <li key={ed.school} className="relative">
            {/* Via connecting the entry to the timeline trace. */}
            <span
              className={`pad absolute -left-[2.35rem] top-1.5 h-3.5 w-3.5 ${
                ed.current ? "bg-copper" : ""
              }`}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold text-silk">{ed.school}</h3>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-copper">
                {ed.period}
              </span>
            </div>

            <p className="mt-1 text-base text-mint">
              {ed.degree}
              <span className="text-mint/60"> &middot; {ed.location}</span>
            </p>

            {ed.coursework.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {ed.coursework.map((c) => (
                  <li
                    key={c}
                    className="border border-copper/25 px-3 py-1.5 font-mono text-xs text-mint transition-colors hover:border-copper/60 hover:text-copper-bright"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
