// ============================================================================
// MEGA PARK ADVENTURE MODULE (14,400px LONG MULTI-LEVEL SPIRITFARER WORLD)
// 6 паркових зон, рухомі анімовані NPC з квестами й головоломками,
// інтерактивні пастки (собачі какашки, сміття, ями, колючі кущі, зламаний міст),
// важелі, батути-грибочки, сходи на дерева, схованки та водоспад скарбів!
// ============================================================================

(function () {
  const PARK_W = 14400;
  const GROUND_Y = 1120;

  // 6 тематичних зон вздовж 14,400px шляху
  const BIOMES = [
    { x1: 0,     x2: 2400,  name: '1/6 • Квіткова Алея Входу',       skyTop: '#38bdf8', skyBot: '#fef3c7', hill: '#4ade80', grass: '#22c55e', path: '#eab308' },
    { x1: 2400,  x2: 4800,  name: '2/6 • Собачий Майданчик Бруно',   skyTop: '#0ea5e9', skyBot: '#fde68a', hill: '#34d399', grass: '#16a34a', path: '#d97706' },
    { x1: 4800,  x2: 7200,  name: '3/6 • Річка та Старий Місток',    skyTop: '#0284c7', skyBot: '#bae6fd', hill: '#2dd4bf', grass: '#15803d', path: '#ca8a04' },
    { x1: 7200,  x2: 9600,  name: '4/6 • Містечко на Деревах',       skyTop: '#2563eb', skyBot: '#fed7aa', hill: '#10b981', grass: '#166534', path: '#b45309' },
    { x1: 9600,  x2: 12000, name: '5/6 • Таємний Лабіринт Кущів',    skyTop: '#4f46e5', skyBot: '#fbcfe8', hill: '#059669', grass: '#14532d', path: '#a16207' },
    { x1: 12000, x2: 14400, name: '6/6 • Водоспад та Золота Альтанка', skyTop: '#7c3aed', skyBot: '#fde047', hill: '#0d9488', grass: '#15803d', path: '#eab308' }
  ];

  // Багаторівневі платформи, гілки дерев, батути-грибочки та містки
  const PLATFORMS = [
    // Зона 1: Перші дерев'яні містки над калюжами
    { x1: 1120, x2: 1480, y: 880, style: 'wood' },
    { x1: 1620, x2: 1960, y: 740, style: 'branch' },
    // Зона 2: Собачий майданчик (верхній ярус)
    { x1: 2820, x2: 3250, y: 860, style: 'wood' },
    { x1: 3380, x2: 3820, y: 700, style: 'wood' },
    { x1: 3960, x2: 4320, y: 860, style: 'wood' },
    // Зона 3: Річка — стрибки по каменях та верхні гілки
    { x1: 5250, x2: 5520, y: 950, style: 'stone' },
    { x1: 5640, x2: 5910, y: 860, style: 'stone' },
    { x1: 6040, x2: 6320, y: 940, style: 'stone' },
    { x1: 5400, x2: 6500, y: 620, style: 'branch' },
    // Зона 4: Дво- та триповерхове Містечко на Деревах!
    { x1: 7450, x2: 8350, y: 760, style: 'treehouse' },
    { x1: 8450, x2: 9250, y: 760, style: 'bridge' },
    { x1: 7750, x2: 8650, y: 450, style: 'treehouse' },
    // Зона 5: Лабіринт кущів (обхід колючих кущів зверху!)
    { x1: 10050, x2: 10520, y: 850, style: 'branch' },
    { x1: 10680, x2: 11180, y: 700, style: 'branch' },
    { x1: 11300, x2: 11750, y: 850, style: 'wood' },
    // Зона 6: Водоспад і Золота Альтанка
    { x1: 12450, x2: 12980, y: 820, style: 'stone' },
    { x1: 13120, x2: 13950, y: 660, style: 'gazebo' },
    // Грибочки-батути (підкидають високо вгору!)
    { x1: 960,   x2: 1080,  y: 1055, isTrampoline: true, style: 'mushroom' },
    { x1: 5080,  x2: 5200,  y: 1055, isTrampoline: true, style: 'mushroom' },
    { x1: 9880,  x2: 10000, y: 1055, isTrampoline: true, style: 'mushroom' },
    { x1: 12280, x2: 12400, y: 1055, isTrampoline: true, style: 'mushroom' }
  ];

  // Сходи та драбини на дерева (ідеально плавний підйом!)
  const STAIR_PATHS = [
    { id: 'pk_st1', points: [{ x: 7350, y: GROUND_Y }, { x: 7580, y: 760 }] },
    { id: 'pk_st2', points: [{ x: 8220, y: 760 }, { x: 8000, y: 450 }] },
    { id: 'pk_st3', points: [{ x: 9380, y: GROUND_Y }, { x: 9160, y: 760 }] },
    { id: 'pk_st4', points: [{ x: 13000, y: GROUND_Y }, { x: 13260, y: 660 }] }
  ];

  // ПАСТКИ НА ШЛЯХУ (собачі какашки, купи сміття, ями/калюжі, колючі кущі, підйомні містки!)
  // type: 'poop' | 'trash' | 'pit' | 'thorns'
  const HAZARDS = [
    // Зона 1
    { id: 'hz_poop_1',  type: 'poop',   x: 780,   y: GROUND_Y, w: 68,  cleanable: true,  label: 'Прибрати за песиком в еко-пакетик (+10 монет)' },
    { id: 'hz_trash_1', type: 'trash',  x: 1320,  y: GROUND_Y, w: 86,  cleanable: true,  label: 'Прибрати сміття в урну (+10 монет)' },
    { id: 'hz_pit_1',   type: 'pit',    x: 1820,  y: GROUND_Y, w: 170, bridgeLeverId: 'lv_pit_1' },
    // Зона 2
    { id: 'hz_poop_2',  type: 'poop',   x: 2680,  y: GROUND_Y, w: 68,  cleanable: true,  label: 'Прибрати какашку в пакетик (+10 монет)' },
    { id: 'hz_trash_2', type: 'trash',  x: 3150,  y: GROUND_Y, w: 86,  cleanable: true,  label: 'Прибрати пластикові пляшки (+10 монет)' },
    { id: 'hz_poop_3',  type: 'poop',   x: 3650,  y: GROUND_Y, w: 68,  cleanable: true,  label: 'Прибрати за песиком (+10 монет)' },
    { id: 'hz_pit_2',   type: 'pit',    x: 4180,  y: GROUND_Y, w: 185 },
    // Зона 3 (Широка річка — перестрибуй по каменях або опусти міст важелем!)
    { id: 'hz_pit_3',   type: 'pit',    x: 5750,  y: GROUND_Y, w: 960, isRiver: true, bridgeLeverId: 'lv_river' },
    { id: 'hz_trash_3', type: 'trash',  x: 6820,  y: GROUND_Y, w: 86,  cleanable: true,  label: 'Прибрати сміття біля берега (+10 монет)' },
    // Зона 4
    { id: 'hz_poop_4',  type: 'poop',   x: 7920,  y: GROUND_Y, w: 68,  cleanable: true,  label: 'Прибрати какашку під деревом (+10 монет)' },
    { id: 'hz_thorns_1',type: 'thorns', x: 8680,  y: GROUND_Y, w: 165 },
    // Зона 5 (Лабіринт кущів і пасток)
    { id: 'hz_thorns_2',type: 'thorns', x: 10280, y: GROUND_Y, w: 220 },
    { id: 'hz_pit_4',   type: 'pit',    x: 10920, y: GROUND_Y, w: 200, bridgeLeverId: 'lv_maze' },
    { id: 'hz_trash_4', type: 'trash',  x: 11480, y: GROUND_Y, w: 86,  cleanable: true,  label: 'Прибрати сміття у лабіринті (+10 монет)' },
    { id: 'hz_poop_5',  type: 'poop',   x: 11820, y: GROUND_Y, w: 68,  cleanable: true,  label: 'Прибрати за песиком (+10 монет)' },
    // Зона 6
    { id: 'hz_pit_5',   type: 'pit',    x: 12720, y: GROUND_Y, w: 195 }
  ];

  // ВАЖЕЛІ ДЛЯ ОПУСКАННЯ МІСТКІВ ЧЕРЕЗ ЯМИ ТА РІЧКУ!
  const LEVERS = [
    { id: 'lv_pit_1', x: 1640, y: GROUND_Y, targetHazard: 'hz_pit_1', label: 'Потягнути важіль: Опустити місток через яму!' },
    { id: 'lv_river', x: 5180, y: GROUND_Y, targetHazard: 'hz_pit_3', label: 'Потягнути важіль: Опустити міст через річку!' },
    { id: 'lv_maze',  x: 10720, y: 700,     targetHazard: 'hz_pit_4', label: 'Потягнути важіль на гілці: Місток у лабіринті!' }
  ];

  // 6 РУХОМИХ АНІМОВАНИХ ГЕРОЇВ (NPC), ЯКІ ХОДЯТЬ ПО ПАРКУ ТА ДАЮТЬ ЗАВДАННЯ Й ГОЛОВОЛОМКИ!
  const MOVING_NPCS = [
    {
      id: 'pk_npc_sofia', name: 'Софія', role: 'Еко-рейнджерка Парку',
      sprite: 'assets/characters/char_park_sofia.png',
      x: 520, y: GROUND_Y, patrolMin: 340, patrolMax: 680, speed: 68, facing: 1,
      questId: 'q_megapark_clean', needCleanCount: 3,
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Привіт, Даніко та Бруно! Попереду величезний парк, але хулігани накидали сміття і не прибрали за песиками. Оминай пастки стрибком або прибирай їх кнопкою Дія — прибери хоча б 3 пастки, і я дам тобі велику нагороду!',
      dialogReady: 'Молодець, Даніко! Парк став таким чистим і красивим! Тримай нагороду еко-героїні!',
      dialogAfter: 'Йди далі праворуч — там попереду річка, містечко на деревах і Водоспад Скарбів!'
    },
    {
      id: 'pk_npc_lucas', name: 'Лукас', role: 'Мандрівник-загадкар',
      sprite: 'assets/characters/char_beach_lucas.png',
      x: 3450, y: GROUND_Y, patrolMin: 3250, patrolMax: 3580, speed: 75, facing: -1,
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
      x: 6620, y: GROUND_Y, patrolMin: 6450, patrolMax: 6760, speed: 62, facing: -1,
      questId: 'q_megapark_riddle2', isPuzzle: true,
      puzzle: {
        q: 'Загадка Пікніка: Що потрібно сказати іспанською, коли хочеш попросити у парку «Воду та Яблуко»?',
        options: ['Agua y Manzana', 'Sol y Luna', 'Perro y Gato'],
        correct: 0
      },
      rewardCoins: 45, rewardXp: 55,
      dialogBefore: 'Ого, ти перейшла через річку! Відпочинь біля мого пікніка і розгадай іспанську загадку за смачний бонус!',
      dialogAfter: 'Чудово! Далі починається Містечко на Деревах — там є високі сходи аж на 3-й поверх!'
    },
    {
      id: 'pk_npc_mateo', name: 'Вчитель Матео', role: 'Вартовий Будиночка на Дереві',
      sprite: 'assets/characters/char_school_mateo.png',
      x: 8150, y: 450, patrolMin: 7850, patrolMax: 8520, speed: 65, facing: 1,
      questId: 'q_megapark_treehouse', isPuzzle: true,
      puzzle: {
        q: 'Головоломка на вершині дерева: Якщо зараз 15:00, котра година буде через 2 години і 30 хвилин?',
        options: ['17:30', '16:30', '18:00'],
        correct: 0
      },
      rewardCoins: 55, rewardXp: 70,
      dialogBefore: 'Браво! Ти піднялася на найвищий поверх Містечка на Деревах! Розв’яжи мою задачку з годинником!',
      dialogAfter: 'Справжня дослідниця! Спускайся праворуч і заходь у Таємний Лабіринт Кущів!'
    },
    {
      id: 'pk_npc_nicole', name: 'Ніколь', role: 'Подружка з Кошеням',
      sprite: 'assets/characters/char_pet_nicole.png',
      x: 11260, y: GROUND_Y, patrolMin: 11120, patrolMax: 11400, speed: 70, facing: -1,
      questId: 'q_megapark_maze', isPuzzle: true,
      puzzle: {
        q: 'Секрет Лабіринту: У кошику було 18 полуничок. Даніка і Бруно з’їли 5. Скільки полуничок залишилось?',
        options: ['13 полуничок', '12 полуничок', '14 полуничок'],
        correct: 0
      },
      rewardCoins: 55, rewardXp: 70,
      dialogBefore: 'Ти пройшла колючі кущі та ями лабіринту! Допоможи мені порахувати ягідки, і я покажу дорогу до Водоспаду Скарбів!',
      dialogAfter: 'Водоспад Бажань і Золота Альтанка вже зовсім поруч праворуч!'
    },
    {
      id: 'pk_npc_chloe', name: 'Хлоя', role: 'Хранителька Водоспаду',
      sprite: 'assets/characters/char_mall_chloe.png',
      x: 13580, y: 660, patrolMin: 13320, patrolMax: 13840, speed: 60, facing: -1,
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

  // СХОВАНКИ ПО ВСЬОМУ 14,400px ПАРКУ
  const SECRETS = [
    { id: 'pk_sec_1', x: 1790,  y: 700,  label: 'Пташине гніздечко з монетками', coins: 25, xp: 20 },
    { id: 'pk_sec_2', x: 3580,  y: 660,  label: 'Золотий м’ячик Бруно на майданчику', coins: 30, xp: 25 },
    { id: 'pk_sec_3', x: 5950,  y: 580,  label: 'Річкова перлина на гілці', coins: 35, xp: 25 },
    { id: 'pk_sec_4', x: 8860,  y: 720,  label: 'Ліхтарик на підвісному містку', coins: 35, xp: 30 },
    { id: 'pk_sec_5', x: 10940, y: 660,  label: 'Кристал лабіринту в листі', coins: 40, xp: 35 },
    { id: 'pk_sec_6', x: 12720, y: 780,  label: 'Веселковий камінь біля водоспаду', coins: 45, xp: 35 }
  ];

  // Фінальна скриня та станції
  const STATIONS = [
    { id: 'pk_grand_chest', x: 13840, y: 660, title: 'Золота Скриня Водоспаду', prompt: 'Відкрити Гранд-Скарб Парку (+100 монет)', chestId: 'ch_megapark_grand', bonus: 100 }
  ];

  // Двері виходу назад на карту / у Віллу
  const DOORS = [
    { id: 'pk_door_start', x: 140, y: GROUND_Y, label: 'Повернутися у Віллу Гандії', targetRoom: 'villa', targetX: 1900, targetY: 1135, needKey: null },
    { id: 'pk_door_end',   x: 14220, y: GROUND_Y, label: 'Вийти на Пляж Гандії', targetRoom: 'beach', targetX: 460, targetY: 1155, needKey: null }
  ];

  // Декоративні дерева, ліхтарі та лавочки (генеруються детерміновано для 60 FPS)
  const TREES = [];
  for (let x = 220; x < PARK_W - 200; x += 310) {
    const seed = Math.sin(x * 0.013) * 10000;
    const r = seed - Math.floor(seed);
    TREES.push({
      x: x + (r - 0.5) * 110,
      scale: 0.8 + r * 0.55,
      hue: r > 0.5 ? '#15803d' : '#166534',
      crown: r > 0.65 ? '#22c55e' : '#16a34a',
      hasLamp: (Math.floor(x / 310) % 2 === 0)
    });
  }

  // --------------------------------------------------------------------------
  // ПРОЦЕДУРНИЙ ПАРАЛАКС-РЕНДЕРЕР МЕГА-ПАРКУ В СТИЛІ SPIRITFARER / GHIBLI
  // --------------------------------------------------------------------------
  function getBiomeAt(x) {
    for (let i = 0; i < BIOMES.length; i++) {
      if (x >= BIOMES[i].x1 && x < BIOMES[i].x2) return BIOMES[i];
    }
    return BIOMES[BIOMES.length - 1];
  }

  function renderMegaParkWorld(ctx, camX, viewW, worldH, state) {
    const t = performance.now() * 0.001;
    const centerX = camX + viewW * 0.5;
    const biome = getBiomeAt(centerX);

    // 1. Небо (плавний градієнт)
    const sky = ctx.createLinearGradient(camX, 0, camX, worldH);
    sky.addColorStop(0, biome.skyTop);
    sky.addColorStop(0.75, biome.skyBot);
    sky.addColorStop(1, '#fef9c3');
    ctx.fillStyle = sky;
    ctx.fillRect(camX - 40, 0, viewW + 80, worldH);

    // Сонце
    const sunX = camX + viewW * 0.78;
    const sunGrad = ctx.createRadialGradient(sunX, 220, 20, sunX, 220, 170);
    sunGrad.addColorStop(0, 'rgba(255, 251, 235, 0.95)');
    sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
    sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(sunX, 220, 170, 0, Math.PI * 2); ctx.fill();

    // 2. Пухнасті хмарки (паралакс 0.12x)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    for (let i = 0; i < 16; i++) {
      const cx = camX * 0.85 + ((i * 540 + t * 14) % (viewW + 600)) - 200;
      const cy = 120 + (i % 4) * 78;
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.arc(cx + 38, cy - 12, 52, 0, Math.PI * 2);
      ctx.arc(cx + 82, cy, 38, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Далекі пагорби Гандії (паралакс 0.25x)
    ctx.fillStyle = 'rgba(20, 83, 45, 0.28)';
    ctx.beginPath();
    ctx.moveTo(camX - 60, worldH);
    for (let sx = camX - 60; sx <= camX + viewW + 120; sx += 120) {
      const h = 760 + Math.sin(sx * 0.0018) * 140 + Math.cos(sx * 0.0009) * 80;
      ctx.lineTo(sx, h);
    }
    ctx.lineTo(camX + viewW + 120, worldH);
    ctx.closePath();
    ctx.fill();

    // Ближчі зелені пагорби
    ctx.fillStyle = 'rgba(22, 163, 74, 0.42)';
    ctx.beginPath();
    ctx.moveTo(camX - 60, worldH);
    for (let sx = camX - 60; sx <= camX + viewW + 100; sx += 90) {
      const h = 880 + Math.sin(sx * 0.0032 + 1.5) * 90;
      ctx.lineTo(sx, h);
    }
    ctx.lineTo(camX + viewW + 100, worldH);
    ctx.closePath();
    ctx.fill();

    // 4. Водоспад у Зоні 6 (12400..13000)
    if (camX + viewW > 12200 && camX < 13400) {
      const wfGrad = ctx.createLinearGradient(12550, 260, 12550, GROUND_Y);
      wfGrad.addColorStop(0, '#bae6fd');
      wfGrad.addColorStop(0.5, '#38bdf8');
      wfGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = wfGrad;
      ctx.fillRect(12580, 280, 260, GROUND_Y - 280);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let k = 0; k < 6; k++) {
        const wy = 300 + ((t * 240 + k * 140) % (GROUND_Y - 340));
        ctx.fillRect(12605 + k * 38, wy, 14, 70);
      }
      // Веселка над водоспадом
      ctx.save();
      ctx.lineWidth = 10;
      ['rgba(244,63,94,0.32)', 'rgba(250,204,21,0.32)', 'rgba(56,189,248,0.35)'].forEach((col, ci) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(12950, GROUND_Y - 120, 420 - ci * 14, Math.PI, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 5. Дерева, паркові ліхтарі та вказівники зон
    TREES.forEach(tr => {
      if (tr.x < camX - 260 || tr.x > camX + viewW + 260) return;
      // Не ставимо дерева посеред річки
      if (tr.x > 5220 && tr.x < 6320) return;
      const s = tr.scale;
      // Стовбур
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tr.x - 16 * s, GROUND_Y - 240 * s, 32 * s, 240 * s);
      // Крона
      ctx.fillStyle = tr.hue;
      ctx.beginPath();
      ctx.arc(tr.x, GROUND_Y - 265 * s, 105 * s, 0, Math.PI * 2);
      ctx.arc(tr.x - 65 * s, GROUND_Y - 220 * s, 72 * s, 0, Math.PI * 2);
      ctx.arc(tr.x + 65 * s, GROUND_Y - 220 * s, 72 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tr.crown;
      ctx.beginPath();
      ctx.arc(tr.x - 18 * s, GROUND_Y - 290 * s, 68 * s, 0, Math.PI * 2);
      ctx.fill();

      // Парковий ліхтар
      if (tr.hasLamp) {
        const lx = tr.x + 110;
        ctx.fillStyle = '#334155';
        ctx.fillRect(lx - 4, GROUND_Y - 190, 8, 190);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(lx, GROUND_Y - 196, 13, 0, Math.PI * 2); ctx.fill();
      }
    });

    // 6. Основна земля, зелений газон і тепла паркова доріжка
    ctx.fillStyle = '#15803d';
    ctx.fillRect(camX - 40, GROUND_Y - 16, viewW + 80, worldH - GROUND_Y + 40);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(camX - 40, GROUND_Y - 4, viewW + 80, 44);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(camX - 40, GROUND_Y + 40, viewW + 80, worldH - GROUND_Y);

    // 7. Багаторівневі платформи, будиночки на деревах, містки та грибочки-батути
    PLATFORMS.forEach(p => {
      if (p.x2 < camX - 100 || p.x1 > camX + viewW + 100) return;
      ctx.save();
      if (p.style === 'mushroom') {
        const mx = (p.x1 + p.x2) * 0.5;
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(mx - 18, p.y + 10, 36, GROUND_Y - p.y - 10);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(mx, p.y + 12, 62, 26, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        [-30, 0, 30].forEach(ox => { ctx.beginPath(); ctx.arc(mx + ox, p.y + 2, 7, 0, Math.PI * 2); ctx.fill(); });
      } else if (p.style === 'stone') {
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.roundRect(p.x1, p.y, p.x2 - p.x1, 34, 14); ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.roundRect(p.x1 + 6, p.y + 4, p.x2 - p.x1 - 12, 12, 6); ctx.fill();
      } else if (p.style === 'gazebo') {
        // Золота альтанка
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p.x1 + 30, p.y, 20, GROUND_Y - p.y);
        ctx.fillRect(p.x2 - 50, p.y, 20, GROUND_Y - p.y);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.roundRect(p.x1, p.y, p.x2 - p.x1, 30, 8); ctx.fill();
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 4;
        ctx.strokeRect(p.x1 + 10, p.y - 54, p.x2 - p.x1 - 20, 54);
      } else {
        // Дерев'яна платформа / будиночок / підвісний міст
        ctx.fillStyle = p.style === 'branch' ? '#65a30d' : '#92400e';
        ctx.beginPath(); ctx.roundRect(p.x1, p.y, p.x2 - p.x1, 28, 10); ctx.fill();
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(p.x1 + 10, p.y + 5); ctx.lineTo(p.x2 - 10, p.y + 5); ctx.stroke();
        if (p.style === 'treehouse' || p.style === 'bridge') {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(p.x1, p.y - 52); ctx.lineTo(p.x2, p.y - 52); ctx.stroke();
          for (let rx = p.x1 + 20; rx < p.x2; rx += 65) {
            ctx.beginPath(); ctx.moveTo(rx, p.y); ctx.lineTo(rx, p.y - 52); ctx.stroke();
          }
        }
      }
      ctx.restore();
    });

    // 8. Сходи та дерев'яні драбини
    STAIR_PATHS.forEach(sp => {
      const a = sp.points[0], b = sp.points[1];
      if (Math.max(a.x, b.x) < camX - 100 || Math.min(a.x, b.x) > camX + viewW + 100) return;
      ctx.save();
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 14; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a.x - 18, a.y); ctx.lineTo(b.x - 18, b.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(a.x + 18, a.y); ctx.lineTo(b.x + 18, b.y); ctx.stroke();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 7;
      for (let i = 1; i < 9; i++) {
        const f = i / 9;
        const sx = a.x + (b.x - a.x) * f;
        const sy = a.y + (b.y - a.y) * f;
        ctx.beginPath(); ctx.moveTo(sx - 22, sy); ctx.lineTo(sx + 22, sy); ctx.stroke();
      }
      ctx.restore();
    });

    // 9. ПАСТКИ (собачі какашки, сміття, ями/річка з опускним містком, колючі кущі!)
    HAZARDS.forEach(hz => {
      if (hz.x + hz.w < camX - 120 || hz.x - hz.w > camX + viewW + 120) return;
      const cleared = state.clearedHazards && state.clearedHazards[hz.id];
      const bridged = hz.bridgeLeverId && state.pulledLevers && state.pulledLevers[hz.bridgeLeverId];

      ctx.save();
      if (hz.type === 'pit') {
        // Яма або Річка
        ctx.fillStyle = hz.isRiver ? '#0284c7' : '#3f2e21';
        ctx.fillRect(hz.x - hz.w / 2, GROUND_Y - 6, hz.w, 160);
        if (hz.isRiver) {
          ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
          for (let rx = hz.x - hz.w / 2 + 20; rx < hz.x + hz.w / 2 - 40; rx += 90) {
            ctx.fillRect(rx + Math.sin(t * 2 + rx) * 10, GROUND_Y + 12, 48, 8);
          }
        }
        // Якщо гравець потягнув важіль — малюємо міцний дерев'яний міст зверху!
        if (bridged) {
          ctx.fillStyle = '#b45309';
          ctx.fillRect(hz.x - hz.w / 2 - 14, GROUND_Y - 12, hz.w + 28, 22);
          ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 3;
          ctx.strokeRect(hz.x - hz.w / 2 - 14, GROUND_Y - 12, hz.w + 28, 22);
        }
      } else if (hz.type === 'poop' && !cleared) {
        // Мультяшна собача какашка (чистий вектор!)
        ctx.fillStyle = '#713f12';
        ctx.beginPath(); ctx.ellipse(hz.x, GROUND_Y - 8, 28, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#854d0e';
        ctx.beginPath(); ctx.ellipse(hz.x, GROUND_Y - 21, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(hz.x, GROUND_Y - 32, 10, 0, Math.PI * 2); ctx.fill();
        // Хвильки запаху
        ctx.strokeStyle = 'rgba(132, 204, 22, 0.78)'; ctx.lineWidth = 2.5;
        [-12, 0, 12].forEach((ox, idx) => {
          const wy = GROUND_Y - 46 - ((t * 22 + idx * 9) % 18);
          ctx.beginPath(); ctx.moveTo(hz.x + ox, wy); ctx.quadraticCurveTo(hz.x + ox + 5, wy - 8, hz.x + ox, wy - 16); ctx.stroke();
        });
      } else if (hz.type === 'trash' && !cleared) {
        // Купа сміття (пляшки, баночки, папірці)
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.roundRect(hz.x - 32, GROUND_Y - 26, 26, 26, 6); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.roundRect(hz.x - 4, GROUND_Y - 34, 20, 34, 7); ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.beginPath(); ctx.arc(hz.x + 24, GROUND_Y - 14, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(hz.x - 10, GROUND_Y - 32, 10, 0, Math.PI * 2); ctx.fill();
      } else if (hz.type === 'thorns') {
        // Колючий кущ (перестрибуй по гілках зверху!)
        ctx.fillStyle = '#14532d';
        for (let tx = hz.x - hz.w / 2 + 24; tx <= hz.x + hz.w / 2 - 24; tx += 36) {
          ctx.beginPath(); ctx.arc(tx, GROUND_Y - 28, 32, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
        for (let tx = hz.x - hz.w / 2 + 16; tx <= hz.x + hz.w / 2 - 16; tx += 28) {
          ctx.beginPath(); ctx.moveTo(tx, GROUND_Y - 52); ctx.lineTo(tx + 6, GROUND_Y - 68); ctx.stroke();
        }
      }
      ctx.restore();
    });

    // 10. Важелі містків
    LEVERS.forEach(lv => {
      if (lv.x < camX - 100 || lv.x > camX + viewW + 100) return;
      const pulled = state.pulledLevers && state.pulledLevers[lv.id];
      ctx.save();
      ctx.fillStyle = '#475569';
      ctx.fillRect(lv.x - 16, lv.y - 18, 32, 18);
      ctx.strokeStyle = pulled ? '#4ade80' : '#facc15';
      ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lv.x, lv.y - 14);
      ctx.lineTo(lv.x + (pulled ? 26 : -26), lv.y - 64);
      ctx.stroke();
      ctx.fillStyle = pulled ? '#4ade80' : '#ef4444';
      ctx.beginPath(); ctx.arc(lv.x + (pulled ? 26 : -26), lv.y - 64, 11, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
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
