import React from "react";
import { useWatch } from "react-hook-form";

/**
 * Isolated subscriber component for the cover note character counter.
 * Subscribes only to `application.coverNote` via narrow useWatch.
 * Typing into the cover note textarea updates only this tiny counter
 * and does not trigger re-rendering of the entire Step 4 component.
 */
export const CoverNoteCounter: React.FC = () => {
  const coverNote = useWatch({
    name: "application.coverNote",
  }) as string | undefined;

  const currentLength = coverNote ? coverNote.length : 0;
  const isNearLimit = currentLength > 900;
  const isOverLimit = currentLength > 1000;

  return (
    <div
      aria-live="polite"
      className={`text-xs font-mono self-end ${
        isOverLimit
          ? "text-red-600 font-bold"
          : isNearLimit
          ? "text-amber-600 font-medium"
          : "text-slate-400"
      }`}
    >
      {currentLength} / 1000 characters
    </div>
  );
};

