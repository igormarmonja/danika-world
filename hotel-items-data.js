/**
 * Danika Hotel & Mascotas: Luxury High-Definition 2D Interactive Props Catalog
 * Beautiful raster illustrated assets matching room interiors with drop-shadows and physics.
 */
const DANIKA_HOTEL_CATEGORIES = {
  all: { id: "all", title: "Всі предмети ✨" },
  reception: { id: "reception", title: "Рецепція 🛎️" },
  suite: { id: "suite", title: "Люкс 👑" },
  cafe: { id: "cafe", title: "Кафе-Буфет 🥐" },
  pool: { id: "pool", title: "Басейн & Спа 🏖️" },
  mascotas: { id: "mascotas", title: "Mascotas 🐾" }
};

const DANIKA_HOTEL_ITEMS_CATALOG = [
  // --- RECEPTION ---
  {
    id: "h_bell_gold",
    title: "Золотий дзвінок консьєржа 🛎️",
    category: "reception",
    type: "interactive",
    sound: "bell",
    defaultRoom: 0,
    initialPlaced: true,
    leftPct: 51,
    bottomPct: 38,
    img: "assets/furniture/hotel_items/reception_bell.png"
  },
  {
    id: "h_key_gold",
    title: "VIP Золотий ключ з китицею 🗝️",
    category: "reception",
    type: "interactive",
    sound: "sparkle",
    defaultRoom: 0,
    initialPlaced: true,
    leftPct: 60,
    bottomPct: 38,
    img: "assets/furniture/hotel_items/reception_key.png"
  },
  {
    id: "h_luggage_trolley",
    title: "Золотий візок з валізами 🧳",
    category: "reception",
    type: "furniture",
    sound: "click",
    defaultRoom: 0,
    initialPlaced: true,
    leftPct: 15,
    bottomPct: 22,
    img: "assets/furniture/hotel_items/reception_trolley.png"
  },

  // --- SUITE ---
  {
    id: "h_pancake_cloche",
    title: "Сніданок: полуничні панкейки 🥞",
    category: "suite",
    type: "food",
    sound: "munch",
    defaultRoom: 1,
    initialPlaced: true,
    leftPct: 48,
    bottomPct: 32,
    img: "assets/furniture/hotel_items/suite_pancakes.png"
  },
  {
    id: "h_perfume_crystal",
    title: "Кришталеві парфуми Даніки ✨",
    category: "suite",
    type: "interactive",
    sound: "magic",
    defaultRoom: 1,
    initialPlaced: true,
    leftPct: 78,
    bottomPct: 40,
    img: "assets/furniture/hotel_items/suite_perfume.png"
  },

  // --- CAFE / BUFFET ---
  {
    id: "h_croissant_butter",
    title: "Французький масляний круасан 🥐",
    category: "cafe",
    type: "food",
    sound: "munch",
    defaultRoom: 2,
    initialPlaced: true,
    leftPct: 38,
    bottomPct: 34,
    img: "assets/furniture/hotel_items/cafe_croissant.png"
  },
  {
    id: "h_orange_carafe",
    title: "Графин з апельсиновим фрешем 🍊",
    category: "cafe",
    type: "drink",
    sound: "sip",
    defaultRoom: 2,
    initialPlaced: true,
    leftPct: 56,
    bottomPct: 36,
    img: "assets/furniture/hotel_items/cafe_juice.png"
  },

  // --- POOL / ROOFTOP ---
  {
    id: "h_flamingo_float",
    title: "Надувний рожевий фламінго 🦩",
    category: "pool",
    type: "interactive",
    sound: "pop",
    defaultRoom: 3,
    initialPlaced: true,
    leftPct: 45,
    bottomPct: 25,
    img: "assets/furniture/hotel_items/pool_flamingo.png"
  },
  {
    id: "h_tiki_cocktail",
    title: "Тропічний коктейль у кокосі 🍹",
    category: "pool",
    type: "drink",
    sound: "sip",
    defaultRoom: 3,
    initialPlaced: true,
    leftPct: 75,
    bottomPct: 32,
    img: "assets/furniture/hotel_items/pool_cocktail.png"
  },
  {
    id: "h_spa_towels",
    title: "Спа-рушники з тропічною квіткою 🧖",
    category: "pool",
    type: "interactive",
    sound: "rustle",
    defaultRoom: 3,
    initialPlaced: true,
    leftPct: 20,
    bottomPct: 28,
    img: "assets/furniture/hotel_items/pool_spa_towels.png"
  },

  // --- MASCOTAS PETS ---
  {
    id: "m_treats_jar",
    title: "Преміальні кісточки & ласощі 🦴",
    category: "mascotas",
    type: "food",
    sound: "munch",
    defaultRoom: 0,
    initialPlaced: true,
    leftPct: 35,
    bottomPct: 30,
    img: "assets/furniture/hotel_items/mascotas_treats.png"
  },
  {
    id: "m_shampoo_bottle",
    title: "Спа-шампунь для улюбленців 🧴",
    category: "mascotas",
    type: "interactive",
    sound: "bubble",
    defaultRoom: 1,
    initialPlaced: true,
    leftPct: 42,
    bottomPct: 32,
    img: "assets/furniture/hotel_items/mascotas_shampoo.png"
  },
  {
    id: "m_grooming_brush",
    title: "М'яка щітка для шерсті 🪮",
    category: "mascotas",
    type: "interactive",
    sound: "rustle",
    defaultRoom: 1,
    initialPlaced: true,
    leftPct: 65,
    bottomPct: 32,
    img: "assets/furniture/hotel_items/mascotas_brush.png"
  },
  {
    id: "m_vet_kit",
    title: "Валізка ветеринара Mascotas 🩺",
    category: "mascotas",
    type: "interactive",
    sound: "magic",
    defaultRoom: 3,
    initialPlaced: true,
    leftPct: 50,
    bottomPct: 28,
    img: "assets/furniture/hotel_items/mascotas_vetkit.png"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DANIKA_HOTEL_CATEGORIES,
    DANIKA_HOTEL_ITEMS_CATALOG
  };
}
