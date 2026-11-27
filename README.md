# Shinobi Chronicles: The Naruto-Verse Lineage & Bijuu Scroll

A complete, static, interactive parchment scroll of the Narutoverse: bloodlines,
marriages, reincarnation chains, sensei/student and team bonds, legendary weapons,
and the nine Tailed Beasts, from Kaguya through Naruto and Shippuden to Boruto.

Currently covers **116 characters**, **10 Bijuu**, **18 weapons**, **12 eyes**, **14 colossi**, **10 Kekkei Genkai** and **172 relationships**.
All but three characters have artwork: Sakumo Hatake, Iruka Umino and Konohamaru Sarutobi
show initials on the scroll and an ink silhouette in the preview until their pictures are added.
Zetsu appears as one combined character (both halves in a single profile).

## Run it

No build step, no dependencies, no backend.

- Double-click `index.html` (the website home), **or**
- In VS Code, use **Live Server** (this folder's `.vscode/settings.json` uses port `5501`).

Only the Google Fonts load from a CDN; everything else is local, so both pages work offline.

## Project structure

```text
naruto-verse/
├── index.html              Website home (the only page at the root): hero, scroll feature, card archive
├── html/
│   └── scroll.html         Interactive Lineage Scroll (SVG family tree, drawers)
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
│   ├── thumbs/             GENERATED 256px WebP thumbnails used on the scroll (see "Adding media")
│   └── icons/              Favicons (favicon.svg is the source)
└── tools/
    ├── check_site.py         Integrity check (links, scripts, media, every id in data.js)
    ├── build_media_index.py  Rebuilds js/media-index.js: python tools/build_media_index.py
    ├── make_thumbs.py        Rebuilds assets/thumbs/ from the artwork (needs Pillow)
    └── make_favicon.py       Regenerates the raster icons: python tools/make_favicon.py
```

Every page other than `index.html` lives in `html/`. Paths in `js/data.js` and `js/media-index.js`
stay relative to the site root (`assets/...`); a page in a sub-folder declares
`<html lang="en" data-root="../">` and `js/preview.js` prefixes every media URL with it.
The checker fails if a moved page forgets this.

Media is found by convention: every file is named after its `id` in `js/data.js`
(lowercase, no spaces), so most entries need no `image` or `video` field.

### Adding media

After adding, renaming or deleting anything in `assets/`, run:

```sh
python tools/make_thumbs.py          # new or changed artwork -> scroll thumbnails (also rebuilds the index)
python tools/build_media_index.py    # any other media change (videos, deletions)
```

The page only requests files listed in `js/media-index.js`, so the browser never asks for
files that don't exist (no 404s in the console, faster previews). **A new file stays invisible
until you rebuild the index.** Delete `js/media-index.js` to fall back to probing every path.

The Lineage Scroll shows over a hundred portraits at once, so it loads the small thumbnails in
`assets/thumbs/` (about 2.6 MB in total instead of 35 MB of full artwork). The full-screen preview
and the home-page cards still use the original files. The originals are never modified.

## Checking the site

```sh
python tools/check_site.py
```

Checks, without a browser, that every local link and `url()` resolves, both pages load the shared
scripts in the same order, `js/media-index.js` matches the files on disk, every artwork has a
thumbnail, and that `js/data.js` is consistent: every id used by links, Bijuu hosts, weapon wielders
and groups exists, hosts and beasts list each other, clans / eras / auras / natures are known,
explicit media paths exist, there are no duplicate ids or links, no parent cycles, no overlapping
nodes on the scroll, and the counts at the top of this README are right. The data part needs `node`
on the PATH (it is skipped with a note otherwise). Characters without artwork are listed as a note.
It exits non-zero on any problem.

## Home page

- A 4-column card grid (3 on tablets, 2 on phones) with pagination (8 / 12 / 16 / 24 per page).
- Cards show a **▶ clips** badge when the character has video clips, and load their artwork lazily.
- Tabs for **Shinobi**, **Tailed Beasts** and **Weapons**; search, era chips, clan/group filter and sort.
- **Click a card** to open the full-screen animated preview. Inside it, **‹ ›** or the arrow keys browse
  the current results (the grid follows to the right page), and **Read Chronicle** opens `html/scroll.html`
  focused on that entry: `html/scroll.html?focus=<id>`, `?bijuu=<id>`, `?weapon=<id>`
  (add `&view=scroll` to open the full scroll instead of the relationship flow).
- **🎲 Surprise me** summons a random shinobi from the current filters.
- Clips play **with sound** by default; the preview's Sound button turns it off (remembered per browser).
  If the browser blocks audible autoplay, the clip plays muted and the next tap or key press turns sound on.
- Keys: `/` search, `Esc` clears search, `←` / `→` flip pages (or browse inside the preview).
- The tab and page are kept in the URL hash, e.g. `index.html#bijuu/2`; the browser Back button works.

## Controls (Lineage Scroll)

- **Drag** the canvas to pan, **scroll** to zoom, `+` / `-` to zoom, `0` to fit.
- **Reset View** clears search and frames the entire verse.
- **Click a portrait** to open its full-screen animated preview, centred on the page: the character is summoned in a smoke puff with their chakra aura, and **Perform Jutsu** (or any jutsu chip) plays an effect for that chakra nature. **Read Chronicle** opens the profile; relationship chips pan to and open that person. `Esc` closes the preview.
- **Reincarnation Lines**: glowing dashed Indra→Madara→Sasuke and Ashura→Hashirama→Naruto chains.
- **Bijuu Links**: reveals the spirit realm and red/orange chakra threads to every host.
- **Sensei Links**: dotted master/apprentice connections.
- **Team / Comrades**: dashed violet links for canon squads and partnerships (Team 7 old and new, Team Minato,
  the Sannin, Teams 8, 10 and Guy, the Rain orphans, Tobirama's squad, Hebi/Taka, Akatsuki pairs). Shown in every member's profile.
- **Ancestral lines**: lighter dashed bloodlines skip generations (Indra → Tajima, Hashirama → Tsunade); profiles list
  them as **Ancestors / Descendants** rather than parents and children.
- **⚔ Weapons**: the scroll of special weapons (Samehada, Kusanagi, Totsuka Blade…); each opens its lore and wielders. Weapons also appear in profiles, search and the full-screen preview.
- **Era / Clan filters**: the Clan selector also has an **Akatsuki (group)** option that highlights the organisation's twelve members (Orochimaru included), and a **Land of Waves (arc)** option for Zabuza, Haku, the Demon Brothers, Gatō and Tazuna, while keeping everyone's real clan badges intact. Add other groups in `WORLD.groups` in `js/data.js`.
- Instant search by name, clan, group, jutsu or Bijuu. Search ignores accents, so `jugo` finds **Jūgo** and `choji` finds **Chōji**.
  `↓` / `↑` move through the results, `Enter` opens the first one.
- On touch screens, drag with one finger to pan and pinch with two to zoom.

## Accessibility

- Every control is reachable by keyboard with a visible focus ring; a skip link jumps to the archive / search.
- Portraits on the scroll are focusable buttons (`Tab`, then `Enter`); the archive tabs use arrow keys.
- Drawers move focus to their close button and return it when closed; closed drawers are `inert`.
  The full-screen preview keeps `Tab` inside the dialog and `Esc` closes it.
- `prefers-reduced-motion` turns off camera glides, smooth scrolling and the decorative animations.

## Bijuu intro videos

Each Tailed Beast plays a short intro clip when you open its full-screen preview, then
fades into its portrait. Clips live in `assets/videos/bijuu/`, named after the tail
count: `1.mp4` … `10.mp4` (WebM also works). Or set `video: "path/to/clip.mp4"`
on the beast in `js/data.js`. An explicit `video` field takes priority.

## Add a character

1. Add an object to `WORLD.characters` in `js/data.js` with `id`, `name`, `clan`,
   `era`, `title`, `aura`, `x`, `y`, `bio` and `jutsu`.
2. Add relationship entries to `WORLD.links` (`parent`, `spouse`, `sibling`, `reinc`, `sensei`, `team`).
   `team` and `sibling` links use `a`/`b` and appear as chips on both profiles. Add `lineage: true`
   to a `parent` link that skips generations. Pick an `x`/`y` that does not collide with another
   node (the checker reports overlaps).
3. Add artwork as `assets/characters/<id>.webp` (PNG / JPG also work; keep it under ~1400px), then run
   `python tools/make_thumbs.py`. Without artwork the character still works everywhere (initials and an ink silhouette).
   Skill clips go in `assets/videos/<id>/`, named after a word of the jutsu (see
   `assets/characters/README.md`). Weapons use `assets/weapons/<id>.png`.
4. If the character is a Jinchūriki, add their `id` to the beast's `jinchuriki` array.

The renderer, search, filters and relationship chips pick it up automatically. Run
`python tools/check_site.py` afterwards.
Aura colours live in `WORLD.auraColors`; chakra-nature badge colours in `WORLD.natures`.
