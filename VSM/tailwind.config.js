/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD559',
        'brand-yellow-light': '#FFE8A3',
        'brand-yellow-dark': '#E6C24D',
        'brand-black': '#000000',
        'brand-darkgrey': '#333333',
        'brand-mediumgrey': '#666666',
        'brand-lightgrey': '#F5F5F5',
        'brand-offwhite': '#FAFAFA',
        'success-green': '#4CAF50',
        'success-green-light': '#81C784',
        'success-green-dark': '#388E3C',
        'error-red': '#F44336',
        'error-red-light': '#EF5350',
        'error-red-dark': '#D32F2F',
        'warning-orange': '#FF9800',
        'warning-orange-light': '#FFB74D',
        'warning-orange-dark': '#F57C00',
        'info-blue': '#2196F3',
        'info-blue-light': '#64B5F6',
        'info-blue-dark': '#1976D2',
        'level-advanced': '#4CAF50',
        'level-advanced-bg': '#E8F5E8',
        'level-intermediate': '#2196F3',
        'level-intermediate-bg': '#E3F2FD',
        'level-developing': '#FF9800',
        'level-developing-bg': '#FFF3E0',
        'level-beginner': '#9E9E9E',
        'level-beginner-bg': '#F5F5F5',
      },
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      fontSize: {
        'h1': '2.5rem',
        'h2': '2rem',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'h5': '1.125rem',
        'h6': '1rem',
        'lg': '1.125rem',
        'base': '1rem',
        'sm': '0.875rem',
        'xs': '0.75rem',
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.75',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
