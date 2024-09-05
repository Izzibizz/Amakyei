/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#F3F5EA", /* "#E5E3DA", */ 
        "main-dark": "#645933", 
        "main-white": "#FFFBF4",
        "peach": "#BEB8A0",
        "green": "#BEB8A0" 
        
/*         "background": "#FFB393",
        "main-dark": "#DC3636",
        "main-white": "#FFFBF4",
        "peach": "#F0826A",
        "green": "#BEB8A0" */
        
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
