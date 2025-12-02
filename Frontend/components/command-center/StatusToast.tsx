import { AnimatePresence, m } from 'framer-motion'
import { cardVariants } from '@/lib/ui/motion'
import { useUiStore } from '@/lib/store/ui'

interface StatusToastProps {
    isOpen: boolean
    title: string
    body: string
    ctaLabel?: string
    onClickCta?: () => void
    onDismiss?: () => void
}

const StatusToast = ({ isOpen, title, body, ctaLabel, onClickCta, onDismiss }: StatusToastProps) => {
    const prefersReducedMotion = useUiStore((state) => state.prefersReducedMotion)
    const variants = cardVariants(prefersReducedMotion)

    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    role="status"
                    aria-live="assertive"
                    className="fixed bottom-6 right-6 z-30 w-[min(90vw,22rem)]"
                >
                    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-surface-base/80 p-gutter-md text-text-primary shadow-[0_35px_80px_rgba(3,4,18,0.6)]">
                        <div className="pointer-events-none absolute inset-0 opacity-50">
                            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(4,244,255,0.45),_transparent_60%)]" />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-text-muted">Alert</p>
                                <p className="text-base font-semibold text-white">{title}</p>
                                <p className="text-sm text-text-secondary">{body}</p>
                            </div>
                            {onDismiss && (
                                <button
                                    type="button"
                                    onClick={onDismiss}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-surface-base/70 text-xs text-text-secondary transition hover:text-white"
                                    aria-label="Dismiss toast"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {ctaLabel && onClickCta && (
                            <button
                                type="button"
                                onClick={onClickCta}
                                className="mt-4 w-full rounded-2xl border border-transparent bg-gradient-to-r from-aurora via-[#7c3aed] to-[#00f5ff] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50"
                            >
                                {ctaLabel}
                            </button>
                        )}
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    )
}

export default StatusToast
