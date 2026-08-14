"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const LINKS = [
  { href: "/projects", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Section links are plain anchors, not next/link.
 *
 * A Link would run the client router on click, push `/#about` into history,
 * and then race the handler in HashLinks that strips the fragment back off —
 * the router won, so the hash stayed in the address bar. An in-page jump
 * needs no routing, so there is nothing to race.
 */
function isHashLink(href: string) {
  return href.startsWith("/#");
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "text-sm text-muted transition-colors hover:text-ink";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? "border-rule bg-ground/95 backdrop-blur" : "border-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-page items-center justify-between px-6 py-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-sm uppercase tracking-[0.28em] text-ink transition-colors hover:text-signal"
        >
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              {isHashLink(l.href) ? (
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Résumé
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open ? (
        <ul id="menu" className="border-t border-rule bg-raised px-6 py-2 md:hidden">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b border-rule last:border-0">
              {isHashLink(l.href) ? (
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
          <li className="border-b border-rule last:border-0">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-muted transition-colors hover:text-ink"
            >
              Résumé
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
