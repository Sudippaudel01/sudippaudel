import JsonLd from "@/components/JsonLd";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import TraceDivider from "@/components/TraceDivider";
import { profile, projects, siteUrl } from "@/lib/data";

export default function HomePage() {
  /**
   * ProfilePage is Google's type for a page that *is* a person's profile —
   * it disambiguates a personal site from a company or blog homepage.
   */
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: profile.seo.contentUpdated,
    inLanguage: "en",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      url: siteUrl,
      image: `${siteUrl}${profile.portraitUrl}`,
      email: `mailto:${profile.email}`,
      telephone: profile.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Euless",
        addressRegion: "TX",
        addressCountry: "US",
      },
      alumniOf: profile.education.map((e) => ({
        "@type": "CollegeOrUniversity",
        name: e.school,
      })),
      knowsAbout: profile.skillGroups.flatMap((g) => g.items.map((s) => s.name)),
      sameAs: profile.social.map((s) => s.url),
      // Signals the actual goal of the site to job-search surfaces.
      seeks: {
        "@type": "Demand",
        name: "Summer 2026 engineering internship",
      },
      subjectOf: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        url: `${siteUrl}/projects/${p.slug}`,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-content px-6">
      <JsonLd data={profilePageSchema} />
      <Hero />
      <TraceDivider label="U1 — About" />
      <About />
      <TraceDivider label="U2 — Skills" />
      <Skills />
      <TraceDivider label="U3 — Education" />
      <Education />
      <TraceDivider label="U4 — Projects" />
      <FeaturedProjects />
      <TraceDivider label="J1 — Contact" />
      <Contact />
      <div className="pb-24" />
    </div>
  );
}
