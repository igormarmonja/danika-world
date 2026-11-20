// ============================================================================
// MEGA PARK ADVENTURE MODULE (v20261120_7 — 100% HAND-PAINTED SPIRITFARER ART)
// 6 мальованих панорамних зон (14,400px), мальований спрайт-лист пасток і предметів,
// рухомі анімовані NPC з головоломками, точні сходи на дерева й Золоту Альтанку!
// ============================================================================

(function () {
  const PARK_W = 14400;
  const ZONE_W = 2400;
  const GROUND_Y = 1120;
  const VER = '20261120_7';

  const ZONE_SRCS = [
    'assets/characters/pixar/park_zone1_entrance.jpg',
    'assets/characters/pixar/park_zone2_agility.jpg',
    'assets/characters/pixar/park_zone3_river.jpg',
    'assets/characters/pixar/park_zone4_treehouse.jpg',
    'assets/characters/pixar/park_zone5_labyrinth.jpg',
    'assets/characters/pixar/park_zone6_waterfall.jpg'
  ];

  const BIOMES = [
    { x1: 0,     x2: 2400,  name: '1/6 • Квіткова Алея Входу' },
    { x1: 2400,  x2: 4800,  name: '2/6 • Собачий Майданчик Бруно' },
    { x1: 4800,  x2: 7200,  name: '3/6 • Річка та Камінці' },
    { x1: 7200,  x2: 9600,  name: '4/6 • Містечко на Деревах' },
    { x1: 9600,  x2: 12000, name: '5/6 • Лабіринт Кущів і Гілок' },
    { x1: 12000, x2: 14400, name: '6/6 • Водоспад та Золота Альтанка' }
  ];

  // Точно підігнані під мальовані картинки платформи, гілки, будиночки на деревах та батути-грибочки!
  const PLATFORMS = [
    // Зона 3: Мальовані камінці через річку (park_zone3_river.jpg)
    { x1: 4800 + 800,  x2: 4800 + 1620, y: 1090, invisible: true },
    // Зона 4: Двоповерхові будиночки на деревах і підвісний міст (park_zone4_treehouse.jpg)
    { x1: 7200 + 485,  x2: 7200 + 1015, y: 650, invisible: true },
    { x1: 7200 + 1000, x2: 7200 + 1545, y: 670, invisible: true },
    { x1: 7200 + 1525, x2: 7200 + 2140, y: 650, invisible: true },
    // Зона 5: Верхня товста гілка-місток над лабіринтом кущів (park_zone5_labyrinth.jpg)
    { x1: 9600 + 260,  x2: 9600 + 2140, y: 495, invisible: true },
    // Зона 6: Підлога Золотої Альтанки праворуч (park_zone6_waterfall.jpg)
    { x1: 12000 + 1500, x2: 12000 + 2050, y: 710, invisible: true },
    // Пружні мальовані грибочки-батути (підкидають на верхні гілки та перелітають пастки!)
    { x1: 1620,  x2: 1740,  y: 1045, isTrampoline: true, style: 'mushroom' },
    { x1: 9820,  x2: 9940,  y: 1045, isTrampoline: true, style: 'mushroom' },
    { x1: 10540, x2: 10660, y: 1045, isTrampoline: true, style: 'mushroom' }
  ];

  // Сходи, що точно збігаються з намальованими дерев'яними сходами на картинках!
  const STAIR_PATHS = [
    // Зона 4: Діагональні сходи на праве дерево (park_zone4_treehouse.jpg)
    { id: 'pk_st_tree', points: [{ x: 7200 + 1545, y: GROUND_Y }, { x: 7200 + 1995, y: 650 }] },
    // Зона 6: Вигнуті дерев'яні сходи в Золоту Альтанку (park_zone6_waterfall.jpg)
    { id: 'pk_st_gazebo', points: [{ x: 12000 + 1820, y: GROUND_Y }, { x: 12000 + 2065, y: 900 }, { x: 12000 + 1965, y: 710 }] }
  ];

  // Пастки на дорозі (малюються з мальованого спрайт-листа park_traps_sheet.jpg!)
  const HAZARDS = [
    // Зона 1
    { id: 'hz_poop_1',   type: 'poop',   x: 820,   y: GROUND_Y, w: 72,  cleanable: true, label: 'Прибрати за песиком в еко-пакетик (+10 монет)' },
    { id: 'hz_trash_1',  type: 'trash',  x: 1380,  y: GROUND_Y, w: 94,  cleanable: true, label: 'Прибрати сміття в урну (+10 монет)' },
    { id: 'hz_thorns_0', type: 'thorns', x: 1920,  y: GROUND_Y, w: 120 },
    // Зона 2
    { id: 'hz_poop_2',   type: 'poop',   x: 2740,  y: GROUND_Y, w: 72,  cleanable: true, label: 'Прибрати какашку в пакетик (+10 монет)' },
    { id: 'hz_trash_2',  type: 'trash',  x: 3220,  y: GROUND_Y, w: 94,  cleanable: true, label: 'Прибрати пластикові пляшки (+10 монет)' },
    { id: 'hz_poop_3',   type: 'poop',   x: 3820,  y: GROUND_Y, w: 72,  cleanable: true, label: 'Прибрати за песиком (+10 монет)' },
    // Зона 3 (Річка на картинці park_zone3_river.jpg — можна перестрибнути по каменях або опустити дерев'яний міст важелем!)
    { id: 'hz_river',    type: 'pit',    x: 4800 + 1210, y: GROUND_Y, w: 620, isRiver: true, bridgeLeverId: 'lv_river' },
    { id: 'hz_trash_3',  type: 'trash',  x: 6820,  y: GROUND_Y, w: 94,  cleanable: true, label: 'Прибрати сміття біля річки (+10 монет)' },
    // Зона 4
    { id: 'hz_poop_4',   type: 'poop',   x: 8050,  y: GROUND_Y, w: 72,  cleanable: true, label: 'Прибрати какашку під дубом (+10 монет)' },
    { id: 'hz_thorns_1', type: 'thorns', x: 9280,  y: GROUND_Y, w: 120 },
    // Зона 5 (Лабіринт кущів)
    { id: 'hz_thorns_2', type: 'thorns', x: 10180, y: GROUND_Y, w: 145 },
    { id: 'hz_trash_4',  type: 'trash',  x: 11120, y: GROUND_Y, w: 94,  cleanable: true, label: 'Прибрати сміття у лабіринті (+10 монет)' },
    { id: 'hz_poop_5',   type: 'poop',   x: 11680, y: GROUND_Y, w: 72,  cleanable: true, label: 'Прибрати за песиком (+10 монет)' }
  ];

  // Важелі (мальований важіль із спрайт-листа!)
  const LEVERS = [
    { id: 'lv_river', x: 4800 + 680, y: GROUND_Y, targetHazard: 'hz_river', label: 'Потягнути важіль: Опустити міст через річку!' }
  ];

  // 6 рухомих анімованих NPC з головоломками та завданнями
  const MOVING_NPCS = [
    {
      id: 'pk_npc_sofia', name: 'Софія', role: 'Еко-рейнджерка Парку',
      sprite: 'assets/characters/char_park_sofia.png',
      x: 520, y: GROUND_Y, patrolMin: 340, patrolMax: 680, speed: 68, facing: 1,
      questId: 'q_megapark_clean', needCleanCount: 3,
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Привіт, Даніко та Бруно! Попереду величезний парк, але хулігани накидали сміття і не прибрали за песиками. Оминай пастки стрибком або прибирай їх кнопкою Дія — прибери 3 пастки, і я дам нагороду!',
      dialogReady: 'Молодець, Даніко! Парк став чистим і затишним! Тримай нагороду еко-героїні!',
      dialogAfter: 'Йди далі праворуч — попереду Собачий Майданчик, Річка, Містечко на Деревах і Водоспад Скарбів!'
    },
    {
      id: 'pk_npc_lucas', name: 'Лукас', role: 'Мандрівник-загадкар',
      sprite: 'assets/characters/char_beach_lucas.png',
      x: 3520, y: GROUND_Y, patrolMin: 3340, patrolMax: 3700, speed: 72, facing: -1,
      questId: 'q_megapark_riddle1', isPuzzle: true,
      puzzle: {
        q: 'Головоломка Лукаса: У парку ростуть 4 дуби, на кожному дубі по 3 білочки. Скільки всього білочок у парку?',
        options: ['12 білочок', '7 білочок', '10 білочок'],
        correct: 0
      },
      rewardCoins: 40, rewardXp: 50,
      dialogBefore: 'Гей, Даніко! Я гуляю Собачим Майданчиком і придумав для тебе лісову головоломку. Розгадаєш її?',
      dialogAfter: 'Ти дуже розумна! Попереду біля річки є важіль — потягни його, щоб опустити міст, або перестрибни по камінцях!'
    },
    {
      id: 'pk_npc_pepe', name: 'Пекар Пепе', role: 'Пікнік біля Річки',
      sprite: 'assets/characters/char_market_pepe.png',
      x: 6560, y: GROUND_Y, patrolMin: 6420, patrolMax: 6720, speed: 62, facing: -1,
      questId: 'q_megapark_riddle2', isPuzzle: true,
      puzzle: {
        q: 'Загадка Пікніка: Що потрібно сказати іспанською, коли хочеш попросити у парку «Воду та Яблуко»?',
        options: ['Agua y Manzana', 'Sol y Luna', 'Perro y Gato'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Ого, ти перейшла через річку! Відпочинь біля мого пікніка і розгадай іспанську загадку за смачний бонус!',
      dialogAfter: 'Чудово! Далі починається Містечко на Деревах — піднімайся сходами праворуч і переходь по підвісному містку!'
    },
    {
      id: 'pk_npc_mateo', name: 'Вчитель Матео', role: 'Вартовий Будиночка на Дереві',
      sprite: 'assets/characters/char_school_mateo.png',
      x: 7200 + 740, y: 650, patrolMin: 7200 + 540, patrolMax: 7200 + 960, speed: 58, facing: 1,
      questId: 'q_megapark_treehouse', isPuzzle: true,
      puzzle: {
        q: 'Головоломка на дереві: Якщо зараз 15:00, котра година буде через 2 години і 30 хвилин?',
        options: ['17:30', '16:30', '18:00'],
        correct: 0
      },
      rewardCoins: 55, rewardXp: 70,
      dialogBefore: 'Браво! Ти піднялася на дерево і пройшла по підвісному містку! Розв’яжи мою задачку з годинником!',
      dialogAfter: 'Справжня дослідниця! Далі праворуч — Таємний Лабіринт Кущів!'
    },
    {
      id: 'pk_npc_nicole', name: 'Ніколь', role: 'Подружка в Лабіринті',
      sprite: 'assets/characters/char_pet_nicole.png',
      x: 10860, y: GROUND_Y, patrolMin: 10720, patrolMax: 11020, speed: 68, facing: -1,
      questId: 'q_megapark_maze', isPuzzle: true,
      puzzle: {
        q: 'Секрет Лабіринту: У кошику було 18 полуничок. Даніка і Бруно з’їли 5. Скільки полуничок залишилось?',
        options: ['13 полуничок', '12 полуничок', '14 полуничок'],
        correct: 0
      },
      rewardCoins: 55, rewardXp: 70,
      dialogBefore: 'Ти пройшла колючі кущі лабіринту! Допоможи мені порахувати ягідки, і я покажу дорогу до Водоспаду Скарбів!',
      dialogAfter: 'Водоспад Бажань і Золота Альтанка вже зовсім поруч праворуч!'
    },
    {
      id: 'pk_npc_chloe', name: 'Хлоя', role: 'Хранителька Водоспаду',
      sprite: 'assets/characters/char_mall_chloe.png',
      x: 12000 + 1680, y: 710, patrolMin: 12000 + 1560, patrolMax: 12000 + 1860, speed: 52, facing: -1,
      questId: 'q_megapark_finale', isPuzzle: true,
      puzzle: {
        q: 'Фінальна Загадка Парку: Як англійською мовою називається «Водоспад»?',
        options: ['Waterfall', 'Rainbow', 'Mountain'],
        correct: 0
      },
      rewardCoins: 90, rewardXp: 110,
      dialogBefore: 'Неймовірно! Ти пройшла весь величезний Парк Пригод аж до Золотої Альтанки! Розгадай фінальну загадку за Гранд-Скарб!',
      dialogAfter: 'Ти абсолютна чемпіонка Мега-Парку Гандії! Відкрий Золоту Скриню поруч!'
    }
  ];

  const SECRETS = [
    { id: 'pk_sec_1', x: 1120,        y: 960, label: 'Схованка за квітковою лавочкою', coins: 25, xp: 20 },
    { id: 'pk_sec_2', x: 3460,        y: 940, label: 'Золотий м’ячик біля веселкового тунелю', coins: 30, xp: 25 },
    { id: 'pk_sec_3', x: 4800 + 1850, y: 920, label: 'Річкова перлина за кам’яним стовпом', coins: 35, xp: 25 },
    { id: 'pk_sec_4', x: 7200 + 1260, y: 615, label: 'Ліхтарик на підвісному містку', coins: 35, xp: 30 },
    { id: 'pk_sec_5', x: 9600 + 1150, y: 445, label: 'Кристал на верхній гілці лабіринту', coins: 40, xp: 35 },
    { id: 'pk_sec_6', x: 12000 + 960, y: 990, label: 'Веселковий камінь біля водоспаду', coins: 45, xp: 35 }
  ];

  const STATIONS = [
    { id: 'pk_grand_chest', x: 12000 + 1900, y: 710, title: 'Золота Скриня Водоспаду', prompt: 'Відкрити Гранд-Скарб Парку (+100 монет)', chestId: 'ch_megapark_grand', bonus: 100 }
  ];

  const DOORS = [
    { id: 'pk_door_start', x: 140,   y: GROUND_Y, label: 'Повернутися у Віллу Гандії', targetRoom: 'villa', targetX: 1900, targetY: 1135, needKey: null },
    { id: 'pk_door_end',   x: 14220, y: GROUND_Y, label: 'Вийти на Пляж Гандії', targetRoom: 'beach', targetX: 460, targetY: 1155, needKey: null }
  ];

  // Завантаження 6 мальованих панорам та вирізання 6 мальованих пропсів (3x2)
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
    sheet.src = 'assets/characters/pixar/park_traps_sheet.jpg?v=' + VER;
    sheet.onload = () => {
      const keys = ['poop', 'trash', 'mushroom', 'thorns', 'lever', 'chest'];
      keys.forEach((k, idx) => {
        const col = idx % 3, row = Math.floor(idx / 3);
        propSprites[k] = cutWhiteBg(sheet, col / 3, row / 2, 1 / 3, 0.5);
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
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

  function renderMegaParkWorld(ctx, camX, viewW, worldH, state) {
    ensureAssetsLoaded();

    // 1. Малюємо 6 зшитих мальованих панорам Spiritfarer / Ghibli!
    for (let i = 0; i < ZONE_SRCS.length; i++) {
      const zx = i * ZONE_W;
      if (zx + ZONE_W < camX - 100 || zx > camX + viewW + 100) continue;
      const img = zoneImgs[i];
      if (img) {
        ctx.drawImage(img, zx, 0, ZONE_W, worldH);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(zx, 0, ZONE_W, worldH);
      }
      // М'яке сонячне розтушовування на стику зон
      if (i > 0) {
        const g = ctx.createLinearGradient(zx - 90, 0, zx + 90, 0);
        g.addColorStop(0, 'rgba(254, 243, 199, 0)');
        g.addColorStop(0.5, 'rgba(254, 243, 199, 0.22)');
        g.addColorStop(1, 'rgba(254, 243, 199, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(zx - 90, 0, 180, worldH);
      }
    }

    // 2. Мальовані грибочки-батути
    PLATFORMS.forEach(p => {
      if (p.style !== 'mushroom') return;
      if (p.x2 < camX - 120 || p.x1 > camX + viewW + 120) return;
      drawProp(ctx, propSprites.mushroom, (p.x1 + p.x2) * 0.5, GROUND_Y + 6, 128, 115);
    });

    // 3. Мальовані пастки (какашки, сміття, колючі кущі) + опускний місток через річку!
    HAZARDS.forEach(hz => {
      if (hz.x + hz.w < camX - 150 || hz.x - hz.w > camX + viewW + 150) return;
      const cleared = state.clearedHazards && state.clearedHazards[hz.id];
      const bridged = hz.bridgeLeverId && state.pulledLevers && state.pulledLevers[hz.bridgeLeverId];

      if (hz.type === 'pit' && bridged) {
        // Міцний дерев'яний міст, опущений важелем поверх мальованої річки!
        ctx.save();
        ctx.fillStyle = '#92400e';
        ctx.beginPath(); ctx.roundRect(hz.x - hz.w / 2 - 20, GROUND_Y - 14, hz.w + 40, 26, 8); ctx.fill();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
      } else if (hz.type === 'poop' && !cleared) {
        drawProp(ctx, propSprites.poop, hz.x, GROUND_Y + 4, 86, 86);
      } else if (hz.type === 'trash' && !cleared) {
        drawProp(ctx, propSprites.trash, hz.x, GROUND_Y + 6, 115, 92);
      } else if (hz.type === 'thorns') {
        drawProp(ctx, propSprites.thorns, hz.x, GROUND_Y + 8, hz.w + 20, 115);
      }
    });

    // 4. Мальовані важелі
    LEVERS.forEach(lv => {
      if (lv.x < camX - 120 || lv.x > camX + viewW + 120) return;
      const pulled = state.pulledLevers && state.pulledLevers[lv.id];
      drawProp(ctx, propSprites.lever, lv.x, lv.y + 4, 96, 96, pulled ? -1 : 1);
    });

    // 5. Мальована Золота Скриня в Альтанці (Зона 6)
    const chestSt = STATIONS[0];
    if (chestSt && chestSt.x > camX - 150 && chestSt.x < camX + viewW + 150) {
      drawProp(ctx, propSprites.chest, chestSt.x, chestSt.y + 4, 125, 108);
    }
  }

  window.MEGA_PARK_DATA = {
    WORLD_W: PARK_W,
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
    renderMegaParkWorld
  };
})();
