import type { MetadataRoute } from "next";
import { projects, profile, siteUrl } from "@/lib/data";

/**
 * Served at /sitemap.xml
 *
 * `lastModified` comes from explicit dates in the JSON data — never from
 * build time. A sitemap that stamps "today" on every URL on every deploy
 * claims the whole site changed when nothing did, and crawlers learn to
 * discount it. Bump `updated` on a project when you actually edit it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUpdated = new Date(profile.seo.contentUpdated);

  // The index reflects the most recently touched project.
  const latestProject = projects.reduce(
    (latest, p) => (p.updated > latest ? p.updated : latest),
    projects[0]?.updated ?? profile.seo.contentUpdated,
  );

  return [
    {
      url: siteUrl,
      lastModified: siteUpdated,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(latestProject),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updated),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
