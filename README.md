# Shinobi Chronicles — The Naruto-Verse Lineage & Bijuu Scroll

A complete, static, interactive parchment scroll of the Narutoverse: bloodlines,
marriages, reincarnation chains, sensei/student and team bonds, legendary weapons,
and the nine Tailed Beasts — from Kaguya through Naruto and Shippuden to Boruto.

Currently covers **98 characters**, **10 Bijuu**, **17 weapons** and **119 relationships**,
all with artwork. Zetsu appears as one combined character (both halves in a single profile).

## Run it

No build step, no dependencies, no backend.

- Double-click `index.html` (the website home), **or**
- In VS Code, use **Live Server** (this folder's `.vscode/settings.json` uses port `5501`).

Only the Google Fonts load from a CDN; everything else is local, so both pages work offline.

## Project structure

```text
naruto-verse/
├── index.html              Website home: hero, scroll feature, paginated card archive
├── scroll.html             Interactive Lineage Scroll (SVG family tree, drawers)
├── css/
│   ├── styles.css          Shared parchment/ink theme, scroll layout, full-screen preview
│   └── home.css            Home page layout: nav, hero, card grid, pagination
├── js/
│   ├── data.js             All characters, Bijuu, weapons, eras, clans and relationships
│   ├── media-index.js      GENERATED list of every file in assets/ (see "Adding media")
│   ├── preview.js          Full-screen animated preview + media discovery (shared)
│   ├── home.js             Home archive: tabs, filters, search, pagination
│   └── scroll.js           Scroll renderer: pan/zoom, links, filters, drawers, deep links
├── assets/
│   ├── characters/         Artwork, one WebP per id (assets/characters/<id>.webp)
│   ├── weapons/            Weapon pictures (assets/weapons/<id>.webp)
│   ├── videos/             Clips: <id>/<id>.mp4 intro, <id>/<jutsu-word>.mp4 skills, bijuu/<tails>.mp4
│   └── icons/              Favicons (favicon.svg is the source)
└── tools/
    ├── build_media_index.py  Rebuilds js/media-index.js: python tools/build_media_index.py
    └── make_favicon.py       Regenerates the raster icons: python tools/make_favicon.py
```

Media is found by convention: every file is named after its `id` in `js/data.js`
(lowercase, no spaces), so most entries need no `image` or `video` field.

### Adding media

After adding, renaming or deleting anything in `assets/`, run:

```sh
python tools/build_media_index.py
```

The page only requests files listed in `js/media-index.js`, so the browser never asks for
files that don't exist (no 404s in the console, faster previews). **A new file stays invisible
until you rebuild the index.** Delete `js/media-index.js` to fall back to probing every path.

## Home page

- A 4-column card grid (3 on tablets, 2 on phones) with pagination (8 / 12 / 16 / 24 per page).
- Cards show a **▶ clips** badge when the character has video clips, and load their artwork lazily.
- Tabs for **Shinobi**, **Tailed Beasts** and **Weapons**; search, era chips, clan/group filter and sort.
- **Click a card** to open the full-screen animated preview. Inside it, **‹ ›** or the arrow keys browse
  the current results (the grid follows to the right page), and **Read Chronicle** opens `scroll.html`
  focused on that entry: `scroll.html?focus=<id>`, `?bijuu=<id>`, `?weapon=<id>`.
- **🎲 Surprise me** summons a random shinobi from the current filters.
- Clips play **with sound** by default; the preview's Sound button turns it off (remembered per browser).
  If the browser blocks audible autoplay, the clip plays muted and the next tap or key press turns sound on.
- Keys: `/` search, `Esc` clears search, `←` / `→` flip pages (or browse inside the preview).
- The tab and page are kept in the URL hash, e.g. `index.html#bijuu/2`; the browser Back button works.

## Controls (Lineage Scroll)

- **Drag** the canvas to pan, **scroll** to zoom, `+` / `-` to zoom, `0` to fit.
- **Reset View** clears search and frames the entire verse.
- **Click a portrait** to open its full-screen animated preview, centred on the page: the character is summoned in a smoke puff with their chakra aura, and **Perform Jutsu** (or any jutsu chip) plays an effect for that chakra nature. **Read Chronicle** opens the profile; relationship chips pan to and open that person. `Esc` closes the preview.
- **Reincarnation Lines** — glowing dashed Indra→Madara→Sasuke and Ashura→Hashirama→Naruto chains.
- **Bijuu Links** — reveals the spirit realm and red/orange chakra threads to every host.
- **Sensei Links** — dotted master/apprentice connections.
- **Team / Comrades** — dashed violet links for canon partnerships (Team 7, Hebi/Taka, Akatsuki pairs, Hyūga teams). Shown in every member's profile.
- **⚔ Weapons** — the scroll of special weapons (Samehada, Kusanagi, Totsuka Blade…); each opens its lore and wielders. Weapons also appear in profiles, search and the full-screen preview.
- **Era / Clan filters** — the Clan selector also has an **Akatsuki (group)** option that highlights the organisation's eleven members while keeping their real clan badges intact. Add other groups in `WORLD.groups` in `js/data.js`.
- Instant search by name, clan, group, jutsu or Bijuu. Search ignores accents, so `jugo` finds **Jūgo** and `choji` finds **Chōji**.

## Bijuu intro videos

Each Tailed Beast plays a short intro clip when you open its full-screen preview, then
fades into its portrait. Clips live in `assets/videos/bijuu/`, named after the tail
count — `1.mp4` … `10.mp4` (WebM also works) — or set `video: "path/to/clip.mp4"`
on the beast in `js/data.js`. An explicit `video` field takes priority.

## Add a character

1. Add an object to `WORLD.characters` in `js/data.js` with `id`, `name`, `clan`,
   `era`, `title`, `aura`, `x`, `y`, `bio` and `jutsu`.
2. Add relationship entries to `WORLD.links` (`parent`, `spouse`, `reinc`, `sensei`, `team`).
   `team` links use `a`/`b` and appear as **Team / Comrades** chips on both profiles.
3. Add artwork as `assets/characters/<id>.webp` (PNG / JPG also work; keep it under ~1400px).
   Skill clips go in `assets/videos/<id>/`, named after a word of the jutsu (see
   `assets/characters/README.md`). Weapons use `assets/weapons/<id>.png`.
4. If the character is a Jinchūriki, add their `id` to the beast's `jinchuriki` array.

The renderer, search, filters and relationship chips pick it up automatically.
Aura colours live in `WORLD.auraColors`; chakra-nature badge colours in `WORLD.natures`.
