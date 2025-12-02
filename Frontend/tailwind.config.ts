import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                surface: {
                    base: 'var(--color-surface-base)',
                    raised: 'var(--color-surface-raised)',
                    overlay: 'var(--color-surface-overlay)',
                    border: 'var(--color-surface-border)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                    inverse: 'var(--color-text-inverse)',
                },
                brand: {
                    soft: 'var(--color-brand-soft)',
                    strong: 'var(--color-brand-strong)',
                    vivid: 'var(--color-brand-vivid)',
                },
                accent: {
                    calm: 'var(--color-accent-calm)',
                    alert: 'var(--color-accent-alert)',
                    info: 'var(--color-accent-info)',
                },
                neon: {
                    signal: 'var(--color-neon-signal)',
                    caution: 'var(--color-neon-caution)',
                    danger: 'var(--color-neon-danger)',
                },
                threat: {
                    low: 'var(--color-threat-low)',
                    medium: 'var(--color-threat-medium)',
                    high: 'var(--color-threat-high)',
                    critical: 'var(--color-threat-critical)',
                    unknown: 'var(--color-threat-unknown)',
                },
            },
            borderRadius: {
                xs: 'var(--radius-xs)',
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            boxShadow: {
                soft: 'var(--shadow-soft)',
                raised: 'var(--shadow-raised)',
                overlay: 'var(--shadow-overlay)',
            },
            backdropBlur: {
                glass: 'var(--blur-sm)',
                panel: 'var(--blur-md)',
                deep: 'var(--blur-lg)',
            },
            dropShadow: {
                neon: '0 0 25px var(--color-neon-signal)',
                caution: '0 0 20px var(--color-neon-caution)',
                danger: '0 0 20px var(--color-neon-danger)',
            },
            backgroundImage: {
                aurora: 'var(--gradient-aurora)',
                horizon: 'var(--gradient-horizon)',
                sunrise: 'var(--gradient-sunrise)',
                nightwatch: 'var(--gradient-nightwatch)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace'],
            },
            spacing: {
                'gutter-2xs': 'var(--gutter-2xs)',
                'gutter-xs': 'var(--gutter-xs)',
                'gutter-sm': 'var(--gutter-sm)',
                'gutter-md': 'var(--gutter-md)',
                'gutter-lg': 'var(--gutter-lg)',
                'gutter-xl': 'var(--gutter-xl)',
                'gutter-2xl': 'var(--gutter-2xl)',
            },
            transitionTimingFunction: {
                standard: 'var(--ease-standard)',
                emphasis: 'var(--ease-emphasis)',
                entrance: 'var(--ease-entrance)',
            },
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
