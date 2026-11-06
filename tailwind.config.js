/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Warm Ivory & Editorial Neutral Palette
        ivory: {
          DEFAULT: "#F8F7F2", // Main background
          surface: "#FFFFFF", // Primary content surfaces
          neutral: "#F1F0E9", // Light neutral surface / cards
          border: "#E9E8DF",  // Crisp subtle borders & separators
          subtle: "#FAF9F5",
        },
        // Editorial Deep Ink Typography
        ink: {
          DEFAULT: "#25352D", // Main text
          secondary: "#788579", // Secondary text
          muted: "#9A9C91", // Muted text
          dark: "#141D19",
        },
        // Primary Accent: Emerald
        emerald: {
          DEFAULT: "#267B5B", // Primary accent
          dark: "#194B38",    // Dark emerald for active/hover states
          soft: "#EAF2EC",    // Soft emerald background badge/pills
          subtle: "#D9E8DD",
          border: "#BFD8C6",
        },
        // Secondary Accent: Muted Gold
        gold: {
          DEFAULT: "#B8A17A", // Secondary accent
          light: "#F7F3EC",
          border: "#E0D5C3",
          dark: "#8C7752",
        },
        // Status Indicators
        status: {
          critical: "#C94F4F",    // Critical incident (SEV-1)
          "critical-bg": "#FBF1F1",
          "critical-border": "#E8BABA",
          warning: "#C58B43",     // Warning / SEV-2
          "warning-bg": "#FCF6ED",
          "warning-border": "#E8D3B6",
          success: "#267B5B",     // Success
          "success-bg": "#EAF2EC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(37, 53, 45, 0.04), 0 1px 2px rgba(37, 53, 45, 0.02)",
        editorial: "0 4px 20px -2px rgba(37, 53, 45, 0.06), 0 2px 6px -1px rgba(37, 53, 45, 0.03)",
        card: "0 0 0 1px #E9E8DF, 0 1px 3px rgba(37, 53, 45, 0.03)",
        elevated: "0 12px 32px -4px rgba(37, 53, 45, 0.08), 0 4px 12px -2px rgba(37, 53, 45, 0.04)",
      },
    },
  },
  plugins: [],
};
