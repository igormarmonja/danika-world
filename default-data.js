/**
 * "Danika Treasure Quest: Adventure World (Gandia Edition)"
 * 20 Standalone Outfits, 20 Illustrated Accessories, 4 Black Miniature Pinscher Bruno Sprites,
 * Multi-Room Avatar World (Bedroom, Bathroom, Kitchen, Studio), & Gandia City Map.
 */
// =========================================================
// ВІТРИНА МРІЙ — СПРАВЖНІ РЕАЛЬНІ ІГРАШКИ ДАНІКИ (НОВІ ФОТО)
// =========================================================
const REAL_DREAM_TOYS = [
  {
    id: "toy_pop_remy",
    title: "Фігурка Funko POP! «Ремі з сиром» (Ratatouille Remy)",
    shortTitle: "Ремі з сиром",
    desc: "Оригінальна колекційна фігурка шеф-кухаря Ремі зі шматочком сиру з улюбленого мультфільму!",
    costCrystals: 25,
    costCoins: 250,
    realPriceEur: "15.99€",
    category: "Іграшка",
    image: "assets/rewards/real_toys/prize_pop_remy.jpg",
    tier: "🌟 Улюблена мета",
    motivation: "Справжній шеф-кухар Ремі прикрасить твою кімнату!"
  },
  {
    id: "toy_rainbocorns",
    title: "Велике яйце-сюрприз ZURU Rainbocorns Eggzania",
    shortTitle: "Rainbocorns Eggzania",
    desc: "Величезне чарівне яйце з м'яким пінгвінчиком, браслетами та понад 10 сюрпризами всередині!",
    costCrystals: 35,
    costCoins: 350,
    realPriceEur: "24.99€",
    category: "Супер-приз",
    image: "assets/rewards/real_toys/prize_rainbocorns_eggzania.jpg",
    tier: "👑 Королівський сюрприз",
    motivation: "Грандіозна розпаковка з чарівним пінгвінчиком!"
  },
  {
    id: "toy_scooter",
    title: "Трюковий самокат для Даніки з шоломом",
    shortTitle: "Трюковий самокат",
    desc: "Стильний бірюзово-рожевий самокат для веселих покатушок на вулиці разом з Бруно!",
    costCrystals: 50,
    costCoins: 500,
    realPriceEur: "49.99€",
    category: "Спорт",
    image: "assets/rewards/real_toys/prize_scooter.jpg",
    tier: "🏆 Грандіозна мрія",
    motivation: "Швидкість, вітерець та драйвові прогулянки!"
  },
  {
    id: "toy_rollers",
    title: "Роликові ковзани з шоломом та повним захистом",
    shortTitle: "Ролики з захистом",
    desc: "Яскраві ролики для катання на набережній Гандії разом з мамою і татом!",
    costCrystals: 45,
    costCoins: 450,
    realPriceEur: "39.99€",
    category: "Спорт",
    image: "assets/rewards/real_toys/prize_rollers_skates.jpg",
    tier: "🏆 Велика мрія",
    motivation: "Катайся з вітерцем вздовж теплого пляжу!"
  },
  {
    id: "toy_mini_world",
    title: "Колекційні кульки-сюрпризи Mini World Collectibles",
    shortTitle: "Mini World кульки",
    desc: "Набір колекційних кульок з крихітними реалістичними смаколиками та напоями!",
    costCrystals: 15,
    costCoins: 150,
    realPriceEur: "9.99€",
    category: "Сюрприз",
    image: "assets/rewards/real_toys/prize_mini_world_balls.jpg",
    tier: "⚡ Швидка мета",
    motivation: "Крихітна піца, сендвічі та десертики для гри!"
  },
  {
    id: "toy_squishy_treats",
    title: "Великий набір сквишів-смаколиків антистрес",
    shortTitle: "Сквиші-смаколики",
    desc: "Супер-м'якенькі апетитні сквиші з повільним відновленням форми: пончики, сендвічі, сіннабони!",
    costCrystals: 15,
    costCoins: 150,
    realPriceEur: "9.99€",
    category: "Антистрес",
    image: "assets/rewards/real_toys/prize_squishy_treats.jpg",
    tier: "⚡ Швидка мета",
    motivation: "М'які друзі для обіймів під час читання та уроків!"
  },
  {
    id: "cert_magic_wish",
    title: "Сертифікат «Чарівне бажання: 60 хвилин разом»",
    shortTitle: "Чарівне бажання (60 хв)",
    desc: "Загадай будь-яку спільну розвагу, гру чи творчість разом з мамою або татом на 1 годину!",
    costCrystals: 10,
    costCoins: 100,
    realPriceEur: "Безцінно",
    category: "Сертифікат",
    image: "assets/rewards/real_toys/prize_cert_magic_wish.jpg",
    tier: "❤️ Сімейний час",
    motivation: "Ціла година тільки для тебе і батьків!"
  },
  {
    id: "cert_movie_night",
    title: "Сертифікат «Вибір фільму для сімейного перегляду»",
    shortTitle: "Сімейний фільм з попкорном",
    desc: "Даніка особисто обирає улюблений мультфільм для вечірнього кіносеансу з попкорном!",
    costCrystals: 10,
    costCoins: 100,
    realPriceEur: "Кіновечір",
    category: "Сертифікат",
    image: "assets/rewards/real_toys/prize_cert_movie_night.jpg",
    tier: "🎬 Затишний вечір",
    motivation: "Ти головний режисер нашого домашнього кінотеатру!"
  },
  {
    id: "cert_mountain_walk",
    title: "Сертифікат «Велика пригода: Прогулянка з гори та намет»",
    shortTitle: "Похід у гори з наметом",
    desc: "Справжня сімейна мандрівка в гори з наметом, рюкзаками та песиком Бруно!",
    costCrystals: 20,
    costCoins: 200,
    realPriceEur: "Пригода",
    category: "Сертифікат",
    image: "assets/rewards/real_toys/prize_cert_mountain_walk.jpg",
    tier: "🌲 Справжня пригода",
    motivation: "Незабутній похід у гори з мальовничими краєвидами!"
  },
  {
    id: "cert_tablet_game",
    title: "Сертифікат «60 хвилин гри в планшеті»",
    shortTitle: "60 хв гри в планшеті",
    desc: "Бонусні 60 хвилин вільної гри на планшеті за відмінні старання!",
    costCrystals: 8,
    costCoins: 80,
    realPriceEur: "Бонусний час",
    category: "Сертифікат",
    image: "assets/rewards/real_toys/prize_cert_tablet_game.jpg",
    tier: "⚡ Легка мета",
    motivation: "Зароблені чесно 60 хвилин улюблених ігор!"
  },
  {
    id: "cert_youtube_60m",
    title: "Сертифікат «60 хвилин перегляду YouTube»",
    shortTitle: "60 хв YouTube",
    desc: "Ціла година улюблених відеороликів, челенджів та розпаковок на YouTube!",
    costCrystals: 8,
    costCoins: 80,
    realPriceEur: "Бонусний час",
    category: "Сертифікат",
    image: "assets/rewards/real_toys/prize_cert_youtube_60m.jpg",
    tier: "⚡ Легка мета",
    motivation: "Відпочинок за переглядом улюблених блогерів!"
  }
];

