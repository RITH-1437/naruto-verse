# Character artwork

Drop one image per character here, named after the character's `id` in `data.js`:

```text
assets/characters/naruto.webp
assets/characters/killer_b.webp
assets/characters/moon_main.webp
```

Supported: `.webp`, `.png`, `.jpg`, `.jpeg`, `.gif` (checked in that order). WebP is preferred: keep files under ~1400px and ~500 KB.
Every file here is named exactly after its id (lowercase, no spaces), so no `image:` field
is needed. Only set `image: "path/to/file.webp"` in `js/data.js` to point at artwork
elsewhere. Weapons follow the same rule in `assets/weapons/<id>.png`.

Tips

- Full-body, transparent-background cut-outs (PNG/WebP) look best: the figure stands
  on the summoning circle with the chakra aura glowing behind it.
- A portrait ratio around 3:4 fills the stage nicely; anything larger than ~1500px tall
  is wasted.
- Use artwork you have the rights to (your own drawings, commissioned or licensed art).

Video: put a clip in the character's own folder as `assets/videos/<id>/<id>.mp4` (`.webm` works too). It plays once, muted,
then fades into the image. The preview's **Sound** button turns the audio on.
Use H.264 MP4 or WebM so every browser can play it.

Skill clips: give any jutsu its own video. Name it `assets/videos/<id>/<word>.mp4` (or `<id>-<word>.mp4`), where `<word>` is any
word of the jutsu name of 4+ letters (`assets/videos/kaguya/kaguya-tsukuyomi.mp4`) or the whole name joined with dashes
(`assets/videos/obito/tailed-beast-ball.mp4`). Or add the path as a 4th entry on the jutsu in `js/data.js`:
`["Dimension Shift", "Space-Time", "Kekkei Mōra", "assets/videos/kaguya/kaguya-dimension.mp4"]`.
Clicking the jutsu plays its clip, then returns to the character image. Jutsu with a clip show a ▶ mark.

Characters without a file show a neutral ink-silhouette placeholder.

After adding or renaming files, run `python tools/build_media_index.py` from the repo root,
otherwise the site won't know the new file exists.
