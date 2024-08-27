/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#0021CC', // Custom color name and value
      },
      spacing: {
        '15': '3.75rem', // Adding a custom spacing value if needed
        '40': '10rem', // Adding a custom spacing value if needed
      },
    },
  },
  plugins: [],
}

