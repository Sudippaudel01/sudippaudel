import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

const MAX_LEVEL = 5;

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <SectionHeading
        designator="U2"
        eyebrow="Skills"
        title="Pinout"
        intro="Proficiency by pin. Filled pads indicate depth of hands-on use."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {profile.skillGroups.map((group, gi) => (
          <div key={group.group} className="panel">
            <div className="flex items-center justify-between border-b border-copper/20 px-5 py-4">
              <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-copper">
                {group.group}
              </h3>
              <span className="font-mono text-[0.65rem] text-mint/50">
                J{gi + 1}
              </span>
            </div>

            <p className="px-5 pt-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mint/60">
              {group.note}
            </p>

            <ul className="px-5 py-4">
              {group.items.map((skill, i) => (
                <li
                  key={skill.name}
                  className="group flex items-center gap-3 border-b border-copper/10 py-2.5 last:border-0"
                >
                  <span className="w-6 shrink-0 font-mono text-[0.65rem] text-mint/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-sm text-silk transition-colors group-hover:text-copper-bright">
                    {skill.name}
                  </span>

                  <span
                    className="flex shrink-0 items-center gap-1"
                    role="img"
                    aria-label={`Proficiency ${skill.level} of ${MAX_LEVEL}`}
                  >
                    {Array.from({ length: MAX_LEVEL }, (_, d) => (
                      <span
                        key={d}
                        className={`h-2 w-2 rounded-full border ${
                          d < skill.level
                            ? "border-copper bg-copper"
                            : "border-copper/30 bg-transparent"
                        }`}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
