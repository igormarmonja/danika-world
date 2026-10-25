---
name: 2d-game-asset-generator
description: >-
  Mandatory pipeline for generating 2D game assets, Danika wardrobe outfits, characters, room props, and maps
  in the authentic Avatar World / Toca Life 2D illustrated cartoon style using AI image generation and sprite processing.
---

# 2D Game Asset & Wardrobe Generation Pipeline (STRICT RULES)

## 1. КАТЕГОРИЧНО ЗАБОРОНЕНО (STRICTLY FORBIDDEN)
- **НІКОЛИ НЕ МАЛЮВАТИ** одяг, персонажів, будівлі на карті або предмети інтер'єру програмними примітивами Python `PIL.ImageDraw` (`polygon`, `rectangle`, `ellipse`, `arc`, `line`) або примітивними інлайн-SVG ("каляками-маляками").
- Програмно намальовані геометричні фігури поверх спрайта Даніки виглядають як абстрактні прямокутники та псують гру.

## 2. ПРАВИЛЬНИЙ ПАЙПЛАЙН ГЕНЕРАЦІЇ ОДЯГУ ДАНІКИ (WARDROBE PIPELINE)
Для створення нових костюмів у гардероб ЗАВЖДИ використовується двокроковий процес (див. еталон у `build_modern_wardrobe_outfits.py`):

### Крок 1: AI-генерація одягу на дерев'яних вішалках (`image-generator`)
- Генерувати **2x2 аркуші костюмів на дерев'яних вішалках** (`2x2 grid sheet on a pure solid white background #FFFFFF`) за допомогою субагента `image-generator`.
- **Промпт стилю**:
  `2x2 grid of 4 cute 2D cartoon children's/youth streetwear outfits hanging on wooden coat hangers, isolated on a pure solid white background (#FFFFFF). Avatar World / Toca Life mobile game 2D illustration style, bold dark warm-brown outlines (#3b1803), soft cel-shading, rich fabric textures, cohesive proportions, no characters, only the complete outfit (top + pants/skirt matched together as one piece on a wooden hanger) in each of the 4 quadrants.`

### Крок 2: Вирізання вішалок та одягання Даніки (`dress_danika_with_garment`)
1. Розрізати 2x2 аркуш на 4 квадранти.
2. Очистити білий фон та білий контур наліпки функцією `remove_white_bg_and_sticker_border(crop)`.
3. Зберегти іконку одягу на вішалці у `assets/wardrobe/outfit_<id>.png` через `fit_on_canvas(clean, 500, 560, pad=22)`.
4. Одягнути Даніку функцією `dress_danika_with_garment(base_danika_path, legs_source_path, garment_rgba, garment_box, show_lower_legs)`:
   - Функція автоматично прибирає верхній гачок вішалки (`strip_hanger_top`),
   - Бере оригінальну голову, личко та золотисто-русяве волосся Даніки (`head_layer`),
   - Бере оригінальні долоньки Даніки (`hands_layer`) та оригінальні кросівки/ніжки (`shoes_layer`),
   - Комбінує їх із AI-намальованим одягом у стандартному розмірі `600×900 RGBA` та зберігає у `assets/characters/<id>.png`.
5. Обов'язково згенерувати перевірочний колаж (`verification_sheet.png`) і перевірити результат візуально через `read_file`!

## 3. ПРАВИЛЬНИЙ ПАЙПЛАЙН ДЛЯ КАРТИ ТА ПРЕДМЕТІВ ІНТЕР'ЄРУ
- **Карта міста (`assets/map/gandia_map.jpg`)**: Генерується цілісною 2D-ілюстрацією через `image-generator` у стилі гри, де всі будівлі (Дім Даніки, Colegio Abecé, Mercadona, Danika Hotel, Mascotas, La Vital, Chachi Piruli, Парк, Пляж) намальовані в єдиному ізометричному мультяшному стилі прямо на карті. Клікабельні зони робляться прозорими HTML-хотспотами поверх намальованих будівель.
- **Предмети інтер'єру (`assets/furniture/hotel_items/*.png`)**: Генеруються як 2D ілюстративні растрові об'єкти через `image-generator` (2x2 або 3x3 аркушами на білому фоні з подальшим вирізанням фону), а не через `PIL.ImageDraw` чи примітивні SVG.
