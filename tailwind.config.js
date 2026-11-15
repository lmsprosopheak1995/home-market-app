/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213D',
        paper: '#F4F7F6',
        line: '#DCE3E1',
        brand: { DEFAULT: '#0F766E', dark: '#0B5A54', soft: '#E1F2EF' },
        gold: { DEFAULT: '#E9A23B', soft: '#FDF1DC' },
      },
      fontFamily: {
        sans: ['"Kantumruy Pro"', '"Noto Sans Khmer"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
