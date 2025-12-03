export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Cascadia Code", "monospace"],
      },
      animation: {
        "slide-up-gate": "slideUpGate 1.5s ease-in-out forwards",
        "flash-glow": "golden-pulse 0.5s ease-in-out 2", // 0.5s duration, 2 times
      },
      keyframes: {
        slideUpGate: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "50%": { transform: "translateY(0%)", opacity: "1" },
          "70%": { transform: "translateY(-5%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "golden-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(251, 191, 36, 0.6)", // Yellow-400 equivalent
          },
          "50%": {
            boxShadow: "0 0 8px 4px rgba(251, 191, 36, 1)", // Brighter glow
          },
        },
      },
    },
  },
  plugins: [],
};
