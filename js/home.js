/* ==========================================================================
   SHINOBI CHRONICLES: website home: paginated card archive
   Cards open the same full-screen animated preview as the Lineage Scroll
   (preview.js). "Read Chronicle" / "On the scroll" deep-link into html/scroll.html.
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
  const EYES = WORLD.eyes || [];
  const COLOSSI = WORLD.colossi || [];
  const KEKKEI = WORLD.kekkei || [];
  const byId = (id) => CHARS.find((c) => c.id === id);
  const groupsOf = (c) => Object.keys(WORLD.groups || {}).filter((g) => WORLD.groups[g].includes(c.id));
  const hostOf = (id) => BIJUU.filter((b) => b.jinchuriki.includes(id));
  const WEAPON_GLYPH = { Sword: "刀", "Short Sword": "刀", Swords: "刀", "Spirit Sword": "剣", "Spirit Shield": "鏡",
    Scythe: "鎌", "War Fan": "扇", Staff: "棒", Kunai: "苦", "Chakra Orbs": "玉", "Ninja Tool": "具", "Trench Knives": "刃" };
  const auraHex = (c) => (WORLD.auraColors && WORLD.auraColors[c.aura]) || "#6B5B45";

  const PAGE_SIZES = [8, 12, 16, 24];
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = () => (REDUCED && REDUCED.matches ? "auto" : "smooth");
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
    aura: "bijuu", auraColor: b.color, image: b.image, video: b.video, folder: "tail-beast",
    jutsu: b.abilities.map((ab) => [ab, natureOf(ab), "Bijuu"]), bijuu: []
  });
  const weaponAsCharacter = (w) => ({
    id: w.id, isWeapon: true, folder: "weapons", glyph: WEAPON_GLYPH[w.type] || "武",
    name: w.name, jp: w.jp, clan: w.type, era: [],
    title: "Wielded by " + w.owners.map((o) => (byId(o) || { name: o }).name).join(", "),
    aura: "weapon", auraColor: "#8A8FA0", image: w.image, video: w.video,
    jutsu: [[w.ability, "Weapon", w.type, w.clip]], bijuu: []
  });
  /* Eyes, Colossi and Kekkei Genkai share one shape (users / others / abilities);
     preview.js turns them into preview objects so both pages link them the same way. */
  const wielders = (e) => [...e.users.map((u) => (byId(u) || { name: u }).name), ...(e.others || [])];
  const relicCollection = (kind, title, sub, glyph, title2) => ({
    title, sub, items: WORLD[kind] || [], folder: window.CharacterPreview.relics[kind].folder,
    color: (e) => e.color, glyph: () => glyph,
    tag: (e) => e.clan, num: () => "",
    text: (e) => [e.name, e.jp, e.type, e.clan, e.lore, ...(e.natures || []), ...e.abilities.map((a) => a[0]), ...wielders(e)].join(" "),
    meta: (e) => [...e.users.map((id) => [(byId(id) || { name: id }).name, auraHex(byId(id) || {})]),
      ...(e.others || []).map((n) => [n, e.color])].slice(0, 3).map(([n, c]) =>
      `<span class="s-dot" style="--dot:${c}">${esc(n)}</span>`).join(""),
    title2, preview: (e) => window.CharacterPreview.relic(kind, e)
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
      preview: (c) => c
    },
    bijuu: {
      title: "Tailed Beasts", sub: "The nine Bijuu and the primordial Ten-Tails, with their hosts.",
      items: BIJUU, folder: "tail-beast",
      color: (b) => b.color, glyph: () => "尾",
      tag: (b) => b.nature, num: (b) => b.tails,
      text: (b) => [b.name, b.jp, b.nature, b.lore, ...b.abilities, ...b.jinchuriki.map((id) => (byId(id) || {}).name)].join(" "),
      meta: (b) => b.jinchuriki.slice(0, 3).map((id) =>
        `<span class="s-dot" style="--dot:${auraHex(byId(id) || {})}">${esc((byId(id) || { name: id }).name)}</span>`).join(""),
      title2: (b) => `${b.tails}-Tails`,
      preview: bijuuAsCharacter
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
      preview: weaponAsCharacter
    },
    eyes: relicCollection("eyes", "Dōjutsu",
      "Eye techniques of the Uchiha, Hyūga and Ōtsutsuki, and those who carry them.", "眼", (e) => e.type),
    colossi: relicCollection("colossi", "Colossi",
      "Giant constructs, Susanoo and summoned titans that tower over the battlefield.", "巨", (e) => e.type),
    kekkei: relicCollection("kekkei", "Kekkei Genkai",
      "Bloodline natures that fuse two or three chakra types into something new.", "血",
      (e) => (e.natures && e.natures.length ? e.natures.join(" + ") : e.type))
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
  /* Media lookups. With js/media-index.js we know which files exist, so cards
     get a direct, lazy-loaded <img> and a clip count without probing. */
  const PV = window.CharacterPreview;
  const INDEX = PV && PV.mediaIndex;
  const EXTS = ["webp", "png", "jpg", "jpeg", "gif"];
  function indexedArt(it) {
    const C = col();
    const hit = [it.image, ...EXTS.map((e) => `assets/${C.folder}/${it.id}.${e}`)].filter(Boolean)
      .find((p) => !/^assets\//.test(p) || INDEX.has(p));
    return hit ? PV.url(hit) : null;
  }
  // clips per character folder, counted once instead of scanning the index for every card
  const CLIPS_BY_FOLDER = new Map();
  if (INDEX) INDEX.forEach((p) => {
    const m = p.match(/^assets\/videos\/([^/]+)\//);
    if (m) CLIPS_BY_FOLDER.set(m[1], (CLIPS_BY_FOLDER.get(m[1]) || 0) + 1);
  });
  function clipCount(it) {
    if (!INDEX) return 0;
    if (state.tab === "weapons") return it.clip && INDEX.has(it.clip) ? 1 : 0;
    if (it.abilities && it.users) {                     // eyes, colossi, kekkei genkai
      const own = [it.video, `assets/videos/${it.id}/${it.id}.mp4`].some((p) => p && INDEX.has(p)) ? 1 : 0;
      return own + it.abilities.filter((a) => a[2] && INDEX.has(a[2])).length;
    }
    if (state.tab === "bijuu") return [it.video, `assets/videos/bijuu/${it.tails}.mp4`].filter((p) => p && INDEX.has(p)).length ? 1 : 0;
    const own = CLIPS_BY_FOLDER.get(it.id) || 0;
    const extra = it.jutsu.filter((j) => j[3] && INDEX.has(j[3]) && !j[3].startsWith(`assets/videos/${it.id}/`)).length;
    return own + extra;
  }

  function cardHtml(it, i) {
    const C = col();
    const sub = C.title2 ? C.title2(it) : it.title;
    const clips = clipCount(it);
    const src = INDEX ? indexedArt(it) : null;
    return `<button type="button" class="s-card" data-id="${esc(it.id)}"
        style="--c:${C.color(it)};--i:${i}" aria-label="${esc(it.name)}: open full-screen preview">
      <span class="s-art${src ? " loading" : ""}">
        <span class="s-glyph" aria-hidden="true">${esc(C.glyph(it))}</span>
        <img alt="" decoding="async" loading="lazy" data-img${src ? ` src="${esc(src)}"` : ""}>
        <span class="s-tag">${esc(C.tag(it))}</span>
        ${C.num(it) !== "" ? `<span class="s-num">${esc(C.num(it))}</span>` : ""}
      </span>
      <span class="s-body">
        <span class="s-name">${esc(it.name)}</span>
        <span class="s-jp">${esc(it.jp || "")}</span>
        <span class="s-title">${esc(sub)}</span>
        <span class="s-meta">${C.meta(it)}</span>
        <span class="s-foot">
          <span class="s-open">⛶ Preview</span>
          ${clips ? `<span class="s-clips" title="${clips} video clip${clips > 1 ? "s" : ""}">▶ ${clips} clip${clips > 1 ? "s" : ""}</span>` : ""}
        </span>
      </span>
    </button>`;
  }

  function loadArt(card, it) {
    const img = card.querySelector("[data-img]");
    const art = card.querySelector(".s-art");
    const show = () => { art.classList.remove("loading"); img.classList.add("loaded"); art.classList.add("has-img"); };
    const fail = () => { art.classList.remove("loading"); };
    if (img.getAttribute("src")) {                       // indexed: already pointing at the file
      if (img.complete && img.naturalWidth) show(); else { img.onload = show; img.onerror = fail; }
      return;
    }
    if (!PV || !PV.findImage) return;
    PV.findImage(it, col().folder).then((src) => {
      if (!src || !img.isConnected) return;
      img.onload = show; img.src = src;
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
    if (scrollToTop) $("archive").scrollIntoView({ behavior: smooth(), block: "start" });
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
    const m = location.hash.match(/^#(characters|bijuu|weapons|eyes|colossi|kekkei)(?:\/(\d+))?$/);
    if (!m) return false;
    state.tab = m[1]; state.page = Number(m[2] || 1);
    return true;
  }

  /* ------------------------------------------------------------------ controls */
  function setTab(tab, scroll, page = 1) {
    state.tab = tab; state.page = page;
    document.querySelectorAll(".tab").forEach((t) => {
      const on = t.dataset.tab === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;                 // roving tabindex: arrows move between tabs
    });
    document.querySelectorAll("[data-tab-link]").forEach((a) => a.classList.toggle("active", a.dataset.tabLink === tab));
    $("era-group").hidden = $("clan-group").hidden = tab !== "characters";
    $("q").placeholder = tab === "characters" ? "Search name, clan, jutsu…"
      : tab === "bijuu" ? "Search beast, host, ability…"
      : tab === "eyes" ? "Search Dōjutsu, clan, user, ability…"
      : tab === "colossi" ? "Search colossus, summoner, ability…"
      : tab === "kekkei" ? "Search nature, clan, user, jutsu…" : "Search weapon, wielder, power…";
    render(scroll);
  }

  function openPreview(id) {
    const it = col().items.find((x) => x.id === id);
    if (it && PV) PV.open(col().preview(it));
  }
  const indexInList = (c) => lastList.findIndex((x) => x.id === c.id);
  if (PV && PV.setNavigator) PV.setNavigator({
    step(current, dir) {
      if (!lastList.length) return null;
      const i = indexInList(current);
      const next = lastList[((i < 0 ? 0 : i + dir) + lastList.length) % lastList.length];
      const page = Math.floor(lastList.indexOf(next) / state.per) + 1;
      if (page !== state.page) { state.page = page; render(); }   // grid follows along behind the preview
      return col().preview(next);
    },
    label(current) {
      const i = indexInList(current);
      return i < 0 ? "" : `${i + 1} / ${lastList.length}`;
    }
  });

  function bind() {
    $("hero-stats").innerHTML = [
      ["Shinobi", CHARS.length], ["Tailed Beasts", BIJUU.length],
      ["Weapons", WEAPONS.length], ["Dōjutsu", EYES.length], ["Colossi", COLOSSI.length], ["Kekkei Genkai", KEKKEI.length], ["Relationships", (WORLD.links || []).length]
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
    $("grid").closest(".archive").querySelector("[role=tablist]").addEventListener("keydown", (e) => {
      const tabs = [...document.querySelectorAll(".tab")];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault(); e.stopPropagation();
      const t = tabs[(to + tabs.length) % tabs.length];
      setTab(t.dataset.tab); t.focus();
    });
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
      const card = e.target.closest(".s-card"); if (card) openPreview(card.dataset.id);
    });
    // arrow keys flip pages when focus isn't in a field and no preview is open
    $("q").addEventListener("keydown", (e) => {
      if (e.key === "Escape" && e.target.value) {
        e.preventDefault(); e.target.value = ""; state.q = ""; state.page = 1; render();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (PV && PV.isOpen()) return;
      if (e.target.closest("input, select, textarea")) return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault(); $("archive").scrollIntoView({ block: "start" }); $("q").focus(); return;
      }
      const pages = Math.max(1, Math.ceil(lastList.length / state.per));
      if (e.key === "ArrowRight" && state.page < pages) { state.page++; render(true); }
      if (e.key === "ArrowLeft" && state.page > 1) { state.page--; render(true); }
    });

    // featured profile in the hero: opens that shinobi's full-screen preview,
    // where the clip plays with sound (the click counts as the user gesture)
    document.querySelectorAll("[data-preview]").forEach((b) => b.addEventListener("click", () => {
      if (state.tab !== "characters") setTab("characters");
      openPreview(b.dataset.preview);
    }));

    $("surprise").addEventListener("click", () => {
      if (state.tab !== "characters" || !lastList.length) setTab("characters");
      const pick = lastList[Math.floor(Math.random() * lastList.length)];
      if (pick) openPreview(pick.id);
    });
    const top = $("to-top");
    const onScroll = () => { top.hidden = window.scrollY < 900; };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: smooth() }));

    window.addEventListener("hashchange", () => {
      const tab = state.tab, page = state.page;
      if (readHash() && (state.tab !== tab || state.page !== page)) setTab(state.tab, true, state.page);
    });

    if (PV) {
      PV.onChronicle((c) => {
        const page = "html/scroll.html";
        const url = c.isWeapon ? `${page}?weapon=${c.id}` : c.isBijuu ? `${page}?bijuu=${c.id}`
          : c.relicKind ? (c.users[0] ? `${page}?focus=${c.users[0]}` : page) : `${page}?focus=${c.id}`;
        location.href = url;
      });
    }
  }

  bind();
  const fromHash = readHash();
  setTab(state.tab, false, state.page);
  if (fromHash) requestAnimationFrame(() => $("archive").scrollIntoView({ block: "start" }));
})();
