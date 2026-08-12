"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-pcb/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center border border-copper/50 bg-panel font-mono text-sm font-semibold text-copper transition-colors group-hover:border-copper group-hover:text-copper-bright">
            {profile.initials}
          </span>
          <span className="hidden font-mono text-sm uppercase tracking-[0.2em] text-silk sm:inline">
            {profile.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.15em] text-mint transition-colors hover:text-copper-bright"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-copper/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-copper transition-colors hover:border-copper hover:bg-copper hover:text-pcb"
            >
              Résumé
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-copper/40 md:hidden"
        >
          <span
            className={`h-px w-4 bg-copper transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-4 bg-copper transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div className="mx-auto h-px max-w-content trace-line" aria-hidden="true" />

      {open ? (
        <ul
          id="mobile-menu"
          className="border-b border-copper/20 bg-panel px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-sm uppercase tracking-[0.15em] text-mint transition-colors hover:text-copper-bright"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block py-3 font-mono text-sm uppercase tracking-[0.15em] text-copper"
            >
              Résumé ↗
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
