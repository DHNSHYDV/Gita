/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gita: {
          bg: '#F6F1EA',
          card: '#FFFFFF',
          cardWarm: '#F5ECE1',
          gold: '#C59341',
          goldLight: '#E8D5B5',
          goldDark: '#9E6F22',
          textMain: '#2A241E',
          textMuted: '#7D7365',
          border: '#E8E1D5',
          darkBg: '#151311',
          darkCard: '#1E1B17',
          darkBorder: '#332D26'
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sanskrit: ['"Noto Serif Devanagari"', '"Noto Serif Telugu"', 'serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        kannada: ['"Noto Sans Kannada"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
