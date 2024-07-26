/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html","./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    container:{
      padding: {
        md:"10rem",
      }
    }
  },
  plugins: [],
}
