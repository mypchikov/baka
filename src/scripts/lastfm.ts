interface Track {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { "#text": string }[];
  "@attr"?: { nowplaying: string };
}

const UPDATE_INTERVAL_MS = 30 * 1000;

const API_KEY = "fa3a2ea96a5d06805621316ece3f23f5";
const USERNAME = "murchikov";

const roots = document.querySelectorAll<HTMLElement>("[data-lastfm]");
roots.forEach((root) => {
  const setEmpty = () => {
    root.textContent = "";
    const p = document.createElement("p");
    p.className = "text-sm text-muted";
    p.textContent = "ничего не играет";
    root.replaceChildren(p);
  };

  const render = (track: Track) => {
    const nowPlaying = track["@attr"]?.nowplaying === "true";
    const cover = track.image?.[2]?.["#text"];

    const row = document.createElement("div");
    row.className = "flex items-center gap-3";

    if (cover) {
      const img = document.createElement("img");
      img.src = cover;
      img.alt = "";
      img.className = "h-14 w-14 shrink-0 rounded border border-border";
      row.appendChild(img);
    } else {
      const box = document.createElement("div");
      box.className = "h-14 w-14 shrink-0 rounded border border-border bg-bg";
      row.appendChild(box);
    }

    const info = document.createElement("div");
    info.className = "min-w-0";

    const name = document.createElement("p");
    name.className = "truncate text-sm font-medium";
    name.textContent = track.name;
    info.appendChild(name);

    const artist = document.createElement("p");
    artist.className = "truncate text-sm text-muted";
    artist.textContent = track.artist["#text"];
    info.appendChild(artist);

    if (nowPlaying) {
      const playing = document.createElement("p");
      playing.className = "font-mono text-xs text-accent";
      playing.textContent = "▶ играет сейчас";
      info.appendChild(playing);
    } else {
      const album = document.createElement("p");
      album.className = "truncate text-xs text-muted";
      album.textContent = track.album["#text"];
      info.appendChild(album);
    }

    row.appendChild(info);
    root.replaceChildren(row);
  };

  const fetchTrack = async () => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`,
      );
      if (!response.ok) {
        setEmpty();
        return;
      }
      const data = await response.json();
      const recentTrack: Track | undefined = data.recenttracks.track[0];
      if (recentTrack) {
        render(recentTrack);
      } else {
        setEmpty();
      }
    } catch {
      setEmpty();
    }
  };

  fetchTrack();
  setInterval(fetchTrack, UPDATE_INTERVAL_MS);
});
export {};
