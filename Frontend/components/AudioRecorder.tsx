'use client';

import { useRef, useState } from 'react';

interface AnalysisResponse {
  threat_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  sound_events?: string[];
  risk_reasoning?: string;
  actions?: string[];
  [key: string]: any;
}

interface AudioRecorderProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onResponse?: (response: string) => void;
  onAnalysisComplete?: (data: AnalysisResponse) => void;
}

export default function AudioRecorder({ isLoading, setIsLoading, onResponse, onAnalysisComplete }: AudioRecorderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        setSelectedFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please record or upload an audio file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);

      const response = await fetch('/api/analyze-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze audio');
      }

      const data = await response.json();

      // Trigger toast pop-up with full analysis data
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

      // Format response for chat display
      if (onResponse) {
        const threatEmoji = data.threat_level === 'critical' ? '🔴' :
          data.threat_level === 'high' ? '🟠' :
            data.threat_level === 'medium' ? '🟡' : '🟢';
        const responseText = `${threatEmoji} Threat Level: ${data.threat_level.toUpperCase()}\n\n` +
          `Sound Events: ${data.sound_events?.join(', ') || 'N/A'}\n\n` +
          `${data.risk_reasoning || 'Analysis complete'}\n\n` +
          `Actions:\n${data.actions?.map((a: string) => `• ${a}`).join('\n') || 'Stay alert'}`;
        onResponse(responseText);
      }

      // Clear selected file after successful submission
      setSelectedFile(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-3xl border border-white/12 bg-white/5 p-6 cursor-pointer transition hover:border-[var(--color-neon-signal)]/60 hover:bg-white/10"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent blur-3xl pointer-events-none" />
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/webm,audio/ogg,audio/m4a"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#060a26]">
              <span className="absolute inset-0 animate-pulse rounded-2xl bg-[var(--color-neon-signal)]/5" aria-hidden="true" />
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-base font-semibold">Upload Audio Evidence</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Signal Intake</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/12 bg-white/5 p-6 text-center">
          {!isRecording ? (
            <button onClick={startRecording} className="flex w-full flex-col items-center gap-3">
              <div className="relative h-16 w-16 rounded-full border border-white/15 bg-[var(--color-neon-danger)]/30 flex items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full border border-[var(--color-neon-danger)]/50" aria-hidden="true" />
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
              <p className="text-base font-semibold">Start Recording</p>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">Live Acoustic Sweep</p>
            </button>
          ) : (
            <button onClick={stopRecording} className="flex w-full flex-col items-center gap-3">
              <div className="relative h-16 w-16 rounded-full bg-[var(--color-neon-danger)] flex items-center justify-center animate-pulse">
                <div className="h-6 w-6 rounded bg-white" />
              </div>
              <p className="text-base font-semibold text-[var(--color-neon-danger)]">Recording… tap to stop</p>
            </button>
          )}
        </section>
      </div>

      {selectedFile && (
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Selected signal</p>
          <p className="mt-1 text-lg font-semibold">{selectedFile.name}</p>
          <p className="text-sm text-white/60">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-3 w-full rounded-xl" />
          )}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
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
            Processing acoustic intelligence…
          </>
        ) : (
          'Launch Audio Analysis'
        )}
      </button>
    </div>
  );
}
