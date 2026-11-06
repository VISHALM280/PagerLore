/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090e",
        surface: "#0d111c",
        "surface-elevated": "#121826",
        "surface-highlight": "#192237",
        border: "#1c263c",
        "border-glow": "#263553",
        cyan: {
          glow: "#00f0ff",
          bright: "#22d3ee",
          muted: "#0891b2",
        },
        icy: {
          blue: "#38bdf8",
          subtle: "#60a5fa",
        },
        obsidian: "#030407",
        graphite: "#161d2f",
        slate: {
          muted: "#64748b",
          subtle: "#94a3b8",
          light: "#cbd5e1",
        },
        amber: {
          warn: "#f59e0b",
          glow: "#fbbf24",
        },
        crit: {
          red: "#ef4444",
          glow: "#f87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "stream-flow": "stream 20s linear infinite",
        "radar-sweep": "radar 4s linear infinite",
        "glow-slow": "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        stream: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))" },
          "100%": { opacity: "0.8", filter: "drop-shadow(0 0 25px rgba(0, 240, 255, 0.7))" },
        },
      },
    },
  },
  plugins: [],
};
