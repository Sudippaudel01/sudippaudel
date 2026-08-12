import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import TraceDivider from "@/components/TraceDivider";
import JsonLd from "@/components/JsonLd";
import { projects, profile, siteUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: `Engineering projects by ${profile.name} — bare-metal ARM firmware, FPGA RTL design, full-stack AI platforms, and network security.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects — ${profile.name}`,
    description: `Engineering projects by ${profile.name} — embedded firmware, FPGA RTL, and deployed full-stack platforms.`,
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    url: `${siteUrl}/projects`,
    inLanguage: "en",
    about: { "@type": "Person", name: profile.name, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${siteUrl}/projects/${p.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
    ],
  };

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-20">
      <JsonLd data={listSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="flex items-center gap-3">
        <span className="pad h-2.5 w-2.5 animate-trace-pulse" />
        <span className="eyebrow">Index &middot; {projects.length} entries</span>
        <span className="h-px flex-1 bg-copper/25" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-4xl font-bold uppercase tracking-tight text-silk sm:text-5xl">
        Projects
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mint">
        Everything from register-level firmware on ARM Cortex-M4, through
        synthesized SystemVerilog on FPGA, to full-stack AI platforms running in
        production.
      </p>

      <TraceDivider />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
