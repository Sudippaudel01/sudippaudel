import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-16 sm:pt-24">
      {/* Decorative trace runs — the copper routing behind the hero. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-24 h-px w-1/3 trace-line" />
        <div className="absolute right-0 top-56 h-px w-2/5 trace-line" />
        <div className="absolute left-[8%] top-56 h-56 w-px bg-gradient-to-b from-copper/30 to-transparent" />
      </div>

      <div className="grid animate-fade-up items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="pad h-2.5 w-2.5 animate-trace-pulse" />
            <span className="eyebrow">{profile.role}</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold uppercase leading-[1.05] tracking-tight text-silk sm:text-6xl xl:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-4 font-mono text-base uppercase tracking-[0.2em] text-copper sm:text-lg">
            {profile.tagline}
          </p>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mint">
            {profile.headline}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/#contact" className="btn-primary">
              Hire Me
            </Link>
            <Link href="/projects" className="btn-secondary">
              View Projects
            </Link>
          </div>
        </div>

        {/* Board render — the visual anchor. */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square overflow-hidden border border-copper/25 bg-panel">
            <Image
              src="/hero-board.png"
              alt="Printed circuit board with copper traces routing to a central integrated circuit"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              priority
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-pcb via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Corner brackets around the render. */}
          <span aria-hidden="true">
            <span className="absolute -left-1.5 -top-1.5 h-5 w-5 border-l-2 border-t-2 border-copper" />
            <span className="absolute -right-1.5 -top-1.5 h-5 w-5 border-r-2 border-t-2 border-copper" />
            <span className="absolute -bottom-1.5 -left-1.5 h-5 w-5 border-b-2 border-l-2 border-copper" />
            <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 border-b-2 border-r-2 border-copper" />
          </span>
        </div>
      </div>

      {/* Silkscreen spec strip — the board's parameter table. */}
      <dl className="mt-16 grid grid-cols-2 gap-px border border-copper/20 bg-copper/20 sm:grid-cols-4">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="bg-pcb px-5 py-6">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
              {stat.label}
            </dt>
            <dd className="mt-2 font-mono text-2xl font-semibold text-copper-bright">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
