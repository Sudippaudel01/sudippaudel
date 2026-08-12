import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { profile, siteUrl } from "@/lib/data";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: profile.seo.title,
    template: `%s — ${profile.name}`,
  },
  description: profile.seo.description,
  keywords: profile.seo.keywords,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: profile.name,
    title: profile.seo.title,
    description: profile.seo.description,
    images: [
      {
        url: profile.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.seo.title,
    description: profile.seo.description,
    images: [profile.seo.ogImage],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Omitted entirely when the token is an empty string.
  ...(profile.seo.googleSiteVerification
    ? { verification: { google: profile.seo.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0d0c",
  colorScheme: "dark",
};

/** Person schema, so search engines resolve the personal brand correctly. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  image: `${siteUrl}${profile.portraitUrl}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  alumniOf: profile.education.map((e) => ({
    "@type": "CollegeOrUniversity",
    name: e.school,
  })),
  hasCredential: profile.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  knowsLanguage: profile.languages,
  knowsAbout: profile.skillGroups.flatMap((g) => g.items.map((s) => s.name)),
  sameAs: profile.social.map((s) => s.url),
};

/** WebSite schema — ties the domain to the person as one entity. */
const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: profile.name,
  url: siteUrl,
  inLanguage: "en",
  author: { "@type": "Person", name: profile.name, url: siteUrl },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-copper focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-copper"
        >
          Skip to content
        </a>

        <Nav />
        <main id="main">{children}</main>
        <Footer />

        <JsonLd data={personSchema} />
        <JsonLd data={siteSchema} />
      </body>
    </html>
  );
}
