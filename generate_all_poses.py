import os
import math
from collections import deque
from PIL import Image, ImageDraw

CHAR_DIR = os.path.join('assets', 'characters')
POSES_DIR = os.path.join(CHAR_DIR, 'poses')
os.makedirs(POSES_DIR, exist_ok=True)

OUTLINE = (59, 24, 3, 255)       # #3b1803 thick cartoon outline
SKIN_BASE = (250, 184, 150, 255) # Danika warm peach skin
SKIN_SHADOW = (232, 156, 122, 255)
CHEEK_PINK = (244, 126, 126, 150)


def load_sprite(filename):
    im = Image.open(os.path.join(CHAR_DIR, filename)).convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(600, h):
        for x in range(240, 340):
            r, g, b, a = px[x, y]
            if a > 0 and max(r, g, b) - min(r, g, b) <= 12 and 155 <= (r + g + b) // 3 <= 248:
                px[x, y] = (0, 0, 0, 0)
    return im


def detect_face_landmarks(im):
    """Auto-detect left iris center, right iris center, and mouth center for exact alignment."""
    px = im.load()
    blue_xs, blue_ys = [], []
    for y in range(215, 305):
        for x in range(160, 430):
            r, g, b, a = px[x, y]
            if a > 200 and b > r + 20 and b > 90:
                blue_xs.append(x)
                blue_ys.append(y)
    if not blue_xs:
        return (225, 266), (323, 266), (275, 318), SKIN_BASE
    mid_x = (min(blue_xs) + max(blue_xs)) / 2.0
    left_pts = [(x, y) for x, y in zip(blue_xs, blue_ys) if x < mid_x]
    right_pts = [(x, y) for x, y in zip(blue_xs, blue_ys) if x >= mid_x]
    lx = int(round(sum(p[0] for p in left_pts) / len(left_pts)))
    ly = int(round(sum(p[1] for p in left_pts) / len(left_pts)))
    rx = int(round(sum(p[0] for p in right_pts) / len(right_pts)))
    ry = int(round(sum(p[1] for p in right_pts) / len(right_pts)))
    cx = (lx + rx) // 2
    cy_eyes = (ly + ry) // 2

    # Detect mouth center below eyes
    mouth_xs, mouth_ys = [], []
    for y in range(cy_eyes + 34, cy_eyes + 78):
        for x in range(cx - 45, cx + 45):
            r, g, b, a = px[x, y]
            if a > 200 and r < 145 and g < 85 and b < 85:
                mouth_xs.append(x)
                mouth_ys.append(y)
    if mouth_xs:
        mx = int(round(sum(mouth_xs) / len(mouth_xs)))
        my = int(round(sum(mouth_ys) / len(mouth_ys)))
    else:
        mx, my = cx, cy_eyes + 54

    # Sample actual forehead/cheek skin color from between the eyes
    sr, sg, sb, sa = px[cx, cy_eyes]
    skin = (sr, sg, sb, 255)
    return (lx, ly), (rx, ry), (mx, my), skin


