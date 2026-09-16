const NIGHTSCOUT_SITE = "https://ns.murchikov.com";
const NIGHTSCOUT_TOKEN = "";

const POLL_INTERVAL_MS = 60 * 1000;
const HISTORY_MS = 24 * 60 * 60 * 1000;
const FETCH_COUNT = 500;

const SVG_NS = "http://www.w3.org/2000/svg";

interface SgvEntry {
  sgv: number;
  date: number;
  direction?: string;
}

const DIRECTIONS: Record<string, { icon: string; label: string }> = {
  DoubleUp: { icon: "↑↑", label: "резко вверх" },
  SingleUp: { icon: "↑", label: "вверх" },
  FortyFiveUp: { icon: "↗", label: "растёт" },
  Flat: { icon: "→", label: "ровно" },
  FortyFiveDown: { icon: "↘", label: "снижается" },
  SingleDown: { icon: "↓", label: "вниз" },
  DoubleDown: { icon: "↓↓", label: "резко вниз" },
  NONE: { icon: "", label: "" },
};

const LOW = 3.9;
const HIGH = 10;

function toMmol(sgv: number): number {
  return sgv > 60 ? sgv / 18.01559 : sgv;
}

function colorFor(value: number): string {
  if (value < LOW) return "#ef4444";
  if (value > HIGH) return "#f59e0b";
  return "#22c55e";
}

function toDisplay(value: number): string {
  return value.toFixed(1);
}

function formatAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч`;
  return `${Math.floor(hours / 24)} дн`;
}

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

const roots = document.querySelectorAll<HTMLElement>("[data-health]");
roots.forEach((root) => {
  let current: { pts: { ts: number; v: number }[]; last: SgvEntry } | null = null;
  let lastWidth = 0;

  const setMessage = (message: string) => {
    const box = document.createElement("div");
    box.className = "px-4 py-4";
    const p = document.createElement("p");
    p.className = "text-sm text-muted";
    p.textContent = message;
    box.appendChild(p);
    root.replaceChildren(box);
    lastWidth = 0;
  };

  const build = () => {
    if (!current) return;
    const width = Math.max(180, root.clientWidth - 24);
    if (Math.abs(width - lastWidth) < 2) return;
    lastWidth = width;

    const { pts, last } = current;

    const HEIGHT = 116;
    const PAD_L = 28;
    const PAD_R = 8;
    const PAD_T = 8;
    const PAD_B = 18;
    const chartW = width - PAD_L - PAD_R;
    const chartH = HEIGHT - PAD_T - PAD_B;

    const now = Date.now();
    const t0 = now - HISTORY_MS;

    let min = Math.min(...pts.map((p) => p.v), LOW);
    let max = Math.max(...pts.map((p) => p.v), HIGH);
    if (max - min < 1) {
      max += 0.5;
      min -= 0.5;
    }

    const x = (ts: number) => PAD_L + ((ts - t0) / HISTORY_MS) * chartW;
    const y = (v: number) => PAD_T + (1 - (v - min) / (max - min)) * chartH;

    const lastP = pts[pts.length - 1];
    const color = colorFor(lastP.v);

    const svgEl = svg("svg", {
      width: String(width),
      height: String(HEIGHT),
      viewBox: `0 0 ${width} ${HEIGHT}`,
      class: "block w-full",
    });

    const bandTop = y(HIGH);
    const bandH = Math.max(0, y(LOW) - bandTop);
    svgEl.appendChild(
      svg("rect", {
        x: String(PAD_L),
        y: String(bandTop),
        width: String(chartW),
        height: String(bandH),
        fill: "#22c55e",
        "fill-opacity": "0.08",
        rx: "2",
      }),
    );

    for (const v of [max, (min + max) / 2, min]) {
      const gy = y(v);
      svgEl.appendChild(
        svg("line", {
          x1: String(PAD_L),
          y1: String(gy),
          x2: String(width - PAD_R),
          y2: String(gy),
          stroke: "#9ca3af",
          "stroke-opacity": "0.25",
          "stroke-dasharray": "2 3",
        }),
      );
      const label = svg("text", {
        x: String(PAD_L - 5),
        y: String(gy),
        fill: "#9ca3af",
        "text-anchor": "end",
        class: "font-mono",
      });
      label.setAttribute("font-size", "8");
      label.setAttribute("style", "dominant-baseline: middle");
      label.textContent = toDisplay(v);
      svgEl.appendChild(label);
    }

    for (const offset of [24, 18, 12, 6, 0]) {
      const tx = x(now - offset * 3_600_000);
      svgEl.appendChild(
        svg("line", {
          x1: String(tx),
          y1: String(PAD_T),
          x2: String(tx),
          y2: String(PAD_T + chartH),
          stroke: "#9ca3af",
          "stroke-opacity": "0.12",
        }),
      );
      const tlabel = svg("text", {
        x: String(tx),
        y: String(HEIGHT - 4),
        fill: "#9ca3af",
        "text-anchor": "middle",
        class: "font-mono",
      });
      tlabel.setAttribute("font-size", "7");
      tlabel.textContent = offset === 0 ? "сейчас" : `-${offset}ч`;
      svgEl.appendChild(tlabel);
    }

    const linePath = pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.ts).toFixed(1)},${y(p.v).toFixed(1)}`)
      .join(" ");
    const bottomY = y(min).toFixed(1);
    const areaPath = `${linePath} L${x(pts[pts.length - 1].ts).toFixed(1)},${bottomY} L${x(pts[0].ts).toFixed(1)},${bottomY} Z`;

    svgEl.appendChild(svg("path", { d: areaPath, fill: color, "fill-opacity": "0.14" }));
    svgEl.appendChild(
      svg("path", {
        d: linePath,
        fill: "none",
        stroke: color,
        "stroke-width": "1.6",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
      }),
    );

    svgEl.appendChild(
      svg("circle", {
        cx: String(x(lastP.ts)),
        cy: String(y(lastP.v)),
        r: "3.4",
        fill: "#ffffff",
        stroke: color,
        "stroke-width": "2.2",
      }),
    );

    const dir = DIRECTIONS[last.direction ?? ""] ?? DIRECTIONS.NONE;

    const box = document.createElement("div");
    box.className = "px-3 py-3";

    const header = document.createElement("div");
    header.className = "mb-2 flex items-center justify-between";
    const label = document.createElement("span");
    label.className = "font-mono text-[10px] uppercase tracking-wider text-muted";
    label.textContent = "глюкоза";
    const right = document.createElement("span");
    right.className = "flex items-baseline gap-1.5";
    const arrow = document.createElement("span");
    arrow.className = "text-xs text-muted";
    arrow.textContent = dir.icon;
    if (dir.label) arrow.title = dir.label;
    const value = document.createElement("span");
    value.className = "font-mono text-base font-semibold tabular-nums";
    value.textContent = `${toDisplay(lastP.v)} ммоль/л`;
    value.style.color = color;
    right.append(arrow, value);
    header.append(label, right);
    box.appendChild(header);

    box.appendChild(svgEl);

    const footer = document.createElement("div");
    footer.className = "mt-1.5 flex items-center justify-between font-mono text-[10px] text-muted";
    const updated = document.createElement("span");
    updated.textContent = `обновлено ${formatAgo(last.date)}`;
    const range = document.createElement("span");
    range.textContent = `норма ${toDisplay(LOW)}–${toDisplay(HIGH)} ммоль/л`;
    footer.append(updated, range);
    box.appendChild(footer);

    root.replaceChildren(box);
  };

  const onData = (entries: SgvEntry[]) => {
    const clean = entries.filter((e) => typeof e.sgv === "number" && e.sgv > 0 && typeof e.date === "number");
    if (clean.length === 0) {
      setMessage("нет данных CGM");
      return;
    }
    const now = Date.now();
    const pts = clean
      .filter((e) => e.date >= now - HISTORY_MS && e.date <= now)
      .map((e) => ({ ts: e.date, v: toMmol(e.sgv) }))
      .sort((a, b) => a.ts - b.ts);
    if (pts.length < 2) {
      setMessage("мало данных для графика");
      return;
    }
    const ordered = [...clean].sort((a, b) => a.date - b.date);
    current = { pts, last: ordered[ordered.length - 1] };
    lastWidth = 0;
    build();
  };

  const fetchGlucose = async () => {
    if (!NIGHTSCOUT_SITE) {
      setMessage("впиши NIGHTSCOUT_SITE в src/scripts/health.ts");
      return;
    }
    try {
      const token = NIGHTSCOUT_TOKEN ? `&token=${encodeURIComponent(NIGHTSCOUT_TOKEN)}` : "";
      const response = await fetch(
        `${NIGHTSCOUT_SITE}/api/v1/entries/sgv?count=${FETCH_COUNT}${token}`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) {
        setMessage("глюкоза недоступна");
        return;
      }
      const data: SgvEntry[] = await response.json();
      if (data.length === 0) {
        setMessage("нет данных CGM");
        return;
      }
      onData(data);
    } catch {
      setMessage("глюкоза недоступна");
    }
  };

  fetchGlucose();
  setInterval(fetchGlucose, POLL_INTERVAL_MS);
  window.addEventListener("resize", () => {
    lastWidth = 0;
    build();
  });
});
export {};