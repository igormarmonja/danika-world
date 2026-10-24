/**
 * Danika World: Interactive Animated NPCs for all Gandia Locations
 * Avatar World / Toca Life animated characters with voice dialogues, drag & drop, item holding and emotions.
 */
const GAME_NPC_CHARACTERS = {
  loc_hotel: {
    id: "char_hotel_leo",
    name: "Лео",
    role: "Гранд-Консьєрж Готелю 🛎️",
    badge: "VIP Concierge",
    sprite: "assets/characters/char_hotel_leo.png",
    defaultRoom: 0,
    defaultXPct: 72,
    defaultBottomPx: 54,
    greetingSound: "chime",
    quotes: [
      "Добрий день, міледі Даніко! Ласкаво просимо до нашого найкращого гранд-готелю! 🛎️✨",
      "Ваш королівський люкс з балдахіном на 5 поверсі повністю готовий! Бажаєте замовити круасани? 🥐🍓",
      "Якщо зателефонуєте у золотий дзвіночок на рецепції — я миттєво доставлю ваш багаж! 🧳🔔",
      "Сьогодні на даху біля панорамного басейну чудова сонячна погода! 🏖️🍹",
      "Бажаю вам найчарівнішого відпочинку у Danika Hotel! 👑🌟"
    ],
    particles: ["🛎️", "⭐", "✨", "👑", "🥐"]
  },
  loc_petshop: {
    id: "char_pet_nicole",
    name: "Ніколь",
    role: "Ветеринар та Грумер «Лапки & Хвостики» 🐾",
    badge: "Pet Spa & Vet",
    sprite: "assets/characters/char_pet_nicole.png",
    defaultRoom: 0,
    defaultXPct: 68,
    defaultBottomPx: 54,
    greetingSound: "magic",
    quotes: [
      "Привіт, Даніко та Бруно! 🐾 Який же Бруно гарненький! Хоче смаколиків чи теплу пінну ванночку? 🛁🐶",
      "У нас щойно привезли нові іграшки з пискавками та золотих рибок в акваріум! 🐠🦴",
      "Ходімо послухаємо серденько Бруно стетоскопом — він справжній здоровий герой! 🩺❤️",
      "Після теплого спа-душу та сушки хутро Бруно сяє мов шовк! ✨🐕",
      "У дитячому садку для тваринок кошенята вже чекають на гру з бантиком! 🐱🎾"
    ],
    particles: ["🐾", "🦴", "💖", "✨", "🐶", "🐱"]
  },
  loc_abece: {
    id: "char_school_mateo",
    name: "Матео",
    role: "Однокласник та Відмінник 🎒",
    badge: "Colegio Abecé",
    sprite: "assets/characters/char_school_mateo.png",
    defaultRoom: 0,
    defaultXPct: 68,
    defaultBottomPx: 54,
    greetingSound: "bell",
    quotes: [
      "¡Hola, Danika! Привіт! Готова сьогодні отримати 12 балів з математики? 📐🎒",
      "Я приніс нову кольорову енциклопедію про космос! Ходімо читати разом! 🚀⭐",
      "На перерві обов'язково підемо в спортзал грати в баскетбол! 🏀👟",
      "У шкільній їдальні сьогодні найсмачніший полуничний компот! 🍓🥪",
      "Ти чудово виступаєш на уроках іспанської, Даніко! 🌟🇪🇸"
    ],
    particles: ["📚", "📐", "⭐", "🎒", "✏️"]
  },
  loc_vital: {
    id: "char_mall_chloe",
    name: "Хлоя",
    role: "Стилістка та Модниця ТЦ «La Vital» 🛍️",
    badge: "Fashion Stylist",
    sprite: "assets/characters/char_mall_chloe.png",
    defaultRoom: 0,
    defaultXPct: 70,
    defaultBottomPx: 54,
    greetingSound: "sparkle",
    quotes: [
      "Вау, Даніко! Твій стиль просто неперевершений! Поглянь на нові суконьки та аксесуари! 👗✨",
      "Сьогодні в ТЦ фестиваль солодких коктейлів та рожевої вати! Хочеш спробувати? 🍧🛍️",
      "Ти виглядаєш як справжня зірка з обкладинки модного журналу! 💖🌟",
      "На третьому поверсі відкрили нову фотобудку з милими стікерами! Ходімо фотографуватися! 📸🎀",
      "У магазині іграшок з'явилися величезні плюшеві єдинороги! 🦄✨"
    ],
    particles: ["🛍️", "💖", "🎀", "✨", "👗", "🌸"]
  },
  loc_beach: {
    id: "char_beach_lucas",
    name: "Лукас",
    role: "Серфер та Рятувальник Узбережжя 🏖️",
    badge: "Gandia Beach",
    sprite: "assets/characters/char_beach_lucas.png",
    defaultRoom: 0,
    defaultXPct: 66,
    defaultBottomPx: 54,
    greetingSound: "splash",
    quotes: [
      "Алоха, Даніко! Хвилі на пляжі Platja de Gandia сьогодні просто супер теплі! 🌊🏄‍♂️",
      "Ми з Бруно щойно знайшли красиву морську мушлю! Послухай, як у ній шумить море! 🐚☀️",
      "Стрибаймо на рожевого фламінго та покатаймося біля яхти! 🦩🚤",
      "Обережно із сонцем — тримай сонцезахисні окуляри та смачний кокосовий напій! 🥥🕶️",
      "Пляж Гандії — це найкраще місце у всьому Середземномор'ї! 🌴🌊"
    ],
    particles: ["🌊", "🏄‍♂️", "🐚", "🌴", "☀️", "🦩"]
  },
  loc_park: {
    id: "char_park_sofia",
    name: "Софія",
    role: "Ролерка та Еколог Парку 🌳",
    badge: "Parc de l'Estacio",
    sprite: "assets/characters/char_park_sofia.png",
    defaultRoom: 0,
    defaultXPct: 68,
    defaultBottomPx: 54,
    greetingSound: "birds",
    quotes: [
      "Привіт, Даніко! Я навчилася робити новий трюк на роликах навколо фонтану! 🛼✨",
      "Дивись, у собачому парку Бруно вже знайшов собі нових друзів-цуценят! 🐕🌳",
      "Ходімо з'їмо полуничне морозиво біля квіткової алеї! 🍦🌸",
      "У парковому ставку качечки чекають на свіжі хлібні крихти! 🦆🌼",
      "Паркове повітря надихає на справжні пригоди та веселощі! 🍃🌟"
    ],
    particles: ["🛼", "🌸", "🍃", "🍦", "🦆", "🌼"]
  },
  loc_mercadona: {
    id: "char_market_pepe",
    name: "Пепе",
    role: "Головний Пекар Супермаркету «Mercadona» 🛒",
    badge: "Mercadona Bakery",
    sprite: "assets/characters/char_market_pepe.png",
    defaultRoom: 0,
    defaultXPct: 68,
    defaultBottomPx: 54,
    greetingSound: "bell",
    quotes: [
      "¡Buenos días, Danika! Щойно з печі дістав гарячі запашні круасани та багети! 🥖🥐",
      "У нас найсоковитіші валенсійські апельсини! Тобі вичавити свіжого соку? 🍊🧃",
      "Тримай найсмачніше хрустке печиво для тебе та шматочок смаколику для Бруно! 🍪🐶",
      "На полицях повний порядок: свіжі ягоди, хлібчик та шоколад! 🍫🍇",
      "Смачного та гарного настрою, юна капітанко! 🛒✨"
    ],
    particles: ["🥐", "🥖", "🍊", "🍪", "🛒", "✨"]
  },
  loc_chachi: {
    id: "char_cafe_nico",
    name: "Ніко",
    role: "Веселий Аніматор Свята «Chachi Piruli» 🎈",
    badge: "Party Master",
    sprite: "assets/characters/char_cafe_nico.png",
    defaultRoom: 0,
    defaultXPct: 68,
    defaultBottomPx: 54,
    greetingSound: "celebrate",
    quotes: [
      "Урааа, Даніко! Ласкаво просимо на найбільшу дитячу вечірку в Гандії! 🎈🎉",
      "Хто перший добіжить до надувного батута та басейну з кульками — той отримує супер-приз! 🏰🤹",
      "Лови мильні бульбашки та загадуй найзаповітніше бажання! 🫧✨",
      "У нашому кафе подають найяскравіші фруктові десерти з вишеньками! 🍒🍰",
      "Танцюймо разом святковий танець дружби! 🥳🎵"
    ],
    particles: ["🎈", "🎉", "🍰", "🥳", "🫧", "🎵"]
  }
};
