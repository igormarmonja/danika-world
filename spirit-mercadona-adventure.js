// ============================================================================
// MEGA MERCADONA ADVENTURE MODULE (v20261123_1 — 16,800px, 7 ZONES!)
// - Більша за Мега-Парк (7 зон = 16,800px завдовжки!)
// - 14+ головоломок на вивчення АНГЛІЙСЬКИХ СЛІВ (з озвученням англійською!)
// - 7 рухомих анімованих NPC у кожному відділі супермаркету
// - 10 СПРАВЖНІХ НЕВИДИМИХ ПРИХОВАНИХ ПРЕДМЕТІВ (не видно взагалі, стають
//   активними та з'являються ТІЛЬКИ при натисканні на них!)
// - Пастки супермаркету, батути, важіль та Золотий Кошик Скарбів!
// ============================================================================

(function () {
  const MERC_W = 16800;
  const ZONE_W = 2400;
  const GROUND_Y = 1140;
  const VER = '20261123_1';

  const ZONE_SRCS = [
    'assets/locations/loc_mercadona.jpg',
    'assets/locations/loc_mercadona_produce.jpg',
    'assets/locations/loc_mercadona_bakery.jpg',
    'assets/locations/loc_mercadona_meat.jpg',
    'assets/locations/loc_mercadona_drinks.jpg',
    'assets/locations/loc_petshop_store.jpg',
    'assets/locations/loc_vital_foodcourt.jpg'
  ];

  const BIOMES = [
    { x1: 0,     x2: 2400,  name: '1/7 • Вхід Меркадони та Візки' },
    { x1: 2400,  x2: 4800,  name: '2/7 • Фрукти та Овочі (Fruits)' },
    { x1: 4800,  x2: 7200,  name: '3/7 • Ароматна Пекарня (Bakery)' },
    { x1: 7200,  x2: 9600,  name: '4/7 • Сири та Делікатеси (Cheese)' },
    { x1: 9600,  x2: 12000, name: '5/7 • Напої, Сік та Морозиво (Drinks)' },
    { x1: 12000, x2: 14400, name: '6/7 • Зоо-Відділ для Бруно (Pets)' },
    { x1: 14400, x2: 16800, name: '7/7 • Кафе, Каса та Скарб (Checkout)' }
  ];

  // Верхні полиці-платформи та батути для стрибків
  const PLATFORMS = [
    { x1: 1250,  x2: 1780,  y: 780, style: 'shelf' },
    { x1: 3150,  x2: 3820,  y: 760, style: 'shelf' },
    { x1: 5600,  x2: 6350,  y: 750, style: 'shelf' },
    { x1: 8100,  x2: 8820,  y: 760, style: 'shelf' },
    { x1: 10500, x2: 11250, y: 750, style: 'shelf' },
    { x1: 12900, x2: 13680, y: 760, style: 'shelf' },
    { x1: 15100, x2: 15980, y: 740, style: 'shelf' },
    // Батути-грибочки/подушки, щоб застрибувати на верхні полиці
    { x1: 1060,  x2: 1180,  y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 2960,  x2: 3080,  y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 5400,  x2: 5520,  y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 7920,  x2: 8040,  y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 10320, x2: 10440, y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 12720, x2: 12840, y: 1065, isTrampoline: true, style: 'mushroom' },
    { x1: 14920, x2: 15040, y: 1065, isTrampoline: true, style: 'mushroom' }
  ];

  // Сходи на верхні яруси у Пекарні та Кафе-Касі
  const STAIR_PATHS = [
    { id: 'mc_st1', points: [{ x: 6420, y: GROUND_Y }, { x: 6260, y: 750 }] },
    { id: 'mc_st2', points: [{ x: 16060, y: GROUND_Y }, { x: 15880, y: 740 }] }
  ];

  // Пастки супермаркету (можна перестрибнути або прибрати кнопкою Дія за монетки!)
  const HAZARDS = [
    { id: 'mhz_1', type: 'trash',  x: 840,   y: GROUND_Y, w: 94, cleanable: true, label: 'Прибрати порожню коробку (+10 монет)' },
    { id: 'mhz_2', type: 'trash',  x: 2780,  y: GROUND_Y, w: 94, cleanable: true, label: 'Зібрати розсипані упаковки (+10 монет)' },
    { id: 'mhz_3', type: 'poop',   x: 4320,  y: GROUND_Y, w: 72, cleanable: true, label: 'Прибрати безлад у відділі (+10 монет)' },
    { id: 'mhz_4', type: 'trash',  x: 6820,  y: GROUND_Y, w: 94, cleanable: true, label: 'Прибрати пакети біля пекарні (+10 монет)' },
    { id: 'mhz_5', type: 'trash',  x: 9120,  y: GROUND_Y, w: 94, cleanable: true, label: 'Прибрати стаканчики (+10 монет)' },
    { id: 'mhz_6', type: 'poop',   x: 12460, y: GROUND_Y, w: 72, cleanable: true, label: 'Прибрати за цуценям у зоо-відділі (+10 монет)' },
    { id: 'mhz_7', type: 'trash',  x: 14680, y: GROUND_Y, w: 94, cleanable: true, label: 'Прибрати обгортки біля каси (+10 монет)' }
  ];

  const LEVERS = [];

  // 7 РУХОМИХ АНІМОВАНИХ NPC — КОЖЕН ВЧИТЬ АНГЛІЙСЬКИМ СЛОВАМ ЧЕРЕЗ ГОЛОВОЛОМКУ!
  const MOVING_NPCS = [
    {
      id: 'mc_npc_1', name: 'Консультант Лео', role: 'English Guide (Вхід)',
      sprite: 'assets/characters/char_hotel_leo.png',
      x: 560, y: GROUND_Y, patrolMin: 360, patrolMax: 740, speed: 66, facing: 1,
      questId: 'q_merc_en_1', isPuzzle: true, enSpeak: 'Shopping Cart',
      puzzle: {
        q: 'English Word #1: Як англійською називається «Візок для покупок» у супермаркеті?',
        options: ['Shopping Cart (Шопінг карт)', 'Sleeping Bed', 'Flying Bus'],
        correct: 0
      },
      rewardCoins: 35, rewardXp: 45,
      dialogBefore: 'Hello, Danika! Ласкаво просимо у величезну Меркадону! Тут ми вчимо англійські слова, а на полицях заховано 10 НЕВИДИМИХ предметів — натискай прямо на цікаві речі на картинках, щоб їх знайти! Готова до першого англійського слова?',
      dialogAfter: 'Great job! Йди далі у Фруктовий відділ і не забувай клікати по полицях — там сховані невидимі скарби!'
    },
    {
      id: 'mc_npc_2', name: 'Фермерка Софія', role: 'Фрукти (Fruits)',
      sprite: 'assets/characters/char_park_sofia.png',
      x: 3420, y: GROUND_Y, patrolMin: 3180, patrolMax: 3680, speed: 68, facing: -1,
      questId: 'q_merc_en_2', isPuzzle: true, enSpeak: 'Strawberry',
      puzzle: {
        q: 'English Word #2: Як англійською перекладається солодка ягідка «Полуниця»?',
        options: ['Strawberry (Стробері)', 'Potato', 'Onion'],
        correct: 0
      },
      rewardCoins: 40, rewardXp: 50,
      dialogBefore: 'Welcome to Fruits! У нашому фруктовому саду стільки смачних англійських слів! Відгадай, як буде «Полуниця» англійською!',
      dialogAfter: 'Yummy! Strawberry — це полуниця! А ще спробуй натиснути на апельсини та яблучка на полицях — деякі з них чарівні!'
    },
    {
      id: 'mc_npc_3', name: 'Пекар Пепе', role: 'Пекарня (Bakery)',
      sprite: 'assets/characters/char_market_pepe.png',
      x: 5980, y: GROUND_Y, patrolMin: 5720, patrolMax: 6220, speed: 62, facing: -1,
      questId: 'q_merc_en_3', isPuzzle: true, enSpeak: 'Bread and Cake',
      puzzle: {
        q: 'English Word #3: Як англійською сказати «Хліб і Торт»?',
        options: ['Bread and Cake (Бред енд Кейк)', 'Water and Milk', 'Sun and Moon'],
        correct: 0
      },
      rewardCoins: 40, rewardXp: 55,
      dialogBefore: 'Mmm, smells delicious! У нашій пекарні все свіженьке. Як англійською сказати «Хліб і Торт»?',
      dialogAfter: 'Bravo! Bread and Cake! Піднімися сходами праворуч — там на верхній полиці є ще англійська головоломка!'
    },
    {
      id: 'mc_npc_4', name: 'Сировар Ніко', role: 'Сири (Cheese & Deli)',
      sprite: 'assets/characters/char_cafe_nico.png',
      x: 8460, y: GROUND_Y, patrolMin: 8220, patrolMax: 8740, speed: 64, facing: 1,
      questId: 'q_merc_en_4', isPuzzle: true, enSpeak: 'Yellow Cheese',
      puzzle: {
        q: 'English Word #4: Що означає англійський вираз «Yellow Cheese»?',
        options: ['Жовтий сир', 'Зелене яблуко', 'Червоний помідор'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Hi Danika! У відділі делікатесів є загадка про сир. Як перекладається «Yellow Cheese»?',
      dialogAfter: 'Awesome! Yellow Cheese — жовтий сир! Рушай далі до відділу напоїв і морозива!'
    },
    {
      id: 'mc_npc_5', name: 'Вчитель Матео', role: 'Напої та Морозиво',
      sprite: 'assets/characters/char_school_mateo.png',
      x: 10880, y: GROUND_Y, patrolMin: 10620, patrolMax: 11140, speed: 66, facing: -1,
      questId: 'q_merc_en_5', isPuzzle: true, enSpeak: 'Ice Cream and Juice',
      puzzle: {
        q: 'English Word #5: Обери правильний переклад слів «Ice Cream» та «Juice»:',
        options: ['Морозиво та Сік', 'Хліб та Суп', 'Школа та Парк'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 60,
      dialogBefore: 'Hello! Спекотно в Гандії — саме час вивчити слова про прохолодні напої та морозиво!',
      dialogAfter: 'Superstar! Ice Cream — морозиво, Juice — сік! Попереду улюблений відділ Бруно!'
    },
    {
      id: 'mc_npc_6', name: 'Ніколь', role: 'Зоо-Відділ Бруно (Pets)',
      sprite: 'assets/characters/char_pet_nicole.png',
      x: 13260, y: GROUND_Y, patrolMin: 13000, patrolMax: 13520, speed: 70, facing: -1,
      questId: 'q_merc_en_6', isPuzzle: true, enSpeak: 'Happy Puppy',
      puzzle: {
        q: 'English Word #6: Як англійською назвати нашого Бруно — «Щасливе Цуценя»?',
        options: ['Happy Puppy (Хепі Папі)', 'Sleepy Cat', 'Big Bear'],
        correct: 0
      },
      rewardCoins: 50, rewardXp: 65,
      dialogBefore: 'Look at Bruno! Бруно так радіє в зоо-відділі! Як англійською сказати «Щасливе Цуценя»?',
      dialogAfter: 'Woof! Happy Puppy! Ти вже майже біля Головної Каси та Золотого Кошика Скарбів!'
    },
    {
      id: 'mc_npc_7', name: 'Касирка Хлоя', role: 'Головна Каса (Checkout)',
      sprite: 'assets/characters/char_mall_chloe.png',
      x: 15540, y: 740, patrolMin: 15220, patrolMax: 15820, speed: 58, facing: -1,
      questId: 'q_merc_en_7', isPuzzle: true, enSpeak: 'Thank you very much',
      puzzle: {
        q: 'English Word #7 (Фінал!): Як ввічливо сказати касиру англійською «Дуже дякую!»?',
        options: ['Thank you very much!', 'Good night!', 'Where is my shoe?'],
        correct: 0
      },
      rewardCoins: 80, rewardXp: 100,
      dialogBefore: 'Congratulations! Ти пройшла всі 7 відділів величезної Меркадони! Залишилась фінальна англійська фраза на касі!',
      dialogAfter: 'Thank you very much! Відкрий Золотий Кошик Скарбів поруч на полиці!'
    }
  ];

  // ДОДАТКОВІ ІНТЕРАКТИВНІ СТАНЦІЇ З АНГЛІЙСЬКИМИ ГОЛОВОЛОМКАМИ НА ПОЛИЦЯХ + ФІНАЛЬНА СКРИНЯ
  const STATIONS = [
    {
      id: 'mc_en_shelf_1', x: 1520, y: 780, title: 'English Card: Apple & Banana',
      prompt: 'Англійська загадка на полиці (+25 монет)',
      customPuzzle: {
        q: 'English Quiz: Який фрукт англійською називається «Banana», а який — «Apple»?',
        options: ['Банан і Яблуко', 'Груша і Слива', 'Кавун і Диня'],
        correct: 0, enSpeak: 'Apple and Banana'
      }
    },
    {
      id: 'mc_en_shelf_2', x: 3480, y: 760, title: 'English Card: Carrot & Orange',
      prompt: 'Англійська загадка про овочі (+25 монет)',
      customPuzzle: {
        q: 'English Quiz: Що означає англійське слово «Carrot»?',
        options: ['Морква (Керот)', 'Огірок', 'Капуста'],
        correct: 0, enSpeak: 'Carrot'
      }
    },
    {
      id: 'mc_en_shelf_3', x: 5980, y: 750, title: 'English Card: Cookie & Chocolate',
      prompt: 'Солодка англійська загадка (+30 монет)',
      customPuzzle: {
        q: 'English Quiz: Як англійською перекладається «Шоколадне печиво»?',
        options: ['Chocolate Cookie', 'Tomato Soup', 'Green Salad'],
        correct: 0, enSpeak: 'Chocolate Cookie'
      }
    },
    {
      id: 'mc_en_shelf_4', x: 8460, y: 760, title: 'English Card: Milk & Butter',
      prompt: 'Молочна англійська загадка (+30 монет)',
      customPuzzle: {
        q: 'English Quiz: Як англійською сказати «Молоко»?',
        options: ['Milk (Мілк)', 'Bread', 'Fish'],
        correct: 0, enSpeak: 'Milk'
      }
    },
    {
      id: 'mc_en_shelf_5', x: 10860, y: 750, title: 'English Card: Cold Water',
      prompt: 'Англійська загадка про напої (+30 монет)',
      customPuzzle: {
        q: 'English Quiz: Що означає «Water» англійською?',
        options: ['Вода (Вотер)', 'Сік', 'Чай'],
        correct: 0, enSpeak: 'Water'
      }
    },
    {
      id: 'mc_en_shelf_6', x: 13280, y: 760, title: 'English Card: Dog Bone & Toy',
      prompt: 'Англійська загадка для Бруно (+35 монет)',
      customPuzzle: {
        q: 'English Quiz: Як англійською сказати «Кісточка та Іграшка»?',
        options: ['Bone and Toy', 'Book and Pen', 'Hat and Coat'],
        correct: 0, enSpeak: 'Bone and Toy'
      }
    },
    {
      id: 'mc_grand_chest', x: 15860, y: 740, title: 'Золотий Кошик Скарбів Меркадони',
      prompt: 'Відкрити Головний Скарб Меркадони (+120 монет)',
      chestId: 'ch_megamerc_grand', bonus: 120
    }
  ];

  // 10 СПРАВЖНІХ НЕВИДИМИХ ПРИХОВАНИХ ПРЕДМЕТІВ (invisible: true — 0 візуальних підказок до кліку!)
  // Стають активними і з'являються ТІЛЬКИ коли дитина натискає прямо на них!
  const SECRETS = [
    { id: 'mc_hid_1',  x: 420,   y: 860,  invisible: true, enWord: 'Basket',     label: 'Прихований кошик (Basket)',          coins: 30, xp: 25 },
    { id: 'mc_hid_2',  x: 1960,  y: 920,  invisible: true, enWord: 'Flower',     label: 'Прихована квітка (Flower)',          coins: 30, xp: 25 },
    { id: 'mc_hid_3',  x: 2940,  y: 840,  invisible: true, enWord: 'Orange',     label: 'Золотий апельсин (Orange)',          coins: 30, xp: 25 },
    { id: 'mc_hid_4',  x: 4120,  y: 820,  invisible: true, enWord: 'Apple',      label: 'Таємне яблуко (Apple)',              coins: 30, xp: 25 },
    { id: 'mc_hid_5',  x: 5340,  y: 860,  invisible: true, enWord: 'Croissant',  label: 'Секретний круасан (Croissant)',      coins: 35, xp: 25 },
    { id: 'mc_hid_6',  x: 7680,  y: 850,  invisible: true, enWord: 'Cheese',     label: 'Шматочок сиру (Cheese)',             coins: 35, xp: 30 },
    { id: 'mc_hid_7',  x: 10180, y: 840,  invisible: true, enWord: 'Ice Cream',  label: 'Сховане морозиво (Ice Cream)',       coins: 35, xp: 30 },
    { id: 'mc_hid_8',  x: 11520, y: 880,  invisible: true, enWord: 'Juice',      label: 'Секретний сік (Juice)',              coins: 35, xp: 30 },
    { id: 'mc_hid_9',  x: 13840, y: 860,  invisible: true, enWord: 'Bone',       label: 'Золота кісточка Бруно (Bone)',       coins: 40, xp: 35 },
    { id: 'mc_hid_10', x: 16240, y: 900,  invisible: true, enWord: 'Gift',       label: 'Таємний подарунок на касі (Gift)',   coins: 50, xp: 40 }
  ];

  const DOORS = [
    { id: 'mc_door_start', x: 150,   y: GROUND_Y, label: 'Вийти на Карту / у Віллу', targetRoom: 'villa',   targetX: 1900, targetY: 1135, needKey: null },
    { id: 'mc_door_end',   x: 16620, y: GROUND_Y, label: 'Вийти у Мега-Парк Пригод', targetRoom: 'petpark', targetX: 320,  targetY: 1120, needKey: null }
  ];

  const zoneImgs = [];
  const propSprites = {};
  let assetsStarted = false;

  function ensureAssetsLoaded() {
    if (assetsStarted) return;
    assetsStarted = true;
    ZONE_SRCS.forEach((src, i) => {
      const img = new Image();
      img.src = src + '?v=' + VER;
      img.onload = () => { zoneImgs[i] = img; };
    });

    // Використовуємо вже згенерований мальований спрайт-лист пропсів
    const sheet = new Image();
    sheet.crossOrigin = 'anonymous';
    sheet.src = 'assets/characters/pixar/park_traps_sheet.jpg?v=' + VER;
    sheet.onload = () => {
      const keys = ['poop', 'trash', 'mushroom', 'thorns', 'lever', 'chest'];
      keys.forEach((k, idx) => {
        propSprites[k] = cutWhiteBg(sheet, (idx % 3) / 3, Math.floor(idx / 3) / 2, 1 / 3, 0.5);
      });
    };
  }

  function cutWhiteBg(img, nx, ny, nw, nh) {
    const sx = Math.round(nx * img.width), sy = Math.round(ny * img.height);
    const sw = Math.round(nw * img.width), sh = Math.round(nh * img.height);
    const c = document.createElement('canvas'); c.width = sw; c.height = sh;
    const ctx = c.getContext('2d'); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const id = ctx.getImageData(0, 0, sw, sh), d = id.data;
    const w = sw, h = sh, vis = new Uint8Array(w * h), q = new Int32Array(w * h);
    let hd = 0, tl = 0;
    const isW = (i) => { const p = i * 4; return d[p] >= 235 && d[p + 1] >= 235 && d[p + 2] >= 235; };
    const push = (x, y) => { if (x < 0 || x >= w || y < 0 || y >= h) return; const i = y * w + x; if (!vis[i] && isW(i)) { vis[i] = 1; q[tl++] = i; } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (hd < tl) {
      const cur = q[hd++], cx = cur % w, cy = (cur / w) | 0;
      d[cur * 4 + 3] = 0;
      if (cx > 0) push(cx - 1, cy); if (cx < w - 1) push(cx + 1, cy);
      if (cy > 0) push(cx, cy - 1); if (cy < h - 1) push(cx, cy + 1);
    }
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (!vis[i] && d[i * 4 + 3] > 25) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    ctx.putImageData(id, 0, 0);
    const pad = 4; minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
    const cw = Math.max(16, maxX - minX + 1), ch = Math.max(16, maxY - minY + 1);
    const out = document.createElement('canvas'); out.width = cw; out.height = ch;
    out.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
    return out;
  }

  function drawProp(ctx, sprite, cx, bottomY, maxW, maxH) {
    if (!sprite) return;
    const asp = sprite.width / sprite.height;
    let dw = maxW, dh = maxW / asp;
    if (dh > maxH) { dh = maxH; dw = dh * asp; }
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, bottomY - 2, dw * 0.36, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)'; ctx.fill();
    ctx.drawImage(sprite, cx - dw * 0.5, bottomY - dh, dw, dh);
    ctx.restore();
  }

  function getBiomeAt(x) {
    for (let i = 0; i < BIOMES.length; i++) {
      if (x >= BIOMES[i].x1 && x < BIOMES[i].x2) return BIOMES[i];
    }
    return BIOMES[BIOMES.length - 1];
  }

  function renderMegaMercadonaWorld(ctx, camX, viewW, worldH, state) {
    ensureAssetsLoaded();

    // 1. 7 панорамних зон Меркадони (16,800px)
    for (let i = 0; i < ZONE_SRCS.length; i++) {
      const zx = i * ZONE_W;
      if (zx + ZONE_W < camX - 100 || zx > camX + viewW + 100) continue;
      const img = zoneImgs[i];
      if (img) ctx.drawImage(img, zx, 0, ZONE_W, worldH);
      else { ctx.fillStyle = '#1e293b'; ctx.fillRect(zx, 0, ZONE_W, worldH); }
      if (i > 0) {
        const g = ctx.createLinearGradient(zx - 80, 0, zx + 80, 0);
        g.addColorStop(0, 'rgba(15, 23, 42, 0)');
        g.addColorStop(0.5, 'rgba(15, 23, 42, 0.25)');
        g.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = g; ctx.fillRect(zx - 80, 0, 160, worldH);
      }
    }

    // 2. Дерев'яні верхні полиці-містки та батути
    PLATFORMS.forEach(p => {
      if (p.x2 < camX - 120 || p.x1 > camX + viewW + 120) return;
      if (p.style === 'mushroom') {
        drawProp(ctx, propSprites.mushroom, (p.x1 + p.x2) * 0.5, GROUND_Y + 6, 120, 108);
      } else {
        ctx.save();
        ctx.fillStyle = 'rgba(146, 64, 14, 0.88)';
        ctx.beginPath(); ctx.roundRect(p.x1, p.y, p.x2 - p.x1, 22, 8); ctx.fill();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
      }
    });

    // 3. Пастки супермаркету
    HAZARDS.forEach(hz => {
      if (hz.x + hz.w < camX - 150 || hz.x - hz.w > camX + viewW + 150) return;
      if (state.clearedHazards && state.clearedHazards[hz.id]) return;
      if (hz.type === 'poop') drawProp(ctx, propSprites.poop, hz.x, GROUND_Y + 4, 84, 84);
      else if (hz.type === 'trash') drawProp(ctx, propSprites.trash, hz.x, GROUND_Y + 6, 114, 90);
    });

    // 4. Золотий Кошик Скарбів у Зоні 7
    const chestSt = STATIONS.find(s => s.chestId);
    if (chestSt && chestSt.x > camX - 150 && chestSt.x < camX + viewW + 150) {
      drawProp(ctx, propSprites.chest, chestSt.x, chestSt.y + 4, 122, 106);
    }

    // 5. Знайдені приховані предмети (до кліку вони 100% НЕВИДИМІ! З'являються лише ПІСЛЯ знаходження!)
    SECRETS.forEach(sec => {
      if (!(state.foundSecrets && state.foundSecrets[sec.id])) return;
      if (sec.x < camX - 120 || sec.x > camX + viewW + 120) return;
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.beginPath(); ctx.roundRect(sec.x - 62, sec.y - 16, 124, 30, 10); ctx.fill();
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = '#bbf7d0'; ctx.font = '800 15px "Nunito", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(sec.enWord, sec.x, sec.y - 1);
      ctx.restore();
    });
  }

  window.MEGA_MERCADONA_DATA = {
    WORLD_W: MERC_W,
    GROUND_Y,
    BIOMES,
    PLATFORMS,
    STAIR_PATHS,
    HAZARDS,
    LEVERS,
    MOVING_NPCS,
    SECRETS,
    STATIONS,
    DOORS,
    getBiomeAt,
    renderMegaMercadonaWorld
  };
})();
