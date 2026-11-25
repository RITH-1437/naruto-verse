# Shinobi Chronicles — The Naruto-Verse Lineage & Bijuu Scroll

A complete, static, interactive parchment scroll of the Narutoverse: bloodlines,
marriages, reincarnation chains, sensei/student and team bonds, legendary weapons,
and the nine Tailed Beasts — from Kaguya through Naruto and Shippuden to Boruto.

Currently covers **98 characters**, **10 Bijuu**, **17 weapons** and **119 relationships**,
all with artwork. Zetsu appears as one combined character (both halves in a single profile).

## Run it

No build step, no dependencies, no backend.

- Double-click `index.html`, **or**
- In VS Code, use **Live Server** (this folder's `.vscode/settings.json` uses port `5501`).

Tailwind CSS and the Google Fonts are loaded from CDNs; every layout-critical style is
also defined in `styles.css`, so the scroll still works if you are offline.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell: header, toolbar, SVG canvas, legends, all three drawers |
| `styles.css` | Parchment/ink theme, typography, controls, drawer, animations |
| `data.js` | **All** characters, Bijuu, eras, clans, natures and relationships |
| `preview.js` | Full-screen animated character preview (summon, chakra aura, jutsu effects) |
| `characters/` | Character artwork, normally named after the character `id` (see `characters/README.md`) |
| `videos/` | Optional character clips (`videos/<id>.mp4` or `.webm`); a clip plays instead of the image |
| `weapons/` | Optional weapon pictures (`weapons/<id>.png`); weapons themselves are listed in `WORLD.weapons` in `data.js` |
| `app.js` | SVG renderer, pan/zoom, filters, search, drawers, camera animation |
| `favicon.svg` / `favicon.ico` | The navbar's red 忍 seal as the site icon (raster assets regenerated with `python make_favicon.py`) |

## Controls

- **Drag** the canvas to pan, **scroll** to zoom, `+` / `-` to zoom, `0` to fit.
- **Reset View** clears search and frames the entire verse.
- **Click a portrait** to open its full-screen animated preview, centred on the page: the character is summoned in a smoke puff with their chakra aura, and **Perform Jutsu** (or any jutsu chip) plays an effect for that chakra nature. **Read Chronicle** opens the profile; relationship chips pan to and open that person. `Esc` closes the preview.
- **Reincarnation Lines** — glowing dashed Indra→Madara→Sasuke and Ashura→Hashirama→Naruto chains.
- **Bijuu Links** — reveals the spirit realm and red/orange chakra threads to every host.
- **Sensei Links** — dotted master/apprentice connections.
- **Team / Comrades** — dashed violet links for canon partnerships (Team 7, Hebi/Taka, Akatsuki pairs, Hyūga teams). Shown in every member's profile.
- **⚔ Weapons** — the scroll of special weapons (Samehada, Kusanagi, Totsuka Blade…); each opens its lore and wielders. Weapons also appear in profiles, search and the full-screen preview.
- **Era / Clan filters** — the Clan selector also has an **Akatsuki (group)** option that highlights the organisation's eleven members while keeping their real clan badges intact. Add other groups in `WORLD.groups` in `data.js`.
- Instant search by name, clan, group, jutsu or Bijuu. Search ignores accents, so `jugo` finds **Jūgo** and `choji` finds **Chōji**.

## Bijuu intro videos

Each Tailed Beast plays a short intro clip when you open its full-screen preview, then
fades into its portrait. Drop one file per beast in `videos/TAIL-BEAST/` named after its
tail count — `1.mp4` … `10.mp4` (WebM also works) — or set `video: "path/to/clip.mp4"`
on the beast in `data.js`. An explicit `video` field takes priority.
The Ten-Tails clip (`10.mp4`) is already wired up.

## Add a character

1. Add an object to `WORLD.characters` in `data.js` with `id`, `name`, `clan`,
   `era`, `title`, `aura`, `x`, `y`, `bio` and `jutsu`.
2. Add relationship entries to `WORLD.links` (`parent`, `spouse`, `reinc`, `sensei`, `team`).
   `team` links use `a`/`b` and appear as **Team / Comrades** chips on both profiles.
3. Add artwork as `characters/<id>.png` (or `.webp` / `.jpg`). If the filename cannot match
   the id (e.g. `jugo.png` for `juugo`), set `image: "characters/jugo.png"` on the character.
   The same rule applies to `weapons/<id>.png` and the `image` field on weapons.
4. If the character is a Jinchūriki, add their `id` to the beast's `jinchuriki` array.

The renderer, search, filters and relationship chips pick it up automatically.
Aura colours live in `WORLD.auraColors`; chakra-nature badge colours in `WORLD.natures`.
