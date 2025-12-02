/**
 * Neon-infused design tokens powering the "Safety Command Center" UI.
 * Keep values in sync with docs/guides/ui-overhaul-plan.md and globals.css.
 */

export type ThemeMode = 'light' | 'dark'

export interface DesignTokens {
    mode: ThemeMode
    color: {
        brand: Record<number, string>
        accent: {
            calm: string
            alert: string
            info: string
        }
        neon: {
            signal: string
            caution: string
            danger: string
        }
        text: {
            primary: string
            secondary: string
            muted: string
            inverse: string
        }
        threat: {
            low: string
            medium: string
            high: string
            critical: string
            unknown: string
        }
    }
    surface: {
        base: string
        raised: string
        overlay: string
        border: string
    }
    glass: Record<'frost' | 'deep' | 'highlight', string>
    border: Record<'subtle' | 'strong' | 'neon', string>
    blur: Record<'sm' | 'md' | 'lg', string>
    gradient: {
        sunrise: string
        nightwatch: string
        pulse: string
        aurora: string
        horizon: string
    }
    typography: {
        fontFamily: {
            sans: string
            display: string
            mono: string
        }
        sizes: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>
        weights: Record<'regular' | 'medium' | 'semibold' | 'bold', number>
    }
    radii: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
    shadows: Record<'soft' | 'raised' | 'overlay', string>
    spacing: Record<'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>
    transitions: Record<'standard' | 'emphasis' | 'entrance', string>
}

const brandPalette = {
    25: '#f9f6ff',
    50: '#f3e8ff',
    100: '#e4d4ff',
    200: '#d0b8ff',
    300: '#b892ff',
    400: '#a16dff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#5b21b6',
    800: '#4c1d95',
    900: '#3b0f73',
} as const

const accentPalette = {
    calm: '#0be6b9',
    alert: '#ff7ca3',
    info: '#4ad5ff',
} as const

const neonPalette = {
    signal: '#7ef9a3',
    caution: '#ffb347',
    danger: '#ff577f',
} as const

const threatPalette = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
    unknown: '#6b7280',
} as const

const typographyTokens = {
    fontFamily: {
        sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: '"Space Grotesk", "Inter", system-ui, sans-serif',
        mono: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
    },
    sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.375rem',
        '2xl': '1.75rem',
    },
    weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const

const radiiTokens = {
    xs: '0.375rem',
    sm: '0.625rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
} as const

const shadowTokens = {
    soft: '0 12px 32px rgba(39, 25, 77, 0.08)',
    raised: '0 32px 90px rgba(7, 8, 32, 0.35)',
    overlay: '0 38px 140px rgba(4, 7, 23, 0.65)',
} as const

const spacingTokens = {
    '2xs': '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
} as const

const transitionTokens = {
    standard: '150ms cubic-bezier(0.2, 0.8, 0.4, 1)',
    emphasis: '220ms cubic-bezier(0.17, 0.92, 0.38, 0.98)',
    entrance: '120ms cubic-bezier(0.11, 0.9, 0.51, 0.99)',
} as const

const surfaces = {
    light: {
        text: {
            primary: '#f8fafc',
            secondary: '#c9d6ff',
            muted: '#94a3b8',
            inverse: '#05011a',
        },
        layer: {
            base: '#05011a',
            raised: 'rgba(13, 12, 35, 0.74)',
            overlay: 'rgba(5, 4, 25, 0.85)',
            border: 'rgba(203, 178, 255, 0.18)',
        },
    },
    dark: {
        text: {
            primary: '#f9f9ff',
            secondary: '#dbe4ff',
            muted: '#9da7c7',
            inverse: '#05011a',
        },
        layer: {
            base: '#020618',
            raised: 'rgba(10, 12, 32, 0.8)',
            overlay: 'rgba(1, 3, 18, 0.9)',
            border: 'rgba(119, 123, 255, 0.28)',
        },
    },
} as const

const glassTokens = {
    light: {
        frost: 'rgba(11, 13, 31, 0.55)',
        deep: 'rgba(5, 6, 24, 0.8)',
        highlight: 'rgba(255, 255, 255, 0.08)',
    },
    dark: {
        frost: 'rgba(5, 6, 18, 0.7)',
        deep: 'rgba(2, 3, 12, 0.85)',
        highlight: 'rgba(255, 255, 255, 0.04)',
    },
} as const

const borderTokens = {
    light: {
        subtle: 'rgba(255, 255, 255, 0.18)',
        strong: 'rgba(255, 255, 255, 0.32)',
        neon: 'rgba(126, 249, 163, 0.8)',
    },
    dark: {
        subtle: 'rgba(255, 255, 255, 0.12)',
        strong: 'rgba(255, 255, 255, 0.26)',
        neon: 'rgba(126, 249, 163, 0.72)',
    },
} as const

const blurTokens = {
    sm: '8px',
    md: '18px',
    lg: '36px',
} as const

const gradients = {
    light: {
        sunrise: 'linear-gradient(120deg, #20115e 0%, #2c1b8f 45%, #0e1a47 100%)',
        nightwatch: 'linear-gradient(135deg, #05011a 0%, #1b1440 60%, #5f1fb0 100%)',
        aurora: 'linear-gradient(140deg, #3421f3 0%, #c026d3 50%, #05c3dd 100%)',
        horizon: 'radial-gradient(circle at 20% 20%, rgba(126, 249, 163, 0.4), rgba(8, 11, 53, 0))',
        pulse: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.35), rgba(5, 5, 20, 0))',
    },
    dark: {
        sunrise: 'linear-gradient(120deg, #140731 0%, #231052 55%, #05011a 100%)',
        nightwatch: 'linear-gradient(135deg, #020615 0%, #050d27 60%, #4b0fb3 100%)',
        aurora: 'linear-gradient(140deg, #1a0f7c 0%, #5a1ab5 45%, #05a1c7 100%)',
        horizon: 'radial-gradient(circle at 80% 20%, rgba(126, 249, 163, 0.25), rgba(1, 3, 18, 0))',
        pulse: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.25), rgba(2, 2, 12, 0))',
    },
} as const

