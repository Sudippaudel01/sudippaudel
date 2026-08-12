import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/lib/data";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  subject: z.string().trim().min(3, "Please add a subject.").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message is too long (5000 characters max)."),
  /**
   * Honeypot: must stay empty. Bots fill every field they find.
   * Deliberately permissive here — a filled honeypot has to pass validation so
   * it can be silently accepted below, rather than returning a field error
   * that tells the bot which input gave it away.
   */
  company: z.string().max(200).optional(),
});

/**
 * In-memory rate limit. Resets on cold start, which is fine for a personal
 * site — it exists to blunt casual spam, not to be an auth boundary.
 */
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors = Object.fromEntries(
      Object.entries(flat).map(([key, msgs]) => [key, msgs?.[0] ?? "Invalid value."]),
    );

    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, subject, message, company } = parsed.data;

  // Honeypot tripped — accept silently so the bot doesn't learn anything.
  if (company) {
    return NextResponse.json({ message: "Message sent." }, { status: 200 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — cannot send email.");
    return NextResponse.json(
      {
        error:
          "Email service is not configured yet. Please email me directly at " +
          profile.email,
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `Portfolio Contact <${from}>`,
      to: [to],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: [
        `New message from ${profile.seo.siteUrl}`,
        "",
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px;margin:0 auto;background:#0a0d0c;color:#e8e6df;padding:32px;">
          <p style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#c9884f;margin:0 0 16px;">
            New portfolio message
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:#8b9d95;width:90px;">Name</td><td style="padding:6px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#8b9d95;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#e0a868;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#8b9d95;">Subject</td><td style="padding:6px 0;">${escapeHtml(subject)}</td></tr>
          </table>
          <hr style="border:0;border-top:1px solid rgba(201,136,79,.35);margin:24px 0;" />
          <p style="white-space:pre-wrap;line-height:1.65;margin:0;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Message sent — I'll get back to you shortly." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[contact] Unexpected failure:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again shortly." },
      { status: 500 },
    );
  }
}
