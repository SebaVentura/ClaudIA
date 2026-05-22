/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        claudia: {
          navy: '#173B63',
          turquoise: '#52C7C7',
          lavender: '#9B8AD7',
          rose: '#E98AA5',
          warm: '#FFF3E8',
          cream: '#FFF8F2',
          mist: '#F1F7FF',
          amber: '#F4C95D',
          blush: '#EEF4FA',
          ink: '#173B63',
          muted: '#5C6F82',
          /* acento histórico → usar rose solo en alertas */
          coral: '#E98AA5',
        },
      },
      backgroundImage: {
        'claudia-page': 'linear-gradient(to bottom right, #FFF3E8 0%, #FFF8F2 45%, #F1F7FF 100%)',
        'claudia-cta': 'linear-gradient(135deg, #173B63 0%, #52C7C7 100%)',
        'claudia-hero-text': 'linear-gradient(90deg, #173B63 0%, #52C7C7 50%, #9B8AD7 100%)',
        'claudia-hero': 'linear-gradient(135deg, #FFF3E8 0%, #FFF8F2 40%, #EDE8F8 70%, #E8F6F6 100%)',
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
        soft: '0 8px 32px rgba(23, 59, 99, 0.1)',
        card: '0 4px 20px rgba(23, 59, 99, 0.08)',
      },
    },
  },
  plugins: [],
}
