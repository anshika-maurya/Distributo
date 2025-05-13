/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b0ff',
          400: '#3396ff',
          500: '#007ACC',
          600: '#0062a3',
          700: '#004e83',
          800: '#003a62',
          900: '#002641',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d6d6d6',
          300: '#b8b8b8',
          400: '#9e9e9e',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#303030',
          900: '#212121',
        },
        success: {
          500: '#28a745',
          600: '#218838',
        },
        danger: {
          500: '#dc3545',
          600: '#c82333',
        },
        warning: {
          500: '#ffc107',
          600: '#e0a800',
        },
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        nav: '0 2px 4px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

