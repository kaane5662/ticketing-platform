/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F1429",
        secondary: "#FFFFFF",
        complementary: "#00DABA",
        complementary2: "#FF6BF6"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        caveat: ["Caveat", "sans-serif"]
      }
    },
  },
  plugins: [],
}

