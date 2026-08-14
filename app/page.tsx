import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Hero from "@/components/Hero";
import FeaturedProject from "@/components/FeaturedProject";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import SectionHeading from "@/components/SectionHeading";
import WorkIndex from "@/components/WorkIndex";
import { featuredProjects, profile, projects, siteUrl } from "@/lib/data";

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
      knowsAbout: profile.skillGroups.flatMap((g) => g.items),
      sameAs: profile.social.map((s) => s.url),
      seeks: {
        "@type": "Demand",
        name: "Engineering internships and roles",
      },
      subjectOf: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        url: `${siteUrl}/projects/${p.slug}`,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-page px-6">
      <JsonLd data={profilePageSchema} />

      <Hero />

      {/* Work first. The reader decides in seconds; don't spend them on a bio. */}
      <div className="reveal scroll-mt-24 pt-32">
        <section id="work">
          <SectionHeading
            label="Selected work"
            title="What I've built"
            srTitle="Engineering projects: embedded firmware, FPGA RTL, full-stack"
          />
          <FeaturedProject project={featuredProjects[0]} />

          <div className="mt-20">
            <WorkIndex projects={featuredProjects.slice(1)} />
          </div>

          <Link
            href="/projects"
            className="link-quiet mt-8 inline-block text-sm text-muted"
          >
            All {projects.length} projects →
          </Link>
        </section>
      </div>

      <div className="reveal pt-36">
        <About />
      </div>

      <div className="reveal pt-32">
        <Skills />
      </div>

      <div className="reveal pt-24">
        <Education />
      </div>

      <div className="reveal pb-8 pt-36">
        <Contact />
      </div>
    </div>
  );
}
