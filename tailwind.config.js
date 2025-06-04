/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 