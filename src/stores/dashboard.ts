import { create } from "zustand";
import { getNextDatasetKey } from "../mockData";
import type { ChartPosition, ChartType, Widget } from "../types";
import { WIDGET_REGISTRY } from "../widgetRegistry";
import { persist } from "zustand/middleware";
import type { ResponsiveLayouts } from "react-grid-layout";

type DashboardState = {
  widgets: Record<string, Widget>;
  widgetIds: string[];
  layouts: ResponsiveLayouts;

  addWidget: (type: ChartType, position?: ChartPosition) => void;
  removeWidget: (id: string) => void;
  updateWidgetTitle: (id: string, title: string) => void;
  updateLayouts: (layouts: ResponsiveLayouts) => void;
  clearDashboard: () => void;
};

function createWidget(type: ChartType): Widget {
  const id = crypto.randomUUID();
  const datasetKey = getNextDatasetKey();
  const registry = WIDGET_REGISTRY[type];

  if (type === "bar") {
    return {
      id,
      type,
      title: registry.label,
      datasetKey,
      config: { colorScheme: "#6366f1" },
    };
  }
  return {
    id,
    type,
    title: registry.label,
    datasetKey,
    config: { curved: true },
  };
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: {},
      widgetIds: [],
      layouts: {},

      addWidget: (type) =>
        set((state) => {
          const widget = createWidget(type);
          return {
            widgets: { ...state.widgets, [widget.id]: widget },
            widgetIds: [...state.widgetIds, widget.id],
          };
        }),

      removeWidget: (id) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...remainingWidgets } = state.widgets;
          const layouts: ResponsiveLayouts = {};
          for (const [bp, bpLayouts] of Object.entries(state.layouts)) {
            layouts[bp] = bpLayouts?.filter((l) => l.i !== id);
          }
          return {
            widgets: remainingWidgets,
            widgetIds: state.widgetIds.filter((wId) => wId !== id),
            layouts,
          };
        }),

      updateWidgetTitle: (id, title) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [id]: { ...state.widgets[id], title },
          },
        })),

      updateLayouts: (layouts) => set({ layouts }),

      clearDashboard: () => {
        useDashboardStore.persist.clearStorage();
        set({ widgets: {}, widgetIds: [], layouts: {} });
      },
    }),
    {
      name: "dashboard-state",
      version: 2,
      migrate: () => ({ widgets: {}, widgetIds: [], layouts: {} }),
      partialize: (state) => ({
        widgets: state.widgets,
        widgetIds: state.widgetIds,
        layouts: state.layouts,
      }),
    },
  ),
);
