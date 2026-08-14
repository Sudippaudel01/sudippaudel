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
      setMessage(data.message ?? "Message sent. I'll get back to you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24">
      <SectionHeading
        label="Contact"
        title="Get in touch"
        srTitle="Contact Sudip Paudel, computer engineer"
        intro={`Open to engineering work across embedded, hardware and full-stack. Email me directly or use the form.`}
      />

      <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <div>
          <dl className="space-y-5">
            <div className="border-b border-rule pb-4">
              <dt className="label">Email</dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all text-sm text-ink transition-colors hover:text-signal"
                >
                  {profile.email}
                </a>
              </dd>
            </div>

            <div className="border-b border-rule pb-4">
              <dt className="label">Phone</dt>
              <dd className="mt-1.5">
                <a
                  href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-ink transition-colors hover:text-signal"
                >
                  {profile.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="label">Elsewhere</dt>
              <dd className="mt-2.5 flex flex-col gap-2">
                {profile.social.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-8 w-full"
          >
            Download résumé
          </a>
        </div>

        <form onSubmit={handleSubmit} noValidate className="relative">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="name" label="Name" error={fieldErrors.name} required />
            <Field
              name="email"
              label="Email"
              type="email"
              error={fieldErrors.email}
              required
            />
          </div>

          <div className="mt-6">
            <Field
              name="subject"
              label="Subject"
              error={fieldErrors.subject}
              required
            />
          </div>

          <div className="mt-6">
            <label htmlFor="message" className="label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className="mt-2 w-full resize-y border-0 border-b border-rule bg-transparent px-0 py-2.5 text-ink transition-colors placeholder:text-muted/60 focus:border-signal focus:outline-none focus:ring-0"
            />
            {fieldErrors.message ? (
              <p id="message-error" className="mt-2 text-sm text-signal-bright">
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
            className="btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          <div aria-live="polite" role="status">
            {status === "success" || status === "error" ? (
              <p
                className={`mt-6 border-l-2 pl-4 text-sm ${
                  status === "success"
                    ? "border-signal text-ink"
                    : "border-signal-bright text-signal-bright"
                }`}
              >
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
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-ink transition-colors focus:border-signal focus:outline-none focus:ring-0"
      />
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-signal-bright">
          {error}
        </p>
      ) : null}
    </div>
  );
}
