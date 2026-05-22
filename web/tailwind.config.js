/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        claudia: {
          rose: '#F4A4B8',
          coral: '#E8786A',
          cream: '#FFF8F0',
          amber: '#F5C76B',
          blush: '#FDE8EC',
          ink: '#4A3F55',
          muted: '#7D6B85',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        soft: '0 8px 32px rgba(232, 120, 106, 0.12)',
        card: '0 4px 20px rgba(74, 63, 85, 0.08)',
      },
    },
  },
  plugins: [],
}
