import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getProject, projects, profile, siteUrl } from "@/lib/data";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.metaDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${profile.name}`,
      description: project.metaDescription,
      url: `/projects/${project.slug}`,
      images: [{ url: project.cover, width: 1200, height: 675, alt: project.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${profile.name}`,
      description: project.metaDescription,
      images: [project.cover],
    },
  };
}

export default function ProjectDetailPage({ params }: Params) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const url = `${siteUrl}/projects/${project.slug}`;
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
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Work",
      url: `${siteUrl}/projects`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-page px-6 pb-24 pt-20">
      <JsonLd data={projectSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Link
        href="/projects"
        className="text-sm text-muted transition-colors hover:text-signal"
      >
        ← Work
      </Link>

      <header className="mt-10">
        <p className="label">
          {project.category} &middot; {project.context} &middot; {project.year}
        </p>
        <div className="mt-4 hairline" />

        <h1 className="mt-8 max-w-[20ch] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
          {project.title}
        </h1>

        <p className="mt-3 text-lg text-muted">{project.subtitle}</p>

        <p className="mt-8 max-w-measure text-lg leading-relaxed text-muted">
          {project.summary}
        </p>
      </header>

      {/* Facts live beside the work, not in a hero dashboard. */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <div>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden bg-raised">
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 704px"
                priority
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              {project.coverAlt}
            </figcaption>
          </figure>

          <div className="mt-16 space-y-12">
            {project.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-medium">{s.heading}</h2>
                <p className="mt-3 max-w-measure leading-relaxed text-muted">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {project.metrics.length > 0 ? (
            <dl className="space-y-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="border-b border-rule pb-3">
                  <dt className="label">{m.label}</dt>
                  <dd className="mt-1 font-mono text-lg text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-8">
            <p className="label">Stack</p>
            <ul className="mt-3 space-y-1.5">
              {project.stack.map((t) => (
                <li key={t} className="text-sm text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {project.links.length > 0 ? (
            <div className="mt-8 flex flex-col gap-2">
              {project.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-20 hairline" />

      <nav
        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Project navigation"
      >
        <a href="/#contact" className="text-sm text-muted transition-colors hover:text-signal">
          Get in touch
        </a>
        <Link
          href={`/projects/${next.slug}`}
          className="text-sm text-ink transition-colors hover:text-signal"
        >
          Next: {next.title} →
        </Link>
      </nav>
    </article>
  );
}
