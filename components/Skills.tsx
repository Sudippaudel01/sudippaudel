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
            <p className="mt-1.5 max-w-[28ch] text-sm text-muted">{group.note}</p>
            <div className="mt-5 hairline" />

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
