/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#FFB393",
        "main-dark": "#DC3636",
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInOut: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        fadeInOut: 'fadeInOut 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
