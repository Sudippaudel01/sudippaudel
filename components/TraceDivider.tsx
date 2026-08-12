/**
 * A copper trace run with solder pads at each end and a via at centre —
 * the structural connector between sections.
 */
export default function TraceDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-14" aria-hidden="true">
      <span className="pad h-3 w-3" />
      <span className="h-px flex-1 trace-line" />
      {label ? (
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mint/60">
          {label}
        </span>
      ) : (
        <span className="pad h-2 w-2 animate-trace-pulse" />
      )}
      <span className="h-px flex-1 trace-line" />
      <span className="pad h-3 w-3" />
    </div>
  );
}
