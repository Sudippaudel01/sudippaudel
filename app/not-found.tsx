import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-start px-6 py-32">
      <div className="flex items-center gap-3">
        <span className="pad h-2.5 w-2.5" />
        <span className="eyebrow">Error 404 &middot; Open circuit</span>
      </div>

      <h1 className="mt-6 text-5xl font-bold uppercase tracking-tight text-silk">
        No connection
      </h1>

      <p className="mt-5 max-w-md text-lg leading-relaxed text-mint">
        This trace doesn&apos;t route anywhere. The page you asked for
        isn&apos;t on the board.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn-primary">
          Back Home
        </Link>
        <Link href="/projects" className="btn-secondary">
          View Projects
        </Link>
      </div>
    </div>
  );
}
