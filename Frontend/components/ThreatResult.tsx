'use client';

import { ThreatAnalysisResponse } from '@/lib/api';

interface ThreatResultProps {
  result: ThreatAnalysisResponse;
}

export default function ThreatResult({ result }: ThreatResultProps) {
  const threatLevels = {
    low: {
      label: 'Low',
      gradient: 'from-emerald-500/20 via-emerald-400/5 to-transparent',
      badge: 'border-emerald-400/40 text-emerald-100 bg-emerald-500/10',
      emoji: '🟢',
    },
    medium: {
      label: 'Medium',
      gradient: 'from-amber-400/20 via-amber-400/5 to-transparent',
      badge: 'border-amber-400/40 text-amber-100 bg-amber-500/10',
      emoji: '🟡',
    },
    high: {
      label: 'High',
      gradient: 'from-orange-500/25 via-orange-500/5 to-transparent',
      badge: 'border-orange-400/40 text-orange-100 bg-orange-500/10',
      emoji: '🟠',
    },
    critical: {
      label: 'Critical',
      gradient: 'from-rose-500/25 via-rose-500/5 to-transparent',
      badge: 'border-rose-400/40 text-rose-100 bg-rose-500/10',
      emoji: '🔴',
    },
    unknown: {
      label: 'Unknown',
      gradient: 'from-slate-200/15 via-white/5 to-transparent',
      badge: 'border-white/30 text-white bg-white/10',
      emoji: '⚪',
    },
  } as const;

  const normalizedThreat = result.threat_level?.toLowerCase() ?? 'unknown';
  const threatStyle = threatLevels[normalizedThreat as keyof typeof threatLevels] ?? threatLevels.unknown;
  const confidencePercentage = Math.round(result.confidence * 100);
  const risks = result.detected_risks ?? [];
  const actions = result.recommended_actions ?? [];
  const extraInfoEntries = result.extra_info ? Object.entries(result.extra_info) : [];

  return (
    <div className="space-y-6 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className={`absolute inset-0 bg-gradient-to-br ${threatStyle.gradient} opacity-80 blur-3xl`} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Threat Assessment</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl border border-white/20 bg-[#060822]" aria-label="Threat severity dial">
                <span className="text-2xl">{threatStyle.emoji}</span>
              </div>
              <div>
                <p className="text-sm text-white/60">Current Risk Posture</p>
                <p className="text-3xl font-semibold tracking-tight">{threatStyle.label}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border ${threatStyle.badge}`}>
              Threat Level · {threatStyle.label}
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Confidence</p>
              <p className="text-2xl font-semibold">{confidencePercentage}%</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--color-neon-signal)] transition-all"
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/60">Detected risks</p>
              <h3 className="text-xl font-semibold">Signal Feed</h3>
            </div>
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">Live</span>
          </div>
          {risks.length > 0 ? (
            <ul className="space-y-3">
              {risks.map((risk, index) => (
                <li key={`risk-${index}`} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                  <span className="text-sm text-white/80 leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/50">No specific risk patterns detected.</p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/60">Recommended actions</p>
              <h3 className="text-xl font-semibold">Command Console</h3>
            </div>
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">Guidance</span>
          </div>
          {actions.length > 0 ? (
            <ul className="space-y-3">
              {actions.map((action, index) => (
                <li key={`action-${index}`} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="mt-0.5 text-[var(--color-neon-signal)]">↗</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/50">No tactical steps needed right now.</p>
          )}
        </div>
      </section>

      {extraInfoEntries.length > 0 && (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">Telemetry</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {extraInfoEntries.map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">{key}</p>
                <p className="text-sm text-white/80 whitespace-pre-wrap">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
