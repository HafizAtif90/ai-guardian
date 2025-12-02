# Phase 2 – Motion & Command Center Canvas Plan

Updated: **November 30, 2025**

## 1. Objectives
- Introduce a cohesive motion system (Framer Motion + tokenized easing) for chat, uploads, modals, and rail transitions.
- Replace the current chat surface with the “Command Center Canvas” (ChatStream + ScenarioDock + ActionPanel) to enable streaming responses and better spatial hierarchy.
- Keep performance budgets in check (no animation jank >150ms, respects `prefers-reduced-motion`).

## 2. Dependencies
- Phase 1 tokens + AppShell (DONE).
- Backend streaming API spike (Phase 4) not required yet but plan for placeholder typed responses.
- Zustand UI slice (DONE) will also expose `prefersReducedMotion` (new field in this phase).

## 3. Library + Infra Tasks
1. **Install Framer Motion**
   - `npm install framer-motion`
   - Add `app/providers.tsx` (if needed) that wraps shell with `<LazyMotion features={domAnimation}>`.
   - Update `tsconfig` paths if we add `lib/ui/motion.ts` helper.
2. **Motion Tokens**
   - File: `Frontend/lib/ui/motion.ts` with shared variants (`fadeSlide`, `stackedCard`, `pillHover`, `drawer`).
   - Accept `prefersReducedMotion` flag to short-circuit heavy transforms.
3. **Reduced Motion Hook**
   - Create `usePrefersReducedMotion` hook or extend `useUiStore` with `prefersReducedMotion` (subscribe to `matchMedia`).

## 4. Command Center Canvas Breakdown
| Component | File | Notes |
|-----------|------|-------|
| `ChatStream` | `components/command-center/ChatStream.tsx` | Virtualized list of messages; each message uses motion variant (`messageIn`). Supports streaming lines + skeleton bubble. |
| `ScenarioDock` | `components/command-center/ScenarioDock.tsx` | Horizontal scroll/pills for modes + risk tags. Motion highlight when active. |
| `ActionPanel` | `components/command-center/ActionPanel.tsx` | Houses input composer, upload shortcuts, inline status chips. Buttons animate on hover + show progress bars. |
| `StatusToast` (rename of `AnalysisToast`) | `components/command-center/StatusToast.tsx` | Slide-in drawer anchored to canvas; uses `AnimatePresence`. |

## 5. Implementation Steps
1. **Foundation**
   - Create `lib/ui/motion.ts` variants.
   - Add `components/providers/MotionProvider.tsx` with `LazyMotion` + context exposing `prefersReducedMotion`.
2. **Refactor Chat**
   - Move message rendering into `ChatStream` (props: `messages`, `isAnalyzing`, `isSharingLocation`).
   - Use `AnimatePresence` for message enter/exit.
   - Replace manual spinner with skeleton bubble component.
3. **Scenario Dock + Action Panel**
   - Dock: map `modes` array, highlight active mode, animate background width.
   - Action Panel: restructure textarea + CTA buttons with motion states (`whileTap`, `whileHover`).
   - Provide `onSelectMode` callback (currently `handleModeSelect`).
4. **Integration**
   - Update `app/page.tsx` to import new components; remove inline JSX.
   - Use CSS Grid inside `MainCanvas` to place `ScenarioDock` + `ChatStream` + `ActionPanel` with consistent spacing.
5. **Mobile Considerations**
   - `ScenarioDock` becomes horizontally scrollable with snap points.
   - Animate presence only when `messages.length` changes to avoid layout thrash.

## 6. Testing & Acceptance
- Add unit tests (or Storybook stories once available) for motion variants to ensure reduced motion fallback is respected.
- Manual QA: Chrome Performance traces (60fps) while sending messages and toggling rails.
- Accessibility: ensure `prefers-reduced-motion` is honored; focus order maintained despite animated wrappers.
- Done when: new command center layout replaces legacy chat UI with zero regression, and Lighthouse CLS remains <0.05.

## 7. Follow-up Tasks (Backlog)
- Streaming API wiring (Phase 4) to feed `ChatStream` incremental updates.
- Lottie threat glyph integration inside `StatusToast`.
- Map-based `SafeRouteCard` animation when safe route data arrives.
