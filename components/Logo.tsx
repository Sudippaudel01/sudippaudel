import { profile } from "@/lib/data";

/**
 * The mark is a single mark/space pulse — the same signal the IR project
 * captures, and the same shape as the trace running under the hero. It keeps
 * the identity tied to the work rather than to electronics in general.
 *
 * Drawn with `currentColor` so it inherits whatever the surrounding text is
 * doing, including hover states.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 17 H7 V7 H12 V17 H15 V11 H22" />
    </svg>
  );
}

/**
 * Mark plus wordmark. The name stays as the accessible label — the mark is
 * decorative, so a screen reader hears "Sudip Paudel" and nothing else.
 */
export default function Logo({
  showName = true,
  className = "",
}: {
  showName?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-6 w-6 shrink-0 text-signal transition-colors" />
      {showName ? (
        <span className="text-sm uppercase tracking-[0.28em]">
          {profile.name}
        </span>
      ) : (
        <span className="sr-only">{profile.name}</span>
      )}
    </span>
  );
}
