/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#AA7553", /* "#E5E3DA", */ 
        "main-dark": "#533918", 
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
        laptop: "1025px", 
        desktop: "1300px", 
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInVideo: {
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
        fadeInVideo: 'fadeInVideo 2s ease-out',
        fadeInOut: 'fadeInOut 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
