'use client';

import { useEffect } from 'react';

interface AnalysisToastProps {
  threatLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  detectedRisks?: string[];
  recommendedActions?: string[];
  confidenceScore?: number;
  hazardsSeen?: string[];
  peopleDetected?: string[];
  movementPatterns?: string[];
  summary?: string;
  soundEvents?: string[];
  riskReasoning?: string;
  emotionalCues?: string[];
  dangerProbability?: number;
  suggestions?: string[];
  urgentHelpNeeded?: boolean;
  onClose: () => void;
}

export default function AnalysisToast({
  threatLevel,
  detectedRisks,
  recommendedActions,
  confidenceScore,
  hazardsSeen,
  peopleDetected,
  movementPatterns,
  summary,
  soundEvents,
  riskReasoning,
  suggestions,
  emotionalCues,
  dangerProbability,
  urgentHelpNeeded,
  onClose,
}: AnalysisToastProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const threatMap = {
    low: {
      label: 'Low',
      emoji: '🟢',
      badge: 'border-emerald-400/40 text-emerald-100 bg-emerald-500/10',
      glow: 'from-emerald-400/30 via-emerald-500/10 to-transparent',
    },
    medium: {
      label: 'Medium',
      emoji: '🟡',
      badge: 'border-amber-400/40 text-amber-100 bg-amber-500/10',
      glow: 'from-amber-400/30 via-amber-400/10 to-transparent',
    },
    high: {
      label: 'High',
      emoji: '🟠',
      badge: 'border-orange-400/40 text-orange-100 bg-orange-500/10',
      glow: 'from-orange-500/30 via-orange-500/10 to-transparent',
    },
    critical: {
      label: 'Critical',
      emoji: '🔴',
      badge: 'border-rose-400/40 text-rose-100 bg-rose-500/10',
      glow: 'from-rose-500/30 via-rose-500/10 to-transparent',
    },
    unknown: {
      label: 'Unknown',
      emoji: '⚪',
      badge: 'border-white/40 text-white bg-white/10',
      glow: 'from-white/20 via-white/10 to-transparent',
    },
  } as const;

  const normalizedThreat = threatLevel?.toLowerCase() ?? 'unknown';
  const threatStyle = threatMap[normalizedThreat as keyof typeof threatMap] ?? threatMap.unknown;
  const confidenceValue = confidenceScore !== undefined ? Math.round(confidenceScore * 100) : null;
  const dangerValue = dangerProbability !== undefined ? Math.round(dangerProbability * 100) : null;
  const combinedActions = [...(recommendedActions ?? []), ...(suggestions ?? [])];

  const listSections = [
    { title: 'Detected Risks', accent: 'text-rose-300', items: detectedRisks },
    { title: 'Hazards Detected', accent: 'text-orange-300', items: hazardsSeen },
    { title: 'People Detected', accent: 'text-sky-300', items: peopleDetected },
    { title: 'Movement Patterns', accent: 'text-purple-300', items: movementPatterns },
    { title: 'Sound Events', accent: 'text-pink-300', items: soundEvents },
    { title: 'Emotional Cues', accent: 'text-indigo-200', items: emotionalCues },
  ].filter((section) => section.items && section.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-[120px] rounded-[36px]" />
        <div className="relative rounded-[36px] border border-white/12 bg-gradient-to-br from-[#05011a]/95 via-[#08072c]/93 to-[#190a3f]/93 shadow-[0_45px_120px_rgba(5,0,40,0.65)] text-white max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            aria-label="Close analysis toast"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition focus-ring rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <header className="px-8 pt-8 pb-6 border-b border-white/10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-3xl">
                  {threatStyle.emoji}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-white/50">Intelligence Brief</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Analysis Results</h2>
                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-semibold ${threatStyle.badge}`}
                  >
                    Threat · {threatStyle.label}
                  </span>
                </div>
              </div>
              {urgentHelpNeeded && (
                <div className="rounded-3xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 shadow-[0_0_35px_rgba(244,63,94,0.35)]">
                  <span className="mr-2">🚨</span> Urgent assistance recommended
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {(confidenceValue !== null || dangerValue !== null) && (
              <section className="grid gap-4 md:grid-cols-2">
                {confidenceValue !== null && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">Confidence</p>
                    <p className="mt-2 text-4xl font-semibold">{confidenceValue}%</p>
                    <p className="text-sm text-white/60">Model certainty across all signals</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--color-neon-signal)] transition-all"
                        style={{ width: `${confidenceValue}%` }}
                      />
                    </div>
                  </div>
                )}
                {dangerValue !== null && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40">Danger Probability</p>
                    <p className="mt-2 text-4xl font-semibold">{dangerValue}%</p>
                    <p className="text-sm text-white/60">Escalation likelihood in next 5 min</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--color-neon-danger)] transition-all"
                        style={{ width: `${dangerValue}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {listSections.length > 0 && (
              <section className="grid gap-4 md:grid-cols-2">
                {listSections.map((section) => (
                  <div key={section.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">{section.title}</p>
                    <ul className="mt-3 space-y-2">
                      {section.items!.map((item, index) => (
                        <li key={`${section.title}-${index}`} className="flex items-start gap-3 text-sm text-white/80">
                          <span className={`mt-1 text-base ${section.accent}`}>•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {(summary || riskReasoning) && (
              <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/50">
                  <span>Analyst Note</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                <p className="mt-3 text-lg font-semibold">What the system sees</p>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">{summary || riskReasoning}</p>
              </section>
            )}

            {combinedActions.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.4em] text-white/50">Recommended Actions</p>
                <ul className="mt-4 space-y-3">
                  {combinedActions.map((action, index) => (
                    <li key={`action-${index}`} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-0.5 text-[var(--color-neon-signal)]">↗</span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <footer className="px-8 py-6 border-t border-white/10 text-xs uppercase tracking-[0.4em] text-white/40">
            Signal routed via Sentinel Mesh · {new Date().toLocaleTimeString()}
          </footer>
        </div>
      </div>
    </div>
  );
}
