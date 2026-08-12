import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TraceDivider from "@/components/TraceDivider";
import JsonLd from "@/components/JsonLd";
import { Corners } from "@/components/About";
import { getProject, projects, profile, siteUrl } from "@/lib/data";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProject(params.slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${profile.name}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: [{ url: project.cover, width: 1200, height: 675, alt: project.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${profile.name}`,
      description: project.summary,
      images: [project.cover],
    },
  };
}

export default function ProjectDetailPage({ params }: Params) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const url = `${siteUrl}/projects/${project.slug}`;

  /** Projects with a source link are code; the rest are engineering work. */
  const isCode = project.links.some((l) => /github/i.test(l.url));

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": isCode ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url,
    image: `${siteUrl}${project.cover}`,
    dateCreated: project.year,
    dateModified: project.updated,
    inLanguage: "en",
    keywords: project.stack.join(", "),
    ...(isCode
      ? {
          programmingLanguage: project.stack,
          codeRepository: project.links.find((l) => /github/i.test(l.url))?.url,
        }
      : {}),
    author: {
      "@type": "Person",
      name: profile.name,
      url: siteUrl,
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Projects",
      url: `${siteUrl}/projects`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-content px-6 pb-24 pt-20">
      <JsonLd data={projectSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-[0.15em] text-mint transition-colors hover:text-copper-bright"
      >
        ← All projects
      </Link>

      <header className="mt-8">
        <div className="flex items-center gap-3">
          <span className="pad h-2.5 w-2.5" />
          <span className="eyebrow">
            {project.category} &middot; {project.context} &middot; {project.year}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-silk sm:text-5xl">
          {project.title}
        </h1>

        <p className="mt-3 font-mono text-base text-copper">{project.subtitle}</p>

        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-mint">
          {project.summary}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="border border-copper/25 px-3 py-1.5 font-mono text-xs text-mint"
            >
              {tech}
            </li>
          ))}
        </ul>

        {project.links.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <figure className="relative mt-14">
        <div className="relative aspect-[16/9] overflow-hidden border border-copper/25 bg-panel">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            priority
            className="object-cover"
          />
        </div>
        <span aria-hidden="true">
          <span className="absolute -left-1.5 -top-1.5 h-5 w-5 border-l-2 border-t-2 border-copper" />
          <span className="absolute -right-1.5 -top-1.5 h-5 w-5 border-r-2 border-t-2 border-copper" />
          <span className="absolute -bottom-1.5 -left-1.5 h-5 w-5 border-b-2 border-l-2 border-copper" />
          <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 border-b-2 border-r-2 border-copper" />
        </span>
        <figcaption className="mt-4 font-mono text-xs text-mint/60">
          {project.coverAlt}
        </figcaption>
      </figure>

      {project.metrics.length > 0 ? (
        <dl className="mt-14 grid grid-cols-2 gap-px border border-copper/20 bg-copper/20 sm:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="bg-pcb px-5 py-6">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
                {m.label}
              </dt>
              <dd className="mt-2 font-mono text-xl font-semibold text-copper-bright">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <TraceDivider label="Highlights" />

      <section>
        <ul className="grid gap-4 md:grid-cols-3">
          {project.highlights.map((h, i) => (
            <li key={i} className="relative panel p-6">
              <Corners />
              <span className="font-mono text-[0.65rem] text-copper">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-mint">{h}</p>
            </li>
          ))}
        </ul>
      </section>

      <TraceDivider label="Detail" />

      <section className="grid gap-10 lg:grid-cols-2">
        {project.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="flex items-center gap-3 text-xl font-semibold text-silk">
              <span className="pad h-2 w-2" />
              {s.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mint">{s.body}</p>
          </div>
        ))}
      </section>

      <TraceDivider />

      <nav
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Project navigation"
      >
        <Link href="/#contact" className="btn-primary">
          Hire Me
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="font-mono text-xs uppercase tracking-[0.15em] text-mint transition-colors hover:text-copper-bright"
        >
          Next: {next.title} →
        </Link>
      </nav>
    </article>
  );
}
