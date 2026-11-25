/* ==========================================================================
   SHINOBI CHRONICLES — full-screen animated character preview
   --------------------------------------------------------------------------
   Clicking a portrait opens a centred, full-screen stage for that character:
   a summoning entrance, an idle chakra aura and per-nature jutsu effects.

   ARTWORK: the stage shows your own image for each character. Put a file in
   assets/characters/ named after the character id, e.g.
       assets/characters/naruto.webp   assets/characters/gaara.png
   (or set `image: "path/to/file.webp"` on the character in data.js).
   Transparent PNG / WebP cut-outs look best. Weapons use assets/weapons/.

   VIDEO: put a clip in assets/videos/<id>/<id>.mp4, or set `video: "..."` on
   the character. A video takes priority over the image and plays once
   (with sound unless the viewer turned it off), then fades into the image.

   SKILL VIDEOS: each jutsu can have its own clip. Either add a 4th entry to
   the jutsu in data.js, e.g. ["Dimension Shift", "Space-Time", "Kekkei Mōra",
   "assets/videos/kaguya/kaguya-dimension.mp4"], or name the file after any
   word of the jutsu name in the character's folder:
   assets/videos/kaguya/kaguya-tsukuyomi.mp4, assets/videos/sasuke/susanoo.mp4.
   Clicking that jutsu plays its clip, then returns to the character image.

   Characters with neither get a neutral ink-silhouette placeholder.
   ========================================================================== */

