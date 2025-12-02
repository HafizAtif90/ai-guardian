'use client';

import { useEffect } from 'react';

interface Contact {
  name: string;
  phone: string;
}

interface EmergencyService {
  name: string;
  number: string;
  description: string;
  icon: 'police' | 'ambulance' | 'fire' | 'helpline' | 'global';
  color: string;
}

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts?: Contact[];
}

const defaultContacts: Contact[] = [
  { name: 'Mom', phone: '+1234567890' },
  { name: 'Friend', phone: '+1234567891' },
  { name: 'Partner', phone: '+1234567892' },
];

const emergencyServices: EmergencyService[] = [
  { name: 'Emergency (US)', number: '911', description: 'Police, Fire, Ambulance', icon: 'police', color: 'rose' },
  { name: 'Emergency (EU)', number: '112', description: 'Universal EU Emergency', icon: 'global', color: 'sky' },
  { name: 'Emergency (UK)', number: '999', description: 'Police, Fire, Ambulance', icon: 'police', color: 'indigo' },
  { name: 'Poison Control', number: '1-800-222-1222', description: 'Poison emergencies (US)', icon: 'ambulance', color: 'amber' },
  { name: 'Crisis Helpline', number: '988', description: 'Suicide & Crisis Lifeline', icon: 'helpline', color: 'emerald' },
  { name: 'Domestic Violence', number: '1-800-799-7233', description: 'National DV Hotline', icon: 'helpline', color: 'purple' },
];

const serviceIcons: Record<EmergencyService['icon'], JSX.Element> = {
  police: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  ambulance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  fire: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  helpline: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  global: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colorClasses: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  rose: { border: 'border-rose-400/50', bg: 'bg-rose-500/15', text: 'text-rose-300', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]' },
  sky: { border: 'border-sky-400/50', bg: 'bg-sky-500/15', text: 'text-sky-300', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.3)]' },
  indigo: { border: 'border-indigo-400/50', bg: 'bg-indigo-500/15', text: 'text-indigo-300', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
  amber: { border: 'border-amber-400/50', bg: 'bg-amber-500/15', text: 'text-amber-300', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
  emerald: { border: 'border-emerald-400/50', bg: 'bg-emerald-500/15', text: 'text-emerald-300', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  purple: { border: 'border-purple-400/50', bg: 'bg-purple-500/15', text: 'text-purple-300', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
};

export default function EmergencyContactsModal({
  isOpen,
  onClose,
  contacts = defaultContacts,
}: EmergencyContactsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-2xl" />
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-3xl rounded-[32px]" />
        <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-[#05011a]/95 via-[#070429]/92 to-[#140a3b]/92 shadow-[0_35px_120px_rgba(5,0,40,0.65)] text-white flex flex-col max-h-[90vh]">
          <header className="flex items-start justify-between gap-4 px-8 pt-8 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Rapid Assistance</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Emergency Contact Grid</h2>
              <p className="mt-2 text-sm text-white/60">Direct line to emergency services & trusted allies. Tap to call instantly.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs font-semibold text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-neon-signal)]" />
                  {contacts.length} contacts online
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-1 text-xs font-semibold text-rose-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                  {emergencyServices.length} emergency lines
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close emergency contacts"
              className="text-white/70 hover:text-white transition focus-ring rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Emergency Services Grid */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                <p className="text-xs uppercase tracking-[0.5em] text-rose-300 font-semibold">Emergency Services</p>
                <div className="h-px flex-1 bg-gradient-to-r from-rose-500/50 via-transparent to-transparent" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {emergencyServices.map((service) => {
                  const colors = colorClasses[service.color] || colorClasses.rose;
                  return (
                    <a
                      key={service.number}
                      href={`tel:${service.number.replace(/\D/g, '')}`}
                      className={`group relative rounded-2xl border p-4 transition hover:scale-[1.02] ${colors.border} ${colors.bg} ${colors.glow}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors.border} bg-white/5 ${colors.text}`}>
                          {serviceIcons[service.icon]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{service.name}</p>
                          <p className={`text-lg font-bold ${colors.text}`}>{service.number}</p>
                          <p className="text-xs text-white/50 mt-1">{service.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                        <svg className={`w-4 h-4 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Personal Contacts & Broadcast */}
            <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-neon-signal)]/50 to-transparent" />
                  <p className="text-xs uppercase tracking-[0.5em] text-[var(--color-neon-signal)] font-semibold">Trusted Circle</p>
                  <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-neon-signal)]/50 via-transparent to-transparent" />
                </div>
                {contacts.map((contact, index) => (
                  <div
                    key={`${contact.phone}-${index}`}
                    className="group rounded-3xl border border-white/10 bg-white/5 p-4 flex flex-col gap-4 md:flex-row md:items-center"
                  >
                    <div className="flex-1">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Priority Contact</p>
                      <p className="text-xl font-semibold">{contact.name}</p>
                      <p className="text-sm text-white/70 mt-1">{contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${contact.phone}`}
                        aria-label={`Call ${contact.name}`}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:border-[var(--color-neon-signal)] hover:text-white transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsApp(contact.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Message ${contact.name} on WhatsApp`}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:border-[var(--color-accent-info)] hover:text-white transition"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
                <div>
                  <p className="text-sm text-white/60">Broadcast Signal</p>
                  <h3 className="text-2xl font-semibold">Share Live Status</h3>
                  <p className="text-sm text-white/60 mt-1">Send location and risk summary to every contact in one tap.</p>
                </div>
                <button className="w-full rounded-2xl border border-white/10 bg-[var(--color-neon-signal)]/20 px-5 py-3 text-sm font-semibold text-[var(--color-neon-signal)] hover:bg-[var(--color-neon-signal)]/30 transition">
                  Broadcast safety packet
                </button>
                <div className="rounded-2xl border border-white/10 bg-[#080b2e] p-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">Last transmission</p>
                  <p className="text-lg font-semibold mt-2">47 seconds ago</p>
                  <p className="text-sm text-white/60 mt-1">Your position is being cached for rapid dispatch.</p>
                </div>
              </section>
            </div>
          </div>

          <footer className="px-8 py-6 border-t border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/60">Need to add someone new? Long-press their tile to pin.</p>
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/15 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:border-[var(--color-neon-signal)] transition"
            >
              Close panel
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

