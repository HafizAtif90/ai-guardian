import { m } from 'framer-motion'
import { pillHover } from '@/lib/ui/motion'
import { useUiStore } from '@/lib/store/ui'

export interface ScenarioOption {
    mode: string
    label: string
    description: string
}

interface ScenarioDockProps {
    options: ScenarioOption[]
    activeMode?: string
    onSelect: (mode: string) => void
}

const iconPaths: Record<string, JSX.Element> = {
    image: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 14l2-2 4 4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7.5" r="1.5" />
            <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
        </svg>
    ),
    video: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 7a3 3 0 013-3h7a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
            <path d="M16 10l4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    text: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 6h14M5 12h10M5 18h6" strokeLinecap="round" />
            <path d="M12 6l-2 12" strokeLinecap="round" />
        </svg>
    ),
    audio: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="7" y="4" width="6" height="12" rx="3" />
            <path d="M12 18c3 0 5-2 5-5V9" strokeLinecap="round" />
            <path d="M12 22v-4M8 22h8" strokeLinecap="round" />
        </svg>
    ),
}

const modeAccent: Record<string, { border: string; background: string; glow: string }> = {
    image: {
        border: 'rgba(74, 213, 255, 0.7)',
        background: 'linear-gradient(135deg, rgba(74, 213, 255, 0.15), rgba(0, 0, 0, 0))',
        glow: '0 0 25px rgba(74, 213, 255, 0.35)',
    },
    video: {
        border: 'rgba(255, 87, 127, 0.7)',
        background: 'linear-gradient(135deg, rgba(255, 87, 127, 0.15), rgba(0, 0, 0, 0))',
        glow: '0 0 20px rgba(255, 87, 127, 0.35)',
    },
    text: {
        border: 'rgba(203, 178, 255, 0.5)',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(0, 0, 0, 0))',
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    },
    audio: {
        border: 'rgba(126, 249, 163, 0.6)',
        background: 'linear-gradient(135deg, rgba(126, 249, 163, 0.18), rgba(0, 0, 0, 0))',
        glow: '0 0 25px rgba(126, 249, 163, 0.35)',
    },
}

const ScenarioDock = ({ options, activeMode, onSelect }: ScenarioDockProps) => {
    const prefersReducedMotion = useUiStore((state) => state.prefersReducedMotion)
    const hoverVariants = pillHover(prefersReducedMotion)

    return (
        <section className="space-y-gutter-sm rounded-[32px] border border-[var(--border-strong)] bg-surface-base/70 px-gutter-lg py-gutter-lg text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_65px_rgba(4,6,28,0.35)]">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Scenario matrix</p>
                    <h2 className="font-display text-2xl font-semibold leading-tight">Select your mission channel</h2>
                    <p className="text-sm text-text-secondary">Each mode primes Guardian for a different intel stream.</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
                    <span className="rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1 text-text-primary">
                        {activeMode ? `${activeMode} active` : 'Standing by'}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] text-text-secondary">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-aurora" />
                        Neural uplink synced
                    </span>
                </div>
            </header>

            <div className="mt-gutter-md grid gap-gutter-md sm:grid-cols-2">
                {options.map((option) => {
                    const isActive = option.mode === activeMode
                    const accent = modeAccent[option.mode] ?? modeAccent.text
                    return (
                        <m.button
                            key={option.mode}
                            type="button"
                            initial="rest"
                            whileHover="hover"
                            variants={hoverVariants}
                            onClick={() => onSelect(option.mode)}
                            aria-pressed={isActive}
                            className="group relative overflow-hidden rounded-3xl border px-5 py-5 text-left transition hover:border-aurora hover:shadow-[0_18px_40px_rgba(4,244,255,0.15)]"
                            style={{
                                borderColor: isActive ? accent.border : 'var(--border-subtle)',
                                backgroundImage: accent.background,
                                boxShadow: isActive ? accent.glow : 'none',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <span
                                    className={`rounded-2xl border p-2 ${isActive ? 'border-[var(--border-neon)] bg-surface-raised/40 text-white drop-shadow-neon' : 'border-[var(--border-subtle)] bg-surface-base/60 text-text-secondary'}`}
                                >
                                    {iconPaths[option.mode] ?? iconPaths.text}
                                </span>
                                <div>
                                    <p className="font-display text-lg font-semibold leading-tight">{option.label}</p>
                                    <p className="text-sm text-text-muted transition-colors group-hover:text-text-secondary">
                                        {option.description}
                                    </p>
                                    <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-text-muted">
                                        {option.mode}
                                        <span className="h-1 w-6 rounded-full bg-gradient-to-r from-aurora to-transparent opacity-70" />
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{
                                            backgroundColor: isActive
                                                ? 'var(--color-neon-signal)'
                                                : 'rgba(148, 163, 184, 0.4)',
                                        }}
                                    />
                                    {isActive ? 'Streaming' : 'Ready'}
                                </span>
                                <span className="text-text-muted">Gemini link {isActive ? 'stabilized' : 'on standby'}</span>
                            </div>
                        </m.button>
                    )
                })}
            </div>
        </section>
    )
}

export default ScenarioDock
