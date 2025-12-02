import FloatingWhatsAppButton from '../FloatingWhatsAppButton'

const FloatingActionDock = () => {
    return (
        <div className="pointer-events-auto flex items-center gap-gutter-sm">
            <div className="hidden sm:flex items-center gap-3 rounded-[28px] border border-[var(--border-subtle)] bg-surface-base/90 px-5 py-3 text-xs uppercase tracking-[0.4em] text-text-secondary shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-aurora" />
                Guardian ready
            </div>
            <FloatingWhatsAppButton />
        </div>
    )
}

export default FloatingActionDock
