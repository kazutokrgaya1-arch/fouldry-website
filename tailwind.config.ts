import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marketplace palette — clean white storefront, warm orange
        // for prices/CTAs, blue for secondary links.
        market: {
          bg: "#FFFFFF",
          surface: "#F5F5F7",
          text: "#1A1A1A",
          muted: "#6B7280",
          border: "#E5E7EB",
          accent: "#F0631D",
          "accent-dark": "#D6551A",
          link: "#1D4ED8",
        },
        // Legacy blueprint palette — still used on a couple of pages.
        ink: "#0B1220",
        "ink-2": "#101B2D",
        blueprint: "#4FD1E8",
        brass: "#E8A94F",
        paper: "#F7F5F0",
        slate: "#8C97A8",
        line: "#1E2C42",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(79,209,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,232,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
