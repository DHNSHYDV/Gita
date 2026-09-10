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
          card: '#FAF7F2',
          cardWarm: '#F5ECE1',
          cream: '#FDFBF7',
          gold: '#C59341',
          goldLight: '#F2E5CE',
          goldDark: '#8C6527',
          saffron: '#D97706',
          sandalwood: '#EAE2D5',
          textMain: '#2A241E',
          textMuted: '#7E7364',
          border: '#EAE2D5',
          darkBg: '#141210',
          darkCard: '#1C1916',
          darkBorder: '#2C261F',
          darkTextMain: '#F3ECE1',
          darkTextMuted: '#9E9284'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cinzel"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        devotional: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sanskrit: ['"Noto Serif Devanagari"', '"Noto Serif Telugu"', 'serif'],
        telugu: ['"Noto Serif Telugu"', '"Noto Sans Telugu"', 'serif'],
        tamil: ['"Noto Sans Tamil"', '"Noto Serif Tamil"', 'sans-serif'],
        kannada: ['"Noto Sans Kannada"', '"Noto Serif Kannada"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Noto Serif Devanagari"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'gentle': 'cubic-bezier(0.25, 1, 0.5, 1)',
      }
    },
  },
  plugins: [],
}
