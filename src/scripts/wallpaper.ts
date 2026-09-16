const desktop = document.querySelector<HTMLElement>("[data-desktop]");
const raw = desktop?.dataset.wallpapers;

if (desktop && raw) {
  try {
    const wallpapers: string[] = JSON.parse(raw).filter((u: unknown): u is string => typeof u === "string");
    if (wallpapers.length > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const url = wallpapers[Math.floor(Math.random() * wallpapers.length)];
      desktop.style.backgroundImage = `url(${url})`;
      desktop.style.backgroundSize = "cover";
      desktop.style.backgroundPosition = "center";
    }
  } catch {
    // невалидный список обоев — остаётся обычный фон
  }
}
export {};