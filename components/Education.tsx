import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

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
            className="grid gap-x-8 gap-y-2 border-b border-rule py-6 md:grid-cols-[1fr_12rem]"
          >
            <div>
              <h3 className="text-lg text-ink">{ed.school}</h3>
              <p className="mt-1 text-sm text-muted">
                {ed.degree} &middot; {ed.location}
              </p>

              {ed.coursework.length > 0 ? (
                <p className="mt-3 max-w-measure text-sm text-muted">
                  {ed.coursework.join(", ")}
                </p>
              ) : null}
            </div>

            <p className="label md:text-right">{ed.period}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
