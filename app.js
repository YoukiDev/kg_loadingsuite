// =========================================================
// KG LoadingSuite - app.js
// Fix GitHub Pages paths + slideshow + GMod hooks + centered avatar
// =========================================================

// Base URL dynamique (marche sur GitHub Pages + local + asset://)
const BASE_URL = new URL("./", window.location.href).href;

// Mets autant d'images que tu veux ici (dans /assets/)
const BACKGROUNDS = [
  BASE_URL + "assets/bg1.jpg",
  BASE_URL + "assets/bg2.jpg",
  BASE_URL + "assets/bg3.jpg",
  BASE_URL + "assets/bg4.jpg",
  BASE_URL + "assets/bg5.jpg",
];

// ---------------------------------------------------------
// AVATAR
// IMPORTANT: Pour un avatar Steam "réel", il faut un endpoint API
// (Steam bloque l'accès direct depuis une page statique à cause du CORS).
//
// - "local": affiche le "?" (fallback) mais bien centré
// - "api"  : récupère l'avatar via ton endpoint: https://tonsite.com/avatar?steamid=...
// ---------------------------------------------------------
const AVATAR_MODE = "local"; // <-- mets "api" quand tu auras l'endpoint
const AVATAR_API = "https://tonsite.com/steam_avatar.php?steamid="; // à changer si mode "api"

const el = (id) => document.getElementById(id);

// ---------- Background slideshow ----------
let bgIndex = 0;
let useA = true;

function preloadImages(list) {
  list.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function setBg(url) {
  const A = el("bgA");
  const B = el("bgB");
  if (!A || !B) return;

  const show = useA ? A : B;
  const hide = useA ? B : A;

  show.style.backgroundImage = `url("${url}")`;
  show.style.opacity = "1";
  hide.style.opacity = "0";

  useA = !useA;
}

function startSlideshow() {
  if (!BACKGROUNDS.length) return;

  preloadImages(BACKGROUNDS);
  setBg(BACKGROUNDS[0]);

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
function showFallbackAvatar() {
  const img = el("avatar");
  const fallback = el("avatarFallback");
  if (img) img.style.display = "none";
  if (fallback) fallback.style.display = "flex";
}

function showImageAvatar(url) {
  const img = el("avatar");
  const fallback = el("avatarFallback");
  if (!img || !fallback) return;

  img.onload = () => {
    fallback.style.display = "none";
    img.style.display = "block";
  };

  img.onerror = () => {
    showFallbackAvatar();
  };

  img.src = url;
}

function setAvatarFromSteamId(steamid) {
  // Toujours centré grâce au CSS. Ici on gère juste l'image.
  if (!steamid) return;

  if (AVATAR_MODE !== "api") {
    showFallbackAvatar();
    return;
  }

  const url = AVATAR_API + encodeURIComponent(steamid);
  showImageAvatar(url);
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

  // top-left style (comme ton screen)
  if (topServer) topServer.textContent = "Server";
  if (topSubtitle) topSubtitle.textContent = `you are now playing ${servername || ""}`;

  // avatar (au centre visuellement via CSS)
  setAvatarFromSteamId(steamid);
};

window.SetStatusChanged = function (status) {
  const s = el("status");
  if (s) s.textContent = status || "Chargement...";
};

window.DownloadProgress = function (percent) {
  setProgress(percent || 0);
};

// Joueurs actuels non fournis par défaut => —
const players = el("players");
if (players) players.textContent = "—";

// ---------- Init ----------
startSlideshow();
setProgress(0);
showFallbackAvatar();
