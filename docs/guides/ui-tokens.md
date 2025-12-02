# UI Token Specification

Updated: **November 29, 2025**

## 1. Purpose
A single source of truth for the Safety Command Center visual language. Tokens live in `Frontend/lib/ui/tokens.ts`, flow into Tailwind (`tailwind.config.ts`), and surface as CSS variables inside `styles/globals.css`. Everything visual (colors, radii, motion, spacing) must reference a token to ensure consistency and unlock theme switching.

## 2. Token Stack Overview
| Layer | File | Notes |
|-------|------|-------|
| Foundations | `lib/ui/tokens.ts` | Defines primitive values + helpers (`getDesignTokens`, `getCssVarMap`). |
| Runtime Vars | `styles/globals.css` | Seeds `:root` and `[data-theme="dark"]` with CSS vars. |
| Utility Access | `tailwind.config.ts` | Imports `tailwindThemeExtensions` so classes map to CSS vars (`text-primary`, `bg-surface-raised`, etc.). |

## 3. Color + Surface Tokens
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-text-primary` | `#0f172a` | `#f8fafc` | Body copy, headings, icons. |
| `--color-text-secondary` | `#1e1b4b` | `#c7d2fe` | Secondary labels. |
| `--color-text-muted` | `#4b5563` | `#94a3b8` | Helper text, timestamps. |
| `--color-surface-base` | `#fefbff` | `#040714` | Page background. |
| `--color-surface-raised` | `rgba(255,255,255,0.82)` | `rgba(15,23,42,0.85)` | Cards, modals. |
| `--color-surface-overlay` | `rgba(8,7,29,0.78)` | `rgba(2,6,23,0.85)` | Overlays, drawers. |
| `--color-surface-border` | `rgba(124,58,237,0.15)` | `rgba(99,102,241,0.35)` | Card/divider strokes. |
| Brand ladder | `#f3e8ff` → `#7c3aed` | Same | Buttons, key actions. |
| Accent | Calm `#2dd4bf`, Alert `#fb7185`, Info `#38bdf8` | Same | Status pills, inline highlights. |
| Threat scale | green/orange/orangeRed/red/gray | Same | Severity glyphs + charts. |

Gradients: `sunrise` (default background), `nightwatch` (hero emphasis), `pulse` (motion accents). Stored as CSS vars to reuse in backgrounds/blur cards.

## 4. Typography, Radius, Shadow, Motion
- **Typography**: Sans (`Inter`), Display (`Playfair Display`), Mono (`JetBrains Mono`). Sizes xs → 2xl defined in `tokens.ts` and referenced via `typography` object.
- **Radii**: `--radius-xs` (6px) up to `--radius-xl` (32px) for shells/drawers.
- **Shadows**: `soft`, `raised`, `overlay` to differentiate cards vs modals.
- **Spacing**: `--gutter-*` tokens drive gaps/padding; Tailwind exposes them as `gap-gutter-md`, `p-gutter-sm`, etc.
- **Motion**: Transition bundles combine duration + easing (`--ease-standard`, `--ease-emphasis`, `--ease-entrance`). Animations reuse Tailwind keyframes but default to the standard curve.

## 5. Tailwind Integration Plan
1. **Extend Theme**: `tailwind.config.ts` spreads `tailwindThemeExtensions`, giving utility classes like `bg-surface-raised`, `text-brand-strong`, `shadow-raised`, `rounded-lg` (token-backed).
2. **Spacing Utilities**: Use `gap-gutter-md`, `px-gutter-lg` instead of arbitrary values for layout rhythm.
3. **Motion Utilities**: Pair `transition-colors` with `ease-standard` (custom timing function) for consistent feel.
4. **Next Steps**:
   - Add plugin to auto-generate CSS custom properties from `getCssVarMap` so switching themes at runtime only toggles `[data-theme]`.
   - Wire a Zustand `useUiPrefsStore` slice to flip themes (light/dark/system) and persist choice.
   - Update Storybook (once added) to surface tokens via docs tab for designers/devs.

## 6. Usage Guidelines
- Never hardcode hex or spacing values inside components; import from `tokens.ts` when JS access is needed or rely on Tailwind utilities backed by the same vars.
- When crafting new gradients or shadows, add them to `tokens.ts` first, then regenerate docs if values change.
- For sensor widgets (safe route map, telemetry cards), use accent tokens for neutral info and threat tokens for severity states.
- Respect `prefers-reduced-motion`: pair large animations with shortcuts that simply change elevation/color when motion is disabled.

## 7. Verification Checklist
- [ ] All colors removed from inline Tailwind classes in `app/` and `components/` (follow-up task).
- [ ] Theme toggle writes `[data-theme="dark"]` to `<html>` (Phase 1.2).
- [ ] Snapshot tests cover light/dark snapshots once AppShell is scaffolded.
