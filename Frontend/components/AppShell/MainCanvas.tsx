import type { ReactNode } from 'react'

interface MainCanvasProps {
    children: ReactNode
}

const MainCanvas = ({ children }: MainCanvasProps) => {
    return (
        <main className="surface-glow relative overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-surface-base/60 px-gutter-lg py-gutter-xl shadow-[0_35px_90px_rgba(2,4,18,0.65)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),_transparent_65%)] animate-aurora-drift" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '120px 120px',
                    }}
                />
                <div className="absolute inset-x-16 top-1/2 h-32 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#00f5ff]/40 via-transparent to-[#7c3aed]/40 blur-[140px]" />
            </div>
            <div className="relative">
                <div className="neon-divider mb-gutter-md" aria-hidden />
                <div className="command-grid">{children}</div>
            </div>
        </main>
    )
}

export default MainCanvas
