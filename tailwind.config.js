/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#0088cc',
          'light-blue': '#54a9eb',
          'dark-blue': '#006bb3',
        },
        chat: {
          'message-out': '#effdde',
          'message-in': '#ffffff',
          'message-out-dark': '#2b5278',
          'message-in-dark': '#383c3f',
        },
        dark: {
          bg: '#212121',
          'bg-secondary': '#383c3f',
          'bg-tertiary': '#2b2b2b',
          text: '#ffffff',
          'text-secondary': '#b3b3b3',
          border: '#404040',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 