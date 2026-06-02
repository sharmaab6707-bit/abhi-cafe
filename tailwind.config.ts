import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./data/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        coffee: "#2B1810",
        espresso: "#3B2418",
        cream: "#F5EBDD",
        caramel: "#D4A373",
        gold: "#C8A96B",
        sage: "#7F8D6A",
        rosewood: "#5C2E25"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(200, 169, 107, 0.22)",
        soft: "0 18px 50px rgba(43, 24, 16, 0.16)"
      },
      backgroundImage: {
        "coffee-radial": "radial-gradient(circle at top left, rgba(212, 163, 115, 0.24), transparent 34%), radial-gradient(circle at 80% 20%, rgba(127, 141, 106, 0.18), transparent 26%)"
      }
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("night", ".night-mode &");
    })
  ]
};

export default config;
