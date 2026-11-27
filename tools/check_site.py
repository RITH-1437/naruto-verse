"""Static integrity check for Shinobi Chronicles (naruto-verse).

    python tools/check_site.py

Checks, without a browser:
  * every local href/src in the HTML pages (and url() in the CSS) points at an existing file;
    only index.html sits at the root, other pages live in html/ and declare data-root="../"
    so root-relative media paths resolve; page links in HTML and JS hit real pages
  * every page loads the shared scripts in the same order (data, media index, preview, page)
  * every path in js/media-index.js exists on disk, every media file is indexed,
    and every artwork has a scroll thumbnail in assets/thumbs/
  * js/data.js loads in Node and every id reference resolves:
      links (parent / spouse / sibling / sensei / team / reinc), Bijuu jinchuriki, character bijuu,
      weapon owners, groups, clans, eras, auras, jutsu natures, explicit media paths,
      plus duplicate ids / links, self links, parent cycles and overlapping scroll nodes
    (skipped with a note if `node` is not installed)
  * the counts quoted in README.md match the data
Exits non-zero when anything fails. Notes (e.g. characters without artwork) never fail.
"""
from pathlib import Path
import json
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
PAGES = {"index.html": "js/home.js", "html/scroll.html": "js/scroll.js"}   # only index.html lives at the root
CORE = ["js/data.js", "js/media-index.js", "js/preview.js"]
MEDIA_FOLDERS = ["assets/characters", "assets/tail-beast", "assets/eyes", "assets/weapons", "assets/videos", "assets/thumbs"]
MEDIA_EXTS = {".webp", ".png", ".jpg", ".jpeg", ".gif", ".mp4", ".webm"}

