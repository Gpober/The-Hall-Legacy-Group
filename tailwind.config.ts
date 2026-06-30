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
        brand: {
          950: "#072a1d",
          900: "#0a3a29",
          850: "#0c4231",
          800: "#0e4a37",
          700: "#146a4a",
          600: "#1c8a5f",
          500: "#27a06f",
        },
        gold: {
          DEFAULT: "#c79a2e",
          bright: "#d8ad3c",
          soft: "#e3c267",
        },
        cream: "#f7f6f1",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
