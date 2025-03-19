import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: "class",
  future: {
    respectDefaultColorScheme: false,
  },
} satisfies Config;