def make_overlay(w=600, h=900, scale=3):
    img = Image.new('RGBA', (w * scale, h * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw, scale


def finish_overlay(base_im, over_img):
    over_small = over_img.resize(base_im.size, Image.LANCZOS)
    return Image.alpha_composite(base_im, over_small)


def apply_special_expression(im, expr):
    """Apply pixel-aligned sleeping, sad_crying, or sick facial expressions using auto-detected landmarks."""
    base = im.copy()
    (lx, ly), (rx, ry), (mx, my), skin = detect_face_landmarks(base)
    over, d, s = make_overlay()

    if expr == 'sleeping':
        for (ex, ey, is_left) in [(lx, ly, True), (rx, ry, False)]:
            # Cover full open eye + upper lash with matched skin tone
            d.ellipse([(ex - 39)*s, (ey - 34)*s, (ex + 39)*s, (ey + 28)*s], fill=skin)
            # Soft eyelid crease arc
            d.arc([(ex - 33)*s, (ey - 24)*s, (ex + 33)*s, (ey + 16)*s],
                  start=195, end=345, fill=SKIN_SHADOW, width=3*s)
            # Peaceful closed sleeping eyelash curve
            d.arc([(ex - 31)*s, (ey - 20)*s, (ex + 31)*s, (ey + 16)*s],
                  start=15, end=165, fill=OUTLINE, width=5*s)
            # Cute outer eyelashes
            if is_left:
                d.line([(ex - 29)*s, (ey + 2)*s, (ex - 40)*s, (ey + 10)*s], fill=OUTLINE, width=4*s)
                d.line([(ex - 12)*s, (ey + 13)*s, (ex - 17)*s, (ey + 23)*s], fill=OUTLINE, width=4*s)
            else:
                d.line([(ex + 29)*s, (ey + 2)*s, (ex + 40)*s, (ey + 10)*s], fill=OUTLINE, width=4*s)
                d.line([(ex + 12)*s, (ey + 13)*s, (ex + 17)*s, (ey + 23)*s], fill=OUTLINE, width=4*s)
        # Soft rosy cheeks
        d.ellipse([(lx - 45)*s, (ly + 18)*s, (lx - 2)*s, (ly + 42)*s], fill=CHEEK_PINK)
        d.ellipse([(rx + 2)*s, (ry + 18)*s, (rx + 45)*s, (ry + 42)*s], fill=CHEEK_PINK)

    elif expr == 'sad_crying':
        # Cover existing eyebrows above each eye and draw sad upturned brows
        for (ex, ey, is_left) in [(lx, ly, True), (rx, ry, False)]:
            d.ellipse([(ex - 36)*s, (ey - 60)*s, (ex + 36)*s, (ey - 28)*s], fill=skin)
            if is_left:
                d.line([(ex - 30)*s, (ey - 36)*s, (ex + 24)*s, (ey - 50)*s], fill=(120, 68, 32, 255), width=6*s)
            else:
                d.line([(ex - 24)*s, (ey - 50)*s, (ex + 30)*s, (ey - 36)*s], fill=(120, 68, 32, 255), width=6*s)
        # Cover original smile with matched skin and draw sad trembling frown
        d.ellipse([(mx - 44)*s, (my - 18)*s, (mx + 44)*s, (my + 18)*s], fill=skin)
        d.arc([(mx - 22)*s, (my - 4)*s, (mx + 22)*s, (my + 22)*s], start=195, end=345, fill=OUTLINE, width=5*s)
        # Glossy sky-blue cartoon teardrops streaming from outer eye corners
        for (tx, ty, r_sz) in [
            (lx - 28, ly + 22, 10),
            (rx + 28, ry + 22, 10),
            (lx - 32, ly + 50, 8),
            (rx + 32, ry + 50, 8),
        ]:
            pts = [
                (tx*s, (ty - r_sz*1.3)*s),
                ((tx - r_sz)*s, (ty + r_sz*0.2)*s),
                (tx*s, (ty + r_sz)*s),
                ((tx + r_sz)*s, (ty + r_sz*0.2)*s),
            ]
            d.polygon(pts, fill=(56, 189, 248, 255))
            d.ellipse([(tx - r_sz)*s, (ty - r_sz*0.4)*s, (tx + r_sz)*s, (ty + r_sz)*s],
                      fill=(56, 189, 248, 255), outline=OUTLINE, width=3*s)
            d.ellipse([(tx - r_sz*0.4)*s, ty*s, (tx - r_sz*0.05)*s, (ty + r_sz*0.45)*s],
                      fill=(255, 255, 255, 235))

    elif expr == 'sick':
        # Half-closed droopy eyelids over top half of each eye
        for (ex, ey) in [(lx, ly), (rx, ry)]:
            d.chord([(ex - 36)*s, (ey - 32)*s, (ex + 36)*s, (ey + 18)*s],
                    start=180, end=360, fill=skin, outline=OUTLINE, width=4*s)
            d.line([(ex - 36)*s, (ey - 6)*s, (ex + 36)*s, (ey - 6)*s], fill=OUTLINE, width=5*s)
        # Feverish rosy blush on cheeks
        d.ellipse([(lx - 44)*s, (ly + 16)*s, (lx + 10)*s, (ly + 46)*s], fill=(239, 68, 68, 115))
        d.ellipse([(rx - 10)*s, (ry + 16)*s, (rx + 44)*s, (ry + 46)*s], fill=(239, 68, 68, 115))
        # Cover original smile and draw tired slight frown
        d.ellipse([(mx - 44)*s, (my - 18)*s, (mx + 44)*s, (my + 18)*s], fill=skin)
        d.arc([(mx - 20)*s, (my - 2)*s, (mx + 20)*s, (my + 20)*s], start=195, end=345, fill=OUTLINE, width=5*s)

    return finish_overlay(base, over), (lx, ly), (rx, ry), (mx, my), skin


def draw_cel_circle(d, cx, cy, r, fill, outline=OUTLINE, width=10):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill, outline=outline, width=width)


def draw_sparkle(d, cx, cy, size, fill=(250, 204, 21, 255)):
    pts = [
        (cx, cy - size),
        (cx + size * 0.28, cy - size * 0.28),
        (cx + size, cy),
        (cx + size * 0.28, cy + size * 0.28),
        (cx, cy + size),
        (cx - size * 0.28, cy + size * 0.28),
        (cx - size, cy),
        (cx - size * 0.28, cy - size * 0.28),
    ]
    d.polygon(pts, fill=fill, outline=OUTLINE)


def build_all():
    pajama = load_sprite('danika_danika_pajama.png')
    denim = load_sprite('danika_danika_denim.png')
    artist = load_sprite('danika_danika_artist.png')
    varsity = load_sprite('danika_danika_varsity.png')
    winter = load_sprite('danika_danika_winter.png')
    cat_hoodie = load_sprite('danika_danika_cat_hoodie.png')
    daisy = load_sprite('danika_danika_daisy.png')
    beach = load_sprite('danika_danika_beach.png')
    safari = load_sprite('danika_danika_safari.png')
    sport = load_sprite('danika_danika_sport.png')
    skater = load_sprite('danika_danika_skater.png')
    spa_towel = load_sprite('danika_danika_spa_towel.png')
    princess = load_sprite('danika_danika_princess.png')
    flamenco = load_sprite('danika_danika_flamenco.png')
    trench = load_sprite('danika_danika_trench.png')
    bruno_happy = load_sprite('bruno_happy.png')

    # =========================================================================
    # 1. danika_sleeping.png — Cozy sleeping on pillow under starry quilt!
    # =========================================================================
    sleep_char, _, _, _, _ = apply_special_expression(pajama, 'sleeping')
    sleep_upper = sleep_char.crop((80, 60, 520, 560)).rotate(-18, resample=Image.BICUBIC, expand=True)
    canvas_sleep = Image.new('RGBA', (600, 900), (0, 0, 0, 0))
    over, d, s = make_overlay()
    d.rounded_rectangle([95*s, 235*s, 495*s, 455*s], radius=55*s, fill=(255, 251, 235, 255), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([115*s, 255*s, 475*s, 430*s], radius=42*s, fill=(254, 243, 199, 255))
    canvas_sleep = finish_overlay(canvas_sleep, over)
    canvas_sleep.alpha_composite(sleep_upper, (55, 150))
    over2, d2, s = make_overlay()
    d2.rounded_rectangle([85*s, 455*s, 515*s, 515*s], radius=24*s, fill=(255, 255, 255, 255), outline=OUTLINE, width=5*s)
    d2.rounded_rectangle([80*s, 492*s, 520*s, 725*s], radius=48*s, fill=(29, 132, 181, 255), outline=OUTLINE, width=5*s)
    d2.rounded_rectangle([98*s, 508*s, 502*s, 695*s], radius=38*s, fill=(56, 163, 209, 255))
    for (sx, sy, sr) in [(160, 560, 16), (290, 545, 20), (420, 565, 16), (220, 640, 18), (365, 635, 18)]:
        draw_sparkle(d2, sx*s, sy*s, sr*s, fill=(253, 224, 71, 255))
    d2.ellipse([145*s, 468*s, 205*s, 512*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d2.ellipse([390*s, 468*s, 450*s, 512*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    for (zx, zy, zsz) in [(445, 185, 22), (485, 135, 28), (525, 80, 34)]:
        d2.line([(zx - zsz)*s, (zy - zsz)*s, (zx + zsz)*s, (zy - zsz)*s], fill=(125, 211, 252, 255), width=6*s)
        d2.line([(zx + zsz)*s, (zy - zsz)*s, (zx - zsz)*s, (zy + zsz)*s], fill=(125, 211, 252, 255), width=6*s)
        d2.line([(zx - zsz)*s, (zy + zsz)*s, (zx + zsz)*s, (zy + zsz)*s], fill=(125, 211, 252, 255), width=6*s)
    canvas_sleep = finish_overlay(canvas_sleep, over2)
    canvas_sleep.save(os.path.join(POSES_DIR, 'danika_sleeping.png'))

    # =========================================================================
    # 2. danika_walk_bruno.png — Danika (safari) with REAL Bruno on a red leash!
    # =========================================================================
    walk_canvas = Image.new('RGBA', (600, 900), (0, 0, 0, 0))
    walk_canvas.alpha_composite(safari, (-45, 0))
    bruno_small = bruno_happy.resize((275, 275), Image.LANCZOS)
    walk_canvas.alpha_composite(bruno_small, (315, 595))
    over, d, s = make_overlay()
    d.rounded_rectangle([408*s, 724*s, 486*s, 744*s], radius=8*s, fill=(239, 68, 68, 255), outline=OUTLINE, width=4*s)
    draw_cel_circle(d, 446*s, 748*s, 10*s, fill=(250, 204, 21, 255), width=3*s)
    pts = []
    for t_i in range(31):
        t = t_i / 30.0
        bx = (1-t)**2 * 338 + 2*(1-t)*t * 355 + t**2 * 432
        by = (1-t)**2 * 482 + 2*(1-t)*t * 640 + t**2 * 728
        pts.append((bx*s, by*s))
    d.line(pts, fill=OUTLINE, width=11*s, joint='curve')
    d.line(pts, fill=(239, 68, 68, 255), width=6*s, joint='curve')
    d.ellipse([322*s, 468*s, 354*s, 496*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    walk_canvas = finish_overlay(walk_canvas, over)
    walk_canvas.save(os.path.join(POSES_DIR, 'danika_walk_bruno.png'))

    # =========================================================================
    # 3. danika_music.png — Danika (denim, no waving hand!) playing acoustic guitar!
    # =========================================================================
    (lx, ly), (rx, ry), _, _ = detect_face_landmarks(denim)
    hc_x = (lx + rx) // 2
    over, d, s = make_overlay()
    # Studio headphones aligned to her exact head center hc_x
    d.arc([(hc_x - 114)*s, 82*s, (hc_x + 114)*s, 290*s], start=192, end=348, fill=OUTLINE, width=16*s)
    d.arc([(hc_x - 114)*s, 82*s, (hc_x + 114)*s, 290*s], start=192, end=348, fill=(168, 85, 247, 255), width=10*s)
    d.rounded_rectangle([(hc_x - 132)*s, 212*s, (hc_x - 94)*s, 292*s], radius=16*s, fill=(168, 85, 247, 255), outline=OUTLINE, width=4*s)
    d.rounded_rectangle([(hc_x + 94)*s, 212*s, (hc_x + 132)*s, 292*s], radius=16*s, fill=(168, 85, 247, 255), outline=OUTLINE, width=4*s)
    d.ellipse([(hc_x - 124)*s, 228*s, (hc_x - 102)*s, 274*s], fill=(250, 204, 21, 255), outline=OUTLINE, width=3*s)
    d.ellipse([(hc_x + 102)*s, 228*s, (hc_x + 124)*s, 274*s], fill=(250, 204, 21, 255), outline=OUTLINE, width=3*s)

    # Acoustic guitar held across her body
    d.line([235*s, 385*s, 195*s, 520*s], fill=OUTLINE, width=14*s)
    d.line([235*s, 385*s, 195*s, 520*s], fill=(236, 72, 153, 255), width=8*s)
    neck_pts = [(275*s, 495*s), (435*s, 375*s), (452*s, 398*s), (292*s, 518*s)]
    d.polygon(neck_pts, fill=(120, 53, 15, 255), outline=OUTLINE, width=4*s)
    head_pts = [(432*s, 372*s), (478*s, 338*s), (498*s, 366*s), (452*s, 400*s)]
    d.polygon(head_pts, fill=(180, 83, 9, 255), outline=OUTLINE, width=4*s)
    for (px_i, py_i) in [(448, 346), (465, 334), (488, 374), (472, 386)]:
        draw_cel_circle(d, px_i*s, py_i*s, 6*s, fill=(254, 240, 138, 255), width=3*s)
    draw_cel_circle(d, 225*s, 558*s, 72*s, fill=(217, 119, 6, 255), width=5*s)
    draw_cel_circle(d, 288*s, 510*s, 54*s, fill=(217, 119, 6, 255), width=5*s)
    draw_cel_circle(d, 225*s, 558*s, 65*s, fill=(245, 158, 11, 255), outline=None, width=0)
    draw_cel_circle(d, 288*s, 510*s, 48*s, fill=(245, 158, 11, 255), outline=None, width=0)
    draw_cel_circle(d, 272*s, 522*s, 26*s, fill=(254, 240, 138, 255), width=3*s)
    draw_cel_circle(d, 272*s, 522*s, 20*s, fill=(69, 26, 3, 255), width=3*s)
    d.polygon([(195*s, 545*s), (228*s, 585*s), (216*s, 595*s), (183*s, 555*s)],
              fill=(120, 53, 15, 255), outline=OUTLINE, width=3*s)
    for off in (-6, -2, 2, 6):
        d.line([(206 + off)*s, (568 + off)*s, (444 + off)*s, (384 + off)*s], fill=(255, 251, 235, 235), width=2*s)
    d.ellipse([222*s, 492*s, 266*s, 534*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d.ellipse([372*s, 396*s, 414*s, 438*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    music_img = finish_overlay(denim, over)
    music_img.save(os.path.join(POSES_DIR, 'danika_music.png'))

    # =========================================================================
    # 4. danika_pizza_chef.png — Clean non-waving base (varsity) + Chef Toque & Pizza!
    # =========================================================================
    (lx, ly), (rx, ry), _, _ = detect_face_landmarks(varsity)
    hc_x = (lx + rx) // 2
    over, d, s = make_overlay()
    d.rounded_rectangle([(hc_x - 72)*s, 412*s, (hc_x + 72)*s, 610*s], radius=18*s, fill=(255, 255, 255, 255), outline=OUTLINE, width=4*s)
    d.line([(hc_x - 45)*s, 412*s, (hc_x - 35)*s, 372*s], fill=OUTLINE, width=5*s)
    d.line([(hc_x + 45)*s, 412*s, (hc_x + 35)*s, 372*s], fill=OUTLINE, width=5*s)
    draw_cel_circle(d, (hc_x - 50)*s, 78*s, 38*s, fill=(255, 255, 255, 255), width=5*s)
    draw_cel_circle(d, (hc_x + 50)*s, 78*s, 38*s, fill=(255, 255, 255, 255), width=5*s)
    draw_cel_circle(d, hc_x*s, 64*s, 46*s, fill=(255, 255, 255, 255), width=5*s)
    draw_cel_circle(d, (hc_x - 50)*s, 80*s, 33*s, fill=(248, 250, 252, 255), outline=None, width=0)
    draw_cel_circle(d, (hc_x + 50)*s, 80*s, 33*s, fill=(248, 250, 252, 255), outline=None, width=0)
    draw_cel_circle(d, hc_x*s, 66*s, 41*s, fill=(255, 255, 255, 255), outline=None, width=0)
    d.rounded_rectangle([(hc_x - 70)*s, 94*s, (hc_x + 70)*s, 128*s], radius=10*s, fill=(255, 255, 255, 255), outline=OUTLINE, width=5*s)
    d.line([(hc_x - 63)*s, 118*s, (hc_x + 63)*s, 118*s], fill=(239, 68, 68, 255), width=4*s)

    # Wooden pizza peel + hot pepperoni pizza
    d.rounded_rectangle([(hc_x + 65)*s, 512*s, (hc_x + 170)*s, 532*s], radius=8*s, fill=(180, 83, 9, 255), outline=OUTLINE, width=4*s)
    d.ellipse([(hc_x - 105)*s, 470*s, (hc_x + 105)*s, 575*s], fill=(217, 119, 6, 255), outline=OUTLINE, width=5*s)
    d.ellipse([(hc_x - 87)*s, 480*s, (hc_x + 87)*s, 565*s], fill=(245, 158, 11, 255), outline=OUTLINE, width=4*s)
    d.ellipse([(hc_x - 75)*s, 488*s, (hc_x + 75)*s, 557*s], fill=(253, 224, 71, 255), outline=OUTLINE, width=3*s)
    for (dx_i, py_i) in [(-45, 512), (0, 505), (40, 518), (-25, 536), (20, 538)]:
        px_i = hc_x + dx_i
        d.ellipse([(px_i-14)*s, (py_i-9)*s, (px_i+14)*s, (py_i+9)*s], fill=(220, 38, 38, 255), outline=OUTLINE, width=3*s)
    d.ellipse([(hc_x - 12)*s, 516*s, (hc_x + 12)*s, 530*s], fill=(34, 197, 94, 255), outline=OUTLINE, width=2*s)
    d.ellipse([(hc_x - 122)*s, 504*s, (hc_x - 82)*s, 544*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d.ellipse([(hc_x + 95)*s, 504*s, (hc_x + 135)*s, 544*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    chef_img = finish_overlay(varsity, over)
    chef_img.save(os.path.join(POSES_DIR, 'danika_pizza_chef.png'))

    # =========================================================================
    # 5. danika_candy.png — Holding a big glossy swirl lollipop!
    # =========================================================================
    over, d, s = make_overlay()
    d.line([405*s, 365*s, 375*s, 495*s], fill=OUTLINE, width=10*s)
    d.line([405*s, 365*s, 375*s, 495*s], fill=(255, 255, 255, 255), width=5*s)
    draw_cel_circle(d, 412*s, 335*s, 46*s, fill=(244, 114, 182, 255), width=5*s)
    draw_cel_circle(d, 412*s, 335*s, 34*s, fill=(253, 224, 71, 255), width=4*s)
    draw_cel_circle(d, 412*s, 335*s, 21*s, fill=(56, 189, 248, 255), width=4*s)
    draw_cel_circle(d, 412*s, 335*s, 9*s, fill=(255, 255, 255, 255), width=3*s)
    d.polygon([(400*s, 392*s), (378*s, 380*s), (382*s, 405*s)], fill=(236, 72, 153, 255), outline=OUTLINE, width=3*s)
    d.polygon([(400*s, 392*s), (422*s, 380*s), (418*s, 405*s)], fill=(236, 72, 153, 255), outline=OUTLINE, width=3*s)
    d.ellipse([362*s, 455*s, 402*s, 495*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    candy_img = finish_overlay(denim, over)
    candy_img.save(os.path.join(POSES_DIR, 'danika_candy.png'))

    # =========================================================================
    # 6. danika_icecream.png — Summer dress + Triple-scoop waffle cone!
    # =========================================================================
    over, d, s = make_overlay()
    d.polygon([(385*s, 425*s), (455*s, 425*s), (420*s, 545*s)], fill=(217, 119, 6, 255), outline=OUTLINE, width=5*s)
    d.line([398*s, 445*s, 438*s, 485*s], fill=OUTLINE, width=3*s)
    d.line([442*s, 445*s, 402*s, 485*s], fill=OUTLINE, width=3*s)
    draw_cel_circle(d, 402*s, 410*s, 28*s, fill=(146, 64, 14, 255), width=4*s)
    draw_cel_circle(d, 438*s, 410*s, 28*s, fill=(254, 249, 195, 255), width=4*s)
    draw_cel_circle(d, 420*s, 378*s, 30*s, fill=(244, 114, 182, 255), width=5*s)
    draw_cel_circle(d, 420*s, 342*s, 11*s, fill=(220, 38, 38, 255), width=3*s)
    d.arc([420*s, 315*s, 445*s, 342*s], start=180, end=290, fill=OUTLINE, width=3*s)
    d.ellipse([398*s, 475*s, 440*s, 515*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    ice_img = finish_overlay(beach, over)
    ice_img.save(os.path.join(POSES_DIR, 'danika_icecream.png'))

    # =========================================================================
    # 7. danika_hot_cocoa.png — Cozy cat-ears hoodie + Marshmallow Cocoa Mug!
    # =========================================================================
    over, d, s = make_overlay()
    d.arc([322*s, 448*s, 372*s, 512*s], start=270, end=90, fill=(220, 38, 38, 255), width=10*s)
    d.arc([322*s, 448*s, 372*s, 512*s], start=270, end=90, fill=OUTLINE, width=4*s)
    d.rounded_rectangle([245*s, 435*s, 345*s, 535*s], radius=20*s, fill=(239, 68, 68, 255), outline=OUTLINE, width=5*s)
    d.ellipse([250*s, 426*s, 340*s, 454*s], fill=(120, 53, 15, 255), outline=OUTLINE, width=4*s)
    for (mx, my) in [(272, 434), (296, 430), (318, 436)]:
        d.rounded_rectangle([(mx-10)*s, (my-8)*s, (mx+10)*s, (my+8)*s], radius=5*s, fill=(255, 255, 255, 255), outline=OUTLINE, width=3*s)
    draw_sparkle(d, 295*s, 490*s, 16*s, fill=(254, 240, 138, 255))
    d.ellipse([222*s, 468*s, 262*s, 512*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d.ellipse([328*s, 468*s, 368*s, 512*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    cocoa_img = finish_overlay(cat_hoodie, over)
    cocoa_img.save(os.path.join(POSES_DIR, 'danika_hot_cocoa.png'))

    # =========================================================================
    # 8. danika_reading.png — Holding an open hardcover storybook with both hands!
    # =========================================================================
    over, d, s = make_overlay()
    d.rounded_rectangle([192*s, 418*s, 398*s, 548*s], radius=14*s, fill=(3, 105, 161, 255), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([204*s, 426*s, 294*s, 536*s], radius=8*s, fill=(255, 251, 235, 255), outline=OUTLINE, width=4*s)
    d.rounded_rectangle([294*s, 426*s, 386*s, 536*s], radius=8*s, fill=(255, 251, 235, 255), outline=OUTLINE, width=4*s)
    draw_sparkle(d, 248*s, 480*s, 22*s, fill=(250, 204, 21, 255))
    for ly_i in (452, 474, 496, 514):
        d.line([310*s, ly_i*s, 368*s, ly_i*s], fill=(148, 163, 184, 255), width=4*s)
    d.ellipse([176*s, 465*s, 216*s, 505*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d.ellipse([374*s, 465*s, 414*s, 505*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    read_img = finish_overlay(varsity, over)
    read_img.save(os.path.join(POSES_DIR, 'danika_reading.png'))

    # =========================================================================
    # 9. danika_school_desk.png — Study notebook & pencil (clean non-waving base)!
    # =========================================================================
    over, d, s = make_overlay()
    d.polygon([(195*s, 470*s), (385*s, 470*s), (405*s, 560*s), (175*s, 560*s)],
              fill=(255, 255, 255, 255), outline=OUTLINE, width=5*s)
    d.line([290*s, 470*s, 290*s, 560*s], fill=OUTLINE, width=4*s)
    for ly_i in (492, 514, 536):
        d.line([202*s, ly_i*s, 275*s, ly_i*s], fill=(56, 189, 248, 255), width=3*s)
        d.line([305*s, ly_i*s, 378*s, ly_i*s], fill=(56, 189, 248, 255), width=3*s)
    draw_sparkle(d, 340*s, 515*s, 18*s, fill=(250, 204, 21, 255))
    d.line([345*s, 498*s, 415*s, 428*s], fill=OUTLINE, width=14*s)
    d.line([345*s, 498*s, 415*s, 428*s], fill=(250, 204, 21, 255), width=8*s)
    d.ellipse([372*s, 445*s, 412*s, 485*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    d.ellipse([170*s, 495*s, 210*s, 535*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    desk_img = finish_overlay(denim, over)
    desk_img.save(os.path.join(POSES_DIR, 'danika_school_desk.png'))

    # =========================================================================
    # 10. danika_scientist.png — Lab goggles on forehead + bubbling flask!
    # =========================================================================
    (lx, ly), (rx, ry), _, _ = detect_face_landmarks(varsity)
    hc_x = (lx + rx) // 2
    over, d, s = make_overlay()
    d.line([(hc_x - 105)*s, 195*s, (hc_x + 105)*s, 195*s], fill=OUTLINE, width=10*s)
    d.rounded_rectangle([(hc_x - 88)*s, 165*s, (hc_x - 8)*s, 218*s], radius=16*s, fill=(56, 189, 248, 230), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([(hc_x + 8)*s, 165*s, (hc_x + 88)*s, 218*s], radius=16*s, fill=(56, 189, 248, 230), outline=OUTLINE, width=5*s)
    d.line([(hc_x - 74)*s, 178*s, (hc_x - 51)*s, 178*s], fill=(255, 255, 255, 230), width=4*s)
    d.line([(hc_x + 22)*s, 178*s, (hc_x + 45)*s, 178*s], fill=(255, 255, 255, 230), width=4*s)
    flask_pts = [(375*s, 425*s), (405*s, 425*s), (405*s, 458*s), (445*s, 535*s), (335*s, 535*s), (375*s, 458*s)]
    d.polygon(flask_pts, fill=(224, 242, 254, 240), outline=OUTLINE, width=5*s)
    liq_pts = [(352*s, 495*s), (428*s, 495*s), (441*s, 531*s), (339*s, 531*s)]
    d.polygon(liq_pts, fill=(168, 85, 247, 255), outline=OUTLINE, width=3*s)
    for (bx_i, by_i, br) in [(385, 478, 8), (400, 405, 10), (378, 382, 7)]:
        draw_cel_circle(d, bx_i*s, by_i*s, br*s, fill=(74, 222, 128, 255), width=3*s)
    d.ellipse([342*s, 468*s, 382*s, 508*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    sci_img = finish_overlay(varsity, over)
    sci_img.save(os.path.join(POSES_DIR, 'danika_scientist.png'))

    # =========================================================================
    # 11. danika_painting.png — Rainbow overalls + Wooden Palette & Paintbrush!
    # =========================================================================
    over, d, s = make_overlay()
    d.ellipse([115*s, 455*s, 255*s, 555*s], fill=(253, 224, 71, 255), outline=OUTLINE, width=5*s)
    draw_cel_circle(d, 225*s, 515*s, 12*s, fill=(255, 255, 255, 255), width=4*s)
    for (px_i, py_i, col) in [
        (145, 490, (239, 68, 68, 255)),
        (172, 474, (59, 130, 246, 255)),
        (206, 480, (34, 197, 94, 255)),
        (165, 526, (168, 85, 247, 255)),
    ]:
        draw_cel_circle(d, px_i*s, py_i*s, 12*s, fill=col, width=3*s)
    d.line([385*s, 525*s, 455*s, 415*s], fill=OUTLINE, width=14*s)
    d.line([385*s, 525*s, 455*s, 415*s], fill=(217, 119, 6, 255), width=8*s)
    draw_cel_circle(d, 462*s, 405*s, 16*s, fill=(236, 72, 153, 255), width=4*s)
    d.ellipse([392*s, 465*s, 434*s, 505*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    paint_img = finish_overlay(artist, over)
    paint_img.save(os.path.join(POSES_DIR, 'danika_painting.png'))

    # =========================================================================
    # 12. danika_phone.png — Stylish coat + Pink Smartphone held by ear!
    # =========================================================================
    over, d, s = make_overlay()
    d.rounded_rectangle([382*s, 235*s, 442*s, 338*s], radius=14*s, fill=(244, 114, 182, 255), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([390*s, 247*s, 434*s, 322*s], radius=8*s, fill=(224, 242, 254, 255), outline=OUTLINE, width=3*s)
    draw_sparkle(d, 412*s, 284*s, 14*s, fill=(236, 72, 153, 255))
    d.ellipse([396*s, 312*s, 436*s, 352*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    phone_img = finish_overlay(trench, over)
    phone_img.save(os.path.join(POSES_DIR, 'danika_phone.png'))

    # =========================================================================
    # 13. danika_ball.png — Dynamic sports pose + Cel-shaded soccer ball!
    # =========================================================================
    over, d, s = make_overlay()
    draw_cel_circle(d, 445*s, 775*s, 56*s, fill=(255, 255, 255, 255), width=5*s)
    draw_cel_circle(d, 445*s, 775*s, 22*s, fill=(30, 41, 59, 255), width=4*s)
    for ang in range(0, 360, 72):
        rad = math.radians(ang)
        x1 = 445 + math.cos(rad) * 22
        y1 = 775 + math.sin(rad) * 22
        x2 = 445 + math.cos(rad) * 54
        y2 = 775 + math.sin(rad) * 54
        d.line([x1*s, y1*s, x2*s, y2*s], fill=OUTLINE, width=4*s)
    ball_img = finish_overlay(sport, over)
    ball_img.save(os.path.join(POSES_DIR, 'danika_ball.png'))

    # =========================================================================
    # 14. danika_skating.png — Clean dynamic skateboarding sprite!
    # =========================================================================
    skater.save(os.path.join(POSES_DIR, 'danika_skating.png'))

    # =========================================================================
    # 15. danika_dance.png — Dynamic dancing pose (flamenco) with sparkles!
    # =========================================================================
    over, d, s = make_overlay()
    draw_sparkle(d, 115*s, 280*s, 24*s, fill=(250, 204, 21, 255))
    draw_sparkle(d, 485*s, 260*s, 26*s, fill=(244, 114, 182, 255))
    draw_sparkle(d, 465*s, 420*s, 20*s, fill=(56, 189, 248, 255))
    dance_img = finish_overlay(flamenco, over)
    dance_img.save(os.path.join(POSES_DIR, 'danika_dance.png'))

    # =========================================================================
    # 16. danika_groceries.png — Carrying a Kraft Bag of Fresh Oranges & Baguette!
    # =========================================================================
    over, d, s = make_overlay()
    d.rounded_rectangle([392*s, 395*s, 432*s, 485*s], radius=16*s, fill=(245, 158, 11, 255), outline=OUTLINE, width=4*s)
    draw_cel_circle(d, 365*s, 445*s, 24*s, fill=(34, 197, 94, 255), width=4*s)
    draw_cel_circle(d, 440*s, 452*s, 20*s, fill=(249, 115, 22, 255), width=4*s)
    d.rounded_rectangle([342*s, 455*s, 462*s, 595*s], radius=14*s, fill=(217, 119, 6, 255), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([354*s, 468*s, 450*s, 582*s], radius=10*s, fill=(245, 158, 11, 255))
    draw_sparkle(d, 402*s, 525*s, 20*s, fill=(254, 240, 138, 255))
    d.ellipse([378*s, 462*s, 422*s, 502*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    groc_img = finish_overlay(denim, over)
    groc_img.save(os.path.join(POSES_DIR, 'danika_groceries.png'))

    # =========================================================================
    # 17. danika_cleaning.png — Sweeping with a detailed cel-shaded wooden broom!
    # =========================================================================
    over, d, s = make_overlay()
    d.line([345*s, 365*s, 455*s, 735*s], fill=OUTLINE, width=16*s)
    d.line([345*s, 365*s, 455*s, 735*s], fill=(180, 83, 9, 255), width=9*s)
    bristle_pts = [(422*s, 725*s), (485*s, 708*s), (522*s, 825*s), (425*s, 845*s)]
    d.polygon(bristle_pts, fill=(250, 204, 21, 255), outline=OUTLINE, width=5*s)
    d.rounded_rectangle([420*s, 712*s, 486*s, 736*s], radius=8*s, fill=(239, 68, 68, 255), outline=OUTLINE, width=4*s)
    d.ellipse([362*s, 465*s, 404*s, 505*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    draw_sparkle(d, 505*s, 680*s, 20*s, fill=(56, 189, 248, 255))
    clean_img = finish_overlay(safari, over)
    clean_img.save(os.path.join(POSES_DIR, 'danika_cleaning.png'))

    # =========================================================================
    # 18. danika_gardening.png — Floral dress + Mint Watering Can!
    # =========================================================================
    over, d, s = make_overlay()
    d.line([425*s, 495*s, 485*s, 445*s], fill=OUTLINE, width=14*s)
    d.line([425*s, 495*s, 485*s, 445*s], fill=(52, 211, 153, 255), width=8*s)
    d.ellipse([475*s, 430*s, 502*s, 460*s], fill=(250, 204, 21, 255), outline=OUTLINE, width=4*s)
    d.rounded_rectangle([355*s, 465*s, 445*s, 548*s], radius=18*s, fill=(52, 211, 153, 255), outline=OUTLINE, width=5*s)
    for (wx, wy) in [(500, 480), (515, 515), (492, 525)]:
        draw_cel_circle(d, wx*s, wy*s, 7*s, fill=(56, 189, 248, 255), width=3*s)
    gard_img = finish_overlay(daisy, over)
    gard_img.save(os.path.join(POSES_DIR, 'danika_gardening.png'))

    # =========================================================================
    # 19. danika_brush_teeth.png — Pajamas + Pink Toothbrush & Mint Foam Bubbles!
    # =========================================================================
    _, _, (mx, my), _ = detect_face_landmarks(pajama)
    over, d, s = make_overlay()
    for (fx, fy, fr) in [(mx - 12, my, 13), (mx + 8, my - 3, 15), (mx + 26, my + 2, 12)]:
        draw_cel_circle(d, fx*s, fy*s, fr*s, fill=(255, 255, 255, 255), width=3*s)
    d.line([(mx + 10)*s, my*s, (mx + 135)*s, (my + 65)*s], fill=OUTLINE, width=14*s)
    d.line([(mx + 10)*s, my*s, (mx + 135)*s, (my + 65)*s], fill=(244, 114, 182, 255), width=8*s)
    d.ellipse([(mx + 85)*s, (my + 25)*s, (mx + 128)*s, (my + 68)*s], fill=SKIN_BASE, outline=OUTLINE, width=4*s)
    draw_sparkle(d, (mx - 65)*s, (my - 12)*s, 18*s, fill=(56, 189, 248, 255))
    teeth_img = finish_overlay(pajama, over)
    teeth_img.save(os.path.join(POSES_DIR, 'danika_brush_teeth.png'))

    # =========================================================================
    # 20. danika_bubble_bath.png — Spa Bathrobe & Towel Turban + Bubbles & Rubber Duck!
    # =========================================================================
    over, d, s = make_overlay()
    for (bx_i, by_i, br) in [(135, 380, 26), (165, 320, 18), (445, 350, 28), (425, 430, 20), (155, 480, 22)]:
        draw_cel_circle(d, bx_i*s, by_i*s, br*s, fill=(224, 242, 254, 210), width=4*s)
        d.ellipse([(bx_i - br*0.5)*s, (by_i - br*0.5)*s, (bx_i - br*0.1)*s, (by_i - br*0.1)*s],
                  fill=(255, 255, 255, 240))
    draw_cel_circle(d, 405*s, 525*s, 28*s, fill=(250, 204, 21, 255), width=4*s)
    draw_cel_circle(d, 390*s, 492*s, 20*s, fill=(250, 204, 21, 255), width=4*s)
    d.polygon([(365*s, 492*s), (378*s, 486*s), (378*s, 498*s)], fill=(249, 115, 22, 255), outline=OUTLINE, width=3*s)
    draw_cel_circle(d, 386*s, 488*s, 4*s, fill=OUTLINE, width=1*s)
    bath_img = finish_overlay(spa_towel, over)
    bath_img.save(os.path.join(POSES_DIR, 'danika_bubble_bath.png'))

    # =========================================================================
    # 21. danika_sick.png — Cozy winter sweater + Droopy feverish face & Thermometer!
    # =========================================================================
    sick_base, (lx, ly), (rx, ry), (mx, my), _ = apply_special_expression(winter, 'sick')
    hc_x = (lx + rx) // 2
    over, d, s = make_overlay()
    d.line([(mx + 12)*s, (my + 4)*s, (mx + 72)*s, (my + 36)*s], fill=OUTLINE, width=12*s)
    d.line([(mx + 12)*s, (my + 4)*s, (mx + 72)*s, (my + 36)*s], fill=(255, 255, 255, 255), width=7*s)
    draw_cel_circle(d, (mx + 72)*s, (my + 36)*s, 8*s, fill=(239, 68, 68, 255), width=3*s)
    d.rounded_rectangle([(hc_x - 65)*s, 72*s, (hc_x + 65)*s, 108*s], radius=16*s, fill=(125, 211, 252, 255), outline=OUTLINE, width=4*s)
    sick_img = finish_overlay(sick_base, over)
    sick_img.save(os.path.join(POSES_DIR, 'danika_sick.png'))

    # =========================================================================
    # 22. danika_crying.png — Both arms down (denim), pixel-aligned sad teary face!
    # =========================================================================
    cry_img, _, _, _, _ = apply_special_expression(denim, 'sad_crying')
    cry_img.save(os.path.join(POSES_DIR, 'danika_crying.png'))

    # =========================================================================
    # 23. danika_princess_magic.png — Princess gown + Golden Tiara & Star Wand!
    # =========================================================================
    (lx, ly), (rx, ry), _, _ = detect_face_landmarks(princess)
    hc_x = (lx + rx) // 2
    over, d, s = make_overlay()
    tiara_pts = [
        ((hc_x - 55)*s, 112*s),
        ((hc_x - 42)*s, 72*s),
        ((hc_x - 20)*s, 96*s),
        (hc_x*s, 54*s),
        ((hc_x + 20)*s, 96*s),
        ((hc_x + 42)*s, 72*s),
        ((hc_x + 55)*s, 112*s),
    ]
    d.polygon(tiara_pts, fill=(250, 204, 21, 255), outline=OUTLINE, width=5*s)
    draw_cel_circle(d, hc_x*s, 88*s, 9*s, fill=(236, 72, 153, 255), width=3*s)
    d.line([412*s, 485*s, 468*s, 335*s], fill=OUTLINE, width=12*s)
    d.line([412*s, 485*s, 468*s, 335*s], fill=(250, 204, 21, 255), width=6*s)
    draw_sparkle(d, 468*s, 325*s, 32*s, fill=(253, 224, 71, 255))
    draw_sparkle(d, 515*s, 285*s, 16*s, fill=(244, 114, 182, 255))
    magic_img = finish_overlay(princess, over)
    magic_img.save(os.path.join(POSES_DIR, 'danika_princess_magic.png'))

    print("Successfully generated all 23 clean poses in assets/characters/poses/!")


if __name__ == '__main__':
    build_all()
