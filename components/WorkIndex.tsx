import Link from "next/link";
import type { Project } from "@/lib/data";

/**
 * The work as a dense index rather than a grid of cards — year, name, stack,
 * role, scannable in one pass. Cards force every project to look equally
 * important; a list lets the reader triage.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div
        className="label hidden grid-cols-[4.5rem_1fr_14rem_7rem] gap-x-6 border-b border-rule pb-3 md:grid"
        aria-hidden="true"
      >
        <span>Year</span>
        <span>Project</span>
        <span>Stack</span>
        <span className="text-right">Role</span>
      </div>

      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              className="row-link group grid-cols-1 md:grid-cols-[4.5rem_1fr_14rem_7rem]"
            >
              <span className="font-mono text-sm text-muted">{p.year}</span>

              <span className="text-lg text-ink transition-colors group-hover:text-signal-bright">
                {p.title}
                <span className="mt-0.5 block text-sm text-muted md:hidden">
                  {p.stack.slice(0, 3).join(" · ")}
                </span>
              </span>

              <span className="hidden text-sm text-muted md:block">
                {p.stack.slice(0, 3).join(" · ")}
              </span>

              <span className="hidden text-right text-sm text-muted md:block">
                {p.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
