import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <SectionHeading
        label="About"
        title="Both sides of the line"
        srTitle="About Sudip Paudel, computer engineer"
      />

      <div className="grid items-start gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <div className="space-y-6">
          {profile.about.map((para, i) => (
            <p key={i} className="max-w-measure text-lg leading-relaxed text-muted">
              {para}
            </p>
          ))}
        </div>

        {/* Sticky on wide screens: the facts stay with you while you read. */}
        <aside className="lg:sticky lg:top-24">
          {/*
            Monochrome so the photo reads as identity rather than stock, and
            fading out at the base so it settles into the page instead of
            stopping on a hard edge above the detail list.
          */}
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={profile.portraitUrl}
              alt={`${profile.name}, ${profile.role}`}
              fill
              sizes="(max-width: 1024px) 60vw, 288px"
              className="portrait object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ground via-ground/70 to-transparent"
              aria-hidden="true"
            />
          </div>

          <dl className="mt-8 space-y-5">
            <Row label="Based in" value={profile.location} />
            <Row label="Status" value={profile.availability} />
            <Row label="Work authorisation" value={profile.workAuthorization} />
            <Row label="Languages" value={profile.languages.join(", ")} />
            <Row
              label="Certifications"
              value={profile.certifications.map((c) => c.name).join(", ")}
            />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-rule pb-4 last:border-0">
      <dt className="label">{label}</dt>
      <dd className="mt-1.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
