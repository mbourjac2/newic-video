/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.twig'],
  theme: {
    extend: {
      fontFamily: {
        body: ['"filson-pro"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0642BF',
          light: 'rgba(134, 173, 243, 0.32)',
        },
      },
    },
  },
  plugins: [],
};
