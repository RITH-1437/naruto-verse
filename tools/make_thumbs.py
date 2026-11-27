"""Write small WebP thumbnails of the artwork for the Lineage Scroll.

The scroll shows ~110 portraits at once in 40-100px circles. Loading the full
artwork for each (35 MB) is wasteful, so the scroll, relationship chips, flow
view and search results use these thumbnails instead; the full-screen preview
and the home-page cards still load the original files.

    python tools/make_thumbs.py          # only (re)builds missing or outdated thumbs
    python tools/make_thumbs.py --force  # rebuild everything

Reads   assets/characters/<id>.*  and  assets/weapons/<id>.*
Writes  assets/thumbs/characters/<id>.webp  and  assets/thumbs/weapons/<id>.webp
The originals are never modified. Run tools/build_media_index.py afterwards
(this script does it for you when anything changed). Needs Pillow.
"""
from pathlib import Path
import subprocess
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FOLDERS = ["characters", "tail-beast", "eyes", "colossi", "kekkei-genkai", "weapons"]
EXTS = [".webp", ".png", ".jpg", ".jpeg", ".gif"]   # same priority as the site
WIDTH = 256                                         # 2x the largest avatar (104px)


def main():
    force = "--force" in sys.argv
    written = removed = 0
    for folder in FOLDERS:
        src_dir, out_dir = ROOT / "assets" / folder, ROOT / "assets" / "thumbs" / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        best = {}
        for p in sorted(src_dir.iterdir()):
            if p.suffix.lower() in EXTS and p.stem not in best:
                best[p.stem] = p
            elif p.suffix.lower() in EXTS and EXTS.index(p.suffix.lower()) < EXTS.index(best[p.stem].suffix.lower()):
                best[p.stem] = p
        on_disk = {q.name.lower(): q for q in out_dir.glob("*.webp")}
        for stem, src in best.items():
            out = out_dir / f"{stem}.webp"
            twin = on_disk.get(out.name.lower())
            if twin and twin.name != out.name:     # case-only rename (Windows): fix the thumb's case
                tmp = twin.with_name("_case_" + twin.name)
                twin.rename(tmp); tmp.rename(out)
            if not force and out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
                continue
            with Image.open(src) as im:
                im.seek(0)
                im = im.convert("RGBA")
                if im.width > WIDTH:
                    im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
                im.save(out, "WEBP", quality=78, method=6)
            written += 1
        for stale in out_dir.glob("*.webp"):
            if stale.stem in best:
                continue
            # On a case-insensitive disk (Windows) "Kokugan.webp" may be the very same
            # file as the live thumb "kokugan.webp" after a case-only rename: keep it.
            twin = next((out_dir / f"{k}.webp" for k in best if k.lower() == stale.stem.lower()), None)
            if twin and twin.exists() and twin.samefile(stale):
                continue
            stale.unlink()
            removed += 1
    print(f"thumbs: {written} written, {removed} removed")
    if written or removed:
        subprocess.run([sys.executable, str(ROOT / "tools" / "build_media_index.py")], check=True)


if __name__ == "__main__":
    main()
