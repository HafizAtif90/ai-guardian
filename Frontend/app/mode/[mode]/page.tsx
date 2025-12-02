'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import FileUploader from '@/components/FileUploader';
import VideoUploader from '@/components/VideoUploader';
import AudioRecorder from '@/components/AudioRecorder';
import TextInput from '@/components/TextInput';
import AnalysisToast from '@/components/AnalysisToast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VALID_MODES: string[] = ['image', 'video', 'audio', 'text'];

const modeConfig: Record<string, { title: string; description: string; icon: JSX.Element }> = {
  image: {
    title: 'Image Scan',
    description: 'Upload an image file to analyze for safety threats',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 14l2-2 4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7.5" r="1.5" />
        <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
      </svg>
    ),
  },
  video: {
    title: 'Video Review',
    description: 'Upload a video file to analyze for safety threats',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7a3 3 0 013-3h7a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3z" />
        <path d="M16 10l4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  audio: {
    title: 'Audio Insight',
    description: 'Record or upload an audio file to analyze for safety threats',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="4" width="6" height="12" rx="3" />
        <path d="M12 18c3 0 5-2 5-5V9" strokeLinecap="round" />
        <path d="M12 22v-4M8 22h8" strokeLinecap="round" />
      </svg>
    ),
  },
  text: {
    title: 'Text Analysis',
    description: 'Enter text to analyze for safety concerns',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 6h14M5 12h10M5 18h6" strokeLinecap="round" />
        <path d="M12 6l-2 12" strokeLinecap="round" />
      </svg>
    ),
  },
};

export default function ModePage() {
  const params = useParams();
  const router = useRouter();
  const mode = params?.mode as string;

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toastData, setToastData] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode && !VALID_MODES.includes(mode)) {
      router.push('/error');
    }
  }, [mode, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!mode || !VALID_MODES.includes(mode)) {
    return null;
  }

  const config = modeConfig[mode] ?? modeConfig.text;

  const handleResponse = (response: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content:
        mode === 'image'
          ? 'Uploaded an image for analysis'
          : mode === 'video'
            ? 'Uploaded a video for analysis'
            : mode === 'audio'
              ? 'Uploaded audio for analysis'
              : 'Submitted text for analysis',
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const handleAnalysisComplete = (data: any) => {
    setToastData(data);
  };

  const renderComponent = () => {
    switch (mode) {
      case 'image':
        return (
          <FileUploader
            type="image"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onResponse={handleResponse}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case 'video':
        return (
          <VideoUploader
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onResponse={handleResponse}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case 'audio':
        return (
          <AudioRecorder
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onResponse={handleResponse}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case 'text':
        return (
          <TextInput
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onResponse={handleResponse}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-gutter-lg text-text-primary">
      {/* Header Card */}
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-surface-base/80 px-gutter-lg py-gutter-xl shadow-[0_35px_90px_rgba(3,4,20,0.55)]">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_60%)]" />
          <div className="absolute inset-6 rounded-[32px] border border-white/5" />
        </div>
        <div className="relative flex flex-col gap-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-5 py-2 text-sm font-semibold text-text-secondary transition hover:border-[var(--color-neon-signal)] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Command Center
          </button>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-surface-base/80 via-[#090b2f]/80 to-[#041827]/70 text-white shadow-[0_12px_35px_rgba(4,6,28,0.55)]">
              {config.icon}
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.55em] text-text-muted">Evidence channel</p>
              <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-white">{config.title}</h1>
              <p className="mt-1 text-sm text-text-secondary">{config.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.45em] text-text-secondary">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-neon)] bg-surface-base/60 px-4 py-1 font-semibold text-neon-signal">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-signal shadow-[0_0_10px_var(--color-neon-signal)]" />
              {mode} mode
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
              Gemini online
            </span>
          </div>
        </div>
      </section>

      {/* Chat Log */}
      {messages.length > 0 && (
        <section className="rounded-[32px] border border-[var(--border-strong)] bg-surface-base/70 px-gutter-lg py-gutter-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_25px_70px_rgba(4,6,28,0.35)]">
          <header className="mb-gutter flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Analysis log</p>
              <p className="text-lg font-semibold text-white">Signal stream</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-text-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-aurora" />
              {messages.length} entries
            </span>
          </header>
          <div className="relative max-h-[320px] space-y-gutter-sm overflow-y-auto pr-2" aria-live="polite">
            <div className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent" aria-hidden />
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <article
                  key={message.id}
                  className={`relative flex ${isUser ? 'justify-end pr-2' : 'pl-8'}`}
                >
                  {!isUser && (
                    <span
                      className="absolute left-1 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-neon-signal shadow-[0_0_10px_rgba(126,249,163,0.8)]"
                      aria-hidden
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-3xl px-gutter-md py-gutter-sm text-sm leading-relaxed ${isUser
                        ? 'border border-aurora/40 bg-gradient-to-br from-[#201053]/80 via-[#3b0e68]/80 to-[#011221]/70 text-white shadow-[0_20px_50px_rgba(124,58,237,0.55)] drop-shadow-neon'
                        : 'border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/90 via-[#08091f]/90 to-[#090b2b]/80 text-text-primary shadow-[0_25px_60px_rgba(5,5,20,0.55)]'
                      }`}
                  >
                    <p className={`text-[0.65rem] uppercase tracking-[0.4em] ${isUser ? 'text-white' : 'text-aurora'}`}>
                      {isUser ? 'You' : 'Gemini Guardian'}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-text-primary">{message.content}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-text-muted">
                      <span className="h-px w-6 bg-gradient-to-r from-aurora to-transparent" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </article>
              );
            })}
            {isLoading && (
              <div className="ml-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/70 px-5 py-2 text-xs uppercase tracking-[0.35em] text-text-secondary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-neon-signal" />
                Analyzing…
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </section>
      )}

      {/* Input Component */}
      <section className="rounded-[32px] border border-[var(--border-strong)] bg-surface-base/70 px-gutter-lg py-gutter-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_25px_70px_rgba(4,6,28,0.35)]">
        {renderComponent()}
      </section>

      {/* Analysis Toast Pop-up */}
      {toastData && (
        <AnalysisToast
          threatLevel={toastData.threat_level || 'unknown'}
          detectedRisks={toastData.detected_objects || toastData.detected_risks}
          recommendedActions={toastData.recommended_actions || toastData.actions || toastData.suggestions}
          confidenceScore={toastData.confidence_score}
          hazardsSeen={toastData.hazards_seen}
          peopleDetected={toastData.people_detected}
          movementPatterns={toastData.movement_patterns}
          summary={toastData.summary || toastData.explanation}
          soundEvents={toastData.sound_events}
          riskReasoning={toastData.risk_reasoning}
          emotionalCues={toastData.emotional_cues}
          dangerProbability={toastData.danger_probability}
          suggestions={toastData.suggestions}
          urgentHelpNeeded={toastData.urgent_help_needed}
          onClose={() => setToastData(null)}
        />
      )}
    </div>
  );
}
