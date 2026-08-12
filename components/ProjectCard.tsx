import Image from "next/image";
import Link from "next/link";
import { Corners } from "./About";
import type { Project } from "@/lib/data";

/**
 * A project rendered as a PCB component footprint: cover art on top, corner
 * brackets, a reference designator, and the stack silkscreened along the base.
 */
export default function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  /** Set on above-the-fold cards so Next preloads the image. */
  priority?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col panel transition-all duration-200 hover:border-copper/60 hover:-translate-y-1">
      <Corners />

      <div className="relative aspect-[16/9] overflow-hidden border-b border-copper/20 bg-pcb">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {/* Fade the art into the card so the type below stays dominant. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute left-4 top-4 border border-copper/40 bg-pcb/85 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-copper backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mint/60">
            {project.year}
          </span>
          <span className="font-mono text-[0.65rem] text-mint/40">
            U{String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-semibold leading-snug text-silk transition-colors group-hover:text-copper-bright">
          <Link
            href={`/projects/${project.slug}`}
            className="before:absolute before:inset-0"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-1 font-mono text-xs text-mint/70">{project.subtitle}</p>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-mint">
          {project.summary}
        </p>

        <div className="mt-6 h-px trace-line" aria-hidden="true" />

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="border border-copper/25 px-2.5 py-1 font-mono text-[0.65rem] text-mint"
            >
              {tech}
            </li>
          ))}
        </ul>

        <span className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-copper transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
          Read more →
        </span>
      </div>
    </article>
  );
}
