/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#C2CCB1",
        "main-dark": "#474800",
        "main-white": "#FFFBF4",
        "peach": "#F0826A"
      },
      fontFamily: {
        body: ["Raleway", "sans-serif"],
        heading: ["Michroma", "sans-serif"],
      },
      screens: {
        tablet: "600px", 
        laptop: "1281px", 
        desktop: "1511px", 
      },
    },
  },
  plugins: [],
};
