import { initWindow } from "./window.ts";

const desktop = document.querySelector<HTMLElement>("[data-desktop]");
const frameTemplate = document.querySelector<HTMLTemplateElement>("[data-window-frame]");

function makeWindow(title: string, width?: string): { root: HTMLElement; body: HTMLElement } | null {
  if (!desktop || !frameTemplate) return null;
  const frag = frameTemplate.content.cloneNode(true) as DocumentFragment;
  const root = frag.firstElementChild as HTMLElement;
  if (!root || !root.hasAttribute("data-window-root")) return null;
  const titlebar = root.querySelector<HTMLElement>("[data-window-titlebar]");
  const body = root.querySelector<HTMLElement>("[data-window-body]");
  if (!titlebar || !body) return null;
  titlebar.querySelector("span")!.textContent = title;
  if (width) root.style.width = width;
  root.style.maxWidth = "calc(100vw - 32px)";
  root.setAttribute("data-window-closable", "");
  desktop.appendChild(root);
  initWindow(root);
  return { root, body };
}

function openPostWindow(slug: string) {
  const existing = document.querySelector<HTMLElement>(`[data-post-window="${slug}"]`);
  if (existing) {
    const next = Number(existing.style.zIndex ?? 0) + 1;
    existing.style.zIndex = String(next);
    return;
  }
  const content = document.querySelector<HTMLTemplateElement>(`[data-post-content="${slug}"]`);
  if (!content) return;
  const win = makeWindow(content.getAttribute("data-title") ?? "", "600px");
  if (!win) return;
  win.root.dataset.postWindow = slug;
  win.body.appendChild(content.content.cloneNode(true));
}

function openBlogWindow() {
  const existing = document.querySelector("[data-blog-window]");
  if (existing) {
    const next = Number((existing as HTMLElement).style.zIndex ?? 0) + 1;
    (existing as HTMLElement).style.zIndex = String(next);
    return;
  }
  const content = document.querySelector<HTMLTemplateElement>("[data-blog-content]");
  if (!content) return;
  const win = makeWindow("блог", "640px");
  if (!win) return;
  win.root.dataset.blogWindow = "";
  win.body.appendChild(content.content.cloneNode(true));
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const postLink = target?.closest<HTMLElement>("[data-open-post]");
  if (postLink) {
    e.preventDefault();
    const slug = postLink.getAttribute("data-open-post");
    if (slug) openPostWindow(slug);
    return;
  }
  const blogLink = target?.closest<HTMLElement>("[data-open-blog]");
  if (blogLink) {
    e.preventDefault();
    openBlogWindow();
  }
});
export {};