import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <SectionHeading
        label="Capability"
        title="What I actually work in"
        srTitle="Technical skills: languages, embedded hardware, tools"
      />

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
        {profile.skillGroups.map((group) => (
          <div key={group.group}>
            <h3 className="text-sm font-medium text-ink">{group.group}</h3>

            {/*
              No max-width: the 28ch cap forced these to wrap early, which
              left "written" dangling on its own line and — because the three
              notes then had different line counts — pushed each column's rule
              to a different height. The min-height keeps the rules aligned if
              a note does wrap at a narrower viewport.
            */}
            <p className="mt-1.5 text-sm leading-relaxed text-muted md:min-h-[2.75rem]">
              {group.note}
            </p>
            <div className="mt-4 hairline" />

            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
