"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

export default function Window({ title, children, onClose }: WindowProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPos({
      x: drag.current.origX + e.clientX - drag.current.startX,
      y: drag.current.origY + e.clientY - drag.current.startY,
    });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className={
        maximized
          ? "fixed inset-0 z-30 flex flex-col overflow-hidden border border-border bg-surface shadow-md"
          : "relative z-10 w-full overflow-hidden border border-border bg-surface shadow-md"
      }
      style={
        maximized ? undefined : { transform: `translate(${pos.x}px, ${pos.y}px)` }
      }
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => {
          setMaximized((m) => !m);
          setMinimized(false);
        }}
        className={`flex touch-none select-none items-stretch border-b border-border ${
          maximized ? "" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <span className="flex flex-1 items-center px-3 text-xs text-text">
          {title}
        </span>
        <div className="flex" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            className="flex h-8 w-11 items-center justify-center text-sm text-text hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="свернуть"
          >
            ─
          </button>
          <button
            type="button"
            onClick={() => {
              setMaximized((m) => !m);
              setMinimized(false);
            }}
            className="flex h-8 w-11 items-center justify-center text-xs text-text hover:bg-black/10 dark:hover:bg-white/10"
            aria-label={maximized ? "восстановить" : "развернуть"}
          >
            {maximized ? "❐" : "☐"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onClose) {
                onClose();
                return;
              }
              setPos({ x: 0, y: 0 });
              setMaximized(false);
              setMinimized(false);
            }}
            className="flex h-8 w-11 items-center justify-center text-sm text-text hover:bg-red-500 hover:text-white"
            aria-label={onClose ? "закрыть" : "сброс"}
          >
            ✕
          </button>
        </div>
      </div>
      {!minimized && (
        <div className={maximized ? "flex-1 overflow-auto" : undefined}>
          {children}
        </div>
      )}
    </div>
  );
}
