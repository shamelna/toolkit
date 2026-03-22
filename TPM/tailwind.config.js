/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#ffd559',
        'dark': '#1a1a1a',
        'grey': '#2a2a2a',
        'light-grey': '#f5f5f5',
        'white': '#ffffff',
        'accent': '#ff6b35',
        'flash-red': '#dc2626',
        'border-color': '#e5e5e5',
        'text-muted': '#666666',
      },
      fontFamily: {
        'heading': ['Bebas Neue', 'sans-serif'],
        'body': ['Work Sans', 'sans-serif'],
      },
      boxShadow: {
        'kaizen': '0 8px 30px rgba(255, 213, 89, 0.4)',
        'kaizen-hover': '0 12px 40px rgba(255, 213, 89, 0.5)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
