import { useEffect, useState } from "react";
import { useDashboardStore } from "../stores";

export function LiveAnnouncer() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = useDashboardStore.subscribe((state, prevState) => {
      const curr = state.widgetIds;
      const prev = prevState.widgetIds;

      if (curr.length > prev.length) {
        const newId = curr.find((id) => !prev.includes(id));
        const widget = newId ? state.widgets[newId] : null;
        setMessage(widget ? `${widget.title} widget added` : "Widget added");
      } else if (curr.length < prev.length) {
        if (curr.length === 0 && prev.length > 1) {
          setMessage("All widgets cleared");
        } else {
          const removedId = prev.find((id) => !curr.includes(id));
          const widget = removedId ? prevState.widgets[removedId] : null;
          setMessage(
            widget ? `${widget.title} widget removed` : "Widget removed",
          );
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
