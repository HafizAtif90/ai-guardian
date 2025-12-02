'use client';

import { useRef, useState } from 'react';

interface AnalysisResponse {
  threat_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  detected_objects?: string[];
  explanation?: string;
  recommended_actions?: string[];
  confidence_score?: number;
  [key: string]: any;
}

interface FileUploaderProps {
  type: 'image';
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onResponse?: (response: string) => void;
  onAnalysisComplete?: (data: AnalysisResponse) => void;
}

export default function FileUploader({ type, isLoading, setIsLoading, onResponse, onAnalysisComplete }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
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
          `Detected: ${data.detected_objects?.join(', ') || 'N/A'}\n\n` +
          `${data.explanation || 'Analysis complete'}\n\n` +
          `Recommended Actions:\n${data.recommended_actions?.map((a: string) => `• ${a}`).join('\n') || 'Stay alert'}`;
        onResponse(responseText);
      }

      // Clear selected file after successful submission
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <section
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-3xl border border-white/12 bg-white/5 p-8 cursor-pointer transition hover:border-[var(--color-neon-signal)]/60 hover:bg-white/10"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="relative flex flex-col items-center text-center gap-3">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-[#060a26]">
            <span className="absolute inset-0 animate-pulse rounded-2xl bg-[var(--color-neon-signal)]/5" aria-hidden="true" />
            <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold">
            {selectedFile ? selectedFile.name : 'Drop or tap to upload evidence'}
          </p>
          <p className="text-sm text-white/60">
            Supports JPEG · PNG · GIF · WEBP · Max 10 MB
          </p>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            {type === 'image' ? 'Vision Analysis' : 'Upload'}
          </p>
        </div>
      </section>

      {selectedFile && (
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Selected asset</p>
          <p className="text-lg font-semibold">{selectedFile.name}</p>
          <p className="text-sm text-white/60">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
            Processing image intelligence…
          </>
        ) : (
          'Launch Image Analysis'
        )}
      </button>
    </div>
  );
}
