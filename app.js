// =========================================================
// KG LoadingSuite - app.js (VERSION STABLE GITHUB PAGES)
// =========================================================

// ⚠️ METS TON URL EXACTE ICI
const SITE_URL = "https://youkidev.github.io/kg_loadingsuite/";

// BACKGROUNDS (CHEMIN ABSOLU = PLUS JAMAIS D'ÉCRAN NOIR)
const BACKGROUNDS = [
  SITE_URL + "assets/bg1.jpg",
  SITE_URL + "assets/bg2.jpg",
  SITE_URL + "assets/bg3.jpg",
  SITE_URL + "assets/bg4.jpg",
  SITE_URL + "assets/bg5.jpg",
];

// AVATAR
const AVATAR_MODE = "local"; // "api" plus tard
const AVATAR_API = "https://tonsite.com/avatar.php?steamid=";

const el = (id) => document.getElementById(id);

// ---------------- BACKGROUND ----------------
let bgIndex = 0;
let useA = true;

function preload() {
  BACKGROUNDS.forEach(src => {
    const i = new Image();
    i.src = src;
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
  preload();
  setBg(BACKGROUNDS[0]);

  setInterval(() => {
    bgIndex = (bgIndex + 1) % BACKGROUNDS.length;
    setBg(BACKGROUNDS[bgIndex]);
  }, 7000);
}

// ---------------- PROGRESS ----------------
function setProgress(p) {
  p = Math.max(0, Math.min(100, p));
  el("bar").style.width = p + "%";
  el("percent").textContent = Math.floor(p) + "%";
}

// ---------------- AVATAR ----------------
function setAvatar() {
  el("avatar").style.display = "none";
  el("avatarFallback").style.display = "flex";
}

// ---------------- GMOD HOOKS ----------------
window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  el("map").textContent = mapname || "—";
  el("gm").textContent = gamemode || "—";
  el("maxplayers").textContent = maxplayers || "—";
  el("topServer").textContent = "Server";
  el("topSubtitle").textContent = "you are now playing " + (servername || "");
  setAvatar();
};

window.SetStatusChanged = function(status) {
  el("status").textContent = status || "Chargement...";
};

window.DownloadProgress = function(percent) {
  setProgress(percent || 0);
};

// ---------------- INIT ----------------
startSlideshow();
setProgress(0);
