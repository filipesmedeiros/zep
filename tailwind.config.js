const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        denied: {
          '0%, 100%': { transform: 'translateX(0)' },
          '12%, 37%, 62%, 87%': { transform: 'translateX(-3px)' },
          '25%, 50%, 75%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        denied: 'denied 0.6s ease-in-out',
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
