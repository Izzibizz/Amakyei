/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#FFFBF4", /* "#E5E3DA", */ 
        "main-dark": "#693a17", 
        "main-white": "#FFFBF4",
        "medium-white": "#FDF4E5",
        "beige": "#EBD2BC",
        "peach": "#BC6755",
        "green": "#BEB8A0" 
        
/*         "background": "#FFB393",
        "main-dark": "#DC3636",
        "main-white": "#FFFBF4",
        "peach": "#F0826A",
        "green": "#BEB8A0" */
        
      },
      fontFamily: {
        body: ["Thasadith", "sans-serif"],
        heading: ["Fahkwang", "sans-serif"],
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
