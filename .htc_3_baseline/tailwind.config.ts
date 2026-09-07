import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: "#11110F",
          surface: "#181816",
          border: "#262623",
          hover: "#1F1F1D",
        },
        bone: {
          DEFAULT: "#E7E2D8",
          surface: "#DFD9CD",
          muted: "#D5CEBF",
          border: "#C7C0B0",
        },
        accent: {
          metal: "#96938B",
          copper: "#875E48",
          mineral: "#596057",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas-pro)", "var(--font-bebas)", "sans-serif"],
        body: ["var(--font-ibm-plex)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        arabic: ["var(--font-ibm-plex-arabic)", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
