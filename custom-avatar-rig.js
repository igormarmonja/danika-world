/**
 * AVATAR WORLD MODULAR PAPER-DOLL CHARACTER RIG ENGINE (v20261102_2)
 * True multi-layer 2D cartoon character builder:
 * Back Hair -> Faceless Chibi Body & Head (8 Skin Tones) -> Shoes -> Bottoms -> Tops/Dresses ->
 * Blush/Freckles -> Eyes (8 Shapes x 8 Iris Colors) -> Brows -> Mouth (8 Emotions) ->
 * Front Hair/Bangs (10 Styles x 12 Hair Colors) -> Hats/Glasses -> Hand Props.
 */

window.AVATAR_CREATOR_CATALOG = {
  skinTones: [
    { id: 'peach', name: 'Теплий персик', hex: '#ffdfc4', shadow: '#f0b892', blushBase: '#ff9aa2' },
    { id: 'fair', name: 'Ніжна порцеляна', hex: '#ffefe2', shadow: '#f3cbb0', blushBase: '#ffb7b2' },
    { id: 'sunkissed', name: 'Сонячна карамель', hex: '#f1c27d', shadow: '#d69a4e', blushBase: '#e87a7a' },
    { id: 'olive', name: 'Золотиста олива', hex: '#e0ac69', shadow: '#bd8342', blushBase: '#d96b6b' },
    { id: 'bronze', name: 'Тропічна бронза', hex: '#c68642', shadow: '#9c6125', blushBase: '#c95959' },
    { id: 'cocoa', name: 'Шоколадне какао', hex: '#8d5524', shadow: '#633710', blushBase: '#b04848' },
    { id: 'pink_fairy', name: 'Казкова фея', hex: '#ffd6e8', shadow: '#f4a9cb', blushBase: '#ff6b9d' },
    { id: 'elf_lilac', name: 'Зоряний ельф', hex: '#e8d8ff', shadow: '#c3a6f0', blushBase: '#d982ff' }
  ],

  hairColors: [
    { id: 'golden', name: 'Золотистий блонд', main: '#f6c85f', dark: '#d4982a', light: '#fff1a8' },
    { id: 'chestnut', name: 'Теплий каштан', main: '#7c4727', dark: '#4e2811', light: '#a86842' },
    { id: 'black', name: 'Вороняче крило', main: '#272936', dark: '#11121a', light: '#50556e' },
    { id: 'strawberry', name: 'Полуничне морозиво', main: '#ff7eb6', dark: '#d64584', light: '#ffb8d8' },
    { id: 'ginger', name: 'Вогняно-рудий', main: '#e8612c', dark: '#b33b0f', light: '#ff9466' },
    { id: 'platinum', name: 'Перлинний блонд', main: '#f3efe6', dark: '#c7beae', light: '#ffffff' },
    { id: 'lilac', name: 'Лавандова мрія', main: '#b388ff', dark: '#7c4dff', light: '#e1ceff' },
    { id: 'mint', name: 'М’ятна хвиля', main: '#4cd9b0', dark: '#1f9e79', light: '#9ef5db' },
    { id: 'turquoise', name: 'Океанська бірюза', main: '#29b6f6', dark: '#0277bd', light: '#81d4fa' },
    { id: 'ruby', name: 'Рубінова вишня', main: '#e53935', dark: '#991513', light: '#ff7961' },
    { id: 'chocolate', name: 'Темний шоколад', main: '#4a2c18', dark: '#291508', light: '#73492d' },
    { id: 'sunflower', name: 'Сонячний лимон', main: '#ffd54f', dark: '#f9a825', light: '#fff59d' }
  ],

  hairStyles: [
    { id: 'ponytail', name: 'Хвостик принцеси', icon: '👱‍♀️' },
    { id: 'space_buns', name: 'Два пучки (Space Buns)', icon: '👧' },
    { id: 'long_waves', name: 'Довгі локони', icon: '👸' },
    { id: 'bob_bangs', name: 'Стильне каре з чубчиком', icon: '💇‍♀️' },
    { id: 'twin_tails', name: 'Два високі хвостики', icon: '🎀' },
    { id: 'braids', name: 'Дві милі косички', icon: '🌾' },
    { id: 'curly_puff', name: 'Пухнасті кучері', icon: '☁️' },
    { id: 'sporty_spiky', name: 'Спортивна коротка (Хлопчик/Дівчинка)', icon: '⚡' },
    { id: 'kpop_side', name: 'Модна K-Pop зачіска', icon: '✨' },
    { id: 'pixie_fairy', name: 'Ельфійська коротка', icon: '🧚‍♀️' }
  ],

  eyeShapes: [
    { id: 'sparkle', name: 'Зіркові аніме-очі', icon: '✨' },
    { id: 'doll', name: 'Лялькові з віями', icon: '👁️' },
    { id: 'happy', name: 'Щасливі дуги (^ ^)', icon: '😊' },
    { id: 'wink', name: 'Грайливе підморгування', icon: '😉' },
    { id: 'stars', name: 'Зірочки в очах', icon: '🤩' },
    { id: 'glam', name: 'Мрійливий погляд', icon: '💖' },
    { id: 'cool', name: 'Крутий впевнений', icon: '😎' },
    { id: 'cute_round', name: 'Великі милі оченята', icon: '🥺' }
  ],

  eyeColors: [
    { id: 'blue', name: 'Сапфіровий синій', hex: '#2563eb', light: '#60a5fa', dark: '#1e3a8a' },
    { id: 'green', name: 'Смарагдовий зелений', hex: '#10b981', light: '#6ee7b7', dark: '#065f46' },
    { id: 'brown', name: 'Теплий карий', hex: '#78350f', light: '#b45309', dark: '#451a03' },
    { id: 'amber', name: 'Золотий бурштин', hex: '#d97706', light: '#fbbf24', dark: '#78350f' },
    { id: 'violet', name: 'Фіалковий аметист', hex: '#8b5cf6', light: '#c4b5fd', dark: '#4c1d95' },
    { id: 'pink', name: 'Рожевий кварц', hex: '#ec4899', light: '#f9a8d4', dark: '#831843' },
    { id: 'cyan', name: 'Морська лазур', hex: '#06b6d4', light: '#67e8f9', dark: '#155e75' },
    { id: 'ruby', name: 'Рубіновий вогник', hex: '#e11d48', light: '#fda4af', dark: '#881337' }
  ],

  blushes: [
    { id: 'rosy', name: 'Ніжний рум’янець', icon: '🌸' },
    { id: 'freckles', name: 'Сонячне ластовиння', icon: '🍪' },
    { id: 'heart', name: 'Серденька на щічках', icon: '💖' },
    { id: 'stars', name: 'Зірковий гліттер', icon: '✨' },
    { id: 'bandage', name: 'Милий пластир на носику', icon: '🩹' },
    { id: 'strawberry', name: 'Полуничні щічки', icon: '🍓' },
    { id: 'none', name: 'Без рум’ян', icon: '⚪' }
  ],

  mouths: [
    { id: 'smile', name: 'Ніжна посмішка', icon: '🙂' },
    { id: 'big_open', name: 'Радісний сміх', icon: '😄' },
    { id: 'cat', name: 'Котяча усмішка (:3)', icon: '🐱' },
    { id: 'tongue', name: 'Бешкетний язичок (:P)', icon: '😛' },
    { id: 'kiss', name: 'Повітряний поцілунок', icon: '😘' },
    { id: 'wow', name: 'Здивування (Вау!)', icon: '😮' },
    { id: 'bubblegum', name: 'Бульбашка жуйки', icon: '🫧' },
    { id: 'smirk', name: 'Крута півусмішка', icon: '😏' }
  ],

  tops: [
    { id: 'hoodie_star', name: 'Худі із зіркою', icon: '🧥', isDress: false },
    { id: 'dress_princess', name: 'Бальна сукня принцеси', icon: '👗', isDress: true },
    { id: 'school_blazer', name: 'Шкільна форма Академії', icon: '👔', isDress: false },
    { id: 'tshirt_rainbow', name: 'Футболка з веселкою', icon: '🌈', isDress: false },
    { id: 'overalls_cute', name: 'Джинсовий комбінезон', icon: '👖', isDress: true },
    { id: 'dress_fairy', name: 'Сукня феї з крильцями', icon: '🧚‍♀️', isDress: true },
    { id: 'sweater_heart', name: 'В’язаний светрик з сердечком', icon: '🧶', isDress: false },
    { id: 'sport_jacket', name: 'Спортивний бомбер', icon: '🎽', isDress: false },
    { id: 'chef_apron', name: 'Костюм Шеф-Кухаря', icon: '👩‍🍳', isDress: true },
    { id: 'popstar_dress', name: 'Сценічний костюм Поп-Зірки', icon: '🎤', isDress: true }
  ],

  outfitColors: [
    { id: 'pink', name: 'Рожевий фламінго', main: '#f472b6', dark: '#db2777', accent: '#fef08a' },
    { id: 'sky', name: 'Небесно-блакитний', main: '#38bdf8', dark: '#0284c7', accent: '#ffffff' },
    { id: 'lilac', name: 'Ніжна лаванда', main: '#a78bfa', dark: '#7c3aed', accent: '#fde047' },
    { id: 'mint', name: 'Свіжа м’ята', main: '#34d399', dark: '#059669', accent: '#ffffff' },
    { id: 'sun', name: 'Сонячно-жовтий', main: '#fbbf24', dark: '#d97706', accent: '#ffffff' },
    { id: 'coral', name: 'Яскравий корал', main: '#fb7185', dark: '#e11d48', accent: '#fef08a' },
    { id: 'navy', name: 'Королівський синій', main: '#3b82f6', dark: '#1d4ed8', accent: '#fde047' },
    { id: 'white', name: 'Білосніжна хмаринка', main: '#f8fafc', dark: '#cbd5e1', accent: '#f472b6' }
  ],

  bottoms: [
    { id: 'skirt_pleated', name: 'Плісирована спідничка', icon: '🩰' },
    { id: 'jeans_blue', name: 'Модні сині джинси', icon: '👖' },
    { id: 'shorts_summer', name: 'Літні шортики', icon: '🩳' },
    { id: 'skirt_tutu', name: 'Пишна фатинова пачка', icon: '🌸' },
    { id: 'pants_cargo', name: 'Стріт-карго штани', icon: '🛹' },
    { id: 'leggings_star', name: 'Зіркові легінси', icon: '✨' }
  ],

  shoes: [
    { id: 'sneakers_white', name: 'Білі кросівки', icon: '👟', color: '#ffffff', accent: '#38bdf8' },
    { id: 'converse_pink', name: 'Рожеві кеди з зіркою', icon: '🥾', color: '#f472b6', accent: '#ffffff' },
    { id: 'mary_janes', name: 'Святкові туфельки', icon: '🥿', color: '#1e293b', accent: '#fbbf24' },
    { id: 'boots_star', name: 'Зіркові чобітки', icon: '👢', color: '#a855f7', accent: '#fde047' },
    { id: 'slippers_bunny', name: 'Пухнасті капці-зайчики', icon: '🐰', color: '#fbcfe8', accent: '#ffffff' },
    { id: 'rollers', name: 'Яскраві ролики', icon: '🛼', color: '#06b6d4', accent: '#f43f5e' }
  ],

  hats: [
    { id: 'none', name: 'Без головного убору', icon: '⚪' },
    { id: 'tiara', name: 'Золота корона принцеси', icon: '👑' },
    { id: 'cat_headphones', name: 'Навушники з котячими вушками', icon: '🎧' },
    { id: 'bow_ribbon', name: 'Великий рожевий бантик', icon: '🎀' },
    { id: 'flower_crown', name: 'Віночок із живих квітів', icon: '🌸' },
    { id: 'beret', name: 'Французький берет художника', icon: '🎨' },
    { id: 'glasses_round', name: 'Круглі окуляри розумниці', icon: '👓' },
    { id: 'sunglasses_star', name: 'Зіркові сонцезахисні окуляри', icon: '🕶️' },
    { id: 'cap_sport', name: 'Стильна бейсболка', icon: '🧢' },
    { id: 'bunny_ears', name: 'Вушка пухнастого зайчика', icon: '🐰' }
  ],

  handProps: [
    { id: 'none', name: 'Вільні ручки', icon: '✋' },
    { id: 'magic_wand', name: 'Чарівна зіркова паличка', icon: '🪄' },
    { id: 'boba_tea', name: 'Полуничний Бабл-Ті', icon: '🧋' },
    { id: 'microphone', name: 'Золотий мікрофон зірки', icon: '🎤' },
    { id: 'ice_cream', name: 'Ріжок морозива', icon: '🍦' },
    { id: 'plush_heart', name: 'М’яка іграшка-серденько', icon: '💝' },
    { id: 'book_magic', name: 'Книга казок та знань', icon: '📘' }
  ]
};

