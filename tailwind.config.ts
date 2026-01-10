import scrollbarHide from "tailwind-scrollbar-hide";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [scrollbarHide],
} satisfies Config;
