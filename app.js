// =========================================================
// KG LoadingSuite - app.js
// Background slideshow + GMod hooks + center avatar
// =========================================================

// Mets autant d'images que tu veux ici (dans assets/)
const BACKGROUNDS = [
  "assets/bg1.jpg",
  "assets/bg2.jpg",
  "assets/bg3.jpg",
  "assets/bg4.jpg",
  "assets/bg5.jpg",
];

// AVATAR:
// En local, on ne peut pas récupérer facilement l'avatar Steam (CORS/API).
// Donc: placeholder (?), mais le système est prêt si tu veux une version API.
const AVATAR_MODE = "local"; // "local" ou "api"
const AVATAR_API  = "https://tonsite.com/steam_avatar.php?steamid=";

const el = (id) => document.getElementById(id);

// ---------- Background slideshow ----------
let bgIndex = 0;
let useA = true;

function setBg(url) {
  const A = el("bgA");
  const B = el("bgB");

  const show = useA ? A : B;
  const hide = useA ? B : A;

  // Set image on the layer that will appear
  show.style.backgroundImage = `url("${url}")`;

  // Crossfade
  show.style.opacity = "1";
  hide.style.opacity = "0";

  useA = !useA;
}

function startSlideshow() {
  if (!BACKGROUNDS.length) return;

  // Preload (évite un flash noir au premier switch)
  BACKGROUNDS.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Start with first bg
  setBg(BACKGROUNDS[0]);

  // Change every 7s
  setInterval(() => {
    bgIndex = (bgIndex + 1) % BACKGROUNDS.length;
    setBg(BACKGROUNDS[bgIndex]);
  }, 7000);
}

// ---------- Progress ----------
function setProgress(p) {
  p = Math.max(0, Math.min(100, p));
  const bar = el("bar");
  const percent = el("percent");

  if (bar) bar.style.width = `${p}%`;
  if (percent) percent.textContent = `${Math.floor(p)}%`;
}

// ---------- Avatar ----------
function setAvatarFromSteamId(steamid) {
  const img = el("avatar");
  const fallback = el("avatarFallback");

  if (!img || !fallback) return;

  // Mode local: affiche "?"
  if (AVATAR_MODE !== "api") {
    img.style.display = "none";
    fallback.style.display = "flex";
    return;
  }

  // Mode API: récupère l'image via endpoint
  const url = AVATAR_API + encodeURIComponent(steamid);

  img.onload = () => {
    fallback.style.display = "none";
    img.style.display = "block";
  };

  img.onerror = () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  };

  img.src = url;
}

// ---------- GMod hooks ----------
window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  const map = el("map");
  const gm = el("gm");
  const maxp = el("maxplayers");
  const topServer = el("topServer");
  const topSubtitle = el("topSubtitle");

  if (map) map.textContent = mapname || "—";
  if (gm) gm.textContent = gamemode || "—";
  if (maxp) maxp.textContent = maxplayers || "—";

  // top-left infos (comme sur ton screen)
  if (topServer) topServer.textContent = "Server";
  if (topSubtitle) topSubtitle.textContent = `you are now playing ${servername || ""}`;

  // avatar center
  if (steamid) setAvatarFromSteamId(steamid);
};

window.SetStatusChanged = function (status) {
  const s = el("status");
  if (s) s.textContent = status || "Chargement...";
};

window.DownloadProgress = function (percent) {
  setProgress(percent || 0);
};

// Les joueurs actuels ne sont pas fournis par défaut dans les hooks GMod,
// donc on laisse "—"
const players = el("players");
if (players) players.textContent = "—";

// ---------- Init ----------
startSlideshow();
setProgress(0);
