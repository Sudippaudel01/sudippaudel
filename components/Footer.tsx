import Logo from "./Logo";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo className="text-ink" />
          <p className="mt-2 text-sm text-muted">
            {profile.tagline} &middot; {profile.location}
          </p>
        </div>

        <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-6 gap-y-2">
          {profile.social.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-page px-6 pb-10">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
