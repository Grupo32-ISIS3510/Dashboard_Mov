/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0b1020",
          panel: "#141a33",
          panel2: "#1b2243",
          border: "#2a3260",
          text: "#e6e9f5",
          dim: "#8b93b8",
          primary: "#7c5cff",
          accent: "#28e0b9",
          warn: "#ffb547",
          danger: "#ff5c77",
          ok: "#4ade80",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
