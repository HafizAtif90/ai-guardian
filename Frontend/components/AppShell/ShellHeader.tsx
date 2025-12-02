'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useUiStore } from '@/lib/store/ui'

const statusChips = [
    { label: 'APIs nominal', tone: 'neon-signal' },
    { label: 'Route streaming', tone: 'accent-info' },
]

const ShellHeader = () => {
    const router = useRouter()
    const theme = useUiStore((state) => state.theme)
    const setTheme = useUiStore((state) => state.setTheme)

    const nextTheme = useMemo(() => {
        const order: Array<typeof theme> = ['light', 'dark', 'system']
        const idx = order.indexOf(theme)
        return order[(idx + 1) % order.length]
    }, [theme])

    const themeLabel = theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'

    return (
        <header className="flex flex-col gap-5 rounded-[32px] border border-[var(--border-strong)] bg-surface-base/80 px-gutter-lg py-gutter-lg text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_70px_rgba(4,6,30,0.45)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="flex items-center gap-4 text-left"
                >
                    <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-surface-base/80 via-[#090b2f]/80 to-[#041827]/70 font-display text-2xl font-semibold tracking-tight text-white shadow-[0_15px_40px_rgba(5,5,25,0.55)]" aria-hidden>
                        AG
                    </span>
                    <span>
                        <span className="text-[0.6rem] uppercase tracking-[0.55em] text-text-muted">Safety Command Center</span>
                        <p className="font-display text-3xl font-semibold leading-tight text-white">AI Personal Safety Guardian</p>
                        <p className="text-sm text-text-secondary">Gemini Guardian is online and listening.</p>
                    </span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                    {statusChips.map((chip) => (
                        <span
                            key={chip.label}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/50 px-4 py-1.5 text-xs font-semibold text-text-secondary shadow-[0_10px_25px_rgba(4,6,20,0.45)]"
                        >
                            <span
                                className={`relative h-2 w-2 rounded-full ${chip.tone === 'neon-signal' ? 'bg-neon-signal' : 'bg-accent-info'}`}
                            >
                                <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" aria-hidden />
                            </span>
                            {chip.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-4 rounded-[28px] border border-[var(--border-subtle)] bg-gradient-to-r from-surface-base/80 via-[#05092a]/80 to-[#031827]/70 px-5 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-surface-base/60 text-xs font-semibold uppercase tracking-[0.5em] text-white">
                        SOS
                    </div>
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-text-muted">Live coverage</p>
                        <p className="text-base font-semibold text-white">Monitoring downtown sentinel grid</p>
                    </div>
                </div>

                <button
                    type="button"
                    data-testid="theme-toggle"
                    onClick={() => setTheme(nextTheme)}
                    className="rounded-[28px] border border-transparent bg-gradient-to-r from-aurora via-[#7c3aed] to-[#00f5ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(5,5,20,0.65)] transition hover:border-white/50"
                >
                    Theme · {themeLabel}
                </button>
            </div>
        </header>
    )
}

export default ShellHeader
