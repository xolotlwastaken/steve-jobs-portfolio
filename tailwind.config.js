/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#efeee9',
      },
      fontFamily: {
        'hn': ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        'sans': ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'drawer': 'cubic-bezier(0.76, 0, 0.24, 1)',
      }
    },
  },
  plugins: [],
}
