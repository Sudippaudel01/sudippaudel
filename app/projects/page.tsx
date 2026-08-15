import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import WorkIndex from "@/components/WorkIndex";
import { projects, profile, siteUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work",
  description: `Engineering projects by ${profile.name}: bare-metal ARM firmware, FPGA RTL design, and full-stack platforms.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Work — ${profile.name}`,
    description: `Engineering projects by ${profile.name}: embedded firmware, FPGA RTL, and deployed platforms.`,
    url: "/projects",
    /*
     * Declaring `openGraph` here replaces the parent's object rather than
     * merging into it, so the inherited image was being dropped and this
     * page shared with no preview at all. Same for the twitter block below.
     */
    images: [
      {
        url: profile.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Work — ${profile.name}`,
    description: `Engineering projects by ${profile.name}: embedded firmware, FPGA RTL, and deployed platforms.`,
    images: [profile.seo.ogImage],
  },
};

export default function ProjectsPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work",
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
      { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/projects` },
    ],
  };

  return (
    <div className="mx-auto max-w-page px-6 pb-24 pt-20">
      <JsonLd data={listSchema} />
      <JsonLd data={breadcrumbSchema} />

      <p className="label">Work &middot; {projects.length} projects</p>
      <div className="mt-4 hairline" />

      <h1 className="mt-8 max-w-[18ch] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
        Firmware, silicon, and things people use.
      </h1>

      <p className="mt-6 max-w-measure text-lg leading-relaxed text-muted">
        Register-level drivers on ARM Cortex-M4, synthesised SystemVerilog on
        FPGA, and full-stack platforms running in production.
      </p>

      <div className="mt-16">
        <WorkIndex projects={projects} />
      </div>
    </div>
  );
}
