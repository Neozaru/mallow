import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        widgetBorderColor: "#333333",
        primary: "#D98E04",
        secondary: "#4A403A",
        valueBg: "#351961",
        widgetBg: "#3a184d",
        grayTxt: "#888",
        error: "#D46565"
      },
    },
  },
  plugins: [],
} satisfies Config;
