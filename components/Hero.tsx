import Link from "next/link";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <section className="animate-fade-up pt-20 sm:pt-28">
      <div className="flex items-center gap-3">
        <span
          className="h-1.5 w-1.5 rounded-full bg-signal"
          aria-hidden="true"
        />
        <p className="label">{profile.availability}</p>
      </div>

      <h1 className="mt-10 max-w-[16ch] text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
        {profile.headline}
      </h1>

      <p className="mt-8 max-w-measure text-lg leading-relaxed text-muted">
        {profile.summary}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/projects" className="btn-primary">
          See the work
        </Link>
        <Link href="/#contact" className="btn-ghost">
          Get in touch
        </Link>
      </div>
    </section>
  );
}
