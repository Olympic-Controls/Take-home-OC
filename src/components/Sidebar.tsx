import { useEffect, useRef, useCallback } from "react";
import { GripVertical, X } from "lucide-react";
import { WIDGET_REGISTRY } from "../widgetRegistry";
import { useDashboardStore } from "../stores";
import type { ChartType } from "../types";

const chartTypes = Object.keys(WIDGET_REGISTRY) as ChartType[];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: Props) {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const asideRef = useRef<HTMLElement>(null);

  const handleAdd = useCallback(
    (type: ChartType) => {
      addWidget(type);
    },
    [addWidget],
  );

  useEffect(() => {
    if (!open) return;

    const aside = asideRef.current;
    if (!aside) return;

    const firstFocusable = aside.querySelector<HTMLElement>(
      'button, [tabindex="0"]',
    );
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableEls = aside.querySelectorAll<HTMLElement>(
          'button, [tabindex="0"]',
        );
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    aside.addEventListener("keydown", handleKeyDown);
    return () => aside.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop — tablet/mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={asideRef}
        role="dialog"
        aria-label="Widget sidebar"
        aria-modal={open ? "true" : undefined}
        className={`
          fixed top-0 right-0 h-full w-64 z-50 bg-gray-50 border-l border-gray-200 p-4 flex flex-col gap-2 transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0 lg:w-60 lg:shrink-0
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Widgets
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul role="list" className="flex flex-col gap-2">
          {chartTypes.map((type) => {
            const entry = WIDGET_REGISTRY[type];
            const Icon = entry.icon;
            return (
              <li key={type}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${entry.label} widget`}
                  className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-sm transition-all select-none"
                  draggable
                  unselectable="on"
                  onClick={() => handleAdd(type)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAdd(type);
                    }
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", type);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <GripVertical
                    className="w-4 h-4 text-gray-300"
                    aria-hidden="true"
                  />
                  <Icon
                    className="w-5 h-5 text-indigo-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {entry.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-gray-500 mt-4">
          Drag or click a widget to add it.
        </p>
      </aside>
    </>
  );
}
