# Frontend Redesign Implementation Plan

## 0. Overview
- **Objective**: transform the AI Personal Safety Guardian UI into an interactive, animation-rich “Safety Command Center” that responds instantly and communicates risk clearly.
- **Scope**: Next.js App Router frontend (`Frontend/`), shared design tokens, animation system, component refactors, streaming UX, performance instrumentation.
- **Principles**: data clarity first, motion with meaning, accessible interactions, optimistic/perceived speed, modular architecture.

## 1. Experience Goals
1. **Immersive Layout**: multi-column shell (status rail, chat canvas, insight drawer) with adaptive gradients/glass surfaces.
2. **Interactive Animations**: Framer Motion choreography for chat, uploads, modals, plus Lottie threat glyphs.
3. **Fast Feedback**: streaming chat responses, optimistic previews, skeleton loaders, zero jank on mobile.
4. **Context Persistence**: unified store for chats, analyses, and safe-route stories surfaced in a timeline.
5. **Operational Visibility**: live key rotation / API health widget and route mini-map to reinforce trust.

## 2. Architecture Guardrails
- **Design Tokens**: define theme primitives (colors, elevations, typography, radii) in `lib/ui/tokens.ts`; expose via Tailwind plugin + CSS variables.
- **Motion System**: centralize Framer Motion variants (`lib/ui/motion.ts`) for enter/exit, hover, emphasis.
- **State**: continue using Zustand but split slices (`useChatStore`, `useAnalysisStore`, `useUiPrefsStore`) to avoid monolith state.
- **Async UX**: prefer React Server Actions or fetch streaming to incremental SSR; fall back to suspense boundaries + skeletons.
- **Performance Budget**: TTFMP < 2s desktop, < 3s mobile on 4G; interaction to next paint < 100ms.

## 3. Workstreams & Phases

### Phase 0 – Research & Validation (1-2 days)
- [ ] Capture current UX via Loom walkthrough.
- [ ] Collect Lighthouse/Web Vitals baseline (desktop + mobile).
- [ ] Audit accessibility (axe DevTools) to document current gaps.
- **Deliverable**: `docs/briefing/frontend-baseline.md` with metrics + screenshots.

### Phase 1 – Design System & Layout Shell (1 week)
1. **Token Definition**
   - Create `lib/ui/tokens.ts` and Tailwind theme extensions.
   - Update `styles/globals.css` to reference CSS variables for backgrounds/gradients.
2. **Global Layout**
   - Build `components/AppShell.tsx` (left rail, canvas, right insight rail) with responsive CSS grid.
   - Move `Header`/`FloatingWhatsAppButton` inside shell layer.
3. **State Setup**
   - Introduce `lib/store/ui.ts` for layout + modal state.
4. **Acceptance**: new shell renders home route with stubbed rails, no regressions, theme toggles verified.

### Phase 2 – Interaction Layer & Chat Canvas (1.5 weeks)
1. **Framer Motion Integration**
   - Install `framer-motion`, wrap root layout with `LazyMotion`.
   - Define chat bubble, button, card variants.
2. **Command Center Canvas**
   - Replace existing chat section with componentized `ChatStream`, `ScenarioDock`, `ActionPanel`.
   - Convert `/mode/[mode]` to in-page sliding panels using Motion + context instead of routing (keep route for deep-link w/ dynamic import).
3. **Uploads & Inputs**
   - Enhance `FileUploader`, `VideoUploader`, `AudioRecorder`, `TextInput` with drag states, inline progress bars, waveform/waveform placeholder.
4. **Acceptance**: smooth transitions (less than 150ms frame drop) measured via Chrome Performance panel, keyboard nav intact.

### Phase 3 – Advanced Visuals & Storytelling (1 week)
1. **Threat Storyboard Drawer**
   - Replace `AnalysisToast` with motion drawer summarizing timeline, map thumbnail, recommended actions.
   - Add Lottie icons for threat levels.
2. **Safe Route Experience**
   - Embed Mapbox/MapLibre preview with animated path.
   - Add route timeline chips inside drawer.
3. **Background Motion**
   - Implement WebGL/SVG gradient field that reacts to threat level (GPU-friendly, fallback for low-power devices).
4. **Acceptance**: Drawer accessible (trap focus, escape closes), animations degrade gracefully on prefers-reduced-motion.

### Phase 4 – Performance, Streaming, & Telemetry (1 week)
1. **Streaming Chat**
   - Update `/app/api/chat/route.ts` + backend to support chunked responses; render partial text with typewriter effect.
2. **Skeletons & Optimistic UI**
   - Add shimmer placeholders for safe route + timeline while waiting for API.
   - Use optimistic cards for uploaded media preview.
3. **Dynamic Imports**
   - `next/dynamic` for heavy components (audio/video recorders) with suspense fallbacks.
4. **Monitoring**
   - Integrate `@vercel/analytics` or custom Web Vitals logger; send metrics to backend for dashboarding.
5. **Acceptance**: Improved Lighthouse perf (>85), CLS < 0.1, FID < 50ms (lab data).

### Phase 5 – QA, Accessibility, Launch (3-4 days)
- Full regression testing (unit + E2E via Playwright/Cypress).
- Accessibility sweep: color contrast, keyboard flows, ARIA labels, screen-reader transcripts.
- Beta rollout checklist: feature flags, staging deployment, user feedback loop.
- Launch comms: update README, docs, and product screenshots.

## 4. Task Backlog (Initial Cut)
| ID | Task | Owner | Dependencies | Notes |
|----|------|-------|--------------|-------|
| P1-01 | Token spec + Tailwind config | FE | none | Document in `docs/guides/ui-tokens.md` |
| P1-02 | App shell layout & rails | FE | P1-01 | Build responsive grid, add placeholder widgets |
| P1-03 | Zustand UI slice | FE | P1-02 | Manage drawers, modals, theme |
| P2-01 | Install/config Framer Motion | FE | P1 | Use `LazyMotion` + `domAnimation` |
| P2-02 | Scenario Dock component | FE | P1-02 | Pill chips with motion highlight |
| P2-03 | ChatStream refactor w/ motion bubbles | FE | P2-01 | Support streaming text |
| P3-01 | Storyboard drawer replacing AnalysisToast | FE | P2 | Includes Lottie icons |
| P3-02 | Safe route mini-map | FE + Map Eng | P1 | Evaluate Mapbox vs MapLibre |
| P4-01 | Streaming API integration | FE + BE | P2-03 | Depends on backend chunked responses |
| P4-02 | Skeleton system | FE | P1 | Use shimmer utility component |
| P4-03 | Web Vitals logging | FE | none | Use `reportWebVitals` hook |
| P5-01 | Accessibility audit fixes | FE | All | Use axe + VoiceOver |
| P5-02 | Release checklist | PM | All | Update docs, changelog |

## 5. Risk & Mitigation
- **Animation Performance**: high GPU load from background + WebGL. Mitigate with feature detection and `prefers-reduced-motion` fallback.
- **Streaming Complexity**: requires backend changes. Spike early with minimal chunked text prototype.
- **Map Licensing**: Mapbox GL requires token; consider MapLibre + MapTiler tiles.
- **Timeline Scope Creep**: keep phases time-boxed; log extra ideas into backlog.

## 6. Immediate Next Actions
1. Approve plan + timelines with stakeholders.
2. Start Phase 0 baseline capture (new doc + metrics).
3. Begin P1-01 token spec drafting in `lib/ui/tokens.ts` + design reference doc.
