import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", '"Helvetica Neue"', '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', "sans-serif"],
      },
      colors: {
        toss: {
          blue: "#3182f6",
          "blue-dark": "#1b64da",
          "blue-light": "#e8f3ff",
          gray: {
            100: "#f9fafb",
            200: "#f2f4f6",
            300: "#e5e8eb",
            400: "#d1d6db",
            500: "#b0b8c1",
            600: "#6b7684",
            700: "#4e5968",
            800: "#333d4b",
            900: "#191f28",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
