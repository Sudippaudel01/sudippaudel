"use client";

import { useEffect } from "react";

/**
 * Same-page section links scroll smoothly and then drop the `#section` from
 * the address bar, so clicking "Contact" doesn't leave sudippaudel.com/#contact
 * sitting in the URL.
 *
 * Delegated from the document so every anchor is covered — nav, hero buttons,
 * footer, project pages — without each one needing its own handler.
 *
 * Progressive enhancement: the links are real `href="/#id"` anchors, so with
 * JavaScript off they still jump natively (hash and all). Nothing here is
 * required for navigation to work.
 */
export default function HashLinks() {
  useEffect(() => {
    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cleanUrl = () => {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    };

    const onClick = (event: MouseEvent) => {
      // Let the browser handle new-tab / new-window / non-primary clicks.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const match = href.match(/^\/?#(.+)$/);
      if (!match) return;

      // Section ids live on the home page; from elsewhere let Next navigate.
      if (window.location.pathname !== "/") return;

      const section = document.getElementById(match[1]);
      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({
        behavior: prefersReduced() ? "auto" : "smooth",
        block: "start",
      });

      /*
       * Move focus as well as the viewport. A native anchor jump does this
       * for free; since we're preventing it, we have to do it ourselves —
       * otherwise the "Skip to content" link would scroll but leave keyboard
       * focus stranded at the top, and screen reader users would not follow
       * the jump. `preventScroll` keeps the smooth scroll from being
       * interrupted.
       */
      const hadTabIndex = section.hasAttribute("tabindex");
      if (!hadTabIndex) section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
      if (!hadTabIndex) {
        section.addEventListener(
          "blur",
          () => section.removeAttribute("tabindex"),
          { once: true },
        );
      }

      cleanUrl();
    };

    document.addEventListener("click", onClick);

    // Arriving on a deep link (someone shared /#contact): let the browser do
    // its native jump, then tidy the bar once we've settled there.
    let settle: number | undefined;
    if (window.location.hash) {
      settle = window.setTimeout(cleanUrl, 600);
    }

    return () => {
      document.removeEventListener("click", onClick);
      if (settle) window.clearTimeout(settle);
    };
  }, []);

  return null;
}
