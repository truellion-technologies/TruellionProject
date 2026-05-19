/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        truellion: {
          orange: '#f97316',
          orangeDark: '#ea580c',
          orangeLight: '#ffedd5',
          dark: '#111827',
          gray: '#f8fafc',
          green: '#2b6e3c',
          greenLight: '#e6f7ec',
          red: '#b91c1c',
          redLight: '#fee2e2',
          yellow: '#d97706',
          yellowLight: '#fef3c7',
        }
      }
    },
  },
  plugins: [],
}
