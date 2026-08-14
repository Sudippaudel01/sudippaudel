"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";

const CARD_W = 340;
const CARD_H = 191; // 16:9

/**
 * The work as a dense index rather than a grid of cards — year, name, stack,
 * role — scannable in one pass. Cards force every project to look equally
 * important; a list lets the reader triage.
 *
 * Hovering a row raises that project's cover art and trails it near the
 * cursor. This is the one flourish on the site.
 *
 * The preview is always in the markup and gated by CSS (`.cursor-preview`),
 * not by a client-only flag — so there's no hydration gap, no pop-in, and
 * touch devices and reduced-motion users never see it regardless of JS.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;

    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = previewRef.current;
      if (!el) return;
      // Keep the card fully on screen near the edges.
      const x = Math.min(clientX + 28, window.innerWidth - CARD_W - 16);
      const y = Math.min(
        Math.max(clientY - CARD_H / 2, 16),
        window.innerHeight - CARD_H - 16,
      );
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
      <div
        className="label hidden grid-cols-[4.5rem_1fr_14rem_6rem] gap-x-6 border-b border-rule pb-3 md:grid"
        aria-hidden="true"
      >
        <span>Year</span>
        <span>Project</span>
        <span>Stack</span>
        <span className="text-right">Role</span>
      </div>

      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              onMouseEnter={() => setActive(p.slug)}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive(null)}
              className={`row-link group grid-cols-1 md:grid-cols-[4.5rem_1fr_14rem_6rem] ${
                active && active !== p.slug ? "opacity-45" : "opacity-100"
              }`}
            >
              <span className="font-mono text-sm text-muted">{p.year}</span>

              <span className="flex items-baseline gap-3 text-lg text-ink transition-colors group-hover:text-signal-bright">
                <span>
                  {p.title}
                  <span className="mt-0.5 block text-sm text-muted md:hidden">
                    {p.stack.slice(0, 3).join(" · ")}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="translate-x-[-6px] text-signal opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                >
                  →
                </span>
              </span>

              <span className="hidden text-sm text-muted md:block">
                {p.stack.slice(0, 3).join(" · ")}
              </span>

              <span className="hidden text-right text-sm text-muted md:block">
                {p.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-trailing cover art. Decorative — hidden from assistive tech. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="cursor-preview"
        style={{ width: CARD_W, height: CARD_H }}
      >
        {projects.map((p) => (
          <div
            key={p.slug}
            className={`absolute inset-0 overflow-hidden border border-rule-bright bg-raised transition-opacity duration-200 ${
              active === p.slug ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={p.cover} alt="" fill sizes="340px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
