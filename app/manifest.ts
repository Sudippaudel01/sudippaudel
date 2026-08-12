import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";

/** Served at /manifest.webmanifest */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d0c",
    theme_color: "#0a0d0c",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
