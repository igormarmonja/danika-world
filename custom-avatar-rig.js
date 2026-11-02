/**
 * AVATAR WORLD ILLUSTRATED MODULAR CHARACTER ENGINE (v20261102_4)
 * Real-time HTML5 Canvas Pixel-Mask Segmentation, Recoloring & Head/Body Compositing!
 * - Independently changes ONLY Skin Tone (8 tones) on the current character
 * - Independently changes ONLY Hair Color (12 colors) on the current character
 * - Independently changes ONLY Eye Iris Color (8 colors) on the current character
 * - Independently changes ONLY Outfit Color (10 colors) on the current character
 * - Mixes & matches Head/Hairstyle (15 styles) and Body/Outfit (15 outfits) seamlessly at the neck!
 */

window.AVATAR_CREATOR_CATALOG = {
  friends: [
    {
      id: 'friend_01',
      title: '🌸 Софія',
      img: 'assets/characters/friends/friend_01.png',
      chinRatio: 0.481,
      baseSkin: [254, 222, 201],
      skinTone: 'fair',
      hairStyle: 'twin_tails',
      top: 'hoodie_strawberry'
    },
    {
      id: 'friend_02',
      title: '👑 Аврора',
      img: 'assets/characters/friends/friend_02.png',
      chinRatio: 0.451,
      baseSkin: [252, 179, 134],
      skinTone: 'peach',
      hairStyle: 'long_waves',
      top: 'dress_princess'
    },
    {
      id: 'friend_03',
      title: '🌈 Мія',
      img: 'assets/characters/friends/friend_03.png',
      chinRatio: 0.454,
      baseSkin: [222, 142, 93],
      skinTone: 'sunkissed',
      hairStyle: 'space_buns',
      top: 'overalls_rainbow'
    },
    {
      id: 'friend_04',
      title: '🎧 Кіра',
      img: 'assets/characters/friends/friend_04.png',
      chinRatio: 0.459,
      baseSkin: [234, 202, 153],
      skinTone: 'olive',
      hairStyle: 'bob_cat',
      top: 'jacket_neon'
    },
    {
      id: 'friend_05',
      title: '💖 Зоя',
      img: 'assets/characters/friends/friend_05.png',
      chinRatio: 0.437,
      baseSkin: [148, 76, 52],
      skinTone: 'cocoa',
      hairStyle: 'curly_puff',
      top: 'dress_coral'
    },
    {
      id: 'friend_06',
      title: '🎨 Емма',
      img: 'assets/characters/friends/friend_06.png',
      chinRatio: 0.459,
      baseSkin: [254, 209, 183],
      skinTone: 'fair',
      hairStyle: 'braids_ginger',
      top: 'artist_apron'
    },
    {
      id: 'friend_07',
      title: '🛹 Алекс',
      img: 'assets/characters/friends/friend_07.png',
      chinRatio: 0.449,
      baseSkin: [253, 194, 154],
      skinTone: 'peach',
      hairStyle: 'sporty_spiky',
      top: 'varsity_red'
    },
    {
      id: 'friend_08',
      title: '🏖️ Лукас',
      img: 'assets/characters/friends/friend_08.png',
      chinRatio: 0.439,
      baseSkin: [228, 155, 103],
      skinTone: 'sunkissed',
      hairStyle: 'curly_cap',
      top: 'hoodie_beach'
    },
    {
      id: 'friend_09',
      title: '🎤 Белла',
      img: 'assets/characters/friends/friend_09.png',
      chinRatio: 0.459,
      baseSkin: [255, 201, 169],
      skinTone: 'peach',
      hairStyle: 'ponytail',
      top: 'popstar_pink'
    },
    {
      id: 'friend_10',
      title: '🧚‍♀️ Стефанія',
      img: 'assets/characters/friends/friend_10.png',
      chinRatio: 0.489,
      baseSkin: [255, 202, 170],
      skinTone: 'fair',
      hairStyle: 'rainbow_fairy',
      top: 'dress_fairy'
    },
    {
      id: 'friend_11',
      title: '👓 Юкі',
      img: 'assets/characters/friends/friend_11.png',
      chinRatio: 0.490,
      baseSkin: [240, 179, 135],
      skinTone: 'peach',
      hairStyle: 'hime_black',
      top: 'school_blazer'
    },
    {
      id: 'friend_12',
      title: '🌺 Флора',
      img: 'assets/characters/friends/friend_12.png',
      chinRatio: 0.488,
      baseSkin: [222, 140, 90],
      skinTone: 'bronze',
      hairStyle: 'flower_waves',
      top: 'dress_sunflower'
    },
    {
      id: 'friend_13',
      title: '🐰 Лілі',
      img: 'assets/characters/friends/friend_13.png',
      chinRatio: 0.483,
      baseSkin: [253, 215, 198],
      skinTone: 'fair',
      hairStyle: 'pink_curls',
      top: 'onesie_bunny'
    },
    {
      id: 'friend_14',
      title: '🔬 Макс',
      img: 'assets/characters/friends/friend_14.png',
      chinRatio: 0.450,
      baseSkin: [224, 157, 113],
      skinTone: 'olive',
      hairStyle: 'scientist_curls',
      top: 'lab_coat'
    },
    {
      id: 'friend_15',
      title: '🌹 Кармен',
      img: 'assets/characters/friends/friend_15.png',
      chinRatio: 0.488,
      baseSkin: [241, 175, 89],
      skinTone: 'sunkissed',
      hairStyle: 'braids_rose',
      top: 'dress_flamenco'
    }
  ],

  skinTones: [
    { id: 'original', title: 'Рідний тон шкіри', fill: 'linear-gradient(135deg,#ffefe2,#e0ac69)', rgb: null },
    { id: 'fair', title: 'Ніжна порцеляна', fill: '#ffe8d6', rgb: [255, 228, 208] },
    { id: 'peach', title: 'Теплий персик', fill: '#ffc89f', rgb: [254, 196, 154] },
    { id: 'sunkissed', title: 'Сонячна карамель', fill: '#efa668', rgb: [238, 162, 102] },
    { id: 'olive', title: 'Золотиста олива', fill: '#d99958', rgb: [218, 150, 88] },
    { id: 'bronze', title: 'Тропічна бронза', fill: '#b87238', rgb: [186, 112, 56] },
    { id: 'cocoa', title: 'Шоколадне какао', fill: '#8c4c2c', rgb: [142, 76, 46] },
    { id: 'pink_fairy', title: 'Казкова фея', fill: '#ffc8e2', rgb: [255, 198, 224] }
  ],

  hairColors: [
    { id: 'natural', title: 'Рідний колір', main: '#f6c85f', rgb: null },
    { id: 'golden', title: 'Золотистий блонд', main: '#f7c948', shade: [196, 134, 22], mid: [247, 201, 72], hi: [255, 243, 176] },
    { id: 'strawberry', title: 'Рожева полуниця', main: '#ff7eb6', shade: [198, 62, 118], mid: [255, 126, 182], hi: [255, 208, 230] },
    { id: 'chestnut', title: 'Теплий каштан', main: '#8d4f2a', shade: [78, 38, 16], mid: [141, 79, 42], hi: [198, 128, 82] },
    { id: 'black', title: 'Вороняче крило', main: '#2b2d42', shade: [20, 22, 34], mid: [48, 52, 76], hi: [102, 110, 148] },
    { id: 'ginger', title: 'Вогняно-рудий', main: '#ea580c', shade: [154, 42, 10], mid: [234, 98, 28], hi: [255, 174, 108] },
    { id: 'lilac', title: 'Лавандова мрія', main: '#a855f7', shade: [108, 42, 178], mid: [176, 108, 248], hi: [232, 204, 255] },
    { id: 'mint', title: 'М’ятна хвиля', main: '#34d399', shade: [18, 138, 98], mid: [62, 214, 162], hi: [192, 252, 232] },
    { id: 'turquoise', title: 'Океанська бірюза', main: '#0ea5e9', shade: [8, 102, 168], mid: [38, 178, 246], hi: [186, 236, 255] },
    { id: 'ruby', title: 'Рубінова вишня', main: '#e11d48', shade: [136, 14, 42], mid: [225, 38, 76], hi: [255, 148, 172] },
    { id: 'platinum', title: 'Перлинний блонд', main: '#e2e8f0', shade: [164, 174, 192], mid: [228, 234, 244], hi: [255, 255, 255] }
  ],

  eyeColors: [
    { id: 'original', title: 'Рідні оченята', hex: '#38bdf8', rgb: null },
    { id: 'blue', title: 'Сапфіровий синій', hex: '#2563eb', shade: [22, 52, 138], mid: [42, 108, 242], hi: [138, 198, 255] },
    { id: 'emerald', title: 'Смарагдовий зелений', hex: '#10b981', shade: [10, 96, 68], mid: [22, 188, 132], hi: [142, 244, 204] },
    { id: 'brown', title: 'Теплий карий', hex: '#854d0e', shade: [68, 32, 10], mid: [142, 78, 28], hi: [214, 142, 78] },
    { id: 'amber', title: 'Золотий бурштин', hex: '#f59e0b', shade: [138, 68, 8], mid: [242, 158, 18], hi: [255, 224, 118] },
    { id: 'violet', title: 'Фіалковий аметист', hex: '#8b5cf6', shade: [76, 29, 149], mid: [142, 92, 246], hi: [212, 188, 255] },
    { id: 'pink', title: 'Рожевий кварц', hex: '#ec4899', shade: [138, 24, 78], mid: [236, 72, 153], hi: [255, 182, 218] },
    { id: 'cyan', title: 'Морська лазур', hex: '#06b6d4', shade: [14, 98, 124], mid: [12, 188, 218], hi: [162, 244, 255] }
  ],

  outfitColors: [
    { id: 'original', title: 'Рідний колір одягу', main: '#f472b6', rgb: null },
    { id: 'pink', title: 'Рожева цукерка', main: '#f472b6', shade: [188, 42, 108], mid: [244, 114, 182], hi: [255, 204, 232] },
    { id: 'sky', title: 'Небесна лазур', main: '#38bdf8', shade: [14, 116, 178], mid: [56, 189, 248], hi: [186, 234, 255] },
    { id: 'lilac', title: 'Лавандовий туман', main: '#a78bfa', shade: [98, 54, 188], mid: [167, 139, 250], hi: [228, 214, 255] },
    { id: 'mint', title: 'Свіжа м’ята', main: '#34d399', shade: [16, 132, 92], mid: [52, 211, 153], hi: [184, 248, 222] },
    { id: 'sun', title: 'Сонячний лимон', main: '#fbbf24', shade: [188, 118, 12], mid: [251, 191, 36], hi: [255, 238, 158] },
    { id: 'coral', title: 'Яскравий корал', main: '#fb7185', shade: [188, 32, 62], mid: [251, 113, 133], hi: [255, 198, 208] },
    { id: 'navy', title: 'Королівський синій', main: '#3b82f6', shade: [28, 58, 138], mid: [59, 130, 246], hi: [168, 204, 255] }
  ],

  hairStyles: [
    { id: 'twin_tails', title: 'Два хвостики з бантиками', icon: '🎀', friendId: 'friend_01' },
    { id: 'long_waves', title: 'Довгі локони принцеси', icon: '👸', friendId: 'friend_02' },
    { id: 'space_buns', title: 'Пучки Space Buns', icon: '👧', friendId: 'friend_03' },
    { id: 'bob_cat', title: 'Каре з котячими вушками', icon: '🎧', friendId: 'friend_04' },
    { id: 'curly_puff', title: 'Пишні кучері з бантиками', icon: '☁️', friendId: 'friend_05' },
    { id: 'braids_ginger', title: 'Косички з беретом', icon: '🎨', friendId: 'friend_06' },
    { id: 'sporty_spiky', title: 'Спортивний їжачок', icon: '⚡', friendId: 'friend_07' },
    { id: 'curly_cap', title: 'Кучері з бейсболкою', icon: '🧢', friendId: 'friend_08' },
    { id: 'ponytail', title: 'Високий хвостик Зірки', icon: '🎤', friendId: 'friend_09' },
    { id: 'rainbow_fairy', title: 'Казкові локони Феї', icon: '🧚‍♀️', friendId: 'friend_10' },
    { id: 'hime_black', title: 'Рівне волосся й окуляри', icon: '👓', friendId: 'friend_11' },
    { id: 'flower_waves', title: 'Хвилі з квітковим вінком', icon: '🌺', friendId: 'friend_12' },
    { id: 'pink_curls', title: 'Капюшон Зайчика', icon: '🐰', friendId: 'friend_13' },
    { id: 'scientist_curls', title: 'Кучері Професора', icon: '🔬', friendId: 'friend_14' },
    { id: 'braids_rose', title: 'Косички з трояндою', icon: '🌹', friendId: 'friend_15' }
  ],

  tops: [
    { id: 'hoodie_strawberry', title: 'Худі з полуничкою', icon: '🍓', friendId: 'friend_01' },
    { id: 'dress_princess', title: 'Сукня Принцеси', icon: '👑', friendId: 'friend_02' },
    { id: 'overalls_rainbow', title: 'Комбінезон Веселка', icon: '🌈', friendId: 'friend_03' },
    { id: 'jacket_neon', title: 'Геймерський бомбер', icon: '🎮', friendId: 'friend_04' },
    { id: 'dress_coral', title: 'Святкова сукня', icon: '💖', friendId: 'friend_05' },
    { id: 'artist_apron', title: 'Костюм Художниці', icon: '🎨', friendId: 'friend_06' },
    { id: 'varsity_red', title: 'Бомбер Скейтера', icon: '🛹', friendId: 'friend_07' },
    { id: 'hoodie_beach', title: 'Пляжне худі та шорти', icon: '🏖️', friendId: 'friend_08' },
    { id: 'popstar_pink', title: 'Костюм Поп-Зірки', icon: '🎤', friendId: 'friend_09' },
    { id: 'dress_fairy', title: 'Сукня Феї з крильцями', icon: '🧚‍♀️', friendId: 'friend_10' },
    { id: 'school_blazer', title: 'Шкільна форма Академії', icon: '🏫', friendId: 'friend_11' },
    { id: 'dress_sunflower', title: 'Літній сарафан з квітами', icon: '🌼', friendId: 'friend_12' },
    { id: 'onesie_bunny', title: 'Піжамка Кігурумі-Зайчик', icon: '🐰', friendId: 'friend_13' },
    { id: 'lab_coat', title: 'Халат Дослідника', icon: '🔬', friendId: 'friend_14' },
    { id: 'dress_flamenco', title: 'Сукня Фламенко', icon: '💃', friendId: 'friend_15' }
  ],

  hats: [
    { id: 'none', title: 'Без убору', icon: '⚪', img: '' },
    { id: 'acc_crown', title: 'Золота Корона 👑', icon: '👑', img: 'assets/accessories/acc_crown.png' },
    { id: 'acc_bow_headband', title: 'Обруч з Бантиком 🎀', icon: '🎀', img: 'assets/accessories/acc_bow_headband.png' },
    { id: 'acc_flower_wreath', title: 'Квітковий Віночок 🌸', icon: '🌸', img: 'assets/accessories/acc_flower_wreath.png' },
    { id: 'acc_headphones', title: 'Навушники 🎧', icon: '🎧', img: 'assets/accessories/acc_headphones.png' },
    { id: 'acc_glasses_heart', title: 'Рожеві Окуляри 🕶️', icon: '🕶️', img: 'assets/accessories/acc_glasses_heart.png' },
    { id: 'acc_smart_glasses', title: 'Окуляри Розумниці 👓', icon: '👓', img: 'assets/accessories/acc_smart_glasses.png' },
    { id: 'acc_cat_beanie', title: 'Шапочка Котика 🐱', icon: '🐱', img: 'assets/accessories/acc_cat_beanie.png' },
    { id: 'acc_artist_beret', title: 'Берет Художниці 🎨', icon: '🎨', img: 'assets/accessories/acc_artist_beret.png' },
    { id: 'acc_mermaid_tiara', title: 'Тіара Русалоньки 🧜‍♀️', icon: '🧜‍♀️', img: 'assets/accessories/acc_mermaid_tiara.png' },
    { id: 'acc_panama_hat', title: 'Панамка Gandia 👒', icon: '👒', img: 'assets/accessories/acc_panama_hat.png' },
    { id: 'acc_cap_abece', title: 'Кепка Abecé 🧢', icon: '🧢', img: 'assets/accessories/acc_cap_abece.png' }
  ],

  handItems: [
    { id: 'none', title: 'Вільні ручки', icon: '✋', img: '' },
    { id: 'acc_star_wand', title: 'Чарівна Паличка ⭐', icon: '🪄', img: 'assets/accessories/acc_star_wand.png' },
    { id: 'prop_pizza_cupcake', title: 'Капкейк і Піца 🧁', icon: '🧁', img: 'assets/props/world_interactive/prop_pizza_cupcake.png' },
    { id: 'prop_smoothie_blender', title: 'Коктейль 🍓', icon: '🥤', img: 'assets/props/world_interactive/prop_smoothie_blender.png' },
    { id: 'prop_guitar_mic', title: 'Гітара Зірки 🎸', icon: '🎸', img: 'assets/props/world_interactive/prop_guitar_mic.png' },
    { id: 'prop_globe_book', title: 'Книга Пригод 📖', icon: '📖', img: 'assets/props/world_interactive/prop_globe_book.png' },
    { id: 'prop_bruno_trophy', title: 'Золотий Кубок 🏆', icon: '🏆', img: 'assets/props/world_interactive/prop_bruno_trophy.png' },
    { id: 'acc_crossbody_bag', title: 'Сумочка 👜', icon: '👜', img: 'assets/accessories/acc_crossbody_bag.png' }
  ]
};