const DEFAULT_APP_DATA = {
  explorerName: "Danika",
  activeDanikaAvatar: "assets/characters/danika_danika_abece.png?v=20261005_5",
  activeBrunoAvatar: "assets/characters/bruno_happy.png?v=20261005_4",
  activeDanikaAccessory: "acc_none",
  activeBrunoStyle: "bruno_happy",
  activeRoomIndex: 0,
  activeDanikaPose: null,
  activeDreamToyId: "toy_pop_remy",
  realDreamToys: REAL_DREAM_TOYS,
  dreamOrders: [],
  pendingApprovals: [],
  tamagotchi: {
    hunger: 85,
    energy: 35,
    happiness: 95,
    hygiene: 80,
    health: 100,
    lastUpdate: Date.now()
  },

  // =========================================================
  // СІМЕЙНИЙ РЕЙТИНГ ТА ПРОФІЛІ (ДАНІКА, МАМА, ТАТО)
  // =========================================================
  activeProfileId: "danika",
  collectedStickers: [],
  familyNotes: [],
  brunoSpecialGifts: [],
  unlockedPoses: [
    "danika_candy",
    "danika_reading",
    "danika_ball",
    "danika_brush_teeth",
    "danika_sleeping"
  ],
  secretRoomConfig: {
    version: "20261004_3",
    exposureMode: "day", // "day" | "sunset" | "night_magic"
    isSleeping: false,
    lightStates: {
      sr_01_chandelier: true,
      sr_02_fairy_lights: true,
      sr_13_moon_lamp: true,
      sr_16_star_lantern: true
    },
    enabledItems: null // null means all items from SECRET_ROOM_ITEMS_CATALOG are active by default
  },
  familyProfiles: {
    danika: {
      id: "danika",
      name: "Даніка",
      role: "Донечка-Шукачка 👑",
      badge: "👧",
      avatar: "assets/characters/danika_danika_abece.png?v=20261005_5",
      sprite: "assets/characters/danika_danika_abece.png?v=20261005_5",
      level: 1,
      xp: 140,
      coins: 30,
      crystals: 2,
      streakDays: 3,
      completedTodayCount: 2,
      completedWeekCount: 14,
      quests: [
        { id: "q_prep_school", title: "Збори з вечора: рюкзак та форма готові до школи", xp: 45, coins: 10, icon: "🎒", completed: true },
        { id: "q_make_bed", title: "Таємна схованка під подушкою: застелити ліжко", xp: 40, coins: 10, icon: "🛏️", completed: true },
        { id: "q_clean_room", title: "Секретна карта Бруно: навести порядок у кімнаті", xp: 40, coins: 10, icon: "🧹", completed: false },
        { id: "q_wash_dishes", title: "Пінна місія на кухні: помити посуд", xp: 40, coins: 10, icon: "🍽️", completed: false },
        { id: "q_eat_broccoli", title: "Вітамінна супер-сила: скуштувати броколі", xp: 50, coins: 12, icon: "🥦", completed: false },
        { id: "q_clean_bruno", title: "Порадувати песика Бруно: чиста мисочка і килимок", xp: 40, coins: 10, icon: "🥣", completed: false },
        { id: "q_squats_10", title: "Спортивний челендж: 10 веселих присідань", xp: 40, coins: 10, icon: "🦵", completed: false },
        { id: "q_gymnastics_3m", title: "Розминка чемпіонки: 3 хвилини гімнастики", xp: 45, coins: 12, icon: "🤸‍♀️", completed: false },
        { id: "q_math_mom", title: "Математичний шифр від мами", xp: 50, coins: 12, icon: "📐", completed: false }
      ]
    },
    mom: {
      id: "mom",
      name: "Мама Ксюша",
      role: "Супер-Мама 👩‍🎨",
      badge: "👩‍🎨",
      avatar: "assets/characters/avatar_mom_ksyusha.png",
      sprite: "assets/characters/character_mom_ksyusha.png",
      level: 2,
      xp: 180,
      coins: 60,
      crystals: 3,
      streakDays: 4,
      completedTodayCount: 3,
      completedWeekCount: 18,
      quests: [
        { id: "mom_q1", title: "Ранкова кава та планування дня", xp: 20, icon: "☕", completed: true },
        { id: "mom_q2", title: "Малювання картини в майстерні", xp: 35, icon: "🎨", completed: false },
        { id: "mom_q3", title: "Купити фрукти та кокосове молоко в Mercadona", xp: 25, icon: "🥑", completed: true },
        { id: "mom_q4", title: "Йога та розтяжка 20 хвилин", xp: 30, icon: "🧘‍♀️", completed: false },
        { id: "mom_q5", title: "Вечірнє читання казки для Даніки", xp: 30, icon: "📖", completed: false },
        { id: "mom_q6", title: "Приготувати смачний домашній обід", xp: 25, icon: "🍲", completed: true },
        { id: "mom_q7", title: "Пошити новий бантик або аксесуар", xp: 30, icon: "🧵", completed: false }
      ]
    },
    dad: {
      id: "dad",
      name: "Тато",
      role: "Капітан Сім'ї 👨‍✈️",
      badge: "👨‍✈️",
      avatar: "assets/characters/avatar_dad.png",
      sprite: "assets/characters/character_dad.png",
      level: 2,
      xp: 165,
      coins: 55,
      crystals: 3,
      streakDays: 3,
      completedTodayCount: 2,
      completedWeekCount: 16,
      quests: [
        { id: "dad_q1", title: "Ранкова пробіжка на пляжі Гандії", xp: 30, icon: "🏃‍♂️", completed: true },
        { id: "dad_q2", title: "Вигуляти та потренувати песика Бруно", xp: 25, icon: "🐕", completed: true },
        { id: "dad_q3", title: "Робота над проєктами та кодинг", xp: 35, icon: "💻", completed: false },
        { id: "dad_q4", title: "Підкачати колеса на самокаті", xp: 20, icon: "🚲", completed: false },
        { id: "dad_q5", title: "Сімейний перегляд мультфільму у залі", xp: 25, icon: "🎬", completed: false },
        { id: "dad_q6", title: "15 віджимань та підтягувань на турніку", xp: 30, icon: "💪", completed: false },
        { id: "dad_q7", title: "Привезти свіжі круасани зранку", xp: 20, icon: "🥐", completed: false }
      ]
    }
  },

  
  level: 1,
  xp: 140,
  xpForNextLevel: 300,
  coins: 30,
  crystals: 2, // 1 кристал = 1 євро
  streakDays: 3,
  energy: 35,
  maxEnergy: 999,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  lastDailyDigDate: null,
  parentPin: "1234",
  soundEnabled: true,
  speechEnabled: true,
  voiceEngine: 'online',

  // Стан кімнат та інтерактивів
  roomState: {
    bedMade: false,
    dishesClean: false,
    brunoHappiness: 100,
    brunoFed: false,
    teethBrushed: false,
    brunoBathed: false,
    momPaintingDone: false,
    ballPosition: 'rug',
    activeBedding: 'cozy_stars',
    activeRug: 'rainbow'
  },

  // Кімнати світу (Avatar World Style)
  rooms: [
    {
      id: "bedroom",
      name: "Спальня Даніки",
      icon: "🛏️",
      bg: "assets/rooms/room_bedroom.jpg",
      desc: "Штаб пригод: затишне ліжко, шафа, мурашник та улюблені книги"
    },
    {
      id: "bathroom",
      name: "Ванна кімната",
      icon: "🛁",
      bg: "assets/rooms/room_bathroom.jpg",
      desc: "Купання Бруно в бульбашках, чищення зубів Даніки та догляд"
    },
    {
      id: "kitchen",
      name: "Затишна Кухня",
      icon: "🍳",
      bg: "assets/rooms/room_kitchen.jpg",
      desc: "Миємо посуд, годуємо песика Бруно та смакуємо полуденком"
    },
    {
      id: "studio",
      name: "Майстерня Мами",
      icon: "🎨",
      bg: "assets/rooms/room_art_studio.jpg",
      desc: "Малюємо морські пейзажі, шиємо красиві стрічки та майструємо"
    }
  ],

  worldLocations: {
  "loc_home": {
    "id": "loc_home",
    "title": "Дім Даніки 🏠",
    "rooms": [
      {
        "id": "bedroom",
        "name": "Спальня Даніки 🛏️",
        "shortName": "🛏️ Спальня",
        "bg": "assets/rooms/room_bedroom.jpg",
        "desc": "Штаб пригод: затишне ліжко, шафа, мурашник та улюблені книги",
        "hotspots": [
          {
            "id": "bed",
            "icon": "🛏️",
            "text": "Таємна схованка: застелити ліжечко",
            "action": "handleBedClick()",
            "cls": "hotspot-bed"
          },
          {
            "id": "wardrobe",
            "icon": "👗",
            "text": "Гардеробна стилю",
            "action": "openWardrobeModal('danikaOutfits')",
            "cls": "hotspot-wardrobe"
          },
          {
            "id": "bookshelf",
            "icon": "🇪🇸",
            "text": "Пригоди в книжках",
            "action": "handleBookshelfClick()",
            "cls": "hotspot-bookshelf"
          },
          {
            "id": "terrarium",
            "icon": "🐜",
            "text": "Штаб дослідження мурах",
            "action": "handleTerrariumClick()",
            "cls": "hotspot-terrarium"
          },
          {
            "id": "skate",
            "icon": "🛹",
            "text": "Віраж на скейті",
            "action": "handleSkateClick()",
            "cls": "hotspot-skate"
          },
          {
            "id": "window",
            "icon": "🗺️",
            "text": "Мапа пригод Гандії",
            "action": "openMapModal()",
            "cls": "hotspot-window"
          }
        ]
      },
      {
        "id": "bathroom",
        "name": "Ванна кімната 🛁",
        "shortName": "🛁 Ванна",
        "bg": "assets/rooms/room_bathroom.jpg",
        "desc": "Купання Бруно в бульбашках, чищення зубів Даніки та догляд",
        "hotspots": [
          {
            "id": "bath-tub",
            "icon": "🧼",
            "text": "Пінна вечірка для Бруно",
            "action": "handleBathBrunoClick()",
            "cls": "hotspot-bath-tub"
          },
          {
            "id": "bath-vanity",
            "icon": "🪥",
            "text": "Сяюча усмішка Даніки",
            "action": "handleBrushTeethClick()",
            "cls": "hotspot-bath-vanity"
          }
        ]
      },
      {
        "id": "kitchen",
        "name": "Затишна Кухня 🍳",
        "shortName": "🍳 Кухня",
        "bg": "assets/rooms/room_kitchen.jpg",
        "desc": "Миємо посуд, годуємо песика Бруно та смакуємо полуденком",
        "hotspots": [
          {
            "id": "kitchen-sink",
            "icon": "🍽️",
            "text": "Пінна місія: чистий посуд",
            "action": "handleDishesClick()",
            "cls": "hotspot-kitchen-sink"
          },
          {
            "id": "kitchen-fridge",
            "icon": "📋",
            "text": "Штаб щоденних місій",
            "action": "handleFridgeClick()",
            "cls": "hotspot-kitchen-fridge"
          },
          {
            "id": "kitchen-table",
            "icon": "🥞",
            "text": "Вітамінна супер-сила та сніданок",
            "action": "handleBreakfastClick()",
            "cls": "hotspot-kitchen-table"
          },
          {
            "id": "kitchen-dogbowl",
            "icon": "🥣",
            "text": "Порадувати песика Бруно",
            "action": "feedBruno()",
            "cls": "hotspot-kitchen-dogbowl"
          }
        ]
      },
      {
        "id": "studio",
        "name": "Майстерня Мами 🎨",
        "shortName": "🎨 Майстерня",
        "bg": "assets/rooms/room_art_studio.jpg",
        "desc": "Малюємо морські пейзажі, шиємо красиві стрічки та майструємо",
        "hotspots": [
          {
            "id": "studio-easel",
            "icon": "🎨",
            "text": "Намалювати куточок Гандії",
            "action": "handleMomEaselClick()",
            "cls": "hotspot-studio-easel"
          },
          {
            "id": "studio-craft",
            "icon": "✂️",
            "text": "Змайструвати кажанчика Валенсії",
            "action": "handleCraftClick()",
            "cls": "hotspot-studio-craft"
          },
          {
            "id": "studio-sewing",
            "icon": "🧵",
            "text": "Дизайнерська швейна машинка",
            "action": "handleSewingClick()",
            "cls": "hotspot-studio-sewing"
          }
        ]
      },
      {
        "id": "room_secret",
        "name": "🔮 Таємна кімната Даніки",
        "shortName": "🔮 Таємна",
        "bg": "assets/rooms/room_secret_empty.jpg",
        "desc": "Власна чарівна кімната Даніки з тридцятьма предметами інтер'єру!",
        "hotspots": []
      }
    ]
  },
  "loc_abece": {
    "id": "loc_abece",
    "title": "Colegio Abecé 🏫",
    "rooms": [
      {
        "id": "abece_overview",
        "name": "Colegio Abecé • Вхід 🏫",
        "shortName": "🏫 Вхід & Фасад",
        "bg": "assets/locations/loc_abece.jpg",
        "desc": "Головний вхід та шкільне подвір'я Colegio Abecé у Гандії",
        "hotspots": [
          {
            "id": "abece_yard",
            "icon": "🏫",
            "text": "Шкільне подвір'я (+5 🪙)",
            "action": "handleAbeceYardClick()",
            "top": "58%",
            "left": "50%"
          },
          {
            "id": "abece_bell",
            "icon": "🔔",
            "text": "Шкільний дзвінок",
            "action": "handleAbeceBellClick()",
            "top": "35%",
            "left": "78%"
          }
        ]
      },
      {
        "id": "abece_math",
        "name": "Клас математики 📐",
        "shortName": "📐 Математика",
        "bg": "assets/locations/loc_abece_math.jpg",
        "desc": "Кольорова дошка, рахівниці та цікаві приклади з математики",
        "hotspots": [
          {
            "id": "math_board",
            "icon": "📐",
            "text": "Приклад з математики (+10 🪙)",
            "action": "handleMathClick()",
            "top": "38%",
            "left": "36%"
          },
          {
            "id": "math_abacus",
            "icon": "🧮",
            "text": "Рахівниця та підручники",
            "action": "handleAbacusClick()",
            "top": "52%",
            "left": "85%"
          }
        ]
      },
      {
        "id": "abece_canteen",
        "name": "Шкільна столова 🍽️",
        "shortName": "🍽️ Столова",
        "bg": "assets/locations/loc_abece_canteen.jpg",
        "desc": "Смачні шкільні обіди, свіжі валенсійські апельсини та сік",
        "hotspots": [
          {
            "id": "canteen_food",
            "icon": "🍽️",
            "text": "Шкільний обід (+10 🪙)",
            "action": "handleCanteenFoodClick()",
            "top": "52%",
            "left": "22%"
          },
          {
            "id": "canteen_oranges",
            "icon": "🍊",
            "text": "Валенсійські апельсини",
            "action": "handleCanteenFruitClick()",
            "top": "38%",
            "left": "32%"
          }
        ]
      },
      {
        "id": "abece_science",
        "name": "Клас хімії та науки 🧪",
        "shortName": "🧪 Хімія",
        "bg": "assets/locations/loc_abece_science.jpg",
        "desc": "Кольорові колби, мікроскоп та дитяча наукова лабораторія",
        "hotspots": [
          {
            "id": "science_tubes",
            "icon": "🧪",
            "text": "Науковий дослід (+12 🪙)",
            "action": "handleScienceExperimentClick()",
            "top": "54%",
            "left": "48%"
          },
          {
            "id": "science_micro",
            "icon": "🔬",
            "text": "Мікроскоп та мурахи",
            "action": "handleScienceMicroscopeClick()",
            "top": "48%",
            "left": "62%"
          }
        ]
      },
      {
        "id": "abece_gym",
        "name": "Спортивний зал 🏀",
        "shortName": "🏀 Спортзал",
        "bg": "assets/locations/loc_abece_gym.jpg",
        "desc": "Баскетбольні кільця, м'ячі та гімнастичні мати",
        "hotspots": [
          {
            "id": "gym_hoop",
            "icon": "🏀",
            "text": "10 присідань (+10 🪙)",
            "action": "handleGymSquatsClick()",
            "top": "38%",
            "left": "50%"
          },
          {
            "id": "gym_mats",
            "icon": "🤸‍♀️",
            "text": "3 хв гімнастики (+10 🪙)",
            "action": "handleGymnasticsClick()",
            "top": "60%",
            "left": "10%"
          }
        ]
      }
    ]
  },
  "loc_vital": {
    "id": "loc_vital",
    "title": "ТЦ «La Vital» 🛍️",
    "rooms": [
      {
        "id": "vital_overview",
        "name": "ТЦ «La Vital» • Панорама 🛍️",
        "shortName": "🛍️ Панорама ТЦ",
        "bg": "assets/locations/loc_vital.jpg",
        "desc": "Головна панорама сучасного торгового центру La Vital у Гандії",
        "hotspots": [
          {
            "id": "vital_main_hall",
            "icon": "🛍️",
            "text": "Головний атріум La Vital (+8 🪙)",
            "action": "handleVitalMainHallClick()",
            "top": "62%",
            "left": "50%"
          },
          {
            "id": "vital_cinema",
            "icon": "🎬",
            "text": "Кінотеатр та вітрини",
            "action": "handleVitalCinemaClick()",
            "top": "38%",
            "left": "25%"
          }
        ]
      },
      {
        "id": "vital_toys",
        "name": "Магазин іграшок 🧸",
        "shortName": "🧸 Іграшки",
        "bg": "assets/locations/loc_vital_toys.jpg",
        "desc": "Полиці з ведмедиками, повітряна куля та замки принцес",
        "hotspots": [
          {
            "id": "vital_bear",
            "icon": "🧸",
            "text": "Обрати іграшку (+12 🪙)",
            "action": "handleVitalToyClick()",
            "top": "46%",
            "left": "52%"
          },
          {
            "id": "vital_balloon",
            "icon": "🎈",
            "text": "Чарівна куля",
            "action": "handleVitalBalloonClick()",
            "top": "18%",
            "left": "42%"
          }
        ]
      },
      {
        "id": "vital_atrium",
        "name": "Перший поверх (Атріум) 🏛️",
        "shortName": "🏛️ 1 поверх",
        "bg": "assets/locations/loc_vital_atrium.jpg",
        "desc": "Грандіозний атріум з фонтаном бажань, пальмами та скляним куполом",
        "hotspots": [
          {
            "id": "vital_fountain",
            "icon": "⛲",
            "text": "Фонтан бажань (+8 🪙)",
            "action": "handleVitalFountainClick()",
            "top": "62%",
            "left": "60%"
          },
          {
            "id": "vital_walk",
            "icon": "🌴",
            "text": "Пальми та ескалатор",
            "action": "handleVitalWalkClick()",
            "top": "45%",
            "left": "20%"
          }
        ]
      },
      {
        "id": "vital_fashion",
        "name": "Модний одяг 👗",
        "shortName": "👗 Мода",
        "bg": "assets/locations/loc_vital_fashion.jpg",
        "desc": "Стильний бутік моди: сукні, взуття, дзеркала з теплим світлом",
        "hotspots": [
          {
            "id": "vital_dress",
            "icon": "👗",
            "text": "Приміряти сукню (+10 🪙)",
            "action": "handleVitalDressClick()",
            "top": "42%",
            "left": "30%"
          },
          {
            "id": "vital_mirror",
            "icon": "🪞",
            "text": "Дзеркало стилю",
            "action": "handleVitalMirrorClick()",
            "top": "42%",
            "left": "70%"
          }
        ]
      },
      {
        "id": "vital_foodcourt",
        "name": "Смачний фудкорт 🍕",
        "shortName": "🍕 Фудкорт",
        "bg": "assets/locations/loc_vital_foodcourt.jpg",
        "desc": "Чуррос з гарячим шоколадом, італійська піца та морозиво",
        "hotspots": [
          {
            "id": "vital_churros",
            "icon": "🥐",
            "text": "Чуррос з шоколадом (+10 🪙)",
            "action": "handleVitalChurrosClick()",
            "top": "50%",
            "left": "18%"
          },
          {
            "id": "vital_gelato",
            "icon": "🍦",
            "text": "Італійське джелато",
            "action": "handleVitalGelatoClick()",
            "top": "50%",
            "left": "62%"
          }
        ]
      }
    ]
  },
  "loc_beach": {
    "id": "loc_beach",
    "title": "Platja de Gandia 🏖️",
    "rooms": [
      {
        "id": "beach_overview",
        "name": "Platja de Gandia • Набережна 🏖️",
        "shortName": "🏖️ Набережна",
        "bg": "assets/locations/loc_beach.jpg",
        "desc": "Панорама знаменитого золотого пляжу та набережної Гандії",
        "hotspots": [
          {
            "id": "beach_sea_view",
            "icon": "🌊",
            "text": "Середземне море (+10 🪙)",
            "action": "handleBeachSeaViewClick()",
            "top": "52%",
            "left": "50%"
          },
          {
            "id": "beach_promenade",
            "icon": "🌴",
            "text": "Пальмова алея",
            "action": "handleBeachPromenadeClick()",
            "top": "68%",
            "left": "78%"
          }
        ]
      },
      {
        "id": "beach_yacht",
        "name": "Морська яхта ⛵",
        "shortName": "⛵ Яхта",
        "bg": "assets/locations/loc_beach_yacht.jpg",
        "desc": "Морська подорож на білосніжній яхті вздовж узбережжя Гандії",
        "hotspots": [
          {
            "id": "beach_helm",
            "icon": "⛵",
            "text": "Капітанський штурвал (+15 🪙)",
            "action": "handleYachtHelmClick()",
            "top": "58%",
            "left": "50%"
          },
          {
            "id": "beach_sea",
            "icon": "🌊",
            "text": "Морський бриз",
            "action": "handleYachtSeaClick()",
            "top": "46%",
            "left": "30%"
          }
        ]
      },
      {
        "id": "beach_kites",
        "name": "Повітряні змії 🪁",
        "shortName": "🪁 Змії",
        "bg": "assets/locations/loc_beach_kites.jpg",
        "desc": "Яскраві повітряні змії у формі дракона, веселки та восьминога",
        "hotspots": [
          {
            "id": "beach_kite_fly",
            "icon": "🪁",
            "text": "Запустити змія (+12 🪙)",
            "action": "handleKitesFlyClick()",
            "top": "22%",
            "left": "75%"
          },
          {
            "id": "beach_sand_castle",
            "icon": "🏰",
            "text": "Піщаний замок",
            "action": "handleBeachSandcastleClick()",
            "top": "68%",
            "left": "26%"
          }
        ]
      },
      {
        "id": "beach_cafe",
        "name": "Пляжне кафе 🍹",
        "shortName": "🍹 Кафе",
        "bg": "assets/locations/loc_beach_cafe.jpg",
        "desc": "Затишний чірінґіто на піску з кокосовими коктейлями та шезлонгами",
        "hotspots": [
          {
            "id": "beach_coco",
            "icon": "🥥",
            "text": "Кокосовий напій (+10 🪙)",
            "action": "handleBeachDrinkClick()",
            "top": "55%",
            "left": "45%"
          },
          {
            "id": "beach_lounge",
            "icon": "🏖️",
            "text": "Шезлонг релакс",
            "action": "handleBeachLoungeClick()",
            "top": "68%",
            "left": "78%"
          }
        ]
      },
      {
        "id": "beach_waterpark",
        "name": "Аквапарк Гандії 🌊",
        "shortName": "🌊 Аквапарк",
        "bg": "assets/locations/loc_beach_waterpark.jpg",
        "desc": "Райдужні водяні гірки, дельфін з відром та теплий басейн",
        "hotspots": [
          {
            "id": "beach_waterslide",
            "icon": "🌊",
            "text": "Спуск з гірки (+15 🪙)",
            "action": "handleWaterparkSlideClick()",
            "top": "46%",
            "left": "35%"
          },
          {
            "id": "beach_dolphin_splash",
            "icon": "🐬",
            "text": "Дельфін салют",
            "action": "handleWaterparkDolphinClick()",
            "top": "36%",
            "left": "74%"
          }
        ]
      }
    ]
  },
  "loc_park": {
    "id": "loc_park",
    "title": "Parc de l'Estació 🌳",
    "rooms": [
      {
        "id": "park_overview",
        "name": "Parc de l'Estació • Алея 🌳",
        "shortName": "🌳 Алея парку",
        "bg": "assets/locations/loc_park.jpg",
        "desc": "Головна мальовнича алея парку біля вокзалу Гандії",
        "hotspots": [
          {
            "id": "park_entrance",
            "icon": "🌳",
            "text": "Паркова прогулянка (+8 🪙)",
            "action": "handleParkEntranceClick()",
            "top": "55%",
            "left": "50%"
          },
          {
            "id": "park_palms",
            "icon": "🌴",
            "text": "Тінисті пальми",
            "action": "handleParkPalmsClick()",
            "top": "42%",
            "left": "20%"
          }
        ]
      },
      {
        "id": "park_fountain",
        "name": "Фонтан з квітами ⛲",
        "shortName": "⛲ Фонтан",
        "bg": "assets/locations/loc_park_fountain.jpg",
        "desc": "Казковий мармуровий фонтан з трояндами та лавандою",
        "hotspots": [
          {
            "id": "park_fount",
            "icon": "⛲",
            "text": "Загадати бажання (+8 🪙)",
            "action": "handleParkFountainClick()",
            "top": "54%",
            "left": "50%"
          },
          {
            "id": "park_roses",
            "icon": "🌹",
            "text": "Понюхати троянди",
            "action": "handleParkFlowersClick()",
            "top": "68%",
            "left": "26%"
          }
        ]
      },
      {
        "id": "park_playground",
        "name": "Ігровий майданчик 🎪",
        "shortName": "🎪 Майданчик",
        "bg": "assets/locations/loc_park_playground.jpg",
        "desc": "Веселі гойдалки, гірка-спіраль, пісочниця та вежа",
        "hotspots": [
          {
            "id": "park_swings",
            "icon": "🎠",
            "text": "Гойдалки (+10 🪙)",
            "action": "handlePlaygroundSwingsClick()",
            "top": "56%",
            "left": "78%"
          },
          {
            "id": "park_tower",
            "icon": "🏰",
            "text": "Гірка-вежа",
            "action": "handlePlaygroundTowerClick()",
            "top": "50%",
            "left": "30%"
          }
        ]
      },
      {
        "id": "park_kiosks",
        "name": "Кіоски солодощів 🍭",
        "shortName": "🍭 Солодощі",
        "bg": "assets/locations/loc_park_kiosks.jpg",
        "desc": "Рожева солодка вата, італійське джелато та ягідні коктейлі",
        "hotspots": [
          {
            "id": "park_cotton",
            "icon": "🍥",
            "text": "Солодка вата (+10 🪙)",
            "action": "handleParkCottonCandyClick()",
            "top": "62%",
            "left": "32%"
          },
          {
            "id": "park_ice",
            "icon": "🍦",
            "text": "Gelato морозиво",
            "action": "handleParkGelatoClick()",
            "top": "62%",
            "left": "56%"
          }
        ]
      },
      {
        "id": "park_dogpark",
        "name": "Зона для собак 🐾",
        "shortName": "🐾 Зона собак",
        "bg": "assets/locations/loc_park_dogpark.jpg",
        "desc": "Аджиліті-кільця, тунель та тренувальна гірка для Бруно",
        "hotspots": [
          {
            "id": "park_hoop",
            "icon": "🐕",
            "text": "Стрибок у кільце (+12 🪙)",
            "action": "handleDogparkHoopClick()",
            "top": "50%",
            "left": "28%"
          },
          {
            "id": "park_water",
            "icon": "💧",
            "text": "Мисочка Бруно",
            "action": "handleDogparkWaterClick()",
            "top": "66%",
            "left": "60%"
          }
        ]
      }
    ]
  },
  "loc_mercadona": {
    "id": "loc_mercadona",
    "title": "Супермаркет «Mercadona» 🛒",
    "rooms": [
      {
        "id": "mercadona_overview",
        "name": "Mercadona • Головний зал 🛒",
        "shortName": "🛒 Головний зал",
        "bg": "assets/locations/loc_mercadona.jpg",
        "desc": "Головний вхід та широкі торгові зали супермаркету Mercadona",
        "hotspots": [
          {
            "id": "merc_cart",
            "icon": "🛒",
            "text": "Взяти візочок (+5 🪙)",
            "action": "handleMercCartClick()",
            "top": "60%",
            "left": "24%"
          },
          {
            "id": "merc_aisles",
            "icon": "🏪",
            "text": "Торговий зал Mercadona",
            "action": "handleMercAislesClick()",
            "top": "52%",
            "left": "75%"
          }
        ]
      },
      {
        "id": "mercadona_bakery",
        "name": "Торти та випічка 🥐",
        "shortName": "🥐 Випічка",
        "bg": "assets/locations/loc_mercadona_bakery.jpg",
        "desc": "Свіжа ароматна випічка, святкові торти, булочки та цукерки",
        "hotspots": [
          {
            "id": "merc_cake",
            "icon": "🎂",
            "text": "Святковий тортик (+10 🪙)",
            "action": "handleMercBakeryCakeClick()",
            "top": "58%",
            "left": "35%"
          },
          {
            "id": "merc_candy",
            "icon": "🥐",
            "text": "Свіжі круасани",
            "action": "handleMercBakeryCandyClick()",
            "top": "46%",
            "left": "70%"
          }
        ]
      },
      {
        "id": "mercadona_produce",
        "name": "Овочі та фрукти 🍊",
        "shortName": "🍊 Фрукти",
        "bg": "assets/locations/loc_mercadona_produce.jpg",
        "desc": "Валенсійські апельсини, персики, хрустке броколі та яблука",
        "hotspots": [
          {
            "id": "merc_oranges",
            "icon": "🍊",
            "text": "Апельсини Гандії (+10 🪙)",
            "action": "handleMercProduceOrangeClick()",
            "top": "48%",
            "left": "15%"
          },
          {
            "id": "merc_veggies",
            "icon": "🥦",
            "text": "Свіже броколі",
            "action": "handleMercProduceVeggiesClick()",
            "top": "66%",
            "left": "20%"
          }
        ]
      },
      {
        "id": "mercadona_meat",
        "name": "Ковбаси і м'ясо 🥩",
        "shortName": "🥩 М'ясо",
        "bg": "assets/locations/loc_mercadona_meat.jpg",
        "desc": "Іспанський хамон, смачні ковбаски та ласощі для песика Бруно",
        "hotspots": [
          {
            "id": "merc_jamon",
            "icon": "🥓",
            "text": "Іспанський хамон (+10 🪙)",
            "action": "handleMercMeatJamonClick()",
            "top": "48%",
            "left": "30%"
          },
          {
            "id": "merc_bone",
            "icon": "🦴",
            "text": "Кісточка Бруно",
            "action": "handleMercMeatBoneClick()",
            "top": "48%",
            "left": "75%"
          }
        ]
      },
      {
        "id": "mercadona_drinks",
        "name": "Вода та напої 💧",
        "shortName": "💧 Вода",
        "bg": "assets/locations/loc_mercadona_drinks.jpg",
        "desc": "Природна мінеральна вода, апельсинові соки та смузі",
        "hotspots": [
          {
            "id": "merc_water",
            "icon": "💧",
            "text": "Вода Font Vella (+8 🪙)",
            "action": "handleMercDrinksWaterClick()",
            "top": "50%",
            "left": "26%"
          },
          {
            "id": "merc_juice",
            "icon": "🧃",
            "text": "Апельсиновий фреш",
            "action": "handleMercDrinksJuiceClick()",
            "top": "52%",
            "left": "12%"
          }
        ]
      }
    ]
  },
  "loc_chachi": {
    "id": "loc_chachi",
    "title": "Кафе «Chachi Piruli» 🎈",
    "rooms": [
      {
        "id": "chachi_overview",
        "name": "Chachi Piruli • Головний зал 🎈",
        "shortName": "🎈 Головний зал",
        "bg": "assets/locations/loc_chachi.jpg",
        "desc": "Головний святковий зал та кафе-зона дитячого центру Chachi Piruli",
        "hotspots": [
          {
            "id": "chachi_party",
            "icon": "🎈",
            "text": "Святковий столик (+10 🪙)",
            "action": "handleChachiPartyClick()",
            "top": "55%",
            "left": "45%"
          },
          {
            "id": "chachi_welcome",
            "icon": "🎉",
            "text": "Зона привітання",
            "action": "handleChachiWelcomeClick()",
            "top": "38%",
            "left": "78%"
          }
        ]
      },
      {
        "id": "chachi_inflatable",
        "name": "Надувний батут 🏰",
        "shortName": "🏰 Батут",
        "bg": "assets/locations/loc_chachi_inflatable.jpg",
        "desc": "Гігантський надувний замок з батутами та м'якими вежами",
        "hotspots": [
          {
            "id": "chachi_bouncy",
            "icon": "🏰",
            "text": "Стрибати на батуті (+12 🪙)",
            "action": "handleChachiBouncyClick()",
            "top": "46%",
            "left": "50%"
          },
          {
            "id": "chachi_mat",
            "icon": "🎈",
            "text": "М'які вежі",
            "action": "handleChachiMatClick()",
            "top": "64%",
            "left": "30%"
          }
        ]
      },
      {
        "id": "chachi_climbing",
        "name": "Скеледром 🧗",
        "shortName": "🧗 Скеледром",
        "bg": "assets/locations/loc_chachi_climbing.jpg",
        "desc": "Стіна для скелелазіння з різнокольоровими зачіпками та м'яким матом",
        "hotspots": [
          {
            "id": "chachi_climb_wall",
            "icon": "🧗",
            "text": "Підкорити скеледром (+15 🪙)",
            "action": "handleChachiClimbClick()",
            "top": "42%",
            "left": "35%"
          },
          {
            "id": "chachi_helmet",
            "icon": "🛡️",
            "text": "Шолом безпеки",
            "action": "handleChachiHelmetClick()",
            "top": "68%",
            "left": "68%"
          }
        ]
      },
      {
        "id": "chachi_ballpit",
        "name": "Басейн з кульками 🔮",
        "shortName": "🔮 Басейн кульок",
        "bg": "assets/locations/loc_chachi_ballpit.jpg",
        "desc": "Басейн з 10 000 різнокольорових кульок та пластиковою гіркою",
        "hotspots": [
          {
            "id": "chachi_balls",
            "icon": "🔮",
            "text": "Пірнути в кульки (+15 🪙)",
            "action": "handleChachiBallpitClick()",
            "top": "58%",
            "left": "55%"
          },
          {
            "id": "chachi_slide",
            "icon": "🌀",
            "text": "Гірка в кульки",
            "action": "handleChachiSlideClick()",
            "top": "46%",
            "left": "28%"
          }
        ]
      },
      {
        "id": "chachi_arcade",
        "name": "Ігрові автомати 🕹️",
        "shortName": "🕹️ Автомати",
        "bg": "assets/locations/loc_chachi_arcade.jpg",
        "desc": "Аерохокей, хапайка з м'якими іграшками та дитячий баскетбол",
        "hotspots": [
          {
            "id": "chachi_hockey",
            "icon": "⚡",
            "text": "Аерохокей (+12 🪙)",
            "action": "handleChachiHockeyClick()",
            "top": "56%",
            "left": "26%"
          },
          {
            "id": "chachi_claw",
            "icon": "🧸",
            "text": "Хапайка з іграшками",
            "action": "handleChachiClawClick()",
            "top": "46%",
            "left": "56%"
          },
          {
            "id": "chachi_basket",
            "icon": "🏀",
            "text": "Баскетбол кідз",
            "action": "handleChachiBasketClick()",
            "top": "46%",
            "left": "82%"
          }
        ]
      }
    ]
  },
  "loc_petshop": {
    "id": "loc_petshop",
    "title": "Mascotas 🐾 (Зоомагазин & Спа)",
    "rooms": [
      {
        "id": "petshop_store",
        "name": "Магазин Іграшок та Смаколиків",
        "shortName": "Магазин",
        "bg": "assets/locations/loc_petshop_store.jpg",
        "desc": "Полички зі смаколиками, вітрина іграшок та великий сяючий акваріум з рибками",
        "hotspots": [
          {
            "id": "petshop_treats",
            "icon": "icon-treats",
            "text": "Смаколики для Бруно 🦴",
            "action": "feedPetTreat()",
            "cls": "hotspot-pet-treats",
            "top": "62%",
            "left": "25%"
          },
          {
            "id": "petshop_aquarium",
            "icon": "icon-fish",
            "text": "Погодувати золотих рибок 🐠",
            "action": "feedAquariumFish()",
            "cls": "hotspot-pet-aquarium",
            "top": "50%",
            "left": "78%"
          },
          {
            "id": "petshop_cashier",
            "icon": "icon-cashier",
            "text": "Каса та сканер покупок 🛒",
            "action": "ringPetCashier()",
            "cls": "hotspot-pet-cashier",
            "top": "68%",
            "left": "52%"
          }
        ]
      },
      {
        "id": "petshop_grooming",
        "name": "Грумінг-Спа Салон для Тварин",
        "shortName": "Грумінг",
        "bg": "assets/locations/loc_petshop_grooming.jpg",
        "desc": "Тепла ванна з ароматною піною для пухнастиків, фен-сушка та гребінці",
        "hotspots": [
          {
            "id": "petshop_bath",
            "icon": "icon-bath",
            "text": "Купати улюбленого цуцика 🛁",
            "action": "bathPetWithBubbles()",
            "cls": "hotspot-pet-bath",
            "top": "68%",
            "left": "22%"
          },
          {
            "id": "petshop_dryer",
            "icon": "icon-dryer",
            "text": "Фен-сушка та пухнастий гребінець 💨",
            "action": "dryPetFur()",
            "cls": "hotspot-pet-dryer",
            "top": "58%",
            "left": "58%"
          },
          {
            "id": "petshop_perfume",
            "icon": "icon-perfume",
            "text": "Ароматний спрей з ваніллю ✨",
            "action": "sprayPetPerfume()",
            "cls": "hotspot-pet-perfume",
            "top": "62%",
            "left": "85%"
          }
        ]
      },
      {
        "id": "petshop_playroom",
        "name": "Дитячий Садок та Ігрова Зона",
        "shortName": "Ігрова",
        "bg": "assets/locations/loc_petshop_playroom.jpg",
        "desc": "Дряпка-лазанка для котиків, тунелі для хом'ячків, м'які пуфи та басейн з кульками",
        "hotspots": [
          {
            "id": "petshop_cat_tree",
            "icon": "icon-cat-tree",
            "text": "Пограти з кошеням на вежі 🐱",
            "action": "playCatTree()",
            "cls": "hotspot-pet-cattree",
            "top": "55%",
            "left": "20%"
          },
          {
            "id": "petshop_ball_pit",
            "icon": "icon-ball-pit",
            "text": "Басейн з різнокольоровими кульками 🎾",
            "action": "jumpPetBallPit()",
            "cls": "hotspot-pet-ballpit",
            "top": "72%",
            "left": "55%"
          },
          {
            "id": "petshop_hamster_tunnel",
            "icon": "icon-hamster",
            "text": "Запустити хом'ячка у лабіринт 🐹",
            "action": "runHamsterTunnel()",
            "cls": "hotspot-pet-tunnel",
            "top": "48%",
            "left": "80%"
          }
        ]
      },
      {
        "id": "petshop_vet",
        "name": "Ветеринарна Клініка Доброти",
        "shortName": "Ветклініка",
        "bg": "assets/locations/loc_petshop_vet.jpg",
        "desc": "Оглядовий столик, ваги, вітамінки та світиться рентген лапок",
        "hotspots": [
          {
            "id": "petshop_checkup",
            "icon": "icon-stethoscope",
            "text": "Послухати серденько стетоскопом 🩺",
            "action": "vetStethoscopeCheck()",
            "cls": "hotspot-pet-checkup",
            "top": "65%",
            "left": "45%"
          },
          {
            "id": "petshop_scale",
            "icon": "icon-scale",
            "text": "Зважити пацієнта на вагах ⚖️",
            "action": "weighPetPatient()",
            "cls": "hotspot-pet-scale",
            "top": "72%",
            "left": "18%"
          },
          {
            "id": "petshop_xray",
            "icon": "icon-xray",
            "text": "Увімкнути рентген лапки 💡",
            "action": "togglePetXray()",
            "cls": "hotspot-pet-xray",
            "top": "45%",
            "left": "80%"
          }
        ]
      }
    ]
  },
  "loc_hotel": {
    "id": "loc_hotel",
    "title": "Готель Даніки «Danika Hotel»",
    "rooms": [
      {
        "id": "hotel_lobby",
        "name": "Гранд-Рецепція та Хол",
        "shortName": "Рецепція",
        "bg": "assets/locations/loc_hotel_empty_lobby.jpg",
        "desc": "Стійка консьєржа, золотий дзвінок, ключниця, ліфт та візок для багажу",
        "hotspots": [
          {
            "id": "hotel_bell",
            "icon": "icon-prop-bell",
            "text": "Золотий дзвінок консьєржа",
            "action": "ringHotelBell()",
            "cls": "hotspot-hotel-bell",
            "top": "58%",
            "left": "51%"
          },
          {
            "id": "hotel_elevator",
            "icon": "icon-elevator",
            "text": "Викликати ліфт",
            "action": "callHotelElevator()",
            "cls": "hotspot-hotel-elevator",
            "top": "62%",
            "left": "91%"
          },
          {
            "id": "hotel_luggage",
            "icon": "icon-luggage",
            "text": "Дорожні валізи",
            "action": "openHotelLuggage()",
            "cls": "hotspot-hotel-luggage",
            "top": "75%",
            "left": "9%"
          }
        ]
      },
      {
        "id": "hotel_suite",
        "name": "Королівський Люкс Даніки",
        "shortName": "Люкс",
        "bg": "assets/locations/loc_hotel_empty_suite.jpg",
        "desc": "Королівське ліжко з балдахіном, балкон з видом на море, джакузі та гардеробна",
        "hotspots": [
          {
            "id": "hotel_jacuzzi",
            "icon": "icon-jacuzzi",
            "text": "Тепле джакузі з піною",
            "action": "toggleHotelJacuzzi()",
            "cls": "hotspot-hotel-jacuzzi",
            "top": "70%",
            "left": "8%"
          },
          {
            "id": "hotel_vanity",
            "icon": "icon-vanity",
            "text": "Сяюче люстерко та парфуми",
            "action": "useHotelVanity()",
            "cls": "hotspot-hotel-vanity",
            "top": "68%",
            "left": "79%"
          },
          {
            "id": "hotel_room_service",
            "icon": "icon-room-service",
            "text": "Сніданок у номер",
            "action": "orderHotelRoomService()",
            "cls": "hotspot-hotel-service",
            "top": "62%",
            "left": "57%"
          }
        ]
      },
      {
        "id": "hotel_cafe",
        "name": "Кафе-Кондитерська та Буфет",
        "shortName": "Кафе",
        "bg": "assets/locations/loc_hotel_empty_cafe.jpg",
        "desc": "Французька випічка, вітрина з круасанами, ягідні смузі та затишні столики",
        "hotspots": [
          {
            "id": "hotel_bakery_case",
            "icon": "icon-bakery",
            "text": "Свіжі круасани та макаруни",
            "action": "openHotelBakery()",
            "cls": "hotspot-hotel-bakery",
            "top": "70%",
            "left": "28%"
          },
          {
            "id": "hotel_juice_bar",
            "icon": "icon-juice-bar",
            "text": "Апельсиновий фреш",
            "action": "pourHotelJuice()",
            "cls": "hotspot-hotel-juice",
            "top": "46%",
            "left": "40%"
          },
          {
            "id": "hotel_coffee_machine",
            "icon": "icon-coffee",
            "text": "Какао з вершками",
            "action": "makeHotelCocoa()",
            "cls": "hotspot-hotel-coffee",
            "top": "48%",
            "left": "11%"
          }
        ]
      },
      {
        "id": "hotel_rooftop",
        "name": "Басейн та Спа на Даху",
        "shortName": "Басейн",
        "bg": "assets/locations/loc_hotel_empty_rooftop.jpg",
        "desc": "Басейн з фламінго, шезлонги, сонячні парасольки, коктейль-бар та захід сонця",
        "hotspots": [
          {
            "id": "hotel_pool_splash",
            "icon": "icon-pool",
            "text": "Стрибнути у басейн на фламінго",
            "action": "splashHotelPool()",
            "cls": "hotspot-hotel-pool",
            "top": "62%",
            "left": "55%"
          },
          {
            "id": "hotel_tiki_bar",
            "icon": "icon-tiki-bar",
            "text": "Тропічний коктейль",
            "action": "orderHotelCocktail()",
            "cls": "hotspot-hotel-tiki",
            "top": "62%",
            "left": "86%"
          },
          {
            "id": "hotel_music_speaker",
            "icon": "icon-music",
            "text": "Музика вечірки на даху",
            "action": "toggleHotelMusic()",
            "cls": "hotspot-hotel-music",
            "top": "50%",
            "left": "11%"
          }
        ]
      }
    ]
  },
  "loc_academy": {
    "id": "loc_academy",
    "title": "Академія Чемпіонки «Hero Academy» 🌟",
    "rooms": [
      {
        "id": "academy_runway",
        "name": "Модний Подіум та Студія Стилю",
        "shortName": "Подіум",
        "bg": "assets/locations/loc_academy_runway.jpg",
        "desc": "Гламурний подіум зі спалахами софітів, гримерна кімната та гардеробна зірки",
        "hotspots": [
          {
            "id": "academy_runway_show",
            "icon": "icon-wardrobe",
            "text": "Почати Модний Показ! 🌟",
            "action": "startRunwayFashionShow()",
            "cls": "hotspot-runway-show",
            "top": "68%",
            "left": "50%"
          },
          {
            "id": "academy_wardrobe_rack",
            "icon": "icon-prop-wardrobe",
            "text": "Приміряти новий образ 👗",
            "action": "openWardrobeModal()",
            "cls": "hotspot-runway-wardrobe",
            "top": "60%",
            "left": "14%"
          },
          {
            "id": "academy_spotlight_switch",
            "icon": "icon-magic-wand",
            "text": "Магія софітів та конфеті ✨",
            "action": "triggerRunwaySparkles()",
            "cls": "hotspot-runway-lights",
            "top": "36%",
            "left": "84%"
          }
        ]
      },
      {
        "id": "academy_gym",
        "name": "Фітнес-Додзьо та Танцювальний Зал",
        "shortName": "Додзьо",
        "bg": "assets/locations/loc_academy_gym.jpg",
        "desc": "Танцювальний верстат з дзеркалами, батути для рекордів та боксерська груша",
        "hotspots": [
          {
            "id": "academy_gym_workout",
            "icon": "icon-sneaker-sport",
            "text": "Тренування Чемпіонки з Бруно! 🤸",
            "action": "startDojoWorkout()",
            "cls": "hotspot-gym-workout",
            "top": "70%",
            "left": "74%"
          },
          {
            "id": "academy_trampoline",
            "icon": "icon-ball",
            "text": "Стрибки на батуті 🦘",
            "action": "jumpOnTrampoline()",
            "cls": "hotspot-gym-trampoline",
            "top": "72%",
            "left": "28%"
          },
          {
            "id": "academy_punch_bag",
            "icon": "icon-prop-ball",
            "text": "Груша 'Punch & Play' 🥊",
            "action": "punchSpeedBag()",
            "cls": "hotspot-gym-punch",
            "top": "46%",
            "left": "61%"
          }
        ]
      },
      {
        "id": "academy_puzzles",
        "name": "Лабораторія Розуму та Головоломок",
        "shortName": "Головоломки",
        "bg": "assets/locations/loc_academy_puzzles.jpg",
        "desc": "Голографічний стіл із загадками, квести на кмітливість та чарівний кристал",
        "hotspots": [
          {
            "id": "academy_puzzle_table",
            "icon": "icon-backpack",
            "text": "Голографічний Стіл Загадок 🧩",
            "action": "openBrainPuzzleModal()",
            "cls": "hotspot-puzzle-table",
            "top": "72%",
            "left": "42%"
          },
          {
            "id": "academy_robo_bot",
            "icon": "icon-prop-camera",
            "text": "Робо-Друг 'Біп-Біп' 🤖",
            "action": "interactWithRoboHelper()",
            "cls": "hotspot-puzzle-robot",
            "top": "75%",
            "left": "83%"
          },
          {
            "id": "academy_wisdom_crystal",
            "icon": "icon-crystal",
            "text": "Кристал Розуму та Енергії 💎",
            "action": "touchMagicCrystal()",
            "cls": "hotspot-puzzle-crystal",
            "top": "42%",
            "left": "65%"
          }
        ]
      },
      {
        "id": "academy_fame",
        "name": "Зала Слави та Чемпіонські Кубки",
        "shortName": "Кубки",
        "bg": "assets/locations/loc_academy_fame.jpg",
        "desc": "Золотий п'єдестал переможниці, сяючі медалі та вітрина рекордів Даніки",
        "hotspots": [
          {
            "id": "academy_fame_podium",
            "icon": "icon-cup",
            "text": "Зійти на 1 місце п'єдесталу! 🏆",
            "action": "celebrateOnPodium()",
            "cls": "hotspot-fame-podium",
            "top": "70%",
            "left": "51%"
          },
          {
            "id": "academy_trophy_case",
            "icon": "icon-trophy",
            "text": "Оглянути свої золоті кубки 🥇",
            "action": "inspectTrophies()",
            "cls": "hotspot-fame-trophy",
            "top": "48%",
            "left": "19%"
          },
          {
            "id": "academy_confetti_canon",
            "icon": "icon-theater-masks",
            "text": "Святковий салют Чемпіонки 🎆",
            "action": "fireChampionConfetti()",
            "cls": "hotspot-fame-fireworks",
            "top": "36%",
            "left": "82%"
          }
        ]
      }
    ]
  },
  "loc_salon": {
    "id": "loc_salon",
    "title": "Чарівний Салон Краси та Pet Spa 🐾",
    "rooms": [
      {
        "id": "salon_hair",
        "name": "Студія Стильних Зачісок",
        "shortName": "Зачіски",
        "bg": "assets/locations/loc_salon_hair.jpg",
        "desc": "Крісла стилістів, ароматні шампуні, мийка для волосся та дзеркала з підсвіткою",
        "hotspots": [
          {
            "id": "salon_hair_chair",
            "icon": "icon-vanity",
            "text": "Крісло стиліста: нова укладка 💇‍♀️",
            "action": "styleHairChair()",
            "cls": "hotspot-salon-chair",
            "top": "68%",
            "left": "38%"
          },
          {
            "id": "salon_wash_basin",
            "icon": "icon-jacuzzi",
            "text": "Мийка з ароматною піною 🫧",
            "action": "washHairStation()",
            "cls": "hotspot-salon-wash",
            "top": "72%",
            "left": "74%"
          },
          {
            "id": "salon_perfume_shelf",
            "icon": "icon-prop-perfume",
            "text": "Парфуми 'Веселкова Троянда' 🌸",
            "action": "applyPerfumeSpray()",
            "cls": "hotspot-salon-perfume",
            "top": "38%",
            "left": "83%"
          }
        ]
      },
      {
        "id": "salon_pet_spa",
        "name": "Спа-Салон для Улюбленця Бруно",
        "shortName": "Pet Spa",
        "bg": "assets/locations/loc_salon_pet_spa.jpg",
        "desc": "Тепла ванночка з бульбашками для песика, пухнастий рушник та смачні ласощі",
        "hotspots": [
          {
            "id": "salon_pet_tub",
            "icon": "icon-prop-duck",
            "text": "Купання Бруно у бульбашках 🛁",
            "action": "groomBrunoBath()",
            "cls": "hotspot-pet-bath",
            "top": "66%",
            "left": "33%"
          },
          {
            "id": "salon_pet_groomer",
            "icon": "icon-prop-bone",
            "text": "Розчісування шерстки та бантик 🎀",
            "action": "dryAndBrushBruno()",
            "cls": "hotspot-pet-groom",
            "top": "68%",
            "left": "77%"
          },
          {
            "id": "salon_pet_treats",
            "icon": "icon-prop-dogfood",
            "text": "Пригостити Бруно кісточкою 🦴",
            "action": "givePetTreat()",
            "cls": "hotspot-pet-treat",
            "top": "84%",
            "left": "63%"
          }
        ]
      },
      {
        "id": "salon_nails",
        "name": "Манікюрний Бар 'Little Glam'",
        "shortName": "Манікюр",
        "bg": "assets/locations/loc_salon_nails.jpg",
        "desc": "Веселкова палітра лаків з блискітками, чарівна UV-лампа та подушечки для рук",
        "hotspots": [
          {
            "id": "salon_nail_manicure",
            "icon": "icon-prop-lollipop",
            "text": "Манікюр з райдужними блискітками 💅",
            "action": "doGlitterManicure()",
            "cls": "hotspot-nail-bar",
            "top": "70%",
            "left": "47%"
          },
          {
            "id": "salon_nail_lamp",
            "icon": "icon-magic-wand",
            "text": "Чарівна UV-лампа для сяйва ✨",
            "action": "uvGelLamp()",
            "cls": "hotspot-nail-lamp",
            "top": "72%",
            "left": "21%"
          },
          {
            "id": "salon_nail_rings",
            "icon": "icon-gem",
            "text": "Скринька з каблучками 💍",
            "action": "chooseHandRing()",
            "cls": "hotspot-nail-rings",
            "top": "40%",
            "left": "27%"
          }
        ]
      },
      {
        "id": "salon_photobooth",
        "name": "Неонова VIP Фотозона",
        "shortName": "Фотозона",
        "bg": "assets/locations/loc_salon_photobooth.jpg",
        "desc": "Крила янгола з неону, зіркове кільцеве світло, веселі окуляри та фото на пам'ять",
        "hotspots": [
          {
            "id": "salon_neon_wings",
            "icon": "icon-magic-wand",
            "text": "Позувати біля неонових крил 🪽",
            "action": "poseWithNeonWings()",
            "cls": "hotspot-photo-wings",
            "top": "46%",
            "left": "24%"
          },
          {
            "id": "salon_photo_props",
            "icon": "icon-theater-masks",
            "text": "Зіркові окуляри та корона 🕶️",
            "action": "tryFunPhotoProps()",
            "cls": "hotspot-photo-props",
            "top": "60%",
            "left": "66%"
          },
          {
            "id": "salon_photo_snap",
            "icon": "icon-prop-camera",
            "text": "Миттєве VIP-фото зі спалахом 📸",
            "action": "snapVipPhoto()",
            "cls": "hotspot-photo-snap",
            "top": "54%",
            "left": "46%"
          }
        ]
      }
    ]
  }
},

  levels: [
    { level: 1, title: "Новачок 🐾", minXp: 0, maxXp: 300 },
    { level: 2, title: "Помічниця 🧹", minXp: 300, maxXp: 650 },
    { level: 3, title: "Мандрівниця 🎒", minXp: 650, maxXp: 1050 },
    { level: 4, title: "Шукачка Скарбів 🧭", minXp: 1050, maxXp: 1500 },
    { level: 5, title: "Капітанка ⛵", minXp: 1500, maxXp: 2000 },
    { level: 6, title: "Розумниця 📚", minXp: 2000, maxXp: 2600 },
    { level: 7, title: "Чемпіонка 🏃‍♀️", minXp: 2600, maxXp: 3300 },
    { level: 8, title: "Майстриня 🎨", minXp: 3300, maxXp: 4100 },
    { level: 9, title: "Супер-Геройка ⚡", minXp: 4100, maxXp: 5000 },
    { level: 10, title: "Королева Острова 👑", minXp: 5000, maxXp: 99999 }
  ],

  // =========================================================
  // ГАРДЕРОБНА (20 ОДЯГУ, 20 АКСЕСУАРІВ, 4 БРУНО, ДЕКОР)
  // =========================================================
  wardrobe: {
    // 20 варіантів одягу (на картках ТІЛЬКИ сам одяг на вішалці!)
    danikaOutfits: [
      {
        id: "danika_abece",
        title: "Форма Colegio Abecé 🏫",
        desc: "Офіційна шкільна форма з емблемою Colegio Abecé та шортами",
        tileIcon: "assets/wardrobe/outfit_danika_abece.png?v=20261005_5",
        img: "assets/characters/danika_danika_abece.png?v=20261005_5",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_casual",
        title: "Сонячний День ☀️",
        desc: "Жовта футболка з усміхненим сонечком та джинсові шорти",
        tileIcon: "assets/wardrobe/outfit_danika_casual.png",
        img: "assets/characters/danika_danika_casual.png",
        cost: 80,
        costXp: 405,
        costEnergy: 160,
        unlocked: false
      },
      {
        id: "danika_skater",
        title: "Скейт-Парк 🛹",
        desc: "Бірюзове худі з блискавкою та скейтерські легінси",
        tileIcon: "assets/wardrobe/outfit_danika_skater.png",
        img: "assets/characters/danika_danika_skater.png",
        cost: 100,
        costXp: 495,
        costEnergy: 200,
        unlocked: false
      },
      {
        id: "danika_pajama",
        title: "Затишна Піжамка 🌙",
        desc: "Лавандова піжамка зі сплячим місяцем та капцями-зірочками",
        tileIcon: "assets/wardrobe/outfit_danika_pajama.png",
        img: "assets/characters/danika_danika_pajama.png",
        cost: 80,
        costXp: 405,
        costEnergy: 160,
        unlocked: false
      },
      {
        id: "danika_morning_undies",
        title: "Ранковий Настрій ☀️",
        desc: "Ніжна бавовняна маєчка та шортики з сердечками після сну",
        tileIcon: "assets/wardrobe/outfit_danika_morning_undies.png",
        img: "assets/characters/danika_danika_morning_undies.png",
        cost: 75,
        costXp: 380,
        costEnergy: 155,
        unlocked: false
      },
      {
        id: "danika_spa_towel",
        title: "Спа-Релакс 🧖‍♀️",
        desc: "Махровий халатик, рушник на голові та огірочки на оченятах",
        tileIcon: "assets/wardrobe/outfit_danika_spa_towel.png",
        img: "assets/characters/danika_danika_spa_towel.png",
        cost: 100,
        costXp: 495,
        costEnergy: 200,
        unlocked: false
      },
      {
        id: "danika_princess",
        title: "Казкова Принцеса 👑",
        desc: "Пишна рожева сукня з фатину з золотими зірками та пояском",
        tileIcon: "assets/wardrobe/outfit_danika_princess.png",
        img: "assets/characters/danika_danika_princess.png",
        cost: 250,
        costXp: 1260,
        costEnergy: 505,
        unlocked: false
      },
      {
        id: "danika_safari",
        title: "Мандрівниця Сафарі 🧭",
        desc: "Бежевий жилет дослідника з кишенями та шорти кольору хакі",
        tileIcon: "assets/wardrobe/outfit_danika_safari.png",
        img: "assets/characters/danika_danika_safari.png",
        cost: 105,
        costXp: 520,
        costEnergy: 205,
        unlocked: false
      },
      {
        id: "danika_beach",
        title: "Пляжний Сарафан 🏖️",
        desc: "Яскравий смугастий сарафан для прогулянок набережною Гандії",
        tileIcon: "assets/wardrobe/outfit_danika_beach.png",
        img: "assets/characters/danika_danika_beach.png",
        cost: 120,
        costXp: 610,
        costEnergy: 245,
        unlocked: false
      },
      {
        id: "danika_artist",
        title: "Маленька Художниця 🎨",
        desc: "Джинсовий комбінезончик з райдужними плямками фарби",
        tileIcon: "assets/wardrobe/outfit_danika_artist.png",
        img: "assets/characters/danika_danika_artist.png",
        cost: 120,
        costXp: 610,
        costEnergy: 245,
        unlocked: false
      },
      {
        id: "danika_sport",
        title: "Гімнастика / Cheer 🏃‍♀️",
        desc: "Спортивний комплект з плисованої спіднички та топу з зіркою",
        tileIcon: "assets/wardrobe/outfit_danika_sport.png",
        img: "assets/characters/danika_danika_sport.png",
        cost: 125,
        costXp: 630,
        costEnergy: 250,
        unlocked: false
      },
      {
        id: "danika_raincoat",
        title: "Жовтий Дощовик 🌧️",
        desc: "Яскраво-жовтий плащик з капюшоном та червоні чобітки для калюж",
        tileIcon: "assets/wardrobe/outfit_danika_raincoat.png",
        img: "assets/characters/danika_danika_raincoat.png",
        cost: 145,
        costXp: 720,
        costEnergy: 290,
        unlocked: false
      },
      {
        id: "danika_cat_hoodie",
        title: "Пухнасте Кото-худі 🐱",
        desc: "Ніжно-рожеве флісове худі з котячою мордочкою та вушками",
        tileIcon: "assets/wardrobe/outfit_danika_cat_hoodie.png",
        img: "assets/characters/danika_danika_cat_hoodie.png",
        cost: 150,
        costXp: 740,
        costEnergy: 295,
        unlocked: false
      },
      {
        id: "danika_denim",
        title: "Джинсовий Сарафан 👖",
        desc: "Класичний синій джинсовий сарафанчик та смугаста футболка",
        tileIcon: "assets/wardrobe/outfit_danika_denim.png",
        img: "assets/characters/danika_danika_denim.png",
        cost: 150,
        costXp: 740,
        costEnergy: 295,
        unlocked: false
      },
      {
        id: "danika_astronaut",
        title: "Юна Космонавтка 🚀",
        desc: "Сріблястий космічний комбінезон з нашивками міжзоряних місій",
        tileIcon: "assets/wardrobe/outfit_danika_astronaut.png",
        img: "assets/characters/danika_danika_astronaut.png",
        cost: 305,
        costXp: 1530,
        costEnergy: 610,
        unlocked: false
      },
      {
        id: "danika_winter",
        title: "Зимовий Светрик ❄️",
        desc: "Теплий червоний в'язаний светр зі сніжинками та вельветові штанці",
        tileIcon: "assets/wardrobe/outfit_danika_winter.png",
        img: "assets/characters/danika_danika_winter.png",
        cost: 160,
        costXp: 810,
        costEnergy: 325,
        unlocked: false
      },
      {
        id: "danika_trench",
        title: "Осінній Тренч 🍂",
        desc: "Елегантний бежевий дитячий тренч з поясом та картатим шарфиком",
        tileIcon: "assets/wardrobe/outfit_danika_trench.png",
        img: "assets/characters/danika_danika_trench.png",
        cost: 215,
        costXp: 1080,
        costEnergy: 430,
        unlocked: false
      },
      {
        id: "danika_flamenco",
        title: "Іспанська Фієста 💃",
        desc: "Традиційна червона сукня фламенко з воланами у білий горошок",
        tileIcon: "assets/wardrobe/outfit_danika_flamenco.png",
        img: "assets/characters/danika_danika_flamenco.png",
        cost: 225,
        costXp: 1125,
        costEnergy: 450,
        unlocked: false
      },
      {
        id: "danika_mermaid",
        title: "Морська Русалонька 🧜‍♀️",
        desc: "Чарівна сукня з переливчастою бірюзовою лускою та воланами",
        tileIcon: "assets/wardrobe/outfit_danika_mermaid.png",
        img: "assets/characters/danika_danika_mermaid.png",
        cost: 315,
        costXp: 1575,
        costEnergy: 630,
        unlocked: false
      },
      {
        id: "danika_gala",
        title: "Золотий Бал ✨",
        desc: "Розкішна золота бальна сукня кольору шампанського з блискітками",
        tileIcon: "assets/wardrobe/outfit_danika_gala.png",
        img: "assets/characters/danika_danika_gala.png",
        cost: 325,
        costXp: 1620,
        costEnergy: 650,
        unlocked: false
      },
      {
        id: "danika_varsity",
        title: "Коледж-Стиль 🎓",
        desc: "Куртка-бомбер з літерою «D» та тенісна спідничка",
        tileIcon: "assets/wardrobe/outfit_danika_varsity.png",
        img: "assets/characters/danika_danika_varsity.png",
        cost: 165,
        costXp: 830,
        costEnergy: 335,
        unlocked: false
      },
      {
        id: "danika_daisy",
        title: "Весняні Ромашки 🌼",
        desc: "М'ятна легка сукня з білими ромашками та мереживом",
        tileIcon: "assets/wardrobe/outfit_danika_daisy.png",
        img: "assets/characters/danika_danika_daisy.png",
        cost: 165,
        costXp: 830,
        costEnergy: 335,
        unlocked: false
      },
      {
        id: "danika_fairy",
        title: "Фея Квітів 🌸",
        desc: "Казкова багатошарова сукня з ніжними пелюстками та мереживом",
        tileIcon: "assets/wardrobe/outfit_danika_fairy.png",
        img: "assets/characters/danika_danika_fairy.png",
        cost: 340,
        costXp: 1710,
        costEnergy: 685,
        unlocked: false
      },
      // --- НОВА МОДНА КОЛЕКЦІЯ: СПОРТИВНИЙ КОСТЮМ, 4 ХУДІ ТА 3 ДЖИНСОВІ ОБРАЗИ ---
      {
        id: "danika_tracksuit_modern",
        title: "Спорт-Шик «Лаванда-М'ята» 🏃‍♀️",
        desc: "Сучасний модний спортивний костюм на блискавці з лавандовими лампасами та джогерами",
        tileIcon: "assets/wardrobe/outfit_danika_tracksuit_modern.png?v=20261005_3",
        img: "assets/characters/danika_tracksuit_modern.png?v=20261005_3",
        cost: 145,
        costXp: 720,
        costEnergy: 290,
        unlocked: false
      },
      {
        id: "danika_hoodie_unicorn",
        title: "Худі «Райдужний Єдиноріг» 🦄",
        desc: "Модне оверсайз тай-дай худі з єдинорогом та стильні спортивні шортики",
        tileIcon: "assets/wardrobe/outfit_danika_hoodie_unicorn.png?v=20261005_3",
        img: "assets/characters/danika_hoodie_unicorn.png?v=20261005_3",
        cost: 160,
        costXp: 790,
        costEnergy: 315,
        unlocked: false
      },
      {
        id: "danika_hoodie_space",
        title: "Худі «Космічна Галактика» 🪐",
        desc: "Неонове галактичне худі з планетою Сатурн та темні карго-джогери",
        tileIcon: "assets/wardrobe/outfit_danika_hoodie_space.png?v=20261005_3",
        img: "assets/characters/danika_hoodie_space.png?v=20261005_3",
        cost: 165,
        costXp: 830,
        costEnergy: 335,
        unlocked: false
      },
      {
        id: "danika_hoodie_music",
        title: "Худі «Музичний Біт» 🎧",
        desc: "Яскраве коралово-жовте колор-блок худі з навушниками та рожеві штанці",
        tileIcon: "assets/wardrobe/outfit_danika_hoodie_music.png?v=20261005_3",
        img: "assets/characters/danika_hoodie_music.png?v=20261005_3",
        cost: 165,
        costXp: 830,
        costEnergy: 335,
        unlocked: false
      },
      {
        id: "danika_hoodie_mint_bear",
        title: "М'ятне Худі з Вушками 🍵🐱",
        desc: "Ніжне м'ятно-бірюзове пухнасте худі з капюшоном і вушками та м'які шортики",
        tileIcon: "assets/wardrobe/outfit_danika_hoodie_mint_bear.png?v=20261005_3",
        img: "assets/characters/danika_hoodie_mint_bear.png?v=20261005_3",
        cost: 160,
        costXp: 790,
        costEnergy: 315,
        unlocked: false
      },
      {
        id: "danika_denim_jacket_set",
        title: "Джинсовий Бомбер & Спідниця 👖⭐",
        desc: "Стильна куртка з синього деніму зі світлими рукавами та джинсова плісирована спідничка",
        tileIcon: "assets/wardrobe/outfit_danika_denim_jacket_set.png?v=20261005_3",
        img: "assets/characters/danika_denim_jacket_set.png?v=20261005_3",
        cost: 175,
        costXp: 880,
        costEnergy: 350,
        unlocked: false
      },
      {
        id: "danika_denim_overalls",
        title: "Джинсовий Комбінезон «Лаванда» 💜👖",
        desc: "Модний лавандово-індиго джинсовий комбінезон з яскравим лонгслівом",
        tileIcon: "assets/wardrobe/outfit_danika_denim_overalls.png?v=20261005_3",
        img: "assets/characters/danika_denim_overalls.png?v=20261005_3",
        cost: 190,
        costXp: 945,
        costEnergy: 380,
        unlocked: false
      },
      {
        id: "danika_denim_skirt_vest",
        title: "Джинсовий Комплект «Морський Бриз» 🌊👖",
        desc: "Світло-блакитний літній джинсовий сарафан на ґудзиках із м'ятною смугастою футболкою",
        tileIcon: "assets/wardrobe/outfit_danika_denim_skirt_vest.png?v=20261005_3",
        img: "assets/characters/danika_denim_skirt_vest.png?v=20261005_3",
        cost: 175,
        costXp: 880,
        costEnergy: 350,
        unlocked: false
      }
    ,
      {
        id: "danika_street_leather_biker",
        title: "Шкіряна косуха Street Rock 🎸",
        desc: "Оверсайз косуха з металевими замками, срібний ланцюг, вільні джинси Wide-Leg та масивні кеди",
        tileIcon: "assets/wardrobe/outfit_street_leather_biker.png",
        img: "assets/characters/danika_street_leather_biker.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_camel_flannel",
        title: "Замшевий кемел & фланель 🍂",
        desc: "Тепла замшева куртка з хутряним комірцем, картата сорочка на поясі, шоколадні карго та шапка-біні",
        tileIcon: "assets/wardrobe/outfit_street_camel_flannel.png",
        img: "assets/characters/danika_street_camel_flannel.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_white_parachute",
        title: "Білі парашути & навушники 🎧",
        desc: "Стильні білі парашутні штани з затяжками, чорний стріт-топ, студійні навушники на шиї та кеди на платформі",
        tileIcon: "assets/wardrobe/outfit_street_white_parachute.png",
        img: "assets/characters/danika_street_white_parachute.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_black_techwear",
        title: "Total Black Techwear 🖤",
        desc: "Тактичні чорні карго зі стропами, стильне темне худі з карабінами та чорна кепка",
        tileIcon: "assets/wardrobe/outfit_street_black_techwear.png",
        img: "assets/characters/danika_street_black_techwear.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_varsity_seawater",
        title: "Оверсайз худі SEAWATER 🌊",
        desc: "Молодіжне колор-блок худі у стилі SEAWATER, графітові вільні джогери та баскетбольні кросівки",
        tileIcon: "assets/wardrobe/outfit_street_varsity_seawater.png",
        img: "assets/characters/danika_street_varsity_seawater.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_vanilla_jogger",
        title: "Ванільне двоколірне худі 🍦",
        desc: "Затишне ванільно-бежеве худі, молочні спортивні штани оверсайз, кепка козирком назад",
        tileIcon: "assets/wardrobe/outfit_street_vanilla_jogger.png",
        img: "assets/characters/danika_street_vanilla_jogger.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_denim_bomber",
        title: "Вінтажний джинсовий бомбер 🏙️",
        desc: "Джинсова куртка-бомбер 'варенка', біла подовжена футболка, джинси баггі з підворотами",
        tileIcon: "assets/wardrobe/outfit_street_denim_bomber.png",
        img: "assets/characters/danika_street_denim_bomber.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_mint_cargo",
        title: "М'ятний світшот & Bucket Hat 🌿",
        desc: "Свіжий м'ятний світшот оверсайз, світло-сірі карго-штани з кишенями та панамка-відерце",
        tileIcon: "assets/wardrobe/outfit_street_mint_cargo.png",
        img: "assets/characters/danika_street_mint_cargo.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_lavender_puffer",
        title: "Лавандовий кроп-пуховик 💜",
        desc: "Ультрамодний дутий вкорочений пуховик кольору лаванди, білі джогери та хутряні навушники",
        tileIcon: "assets/wardrobe/outfit_street_lavender_puffer.png",
        img: "assets/characters/danika_street_lavender_puffer.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_cyber_y2k",
        title: "Срібний металік Y2K ⚡",
        desc: "Футуристична хромована куртка, темні широкі штани, неонові акценти та кібер-окуляри",
        tileIcon: "assets/wardrobe/outfit_street_cyber_y2k.png",
        img: "assets/characters/danika_street_cyber_y2k.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_graphite_vest",
        title: "Графітовий дутий жилет 🏙️",
        desc: "Масивний пуховий жилет поверх чорного худі, чорна кепка з вишивкою та вільні джинси",
        tileIcon: "assets/wardrobe/outfit_street_graphite_vest.png",
        img: "assets/characters/danika_street_graphite_vest.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_retro_tracksuit",
        title: "Ретро-костюм Windbreaker 90s 📼",
        desc: "Культовий вітрівковий костюм колор-блок: бірюзовий, фіолетовий та білий з блискавкою",
        tileIcon: "assets/wardrobe/outfit_street_retro_tracksuit.png",
        img: "assets/characters/danika_street_retro_tracksuit.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_sage_hoodie",
        title: "Худі кольору шавлії & Палаццо 🍵",
        desc: "Широкі вільні штани палаццо кремового відтінку та ніжне оверсайз худі кольору полину",
        tileIcon: "assets/wardrobe/outfit_street_sage_hoodie.png",
        img: "assets/characters/danika_street_sage_hoodie.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_mocha_blazer",
        title: "Оверсайз блейзер Мокко ☕",
        desc: "Модний жакет вільного крою кольору мокко, білий топ, класичні прямі джинси та лофери",
        tileIcon: "assets/wardrobe/outfit_street_mocha_blazer.png",
        img: "assets/characters/danika_street_mocha_blazer.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_coral_windbreaker",
        title: "Кораловий анорак Street Sport 🦩",
        desc: "Яскравий кораловий анорак з великою нагрудною кишенею, велошорти, високі гетри та снікери",
        tileIcon: "assets/wardrobe/outfit_street_coral_windbreaker.png",
        img: "assets/characters/danika_street_coral_windbreaker.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_pink_bomber",
        title: "Рожевий бомбер Varsity 'D' 💖",
        desc: "Університетський рожевий бомбер з літерою Даніки 'D', білі карго-штани та рожеві кеди",
        tileIcon: "assets/wardrobe/outfit_street_pink_bomber.png",
        img: "assets/characters/danika_street_pink_bomber.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_college_green",
        title: "Смарагдовий коледж-світшот 🎓",
        desc: "Глибокий смарагдовий світшот з вінтажним гербом, плісирована спідниця з легінсами",
        tileIcon: "assets/wardrobe/outfit_street_college_green.png",
        img: "assets/characters/danika_street_college_green.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_skater_grunge",
        title: "Гранж сорочка в клітинку 🛹",
        desc: "Вільна фланелева сорочка в червоно-чорну клітинку, темна футболка з принтом, рвані широкі джинси",
        tileIcon: "assets/wardrobe/outfit_street_skater_grunge.png",
        img: "assets/characters/danika_street_skater_grunge.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_utility_beige",
        title: "Пісочний Utility Jumpsuit ⛺",
        desc: "Сучасний комбінезон вільного крою пісочного кольору з ременем-стропою, пряжками та кишенями",
        tileIcon: "assets/wardrobe/outfit_street_utility_beige.png",
        img: "assets/characters/danika_street_utility_beige.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      },
      {
        id: "danika_street_graffiti_hoodie",
        title: "Графіті худі Street Art 🎨",
        desc: "Біле худі з яскравими неоновими бризками фарби та написами, чорні парашутні штани",
        tileIcon: "assets/wardrobe/outfit_street_graffiti_hoodie.png",
        img: "assets/characters/danika_street_graffiti_hoodie.png",
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        unlocked: true
      }
    ],

    // 20 Ілюстрованих Аксесуарів (2D Game Art замість емодзі)
    danikaAccessories: [
      { id: "acc_none", title: "Без аксесуара", icon: "assets/accessories/acc_star_clips.png", cost: 0, costXp: 0, costEnergy: 0, unlocked: true },
      { id: "acc_bow_headband", title: "Обруч з Бантиком 🎀", icon: "assets/accessories/acc_bow_headband.png", cost: 45, costXp: 225, costEnergy: 90, unlocked: false },
      { id: "acc_glasses_heart", title: "Рожеві Окуляри 🕶️", icon: "assets/accessories/acc_glasses_heart.png", cost: 60, costXp: 290, costEnergy: 115, unlocked: false },
      { id: "acc_skater_helmet", title: "Скейт-Шолом 🛹", icon: "assets/accessories/acc_skater_helmet.png", cost: 75, costXp: 380, costEnergy: 155, unlocked: false },
      { id: "acc_crown", title: "Золота Корона 👑", icon: "assets/accessories/acc_crown.png", cost: 145, costXp: 720, costEnergy: 290, unlocked: false },
      { id: "acc_flower_wreath", title: "Квітковий Віночок 🌸", icon: "assets/accessories/acc_flower_wreath.png", cost: 70, costXp: 340, costEnergy: 135, unlocked: false },
      { id: "acc_headphones", title: "Геймерські Навушники 🎧", icon: "assets/accessories/acc_headphones.png", cost: 100, costXp: 495, costEnergy: 200, unlocked: false },
      { id: "acc_star_wand", title: "Зіркова Паличка ⭐", icon: "assets/accessories/acc_star_wand.png", cost: 85, costXp: 430, costEnergy: 170, unlocked: false },
      { id: "acc_panama_hat", title: "Панамка Gandia 👒", icon: "assets/accessories/acc_panama_hat.png", cost: 70, costXp: 340, costEnergy: 135, unlocked: false },
      { id: "acc_pirate_bandana", title: "Бандана Капітанки 🏴‍☠️", icon: "assets/accessories/acc_pirate_bandana.png", cost: 70, costXp: 360, costEnergy: 145, unlocked: false },
      { id: "acc_cap_abece", title: "Кепка Abecé 🧢", icon: "assets/accessories/acc_cap_abece.png", cost: 60, costXp: 290, costEnergy: 115, unlocked: false },
      { id: "acc_star_clips", title: "Шпильки-Зірочки ✨", icon: "assets/accessories/acc_star_clips.png", cost: 50, costXp: 250, costEnergy: 100, unlocked: false },
      { id: "acc_crossbody_bag", title: "Веселкова Сумочка 👜", icon: "assets/accessories/acc_crossbody_bag.png", cost: 85, costXp: 430, costEnergy: 170, unlocked: false },
      { id: "acc_friendship_bracelets", title: "Браслети Дружби 🌈", icon: "assets/accessories/acc_friendship_bracelets.png", cost: 50, costXp: 250, costEnergy: 100, unlocked: false },
      { id: "acc_crystal_pendant", title: "Сяючий Кристал 💎", icon: "assets/accessories/acc_crystal_pendant.png", cost: 120, costXp: 610, costEnergy: 245, unlocked: false },
      { id: "acc_smart_glasses", title: "Окуляри Розумниці 👓", icon: "assets/accessories/acc_smart_glasses.png", cost: 70, costXp: 340, costEnergy: 135, unlocked: false },
      { id: "acc_cat_beanie", title: "Шапочка з Вушками 🐱", icon: "assets/accessories/acc_cat_beanie.png", cost: 80, costXp: 405, costEnergy: 160, unlocked: false },
      { id: "acc_artist_beret", title: "Берет Художниці 🎨", icon: "assets/accessories/acc_artist_beret.png", cost: 75, costXp: 380, costEnergy: 155, unlocked: false },
      { id: "acc_sleep_mask", title: "Маска для Сну 🐼", icon: "assets/accessories/acc_sleep_mask.png", cost: 60, costXp: 290, costEnergy: 115, unlocked: false },
      { id: "acc_seashell_necklace", title: "Намисто з Черепашок 🐚", icon: "assets/accessories/acc_seashell_necklace.png", cost: 80, costXp: 405, costEnergy: 160, unlocked: false },
      { id: "acc_mermaid_tiara", title: "Тіара Русалоньки 🧜‍♀️", icon: "assets/accessories/acc_mermaid_tiara.png", cost: 130, costXp: 650, costEnergy: 260, unlocked: false }
    ],

    // Бруно: Пози, Костюми та Настрої (відкриваються кліком прямо на Бруно або в Гардеробі за монети 🪙, бали ⭐, енергію ⚡ або за виконання квестів 🎁)
    brunoOutfits: [
      {
        id: "bruno_happy",
        title: "Веселий Бруно 🐾",
        icon: "🐾",
        desc: "Чорний цвергпінчер з підпалом, радісно бігає за Данікою!",
        speech: "Гав-гав! Я завжди поруч із Данікою та готовий до пригод!",
        img: "assets/characters/bruno_happy.png?v=20261005_4",
        stationary: false,
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        tierLabel: "🎁 Базовий образ",
        unlocked: true
      },
      {
        id: "bruno_in_bed",
        title: "Бруно в лежанці 🛏️",
        icon: "🛏️",
        desc: "Відпочиває у м'якенькій лежанці внизу на підлозі й НЕ бігає за Данікою по кімнаті!",
        speech: "Гав! Мені так затишно в моїй королівській лежанці! Я полежу тут і поспостерігаю за тобою!",
        img: "assets/characters/bruno_in_bed.png?v=20261005_4",
        stationary: true,
        cost: 0,
        costXp: 0,
        costEnergy: 0,
        tierLabel: "🎁 Базова лежанка",
        unlocked: true
      },
      {
        id: "bruno_belly_rub",
        title: "Почухай животик 🥰",
        icon: "🥰",
        desc: "Бруно перевернувся на спинку лапками догори і просить почухати животик!",
        speech: "Гав-уррр! Почухай мені животик, Данічко! Я так це обожнюю!",
        img: "assets/characters/bruno_belly_rub.png?v=20261005_4",
        stationary: false,
        cost: 65,
        costXp: 315,
        costEnergy: 125,
        questRewardId: "ig_feed_bruno",
        questRewardTitle: "Нагодувати Бруно на кухні",
        tierLabel: "🎁 За квест «Нагодувати Бруно» або 70 🪙 / 350 ⭐",
        unlocked: false
      },
      {
        id: "bruno_sleeping",
        title: "Бруно Спить 💤",
        icon: "💤",
        desc: "Солодко спить калачиком у нічному ковпачку в обіймах плюшевої кісточки!",
        speech: "Хрр-гав... Мені сняться гори смачних сосисок та прогулянка на пляжі... 🌙",
        img: "assets/characters/bruno_sleeping.png?v=20261005_4",
        stationary: true,
        cost: 70,
        costXp: 360,
        costEnergy: 145,
        tierLabel: "🟢 Відкриття: 80 🪙 або 400 ⭐ / 160 ⚡",
        unlocked: false
      },
      {
        id: "bruno_skater",
        title: "Бруно Скейтер 🛹",
        icon: "🛹",
        desc: "Бруно у бірюзовому шоломі біля яскравого скейта",
        speech: "Гав! Погнали кататися на скейті вздовж моря!",
        img: "assets/characters/bruno_skater.png?v=20261005_4",
        stationary: false,
        cost: 85,
        costXp: 430,
        costEnergy: 170,
        tierLabel: "🟢 Спортивний стиль: 95 🪙 або 475 ⭐",
        unlocked: false
      },
      {
        id: "bruno_play",
        title: "Бруно Грайливий 🎾",
        icon: "🎾",
        desc: "Грається з тенісним м'ячиком, одне вушко нашорошене, інше трикутничком!",
        speech: "Кидай м'ячик, Даніко! Я зловлю його на льоту!",
        img: "assets/characters/bruno_play.png?v=20261005_4",
        stationary: false,
        cost: 85,
        costXp: 430,
        costEnergy: 170,
        tierLabel: "🟢 Активна гра: 95 🪙 або 475 ⭐",
        unlocked: false
      },
      {
        id: "bruno_love",
        title: "Бруно в Бандані ❤️",
        icon: "❤️",
        desc: "Милий песик у червоній бандані в горошок з відданими цуценячими оченятами",
        speech: "Гав-гав! Я так сильно люблю нашу сім'ю!",
        img: "assets/characters/bruno_love.png?v=20261005_4",
        stationary: false,
        cost: 100,
        costXp: 495,
        costEnergy: 200,
        tierLabel: "🔵 Улюбленець сім'ї: 110 🪙 або 550 ⭐",
        unlocked: false
      },
      {
        id: "bruno_farmer",
        title: "Бруно Фермер 👨‍🌾",
        icon: "👨‍🌾",
        desc: "Працьовитий фермер у солом'яному брилі та джинсовому комбінезоні з морквинкою!",
        speech: "Гав! Я виростив найсолодшу хрустку моркву та апельсини на нашій фермі!",
        img: "assets/characters/bruno_farmer.png?v=20261005_4",
        stationary: false,
        cost: 110,
        costXp: 560,
        costEnergy: 225,
        questRewardId: "q_eat_broccoli",
        questRewardTitle: "Вітамінний заряд (овочі/фрукти)",
        tierLabel: "🎁 За квест «Вітамінний заряд» або 125 🪙",
        unlocked: false
      },
      {
        id: "bruno_cowboy",
        title: "Бруно Ковбой 🤠",
        icon: "🤠",
        desc: "Відважний шериф Дикого Заходу у ковбойському капелюсі та червоній бандані!",
        speech: "Йо-хо-хо, гав! Шериф Бруно охороняє кімнату та шукає золоті кісточки!",
        img: "assets/characters/bruno_cowboy.png?v=20261005_4",
        stationary: false,
        cost: 120,
        costXp: 610,
        costEnergy: 245,
        questRewardId: "q_bruno_trick",
        questRewardTitle: "Юний кінолог: команда з Бруно",
        tierLabel: "🎁 За квест «Юний кінолог» або 135 🪙",
        unlocked: false
      },
      {
        id: "bruno_hunter",
        title: "Бруно Мисливець 🕵️",
        icon: "🕵️",
        desc: "Справжній детектив-слідопит у картатому капелюсі з лупою!",
        speech: "Нюх-нюх! Мій супер-ніс знайде будь-який захований смаколик чи секрет у Гандії!",
        img: "assets/characters/bruno_hunter.png?v=20261005_4",
        stationary: false,
        cost: 130,
        costXp: 650,
        costEnergy: 260,
        questRewardId: "q_detective_es",
        questRewardTitle: "Детектив у домі: 5 предметів іспанською",
        tierLabel: "🎁 За квест «Детектив у домі» або 145 🪙",
        unlocked: false
      },
      {
        id: "bruno_dancer",
        title: "Бруно Танцюрист 🕺",
        icon: "🕺",
        desc: "Крутий танцюрист у зіркових окулярах! Натисни на нього — він скаже вітання і станцює під нашу пісню!",
        speech: "Танцюють усі! Гав-гав! Дивись, як я танцюю під нашу улюблену пісеньку!",
        img: "assets/characters/bruno_dancer.png?v=20261006_1",
        animGif: "assets/characters/bruno_dancer_anim.gif?v=20261006_1",
        songUrl: "assets/audio/bruno_dance_song.mp3?v=20261006_1",
        stationary: false,
        cost: 145,
        costXp: 720,
        costEnergy: 290,
        questRewardId: "ig_bath_bruno",
        questRewardTitle: "Пінна вечірка: скупати Бруно",
        tierLabel: "🕺 Танцювальне шоу з піснею!",
        unlocked: true
      },
      {
        id: "bruno_fashion",
        title: "Бруно Моднік 😎",
        icon: "😎",
        desc: "Ікона вуличного стилю у бірюзово-рожевому худі, золотому ланцюжку та кросівках!",
        speech: "Йоу, гав! Як тобі мій новий фешн-лук? Ми з Данікою наймодніші у Гандії!",
        img: "assets/characters/bruno_fashion.png?v=20261005_4",
        stationary: false,
        cost: 160,
        costXp: 810,
        costEnergy: 325,
        tierLabel: "🟣 Фешн-ікона: 180 🪙 або 900 ⭐",
        unlocked: false
      },
      {
        id: "bruno_superhero",
        title: "Бруно Супергерой 🦸",
        icon: "🦸",
        desc: "Супер-пес у червоному плащі з емблемою золотої лапки та масці героя!",
        speech: "Супер-Бруно поспішає на допомогу! Жодна нудьга не встоїть перед моїм супер-гавом!",
        img: "assets/characters/bruno_superhero.png?v=20261005_4",
        stationary: false,
        cost: 180,
        costXp: 900,
        costEnergy: 360,
        questRewardId: "q_clean_bruno",
        questRewardTitle: "Реальна турбота про Бруно",
        tierLabel: "🎁 За квест «Турбота про Бруно» або 200 🪙",
        unlocked: false
      },
      {
        id: "bruno_king",
        title: "Бруно Король 👑",
        icon: "👑",
        desc: "Його Величність Король Бруно у золотій короні та королівській мантії!",
        speech: "Королівський указ: видати Бруно подвійну порцію смаколиків і обіймів!",
        img: "assets/characters/bruno_king.png?v=20261005_4",
        stationary: false,
        cost: 215,
        costXp: 1080,
        costEnergy: 430,
        tierLabel: "👑 Королівський образ: 240 🪙 або 1200 ⭐",
        unlocked: false
      }
    ],

    // Декор кімнати (можна змінювати за монети)
    roomDecor: [
      { id: "decor_bed_stars", title: "Постіль Зірочки ⭐", cost: 0, unlocked: true, icon: "🛏️" },
      { id: "decor_bed_dolphins", title: "Постіль Дельфіни 🐬", cost: 14, unlocked: false, icon: "🐬" },
      { id: "decor_lamp_flower", title: "Нічник Квітка 🌸", cost: 9, unlocked: true, icon: "💡" },
      { id: "decor_rug_rainbow", title: "Килимок Веселка 🌈", cost: 11, unlocked: true, icon: "🧶" },
      { id: "decor_poster_space", title: "Постер Космос 🚀", cost: 9, unlocked: false, icon: "🖼️" },
      { id: "decor_plant_palm", title: "Міні-Пальма у горщику 🌴", cost: 13, unlocked: false, icon: "🪴" }
    ]
  },

  // =========================================================
  // ЛОКАЦІЇ МІСТА ГАНДІЯ (GANDIA, ESPAÑA)
  // =========================================================
  gandiaLocations: [
    {
        "id": "loc_home",
        "title": "Дім Даніки 🏠",
        "category": "home",
        "x": 30,
        "y": 55,
        "bg": "assets/rooms/room_bedroom.jpg",
        "desc": "Затишна квартира Даніки: спальня, ванна, кухня та майстерня мами",
        "roomsCount": 4
    },
    {
        "id": "loc_abece",
        "title": "Colegio Abecé 🏫",
        "category": "school",
        "x": 38,
        "y": 26,
        "bg": "assets/locations/loc_abece.jpg",
        "desc": "Школа Даніки: загальний вхід, клас математики, столова, хімія та спортзал",
        "roomsCount": 5
    },
    {
        "id": "loc_vital",
        "title": "ТЦ «La Vital» 🛍️",
        "category": "mall",
        "x": 47,
        "y": 78,
        "bg": "assets/locations/loc_vital.jpg",
        "desc": "Торговий центр: панорама, магазин іграшок, перший поверх, модний одяг та фудкорт",
        "roomsCount": 5
    },
    {
        "id": "loc_beach",
        "title": "Platja de Gandia 🏖️",
        "category": "beach",
        "x": 82,
        "y": 44,
        "bg": "assets/locations/loc_beach.jpg",
        "desc": "Пляж Гандії: панорама узбережжя, яхта, повітряні змії, пляжне кафе та аквапарк",
        "roomsCount": 5
    },
    {
        "id": "loc_park",
        "title": "Parc de l'Estació 🌳",
        "category": "park",
        "x": 16,
        "y": 42,
        "bg": "assets/locations/loc_park.jpg",
        "desc": "Парк: головний вхід, фонтан, ігровий майданчик, кіоски солодощів та зона собак",
        "roomsCount": 5
    },
    {
        "id": "loc_mercadona",
        "title": "Супермаркет «Mercadona» 🛒",
        "category": "shop",
        "x": 60,
        "y": 26,
        "bg": "assets/locations/loc_mercadona.jpg",
        "desc": "Супермаркет: фасад і візки, випічка, овочі та фрукти, ковбаси та м'ясо, вода",
        "roomsCount": 5
    },
    {
        "id": "loc_chachi",
        "title": "Кафе «Chachi Piruli» 🎈",
        "category": "fun",
        "x": 48,
        "y": 50,
        "bg": "assets/locations/loc_chachi.jpg",
        "desc": "Дитяче кафе: святковий вхід, надувний батут, скеледром, басейн з кульками та ігрові автомати",
        "roomsCount": 5
    },
    {
        "id": "loc_petshop",
        "title": "Mascotas 🐾 (Зоомагазин & Спа)",
        "category": "shop",
        "x": 22,
        "y": 72,
        "bg": "assets/locations/loc_petshop.jpg",
        "desc": "Затишний зоомагазин: смаколики та іграшки, грумінг-спа, дитячий садок для цуценят та ветклініка",
        "roomsCount": 4
    },
    {
        "id": "loc_hotel",
        "title": "Готель «Danika Hotel»",
        "category": "hotel",
        "x": 72,
        "y": 62,
        "bg": "assets/locations/loc_hotel_lobby.jpg",
        "desc": "5-зірковий розкішний готель Даніки: гранд-рецепція, королівський люкс, кафе-буфет та басейн на даху",
        "roomsCount": 4
    }
  ],

  // =========================================================
  // СПРАВЕДЛИВА СИСТЕМА НАГОРОД ТА КУПОНІВ (МАГАЗИН МРІЙ)
  // Розраховано на чесний темп ~35-50 🪙 на день:
  // - Дрібні радості та купони: 1.5 - 3 дні старань (55 - 120 🪙)
  // - Середні пригоди: 4 - 7 днів старань (160 - 350 🪙)
  // - Велика мрія (Іграшка БеБе): ~2 тижні старань (700 🪙)
  // =========================================================
  rewards: [
    {
      id: "r_youtube_30",
      title: "30 хв Улюбленого YouTube 📱",
      description: "Золотий VIP-квиток на 30 хвилин цікавих відео чи мультиків на YouTube!",
      costCoins: 50,
      costCrystals: 0,
      icon: "📱",
      ticketImg: "assets/rewards/ticket_youtube.png",
      category: "screen_time",
      tier: "⚡ Швидка нагорода (1–2 дні)"
    },
    {
      id: "r_gaming_60",
      title: "1 година Ігор на Планшеті 🎮",
      description: "VIP-перепустка на 1 годину гри у Roblox або улюблені ігри на планшеті!",
      costCoins: 70,
      costCrystals: 0,
      icon: "🎮",
      ticketImg: "assets/rewards/ticket_gaming.png",
      category: "screen_time",
      tier: "⚡ Швидка нагорода (2 дні)"
    },
    {
      id: "r_coupon_chef",
      title: "Купон «Шеф Сімейної Вечері» 👑",
      description: "Ти сама обираєш, яку улюблену страву вся родина готує або замовляє на вечерю!",
      costCoins: 70,
      costCrystals: 0,
      icon: "🍕",
      category: "privileges",
      tier: "👑 Купон Володарки Дня (2 дні)"
    },
    {
      id: "r_coupon_bedtime",
      title: "Купон «+30 хв Чарівної Ночі» 🌙",
      description: "Офіційне право лягти спати на 30 хвилин пізніше у п'ятницю або суботу!",
      costCoins: 80,
      costCrystals: 0,
      icon: "🌙",
      category: "privileges",
      tier: "👑 Купон Володарки Дня (2–3 дні)"
    },
    {
      id: "r_coupon_shield",
      title: "Щит Імунітету (Пропуск 1 справи) 🛡️",
      description: "Магічний щит дозволяє 1 раз офіційно пропустити прибирання чи посуд без втрати серії!",
      costCoins: 90,
      costCrystals: 0,
      icon: "🛡️",
      category: "privileges",
      tier: "👑 Купон Володарки Дня (2–3 дні)"
    },
    {
      id: "r_icecream",
      title: "Смачне Морозиво / Джелато 🍦",
      description: "Улюблене морозиво або італійське джелато на вибір під час прогулянки з батьками!",
      costCoins: 90,
      costCrystals: 0,
      icon: "🍦",
      category: "treats",
      tier: "🍦 Смаколик у Гандії (2–3 дні)"
    },
    {
      id: "r_coupon_movie",
      title: "Купон «Режисер Кіновечора» 🎬",
      description: "Ти обираєш фільм або мультфільм для вечірнього перегляду всією сім'єю з попкорном!",
      costCoins: 100,
      costCrystals: 0,
      icon: "🎬",
      category: "privileges",
      tier: "👑 Купон Володарки Дня (3 дні)"
    },
    {
      id: "r_granizados",
      title: "Освіжаючий Гранісадос 🍧",
      description: "Смачний фруктовий колотий лід granizados на набережній сонячної Гандії!",
      costCoins: 110,
      costCrystals: 0,
      icon: "🍧",
      category: "treats",
      tier: "🍦 Смаколик у Гандії (3 дні)"
    },
    {
      id: "r_coupon_captain",
      title: "Купон «Капітан Вихідного Дня» 🗺️",
      description: "Ти сама плануєш маршрут недільної сімейної прогулянки (пляж, парк, скейт чи кафе)!",
      costCoins: 145,
      costCrystals: 0,
      icon: "🧭",
      category: "adventures",
      tier: "🌟 Середня ціль (4 дні)"
    },
    {
      id: "r_vital_craft",
      title: "Творчий Сюрприз у «La Vital» 🎨",
      description: "Похід у магазин в La Vital за новим скетчбуком, фломастерами, наклейками або слаймом!",
      costCoins: 235,
      costCrystals: 0,
      icon: "🎨",
      category: "adventures",
      tier: "🌟 Велика пригода (~6 днів)"
    },
    {
      id: "r_dumplings",
      title: "Святковий Похід на Думплінгс 🥟",
      description: "Сімейний похід у кафе на найсмачніші dumplings!",
      costCoins: 315,
      costCrystals: 0,
      icon: "🥟",
      category: "adventures",
      tier: "🏆 Тижнева мрія (~1 тиждень)"
    },
    {
      id: "r_bebe_toy",
      title: "Головна Мрія: Іграшка БеБе 🧸",
      description: "Справжня нова іграшка БеБе, про яку ти мрієш (супер-нагорода за наполегливість)!",
      costCoins: 630,
      costCrystals: 0,
      icon: "🧸",
      category: "toys",
      tier: "👑 Легендарна мрія (~2 тижні)"
    },
    {
      id: "r_crystal_euro_5",
      title: "Скарбничка: 5 Євро готівкою 💶",
      description: "Обмін 5 кристалів (за тижневі звички) на справжні 5 євро у твій власний гаманець!",
      costCoins: 0,
      costCrystals: 5,
      icon: "💶",
      category: "money",
      tier: "💎 Кристали звичок (1 тиждень)"
    },
    {
      id: "r_crystal_euro_10",
      title: "Скарбничка: 10 Євро готівкою 💰",
      description: "Обмін 10 кристалів (за 2 тижні системних звичок) на справжні 10 євро готівкою!",
      costCoins: 0,
      costCrystals: 10,
      icon: "💰",
      category: "money",
      tier: "💎 Кристали звичок (2 тижні)"
    }
  ],

  // 5 Складних Загадок на логіку (8-10 років)
  riddles: [
    {
      id: "rid_1",
      question: "Що належить тільки тобі, але інші люди користуються цим набагато частіше, ніж ти сама?",
      options: ["Твоє ім\'я (Danika) ✨", "Твій улюблений самокат 🛴", "Твій рюкзак 🎒"],
      correct: 0,
      solved: false,
      explanation: "Правильно! Твоє ім\'я належить тобі, але друзі, батьки та вчителі промовляють його значно частіше!",
      hint: "Подумай, що люди вимовляють вголос, коли звертаються до тебе!"
    },
    {
      id: "rid_2",
      question: "Качка важить 2 кг, коли стоїть на двох ніжках. Скільки вона важитиме, якщо підніме одну ніжку і стане лише на одну?",
      options: ["1 кг 🪶", "Рівно 2 кг ⚖️", "4 кг 🏋️"],
      correct: 1,
      solved: false,
      explanation: "Бінго! Вага качки ніяк не залежить від того, на скількох лапках вона стоїть — все одно 2 кг!",
      hint: "Подумай: чи зменшується маса птаха, якщо він просто підібгав лапку?"
    },
    {
      id: "rid_3",
      question: "Двоє друзів грали у шахи рівно 2 години. Скільки часу грав у шахи кожен із них?",
      options: ["По 1 годині ⏳", "Рівно 2 години ⏱️", "4 години разом ⌛"],
      correct: 1,
      solved: false,
      explanation: "Точно! Вони грали в одну партію одночасно, тому кожен грав рівно 2 години!",
      hint: "Вони грали разом в один і той самий час, а не по черзі!"
    },
    {
      id: "rid_4",
      question: "Як назвати 5 днів поспіль, не використовуючи чисел (1, 2, 3...) і назв днів тижня (понеділок, вівторок...)?",
      options: [
        "Позавчора, вчора, сьогодні, завтра, післязавтра 🗓️",
        "Зима, весна, літо, осінь, рік 🍂",
        "Ранок, обід, полуденок, вечір, ніч 🌙"
      ],
      correct: 0,
      solved: false,
      explanation: "Геніально! «Позавчора, вчора, сьогодні, завтра, післязавтра» — це 5 днів поспіль без чисел та днів тижня!",
      hint: "Згадай слова, які ми використовуємо для позначення минулих і майбутніх днів відносно сьогодні."
    },
    {
      id: "rid_5",
      question: "Чим більше ти з цього виймаєш і забираєш — тим більшим воно стає. Що це таке?",
      options: ["Яма в піску 🕳️", "Скриня зі скарбами 🎁", "Холодильник з морозивом 🍦"],
      correct: 0,
      solved: false,
      explanation: "Неймовірна логіка! Коли ти копаєш яму і виймаєш пісок — вона стає все більшою і глибшою!",
      hint: "Уяви, що ти копаєш пляж лопаткою і виймаєш звідти пісок."
    }
  ],

  // Наставники
  mentors: {
    dad: {
      name: "Тато (Капітан)",
      avatarImg: null,
      avatarIcon: "👨‍✈️",
      quotes: [
        "Привіт, Даніко! Сьогодні чудовий день для нових відкриттів! Заглянь у Місію Дня 😉",
        "Ти чудово впоралася з ранковими справами! Пишаюся тобою, донечко! 🌟",
        "Пам\'ятай: регулярні звички щодня відкривають справжні кристали у скарбничку! 🧭"
      ]
    },
    mom: {
      name: "Мама (Адмірал)",
      avatarImg: null,
      avatarIcon: "👩‍✈️",
      quotes: [
        "Привіт, моя зірочко! Не забудь прочитати сторінку іспанської казки 📖❤️",
        "Бруно шепнув мені, що ти сьогодні неймовірно старанна! Лови обійми! ✨",
        "Давай сьогодні виконаємо спільну місію на кухні або пограємо в детективів! 🍦"
      ]
    },
    bruno: {
      name: "Бруно",
      avatarImg: "assets/characters/bruno_happy.png",
      avatarIcon: "🐶",
      quotes: [
        "Гав-гав! Даніко, погодуй мене у грі та ходімо шукати пригоди в Гандії! 🐾",
        "Мій хвостик крутиться — ти найкраща подруга у всьому світі! 🐕",
        "Гав! Кожне виконане завдання дає шанс знайти для мене нову іграшку!"
      ]
    }
  },

  activeMentorTip: "Привіт, Даніко! Виконуй ігрові місії по догляду за Бруно (+3 🪙) та реальні справи дня (+10..45 🪙)!",

  // =========================================================
  // ПОВНИЙ ГАРМОНІЙНИЙ КАТАЛОГ ЗАВДАНЬ (4 РІВНІ: ІГРОВІ, ПОБУТОВІ, ТВОРЧІ/ДЕТЕКТИВНІ, ПРОЄКТИ)
  // =========================================================
  questCatalog: {
    // 0. Легкі ігрові мікро-завдання у світі гри (по 3 🪙, без PIN-коду, 1 раз на день — для покупок аксесуарів та їжі в грі!)
    ingame3: [
      { id: "ig_feed_bruno", title: "Ігрова турбота: нагодувати Бруно на кухні", desc: "Перейди на Кухню в грі та натисни на мисочку Бруно або перетягни йому смаколик!", coins: 3, xp: 15, icon: "🥣", completed: false, room: "kitchen", noPin: true },
      { id: "ig_brush_teeth", title: "Ігровий ранок: почистити зубки Даніці", desc: "Перейди у Ванну кімнату в грі та натисни на умивальник із зубною щіткою!", coins: 3, xp: 15, icon: "🪥", completed: false, room: "bathroom", noPin: true },
      { id: "ig_bath_bruno", title: "Пінна вечірка: скупати песика Бруно у грі", desc: "У Ванній кімнаті натисни на ванну з бульбашками, щоб помити Бруно!", coins: 3, xp: 15, icon: "🧼", completed: false, room: "bathroom", noPin: true },
      { id: "ig_secret_decor", title: "Дизайнер інтер'єру: облаштувати Таємну кімнату", desc: "Заглянь у Таємну кімнату (🔮) та обери улюблений стиль ліжка чи килимка!", coins: 3, xp: 15, icon: "🔮", completed: false, room: "room_secret", noPin: true }
    ],

    // 1. Щоденні реальні справи вдома по 10-12 монет (потребують підтвердження батьків, скидаються щодня)
    once5: [
      { id: "q_make_bed", title: "Таємна схованка під подушкою: застелити ліжко", desc: "Охайно розправ ковдру та збий подушечку з самого ранку!", coins: 10, xp: 40, icon: "🛏️", completed: false, room: "bedroom" },
      { id: "q_clean_room", title: "Секретна карта Бруно: порядок у кімнаті", desc: "Бруно сховав у кімнаті підказку! Розчисти килимок та склади речі на місця!", coins: 10, xp: 40, icon: "🧹", completed: false, room: "bedroom" },
      { id: "q_wash_dishes", title: "Пінна місія на кухні: помити посуд", desc: "Вимий свої тарілочки з ароматною пінкою після їжі та поверни їм блиск!", coins: 10, xp: 40, icon: "🍽️", completed: false, room: "kitchen" },
      { id: "q_eat_broccoli", title: "Вітамінний заряд супер-енергії (овочі та фрукти)", desc: "З'їж порцію корисних овочів, броколі чи салату під час обіду!", coins: 12, xp: 50, icon: "🥦", completed: false, room: "kitchen" },
      { id: "q_clean_bruno", title: "Реальна турбота про Бруно: свіжа вода і корм", desc: "У реальному житті налий Бруно свіжої водички, дай корм і поправ його килимок!", coins: 10, xp: 40, icon: "🐾", completed: false, room: "kitchen" },
      { id: "q_prep_school", title: "Збори з вечора: рюкзак та форма до школи", desc: "Склади пенал, зошити й приготуй одяг з вечора, щоб вранці не поспішати!", coins: 10, xp: 45, icon: "🎒", completed: false, location: "loc_abece" },
      { id: "q_fix_sofa", title: "Затишок у вітальні: розгладити плед і подушки", desc: "Рівненько заправ покривало та розклади м'які подушки на дивані для сім'ї!", coins: 10, xp: 35, icon: "🛋️", completed: false, room: "bedroom" },
      { id: "q_squats_10", title: "Спортивний старт: 10 бадьорих присідань", desc: "Зроби 10 пружних присідань у кімнаті для заряду бадьорості!", coins: 10, xp: 40, icon: "🦵", completed: false, location: "loc_poliesportiu" },
      { id: "q_gymnastics_3m", title: "Розминка чемпіонки: 3 хвилини гімнастики", desc: "Потягнися до сонечка, зроби нахили, місток чи вправи на гнучкість!", coins: 12, xp: 45, icon: "🤸‍♀️", completed: false, location: "loc_poliesportiu" },
      { id: "q_math_mom", title: "Математичний шифр від мами", desc: "Розв'яжи цікавий математичний приклад від мами у зошиті!", coins: 12, xp: 50, icon: "📐", completed: false, location: "loc_abece" }
    ],

    // 2. Системні тренування мов і читання по 10 монет (чесний денний ліміт: до 3 разів на день кожне!)
    repeatable5: [
      { id: "q_rep_spanish", title: "Іспанська казка: 1 сторінка вголос", desc: "Прочитай одну сторінку іспанською мамі або Бруно (до 3 разів на день)", coins: 10, xp: 45, icon: "🇪🇸", multi: true, counter: 0, dailyCount: 0, maxDaily: 3 },
      { id: "q_rep_english", title: "Англійський словничок: 5 нових слів", desc: "Вивчи й вимов п'ять англійських слів із перекладом (до 3 разів на день)", coins: 10, xp: 45, icon: "🇬🇧", multi: true, counter: 0, dailyCount: 0, maxDaily: 3 },
      { id: "q_rep_ukrainian", title: "Рідна мова: 1 сторінка цікавої книги", desc: "Прочитай одну сторінку книжки українською мовою (до 3 разів на день)", coins: 10, xp: 45, icon: "🇺🇦", multi: true, counter: 0, dailyCount: 0, maxDaily: 3 }
    ],

    // 3. Детективні, Творчі та Добрі пригоди в реальному житті на 18 монет
    quests10: [
      { id: "q_detective_es", title: "Детектив у домі: 5 предметів іспанською 🕵️‍♀️", desc: "Знайди в кімнаті п'ять різних речей і назви їх мамі або татові іспанською!", coins: 18, xp: 75, icon: "🧭", completed: false, location: "loc_abece" },
      { id: "q_secret_kindness", title: "Таємний агент доброти: сюрприз для рідних 💌", desc: "Непомітно зроби добру справу або поклади милу записку чи малюнок мамі або татові!", coins: 18, xp: 75, icon: "💌", completed: false, room: "bedroom" },
      { id: "q_chef_taster", title: "Шеф-дегустатор із заплющеними очима 🍓", desc: "Вгадай на смак із заплющеними очима три корисні фрукти чи овочі на кухні!", coins: 18, xp: 75, icon: "🍓", completed: false, room: "kitchen" },
      { id: "q_bruno_trick", title: "Юний кінолог: тренування команди з Бруно 🐾", desc: "Потренуй песика Бруно виконувати команду «Сидіти» або «Дай лапу» за смаколик!", coins: 18, xp: 75, icon: "🐕", completed: false, location: "loc_park" },
      { id: "q_board_game", title: "Сімейний турнір: настільна гра з батьками 🎲", desc: "Зіграй у настільну гру або карти разом із мамою і татом без гаджетів!", coins: 18, xp: 75, icon: "🎲", completed: false, location: "loc_chachi" },
      { id: "q_draw_gandia", title: "Арт-студія: намалювати куточок Гандії 🎨", desc: "Намалюй на папері море, високі пальми, яхту чи улюблений пляж!", coins: 18, xp: 75, icon: "🎨", completed: false, room: "studio" },
      { id: "q_bat_craft", title: "Майстерня: паперовий кажанчик Валенсії 🦇", desc: "Змайструй орігамі або аплікацію симпатичного кажанчика — символу Валенсії!", coins: 18, xp: 75, icon: "🦇", completed: false, room: "studio" }
    ],

    // 4. Кооперативні місії з батьками та Великі челенджі на 30 монет
    quests20: [
      { id: "q_coop_cooking", title: "Кооп-місія з Мамою: готуємо страву разом 👩‍👧", desc: "Приготуй разом із мамою салат, випічку чи сніданок (бонус іде і Даніці, і Мамі в рейтинг)!", coins: 30, xp: 120, icon: "👩‍🎨", completed: false, coopWith: "mom", room: "kitchen" },
      { id: "q_coop_sport_dad", title: "Кооп-місія з Татом: спільне тренування 👨‍👧", desc: "Зробіть разом із татом зарядку, пробіжку або прогулянку (бонус і Даніці, і Татові)!", coins: 30, xp: 120, icon: "👨‍✈️", completed: false, coopWith: "dad", location: "loc_beach" },
      { 
        id: "q_grandma_poem", 
        title: "Вивчити віршик для бабусі про кошеня 👵", 
        desc: "Розкажи бабусі по відеозв'язку та подаруй море радості!", 
        coins: 30, 
        xp: 120, 
        icon: "👵", 
        completed: false,
        poemText: "Щось мале, руде і прудке\nпо стежині скаче,\nце пухнасте кошеня,\nале чомусь плаче.\n\nНе журися кошенятко,\nя тебе зігрію,\nбуде в тебе теплий дім,\nласка і надія!"
      },
      { id: "q_no_avatar_world", title: "День живих пригод без планшета 🌈", desc: "Проведи цілий день у реальному світі — гуляй, малюй та грай з родиною без екранів!", coins: 30, xp: 120, icon: "⭐", completed: false },
      { id: "q_story_bruno_es", title: "Скласти 5 речень іспанською про Бруно 🐶", desc: "Склади п'ять красивих речень іспанською мовою про нашого песика Бруно!", coins: 30, xp: 120, icon: "📝", completed: false, location: "loc_park" },
      { id: "q_story_mom_ua", title: "Теплий сюрприз: 5 речень про маму ❤️", desc: "Напиши зворушливий твір про матусю, щоб вона посміхнулася!", coins: 30, xp: 120, icon: "✍️", completed: false, room: "studio" },
      { 
        id: "q_spanish_poem", 
        title: "Вивчити вірш іспанською «Mariposa del aire» 🦋", 
        desc: "Мелодійний вірш Федеріко Гарсія Лорки про метелика", 
        coins: 30, 
        xp: 120, 
        icon: "🇪🇸", 
        completed: false,
        location: "loc_abece",
        poemText: "Mariposa del aire,\nqué hermosa eres,\nmariposa del aire\ndorada y verde.\n\nLuz de candil,\nmariposa del aire,\n¡quédate ahí, ahí, ahí!"
      }
    ],

    // 5. Проєкти-презентації на 45 монет
    projects30: [
      { id: "q_proj_ants", title: "Дослідження мурах: життя в мурашнику 🐜", desc: "Підготуй малюнки та розкажи батькам таємниці мікросвіту", coins: 45, xp: 180, icon: "🐜", completed: false, room: "bedroom" },
      { id: "q_proj_spain", title: "Презентація про традиції та міста Іспанії 🇪🇸", desc: "Розкажи про культуру, свята та природу сонячного узбережжя", coins: 45, xp: 180, icon: "🏖️", completed: false, location: "loc_beach" },
      { id: "q_proj_valencia", title: "Презентація про величну Валенсію 🏰", desc: "Місто Наук і Мистецтв, старовинні вежі та історія столиці", coins: 45, xp: 180, icon: "🏰", completed: false, location: "loc_vital" },
      { id: "q_proj_chocolate", title: "Таємниця створення смачного шоколаду 🍫", desc: "Як ароматні какао-боби перетворюються на улюблені ласощі", coins: 45, xp: 180, icon: "🍫", completed: false, location: "loc_mercadona" },
      { id: "q_proj_candy_harm", title: "Секрет здорової усмішки проти цукру 🦷", desc: "Як солодощі впливають на зубки і як зберегти білосніжну посмішку", coins: 45, xp: 180, icon: "🦷", completed: false, location: "loc_mercadona" }
    ]
  },

  // РОЗКЛАД ЩОДЕННИХ СПРАВ ПО ДНЯХ (ГАРМОНІЙНИЙ МІКС: ЗВИЧКИ + НАВЧАННЯ + ПРИГОДА ДНЯ)
  weekSchedule: {
    mon: {
      id: "mon",
      dayName: "Понеділок",
      shortName: "Пн",
      theme: "🚀 День Порядку та Школи",
      themeDesc: "Заправляємо ліжечко, граємо в іспанського детектива та вчимося з радістю!",
      quests: [
        { id: "mon_make_bed", title: "Таємна схованка під подушкою", desc: "Охайно заправ ліжечко та збий подушку з самого ранку!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "mon_clean_room", title: "Секретна карта Бруно", desc: "Розчисти килимок та склади речі на місця у кімнаті!", coins: 10, xp: 40, icon: "🧹", completed: false },
        { id: "mon_detective_es", title: "Детектив у домі: 5 предметів іспанською", desc: "Знайди п'ять речей у кімнаті та назви їх іспанською мовою!", coins: 18, xp: 75, icon: "🧭", completed: false },
        { id: "mon_rep_spanish", title: "Прочитати 1 сторінку казки іспанською", desc: "Прочитай уголос мамі або песику (до 3 разів на день)", coins: 10, xp: 45, icon: "🇪🇸", multi: true, counter: 0, maxDaily: 3 },
        { id: "mon_math_mom", title: "Математичний шифр від мами", desc: "Розв'яжи цікавий приклад на логіку у зошиті!", coins: 12, xp: 50, icon: "📐", completed: false },
        { id: "mon_prep_school", title: "Збори з вечора до школи", desc: "Склади рюкзак і приготуй форму з вечора!", coins: 10, xp: 45, icon: "🎒", completed: false }
      ]
    },
    tue: {
      id: "tue",
      dayName: "Вівторок",
      shortName: "Вт",
      theme: "🐜 День Досліджень та Доброти",
      themeDesc: "Дбаємо про Бруно, готуємо таємний сюрприз для рідних і читаємо!",
      quests: [
        { id: "tue_make_bed", title: "Таємна схованка під подушкою", desc: "Збий подушечку та розправ зіркову ковдру!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "tue_wash_dishes", title: "Пінна місія на кухні", desc: "Вимий свої тарілочки з пінкою після їжі!", coins: 10, xp: 40, icon: "🍽️", completed: false },
        { id: "tue_clean_bruno", title: "Турбота про Бруно", desc: "Налий свіжої водички, насип корму та поправ килимок песика!", coins: 10, xp: 40, icon: "🥣", completed: false },
        { id: "tue_secret_kindness", title: "Таємний агент доброти", desc: "Непомітно зроби добрий сюрприз або поклади записку мамі чи татові!", coins: 18, xp: 75, icon: "💌", completed: false },
        { id: "tue_rep_spanish", title: "Прочитати 1 сторінку казки іспанською", desc: "Читання вголос (до 3 разів на день)", coins: 10, xp: 45, icon: "🇪🇸", multi: true, counter: 0, maxDaily: 3 },
        { id: "tue_rep_ukrainian", title: "Прочитати 1 сторінку українською", desc: "Цікава сторінка рідною мовою (до 3 разів на день)", coins: 10, xp: 45, icon: "🇺🇦", multi: true, counter: 0, maxDaily: 3 }
      ]
    },
    wed: {
      id: "wed",
      dayName: "Середа",
      shortName: "Ср",
      theme: "🎨 День Творчості та Гімнастики",
      themeDesc: "Малюємо сонячну Гандію, робимо розминку та вчимо англійські слова!",
      quests: [
        { id: "wed_make_bed", title: "Таємна схованка під подушкою", desc: "Охайно заправ ліжечко та перевір подушку!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "wed_fix_sofa", title: "Затишок у вітальні", desc: "Розгладь покривало та подушки на дивані для сім'ї!", coins: 10, xp: 35, icon: "🛋️", completed: false },
        { id: "wed_gymnastics_3m", title: "Розминка чемпіонки (3 хвилини)", desc: "Потягнися до сонечка, зроби місток чи легку розтяжку!", coins: 12, xp: 45, icon: "🤸‍♀️", completed: false },
        { id: "wed_draw_gandia", title: "Арт-студія: намалювати куточок Гандії", desc: "Намалюй море, високі пальми чи сонячний пляж!", coins: 18, xp: 75, icon: "🎨", completed: false },
        { id: "wed_rep_english", title: "Вивчити 5 слів англійською", desc: "Здивуй тата правильною вимовою (до 3 разів на день)", coins: 10, xp: 45, icon: "🇬🇧", multi: true, counter: 0, maxDaily: 3 },
        { id: "wed_prep_school", title: "Збори з вечора до школи", desc: "Приготуй рюкзак та шкільну форму на завтра!", coins: 10, xp: 45, icon: "🎒", completed: false }
      ]
    },
    thu: {
      id: "thu",
      dayName: "Четвер",
      shortName: "Чт",
      theme: "🍓 День Смаків та Теплих Слів",
      themeDesc: "Граємо у шеф-дегустатора, їмо корисні вітаміни та готуємо разом із мамою!",
      quests: [
        { id: "thu_make_bed", title: "Таємна схованка під подушкою", desc: "Ранок з порядку: затишне ліжечко!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "thu_eat_broccoli", title: "Вітамінний заряд супер-енергії", desc: "Скуштуй корисне броколі або свіжі овочі на обід!", coins: 12, xp: 50, icon: "🥦", completed: false },
        { id: "thu_chef_taster", title: "Шеф-дегустатор із заплющеними очима", desc: "Вгадай на смак із заплющеними очима три корисні смаколики!", coins: 18, xp: 75, icon: "🍓", completed: false },
        { id: "thu_coop_cooking", title: "Кооп-місія з Мамою на кухні", desc: "Допоможи мамі приготувати смачну страву для родини!", coins: 25, xp: 100, icon: "👩‍🎨", completed: false },
        { id: "thu_rep_spanish", title: "Прочитати 1 сторінку казки іспанською", desc: "Прочитай уголос мамі або песику (до 3 разів на день)", coins: 10, xp: 45, icon: "🇪🇸", multi: true, counter: 0, maxDaily: 3 },
        { id: "thu_clean_room", title: "Вечірній порядок у кімнаті", desc: "Склади фломастери, книжки та іграшки на місця!", coins: 10, xp: 40, icon: "🧹", completed: false }
      ]
    },
    fri: {
      id: "fri",
      dayName: "П'ятниця",
      shortName: "Пт",
      theme: "🏆 Фінал Навчального Тижня та Спорт",
      themeDesc: "Спортивний челендж, чиста кімната перед вихідними та тренування Бруно!",
      quests: [
        { id: "fri_make_bed", title: "Таємна схованка під подушкою", desc: "Затишне ліжечко перед чудовими вихідними!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "fri_squats_10", title: "Спортивний челендж: 10 присідань", desc: "Зроби десять легких та пружних присідань разом із Бруно!", coins: 10, xp: 40, icon: "🦵", completed: false },
        { id: "fri_wash_dishes", title: "Пінна місія на кухні", desc: "Вимий тарілочки з пінкою після обіду!", coins: 10, xp: 40, icon: "🍽️", completed: false },
        { id: "fri_bruno_trick", title: "Юний кінолог: команда для Бруно", desc: "Потренуй песика Бруно давати лапу або сидіти за смаколик!", coins: 18, xp: 75, icon: "🐕", completed: false },
        { id: "fri_math_mom", title: "Математичний шифр від мами", desc: "Розв'яжи логічну задачу у зошиті!", coins: 12, xp: 50, icon: "📐", completed: false },
        { id: "fri_clean_room", title: "Секретна карта Бруно", desc: "Наведи ідеальний затишок у кімнаті перед суботою!", coins: 10, xp: 40, icon: "🧹", completed: false }
      ]
    },
    sat: {
      id: "sat",
      dayName: "Субота",
      shortName: "Сб",
      theme: "🎲 День Настільних Ігор та Сім'ї",
      themeDesc: "Граємо в настільну гру з батьками, тренуємося з татом та гуляємо!",
      quests: [
        { id: "sat_make_bed", title: "Таємна схованка під подушкою", desc: "Затишний суботній ранок у чистій кімнаті!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "sat_board_game", title: "Сімейний турнір: настільна гра", desc: "Зіграй у цікаву настільну гру разом із мамою і татом!", coins: 18, xp: 75, icon: "🎲", completed: false },
        { id: "sat_coop_sport_dad", title: "Командний старт із Татом", desc: "Ранкова зарядка або активна прогулянка разом із татом!", coins: 25, xp: 100, icon: "👨‍✈️", completed: false },
        { id: "sat_clean_bruno", title: "Порадувати песика Бруно", desc: "Насип корму, онови водичку та почисти його килимок!", coins: 10, xp: 40, icon: "🥣", completed: false },
        { id: "sat_rep_spanish", title: "Прочитати 1 сторінку казки іспанською", desc: "Цікава сторінка вголос (до 3 разів на день)", coins: 10, xp: 45, icon: "🇪🇸", multi: true, counter: 0, maxDaily: 3 }
      ]
    },
    sun: {
      id: "sun",
      dayName: "Неділя",
      shortName: "Нд",
      theme: "🌟 День Живих Пригод та Відпочинку",
      themeDesc: "Живі пригоди біля моря без планшета, читання та підсумки тижня!",
      quests: [
        { id: "sun_make_bed", title: "Таємна схованка під подушкою", desc: "Затишок та краса в кімнаті з самого ранку!", coins: 10, xp: 40, icon: "🛏️", completed: false },
        { id: "sun_wash_dishes", title: "Пінна місія на кухні", desc: "Допоможи рідним: вимий тарілочки до блиску!", coins: 10, xp: 40, icon: "🍽️", completed: false },
        { id: "sun_no_avatar_world", title: "День живих пригод без планшета", desc: "Гуляй біля моря, малюй та грай у реальному світі з родиною!", coins: 30, xp: 120, icon: "⭐", completed: false },
        { id: "sun_rep_ukrainian", title: "Прочитати 1 сторінку книжки рідною мовою", desc: "Цікава сторінка українською (до 3 разів на день)", coins: 10, xp: 45, icon: "🇺🇦", multi: true, counter: 0, maxDaily: 3 },
        { id: "sun_fix_sofa", title: "Затишок у вітальні", desc: "Поправ диванчик для теплого недільного вечора сім'ї!", coins: 10, xp: 35, icon: "🛋️", completed: false }
      ]
    }
  },

  // СИСТЕМНІ ЗВИЧКИ ТИЖНЯ ЗА КРИСТАЛИ (1 💎 = 1 € у скарбничку, 5-7 днів регулярності!)
  weeklyQuests: [
    {
      id: "wq_room_cleanliness",
      title: "Звичка Чистоти: затишна кімната та ліжко 5 днів поспіль 🧹",
      description: "Застеляй ліжко та розчищай килимок п'ять днів поспіль без нагадувань (+2 💎 / 2 €)!",
      crystals: 2,
      coins: 35,
      xp: 150,
      icon: "⭐",
      current: 0,
      max: 5
    },
    {
      id: "wq_spanish_book",
      title: "Звичка Читання: 5 днів з іспанською книжкою 📖",
      description: "Читай по кілька сторінок іспанської казки п'ять днів протягом тижня (+2 💎 / 2 €)!",
      crystals: 2,
      coins: 35,
      xp: 150,
      icon: "🇪🇸",
      current: 0,
      max: 5
    },
    {
      id: "wq_english_vocab",
      title: "Мовна Скарбничка: 20 нових англійських слів за тиждень 🇬🇧",
      description: "Вивчи по п'ять слів у чотири різні дні тижня та впевнено розкажи батькам (+2 💎 / 2 €)!",
      crystals: 2,
      coins: 35,
      xp: 150,
      icon: "🇬🇧",
      current: 0,
      max: 4
    },
    {
      id: "wq_ants_report",
      title: "Дослідниця Тижня: велика презентація для родини 🐜",
      description: "Підготуй малюнки, цікаві факти та захисти один великий проєкт перед батьками (+2 💎 / 2 €)!",
      crystals: 2,
      coins: 45,
      xp: 180,
      icon: "🐜",
      current: 0,
      max: 3
    },
    {
      id: "wq_math_olympiad",
      title: "Звичка Логіки: 5 днів математичних шифрів та спорту 📐",
      description: "Виконуй зарядку та математичну розминку п'ять днів за тиждень (+1 💎 / 1 €)!",
      crystals: 1,
      coins: 30,
      xp: 130,
      icon: "📐",
      current: 0,
      max: 5
    }
  ]
};

// =========================================================
// КАТАЛОГ ПОЗ ТА ДІЙ ДАНІКИ (AVATAR WORLD + TAMAGOTCHI)
// =========================================================
const DANIKA_POSES_CATALOG = {
  danika_candy: {
    id: "danika_candy",
    name: "Їсть льодяник",
    category: "food",
    icon: "🍭",
    file: "assets/characters/poses/danika_candy.png?v=20261005_1",
    speech: "Ммм, який смачний полунично-веселковий льодяник!",
    vitality: { hunger: 15, happiness: 15, energy: 5, hygiene: -5 },
    particles: ["🍭", "🍬", "✨", "😋"],
    unlockedByDefault: true,
    costCoins: 0,
    costXp: 0,
    costEnergy: 0,
    tierLabel: "🎁 Базова дія"
  },
  danika_icecream: {
    id: "danika_icecream",
    name: "Їсть морозиво",
    category: "food",
    icon: "🍦",
    file: "assets/characters/poses/danika_icecream.png?v=20261005_1",
    speech: "Обожнюю потрійне полунично-шоколадне морозиво!",
    vitality: { hunger: 20, happiness: 20, energy: 5 },
    particles: ["🍦", "🍨", "🍓", "💖"],
    unlockedByDefault: false,
    costCoins: 100,
    costXp: 495,
    costEnergy: 200,
    tierLabel: "🔵 Яскрава емоція"
  },
  danika_pizza_chef: {
    id: "danika_pizza_chef",
    name: "Шеф-піца",
    category: "food",
    icon: "🍕",
    file: "assets/characters/poses/danika_pizza_chef.png?v=20261005_1",
    speech: "Гаряча піца Маргарита з тягучим сиром готова! Смачного!",
    vitality: { hunger: 25, happiness: 15, energy: -5 },
    particles: ["🍕", "🧀", "👨‍🍳", "✨"],
    unlockedByDefault: false,
    costCoins: 150,
    costXp: 740,
    costEnergy: 295,
    tierLabel: "🟣 Супер-талант"
  },
  danika_hot_cocoa: {
    id: "danika_hot_cocoa",
    name: "Гаряче какао",
    category: "food",
    icon: "☕",
    file: "assets/characters/poses/danika_hot_cocoa.png?v=20261005_1",
    speech: "Тепле какао з маршмелоу зігріває душу!",
    vitality: { hunger: 10, energy: 15, happiness: 15 },
    particles: ["☕", "🧁", "✨", "🤍"],
    unlockedByDefault: false,
    costCoins: 70,
    costXp: 360,
    costEnergy: 145,
    tierLabel: "🟢 Затишна дія"
  },
  danika_reading: {
    id: "danika_reading",
    name: "Читає книжку",
    category: "study",
    icon: "📖",
    file: "assets/characters/poses/danika_reading.png?v=20261005_1",
    speech: "Ця казка про чарівні острови просто неймовірна!",
    vitality: { happiness: 15, energy: -5 },
    particles: ["📖", "✨", "⭐", "🏰"],
    unlockedByDefault: true,
    costCoins: 0,
    costXp: 0,
    costEnergy: 0,
    tierLabel: "🎁 Базова дія"
  },
  danika_school_desk: {
    id: "danika_school_desk",
    name: "Уроки за партою",
    category: "study",
    icon: "✏️",
    file: "assets/characters/poses/danika_school_desk.png?v=20261005_1",
    speech: "Я старанно вирішую математику та пишу диктант!",
    vitality: { happiness: 10, energy: -10 },
    particles: ["✏️", "📐", "📝", "🌟"],
    unlockedByDefault: false,
    costCoins: 70,
    costXp: 360,
    costEnergy: 145,
    tierLabel: "🟢 Повсякденна дія"
  },
  danika_scientist: {
    id: "danika_scientist",
    name: "Вчений-дослідник",
    category: "study",
    icon: "🔬",
    file: "assets/characters/poses/danika_scientist.png?v=20261005_1",
    speech: "Дивись у мікроскоп! Тут цілий мікросвіт!",
    vitality: { happiness: 20, energy: -5 },
    particles: ["🔬", "🧪", "💡", "🧬"],
    unlockedByDefault: false,
    costCoins: 150,
    costXp: 740,
    costEnergy: 295,
    tierLabel: "🟣 Супер-талант"
  },
  danika_painting: {
    id: "danika_painting",
    name: "Малює картину",
    category: "study",
    icon: "🎨",
    file: "assets/characters/poses/danika_painting.png?v=20261005_1",
    speech: "Я малюю синє море Гандії та яскраве сонечко!",
    vitality: { happiness: 25, energy: -5, hygiene: -5 },
    particles: ["🎨", "🖌️", "🌈", "✨"],
    unlockedByDefault: false,
    costCoins: 110,
    costXp: 560,
    costEnergy: 225,
    tierLabel: "🔵 Творче хобі"
  },
  danika_phone: {
    id: "danika_phone",
    name: "Дзвонить мамі",
    category: "play",
    icon: "📱",
    file: "assets/characters/poses/danika_phone.png?v=20261005_1",
    speech: "Алло, мамочко! Я вже виконала всі завдання на сьогодні!",
    vitality: { happiness: 15 },
    particles: ["📱", "💬", "💖", "✨"],
    unlockedByDefault: false,
    costCoins: 70,
    costXp: 360,
    costEnergy: 145,
    tierLabel: "🟢 Повсякденна дія"
  },
  danika_ball: {
    id: "danika_ball",
    name: "Грає в м'яч",
    category: "play",
    icon: "⚽",
    file: "assets/characters/poses/danika_ball.png?v=20261005_1",
    speech: "Пас! Лови м'ячик! Гооол!",
    vitality: { happiness: 25, energy: -15, hunger: -10 },
    particles: ["⚽", "⚡", "🏃‍♀️", "🎉"],
    unlockedByDefault: true,
    costCoins: 0,
    costXp: 0,
    costEnergy: 0,
    tierLabel: "🎁 Базова дія"
  },
  danika_skating: {
    id: "danika_skating",
    name: "Катається на скейті",
    category: "play",
    icon: "🛹",
    file: "assets/characters/poses/danika_skating.png?v=20261005_1",
    speech: "Вітер у волоссі! Я роблю крутий віраж на скейті!",
    vitality: { happiness: 30, energy: -15, hygiene: -10 },
    particles: ["🛹", "💨", "🔥", "✨"],
    unlockedByDefault: false,
    costCoins: 160,
    costXp: 810,
    costEnergy: 325,
    tierLabel: "🟣 Супер-талант"
  },
  danika_dance: {
    id: "danika_dance",
    name: "Танцює брейк",
    category: "play",
    icon: "💃",
    file: "assets/characters/poses/danika_dance.png?v=20261005_1",
    speech: "Танцюємо під улюблений біт! Раз, два, поворот!",
    vitality: { happiness: 25, energy: -15 },
    particles: ["💃", "🎶", "✨", "⭐"],
    unlockedByDefault: false,
    costCoins: 160,
    costXp: 810,
    costEnergy: 325,
    tierLabel: "🟣 Супер-талант"
  },
  danika_music: {
    id: "danika_music",
    name: "Слухає музику",
    category: "play",
    icon: "🎧",
    file: "assets/characters/poses/danika_music.png?v=20261005_1",
    speech: "Цей трек заряджає суперським настроєм!",
    vitality: { happiness: 20, energy: 10 },
    particles: ["🎧", "🎵", "🎶", "💜"],
    unlockedByDefault: false,
    costCoins: 100,
    costXp: 495,
    costEnergy: 200,
    tierLabel: "🔵 Яскраве хобі"
  },
  danika_walk_bruno: {
    id: "danika_walk_bruno",
    name: "Вигулює Бруно",
    category: "care",
    icon: "🐕",
    file: "assets/characters/poses/danika_walk_bruno.png?v=20261005_1",
    speech: "Бруно, ходімо гуляти на набережну Середземного моря!",
    vitality: { happiness: 25, energy: -10, hunger: -5 },
    particles: ["🐾", "🐕", "❤️", "🌿"],
    unlockedByDefault: false,
    costCoins: 120,
    costXp: 610,
    costEnergy: 245,
    tierLabel: "🔵 Дружба з Бруно"
  },
  danika_groceries: {
    id: "danika_groceries",
    name: "Несе продукти",
    category: "care",
    icon: "🛍️",
    file: "assets/characters/poses/danika_groceries.png?v=20261005_1",
    speech: "Я допомогла мамі з покупками! Тут свіжі апельсини та багет!",
    vitality: { happiness: 15, energy: -10 },
    particles: ["🛍️", "🥖", "🍊", "💪"],
    unlockedByDefault: false,
    costCoins: 100,
    costXp: 495,
    costEnergy: 200,
    tierLabel: "🔵 Помічниця"
  },
  danika_cleaning: {
    id: "danika_cleaning",
    name: "Прибирає кімнату",
    category: "care",
    icon: "🧹",
    file: "assets/characters/poses/danika_cleaning.png?v=20261005_1",
    speech: "Чистота — запорука затишку! Все блищить!",
    vitality: { happiness: 15, energy: -10, hygiene: 10 },
    particles: ["🧹", "✨", "🫧", "🌟"],
    unlockedByDefault: false,
    costCoins: 70,
    costXp: 360,
    costEnergy: 145,
    tierLabel: "🟢 Повсякденна дія"
  },
  danika_gardening: {
    id: "danika_gardening",
    name: "Поливає квіти",
    category: "care",
    icon: "🪴",
    file: "assets/characters/poses/danika_gardening.png?v=20261005_1",
    speech: "Пийте свіжу водичку, мої гарні квіточки!",
    vitality: { happiness: 20, energy: -5 },
    particles: ["🪴", "💧", "🌸", "🌿"],
    unlockedByDefault: false,
    costCoins: 110,
    costXp: 560,
    costEnergy: 225,
    tierLabel: "🔵 Турбота про природу"
  },
  danika_brush_teeth: {
    id: "danika_brush_teeth",
    name: "Чистить зубки",
    category: "care",
    icon: "🪥",
    file: "assets/characters/poses/danika_brush_teeth.png?v=20261005_1",
    speech: "М'ятна пінка! Мої зубки сяють білизною!",
    vitality: { hygiene: 40, health: 10, happiness: 5 },
    particles: ["🪥", "✨", "🫧", "😁"],
    unlockedByDefault: true,
    costCoins: 0,
    costXp: 0,
    costEnergy: 0,
    tierLabel: "🎁 Базова дія"
  },
  danika_bubble_bath: {
    id: "danika_bubble_bath",
    name: "Купається з піною",
    category: "care",
    icon: "🛁",
    file: "assets/characters/poses/danika_bubble_bath.png?v=20261005_1",
    speech: "Буль-буль! Тепла ванна з густою запашною піною!",
    vitality: { hygiene: 50, happiness: 25, energy: 10 },
    particles: ["🛁", "🫧", "🦆", "💖"],
    unlockedByDefault: false,
    costCoins: 150,
    costXp: 740,
    costEnergy: 295,
    tierLabel: "🟣 Релакс-емоція"
  },
  danika_sleeping: {
    id: "danika_sleeping",
    name: "Солодко спить",
    category: "health",
    icon: "💤",
    file: "assets/characters/poses/danika_sleeping.png?v=20261005_1",
    speech: "Хрр... Мені сняться чарівні сни про поні та замки... 🌙",
    vitality: { energy: 50, health: 15 },
    particles: ["💤", "🌙", "⭐", "🧸"],
    unlockedByDefault: true,
    costCoins: 0,
    costXp: 0,
    costEnergy: 0,
    tierLabel: "🎁 Базова дія"
  },
  danika_sick: {
    id: "danika_sick",
    name: "Захворіла",
    category: "health",
    icon: "🤒",
    file: "assets/characters/poses/danika_sick.png?v=20261005_1",
    speech: "Ой, у мене гарячка... Потрібен теплий чай з малиною та мамині обійми...",
    vitality: { health: -20, energy: -20, happiness: -15 },
    particles: ["🤒", "🌡️", "🍵", "❤️‍🩹"],
    unlockedByDefault: false,
    costCoins: 65,
    costXp: 315,
    costEnergy: 125,
    tierLabel: "🟢 Емоція турботи"
  },
  danika_crying: {
    id: "danika_crying",
    name: "Сумує і плаче",
    category: "health",
    icon: "😢",
    file: "assets/characters/poses/danika_crying.png?v=20261005_1",
    speech: "Хлип-хлип... Обніміть мене, будь ласка...",
    vitality: { happiness: -30, energy: -10 },
    particles: ["💧", "🥺", "💔", "🫂"],
    unlockedByDefault: false,
    costCoins: 65,
    costXp: 315,
    costEnergy: 125,
    tierLabel: "🟢 Емоція співчуття"
  },
  danika_princess_magic: {
    id: "danika_princess_magic",
    name: "Магія принцеси",
    category: "health",
    icon: "👑",
    file: "assets/characters/poses/danika_princess_magic.png?v=20261005_1",
    speech: "Силою чарівної палички дарую всім щастя і радість!",
    vitality: { happiness: 35, energy: 20, health: 20 },
    particles: ["👑", "🪄", "✨", "💖"],
    unlockedByDefault: false,
    costCoins: 200,
    costXp: 990,
    costEnergy: 395,
    tierLabel: "👑 Королівська магія"
  }
};


// =========================================================
// КОЛЕКЦІЇ СЮРПРИЗІВ (VARIABLE MYSTERY REWARDS)
// =========================================================
const MYSTERY_STICKERS = [
  { id: "stk_bruno_ball", name: "Бруно з м'ячиком", icon: "🐶", desc: "Радісний пес Бруно грається на сонечку!", rarity: "Рідкісна ⭐" },
  { id: "stk_star_gold", name: "Золота Зірочка", icon: "⭐", desc: "Сяюча нагорода за чудову старанність!", rarity: "Звичайна" },
  { id: "stk_unicorn_magic", name: "Чарівний Єдиноріг", icon: "🦄", desc: "Казковий друг для затишних солодких снів!", rarity: "Супер-рідкісна 🌟" },
  { id: "stk_sun_gandia", name: "Сонечко Гандії", icon: "☀️", desc: "Тепле середземноморське сонце Іспанії!", rarity: "Звичайна" },
  { id: "stk_princess_crown", name: "Корона Принцеси", icon: "👑", desc: "Справжня королівська прикраса юної леді!", rarity: "Рідкісна ⭐" },
  { id: "stk_rainbow_sky", name: "Яскрава Веселка", icon: "🌈", desc: "Кольорова дуга радості після теплого літнього дощу!", rarity: "Звичайна" },
  { id: "stk_strawberry_ice", name: "Полуничне Морозиво", icon: "🍦", desc: "Найсмачніший солодкий літній десерт!", rarity: "Звичайна" },
  { id: "stk_butterfly_lorca", name: "Золотий Метелик", icon: "🦋", desc: "Легкий метелик Mariposa із віршика Лорки!", rarity: "Рідкісна ⭐" },
  { id: "stk_super_danika", name: "Супер-Даніка", icon: "✨", desc: "Емблема відважної дослідниці реального світу!", rarity: "Супер-рідкісна 🌟" },
  { id: "stk_magic_gem", name: "Кристал Мрій", icon: "💎", desc: "Сяючий небесно-блакитний сапфір удачі!", rarity: "Рідкісна ⭐" },
  { id: "stk_bat_valencia", name: "Кажанчик Валенсії", icon: "🦇", desc: "Симпатичний крилатий захисник регіону!", rarity: "Звичайна" },
  { id: "stk_paw_heart", name: "Лапка Дружби", icon: "🐾", desc: "Вірний відбиток лапки твого чорного пінчера!", rarity: "Звичайна" }
];

const FAMILY_LOVE_NOTES = [
  { id: "note_mom_1", from: "Мама Ксюша ❤️", text: "Данічка, ти наше найяскравіше сонечко! Твоя старанність сьогодні осяяла весь дім!", date: "Сьогодні" },
  { id: "note_dad_1", from: "Тато 👨‍✈️", text: "Ти справжній капітан нашої сім'ї! Пишаюся твоєю цілеспрямованістю та порядком!", date: "Сьогодні" },
  { id: "note_mom_2", from: "Мама Ксюша ❤️", text: "Дякую за твою допомогу, моя розумничко! З тобою вдома завжди тепло і радісно!", date: "Сьогодні" },
  { id: "note_dad_2", from: "Тато 👨‍✈️", text: "Секретний комплімент: твоя щира посмішка заряджає нас щастям на цілий день!", date: "Сьогодні" },
  { id: "note_bruno", from: "Песик Бруно 🐾", text: "Гав-гав! Ти найкраща господиня у світі! Я люблю тебе більше за всі смаколики на землі!", date: "Сьогодні" },
  { id: "note_grandma", from: "Бабуся 👵", text: "Обіймаю тебе міцно-міцно! Ти моя найрозумніша онучечка-зірочка!", date: "Сьогодні" }
];

const BRUNO_SPECIAL_GIFTS = [
  { id: "gift_gold_ball", name: "Сяючий Золотий М'ячик 🎾", desc: "Супер-пружний м'ячик, від якого Бруно в захваті!", icon: "🎾" },
  { id: "gift_cheese_bone", name: "Смачна Сирна Кісточка 🦴", desc: "Улюблені хрусткі ласощі для песика!", icon: "🦴" },
  { id: "gift_bell_collar", name: "Дзвінкий Срібний Дзвіночок 🔔", desc: "Красивий аксесуар для нашийника Бруно!", icon: "🔔" },
  { id: "gift_squeak_duck", name: "М'яка Пищалка-Качечка 🦆", desc: "Весела іграшка для тренувань у кімнаті!", icon: "🦆" },
  { id: "gift_beef_treat", name: "Королівський Стейк для Хвостика 🥩", desc: "Святковий смаколик за чудову поведінку!", icon: "🥩" }
];

if (typeof window !== 'undefined') {
  window.DEFAULT_APP_DATA = DEFAULT_APP_DATA;
  window.DEFAULT_DATA = DEFAULT_APP_DATA;
  window.MYSTERY_STICKERS = MYSTERY_STICKERS;
  window.FAMILY_LOVE_NOTES = FAMILY_LOVE_NOTES;
  window.BRUNO_SPECIAL_GIFTS = BRUNO_SPECIAL_GIFTS;
}
