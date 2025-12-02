'use client';

import { useMemo, useState } from 'react';

interface AnalysisResponse {
  emotional_cues?: string[];
  danger_probability?: number;
  suggestions?: string[];
  urgent_help_needed?: boolean;
  threat_level?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  [key: string]: any;
}

interface TextInputProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onResponse?: (response: string) => void;
  onAnalysisComplete?: (data: AnalysisResponse) => void;
}

export default function TextInput({ isLoading, setIsLoading, onResponse, onAnalysisComplete }: TextInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const charCount = useMemo(() => Array.from(text).length, [text]);
  const limitReached = charCount > 10000;

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    // Use Array.from for accurate Unicode character counting
    if (limitReached) {
      setError('Text must be under 10,000 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Safely encode text (handles Unicode, special characters, emojis, etc.)
      const response = await fetch('/api/text-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error('Failed to analyze text. Please try again.');
        }
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Map response to expected format (use all fields from backend)
      const threatLevel = data.threat_level || 'low';
      const analysisData = {
        threat_level: threatLevel,
        explanation: data.explanation || 'Analysis complete.',
        recommended_actions: data.recommended_actions || data.suggestions || [],
        detected_risks: data.detected_risks || (data.explanation ? [data.explanation] : []),
        confidence_score: data.confidence_score || (threatLevel === 'high' || threatLevel === 'critical' ? 0.8 : 0.6),
        emotional_cues: data.emotional_cues || [],
        danger_probability: data.danger_probability,
        suggestions: data.suggestions || data.recommended_actions || [],
        urgent_help_needed: data.urgent_help_needed,
      };

      // Trigger toast pop-up with full analysis data (formal report)
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }

      // Format response for chat display (brief summary)
      if (onResponse) {
        const threatEmoji = threatLevel === 'critical' ? '🔴' :
          threatLevel === 'high' ? '🟠' :
            threatLevel === 'medium' ? '🟡' : '🟢';
        const responseText = `${threatEmoji} Safety Analysis Complete\n\n` +
          `Threat Level: ${threatLevel.toUpperCase()}\n\n` +
          `${data.explanation || 'Analysis complete.'}\n\n` +
          `See detailed report in the analysis modal.`;
        onResponse(responseText);
      }

      // Clear text after successful submission
      setText('');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_25px_80px_rgba(5,0,40,0.4)] text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Text intelligence</p>
            <label htmlFor="text-input" className="mt-1 block text-2xl font-semibold">Safety Language Console</label>
          </div>
          <div className="rounded-full border border-white/15 px-4 py-1 text-sm text-white/70">
            {charCount.toLocaleString()} / 10,000 characters
          </div>
        </div>
        <p className="mt-3 text-sm text-white/60">Paste transcripts, chat logs, or situational notes. The system detects emotional cues, intent, and latent risk factors.</p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-[#050a25] relative">
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            placeholder="Type or paste text here to analyze for safety concerns..."
            className="w-full min-h-[18rem] bg-transparent p-5 text-base text-white placeholder-white/40 focus:outline-none"
          />
          <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-white/5">
            <div
              className="h-full rounded-b-2xl bg-[var(--color-neon-signal)] transition-all"
              style={{ width: `${Math.min(100, (charCount / 10000) * 100)}%` }}
            />
          </div>
        </div>
        {limitReached && (
          <p className="mt-2 text-sm text-[var(--color-neon-danger)]">Text is too long. Trim before sending.</p>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading || limitReached}
        className="w-full rounded-2xl border border-white/15 bg-[var(--color-neon-signal)]/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(5,0,40,0.45)] transition hover:border-[var(--color-neon-signal)] hover:bg-[var(--color-neon-signal)]/30 disabled:border-white/10 disabled:bg-white/5 disabled:text-white/40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing…
          </>
        ) : (
          'Launch Text Analysis'
        )}
      </button>
    </div>
  );
}
