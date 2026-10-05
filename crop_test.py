import os
from PIL import Image, ImageDraw

def crop_circle(img, center_x, center_y, radius, output_path):
    # Вирізаємо квадрат
    left = int(center_x - radius)
    top = int(center_y - radius)
    right = int(center_x + radius)
    bottom = int(center_y + radius)
    
    cropped = img.crop((left, top, right, bottom)).convert("RGBA")
    
    # Створюємо круглу маску для ідеально гладкого кола з прозорим фоном
    size = cropped.size
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    
    # Застосовуємо маску
    result = Image.new('RGBA', size, (0, 0, 0, 0))
    result.paste(cropped, (0, 0), mask=mask)
    
    result.save(output_path, "PNG")
    print(f"Saved: {output_path} (size: {size})")

os.makedirs("assets/avatars", exist_ok=True)

# 1. Даніка (одиночна велика іконка)
img_danika_main = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542359.jpg")
w, h = img_danika_main.size
print(f"Danika main img: {w}x{h}")
# Центр кола на цій картинці
crop_circle(img_danika_main, w/2, h/2, min(w, h)*0.39, "assets/avatars/danika_main.png")

# 2. Лист іконок Даніки
img_danika_sheet = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542470.jpg")
dw, dh = img_danika_sheet.size
print(f"Danika sheet img: {dw}x{dh}")

# 3. Лист іконок Бруно
img_bruno_sheet = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542339.jpg")
bw, bh = img_bruno_sheet.size
print(f"Bruno sheet img: {bw}x{bh}")
