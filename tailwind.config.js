/** @type {import('tailwindcss').Config} */
// const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
    colors: {
      'blue-1': '#3B49E7'
    }
  },
  plugins: [
  ],
}
