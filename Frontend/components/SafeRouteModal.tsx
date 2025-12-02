'use client';

import { useEffect } from 'react';

interface SafeRouteModalProps {
  isLoading?: boolean;
  routeLink?: string;
  routeDescription: string;
  unsafeAreas: string[];
  safeAreas: string[];
  cautionAreas?: string[];
  recommendedActions: string[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  currentLocation?: { lat: number; lng: number } | null;
  onClose: () => void;
}

export default function SafeRouteModal({
  isLoading = false,
  routeLink,
  routeDescription,
  unsafeAreas,
  safeAreas,
  cautionAreas,
  recommendedActions,
  threatLevel,
  currentLocation,
  onClose,
}: SafeRouteModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const normalizedThreat = threatLevel?.toLowerCase() ?? 'unknown';
  const threatPalette = {
    low: {
      emoji: '🟢',
      label: 'Low',
      badge: 'border-emerald-400/40 text-emerald-200 bg-emerald-500/15',
      pulse: 'from-emerald-400/30 via-emerald-500/10 to-transparent',
      chip: 'border-emerald-400/40 text-emerald-100',
    },
    medium: {
      emoji: '🟡',
      label: 'Medium',
      badge: 'border-amber-400/40 text-amber-100 bg-amber-500/15',
      pulse: 'from-amber-400/30 via-amber-500/10 to-transparent',
      chip: 'border-amber-400/40 text-amber-100',
    },
    high: {
      emoji: '🟠',
      label: 'High',
      badge: 'border-orange-500/40 text-orange-100 bg-orange-500/15',
      pulse: 'from-orange-500/30 via-orange-500/10 to-transparent',
      chip: 'border-orange-400/40 text-orange-100',
    },
    critical: {
      emoji: '🔴',
      label: 'Critical',
      badge: 'border-rose-500/40 text-rose-100 bg-rose-500/15',
      pulse: 'from-rose-500/30 via-rose-500/10 to-transparent',
      chip: 'border-rose-400/40 text-rose-100',
    },
    unknown: {
      emoji: '⚪',
      label: 'Unknown',
      badge: 'border-slate-400/40 text-slate-100 bg-white/5',
      pulse: 'from-slate-400/20 via-white/5 to-transparent',
      chip: 'border-slate-400/40 text-slate-100',
    },
  } as const;

  const threatDisplay = threatPalette[normalizedThreat as keyof typeof threatPalette] ?? threatPalette.unknown;

  const areaGroups = [
    {
      label: 'Safe Zones',
      icon: '🟢',
      tint: 'from-emerald-500/5 to-emerald-500/0 border-emerald-300/30',
      bullet: 'text-emerald-300',
      entries: safeAreas,
    },
    {
      label: 'Caution Zones',
      icon: '🟡',
      tint: 'from-amber-500/5 to-amber-500/0 border-amber-300/30',
      bullet: 'text-amber-300',
      entries: cautionAreas ?? [],
    },
    {
      label: 'Danger Zones',
      icon: '🔴',
      tint: 'from-rose-500/5 to-rose-500/0 border-rose-400/25',
      bullet: 'text-rose-300',
      entries: unsafeAreas,
    },
  ];

  const renderAreaGroup = (entries: string[], label: string, icon: string, tint: string, bullet: string) =>
    entries.length > 0 && (
      <div className={`rounded-2xl border px-5 py-4 bg-gradient-to-br ${tint}`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-3">
          <span className="text-xl">{icon}</span>
          {label}
        </div>
        <ul className="space-y-2">
          {entries.map((item, index) => (
            <li key={`${label}-${index}`} className="flex items-start gap-3 text-sm text-white/80">
              <span className={`${bullet} mt-1 text-base`}>•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[820px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-[32px] opacity-70 blur-xl" />
        <div className="relative h-full rounded-[32px] border border-white/15 bg-gradient-to-br from-[#05011a]/95 via-[#070429]/90 to-[#120642]/90 shadow-[0_35px_120px_rgba(5,0,40,0.65)] flex flex-col">
          <header className="flex items-start justify-between px-8 pt-8 pb-4 border-b border-white/10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Safe Route Intelligence</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white mt-2">Adaptive Route Briefing</h2>
              {!isLoading && (
                <div className="mt-4 flex items-center gap-3 text-base text-white/80">
                  <span className="text-2xl">{threatDisplay.emoji}</span>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${threatDisplay.badge}`}>
                    Threat Level · {threatDisplay.label}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close route modal"
              className="text-white/60 hover:text-white transition focus-ring rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </header>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-12">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[var(--color-neon-signal)] animate-spin" />
                </div>
                <span className="absolute inset-0 animate-ping rounded-full border border-white/10" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">Plotting the safest path…</p>
                <p className="text-sm text-white/60">Analyzing live threat telemetry, local reports, and dwell-time data.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <section className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-3">
                    <span>Route Summary</span>
                    <span className="text-white/50">Live</span>
                  </div>
                  {routeDescription ? (
                    <p className="text-base text-white/80 leading-relaxed">
                      {routeDescription}
                    </p>
                  ) : (
                    <p className="text-sm text-white/50 italic">Route intelligence will appear once analysis completes.</p>
                  )}
                  {routeLink && (
                    <a
                      href={routeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full border border-white/20 hover:border-[var(--color-neon-signal)] transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-signal)]" />
                      Open in Maps
                    </a>
                  )}
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 space-y-4">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Live Coordinates</p>
                    {currentLocation ? (
                      <p className="text-lg font-mono text-white">
                        {currentLocation.lat.toFixed(4)} · {currentLocation.lng.toFixed(4)}
                      </p>
                    ) : (
                      <p className="text-sm text-white/50">Awaiting GPS lock…</p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f102e] to-[#1a093f] p-4 surface-glow relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${threatDisplay.pulse} opacity-40 blur-3xl`} />
                    <div className="relative flex flex-col gap-2 text-sm text-white/70">
                      <div className="flex items-center justify-between">
                        <span>Threat Pulse</span>
                        <span className="text-white font-semibold">{threatDisplay.label}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[var(--color-neon-signal)] animate-pulse" style={{ width: normalizedThreat === 'unknown' ? '35%' : normalizedThreat === 'low' ? '25%' : normalizedThreat === 'medium' ? '55%' : normalizedThreat === 'high' ? '80%' : '95%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-white/60">Navigation Focus</p>
                      <p className="text-xl font-semibold text-white">Safe Passage Overlay</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${threatDisplay.chip}`}>Updated</span>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d1b4c] via-[#05112d] to-[#190b35] h-48 grid-scan relative overflow-hidden">
                    <div className="absolute inset-4 rounded-2xl border border-white/10" />
                    <div className="absolute top-6 left-6 text-xs uppercase tracking-[0.4em] text-white/40">North</div>
                    <div className="absolute bottom-6 right-6 text-xs uppercase tracking-[0.4em] text-white/40">South</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border animate-pulse" style={{ borderColor: 'var(--color-neon-signal)' }} />
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/60 mb-3">Recommended Actions</p>
                  {recommendedActions.length > 0 ? (
                    <ul className="space-y-3">
                      {recommendedActions.map((action, index) => (
                        <li key={`action-${index}`} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="mt-0.5 text-[var(--color-neon-signal)]">↗</span>
                          <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/50">No tactical instructions available yet.</p>
                  )}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                {areaGroups.map((group) =>
                  renderAreaGroup(group.entries, group.label, group.icon, group.tint, group.bullet)
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

