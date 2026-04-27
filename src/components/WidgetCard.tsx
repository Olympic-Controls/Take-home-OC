import { memo } from "react";
import { GripVertical, X } from "lucide-react";
import { useDashboardStore } from "../stores";
import { WIDGET_REGISTRY } from "../widgetRegistry";
import { DATASETS } from "../mockData";
import { EditableTitle } from "./EditableTitle";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {
  id: string;
};

export const WidgetCard = memo(function WidgetCard({ id }: Props) {
  const widget = useDashboardStore((s) => s.widgets[id]);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const updateWidgetTitle = useDashboardStore((s) => s.updateWidgetTitle);

  if (!widget) return null;

  const { component: ChartComponent } = WIDGET_REGISTRY[widget.type];
  const dataset = DATASETS[widget.datasetKey];

  return (
    <div
      role="region"
      aria-label={widget.title}
      className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100">
        <GripVertical
          className="w-4 h-4 text-gray-300 shrink-0 cursor-grab active:cursor-grabbing"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <EditableTitle
            value={widget.title}
            onChange={(title) => updateWidgetTitle(id, title)}
          />
          {dataset && (
            <p className="text-xs text-gray-400 mt-0.5 px-1.5">
              {dataset.label}
            </p>
          )}
        </div>
        <button
          onClick={() => removeWidget(id)}
          aria-label={`Remove ${widget.title}`}
          className="shrink-0 p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-2 min-h-0">
        <ErrorBoundary
          fallback={
            <div
              role="alert"
              className="flex flex-col items-center justify-center h-full text-gray-400 text-sm"
            >
              <p>Something went wrong</p>
              <button
                onClick={() => removeWidget(id)}
                className="mt-2 text-red-500 hover:text-red-600 text-xs underline"
              >
                Remove widget
              </button>
            </div>
          }
        >
          <ChartComponent
            data={dataset?.data ?? []}
            config={widget.config as never}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
});
