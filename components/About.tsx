import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <SectionHeading designator="U1" eyebrow="About" title="Both sides of the line" />

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
            {/* Portrait slot — swap portraitUrl in profile.json for a real photo. */}
            <div className="relative w-40 shrink-0 sm:w-48">
              <div className="relative aspect-[4/5] overflow-hidden border border-copper/30 bg-panel">
                <Image
                  src={profile.portraitUrl}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <span aria-hidden="true">
                <span className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-copper" />
                <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-copper" />
              </span>
            </div>

            <p className="text-base leading-relaxed text-mint sm:text-lg">
              {profile.about[0]}
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {profile.about.slice(1).map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-mint sm:text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Component footprint card with corner brackets. */}
        <aside className="relative panel p-7">
          <Corners />

          <h3 className="eyebrow">Details</h3>

          <dl className="mt-6 space-y-5">
            <Row label="Location" value={profile.location} />
            <Row label="Status" value={profile.availability} />
            <Row label="Authorization" value={profile.workAuthorization} />
            <Row label="Languages" value={profile.languages.join(", ")} />
          </dl>

          <div className="mt-7 h-px trace-line" aria-hidden="true" />

          <h3 className="mt-6 eyebrow">Certifications</h3>
          <ul className="mt-4 space-y-3">
            {profile.certifications.map((c) => (
              <li key={c.name} className="flex items-start gap-3">
                <span className="pad mt-1.5 h-2 w-2" />
                <span className="text-sm text-silk">
                  {c.name}
                  <span className="block font-mono text-xs text-mint/70">
                    {c.issuer}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-silk">{value}</dd>
    </div>
  );
}

/** PCB component footprint corner brackets. */
export function Corners() {
  const base = "absolute h-3 w-3 border-copper/60";
  return (
    <span aria-hidden="true">
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}
