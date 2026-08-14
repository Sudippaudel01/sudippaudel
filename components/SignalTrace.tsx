/**
 * A scrolling logic-analyser trace.
 *
 * The waveform is a real mark/space capture of the kind the IR project
 * records — a 9 ms leader, a gap, then data bits of two widths. It's the one
 * moving thing on the site, and it's drawn rather than decorative: this is
 * what the work looks like on a scope.
 *
 * Deliberately a server-rendered SVG animated in CSS rather than a canvas.
 * A canvas paints only once JS runs, which leaves an empty band in the hero
 * if it doesn't — and it can't be verified without a browser. This renders
 * in the HTML, animates with a keyframe, and stops for reduced-motion users
 * via the global rule.
 */

// Pulse widths in milliseconds: leader, gap, then bits (0.6 = zero, 1.7 = one).
const BITS = [
  9, 4.5, 0.6, 0.6, 0.6, 1.7, 0.6, 0.6, 0.6, 1.7, 0.6, 1.7, 0.6, 0.6,
  0.6, 1.7, 0.6, 0.6, 0.6, 0.6, 0.6, 1.7, 0.6, 1.7, 0.6, 0.6, 0.6, 1.7,
];

const UNIT = 11; // px per ms
const HEIGHT = 104;
const TOP = 30; // logic high
const BASE = 78; // logic low

const PERIOD = BITS.reduce((sum, ms) => sum + ms, 0) * UNIT;

// Enough cycles to span the widest container (70rem) plus one spare period,
// so the trace fills the full width and the loop never shows its seam.
const CYCLES = Math.ceil(1120 / PERIOD) + 1;
const TOTAL = PERIOD * CYCLES;

/** One cycle of the waveform, starting at x. */
function cycle(startX: number): string {
  const parts: string[] = [];
  let x = startX;
  let high = true;

  parts.push(`M${x.toFixed(1)},${TOP}`);
  for (const ms of BITS) {
    const w = ms * UNIT;
    const y = high ? TOP : BASE;
    parts.push(`L${x.toFixed(1)},${y}`);
    parts.push(`L${(x + w).toFixed(1)},${y}`);
    x += w;
    high = !high;
  }
  return parts.join(" ");
}

// Tiled cycles; translating by exactly one period loops seamlessly.
const PATH = Array.from({ length: CYCLES }, (_, i) => cycle(PERIOD * i)).join(" ");

export default function SignalTrace() {
  return (
    <div
      className="pointer-events-none relative h-[104px] w-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="signal-trace absolute left-0 top-0 h-full"
        width={TOTAL}
        height={HEIGHT}
        viewBox={`0 0 ${TOTAL} ${HEIGHT}`}
        fill="none"
        style={{ ["--trace-period" as string]: `${PERIOD}px` }}
      >
        {/* Logic level guides. */}
        <line x1="0" y1={TOP} x2={TOTAL} y2={TOP} stroke="#878d93" strokeOpacity="0.18" strokeDasharray="4 6" />
        <line x1="0" y1={BASE} x2={TOTAL} y2={BASE} stroke="#878d93" strokeOpacity="0.18" strokeDasharray="4 6" />

        <path d={PATH} stroke="#5b9dba" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>

      {/* Fade both ends so it reads as a window onto a longer capture. */}
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ground to-transparent" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ground to-transparent" />
    </div>
  );
}