window.renderModularAvatarSvg = function(cfg) {
  const cat = window.AVATAR_CREATOR_CATALOG;
  const skin = cat.skinTones.find(s => s.id === cfg.skinTone) || cat.skinTones[0];
  const hairCol = cat.hairColors.find(h => h.id === cfg.hairColor) || cat.hairColors[0];
  const eyeCol = cat.eyeColors.find(e => e.id === cfg.eyeColor) || cat.eyeColors[0];
  const outCol = cat.outfitColors.find(o => o.id === cfg.outfitColor) || cat.outfitColors[0];
  const shoeObj = cat.shoes.find(s => s.id === cfg.shoesId) || cat.shoes[0];
  const topObj = cat.tops.find(t => t.id === cfg.topId) || cat.tops[0];

  const hairStyle = cfg.hairStyle || 'ponytail';
  const eyeShape = cfg.eyes || 'sparkle';
  const blushType = cfg.blush || 'rosy';
  const mouthType = cfg.mouth || 'smile';
  const bottomId = cfg.bottomId || 'skirt_pleated';
  const hatId = cfg.hatId || 'none';
  const handPropId = cfg.handPropId || 'none';
  const outline = '#2b1608';

  // 1. BACK HAIR LAYER
  let backHairSvg = '';
  if (hairStyle === 'ponytail') {
    backHairSvg = `
      <path d="M165 65 C215 55, 232 115, 212 165 C198 195, 222 215, 195 230 C168 235, 152 195, 160 150 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M180 78 C205 95, 205 145, 190 185" stroke="${hairCol.dark}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="168" cy="76" r="13" fill="#38bdf8" stroke="${outline}" stroke-width="4"/>
    `;
  } else if (hairStyle === 'long_waves') {
    backHairSvg = `
      <path d="M58 95 C35 145, 42 225, 62 250 C85 262, 175 262, 198 250 C218 225, 225 145, 202 95 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M68 130 Q55 185 72 240 M192 130 Q205 185 188 240" stroke="${hairCol.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  } else if (hairStyle === 'twin_tails') {
    backHairSvg = `
      <path d="M62 80 C20 75, 14 145, 34 205 C48 220, 68 195, 65 145 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <path d="M198 80 C240 75, 246 145, 226 205 C212 220, 192 195, 195 145 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <circle cx="62" cy="84" r="11" fill="#f43f5e" stroke="${outline}" stroke-width="3.5"/>
      <circle cx="198" cy="84" r="11" fill="#f43f5e" stroke="${outline}" stroke-width="3.5"/>
    `;
  } else if (hairStyle === 'space_buns') {
    backHairSvg = `
      <circle cx="65" cy="55" r="28" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <circle cx="195" cy="55" r="28" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <path d="M52 45 Q65 32 78 45" stroke="${hairCol.light}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M182 45 Q195 32 208 45" stroke="${hairCol.light}" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  } else if (hairStyle === 'braids') {
    backHairSvg = `
      <g fill="${hairCol.main}" stroke="${outline}" stroke-width="4">
        <ellipse cx="62" cy="145" rx="14" ry="16"/>
        <ellipse cx="58" cy="170" rx="13" ry="15"/>
        <ellipse cx="56" cy="195" rx="11" ry="13"/>
        <circle cx="56" cy="212" r="7" fill="#ec4899"/>
        <ellipse cx="198" cy="145" rx="14" ry="16"/>
        <ellipse cx="202" cy="170" rx="13" ry="15"/>
        <ellipse cx="204" cy="195" rx="11" ry="13"/>
        <circle cx="204" cy="212" r="7" fill="#ec4899"/>
      </g>
    `;
  } else if (hairStyle === 'curly_puff') {
    backHairSvg = `
      <circle cx="55" cy="95" r="36" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <circle cx="205" cy="95" r="36" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <circle cx="72" cy="55" r="34" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
      <circle cx="188" cy="55" r="34" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5"/>
    `;
  }

  // Fairy wings if dress_fairy is selected
  let wingsSvg = '';
  if (topObj.id === 'dress_fairy') {
    wingsSvg = `
      <g opacity="0.88">
        <path d="M95 195 C25 140, 15 215, 75 240 C35 255, 50 295, 100 260 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3.5"/>
        <path d="M165 195 C235 140, 245 215, 185 240 C225 255, 210 295, 160 260 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3.5"/>
      </g>
    `;
  }

  // 2. BASE CHIBI BODY & FACELESS HEAD LAYER (SKIN TONE)
  const bodyBaseSvg = `
    <!-- Neck -->
    <rect x="116" y="162" width="28" height="26" rx="10" fill="${skin.shadow}" stroke="${outline}" stroke-width="4"/>
    <!-- Left & Right Arms -->
    <path d="M92 186 C70 200, 60 232, 66 254 C70 262, 82 260, 86 250 L102 208 Z" fill="${skin.hex}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M168 186 C190 200, 200 232, 194 254 C190 262, 178 260, 174 250 L158 208 Z" fill="${skin.hex}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <!-- Torso Base -->
    <path d="M96 182 L164 182 L172 268 L88 268 Z" rx="18" fill="${skin.hex}" stroke="${outline}" stroke-width="4"/>
    <!-- Left & Right Legs -->
    <rect x="98" y="264" width="24" height="76" rx="12" fill="${skin.hex}" stroke="${outline}" stroke-width="4"/>
    <rect x="138" y="264" width="24" height="76" rx="12" fill="${skin.hex}" stroke="${outline}" stroke-width="4"/>
    <!-- Knee blush/shadow -->
    <ellipse cx="110" cy="302" rx="6" ry="3.5" fill="${skin.shadow}" opacity="0.55"/>
    <ellipse cx="150" cy="302" rx="6" ry="3.5" fill="${skin.shadow}" opacity="0.55"/>
    <!-- Ears -->
    <circle cx="62" cy="122" r="14" fill="${skin.hex}" stroke="${outline}" stroke-width="4"/>
    <path d="M58 118 Q62 122 59 126" stroke="${skin.shadow}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="198" cy="122" r="14" fill="${skin.hex}" stroke="${outline}" stroke-width="4"/>
    <path d="M202 118 Q198 122 201 126" stroke="${skin.shadow}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Chibi Head (Faceless Mannequin) -->
    <rect x="64" y="48" width="132" height="122" rx="58" fill="${skin.hex}" stroke="${outline}" stroke-width="4.5"/>
    <!-- Soft Chin Shadow -->
    <path d="M88 158 Q130 172 172 158" stroke="${skin.shadow}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.65"/>
    <!-- Cute Little Nose -->
    <path d="M127 124 Q130 119 133 124" stroke="${outline}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  `;

  // 3. SHOES LAYER
  const shoesSvg = `
    <g>
      <!-- White socks -->
      <rect x="99" y="318" width="22" height="16" fill="#ffffff" stroke="${outline}" stroke-width="3.5"/>
      <rect x="139" y="318" width="22" height="16" fill="#ffffff" stroke="${outline}" stroke-width="3.5"/>
      <!-- Left Shoe -->
      <path d="M90 332 Q110 326 124 332 L126 350 Q108 354 88 350 Z" fill="${shoeObj.color}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="87" y="346" width="40" height="7" rx="3.5" fill="${shoeObj.accent}" stroke="${outline}" stroke-width="3"/>
      <!-- Right Shoe -->
      <path d="M136 332 Q150 326 170 332 L172 350 Q152 354 134 350 Z" fill="${shoeObj.color}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="133" y="346" width="40" height="7" rx="3.5" fill="${shoeObj.accent}" stroke="${outline}" stroke-width="3"/>
      ${shoeObj.id === 'rollers' ? `
        <circle cx="96" cy="358" r="5" fill="#fbbf24" stroke="${outline}" stroke-width="2.5"/>
        <circle cx="118" cy="358" r="5" fill="#fbbf24" stroke="${outline}" stroke-width="2.5"/>
        <circle cx="142" cy="358" r="5" fill="#fbbf24" stroke="${outline}" stroke-width="2.5"/>
        <circle cx="164" cy="358" r="5" fill="#fbbf24" stroke="${outline}" stroke-width="2.5"/>
      ` : ''}
    </g>
  `;

  // 4. BOTTOMS LAYER (if top is not a full dress)
  let bottomSvg = '';
  if (!topObj.isDress) {
    if (bottomId === 'skirt_pleated') {
      bottomSvg = `
        <path d="M88 246 L172 246 L184 286 L76 286 Z" fill="${outCol.dark}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
        <line x1="106" y1="248" x2="100" y2="285" stroke="${outline}" stroke-width="3"/>
        <line x1="130" y1="248" x2="130" y2="285" stroke="${outline}" stroke-width="3"/>
        <line x1="154" y1="248" x2="160" y2="285" stroke="${outline}" stroke-width="3"/>
      `;
    } else if (bottomId === 'jeans_blue' || bottomId === 'pants_cargo' || bottomId === 'leggings_star') {
      const pCol = bottomId === 'jeans_blue' ? '#3b82f6' : (bottomId === 'pants_cargo' ? '#65a30d' : '#6d28d9');
      bottomSvg = `
        <path d="M92 246 L168 246 L165 322 L136 322 L130 278 L124 322 L95 322 Z" fill="${pCol}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      `;
    } else if (bottomId === 'skirt_tutu') {
      bottomSvg = `
        <path d="M84 246 Q130 238 176 246 C192 265, 188 288, 165 288 C150 294, 110 294, 95 288 C72 288, 68 265, 84 246 Z" fill="${outCol.accent}" opacity="0.92" stroke="${outline}" stroke-width="3.8"/>
      `;
    } else {
      bottomSvg = `
        <path d="M92 246 L168 246 L166 288 L134 288 L130 268 L126 288 L94 288 Z" fill="#1e293b" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      `;
    }
  }

  // 5. TOPS / DRESSES LAYER
  let topSvg = '';
  if (topObj.id === 'dress_princess' || topObj.id === 'dress_fairy' || topObj.id === 'popstar_dress') {
    topSvg = `
      <path d="M92 182 L168 182 L162 242 L196 306 Q130 322 64 306 L98 242 Z" fill="${outCol.main}" stroke="${outline}" stroke-width="4.2" stroke-linejoin="round"/>
      <circle cx="88" cy="195" r="16" fill="${outCol.accent}" stroke="${outline}" stroke-width="3.8"/>
      <circle cx="172" cy="195" r="16" fill="${outCol.accent}" stroke="${outline}" stroke-width="3.8"/>
      <path d="M98 242 Q130 252 162 242" stroke="${outCol.accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <polygon points="130,198 134,208 145,208 136,214 139,224 130,218 121,224 124,214 115,208 126,208" fill="#fef08a" stroke="${outline}" stroke-width="2.2"/>
    `;
  } else if (topObj.id === 'overalls_cute' || topObj.id === 'chef_apron') {
    const bibCol = topObj.id === 'chef_apron' ? '#ffffff' : '#60a5fa';
    topSvg = `
      <path d="M84 182 L176 182 L186 216 L168 222 L164 252 L96 252 L92 222 L74 216 Z" fill="${outCol.main}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M100 184 L112 184 L112 215 L148 215 L148 184 L160 184 L166 292 L94 292 Z" fill="${bibCol}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="108" cy="212" r="4.5" fill="#fbbf24" stroke="${outline}" stroke-width="2"/>
      <circle cx="152" cy="212" r="4.5" fill="#fbbf24" stroke="${outline}" stroke-width="2"/>
    `;
  } else if (topObj.id === 'school_blazer') {
    topSvg = `
      <path d="M84 182 L176 182 L186 232 L168 236 L166 254 L94 254 L92 236 L74 232 Z" fill="#1e3a8a" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="114,182 146,182 130,224" fill="#ffffff" stroke="${outline}" stroke-width="3"/>
      <polygon points="126,192 134,192 136,232 130,240 124,232" fill="#e11d48" stroke="${outline}" stroke-width="2.5"/>
    `;
  } else {
    // Hoodie / T-shirt / Sweater / Sport Jacket
    topSvg = `
      <path d="M84 182 Q130 190 176 182 L188 224 L168 232 L166 255 L94 255 L92 232 L72 224 Z" fill="${outCol.main}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M108 182 Q130 202 152 182" fill="none" stroke="${outCol.accent}" stroke-width="5" stroke-linecap="round"/>
      ${topObj.id === 'tshirt_rainbow' ? `
        <path d="M106 230 A24 24 0 0 1 154 230" stroke="#ef4444" stroke-width="5" fill="none"/>
        <path d="M111 230 A19 19 0 0 1 149 230" stroke="#fbbf24" stroke-width="5" fill="none"/>
        <path d="M116 230 A14 14 0 0 1 144 230" stroke="#38bdf8" stroke-width="5" fill="none"/>
      ` : `
        <polygon points="130,202 135,214 148,214 137,222 141,234 130,226 119,234 123,222 112,214 125,214" fill="${outCol.accent}" stroke="${outline}" stroke-width="2.5"/>
      `}
    `;
  }

  // 6. BLUSH & CHEEKS LAYER
  let blushSvg = '';
  if (blushType === 'rosy' || blushType === 'strawberry') {
    blushSvg = `
      <ellipse cx="88" cy="130" rx="13" ry="7.5" fill="${skin.blushBase}" opacity="0.58"/>
      <ellipse cx="172" cy="130" rx="13" ry="7.5" fill="${skin.blushBase}" opacity="0.58"/>
    `;
  } else if (blushType === 'freckles') {
    blushSvg = `
      <ellipse cx="88" cy="130" rx="12" ry="6.5" fill="${skin.blushBase}" opacity="0.4"/>
      <ellipse cx="172" cy="130" rx="12" ry="6.5" fill="${skin.blushBase}" opacity="0.4"/>
      <g fill="#8d5524" opacity="0.65">
        <circle cx="84" cy="128" r="1.8"/><circle cx="92" cy="126" r="1.8"/><circle cx="89" cy="132" r="1.8"/>
        <circle cx="124" cy="122" r="1.5"/><circle cx="136" cy="122" r="1.5"/>
        <circle cx="168" cy="126" r="1.8"/><circle cx="176" cy="128" r="1.8"/><circle cx="171" cy="132" r="1.8"/>
      </g>
    `;
  } else if (blushType === 'heart') {
    blushSvg = `
      <path d="M88 134 C82 129, 80 123, 85 121 C88 120, 88 124, 88 124 C88 124, 88 120, 91 121 C96 123, 94 129, 88 134 Z" fill="#f43f5e"/>
      <path d="M172 134 C166 129, 164 123, 169 121 C172 120, 172 124, 172 124 C172 124, 172 120, 175 121 C180 123, 178 129, 172 134 Z" fill="#f43f5e"/>
    `;
  } else if (blushType === 'stars') {
    blushSvg = `
      <ellipse cx="88" cy="130" rx="13" ry="7" fill="${skin.blushBase}" opacity="0.48"/>
      <ellipse cx="172" cy="130" rx="13" ry="7" fill="${skin.blushBase}" opacity="0.48"/>
      <circle cx="84" cy="128" r="2.2" fill="#fef08a"/><circle cx="92" cy="132" r="1.8" fill="#ffffff"/>
      <circle cx="176" cy="128" r="2.2" fill="#fef08a"/><circle cx="168" cy="132" r="1.8" fill="#ffffff"/>
    `;
  } else if (blushType === 'bandage') {
    blushSvg = `
      <ellipse cx="88" cy="130" rx="12" ry="7" fill="${skin.blushBase}" opacity="0.5"/>
      <ellipse cx="172" cy="130" rx="12" ry="7" fill="${skin.blushBase}" opacity="0.5"/>
      <rect x="116" y="116" width="28" height="10" rx="4" transform="rotate(-6 130 121)" fill="#fed7aa" stroke="${outline}" stroke-width="2.2"/>
    `;
  }

  // 7. EXPRESSIVE EYES LAYER (ALWAYS 2 EYES ON FACELESS HEAD!)
  let eyesSvg = '';
  const renderOneEye = (cx, cy, isRight) => {
    const lashDir = isRight ? 1 : -1;
    return `
      <g>
        <!-- Sclera -->
        <ellipse cx="${cx}" cy="${cy}" rx="17" ry="18" fill="#ffffff" stroke="${outline}" stroke-width="3.5"/>
        <!-- Iris Base -->
        <ellipse cx="${cx}" cy="${cy+1}" rx="12.5" ry="14" fill="${eyeCol.hex}"/>
        <!-- Upper Iris Dark Shadow -->
        <path d="M${cx-12} ${cy-2} A12.5 13 0 0 1 ${cx+12} ${cy-2} Z" fill="${eyeCol.dark}" opacity="0.7"/>
        <!-- Lower Iris Glow -->
        <ellipse cx="${cx}" cy="${cy+6}" rx="9" ry="6" fill="${eyeCol.light}" opacity="0.75"/>
        <!-- Pupil -->
        <circle cx="${cx}" cy="${cy+1}" r="6.5" fill="#111827"/>
        <!-- Big Kawaii Catchlights -->
        <circle cx="${cx-4.5}" cy="${cy-5}" r="4.2" fill="#ffffff"/>
        <circle cx="${cx+4.5}" cy="${cy+5}" r="2.2" fill="#ffffff"/>
        ${eyeShape === 'stars' ? `<polygon points="${cx},${cy-4} ${cx+1.5},${cy} ${cx+5},${cy} ${cx+2},${cy+2} ${cx+3},${cy+6} ${cx},${cy+3.5} ${cx-3},${cy+6} ${cx-2},${cy+2} ${cx-5},${cy} ${cx-1.5},${cy}" fill="#fef08a"/>` : ''}
        <!-- Thick Upper Eyelash Arch -->
        <path d="M${cx-18} ${cy-4} Q${cx} ${cy-22} ${cx+18} ${cy-4}" stroke="${outline}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M${cx + lashDir*15} ${cy-8} L${cx + lashDir*22} ${cy-14}" stroke="${outline}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M${cx + lashDir*17} ${cy-3} L${cx + lashDir*23} ${cy-6}" stroke="${outline}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `;
  };

  if (eyeShape === 'happy') {
    eyesSvg = `
      <path d="M82 112 Q98 94 114 112" stroke="${outline}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M146 112 Q162 94 178 112" stroke="${outline}" stroke-width="5" fill="none" stroke-linecap="round"/>
    `;
  } else if (eyeShape === 'wink') {
    eyesSvg = `
      ${renderOneEye(98, 110, false)}
      <path d="M146 112 Q162 96 178 112" stroke="${outline}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M174 106 L182 101" stroke="${outline}" stroke-width="3.8" stroke-linecap="round"/>
    `;
  } else {
    eyesSvg = `
      ${renderOneEye(98, 110, false)}
      ${renderOneEye(162, 110, true)}
    `;
  }

  // Eyebrows
  const browsSvg = `
    <path d="M83 86 Q98 80 111 86" stroke="${hairCol.dark}" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <path d="M149 86 Q162 80 177 86" stroke="${hairCol.dark}" stroke-width="4.2" fill="none" stroke-linecap="round"/>
  `;

  // 8. MOUTH LAYER
  let mouthSvg = '';
  if (mouthType === 'smile') {
    mouthSvg = `<path d="M118 140 Q130 150 142 140" stroke="${outline}" stroke-width="3.8" fill="none" stroke-linecap="round"/>`;
  } else if (mouthType === 'big_open') {
    mouthSvg = `
      <path d="M115 137 Q130 158 145 137 Z" fill="#be123c" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M121 146 Q130 153 139 146" fill="#fb7185"/>
    `;
  } else if (mouthType === 'cat') {
    mouthSvg = `<path d="M116 141 Q123 148 130 140 Q137 148 144 141" stroke="${outline}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  } else if (mouthType === 'tongue') {
    mouthSvg = `
      <path d="M117 139 Q130 148 143 139" stroke="${outline}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M124 142 Q130 156 136 142 Z" fill="#fb7185" stroke="${outline}" stroke-width="2.8"/>
    `;
  } else if (mouthType === 'kiss') {
    mouthSvg = `
      <path d="M126 137 Q132 140 127 143 Q132 146 126 149" stroke="${outline}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M142 140 C139 137, 138 134, 141 133 C142 132, 142 135, 142 135 C142 135, 142 132, 144 133 C147 134, 145 137, 142 140 Z" fill="#f43f5e"/>
    `;
  } else if (mouthType === 'wow') {
    mouthSvg = `<ellipse cx="130" cy="143" rx="6.5" ry="8" fill="#be123c" stroke="${outline}" stroke-width="3.4"/>`;
  } else if (mouthType === 'bubblegum') {
    mouthSvg = `
      <circle cx="136" cy="145" r="13" fill="#f472b6" opacity="0.88" stroke="${outline}" stroke-width="3"/>
      <circle cx="132" cy="141" r="3.5" fill="#ffffff" opacity="0.8"/>
    `;
  } else {
    mouthSvg = `<path d="M118 142 Q132 149 144 137" stroke="${outline}" stroke-width="3.8" fill="none" stroke-linecap="round"/>`;
  }

  // 9. FRONT HAIR & BANGS LAYER
  let frontHairSvg = '';
  if (hairStyle === 'bob_bangs' || hairStyle === 'twin_tails' || hairStyle === 'braids') {
    frontHairSvg = `
      <path d="M58 95 C56 44, 102 34, 130 36 C158 34, 204 44, 202 95 C195 76, 178 86, 168 82 C158 68, 145 84, 130 82 C115 84, 102 68, 92 82 C82 86, 65 76, 58 95 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M62 88 C52 125, 56 155, 70 165 C68 135, 68 110, 72 86 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4"/>
      <path d="M198 88 C208 125, 204 155, 190 165 C192 135, 192 110, 188 86 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4"/>
      <path d="M88 55 Q130 45 172 55" stroke="${hairCol.light}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.75"/>
    `;
  } else if (hairStyle === 'sporty_spiky' || hairStyle === 'pixie_fairy') {
    frontHairSvg = `
      <path d="M58 98 C55 52, 85 30, 115 36 L128 24 L142 36 C175 30, 205 52, 202 98 C188 74, 172 68, 155 78 L142 64 L126 78 L110 64 L96 78 C82 68, 68 74, 58 98 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M92 50 Q130 40 168 50" stroke="${hairCol.light}" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.7"/>
    `;
  } else {
    // Ponytail / Long waves / Space buns / K-pop side
    frontHairSvg = `
      <path d="M58 98 C55 42, 100 32, 132 35 C164 32, 205 42, 202 98 C188 72, 165 62, 138 66 C112 72, 82 78, 58 98 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M62 88 C48 120, 52 152, 66 168 C62 142, 65 115, 72 86 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4"/>
      <path d="M198 88 C212 120, 208 152, 194 168 C198 142, 195 115, 188 86 Z" fill="${hairCol.main}" stroke="${outline}" stroke-width="4"/>
      <path d="M84 56 Q128 42 174 56" stroke="${hairCol.light}" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.75"/>
    `;
  }

  // 10. HATS & GLASSES LAYER
  let hatSvg = '';
  if (hatId === 'tiara') {
    hatSvg = `
      <path d="M96 42 L106 16 L120 32 L130 10 L140 32 L154 16 L164 42 Z" fill="#fbbf24" stroke="${outline}" stroke-width="3.8" stroke-linejoin="round"/>
      <circle cx="130" cy="28" r="5" fill="#ec4899" stroke="${outline}" stroke-width="2"/>
    `;
  } else if (hatId === 'cat_headphones') {
    hatSvg = `
      <path d="M56 112 C52 38, 208 38, 204 112" stroke="#f472b6" stroke-width="9" fill="none" stroke-linecap="round"/>
      <polygon points="74,52 84,24 102,42" fill="#f472b6" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="186,52 176,24 158,42" fill="#f472b6" stroke="${outline}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="56" cy="116" rx="11" ry="18" fill="#38bdf8" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="204" cy="116" rx="11" ry="18" fill="#38bdf8" stroke="${outline}" stroke-width="3.5"/>
    `;
  } else if (hatId === 'bow_ribbon') {
    hatSvg = `
      <path d="M130 38 C102 14, 88 42, 122 46 C88 54, 108 68, 130 44 Z" fill="#f43f5e" stroke="${outline}" stroke-width="3.5"/>
      <path d="M130 38 C158 14, 172 42, 138 46 C172 54, 152 68, 130 44 Z" fill="#f43f5e" stroke="${outline}" stroke-width="3.5"/>
      <circle cx="130" cy="41" r="8" fill="#fda4af" stroke="${outline}" stroke-width="3.5"/>
    `;
  } else if (hatId === 'flower_crown') {
    hatSvg = `
      <circle cx="88" cy="52" r="11" fill="#f472b6" stroke="${outline}" stroke-width="3"/><circle cx="88" cy="52" r="4" fill="#fef08a"/>
      <circle cx="115" cy="44" r="12" fill="#38bdf8" stroke="${outline}" stroke-width="3"/><circle cx="115" cy="44" r="4.5" fill="#fef08a"/>
      <circle cx="145" cy="44" r="12" fill="#fbbf24" stroke="${outline}" stroke-width="3"/><circle cx="145" cy="44" r="4.5" fill="#ffffff"/>
      <circle cx="172" cy="52" r="11" fill="#a78bfa" stroke="${outline}" stroke-width="3"/><circle cx="172" cy="52" r="4" fill="#fef08a"/>
    `;
  } else if (hatId === 'beret') {
    hatSvg = `
      <ellipse cx="134" cy="40" rx="54" ry="20" transform="rotate(-8 134 40)" fill="#f43f5e" stroke="${outline}" stroke-width="4"/>
      <path d="M132 20 L136 12" stroke="${outline}" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (hatId === 'glasses_round') {
    hatSvg = `
      <circle cx="98" cy="110" r="22" fill="rgba(255,255,255,0.2)" stroke="#ec4899" stroke-width="4.2"/>
      <circle cx="162" cy="110" r="22" fill="rgba(255,255,255,0.2)" stroke="#ec4899" stroke-width="4.2"/>
      <line x1="120" y1="110" x2="140" y2="110" stroke="#ec4899" stroke-width="4.2"/>
    `;
  } else if (hatId === 'sunglasses_star') {
    hatSvg = `
      <polygon points="98,86 105,100 120,100 108,110 112,125 98,116 84,125 88,110 76,100 91,100" fill="rgba(244,63,94,0.75)" stroke="#fef08a" stroke-width="3.5"/>
      <polygon points="162,86 169,100 184,100 172,110 176,125 162,116 148,125 152,110 140,100 155,100" fill="rgba(244,63,94,0.75)" stroke="#fef08a" stroke-width="3.5"/>
      <line x1="115" y1="104" x2="145" y2="104" stroke="#fef08a" stroke-width="4"/>
    `;
  } else if (hatId === 'cap_sport') {
    hatSvg = `
      <path d="M72 62 C72 24, 188 24, 188 62 Z" fill="#38bdf8" stroke="${outline}" stroke-width="4"/>
      <path d="M120 54 Q175 48 214 64 Q172 70 120 62 Z" fill="#0284c7" stroke="${outline}" stroke-width="4"/>
    `;
  } else if (hatId === 'bunny_ears') {
    hatSvg = `
      <ellipse cx="104" cy="24" rx="13" ry="30" transform="rotate(-10 104 24)" fill="#ffffff" stroke="${outline}" stroke-width="3.8"/>
      <ellipse cx="104" cy="26" rx="6" ry="20" transform="rotate(-10 104 26)" fill="#fbcfe8"/>
      <ellipse cx="156" cy="24" rx="13" ry="30" transform="rotate(10 156 24)" fill="#ffffff" stroke="${outline}" stroke-width="3.8"/>
      <ellipse cx="156" cy="26" rx="6" ry="20" transform="rotate(10 156 26)" fill="#fbcfe8"/>
    `;
  }

  // 11. HAND PROP LAYER
  let handPropSvg = '';
  if (handPropId === 'magic_wand') {
    handPropSvg = `
      <line x1="192" y1="252" x2="218" y2="188" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
      <polygon points="218,170 223,182 236,182 225,190 229,202 218,194 207,202 211,190 200,182 213,182" fill="#fef08a" stroke="${outline}" stroke-width="3"/>
    `;
  } else if (handPropId === 'boba_tea') {
    handPropSvg = `
      <line x1="196" y1="210" x2="202" y2="232" stroke="#ec4899" stroke-width="5" stroke-linecap="round"/>
      <path d="M184 228 L210 228 L206 264 L188 264 Z" fill="#fbcfe8" stroke="${outline}" stroke-width="3.5"/>
      <circle cx="192" cy="258" r="2.8" fill="#451a03"/><circle cx="198" cy="259" r="2.8" fill="#451a03"/><circle cx="202" cy="256" r="2.8" fill="#451a03"/>
    `;
  } else if (handPropId === 'microphone') {
    handPropSvg = `
      <rect x="192" y="226" width="10" height="28" rx="4" transform="rotate(15 197 240)" fill="#38bdf8" stroke="${outline}" stroke-width="3.2"/>
      <circle cx="201" cy="218" r="11" fill="#fbbf24" stroke="${outline}" stroke-width="3.5"/>
    `;
  } else if (handPropId === 'ice_cream') {
    handPropSvg = `
      <polygon points="188,236 208,236 198,266" fill="#f59e0b" stroke="${outline}" stroke-width="3.2"/>
      <circle cx="198" cy="228" r="12" fill="#f472b6" stroke="${outline}" stroke-width="3.2"/>
      <circle cx="198" cy="214" r="4" fill="#ef4444"/>
    `;
  } else if (handPropId === 'plush_heart') {
    handPropSvg = `
      <path d="M196 260 C176 246, 174 226, 188 222 C196 220, 196 230, 196 230 C196 230, 196 220, 204 222 C218 226, 216 246, 196 260 Z" fill="#f43f5e" stroke="${outline}" stroke-width="3.5"/>
    `;
  } else if (handPropId === 'book_magic') {
    handPropSvg = `
      <rect x="180" y="222" width="32" height="38" rx="5" fill="#3b82f6" stroke="${outline}" stroke-width="3.5"/>
      <polygon points="196,232 199,239 206,239 200,244 202,251 196,246 190,251 192,244 186,239 193,239" fill="#fef08a"/>
    `;
  }

  return `
    <svg viewBox="0 0 260 375" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; overflow:visible; filter:drop-shadow(0 10px 18px rgba(0,0,0,0.2));">
      ${wingsSvg}
      ${backHairSvg}
      ${bodyBaseSvg}
      ${shoesSvg}
      ${bottomSvg}
      ${topSvg}
      ${blushSvg}
      ${eyesSvg}
      ${browsSvg}
      ${mouthSvg}
      ${frontHairSvg}
      ${hatSvg}
      ${handPropSvg}
    </svg>
  `;
};
