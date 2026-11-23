// ============================================================================
// MEGA MERCADONA ADVENTURE MODULE (v20261123_2 — 100% HAND-PAINTED SPIRITFARER ART)
// - 7 безшовних мальованих панорамних зон Меркадони (16,800px!)
// - Мальований спрайт-лист пасток супермаркету (розлитий сік, розсипані апельсини,
//   подушка-батут, коробки, важіль, золотий кошик скарбів)
// - Точні сходи на 2-й поверх Пекарні-Кафе та Складу-Мезоніну
// - 14+ головоломок на вивчення АНГЛІЙСЬКИХ СЛІВ (з озвученням!)
// - 12 СПРАВЖНІХ НЕВИДИМИХ ПРИХОВАНИХ ПРЕДМЕТІВ (активуються тільки при кліку!)
// ============================================================================

(function () {
  const MERC_W = 16800;
  const ZONE_W = 2400;
  const GROUND_Y = 1135;
  const VER = '20261123_2';

  const ZONE_SRCS = [
    'assets/characters/pixar/merc_zone1_entrance.jpg',
    'assets/characters/pixar/merc_zone2_produce.jpg',
    'assets/characters/pixar/merc_zone3_bakery.jpg',
    'assets/characters/pixar/merc_zone4_dairy.jpg',
    'assets/characters/pixar/merc_zone5_pets_sweets.jpg',
    'assets/characters/pixar/merc_zone6_warehouse.jpg',
    'assets/characters/pixar/merc_zone7_checkout.jpg'
  ];

  const BIOMES = [
    { x1: 0,     x2: 2400,  name: '1/7 • Вхід, Візки та Квіти (Entrance)' },
    { x1: 2400,  x2: 4800,  name: '2/7 • Свіжі Фрукти та Овочі (Fruits)' },
    { x1: 4800,  x2: 7200,  name: '3/7 • Пекарня та Кафе на 2-му поверсі (Bakery)' },
    { x1: 7200,  x2: 9600,  name: '4/7 • Молоко, Сири та Морозиво (Dairy)' },
    { x1: 9600,  x2: 12000, name: '5/7 • Зоо-Відділ Бруно та Солодощі (Pets & Sweets)' },
    { x1: 12000, x2: 14400, name: '6/7 • Двоповерховий Склад-Мезонін (Stockroom)' },
    { x1: 14400, x2: 16800, name: '7/7 • Каси, Подарунки та Вихід (Checkout)' }
  ];

  // Невидимі платформи точно по намальованих балконах 2-го поверху + пружні подушки-батути!
  const PLATFORMS = [
    // Зона 1: Балкончик на 2-му поверсі праворуч (merc_zone1_entrance.jpg)
    { x1: 1880, x2: 2350, y: 460, invisible: true },
    // Зона 3: Балкон Кафе на 2-му поверсі над Пекарнею (merc_zone3_bakery.jpg)
    { x1: 4800 + 1080, x2: 4800 + 2220, y: 650, invisible: true },
    // Зона 6: Балкон-Мезонін 2-го поверху Складу з таємними дверима (merc_zone6_warehouse.jpg)
    { x1: 12000 + 360, x2: 12000 + 1360, y: 650, invisible: true },
    // Мальовані подушки-батути (підкидають високо вгору!)
    { x1: 1580,  x2: 1700,  y: 1060, isTrampoline: true, style: 'cushion' },
    { x1: 5620,  x2: 5740,  y: 1060, isTrampoline: true, style: 'cushion' },
    { x1: 10680, x2: 10800, y: 1060, isTrampoline: true, style: 'cushion' }
  ];

  // Сходи, які точно повторюють намальовані сходи на картинках!
  const STAIR_PATHS = [
    // Зона 1: Сходи біля входу праворуч
    { id: 'mc_st_ent', points: [{ x: 1850, y: GROUND_Y }, { x: 2320, y: 620 }, { x: 2120, y: 460 }] },
    // Зона 3: Дерев'яні сходи на 2-й поверх Кафе в Пекарні
    { id: 'mc_st_bak', points: [{ x: 4800 + 1855, y: GROUND_Y }, { x: 4800 + 2320, y: 740 }, { x: 4800 + 2120, y: 650 }] },
    // Зона 6: Дерев'яні сходи вгору-вліво на 2-й поверх Складу-Мезоніну
    { id: 'mc_st_war', points: [{ x: 12000 + 1850, y: GROUND_Y }, { x: 12000 + 1740, y: 970 }, { x: 12000 + 1340, y: 650 }] }
  ];

  // Пастки супермаркету з мальованого листа merc_traps_sheet.jpg!
  // type: 'juice' (розлитий сік), 'oranges' (розсипані апельсини), 'boxes' (коробки)
  const HAZARDS = [
    { id: 'mhz_1', type: 'juice',   x: 860,   y: GROUND_Y, w: 96,  cleanable: true, label: 'Витерти розлитий сік (+10 монет)' },
    { id: 'mhz_2', type: 'oranges', x: 2820,  y: GROUND_Y, w: 105, cleanable: true, label: 'Зібрати розсипані апельсини в кошик (+10 монет)' },
    { id: 'mhz_3', type: 'boxes',   x: 4280,  y: GROUND_Y, w: 110, cleanable: true, label: 'Скласти картонні коробки (+10 монет)' },
    { id: 'mhz_4', type: 'juice',   x: 6420,  y: GROUND_Y, w: 96,  cleanable: true, label: 'Прибрати розлитий сироп у пекарні (+10 монет)' },
    { id: 'mhz_5', type: 'oranges', x: 8920,  y: GROUND_Y, w: 105, cleanable: true, label: 'Зібрати апельсини біля холодильника (+10 монет)' },
    { id: 'mhz_6', type: 'boxes',   x: 11260, y: GROUND_Y, w: 110, cleanable: true, label: 'Прибрати коробки у відділі солодощів (+10 монет)' },
    { id: 'mhz_7', type: 'boxes',   x: 12960, y: GROUND_Y, w: 110, cleanable: true, label: 'Розібрати завал коробок на складі (+10 монет)' },
    { id: 'mhz_8', type: 'juice',   x: 15180, y: GROUND_Y, w: 96,  cleanable: true, label: 'Витерти калюжу біля каси (+10 монет)' }
  ];

  const LEVERS = [
    { id: 'lv_merc_war', x: 12000 + 1120, y: GROUND_Y, label: 'Потягнути важіль складу (+20 XP)' }
  ];

  // 7 РУХОМИХ АНІМОВАНИХ ГЕРОЇВ — ВЧАТЬ АНГЛІЙСЬКИМ СЛОВАМ У КОЖНОМУ ВІДДІЛІ!
  const MOVING_NPCS = [
    {
      id: 'mc_npc_1', name: 'Консультант Лео', role: 'English Guide (Вхід)',
      sprite: 'assets/characters/char_hotel_leo.png',
      x: 560, y: GROUND_Y, patrolMin: 360, patrolMax: 740, speed: 66, facing: 1,
      questId: 'q_merc_en_1', isPuzzle: true, enSpeak: 'Shopping Cart and Flowers',
      puzzle: {
        q: 'English Word #1: Як англійською називаються «Візок для покупок» та «Квіти» біля входу?',
        options: ['Shopping Cart & Flowers', 'Sleeping Bed & Trees', 'School Bus & Books'],
        correct: 0
      },
      rewardCoins: 35, rewardXp: 45,
      dialogBefore: 'Hello, Danika! Ласкаво просимо у величезну мальовану Меркадону! Тут ми вчимо англійські слова, а прямо на вітринах заховано 12 НЕВИДИМИХ предметів — натискай прямо на квіти, фрукти, круасани, сир і подарунки на картинках! Готова до першого англійського слова?',
      dialogAfter: 'Great job! Спробуй натиснути на соняшники на квітковому стенді поруч — там схований невидимий предмет!'
    },
    {
      id: 'mc_npc_2', name: 'Фермерка Софія', role: 'Фрукти та Овочі (Produce)',
      sprite: 'assets/characters/char_park_sofia.png',
      x: 3420, y: GROUND_Y, patrolMin: 3120, patrolMax: 3720, speed: 68, facing: -1,
      questId: 'q_merc_en_2', isPuzzle: true, enSpeak: 'Strawberry, Banana and Carrot',
      puzzle: {
        q: 'English Word #2: Як англійською перекладаються «Полуниця, Банан і Морква»?',
        options: ['Strawberry, Banana & Carrot', 'Potato, Onion & Garlic', 'Bread, Butter & Soup'],
        correct: 0
      },
      rewardCoins: 40, rewardXp: 50,
      dialogBefore: 'Welcome to Produce! Подивись на наші дерев’яні ящики з фруктами! Відгадай, як англійською будуть «Полуниця, Банан і Морква»!',
      dialogAfter: 'Yummy! А тепер натисни прямо на апельсини, банани чи моркву в ящиках — знайдеш невидимі англійські картки!'
    },
    {
      id: 'mc_npc_3', name: 'Пекар Пепе', role: 'Пекарня та Кафе (Bakery)',
      sprite: 'assets/characters/char_market_pepe.png',
      x: 5620, y: GROUND_Y, patrolMin: 5380, patrolMax: 5980, speed: 62, facing: -1,
      questId: 'q_merc_en_3', isPuzzle: true, enSpeak: 'Fresh Bread and Strawberry Cake',
      puzzle: {
        q: 'English Word #3: Як англійською сказати «Свіжий Хліб і Полуничний Торт»?',
        options: ['Fresh Bread & Strawberry Cake', 'Cold Water & White Milk', 'Big House & Green Park'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Mmm, smells delicious! Наші печі печуть круасани й тортики. Як англійською сказати «Свіжий Хліб і Полуничний Торт»?',
      dialogAfter: 'Bravo! Піднімися дерев’яними сходами праворуч на 2-й поверх у наше затишне Кафе!'
    },
    {
      id: 'mc_npc_4', name: 'Сировар Ніко', role: 'Молоко, Сир і Морозиво',
      sprite: 'assets/characters/char_cafe_nico.png',
      x: 8420, y: GROUND_Y, patrolMin: 8120, patrolMax: 8740, speed: 64, facing: 1,
      questId: 'q_merc_en_4', isPuzzle: true, enSpeak: 'Milk, Cheese and Ice Cream',
      puzzle: {
        q: 'English Word #4: Що означають англійські слова «Milk, Cheese and Ice Cream»?',
        options: ['Молоко, Сир і Морозиво', 'Яблуко, Груша і Слива', 'Шапка, Куртка і Чоботи'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Hi Danika! Поглянь на наші блакитні й зелені холодильники та вітрину з морозивом! Як перекладаються «Milk, Cheese and Ice Cream»?',
      dialogAfter: 'Awesome! Спробуй натиснути прямо на пляшечки молока, головки сиру та морозиво на вітрині!'
    },
    {
      id: 'mc_npc_5', name: 'Ніколь', role: 'Зоо-Відділ Бруно та Солодощі',
      sprite: 'assets/characters/char_pet_nicole.png',
      x: 10520, y: GROUND_Y, patrolMin: 10220, patrolMax: 10840, speed: 68, facing: -1,
      questId: 'q_merc_en_5', isPuzzle: true, enSpeak: 'Puppy Bone, Candy and Chocolate',
      puzzle: {
        q: 'English Word #5: Як англійською сказати «Кісточка цуценяти, Цукерка і Шоколад»?',
        options: ['Puppy Bone, Candy & Chocolate', 'Red Car, Bike & Train', 'Pencil, Book & Desk'],
        correct: 0
      },
      rewardCoins: 50, rewardXp: 65,
      dialogBefore: 'Look at Bruno! Зліва — полиці зі смаколиками та м’ячиками для Бруно, а справа — баночки з цукерками! Відгадай ці англійські слова!',
      dialogAfter: 'Superstar! Натисни на м’ячики для Бруно або на кольорові льодяники на вітрині!'
    },
    {
      id: 'mc_npc_6', name: 'Вчитель Матео', role: 'Двоповерховий Склад (Stockroom)',
      sprite: 'assets/characters/char_school_mateo.png',
      x: 12000 + 820, y: 650, patrolMin: 12000 + 520, patrolMax: 12000 + 1180, speed: 58, facing: 1,
      questId: 'q_merc_en_6', isPuzzle: true, enSpeak: 'Boxes, Baskets and Secret Door',
      puzzle: {
        q: 'English Word #6: Ти піднялася на 2-й поверх Складу! Як англійською будуть «Коробки, Кошики і Таємні Двері»?',
        options: ['Boxes, Baskets & Secret Door', 'Windows, Chairs & Table', 'Clouds, Rain & Snow'],
        correct: 0
      },
      rewardCoins: 55, rewardXp: 70,
      dialogBefore: 'Вітаю на 2-му поверсі Складу-Мезоніну! Тут зберігаються подарункові коробки й плетені кошики. Відгадай ці англійські слова!',
      dialogAfter: 'Brilliant! Попереду фінальна 7-ма зона — Каси та Пакування Подарунків!'
    },
    {
      id: 'mc_npc_7', name: 'Касирка Хлоя', role: 'Каси та Подарунки (Checkout)',
      sprite: 'assets/characters/char_mall_chloe.png',
      x: 15460, y: GROUND_Y, patrolMin: 15120, patrolMax: 15820, speed: 60, facing: -1,
      questId: 'q_merc_en_7', isPuzzle: true, enSpeak: 'Gift Box and Thank you very much',
      puzzle: {
        q: 'English Word #7 (Фінал!): Як англійською сказати «Подарункова коробка» та «Дуже дякую!»?',
        options: ['Gift Box & Thank you very much!', 'Good morning & Goodbye!', 'Open the window please!'],
        correct: 0
      },
      rewardCoins: 85, rewardXp: 100,
      dialogBefore: 'Congratulations! Ти пройшла всі 7 мальованих залів Мега-Меркадони! Розгадай фінальну англійську загадку біля столу пакування подарунків!',
      dialogAfter: 'Thank you very much! Забирай нагороду з Золотого Кошика Скарбів поруч!'
    }
  ];

  // ДОДАТКОВІ АНГЛІЙСЬКІ СТАНЦІЇ НА БАЛКОНАХ 2-ГО ПОВЕРХУ + ФІНАЛЬНИЙ ЗОЛОТИЙ КОШИК
  const STATIONS = [
    {
      id: 'mc_en_cafe_loft', x: 4800 + 1480, y: 650, title: 'English Cafe Quiz (2-й поверх)',
      prompt: 'Англійська загадка за столиком Кафе (+35 монет)',
      customPuzzle: {
        q: 'Cafe English: Як англійською замовити «Чашку чаю та круасан»?',
        options: ['A cup of tea and a croissant', 'A glass of cold milk', 'Two big watermelons'],
        correct: 0, enSpeak: 'A cup of tea and a croissant'
      }
    },
    {
      id: 'mc_grand_chest', x: 16220, y: GROUND_Y, title: 'Золотий Кошик Скарбів Меркадони',
      prompt: 'Відкрити Головний Скарб Меркадони (+120 монет)',
      chestId: 'ch_megamerc_grand', bonus: 120
    }
  ];

  // 12 СПРАВЖНІХ НЕВИДИМИХ ПРИХОВАНИХ ПРЕДМЕТІВ (invisible: true)
  // Координати точно відповідають намальованим предметам на 7 нових картинках!
  // Їх НЕ ВИДНО взагалі — вони активуються та вимовляють англійське слово ТІЛЬКИ при натисканні на них!
  const SECRETS = [
    // Зона 1 (Вхід): Візки (x~780, y~980) та Соняшники на стенді (x~1280, y~740)
    { id: 'mc_hid_1',  x: 780,          y: 960, invisible: true, enWord: 'Shopping Cart', label: 'Візок (Shopping Cart)',         coins: 30, xp: 25 },
    { id: 'mc_hid_2',  x: 1320,         y: 740, invisible: true, enWord: 'Sunflowers',    label: 'Соняшники (Sunflowers)',        coins: 30, xp: 25 },
    // Зона 2 (Фрукти): Апельсини (x~2400+320, y~900), Банани (x~2400+1320, y~880), Морква (x~2400+1860, y~880)
    { id: 'mc_hid_3',  x: 2400 + 320,   y: 890, invisible: true, enWord: 'Sweet Oranges', label: 'Солодкі апельсини (Oranges)',   coins: 30, xp: 25 },
    { id: 'mc_hid_4',  x: 2400 + 1320,  y: 880, invisible: true, enWord: 'Yellow Bananas',label: 'Жовті банани (Bananas)',        coins: 30, xp: 25 },
    // Зона 3 (Пекарня): Кам'яна піч з вогнем (x~4800+210, y~880) та Тортики з полуницею (x~4800+1480, y~940)
    { id: 'mc_hid_5',  x: 4800 + 210,   y: 880, invisible: true, enWord: 'Bakery Oven',   label: 'Гаряча піч (Bakery Oven)',      coins: 35, xp: 25 },
    { id: 'mc_hid_6',  x: 4800 + 1480,  y: 940, invisible: true, enWord: 'Strawberry Cake',label:'Полуничний торт (Cake)',        coins: 35, xp: 30 },
    // Зона 4 (Молочка): Золоті головки сиру (x~7200+740, y~780) та Вітрина морозива (x~7200+1380, y~920)
    { id: 'mc_hid_7',  x: 7200 + 740,   y: 780, invisible: true, enWord: 'Golden Cheese', label: 'Золотий сир (Golden Cheese)',   coins: 35, xp: 30 },
    { id: 'mc_hid_8',  x: 7200 + 1380,  y: 920, invisible: true, enWord: 'Ice Cream Cone',label: 'Ріжок морозива (Ice Cream)',    coins: 35, xp: 30 },
    // Зона 5 (Зоо і Солодощі): Жовті тенісні м'ячики Бруно (x~9600+860, y~1020) та Спіральні льодяники (x~9600+1860, y~740)
    { id: 'mc_hid_9',  x: 9600 + 860,   y: 1010,invisible: true, enWord: 'Puppy Balls',   label: 'М’ячики Бруно (Puppy Balls)',   coins: 40, xp: 35 },
    { id: 'mc_hid_10', x: 9600 + 1860,  y: 740, invisible: true, enWord: 'Sweet Lollipops',label:'Кольорові льодяники (Lollipops)',coins: 40, xp: 35 },
    // Зона 6 (Склад): Таємні двері на 2-му поверсі (x~12000+840, y~520)
    { id: 'mc_hid_11', x: 12000 + 840,  y: 520, invisible: true, enWord: 'Secret Door',   label: 'Таємні двері складу (Secret Door)', coins: 45, xp: 35 },
    // Зона 7 (Каса): Стіл упаковки подарунків із бантиками (x~14400+1420, y~820)
    { id: 'mc_hid_12', x: 14400 + 1420, y: 820, invisible: true, enWord: 'Gift Ribbons',  label: 'Стрічки для подарунків (Ribbons)', coins: 50, xp: 40 }
  ];

  const DOORS = [
    { id: 'mc_door_start', x: 180,   y: GROUND_Y, label: 'Вийти у Віллу Гандії',      targetRoom: 'villa',   targetX: 1900, targetY: 1135, needKey: null },
    { id: 'mc_door_end',   x: 16580, y: GROUND_Y, label: 'Вийти у Мега-Парк Пригод', targetRoom: 'petpark', targetX: 320,  targetY: 1120, needKey: null }
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

    const sheet = new Image();
    sheet.crossOrigin = 'anonymous';
    sheet.src = 'assets/characters/pixar/merc_traps_sheet.jpg?v=' + VER;
    sheet.onload = () => {
      const keys = ['juice', 'oranges', 'cushion', 'boxes', 'lever', 'basket'];
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
        if (!vis[i]) {
          const p = i * 4;
          if (vis[i - 1] || vis[i + 1] || vis[i - w] || vis[i + w]) {
            const lum = (d[p] + d[p + 1] + d[p + 2]) / 3;
            if (lum > 220) d[p + 3] = Math.max(0, Math.min(255, (255 - lum) * 7));
          }
          if (d[p + 3] > 25) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
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

  function drawProp(ctx, sprite, cx, bottomY, maxW, maxH, flipX = 1) {
    if (!sprite) return;
    const asp = sprite.width / sprite.height;
    let dw = maxW, dh = maxW / asp;
    if (dh > maxH) { dh = maxH; dw = dh * asp; }
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, bottomY - 2, dw * 0.36, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fill();
    ctx.translate(cx, bottomY - dh * 0.5);
    ctx.scale(flipX, 1);
    ctx.drawImage(sprite, -dw * 0.5, -dh * 0.5, dw, dh);
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

    // 1. Малюємо 7 безшовних мальованих панорам Меркадони (16,800px)!
    for (let i = 0; i < ZONE_SRCS.length; i++) {
      const zx = i * ZONE_W;
      if (zx + ZONE_W < camX - 100 || zx > camX + viewW + 100) continue;
      const img = zoneImgs[i];
      if (img) ctx.drawImage(img, zx, 0, ZONE_W, worldH);
      else { ctx.fillStyle = '#1e293b'; ctx.fillRect(zx, 0, ZONE_W, worldH); }
    }

    // 2. Мальовані подушки-батути
    PLATFORMS.forEach(p => {
      if (p.style !== 'cushion') return;
      if (p.x2 < camX - 120 || p.x1 > camX + viewW + 120) return;
      drawProp(ctx, propSprites.cushion, (p.x1 + p.x2) * 0.5, GROUND_Y + 6, 130, 95);
    });

    // 3. Мальовані пастки супермаркету (розлитий сік, розсипані апельсини, коробки)
    HAZARDS.forEach(hz => {
      if (hz.x + hz.w < camX - 150 || hz.x - hz.w > camX + viewW + 150) return;
      if (state.clearedHazards && state.clearedHazards[hz.id]) return;
      if (hz.type === 'juice') drawProp(ctx, propSprites.juice, hz.x, GROUND_Y + 8, 120, 95);
      else if (hz.type === 'oranges') drawProp(ctx, propSprites.oranges, hz.x, GROUND_Y + 8, 128, 98);
      else if (hz.type === 'boxes') drawProp(ctx, propSprites.boxes, hz.x, GROUND_Y + 6, 135, 115);
    });

    // 4. Мальований важіль на складі
    LEVERS.forEach(lv => {
      if (lv.x < camX - 120 || lv.x > camX + viewW + 120) return;
      const pulled = state.pulledLevers && state.pulledLevers[lv.id];
      drawProp(ctx, propSprites.lever, lv.x, lv.y + 4, 92, 92, pulled ? -1 : 1);
    });

    // 5. Мальований Золотий Кошик Скарбів біля Каси (Зона 7)
    const chestSt = STATIONS.find(s => s.chestId);
    if (chestSt && chestSt.x > camX - 150 && chestSt.x < camX + viewW + 150) {
      drawProp(ctx, propSprites.basket, chestSt.x, chestSt.y + 6, 135, 120);
    }

    // 6. Знайдені приховані предмети (до кліку вони 100% НЕВИДИМІ!)
    SECRETS.forEach(sec => {
      if (!(state.foundSecrets && state.foundSecrets[sec.id])) return;
      if (sec.x < camX - 140 || sec.x > camX + viewW + 140) return;
      ctx.save();
      ctx.fillStyle = 'rgba(6, 78, 59, 0.85)';
      ctx.beginPath(); ctx.roundRect(sec.x - 74, sec.y - 16, 148, 30, 10); ctx.fill();
      ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.fillStyle = '#ecfdf5'; ctx.font = '800 14px "Nunito", sans-serif';
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
