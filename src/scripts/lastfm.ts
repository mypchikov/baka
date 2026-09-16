interface Track {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { "#text": string }[];
  date?: { uts: string };
  "@attr"?: { nowplaying: string };
}

const UPDATE_INTERVAL_MS = 30 * 1000;
const LIMIT = 10;

const API_KEY = "fa3a2ea96a5d06805621316ece3f23f5";
const USERNAME = "murchikov";



function makeHeader(count: number): HTMLElement {
  const header = document.createElement("div");
  header.className =
    "flex items-center gap-3 border-b border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted";
  const num = document.createElement("span");
  num.className = "w-6 shrink-0 text-center";
  num.textContent = "#";
  const title = document.createElement("span");
  title.className = "flex-1";
  title.textContent = `композиция / исполнитель (${count})`;
  header.append(num, title);
  return header;
}

function makeThumb(track: Track): HTMLElement {
  const thumb = document.createElement("div");
  thumb.className = "h-7 w-7 shrink-0 overflow-hidden rounded border border-border bg-bg";
  const cover = track.image?.[0]?.["#text"];
  if (cover) {
    const img = document.createElement("img");
    img.src = cover;
    img.alt = "";
    img.loading = "lazy";
    img.className = "h-full w-full object-cover";
    img.setAttribute("draggable", "false");
    thumb.appendChild(img);
  }
  return thumb;
}

function makeRow(track: Track, index: number): HTMLElement {
  const nowPlaying = track["@attr"]?.nowplaying === "true";

  const row = document.createElement("div");
  row.className = `flex items-center gap-3 border-t border-border px-3 py-1.5 ${
    nowPlaying ? "bg-accent/10" : index % 2 === 1 ? "bg-bg/30" : ""
  }`;

  const indicator = document.createElement("div");
  indicator.className = `w-6 shrink-0 text-center font-mono text-xs ${
    nowPlaying ? "text-accent" : "text-muted"
  }`;
  if (nowPlaying) {
    indicator.textContent = "▶";
    indicator.setAttribute("aria-label", "играет сейчас");
  } else {
    indicator.textContent = String(index + 1);
  }
  row.appendChild(indicator);

  row.appendChild(makeThumb(track));

  const main = document.createElement("div");
  main.className = "min-w-0 flex-1";

  const name = document.createElement("div");
  name.className = `truncate text-sm ${nowPlaying ? "font-medium text-accent" : "text-text"}`;
  name.textContent = track.name;
  main.appendChild(name);

  const artist = document.createElement("div");
  artist.className = "truncate text-xs text-muted";
  artist.textContent = track.artist["#text"];
  main.appendChild(artist);

  row.appendChild(main);

  return row;
}

const roots = document.querySelectorAll<HTMLElement>("[data-lastfm]");
roots.forEach((root) => {
  let lastKey = "";

  const setEmpty = () => {
    root.textContent = "";
    const p = document.createElement("p");
    p.className = "px-3 py-1 text-sm text-muted";
    p.textContent = "ничего не играет";
    root.replaceChildren(p);
  };

  const render = (tracks: Track[]) => {
    const key = JSON.stringify(tracks);
    if (key === lastKey) return;
    lastKey = key;

    const frag = document.createDocumentFragment();
    frag.appendChild(makeHeader(tracks.length));
    tracks.forEach((track, index) => frag.appendChild(makeRow(track, index)));
    root.replaceChildren(frag);
  };

  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=${LIMIT}`,
      );
      if (!response.ok) {
        setEmpty();
        return;
      }
      const data = await response.json();
      const tracks: Track[] | undefined = data.recenttracks?.track;
      if (tracks && tracks.length > 0) {
        render(tracks);
      } else {
        setEmpty();
      }
    } catch {
      setEmpty();
    }
  };

  fetchTracks();
  setInterval(fetchTracks, UPDATE_INTERVAL_MS);
});
export {};