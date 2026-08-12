import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import TraceDivider from "@/components/TraceDivider";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-6">
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
