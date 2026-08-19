/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // Modern formats first — AVIF typically lands 30-50% under WebP for the
    // flat-colour technical artwork this site uses.
    formats: ["image/avif", "image/webp"],
    // A year: the filenames are content-stable and regenerating changes them.
    minimumCacheTTL: 31_536_000,
  },

  async headers() {
    /**
     * The site loads no third-party resources at all — fonts are self-hosted
     * by next/font and every image is local — so everything can be locked to
     * 'self'.
     *
     * 'unsafe-inline' is required for scripts and styles because Next injects
     * inline hydration payloads and style tags, and a nonce cannot be applied
     * to statically prerendered pages. The policy still blocks the attacks
     * that matter here: loading script from another origin, framing, plugin
     * embeds, <base> hijacking, and posting the form anywhere but this site.
     */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        /*
         * The .vercel.app alias serves a byte-identical copy of the whole
         * site and was fully crawlable. A canonical tag asks Google to
         * prefer the real domain; this tells it not to index the copy at
         * all, which is the stronger signal and removes the duplicate.
         */
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Generated artwork is immutable between regenerations.
        source: "/projects/:path*.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
