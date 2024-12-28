import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shakespeare': {
          '50': '#f3f7fc',
          '100': '#e7f0f7',
          '200': '#c9dfee',
          '300': '#99c4e0',
          '400': '#72afd3',
          '500': '#3e8bb9',
          '600': '#2d6f9c',
          '700': '#26597e',
          '800': '#234d69',
          '900': '#214059',
          '950': '#162a3b',
        },

        'aquamarine': {
          '50': '#eafff7',
          '100': '#cbffea',
          '200': '#9cfeda',
          '300': '#5df8c9',
          '400': '#37ecba',
          '500': '#00d19c',
          '600': '#00ab80',
          '700': '#00886a',
          '800': '#006c56',
          '900': '#005848',
          '950': '#003229',
        },


      },
      fontFamily: {
        sans: ['Jost', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};