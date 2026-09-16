interface Site {
  id: number;
  name: string;
  url: string;
  favicon: string | null;
}

interface SiteData {
  prev: Site;
  curr: Site;
  next: Site;
}

const MEDIA = "https://ring.tetopie.lol/media/";

const roots = document.querySelectorAll<HTMLElement>("[data-webring]");
roots.forEach((root) => {
  fetch("https://ring.tetopie.lol/murchikov/data")
    .then((r) => r.json())
    .then((data: SiteData) => {
      const row = document.createElement("div");
      row.className = "mt-2 flex items-center justify-center gap-2";

      const left = document.createElement("span");
      left.textContent = "←";
      row.appendChild(left);

      row.appendChild(renderLink(data.prev, true));

      const webring = document.createElement("a");
      webring.href = "https://ring.tetopie.lol/";
      webring.textContent = "[webring]";
      row.appendChild(webring);

      row.appendChild(renderLink(data.next, false));

      const right = document.createElement("span");
      right.textContent = "→";
      row.appendChild(right);

      root.replaceChildren(row);
    })
    .catch(() => {
      // оставить статичный fallback из разметки
    });
});

function renderLink(site: Site, faviconAfter: boolean) {
  const a = document.createElement("a");
  a.href = site.url;
  a.rel = "noopener noreferrer";
  a.className =
    "flex items-center text-accent transition-opacity duration-100 hover:opacity-70";

  if (!faviconAfter && site.favicon) {
    a.appendChild(renderFavicon("mr-1"));
  }

  const name = document.createElement("span");
  name.textContent = site.name;
  a.appendChild(name);

  if (faviconAfter && site.favicon) {
    a.appendChild(renderFavicon("ml-1"));
  }

  return a;

  function renderFavicon(cls: string) {
    const img = document.createElement("img");
    img.src = MEDIA + site.favicon;
    img.alt = "";
    img.width = 16;
    img.height = 16;
    img.className = `${cls} shrink-0`;
    img.onerror = () => {
      img.style.display = "none";
    };
    return img;
  }
}
export {};
