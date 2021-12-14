const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.rose,
        gray: colors.neutral,
      },
      transitionProperty: {
        height: 'height',
      },
    },
    screens: {
      xs: '340px',
      ...defaultTheme.screens, // https://tailwindcss.com/docs/breakpoints#extending-the-default-breakpoints
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
