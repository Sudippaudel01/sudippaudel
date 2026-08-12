import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { featuredProjects, projects } from "@/lib/data";

export default function FeaturedProjects() {
  const remaining = projects.length - featuredProjects.length;

  return (
    <section id="projects" className="scroll-mt-24">
      <SectionHeading
        designator="U4"
        eyebrow="Projects"
        title="Selected work"
        srTitle="Engineering projects — embedded firmware, FPGA RTL and full-stack"
        intro="From register-level firmware to synthesized RTL to deployed platforms."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}

      </div>

      {remaining > 0 ? (
        <div className="mt-10">
          <Link href="/projects" className="btn-secondary">
            All {projects.length} projects
          </Link>
        </div>
      ) : null}
    </section>
  );
}
