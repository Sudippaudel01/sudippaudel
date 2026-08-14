import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Instrument palette — a lab-equipment front panel.
        // Graphite ground, silkscreen type, one muted signal colour.
        ground: "#16181a",
        raised: "#1d2023",
        ink: "#e8eae7",
        muted: "#878d93",
        rule: "#2e3236",
        "rule-bright": "#40454a",
        signal: {
          DEFAULT: "#5b9dba",
          bright: "#7cb8d1",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "70rem",
        measure: "34rem",
      },
      fontSize: {
        // Panel labels: small, letterspaced, uppercase.
        label: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.16em" }],
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
