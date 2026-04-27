import { LayoutDashboard } from "lucide-react";

type EmptyStateProps = {
  isDraggingOver?: boolean;
};
export function EmptyState({ isDraggingOver }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full min-h-100 border-2 border-dashed rounded-xl m-4 transition-all duration-200 ${
        isDraggingOver ? "border-indigo-400 bg-indigo-50/50" : "border-gray-300"
      }`}
    >
      <LayoutDashboard
        className={`w-16 h-16 mb-4 transition-all duration-200 ${
          isDraggingOver
            ? "text-indigo-400 scale-110 animate-pulse"
            : "text-gray-300"
        }`}
      />
      <p
        role="status"
        className={`text-lg font-medium transition-colors duration-200 ${
          isDraggingOver ? "text-indigo-500" : "text-gray-400"
        }`}
      >
        {isDraggingOver ? "Drop it here!" : "Drag a chart here"}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Drop widgets from the sidebar to build your dashboard
      </p>
    </div>
  );
}
