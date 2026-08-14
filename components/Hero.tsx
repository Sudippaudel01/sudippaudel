import Link from "next/link";
import { profile } from "@/lib/data";

/**
 * The hero is one sentence and nothing else. Elements arrive in sequence on
 * load — label, headline, summary, actions — which reads as considered rather
 * than decorated. The rule at the base is the only graphic element.
 */
export default function Hero() {
  return (
    <section className="stagger pt-24 sm:pt-32">
      <div className="flex items-center gap-3">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
        <p className="label">{profile.availability}</p>
      </div>

      <h1 className="mt-10 max-w-[15ch] text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
        {profile.headline}
      </h1>

      <p className="mt-9 max-w-measure text-lg leading-relaxed text-muted">
        {profile.summary}
      </p>

      <div className="mt-11 flex flex-wrap items-center gap-x-3 gap-y-4">
        <Link href="/projects" className="btn-primary">
          See the work
        </Link>
        <Link href="/#contact" className="btn-ghost">
          Get in touch
        </Link>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet ml-1 text-sm text-muted"
        >
          Résumé
        </a>
      </div>

      <div className="mt-24 hairline" />
    </section>
  );
}
