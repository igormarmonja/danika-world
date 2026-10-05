import os
from PIL import Image, ImageDraw

def crop_circle(img, center_x, center_y, radius, output_path):
    left = int(center_x - radius)
    top = int(center_y - radius)
    right = int(center_x + radius)
    bottom = int(center_y + radius)
    
    cropped = img.crop((left, top, right, bottom)).convert("RGBA")
    size = cropped.size
    
    # Створюємо маску кола з антиаліасингом
    scale = 4
    big_size = (size[0] * scale, size[1] * scale)
    mask = Image.new('L', big_size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, big_size[0], big_size[1]), fill=255)
    mask = mask.resize(size, Image.Resampling.LANCZOS)
    
    result = Image.new('RGBA', size, (0, 0, 0, 0))
    result.paste(cropped, (0, 0), mask=mask)
    
    result.save(output_path, "PNG")
    print(f"Saved: {output_path} | Size: {size} | Center: ({center_x}, {center_y})")

os.makedirs("assets/avatars", exist_ok=True)

# 1. Лист іконок Даніки
img_d = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542470.jpg")

# Вирізаємо 6 іконок Даніки:
# 1) Верхня ліва (усміхнена, квіти у волоссі, синє сяйво)
crop_circle(img_d, 150, 268, 122, "assets/avatars/danika_smile.png")
# 2) Верхня права (шолом, палець вгору, зелений фон)
crop_circle(img_d, 423, 268, 122, "assets/avatars/danika_helmet.png")
# 3) Середня ліва (здивована, фіолетовий фон)
crop_circle(img_d, 105, 502, 84, "assets/avatars/danika_surprised.png")
# 4) Середня центр (скейтборд, вогонь)
crop_circle(img_d, 287, 502, 84, "assets/avatars/danika_skate.png")
# 5) Середня права (нюхає квітку, рожевий фон)
crop_circle(img_d, 468, 502, 84, "assets/avatars/danika_flower_smell.png")
# 6) Нижня права (тримає квітку, ніжний погляд)
crop_circle(img_d, 425, 750, 122, "assets/avatars/danika_flower_hold.png")

# 2. Лист іконок Бруно
img_b = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542339.jpg")

# Вирізаємо 6 іконок Бруно:
# 1) Верхня ліва (усміхнений Бруно з квіточками, синє сяйво)
crop_circle(img_b, 150, 268, 122, "assets/avatars/bruno_smile.png")
# 2) Верхня права (Бруно в рожевому шоломі, зелений фон)
crop_circle(img_b, 423, 268, 122, "assets/avatars/bruno_helmet.png")
# 3) Середня ліва (здивований Бруно з великими очима, фіолетовий фон)
crop_circle(img_b, 105, 502, 84, "assets/avatars/bruno_surprised.png")
# 4) Середня центр (Бруно на скейті у вогні)
crop_circle(img_b, 287, 502, 84, "assets/avatars/bruno_skate.png")
# 5) Середня права (Бруно тримає квітку в зубах)
crop_circle(img_b, 468, 502, 84, "assets/avatars/bruno_flower_mouth.png")
# 6) Нижня права (Бруно тримає квітку в лапках)
crop_circle(img_b, 425, 750, 122, "assets/avatars/bruno_flower_paws.png")

# 3. Велика картка Даніки на скейт-рампі (медіа 1788012542349)
img_d_skate_card = Image.open(r"C:\Users\Admin\.gemini\antigravity\brain\092f3a9b-87ef-48be-a876-e266f289809a\.user_uploaded\media_1788012542349.jpg")
cw, ch = img_d_skate_card.size
crop_circle(img_d_skate_card, cw/2, ch/2, min(cw, ch)*0.40, "assets/avatars/danika_peace_skate.png")

print("Всі аватари та наліпки успішно вирізані кружечками!")
