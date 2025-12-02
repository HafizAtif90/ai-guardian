'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import ShellHeader from './ShellHeader'
import LeftRail from './LeftRail'
import MainCanvas from './MainCanvas'
import RightRail from './RightRail'
import FloatingActionDock from './FloatingActionDock'
import { useUiStore } from '@/lib/store/ui'
import MotionProvider from '../providers/MotionProvider'

export interface AppShellProps {
    children: ReactNode
    headerSlot?: ReactNode
    leftRailSlot?: ReactNode
    rightRailSlot?: ReactNode
    floatingSlot?: ReactNode
}

const AuroraField = () => (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.2),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,245,255,0.15),_transparent_55%)] blur-[90px]" />
        <div
            className="absolute inset-0 opacity-25"
            style={{
                backgroundImage:
                    'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
            }}
        />
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 160px rgba(0,0,0,0.55)' }} />
    </div>
)

const AppShell = ({
    children,
    headerSlot,
    leftRailSlot,
    rightRailSlot,
    floatingSlot,
}: AppShellProps) => {
    const theme = useUiStore((state) => state.theme)
    const hydrateTheme = useUiStore((state) => state.hydrateTheme)
    const leftRailOpen = useUiStore((state) => state.leftRailOpen)
    const rightRailOpen = useUiStore((state) => state.rightRailOpen)
    const setLeftRailOpen = useUiStore((state) => state.setLeftRailOpen)
    const setRightRailOpen = useUiStore((state) => state.setRightRailOpen)
    const setPrefersReducedMotion = useUiStore((state) => state.setPrefersReducedMotion)

    useEffect(() => {
        hydrateTheme()
    }, [hydrateTheme])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(media.matches)
        const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches)
        media.addEventListener('change', handler)
        return () => media.removeEventListener('change', handler)
    }, [setPrefersReducedMotion])

    useEffect(() => {
        if (typeof document === 'undefined') return
        const applyTheme = () => {
            if (typeof window === 'undefined') return
            const resolved =
                theme === 'system'
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark'
                        : 'light'
                    : theme
            document.documentElement.setAttribute('data-theme', resolved)
        }

        applyTheme()

        if (theme !== 'system') return
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => applyTheme()
        media.addEventListener('change', handler)
        return () => media.removeEventListener('change', handler)
    }, [theme])

    return (
        <MotionProvider>
            <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(10,13,40,0.85),_rgba(3,4,18,0.95))] text-text-primary">
                <AuroraField />

                <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-col px-gutter-md pb-gutter-2xl pt-gutter-lg lg:px-gutter-xl">
                    <div className="sticky top-0 z-20 -mx-gutter-md rounded-b-[32px] border-b border-white/10 bg-surface-base/70 px-gutter-md pb-gutter-md pt-gutter-sm backdrop-blur-3xl lg:static lg:mx-0 lg:rounded-none lg:border-none lg:bg-transparent lg:px-0">
                        {headerSlot ?? <ShellHeader />}
                    </div>

                    <div className="mt-gutter-md flex flex-col gap-3 text-sm font-semibold text-text-primary lg:hidden">
                        <button
                            type="button"
                            onClick={() => setLeftRailOpen(true)}
                            className="flex items-center gap-3 rounded-[28px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-md py-gutter-sm text-left shadow-[0_18px_40px_rgba(4,6,24,0.45)]"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[0.8rem] text-neon-signal">AG</span>
                            Open Sentinel Rail
                        </button>
                        <button
                            type="button"
                            onClick={() => setRightRailOpen(true)}
                            className="flex items-center gap-3 rounded-[28px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-md py-gutter-sm text-left shadow-[0_18px_40px_rgba(4,6,24,0.45)]"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[0.8rem] text-aurora">IF</span>
                            Open Insight Rail
                        </button>
                    </div>

                    <div className="mt-gutter-xl grid gap-gutter-lg lg:grid-cols-[18rem_minmax(0,1fr)] 2xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
                        <div className="hidden lg:block">{leftRailSlot ?? <LeftRail />}</div>

                        <MainCanvas>{children}</MainCanvas>

                        <div className="hidden 2xl:block">{rightRailSlot ?? <RightRail />}</div>
                    </div>
                </div>

                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-end px-gutter-lg py-gutter-lg sm:justify-center">
                    {floatingSlot ?? <FloatingActionDock />}
                </div>

                {leftRailOpen && (
                    <div className="fixed inset-0 z-30 bg-surface-overlay/70 backdrop-blur-lg transition lg:hidden">
                        <div className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto rounded-r-[32px] border border-[var(--border-subtle)] bg-surface-base/95 p-gutter-md shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
                            <div className="mb-gutter-sm flex items-center justify-between text-sm">
                                <p className="font-semibold text-text-secondary tracking-[0.3em] uppercase">Sentinel rail</p>
                                <button
                                    type="button"
                                    onClick={() => setLeftRailOpen(false)}
                                    className="inline-flex items-center rounded-full border border-[var(--border-subtle)] px-4 py-1 text-text-primary"
                                >
                                    Close ×
                                </button>
                            </div>
                            {leftRailSlot ?? <LeftRail />}
                        </div>
                    </div>
                )}

                {rightRailOpen && (
                    <div className="fixed inset-0 z-30 bg-surface-overlay/70 backdrop-blur-lg transition 2xl:hidden">
                        <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto rounded-l-[32px] border border-[var(--border-subtle)] bg-surface-base/95 p-gutter-md shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
                            <div className="mb-gutter-sm flex items-center justify-between text-sm">
                                <p className="font-semibold text-text-secondary tracking-[0.3em] uppercase">Insight rail</p>
                                <button
                                    type="button"
                                    onClick={() => setRightRailOpen(false)}
                                    className="inline-flex items-center rounded-full border border-[var(--border-subtle)] px-4 py-1 text-text-primary"
                                >
                                    Close ×
                                </button>
                            </div>
                            {rightRailSlot ?? <RightRail />}
                        </div>
                    </div>
                )}
            </div>
        </MotionProvider>
    )
}

export default AppShell
