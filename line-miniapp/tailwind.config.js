/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4d9a8',
          300: '#ecc26d',
          400: '#e2a53a',
          500: '#d4891a',
          600: '#b86c10',
          700: '#98520f',
          800: '#7c4212',
          900: '#673713',
          950: '#3b1c07',
        },
        cream: {
          50: '#fffdf7',
          100: '#fef9e7',
          200: '#fdf0c3',
          300: '#fce58f',
          400: '#fad54f',
          500: '#f8c224',
        },
      },
      fontFamily: {
        thai: ['Sarabun', 'Noto Sans Thai', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
