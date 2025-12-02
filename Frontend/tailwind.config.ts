import type { Config } from 'tailwindcss'
import { tailwindThemeExtensions } from './lib/ui/tokens'

const config: Config = {
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
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'slide-up-fade-in': 'slide-up-fade-in 0.4s var(--ease-standard)',
                'fade-in': 'fade-in 0.3s var(--ease-standard)',
            },
        },
    },
    plugins: [],
}

export default config
