# DESIGN.md

## Overview

Dori's UI is built with shadcn/ui (`base-nova` style, on Base UI) and Tailwind
CSS v4, using the design tokens in
[`src/res/css/global.css`](src/res/css/global.css) (OKLCH, light & dark).

## Principles

- **Responsive, mobile-first.** Layouts adapt from a single column up.
- **Accessible (WCAG AA).** Semantic HTML first, visible `:focus-visible`
  indicators, accessible names on all controls, full keyboard operability, and
  never colour alone to convey meaning. The pipeline supports drag-and-drop
  **and** a keyboard-operable stage selector on every card.
- **Consistent.** Use the project's tokens and existing primitives; do not mix
  component systems or hardcode colours where a token exists.

## Building blocks

- **App shell** — `component/app-sidebar.tsx` (grouped navigation, organization
  switcher, user menu), the authenticated layout `routes/_authed/route.tsx`.
- **Generic CRUD kit** — `component/crm/` renders list, detail and form views
  from a per-entity config (`resources.ts`), so entities share one accessible
  implementation.
- **Pipeline** — `routes/_authed/pipeline.tsx`, a kanban board of opportunities
  by stage.

## Theming

Light/dark/system is handled by `context/theme.tsx` with a no-flash inline
script; colours are CSS variables, so restyling is a token change.
