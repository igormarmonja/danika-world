// ============================================================================
// SPIRITFARER 2D ADVENTURE: VECTOR ICONS, TRUE MULTI-FLOOR CUTAWAY WORLDS,
// INTERCONNECTED DOORS, KEYS, INVENTORY ITEMS, LIVING NPCS & MULTI-STEP QUESTS
// ============================================================================

(function () {
  // 1. ВЕКТОРНІ SVG-ІКОНКИ (0 ЕМОДЖІ)
  const ICONS = {
    coin: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" fill="#FACC15" stroke="#B45309" stroke-width="1.8"/><circle cx="12" cy="12" r="6.5" stroke="#FEF08A" stroke-width="1.4"/><path d="M12 7.5v9M9.8 10c0-1 1-1.6 2.2-1.6s2.2.6 2.2 1.6-1 1.5-2.2 1.7c-1.2.2-2.2.7-2.2 1.8s1 1.7 2.2 1.7 2.2-.6 2.2-1.6" stroke="#92400E" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.7l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8z" fill="#38BDF8" stroke="#E0F2FE" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 4h10v5a5 5 0 01-10 0V4z" fill="#FBBF24" stroke="#FEF3C7" stroke-width="1.5"/><path d="M7 6H4.5a2 2 0 000 4H7M17 6h2.5a2 2 0 010 4H17M12 14v4M8.5 20h7" stroke="#FEF3C7" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 6.2l5.5-2.2 6 2.2 5.5-2.2v13.8l-5.5 2.2-6-2.2-5.5 2.2V6.2z" fill="rgba(56,189,248,0.28)" stroke="#E0F2FE" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 4v13.8M15 6.2V20" stroke="#BAE6FD" stroke-width="1.5"/></svg>`,
    scroll: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="3" fill="rgba(251,191,36,0.25)" stroke="#FEF08A" stroke-width="1.7"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5" stroke="#FEF9C3" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    hanger: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 6.5a2 2 0 112-2c0 1.2-2 1.6-2 3v1.2L4.2 15a1.5 1.5 0 00.9 2.7h13.8a1.5 1.5 0 00.9-2.7L12 8.7" stroke="#FBCFE8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6.5" width="17" height="12" rx="3" stroke="#E0E7FF" stroke-width="1.7"/><circle cx="12" cy="12.5" r="3.2" stroke="#C7D2FE" stroke-width="1.7"/><path d="M8.5 6.5l1.2-2h4.6l1.2 2" stroke="#E0E7FF" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    paw: `<svg viewBox="0 0 24 24" fill="none"><circle cx="7.5" cy="9.5" r="2" fill="#FDE68A"/><circle cx="12" cy="7.5" r="2" fill="#FDE68A"/><circle cx="16.5" cy="9.5" r="2" fill="#FDE68A"/><path d="M12 12c-2.6 0-5 2-5 4.3 0 1.4 1.1 2.2 2.5 2.2 1 0 1.7-.4 2.5-.4s1.5.4 2.5.4c1.4 0 2.5-.8 2.5-2.2 0-2.3-2.4-4.3-5-4.3z" fill="#FDE68A"/></svg>`,
    hand: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 4.5v7M9.2 6.2v5.8M14.8 6.5v5.5M17.4 9.2v4.3c0 3.3-2.3 5.8-5.4 5.8s-5.2-2.1-5.8-5.2l-.9-3.6a1.4 1.4 0 012.6-.9l1.3 2.4" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    up: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6.5 10.5L12 5l5.5 5.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    stairs: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 19h5v-4h5v-4h5V7h1" stroke="#FFFFFF" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2 6.2L20 11l-6 1.8L12 19l-2-6.2L4 11l6-1.8L12 3z" fill="#FEF08A" stroke="#F59E0B" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" fill="rgba(148,163,184,0.35)" stroke="#E2E8F0" stroke-width="1.7"/><path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" stroke="#E2E8F0" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="12" r="4" fill="#FDE047" stroke="#B45309" stroke-width="1.6"/><path d="M12 12h8.5M17.5 12v3M20 12v2.5" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    door: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 20V5.5A1.5 1.5 0 017.5 4h9A1.5 1.5 0 0118 5.5V20M4 20h16" stroke="#BAE6FD" stroke-width="1.8" stroke-linecap="round"/><circle cx="14.5" cy="12.5" r="1.2" fill="#FDE047"/></svg>`,
    talk: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 6.5A2.5 2.5 0 017 4h10a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0117 16h-5.5L7 19.5V16A2.5 2.5 0 014.5 13.5v-7z" fill="rgba(244,114,182,0.28)" stroke="#FBCFE8" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 10-13 0c0 5.2 6.5 11 6.5 11z" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.7"/><circle cx="12" cy="10" r="2.3" fill="#FFFFFF"/></svg>`
  };
  window.SPIRIT_ICONS = ICONS;

  // 2. ПРЕДМЕТИ ІНВЕНТАРЮ (КЛЮЧІ, РЕЦЕПТИ, КРИСТАЛИ, СМАКОЛИКИ)
  window.SPIRIT_ITEMS = {
    key_attic:      { id: 'key_attic',      name: 'Срібний Ключ Горища', icon: 'key',     color: '#e2e8f0' },
    golden_recipe:  { id: 'golden_recipe',  name: 'Золотий Рецепт',      icon: 'scroll',  color: '#fde047' },
    star_crystal:   { id: 'star_crystal',   name: 'Зоряний Кристал',     icon: 'sparkle', color: '#38bdf8' },
    key_lighthouse: { id: 'key_lighthouse', name: 'Ключ від Маяка',      icon: 'key',     color: '#facc15' },
    golden_bone:    { id: 'golden_bone',    name: 'Золота Кісточка',     icon: 'paw',     color: '#fbbf24' },
    fresh_mango:    { id: 'fresh_mango',    name: 'Тропічне Манго',      icon: 'star',    color: '#fb923c' },
    vip_card:       { id: 'vip_card',       name: 'VIP-Картка Готелю',   icon: 'key',     color: '#f472b6' },
    crystal_gem:    { id: 'crystal_gem',    name: 'Королівський Кристал',icon: 'sparkle', color: '#c084fc' }
  };

  // 3. СПРАВЖНІ ДВОПОВЕРХОВІ SPIRITFARER-СВІТИ З ДВЕРИМА, СХОДАМИ, ЖИВИМИ NPC, КЛЮЧАМИ ТА СХОВАНКАМИ!
  // Кожна локація — повноцінний багаторівневий cutaway-світ, де двері ведуть в інші крила/кімнати,
  // герої дають сюжетні завдання на пошук предметів, а важелі та ключі відкривають таємні проходи!
  window.SPIRIT_LOCATIONS = {
    villa: {
      id: 'villa',
      name: 'Двоповерхова Вілла та Тераса Гандії',
      shortName: 'Вілла Гандії',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 16, y: 50 },
      bgSrc: 'assets/characters/pixar/spirit_room1_villa.jpg',
      groundY: 1135,
      platforms: [
        { x1: 700, x2: 1690, y: 448, label: '2-й поверх: Балкон' },
        { x1: 470, x2: 640, y: 970 },
        { x1: 810, x2: 990, y: 955, isTrampoline: true }
      ],
      stairPaths: [
        {
          id: 'villa_stairs',
          points: [{ x: 1585, y: 1135 }, { x: 1545, y: 780 }, { x: 1235, y: 448 }],
          onReachTopQuest: 'q_villa_loft'
        }
      ],
      // Живі NPC на локації з реальними квестами!
      npcs: [
        {
          id: 'npc_pepe',
          name: 'Пекар Пепе',
          role: 'Шеф-кондитер',
          sprite: 'assets/characters/char_market_pepe.png',
          x: 560, y: 1135, facing: 1,
          questId: 'q_villa_recipe',
          needItem: 'golden_recipe',
          rewardItem: 'key_attic',
          rewardCoins: 35, rewardXp: 45,
          dialogBefore: 'Привіт, Даніко! Я загубив свій Золотий Рецепт кексів десь біля каміна або на 2-му поверсі Вілли. Знайди його — і я подарую тобі Срібний Ключ від таємних дверей на балконі!',
          dialogReady: 'Ура! Ти знайшла мій Золотий Рецепт! Тримай Срібний Ключ — тепер ти можеш відімкнути двері на 2-му поверсі зліва і потрапити у Бутік Скарбів!',
          dialogAfter: 'Смачних пригод тобі і Бруно! Не забудь відімкнути двері на 2-му поверсі!'
        }
      ],
      // Реальні двері, які КУДИСЬ ВЕДУТЬ!
      doors: [
        {
          id: 'door_villa_to_beach',
          x: 2050, y: 1135,
          label: 'Вийти на Терасу до Пляжу',
          targetRoom: 'beach', targetX: 460, targetY: 1155,
          needKey: null
        },
        {
          id: 'door_villa_attic_secret',
          x: 745, y: 448,
          label: 'Таємні двері на 2-му поверсі',
          targetRoom: 'boutique', targetX: 380, targetY: 1250,
          needKey: 'key_attic',
          unlockRoomOnOpen: 'boutique'
        }
      ],
      // Сховані предмети, які треба знайти (не видно здалеку, мерехтять коли поруч!)
      secrets: [
        { id: 'sec_villa_recipe', x: 1110, y: 880, label: 'Золотий Рецепт за картиною над каміном', giveItem: 'golden_recipe', coins: 20, xp: 20 },
        { id: 'sec_villa_jar', x: 240, y: 860, label: 'Таємна баночка монеток на кухні', coins: 25, xp: 15 },
        { id: 'sec_villa_lamp', x: 1540, y: 390, label: 'Схованка біля настільної лампи', coins: 30, xp: 20 }
      ],
      stations: [
        { id: 'villa_oven', x: 340, y: 1135, title: 'Кухонна Піч', prompt: 'Спекти Полуничний Кекс (+25 монет)', questId: 'q_villa_bake' },
        { id: 'villa_wardrobe', x: 960, y: 448, title: 'Гардеробна Шафа', prompt: 'Відкрити Гардероб (56 образів)', action: 'wardrobe' }
      ]
    },

    academy: {
      id: 'academy',
      name: 'Чарівна Академія та Хмарна Обсерваторія',
      shortName: 'Академія Магії',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 33, y: 24 },
      bgSrc: 'assets/characters/pixar/spirit_room2_academy.jpg',
      groundY: 1145,
      platforms: [
        { x1: 1850, x2: 2150, y: 925 },
        { x1: 1460, x2: 1750, y: 765 },
        { x1: 1790, x2: 2340, y: 625 },
        { x1: 1320, x2: 1620, y: 515 },
        { x1: 90, x2: 860, y: 645 }
      ],
      stairPaths: [
        { id: 'acad_st1', points: [{ x: 1710, y: 1145 }, { x: 1985, y: 925 }, { x: 1615, y: 765 }, { x: 1890, y: 625 }] },
        { id: 'acad_st2', points: [{ x: 1775, y: 625 }, { x: 1490, y: 515 }] }
      ],
      npcs: [
        {
          id: 'npc_mateo',
          name: 'Вчитель Матео',
          role: 'Магістр Зірок',
          sprite: 'assets/characters/char_school_mateo.png',
          x: 760, y: 1145, facing: 1,
          questId: 'q_acad_crystal',
          needItem: 'star_crystal',
          rewardCoins: 45, rewardXp: 60,
          dialogBefore: 'Вітаю в Академії, Даніко! Піднімися хмарними сходами аж до верхньої Обсерваторії — там біля зоряного телескопа захований Зоряний Кристал. Принеси його мені!',
          dialogReady: 'Неймовірно! Зоряний Кристал сяє у твоїх руках! Ось твоя нагорода — тепер ти справжня дослідниця Академії!',
          dialogAfter: 'Спробуй також приручити Кошеня або Єдинорога у Кришталевому Спа в центрі зали!'
        }
      ],
      doors: [
        {
          id: 'door_acad_to_park',
          x: 2300, y: 1145,
          label: 'Вийти у Парк Пригод Бруно',
          targetRoom: 'petpark', targetX: 280, targetY: 1095,
          needKey: null
        },
        {
          id: 'door_acad_to_villa',
          x: 130, y: 1145,
          label: 'Повернутися у Віллу Гандії',
          targetRoom: 'villa', targetX: 1920, targetY: 1135,
          needKey: null
        }
      ],
      secrets: [
        { id: 'sec_acad_crystal', x: 2080, y: 560, label: 'Зоряний Кристал в Обсерваторії', giveItem: 'star_crystal', coins: 25, xp: 25 },
        { id: 'sec_acad_book', x: 260, y: 920, label: 'Чарівна книга на полиці', coins: 25, xp: 20 },
        { id: 'sec_acad_fountain', x: 1430, y: 1030, label: 'Монетки у фонтані спа', coins: 30, xp: 20 }
      ],
      stations: [
        { id: 'acad_spa', x: 1170, y: 1145, title: 'Кришталевий Спа Улюбленців', prompt: 'Приручити Кошеня або Єдинорога', questId: 'q_acad_pet', action: 'rescue_pet' },
        { id: 'acad_chest', x: 1470, y: 515, title: 'Небесна Скриня', prompt: 'Відкрити Небесну Скриню', chestId: 'ch_acad_sky', bonus: 50, questId: 'q_acad_chest' }
      ]
    },

    beach: {
      id: 'beach',
      name: 'Сонячний Пляж та Маяк Гандії',
      shortName: 'Пляж і Маяк',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 53, y: 72 },
      bgSrc: 'assets/characters/pixar/spirit_room3_beach.jpg',
      groundY: 1155,
      platforms: [
        { x1: 380, x2: 1280, y: 520, label: 'Оглядовий майданчик Маяка' }
      ],
      stairPaths: [
        { id: 'beach_st', points: [{ x: 1690, y: 1155 }, { x: 930, y: 520 }] }
      ],
      npcs: [
        {
          id: 'npc_lucas',
          name: 'Лукас',
          role: 'Доглядач Маяка',
          sprite: 'assets/characters/char_beach_lucas.png',
          x: 920, y: 1155, facing: -1,
          questId: 'q_beach_lighthouse',
          needItem: 'key_lighthouse',
          rewardCoins: 45, rewardXp: 55,
          dialogBefore: 'Привіт, Даніко! Я десь загубив Ключ від Маяка у кущах під пальмами праворуч. Знайди його та піднімися сходами до дверей Маяка — він відкриє шлях у Гранд-Готель!',
          dialogReady: 'Чудово! У тебе є Ключ від Маяка! Піднімайся сходами на 2-й поверх і відмикай двері Маяка!',
          dialogAfter: 'Маяк світить на всю Гандію! Можеш сміливо йти у Гранд-Готель!'
        }
      ],
      doors: [
        {
          id: 'door_beach_lighthouse',
          x: 675, y: 520,
          label: 'Двері Маяка (Шлях у Гранд-Готель)',
          targetRoom: 'hotel', targetX: 350, targetY: 1230,
          needKey: 'key_lighthouse',
          unlockRoomOnOpen: 'hotel'
        },
        {
          id: 'door_beach_to_villa',
          x: 180, y: 1155,
          label: 'Стежка назад до Вілли Гандії',
          targetRoom: 'villa', targetX: 1920, targetY: 1135,
          needKey: null
        }
      ],
      secrets: [
        { id: 'sec_beach_key', x: 2150, y: 980, label: 'Ключ від Маяка під квітами пальми', giveItem: 'key_lighthouse', coins: 20, xp: 20 },
        { id: 'sec_beach_castle', x: 1030, y: 1050, label: 'Перлина у пісочному замку', coins: 30, xp: 20 }
      ],
      stations: [
        { id: 'beach_ice', x: 730, y: 1155, title: 'Кіоск Морозива', prompt: 'Пригостити Бруно морозивом (+25 монет)', questId: 'q_beach_icecream' },
        { id: 'beach_chest', x: 2030, y: 1155, title: 'Скриня Піратів', prompt: 'Відкрити Пляжний Скарб', chestId: 'ch_beach', bonus: 45 }
      ]
    },

    mercadona: (function () {
      const mm = window.MEGA_MERCADONA_DATA;
      if (mm) {
        return {
          id: 'mercadona',
          name: 'Мега-Меркадона (English World)',
          shortName: 'Меркадона',
          isMegaPark: true,
          megaDataKey: 'MEGA_MERCADONA_DATA',
          worldW: mm.WORLD_W,
          unlockedByDefault: true,
          unlockReq: null,
          mapNode: { x: 34, y: 58 },
          bgSrc: 'assets/locations/loc_mercadona.jpg',
          groundY: mm.GROUND_Y,
          platforms: mm.PLATFORMS,
          stairPaths: mm.STAIR_PATHS,
          hazards: mm.HAZARDS,
          levers: mm.LEVERS,
          npcs: mm.MOVING_NPCS,
          secrets: mm.SECRETS,
          stations: mm.STATIONS,
          doors: mm.DOORS
        };
      }
      return null;
    })(),

    petpark: (function () {
      const mp = window.MEGA_PARK_DATA;
      if (mp) {
        return {
          id: 'petpark',
          name: 'Мега-Парк Пригод Гандії',
          shortName: 'Мега-Парк',
          isMegaPark: true,
          worldW: mp.WORLD_W,
          unlockedByDefault: true,
          unlockReq: null,
          mapNode: { x: 84, y: 62 },
          bgSrc: 'assets/characters/pixar/spirit_room5_petpark.jpg',
          groundY: mp.GROUND_Y,
          platforms: mp.PLATFORMS,
          stairPaths: mp.STAIR_PATHS,
          hazards: mp.HAZARDS,
          levers: mp.LEVERS,
          npcs: mp.MOVING_NPCS,
          secrets: mp.SECRETS,
          stations: mp.STATIONS,
          doors: mp.DOORS
        };
      }
      return {
        id: 'petpark',
        name: 'Парк Пригод та Будиночок на Дереві',
        shortName: 'Парк Бруно',
        unlockedByDefault: true,
        unlockReq: null,
        mapNode: { x: 84, y: 62 },
        bgSrc: 'assets/characters/pixar/spirit_room5_petpark.jpg',
        groundY: 1095,
        platforms: [], stairPaths: [], npcs: [], doors: [], secrets: [], stations: []
      };
    })(),
    hotel: {
      id: 'hotel',
      name: 'Гранд-Готель та Аквапарк на Даху',
      shortName: 'Гранд-Готель',
      unlockedByDefault: false,
      unlockReq: { level: 2, quests: 2, coins: 50 },
      mapNode: { x: 62, y: 25 },
      bgSrc: 'assets/characters/pixar/spirit_room4_hotel.jpg',
      groundY: 1230,
      platforms: [
        { x1: 100, x2: 2320, y: 555, label: 'Тераса з Басейном на Даху' }
      ],
      stairPaths: [
        { id: 'hotel_st', points: [{ x: 1745, y: 1230 }, { x: 1065, y: 555 }] }
      ],
      npcs: [
        {
          id: 'npc_nico',
          name: 'Бармен Ніко',
          role: 'Майстер Смузі',
          sprite: 'assets/characters/char_cafe_nico.png',
          x: 1110, y: 1230, facing: -1,
          questId: 'q_hotel_mango',
          needItem: 'fresh_mango',
          rewardItem: 'vip_card',
          rewardCoins: 50, rewardXp: 65,
          dialogBefore: 'Ласкаво просимо у Гранд-Готель! Для королівського смузі мені потрібне стигле Тропічне Манго — воно сховане біля апельсинового деревця на даху біля шезлонгів!',
          dialogReady: 'Яке ароматне манго! Ось твоя VIP-Картка Готелю — вона відкриває двері на терасі даху зліва у Бутік Моди!',
          dialogAfter: 'Насолоджуйся водною гіркою та басейном на 2-му поверсі!'
        }
      ],
      doors: [
        {
          id: 'door_hotel_to_beach',
          x: 160, y: 1230,
          label: 'Вийти на Пляж Гандії',
          targetRoom: 'beach', targetX: 675, targetY: 520,
          needKey: null
        },
        {
          id: 'door_hotel_vip_boutique',
          x: 210, y: 555,
          label: 'VIP-Арка на Даху (У Бутік Скарбів)',
          targetRoom: 'boutique', targetX: 2050, targetY: 1250,
          needKey: 'vip_card',
          unlockRoomOnOpen: 'boutique'
        }
      ],
      secrets: [
        { id: 'sec_hotel_mango', x: 2260, y: 490, label: 'Стигле Тропічне Манго на даху', giveItem: 'fresh_mango', coins: 25, xp: 25 },
        { id: 'sec_hotel_sofa', x: 2050, y: 1140, label: 'Схованка за рожевим диваном', coins: 35, xp: 25 }
      ],
      stations: [
        { id: 'hotel_slide', x: 750, y: 555, title: 'Водна Гірка на Даху', prompt: 'З’їхати з гірки у басейн (+40 монет)', questId: 'q_hotel_slide' },
        { id: 'hotel_chest', x: 1960, y: 555, title: 'Курортна Скриня', prompt: 'Відкрити VIP-Скарб', chestId: 'ch_hotel', bonus: 55 }
      ]
    },

    boutique: {
      id: 'boutique',
      name: 'Бутік Моди та Кришталеве Горище Скарбів',
      shortName: 'Бутік Скарбів',
      unlockedByDefault: false,
      unlockReq: { level: 3, quests: 4, coins: 90 },
      mapNode: { x: 88, y: 21 },
      bgSrc: 'assets/characters/pixar/spirit_room6_boutique.jpg',
      groundY: 1250,
      platforms: [
        { x1: 110, x2: 2290, y: 690, label: 'Кришталеве Горище Скарбів' }
      ],
      stairPaths: [
        { id: 'btq_st', points: [{ x: 985, y: 1250 }, { x: 1470, y: 690 }] }
      ],
      npcs: [
        {
          id: 'npc_chloe',
          name: 'Дизайнерка Хлоя',
          role: 'Хранителька Стилю',
          sprite: 'assets/characters/char_mall_chloe.png',
          x: 780, y: 1250, facing: 1,
          questId: 'q_boutique_gem',
          needItem: 'crystal_gem',
          rewardCoins: 75, rewardXp: 90,
          dialogBefore: 'Вау, ти знайшла наш Бутік! Піднімися біло-золотими сходами на Кришталеве Горище — біля чарівного дзеркала праворуч сяє Королівський Кристал. Принеси його мені!',
          dialogReady: 'Блискуче! Ти справжня королева стилю й пригод! Забирай королівську нагороду та відкривай скрині на горищі!',
          dialogAfter: 'У нашому Гардеробі тепер чекають усі 56 образів Даніки!'
        }
      ],
      doors: [
        {
          id: 'door_btq_to_villa',
          x: 210, y: 1250,
          label: 'Повернутися на 2-й поверх Вілли',
          targetRoom: 'villa', targetX: 820, targetY: 448,
          needKey: null
        },
        {
          id: 'door_btq_to_hotel',
          x: 2220, y: 1250,
          label: 'Перейти на Дах Гранд-Готелю',
          targetRoom: 'hotel', targetX: 360, targetY: 555,
          needKey: null
        }
      ],
      secrets: [
        { id: 'sec_btq_gem', x: 2020, y: 580, label: 'Королівський Кристал у дзеркалі', giveItem: 'crystal_gem', coins: 35, xp: 30 },
        { id: 'sec_btq_curtain', x: 1760, y: 1120, label: 'Діадема за оксамитовою шторкою', coins: 40, xp: 30 }
      ],
      stations: [
        { id: 'btq_wardrobe', x: 560, y: 1250, title: 'Подіум та Гардероб', prompt: 'Відкрити весь Гардероб (56 образів)', action: 'wardrobe' },
        { id: 'btq_chest', x: 460, y: 690, title: 'Королівські Скрині Горища', prompt: 'Відкрити Головний Скарб (+80 монет)', chestId: 'ch_boutique', bonus: 80, questId: 'q_boutique_attic' }
      ]
    }
  };

  // 4. ГРАФ ДОРІЖОК НА КАРТІ ГАНДІЇ
  window.SPIRIT_MAP_EDGES = [
    ['villa', 'academy'],
    ['villa', 'mercadona'],
    ['villa', 'beach'],
    ['mercadona', 'academy'],
    ['mercadona', 'beach'],
    ['mercadona', 'petpark'],
    ['academy', 'hotel'],
    ['beach', 'hotel'],
    ['beach', 'petpark'],
    ['hotel', 'petpark'],
    ['hotel', 'boutique'],
    ['petpark', 'boutique']
  ];

  // 5. СЮЖЕТНІ ТА ЩОДЕННІ КВЕСТИ
  const STORY_QUESTS = [
    { id: 'q_merc_en_1', room: 'mercadona', title: 'Меркадона (EN): Вивчи слово Shopping Cart у Консультанта Лео', coins: 35, xp: 45 },
    { id: 'q_merc_en_2', room: 'mercadona', title: 'Меркадона (EN): Відгадай слово Strawberry у Фруктовому відділі', coins: 40, xp: 50 },
    { id: 'q_merc_en_3', room: 'mercadona', title: 'Меркадона (EN): Bread and Cake у Пекаря Пепе', coins: 40, xp: 55 },
    { id: 'q_merc_en_4', room: 'mercadona', title: 'Меркадона (EN): Yellow Cheese у Сировара Ніко', coins: 45, xp: 55 },
    { id: 'q_merc_en_5', room: 'mercadona', title: 'Меркадона (EN): Ice Cream and Juice у Вчителя Матео', coins: 45, xp: 60 },
    { id: 'q_merc_en_6', room: 'mercadona', title: 'Меркадона (EN): Happy Puppy у Зоо-відділі Бруно', coins: 50, xp: 65 },
    { id: 'q_merc_en_7', room: 'mercadona', title: 'Меркадона (EN): Фінальна фраза Thank you very much на Касі Хлої!', coins: 80, xp: 100 },
    { id: 'q_megapark_clean', room: 'petpark', title: 'Мега-Парк: Прибери 3 пастки (какашки або сміття) для Софії', coins: 45, xp: 55 },
    { id: 'q_megapark_riddle1', room: 'petpark', title: 'Мега-Парк: Розгадай головоломку Лукаса на Собачому Майданчику', coins: 40, xp: 50 },
    { id: 'q_megapark_riddle2', room: 'petpark', title: 'Мега-Парк: Перейди річку та розгадай іспанську загадку Пепе', coins: 45, xp: 55 },
    { id: 'q_megapark_treehouse', room: 'petpark', title: 'Мега-Парк: Піднімися на 3-й поверх Містечка на Деревах до Матео', coins: 55, xp: 70 },
    { id: 'q_megapark_maze', room: 'petpark', title: 'Мега-Парк: Пройди Лабіринт Кущів та допоможи Ніколь', coins: 55, xp: 70 },
    { id: 'q_megapark_finale', room: 'petpark', title: 'Мега-Парк: Дійди до Водоспаду Бажань та Золотої Альтанки Хлої!', coins: 90, xp: 110 },
    { id: 'q_villa_recipe', room: 'villa', title: 'Вілла: Знайди Золотий Рецепт для Пекаря Пепе і отримай Срібний Ключ', coins: 35, xp: 45 },
    { id: 'q_villa_bake', room: 'villa', title: 'Вілла: Спечи Полуничний Кекс у кухонній печі', coins: 25, xp: 30 },
    { id: 'q_villa_loft', room: 'villa', title: 'Вілла: Піднімися дерев’яними сходами на 2-й поверх', coins: 20, xp: 25 },
    { id: 'q_acad_crystal', room: 'academy', title: 'Академія: Знайди Зоряний Кристал в Обсерваторії для Вчителя Матео', coins: 45, xp: 60 },
    { id: 'q_acad_pet', room: 'academy', title: 'Академія: Приручи нового друга у Кришталевому Спа', coins: 35, xp: 45 },
    { id: 'q_acad_chest', room: 'academy', title: 'Академія: Відкрий Небесну Скриню на верхній хмаринці', coins: 50, xp: 50 },
    { id: 'q_beach_lighthouse', room: 'beach', title: 'Пляж: Знайди Ключ від Маяка для Лукаса і відкрий двері Маяка', coins: 45, xp: 55 },
    { id: 'q_beach_icecream', room: 'beach', title: 'Пляж: Пригости Бруно морозивом біля кіоску', coins: 25, xp: 30 },
    { id: 'q_park_bone', room: 'petpark', title: 'Парк Бруно: Відкопай Золоту Кісточку для Софії та Бруно', coins: 45, xp: 55 },
    { id: 'q_park_agility', room: 'petpark', title: 'Парк Бруно: Пройди кільця адліті разом із Бруно', coins: 30, xp: 40 },
    { id: 'q_park_treehouse', room: 'petpark', title: 'Парк Бруно: Піднімися сходами в Будиночок на Дереві', coins: 30, xp: 40 },
    { id: 'q_hotel_mango', room: 'hotel', title: 'Готель: Знайди Тропічне Манго на даху для Ніко і отримай VIP-Картку', coins: 50, xp: 65 },
    { id: 'q_hotel_slide', room: 'hotel', title: 'Готель: З’їдь із водної гірки у басейн на даху', coins: 40, xp: 50 },
    { id: 'q_boutique_gem', room: 'boutique', title: 'Бутік: Знайди Королівський Кристал на горищі для Хлої', coins: 75, xp: 90 },
    { id: 'q_boutique_attic', room: 'boutique', title: 'Бутік: Відкрий Королівські Скрині на Зоряному Горищі', coins: 80, xp: 80 }
  ];

  window.getSpiritQuests = function () {
    const list = STORY_QUESTS.slice();
    if (typeof DEFAULT_APP_DATA !== 'undefined' && Array.isArray(DEFAULT_APP_DATA.quests20)) {
      DEFAULT_APP_DATA.quests20.slice(0, 10).forEach(q => {
        const cleanTitle = String(q.title || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
        if (cleanTitle && !list.find(x => x.id === 'aw_' + q.id)) {
          list.push({ id: 'aw_' + q.id, room: 'villa', title: 'Щоденна місія: ' + cleanTitle, coins: q.coins || 20, xp: q.xp || 25, isDaily: true });
        }
      });
    }
    return list;
  };

  window.getSpiritWardrobe = function () {
    const danika = [
      { id: 'gandia_polo', title: 'Поло Colegio Abecé', cost: 0, reqLevel: 1, src: 'assets/characters/pixar/danika_pixar_base.jpg', crop: { x: 0, y: 0, w: 1, h: 1 } },
      { id: 'kawaii_hoodie', title: 'Полуничне Худі', cost: 40, reqLevel: 1, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
      { id: 'princess_rose', title: 'Принцеса Троянд', cost: 65, reqLevel: 2, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0, w: 0.5, h: 0.5 } },
      { id: 'fairy_sky', title: 'Небесна Фея', cost: 85, reqLevel: 2, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
      { id: 'teacher_suit', title: 'Вчителька Академії', cost: 100, reqLevel: 3, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
    ];
    if (typeof DEFAULT_APP_DATA !== 'undefined' && DEFAULT_APP_DATA.wardrobe && Array.isArray(DEFAULT_APP_DATA.wardrobe.danikaOutfits)) {
      DEFAULT_APP_DATA.wardrobe.danikaOutfits.forEach((o, idx) => {
        if (o.id === 'danika_abece') return;
        const cleanTitle = String(o.title || o.id).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
        danika.push({
          id: o.id, title: cleanTitle, cost: Math.max(25, Math.min(160, o.cost || 45)),
          reqLevel: idx < 10 ? 1 : (idx < 25 ? 2 : 3),
          src: o.img, thumb: o.tileIcon || o.img, crop: { x: 0, y: 0, w: 1, h: 1 }, isPngSprite: true
        });
      });
    }
    const bruno = [
      { id: 'custom_bruno', title: 'Справжній Бруно', cost: 0, reqLevel: 1, src: 'assets/characters/pixar/bruno_idle_custom.png', crop: { x: 0, y: 0, w: 1, h: 1 } },
      { id: 'king_crown', title: 'Король Бруно', cost: 50, reqLevel: 2, src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } }
    ];
    if (typeof DEFAULT_APP_DATA !== 'undefined' && DEFAULT_APP_DATA.wardrobe && Array.isArray(DEFAULT_APP_DATA.wardrobe.brunoOutfits)) {
      DEFAULT_APP_DATA.wardrobe.brunoOutfits.forEach((b, idx) => {
        const cleanTitle = String(b.title || b.id).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
        bruno.push({
          id: b.id, title: cleanTitle, cost: idx === 0 ? 30 : Math.max(35, Math.min(120, b.cost || 45)),
          reqLevel: idx < 3 ? 1 : 2, src: b.img, crop: { x: 0, y: 0, w: 1, h: 1 }, isPngSprite: true
        });
      });
    }
    const pets = [
      { id: 'pixar_kitten', title: 'Кошеня Мурчик', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
      { id: 'pixar_unicorn', title: 'Єдиноріг Зірочка', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
    ];
    return { danika, bruno, pets };
  };
})();
