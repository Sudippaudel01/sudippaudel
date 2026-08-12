import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-copper/20 bg-panel">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="pad h-2.5 w-2.5" />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-silk">
                {profile.name}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mint">
              {profile.role} — {profile.tagline}
            </p>
            <p className="mt-2 font-mono text-xs text-mint/70">
              {profile.location} &middot; {profile.workAuthorization}
            </p>
          </div>

          <nav aria-label="Elsewhere">
            <h2 className="eyebrow">Elsewhere</h2>
            <ul className="mt-4 space-y-2">
              {profile.social.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="font-mono text-sm text-mint transition-colors hover:text-copper-bright"
                  >
                    {s.label} <span className="text-mint/50">/ {s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 h-px trace-line" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-mint/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
