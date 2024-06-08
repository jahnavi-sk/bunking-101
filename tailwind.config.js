/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '320px', // Custom breakpoint for extra large screens
      },
      colors:{
        darkyellow: '#d08454',
        box: '#F4F1E0'
      },
      fontFamily:{
        heading: ['Major Mono Display']
      },
      fontSize:{
        '7.5xl': '5rem'
      },
      borderRadius: {
        '5xl': '7%',
      },
      fontSize: {
        '8.5xl': '5.5rem', // Equivalent to 112px
      },
      lineHeight: {
        '8.5': '1',
      },
    },
  },
  plugins: [],
}
