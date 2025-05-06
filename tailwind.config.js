/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'merriweather': ['Merriweather', 'serif'],
        'sans': ['Merriweather', 'system-ui', 'sans-serif'],
      },
      colors: {
        'deep-blue': {
          50: '#f0f4f9',
          100: '#d9e2f0',
          200: '#b3c5e1',
          300: '#8da8d2',
          400: '#668bc3',
          500: '#406eb4',
          600: '#335890',
          700: '#26426c',
          800: '#1a2c48',
          900: '#0d1624',
        },
      },
    },
  },
  plugins: [],
}
