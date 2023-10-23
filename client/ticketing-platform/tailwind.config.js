/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C363F",
        secondary: "#F2F5EA",
        complementary: "#E75A7C"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        caveat: ["Caveat", "sans-serif"]
      }
    },
  },
  plugins: [],
}

