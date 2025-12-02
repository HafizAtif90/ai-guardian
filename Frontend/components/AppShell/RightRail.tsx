import type { ReactNode } from 'react'

interface RightRailProps {
    children?: ReactNode
}

type AlertTone = 'signal' | 'caution'

const safeRoute = {
    title: 'Detour · Aurora Ave',
    eta: '8 min',
    distance: '0.6 mi',
    summary: 'Shift north toward the lit promenade, then rejoin 5th on the east side.',
    checkpoints: [
        { label: 'Beacon Plaza', status: 'Clear', time: '20:34' },
        { label: 'Harbor Bridge', status: 'Monitored', time: '20:36' },
        { label: 'Lumen Alley', status: 'Patrol en route', time: '20:39' },
    ],
}

const telemetry = [
    { label: 'Audio', value: 'Analyzed', meta: 'Wind noise filtered' },
    { label: 'Video', value: 'Queued', meta: 'Awaiting upload' },
    { label: 'Text', value: 'Summarized', meta: 'Threat keywords detected' },
]

const alerts: Array<{ level: string; copy: string; time: string; tone: AlertTone }> = [
    { level: 'Caution', copy: 'Crowd surge detected two blocks south.', time: '20:41', tone: 'caution' },
    { level: 'Info', copy: 'Trusted contact Ava joined the session.', time: '20:42', tone: 'signal' },
]

const toneClass: Record<AlertTone, string> = {
    signal: 'border border-[var(--border-neon)] bg-surface-base/70 text-neon-signal shadow-[0_15px_30px_rgba(15,40,40,0.35)]',
    caution: 'border border-[var(--border-strong)] bg-[rgba(255,184,108,0.08)] text-neon-caution shadow-[0_15px_30px_rgba(40,25,5,0.35)]',
}

const checkpointTone: Record<string, string> = {
    Clear: 'text-emerald-300',
    Monitored: 'text-sky-300',
    'Patrol en route': 'text-amber-300',
}

const RightRail = ({ children }: RightRailProps) => {
    if (children) {
        return (
            <aside className="sticky top-gutter-xl space-y-gutter-md">{children}</aside>
        )
    }

    return (
        <aside className="insight-rail sticky top-gutter-xl space-y-gutter-lg text-sm text-text-primary">
            <section className="rounded-[32px] border border-[var(--border-strong)] bg-surface-base/75 px-gutter-lg py-gutter-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_70px_rgba(5,6,30,0.45)]">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Safe route</p>
                        <h2 className="font-display text-2xl font-semibold leading-tight">{safeRoute.title}</h2>
                        <p className="mt-2 text-sm text-text-secondary">{safeRoute.summary}</p>
                    </div>
                    <div className="rounded-3xl border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-3 text-right">
                        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-text-muted">ETA</p>
                        <p className="text-3xl font-semibold text-white">{safeRoute.eta}</p>
                        <p className="text-xs text-text-secondary">{safeRoute.distance}</p>
                    </div>
                </header>

                <div className="mt-gutter-md flex flex-col gap-4">
                    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_55%)] px-6 py-6 text-sm">
                        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
                            <div className="absolute inset-4 rounded-[28px] border border-white/5" />
                            <div className="absolute left-1/2 top-3 h-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border-neon)] to-transparent" />
                        </div>
                        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-text-muted">Holo-map</p>
                        <p className="mt-2 text-lg font-semibold">Aurora Corridor</p>
                        <p className="text-sm text-text-secondary">Guided lanes active · hazards suppressed</p>
                    </div>

                    <div className="rounded-[28px] border border-[var(--border-subtle)] bg-surface-base/60">
                        {safeRoute.checkpoints.map((checkpoint, index) => (
                            <div
                                key={checkpoint.label}
                                className="flex items-center justify-between gap-3 px-5 py-4 text-sm"
                            >
                                <div>
                                    <p className="text-base font-semibold text-white">{checkpoint.label}</p>
                                    <p className={`text-xs uppercase tracking-[0.3em] ${checkpointTone[checkpoint.status] ?? 'text-text-muted'}`}>
                                        {checkpoint.status}
                                    </p>
                                </div>
                                <div className="text-right text-xs text-text-muted">
                                    <p>{checkpoint.time}</p>
                                    <p className="text-[0.65rem]">Waypoint {index + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-[32px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-lg py-gutter-lg shadow-[0_25px_60px_rgba(5,6,28,0.4)]">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Telemetry</p>
                        <h3 className="font-display text-xl font-semibold">Evidence status</h3>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-text-secondary">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-aurora" />
                        Sync 45s
                    </span>
                </header>

                <div className="mt-gutter-md space-y-4">
                    {telemetry.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-r from-surface-base/80 via-[#070b23]/80 to-[#041b2f]/70 px-5 py-4"
                        >
                            <div>
                                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-text-muted">{item.label}</p>
                                <p className="text-lg font-semibold text-white">{item.value}</p>
                                <p className="text-xs text-text-secondary">{item.meta}</p>
                            </div>
                            <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[0.65rem] text-text-muted">
                                +0.2s
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-[32px] border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-lg py-gutter-lg shadow-[0_25px_60px_rgba(5,6,28,0.4)]">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Live alerts</p>
                        <h3 className="font-display text-xl font-semibold">Insight feed</h3>
                    </div>
                    <span className="text-xs text-text-secondary">Streamed</span>
                </header>

                <div className="mt-gutter-md space-y-gutter-sm" aria-live="polite">
                    {alerts.map((alert) => (
                        <article key={`${alert.level}-${alert.time}`} className={`rounded-3xl px-5 py-4 ${toneClass[alert.tone]}`}>
                            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em]">
                                <span>{alert.level}</span>
                                <span className="text-text-muted">{alert.time}</span>
                            </div>
                            <p className="mt-2 text-sm text-white">{alert.copy}</p>
                        </article>
                    ))}
                </div>
            </section>
        </aside>
    )
}

export default RightRail
