const NICKNAMES = ["мурчиков", "муря", "muria", "murchikov"];

const TYPE_MS = 130;
const HOLD_MS = 1700;
const DELETE_MS = 70;

const roots = document.querySelectorAll<HTMLElement>("[data-nickname-text]");

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function typeLoop(root: HTMLElement) {
  let i = 0;
  for (;;) {
    const word = NICKNAMES[i % NICKNAMES.length];
    for (let k = 0; k <= word.length; k++) {
      root.textContent = word.slice(0, k);
      await sleep(TYPE_MS);
    }
    i = (i + 1) % NICKNAMES.length;
    await sleep(HOLD_MS);
    const current = root.textContent ?? "";
    for (let k = current.length; k >= 0; k--) {
      root.textContent = current.slice(0, k);
      await sleep(DELETE_MS);
    }
  }
}

roots.forEach(typeLoop);
export {};