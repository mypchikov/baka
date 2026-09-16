const W = 88;
const H = 31;

interface Sprite {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const containers = document.querySelectorAll<HTMLElement>("[data-dvd]");
containers.forEach((container) => {
  const els = Array.from(container.children) as HTMLElement[];
  if (els.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const enabled = params.has("dvd");
  container.hidden = !enabled;
  if (enabled) {
    document
      .querySelectorAll<HTMLElement>("[data-hide-in-dvd]")
      .forEach((el) => {
        el.hidden = true;
      });
  }

  let sprites: Sprite[] = [];
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const randSpeed = () => (Math.random() < 0.5 ? -1 : 1) * rand(0.4, 1.1);

const init = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    sprites = [];
    for (let i = 0; i < els.length; i++) {
      sprites.push({
        x: rand(0, Math.max(0, w - W)),
        y: rand(0, Math.max(0, h - H)),
        vx: randSpeed(),
        vy: randSpeed(),
      });
    }
  };
  init();

  let raf = 0;
const tick = () => {
    const maxX = container.clientWidth - W;
    const maxY = container.clientHeight - H;
    for (let i = 0; i < sprites.length; i++) {
      const s = sprites[i];
      s.x += s.vx;
      s.y += s.vy;
      if (s.x <= 0) {
        s.x = 0;
        s.vx = -s.vx;
      } else if (s.x >= maxX) {
        s.x = maxX;
        s.vx = -s.vx;
      }
      if (s.y <= 0) {
        s.y = 0;
        s.vy = -s.vy;
      } else if (s.y >= maxY) {
        s.y = maxY;
        s.vy = -s.vy;
      }
      els[i].style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onResize = () => init();
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
});
export {};
