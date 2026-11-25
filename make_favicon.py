"""Generate favicon assets from the navbar's red 忍 seal.

Run once with:  python make_favicon.py
Outputs: favicon.ico, favicon-16.png, favicon-32.png, apple-touch-icon.png
The vector version lives in favicon.svg and is maintained by hand.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
FONT = next(
    (p for p in [
        Path(r"C:\Windows\Fonts\YuGothB.ttc"),
        Path(r"C:\Windows\Fonts\msgothic.ttc"),
        Path("C:/Windows/Fonts/YuGothB.ttc"),
    ] if p.exists()),
    None,
)
INK_RED = (180, 72, 46, 255)      # --red  #B4482E
PAPER = (244, 235, 208, 255)      # --paper #F4EBD0
PAPER_DARK = (232, 216, 181, 255)  # --paper-2 #E8D8B5
S = 512


def layer(size):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # parchment tile with a soft ink edge
    d.rounded_rectangle([6, 6, size - 6, size - 6], radius=int(size * .13), fill=PAPER,
                        outline=(43, 33, 24, 255), width=max(2, int(size * .012)))
    d.ellipse([int(size * .14), int(size * .10), int(size * .86), int(size * .48)],
              fill=(255, 252, 242, 32))
    # faint inner paper shading
    d.rounded_rectangle([int(size * .045), int(size * .045), int(size * .955), int(size * .955)],
                        radius=int(size * .11), outline=PAPER_DARK, width=max(2, int(size * .014)))
    return im, d


def seal(size, angle=-4):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    m = int(size * .25)
    box = [m, m, size - m, size - m]
    d.rounded_rectangle(box, radius=int(size * .035), outline=INK_RED,
                        width=max(3, int(size * .026)))
    # faint inset echo of the navbar seal shadow
    d.rounded_rectangle([m + int(size * .035), m + int(size * .035),
                         size - m - int(size * .035), size - m - int(size * .035)],
                        radius=int(size * .02), outline=(180, 72, 46, 45),
                        width=max(2, int(size * .014)))
    font = (ImageFont.truetype(str(FONT), int(size * .45), index=0)
            if FONT else ImageFont.load_default(size=int(size * .45)))
    text = "\u5fcd"  # 忍
    bb = d.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text(((size - tw) / 2 - bb[0], (size - th) / 2 - bb[1] - int(size * .01)),
           text, font=font, fill=INK_RED)
    return im.rotate(angle, resample=Image.Resampling.BICUBIC, expand=False)


def render(size):
    base, _ = layer(size)
    mark = seal(size)
    base.alpha_composite(mark)
    return base.convert("RGBA")


def main():
    big = render(S)
    ico = big.resize((256, 256), Image.Resampling.LANCZOS)
    ico.save(HERE / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    for sz, name in [(16, "favicon-16.png"), (32, "favicon-32.png"), (180, "apple-touch-icon.png")]:
        big.resize((sz, sz), Image.Resampling.LANCZOS).save(HERE / name)
    print("wrote favicon.ico, favicon-16.png, favicon-32.png, apple-touch-icon.png")


if __name__ == "__main__":
    main()
