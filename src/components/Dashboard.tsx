import { useCallback, useRef, useState } from "react";
import {
  ResponsiveGridLayout,
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import type { LayoutItem, Layout, ResponsiveLayouts } from "react-grid-layout";
import { useDashboardStore } from "../stores";
import { WIDGET_REGISTRY } from "../widgetRegistry";
import { WidgetCard } from "./WidgetCard";
import { EmptyState } from "./EmptyState";
import type { ChartType } from "../types";

const BREAKPOINTS = { lg: 1200, md: 768, sm: 0 };
const GRID_COLS = { lg: 12, md: 6, sm: 1 };

export function Dashboard() {
  const widgetIds = useDashboardStore((s) => s.widgetIds);
  const layouts = useDashboardStore((s) => s.layouts);
  const addWidget = useDashboardStore((s) => s.addWidget);
  const updateLayouts = useDashboardStore((s) => s.updateLayouts);

  const { width, containerRef, mounted } = useContainerWidth();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDraggingOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDropFromSidebar = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingOver(false);
      const type = e.dataTransfer.getData("text/plain") as ChartType;
      if (type && type in WIDGET_REGISTRY) {
        addWidget(type);
      }
    },
    [addWidget],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleGridDrop = useCallback(
    (_layout: Layout, _layoutItem: LayoutItem | undefined, event: Event) => {
      dragCounter.current = 0;
      setIsDraggingOver(false);
      const type = (event as DragEvent).dataTransfer?.getData(
        "text/plain",
      ) as ChartType;
      if (type && type in WIDGET_REGISTRY) {
        addWidget(type);
      }
    },
    [addWidget],
  );

  const handleLayoutChange = useCallback(
    (_currentLayout: Layout, allLayouts: ResponsiveLayouts) => {
      updateLayouts(allLayouts);
    },
    [updateLayouts],
  );

  const dragProps = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDropFromSidebar,
  };

  if (widgetIds.length === 0) {
    return (
      <div className="flex-1 min-h-0" {...dragProps}>
        <EmptyState isDraggingOver={isDraggingOver} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 min-h-0 p-2 overflow-auto transition-all duration-200 ${
        isDraggingOver
          ? "border-2 border-dashed border-indigo-400 bg-indigo-50/30 bg-size-[40px_40px] bg-[linear-gradient(to_right,rgb(199_210_254/0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgb(199_210_254/0.4)_1px,transparent_1px)]"
          : ""
      }`}
      {...dragProps}
    >
      {mounted && (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={GRID_COLS}
          width={width}
          rowHeight={100}
          compactor={verticalCompactor}
          dropConfig={{ enabled: true, defaultItem: { w: 4, h: 3 } }}
          dragConfig={{ enabled: true, handle: ".widget-drag-handle", cancel: "button, input" }}
          droppingItem={{ i: "__dropping-elem__", x: 0, y: 0, w: 4, h: 3 }}
          onDrop={handleGridDrop}
          onLayoutChange={handleLayoutChange}
        >
          {widgetIds.map((id) => {
            const widget = useDashboardStore.getState().widgets[id];
            const defaultSize = widget
              ? WIDGET_REGISTRY[widget.type].defaultSize
              : { w: 4, h: 3 };
            return (
              <div
                key={id}
                data-grid={{
                  x: 0,
                  y: Infinity,
                  w: defaultSize.w,
                  h: defaultSize.h,
                }}
                className="widget-drag-handle"
              >
                <WidgetCard id={id} />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
