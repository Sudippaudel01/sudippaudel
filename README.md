# Sudip Paudel — Portfolio

Personal portfolio and resume site for **Sudip Paudel**, Computer Engineer.
Built as a full-stack Next.js app with a circuit-board / PCB visual identity.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Resend · Vercel

---

## Table of contents

1. [Run it locally](#1-run-it-locally)
2. [Edit your content](#2-edit-your-content)
3. [Set up the contact-form email](#3-set-up-the-contact-form-email)
4. [Deploy to Vercel](#4-deploy-to-vercel)
5. [Connect a custom domain](#5-connect-a-custom-domain)
6. [Project structure](#project-structure)
7. [Design system](#design-system)
8. [Troubleshooting](#troubleshooting)

---

## 1. Run it locally

Requires **Node.js 18.17 or newer** (this project was set up on Node 20).

```bash
npm install
cp .env.example .env.local   # then fill in the values — see section 3
npm run dev
```

Open <http://localhost:3000>.

The site runs fine without any environment variables — **only the contact form
needs them**. Without `RESEND_API_KEY`, submitting the form returns a clean
"email service is not configured" message instead of crashing.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check, no output |

---

## 2. Edit your content

**All content lives in two JSON files. You should never need to edit a component
to change what the site says.**

### `data/profile.json`

Controls the hero, about, skills, education, footer and all SEO metadata.

| Field | Where it shows up |
| --- | --- |
| `name`, `initials` | Hero heading, nav badge, footer, favicon monogram |
| `role`, `tagline`, `headline` | Hero eyebrow, subtitle, and lead paragraph |
| `summary` | Structured data (schema.org Person) |
| `availability`, `location`, `workAuthorization` | About sidebar, footer |
| `email`, `phone` | Contact section direct lines |
| `resumeUrl` | Nav "Résumé" button + contact download button |
| `about[]` | About section paragraphs — add or remove freely |
| `stats[]` | The 4-cell spec strip under the hero |
| `skillGroups[]` | The capability lists (see below) |
| `education[]` | Education timeline |
| `certifications[]`, `languages[]` | About sidebar |
| `social[]` | Footer and contact links |
| `seo.*` | `<title>`, meta description, OG/Twitter tags |

**Skills** are plain lists grouped by domain. There are deliberately **no
self-assessed ratings** — a 4-out-of-5 next to "C" reads as junior and is the
first thing a designer would cut.

```json
{
  "group": "Languages",
  "note": "Daily drivers, roughly in order of how much I've written",
  "items": ["C", "C++", "SystemVerilog"]
}
```

`level` must be **1–5**. Add or remove whole groups — the layout is a
3-column grid that reflows on its own.

### `data/projects.json`

An array of projects. Each entry drives both its card and its detail page at
`/projects/<slug>`.

```json
{
  "slug": "url-safe-name",
  "title": "Project Title",
  "subtitle": "Board / platform",
  "category": "Embedded",
  "context": "Where it was built",
  "year": "2025",
  "featured": true,
  "summary": "One-paragraph pitch — used on the card and in meta tags.",
  "stack": ["C", "ARM Cortex-M4"],
  "metrics": [{ "label": "Carrier", "value": "38 kHz" }],
  "highlights": ["Short bullet.", "Another bullet."],
  "sections": [{ "heading": "Section title", "body": "Longer prose." }],
  "links": [{ "label": "GitHub", "url": "https://…" }]
}
```

Notes:

- **`slug`** becomes the URL. Keep it lowercase and hyphenated. Changing it
  changes the page's URL — old links will 404.
- **`updated`** is an ISO date (`YYYY-MM-DD`) that feeds `sitemap.xml`'s
  `lastModified`. **Bump it when you meaningfully edit that project** — that's
  the signal telling search engines to re-crawl the page. Don't touch it for
  typo fixes.
- **`featured: true`** puts the project in the homepage "Selected work" grid.
  Three featured projects fills the grid exactly; the rest still appear on
  `/projects`.
- **`highlights`** renders as a 3-across bracketed card row — three entries
  looks best.
- **`metrics`** renders 2 or 4 across. Use 2 or 4 entries, or omit the key.
- Empty arrays are safe — `links: []` and `metrics: []` simply render nothing.

### Replacing the résumé PDF

Drop your new PDF at `public/Sudip_Paudel_Resume.pdf` (overwrite the existing
file), or rename it and update `resumeUrl` in `data/profile.json`.

### Adding your photo

The About section shows `public/portrait-placeholder.png` — a monogram card that
says "REPLACE WITH PHOTO". To use a real one:

1. Save your photo as `public/portrait.jpg` — **4:5 portrait**, at least
   800×1000px.
2. Change `portraitUrl` in `data/profile.json` to `/portrait.jpg`.

This is the single biggest upgrade available to the site. A real face outperforms
any illustration for a personal brand, and recruiters expect one.

### Project cover art

Each project has a `cover` and `coverAlt` in `projects.json`, pointing at a 16:9
image in `public/projects/`. These are **custom technical illustrations
generated from your project data** — an IR timing capture, the FP16 datapath, a
network topology — not stock photography.

They're produced by a script, so they stay consistent and re-themeable:

```bash
pip install cairosvg
python3 scripts/generate-images.py
```

This regenerates all project covers, the hero board render, and the portrait
placeholder. The palette constants at the top of
[`scripts/generate-images.py`](scripts/generate-images.py) mirror
`tailwind.config.ts` — change both together and every image re-themes to match.

To use a real photo or screenshot for a project instead, drop it in
`public/projects/` and point that project's `cover` at it. Keep it 16:9.
`coverAlt` is the alt text **and** the caption on the detail page, so write it
descriptively.

### Replacing the OG image

Replace `public/og-image.png` with a **1200×630** PNG. This is what appears when
the site is shared on LinkedIn, Twitter/X, Slack or iMessage.

---

## 3. Set up the contact-form email

The form at `/#contact` POSTs to `/api/contact`, which validates the input with
Zod and sends the message through [Resend](https://resend.com).

**Steps:**

1. Create a free account at <https://resend.com> (3,000 emails/month free).
2. Go to **API Keys** → **Create API Key** → copy it (starts with `re_`).
3. Copy `.env.example` to `.env.local` and set:

   ```ini
   RESEND_API_KEY=re_your_real_key_here
   CONTACT_FROM_EMAIL=onboarding@resend.dev
   CONTACT_TO_EMAIL=paudelsudip026@gmail.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Restart `npm run dev` — env changes are only read at server start.

### About the "From" address

`onboarding@resend.dev` works immediately but is Resend's shared sender.
Once your domain is live, verify it at <https://resend.com/domains> (add the DNS
records they give you), then change `CONTACT_FROM_EMAIL` to something on your
own domain, e.g. `hello@sudippaudel.com`. This meaningfully improves
deliverability.

`CONTACT_TO_EMAIL` — where messages land — can be any address, including Gmail;
it does not need verifying. Replies go straight to the sender because the API
route sets `replyTo` to whatever the visitor typed.

### Built-in protections

- **Zod validation** on every field, with per-field errors returned to the form.
- **Honeypot field** (`company`) hidden off-screen — bots that fill it get a
  fake success response.
- **Rate limit** of 5 submissions per IP per hour, in-process. It resets on cold
  start, which is acceptable for a personal site. If you ever need it durable,
  swap it for Upstash Redis.
- HTML escaping on all user input before it goes into the email body.

**Never commit `.env.local`.** It is already in `.gitignore`.

---

## 4. Deploy to Vercel

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/Sudippaudel01/portfolio.git
git push -u origin main
```

### Import into Vercel

1. Go to <https://vercel.com/new> and import the repository.
2. Vercel auto-detects Next.js — **leave every build setting at its default.**
3. Before clicking Deploy, expand **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | your `re_…` key |
   | `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain) |
   | `CONTACT_TO_EMAIL` | `paudelsudip026@gmail.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://sudippaudel.com` |

4. Deploy.

Every push to `main` redeploys automatically. Pull requests get preview URLs.

> If you add env vars *after* deploying, you must **redeploy** for them to take
> effect — Vercel does not inject them into an existing build.

---

## 5. Connect a custom domain

1. In Vercel: **Project → Settings → Domains → Add**, enter `sudippaudel.com`.
2. At your registrar (Namecheap, Cloudflare, Google Domains…), add the records
   Vercel shows you — typically:

   | Type | Name | Value |
   | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   Use whatever Vercel's dashboard displays; it is authoritative.
3. DNS propagation takes minutes to a few hours. HTTPS is provisioned
   automatically.
4. Update `NEXT_PUBLIC_SITE_URL` to `https://sudippaudel.com` and redeploy, so
   OG tags, `sitemap.xml` and `robots.txt` all use the final URL.
5. Update `seo.siteUrl` in `data/profile.json` to match (it's the fallback used
   when the env var is absent).

### About `public/CNAME`

`public/CNAME` contains `sudippaudel.com`. **Vercel ignores this file** — it is
only used by **GitHub Pages**. It is included because you asked for it, so the
repo is ready if you ever switch hosts.

> ⚠️ GitHub Pages serves static files only. It cannot run `/api/contact`, so the
> contact form would stop working there. Vercel is the right target for this
> project.

---

## Project structure

```
.
├── app/
│   ├── api/contact/route.ts     # POST endpoint — validation + Resend
│   ├── projects/
│   │   ├── page.tsx             # /projects — full index
│   │   └── [slug]/page.tsx      # /projects/<slug> — detail pages
│   ├── globals.css              # Tailwind layers + PCB component classes
│   ├── layout.tsx               # Fonts, metadata, nav/footer, JSON-LD
│   ├── not-found.tsx            # 404 ("open circuit")
│   ├── page.tsx                 # Homepage section assembly
│   ├── robots.ts                # → /robots.txt
│   └── sitemap.ts               # → /sitemap.xml
├── components/                  # Presentational components (no content)
├── data/
│   ├── profile.json             # ← edit your details here
│   └── projects.json            # ← edit your projects here
├── lib/data.ts                  # Typed accessors over the JSON
├── scripts/
│   └── generate-images.py       # Regenerates all artwork from the palette
└── public/
    ├── CNAME                    # GitHub Pages only
    ├── Sudip_Paudel_Resume.pdf
    ├── favicon.svg              # Copper SP monogram badge
    ├── hero-board.png           # Hero PCB render
    ├── og-image.png             # 1200×630 social card
    ├── portrait-placeholder.png # ← swap for a real photo
    └── projects/                # One 16:9 cover per project
```

`robots.txt` and `sitemap.xml` are **generated** by `app/robots.ts` and
`app/sitemap.ts` — they're served at exactly those URLs, and the sitemap picks
up new projects from `projects.json` automatically. Don't create static copies
in `public/`; they would conflict.

---

## SEO

Everything is generated from the JSON data, so metadata can't drift from
content.

| Feature | Where |
| --- | --- |
| Per-page `<title>` + description | `metadata` export in each page |
| Canonical URLs | `alternates.canonical`, absolute via `metadataBase` |
| Open Graph + Twitter cards | `app/layout.tsx`, overridden per project |
| Per-project OG images | each project shares with its own cover art |
| `sitemap.xml` | `app/sitemap.ts` — all routes, real `lastModified` dates |
| `robots.txt` | `app/robots.ts` — allows all, disallows `/api/` |
| `manifest.webmanifest` | `app/manifest.ts` |
| Structured data | `ProfilePage` + `Person` + `WebSite` sitewide; `SoftwareSourceCode` / `CreativeWork` + `BreadcrumbList` per project; `CollectionPage` + `ItemList` on the index |
| `rel="me"` on profiles | links GitHub/LinkedIn/sites to one identity |
| Security headers | `next.config.mjs` — nosniff, frame options, referrer policy |
| Image optimisation | AVIF/WebP served automatically via `next/image` |

All pages are statically prerendered, so crawlers get complete HTML without
executing JavaScript.

### Two content fields that exist purely for SEO

**`metaDescription`** on each project (in `projects.json`) is separate from
`summary`. `summary` is page copy and can run long; `metaDescription` is the
~150-character version Google shows in results. Keep it **under 158 characters**
or it gets truncated mid-sentence.

**`srTitle`** on `<SectionHeading>` adds screen-reader-only text to an `<h2>`.
The visible headings are deliberately figurative — "Pinout", "Coursework", "Both
sides of the line" — which looks good but tells a search engine nothing. The
`srTitle` supplies the plain-language version ("Technical skills — languages,
embedded hardware and tools") without touching the design. Screen-reader users
get the descriptive text too, so this helps both audiences.

### Google Search Console

`seo.googleSiteVerification` in `profile.json` is empty, so no verification tag
is emitted. To verify ownership, paste the token from the HTML-tag method in
Search Console — the `content` value only, not the whole tag — and redeploy.

**Set `NEXT_PUBLIC_SITE_URL` in production.** Without it the code falls back to
`seo.siteUrl` in `profile.json`. In local dev, `og:image` will show a
`localhost` URL — that is expected and resolves correctly in a real build.

### After you deploy

1. Verify the live sitemap at `https://yourdomain.com/sitemap.xml`.
2. Add the property in [Google Search Console](https://search.google.com/search-console)
   and submit the sitemap.
3. Test structured data with the
   [Rich Results Test](https://search.google.com/test/rich-results).
4. Check the social card with the
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

### Not configured

There is **no `twitter:creator`** tag. It needs a real X/Twitter handle; add one
to `profile.json` as `seo.twitterHandle` and wire it into the `twitter` block in
`app/layout.tsx` if you want it. Twitter cards work without it.

## Security

The only untrusted input the site accepts is the contact form, so that's where
the hardening is concentrated.

**`/api/contact`**

| Control | Detail |
| --- | --- |
| Schema validation | Zod, with per-field errors returned to the form |
| Header-injection guard | CR/LF rejected in `name`, `email`, `subject` — a newline in an email header lets an attacker append `Bcc:` and relay spam |
| Rate limit | 5/hour per IP, keyed off `x-real-ip` (proxy-set) — **not** the first `x-forwarded-for` entry, which is client-controlled and trivially spoofed |
| Body-size cap | 16 KB, rejected with 413 before parsing |
| Honeypot | hidden `company` field; a bot that fills it gets a fake success |
| HTML escaping | all user values escaped before entering the email body |
| Error responses | generic — no stack traces or internal detail |

**Headers** (set in `next.config.mjs`): `Content-Security-Policy`,
`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
`Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`.
`x-powered-by` is disabled.

The CSP is `default-src 'self'` with no external origins — every font and image
is local. It does allow `'unsafe-inline'` for scripts and styles, because Next
injects inline hydration payloads and a nonce cannot be applied to statically
prerendered pages. `'unsafe-eval'` is **not** allowed. You will see an
`EvalError` in the console under `npm run dev` — that is Next's hot-reload
machinery, and it does not occur in a production build. Do not add
`'unsafe-eval'` to silence it.

**Structured data** is serialised through `components/JsonLd.tsx`, which escapes
`<`, `>`, `&` and U+2028/9. Plain `JSON.stringify` does not, so a literal
`</script>` in any content field would otherwise break out of the tag.

### Keeping dependencies patched

```bash
npm audit
```

Next.js ships security patches frequently. Stay current within your major:

```bash
npm install next@latest-14 eslint-config-next@latest-14
```

`npm audit` will report advisories against Next that are only marked fixed in a
much later major. Read them before reacting — most require middleware, Server
Actions, i18n, custom servers, or remote image patterns, **none of which this
site uses.** Assess actual exposure rather than upgrading majors reflexively.

## Design system

The direction is **Instrument** — the front panel of good test equipment.
Graphite ground, silkscreen type, hairline rules, one muted signal colour.

| Token | Hex | Usage |
| --- | --- | --- |
| `ground` | `#16181a` | Page background — graphite |
| `raised` | `#1d2023` | Image wells, mobile menu |
| `ink` | `#e8eae7` | Primary text — silkscreen off-white |
| `muted` | `#878d93` | Secondary/body text |
| `rule` | `#2e3236` | Hairlines — the only divider on the site |
| `signal` | `#5b9dba` | Links, focus, hover. Used sparingly |

**Restraint is the design.** There are no cards, no corner brackets, no
reference designators, no solder pads and no proficiency dots. A single hairline
is the only structural device. If you add ornament back, add it once.

To re-theme, edit these values in **two places**: `tailwind.config.ts`
(`theme.extend.colors`) and the `:root` block in `app/globals.css`. Then update
the literals in `app/layout.tsx` (`themeColor`), `public/favicon.svg`, the email
styles in `app/api/contact/route.ts`, and the palette constants at the top of
`scripts/generate-images.py` — then re-run that script so the artwork matches.

**Type:** Archivo carries the whole site, differentiated by weight and tracking
rather than by swapping families. IBM Plex Mono is reserved for data,
identifiers and panel labels. Both self-hosted at build time via
`next/font/google`.

**Component classes** (`app/globals.css`): `.label` (mono panel label),
`.hairline`, `.btn-primary` / `.btn-ghost`, `.row-link` (work index rows), and
`.portrait` (a `grayscale` filter so any photo reads as identity rather than
stock photography).

**Accessibility:** skip-to-content link, `:focus-visible` outlines in the signal
colour, `aria-live` status on the contact form, screen-reader-only descriptive
headings via `srTitle`, and a `prefers-reduced-motion` block that disables
animation and smooth scroll.

---

## Troubleshooting

**Contact form says "email service is not configured"**
`RESEND_API_KEY` is missing. Locally: check `.env.local` exists and restart the
dev server. On Vercel: add the variable, then redeploy.

**Emails aren't arriving**
Check spam. Confirm `CONTACT_TO_EMAIL` is right. If you set
`CONTACT_FROM_EMAIL` to your own domain, it must be verified in Resend first —
otherwise Resend rejects the send. Check the Vercel function logs and the Resend
dashboard's Logs tab.

**"Too many messages sent"**
The rate limit — 5 per IP per hour. Restart the dev server to clear it locally.

**OG image not updating on LinkedIn/Twitter**
Both cache aggressively. Use the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) or Twitter
Card Validator to force a refresh.

**Fonts look wrong offline**
`next/font` downloads IBM Plex at build time. The first `npm run build` on a
fresh machine needs network access.
