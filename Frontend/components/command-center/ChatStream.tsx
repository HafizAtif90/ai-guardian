import { AnimatePresence, m } from 'framer-motion'
import { useMemo, type ReactNode, type RefObject } from 'react'
import { messageVariants } from '@/lib/ui/motion'
import { useUiStore } from '@/lib/store/ui'

export interface ChatStreamMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date | string
}

interface ChatStreamProps {
    messages: ChatStreamMessage[]
    isAnalyzing?: boolean
    isSharingLocation?: boolean
    loadingLabel?: string
    emptyState?: ReactNode
    endRef?: RefObject<HTMLDivElement>
}

const roleStyles = {
    assistant: {
        bubble: 'border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/90 via-[#08091f]/90 to-[#090b2b]/80 text-text-primary',
        glow: 'shadow-[0_25px_60px_rgba(5,5,20,0.55)]',
        label: 'Gemini Guardian',
        chip: 'text-aurora',
    },
    user: {
        bubble: 'border border-aurora/40 bg-gradient-to-br from-[#201053]/80 via-[#3b0e68]/80 to-[#011221]/70 text-white',
        glow: 'shadow-[0_20px_50px_rgba(124,58,237,0.55)] drop-shadow-neon',
        label: 'You',
        chip: 'text-white',
    },
} as const

const formatTimestamp = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const ChatStream = ({
    messages,
    isAnalyzing,
    isSharingLocation,
    loadingLabel,
    emptyState,
    endRef,
}: ChatStreamProps) => {
    const prefersReducedMotion = useUiStore((state) => state.prefersReducedMotion)
    const variants = useMemo(() => messageVariants(prefersReducedMotion), [prefersReducedMotion])

    if (!messages.length && !isAnalyzing) {
        return (
            <section className="rounded-[32px] border border-dashed border-[var(--border-subtle)] bg-surface-base/40 px-gutter-xl py-gutter-xl text-center text-sm text-text-muted shadow-[0_25px_60px_rgba(4,6,28,0.35)]">
                {emptyState ?? 'Describe a situation to start the safety briefing.'}
            </section>
        )
    }

    return (
        <section className="rounded-[32px] border border-[var(--border-strong)] bg-surface-base/70 px-gutter-lg py-gutter-md text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_70px_rgba(4,6,28,0.35)]">
            <header className="mb-gutter flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Command log</p>
                    <p className="text-lg font-semibold">Live threat intelligence</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-text-secondary">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-aurora" />
                    {messages.length} entries
                </span>
            </header>
            <div className="relative max-h-[420px] space-y-gutter-sm overflow-y-auto pr-2" aria-live="polite">
                <div className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent" aria-hidden />
                <AnimatePresence initial={false}>
                    {messages.map((message) => {
                        const style = roleStyles[message.role]
                        return (
                            <m.article
                                key={message.id}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={variants}
                                className={`relative flex ${message.role === 'user' ? 'justify-end pr-2' : 'pl-8'}`}
                            >
                                {message.role === 'assistant' && (
                                    <span className="absolute left-1 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-neon-signal shadow-[0_0_10px_rgba(126,249,163,0.8)]" aria-hidden />
                                )}
                                <div className={`max-w-[75%] rounded-3xl px-gutter-md py-gutter-sm text-sm leading-relaxed ${style.bubble} ${style.glow}`}>
                                    <p className={`text-[0.65rem] uppercase tracking-[0.4em] ${style.chip}`}>{style.label}</p>
                                    <p className="mt-2 whitespace-pre-line text-text-primary">{message.content}</p>
                                    <span className="mt-3 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-text-muted">
                                        <span className="h-px w-6 bg-gradient-to-r from-aurora to-transparent" />
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </div>
                            </m.article>
                        )
                    })}
                </AnimatePresence>

                {(isAnalyzing || isSharingLocation) && (
                    <m.div
                        key="loader"
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        className="ml-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/70 px-5 py-2 text-xs uppercase tracking-[0.35em] text-text-secondary"
                    >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-neon-signal" />
                        <span>{loadingLabel ?? (isSharingLocation ? 'Analyzing safest route…' : 'Analyzing…')}</span>
                    </m.div>
                )}
                <div ref={endRef} />
            </div>
        </section>
    )
}

export default ChatStream
