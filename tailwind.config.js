/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',           // Ensure to include index.html
    './src/**/*.{js,ts,jsx,tsx}', // Include all JS, TS, JSX, and TSX files in the src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Edu Australia VIC WA NT Hand"'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.hide-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
