# Frontend Baseline – November 29, 2025

## 1. Environment
- **App**: Next.js 14 (App Router) running locally via `npm run dev`.
- **Devices tested**: MacBook Pro M1 (Chrome 130), Pixel 6 (Chrome 130, throttled 4G) – *simulated via DevTools*.
- **Data sources**: Manual walkthrough, Chrome DevTools Lighthouse snapshots, observation from `Frontend/app` codebase.

## 2. UX Snapshot
| Area | Notes |
|------|------|
| Layout | Single-column chat surface with static emergency sidebar; lacks multi-panel context. |
| Navigation | Mode changes trigger full route change (`/mode/[mode]`) resulting in blank screens between interactions. |
| Feedback | Blocking spinners for chat + safe route; no skeleton or optimistic UI. |
| Visual System | Pastel gradient background; inconsistent spacing/typography due to inline Tailwind tokens; no shared design tokens. |
| Motion | Only basic hover transitions; modals/toasts appear instantly (no easing) leading to abrupt UX. |
| Accessibility | Modals lack focus trap, chat bubbles unlabelled, color contrast near 2.3:1 on some pastel text. |

## 3. Performance Snapshot (DevTools Lighthouse)
| Metric | Desktop | Mobile | Notes |
|--------|---------|--------|------|
| Performance | 68 | 42 | Largest Contentful Paint blocked by big client bundle + no caching. |
| Accessibility | 78 | 78 | Low contrast + missing aria labels. |
| Best Practices | 85 | 85 | Mixed content warnings due to placeholder API URL. |
| SEO | 92 | 92 | Default Next.js head fine. |

*(Numbers approximate from today’s runs; rerun after major changes.)*

## 4. Tech Findings
- Components rely on local `useState`; no centralized UI store for modals/rails.
- No Framer Motion or animation libs; only Tailwind transitions.
- Heavy components (`AudioRecorder`, `VideoUploader`) load immediately—even when unused.
- Chat API uses `fetch` without streaming; entire response awaited before rendering.
- `AnalysisToast` is actually a modal overlay not a toast; closes only via manual action.

## 5. Key Pain Points to Fix
1. Perceived latency: blocking spinners, no streaming.
2. Visual hierarchy: single canvas limits command-center storytelling.
3. Interaction richness: missing micro-interactions for uploads, safe-route timeline, etc.
4. Accessibility debt: focus traps, keyboard navigation, color contrast.
5. Observability: no Web Vitals logging or instrumentation.

## 6. Success Metrics (Target)
| Goal | Baseline | Target |
|------|----------|--------|
| LCP (desktop) | ~3.2s | < 2.0s |
| LCP (mobile 4G) | ~5.8s | < 3.0s |
| TBT (mobile) | ~420 ms | < 150 ms |
| CLS | 0.09 | < 0.05 |
| Accessibility score | 78 | > 95 |
| Average perceived response (chat) | 2.5s wait | < 0.7s thanks to streaming/optimistic UI |

## 7. Next Verification Steps
- Automate Lighthouse runs via `npm run lint && npx lighthouse-ci` (future CI job).
- Integrate Web Vitals reporting (`reportWebVitals.ts`).
- Update this document at the end of each phase.
