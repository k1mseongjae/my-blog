/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto sans KR','sans-serif'],
        bytesized: ['Bytesized', 'monospace'],
        kiranghaerang: ['Kirang Haerang', 'monospace'],
        dongle: ['Dongle', 'monospace'],
        stylish: ['Stylish', 'monospace'],


      },
    },
    screens: {
      'sm': '38rem',
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
  darkMode: 'class'
}