interface DragState {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}

const BASE_CLASS =
  "relative z-10 w-full overflow-hidden border border-border bg-surface shadow-md";
const DESKTOP_CLASS =
  "absolute left-0 top-0 overflow-hidden border border-border bg-surface shadow-md";
const DRAG_CLASS =
  "flex touch-none select-none items-stretch border-b border-border cursor-grab active:cursor-grabbing";

let zTop = 40;

export function initWindow(root: HTMLElement) {
  const titlebar = root.querySelector<HTMLElement>("[data-window-titlebar]");
  const controls = root.querySelector<HTMLElement>("[data-window-controls]");
  const btnClose = root.querySelector<HTMLButtonElement>("[data-window-close]");
  if (!titlebar || !controls || !btnClose) return;

  const desktop = root.hasAttribute("data-window-desktop");
  const container = desktop ? root.parentElement : null;

  let pos = { x: 0, y: 0 };
  let open = !desktop;
  let drag: DragState | null = null;

  const apply = () => {
    root.className = desktop
      ? `win-pop${open ? " is-open" : ""} ${DESKTOP_CLASS}`
      : BASE_CLASS;
    root.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    titlebar.className = DRAG_CLASS;
  };

  const place = () => {
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const w = root.offsetWidth || 300;
    const h = root.offsetHeight || 200;
    const margin = 16;
    const maxX = Math.max(0, cw - w - margin);
    const maxY = Math.max(0, ch - h - margin);
    pos = {
      x: margin * 0.5 + Math.random() * Math.max(0, maxX - margin),
      y: margin * 0.5 + Math.random() * Math.max(0, maxY - margin),
    };
  };

  const openIn = () => {
    if (desktop) {
      root.style.transitionDelay = `${(Math.random() * 400).toFixed(0)}ms`;
      requestAnimationFrame(() => {
        open = true;
        apply();
      });
    }
  };

  const reset = () => {
    pos = { x: 0, y: 0 };
    open = true;
    if (desktop) place();
    apply();
  };

  titlebar.addEventListener("pointerdown", (e) => {
    if (desktop) root.style.zIndex = String(++zTop);
    titlebar.setPointerCapture(e.pointerId);
    drag = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  });

  titlebar.addEventListener("pointermove", (e) => {
    if (!drag) return;
    pos = {
      x: drag.origX + e.clientX - drag.startX,
      y: drag.origY + e.clientY - drag.startY,
    };
    root.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  });

  const endDrag = (e: PointerEvent) => {
    drag = null;
    if (titlebar.hasPointerCapture(e.pointerId)) {
      titlebar.releasePointerCapture(e.pointerId);
    }
  };

  titlebar.addEventListener("pointerup", endDrag);
  titlebar.addEventListener("pointercancel", endDrag);

  controls.addEventListener("pointerdown", (e) => e.stopPropagation());

  btnClose.addEventListener("click", () => {
    if (root.hasAttribute("data-window-closable")) {
      root.remove();
      return;
    }
    reset();
  });

  if (desktop) {
    place();
    apply();
    openIn();
  } else {
    apply();
  }
}

document.querySelectorAll<HTMLElement>("[data-window-root]").forEach(initWindow);
export {};