NODE_CHECK = r"""
const W = require(process.argv[1]);
const problems = [], notes = [];
const P = (m) => problems.push(m);
const chars = W.characters, beasts = W.bijuu, arms = W.weapons || [], eyes = W.eyes || [];
const cid = new Map(chars.map((c) => [c.id, c]));
const bid = new Map(beasts.map((b) => [b.id, b]));
const seen = new Set();
for (const x of [...chars, ...beasts, ...arms, ...eyes]) {
  if (!x.id || !/^[a-z0-9_]+$/.test(x.id)) P(`bad id "${x.id}" (lowercase letters, digits, _ only)`);
  if (seen.has(x.id)) P(`duplicate id "${x.id}"`);
  seen.add(x.id);
}
const eras = new Set(W.eras.map((e) => e.id));
const clans = new Set(W.clans.map((c) => c.id));
const natures = new Set(Object.keys(W.natures));
const need = ["id", "name", "clan", "era", "title", "aura", "x", "y", "bio", "jutsu", "bijuu"];
for (const c of chars) {
  for (const k of need) if (c[k] === undefined) P(`character ${c.id}: missing field "${k}"`);
  (c.era || []).forEach((e) => { if (e === "all" || !eras.has(e)) P(`character ${c.id}: unknown era "${e}"`); });
  if (!clans.has(c.clan) || c.clan === "all") P(`character ${c.id}: clan "${c.clan}" is not in WORLD.clans`);
  if (!(c.aura in W.auraColors)) P(`character ${c.id}: unknown aura "${c.aura}"`);
  (c.jutsu || []).forEach((j) => {
    if (!Array.isArray(j) || j.length < 3) P(`character ${c.id}: malformed jutsu ${JSON.stringify(j)}`);
    else if (!natures.has(j[1])) P(`character ${c.id}: jutsu "${j[0]}" has unknown nature "${j[1]}"`);
  });
  (c.bijuu || []).forEach((b) => {
    if (!bid.has(b)) P(`character ${c.id}: unknown bijuu "${b}"`);
    else if (!bid.get(b).jinchuriki.includes(c.id)) P(`character ${c.id}: lists bijuu "${b}" but is not in its jinchuriki`);
  });
  if (!(c.x >= 0 && c.x <= W.meta.canvas.width && c.y >= 0 && c.y <= W.meta.canvas.height))
    P(`character ${c.id}: position ${c.x},${c.y} is outside the canvas`);
}
for (const b of beasts) {
  (b.jinchuriki || []).forEach((h) => {
    if (!cid.has(h)) P(`bijuu ${b.id}: unknown jinchuriki "${h}"`);
    else if (!(cid.get(h).bijuu || []).includes(b.id)) P(`bijuu ${b.id}: host "${h}" does not list it in bijuu[]`);
  });
  if (new Set(b.jinchuriki).size !== b.jinchuriki.length) P(`bijuu ${b.id}: duplicate jinchuriki`);
}
for (const w of arms) {
  if (!w.owners || !w.owners.length) P(`weapon ${w.id}: no owners`);
  (w.owners || []).forEach((o) => { if (!cid.has(o)) P(`weapon ${w.id}: unknown wielder "${o}"`); });
}
for (const e of eyes) {
  if (!e.users || !e.users.length) P(`eye ${e.id}: no users`);
  (e.users || []).forEach((u) => { if (!cid.has(u)) P(`eye ${e.id}: unknown user "${u}"`); });
  (e.abilities || []).forEach((a) => { if (!natures.has(a[1])) P(`eye ${e.id}: ability "${a[0]}" has unknown nature "${a[1]}"`); });
}
for (const [g, ids] of Object.entries(W.groups || {})) {
  if (!clans.has(g)) P(`group ${g}: no matching entry in WORLD.clans (filter would be missing)`);
  ids.forEach((i) => { if (!cid.has(i)) P(`group ${g}: unknown member "${i}"`); });
}
const ROLES = { parent: ["p", "c"], spouse: ["a", "b"], sibling: ["a", "b"], sensei: ["s", "d"], team: ["a", "b"] };
const linkKeys = new Set();
const kids = new Map();
W.links.forEach((l, i) => {
  const tag = `link #${i} (${l.t})`;
  if (l.t === "reinc") {
    if (!Array.isArray(l.chain) || l.chain.length < 2) P(`${tag}: chain needs 2+ ids`);
    (l.chain || []).forEach((x) => { if (!cid.has(x)) P(`${tag}: unknown id "${x}"`); });
    return;
  }
  const roles = ROLES[l.t];
  if (!roles) { P(`${tag}: unknown link type`); return; }
  const [a, b] = roles.map((r) => l[r]);
  roles.forEach((r) => { if (!cid.has(l[r])) P(`${tag}: unknown ${r} "${l[r]}"`); });
  if (a === b) P(`${tag}: links "${a}" to itself`);
  const sym = l.t === "spouse" || l.t === "team" || l.t === "sibling";
  const key = l.t + ":" + (sym ? [a, b].sort().join("|") : a + ">" + b);
  if (linkKeys.has(key)) P(`${tag}: duplicate ${a} / ${b}`);
  linkKeys.add(key);
  if (l.t === "parent") { if (!kids.has(a)) kids.set(a, []); kids.get(a).push(b); }
});
// parent cycles
const state = new Map();
const visit = (n, path) => {
  if (state.get(n) === 1) { P(`parent cycle: ${[...path, n].join(" > ")}`); return; }
  if (state.get(n) === 2) return;
  state.set(n, 1);
  (kids.get(n) || []).forEach((k) => visit(k, [...path, n]));
  state.set(n, 2);
};
[...kids.keys()].forEach((k) => visit(k, []));
// overlapping nodes on the scroll (portrait radius 26, compact 17, bijuu 24; labels need ~30 more)
const pts = [...chars.map((c) => ({ id: c.id, x: c.x, y: c.y, r: c.compact ? 17 : 26 })),
  ...beasts.map((b) => ({ id: b.id, x: b.x, y: b.y, r: 24 }))];
for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
  const a = pts[i], b = pts[j];
  if (Math.abs(a.y - b.y) < 60 && Math.abs(a.x - b.x) < a.r + b.r + 30)
    P(`nodes overlap on the scroll: ${a.id} (${a.x},${a.y}) and ${b.id} (${b.x},${b.y})`);
}
// explicit media paths (checked against disk by the Python side)
const media = [];
chars.forEach((c) => { if (c.image) media.push([c.id, c.image]); if (c.video) media.push([c.id, c.video]);
  (c.jutsu || []).forEach((j) => { if (j[3]) media.push([c.id, j[3]]); }); });
beasts.forEach((b) => { if (b.image) media.push([b.id, b.image]); if (b.video) media.push([b.id, b.video]); });
eyes.forEach((e) => ["image", "video"].forEach((k) => { if (e[k]) media.push([e.id, e[k]]); }));
arms.forEach((w) => ["image", "video", "clip"].forEach((k) => { if (w[k]) media.push([w.id, w[k]]); }));
console.log(JSON.stringify({
  counts: { characters: chars.length, bijuu: beasts.length, weapons: arms.length, eyes: eyes.length, links: W.links.length },
  ids: { characters: chars.map((c) => c.id), bijuu: beasts.map((b) => b.id), weapons: arms.map((w) => w.id), eyes: eyes.map((e) => e.id) },
  media, problems
}));
"""


def local_refs(text, pattern):
    for ref in re.findall(pattern, text):
        if ref.startswith(("http:", "https:", "//", "mailto:", "data:", "#", "%23")) or not ref:
            continue
        yield ref.split("#")[0].split("?")[0]


