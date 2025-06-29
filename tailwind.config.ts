import type { Config } from "tailwindcss";
import lineClamp from '@tailwindcss/line-clamp';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBeige: '#F4F1EC',
        customOrange: "#ff8f15",
        customGray: "#686868",
        customGreen: "#32b266"
      },
      letterSpacing: {
        custom: "0.5em", 
      },
      fontFamily: {
        custom: ['"olivier"'],
      },
    },
  },
  plugins: [
    // lineClamp
  ],
} satisfies Config;
