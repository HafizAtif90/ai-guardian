'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResultStore } from '@/lib/store';
import SafeRouteModal from '@/components/SafeRouteModal';
import { ActionPanel, ChatStream, ScenarioDock } from '@/components/command-center';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AnalyzeTextResponse {
  threat_level?: string;
  explanation?: string;
  recommended_actions?: string[];
  suggestions?: string[];
  detected_risks?: string[];
  confidence_score?: number;
  urgent_help_needed?: boolean;
  reply?: string;
}

interface SafeRouteData {
  route_link?: string;
  route_description?: string;
  unsafe_areas?: string[];
  safe_areas?: string[];
  caution_areas?: string[];
  recommended_actions?: string[];
  threat_level?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
}

const iconProps = {
  className: 'h-6 w-6',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
};

const ImageIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const VideoIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const TextIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const AudioIcon = () => (
  <svg {...iconProps}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

const scenarioOptions = [
  { mode: 'image', label: 'Image Scan', description: 'Detect suspicious visuals & tampering.' },
  { mode: 'video', label: 'Video Review', description: 'Flag risky movement or context.' },
  { mode: 'text', label: 'Text Analysis', description: 'Unpack threatening language instantly.' },
  { mode: 'audio', label: 'Audio Insight', description: 'Transcribe tone + intent in seconds.' },
];

const threatEmojis: Record<string, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
  unknown: '⚪',
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatAssistantResponse = (analysis: AnalyzeTextResponse) => {
  const threatLevel = (analysis.threat_level ?? 'unknown').toLowerCase();
  const emoji = threatEmojis[threatLevel] ?? threatEmojis.unknown;
  const explanation = analysis.explanation?.trim() || analysis.reply?.trim();
  const risks = analysis.detected_risks?.filter((risk): risk is string => Boolean(risk?.trim()));
  const actionsSource =
    analysis.recommended_actions && analysis.recommended_actions.length > 0
      ? analysis.recommended_actions
      : analysis.suggestions ?? [];
  const actions = actionsSource.filter((action): action is string => Boolean(action?.trim()));
  const confidence =
    typeof analysis.confidence_score === 'number'
      ? `Confidence: ${Math.round(analysis.confidence_score * 100)}%`
      : undefined;

  const sections: string[] = [
    `${emoji} Threat Level: ${threatLevel.toUpperCase()}`,
    explanation || 'Analysis complete.',
  ];

  if (risks && risks.length) {
    sections.push(`Key risks: ${risks.slice(0, 3).join(', ')}`);
  }

  if (actions.length) {
    sections.push(`Recommended actions:\n- ${actions.slice(0, 3).join('\n- ')}`);
  }

  if (analysis.urgent_help_needed) {
    sections.push('⚠️ Urgent help recommended. Reach out to emergency contacts if you feel unsafe.');
  }

  if (confidence) {
    sections.push(confidence);
  }

  return sections.join('\n\n');
};

export default function Home() {
  const router = useRouter();
  const clearResult = useResultStore((state) => state.clearResult);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [activeMode, setActiveMode] = useState('text');
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [safeRouteData, setSafeRouteData] = useState<SafeRouteData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing, isSharingLocation]);

  const handleModeSelect = (mode: string) => {
    setActiveMode(mode);
    clearResult();
    router.push(`/mode/${mode}`);
  };

  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = chatInput.trim();
    if (!input || isAnalyzing) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.reply || errorData?.error || 'Failed to analyze your message. Please try again.';
        throw new Error(message);
      }

      const data: AnalyzeTextResponse = await response.json();
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: formatAssistantResponse(data),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : '⚠️ Something went wrong. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShareLocation = () => {
    if (isSharingLocation) return;

    const confirmed = window.confirm('Do you want to share your current location?');
    if (!confirmed) return;

    setIsSharingLocation(true);
    setSafeRouteData(null);
    setShowRouteModal(true);

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: '📍 Shared my location',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!navigator.geolocation) {
      setIsSharingLocation(false);
      setShowRouteModal(false);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Geolocation is not supported in this browser.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          const response = await fetch('/api/safe-route', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentLocation: location }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Failed to find a safe route.');
          }

          const data: SafeRouteData = await response.json();
          setCurrentLocation(location);
          setSafeRouteData(data);

          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content:
              '📍 I found guidance for your area. Review the safe-route panel for turn-by-turn advice and caution zones.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
          setShowRouteModal(false);
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: 'assistant',
              content:
                error instanceof Error
                  ? `Could not analyze your route: ${error.message}`
                  : 'Could not analyze your route. Please try again.',
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsSharingLocation(false);
        }
      },
      (error) => {
        let message = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out.';
            break;
          default:
            message += 'An unknown error occurred.';
        }

        setShowRouteModal(false);
        setIsSharingLocation(false);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: message,
            timestamp: new Date(),
          },
        ]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const shortcuts = [
    { id: 'image', label: 'Upload Image', icon: <ImageIcon />, onClick: () => handleModeSelect('image') },
    { id: 'video', label: 'Upload Video', icon: <VideoIcon />, onClick: () => handleModeSelect('video') },
    { id: 'text', label: 'Write Text', icon: <TextIcon />, onClick: () => handleModeSelect('text') },
    { id: 'audio', label: 'Record Audio', icon: <AudioIcon />, onClick: () => handleModeSelect('audio') },
  ];

  return (
    <div className="flex flex-col gap-gutter-lg">
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-surface-base/80 px-gutter-lg py-gutter-xl text-text-primary shadow-[0_40px_90px_rgba(3,4,20,0.55)]">
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_60%)]" />
          <div className="absolute inset-6 rounded-[32px] border border-white/5" />
          <div className="absolute inset-x-12 bottom-0 h-40 bg-gradient-to-t from-black/50 via-transparent to-transparent blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.55em] text-text-muted">Guardian mission control</p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-white">
                Instant personal safety intelligence
              </h1>
              <p className="mt-3 text-base text-text-secondary">
                Stream situational awareness, analyze evidence, and deploy trusted contacts—powered by{' '}
                <span className="font-semibold text-aurora">Google Gemini AI</span>.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 text-right text-xs uppercase tracking-[0.45em] text-text-secondary">
              <span className="inline-flex items-center gap-3 rounded-full border border-[var(--border-neon)] bg-surface-base/60 px-5 py-2 font-semibold text-neon-signal">
                <span className="h-2 w-2 animate-pulse rounded-full bg-neon-signal shadow-[0_0_10px_var(--color-neon-signal)]" />
                Guardian ready
              </span>
              <span className="text-[0.65rem] text-text-muted">Session synced · {messages.length || 0} signal(s)</span>
            </div>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Trusted contacts linked', value: '3', meta: 'Auto alert in 2s' },
              { label: 'Evidence streams primed', value: '4', meta: 'Image · Video · Text · Audio' },
              { label: 'Safe-route coverage', value: currentLocation ? 'Live lock' : 'On standby', meta: currentLocation ? 'Tracking your route' : 'Awaiting location ping' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[28px] border border-[var(--border-subtle)] bg-gradient-to-br from-surface-base/80 via-[#050a1f]/80 to-[#14052f]/70 px-6 py-5 shadow-[0_12px_35px_rgba(3,4,20,0.55)]"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-text-muted">{stat.label}</p>
                <p className="mt-2 font-display text-2xl text-white">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.meta}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.45em] text-text-secondary">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
              Threat net scanning
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-signal" />
              Contacts linked
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-surface-base/60 px-4 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-vivid" />
              Safe route AI
            </span>
          </div>
        </div>
      </section>

      <ScenarioDock options={scenarioOptions} activeMode={activeMode} onSelect={handleModeSelect} />

      <ChatStream
        messages={messages}
        isAnalyzing={isAnalyzing}
        isSharingLocation={isSharingLocation}
        loadingLabel={isSharingLocation ? 'Analyzing safest route…' : 'Analyzing…'}
        emptyState="Describe a situation to start the safety briefing."
        endRef={chatEndRef}
      />

      <ActionPanel
        chatInput={chatInput}
        onChatChange={setChatInput}
        onSubmit={handleChatSubmit}
        onShareLocation={handleShareLocation}
        isAnalyzing={isAnalyzing}
        isSharingLocation={isSharingLocation}
        shortcuts={shortcuts}
      />

      {showRouteModal && (
        <SafeRouteModal
          isLoading={isSharingLocation}
          routeLink={safeRouteData?.route_link}
          routeDescription={safeRouteData?.route_description || ''}
          unsafeAreas={safeRouteData?.unsafe_areas || []}
          safeAreas={safeRouteData?.safe_areas || []}
          cautionAreas={safeRouteData?.caution_areas}
          recommendedActions={safeRouteData?.recommended_actions || []}
          threatLevel={safeRouteData?.threat_level || 'unknown'}
          currentLocation={currentLocation}
          onClose={() => {
            setShowRouteModal(false);
            setSafeRouteData(null);
            setCurrentLocation(null);
          }}
        />
      )}
    </div>
  );
}


