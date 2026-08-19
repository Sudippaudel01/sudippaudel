import Link from "next/link";
import SignalTrace from "./SignalTrace";
import { profile } from "@/lib/data";

/**
 * The hero is one sentence and nothing else.
 *
 * The headline is sized to run close to the full measure rather than sitting
 * in the left half with dead space beside it — the emptiness at wide viewports
 * was reading as unfinished rather than as breathing room. The base row then
 * spans the full width, actions left and orientation right, so the block
 * closes on a line instead of trailing off.
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

      <h1 className="mt-10 max-w-[13ch] text-[clamp(2.75rem,9vw,6.75rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
        {profile.headline}
        {/* The visible headline is a statement, not a label. This gives the
            h1 the name and role that a search engine and a screen reader
            both need, without altering the design. */}
        <span className="sr-only">
          {" "}
          — {profile.name}, {profile.role}
        </span>
      </h1>

      <p className="mt-10 max-w-measure text-lg leading-relaxed text-muted">
        {profile.summary}
      </p>

      <div className="mt-12 flex flex-col gap-8 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
          <Link href="/projects" className="btn-primary">
            See the work
          </Link>
          <a href="/#contact" className="btn-ghost">
            Get in touch
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet ml-1 text-sm text-muted"
          >
            Résumé
          </a>
        </div>

        {/* Orientation, right-aligned — gives the base row something to close on. */}
        <dl className="flex gap-10 sm:text-right">
          <div>
            <dt className="label">Based in</dt>
            <dd className="mt-1.5 text-sm text-ink">{profile.location}</dd>
          </div>
          <div>
            <dt className="label">Focus</dt>
            <dd className="mt-1.5 text-sm text-ink">{profile.tagline}</dd>
          </div>
        </dl>
      </div>

      <SignalTrace />
    </section>
  );
}
