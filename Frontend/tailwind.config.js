const { tailwindThemeExtensions } = require('./lib/ui/tokens')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...tailwindThemeExtensions,
      keyframes: {
        'slide-up-fade-in': {
          '0%': {
            transform: 'translateY(30px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'aurora-drift': {
          '0%': {
            transform: 'translate3d(-10%, 0, 0) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '50%': {
            transform: 'translate3d(10%, -5%, 0) scale(1.05)',
            filter: 'hue-rotate(30deg)',
          },
          '100%': {
            transform: 'translate3d(-10%, 0, 0) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.5',
            boxShadow: '0 0 15px rgba(126, 249, 163, 0.35)',
          },
          '50%': {
            opacity: '1',
            boxShadow: '0 0 35px rgba(126, 249, 163, 0.6)',
          },
        },
        'grid-pan': {
          '0%': {
            backgroundPosition: '0 0, 0 0',
          },
          '100%': {
            backgroundPosition: '0 100%, 100% 0',
          },
        },
      },
      animation: {
        'slide-up-fade-in': 'slide-up-fade-in 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'aurora-drift': 'aurora-drift 12s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.8s ease-in-out infinite',
        'grid-pan': 'grid-pan 12s linear infinite',
      },
    },
  },
  plugins: [],
}

