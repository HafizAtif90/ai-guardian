import { create } from 'zustand'

export type ThemePreference = 'light' | 'dark' | 'system'

interface UiStoreState {
    theme: ThemePreference
    setTheme: (theme: ThemePreference) => void
    hydrateTheme: () => void
    leftRailOpen: boolean
    rightRailOpen: boolean
    setLeftRailOpen: (open: boolean) => void
    setRightRailOpen: (open: boolean) => void
    prefersReducedMotion: boolean
    setPrefersReducedMotion: (value: boolean) => void
}

const THEME_STORAGE_KEY = 'ai-guardian-theme'

const isBrowser = () => typeof window !== 'undefined'

const readStoredTheme = (): ThemePreference | null => {
    if (!isBrowser()) return null
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') {
        return value
    }
    return null
}

export const useUiStore = create<UiStoreState>((set) => ({
    theme: 'light',
    setTheme: (theme) => {
        if (isBrowser()) {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        }
        set({ theme })
    },
    hydrateTheme: () => {
        if (!isBrowser()) return
        const stored = readStoredTheme()
        if (stored) {
            set({ theme: stored })
            return
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        set({ theme: prefersDark ? 'dark' : 'light' })
    },
    leftRailOpen: false,
    rightRailOpen: false,
    setLeftRailOpen: (open) => set({ leftRailOpen: open }),
    setRightRailOpen: (open) => set({ rightRailOpen: open }),
    prefersReducedMotion: false,
    setPrefersReducedMotion: (value) => set({ prefersReducedMotion: value }),
}))
