/* ==========================================================================
   SHINOBI CHRONICLES — website home: paginated card archive
   Cards open the same full-screen animated preview as the Lineage Scroll
   (preview.js). "Read Chronicle" / "On the scroll" deep-link into scroll.html.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const CHARS = WORLD.characters;
  const BIJUU = WORLD.bijuu;
  const WEAPONS = WORLD.weapons || [];
  const byId = (id) => CHARS.find((c) => c.id === id);
  const groupsOf = (c) => Object.keys(WORLD.groups || {}).filter((g) => WORLD.groups[g].includes(c.id));
  const hostOf = (id) => BIJUU.filter((b) => b.jinchuriki.includes(id));
  const WEAPON_GLYPH = { Sword: "刀", "Short Sword": "刀", Swords: "刀", "Spirit Sword": "剣", "Spirit Shield": "鏡",
    Scythe: "鎌", "War Fan": "扇", Staff: "棒", Kunai: "苦", "Chakra Orbs": "玉", "Ninja Tool": "具", "Trench Knives": "刃" };
  const auraHex = (c) => (WORLD.auraColors && WORLD.auraColors[c.aura]) || "#6B5B45";

  const PAGE_SIZES = [8, 12, 16, 24];
  const state = { tab: "characters", q: "", era: "all", clan: "all", sort: "scroll", page: 1, per: 12 };
  try { const p = Number(localStorage.getItem("sc-per-page")); if (PAGE_SIZES.includes(p)) state.per = p; } catch (e) { /* storage blocked */ }

  /* ------------------------------------------- items as preview "characters" */
  function natureOf(text) {
    if (/fire|lava|flame|steam/i.test(text)) return "Fire";
    if (/water|bubble|mist|shell|ink|coral/i.test(text)) return "Water";
    if (/wind|sand|dust|flight/i.test(text)) return "Wind";
    if (/earth|rock/i.test(text)) return "Earth";
    if (/lightning/i.test(text)) return "Lightning";
    if (/wood|tsukuyomi/i.test(text)) return "Yin-Yang";
    return "All";
  }
  const bijuuAsCharacter = (b) => ({
    id: b.id, isBijuu: true, tails: b.tails, name: b.name, jp: b.jp,
    clan: "Tailed Beast", era: [], title: `${b.tails}-Tails · ${b.nature}`,
    aura: "bijuu", auraColor: b.color, image: b.image, video: b.video,
    jutsu: b.abilities.map((ab) => [ab, natureOf(ab), "Bijuu"]), bijuu: []
  });
  const weaponAsCharacter = (w) => ({
    id: w.id, isWeapon: true, folder: "weapons", glyph: WEAPON_GLYPH[w.type] || "武",
    name: w.name, jp: w.jp, clan: w.type, era: [],
    title: "Wielded by " + w.owners.map((o) => (byId(o) || { name: o }).name).join(", "),
    aura: "weapon", auraColor: "#8A8FA0", image: w.image, video: w.video,
    jutsu: [[w.ability, "Weapon", w.type, w.clip]], bijuu: []
  });

  /* ------------------------------------------------------------- collections */
  const COLLECTIONS = {
    characters: {
      title: "Shinobi", sub: "Every ninja, sage and Ōtsutsuki on the scroll.",
      items: CHARS, folder: "characters",
      color: auraHex, glyph: (c) => c.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(""),
      tag: (c) => c.clan, num: () => "",
      text: (c) => [c.name, c.jp, c.clan, c.title, ...groupsOf(c), ...c.jutsu.map((j) => j[0] + " " + j[1]),
        ...hostOf(c.id).map((b) => b.name)].join(" "),
      meta: (c) => {
        const seen = new Set();
        const dots = c.jutsu.map((j) => j[1]).filter((n) => !seen.has(n) && seen.add(n)).slice(0, 3)
          .map((n) => `<span class="s-dot" style="--dot:${WORLD.natures[n] || "#6B5B45"}">${esc(n)}</span>`);
        hostOf(c.id).forEach((b) => dots.push(`<span class="s-dot" style="--dot:${b.color}">${esc(b.name)}</span>`));
        return dots.join("");
      },
      preview: (c) => c, scrollUrl: (c) => `scroll.html?focus=${encodeURIComponent(c.id)}`
    },
    bijuu: {
      title: "Tailed Beasts", sub: "The nine Bijuu and the primordial Ten-Tails, with their hosts.",
      items: BIJUU, folder: "characters",
      color: (b) => b.color, glyph: () => "尾",
      tag: (b) => b.nature, num: (b) => b.tails,
      text: (b) => [b.name, b.jp, b.nature, b.lore, ...b.abilities, ...b.jinchuriki.map((id) => (byId(id) || {}).name)].join(" "),
      meta: (b) => b.jinchuriki.slice(0, 3).map((id) =>
        `<span class="s-dot" style="--dot:${auraHex(byId(id) || {})}">${esc((byId(id) || { name: id }).name)}</span>`).join(""),
      title2: (b) => `${b.tails}-Tails`,
      preview: bijuuAsCharacter, scrollUrl: (b) => `scroll.html?bijuu=${encodeURIComponent(b.id)}`
    },
    weapons: {
      title: "Weapons", sub: "Legendary blades, fans and ninja tools, and the shinobi who wield them.",
      items: WEAPONS, folder: "weapons",
      color: () => "#8A8FA0", glyph: (w) => WEAPON_GLYPH[w.type] || "武",
      tag: (w) => w.type, num: () => "",
      text: (w) => [w.name, w.jp, w.type, w.ability, w.lore, ...w.owners.map((id) => (byId(id) || {}).name)].join(" "),
      meta: (w) => w.owners.slice(0, 3).map((id) =>
        `<span class="s-dot" style="--dot:${auraHex(byId(id) || {})}">${esc((byId(id) || { name: id }).name)}</span>`).join(""),
      title2: (w) => w.ability,
      preview: weaponAsCharacter, scrollUrl: (w) => `scroll.html?weapon=${encodeURIComponent(w.id)}`
    }
  };
  const col = () => COLLECTIONS[state.tab];

  /* --------------------------------------------------------------- filtering */
  function clanMatch(c) {
    if (state.clan === "all") return true;
    if (WORLD.groups && WORLD.groups[state.clan]) return WORLD.groups[state.clan].includes(c.id);
    return c.clan === state.clan;
  }
  function filtered() {
    const C = col();
    const terms = norm(state.q).split(/\s+/).filter(Boolean);
    let list = C.items.filter((it) => {
      if (state.tab === "characters") {
        if (state.era !== "all" && !it.era.includes(state.era)) return false;
        if (!clanMatch(it)) return false;
      }
      if (!terms.length) return true;
      const hay = norm(C.text(it));
      return terms.every((t) => hay.includes(t));
    });
    if (state.sort !== "scroll") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      if (state.sort === "za") list.reverse();
    }
    return list;
  }

  /* ---------------------------------------------------------------- rendering */
  function cardHtml(it, i) {
    const C = col();
    const sub = C.title2 ? C.title2(it) : it.title;
    return `<article class="s-card" role="button" tabindex="0" data-id="${esc(it.id)}"
        style="--c:${C.color(it)};--i:${i}" aria-label="Open ${esc(it.name)} full screen">
      <div class="s-art">
        <span class="s-glyph" aria-hidden="true">${esc(C.glyph(it))}</span>
        <img alt="" decoding="async" data-img>
        <span class="s-tag">${esc(C.tag(it))}</span>
        ${C.num(it) !== "" ? `<span class="s-num">${esc(C.num(it))}</span>` : ""}
      </div>
      <div class="s-body">
        <h3 class="s-name">${esc(it.name)}</h3>
        <span class="s-jp">${esc(it.jp || "")}</span>
        <span class="s-title">${esc(sub)}</span>
        <div class="s-meta">${C.meta(it)}</div>
        <div class="s-foot">
          <span class="s-open">⛶ Preview</span>
          <a class="s-scroll" href="${C.scrollUrl(it)}" title="Find on the Lineage Scroll">On the scroll ↗</a>
        </div>
      </div>
    </article>`;
  }

  function loadArt(card, it) {
    const C = col();
    const img = card.querySelector("[data-img]");
    const art = card.querySelector(".s-art");
    if (!window.CharacterPreview || !window.CharacterPreview.findImage) return;
    window.CharacterPreview.findImage(it, C.folder).then((src) => {
      if (!src || !img.isConnected) return;
      img.onload = () => { img.classList.add("loaded"); art.classList.add("has-img"); };
      img.src = src;
    });
  }

  let lastList = [];
  function render(scrollToTop = false) {
    const C = col();
    const list = filtered();
    lastList = list;
    const pages = Math.max(1, Math.ceil(list.length / state.per));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * state.per;
    const slice = list.slice(start, start + state.per);

    $("archive-title").textContent = C.title;
    $("archive-sub").textContent = C.sub;
    $("grid").innerHTML = slice.map(cardHtml).join("");
    $("grid").querySelectorAll(".s-card").forEach((card, i) => loadArt(card, slice[i]));
    $("empty").hidden = list.length > 0;
    $("result-count").textContent = list.length
      ? `Showing ${start + 1}–${start + slice.length} of ${list.length} ${C.title.toLowerCase()}`
      : `0 ${C.title.toLowerCase()}`;
    renderPager(pages);
    writeHash();
    if (scrollToTop) $("archive").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pageList(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const out = [1];
    const lo = Math.max(2, cur - 1), hi = Math.min(total - 1, cur + 1);
    if (lo > 2) out.push("…");
    for (let p = lo; p <= hi; p++) out.push(p);
    if (hi < total - 1) out.push("…");
    out.push(total);
    return out;
  }
  function renderPager(pages) {
    const p = state.page;
    const nums = pageList(p, pages).map((n) => n === "…"
      ? `<span class="gap">…</span>`
      : `<button data-page="${n}" ${n === p ? 'aria-current="page"' : ""} aria-label="Page ${n}">${n}</button>`).join("");
    $("pager").innerHTML = `
      <button data-page="${p - 1}" ${p <= 1 ? "disabled" : ""} aria-label="Previous page">‹ Prev</button>
      ${nums}
      <button data-page="${p + 1}" ${p >= pages ? "disabled" : ""} aria-label="Next page">Next ›</button>
      <label class="pp">Per page
        <select class="ink-select" data-per>${PAGE_SIZES.map((n) =>
          `<option value="${n}" ${n === state.per ? "selected" : ""}>${n}</option>`).join("")}</select>
      </label>`;
    $("pager").hidden = lastList.length === 0;
  }

  /* --------------------------------------------- URL hash: #characters/2 etc */
  function writeHash() {
    const h = `#${state.tab}${state.page > 1 ? "/" + state.page : ""}`;
    if (location.hash !== h && (location.hash || state.tab !== "characters" || state.page > 1))
      history.replaceState(null, "", h);
  }
  function readHash() {
    const m = location.hash.match(/^#(characters|bijuu|weapons)(?:\/(\d+))?$/);
    if (!m) return false;
    state.tab = m[1]; state.page = Number(m[2] || 1);
    return true;
  }

  /* ------------------------------------------------------------------ controls */
  function setTab(tab, scroll, page = 1) {
    state.tab = tab; state.page = page;
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
    document.querySelectorAll("[data-tab-link]").forEach((a) => a.classList.toggle("active", a.dataset.tabLink === tab));
    $("era-group").hidden = $("clan-group").hidden = tab !== "characters";
    $("q").placeholder = tab === "characters" ? "Search name, clan, jutsu…"
      : tab === "bijuu" ? "Search beast, host, ability…" : "Search weapon, wielder, power…";
    render(scroll);
  }

  function openPreview(id) {
    const it = col().items.find((x) => x.id === id);
    if (it && window.CharacterPreview) window.CharacterPreview.open(col().preview(it));
  }

  function bind() {
    $("hero-stats").innerHTML = [
      ["Shinobi", CHARS.length], ["Tailed Beasts", BIJUU.length],
      ["Weapons", WEAPONS.length], ["Bonds", (WORLD.links || []).length]
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    $("era-chips").innerHTML = WORLD.eras.map((e) =>
      `<button class="chip${e.id === "all" ? " active" : ""}" data-era="${e.id}">${esc(e.label)}</button>`).join("");
    $("clan").innerHTML = WORLD.clans.map((c) => `<option value="${esc(c.id)}">${esc(c.label)}</option>`).join("");

    $("era-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-era]"); if (!b) return;
      state.era = b.dataset.era; state.page = 1;
      $("era-chips").querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
      render();
    });
    $("clan").addEventListener("change", (e) => { state.clan = e.target.value; state.page = 1; render(); });
    $("sort").addEventListener("change", (e) => { state.sort = e.target.value; state.page = 1; render(); });
    let t;
    $("q").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = e.target.value; state.page = 1; render(); }, 120);
    });

    document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
    document.querySelectorAll("[data-tab-link]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); setTab(a.dataset.tabLink, true);
    }));

    $("pager").addEventListener("click", (e) => {
      const b = e.target.closest("[data-page]"); if (!b || b.disabled) return;
      state.page = Number(b.dataset.page); render(true);
    });
    $("pager").addEventListener("change", (e) => {
      if (!e.target.matches("[data-per]")) return;
      const first = (state.page - 1) * state.per;
      state.per = Number(e.target.value);
      state.page = Math.floor(first / state.per) + 1;
      try { localStorage.setItem("sc-per-page", String(state.per)); } catch (err) { /* storage blocked */ }
      render();
    });

    const grid = $("grid");
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".s-scroll")) return;             // plain link to the scroll
      const card = e.target.closest(".s-card"); if (card) openPreview(card.dataset.id);
    });
    grid.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("s-card")) {
        e.preventDefault(); openPreview(e.target.dataset.id);
      }
    });
    // arrow keys flip pages when focus isn't in a field and no preview is open
    document.addEventListener("keydown", (e) => {
      if (window.CharacterPreview && window.CharacterPreview.isOpen()) return;
      if (e.target.closest("input, select, textarea")) return;
      const pages = Math.max(1, Math.ceil(lastList.length / state.per));
      if (e.key === "ArrowRight" && state.page < pages) { state.page++; render(true); }
      if (e.key === "ArrowLeft" && state.page > 1) { state.page--; render(true); }
    });

    if (window.CharacterPreview) {
      window.CharacterPreview.onChronicle((c) => {
        const url = c.isWeapon ? `scroll.html?weapon=${c.id}` : c.isBijuu ? `scroll.html?bijuu=${c.id}` : `scroll.html?focus=${c.id}`;
        location.href = url;
      });
    }
  }

  bind();
  const fromHash = readHash();
  setTab(state.tab, false, state.page);
  if (fromHash) requestAnimationFrame(() => $("archive").scrollIntoView({ block: "start" }));
})();
