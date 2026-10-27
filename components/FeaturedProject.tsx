import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";

/**
 * One project shown at scale, above the index.
 *
 * The homepage previously had no imagery at all until you hovered a row,
 * which meant a first-time visitor saw a page of text. Leading with a single
 * large piece of work — rather than a grid of equal cards — keeps the
 * hierarchy the index gives you while actually showing something.
 */
export default function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="group relative">
      {/* Frame must match the covers' 16:9 or object-cover crops the art. */}
      <div className="relative aspect-video w-full overflow-hidden bg-raised">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          fill
          sizes="(max-width: 1120px) 100vw, 1120px"
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          className="absolute inset-0 ring-1 ring-inset ring-rule transition-colors duration-300 group-hover:ring-signal/50"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="text-2xl font-medium text-ink transition-colors group-hover:text-signal-bright sm:text-[1.75rem]">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
          <span
            aria-hidden="true"
            className="ml-3 inline-block translate-x-[-6px] text-signal opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
          >
            →
          </span>
        </h3>
        <p className="label">
          {project.category} &middot; {project.year}
        </p>
      </div>

      <p className="mt-3 max-w-measure leading-relaxed text-muted">
        {project.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="font-mono text-sm text-signal-bright">{project.result}</p>
        {project.links[0] ? (
          <a
            href={project.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 whitespace-nowrap label hover:text-signal-bright transition-colors"
          >
            {project.links[0].label} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
