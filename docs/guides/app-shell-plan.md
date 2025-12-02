# Phase 1 – App Shell Scaffold Plan

Updated: **November 30, 2025**

## 1. Objective
Stand up an `AppShell` layout that anchors the “Safety Command Center” experience. The shell provides a three-panel grid (status rail, live canvas, insight rail), centralized Chrome (header, floating actions, background field), and the plumbing for light/dark themes, motion layers, and future drawers.

## 2. Constraints & Guardrails
- **Token-first**: All spacing/color/shadow decisions must use the tokens defined in `Frontend/lib/ui/tokens.ts` so light/dark parity stays automatic via CSS vars.
- **Responsive-first**: Single-column stack under 1024px, two-column hybrid between 1024–1280px, full tri-rail ≥1280px. No horizontal scroll.
- **Composable**: Shell only orchestrates layout & shared UI (header, rails, background canvas, WhatsApp button). Feature modules (chat, uploads, safe route modal) plug in via children slots.
- **Accessible**: Skip links + heading order preserved. Shell must respect `prefers-reduced-motion` by downgrading animated gradients.
- **Performance**: Keep shell client bundle < 12kb by avoiding heavy libs; use CSS Grid + existing components. Lazily hydrate only when interactive (via `use client` segments where needed).

## 3. Layout Blueprint
```
┌──────────────────────────────────────────────────────────────┐
│ Sticky Header (logo, mode switcher, live status pills)        │
├───────────────┬───────────────────────────────┬──────────────┤
│ Left Rail     │ Main Canvas (Chat/Scenario)   │ Insight Rail  │
│ (Guides,      │ • ChatStream                  │ • Safe Route  │
│ quick actions │ • Input Dock                  │ • Threat log  │
│ mode select)  │ • Scenario Dock               │ • Timeline    │
├───────────────┴───────────────────────────────┴──────────────┤
│ Floating Action Row (WhatsApp, share location, SOS)           │
└──────────────────────────────────────────────────────────────┘
```
- Implements CSS Grid template: `grid-template-columns: 280px minmax(0, 1fr) 360px` at desktop, collapsing to `1fr` with left/right rails turned into accordion drawers on mobile.
- Background uses `var(--gradient-sunrise)` with optional animated overlays from future WebGL canvas.

## 4. Component Responsibilities
| Component | Responsibility | Notes |
|-----------|----------------|-------|
| `AppShell` | Wraps page content, renders background gradient, header slot, `LeftRail`, `MainCanvas`, `RightRail`, floating actions. | Lives in `Frontend/components/AppShell/AppShell.tsx` (new folder for subcomponents). |
| `LeftRail` | Displays Emergency Quick Guide, mode selector pills, connection health widget. | Use sticky behavior via `position: sticky; top: var(--gutter-xl)`. |
| `MainCanvas` | Hosts chat stream + input dock; exposes slots for alerts and toasts. | Eventually replaced by Phase 2 command-center components. |
| `RightRail` | Shows Safe Route summary, recent analyses, scenario timeline. | Should collapse into bottom sheet on mobile (Phase 1 can be stub). |
| `ShellHeader` | Replaces existing `Header` component; includes brand, theme toggle, location share button, live API status indicator. | Stick to tokens for spacing.
| `FloatingActionDock` | Wraps `FloatingWhatsAppButton` and upcoming SOS button; anchored bottom-right with `pointer-events`. | Should only render on screens wider than 768px to avoid overlap.

## 5. State & Data Flow
- Create `lib/store/ui.ts` slice (Phase 1 follow-up) for:
  - `theme`: `'light' | 'dark' | 'system'` (maps to `[data-theme]`).
  - `panels`: open/closed state for left/right rails on mobile.
  - `drawer`: data for the future Storyboard drawer (Phase 3).
- Shell receives `ui` store selectors via hook; for now, stub toggles with local state to avoid blocking.
- Existing `useResultStore` continues to provide analysis data; pass relevant slices into `RightRail`.

## 6. Implementation Steps
1. **Scaffold file tree**
   - `components/AppShell/index.ts`
   - `components/AppShell/AppShell.tsx`
   - `components/AppShell/LeftRail.tsx`
   - `components/AppShell/MainCanvas.tsx`
   - `components/AppShell/RightRail.tsx`
   - `components/AppShell/ShellHeader.tsx`
   - `components/AppShell/FloatingActionDock.tsx`
2. **Shell grid + tokens**
   - Define grid using `gap-gutter-lg`, `p-gutter-xl`, `rounded-xl`, `bg-surface-raised` etc.
   - Use CSS modules or Tailwind utility classes referencing the new token-backed utilities.
3. **Integrate existing content**
   - Move Emergency Quick Guide content into `LeftRail` (reuse copy for now).
   - Wrap current chat experience in `MainCanvas` slot; ensure scroll areas use `shadow-soft` and `bg-surface-raised`.
   - For `RightRail`, stub cards for Safe Route + placeholder timeline referencing current modal state.
4. **Hook into layout**
   - Update `app/layout.tsx` to import `AppShell` and wrap `children` within shell.
   - Ensure `app/page.tsx` renders only page-specific modules inside `MainCanvas` slot (no top-level gradients).
5. **Floating components**
   - Move `FloatingWhatsAppButton` under `FloatingActionDock` to avoid z-index conflicts.
   - Provide `portalId` for future modals (render `div#command-center-portal` at root).
6. **Theming + reduced motion**
   - Toggle `[data-theme]` on `<html>` via `ShellHeader` theme switcher (temporary useState until Zustand slice exists).
   - Wrap background pulses in `@media (prefers-reduced-motion: reduce)` to disable heavy transitions.

## 7. Acceptance Criteria (Phase 1)
- Shell renders across all routes with no layout shifts; Lighthouse CLS < 0.05 on desktop.
- `LeftRail` + `RightRail` collapse into accordions <1024px; toggle buttons accessible via keyboard.
- `FloatingWhatsAppButton` still reachable, now aligned via `FloatingActionDock`.
- Body background + typography sourced entirely from tokens (no stray pastel hex values in page components).
- `AppShell` exports TypeScript props to accept `headerSlot`, `leftRailSlot`, `rightRailSlot`, `children`; default slots provided for home page but customizable later.

## 8. Follow-up Tasks
- Wire Zustand `ui` slice for theme + rail toggles.
- Replace `RightRail` placeholders with real Safe Route summary + timeline data.
- Introduce `ScenarioDock` + `ChatStream` components (Phase 2) within the `MainCanvas` slot.
