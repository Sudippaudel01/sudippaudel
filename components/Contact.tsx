"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus("loading");
    setMessage("");
    setFieldErrors({});

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFieldErrors(data.fieldErrors ?? {});
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Message sent — I'll get back to you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden">
      {/* Silkscreen grid, fading out toward the bottom of the board. */}
      <div
        className="silkscreen-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
        aria-hidden="true"
      />

      <SectionHeading
        designator="J1"
        eyebrow="Contact"
        title="Hire me"
        srTitle="Contact Sudip Paudel — hire me for a Summer 2026 engineering internship"
        intro="Looking for a Summer 2026 engineering internship — embedded, hardware, full-stack, or anywhere the three meet. Send a message and I'll reply."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Header pinout — the connector's signal list. */}
        <div className="panel h-fit p-7">
          <h3 className="eyebrow">Direct lines</h3>

          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all text-sm text-silk transition-colors hover:text-copper-bright"
                >
                  {profile.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-silk transition-colors hover:text-copper-bright"
                >
                  {profile.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70">
                Location
              </dt>
              <dd className="mt-1 text-sm text-silk">{profile.location}</dd>
            </div>
          </dl>

          <div className="mt-7 h-px trace-line" aria-hidden="true" />

          <ul className="mt-6 space-y-3">
            {profile.social.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="flex items-center gap-3 font-mono text-sm text-mint transition-colors hover:text-copper-bright"
                >
                  <span className="pad h-2 w-2" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-7 w-full"
          >
            Download Résumé
          </a>
        </div>

        <form onSubmit={handleSubmit} noValidate className="panel p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="name"
              label="Name"
              placeholder="Jane Engineer"
              error={fieldErrors.name}
              required
            />
            <Field
              name="email"
              label="Email"
              type="email"
              placeholder="jane@company.com"
              error={fieldErrors.email}
              required
            />
          </div>

          <div className="mt-5">
            <Field
              name="subject"
              label="Subject"
              placeholder="Summer 2026 internship — Firmware"
              error={fieldErrors.subject}
              required
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="message"
              className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70"
            >
              Message <span className="text-copper">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="Tell me about the role or the project…"
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className="mt-2 w-full resize-y border border-copper/25 bg-pcb px-4 py-3 text-sm text-silk placeholder:text-mint/40 transition-colors focus:border-copper focus:outline-none"
            />
            {fieldErrors.message ? (
              <p id="message-error" className="mt-1.5 font-mono text-xs text-copper-bright">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          {/* Honeypot — hidden from users, catches naive bots. */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Transmitting…" : "Send Message"}
          </button>

          {/* Live region so screen readers announce the result. */}
          <div aria-live="polite" role="status">
            {status === "success" || status === "error" ? (
              <p
                className={`mt-5 flex items-start gap-3 border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-copper/50 bg-copper/10 text-silk"
                    : "border-copper-bright/50 bg-copper-bright/10 text-copper-bright"
                }`}
              >
                <span className="pad mt-1 h-2 w-2" />
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mint/70"
      >
        {label} {required ? <span className="text-copper">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 w-full border border-copper/25 bg-pcb px-4 py-3 text-sm text-silk placeholder:text-mint/40 transition-colors focus:border-copper focus:outline-none"
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 font-mono text-xs text-copper-bright">
          {error}
        </p>
      ) : null}
    </div>
  );
}
