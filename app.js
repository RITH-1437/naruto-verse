/* ==========================================================================
   SHINOBI CHRONICLES — application logic
   Pure static SVG renderer with pan / zoom, filters, graph links and drawers.
   ========================================================================== */

(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const byId = (id) => WORLD.characters.find((c) => c.id === id);
  const bijuuById = (id) => WORLD.bijuu.find((b) => b.id === id);
  const WEAPONS = WORLD.weapons || [];
  const weaponById = (id) => WEAPONS.find((w) => w.id === id);
  const weaponsOf = (cid) => WEAPONS.filter((w) => w.owners.includes(cid));
  // placeholder badge until a picture is added in weapons/<id>.*
  const WEAPON_GLYPH = { Sword: "刀", "Short Sword": "刀", Swords: "刀", "Spirit Sword": "剣", "Spirit Shield": "鏡",
    Scythe: "鎌", "War Fan": "扇", Staff: "棒", Kunai: "苦", "Chakra Orbs": "玉", "Ninja Tool": "具", "Trench Knives": "刃" };
  const R = 26;          // standard portrait radius
  const RC = 17;         // compact host radius
  const RB = 24;         // bijuu orb radius

  const $ = (id) => document.getElementById(id);
  const els = {
    svg: $("graph"), viewport: $("viewport"),
    parent: $("layer-parent"), spouse: $("layer-spouse"),
    reinc: $("layer-reinc"), sensei: $("layer-sensei"), team: $("layer-team"),
    bijuuLinks: $("layer-bijuu-links"), bijuuLayer: $("layer-bijuu"),
    nodes: $("layer-nodes"),
    search: $("search"), searchResults: $("search-results"), searchClear: $("search-clear"),
    eraFilters: $("era-filters"), clanFilter: $("clan-filter"),
    reincToggle: $("toggle-reinc"), bijuuToggle: $("toggle-bijuu"), senseiToggle: $("toggle-sensei"),
    btnBijuu: $("btn-bijuu"), btnReset: $("btn-reset"), btnWeapons: $("btn-weapons"),
    weaponDrawer: $("weapon-drawer"), weaponList: $("weapon-list"),
    weaponDetail: $("weapon-detail"), weaponClose: $("weapon-close"),
    drawer: $("drawer"), drawerBody: $("drawer-body"), drawerClose: $("drawer-close"),
    bijuuDrawer: $("bijuu-drawer"), bijuuList: $("bijuu-list"),
    bijuuDetail: $("bijuu-detail"), bijuuClose: $("bijuu-close"),
    scrim: $("scrim"), hint: $("canvas-hint"), status: $("status-pill"),
    canvas: $("canvas-wrap")
  };

  const state = {
    tx: 0, ty: 0, k: 1,
    era: "all", clan: "all",
    reinc: true, bijuu: false, sensei: false,
    search: "", selected: null, activeBijuu: null,
    matches: new Set(), activeEraOrClan: false,
    pointer: null, raf: null
  };

  // id -> image src, filled in once each character's picture is found (characters/<id>.*)
  const portraits = new Map();

  /* ---------------------------------------------------------------- helpers */
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function initials(name) {
    const parts = name.replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function auraColor(c) { return WORLD.auraColors[c.aura] || WORLD.auraColors.none; }

  const inGroup = (c, g) => ((WORLD.groups && WORLD.groups[g]) || []).includes(c.id);
  const groupNames = (c) => Object.keys(WORLD.groups || {}).filter((g) => inGroup(c, g));
  function clanMatch(c) {
    if (state.clan === "all") return true;
    if (WORLD.groups && WORLD.groups[state.clan]) return inGroup(c, state.clan);
    return c.clan === state.clan;
  }

  function status(msg) {
    els.status.textContent = msg;
    els.status.hidden = false;
    clearTimeout(status._t);
    status._t = setTimeout(() => { els.status.hidden = true; }, 2200);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* Fold macrons and other accents so "jugo" finds "Jūgo", "choji" finds "Chōji". */
  function norm(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /* -------------------------------------------------------- static scaffolding */
  function buildGrid() {
    const grid = el("g", { id: "layer-grid" });
    els.viewport.insertBefore(grid, els.viewport.firstChild);
    const centerX = WORLD.meta.canvas.width / 2;
    Object.keys(WORLD.meta.rowY).forEach((g) => {
      const y = WORLD.meta.rowY[g];
      el("line", { class: "generation-rule", x1: 55, y1: y, x2: WORLD.meta.canvas.width - 60, y2: y }, grid);
      el("text", { class: "generation-label", x: 48, y: y - 9 },
        grid).textContent = `GEN ${g}`;
    });
    el("text", { class: "band-label", x: centerX, y: 1785 }, grid)
      .textContent = "—  THE SPIRIT REALM · TIED BEASTS  —";
    el("text", { class: "band-label", x: centerX, y: 1630 - 42 }, grid)
      .textContent = "—  JINCHŪRIKI THROUGH THE AGES  —";
  }

  /* --------------------------------------------------------------- node draw */
  function drawCharacter(c) {
    const compact = !!c.compact;
    const r = compact ? RC : R;
    const color = auraColor(c);
    const g = el("g", {
      class: `node${compact ? " compact" : ""}`, "data-id": c.id,
      transform: `translate(${c.x} ${c.y})`, tabindex: "0",
      role: "button", "aria-label": `${c.name}, ${c.title}`
    }, els.nodes);

    if (c.aura !== "none") {
      el("circle", { class: "halo", r: r + 11, fill: color, opacity: ".22", filter: "url(#glow-gold)" }, g);
      el("circle", { r: r + 5, fill: "none", stroke: color, "stroke-width": "2", opacity: ".55" }, g);
    }
    el("circle", { class: "disc", r, fill: "url(#portrait-base)" }, g);
    el("circle", { class: "ring", r: r - 5.5, stroke: color }, g);
    const init = el("text", { class: "initials", y: 1 }, g);
    if (compact) init.style.fontSize = "11px";
    init.textContent = initials(c.name);
    el("text", { class: "node-label", y: r + 17 }, g).textContent = c.name;
    el("text", { class: "node-title", y: r + 29 }, g).textContent = c.title;
    return g;
  }

  function drawBijuu(b) {
    const g = el("g", {
      class: "node bijuu-node", "data-bijuu": b.id,
      transform: `translate(${b.x} ${b.y})`, tabindex: "0", role: "button",
      "aria-label": `${b.name}, ${b.tails} tails`
    }, els.bijuuLayer);
    el("circle", { class: "halo", r: RB + 10, fill: b.color, opacity: ".28", filter: "url(#glow-red)" }, g);
    el("circle", { class: "disc", r: RB, fill: "url(#portrait-base)" }, g);
    el("text", { class: "tails-badge", y: 1 }, g).textContent = b.tails;
    el("text", { class: "node-label", y: RB + 17 }, g).textContent = b.name;
    el("text", { class: "node-title", y: RB + 29 }, g).textContent = b.nature;
    return g;
  }

  /* --------------------------------------------------------------- link draw */
  function parentPath(p, c) {
    const sy = p.y + (c.compact ? RC : R) + 2;
    const ey = c.y - (p.compact ? RC : R) - 7;
    const mid = (sy + ey) / 2;
    return `M ${p.x} ${sy} C ${p.x} ${mid}, ${c.x} ${mid}, ${c.x} ${ey}`;
  }

  function curvePath(a, b, lift = 44) {
    const mx = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${mx} ${a.y + lift}, ${mx} ${b.y - lift}, ${b.x} ${b.y}`;
  }

  function drawLinks() {
    WORLD.links.forEach((l) => {
      if (l.t === "parent") {
        const p = byId(l.p), c = byId(l.c);
        if (!p || !c) return;
        const path = el("path", {
          class: "link parent", d: parentPath(p, c),
          "data-a": l.p, "data-b": l.c
        }, els.parent);
        path.style.filter = "url(#ink-soft)";
      } else if (l.t === "spouse") {
        const a = byId(l.a), b = byId(l.b);
        if (!a || !b) return;
        el("path", {
          class: "link spouse", d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
          "data-a": l.a, "data-b": l.b
        }, els.spouse);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        el("path", {
          class: "spouse-diamond",
          d: `M ${mx} ${my - 5} L ${mx + 5} ${my} L ${mx} ${my + 5} L ${mx - 5} ${my} Z`
        }, els.spouse);
      } else if (l.t === "reinc") {
        const gold = l.chain[0] === "asura";
        for (let i = 0; i < l.chain.length - 1; i++) {
          const a = byId(l.chain[i]), b = byId(l.chain[i + 1]);
          if (!a || !b) continue;
          el("path", {
            class: `link reinc${gold ? " gold" : ""}`,
            d: curvePath(a, b, 60), "data-a": a.id, "data-b": b.id
          }, els.reinc);
        }
      } else if (l.t === "sensei") {
        const a = byId(l.s), b = byId(l.d);
        if (!a || !b) return;
        el("path", {
          class: "link sensei", d: curvePath(a, b, 26),
          "data-a": a.id, "data-b": b.id
        }, els.sensei);
      } else if (l.t === "team") {
        const a = byId(l.a), b = byId(l.b);
        if (!a || !b) return;
        el("path", {
          class: "link team", d: curvePath(a, b, 14),
          "data-a": a.id, "data-b": b.id
        }, els.team);
      }
    });

    // Bijuu → every jinchūriki (including hosts in the lower band)
    WORLD.bijuu.forEach((b) => {
      b.jinchuriki.forEach((hid) => {
        const h = byId(hid);
        if (!h) return;
        const lift = Math.min(230, Math.abs(b.y - h.y) * 0.55);
        el("path", {
          class: "link bijuu-thread",
          d: `M ${b.x} ${b.y - RB - 2} C ${b.x} ${b.y - lift}, ${h.x} ${h.y + lift}, ${h.x} ${h.y + (h.compact ? RC : R) + 4}`,
          "data-a": b.id, "data-b": h.id, "data-bijuu": b.id
        }, els.bijuuLinks);
      });
    });
  }

  /* ---------------------------------------------------------- relation derive */
  function relations(id) {
    const out = { parents: [], children: [], spouse: [], siblings: [], sensei: [], students: [], team: [], reinc: [] };
    WORLD.links.forEach((l) => {
      if (l.t === "parent") {
        if (l.c === id) out.parents.push(l.p);
        if (l.p === id) out.children.push(l.c);
      } else if (l.t === "spouse") {
        if (l.a === id) out.spouse.push(l.b);
        if (l.b === id) out.spouse.push(l.a);
      } else if (l.t === "sensei") {
        if (l.d === id) out.sensei.push(l.s);
        if (l.s === id) out.students.push(l.d);
      } else if (l.t === "team") {
        if (l.a === id) out.team.push(l.b);
        if (l.b === id) out.team.push(l.a);
      } else if (l.t === "reinc" && l.chain.includes(id)) {
        out.reinc.push(...l.chain.filter((x) => x !== id));
      }
    });
    const parentIds = WORLD.links.filter((l) => l.t === "parent" && l.c === id).map((l) => l.p);
    WORLD.links.filter((l) => l.t === "parent" && parentIds.includes(l.p) && l.c !== id)
      .forEach((l) => { if (!out.siblings.includes(l.c)) out.siblings.push(l.c); });
    Object.keys(out).forEach((k) => { out[k] = [...new Set(out[k])]; });
    return out;
  }

  /* ----------------------------------------------------------- drawer render */
  function chip(id, extraClass = "") {
    const c = byId(id);
    if (!c) return "";
    const pic = portraits.get(c.id);
    const avatar = pic ? `<img class="chip-avatar" src="${escapeHtml(pic)}" alt="" loading="lazy">` : "";
    return `<button class="rel-chip ${extraClass}${pic ? " has-avatar" : ""}" data-go="${c.id}">${avatar}${escapeHtml(c.name)}</button>`;
  }

  function group(label, ids) {
    if (!ids.length) return "";
    return `<div class="rel-label">${label}</div><div class="chip-group">${ids.map((i) => chip(i)).join("")}</div>`;
  }

  function weaponIcon(w, cls = "weapon-icon") {
    const pic = portraits.get("weapon:" + w.id);
    return pic
      ? `<img class="${cls} has-photo" src="${escapeHtml(pic)}" alt="">`
      : `<span class="${cls}" aria-hidden="true">${WEAPON_GLYPH[w.type] || "武"}</span>`;
  }

  function weaponChip(w) {
    return `<button class="rel-chip weapon-chip has-avatar" data-weapon-go="${w.id}">${weaponIcon(w, "chip-avatar weapon-glyph")}${escapeHtml(w.name)}</button>`;
  }

  function openCharacter(id, withPreview = true) {
    const c = byId(id);
    if (!c) return;
    if (withPreview && window.CharacterPreview) window.CharacterPreview.open(c);
    state.selected = id;
    document.querySelectorAll(".node").forEach((n) => n.classList.toggle("selected", n.getAttribute("data-id") === id));

    const rel = relations(id);
    const eras = c.era.map((e) => {
      const found = WORLD.eras.find((x) => x.id === e);
      return `<span class="badge era">${escapeHtml(found ? found.label : e)}</span>`;
    }).join("");
    const jutsu = c.jutsu.map((j, i) => {
      const color = WORLD.natures[j[1]] || "#6B5B45";
      return `<div class="jutsu-item" data-jutsu="${i}" role="button" tabindex="0" title="Perform in full-screen preview">
        <span class="nature-badge" style="background:${color}">${escapeHtml(j[1])}</span>
        <span><span class="jutsu-name">${escapeHtml(j[0])}</span>
        <span class="jutsu-type">${escapeHtml(j[2])}</span></span></div>`;
    }).join("");
    const bijuuChips = c.bijuu.map((bid) => {
      const b = bijuuById(bid);
      if (!b) return "";
      const pic = portraits.get("bijuu:" + b.id);
      return `<button class="rel-chip bijuu-chip${pic ? " has-avatar" : ""}" data-bijuu-go="${b.id}">${pic ? `<img class="chip-avatar" src="${escapeHtml(pic)}" alt="">` : ""}${escapeHtml(b.name)} · ${b.tails} tails</button>`;
    }).join("");

    const preview = window.CharacterPreview
      ? `<button class="ink-btn accent pv-open" data-pv-open>⛶ Full-Screen Animated Preview</button>` : "";
    els.drawerBody.innerHTML = `
      ${preview}
      <div class="drawer-hero">
        ${portraits.has(c.id) ? `<img class="drawer-avatar" src="${escapeHtml(portraits.get(c.id))}" alt="${escapeHtml(c.name)}" style="--ring:${auraColor(c)}" data-pv-open>` : ""}
        <div>
          <div class="drawer-kicker">Shinobi Chronicle</div>
          <h2 class="drawer-name">${escapeHtml(c.name)}</h2>
          <div class="drawer-jp">${escapeHtml(c.jp)}</div>
        </div>
      </div>
      <span class="drawer-title">${escapeHtml(c.title)}</span>
      <div class="badge-row">
        <span class="badge clan">${escapeHtml(c.clan)}</span>
        ${groupNames(c).map((g) => `<span class="badge group">${escapeHtml(g)}</span>`).join("")}
        ${eras}
        ${c.aura !== "none" ? `<span class="badge aura-${c.aura}">${c.aura} chakra aura</span>` : ""}
      </div>
      <div class="drawer-section">
        <h3>Chronicle</h3>
        <p class="drawer-bio">${escapeHtml(c.bio)}</p>
      </div>
      <div class="drawer-section">
        <h3>Special Skills &amp; Jutsu</h3>
        ${jutsu || '<p class="drawer-bio">No techniques recorded.</p>'}
      </div>
      ${weaponsOf(c.id).length ? `<div class="drawer-section"><h3>Special Weapons</h3><div class="chip-group">${weaponsOf(c.id).map(weaponChip).join("")}</div></div>` : ""}
      ${bijuuChips ? `<div class="drawer-section"><h3>Tailed Beast Bond</h3><div class="chip-group">${bijuuChips}</div></div>` : ""}
      <div class="drawer-section">
        <h3>Relationships</h3>
        ${group("Parents", rel.parents)}
        ${group("Spouse / Partner", rel.spouse)}
        ${group("Siblings", rel.siblings)}
        ${group("Children", rel.children)}
        ${group("Sensei", rel.sensei)}
        ${group("Students", rel.students)}
        ${group("Team / Comrades", rel.team)}
        ${group("Reincarnation Lineage", rel.reinc)}
      </div>`;

    els.drawerBody.scrollTop = 0;
    hideWeaponDrawer();
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    els.scrim.hidden = false;
    els.bijuuDrawer.classList.remove("open");
    els.bijuuDrawer.setAttribute("aria-hidden", "true");
  }

  /* A tailed beast shaped like a character, for the full-screen preview. */
  function natureOf(text) {
    if (/fire|lava|flame|steam/i.test(text)) return "Fire";
    if (/water|bubble|mist|shell|ink|coral/i.test(text)) return "Water";
    if (/wind|sand|dust|flight/i.test(text)) return "Wind";
    if (/earth|rock/i.test(text)) return "Earth";
    if (/lightning/i.test(text)) return "Lightning";
    if (/wood|tsukuyomi/i.test(text)) return "Yin-Yang";
    return "All";
  }

  function bijuuAsCharacter(b) {
    return {
      id: b.id, isBijuu: true, tails: b.tails, name: b.name, jp: b.jp,
      clan: "Tailed Beast", era: [], title: `${b.tails}-Tails · ${b.nature}`,
      aura: "bijuu", auraColor: b.color, image: b.image, video: b.video,
      jutsu: b.abilities.map((ab) => [ab, natureOf(ab), "Bijuu"]), bijuu: []
    };
  }

  /* A weapon shaped like a character, for the full-screen preview. */
  function weaponAsCharacter(w) {
    const wielders = w.owners.map((o) => (byId(o) || { name: o }).name);
    return {
      id: w.id, isWeapon: true, folder: "weapons", glyph: WEAPON_GLYPH[w.type] || "武",
      name: w.name, jp: w.jp, clan: w.type, era: [], title: "Wielded by " + wielders.join(", "),
      aura: "weapon", auraColor: "#8A8FA0", image: w.image, video: w.video,
      jutsu: [[w.ability, "Weapon", w.type, w.clip]], bijuu: []
    };
  }

  function previewWeapon(id) {
    const w = weaponById(id);
    if (w && window.CharacterPreview) window.CharacterPreview.open(weaponAsCharacter(w));
  }

  function previewBijuu(id) {
    const b = bijuuById(id);
    if (b && window.CharacterPreview) window.CharacterPreview.open(bijuuAsCharacter(b));
  }

  function openBijuu(id, focus = false) {
    const b = bijuuById(id);
    if (!b) return;
    state.activeBijuu = id;
    els.bijuuList.querySelectorAll(".bijuu-card").forEach((card) =>
      card.classList.toggle("active", card.getAttribute("data-bijuu") === id));

    const hosts = b.jinchuriki.map((hid, i) => {
      const part = chip(hid);
      return i < b.jinchuriki.length - 1 ? part + '<span class="host-arrow">→</span>' : part;
    }).join("");
    const abilities = b.abilities.map((a) => `<span class="detail-ability">${escapeHtml(a)}</span>`).join("");

    els.bijuuDetail.hidden = false;
    els.bijuuDetail.innerHTML = `
      <div class="drawer-hero">
        ${portraits.has("bijuu:" + b.id) ? `<img class="drawer-avatar" src="${escapeHtml(portraits.get("bijuu:" + b.id))}" alt="${escapeHtml(b.name)}" style="--ring:${b.color};cursor:default">` : ""}
        <div>
          <div class="drawer-kicker">Bijuu Profile</div>
          <h3 class="drawer-name" style="font-size:24px">${escapeHtml(b.name)}</h3>
          <div class="drawer-jp">${escapeHtml(b.jp)}</div>
        </div>
      </div>
      <div class="badge-row">
        <span class="badge clan">${b.tails} ${b.tails === 1 ? "Tail" : "Tails"}</span>
        <span class="badge era">${escapeHtml(b.nature)}</span>
      </div>
      <p class="drawer-bio">${escapeHtml(b.lore)}</p>
      <div class="rel-label">Signature Abilities</div>
      <div class="detail-abilities">${abilities}</div>
      <div class="rel-label">Chronological Jinchūriki Chain</div>
      <div class="host-chain">${hosts}</div>
      <div class="rel-label" style="margin-top:14px">Canvas</div>
      <button class="ink-btn" data-trace="${b.id}">Trace chakra threads on tree</button>
      <button class="ink-btn accent" data-bijuu-full="${b.id}" style="margin-top:8px">⛶ View full form</button>`;

    hideWeaponDrawer();
    els.bijuuDrawer.classList.add("open");
    els.bijuuDrawer.setAttribute("aria-hidden", "false");
    els.scrim.hidden = false;
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    if (!state.bijuu) {
      state.bijuu = true;
      els.bijuuToggle.checked = true;
      applyVisibility();
      if (!focus) fitView();
    }
    if (focus) focusNode(b.id, RB, 1.3);
  }

  /* ---------------------------------------------------------- weapons drawer */
  function hideWeaponDrawer() {
    if (!els.weaponDrawer) return;
    els.weaponDrawer.classList.remove("open");
    els.weaponDrawer.setAttribute("aria-hidden", "true");
  }

  function showWeaponDrawer() {
    els.weaponDrawer.classList.add("open");
    els.weaponDrawer.setAttribute("aria-hidden", "false");
    els.scrim.hidden = false;
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    els.bijuuDrawer.classList.remove("open");
    els.bijuuDrawer.setAttribute("aria-hidden", "true");
  }

  function openWeapon(id) {
    const w = weaponById(id);
    if (!w) return;
    els.weaponList.querySelectorAll(".weapon-card").forEach((card) =>
      card.classList.toggle("active", card.dataset.weapon === id));
    const pic = portraits.get("weapon:" + w.id);
    els.weaponDetail.hidden = false;
    els.weaponDetail.innerHTML = `
      <div class="drawer-hero">
        ${pic ? `<img class="drawer-avatar weapon-avatar" src="${escapeHtml(pic)}" alt="${escapeHtml(w.name)}" style="--ring:#5A5A66;cursor:default">`
              : `<span class="weapon-hero-glyph">${WEAPON_GLYPH[w.type] || "武"}</span>`}
        <div>
          <div class="drawer-kicker">Weapon Profile</div>
          <h3 class="drawer-name" style="font-size:24px">${escapeHtml(w.name)}</h3>
          <div class="drawer-jp">${escapeHtml(w.jp)}</div>
        </div>
      </div>
      <div class="badge-row"><span class="badge clan">${escapeHtml(w.type)}</span></div>
      <p class="drawer-bio">${escapeHtml(w.lore)}</p>
      <div class="rel-label">Power</div>
      <div class="detail-abilities"><span class="detail-ability">${escapeHtml(w.ability)}</span></div>
      <div class="rel-label">Wielders</div>
      <div class="chip-group">${w.owners.map((o) => chip(o)).join("")}</div>
      <button class="ink-btn accent" data-weapon-full="${w.id}" style="margin-top:14px">⛶ View full screen</button>`;
    showWeaponDrawer();
  }

  function buildWeaponList() {
    els.weaponList.innerHTML = WEAPONS.map((w) => `
      <button class="bijuu-card weapon-card" data-weapon="${w.id}">
        <span class="tail-orb weapon-orb">${weaponIcon(w, "weapon-orb-inner")}</span>
        <span><b>${escapeHtml(w.name)}</b><small>${escapeHtml(w.type)} · ${w.owners.map((o) => escapeHtml((byId(o) || { name: o }).name)).join(", ")}</small></span>
      </button>`).join("");
  }

  function closeDrawers() {
    hideWeaponDrawer();
    els.drawer.classList.remove("open");
    els.bijuuDrawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    els.bijuuDrawer.setAttribute("aria-hidden", "true");
    els.scrim.hidden = true;
    state.selected = null;
    document.querySelectorAll(".node.selected").forEach((n) => n.classList.remove("selected"));
  }

  /* ------------------------------------------------------------ canvas camera */
  function applyTransform() {
    els.viewport.setAttribute("transform", `translate(${state.tx} ${state.ty}) scale(${state.k})`);
  }

  function animateTo(target, duration = 560) {
    if (state.raf) cancelAnimationFrame(state.raf);
    const from = { tx: state.tx, ty: state.ty, k: state.k };
    const t0 = performance.now();
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = clamp((now - t0) / duration, 0, 1);
      const e = ease(t);
      state.tx = from.tx + (target.tx - from.tx) * e;
      state.ty = from.ty + (target.ty - from.ty) * e;
      state.k = from.k + (target.k - from.k) * e;
      applyTransform();
      if (t < 1) state.raf = requestAnimationFrame(step); else state.raf = null;
    };
    state.raf = requestAnimationFrame(step);
  }

  function canvasSize() {
    const r = els.canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function focusNode(id, k = 1.45) {
    const c = byId(id) || bijuuById(id);
    if (!c) return;
    const { w, h } = canvasSize();
    const nk = clamp(k, .25, 2.6);
    animateTo({ k: nk, tx: w / 2 - c.x * nk, ty: h / 2 - c.y * nk });
  }

  function fitView() {
    const nodes = WORLD.characters.slice();
    if (state.bijuu) nodes.push(...WORLD.bijuu);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((c) => {
      const r = WORLD.bijuu.includes(c) ? RB : (c.compact ? RC : R);
      minX = Math.min(minX, c.x - r - 24); maxX = Math.max(maxX, c.x + r + 24);
      minY = Math.min(minY, c.y - r - 20); maxY = Math.max(maxY, c.y + r + 42);
    });
    const { w, h } = canvasSize();
    const pad = 42;
    const bw = maxX - minX, bh = maxY - minY;
    const k = clamp(Math.min((w - pad * 2) / bw, (h - pad * 2) / bh), .05, 1.8);
    animateTo({
      k,
      tx: (w - bw * k) / 2 - minX * k,
      ty: (h - bh * k) / 2 - minY * k
    }, 700);
  }

  function zoomBy(factor) {
    const { w, h } = canvasSize();
    const nk = clamp(state.k * factor, .08, 3);
    const cx = (w / 2 - state.tx) / state.k;
    const cy = (h / 2 - state.ty) / state.k;
    state.tx = w / 2 - cx * nk;
    state.ty = h / 2 - cy * nk;
    state.k = nk;
    applyTransform();
  }

  /* ------------------------------------------------------------- filtering */
  function searchableText(c) {
    return norm([c.name, c.jp, c.clan, ...groupNames(c), c.title, c.bio,
      ...c.jutsu.map((j) => j[0] + j[1] + j[2]), ...c.bijuu,
      ...weaponsOf(c.id).map((w) => w.name + " " + w.jp)].join(" "));
  }

  function computeMatches() {
    const q = norm(state.search.trim());
    const set = new Set();
    if (!q) return set;
    WORLD.characters.forEach((c) => { if (searchableText(c).includes(q)) set.add(c.id); });
    WORLD.bijuu.forEach((b) => {
      const hay = norm([b.name, b.jp, b.nature, `${b.tails}`, b.lore, ...b.abilities].join(" "));
      if (hay.includes(q)) {
        set.add("bijuu:" + b.id);
        b.jinchuriki.forEach((h) => set.add(h));
      }
    });
    // Characters whose jutsu/beast name matches get included via searchableText.
    return set;
  }

  function applyVisibility() {
    state.matches = computeMatches();
    state.activeEraOrClan = state.era !== "all" || state.clan !== "all";
    const filtering = state.activeEraOrClan || state.search.trim().length > 0;

    document.querySelectorAll("#layer-nodes .node").forEach((n) => {
      const c = byId(n.getAttribute("data-id"));
      const eraOk = state.era === "all" || c.era.includes(state.era);
      const clanOk = clanMatch(c);
      const searchOk = !state.search.trim() || state.matches.has(c.id);
      n.classList.toggle("dim", filtering && !(eraOk && clanOk && searchOk));
      n.classList.toggle("match", !!state.search.trim() && state.matches.has(c.id));
      n.classList.toggle("search-hit", !!state.search.trim() && state.matches.has(c.id));
    });
    const hasQuery = !!state.search.trim();
    document.querySelectorAll("#layer-bijuu .node").forEach((n) => {
      const b = bijuuById(n.getAttribute("data-bijuu"));
      const searchOk = !hasQuery || state.matches.has("bijuu:" + b.id);
      n.classList.toggle("dim", hasQuery && !searchOk);
      n.classList.toggle("match", hasQuery && searchOk);
    });

    // Dim any link whose endpoints are both outside the active selection.
    document.querySelectorAll(".link").forEach((p) => {
      const a = p.getAttribute("data-a"), b = p.getAttribute("data-b");
      const nodeOk = (id) => {
        if (!id) return true;
        const c = byId(id);
        if (!c) return true;
        const eraOk = state.era === "all" || c.era.includes(state.era);
        const clanOk = clanMatch(c);
        const searchOk = !state.search.trim() || state.matches.has(id) || state.matches.has("bijuu:" + id);
        return eraOk && clanOk && searchOk;
      };
      p.classList.toggle("faded", filtering && !nodeOk(a) && !nodeOk(b));
    });

    els.reinc.style.display = state.reinc ? "" : "none";
    els.sensei.style.display = state.sensei ? "" : "none";
    els.bijuuLayer.style.display = state.bijuu ? "" : "none";
    els.bijuuLinks.style.display = state.bijuu ? "" : "none";
  }

  /* ----------------------------------------------------------------- search */
  function renderSearchResults() {
    const q = norm(state.search.trim());
    if (!q) { els.searchResults.hidden = true; els.searchResults.innerHTML = ""; return; }
    const chars = WORLD.characters.filter((c) => searchableText(c).includes(q));
    const beasts = WORLD.bijuu.filter((b) =>
      norm([b.name, b.jp, b.nature, `${b.tails}`, ...b.abilities].join(" ")).includes(q));
    const arms = WEAPONS.filter((w) =>
      norm([w.name, w.jp, w.type, w.ability].join(" ")).includes(q));
    const items = [
      ...arms.map((w) => ({ id: w.id, label: w.name, sub: `${w.type} · Weapon`, color: "#5A5A66", type: "weapon" })),
      ...chars.map((c) => ({ id: c.id, label: c.name, sub: c.clan + " · " + c.title, color: auraColor(c), type: "char" })),
      ...beasts.map((b) => ({ id: b.id, label: b.name, sub: `${b.tails} tails · Bijuu`, color: b.color, type: "bijuu" }))
    ].slice(0, 12);
    if (!items.length) {
      els.searchResults.innerHTML = `<div class="search-result"><small>No results in this scroll.</small></div>`;
    } else {
      els.searchResults.innerHTML = items.map((it) => `
        <button class="search-result" data-type="${it.type}" data-id="${it.id}">
          ${it.type === "weapon" ? weaponIcon(weaponById(it.id), "result-avatar weapon-glyph") : it.type === "char" && portraits.has(it.id)
            ? `<img class="result-avatar" src="${escapeHtml(portraits.get(it.id))}" alt="" style="border-color:${it.color}">`
            : `<span class="result-dot" style="background:${it.color}"></span>`}
          <span><b>${escapeHtml(it.label)}</b><br><small>${escapeHtml(it.sub)}</small></span>
        </button>`).join("");
    }
    els.searchResults.hidden = false;
  }

  function pickResult(type, id) {
    if (type === "weapon") { openWeapon(id); els.searchResults.hidden = true; return; }
    focusNode(id, type === "bijuu" ? 1.2 : 1.55);
    if (type === "bijuu") openBijuu(id); else openCharacter(id);
    els.searchResults.hidden = true;
  }

  /* ------------------------------------------------------------ interactions */
  function bindCanvas() {
    const svg = els.svg;
    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      const wx = (px - state.tx) / state.k, wy = (py - state.ty) / state.k;
      const nk = clamp(state.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12), .08, 3);
      state.tx = px - wx * nk; state.ty = py - wy * nk; state.k = nk;
      applyTransform();
      els.hint.style.opacity = "0";
    }, { passive: false });

    svg.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const node = e.target.closest(".node");
      state.pointer = {
        x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty,
        moved: false, node: node ? (node.getAttribute("data-id") || node.getAttribute("data-bijuu")) : null,
        nodeType: node ? (node.classList.contains("bijuu-node") ? "bijuu" : "char") : null
      };
      svg.classList.add("dragging");
      try { svg.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ }
    });

    svg.addEventListener("pointermove", (e) => {
      if (!state.pointer) return;
      const dx = e.clientX - state.pointer.x, dy = e.clientY - state.pointer.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) state.pointer.moved = true;
      if (state.pointer.moved) {
        state.tx = state.pointer.tx + dx;
        state.ty = state.pointer.ty + dy;
        applyTransform();
      }
    });

    const endPointer = () => {
      if (!state.pointer) return;
      const p = state.pointer;
      state.pointer = null;
      svg.classList.remove("dragging");
      if (!p.moved && p.node) {
        if (p.nodeType === "bijuu") { openBijuu(p.node); previewBijuu(p.node); } else openCharacter(p.node);
      }
    };
    svg.addEventListener("pointerup", endPointer);
    svg.addEventListener("pointercancel", endPointer);

    // Hover highlight of directly connected links
    els.nodes.addEventListener("pointerover", (e) => {
      const n = e.target.closest(".node");
      if (!n) return;
      highlight(n.getAttribute("data-id"));
    });
    els.nodes.addEventListener("pointerout", (e) => {
      if (!e.target.closest(".node")) return;
      document.querySelectorAll(".link.hl").forEach((p) => p.classList.remove("hl"));
    });
    els.bijuuLayer.addEventListener("pointerover", (e) => {
      const n = e.target.closest(".node");
      if (n) highlight(n.getAttribute("data-bijuu"));
    });
    els.bijuuLayer.addEventListener("pointerout", () =>
      document.querySelectorAll(".link.hl").forEach((p) => p.classList.remove("hl")));

    // Keyboard activation of a focused node
    svg.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const n = e.target.closest(".node");
      if (!n) return;
      e.preventDefault();
      if (n.classList.contains("bijuu-node")) { openBijuu(n.getAttribute("data-bijuu")); previewBijuu(n.getAttribute("data-bijuu")); }
      else openCharacter(n.getAttribute("data-id"));
    });
  }

  function highlight(id) {
    document.querySelectorAll(".link.hl").forEach((p) => p.classList.remove("hl"));
    document.querySelectorAll(`.link[data-a="${id}"], .link[data-b="${id}"]`).forEach((p) => p.classList.add("hl"));
  }

  function bindControls() {
    els.eraFilters.innerHTML = WORLD.eras.map((e) =>
      `<button class="chip${e.id === "all" ? " active" : ""}" data-era="${e.id}">${escapeHtml(e.label)}</button>`).join("");
    els.clanFilter.innerHTML = WORLD.clans.map((c) =>
      `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`).join("");

    els.eraFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-era]");
      if (!btn) return;
      state.era = btn.dataset.era;
      els.eraFilters.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
      applyVisibility();
    });
    els.clanFilter.addEventListener("change", () => { state.clan = els.clanFilter.value; applyVisibility(); });

    els.reincToggle.addEventListener("change", () => { state.reinc = els.reincToggle.checked; applyVisibility(); });
    els.bijuuToggle.addEventListener("change", () => {
      state.bijuu = els.bijuuToggle.checked;
      applyVisibility();
      if (state.bijuu) fitView();
    });
    els.senseiToggle.addEventListener("change", () => { state.sensei = els.senseiToggle.checked; applyVisibility(); });

    els.btnReset.addEventListener("click", () => { state.search = ""; els.search.value = ""; renderSearchResults(); fitView(); });
    els.btnBijuu.addEventListener("click", () => openBijuu("kurama"));
    els.btnWeapons.addEventListener("click", () => { els.weaponDetail.hidden = true; showWeaponDrawer(); });
    els.weaponClose.addEventListener("click", closeDrawers);
    $("zoom-in").addEventListener("click", () => zoomBy(1.25));
    $("zoom-out").addEventListener("click", () => zoomBy(1 / 1.25));
    $("zoom-fit").addEventListener("click", fitView);

    els.search.addEventListener("input", () => { state.search = els.search.value; renderSearchResults(); applyVisibility(); });
    els.search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = els.searchResults.querySelector(".search-result");
        if (first) { e.preventDefault(); pickResult(first.dataset.type, first.dataset.id); }
      }
    });
    els.searchClear.addEventListener("click", () => {
      state.search = ""; els.search.value = ""; renderSearchResults(); applyVisibility(); els.search.focus();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) els.searchResults.hidden = true;
    });

    els.drawerClose.addEventListener("click", closeDrawers);
    els.bijuuClose.addEventListener("click", closeDrawers);
    els.scrim.addEventListener("click", closeDrawers);

    // Full-screen animated preview: reopen it from the drawer, or perform a listed jutsu
    if (window.CharacterPreview) {
      window.CharacterPreview.onChronicle((c) => (c.isWeapon ? openWeapon(c.id) : c.isBijuu ? openBijuu(c.id) : openCharacter(c.id, false)));
      els.drawerBody.addEventListener("click", (e) => {
        const c = byId(state.selected);
        if (!c) return;
        if (e.target.closest("[data-pv-open]")) { window.CharacterPreview.open(c); return; }
        const item = e.target.closest(".jutsu-item[data-jutsu]");
        if (item) window.CharacterPreview.open(c, Number(item.dataset.jutsu));
      });
      els.drawerBody.addEventListener("keydown", (e) => {
        const item = e.target.closest(".jutsu-item[data-jutsu]");
        if (item && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); item.click(); }
      });
    }

    document.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) { focusNode(go.dataset.go); openCharacter(go.dataset.go); return; }
      const wg = e.target.closest("[data-weapon-go]");
      if (wg) { openWeapon(wg.dataset.weaponGo); previewWeapon(wg.dataset.weaponGo); return; }
      const wc = e.target.closest(".weapon-card[data-weapon]");
      if (wc) { openWeapon(wc.dataset.weapon); previewWeapon(wc.dataset.weapon); return; }
      const wf = e.target.closest("[data-weapon-full]");
      if (wf) { previewWeapon(wf.dataset.weaponFull); return; }
      const bg = e.target.closest("[data-bijuu-go]");
      if (bg) { openBijuu(bg.dataset.bijuuGo, true); return; }
      const card = e.target.closest("[data-bijuu]");
      if (card && card.classList.contains("bijuu-card")) { openBijuu(card.dataset.bijuu); previewBijuu(card.dataset.bijuu); return; }
      const full = e.target.closest("[data-bijuu-full]");
      if (full) { previewBijuu(full.dataset.bijuuFull); return; }
      const trace = e.target.closest("[data-trace]");
      if (trace) {
        if (!state.bijuu) { state.bijuu = true; els.bijuuToggle.checked = true; applyVisibility(); }
        focusNode(trace.dataset.trace, RB, 1.1);
        status("Chakra threads revealed — drag to explore the hosts.");
        return;
      }
      const result = e.target.closest(".search-result");
      if (result) pickResult(result.dataset.type, result.dataset.id);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeDrawers(); els.searchResults.hidden = true; }
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "+" || e.key === "=") zoomBy(1.2);
      if (e.key === "-") zoomBy(1 / 1.2);
      if (e.key === "0") fitView();
    });
  }

  /* ------------------------------------------------------------------ build */
  function buildBijuuList() {
    els.bijuuList.innerHTML = WORLD.bijuu.map((b) => `
      <button class="bijuu-card" data-bijuu="${b.id}">
        <span class="tail-orb" style="background:${b.color}33">${b.tails}</span>
        <span><b>${escapeHtml(b.name)}</b><small>${escapeHtml(b.nature)} · ${b.jinchuriki.length} host${b.jinchuriki.length > 1 ? "s" : ""}</small></span>
      </button>`).join("");
  }

  /* ------------------------------------------------- character pictures */
  function addPortraitClips() {
    const defs = els.svg.querySelector("defs");
    [["clip-portrait", R - 5.5], ["clip-portrait-compact", RC - 4], ["clip-portrait-bijuu", RB - 2]].forEach(([id, r]) => {
      const cp = el("clipPath", { id }, defs);
      el("circle", { cx: 0, cy: 0, r }, cp);
    });
  }

  function applyPortrait(c, src) {
    const g = els.nodes.querySelector(`.node[data-id="${c.id}"]`);
    if (!g || g.querySelector(".portrait")) return;
    const r = c.compact ? RC - 4 : R - 5.5;
    const img = el("image", {
      class: "portrait", href: src, x: -r, y: -r, width: r * 2, height: r * 2,
      preserveAspectRatio: "xMidYMin slice",
      "clip-path": `url(#${c.compact ? "clip-portrait-compact" : "clip-portrait"})`
    });
    g.insertBefore(img, g.querySelector(".ring"));
    g.classList.add("has-photo");
    // refresh any relationship chips / profile already on screen
    document.querySelectorAll(`.rel-chip[data-go="${c.id}"]:not(.has-avatar)`).forEach((b) => {
      b.classList.add("has-avatar");
      b.insertAdjacentHTML("afterbegin", `<img class="chip-avatar" src="${escapeHtml(src)}" alt="">`);
    });
  }

  function applyBijuuPortrait(b, src) {
    const g = els.bijuuLayer.querySelector(`.node[data-bijuu="${b.id}"]`);
    if (g && !g.querySelector(".portrait")) {
      const r = RB - 2;
      g.insertBefore(el("image", {
        class: "portrait", href: src, x: -r, y: -r, width: r * 2, height: r * 2,
        preserveAspectRatio: "xMidYMid slice", "clip-path": "url(#clip-portrait-bijuu)"
      }), g.querySelector(".tails-badge"));
      g.classList.add("has-photo");
    }
    const orb = els.bijuuList.querySelector(`.bijuu-card[data-bijuu="${b.id}"] .tail-orb`);
    if (orb && !orb.querySelector("img")) {
      orb.classList.add("has-photo");
      orb.innerHTML = `<img src="${escapeHtml(src)}" alt=""><span>${b.tails}</span>`;
    }
    document.querySelectorAll(`.bijuu-chip[data-bijuu-go="${b.id}"]:not(.has-avatar)`).forEach((c) => {
      c.classList.add("has-avatar");
      c.insertAdjacentHTML("afterbegin", `<img class="chip-avatar" src="${escapeHtml(src)}" alt="">`);
    });
  }

  function loadPortraits() {
    if (!window.CharacterPreview || !window.CharacterPreview.findImage) return;
    WEAPONS.forEach((w) => {
      window.CharacterPreview.findImage(w, "weapons").then((src) => {
        if (!src) return;
        portraits.set("weapon:" + w.id, src);
        buildWeaponList();
      });
    });
    WORLD.bijuu.forEach((b) => {
      window.CharacterPreview.findImage(b).then((src) => {
        if (!src) return;
        portraits.set("bijuu:" + b.id, src);
        applyBijuuPortrait(b, src);
      });
    });
    WORLD.characters.forEach((c) => {
      window.CharacterPreview.findImage(c).then((src) => {
        if (!src) return;
        portraits.set(c.id, src);
        applyPortrait(c, src);
        if (state.selected === c.id && !els.drawerBody.querySelector(".drawer-avatar")) openCharacter(c.id, false);
      });
    });
  }

  function init() {
    buildGrid();
    drawLinks();
    WORLD.characters.forEach(drawCharacter);
    addPortraitClips();
    loadPortraits();
    WORLD.bijuu.forEach(drawBijuu);
    buildBijuuList();
    buildWeaponList();
    bindCanvas();
    bindControls();
    applyVisibility();
    fitView();
    setTimeout(() => { els.hint.style.transition = "opacity .5s"; }, 100);
  }

  init();
})();
