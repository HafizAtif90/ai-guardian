import type { ReactNode } from 'react'

interface LeftRailProps {
    children?: ReactNode
}

type PanicTone = 'signal' | 'caution' | 'danger'

const sentinelStats = [
    { label: 'Safe zones nearby', value: '5', meta: '+2 in 10 min' },
    { label: 'Trusted contacts', value: '3', meta: 'All online' },
    { label: 'Evidence files', value: '12', meta: 'Synced' },
]

const panicShortcuts: Array<{
    title: string
    body: string
    action: string
    tone: PanicTone
}> = [
        {
            title: 'Call emergency services',
            body: 'Dials 911 and streams live location audio.',
            action: 'Ready',
            tone: 'danger',
        },
        {
            title: 'Share live location',
            body: 'Broadcasts route + status to trusted circle.',
            action: 'Encrypted',
            tone: 'signal',
        },
        {
            title: 'Send distress ping',
            body: 'Sends audio snapshot + panic note.',
            action: 'Primed',
            tone: 'caution',
        },
    ]

const toneAccent: Record<PanicTone, { border: string; glow: string; chip: string }> = {
    signal: {
        border: 'border border-[var(--border-neon)] bg-[rgba(126,249,163,0.12)]',
        glow: 'shadow-[0_18px_40px_rgba(9,34,24,0.55)]',
        chip: 'text-neon-signal',
    },
    caution: {
        border: 'border border-[var(--border-strong)] bg-[rgba(255,196,108,0.1)]',
        glow: 'shadow-[0_18px_40px_rgba(36,16,0,0.45)]',
        chip: 'text-amber-300',
    },
    danger: {
        border: 'border border-[var(--border-strong)] bg-[rgba(255,87,126,0.12)]',
        glow: 'shadow-[0_18px_40px_rgba(48,9,21,0.6)]',
        chip: 'text-rose-300',
    },
}

const LeftRail = ({ children }: LeftRailProps) => {
    if (children) {
        return (
            <aside className="sticky top-gutter-xl space-y-gutter-md">{children}</aside>
        )
    }

    return (
        <aside className="sentinel-rail sticky top-gutter-xl space-y-gutter-lg text-sm text-text-primary">
            <section className="rounded-[32px] border border-[var(--border-strong)] bg-surface-base/75 px-gutter-lg py-gutter-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_28px_70px_rgba(3,4,20,0.55)]">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-3xl border border-[var(--border-strong)] bg-surface-base/40 text-xl font-semibold tracking-tight shadow-[0_12px_30px_rgba(4,6,30,0.35)]" aria-hidden>
                            AG
                        </span>
                        <div>
                            <p className="text-[0.65rem] uppercase tracking-[0.55em] text-text-muted">Sentinel</p>
                            <p className="font-display text-2xl font-semibold leading-tight">AI Guardian</p>
                            <p className="text-xs text-text-secondary">Personal safety cockpit</p>
                        </div>
                    </div>
                    <div className="rounded-full border border-[var(--border-subtle)] bg-surface-base/50 px-4 py-2 text-right text-[0.65rem] uppercase tracking-[0.45em] text-text-muted">
                        <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-aurora" />System nominal
                        <p className="mt-1 text-[0.6rem] tracking-[0.4em]">Latency · 118ms</p>
                    </div>
                </div>

                <div className="mt-gutter-md grid grid-cols-3 gap-3 text-xs">
                    {sentinelStats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-[var(--border-subtle)] bg-surface-base/40 p-4">
                            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-text-muted">{stat.label}</p>
                            <p className="mt-2 font-display text-2xl font-semibold text-white">{stat.value}</p>
                            <p className="text-[0.65rem] text-text-secondary">{stat.meta}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-[32px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-lg py-gutter-lg shadow-[0_25px_60px_rgba(3,4,20,0.5)]">
                <header className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Response stack</p>
                        <h2 className="font-display text-xl font-semibold">Emergency shortcuts</h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-neon)] bg-surface-base/40 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-neon-signal">
                        <span className="h-2 w-2 rounded-full bg-neon-signal shadow-[0_0_12px_var(--color-neon-signal)]" aria-hidden />
                        Live
                    </span>
                </header>

                <div className="mt-gutter-md space-y-gutter-sm">
                    {panicShortcuts.map((item) => {
                        const accent = toneAccent[item.tone]
                        return (
                            <button
                                key={item.title}
                                type="button"
                                className={`group w-full rounded-[28px] px-5 py-4 text-left transition hover:border-aurora hover:drop-shadow-neon ${accent.border} ${accent.glow}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-display text-base font-semibold text-white">{item.title}</p>
                                        <p className="mt-1 text-sm text-text-secondary">{item.body}</p>
                                    </div>
                                    <span className="rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-text-muted">
                                        {item.action}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-text-muted">
                                    <span className={`h-1.5 w-1.5 rounded-full ${accent.chip}`}></span>
                                    Guardian ready
                                </div>
                            </button>
                        )
                    })}
                </div>
            </section>

            <section className="rounded-[32px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-lg py-gutter-lg shadow-[0_20px_55px_rgba(3,4,20,0.45)]">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Preparedness</p>
                        <h2 className="font-display text-xl font-semibold">Micro-guides</h2>
                    </div>
                    <span className="text-[0.65rem] uppercase tracking-[0.4em] text-text-secondary">Updated 2 min ago</span>
                </header>

                <div className="mt-gutter-md space-y-gutter-sm text-sm text-text-secondary">
                    <article className="rounded-[28px] border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/80 via-[#0c0f2d]/80 to-[#04131f]/70 p-5">
                        <h3 className="text-base font-semibold text-white">If someone shadows you</h3>
                        <p className="mt-2 leading-relaxed">
                            Change pace, cross the street twice, and head to a lit business. Keep AI Guardian connected and prep
                            the distress ping.
                        </p>
                    </article>
                    <article className="rounded-[28px] border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/80 via-[#14062f]/80 to-[#051a2e]/70 p-5">
                        <h3 className="text-base font-semibold text-white">Low-visibility routes</h3>
                        <p className="mt-2 leading-relaxed">
                            Switch to the recommended detour or request a flashlight escort from your trusted circle.
                        </p>
                    </article>
                </div>
            </section>
        </aside>
    )
}

export default LeftRail
