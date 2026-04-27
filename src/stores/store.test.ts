import { describe, it, expect } from "vitest";
import { useDashboardStore } from "./";

const { getState } = useDashboardStore;

describe("useDashboardStore", () => {
  it("has correct initial state", () => {
    const { widgets, widgetIds, layouts } = getState();
    expect(widgets).toEqual({});
    expect(widgetIds).toEqual([]);
    expect(layouts).toEqual({});
  });

  describe("addWidget", () => {
    it("creates a bar widget with colorScheme config", () => {
      getState().addWidget("bar");
      const { widgets, widgetIds } = getState();

      expect(widgetIds).toHaveLength(1);
      const w = widgets[widgetIds[0]];
      expect(w.type).toBe("bar");
      expect(w.title).toBe("Bar Chart");
      expect(w.config).toEqual({ colorScheme: "#6366f1" });
      expect(w.datasetKey).toBe("revenue"); // first dataset key
    });

    it("creates a line widget with curved config", () => {
      getState().addWidget("line");
      const { widgets, widgetIds } = getState();

      expect(widgetIds).toHaveLength(1);
      const w = widgets[widgetIds[0]];
      expect(w.type).toBe("line");
      expect(w.title).toBe("Line chart");
      expect(w.config).toEqual({ curved: true });
    });

    it("cycles through dataset keys for multiple widgets", () => {
      getState().addWidget("bar");
      getState().addWidget("line");
      getState().addWidget("bar");
      getState().addWidget("line");

      const { widgets, widgetIds } = getState();
      expect(widgetIds).toHaveLength(4);

      const keys = widgetIds.map((id) => widgets[id].datasetKey);
      expect(keys).toEqual(["revenue", "users", "sessions", "orders"]);
    });
  });

  describe("removeWidget", () => {
    it("removes widget from widgets, widgetIds, and layouts", () => {
      getState().addWidget("bar");
      const id = getState().widgetIds[0];

      // Simulate a layout entry
      useDashboardStore.setState({
        layouts: {
          lg: [{ i: id, x: 0, y: 0, w: 4, h: 3 }],
          sm: [{ i: id, x: 0, y: 0, w: 6, h: 3 }],
        },
      });

      getState().removeWidget(id);
      const { widgets, widgetIds, layouts } = getState();

      expect(widgets[id]).toBeUndefined();
      expect(widgetIds).not.toContain(id);
      expect(layouts.lg).toEqual([]);
      expect(layouts.sm).toEqual([]);
    });

    it("is a no-op for a nonexistent id", () => {
      getState().addWidget("bar");
      const before = getState();

      getState().removeWidget("nonexistent-id");
      const after = getState();

      expect(after.widgetIds).toEqual(before.widgetIds);
      expect(Object.keys(after.widgets)).toEqual(Object.keys(before.widgets));
    });
  });

  describe("updateWidgetTitle", () => {
    it("updates the title without changing other fields", () => {
      getState().addWidget("bar");
      const id = getState().widgetIds[0];
      const before = getState().widgets[id];

      getState().updateWidgetTitle(id, "New Title");
      const after = getState().widgets[id];

      expect(after.title).toBe("New Title");
      expect(after.type).toBe(before.type);
      expect(after.config).toEqual(before.config);
      expect(after.datasetKey).toBe(before.datasetKey);
    });
  });

  describe("updateLayouts", () => {
    it("replaces the layouts object", () => {
      const newLayouts = {
        lg: [{ i: "a", x: 0, y: 0, w: 4, h: 3 }],
      };
      getState().updateLayouts(newLayouts);
      expect(getState().layouts).toEqual(newLayouts);
    });
  });

  describe("clearDashboard", () => {
    it("resets to empty state", () => {
      getState().addWidget("bar");
      getState().addWidget("line");

      getState().clearDashboard();
      const { widgets, widgetIds, layouts } = getState();

      expect(widgets).toEqual({});
      expect(widgetIds).toEqual([]);
      expect(layouts).toEqual({});
    });
  });
});
