export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Cascadia Code", "monospace"],
      },
      animation: {
        "slide-up-gate": "slideUpGate 1.5s ease-in-out forwards",
      },
      keyframes: {
        slideUpGate: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "50%": { transform: "translateY(0%)", opacity: "1" },
          "70%": { transform: "translateY(-5%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
