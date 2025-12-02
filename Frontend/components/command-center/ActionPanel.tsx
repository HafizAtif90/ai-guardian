import { FormEvent, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { pillHover } from '@/lib/ui/motion'
import { useUiStore } from '@/lib/store/ui'

export interface ActionShortcut {
    id: string
    label: string
    icon: ReactNode
    onClick: () => void
}

interface ActionPanelProps {
    chatInput: string
    onChatChange: (value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onShareLocation: () => void
    isAnalyzing?: boolean
    isSharingLocation?: boolean
    shortcuts?: ActionShortcut[]
}

const ActionPanel = ({
    chatInput,
    onChatChange,
    onSubmit,
    onShareLocation,
    isAnalyzing,
    isSharingLocation,
    shortcuts = [],
}: ActionPanelProps) => {
    const prefersReducedMotion = useUiStore((state) => state.prefersReducedMotion)
    const hoverVariants = pillHover(prefersReducedMotion)

    return (
        <section className="space-y-gutter-lg">
            <form
                onSubmit={onSubmit}
                className="glass-panel border border-[var(--border-strong)] bg-surface-base/70 px-gutter-lg py-gutter-md text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
                <header className="mb-gutter flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Console</p>
                        <p className="text-lg font-semibold text-text-primary">Guardian command uplink</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora opacity-50"></span>
                            <span className={`relative inline-flex h-2 w-2 rounded-full ${isAnalyzing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                        </span>
                        <span>{isAnalyzing ? 'Processing' : 'Live'}</span>
                    </div>
                </header>
                <div className="flex flex-col gap-gutter-md lg:flex-row">
                    <div className="flex-1 rounded-3xl border border-[var(--border-subtle)] bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]/100 px-gutter-md py-gutter-md">
                        <label className="sr-only" htmlFor="guardian-input">
                            Describe the situation
                        </label>
                        <textarea
                            id="guardian-input"
                            value={chatInput}
                            onChange={(event) => onChatChange(event.target.value)}
                            placeholder="Ask about safety concerns or describe a situation…"
                            className="h-32 w-full resize-none rounded-2xl border border-[var(--border-subtle)] bg-surface-base/70 px-gutter-md py-gutter-sm text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-aurora/50"
                            disabled={isAnalyzing || isSharingLocation}
                        />
                        <p className="mt-3 text-xs text-text-secondary">
                            The more intel you provide, the faster Guardian triangulates risk windows.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 lg:w-72">
                        <m.button
                            type="button"
                            initial="rest"
                            whileHover="hover"
                            variants={hoverVariants}
                            onClick={onShareLocation}
                            disabled={isAnalyzing || isSharingLocation}
                            className="group flex items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-gradient-to-br from-surface-base/80 via-surface-raised/80 to-surface-base/40 px-5 py-4 text-left text-sm font-semibold text-text-primary shadow-[0_10px_30px_rgba(3,8,20,0.45)] transition hover:border-aurora hover:shadow-[0_20px_40px_rgba(4,244,255,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span>
                                Share live location
                                <span className="block text-xs font-normal text-text-muted">Unlock safe-route guidance</span>
                            </span>
                            {isSharingLocation ? (
                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        strokeWidth="4"
                                        fill="currentColor"
                                    />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3c3.314 0 6 2.686 6 6 0 4.5-6 12-6 12S6 13.5 6 9c0-3.314 2.686-6 6-6z"
                                    />
                                    <circle cx="12" cy="9" r="2" />
                                </svg>
                            )}
                        </m.button>

                        <m.button
                            type="submit"
                            initial="rest"
                            whileHover="hover"
                            variants={hoverVariants}
                            disabled={!chatInput.trim() || isAnalyzing || isSharingLocation}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-gradient-to-r from-aurora via-[#7c3aed] to-[#00f5ff] px-4 py-3 text-base font-semibold text-white shadow-[0_25px_55px_rgba(5,5,20,0.65)] transition hover:border-white/60 hover:drop-shadow-neon disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            strokeWidth="4"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Processing…
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Deploy briefing
                                </>
                            )}
                        </m.button>
                    </div>
                </div>
            </form>

            {shortcuts.length > 0 && (
                <div className="grid grid-cols-1 gap-gutter-md md:grid-cols-2">
                    {shortcuts.map((shortcut) => (
                        <m.button
                            key={shortcut.id}
                            type="button"
                            initial="rest"
                            whileHover="hover"
                            variants={hoverVariants}
                            onClick={shortcut.onClick}
                            className="flex items-center justify-between rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/80 via-surface-raised/70 to-surface-base/60 px-5 py-4 text-left text-sm text-text-primary shadow-[0_12px_30px_rgba(3,8,20,0.35)] transition hover:border-aurora hover:drop-shadow-neon"
                        >
                            <span className="flex items-center gap-3">
                                <span className="rounded-2xl border border-[var(--border-subtle)] bg-surface-base/70 p-2 text-text-secondary">
                                    {shortcut.icon}
                                </span>
                                <span className="text-base font-semibold">{shortcut.label}</span>
                            </span>
                            <svg className="h-4 w-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </m.button>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ActionPanel
