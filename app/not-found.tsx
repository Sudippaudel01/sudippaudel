import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Return to the homepage or browse the work.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-6 py-32">
      <p className="label">Error 404</p>
      <div className="mt-4 hairline" />

      <h1 className="mt-8 max-w-[16ch] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
        This page doesn&apos;t exist.
      </h1>

      <p className="mt-6 max-w-measure text-lg text-muted">
        The link may be out of date, or the address mistyped.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/projects" className="btn-ghost">
          See the work
        </Link>
      </div>
    </div>
  );
}