export const baseTokens = {
    color: {
        brand: brandPalette,
        accent: accentPalette,
        neon: neonPalette,
        threat: threatPalette,
    },
    typography: typographyTokens,
    radii: radiiTokens,
    shadows: shadowTokens,
    spacing: spacingTokens,
    transitions: transitionTokens,
    blur: blurTokens,
} as const

export const themeTokens: Record<ThemeMode, DesignTokens> = {
    light: {
        mode: 'light',
        color: {
            brand: brandPalette,
            accent: accentPalette,
            neon: neonPalette,
            text: surfaces.light.text,
            threat: threatPalette,
        },
        surface: surfaces.light.layer,
        glass: glassTokens.light,
        border: borderTokens.light,
        blur: blurTokens,
        gradient: gradients.light,
        typography: typographyTokens,
        radii: radiiTokens,
        shadows: shadowTokens,
        spacing: spacingTokens,
        transitions: transitionTokens,
    },
    dark: {
        mode: 'dark',
        color: {
            brand: brandPalette,
            accent: accentPalette,
            neon: neonPalette,
            text: surfaces.dark.text,
            threat: threatPalette,
        },
        surface: surfaces.dark.layer,
        glass: glassTokens.dark,
        border: borderTokens.dark,
        blur: blurTokens,
        gradient: gradients.dark,
        typography: typographyTokens,
        radii: radiiTokens,
        shadows: shadowTokens,
        spacing: spacingTokens,
        transitions: transitionTokens,
    },
}

export const getDesignTokens = (mode: ThemeMode = 'light'): DesignTokens => themeTokens[mode]

export type CssVarMap = Record<string, string>

export const getCssVarMap = (mode: ThemeMode = 'light'): CssVarMap => {
    const tokens = getDesignTokens(mode)
    return {
        '--color-brand-soft': tokens.color.brand[50],
        '--color-brand-strong': tokens.color.brand[500],
        '--color-brand-vivid': tokens.color.brand[600],
        '--color-accent-calm': tokens.color.accent.calm,
        '--color-accent-alert': tokens.color.accent.alert,
        '--color-accent-info': tokens.color.accent.info,
        '--color-neon-signal': tokens.color.neon.signal,
        '--color-neon-caution': tokens.color.neon.caution,
        '--color-neon-danger': tokens.color.neon.danger,
        '--color-text-primary': tokens.color.text.primary,
        '--color-text-secondary': tokens.color.text.secondary,
        '--color-text-muted': tokens.color.text.muted,
        '--color-text-inverse': tokens.color.text.inverse,
        '--color-threat-low': tokens.color.threat.low,
        '--color-threat-medium': tokens.color.threat.medium,
        '--color-threat-high': tokens.color.threat.high,
        '--color-threat-critical': tokens.color.threat.critical,
        '--color-threat-unknown': tokens.color.threat.unknown,
        '--color-surface-base': tokens.surface.base,
        '--color-surface-raised': tokens.surface.raised,
        '--color-surface-overlay': tokens.surface.overlay,
        '--color-surface-border': tokens.surface.border,
        '--glass-frost': tokens.glass.frost,
        '--glass-deep': tokens.glass.deep,
        '--glass-highlight': tokens.glass.highlight,
        '--border-subtle': tokens.border.subtle,
        '--border-strong': tokens.border.strong,
        '--border-neon': tokens.border.neon,
        '--blur-sm': tokens.blur.sm,
        '--blur-md': tokens.blur.md,
        '--blur-lg': tokens.blur.lg,
        '--gradient-sunrise': tokens.gradient.sunrise,
        '--gradient-nightwatch': tokens.gradient.nightwatch,
        '--gradient-pulse': tokens.gradient.pulse,
        '--gradient-aurora': tokens.gradient.aurora,
        '--gradient-horizon': tokens.gradient.horizon,
        '--shadow-soft': tokens.shadows.soft,
        '--shadow-raised': tokens.shadows.raised,
        '--shadow-overlay': tokens.shadows.overlay,
        '--radius-xs': tokens.radii.xs,
        '--radius-sm': tokens.radii.sm,
        '--radius-md': tokens.radii.md,
        '--radius-lg': tokens.radii.lg,
        '--radius-xl': tokens.radii.xl,
        '--gutter-2xs': tokens.spacing['2xs'],
        '--gutter-xs': tokens.spacing.xs,
        '--gutter-sm': tokens.spacing.sm,
        '--gutter-md': tokens.spacing.md,
        '--gutter-lg': tokens.spacing.lg,
        '--gutter-xl': tokens.spacing.xl,
        '--gutter-2xl': tokens.spacing['2xl'],
        '--ease-standard': tokens.transitions.standard,
        '--ease-emphasis': tokens.transitions.emphasis,
        '--ease-entrance': tokens.transitions.entrance,
        '--font-sans': tokens.typography.fontFamily.sans,
        '--font-display': tokens.typography.fontFamily.display,
        '--font-mono': tokens.typography.fontFamily.mono,
    }
}

export const tailwindThemeExtensions = {
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
} as const
