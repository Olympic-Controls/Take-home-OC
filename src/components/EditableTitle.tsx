import { useState, useRef, useEffect, useCallback } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function EditableTitle({ value, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed) {
      onChange(trimmed);
    } else {
      setDraft(value);
    }
    setIsEditing(false);
  }, [draft, value, onChange]);

  const cancel = useCallback(() => {
    setDraft(value);
    setIsEditing(false);
  }, [value]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        aria-label="Edit widget title"
        className="text-sm font-semibold text-gray-800 bg-white border border-indigo-300 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-indigo-200 w-full min-w-0"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600 transition-colors rounded px-1.5 py-0.5 -ml-1.5 hover:bg-indigo-50 bg-transparent border-none p-0 text-left"
      onClick={() => setIsEditing(true)}
      title="Click to edit title"
    >
      {value}
    </button>
  );
}
