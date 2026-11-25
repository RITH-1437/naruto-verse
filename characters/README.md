# Character artwork

Drop one image per character here, named after the character's `id` in `data.js`:

```text
characters/naruto.png
characters/sasuke.webp
characters/kakashi.jpg
```

Supported: `.webp`, `.png`, `.jpg`, `.jpeg`, `.gif` (checked in that order). WebP is preferred: keep files under ~1400px and ~500 KB.
You can also point a character at any path with `image: "path/to/file.png"` in `data.js`.
This is required when the filename differs from the id — e.g. **Jūgo** has
`image: "characters/jugo.webp"` because his id is `juugo`. The same applies to
`weapons/` (e.g. Temari's fan uses `weapons/war-fan.png`).

Tips

- Full-body, transparent-background cut-outs (PNG/WebP) look best: the figure stands
  on the summoning circle with the chakra aura glowing behind it.
- A portrait ratio around 3:4 fills the stage nicely; anything larger than ~1500px tall
  is wasted.
- Use artwork you have the rights to (your own drawings, commissioned or licensed art).

Video: put a clip in the character's own folder as `videos/<id>/<id>.mp4` (or straight in `videos/` as `videos/<id>.mp4`; `.webm` works too). It plays once, muted,
then fades into the image. The preview's **Sound** button turns the audio on.
Use H.264 MP4 or WebM so every browser can play it.

Skill clips: give any jutsu its own video. Name it `videos/<id>/<id>-<word>.mp4` (or `videos/<id>-<word>.mp4`), where `<word>` is any
word of the jutsu name (`videos/kaguya-tsukuyomi.mp4`) or the whole name joined with dashes
(`videos/naruto-shadow-clone-jutsu.mp4`). Or add the path as a 4th entry on the jutsu in `data.js`:
`["Dimension Shift", "Space-Time", "Kekkei Mōra", "videos/kaguya-demension.mp4"]`.
Clicking the jutsu plays its clip, then returns to the character image. Jutsu with a clip show a ▶ mark.

Characters without a file show a neutral ink-silhouette placeholder.
