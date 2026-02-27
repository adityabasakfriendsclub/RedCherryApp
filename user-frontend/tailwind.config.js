/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff0f3',
          100: '#ffe0e8',
          200: '#ffc2d1',
          300: '#ff91ad',
          400: '#ff5c86',
          500: '#ff2d63',
          600: '#f0064a',
          700: '#cc0040',
          800: '#a8003a',
          900: '#8c0036',
        },
        brand: {
          light: '#ffb6c1',
          DEFAULT: '#ff85a1',
          dark: '#ff5c86',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(255,133,161,0.10)',
      }
    },
  },
  plugins: [],
}
