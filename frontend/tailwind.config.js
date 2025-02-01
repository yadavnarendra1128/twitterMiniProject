/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        twitter: "#1DA1F2",
        hoverTwitter: "#419cd5",
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("tailwind-scrollbar")],
};