// ============================================================================
// REAL-TIME CANVAS PIXEL SEGMENTATION & RECOLORING ENGINE
// ============================================================================
(function() {
  const CW = 280;
  const CH = 380;
  const CHIN_TARGET_Y = 186;
  const BODY_TARGET_H = 182;

  const loadedFriends = {}; // friendId -> { img, ready, normData, mask, stats }
  const renderCache = new Map(); // cacheKey -> dataUrl
  let refreshTimer = null;

  function scheduleUiRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (window.game) {
        try { window.game.updateCreatorAvatarPreview(); } catch (e) {}
        try { window.game.renderCustomFriendInWorld(); } catch (e) {}
        const modal = document.getElementById('character-creator-modal');
        if (modal && modal.style.display === 'flex') {
          try { window.game.renderCreatorCategoryContent(); } catch (e) {}
        }
      }
    }, 60);
  }

  function colorDist(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function buildNormalizedCharacterData(fMeta, img) {
    const canvas = document.createElement('canvas');
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const chinPx = ih * (fMeta.chinRatio || 0.465);
    const bodyPx = Math.max(40, ih - chinPx);
    const scale = BODY_TARGET_H / bodyPx;

    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (CW - dw) * 0.5;
    const dy = CHIN_TARGET_Y - chinPx * scale;

    ctx.clearRect(0, 0, CW, CH);
    ctx.drawImage(img, dx, dy, dw, dh);

    const imgData = ctx.getImageData(0, 0, CW, CH);
    const data = imgData.data;

    // Mask values: 0 = untouched/outline, 1 = SKIN, 2 = HAIR, 3 = EYE_IRIS, 4 = CLOTHES
    const mask = new Uint8Array(CW * CH);
    const [bsR, bsG, bsB] = fMeta.baseSkin || [252, 195, 155];
    const baseSkinLum = Math.max(30, 0.299 * bsR + 0.587 * bsG + 0.114 * bsB);

    const hairLums = [];
    const clothLums = [];

    for (let y = 0; y < CH; y++) {
      for (let x = 0; x < CW; x++) {
        const idx = y * CW + x;
        const p = idx * 4;
        const a = data[p + 3];
        if (a < 36) continue;

        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

        // Keep dark cartoon outlines untouched
        if (maxC < 62 || (lum < 68 && sat < 0.32 && fMeta.id !== 'friend_11' && fMeta.id !== 'friend_14')) {
          continue;
        }

        const dSkin = colorDist(r, g, b, bsR, bsG, bsB);

        // 1. Check Face Ellipse & Ears & Neck/Limbs for SKIN
        const inFaceEllipse = (Math.pow((x - 140) / 57, 2) + Math.pow((y - (CHIN_TARGET_Y - 43)) / 49, 2)) <= 1.04;
        const inEarZone = (y >= CHIN_TARGET_Y - 58 && y <= CHIN_TARGET_Y - 12 && ((x >= 68 && x <= 96) || (x >= 184 && x <= 212)));
        const inEyeBand = (y >= CHIN_TARGET_Y - 60 && y <= CHIN_TARGET_Y - 21 && ((x >= 92 && x <= 130) || (x >= 150 && x <= 188)));

        if (inEyeBand) {
          // Inside Eye Band: distinguish skin vs white sclera/sparkle vs dark lash vs colored iris
          if (dSkin < 38) {
            mask[idx] = 1; // Skin around eyelids
          } else if (minC < 212 && maxC > 72 && lum > 52) {
            // Exclude dark brown eyeglass frames on friend_11 / friend_14 at outer edges
            mask[idx] = 3; // EYE_IRIS
          }
          continue;
        }

        if (inFaceEllipse) {
          // Inside face oval: skin or rosy cheek blush
          const isBlush = (r > bsR - 15 && g < bsG + 20 && r > g + 22 && lum > 85);
          if (dSkin < 56 || isBlush) {
            mask[idx] = 1; // SKIN
            continue;
          }
        }

        if (inEarZone && dSkin < 44) {
          mask[idx] = 1; // Ear SKIN
          continue;
        }

        // Below chin: Neck, Hands, Legs vs Clothing
        if (y >= CHIN_TARGET_Y - 3) {
          if (dSkin < 42 && y < 348) {
            mask[idx] = 1; // Neck, hands, legs SKIN
            continue;
          }
          // Long side hair hanging below chin (outside torso width)
          const isSideHair = (y <= CHIN_TARGET_Y + 72 && (x < 96 || x > 184) && fMeta.id !== 'friend_10');
          if (isSideHair && lum > 45) {
            mask[idx] = 2; // HAIR
            hairLums.push(lum);
            continue;
          }
          // Clothing region (torso, dress, skirt, pants)
          if (y <= 336 && x >= 74 && x <= 206) {
            // Keep pure white collars/socks untouched
            if (minC > 224 && sat < 0.12) continue;
            mask[idx] = 4; // CLOTHES
            clothLums.push(lum);
          }
          continue;
        }

        // Above chin (outside face skin): Hair vs Hats/Hoods
        if (y < CHIN_TARGET_Y) {
          if (fMeta.id === 'friend_13') {
            // Bunny onesie hood is mint (g > r), curls are pink (r > g + 12)
            if (r > g + 10 && y > CHIN_TARGET_Y - 92) {
              mask[idx] = 2;
              hairLums.push(lum);
            } else if (g > r && lum > 90) {
              mask[idx] = 4;
              clothLums.push(lum);
            }
            continue;
          }
          if (fMeta.id === 'friend_06' && y < CHIN_TARGET_Y - 72 && b >= r - 10) {
            // Keep dark navy artist beret untouched
            continue;
          }
          if (fMeta.id === 'friend_08' && y < CHIN_TARGET_Y - 66 && x >= 90 && x <= 190) {
            // Keep backwards cap crown untouched, recolor blonde curls below cap line
            continue;
          }
          if (minC > 232 && sat < 0.10) continue;
          if (maxC >= 40) {
            mask[idx] = 2; // HAIR
            hairLums.push(lum);
          }
        }
      }
    }

    hairLums.sort((a, b) => a - b);
    clothLums.sort((a, b) => a - b);

    const hMin = hairLums.length ? hairLums[Math.floor(hairLums.length * 0.12)] : 45;
    const hMax = hairLums.length ? hairLums[Math.floor(hairLums.length * 0.88)] : 210;
    const cMin = clothLums.length ? clothLums[Math.floor(clothLums.length * 0.12)] : 55;
    const cMax = clothLums.length ? clothLums[Math.floor(clothLums.length * 0.88)] : 215;

    return {
      normPixels: new Uint8ClampedArray(data),
      mask,
      baseSkin: [bsR, bsG, bsB],
      baseSkinLum,
      hairMinL: hMin,
      hairMaxL: Math.max(hMin + 25, hMax),
      clothMinL: cMin,
      clothMaxL: Math.max(cMin + 25, cMax)
    };
  }

  function ensureFriendLoaded(friendId) {
    const cat = window.AVATAR_CREATOR_CATALOG;
    const fMeta = cat.friends.find(f => f.id === friendId) || cat.friends[0];
    if (loadedFriends[fMeta.id]) return loadedFriends[fMeta.id];

    const entry = { id: fMeta.id, meta: fMeta, ready: false, data: null };
    loadedFriends[fMeta.id] = entry;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        entry.data = buildNormalizedCharacterData(fMeta, img);
        entry.ready = true;
        renderCache.clear();
        scheduleUiRefresh();
      } catch (e) {
        console.error('Avatar segmentation error:', e);
      }
    };
    img.src = fMeta.img;
    return entry;
  }

  // Preload all 15 friends immediately
  setTimeout(() => {
    if (window.AVATAR_CREATOR_CATALOG && Array.isArray(window.AVATAR_CREATOR_CATALOG.friends)) {
      window.AVATAR_CREATOR_CATALOG.friends.forEach(f => ensureFriendLoaded(f.id));
    }
  }, 10);

  function clampByte(v) {
    return v < 0 ? 0 : (v > 255 ? 255 : Math.round(v));
  }

  function mapThreeToneRamp(lum, minL, maxL, shade, mid, hi) {
    let t = (lum - minL) / Math.max(20, maxL - minL);
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    if (t < 0.5) {
      const k = t * 2;
      return [
        clampByte(shade[0] + (mid[0] - shade[0]) * k),
        clampByte(shade[1] + (mid[1] - shade[1]) * k),
        clampByte(shade[2] + (mid[2] - shade[2]) * k)
      ];
    } else {
      const k = (t - 0.5) * 2;
      return [
        clampByte(mid[0] + (hi[0] - mid[0]) * k),
        clampByte(mid[1] + (hi[1] - mid[1]) * k),
        clampByte(mid[2] + (hi[2] - mid[2]) * k)
      ];
    }
  }

  function renderRecoloredLayer(charData, cfg, isHeadPass) {
    const cat = window.AVATAR_CREATOR_CATALOG;
    const src = charData.normPixels;
    const mask = charData.mask;
    const out = new Uint8ClampedArray(src.length);

    const skinObj = cat.skinTones.find(s => s.id === cfg.skinTone);
    const targetSkin = (skinObj && skinObj.rgb) ? skinObj.rgb : null;

    const hairObj = cat.hairColors.find(h => h.id === cfg.hairColor);
    const hasHairRecolor = !!(hairObj && hairObj.mid);

    const eyeObj = cat.eyeColors.find(e => e.id === cfg.eyeColor);
    const hasEyeRecolor = !!(eyeObj && eyeObj.mid);

    const clothObj = cat.outfitColors.find(o => o.id === cfg.outfitColor);
    const hasClothRecolor = !!(clothObj && clothObj.mid);

    const [bsR, bsG, bsB] = charData.baseSkin;
    const bsLum = charData.baseSkinLum;

    for (let i = 0; i < mask.length; i++) {
      const p = i * 4;
      const a = src[p + 3];
      if (a === 0) continue;

      let r = src[p];
      let g = src[p + 1];
      let b = src[p + 2];
      const m = mask[i];

      if (m === 1 && targetSkin) {
        // Recolor SKIN while preserving shading & cheek blush warmth
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const rawRatio = lum / bsLum;
        const scale = rawRatio <= 1 ? Math.pow(rawRatio, 0.84) : (1 + (rawRatio - 1) * 0.48);
        const blushBoost = Math.max(0, (r - bsR) - (g - bsG) * 0.75);
        r = clampByte(targetSkin[0] * scale + blushBoost * 0.45);
        g = clampByte(targetSkin[1] * scale - blushBoost * 0.12);
        b = clampByte(targetSkin[2] * scale - blushBoost * 0.08);
      } else if (m === 2 && hasHairRecolor) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const [nr, ng, nb] = mapThreeToneRamp(lum, charData.hairMinL, charData.hairMaxL, hairObj.shade, hairObj.mid, hairObj.hi);
        r = nr; g = ng; b = nb;
      } else if (m === 3 && hasEyeRecolor) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const [nr, ng, nb] = mapThreeToneRamp(lum, 55, 195, eyeObj.shade, eyeObj.mid, eyeObj.hi);
        r = nr; g = ng; b = nb;
      } else if (m === 4 && hasClothRecolor) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const [nr, ng, nb] = mapThreeToneRamp(lum, charData.clothMinL, charData.clothMaxL, clothObj.shade, clothObj.mid, clothObj.hi);
        r = nr; g = ng; b = nb;
      }

      out[p] = r;
      out[p + 1] = g;
      out[p + 2] = b;
      out[p + 3] = a;
    }

    return out;
  }

  window.buildCustomAvatarDataUrl = function(cfg) {
    const cat = window.AVATAR_CREATOR_CATALOG;
    if (!cfg) cfg = {};

    // Determine Head character (from hairStyle or friendId) and Body character (from top or friendId)
    const baseFriendId = cfg.friendId || 'friend_01';
    const hairObj = cat.hairStyles.find(h => h.id === cfg.hairStyle);
    const topObj = cat.tops.find(t => t.id === cfg.top);

    const headFriendId = (hairObj && hairObj.friendId) ? hairObj.friendId : baseFriendId;
    const bodyFriendId = (topObj && topObj.friendId) ? topObj.friendId : baseFriendId;

    const cacheKey = `${headFriendId}|${bodyFriendId}|${cfg.skinTone || 'original'}|${cfg.hairColor || 'natural'}|${cfg.eyeColor || 'original'}|${cfg.outfitColor || 'original'}`;
    if (renderCache.has(cacheKey)) {
      return renderCache.get(cacheKey);
    }

    const headEntry = ensureFriendLoaded(headFriendId);
    const bodyEntry = ensureFriendLoaded(bodyFriendId);

    if (!headEntry.ready || !bodyEntry.ready) {
      return headEntry.meta.img;
    }

    // If same character and all colors are default, return raw image directly
    const isAllDefaultColors = (!cfg.skinTone || cfg.skinTone === 'original') &&
      (!cfg.hairColor || cfg.hairColor === 'natural') &&
      (!cfg.eyeColor || cfg.eyeColor === 'original') &&
      (!cfg.outfitColor || cfg.outfitColor === 'original');

    if (headFriendId === bodyFriendId && isAllDefaultColors) {
      return headEntry.meta.img;
    }

    // When mixing two different characters, unify skin tone automatically if 'original' was selected
    const effectiveCfg = Object.assign({}, cfg);
    if (headFriendId !== bodyFriendId && (!effectiveCfg.skinTone || effectiveCfg.skinTone === 'original')) {
      effectiveCfg.skinTone = headEntry.meta.skinTone || 'peach';
    }

    const canvas = document.createElement('canvas');
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext('2d');
    const outImgData = ctx.createImageData(CW, CH);
    const dst = outImgData.data;

    if (headFriendId === bodyFriendId) {
      const recolored = renderRecoloredLayer(headEntry.data, effectiveCfg, true);
      dst.set(recolored);
    } else {
      // Composite Body (y >= CHIN_TARGET_Y - 2) + Head & Hair (y <= CHIN_TARGET_Y + 1 or side hair)
      const bodyPixels = renderRecoloredLayer(bodyEntry.data, effectiveCfg, false);
      const headPixels = renderRecoloredLayer(headEntry.data, effectiveCfg, true);
      const headMask = headEntry.data.mask;

      // 1. Copy Body below chin (excluding any old side-hair of the body character above shoulders)
      for (let y = CHIN_TARGET_Y - 2; y < CH; y++) {
        for (let x = 0; x < CW; x++) {
          const idx = y * CW + x;
          if (y < CHIN_TARGET_Y + 52 && bodyEntry.data.mask[idx] === 2 && (x < 98 || x > 182)) {
            continue; // Skip body character's hanging side pigtails
          }
          const p = idx * 4;
          if (bodyPixels[p + 3] > 0) {
            dst[p] = bodyPixels[p];
            dst[p + 1] = bodyPixels[p + 1];
            dst[p + 2] = bodyPixels[p + 2];
            dst[p + 3] = bodyPixels[p + 3];
          }
        }
      }

      // 2. Overlay Head & Hair on top
      for (let y = 0; y < CH; y++) {
        for (let x = 0; x < CW; x++) {
          const idx = y * CW + x;
          const isHeadRegion = (y <= CHIN_TARGET_Y + 2) ||
            (y <= CHIN_TARGET_Y + 75 && (x < 97 || x > 183) && headMask[idx] === 2);
          if (!isHeadRegion) continue;
          const p = idx * 4;
          const ha = headPixels[p + 3];
          if (ha > 20) {
            dst[p] = headPixels[p];
            dst[p + 1] = headPixels[p + 1];
            dst[p + 2] = headPixels[p + 2];
            dst[p + 3] = ha;
          }
        }
      }
    }

    ctx.putImageData(outImgData, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    renderCache.set(cacheKey, dataUrl);
    return dataUrl;
  };
})();

window.renderModularAvatarSvg = function(cfg) {
  const cat = window.AVATAR_CREATOR_CATALOG;
  if (!cfg) cfg = {};

  const imgSrc = window.buildCustomAvatarDataUrl(cfg);
  const hatObj = cat.hats.find(h => h.id === cfg.hat) || cat.hats[0];
  const handObj = cat.handItems.find(i => i.id === cfg.handItem) || cat.handItems[0];

  const hatHtml = (hatObj && hatObj.img)
    ? `<img src="${hatObj.img}" alt="${hatObj.title}" class="custom-illustrated-hat-layer" draggable="false">`
    : '';

  const handHtml = (handObj && handObj.img)
    ? `<img src="${handObj.img}" alt="${handObj.title}" class="custom-illustrated-hand-layer" draggable="false">`
    : '';

  return `
    <div class="custom-illustrated-avatar-rig" data-friend-id="${cfg.friendId || 'friend_01'}">
      <img src="${imgSrc}" alt="Avatar" class="custom-illustrated-body-img" draggable="false">
      ${hatHtml}
      ${handHtml}
    </div>
  `;
};
