import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#fff7f8",
        petal: "#ffe8ed",
        plum: "#3b062a",
        magenta: "#b5538f",
        saffron: "#f58220",
        gold: "#d7a848",
        leaf: "#6f9f78",
        ink: "#251526"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-playfair)", "Georgia", "serif"]
      },
      boxShadow: {
        wellness: "0 24px 70px rgba(59, 6, 42, 0.12)"
      },
      borderRadius: {
        sukham: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
