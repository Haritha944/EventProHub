/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        buttonBgColor: "#0067FF",
        yellowColor: "#FEB60D",
        purplrColor: "#9771FF",
        irisBlueColor: "#01B5C5",
        headingColor: "#181A1E",
        textColor: "#4E545F",
      }
    },
  },
  plugins: [],
}

