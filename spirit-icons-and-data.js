// ============================================================================
// SPIRITFARER 2D WORLD: CUSTOM VECTOR ICONS, 15 MULTI-ZONE LOCATIONS,
// HIDDEN SECRETS, ROAD NETWORK MAP GRAPH & AVATAR WORLD QUEST/WARDROBE BRIDGE
// (ZERO EMOJI - 100% CRISP VECTOR SVG ICONS)
// ============================================================================

(function () {
  // 1. ЧИСТИЙ НАБІР ВЕКТОРНИХ SVG-ІКОНОК (ЖОДНОГО ЕМОДЖІ!)
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
    check: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chest: `<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="7" width="17" height="12" rx="2.5" fill="#D97706" stroke="#FEF08A" stroke-width="1.6"/><path d="M3.5 11.5h17M10.5 11.5v3h3v-3" stroke="#FEF08A" stroke-width="1.6"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 10-13 0c0 5.2 6.5 11 6.5 11z" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.7"/><circle cx="12" cy="10" r="2.3" fill="#FFFFFF"/></svg>`
  };

  window.SPIRIT_ICONS = ICONS;

  // Хелпер створення зони (кожна зона = 2400px ширини)
  function z(bgSrc, label, groundY = 1140, platforms = [], stairPaths = [], tint = null) {
    return { bgSrc, label, groundY, platforms, stairPaths, tint };
  }

  // 2. ВСІ 15 ВЕЛИКИХ БАГАТОЗОННИХ ЛОКАЦІЙ (5 ВІДКРИТИХ + 10 ЗАКРИТИХ ЗА ПРОГРЕС)
  // Кожна локація складається з 4-6 зшитих панорамних зон (9,600 - 14,400 px ширини!)
  const LOCATIONS = {
    // ================= 5 СТАРТОВИХ ВІДКРИТИХ ЛОКАЦІЙ =================
    danika_home: {
      id: 'danika_home',
      name: 'Кімната Даніки та Вілла',
      shortName: 'Дім Даніки',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 14, y: 54 },
      zones: [
        z('assets/rooms/room_bedroom.jpg', 'Спальня Даніки', 1145),
        z('assets/rooms/room_bathroom.jpg', 'Затишна Ванна', 1145),
        z('assets/rooms/room_kitchen.jpg', 'Сімейна Кухня', 1145),
        z('assets/rooms/room_art_studio.jpg', 'Майстерня Творчості', 1145),
        z('assets/characters/pixar/spirit_room1_villa.jpg', 'Двоповерхова Вілла та Тераса', 1135,
          [{ x1: 700, x2: 1690, y: 448 }, { x1: 810, x2: 990, y: 955, isTrampoline: true }],
          [{ id: 'villa_st', points: [{ x: 1585, y: 1135 }, { x: 1545, y: 780 }, { x: 1235, y: 448 }], onReachTopQuest: 'q_villa_loft' }]
        ),
        z('assets/rooms/room_secret_master_full.jpg', 'Секретна Кімната Даніки', 1145)
      ],
      stations: [
        { id: 'home_bed', zoneIdx: 0, x: 760, y: 1145, title: 'Застелити ліжечко', prompt: 'Застелити ліжечко (+20 монет)', questId: 'q_home_morning' },
        { id: 'home_bath', zoneIdx: 1, x: 1150, y: 1145, title: 'Ранкова свіжість', prompt: 'Почистити зубки та вмитись (+15 XP)', questId: 'q_home_teeth' },
        { id: 'home_cook', zoneIdx: 2, x: 1240, y: 1145, title: 'Сімейний Сніданок', prompt: 'Приготувати сніданок (+25 монет)', questId: 'q_home_breakfast' },
        { id: 'home_art', zoneIdx: 3, x: 1120, y: 1145, title: 'Мольберт Художниці', prompt: 'Намалювати картину Гандії (+25 XP)', questId: 'q_home_art' },
        { id: 'home_oven', zoneIdx: 4, x: 335, y: 1135, title: 'Піч Вілли', prompt: 'Спекти Полуничний Кекс (+25 монет)', questId: 'q_villa_bake' },
        { id: 'home_wardrobe', zoneIdx: 4, x: 920, y: 448, title: 'Гардеробна Шафа', prompt: 'Відкрити Гардероб (56 образів)', action: 'wardrobe' },
        { id: 'home_secret_chest', zoneIdx: 5, x: 1320, y: 1145, title: 'Скриня Секретної Кімнати', prompt: 'Відкрити Скриню Скарбів', chestId: 'ch_home_secret', bonus: 35 }
      ],
      secrets: [
        { id: 'sec_home_1', zoneIdx: 0, x: 1860, y: 980, label: 'Схованка під подушкою', coins: 20, xp: 15 },
        { id: 'sec_home_2', zoneIdx: 1, x: 480, y: 940, label: 'Таємна мушля у ванній', coins: 20, xp: 15 },
        { id: 'sec_home_3', zoneIdx: 2, x: 1920, y: 960, label: 'Баночка печива на поличці', coins: 25, xp: 20 },
        { id: 'sec_home_4', zoneIdx: 4, x: 1480, y: 420, label: 'Ключик на балконі Вілли', coins: 30, xp: 25 },
        { id: 'sec_home_5', zoneIdx: 5, x: 540, y: 920, label: 'Кристал Секретної Кімнати', coins: 35, xp: 30 }
      ]
    },

    mercadona: {
      id: 'mercadona',
      name: 'Супермаркет Меркадона',
      shortName: 'Меркадона',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 28, y: 46 },
      zones: [
        z('assets/locations/loc_mercadona.jpg', 'Головний Вхід Меркадони', 1145),
        z('assets/locations/loc_mercadona_produce.jpg', 'Свіжі Фрукти та Овочі', 1145),
        z('assets/locations/loc_mercadona_bakery.jpg', 'Ароматна Пекарня', 1145),
        z('assets/locations/loc_mercadona_meat.jpg', 'Делікатеси та Сири', 1145),
        z('assets/locations/loc_mercadona_drinks.jpg', 'Соки, Солодощі та Каса', 1145)
      ],
      stations: [
        { id: 'merc_cart', zoneIdx: 0, x: 1180, y: 1145, title: 'Візок Покупця', prompt: 'Взяти список покупок (+15 XP)', questId: 'q_merc_list' },
        { id: 'merc_fruits', zoneIdx: 1, x: 1200, y: 1145, title: 'Фруктовий Відділ', prompt: 'Обрати іспанські апельсини (+25 монет)', questId: 'q_merc_fruits' },
        { id: 'merc_bakery', zoneIdx: 2, x: 1160, y: 1145, title: 'Свіжа Випічка', prompt: 'Купити круасани для сім’ї (+25 монет)', questId: 'q_merc_bakery' },
        { id: 'merc_checkout', zoneIdx: 4, x: 1450, y: 1145, title: 'Каса Меркадони', prompt: 'Порахувати решту на касі (+30 монет)', questId: 'q_merc_math' }
      ],
      secrets: [
        { id: 'sec_merc_1', zoneIdx: 1, x: 520, y: 960, label: 'Золотий апельсин у ящику', coins: 25, xp: 20 },
        { id: 'sec_merc_2', zoneIdx: 2, x: 1850, y: 940, label: 'Секретний кекс пекаря', coins: 25, xp: 20 },
        { id: 'sec_merc_3', zoneIdx: 3, x: 960, y: 950, label: 'Смаколик для Бруно', coins: 20, xp: 20 },
        { id: 'sec_merc_4', zoneIdx: 4, x: 1980, y: 960, label: 'Бонусний купон Меркадони', coins: 35, xp: 25 }
      ]
    },

    school_abece: {
      id: 'school_abece',
      name: 'Школа Colegio Abecé',
      shortName: 'Школа Abecé',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 25, y: 24 },
      zones: [
        z('assets/locations/loc_abece.jpg', 'Шкільний Двір Colegio Abecé', 1145),
        z('assets/locations/loc_abece_math.jpg', 'Клас Математики та Іспанської', 1145),
        z('assets/locations/loc_abece_science.jpg', 'Лабораторія Науки', 1145),
        z('assets/locations/loc_abece_canteen.jpg', 'Шкільна Їдальня', 1145),
        z('assets/locations/loc_abece_gym.jpg', 'Спортивна Зала Школи', 1145)
      ],
      stations: [
        { id: 'sch_math', zoneIdx: 1, x: 1180, y: 1145, title: 'Шкільна Дошка', prompt: 'Розв’язати задачу біля дошки (+30 монет)', questId: 'q_sch_math' },
        { id: 'sch_sci', zoneIdx: 2, x: 1220, y: 1145, title: 'Науковий Дослід', prompt: 'Провести кольоровий експеримент (+30 монет)', questId: 'q_sch_science' },
        { id: 'sch_canteen', zoneIdx: 3, x: 1140, y: 1145, title: 'Корисний Обід', prompt: 'Пообідати з друзями (+20 XP)', questId: 'q_sch_lunch' },
        { id: 'sch_gym', zoneIdx: 4, x: 1260, y: 1145, title: 'Естафета у Спортзалі', prompt: 'Пройти шкільну естафету (+30 монет)', questId: 'q_sch_gym' }
      ],
      secrets: [
        { id: 'sec_sch_1', zoneIdx: 0, x: 1940, y: 980, label: 'Зірочка відмінниці біля входу', coins: 20, xp: 20 },
        { id: 'sec_sch_2', zoneIdx: 1, x: 540, y: 930, label: 'Таємний щоденник за партою', coins: 25, xp: 20 },
        { id: 'sec_sch_3', zoneIdx: 2, x: 1840, y: 920, label: 'Сяюча колба в шафі', coins: 30, xp: 25 },
        { id: 'sec_sch_4', zoneIdx: 4, x: 600, y: 960, label: 'Золотий кубок у кутку зали', coins: 35, xp: 30 }
      ]
    },

    park: {
      id: 'park',
      name: 'Парк Пригод та Бруно',
      shortName: 'Парк',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 42, y: 58 },
      zones: [
        z('assets/locations/loc_park.jpg', 'Алея Парку Гандії', 1145),
        z('assets/locations/loc_park_fountain.jpg', 'Площа з Фонтаном', 1145),
        z('assets/locations/loc_park_playground.jpg', 'Дитячий Майданчик', 1145),
        z('assets/locations/loc_park_kiosks.jpg', 'Алея Кіосків і Морозива', 1145),
        z('assets/locations/loc_park_dogpark.jpg', 'Майданчик для Песиків', 1145),
        z('assets/characters/pixar/spirit_room5_petpark.jpg', 'Школа Трюків Бруно та Будиночок на Дереві', 1095,
          [{ x1: 400, x2: 1050, y: 415 }, { x1: 1050, x2: 2260, y: 455 }],
          [{ id: 'park_st', points: [{ x: 1555, y: 1095 }, { x: 965, y: 415 }], onReachTopQuest: 'q_park_treehouse' }]
        )
      ],
      stations: [
        { id: 'park_fountain', zoneIdx: 1, x: 1200, y: 1145, title: 'Фонтан Бажань', prompt: 'Загадати бажання біля фонтану (+20 XP)', questId: 'q_park_wish' },
        { id: 'park_play', zoneIdx: 2, x: 1180, y: 1145, title: 'Гойдалки та Гірка', prompt: 'Погратися на майданчику (+25 монет)', questId: 'q_park_play' },
        { id: 'park_agility', zoneIdx: 5, x: 890, y: 1095, title: 'Кільця Адліті Бруно', prompt: 'Тренування трюків Бруно (+35 монет)', questId: 'q_park_agility' },
        { id: 'park_dig', zoneIdx: 5, x: 1960, y: 1095, title: 'Схованка Бруно біля Будки', prompt: 'Відкопати скарб Бруно', chestId: 'ch_park_dig', bonus: 40 },
        { id: 'park_tele', zoneIdx: 5, x: 600, y: 415, title: 'Телескоп на Дереві', prompt: 'Оглянути парк згори (+35 монет)', questId: 'q_park_treehouse' }
      ],
      secrets: [
        { id: 'sec_park_1', zoneIdx: 0, x: 640, y: 980, label: 'Скарб у дуплі дерева', coins: 20, xp: 20 },
        { id: 'sec_park_2', zoneIdx: 1, x: 1820, y: 970, label: 'Блискуча монетка біля фонтану', coins: 25, xp: 20 },
        { id: 'sec_park_3', zoneIdx: 3, x: 1450, y: 940, label: 'Таємний квиток на карусель', coins: 25, xp: 25 },
        { id: 'sec_park_4', zoneIdx: 4, x: 760, y: 980, label: 'Золота кісточка в траві', coins: 30, xp: 25 },
        { id: 'sec_park_5', zoneIdx: 5, x: 1750, y: 420, label: 'Ліхтарик на підвісному містку', coins: 35, xp: 30 }
      ]
    },

    chachi_piruli: {
      id: 'chachi_piruli',
      name: 'Ігровий Центр Чачі Пірулі',
      shortName: 'Чачі Пірулі',
      unlockedByDefault: true,
      unlockReq: null,
      mapNode: { x: 40, y: 34 },
      zones: [
        z('assets/locations/loc_chachi.jpg', 'Хол Свята Чачі Пірулі', 1145),
        z('assets/locations/loc_chachi_ballpit.jpg', 'Сухий Басейн із Кульками', 1145),
        z('assets/locations/loc_chachi_climbing.jpg', 'Скеледром та Лабіринт', 1145),
        z('assets/locations/loc_chachi_inflatable.jpg', 'Величезний Батут-Замок', 1145),
        z('assets/locations/loc_chachi_arcade.jpg', 'Ігрові Автомати та Призи', 1145)
      ],
      stations: [
        { id: 'ch_ballpit', zoneIdx: 1, x: 1200, y: 1145, title: 'Море Кульок', prompt: 'Знайти золоту кульку в басейні (+25 монет)', questId: 'q_chachi_balls' },
        { id: 'ch_climb', zoneIdx: 2, x: 1180, y: 1145, title: 'Вершина Скеледрому', prompt: 'Підкорити стіну лабіринту (+30 монет)', questId: 'q_chachi_climb' },
        { id: 'ch_bounce', zoneIdx: 3, x: 1220, y: 1145, title: 'Надувний Батут', prompt: 'Зробити супер-стрибок (+20 XP)', questId: 'q_chachi_jump' },
        { id: 'ch_arcade', zoneIdx: 4, x: 1320, y: 1145, title: 'Автомат Призів', prompt: 'Виграти приз на автоматі', chestId: 'ch_chachi_prize', bonus: 35 }
      ],
      secrets: [
        { id: 'sec_ch_1', zoneIdx: 0, x: 1850, y: 950, label: 'Святковий жетон за кулькою', coins: 20, xp: 20 },
        { id: 'sec_ch_2', zoneIdx: 1, x: 560, y: 980, label: 'Схована іграшка в кульках', coins: 25, xp: 20 },
        { id: 'sec_ch_3', zoneIdx: 3, x: 1890, y: 940, label: 'Зірковий стикер біля гірки', coins: 25, xp: 25 },
        { id: 'sec_ch_4', zoneIdx: 4, x: 640, y: 960, label: 'Секретний джекпот жетонів', coins: 35, xp: 25 }
      ]
    },

    // ================= 10 ЗАКРИТИХ ЛОКАЦІЙ (ВІДКРИВАЮТЬСЯ ЗА ПРОГРЕС) =================
    sport_complex: {
      id: 'sport_complex',
      name: 'Спорткомплекс Гандії',
      shortName: 'Спорткомплекс',
      unlockedByDefault: false,
      unlockReq: { level: 2, quests: 2, coins: 45 },
      mapNode: { x: 18, y: 74 },
      zones: [
        z('assets/locations/loc_poliesportiu.jpg', 'Головна Арена Спорткомплексу', 1145),
        z('assets/locations/loc_academy_gym.jpg', 'Зала Гімнастики та Стрибків', 1145),
        z('assets/locations/loc_abece_gym.jpg', 'Баскетбольний Майданчик', 1145),
        z('assets/locations/loc_beach_waterpark.jpg', 'Спортивний Басейн', 1145)
      ],
      stations: [
        { id: 'sp_run', zoneIdx: 0, x: 1200, y: 1145, title: 'Бігова Доріжка', prompt: 'Пробігти спринт чемпіонки (+35 монет)', questId: 'q_sport_sprint' },
        { id: 'sp_gym', zoneIdx: 1, x: 1180, y: 1145, title: 'Гімнастичний Килим', prompt: 'Виконати гімнастичний трюк (+35 монет)', questId: 'q_sport_gym' },
        { id: 'sp_chest', zoneIdx: 3, x: 1420, y: 1145, title: 'Кубок Чемпіонки', prompt: 'Отримати золоту медаль', chestId: 'ch_sport', bonus: 45 }
      ],
      secrets: [
        { id: 'sec_sp_1', zoneIdx: 0, x: 620, y: 970, label: 'Загублений свисток тренера', coins: 25, xp: 20 },
        { id: 'sec_sp_2', zoneIdx: 1, x: 1820, y: 940, label: 'Золота стрічка гімнастки', coins: 30, xp: 25 },
        { id: 'sec_sp_3', zoneIdx: 2, x: 960, y: 950, label: 'Щасливий м’яч за лавкою', coins: 30, xp: 25 }
      ]
    },

    academy: {
      id: 'academy',
      name: 'Чарівна Академія та Обсерваторія',
      shortName: 'Академія Магії',
      unlockedByDefault: false,
      unlockReq: { level: 2, quests: 3, coins: 60 },
      mapNode: { x: 52, y: 20 },
      zones: [
        z('assets/characters/pixar/spirit_room2_academy.jpg', 'Обсерваторія та Хмарні Сходи', 1145,
          [{ x1: 1850, x2: 2150, y: 925 }, { x1: 1460, x2: 1750, y: 765 }, { x1: 1790, x2: 2340, y: 625 }, { x1: 1320, x2: 1620, y: 515 }],
          [
            { id: 'ac_st1', points: [{ x: 1710, y: 1145 }, { x: 1985, y: 925 }, { x: 1615, y: 765 }, { x: 1890, y: 625 }] },
            { id: 'ac_st2', points: [{ x: 1775, y: 625 }, { x: 1490, y: 515 }] }
          ]
        ),
        z('assets/locations/loc_academy_puzzles.jpg', 'Зала Загадок і Магії', 1145),
        z('assets/locations/loc_academy_fame.jpg', 'Зала Слави Учнів', 1145),
        z('assets/locations/loc_academy_runway.jpg', 'Зоряна Сцена Виступів', 1145)
      ],
      stations: [
        { id: 'ac_spa', zoneIdx: 0, x: 1170, y: 1145, title: 'Кришталевий Спа Улюбленців', prompt: 'Приручити Кошеня або Єдинорога', questId: 'q_acad_pet', action: 'rescue_pet' },
        { id: 'ac_chest', zoneIdx: 0, x: 1470, y: 515, title: 'Небесна Скриня', prompt: 'Відкрити Небесну Скриню', chestId: 'ch_acad_sky', bonus: 50, questId: 'q_acad_chest' },
        { id: 'ac_puz', zoneIdx: 1, x: 1200, y: 1145, title: 'Стіл Загадок', prompt: 'Розгадати стародавній пазл (+40 монет)', questId: 'q_acad_puzzle' }
      ],
      secrets: [
        { id: 'sec_ac_1', zoneIdx: 0, x: 460, y: 960, label: 'Зілля удачі біля казана', coins: 30, xp: 25 },
        { id: 'sec_ac_2', zoneIdx: 1, x: 1850, y: 940, label: 'Світлячок у книжковій шафі', coins: 30, xp: 25 },
        { id: 'sec_ac_3', zoneIdx: 3, x: 720, y: 950, label: 'Кристал зіркової сцени', coins: 40, xp: 30 }
      ]
    },

    beach: {
      id: 'beach',
      name: 'Сонячний Пляж і Маяк Гандії',
      shortName: 'Пляж Гандії',
      unlockedByDefault: false,
      unlockReq: { level: 3, quests: 4, coins: 75 },
      mapNode: { x: 54, y: 74 },
      zones: [
        z('assets/characters/pixar/spirit_room3_beach.jpg', 'Маяк Гандії та Кіоск Морозива', 1155,
          [{ x1: 380, x2: 1280, y: 520 }],
          [{ id: 'beach_st', points: [{ x: 1690, y: 1155 }, { x: 930, y: 520 }] }]
        ),
        z('assets/locations/loc_beach.jpg', 'Золоте Узбережжя', 1145),
        z('assets/locations/loc_beach_cafe.jpg', 'Пляжне Кафе під Пальмами', 1145),
        z('assets/locations/loc_beach_kites.jpg', 'Бухта Повітряних Зміїв', 1145),
        z('assets/locations/loc_beach_waterpark.jpg', 'Аквапарк на Воді', 1145),
        z('assets/locations/loc_beach_yacht.jpg', 'Причал Білосніжної Яхти', 1145)
      ],
      stations: [
        { id: 'b_ice', zoneIdx: 0, x: 730, y: 1155, title: 'Кіоск Морозива', prompt: 'Взяти морозиво для Даніки і Бруно (+30 монет)', questId: 'q_beach_icecream' },
        { id: 'b_light', zoneIdx: 0, x: 675, y: 520, title: 'Ліхтар Маяка', prompt: 'Запалити Маяк Гандії (+40 монет)', questId: 'q_beach_lighthouse' },
        { id: 'b_chest', zoneIdx: 0, x: 2040, y: 1155, title: 'Скриня Піратів', prompt: 'Відкрити Пляжний Скарб', chestId: 'ch_beach', bonus: 45 },
        { id: 'b_yacht', zoneIdx: 5, x: 1350, y: 1145, title: 'Капітанський Місток Яхти', prompt: 'Відправитись у морську прогулянку (+45 монет)', questId: 'q_beach_yacht' }
      ],
      secrets: [
        { id: 'sec_b_1', zoneIdx: 1, x: 1680, y: 990, label: 'Перлина у великій мушлі', coins: 30, xp: 25 },
        { id: 'sec_b_2', zoneIdx: 2, x: 580, y: 960, label: 'Кокосовий скарб під пальмою', coins: 30, xp: 25 },
        { id: 'sec_b_3', zoneIdx: 3, x: 1920, y: 950, label: 'Морська зірка на піску', coins: 35, xp: 30 },
        { id: 'sec_b_4', zoneIdx: 5, x: 650, y: 960, label: 'Компас капітана на причалі', coins: 40, xp: 30 }
      ]
    },

    hotel: {
      id: 'hotel',
      name: 'Гранд-Готель та Аквапарк на Даху',
      shortName: 'Гранд-Готель',
      unlockedByDefault: false,
      unlockReq: { level: 3, quests: 5, coins: 90 },
      mapNode: { x: 63, y: 42 },
      zones: [
        z('assets/characters/pixar/spirit_room4_hotel.jpg', 'Лобі та Басейн на Даху', 1230,
          [{ x1: 100, x2: 2320, y: 555 }],
          [{ id: 'hotel_st', points: [{ x: 1745, y: 1230 }, { x: 1065, y: 555 }] }]
        ),
        z('assets/locations/loc_hotel_lobby.jpg', 'Королівський Хол Готелю', 1145),
        z('assets/locations/loc_hotel_cafe.jpg', 'Панорамна Кав’ярня', 1145),
        z('assets/locations/loc_hotel_suite.jpg', 'Люкс-Номер Принцеси', 1145),
        z('assets/locations/loc_hotel_rooftop.jpg', 'Вечірня Тераса на Даху', 1145)
      ],
      stations: [
        { id: 'h_smoothie', zoneIdx: 0, x: 1110, y: 1230, title: 'Тропічний Смузі-Бар', prompt: 'Приготувати Манго-Смузі (+35 монет)', questId: 'q_hotel_smoothie' },
        { id: 'h_slide', zoneIdx: 0, x: 750, y: 555, title: 'Водна Гірка на Даху', prompt: 'З’їхати з гірки у басейн (+45 монет)', questId: 'q_hotel_slide' },
        { id: 'h_chest', zoneIdx: 0, x: 1980, y: 555, title: 'Курортна Скриня', prompt: 'Відкрити VIP-Скарб', chestId: 'ch_hotel', bonus: 50 }
      ],
      secrets: [
        { id: 'sec_h_1', zoneIdx: 1, x: 1850, y: 950, label: 'Золотий ключ-картка у фойє', coins: 35, xp: 25 },
        { id: 'sec_h_2', zoneIdx: 2, x: 640, y: 940, label: 'Тістечко від шеф-кондитера', coins: 35, xp: 25 },
        { id: 'sec_h_3', zoneIdx: 3, x: 1540, y: 920, label: 'Діадема в люкс-номері', coins: 45, xp: 35 }
      ]
    },

    boutique: {
      id: 'boutique',
      name: 'Бутік Моди та Секретне Горище',
      shortName: 'Бутік Моди',
      unlockedByDefault: false,
      unlockReq: { level: 4, quests: 6, coins: 110 },
      mapNode: { x: 72, y: 26 },
      zones: [
        z('assets/characters/pixar/spirit_room6_boutique.jpg', 'Ательє Моди та Кришталеве Горище', 1250,
          [{ x1: 110, x2: 2290, y: 690 }],
          [{ id: 'btq_st', points: [{ x: 985, y: 1250 }, { x: 1470, y: 690 }] }]
        ),
        z('assets/locations/loc_salon_hair.jpg', 'Салон Зачісок', 1145),
        z('assets/locations/loc_salon_nails.jpg', 'Студія Краси', 1145),
        z('assets/locations/loc_salon_pet_spa.jpg', 'Грумінг-Спа для Бруно', 1145),
        z('assets/locations/loc_salon_photobooth.jpg', 'Фотостудія Зірок', 1145)
      ],
      stations: [
        { id: 'bt_show', zoneIdx: 0, x: 580, y: 1250, title: 'Подіум Стилю', prompt: 'Влаштувати модний показ (+45 монет)', questId: 'q_boutique_show' },
        { id: 'bt_wardrobe', zoneIdx: 0, x: 1750, y: 1250, title: 'Королівська Примірочна', prompt: 'Відкрити весь Гардероб', action: 'wardrobe' },
        { id: 'bt_chest', zoneIdx: 0, x: 460, y: 690, title: 'Кришталеві Скрині Горища', prompt: 'Відкрити Королівський Скарб', chestId: 'ch_boutique', bonus: 70, questId: 'q_boutique_attic' }
      ],
      secrets: [
        { id: 'sec_bt_1', zoneIdx: 1, x: 1760, y: 950, label: 'Перлинна заколка за дзеркалом', coins: 35, xp: 30 },
        { id: 'sec_bt_2', zoneIdx: 3, x: 640, y: 960, label: 'Бантик для Бруно у спа', coins: 35, xp: 30 },
        { id: 'sec_bt_3', zoneIdx: 4, x: 1520, y: 930, label: 'Зіркове фото у студії', coins: 45, xp: 35 }
      ]
    },

    forest: {
      id: 'forest',
      name: 'Чарівний Ліс Гандії',
      shortName: 'Ліс',
      unlockedByDefault: false,
      unlockReq: { level: 4, quests: 7, coins: 125 },
      mapNode: { x: 10, y: 28 },
      zones: [
        z('assets/locations/loc_park.jpg', 'Узлісся Смарагдового Лісу', 1145, [], [], 'rgba(16, 185, 129, 0.14)'),
        z('assets/characters/pixar/spirit_room5_petpark.jpg', 'Лісовий Будиночок на Дереві', 1095,
          [{ x1: 400, x2: 1050, y: 415 }, { x1: 1050, x2: 2260, y: 455 }],
          [{ id: 'for_st', points: [{ x: 1555, y: 1095 }, { x: 965, y: 415 }] }],
          'rgba(5, 150, 105, 0.12)'
        ),
        z('assets/locations/loc_park_fountain.jpg', 'Лісове Джерело Світлячків', 1145, [], [], 'rgba(6, 95, 70, 0.18)'),
        z('assets/locations/loc_petshop_playroom.jpg', 'Галявина Лісових Звірят', 1145, [], [], 'rgba(16, 185, 129, 0.12)')
      ],
      stations: [
        { id: 'for_berries', zoneIdx: 0, x: 1200, y: 1145, title: 'Лісова Галявина Ягід', prompt: 'Зібрати лісову суницю (+40 монет)', questId: 'q_forest_berries' },
        { id: 'for_chest', zoneIdx: 2, x: 1250, y: 1145, title: 'Скарб Лісових Ельфів', prompt: 'Відкрити Лісову Скриню', chestId: 'ch_forest', bonus: 60 }
      ],
      secrets: [
        { id: 'sec_f_1', zoneIdx: 0, x: 1920, y: 960, label: 'Грибочок-ліхтарик під кущем', coins: 35, xp: 30 },
        { id: 'sec_f_2', zoneIdx: 1, x: 1620, y: 420, label: 'Гніздечко зі скарбом на мосту', coins: 40, xp: 35 },
        { id: 'sec_f_3', zoneIdx: 3, x: 680, y: 950, label: 'Кристал лісової феї', coins: 45, xp: 35 }
      ]
    },

    mountains: {
      id: 'mountains',
      name: 'Гори Гандії (Мондувер)',
      shortName: 'Гори',
      unlockedByDefault: false,
      unlockReq: { level: 5, quests: 8, coins: 140 },
      mapNode: { x: 37, y: 12 },
      zones: [
        z('assets/characters/pixar/spirit_room1_villa.jpg', 'Гірський Притулок Альпіністів', 1135,
          [{ x1: 700, x2: 1690, y: 448 }],
          [{ id: 'mt_st', points: [{ x: 1585, y: 1135 }, { x: 1545, y: 780 }, { x: 1235, y: 448 }] }],
          'rgba(59, 130, 246, 0.14)'
        ),
        z('assets/characters/pixar/spirit_room2_academy.jpg', 'Високогірна Обсерваторія', 1145,
          [{ x1: 1850, x2: 2150, y: 925 }, { x1: 1460, x2: 1750, y: 765 }, { x1: 1790, x2: 2340, y: 625 }],
          [{ id: 'mt_st2', points: [{ x: 1710, y: 1145 }, { x: 1985, y: 925 }, { x: 1615, y: 765 }, { x: 1890, y: 625 }] }],
          'rgba(30, 58, 138, 0.12)'
        ),
        z('assets/locations/loc_park_kiosks.jpg', 'Оглядовий Майданчик Вершини', 1145, [], [], 'rgba(251, 146, 60, 0.12)')
      ],
      stations: [
        { id: 'mt_flag', zoneIdx: 1, x: 2040, y: 625, title: 'Вершина Мондувер', prompt: 'Встановити прапор Даніки (+50 монет)', questId: 'q_mountain_peak' },
        { id: 'mt_chest', zoneIdx: 2, x: 1320, y: 1145, title: 'Гірська Печера Кристалів', prompt: 'Відкрити Гірський Скарб', chestId: 'ch_mountains', bonus: 65 }
      ],
      secrets: [
        { id: 'sec_m_1', zoneIdx: 0, x: 960, y: 420, label: 'Аметист на балконі притулку', coins: 40, xp: 35 },
        { id: 'sec_m_2', zoneIdx: 2, x: 640, y: 960, label: 'Рідкісний гірський кристал', coins: 45, xp: 35 }
      ]
    },

    la_vital: {
      id: 'la_vital',
      name: 'Торговий Центр Ла Віталь',
      shortName: 'ТЦ Ла Віталь',
      unlockedByDefault: false,
      unlockReq: { level: 5, quests: 9, coins: 160 },
      mapNode: { x: 70, y: 64 },
      zones: [
        z('assets/locations/loc_vital.jpg', 'Центральний Вхід Ла Віталь', 1145),
        z('assets/locations/loc_vital_atrium.jpg', 'Скляний Атріум і Фонтани', 1145),
        z('assets/locations/loc_vital_fashion.jpg', 'Галерея Модних Магазинів', 1145),
        z('assets/locations/loc_vital_toys.jpg', 'Королівство Іграшок', 1145),
        z('assets/locations/loc_vital_foodcourt.jpg', 'Фудкорт та Десерти', 1145)
      ],
      stations: [
        { id: 'lv_toys', zoneIdx: 3, x: 1200, y: 1145, title: 'Магазин Іграшок Мрії', prompt: 'Обрати іграшку для колекції (+50 монет)', questId: 'q_lavital_toys' },
        { id: 'lv_food', zoneIdx: 4, x: 1260, y: 1145, title: 'Десерт-Кафе Ла Віталь', prompt: 'Скуштувати бельгійські вафлі (+45 монет)', questId: 'q_lavital_food' },
        { id: 'lv_chest', zoneIdx: 1, x: 1380, y: 1145, title: 'Подарункова Коробка ТЦ', prompt: 'Відкрити Подарунок Ла Віталь', chestId: 'ch_lavital', bonus: 70 }
      ],
      secrets: [
        { id: 'sec_lv_1', zoneIdx: 0, x: 1860, y: 960, label: 'Подарунковий сертифікат біля вітрини', coins: 40, xp: 30 },
        { id: 'sec_lv_2', zoneIdx: 2, x: 640, y: 950, label: 'Секретна сумочка дизайнера', coins: 45, xp: 35 },
        { id: 'sec_lv_3', zoneIdx: 3, x: 1840, y: 940, label: 'Золотий плюшевий ведмедик', coins: 50, xp: 40 }
      ]
    },

    valencia: {
      id: 'valencia',
      name: 'Місто Валенсія',
      shortName: 'Валенсія',
      unlockedByDefault: false,
      unlockReq: { level: 6, quests: 10, coins: 200 },
      mapNode: { x: 84, y: 40 },
      zones: [
        z('assets/locations/loc_hotel_lobby.jpg', 'Площа Міста Мистецтв Валенсії', 1145, [], [], 'rgba(56, 189, 248, 0.12)'),
        z('assets/locations/loc_beach_yacht.jpg', 'Океанографік та Набережна', 1145),
        z('assets/locations/loc_vital_atrium.jpg', 'Центральний Проспект Валенсії', 1145),
        z('assets/characters/pixar/spirit_room6_boutique.jpg', 'Палац Кераміки та Скарбів', 1250,
          [{ x1: 110, x2: 2290, y: 690 }],
          [{ id: 'val_st', points: [{ x: 985, y: 1250 }, { x: 1470, y: 690 }] }]
        )
      ],
      stations: [
        { id: 'val_ocean', zoneIdx: 1, x: 1240, y: 1145, title: 'Шоу Дельфінів у Валенсії', prompt: 'Подивитися шоу дельфінів (+60 монет)', questId: 'q_valencia_ocean' },
        { id: 'val_chest', zoneIdx: 3, x: 460, y: 690, title: 'Королівський Скарб Валенсії', prompt: 'Відкрити Скарб Валенсії', chestId: 'ch_valencia', bonus: 90 }
      ],
      secrets: [
        { id: 'sec_v_1', zoneIdx: 0, x: 1740, y: 950, label: 'Квітка апельсину Валенсії', coins: 45, xp: 35 },
        { id: 'sec_v_2', zoneIdx: 2, x: 680, y: 950, label: 'Сувенір з Океанографіка', coins: 50, xp: 40 }
      ]
    },

    bilbao: {
      id: 'bilbao',
      name: 'Місто Більбао',
      shortName: 'Більбао',
      unlockedByDefault: false,
      unlockReq: { level: 7, quests: 12, coins: 250 },
      mapNode: { x: 89, y: 16 },
      zones: [
        z('assets/locations/loc_academy_fame.jpg', 'Музей Сучасного Мистецтва Більбао', 1145),
        z('assets/characters/pixar/spirit_room4_hotel.jpg', 'Набережна Річки Нервіон', 1230,
          [{ x1: 100, x2: 2320, y: 555 }],
          [{ id: 'bil_st', points: [{ x: 1745, y: 1230 }, { x: 1065, y: 555 }] }],
          'rgba(99, 102, 241, 0.12)'
        ),
        z('assets/locations/loc_hotel_rooftop.jpg', 'Панорама Північної Іспанії', 1145),
        z('assets/rooms/room_secret_master_full.jpg', 'Гранд-Скарбниця Мандрівниці', 1145)
      ],
      stations: [
        { id: 'bil_art', zoneIdx: 0, x: 1200, y: 1145, title: 'Квітковий Песик Паппі', prompt: 'Сфотографувати Бруно біля Паппі (+70 монет)', questId: 'q_bilbao_puppy' },
        { id: 'bil_chest', zoneIdx: 3, x: 1280, y: 1145, title: 'Головний Скарб Іспанії', prompt: 'Відкрити Гранд-Скарб Більбао', chestId: 'ch_bilbao', bonus: 120 }
      ],
      secrets: [
        { id: 'sec_bl_1', zoneIdx: 0, x: 580, y: 950, label: 'Титанова зірка музею', coins: 55, xp: 45 },
        { id: 'sec_bl_2', zoneIdx: 2, x: 1780, y: 940, label: 'Золотий квиток мандрівниці', coins: 65, xp: 50 }
      ]
    }
  };

  window.SPIRIT_LOCATIONS = LOCATIONS;

  // 3. ГРАФ ДОРІЖОК НА КАРТІ ГАНДІЇ -> ВАЛЕНСІЯ -> БІЛЬБАО
  // Даніка і Бруно ходять ТОЧНО по доріжках між вузлами (BFS найкоротший шлях!)
  window.SPIRIT_MAP_EDGES = [
    ['forest', 'school_abece'],
    ['forest', 'danika_home'],
    ['danika_home', 'mercadona'],
    ['danika_home', 'sport_complex'],
    ['mercadona', 'school_abece'],
    ['mercadona', 'chachi_piruli'],
    ['mercadona', 'park'],
    ['school_abece', 'mountains'],
    ['school_abece', 'chachi_piruli'],
    ['mountains', 'academy'],
    ['chachi_piruli', 'academy'],
    ['chachi_piruli', 'park'],
    ['sport_complex', 'park'],
    ['park', 'beach'],
    ['park', 'hotel'],
    ['academy', 'hotel'],
    ['academy', 'boutique'],
    ['beach', 'la_vital'],
    ['hotel', 'la_vital'],
    ['hotel', 'boutique'],
    ['hotel', 'valencia'],
    ['la_vital', 'valencia'],
    ['boutique', 'valencia'],
    ['boutique', 'bilbao'],
    ['valencia', 'bilbao']
  ];

  // 4. КВЕСТИ (ОБ'ЄДНАНІ З AVATAR WORLD + НОВІ КВЕСТИ ПО ВСІХ 15 ЛОКАЦІЯХ)
  const BASE_QUESTS = [
    { id: 'q_home_morning', room: 'danika_home', title: 'Дім: Застели ліжечко у спальні Даніки', coins: 20, xp: 25 },
    { id: 'q_home_teeth', room: 'danika_home', title: 'Дім: Почисти зубки у ванній кімнаті', coins: 15, xp: 20 },
    { id: 'q_home_breakfast', room: 'danika_home', title: 'Дім: Приготуй смачний сімейний сніданок', coins: 25, xp: 30 },
    { id: 'q_home_art', room: 'danika_home', title: 'Дім: Намалюй картину в майстерні творчості', coins: 25, xp: 30 },
    { id: 'q_villa_bake', room: 'danika_home', title: 'Вілла: Спечи Полуничний Кекс на кухні', coins: 25, xp: 35 },
    { id: 'q_villa_loft', room: 'danika_home', title: 'Вілла: Піднімися сходами на 2-й поверх', coins: 20, xp: 30 },
    { id: 'q_merc_list', room: 'mercadona', title: 'Меркадона: Візьми список сімейних покупок', coins: 15, xp: 20 },
    { id: 'q_merc_fruits', room: 'mercadona', title: 'Меркадона: Обери свіжі апельсини у відділі фруктів', coins: 25, xp: 30 },
    { id: 'q_merc_bakery', room: 'mercadona', title: 'Меркадона: Купи свіжі круасани в пекарні', coins: 25, xp: 30 },
    { id: 'q_merc_math', room: 'mercadona', title: 'Меркадона: Порахуй решту на касі', coins: 30, xp: 35 },
    { id: 'q_sch_math', room: 'school_abece', title: 'Школа Abecé: Розв’яжи задачу біля дошки', coins: 30, xp: 35 },
    { id: 'q_sch_science', room: 'school_abece', title: 'Школа Abecé: Проведи дослід у лабораторії', coins: 30, xp: 35 },
    { id: 'q_sch_lunch', room: 'school_abece', title: 'Школа Abecé: Пообідай у шкільній їдальні', coins: 20, xp: 25 },
    { id: 'q_sch_gym', room: 'school_abece', title: 'Школа Abecé: Пройди спортивну естафету', coins: 30, xp: 35 },
    { id: 'q_park_wish', room: 'park', title: 'Парк: Загадай бажання біля фонтану', coins: 20, xp: 25 },
    { id: 'q_park_play', room: 'park', title: 'Парк: Пограйся на дитячому майданчику', coins: 25, xp: 30 },
    { id: 'q_park_agility', room: 'park', title: 'Парк: Пройди кільця трюків разом із Бруно', coins: 35, xp: 45 },
    { id: 'q_park_treehouse', room: 'park', title: 'Парк: Піднімися на будиночок на дереві', coins: 35, xp: 45 },
    { id: 'q_chachi_balls', room: 'chachi_piruli', title: 'Чачі Пірулі: Знайди золоту кульку в басейні', coins: 25, xp: 30 },
    { id: 'q_chachi_climb', room: 'chachi_piruli', title: 'Чачі Пірулі: Підкори скеледром', coins: 30, xp: 35 },
    { id: 'q_chachi_jump', room: 'chachi_piruli', title: 'Чачі Пірулі: Зроби супер-стрибок на батуті', coins: 20, xp: 25 },
    { id: 'q_sport_sprint', room: 'sport_complex', title: 'Спорткомплекс: Пробіжи спринт чемпіонки', coins: 35, xp: 45 },
    { id: 'q_sport_gym', room: 'sport_complex', title: 'Спорткомплекс: Виконай гімнастичний трюк', coins: 35, xp: 45 },
    { id: 'q_acad_pet', room: 'academy', title: 'Академія: Приручи нового друга у Кришталевому Спа', coins: 35, xp: 45 },
    { id: 'q_acad_chest', room: 'academy', title: 'Академія: Знайди Небесну Скриню на хмарках', coins: 40, xp: 50 },
    { id: 'q_acad_puzzle', room: 'academy', title: 'Академія: Розгадай загадку в залі магії', coins: 40, xp: 50 },
    { id: 'q_beach_icecream', room: 'beach', title: 'Пляж: Пригости Бруно морозивом біля кіоску', coins: 30, xp: 40 },
    { id: 'q_beach_lighthouse', room: 'beach', title: 'Пляж: Запали ліхтар Маяка Гандії', coins: 40, xp: 50 },
    { id: 'q_beach_yacht', room: 'beach', title: 'Пляж: Вирушай на прогулянку на яхті', coins: 45, xp: 55 },
    { id: 'q_hotel_smoothie', room: 'hotel', title: 'Готель: Приготуй тропічний смузі в лобі', coins: 35, xp: 45 },
    { id: 'q_hotel_slide', room: 'hotel', title: 'Готель: З’їдь із водної гірки на даху', coins: 45, xp: 55 },
    { id: 'q_boutique_show', room: 'boutique', title: 'Бутік: Влаштуй модний показ на подіумі', coins: 45, xp: 55 },
    { id: 'q_boutique_attic', room: 'boutique', title: 'Бутік: Знайди Кришталеві Скрині на горищі', coins: 60, xp: 75 },
    { id: 'q_forest_berries', room: 'forest', title: 'Ліс: Збери кошик лісових суниць', coins: 40, xp: 50 },
    { id: 'q_mountain_peak', room: 'mountains', title: 'Гори: Встанови прапор на вершині Мондувер', coins: 50, xp: 65 },
    { id: 'q_lavital_toys', room: 'la_vital', title: 'Ла Віталь: Обери іграшку мрії в ТЦ', coins: 50, xp: 60 },
    { id: 'q_lavital_food', room: 'la_vital', title: 'Ла Віталь: Скуштуй десерт на фудкорті', coins: 45, xp: 55 },
    { id: 'q_valencia_ocean', room: 'valencia', title: 'Валенсія: Відвідай шоу дельфінів', coins: 60, xp: 75 },
    { id: 'q_bilbao_puppy', room: 'bilbao', title: 'Більбао: Сфотографуй Бруно біля Паппі', coins: 70, xp: 90 }
  ];

  // Автоматично підтягуємо щоденні завдання з Avatar World (DEFAULT_APP_DATA)
  window.getSpiritQuests = function () {
    const list = BASE_QUESTS.slice();
    if (typeof DEFAULT_APP_DATA !== 'undefined' && Array.isArray(DEFAULT_APP_DATA.quests20)) {
      DEFAULT_APP_DATA.quests20.slice(0, 12).forEach(q => {
        const cleanTitle = String(q.title || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
        if (cleanTitle && !list.find(x => x.id === 'aw_' + q.id)) {
          list.push({
            id: 'aw_' + q.id,
            room: 'danika_home',
            title: 'Щоденна місія: ' + cleanTitle,
            coins: q.coins || 20,
            xp: q.xp || 25,
            isDaily: true
          });
        }
      });
    }
    return list;
  };

  // Автоматично підтягуємо ВСІ костюми Даніки та образи Бруно з Avatar World + Pixar
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
          id: o.id,
          title: cleanTitle,
          cost: Math.max(25, Math.min(180, o.cost || 45)),
          reqLevel: idx < 10 ? 1 : (idx < 25 ? 2 : 3),
          src: o.img,
          thumb: o.tileIcon || o.img,
          crop: { x: 0, y: 0, w: 1, h: 1 },
          isPngSprite: true
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
          id: b.id,
          title: cleanTitle,
          cost: idx === 0 ? 30 : Math.max(35, Math.min(120, b.cost || 45)),
          reqLevel: idx < 3 ? 1 : 2,
          src: b.img,
          crop: { x: 0, y: 0, w: 1, h: 1 },
          isPngSprite: true
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
