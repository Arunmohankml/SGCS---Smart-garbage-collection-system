const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          soft: "#111111",
          card: "#161616",
        },
        zinc: {
          soft: "#b0b0a8",
          muted: "#7a7a72",
          border: "#2a2a28",
        },
        amber: {
          warm: "#c8a84e",
          soft: "#d4b86a",
        },
        sage: {
          DEFAULT: "#7a9a6a",
          soft: "#9ab88a",
        },
      },
      borderRadius: {
        card: "1rem",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "grid-pan": "gridPan 24s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gridPan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 36px" },
        },
      },
    },
  },
  plugins: [],
} satisfies Record<string, unknown>;

export default config;