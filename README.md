# React Dashboard Builder

An interactive dashboard editor where users drag chart widgets from a sidebar onto a responsive grid canvas, rearrange them freely, edit titles inline, and remove them — all with smooth visual feedback and keyboard accessibility.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple)

---

## Setup

```bash
# Clone & install
git clone <repo-url>
cd Take-home-OC
pnpm install

# Development
pnpm dev        # → http://localhost:5173

# Tests
pnpm test       # run once
pnpm test:watch # watch mode

# Production build
pnpm build
pnpm preview
```

> **Requires:** Node 18+ and [pnpm](https://pnpm.io/)

---

## Tech Choices

| Library | Why |
|---|---|
| **React 19** | Latest stable; leverages automatic JSX transform |
| **TypeScript 6** | Strict typing; discriminated unions enforce widget type/config consistency |
| **Vite 8** | Fast HMR, minimal config, native ESM |
| **Tailwind CSS 4** | Utility-first styling; v4 Vite plugin — zero config, no `tailwind.config` file |
| **Zustand 5** | Lightweight state (< 1KB); selector-based subscriptions prevent unnecessary re-renders |
| **react-grid-layout 2** | Battle-tested responsive grid with drag/drop, resize, and compaction built in |
| **Recharts 3** | Composable, declarative chart API built on D3; good React integration |
| **Lucide React** | Tree-shakeable SVG icons; consistent visual language |
| **Vitest + Testing Library** | Fast, Vite-native test runner with DOM testing utilities |

---

## Architecture

### Folder Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── BarChartWidget.tsx     # Presentational bar chart
│   │   └── LineChartWidget.tsx    # Presentational line chart
│   ├── Dashboard.tsx              # Main canvas + grid + drop zone
│   ├── Sidebar.tsx                # Widget palette (drag + click-to-add)
│   ├── Toolbar.tsx                # Clear + sidebar toggle
│   ├── WidgetCard.tsx             # Widget shell (title, remove, chart)
│   ├── EditableTitle.tsx          # Click-to-edit title
│   ├── EmptyState.tsx             # Empty canvas prompt
│   ├── LiveAnnouncer.tsx          # Screen reader announcements
│   └── ErrorBoundary.tsx          # Catches per-widget errors
├── stores/
│   ├── dashboard.ts               # Zustand store (widgets, layouts, persistence)
│   └── index.ts                   # Re-exports
├── test/
│   └── setup.ts                   # Test environment (localStorage mock, UUID stub)
├── widgetRegistry.ts              # Maps chart type → component, icon, defaults
├── mockData.ts                    # 4 hardcoded datasets
├── types.ts                       # ChartType, Widget, DataPoint, configs
├── App.tsx                        # Root layout (header + Dashboard + Sidebar)
├── main.tsx                       # Entry point
└── index.css                      # Tailwind import
```

### Component Hierarchy

```
App
├── Toolbar                        (clear / toggle sidebar)
├── Dashboard
│   ├── EmptyState                 (when no widgets)
│   └── ResponsiveGridLayout       (when widgets exist)
│       └── WidgetCard[]
│           ├── GripVertical        (drag handle)
│           ├── EditableTitle       (click-to-edit)
│           ├── ErrorBoundary
│           │   └── BarChartWidget | LineChartWidget
│           └── X button            (remove)
├── Sidebar
│   └── Widget items[]             (drag or click to add)
└── LiveAnnouncer                  (aria-live region)
```

### Data Flow

```
Sidebar (drag/click) ─��→ Dashboard/Store ──addWidget()──→ Zustand Store
                                                              │
WidgetCard ←── selector subscription ────────────────────────┘
    │
    ├── WIDGET_REGISTRY[type] → chart component
    ├── DATASETS[datasetKey]  → chart data
    └── renders chart

LiveAnnouncer ←── store.subscribe() → announces add/remove/clear
```

---

## Key Design Decisions

### Normalized State

Widgets are stored as a flat dictionary + ordered ID array:

```ts
{
  widgets: { [id]: Widget },       // O(1) lookup
  widgetIds: string[],             // ordering
  layouts: ResponsiveLayouts,      // grid positions per breakpoint
}
```

This avoids deeply nested updates and makes individual widget subscriptions cheap via Zustand selectors (`s => s.widgets[id]`).

### Widget Registry Pattern

A single `WIDGET_REGISTRY` maps each chart type to its component, label, icon, and default grid size. Adding a new chart type requires only a new component and one registry entry — no existing components change.

### Discriminated Unions

```ts
type Widget =
  | (WidgetBase & { type: "bar";  config: BarChartConfig })
  | (WidgetBase & { type: "line"; config: LineChartConfig });
```

TypeScript enforces that `config` shape matches `type` at compile time.

### Error Isolation

Each widget is wrapped in its own `ErrorBoundary`. A broken chart shows a fallback with a "Remove widget" button instead of crashing the entire dashboard.

### Drag-and-Drop

1. **Sidebar** sets `dataTransfer.setData("text/plain", chartType)` on drag start
2. **Dashboard** tracks `isDraggingOver` via `dragEnter`/`dragLeave` with a counter (prevents flicker from child element events)
3. On drop, the chart type is read from `dataTransfer` and `addWidget()` is called
4. Visual feedback during drag: dashed indigo border, background tint, grid-line pattern, and empty-state icon animation

### Responsive Grid

- **Breakpoints:** 12 columns (desktop) → 6 (tablet) → 1 (mobile)
- **Vertical compaction:** widgets stack to fill gaps
- **Drag handle:** only the header grip icon initiates rearrangement
- **v2 API:** uses `compactor`, `dragConfig`, `dropConfig` (not legacy flat props)

### Accessibility

- Keyboard-accessible widget adding (click/Enter/Space, not drag-only)
- Focus trap in mobile sidebar overlay with Escape to close
- `aria-live="polite"` region announces widget add/remove/clear to screen readers
- Proper semantic roles: `dialog`, `region`, `status`, `alert`
- Native `<button>` elements (no `<span role="button">` workarounds)
- Color contrast meets WCAG AA (4.5:1 ratio)

---

## Tests

21 tests across 3 suites:

| Suite | Tests | What's covered |
|---|---|---|
| `stores/store.test.ts` | 9 | Add/remove/update/clear actions, dataset cycling, layout cleanup |
| `EditableTitle.test.tsx` | 8 | View/edit mode, commit on blur/Enter, cancel on Escape, empty input rejection |
| `WidgetCard.test.tsx` | 4 | Null render, title + label display, remove action, title edit propagation |

---

## Tradeoffs

| Decision | Upside | Downside |
|---|---|---|
| **Zustand over Context** | Fine-grained subscriptions, less boilerplate | Extra dependency (though < 1KB) |
| **react-grid-layout** | Mature; handles resize, compact, responsive | Large dependency; CSS must be manually imported |
| **Mock data cycling** | Each widget gets different data automatically | Not realistic; no user-selectable data sources |
| **No widget resize UI** | Cleaner default experience | Users can't resize (grid supports it, just not exposed) |
| **Tailwind v4** | Zero-config with Vite plugin | Newer; smaller community knowledge base vs v3 |
| **Class-based ErrorBoundary** | Only React API for catching render errors | Class components in a hooks-based codebase |

---

## What I'd Improve With More Time

- **Widget resize handles** — react-grid-layout supports this natively; just needs a resize grip UI
- **Undo/redo** — Zustand's `temporal` middleware or a simple state history stack
- **Data source selector** — let users pick which dataset each widget displays
- **Animation on add/remove** — `framer-motion` `AnimatePresence` for smooth enter/exit
- **E2E tests** — Playwright for drag-and-drop interactions
- **Dark mode** — Tailwind v4's `@custom-variant` makes this straightforward
