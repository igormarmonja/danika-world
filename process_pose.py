"""Chroma-key a generated pose image (solid bright green background) into a transparent PNG.

Usage: py -3 process_pose.py <input_image> <pose_name> [--lying]
Output: assets/characters/poses/<pose_name>.png  (RGBA, height normalised to 900px, or width 900 for --lying)
"""
import sys, os
from collections import deque
from PIL import Image, ImageFilter

def is_bg(r, g, b):
    # bright green screen (tolerant to JPEG-ish noise / anti-aliasing)
    return g > 120 and g > r + 45 and g > b + 45

def main():
    src, name = sys.argv[1], sys.argv[2]
    lying = '--lying' in sys.argv
    im = Image.open(src).convert('RGB')
    w, h = im.size
    px = im.load()
    # flood fill from every border pixel through background-coloured pixels only
    bg = bytearray(w * h)
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            dq.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            dq.append((x, y))
    while dq:
        x, y = dq.popleft()
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        i = y * w + x
        if bg[i]:
            continue
        r, g, b = px[x, y]
        if not is_bg(r, g, b):
            continue
        bg[i] = 1
        dq.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    alpha = Image.new('L', (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if bg[y * w + x]:
                ap[x, y] = 0
    # soften edge a little and kill green fringe
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert('RGBA')
    op = out.load()
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            a = ap[x, y]
            r, g, b, _ = op[x, y]
            if a < 255 and g > max(r, b):
                g = max(r, b)  # de-spill
            op[x, y] = (r, g, b, a)
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    if bbox:
        out = out.crop(bbox)
    if lying:
        nw = 900
        nh = max(1, round(out.height * nw / out.width))
    else:
        nh = 900
        nw = max(1, round(out.width * nh / out.height))
    out = out.resize((nw, nh), Image.LANCZOS)
    dest_dir = os.path.join('assets', 'characters', 'poses')
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, name + '.png')
    out.save(dest)
    print('saved', dest, out.size)

if __name__ == '__main__':
    main()