(() => {
  "use strict";

  const INK = "#2B2118";
  const EXTS = ["webp", "png", "jpg", "jpeg", "gif"];
  const VIDEO_EXTS = ["mp4", "webm"];
  /* Media folders. `folder` arguments are logical names ("characters", "weapons"). */
  const ASSETS = "assets";
  const VIDEOS = `${ASSETS}/videos`;
  const dir = (folder) => `${ASSETS}/${folder}`;
  /* js/media-index.js (generated) lists every file in assets/. When present, only
     listed paths are requested, so missing candidates never hit the network. */
  const INDEX = Array.isArray(window.MEDIA_INDEX) ? new Set(window.MEDIA_INDEX) : null;
  const isLocal = (p) => !/^(https?:|data:|blob:|\/\/)/i.test(p);
  const known = (p) => !INDEX || !isLocal(p) || INDEX.has(p);
  const NATURE_FX = {
    Weapon: "slash", Fire: "fire", Wind: "wind", Water: "water", Lightning: "lightning", Earth: "earth",
    "Yin-Yang": "yinyang", Sage: "sage", "Space-Time": "spacetime", All: "burst"
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const auraHex = (c) => c.auraColor || (WORLD.auraColors && WORLD.auraColors[c.aura]) || "#6B5B45";

  /* ------------------------------------------------------- media discovery */
  const mediaCache = new Map();
  function probeImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ type: "image", src, ratio: img.naturalWidth / img.naturalHeight || .75 });
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  function probeVideo(src) {
    return new Promise((resolve) => {
      const v = document.createElement("video");
      const done = (r) => { clearTimeout(t); v.removeAttribute("src"); v.load(); resolve(r); };
      // an indexed clip is known to exist, so give slow connections longer
      const t = setTimeout(() => done(null), INDEX && INDEX.has(src) ? 20000 : 5000);
      v.preload = "metadata";
      v.muted = true;
      v.onloadedmetadata = () => done({ type: "video", src, ratio: v.videoWidth / v.videoHeight || .75 });
      v.onerror = () => done(null);
      v.src = src;
    });
  }
  async function firstHit(list, probe) {
    for (const src of list) { if (!known(src)) continue; const r = await probe(src); if (r) return r; }
    return null;
  }
  /* Still image only (no video probing) — used for portraits on the tree,
     relationship chips and search results. */
  const imageCache = new Map();
  function findImage(c, folder = "characters") {
    const key = folder + ":" + c.id;
    if (!imageCache.has(key)) {
      imageCache.set(key, firstHit([c.image, ...EXTS.map((e) => `${dir(folder)}/${c.id}.${e}`)].filter(Boolean), probeImage)
        .then((hit) => hit && hit.src));
    }
    return imageCache.get(key);
  }

  /* Jutsu plus the character's special weapons, as one list of
     [name, nature, type, clip?] entries. Weapons use the "Weapon" nature. */
  function skillsOf(c) {
    if (c.isWeapon) return c.jutsu || [];
    const names = new Set((c.jutsu || []).map((j) => j[0].toLowerCase()));
    const arms = (WORLD.weapons || []).filter((w) => w.owners.includes(c.id) && !names.has(w.name.toLowerCase()))
      .map((w) => [w.name, "Weapon", w.type, w.clip]);
    return [...(c.jutsu || []), ...arms];
  }

  async function findMedia(c) {
    const folder = c.folder || "characters";
    const key = folder + ":" + c.id;
    if (mediaCache.has(key)) return mediaCache.get(key);
    /* Bijuu intro clips live in assets/videos/bijuu/<tails>.mp4 (1-10).
       An explicit `video` field on the beast always wins. */
    const videoPaths = [
      c.video,
      ...VIDEO_EXTS.flatMap((e) => [`${VIDEOS}/${c.id}/${c.id}.${e}`, `${VIDEOS}/${c.id}.${e}`]),
      ...(c.isBijuu ? VIDEO_EXTS.flatMap((e) => [
        `${VIDEOS}/bijuu/${c.tails}.${e}`,
        `${VIDEOS}/bijuu/${c.id}.${e}`
      ]) : [])
    ].filter(Boolean);
    const [video, image] = await Promise.all([
      firstHit([...new Set(videoPaths)], probeVideo),
      findImage(c, folder).then((src) => src ? probeImage(src) : null)
    ]);
    const media = video ? { ...video, poster: image && image.src, posterRatio: image && image.ratio } : image;
    mediaCache.set(key, media);
    return media;
  }

  const skillCache = new Map();
  async function findSkillVideo(c, i) {
    const key = c.id + ":" + i;
    if (skillCache.has(key)) return skillCache.get(key);
    const j = skillsOf(c)[i];
    const words = j[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
    const slugs = [words.join("-"), ...words.filter((w) => w.length >= 4)];
    const list = [j[3], ...slugs.flatMap((w) => VIDEO_EXTS.flatMap((e) => [
      `${VIDEOS}/${c.id}/${c.id}-${w}.${e}`, `${VIDEOS}/${c.id}/${w}.${e}`, `${VIDEOS}/${c.id}-${w}.${e}`]))].filter(Boolean);
    const hit = await firstHit([...new Set(list)], probeVideo);
    skillCache.set(key, hit && hit.src);
    return hit && hit.src;
  }

  /* ------------------------------------------------------- placeholder figure
     A neutral, featureless ink silhouette (no character likeness). */
  function silhouetteSVG(col) {
    const arm = (side) => {
      const sx = side === "l" ? 110 : 150, hx = side === "l" ? 102 : 158;
      return `<g class="pv-arm pv-arm-${side}" style="transform-origin:${sx}px 110px">
        <path d="M${sx - 6},106 L${sx + 6},108 L${hx + 5},140 L${hx - 6},140 Z" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="${hx}" cy="143" r="6" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.2"/></g>`;
    };
    return `<g class="pv-body">
        <path class="pv-tie" d="M146,64 C160,62 170,70 182,64 C174,74 162,74 148,72 Z" fill="url(#pv-ink)" stroke="${col}" stroke-width="1"/>
        <rect x="114" y="148" width="13" height="30" rx="4" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.2"/>
        <rect x="133" y="148" width="13" height="30" rx="4" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.2"/>
        <path d="M108,106 L152,106 L158,154 L102,154 Z" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.4"/>
        ${arm("l")}${arm("r")}
      </g>
      <rect x="123" y="96" width="14" height="12" fill="url(#pv-ink)"/>
      <circle cx="130" cy="74" r="30" fill="url(#pv-ink)" stroke="${col}" stroke-width="1.6"/>
      <text x="130" y="84" text-anchor="middle" font-size="26" fill="${col}" opacity=".55" font-family="Yuji Syuku, serif">忍</text>`;
  }

  function bijuuSealSVG(c, col) {
    const n = c.tails || 0;
    const marks = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = 130 + Math.cos(a) * 58, y = 112 + Math.sin(a) * 58;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${col}" stroke="${INK}" stroke-width="1.2"/>`;
    }).join("");
    return `<g class="pv-bijuu-seal" style="transform-origin:130px 112px">
        <circle cx="130" cy="112" r="70" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="4 4"/>
        <circle cx="130" cy="112" r="46" fill="url(#pv-ink)" stroke="${col}" stroke-width="3"/>
        ${marks}
      </g>
      <text x="130" y="122" text-anchor="middle" font-size="34" fill="${col}" font-family="Yuji Syuku, serif">${n}</text>
      <text x="130" y="142" text-anchor="middle" font-size="13" fill="${col}" opacity=".8" font-family="Yuji Syuku, serif">尾</text>`;
  }

  function weaponSealSVG(c, col) {
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const x1 = 130 + Math.cos(a) * 62, y1 = 112 + Math.sin(a) * 62;
      const x2 = 130 + Math.cos(a) * 70, y2 = 112 + Math.sin(a) * 70;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="2"/>`;
    }).join("");
    return `<g class="pv-bijuu-seal" style="transform-origin:130px 112px">
        <circle cx="130" cy="112" r="74" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="4 4"/>
        ${ticks}
      </g>
      <circle cx="130" cy="112" r="48" fill="url(#pv-ink)" stroke="${col}" stroke-width="3"/>
      <text x="130" y="128" text-anchor="middle" font-size="46" fill="#F4F1EA" font-family="Yuji Syuku, serif">${esc(c.glyph || "武")}</text>`;
  }

  /* ------------------------------------------------------------ aura layer */
  function auraSVG(c) {
    if (c.aura === "none") {
      return `<g class="pv-dust">${[0, 1, 2, 3, 4].map((i) =>
        `<circle cx="${100 + i * 15}" cy="176" r="${3 + (i % 2)}" style="animation-delay:${i * .45}s"/>`).join("")}</g>`;
    }
    const col = auraHex(c);
    const flames = [[92, 150, 0], [168, 150, .5], [100, 110, 1.1], [160, 110, .8], [130, 70, 1.5], [82, 176, .3], [178, 176, 1.3], [116, 86, .9], [146, 90, .2]]
      .map(([x, y, d]) => `<path class="pv-flame" d="M${x},${y} c-9,-8 -6,-22 0,-32 c6,10 9,24 0,32 z" fill="${col}" style="animation-delay:${d}s"/>`).join("");
    const sparks = Array.from({ length: 14 }, (_, i) =>
      `<circle class="pv-spark" cx="${84 + (i * 37) % 94}" cy="${176 - (i * 23) % 80}" r="1.6" fill="${col}" style="animation-delay:${(i * .29).toFixed(2)}s"/>`).join("");
    return `<g class="pv-aura" filter="url(#pv-blur)">
        <ellipse cx="130" cy="112" rx="64" ry="86" fill="${col}" opacity=".18" class="pv-aura-glow"/>${flames}</g>${sparks}`;
  }

  /* ---------------------------------------------------------- jutsu effects */
  function fxMarkup(kind, col) {
    switch (kind) {
      case "bijuudama": {
        const motes = Array.from({ length: 14 }, (_, i) => {
          const ang = (i / 14) * Math.PI * 2;
          const dx = Math.cos(ang) * 95, dy = Math.sin(ang) * 70;
          return `<circle class="fx-bd-mote" cx="130" cy="70" r="${2 + (i % 3)}" fill="${i % 2 ? col : "#3A2A4A"}"
            style="--sx:${dx.toFixed(1)}px;--sy:${dy.toFixed(1)}px;animation-delay:${(i * .025).toFixed(3)}s"/>`;
        }).join("");
        return `${motes}
          <circle class="fx-bd-core" cx="130" cy="70" r="15" fill="#140E1C" stroke="${col}" stroke-width="3"/>
          <circle class="fx-bd-glow" cx="130" cy="70" r="24" fill="none" stroke="${col}" stroke-width="2" opacity=".6"/>
          <rect class="fx-bd-flash" x="-200" y="-20" width="660" height="240" fill="#FFF6E0"/>
          ${[0, 1, 2].map((i) => `<circle class="fx-bd-ring" cx="130" cy="110" r="20" fill="none" stroke="${i === 1 ? "#FFF6E0" : col}" stroke-width="${5 - i}" style="animation-delay:${(1.15 + i * .12).toFixed(2)}s"/>`).join("")}`;
      }
      case "slash":
        return [[-1, 0], [1, .12], [-1, .24]].map(([dir, d]) =>
          `<path class="fx-slash" d="M${130 - 70 * dir},${60} Q130,${118} ${130 + 70 * dir},${176}" fill="none" stroke="#F4F1EA" stroke-width="5" stroke-linecap="round" style="animation-delay:${d}s"/>
           <path class="fx-slash" d="M${130 - 70 * dir},${60} Q130,${118} ${130 + 70 * dir},${176}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" style="animation-delay:${d}s"/>`).join("") +
          `<circle class="fx-ring" cx="130" cy="118" r="18" fill="none" stroke="#F4F1EA" stroke-width="2" style="animation-delay:.3s"/>`;
      case "fire":
        return `<circle class="fx-fireball" cx="168" cy="112" r="14" fill="url(#pv-fire)"/>
          ${[0, 1, 2, 3, 4].map((i) => `<circle class="fx-ember" cx="166" cy="112" r="3" fill="#F59A2E" style="--dx:${60 + i * 12}px;--dy:${-30 + i * 14}px;animation-delay:${i * .08}s"/>`).join("")}`;
      case "wind":
        return [0, 1, 2].map((i) => `<ellipse class="fx-wind" cx="130" cy="118" rx="${52 + i * 14}" ry="${18 + i * 6}" fill="none" stroke="#5E9A93" stroke-width="${3 - i * .6}" stroke-dasharray="40 26" style="animation-delay:${i * .12}s"/>`).join("");
      case "water":
        return `<path class="fx-wave" d="M60,186 C70,140 92,128 104,150 C96,160 90,172 96,186 Z" fill="#4A78A8" opacity=".85"/>
          <path class="fx-wave" d="M200,186 C190,140 168,128 156,150 C164,160 170,172 164,186 Z" fill="#4A78A8" opacity=".85"/>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="fx-drop" cx="${84 + i * 18}" cy="150" r="3" fill="#7FB3DE" style="animation-delay:${i * .07}s"/>`).join("")}`;
      case "lightning":
        return [0, 1, 2, 3].map((i) => `<polyline class="fx-bolt" points="${[[0, 0], [10, -8], [4, 2], [18, -4], [10, 8], [26, 4]].map(([x, y]) => `${130 + (i % 2 ? -x : x) * (1 + i * .3)},${140 + y * (i % 2 ? -1 : 1) - i * 6}`).join(" ")}" fill="none" stroke="#FFF2B0" stroke-width="2.6" stroke-linejoin="round" style="animation-delay:${i * .07}s"/>`).join("") +
          `<circle class="fx-flash" cx="130" cy="140" r="14" fill="#C7DDF5"/>`;
      case "earth":
        return [[70, 22], [96, 30], [164, 28], [190, 18]].map(([x, h], i) =>
          `<path class="fx-rock" d="M${x - 12},186 L${x - 8},${186 - h} L${x + 4},${182 - h - 6} L${x + 12},186 Z" fill="#8A6A46" stroke="${INK}" stroke-width="1.6" style="animation-delay:${i * .08}s"/>`).join("");
      case "yinyang":
        return `<g class="fx-yy" style="transform-origin:130px 112px">
            <circle cx="130" cy="112" r="34" fill="none" stroke="${INK}" stroke-width="2"/>
            <path d="M130,78 a34,34 0 0,1 0,68 a17,17 0 0,1 0,-34 a17,17 0 0,0 0,-34 z" fill="${INK}" opacity=".6"/>
            <circle cx="130" cy="95" r="4" fill="${INK}"/><circle cx="130" cy="129" r="4" fill="#F4EBD0"/></g>`;
      case "sage":
        return `<g class="fx-orbit" style="transform-origin:130px 115px">${[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return `<circle cx="${(130 + Math.cos(a) * 62).toFixed(1)}" cy="${(115 + Math.sin(a) * 62).toFixed(1)}" r="7" fill="${INK}" stroke="#C9922B" stroke-width="1.6"/>`;
        }).join("")}</g><circle class="fx-ring" cx="130" cy="120" r="40" fill="none" stroke="#6B8E4E" stroke-width="3"/>`;
      case "spacetime":
        return `<g class="fx-vortex" style="transform-origin:130px 112px">
          <path d="M130,112 m0,-4 a4,4 0 1,1 -4,4 a10,10 0 0,1 10,-10 a16,16 0 0,1 16,16 a24,24 0 0,1 -24,24 a32,32 0 0,1 -32,-32 a40,40 0 0,1 40,-40" fill="none" stroke="#9B4C6E" stroke-width="3" stroke-linecap="round"/></g>`;
      default:
        return [0, 1, 2].map((i) => `<circle class="fx-ring" cx="130" cy="118" r="22" fill="none" stroke="${col}" stroke-width="${4 - i}" style="animation-delay:${i * .14}s"/>`).join("");
    }
  }

  /* ---------------------------------------------------------------- stage */
  function stageMarkup(c, media) {
    const col = auraHex(c);
    const img = !!media;
    const box = media ? ` style="aspect-ratio:${media.ratio.toFixed(4)}"` : "";
    let figure = "";
    if (media && media.type === "video") {
      // video plays once, then crossfades into the still image (see playIntro)
      figure = `<div class="pv-figure-wrap pv-photo pv-has-video"${box}
          data-video-ratio="${media.ratio.toFixed(4)}" data-image-ratio="${(media.posterRatio || media.ratio).toFixed(4)}">
        <video class="pv-img pv-video" src="${esc(media.src)}" muted playsinline preload="auto" aria-label="${esc(c.name)}"></video>
        ${media.poster ? `<img class="pv-img pv-still" src="${esc(media.poster)}" alt="${esc(c.name)}" draggable="false">` : ""}</div>`;
    } else if (media) {
      figure = `<div class="pv-figure-wrap pv-photo"${box}><img class="pv-img" src="${esc(media.src)}" alt="${esc(c.name)}" draggable="false"></div>`;
    }
    return `
      <div class="pv-stage summoned ${img ? "has-photo" : "no-photo"}" data-pv="${esc(c.id)}" style="--pv-aura:${col}">
        <div class="pv-scene">
          <svg class="pv-layer" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <filter id="pv-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
              <radialGradient id="pv-bg" cx="50%" cy="58%" r="60%">
                <stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="pv-ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2C1E"/><stop offset="1" stop-color="#1A140E"/></linearGradient>
              <radialGradient id="pv-fire"><stop offset="0" stop-color="#FFF2B0"/><stop offset=".45" stop-color="#F59A2E"/><stop offset="1" stop-color="#C0362A" stop-opacity="0"/></radialGradient>
            </defs>
            <rect x="-200" width="660" height="200" fill="url(#pv-bg)"/>
            <g class="pv-seal" style="transform-origin:130px 182px">
              <ellipse cx="130" cy="182" rx="84" ry="15" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="5 4"/>
              <ellipse cx="130" cy="182" rx="66" ry="11" fill="none" stroke="${col}" stroke-opacity=".75" stroke-width="1.4"/>
            </g>
            <ellipse class="pv-shadow" cx="130" cy="183" rx="40" ry="6" fill="${INK}" opacity=".25"/>
            ${auraSVG(c)}
            ${img ? "" : `<g class="pv-figure-wrap"><g class="pv-figure">${c.isWeapon ? weaponSealSVG(c, col) : c.isBijuu ? bijuuSealSVG(c, col) : silhouetteSVG(col)}</g></g>`}
          </svg>
          ${figure}
          <svg class="pv-layer pv-front" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="pv-fx"></g>
            <g class="pv-smoke">${[[-34, -6], [34, -10], [-22, 26], [24, 28], [0, -40], [0, 8], [-46, 22], [46, 20], [-12, -60], [14, -58]].map(([dx, dy], i) =>
              `<circle cx="${130 + dx}" cy="${120 + dy}" r="${20 + (i % 3) * 5}" style="animation-delay:${(i * .03).toFixed(2)}s"/>`).join("")}</g>
          </svg>
        </div>
        <div class="pv-banner" aria-live="polite"></div>
        ${img ? "" : `<div class="pv-hint">Add your own artwork: <code>${esc(dir(c.folder || "characters"))}/${esc(c.id)}.webp</code> or <code>${VIDEOS}/${esc(c.id)}/${esc(c.id)}.mp4</code></div>`}
      </div>`;
  }

  function infoMarkup(c) {
    const eras = c.era.map((e) => (WORLD.eras.find((x) => x.id === e) || { label: e }).label);
    const jutsu = skillsOf(c).map((j, i) => {
      const color = WORLD.natures[j[1]] || "#6B5B45";
      return `<button class="pv-jutsu${j[1] === "Weapon" ? " is-weapon" : ""}" data-jutsu="${i}" title="${esc(j[2])}">
        <span class="pv-nature" style="background:${color}">${esc(j[1])}</span>${esc(j[0])}</button>`;
    }).join("");
    return `
      <div class="pv-info">
        <div class="pv-names">
          <div class="drawer-kicker">${esc([c.clan, ...eras].filter(Boolean).join(" · "))}</div>
          <h2 class="pv-name">${esc(c.name)} <span class="pv-jp">${esc(c.jp)}</span></h2>
          <span class="drawer-title">${esc(c.title)}</span>
        </div>
        <div class="pv-jutsu-list" aria-label="Perform a jutsu">${jutsu}</div>
        <div class="pv-actions">
          ${skillsOf(c).length ? `<button class="pv-btn accent" data-pv-cast>▶ ${c.isWeapon ? "Strike" : c.isBijuu ? "Unleash Ability" : "Perform Jutsu"}</button>` : ""}
          <button class="pv-btn" data-pv-summon>↻ Summon</button>
          <button class="pv-btn" data-pv-sound hidden>🔊 Sound on</button>
          <button class="pv-btn" data-pv-chronicle>📜 Read Chronicle</button>
        </div>
      </div>`;
  }

  /* --------------------------------------------------------------- casting */
  const timers = new WeakMap();

  function cast(stage, c, index) {
    const skills = skillsOf(c);
    if (!stage || !skills.length) return;
    const n = skills.length;
    const i = (((index ?? Number(stage.dataset.next || 0)) % n) + n) % n;
    const [name, nature, type] = skills[i];
    stage.dataset.next = String(i + 1);
    const kind = /tailed beast ball|bijuu bomb|bijuu dama|tailed beast bomb/i.test(name) ? "bijuudama" : (NATURE_FX[nature] || "burst");
    const col = (WORLD.natures && WORLD.natures[nature]) || auraHex(c);

    const fx = stage.querySelector(".pv-fx");
    const banner = stage.querySelector(".pv-banner");
    const castId = (stage._castId = (stage._castId || 0) + 1);
    stage.classList.remove("casting", "shake", "big-shake", "summoned", ...[...stage.classList].filter((k) => k.startsWith("pv-k-")));
    fx.innerHTML = "";
    void stage.offsetWidth;                         // restart CSS animations
    fx.innerHTML = fxMarkup(kind, col);
    stage.classList.add("casting", `pv-k-${kind}`);
    if (kind === "earth" || kind === "lightning" || kind === "burst") stage.classList.add("shake");
    if (kind === "bijuudama") setTimeout(() => stage._castId === castId && stage.classList.add("shake", "big-shake"), 1100);
    banner.innerHTML = `<span class="pv-nature" style="background:${col}">${esc(nature)}</span>${esc(name)}<small>${esc(type)}</small>`;
    banner.classList.add("show");
    document.querySelectorAll(".pv-jutsu, .jutsu-item").forEach((b) => b.classList.toggle("active", Number(b.dataset.jutsu) === i));

    const clearUi = () => {
      if (stage._castId !== castId) return;
      banner.classList.remove("show");
      document.querySelectorAll(".pv-jutsu.active, .jutsu-item.active").forEach((b) => b.classList.remove("active"));
    };
    let hasClip = false;
    clearTimeout(timers.get(stage));
    timers.set(stage, setTimeout(() => {
      stage.classList.remove("casting", "shake", "big-shake", `pv-k-${kind}`);
      fx.innerHTML = "";
      if (!hasClip) clearUi();                       // a skill clip keeps the banner until it ends
    }, kind === "bijuudama" ? 2700 : 1900));

    stopSkill(stage);
    findSkillVideo(c, i).then((src) => {
      if (!src || stage._castId !== castId || !stage.isConnected) return;
      hasClip = true;
      playSkill(stage, src, clearUi);
    });
  }

  /* ------------------------------------------------------ per-skill clips */
  /* Sound is ON by default for every clip. The viewer's choice is remembered. */
  let soundOn = true;
  try { if (localStorage.getItem("sc-sound") === "off") soundOn = false; } catch (e) { /* storage blocked */ }
  const soundLabel = () => (soundOn ? "🔊 Sound on" : "🔇 Sound off");

  /* Play a clip with sound when it's on. If the browser refuses audible
     autoplay (no user gesture yet, strict Safari policy), play it muted
     instead and unmute on the viewer's next tap or key press. */
  let unlockPending = false, unlockedAt = 0;
  function unlockSound() {
    unlockPending = false;
    unlockedAt = Date.now();
    if (!soundOn || !modal) return;
    modal.querySelectorAll("video").forEach((v) => { v.muted = false; });
    const snd = modal.querySelector("[data-pv-sound]");
    if (snd) snd.textContent = soundLabel();
  }
  function playClip(v, onFail) {
    v.muted = !soundOn;
    const p = v.play();
    if (!p || !p.catch) return;
    p.catch((err) => {
      if (err && err.name === "NotAllowedError" && !v.muted) {
        v.muted = true;
        v.play().catch(onFail);
        const snd = modal && modal.querySelector("[data-pv-sound]");
        if (snd) snd.textContent = "🔈 Tap for sound";
        if (!unlockPending) {
          unlockPending = true;
          ["pointerdown", "keydown"].forEach((t) => document.addEventListener(t, unlockSound, { once: true, capture: true }));
        }
      } else if (onFail) onFail();
    });
  }

  function photoBox(stage) {
    let box = stage.querySelector(".pv-photo");
    if (!box) {                                      // silhouette stage: add a box for the clip
      box = document.createElement("div");
      box.className = "pv-figure-wrap pv-photo pv-clip-only";
      stage.querySelector(".pv-scene").insertBefore(box, stage.querySelector(".pv-front"));
    }
    return box;
  }

  function stopSkill(stage) {
    const box = stage && stage.querySelector(".pv-photo");
    const v = box && box.querySelector(".pv-skill");
    if (!v || !box.classList.contains("show-skill")) return;
    v.onended = v.onerror = null;
    v.pause();
    box.classList.remove("show-skill");
    if (box.dataset.restRatio) box.style.aspectRatio = box.dataset.restRatio;
  }

  function playSkill(stage, src, done) {
    const box = photoBox(stage);
    const intro = box.querySelector(".pv-video");
    if (intro && !intro.paused) { intro.onended = null; intro.pause(); }
    if (!box.classList.contains("show-skill")) box.dataset.restRatio = box.style.aspectRatio || "";
    let v = box.querySelector(".pv-skill");
    if (!v) {
      v = document.createElement("video");
      v.className = "pv-img pv-skill";
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      box.appendChild(v);
    }
    const finish = () => {
      v.onended = v.onerror = null;
      box.classList.remove("show-skill");
      if (box.dataset.restRatio) box.style.aspectRatio = box.dataset.restRatio;
      if (box.querySelector(".pv-still")) box.classList.add("show-still");   // land on the character image
      done && done();
    };
    v.onloadedmetadata = () => { if (v.videoWidth) box.style.aspectRatio = String(v.videoWidth / v.videoHeight); };
    v.onended = finish;
    v.onerror = finish;
    v.src = src;
    box.classList.add("show-skill");
    playClip(v, finish);
  }

  function summon(stage) {
    if (!stage) return;
    stage.classList.remove("summoned");
    void stage.offsetWidth;
    stage.classList.add("summoned");
  }

  /* ------------------------------------------------- video → image hand-off */
  function playIntro(stage) {
    const box = stage && stage.querySelector(".pv-has-video");
    if (!box) return;
    const v = box.querySelector("video");
    const still = box.querySelector(".pv-still");
    box.classList.remove("show-still");
    box.style.aspectRatio = box.dataset.videoRatio;
    const finish = () => {
      if (!still) return;                         // no image: stay on the last frame
      box.style.aspectRatio = box.dataset.imageRatio;
      box.classList.add("show-still");
    };
    v.onended = finish;
    v.onerror = finish;
    v.currentTime = 0;
    playClip(v, finish);                          // playback refused entirely → show the image
  }

  /* ----------------------------------------------------------------- modal */
  let modal, body, current = null, token = 0, onChronicle = null, lastFocus = null;
  /* Optional browsing: a page can hand the preview a navigator
     { step(current, dir) -> next item | null, label(current) -> "3 / 98" }. */
  let navigator_ = null;
  function step(dir) {
    if (!navigator_ || !current) return;
    const next = navigator_.step(current, dir);
    if (next) open(next);
  }
  function updateNav() {
    const on = !!navigator_;
    modal.querySelectorAll(".pv-nav").forEach((b) => { b.hidden = !on; });
    const count = modal.querySelector(".pv-count");
    const label = on && navigator_.label ? navigator_.label(current) : "";
    count.hidden = !label; count.textContent = label;
  }

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "pv-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Character preview");
    modal.innerHTML = `<div class="pv-panel">
        <button class="drawer-close pv-close" aria-label="Close preview">×</button>
        <button class="pv-nav pv-prev" data-pv-nav="-1" aria-label="Previous" hidden>‹</button>
        <button class="pv-nav pv-next" data-pv-nav="1" aria-label="Next" hidden>›</button>
        <span class="pv-count" hidden></span>
        <div class="pv-body"></div></div>`;
    document.body.appendChild(modal);
    body = modal.querySelector(".pv-body");

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".pv-close")) return close();
      const nav = e.target.closest("[data-pv-nav]");
      if (nav) return step(Number(nav.dataset.pvNav));
      if (!current) return;
      const stage = body.querySelector(".pv-stage");
      if (e.target.closest("[data-pv-cast]")) return cast(stage, current);
      if (e.target.closest("[data-pv-summon]")) { stopSkill(stage); summon(stage); playIntro(stage); return; }
      const snd = e.target.closest("[data-pv-sound]");
      if (snd) {
        // a tap while sound was blocked just unlocks it; otherwise toggle
        // the press that unlocked blocked sound must not also toggle it back off
        if (Date.now() - unlockedAt < 1000) return;
        if (soundOn && snd.textContent.includes("Tap")) { unlockSound(); return; }
        soundOn = !soundOn;
        try { localStorage.setItem("sc-sound", soundOn ? "on" : "off"); } catch (err) { /* storage blocked */ }
        (stage ? stage.querySelectorAll("video") : []).forEach((v) => { v.muted = !soundOn; });
        snd.textContent = soundLabel();
        return;
      }
      if (e.target.closest("[data-pv-chronicle]")) { const c = current; close(); if (onChronicle) onChronicle(c); return; }
      const j = e.target.closest(".pv-jutsu");
      if (j) cast(stage, current, Number(j.dataset.jutsu));
    });
    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") { e.stopImmediatePropagation(); close(); return; }
      if (navigator_ && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault(); e.stopImmediatePropagation(); step(e.key === "ArrowLeft" ? -1 : 1);
      }
    }, true);
  }

  async function open(c, jutsuIndex) {
    ensureModal();
    const my = ++token;
    current = c;
    if (modal.hidden) lastFocus = document.activeElement;
    modal.style.setProperty("--pv-aura", auraHex(c));
    body.innerHTML = `<div class="pv-stage-wrap"><div class="pv-loading">召</div></div>${infoMarkup(c)}`;
    modal.hidden = false;
    document.documentElement.classList.add("pv-active");     // stop the page scrolling behind
    updateNav();
    requestAnimationFrame(() => modal.classList.add("open"));
    modal.querySelector(".pv-close").focus({ preventScroll: true });

    const media = await findMedia(c);
    if (my !== token) return;                       // another character opened meanwhile
    body.querySelector(".pv-stage-wrap").innerHTML = stageMarkup(c, media);
    const snd = body.querySelector("[data-pv-sound]");
    const clips = await Promise.all(skillsOf(c).map((_, i) => findSkillVideo(c, i)));
    const anyClip = (media && media.type === "video") || clips.some(Boolean);
    if (my !== token) return;
    if (snd) { snd.hidden = !anyClip; snd.textContent = soundLabel(); }
    body.querySelectorAll(".pv-jutsu").forEach((b) => {
      const i = Number(b.dataset.jutsu);
      if (skillCache.get(c.id + ":" + i)) b.classList.add("has-clip");
    });
    playIntro(body.querySelector(".pv-stage"));
    if (jutsuIndex != null) setTimeout(() => my === token && cast(body.querySelector(".pv-stage"), c, jutsuIndex), 650);
  }

  function close() {
    if (!modal || modal.hidden) return;
    token++;
    current = null;
    modal.classList.remove("open");
    document.documentElement.classList.remove("pv-active");
    body.querySelectorAll("video").forEach((v) => v.pause());
    setTimeout(() => { if (!modal.classList.contains("open")) { modal.hidden = true; body.innerHTML = ""; } }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  window.CharacterPreview = {
    open, close, cast, summon, findMedia, findImage,
    isOpen: () => !!modal && !modal.hidden,
    setNavigator: (nav) => { navigator_ = nav || null; if (modal && !modal.hidden) updateNav(); },
    hasFile: (path) => (INDEX ? INDEX.has(path) : null),   // null = unknown (no index)
    mediaIndex: INDEX,
    onChronicle: (fn) => { onChronicle = fn; }
  };
})();
