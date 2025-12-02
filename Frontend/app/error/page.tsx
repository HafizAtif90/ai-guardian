'use client';

import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-gutter-lg py-gutter-2xl text-text-primary">
      <section className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-surface-base/80 px-gutter-lg py-gutter-xl text-center shadow-[0_35px_90px_rgba(3,4,20,0.55)]">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,87,127,0.25),_transparent_60%)]" />
          <div className="absolute inset-6 rounded-[32px] border border-white/5" />
        </div>
        <div className="relative flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-rose-500/20 via-[#090b2f]/80 to-[#041827]/70 shadow-[0_12px_35px_rgba(244,63,94,0.35)]">
            <svg className="h-10 w-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.55em] text-text-muted">System alert</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-text-secondary">We encountered an error. Please try again.</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="rounded-2xl border border-transparent bg-gradient-to-r from-aurora via-[#7c3aed] to-[#00f5ff] px-8 py-3 text-sm font-semibold text-white shadow-[0_25px_55px_rgba(5,5,20,0.65)] transition hover:border-white/60 hover:drop-shadow-neon"
          >
            Return to Command Center
          </button>
          <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.45em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Error logged
          </span>
        </div>
      </section>
    </div>
  );
}
