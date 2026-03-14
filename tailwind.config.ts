import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1b1f",
        mist: "#f6f5f1",
        paper: "#ffffff",
        ocean: "#1d4ed8",
        pine: "#166534",
        ember: "#c2410c",
        stone: "#6b7280",
        rose: "#b91c1c"
      },
      boxShadow: {
        card: "0 12px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
