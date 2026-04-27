import { Trash2, PanelRightOpen } from "lucide-react";
import { useDashboardStore } from "../stores";

type ToolBarProps = {
  onToggleSidebar: () => void;
};

export function Toolbar({ onToggleSidebar }: ToolBarProps) {
  const hasWidgets = useDashboardStore((state) => state.widgetIds.length > 0);
  const clearDashboard = useDashboardStore((state) => state.clearDashboard);
  return (
    <div className="flex items-center gap-2">
      {hasWidgets && (
        <button
          onClick={clearDashboard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      )}
      <button
        onClick={onToggleSidebar}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer lg:hidden"
        aria-label="Toggle widget sidebar"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
    </div>
  );
}