def main():
    errors, notes = [], []

    # 1. pages: local links and script order
    for page, own in PAGES.items():
        path = ROOT / page
        html = path.read_text(encoding="utf-8")
        here = path.parent
        for ref in local_refs(html, r'(?:href|src)="([^"]*)"'):
            if ref and not (here / ref).resolve().exists():
                errors.append(f"{page}: missing {ref}")
        # links between pages must point at the real page paths (catches stale "scroll.html")
        for ref in local_refs(html, r'href="([^"]*\.html)'):
            target = (here / ref).resolve()
            if target.exists() and target.relative_to(ROOT.resolve()).as_posix() not in PAGES:
                errors.append(f"{page}: links to {ref}, which is not a site page")
        scripts = [(here / s).resolve().relative_to(ROOT.resolve()).as_posix()
                   for s in re.findall(r'<script[^>]*\ssrc="([^"]+)"', html)]
        if scripts != CORE + [own]:
            errors.append(f"{page}: scripts {scripts} should be {CORE + [own]}")
        # media paths are root-relative; pages in sub-folders say how to reach the root
        depth = page.count("/")
        m = re.search(r'<html[^>]*\sdata-root="([^"]*)"', html)
        if (m.group(1) if m else "") != "../" * depth:
            errors.append(f'{page}: <html data-root="{"../" * depth}"> is needed so media resolves')
        if not re.search(r'<html[^>]*\slang="', html):
            errors.append(f"{page}: <html> has no lang attribute")
    stray = sorted(p.name for p in ROOT.glob("*.html") if p.name != "index.html")
    if stray:
        errors.append(f"only index.html belongs at the root; move {', '.join(stray)} into html/")
    # deep links built in JS (home "Read Chronicle") must target real pages
    for js in sorted((ROOT / "js").glob("*.js")):
        for ref in re.findall(r'["`]((?:html/)?[a-z-]+\.html)', js.read_text(encoding="utf-8")):
            if not (ROOT / ref).exists():
                errors.append(f"js/{js.name}: link to missing page {ref}")
    for css in sorted((ROOT / "css").glob("*.css")):
        for ref in local_refs(css.read_text(encoding="utf-8"), r'url\(\s*["\']?([^"\')]+)["\']?\s*\)'):
            if not (css.parent / ref).resolve().exists():
                errors.append(f"css/{css.name}: missing url({ref})")

    # 2. media index
    idx = (ROOT / "js" / "media-index.js").read_text(encoding="utf-8")
    listed = json.loads(idx[idx.index("["): idx.rindex("]") + 1])
    for p in listed:
        if not (ROOT / p).exists():
            errors.append(f"media-index: {p} does not exist (run tools/build_media_index.py)")
    on_disk = {p.relative_to(ROOT).as_posix() for f in MEDIA_FOLDERS for p in (ROOT / f).rglob("*")
               if p.is_file() and p.suffix.lower() in MEDIA_EXTS}
    for p in sorted(on_disk - set(listed)):
        errors.append(f"media-index: {p} is not indexed (run tools/build_media_index.py)")
    listed_set = set(listed)
    # every artwork has a scroll thumbnail (tools/make_thumbs.py)
    for p in sorted(listed):
        m = re.match(r"assets/(characters|tail-beast|eyes|weapons)/([^/]+)\.(webp|png|jpe?g|gif)$", p)
        if m and f"assets/thumbs/{m.group(1)}/{m.group(2)}.webp" not in listed_set:
            errors.append(f"thumbs: no thumbnail for {p} (run tools/make_thumbs.py)")

    # 3. data references
    node = shutil.which("node")
    info = None
    if node:
        res = subprocess.run([node, "-e", NODE_CHECK, str(ROOT / "js" / "data.js")],
                             capture_output=True, text=True, encoding="utf-8")
        if res.returncode:
            errors.append("node data check failed:\n" + res.stderr.strip())
        else:
            info = json.loads(res.stdout.strip().splitlines()[-1])
            errors += [f"data: {p}" for p in info["problems"]]
            for owner, path in info["media"]:
                if not re.match(r"^(https?:|data:|//)", path) and not (ROOT / path).exists():
                    errors.append(f"data: {owner} points at missing media {path}")
            exts = ["webp", "png", "jpg", "jpeg", "gif"]
            has = lambda folder, i: any(f"assets/{folder}/{i}.{e}" in listed_set for e in exts)
            no_art = [i for i in info["ids"]["characters"] if not has("characters", i)]
            no_art += [i for i in info["ids"]["bijuu"] if not has("tail-beast", i)]
            no_art += [i for i in info["ids"]["weapons"] if not has("weapons", i)]
            no_art += [i for i in info["ids"]["eyes"] if not has("eyes", i)]
            if no_art:
                notes.append(f"no artwork yet (placeholder shown): {', '.join(no_art)}")
            c = info["counts"]
            print(f"data: {c['characters']} characters, {c['bijuu']} Tailed Beasts, "
                  f"{c['weapons']} weapons, {c['eyes']} eyes, {c['links']} relationships")
    else:
        notes.append("node not found, data reference check skipped")

    # 4. README counts
    if info:
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        c = info["counts"]
        for label, key in [("characters", "characters"), ("Bijuu", "bijuu"),
                           ("weapons", "weapons"), ("relationships", "links")]:
            m = re.search(r"\*\*(\d+) " + label + r"\*\*", readme)
            if m and int(m.group(1)) != c[key]:
                errors.append(f"README.md says {m.group(1)} {label}, data has {c[key]}")

    for n in notes:
        print("note:", n)
    if errors:
        print("\n".join(errors))
        print(f"FAILED ({len(errors)} problems)")
        sys.exit(1)
    print(f"OK: {len(PAGES)} pages, {len(listed)} media files, no broken references")


if __name__ == "__main__":
    main()
