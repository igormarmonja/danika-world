// ============================================================================
// DANIKA & BRUNO: SPIRITFARER 2D WIDE INTERACTIVE WORLD (v20261120_3)
// 6 панорамних 2-поверхових локацій Гандії, плавна 8-кадрова анімація ходьби
// Даніки та твого Бруно, точні сходи по малюнку, інтерактивна Карта Гандії,
// 12 квестів, система рівнів, скарбів, відкриття локацій та одягу за прогрес!
// ============================================================================

(function () {
  const SAVE_KEY = 'danika_spirit_world_v2';
  const ASSET_VER = '20261120_3';

  class DanikaSpiritWorld2D {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.canvas = null;
      this.ctx = null;
      this.animFrameId = null;
      this.lastTime = 0;

      this.WORLD_W = 2400;
      this.WORLD_H = 1350;

      // Прогрес гравця (зберігається в localStorage)
      this.progress = this.loadProgress();
      this.currentRoom = this.progress.lastRoom || 'villa';

      // Камера
      this.camera = {
        x: 0,
        y: 0,
        zoomMode: 'follow'
      };

      // Стан Даніки
      this.player = {
        x: 920,
        y: 1135,
        vx: 0,
        vy: 0,
        facing: 1,
        onGround: true,
        walkFrame: 0,
        walkTimer: 0,
        actionTimer: 0,
        outfitId: this.progress.activeOutfit || 'gandia_polo',
        heldFood: null,
        // Авто-ходьба по сходах або до точки кліку
        stairClimb: null, // { path, segIdx, t, dir, targetFloor }
        navTarget: null   // { x, y }
      };

      // Стан песика Бруно (твій фірмовий Бруно + 8-кадрова ходьба!)
      this.bruno = {
        x: 780,
        y: 1135,
        vx: 0,
        vy: 0,
        facing: 1,
        skinId: this.progress.activeBrunoSkin || 'custom_bruno',
        walkTimer: 0,
        isMoving: false,
        flipTimer: 0,
        barkBubbleTimer: 0,
        barkText: 'Гав-гав! 🐾'
      };

      // Врятовані улюбленці
      this.companionPets = [];
      this.droppedCoins = [];
      this.particles = [];
      this.floatingTexts = [];

      // Керування
      this.keys = {};
      this.joyVec = { x: 0, y: 0 };

      this.stationStates = {
        ovenBaking: 0,
        cauldronBubbling: 0,
        fountainActive: 0
      };

      // 12 сюжетних квестів по всіх 6 локаціях
      this.questDefs = [
        { id: 'q_villa_bake', room: 'villa', title: '🧁 Вілла: Спечи Полуничний Кекс на кухні!', rewardCoins: 25, rewardXp: 35 },
        { id: 'q_villa_loft', room: 'villa', title: '🪜 Вілла: Піднімися сходами на 2-й поверх до балкону!', rewardCoins: 20, rewardXp: 30 },
        { id: 'q_acad_pet', room: 'academy', title: '🛁 Академія: Приручи нового друга у Кришталевому Спа!', rewardCoins: 25, rewardXp: 40 },
        { id: 'q_acad_chest', room: 'academy', title: '☁️ Академія: Піднімися хмарними сходами до Небесної Скрині!', rewardCoins: 30, rewardXp: 45 },
        { id: 'q_beach_icecream', room: 'beach', title: '🍦 Пляж: Пригости Бруно морозивом біля кіоску!', rewardCoins: 25, rewardXp: 35 },
        { id: 'q_beach_lighthouse', room: 'beach', title: '🗼 Пляж: Піднімися на Маяк Гандії та знайди Скриню Піратів!', rewardCoins: 35, rewardXp: 50 },
        { id: 'q_hotel_smoothie', room: 'hotel', title: '🍹 Готель: Приготуй тропічний смузі в лобі-барі!', rewardCoins: 30, rewardXp: 45 },
        { id: 'q_hotel_slide', room: 'hotel', title: '🏊‍♀️ Готель: Піднімися сходами на дах та з’їдь із водної гірки!', rewardCoins: 35, rewardXp: 55 },
        { id: 'q_park_agility', room: 'petpark', title: '🐾 Парк Бруно: Пройди смугу перешкод і кільця з Бруно!', rewardCoins: 35, rewardXp: 50 },
        { id: 'q_park_treehouse', room: 'petpark', title: '🌳 Парк Бруно: Піднімися на будиночок на дереві до телескопа!', rewardCoins: 40, rewardXp: 60 },
        { id: 'q_boutique_show', room: 'boutique', title: '👗 Бутік: Влаштуй модний показ перед чарівним дзеркалом!', rewardCoins: 40, rewardXp: 60 },
        { id: 'q_boutique_attic', room: 'boutique', title: '💎 Бутік: Піднімися золотими сходами до Кришталевого Горища Скарбів!', rewardCoins: 60, rewardXp: 90 }
      ];

      // Каталог одягу з прогресією (відкривається за монетки та рівні!)
      this.wardrobeCatalog = {
        danika: [
          { id: 'gandia_polo', title: '👕 Поло Colegio Abecé', cost: 0, reqLevel: 1, src: 'assets/characters/pixar/danika_pixar_base.jpg', crop: { x: 0, y: 0, w: 1, h: 1 } },
          { id: 'kawaii_hoodie', title: '🍓 Полуничне Худі', cost: 40, reqLevel: 1, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
          { id: 'princess_rose', title: '👑 Принцеса Троянд', cost: 65, reqLevel: 2, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0, w: 0.5, h: 0.5 } },
          { id: 'fairy_sky', title: '🧚‍♀️ Небесна Фея', cost: 90, reqLevel: 3, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
          { id: 'teacher_suit', title: '👩‍🏫 Вчителька Академії', cost: 110, reqLevel: 3, src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
        ],
        bruno: [
          { id: 'custom_bruno', title: '🐶 Справжній Бруно', cost: 0, reqLevel: 1, src: 'assets/characters/pixar/bruno_idle_custom.png', crop: { x: 0, y: 0, w: 1, h: 1 } },
          { id: 'king_crown', title: '👑 Король Бруно', cost: 50, reqLevel: 2, src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } }
        ],
        pets: [
          { id: 'pixar_kitten', title: '🐱 Кошеня Мурчик', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
          { id: 'pixar_unicorn', title: '🦄 Єдиноріг Зірочка', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
        ]
      };

      // Освітні міні-завдання
      this.challenges = [
        { q: '🧁 Рецепт Шефа: 6 полуничок + 4 вишеньки. Скільки всього ягідок?', options: ['10 ягідок 🍓', '9 ягідок', '11 ягідок'], correct: 0 },
        { q: '🇪🇸 Іспанська в Гандії: Як сказати «Море і Сонце»?', options: ['Mar y Sol ☀️🌊', 'Perro y Gato 🐶🐱', 'Casa Azul 🏠'], correct: 0 },
        { q: '🧪 Алхімія: Який колір вийде, якщо змішати Синій і Жовтий?', options: ['Червоний 🔴', 'Зелений 🟢', 'Фіолетовий 🟣'], correct: 1 },
        { q: '🐾 Бруно рахує: У Бруно 4 лапки, і у Кошеняти 4 лапки. Скільки разом?', options: ['6 лапок', '8 лапок 🐾', '10 лапок'], correct: 1 },
        { q: '🏖️ Пляжна загадка: Як англійською перекладається «Lighthouse»?', options: ['Маяк 🗼', 'Корабель ⛵', 'Морозиво 🍦'], correct: 0 },
        { q: '🧮 Швидка математика: Скільки буде 14 - 6?', options: ['7', '8 ⭐', '9'], correct: 1 },
        { q: '🇪🇸 Іспанська на пляжі: Що означає «Helado»?', options: ['Морозиво 🍦', 'Парасолька ⛱️', 'Замок 🏰'], correct: 0 },
        { q: '💎 Секрет Скарбів: Як англійською «Treasure Chest»?', options: ['Скриня Скарбів 🎁', 'Чарівне Дзеркало 🪞', 'Золота Корона 👑'], correct: 0 },
        { q: '🧮 Задачка в Готелі: У басейні 5 качечок, припливли ще 7. Скільки стало?', options: ['11 качечок', '12 качечок 🦆', '13 качечок'], correct: 1 },
        { q: '🔭 Обсерваторія: Як називається наша галактика?', options: ['Чумацький Шлях 🌌', 'Сонячна Хмарка ☁️', 'Зоряна Ріка ✨'], correct: 0 }
      ];
      this.challengeIdx = 0;

      // Кеш фонів і спрайтів
      this.bgImages = {};
      this.sprites = {};
      this.dataUrls = {};
      this.danikaWalkFrames = [];
      this.brunoWalkFrames = [];
      this.nearestStation = null;
      this.nearStairInfo = null;
      this._mapAnim = null;

      this.roomsConfig = this.buildRoomsConfig();

      // Відновлюємо врятованих улюбленців
      (this.progress.rescuedPets || []).forEach((pid, idx) => {
        const spec = this.wardrobeCatalog.pets.find(p => p.id === pid);
        if (spec) {
          this.companionPets.push({
            id: spec.id,
            title: spec.title,
            x: 680 - idx * 90,
            y: 1135,
            facing: 1,
            hopPhase: idx
          });
        }
      });
    }

    // ------------------------------------------------------------------------
    // ЗБЕРЕЖЕННЯ ТА ПРОГРЕС (РІВНІ, МОНЕТКИ, ВІДКРИТІ ЛОКАЦІЇ ТА ОДЯГ)
    // ------------------------------------------------------------------------
    loadProgress() {
      const defaults = {
        coins: 35,
        xp: 0,
        level: 1,
        unlockedRooms: ['villa', 'academy', 'beach'], // 3 стартові локації відкриті одразу!
        unlockedOutfits: ['gandia_polo'],
        unlockedBrunoSkins: ['custom_bruno'],
        completedQuests: [],
        openedChests: {},
        rescuedPets: [],
        activeOutfit: 'gandia_polo',
        activeBrunoSkin: 'custom_bruno',
        lastRoom: 'villa'
      };
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const merged = Object.assign({}, defaults, parsed);
          ['villa', 'academy', 'beach'].forEach(r => {
            if (!merged.unlockedRooms.includes(r)) merged.unlockedRooms.push(r);
          });
          if (!merged.unlockedOutfits.includes('gandia_polo')) merged.unlockedOutfits.push('gandia_polo');
          if (!merged.unlockedBrunoSkins.includes('custom_bruno')) merged.unlockedBrunoSkins.push('custom_bruno');
          return merged;
        }
      } catch (e) {}
      return defaults;
    }

    saveProgress() {
      try {
        this.progress.lastRoom = this.currentRoom;
        this.progress.activeOutfit = this.player.outfitId;
        this.progress.activeBrunoSkin = this.bruno.skinId;
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.progress));
      } catch (e) {}
    }

    getLevel() {
      return Math.floor((this.progress.xp || 0) / 100) + 1;
    }

    // ------------------------------------------------------------------------
    // 6 ПАНОРАМНИХ ЛОКАЦІЙ ГАНДІЇ З ТОЧНИМИ СХОДАМИ ПО МАЛЮНКУ
    // ------------------------------------------------------------------------
    buildRoomsConfig() {
      return {
        villa: {
          id: 'villa',
          shortName: 'Вілла Гандії',
          title: '🏡 Вілла та Тераса Гандії',
          icon: '🏡',
          bgSrc: 'assets/characters/pixar/spirit_room1_villa.jpg',
          mapPos: { x: 16, y: 50 },
          unlockReq: null,
          groundY: 1135,
          platforms: [
            { x1: 700, x2: 1690, y: 448, label: '2-й Поверх: Балкон' },
            { x1: 470, x2: 640, y: 970 },
            { x1: 810, x2: 990, y: 955, isTrampoline: true }
          ],
          // Точні координати дерев'яних сходів на картинці!
          stairPaths: [
            {
              id: 'villa_main_stairs',
              points: [
                { x: 1585, y: 1135 },
                { x: 1545, y: 780 },
                { x: 1235, y: 448 }
              ],
              onReachTop: () => this.completeQuest('q_villa_loft')
            }
          ],
          stations: [
            {
              id: 'villa_oven', x: 335, y: 1135, radius: 170, icon: '🧁',
              title: 'Кухонна Піч Шефа Даніки', prompt: '🧁 Спекти Полуничний Кекс (+25 🪙)',
              onUse: () => this.startStationQuest('q_villa_bake', () => {
                this.stationStates.ovenBaking = 2.6;
                this.player.heldFood = '🧁 Гарячий Кекс';
                this.spawnCoinFountain(335, 950, 6);
                this.addFloatingText(335, 860, '🧁 Кекс готовий! +25 🪙', '#fde047');
              })
            },
            {
              id: 'villa_fireplace', x: 1110, y: 1135, radius: 150, icon: '🔥',
              title: 'Затишний Камін', prompt: '🔥 Зігрітися з Бруно (+10 XP)',
              onUse: () => {
                this.awardXP(10);
                this.spawnSparkleBurst(1110, 960, '#fb923c', 22);
                this.commandBrunoTrick('Гав! Як тепло біля каміна! 🔥');
              }
            },
            {
              id: 'villa_wardrobe', x: 920, y: 448, radius: 175, icon: '👗',
              title: 'Гардеробна Шафа (2-й поверх)', prompt: '🪞👗 Відкрити Гардероб Даніки',
              onUse: () => { this.completeQuest('q_villa_loft'); this.openWardrobeModal(); }
            },
            {
              id: 'villa_chest', x: 1480, y: 448, radius: 165, icon: '🎁',
              title: 'Скриня на Балконі', prompt: '🎁 Відкрити Скриню Скарбів',
              onUse: () => this.openTreasureChest('chest_villa', 1480, 448, 30)
            },
            {
              id: 'villa_map_exit', x: 2150, y: 1135, radius: 200, icon: '🗺️',
              title: 'Вихід на Карту Гандії', prompt: '🗺️ Відкрити Карту Світу',
              onUse: () => this.openWorldMap()
            }
          ]
        },

        academy: {
          id: 'academy',
          shortName: 'Академія Магії',
          title: '🏫 Чарівна Академія та Обсерваторія',
          icon: '🏫',
          bgSrc: 'assets/characters/pixar/spirit_room2_academy.jpg',
          mapPos: { x: 33, y: 24 },
          unlockReq: null,
          groundY: 1145,
          platforms: [
            { x1: 1850, x2: 2150, y: 925 },
            { x1: 1460, x2: 1750, y: 765 },
            { x1: 1790, x2: 2340, y: 625 },
            { x1: 1320, x2: 1620, y: 515 },
            { x1: 90, x2: 860, y: 645 }
          ],
          // Зигзаг дерев'яних сходів по хмаринках на картинці!
          stairPaths: [
            {
              id: 'academy_cloud_stairs',
              points: [
                { x: 1710, y: 1145 },
                { x: 1985, y: 925 },
                { x: 1615, y: 765 },
                { x: 1890, y: 625 }
              ]
            },
            {
              id: 'academy_top_bridge',
              points: [
                { x: 1775, y: 625 },
                { x: 1490, y: 515 }
              ]
            }
          ],
          stations: [
            {
              id: 'acad_cauldron', x: 460, y: 1145, radius: 175, icon: '🧪',
              title: 'Алхімічний Казан', prompt: '🧪 Зварити Зілля (+20 🪙)',
              onUse: () => this.startStationQuest(null, () => {
                this.stationStates.cauldronBubbling = 3.0;
                this.spawnCoinFountain(460, 960, 5);
                this.spawnSparkleBurst(460, 960, '#4ade80', 26);
                this.addFloatingText(460, 880, '🧪 Чарівне Зілля готове!', '#4ade80');
              })
            },
            {
              id: 'acad_spa', x: 1170, y: 1145, radius: 195, icon: '🛁',
              title: 'Кришталевий Спа Улюбленців', prompt: '🛁 Приручити Кошеня або Єдинорога!',
              onUse: () => this.startStationQuest('q_acad_pet', () => this.rescueNewCompanionPet())
            },
            {
              id: 'acad_observatory', x: 2050, y: 625, radius: 180, icon: '🔭',
              title: 'Зоряна Обсерваторія', prompt: '🔭 Подивитись на зірки (+25 XP)',
              onUse: () => this.startStationQuest(null, () => {
                this.awardXP(25);
                this.spawnSparkleBurst(2050, 480, '#fde047', 30);
                this.addFloatingText(2050, 440, '🌌 Зірки сяють для Даніки! +25 XP', '#fde047');
              })
            },
            {
              id: 'acad_sky_chest', x: 1470, y: 515, radius: 175, icon: '👑',
              title: 'Небесна Скриня Скарбів', prompt: '👑 Відкрити Небесну Скриню',
              onUse: () => {
                this.completeQuest('q_acad_chest');
                this.openTreasureChest('chest_academy', 1470, 515, 40);
              }
            }
          ]
        },

        beach: {
          id: 'beach',
          shortName: 'Пляж і Маяк',
          title: '🏖️ Сонячний Пляж та Маяк Гандії',
          icon: '🏖️',
          bgSrc: 'assets/characters/pixar/spirit_room3_beach.jpg',
          mapPos: { x: 53, y: 72 },
          unlockReq: null,
          groundY: 1155,
          platforms: [
            { x1: 380, x2: 1280, y: 520, label: 'Оглядовий майданчик Маяка' }
          ],
          // Точні діагональні дерев'яні сходи на маяк!
          stairPaths: [
            {
              id: 'beach_boardwalk_stairs',
              points: [
                { x: 1690, y: 1155 },
                { x: 930, y: 520 }
              ]
            }
          ],
          stations: [
            {
              id: 'beach_icecream', x: 730, y: 1155, radius: 185, icon: '🍦',
              title: 'Кіоск Морозива Гандії', prompt: '🍦 Взяти Морозиво для Даніки і Бруно',
              onUse: () => this.startStationQuest('q_beach_icecream', () => {
                this.player.heldFood = '🍦 Полуничне Морозиво';
                this.spawnCoinFountain(730, 960, 6);
                this.commandBrunoTrick('Гав! Обожнюю літнє морозиво! 🍦');
              })
            },
            {
              id: 'beach_sandcastle', x: 1030, y: 1155, radius: 155, icon: '🏰',
              title: 'Пісочний Замок', prompt: '🏰 Прикрасити Замок мушлями (+15 XP)',
              onUse: () => {
                this.awardXP(15);
                this.spawnSparkleBurst(1030, 1020, '#38bdf8', 22);
                this.addFloatingText(1030, 940, '🏰 +15 XP Супер-Замок!', '#7dd3fc');
              }
            },
            {
              id: 'beach_chest', x: 2040, y: 1155, radius: 180, icon: '💎',
              title: 'Скриня Піратів під Пальмами', prompt: '💎 Відкрити Пляжний Скарб',
              onUse: () => this.openTreasureChest('chest_beach', 2040, 1155, 35)
            },
            {
              id: 'beach_lighthouse', x: 675, y: 520, radius: 180, icon: '🗼',
              title: 'Маяк Гандії (2-й поверх)', prompt: '🗼 Запалити ліхтар Маяка (+35 🪙)',
              onUse: () => this.startStationQuest('q_beach_lighthouse', () => {
                this.spawnSparkleBurst(675, 320, '#fde047', 35);
                this.spawnCoinFountain(675, 420, 7);
                this.addFloatingText(675, 340, '🗼 Маяк Гандії засяяв!', '#fde047');
              })
            }
          ]
        },

        hotel: {
          id: 'hotel',
          shortName: 'Гранд-Готель',
          title: '🏨 Гранд-Готель та Аквапарк на Даху',
          icon: '🏨',
          bgSrc: 'assets/characters/pixar/spirit_room4_hotel.jpg',
          mapPos: { x: 62, y: 25 },
          unlockReq: { level: 2, quests: 2, coins: 50 },
          groundY: 1230,
          platforms: [
            { x1: 100, x2: 2320, y: 555, label: 'Тераса з Басейном на Даху' }
          ],
          // Точні парадні сходи в готелі!
          stairPaths: [
            {
              id: 'hotel_grand_stairs',
              points: [
                { x: 1745, y: 1230 },
                { x: 1065, y: 555 }
              ]
            }
          ],
          stations: [
            {
              id: 'hotel_reception', x: 450, y: 1230, radius: 175, icon: '🛎️',
              title: 'Рецепція Гранд-Готелю', prompt: '🛎️ Отримати VIP-ключ (+15 XP)',
              onUse: () => {
                this.awardXP(15);
                this.spawnSparkleBurst(450, 1040, '#fde047', 22);
                this.addFloatingText(450, 960, '🔑 VIP-Гість Даніка! +15 XP', '#fde047');
              }
            },
            {
              id: 'hotel_smoothie', x: 1110, y: 1230, radius: 185, icon: '🍹',
              title: 'Тропічний Смузі-Бар', prompt: '🍹 Приготувати Манго-Смузі',
              onUse: () => this.startStationQuest('q_hotel_smoothie', () => {
                this.player.heldFood = '🍹 Тропічний Смузі';
                this.spawnCoinFountain(1110, 1020, 7);
              })
            },
            {
              id: 'hotel_slide', x: 750, y: 555, radius: 200, icon: '🏊‍♀️',
              title: 'Водна Гірка та Басейн на Даху', prompt: '🏊‍♀️ З’їхати з гірки у басейн!',
              onUse: () => this.startStationQuest('q_hotel_slide', () => {
                this.spawnSparkleBurst(960, 460, '#38bdf8', 35);
                this.spawnCoinFountain(1150, 440, 8);
                this.commandBrunoTrick('Гав-гав! Плюх у басейн! 🌊');
              })
            },
            {
              id: 'hotel_loungers', x: 1980, y: 555, radius: 185, icon: '🎁',
              title: 'Скарб біля Шезлонгів', prompt: '🎁 Відкрити Курортний Скарб',
              onUse: () => this.openTreasureChest('chest_hotel', 1980, 555, 45)
            }
          ]
        },

        petpark: {
          id: 'petpark',
          shortName: 'Парк Бруно',
          title: '🐾 Парк Пригод та Школа Трюків Бруно',
          icon: '🐾',
          bgSrc: 'assets/characters/pixar/spirit_room5_petpark.jpg',
          mapPos: { x: 84, y: 62 },
          unlockReq: { level: 3, quests: 4, coins: 90 },
          groundY: 1095,
          platforms: [
            { x1: 400, x2: 1050, y: 415, label: 'Будиночок на Дереві' },
            { x1: 1050, x2: 2260, y: 455, label: 'Підвісний Місток з Ліхтариками' }
          ],
          // Точні дерев'яні сходи на будиночок на дереві!
          stairPaths: [
            {
              id: 'park_treehouse_stairs',
              points: [
                { x: 1555, y: 1095 },
                { x: 965, y: 415 }
              ]
            }
          ],
          stations: [
            {
              id: 'park_kiosk', x: 350, y: 1095, radius: 180, icon: '🦴',
              title: 'Кіоск Смаколиків Бруно', prompt: '🦴 Купити Золоту Кісточку (+15 XP)',
              onUse: () => {
                this.player.heldFood = '🦴 Золота Кісточка';
                this.awardXP(15);
                this.commandBrunoTrick('Гав-гав! Моя улюблена кісточка! 🦴💖');
              }
            },
            {
              id: 'park_agility', x: 890, y: 1095, radius: 200, icon: '🏅',
              title: 'Кільця та Тунель Адліті', prompt: '🏅 Тренування Трюків з Бруно!',
              onUse: () => this.startStationQuest('q_park_agility', () => {
                this.commandBrunoTrick('Ура! Чемпіон парку Бруно! 🏆');
                this.spawnCoinFountain(890, 920, 8);
              })
            },
            {
              id: 'park_dig', x: 1960, y: 1095, radius: 180, icon: '💎',
              title: 'Пісочниця Скарбів біля Будки', prompt: '💎 Відкопати захований скарб Бруно!',
              onUse: () => this.openTreasureChest('chest_petpark', 1960, 1095, 50)
            },
            {
              id: 'park_telescope', x: 600, y: 415, radius: 185, icon: '🔭',
              title: 'Телескоп у Будиночку на Дереві', prompt: '🔭 Роздивитися всю Гандію!',
              onUse: () => this.startStationQuest('q_park_treehouse', () => {
                this.spawnSparkleBurst(600, 280, '#fde047', 30);
                this.spawnCoinFountain(600, 320, 8);
              })
            }
          ]
        },

        boutique: {
          id: 'boutique',
          shortName: 'Бутік і Скарби',
          title: '🛍️ Бутік Моди та Секретне Горище Скарбів',
          icon: '🛍️',
          bgSrc: 'assets/characters/pixar/spirit_room6_boutique.jpg',
          mapPos: { x: 88, y: 21 },
          unlockReq: { level: 4, quests: 6, coins: 140 },
          groundY: 1250,
          platforms: [
            { x1: 110, x2: 2290, y: 690, label: 'Кришталеве Горище Скарбів' }
          ],
          // Точні біло-золоті сходи ВГОРУ-ВПРАВО на картинці!
          stairPaths: [
            {
              id: 'boutique_golden_stairs',
              points: [
                { x: 985, y: 1250 },
                { x: 1470, y: 690 }
              ]
            }
          ],
          stations: [
            {
              id: 'boutique_vanity', x: 580, y: 1250, radius: 190, icon: '💄',
              title: 'Подіум і Дзеркало Стилю', prompt: '💄 Влаштувати Модний Показ!',
              onUse: () => this.startStationQuest('q_boutique_show', () => {
                this.spawnSparkleBurst(580, 1040, '#f472b6', 36);
                this.spawnCoinFountain(580, 1020, 9);
                if (window.confetti) window.confetti({ particleCount: 70, spread: 75 });
              })
            },
            {
              id: 'boutique_fitting', x: 1750, y: 1250, radius: 185, icon: '👗',
              title: 'Королівська Примірочна', prompt: '🪞👗 Відкрити Гардероб Стилю',
              onUse: () => this.openWardrobeModal()
            },
            {
              id: 'boutique_attic_chest', x: 460, y: 690, radius: 200, icon: '👑',
              title: 'Кришталеві Скрині Скарбів (2-й поверх)', prompt: '👑 Відкрити Королівський Скарб!',
              onUse: () => {
                this.completeQuest('q_boutique_attic');
                this.openTreasureChest('chest_boutique', 460, 690, 80);
              }
            },
            {
              id: 'boutique_magic_mirror', x: 2020, y: 690, radius: 185, icon: '✨',
              title: 'Чарівне Зоряне Дзеркало', prompt: '✨ Загадати бажання (+35 XP)',
              onUse: () => {
                this.awardXP(35);
                this.spawnSparkleBurst(2020, 520, '#c084fc', 35);
                this.addFloatingText(2020, 460, '✨ +35 XP Магія Зірок!', '#e879f9');
              }
            }
          ]
        }
      };
    }

    // ------------------------------------------------------------------------
    // ВІДКРИТТЯ ТА ЗАКРИТТЯ СВІТУ
    // ------------------------------------------------------------------------
    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this.createOverlayDOM();
      if (!this.isInitialized) {
        this.initCanvasWorld();
      }
      this.syncHUD();
      this.updateQuestBanner();
      this.onResize();
      this.startLoop();
      this.showToast('✨ Обери локацію на Карті Гандії або крокуй сходами на 2-й поверх!');
    }

    close() {
      this.isOpen = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      const el = document.getElementById('danika-3d-world-overlay');
      if (el) el.style.display = 'none';
      if (window.location.pathname.endsWith('3d.html')) {
        window.location.href = 'index.html?v=' + ASSET_VER;
      }
    }

    createOverlayDOM() {
      let wrap = document.getElementById('danika-3d-world-overlay');
      if (wrap) {
        wrap.style.display = 'block';
        return;
      }
      wrap = document.createElement('div');
      wrap.id = 'danika-3d-world-overlay';
      wrap.innerHTML = `
        <style>
          #danika-3d-world-overlay {
            position: fixed; inset: 0; z-index: 99999; background: #0f172a;
            overflow: hidden; user-select: none; -webkit-user-select: none;
            font-family: 'Nunito', 'Fredoka', sans-serif;
          }
          #spirit-2d-canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: pointer; }
          .sp-top-bar {
            position: absolute; top: 10px; left: 10px; right: 10px;
            display: flex; justify-content: space-between; align-items: flex-start;
            flex-wrap: wrap; gap: 6px; pointer-events: none; z-index: 20;
          }
          .sp-top-group { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; pointer-events: auto; }
          .sp-pill {
            background: rgba(15, 23, 42, 0.84); backdrop-filter: blur(8px);
            border: 2px solid rgba(255,255,255,0.28); color: #fff;
            padding: 6px 12px; border-radius: 999px; font-weight: 900; font-size: 0.84rem;
            display: inline-flex; align-items: center; gap: 5px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          }
          .sp-btn { cursor: pointer; transition: transform 0.14s ease; }
          .sp-btn:active { transform: scale(0.93); }
          .sp-btn-map { background: linear-gradient(135deg, #10b981, #0ea5e9); border-color: #fff; }
          .sp-btn-hero { background: linear-gradient(135deg, #ec4899, #8b5cf6); border-color: #fff; }
          .sp-btn-quests { background: linear-gradient(135deg, #f59e0b, #ea580c); border-color: #fff; }
          .sp-btn-zoom { background: linear-gradient(135deg, #3b82f6, #6366f1); border-color: #fff; }
          .sp-btn-exit { background: linear-gradient(135deg, #ef4444, #dc2626); border-color: #fff; }

          #sp-quest-tracker {
            position: absolute; top: 56px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(254, 243, 199, 0.96), rgba(253, 230, 138, 0.96));
            color: #78350f; border: 2.5px solid #f59e0b; padding: 6px 16px; border-radius: 999px;
            font-weight: 900; font-size: 0.86rem; box-shadow: 0 6px 18px rgba(0,0,0,0.35);
            z-index: 18; max-width: 92vw; text-align: center; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
          }

          #sp-interact-btn {
            position: absolute; bottom: 108px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff;
            border: 3px solid #fff; padding: 11px 22px; border-radius: 999px;
            font-weight: 900; font-size: 0.98rem; box-shadow: 0 8px 25px rgba(234, 88, 12, 0.55);
            cursor: pointer; z-index: 25; display: none; align-items: center; gap: 8px;
            animation: spPulse 1.3s ease-in-out infinite;
          }
          #sp-stair-btn {
            position: absolute; bottom: 164px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #06b6d4, #2563eb); color: #fff;
            border: 3px solid #fff; padding: 9px 20px; border-radius: 999px;
            font-weight: 900; font-size: 0.92rem; box-shadow: 0 8px 22px rgba(37, 99, 235, 0.55);
            cursor: pointer; z-index: 26; display: none; align-items: center; gap: 8px;
          }
          @keyframes spPulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
          }

          #sp-joystick-zone {
            position: absolute; bottom: 20px; left: 20px; width: 120px; height: 120px;
            border-radius: 50%; background: rgba(15, 23, 42, 0.45);
            border: 3px solid rgba(255,255,255,0.55); z-index: 25; touch-action: none;
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          }
          #sp-joystick-knob {
            position: absolute; top: 50%; left: 50%; width: 52px; height: 52px;
            margin-left: -26px; margin-top: -26px; border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffffff, #cbd5e1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.45); pointer-events: none;
          }
          .sp-right-controls {
            position: absolute; bottom: 20px; right: 20px; display: flex;
            align-items: flex-end; gap: 10px; z-index: 25;
          }
          .sp-action-circle {
            width: 66px; height: 66px; border-radius: 50%; border: 3px solid #fff;
            color: #fff; font-weight: 900; font-size: 0.74rem;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5); cursor: pointer; user-select: none;
          }
          .sp-action-circle:active { transform: scale(0.91); }

          #sp-toast {
            position: absolute; top: 104px; left: 50%; transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.94); color: #fde047; border: 2px solid #fde047;
            padding: 8px 18px; border-radius: 999px; font-weight: 900; font-size: 0.9rem;
            z-index: 40; display: none; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.5);
            pointer-events: none;
          }

          .sp-modal-backdrop {
            position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px); z-index: 60; display: none;
            align-items: center; justify-content: center; padding: 14px;
          }
          .sp-modal-card {
            background: linear-gradient(180deg, #1e1b4b, #0f172a);
            border: 3px solid #f472b6; border-radius: 26px;
            max-width: 720px; width: 100%; max-height: 90vh; overflow-y: auto;
            padding: 18px; color: #fff; box-shadow: 0 24px 60px rgba(0,0,0,0.75);
          }
          .sp-wardrobe-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
            gap: 10px; margin-top: 10px;
          }
          .sp-w-item {
            background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.18);
            border-radius: 18px; padding: 10px; text-align: center; cursor: pointer;
            transition: all 0.15s; position: relative;
          }
          .sp-w-item:hover { background: rgba(255,255,255,0.16); transform: translateY(-2px); }
          .sp-w-item.active {
            background: linear-gradient(135deg, rgba(236,72,153,0.45), rgba(139,92,246,0.45));
            border-color: #fde047; box-shadow: 0 0 16px rgba(253, 224, 71, 0.5);
          }
          .sp-w-item.locked { opacity: 0.72; border-style: dashed; }

          /* Інтерактивна Карта Гандії */
          .sp-map-card { max-width: 940px; border-color: #38bdf8; padding: 14px; }
          .sp-map-stage {
            position: relative; width: 100%; aspect-ratio: 16 / 9;
            border-radius: 18px; overflow: hidden; border: 3px solid #fde047;
            background: #0ea5e9; margin-top: 8px;
          }
          .sp-map-stage img.sp-map-bg { width: 100%; height: 100%; object-fit: cover; display: block; }
          .sp-map-pin {
            position: absolute; transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.9); color: #fff;
            border: 2.5px solid #fde047; border-radius: 16px;
            padding: 5px 10px; font-weight: 900; font-size: 0.78rem;
            cursor: pointer; display: flex; flex-direction: column; align-items: center;
            box-shadow: 0 6px 16px rgba(0,0,0,0.5); transition: transform 0.16s;
            z-index: 5; white-space: nowrap;
          }
          .sp-map-pin:hover { transform: translate(-50%, -55%) scale(1.08); }
          .sp-map-pin.current { border-color: #4ade80; background: linear-gradient(135deg, #065f46, #047857); }
          .sp-map-pin.locked { border-color: #94a3b8; background: rgba(30, 41, 59, 0.88); color: #cbd5e1; }
          .sp-map-walker {
            position: absolute; transform: translate(-50%, -75%);
            width: 58px; height: 58px; z-index: 10; pointer-events: none;
            transition: left 0.85s cubic-bezier(0.34, 1.2, 0.64, 1), top 0.85s cubic-bezier(0.34, 1.2, 0.64, 1);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6));
          }
          .sp-quest-card {
            background: linear-gradient(180deg, #fffbeb, #fef3c7);
            border: 4px solid #f59e0b; border-radius: 26px; max-width: 460px; width: 100%;
            padding: 20px; text-align: center; color: #451a03;
            box-shadow: 0 20px 50px rgba(0,0,0,0.65);
          }
          .sp-quest-opt {
            display: block; width: 100%; padding: 12px 16px; margin: 8px 0;
            border-radius: 16px; border: 2.5px solid #fbbf24; background: #fff;
            color: #451a03; font-weight: 900; font-size: 1rem; cursor: pointer;
          }
          .sp-quest-opt:hover { background: #fef08a; transform: scale(1.02); }
          .sp-qlog-row {
            display: flex; justify-content: space-between; align-items: center; gap: 10px;
            background: rgba(255,255,255,0.08); border-radius: 14px; padding: 10px 12px;
            margin-bottom: 8px; border: 1.5px solid rgba(255,255,255,0.14);
          }
          .sp-qlog-row.done { background: rgba(16, 185, 129, 0.22); border-color: #34d399; }
          @media (max-width: 680px) {
            #sp-joystick-zone { width: 102px; height: 102px; bottom: 14px; left: 14px; }
            .sp-right-controls { bottom: 14px; right: 14px; gap: 8px; }
            .sp-action-circle { width: 56px; height: 56px; font-size: 0.68rem; }
            #sp-quest-tracker { top: 96px; font-size: 0.76rem; padding: 5px 12px; }
          }
        </style>

        <canvas id="spirit-2d-canvas"></canvas>

        <div class="sp-top-bar">
          <div class="sp-top-group">
            <div class="sp-pill" style="background:linear-gradient(135deg,#ec4899,#8b5cf6); border-color:#fff;">
              <span id="sp-room-title">🏡 Вілла та Тераса Гандії</span>
            </div>
            <div class="sp-pill">🏆 Рів. <span id="sp-lvl-val">1</span></div>
            <div class="sp-pill">🪙 <span id="sp-coins-val">35</span></div>
            <div class="sp-pill">⭐ <span id="sp-xp-val">0</span> XP</div>
          </div>

          <div class="sp-top-group">
            <button class="sp-pill sp-btn sp-btn-map" onclick="window.roblox3D.openWorldMap()">
              🗺️ Карта Гандії (<span id="sp-unlocked-count">3</span>/6)
            </button>
            <button class="sp-pill sp-btn sp-btn-quests" onclick="window.roblox3D.openQuestLog()">
              📜 Завдання (<span id="sp-quests-count">0</span>/12)
            </button>
            <button class="sp-pill sp-btn sp-btn-hero" onclick="window.roblox3D.openWardrobeModal()">
              🪞👗 Гардероб
            </button>
            <button class="sp-pill sp-btn sp-btn-zoom" id="sp-zoom-btn" onclick="window.roblox3D.toggleCameraZoom()">
              🔍 Крупно
            </button>
            <button class="sp-pill sp-btn sp-btn-exit" onclick="window.roblox3D.close()">✕</button>
          </div>
        </div>

        <div id="sp-quest-tracker" onclick="window.roblox3D.openQuestLog()">
          <span style="font-size:1.2rem;">📜</span>
          <span id="sp-quest-text">Завантаження пригоди...</span>
        </div>

        <div id="sp-toast">✨ Ласкаво просимо у світ пригод Даніки та Бруно!</div>

        <button id="sp-stair-btn" onclick="window.roblox3D.startAutoStairClimb()">
          <span>🪜</span><span id="sp-stair-label">Піднятися сходами</span>
        </button>

        <button id="sp-interact-btn" onclick="window.roblox3D.triggerNearestStation()">
          <span id="sp-interact-icon" style="font-size:1.3rem;">🖐️</span>
          <span id="sp-interact-label">Взаємодіяти</span>
        </button>

        <div id="sp-joystick-zone"><div id="sp-joystick-knob"></div></div>

        <div class="sp-right-controls">
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#ec4899,#db2777); width:54px; height:54px;" onclick="window.roblox3D.commandBrunoTrick()">
            <span style="font-size:1.2rem;">🐶</span><span>Бруно!</span>
          </button>
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#f59e0b,#d97706);" onclick="window.roblox3D.useOrMagic()">
            <span style="font-size:1.35rem;">🖐️</span><span>ДІЯ [E]</span>
          </button>
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#10b981,#059669);" onclick="window.roblox3D.jump()">
            <span style="font-size:1.35rem;">⬆️</span><span>СТРИБОК</span>
          </button>
        </div>

        <!-- Інтерактивна Карта Гандії -->
        <div id="sp-map-modal" class="sp-modal-backdrop">
          <div class="sp-modal-card sp-map-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; font-family:'Fredoka',cursive; font-size:1.25rem; color:#7dd3fc;">🗺️ Інтерактивна Карта Гандії — Обери, куди піти!</h3>
              <button onclick="document.getElementById('sp-map-modal').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-weight:900; cursor:pointer;">✕</button>
            </div>
            <div id="sp-map-unlock-info" style="font-size:0.84rem; color:#fde047; margin-top:4px; font-weight:800;">
              Натисни на відкриту локацію, і Даніка з Бруно вирушать туди! Виконуй завдання та збирай монетки, щоб відкрити всі 6 місць!
            </div>
            <div class="sp-map-stage" id="sp-map-stage">
              <img class="sp-map-bg" src="assets/characters/pixar/spirit_world_map_gandia.jpg?v=${ASSET_VER}" alt="Карта Гандії">
              <img id="sp-map-walker" class="sp-map-walker" src="" alt="Даніка">
              <div id="sp-map-pins"></div>
            </div>
          </div>
        </div>

        <!-- Журнал Завдань -->
        <div id="sp-qlog-modal" class="sp-modal-backdrop">
          <div class="sp-modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="margin:0; font-family:'Fredoka',cursive; font-size:1.25rem; color:#fde047;">📜 Завдання та Прогрес Даніки</h3>
              <button onclick="document.getElementById('sp-qlog-modal').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-weight:900; cursor:pointer;">✕</button>
            </div>
            <div id="sp-qlog-list"></div>
          </div>
        </div>

        <!-- Гардеробна -->
        <div id="sp-wardrobe-modal" class="sp-modal-backdrop">
          <div class="sp-modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; font-family:'Fredoka',cursive; font-size:1.25rem; color:#fbcfe8;">🪞👗 Гардероб Даніки та Бруно</h3>
              <button onclick="document.getElementById('sp-wardrobe-modal').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-weight:900; cursor:pointer;">✕</button>
            </div>
            <p style="margin:6px 0 8px; font-size:0.84rem; color:#cbd5e1;">Виконуй завдання, підвищуй рівень та збирай монетки 🪙, щоб відкривати нові образи!</p>
            <div style="font-weight:900; color:#fde047; margin-top:6px;">👧 Образи Даніки:</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-danika-grid"></div>
            <div style="font-weight:900; color:#7dd3fc; margin-top:14px;">🐶 Образи Бруно:</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-bruno-grid"></div>
          </div>
        </div>

        <!-- Модальне вікно Завдання Станції -->
        <div id="sp-quest-modal" class="sp-modal-backdrop">
          <div class="sp-quest-card">
            <div id="sp-q-icon" style="font-size:2.4rem; margin-bottom:4px;">✨</div>
            <h3 id="sp-q-title" style="margin:0 0 8px; font-size:1.2rem; font-family:'Fredoka',cursive;">Завдання Даніки</h3>
            <p id="sp-q-text" style="font-weight:800; font-size:1rem; margin-bottom:14px; line-height:1.4;"></p>
            <div id="sp-q-options"></div>
            <button onclick="document.getElementById('sp-quest-modal').style.display='none'" style="margin-top:8px; background:transparent; border:none; color:#92400e; font-weight:800; cursor:pointer;">Закрити</button>
          </div>
        </div>
      `;
      document.body.appendChild(wrap);
      this.bindControls();
    }

    // ------------------------------------------------------------------------
    // ЗАВАНТАЖЕННЯ 6 ФОНІВ ТА 8-КАДРОВИХ СПРАЙТІВ ДАНІКИ І ТВОГО БРУНО
    // ------------------------------------------------------------------------
    initCanvasWorld() {
      this.canvas = document.getElementById('spirit-2d-canvas');
      this.ctx = this.canvas.getContext('2d');
      window.addEventListener('resize', () => this.onResize());

      // 1. Завантажуємо всі 6 панорамних локацій
      Object.keys(this.roomsConfig).forEach(rKey => {
        const img = new Image();
        img.src = this.roomsConfig[rKey].bgSrc + '?v=' + ASSET_VER;
        img.onload = () => { this.bgImages[rKey] = img; };
      });

      // 2. Вирізаємо 8-кадрову плавну ходьбу Даніки (4 колонки x 2 ряди)
      const dWalkSrc = 'assets/characters/pixar/danika_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        this.extractTransparentSprite('d_walk_' + i, dWalkSrc, { x: col * 0.25, y: row * 0.5, w: 0.25, h: 0.5 }, (c) => {
          this.danikaWalkFrames[i] = c;
        });
      }

      // 3. Вирізаємо 8-кадрову плавну ходьбу твого Бруно (4 колонки x 2 ряди)
      const bWalkSrc = 'assets/characters/pixar/bruno_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        this.extractTransparentSprite('b_walk_' + i, bWalkSrc, { x: col * 0.25, y: row * 0.5, w: 0.25, h: 0.5 }, (c) => {
          this.brunoWalkFrames[i] = c;
        });
      }

      // 4. Стрибок та магія Даніки
      const actSrc = 'assets/characters/pixar/danika_pixar_actions.jpg';
      this.extractTransparentSprite('danika_jump', actSrc, { x: 0, y: 0.5, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_action', actSrc, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 });

      // 5. Костюми Даніки, Бруно та Улюбленців
      this.wardrobeCatalog.danika.forEach(d => {
        this.extractTransparentSprite('outfit_' + d.id, d.src, d.crop, () => {
          this.renderWardrobeGrids();
          const mw = document.getElementById('sp-map-walker');
          if (mw && d.id === 'gandia_polo' && this.dataUrls['outfit_gandia_polo']) {
            mw.src = this.dataUrls['outfit_gandia_polo'];
          }
        });
      });
      this.wardrobeCatalog.bruno.forEach(b => {
        this.extractTransparentSprite('bruno_' + b.id, b.src, b.crop, () => this.renderWardrobeGrids());
      });
      this.wardrobeCatalog.pets.forEach(p => {
        this.extractTransparentSprite('pet_' + p.id, p.src, p.crop);
      });

      this.switchRoom(this.currentRoom, 880, null, true);
      this.isInitialized = true;
    }

    extractTransparentSprite(key, imgSrc, cropNorm, onReady) {
      if (this.sprites[key]) {
        if (onReady) onReady(this.sprites[key]);
        return;
      }
      this._rawCache = this._rawCache || {};
      const process = (img) => {
        const sx = Math.round(cropNorm.x * img.width);
        const sy = Math.round(cropNorm.y * img.height);
        const sw = Math.round(cropNorm.w * img.width);
        const sh = Math.round(cropNorm.h * img.height);

        const c = document.createElement('canvas');
        c.width = sw;
        c.height = sh;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const imgData = ctx.getImageData(0, 0, sw, sh);
        const d = imgData.data;
        const w = sw, h = sh;
        const visited = new Uint8Array(w * h);
        const q = new Int32Array(w * h);
        let head = 0, tail = 0;

        const isWhiteOrTransparent = (idx) => {
          const p = idx * 4;
          if (d[p + 3] < 20) return true;
          return d[p] >= 235 && d[p + 1] >= 235 && d[p + 2] >= 235;
        };
        const push = (x, y) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (!visited[idx] && isWhiteOrTransparent(idx)) {
            visited[idx] = 1;
            q[tail++] = idx;
          }
        };

        for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
        for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

        while (head < tail) {
          const curr = q[head++];
          const cx = curr % w;
          const cy = (curr / w) | 0;
          d[curr * 4 + 3] = 0;
          if (cx > 0) push(cx - 1, cy);
          if (cx < w - 1) push(cx + 1, cy);
          if (cy > 0) push(cx, cy - 1);
          if (cy < h - 1) push(cx, cy + 1);
        }

        let minX = w, minY = h, maxX = 0, maxY = 0;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            if (!visited[idx]) {
              const p = idx * 4;
              if (visited[idx - 1] || visited[idx + 1] || visited[idx - w] || visited[idx + w]) {
                const lum = (d[p] + d[p + 1] + d[p + 2]) / 3;
                if (lum > 220) d[p + 3] = Math.max(0, Math.min(255, (255 - lum) * 7));
              }
              if (d[p + 3] > 25) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);

        const pad = 4;
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(w - 1, maxX + pad);
        maxY = Math.min(h - 1, maxY + pad);
        const cw = Math.max(16, maxX - minX + 1);
        const ch = Math.max(16, maxY - minY + 1);

        const outC = document.createElement('canvas');
        outC.width = cw;
        outC.height = ch;
        outC.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);

        this.sprites[key] = outC;
        this.dataUrls[key] = outC.toDataURL('image/png');
        if (onReady) onReady(outC);
      };

      if (this._rawCache[imgSrc] && this._rawCache[imgSrc].complete) {
        process(this._rawCache[imgSrc]);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this._rawCache[imgSrc] = img;
          process(img);
        };
        img.src = imgSrc + '?v=' + ASSET_VER;
      }
    }

    // ------------------------------------------------------------------------
    // ІНТЕРАКТИВНА КАРТА ГАНДІЇ ТА ВІДКРИТТЯ ЛОКАЦІЙ
    // ------------------------------------------------------------------------
    openWorldMap() {
      const modal = document.getElementById('sp-map-modal');
      const pinsEl = document.getElementById('sp-map-pins');
      const walker = document.getElementById('sp-map-walker');
      if (!modal || !pinsEl) return;

      const curCfg = this.roomsConfig[this.currentRoom];
      if (walker) {
        walker.src = this.dataUrls['outfit_' + this.player.outfitId] || this.dataUrls['outfit_gandia_polo'] || 'assets/characters/pixar/danika_pixar_base.jpg';
        walker.style.left = curCfg.mapPos.x + '%';
        walker.style.top = curCfg.mapPos.y + '%';
      }

      const curLevel = this.getLevel();
      const doneCount = this.progress.completedQuests.length;

      pinsEl.innerHTML = Object.values(this.roomsConfig).map(r => {
        const unlocked = this.progress.unlockedRooms.includes(r.id);
        const isCur = r.id === this.currentRoom;
        let sub = isCur ? '📍 Тут' : '✨ Відвідати';
        if (!unlocked && r.unlockReq) {
          const canUnlock = curLevel >= r.unlockReq.level && doneCount >= r.unlockReq.quests && this.progress.coins >= r.unlockReq.coins;
          sub = canUnlock
            ? `🔓 Відкрити (${r.unlockReq.coins} 🪙)!`
            : `🔒 Рів.${r.unlockReq.level} • ${r.unlockReq.quests} кв. • ${r.unlockReq.coins}🪙`;
        }
        return `
          <button class="sp-map-pin ${isCur ? 'current' : ''} ${unlocked ? '' : 'locked'}"
                  style="left:${r.mapPos.x}%; top:${r.mapPos.y}%;"
                  onclick="window.roblox3D.handleMapLocationClick('${r.id}')">
            <span>${r.icon} ${r.shortName}</span>
            <small style="font-size:0.66rem; color:${unlocked ? '#fde047' : '#94a3b8'};">${sub}</small>
          </button>
        `;
      }).join('');

      modal.style.display = 'flex';
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    handleMapLocationClick(roomId) {
      const r = this.roomsConfig[roomId];
      if (!r) return;
      const unlocked = this.progress.unlockedRooms.includes(roomId);

      if (!unlocked) {
        const req = r.unlockReq;
        const curLevel = this.getLevel();
        const doneCount = this.progress.completedQuests.length;
        if (curLevel >= req.level && doneCount >= req.quests && this.progress.coins >= req.coins) {
          this.progress.coins -= req.coins;
          this.progress.unlockedRooms.push(roomId);
          this.saveProgress();
          this.syncHUD();
          if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
          if (window.confetti) window.confetti({ particleCount: 90, spread: 80 });
          this.showToast(`🎉 Відкрито нову локацію: ${r.title}!`);
          this.openWorldMap();
        } else {
          if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
          const info = document.getElementById('sp-map-unlock-info');
          if (info) {
            info.textContent = `🔒 Щоб відкрити «${r.shortName}», потрібно: Рівень ${req.level} (у тебе ${curLevel}), ${req.quests} завдань (виконано ${doneCount}) та ${req.coins} 🪙 (у тебе ${this.progress.coins} 🪙)!`;
          }
        }
        return;
      }

      // Даніка плавно йде по карті до вибраної локації!
      const walker = document.getElementById('sp-map-walker');
      if (walker) {
        walker.style.left = r.mapPos.x + '%';
        walker.style.top = r.mapPos.y + '%';
      }
      if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
      setTimeout(() => {
        const modal = document.getElementById('sp-map-modal');
        if (modal) modal.style.display = 'none';
        this.switchRoom(roomId, 880, null, false);
      }, 860);
    }

    // ------------------------------------------------------------------------
    // ПЕРЕМИКАННЯ ЛОКАЦІЙ, СХОДИ ТА ПРОГРЕС
    // ------------------------------------------------------------------------
    switchRoom(roomKey, spawnX, spawnY, silent = false) {
      const cfg = this.roomsConfig[roomKey] || this.roomsConfig.villa;
      this.currentRoom = cfg.id;
      this.player.x = spawnX || 880;
      this.player.y = spawnY || cfg.groundY;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.stairClimb = null;
      this.player.navTarget = null;
      this.bruno.x = this.player.x - 130;
      this.bruno.y = this.player.y;
      this.companionPets.forEach((p, i) => {
        p.x = this.player.x - 210 - i * 85;
        p.y = this.player.y;
      });
      const titleEl = document.getElementById('sp-room-title');
      if (titleEl) titleEl.textContent = cfg.title;
      this.seedInitialRoomCoins();
      this.updateQuestBanner();
      this.saveProgress();
      if (!silent) {
        if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
        this.showToast(`✨ Локація: ${cfg.title}`);
      }
    }

    toggleCameraZoom() {
      this.camera.zoomMode = this.camera.zoomMode === 'follow' ? 'wide' : 'follow';
      const btn = document.getElementById('sp-zoom-btn');
      if (btn) btn.textContent = this.camera.zoomMode === 'follow' ? '🔍 Крупно' : '🖼️ Панорама';
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    completeQuest(questId) {
      if (!questId || this.progress.completedQuests.includes(questId)) return;
      const q = this.questDefs.find(x => x.id === questId);
      if (!q) return;
      this.progress.completedQuests.push(questId);
      this.awardCoins(q.rewardCoins);
      this.awardXP(q.rewardXp);
      this.saveProgress();
      this.updateQuestBanner();
      if (window.confetti) window.confetti({ particleCount: 70, spread: 75 });
      this.showToast(`🏆 Завдання виконано! +${q.rewardCoins} 🪙 та +${q.rewardXp} XP!`);
    }

    openQuestLog() {
      const modal = document.getElementById('sp-qlog-modal');
      const list = document.getElementById('sp-qlog-list');
      if (!modal || !list) return;
      list.innerHTML = this.questDefs.map(q => {
        const done = this.progress.completedQuests.includes(q.id);
        const roomUnlocked = this.progress.unlockedRooms.includes(q.room);
        return `
          <div class="sp-qlog-row ${done ? 'done' : ''}">
            <div>
              <div style="font-weight:900; font-size:0.9rem;">${done ? '✅' : (roomUnlocked ? '⭐' : '🔒')} ${q.title}</div>
              <div style="font-size:0.76rem; color:#fde047;">Нагорода: +${q.rewardCoins} 🪙 | +${q.rewardXp} XP</div>
            </div>
            ${!done && roomUnlocked ? `<button class="sp-pill sp-btn sp-btn-map" style="padding:5px 10px; font-size:0.74rem;" onclick="document.getElementById('sp-qlog-modal').style.display='none'; window.roblox3D.switchRoom('${q.room}')">Йти туди</button>` : ''}
          </div>
        `;
      }).join('');
      modal.style.display = 'flex';
    }

    updateQuestBanner() {
      const el = document.getElementById('sp-quest-text');
      const qCount = document.getElementById('sp-quests-count');
      if (qCount) qCount.textContent = this.progress.completedQuests.length;
      if (!el) return;
      // Шукаємо активний квест у поточній кімнаті, або перший невиконаний у відкритій локації
      const nextHere = this.questDefs.find(q => q.room === this.currentRoom && !this.progress.completedQuests.includes(q.id));
      const nextAny = nextHere || this.questDefs.find(q => this.progress.unlockedRooms.includes(q.room) && !this.progress.completedQuests.includes(q.id));
      if (nextAny) {
        el.textContent = nextAny.title;
      } else if (this.progress.unlockedRooms.length < 6) {
        el.textContent = '🗺️ Відкрий нову локацію на Карті Гандії за монетки та рівні!';
      } else {
        el.textContent = '🏆 Усі 12 пригод Гандії виконано! Досліджуй світ і збирай скарби!';
      }
    }

    // ------------------------------------------------------------------------
    // МОНЕТКИ, СКРИНІ СКАРБІВ, КВЕСТИ ТА УЛЮБЛЕНЦІ
    // ------------------------------------------------------------------------
    seedInitialRoomCoins() {
      this.droppedCoins = [];
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg) return;
      // Розкладаємо монетки вздовж сходів та поверхів
      const pts = [
        { x: 420, y: cfg.groundY - 50 },
        { x: 1180, y: cfg.groundY - 50 },
        { x: 1850, y: cfg.groundY - 50 }
      ];
      (cfg.stairPaths || []).forEach(sp => {
        for (let i = 0; i < sp.points.length - 1; i++) {
          const a = sp.points[i], b = sp.points[i + 1];
          pts.push({ x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 - 55 });
        }
      });
      (cfg.platforms || []).slice(0, 2).forEach(pl => {
        pts.push({ x: (pl.x1 + pl.x2) * 0.5, y: pl.y - 55 });
      });
      pts.forEach(p => this.droppedCoins.push({ x: p.x, y: p.y, vx: 0, vy: 0, grounded: true }));
    }

    openTreasureChest(chestId, x, y, bonusCoins) {
      if (this.progress.openedChests[chestId]) {
        this.spawnSparkleBurst(x, y - 80, '#fde047', 16);
        this.showToast('💎 Скарб із цієї скрині вже зібрано! Шукай нові скрині в інших локаціях!');
        return;
      }
      this.progress.openedChests[chestId] = true;
      this.awardCoins(bonusCoins);
      this.awardXP(30);
      this.saveProgress();
      this.spawnCoinFountain(x, y - 90, 10);
      this.spawnSparkleBurst(x, y - 90, '#fde047', 35);
      if (window.confetti) window.confetti({ particleCount: 80, spread: 80 });
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.addFloatingText(x, y - 160, `💎 СКАРБ! +${bonusCoins} 🪙`, '#fde047');
    }

    spawnCoinFountain(x, y, count = 6) {
      for (let i = 0; i < count; i++) {
        this.droppedCoins.push({
          x, y,
          vx: (Math.random() - 0.5) * 460,
          vy: -420 - Math.random() * 320,
          grounded: false
        });
      }
    }

    spawnSparkleBurst(x, y, color = '#fde047', count = 18) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 80 + Math.random() * 250;
        this.particles.push({
          x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 110,
          size: 4 + Math.random() * 6, color, life: 0.7 + Math.random() * 0.4
        });
      }
    }

    addFloatingText(x, y, text, color = '#fde047') {
      this.floatingTexts.push({ x, y, text, color, life: 1.5 });
    }

    startStationQuest(questId, onSuccess) {
      const modal = document.getElementById('sp-quest-modal');
      const qText = document.getElementById('sp-q-text');
      const qOpts = document.getElementById('sp-q-options');
      if (!modal || !qText || !qOpts) return;

      const ch = this.challenges[this.challengeIdx % this.challenges.length];
      qText.textContent = ch.q;
      this._pendingQuestCallback = () => {
        this.challengeIdx++;
        if (questId) this.completeQuest(questId);
        else { this.awardCoins(15); this.awardXP(20); }
        this.player.actionTimer = 0.85;
        if (onSuccess) onSuccess();
      };

      qOpts.innerHTML = ch.options.map((opt, idx) => `
        <button class="sp-quest-opt" onclick="window.roblox3D.submitStationAnswer(${idx}, ${ch.correct})">${opt}</button>
      `).join('');
      modal.style.display = 'flex';
    }

    submitStationAnswer(choiceIdx, correctIdx) {
      const modal = document.getElementById('sp-quest-modal');
      if (choiceIdx === correctIdx) {
        if (modal) modal.style.display = 'none';
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        if (this._pendingQuestCallback) this._pendingQuestCallback();
      } else {
        if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        this.showToast('🤔 Спробуй інший варіант!');
      }
    }

    rescueNewCompanionPet() {
      const spec = this.wardrobeCatalog.pets[this.companionPets.length % this.wardrobeCatalog.pets.length];
      if (!this.companionPets.find(p => p.id === spec.id)) {
        this.companionPets.push({ id: spec.id, title: spec.title, x: 1170, y: 1145, facing: 1, hopPhase: 0 });
        if (!this.progress.rescuedPets.includes(spec.id)) this.progress.rescuedPets.push(spec.id);
        this.saveProgress();
      }
      this.spawnSparkleBurst(1170, 1000, '#f472b6', 30);
      this.spawnCoinFountain(1170, 990, 6);
      if (window.confetti) window.confetti({ particleCount: 65, spread: 70 });
      this.addFloatingText(1170, 880, `🎉 Приручено: ${spec.title}!`, '#f472b6');
    }

    // ------------------------------------------------------------------------
    // ГАРДЕРОБ З ВІДКРИТТЯМ ЗА МОНЕТКИ ТА РІВНІ
    // ------------------------------------------------------------------------
    openWardrobeModal() {
      this.renderWardrobeGrids();
      const modal = document.getElementById('sp-wardrobe-modal');
      if (modal) modal.style.display = 'flex';
      if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
    }

    renderWardrobeGrids() {
      const dGrid = document.getElementById('sp-wardrobe-danika-grid');
      const bGrid = document.getElementById('sp-wardrobe-bruno-grid');
      const curLvl = this.getLevel();

      if (dGrid) {
        dGrid.innerHTML = this.wardrobeCatalog.danika.map(d => {
          const url = this.dataUrls['outfit_' + d.id] || '';
          const unlocked = this.progress.unlockedOutfits.includes(d.id);
          const active = this.player.outfitId === d.id ? 'active' : '';
          const badge = unlocked
            ? (active ? '✓ Надіто' : 'Одягнути')
            : `🔒 ${d.cost} 🪙 (Рів.${d.reqLevel})`;
          return `
            <div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectDanikaOutfit('${d.id}')">
              ${url ? `<img src="${url}" style="width:78px; height:94px; object-fit:contain;">` : ''}
              <div style="font-weight:900; font-size:0.78rem; margin-top:4px;">${d.title}</div>
              <div style="font-size:0.7rem; color:${unlocked ? '#4ade80' : (curLvl >= d.reqLevel && this.progress.coins >= d.cost ? '#fde047' : '#94a3b8')}; font-weight:800; margin-top:3px;">${badge}</div>
            </div>
          `;
        }).join('');
      }
      if (bGrid) {
        bGrid.innerHTML = this.wardrobeCatalog.bruno.map(b => {
          const url = this.dataUrls['bruno_' + b.id] || '';
          const unlocked = this.progress.unlockedBrunoSkins.includes(b.id);
          const active = this.bruno.skinId === b.id ? 'active' : '';
          const badge = unlocked ? (active ? '✓ Надіто' : 'Одягнути') : `🔒 ${b.cost} 🪙 (Рів.${b.reqLevel})`;
          return `
            <div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectBrunoSkin('${b.id}')">
              ${url ? `<img src="${url}" style="width:78px; height:82px; object-fit:contain;">` : ''}
              <div style="font-weight:900; font-size:0.78rem; margin-top:4px;">${b.title}</div>
              <div style="font-size:0.7rem; color:${unlocked ? '#4ade80' : '#fde047'}; font-weight:800; margin-top:3px;">${badge}</div>
            </div>
          `;
        }).join('');
      }
    }

    selectDanikaOutfit(outfitId) {
      const item = this.wardrobeCatalog.danika.find(d => d.id === outfitId);
      if (!item) return;
      if (!this.progress.unlockedOutfits.includes(outfitId)) {
        const lvl = this.getLevel();
        if (lvl < item.reqLevel) {
          this.showToast(`🔒 Потрібен Рівень ${item.reqLevel} (виконуй завдання!).`);
          return;
        }
        if (this.progress.coins < item.cost) {
          this.showToast(`🪙 Потрібно ${item.cost} монеток! Збирай монетки та скарби!`);
          return;
        }
        this.progress.coins -= item.cost;
        this.progress.unlockedOutfits.push(outfitId);
        if (window.confetti) window.confetti({ particleCount: 55, spread: 65 });
        this.showToast(`🎉 Куплено новий образ: ${item.title}!`);
      }
      this.player.outfitId = outfitId;
      this.saveProgress();
      this.syncHUD();
      this.renderWardrobeGrids();
      this.spawnSparkleBurst(this.player.x, this.player.y - 110, '#f472b6', 22);
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
    }

    selectBrunoSkin(skinId) {
      const item = this.wardrobeCatalog.bruno.find(b => b.id === skinId);
      if (!item) return;
      if (!this.progress.unlockedBrunoSkins.includes(skinId)) {
        const lvl = this.getLevel();
        if (lvl < item.reqLevel || this.progress.coins < item.cost) {
          this.showToast(`🔒 Потрібен Рівень ${item.reqLevel} та ${item.cost} 🪙!`);
          return;
        }
        this.progress.coins -= item.cost;
        this.progress.unlockedBrunoSkins.push(skinId);
      }
      this.bruno.skinId = skinId;
      this.saveProgress();
      this.syncHUD();
      this.renderWardrobeGrids();
      this.commandBrunoTrick('Гав-гав! Супер-образ! 🐾');
    }

    // ------------------------------------------------------------------------
    // ТОЧНИЙ ПІДЙОМ ПО СХОДАХ ПО МАЛЮНКУ (POLYLINE STAIR SYSTEM)
    // ------------------------------------------------------------------------
    findNearbyStair() {
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg || !cfg.stairPaths) return null;
      for (let i = 0; i < cfg.stairPaths.length; i++) {
        const sp = cfg.stairPaths[i];
        const startPt = sp.points[0];
        const endPt = sp.points[sp.points.length - 1];
        const dBot = Math.hypot(this.player.x - startPt.x, this.player.y - startPt.y);
        if (dBot < 165) return { sp, dir: 1, label: '⬆️ Піднятися сходами на 2-й поверх' };
        const dTop = Math.hypot(this.player.x - endPt.x, this.player.y - endPt.y);
        if (dTop < 165) return { sp, dir: -1, label: '⬇️ Спуститися сходами вниз' };
      }
      return null;
    }

    startAutoStairClimb(customInfo) {
      const info = customInfo || this.nearStairInfo || this.findNearbyStair();
      if (!info) return;
      const pts = info.dir === 1 ? info.sp.points.slice() : info.sp.points.slice().reverse();
      this.player.stairClimb = {
        points: pts,
        segIdx: 0,
        t: 0,
        dir: info.dir,
        onFinish: info.dir === 1 ? info.sp.onReachTop : null
      };
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.onGround = true;
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    // ------------------------------------------------------------------------
    // РУХ, СТРИБКИ ТА ДІЇ ГРАВЦЯ
    // ------------------------------------------------------------------------
    jump() {
      if (this.player.stairClimb) return;
      if (this.player.onGround) {
        this.player.vy = -940;
        this.player.onGround = false;
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
      }
    }

    useOrMagic() {
      this.player.actionTimer = 0.65;
      if (this.nearestStation) {
        this.nearestStation.onUse();
        return;
      }
      if (this.nearStairInfo) {
        this.startAutoStairClimb(this.nearStairInfo);
        return;
      }
      const tipX = this.player.x + this.player.facing * 95;
      const tipY = this.player.y - 125;
      this.spawnSparkleBurst(tipX, tipY, '#fde047', 20);
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
    }

    triggerNearestStation() {
      if (this.nearestStation) {
        this.player.actionTimer = 0.65;
        this.nearestStation.onUse();
      }
    }

    commandBrunoTrick(customText) {
      this.bruno.flipTimer = 0.85;
      this.bruno.barkBubbleTimer = 2.6;
      this.bruno.barkText = customText || 'Гав-гав! Сальто для Даніки! 🐾⭐';
      this.spawnSparkleBurst(this.bruno.x, this.bruno.y - 70, '#38bdf8', 16);
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }

    // ------------------------------------------------------------------------
    // ОНОВЛЕННЯ СВІТУ (60 FPS)
    // ------------------------------------------------------------------------
    startLoop() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.lastTime = performance.now();
      const loop = (now) => {
        if (!this.isOpen) return;
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;
        this.update(dt);
        this.render();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }

    update(dt) {
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg) return;

      let moveX = this.joyVec.x;
      let moveY = this.joyVec.y;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
      moveX = Math.max(-1, Math.min(1, moveX));

      // Якщо гравець натиснув клавіші руху — скасовуємо авто-навігацію по кліку
      if (Math.abs(moveX) > 0.15) this.player.navTarget = null;

      // 1. Якщо Даніка зараз крокує по сходах (ідеально рівно по сходинках!)
      if (this.player.stairClimb) {
        const sc = this.player.stairClimb;
        const a = sc.points[sc.segIdx];
        const b = sc.points[sc.segIdx + 1];
        const segLen = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        const climbSpeed = 420;
        sc.t += (climbSpeed * dt) / segLen;
        this.player.facing = (b.x - a.x) >= 0 ? 1 : -1;
        this.player.walkTimer += dt * 11.5;
        this.player.vx = (b.x - a.x) >= 0 ? 220 : -220;

        if (sc.t >= 1) {
          this.player.x = b.x;
          this.player.y = b.y;
          sc.segIdx++;
          sc.t = 0;
          if (sc.segIdx >= sc.points.length - 1) {
            const cb = sc.onFinish;
            this.player.stairClimb = null;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.onGround = true;
            if (cb) cb();
          }
        } else {
          this.player.x = a.x + (b.x - a.x) * sc.t;
          this.player.y = a.y + (b.y - a.y) * sc.t;
        }
      } else {
        // Авто-ходьба до точки тапу
        if (this.player.navTarget) {
          const dx = this.player.navTarget.x - this.player.x;
          if (Math.abs(dx) > 20) {
            moveX = Math.sign(dx);
          } else {
            this.player.navTarget = null;
          }
        }

        // Якщо біля сходів і гравець тягне ВГОРУ (W/↑) або ВНИЗ (S/↓) — автоматично заходимо на сходи!
        const nearStair = this.findNearbyStair();
        this.nearStairInfo = nearStair;
        if (nearStair) {
          if (nearStair.dir === 1 && moveY < -0.45) {
            this.startAutoStairClimb(nearStair);
          } else if (nearStair.dir === -1 && moveY > 0.45) {
            this.startAutoStairClimb(nearStair);
          }
        }

        const walkSpeed = 430;
        this.player.vx = moveX * walkSpeed;
        if (Math.abs(moveX) > 0.1) {
          this.player.facing = moveX > 0 ? 1 : -1;
          this.player.walkTimer += dt * 11.5; // Плавні 11.5 кадрів/сек по 8 кадрах!
        } else {
          this.player.walkTimer = 0;
        }

        if (this.player.actionTimer > 0) this.player.actionTimer = Math.max(0, this.player.actionTimer - dt);

        const prevY = this.player.y;
        this.player.x += this.player.vx * dt;
        this.player.x = Math.max(95, Math.min(this.WORLD_W - 95, this.player.x));

        this.player.vy += 2250 * dt;
        this.player.y += this.player.vy * dt;

        let landed = false;
        const dropThrough = moveY > 0.65 && !nearStair;

        if (!dropThrough && this.player.vy >= 0) {
          for (let i = 0; i < cfg.platforms.length; i++) {
            const p = cfg.platforms[i];
            if (this.player.x >= p.x1 && this.player.x <= p.x2) {
              if (prevY <= p.y + 22 && this.player.y >= p.y) {
                this.player.y = p.y;
                if (p.isTrampoline) {
                  this.player.vy = -1260;
                  this.player.onGround = false;
                  if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
                  this.addFloatingText(this.player.x, this.player.y - 120, '🤸‍♀️ БАТУТ!', '#f472b6');
                } else {
                  this.player.vy = 0;
                  this.player.onGround = true;
                }
                landed = true;
                break;
              }
            }
          }
        }
        if (!landed && this.player.y >= cfg.groundY) {
          this.player.y = cfg.groundY;
          this.player.vy = 0;
          this.player.onGround = true;
        }
      }

      // 2. Плавна 8-кадрова ходьба Бруно слідом за Данікою (включно зі сходами!)
      const bTargetX = this.player.x - this.player.facing * 130;
      const bTargetY = this.player.y;
      const bdx = bTargetX - this.bruno.x;
      const bdy = bTargetY - this.bruno.y;
      const bDist = Math.hypot(bdx, bdy);
      if (bDist > 20) {
        const bSpeed = Math.min(bDist, 415 * dt);
        this.bruno.x += (bdx / bDist) * bSpeed;
        this.bruno.y += (bdy / bDist) * bSpeed;
        if (Math.abs(bdx) > 8) this.bruno.facing = bdx > 0 ? 1 : -1;
        this.bruno.walkTimer += dt * 12.5;
        this.bruno.isMoving = true;
      } else {
        this.bruno.isMoving = false;
        this.bruno.walkTimer = 0;
      }
      if (this.bruno.flipTimer > 0) this.bruno.flipTimer = Math.max(0, this.bruno.flipTimer - dt);
      if (this.bruno.barkBubbleTimer > 0) this.bruno.barkBubbleTimer = Math.max(0, this.bruno.barkBubbleTimer - dt);

      // Інші врятовані улюбленці
      let leadX = this.bruno.x, leadY = this.bruno.y;
      this.companionPets.forEach((pet, idx) => {
        const dx = (leadX - this.player.facing * (95 + idx * 12)) - pet.x;
        const dy = leadY - pet.y;
        if (Math.abs(dx) > 20) {
          pet.x += Math.sign(dx) * Math.min(Math.abs(dx), 380 * dt);
          pet.facing = dx > 0 ? 1 : -1;
          pet.hopPhase += dt * 11;
        } else {
          pet.hopPhase = 0;
        }
        pet.y += dy * Math.min(1, 8 * dt);
        leadX = pet.x; leadY = pet.y;
      });

      // 3. Збір монеток
      for (let i = this.droppedCoins.length - 1; i >= 0; i--) {
        const c = this.droppedCoins[i];
        if (!c.grounded) {
          c.vy += 1500 * dt;
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          if (c.y >= cfg.groundY - 25) {
            c.y = cfg.groundY - 25;
            c.vy = -c.vy * 0.35;
            c.vx *= 0.6;
            if (Math.abs(c.vy) < 60) c.grounded = true;
          }
        }
        if (Math.hypot(c.x - this.player.x, c.y - (this.player.y - 95)) < 115) {
          this.droppedCoins.splice(i, 1);
          this.awardCoins(5);
          this.spawnSparkleBurst(c.x, c.y, '#fde047', 8);
          this.addFloatingText(c.x, c.y - 30, '+5 🪙', '#fde047');
          if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
          else if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
        }
      }

      // 4. Частинки та спливаючий текст
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt; p.vy += 380 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.life -= dt; ft.y -= 55 * dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }

      // 5. Кнопка сходів + кнопка найближчої станції
      const stairBtn = document.getElementById('sp-stair-btn');
      if (stairBtn) {
        if (!this.player.stairClimb && this.nearStairInfo) {
          stairBtn.style.display = 'flex';
          document.getElementById('sp-stair-label').textContent = this.nearStairInfo.label;
        } else {
          stairBtn.style.display = 'none';
        }
      }

      let bestSt = null, bestDist = Infinity;
      for (let i = 0; i < cfg.stations.length; i++) {
        const st = cfg.stations[i];
        const d = Math.hypot(st.x - this.player.x, st.y - this.player.y);
        if (d <= st.radius && d < bestDist) { bestDist = d; bestSt = st; }
      }
      this.nearestStation = bestSt;
      const btnEl = document.getElementById('sp-interact-btn');
      if (btnEl) {
        if (bestSt && !this.player.stairClimb) {
          btnEl.style.display = 'flex';
          document.getElementById('sp-interact-icon').textContent = bestSt.icon;
          document.getElementById('sp-interact-label').textContent = bestSt.prompt;
        } else {
          btnEl.style.display = 'none';
        }
      }
    }

    // ------------------------------------------------------------------------
    // РЕНДЕРИНГ СВІТУ З 8-КАДРОВИМИ АНІМАЦІЯМИ ДАНІКИ ТА БРУНО
    // ------------------------------------------------------------------------
    render() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const sw = this.canvas.width;
      const sh = this.canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, sw, sh);

      let scale;
      if (this.camera.zoomMode === 'wide') {
        scale = Math.min(sw / this.WORLD_W, sh / this.WORLD_H);
      } else {
        const minVisibleWidth = Math.min(this.WORLD_W, Math.max(1150, sw * 1.15));
        scale = Math.max(sh / this.WORLD_H, sw / minVisibleWidth);
      }

      const viewW = sw / scale;
      const viewH = sh / scale;
      const targetCamX = Math.max(0, Math.min(this.WORLD_W - viewW, this.player.x - viewW * 0.5));
      const targetCamY = Math.max(0, Math.min(this.WORLD_H - viewH, (this.player.y - 140) - viewH * 0.55));
      this.camera.x += (targetCamX - this.camera.x) * 0.14;
      this.camera.y += (targetCamY - this.camera.y) * 0.14;

      const offsetX = Math.max(0, (sw - this.WORLD_W * scale) * 0.5);
      const offsetY = Math.max(0, (sh - this.WORLD_H * scale) * 0.5);
      this._renderTransform = { scale, offsetX, offsetY, camX: this.camera.x, camY: this.camera.y };

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-this.camera.x, -this.camera.y);

      const bg = this.bgImages[this.currentRoom];
      if (bg) ctx.drawImage(bg, 0, 0, this.WORLD_W, this.WORLD_H);

      // Сяючі маркери початку/кінця сходів
      this.renderStairMarkers(ctx);
      this.renderWorldStations(ctx);
      this.renderCoins(ctx);

      // Улюбленці
      this.companionPets.forEach(pet => {
        const sp = this.sprites['pet_' + pet.id];
        const hopY = Math.abs(Math.sin(pet.hopPhase)) * 16;
        this.drawCharacterSprite(ctx, sp, pet.x, pet.y - hopY, 125, 130, pet.facing, 0, pet.title);
      });

      // Твій Бруно з плавною 8-кадровою анімацією ходьби!
      this.renderBrunoAnimated(ctx);

      // Даніка з плавною 8-кадровою анімацією ходьби!
      this.renderDanikaAnimated(ctx);

      this.renderParticlesAndTexts(ctx);
      ctx.restore();
    }

    renderStairMarkers(ctx) {
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg || !cfg.stairPaths) return;
      const pulse = 0.65 + 0.35 * Math.sin(performance.now() * 0.005);
      cfg.stairPaths.forEach(sp => {
        const bot = sp.points[0];
        const top = sp.points[sp.points.length - 1];
        [
          { pt: bot, icon: '⬆️' },
          { pt: top, icon: '⬇️' }
        ].forEach(m => {
          ctx.save();
          ctx.globalAlpha = 0.85 * pulse;
          ctx.beginPath();
          ctx.arc(m.pt.x, m.pt.y - 34, 24, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(14, 165, 233, 0.82)';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(m.icon, m.pt.x, m.pt.y - 33);
          ctx.restore();
        });
      });
    }

    renderBrunoAnimated(ctx) {
      const b = this.bruno;
      let sprite = null;
      if (b.skinId === 'king_crown') {
        sprite = this.sprites['bruno_king_crown'];
      } else if (b.isMoving && this.brunoWalkFrames.length >= 8) {
        const idx = Math.floor(b.walkTimer) % 8;
        sprite = this.brunoWalkFrames[idx] || this.sprites['bruno_custom_bruno'];
      } else {
        sprite = this.sprites['bruno_custom_bruno'] || this.brunoWalkFrames[0];
      }

      const brunoFlipAngle = b.flipTimer > 0 ? (1 - b.flipTimer / 0.85) * Math.PI * 2 : 0;
      const brunoFlipY = b.flipTimer > 0 ? Math.sin((1 - b.flipTimer / 0.85) * Math.PI) * 120 : 0;
      const bobY = b.isMoving ? Math.abs(Math.sin(b.walkTimer * 0.8)) * 6 : 0;

      this.drawCharacterSprite(ctx, sprite, b.x, b.y - bobY - brunoFlipY, 148, 138, b.facing, brunoFlipAngle, '🐾 Бруно');
      if (b.barkBubbleTimer > 0) this.drawSpeechBubble(ctx, b.x, b.y - 175, b.barkText);
    }

    renderDanikaAnimated(ctx) {
      const p = this.player;
      const isMoving = Math.abs(p.vx) > 20 || Boolean(p.stairClimb);
      let sprite = null;
      let bobY = 0;
      let tiltAngle = 0;

      if (!p.onGround) {
        sprite = this.sprites['danika_jump'] || this.danikaWalkFrames[3];
      } else if (p.actionTimer > 0) {
        sprite = this.sprites['danika_action'] || this.sprites['outfit_' + p.outfitId];
      } else if (isMoving && p.outfitId === 'gandia_polo' && this.danikaWalkFrames.length >= 8) {
        // Плавна 8-кадрова ходьба Даніки!
        const frameIdx = Math.floor(p.walkTimer) % 8;
        sprite = this.danikaWalkFrames[frameIdx];
        bobY = Math.abs(Math.sin(p.walkTimer * Math.PI * 0.25)) * 6;
      } else if (isMoving) {
        sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[Math.floor(p.walkTimer) % 8];
        bobY = Math.abs(Math.sin(p.walkTimer * 0.85)) * 14;
        tiltAngle = Math.sin(p.walkTimer * 0.85) * 0.045;
      } else {
        sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[1];
      }

      const label = p.heldFood ? `✨ Даніка (${p.heldFood})` : '✨ Даніка';
      this.drawCharacterSprite(ctx, sprite, p.x, p.y - bobY, 200, 265, p.facing, tiltAngle, label);
    }

    renderWorldStations(ctx) {
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg) return;
      const time = performance.now() * 0.004;
      cfg.stations.forEach(st => {
        const isNear = this.nearestStation && this.nearestStation.id === st.id;
        const floatY = Math.sin(time + st.x * 0.01) * 7;
        const bx = st.x, by = st.y - 185 + floatY;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(st.x, st.y - 6, isNear ? 72 : 48, isNear ? 16 : 11, 0, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.22)';
        ctx.fill();
        const r = isNear ? 36 : 28;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? '#f59e0b' : 'rgba(15, 23, 42, 0.78)';
        ctx.fill();
        ctx.lineWidth = isNear ? 4 : 2.5;
        ctx.strokeStyle = isNear ? '#ffffff' : '#fde047';
        ctx.stroke();
        ctx.font = `${isNear ? 30 : 24}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(st.icon, bx, by + 2);
        if (isNear) {
          ctx.font = 'bold 20px "Nunito", sans-serif';
          const tw = ctx.measureText(st.title).width + 26;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath(); ctx.roundRect(bx - tw / 2, by - 72, tw, 32, 16); ctx.fill();
          ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#fef08a'; ctx.fillText(st.title, bx, by - 56);
        }
        ctx.restore();
      });
    }

    drawCharacterSprite(ctx, sprite, x, y, maxW, maxH, facing, rotAngle, nameTag) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y - 4, maxW * 0.3, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
      ctx.fill();

      if (sprite) {
        const aspect = sprite.width / sprite.height;
        let dw = maxW, dh = maxW / aspect;
        if (dh > maxH) { dh = maxH; dw = dh * aspect; }
        ctx.translate(x, y - dh * 0.5);
        if (rotAngle) ctx.rotate(rotAngle);
        ctx.scale(facing, 1);
        ctx.drawImage(sprite, -dw * 0.5, -dh * 0.5, dw, dh);
      }
      ctx.restore();

      if (nameTag) {
        ctx.save();
        ctx.font = 'bold 18px "Nunito", sans-serif';
        const tw = ctx.measureText(nameTag).width + 20;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.beginPath(); ctx.roundRect(x - tw / 2, y + 6, tw, 26, 13); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(nameTag, x, y + 19);
        ctx.restore();
      }
    }

    drawSpeechBubble(ctx, x, y, text) {
      ctx.save();
      ctx.font = 'bold 19px "Nunito", sans-serif';
      const tw = ctx.measureText(text).width + 26;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 22, tw, 40, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#831843'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y - 2);
      ctx.restore();
    }

    renderCoins(ctx) {
      const t = performance.now() * 0.005;
      this.droppedCoins.forEach((c, idx) => {
        const floatY = c.grounded ? Math.sin(t + idx) * 6 : 0;
        ctx.save();
        ctx.translate(c.x, c.y + floatY);
        const sx = 0.65 + 0.35 * Math.abs(Math.cos(t + idx));
        ctx.scale(sx, 1);
        ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15'; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = '#ca8a04'; ctx.stroke();
        ctx.fillStyle = '#fef9c3'; ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 1);
        ctx.restore();
      });
    }

    renderParticlesAndTexts(ctx) {
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      this.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.min(1, ft.life);
        ctx.font = '900 24px "Fredoka", "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)'; ctx.lineWidth = 5;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    // ------------------------------------------------------------------------
    // КЕРУВАННЯ (КЛАВІАТУРА, ДЖОЙСТИК ТА ТАП ПО СВІТУ / СХОДАХ)
    // ------------------------------------------------------------------------
    bindControls() {
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        this.keys[e.code] = true;
        if (e.code === 'Space') { e.preventDefault(); this.jump(); }
        if (e.code === 'KeyE') { this.useOrMagic(); }
        if (e.code === 'KeyM') { this.openWorldMap(); }
      });
      window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

      // Тап/клік по полотну — Даніка йде туди (або одразу піднімається сходами!)
      const canvas = document.getElementById('spirit-2d-canvas');
      if (canvas) {
        canvas.addEventListener('pointerdown', (e) => {
          if (!this._renderTransform) return;
          const rect = canvas.getBoundingClientRect();
          const px = (e.clientX - rect.left) * (canvas.width / rect.width);
          const py = (e.clientY - rect.top) * (canvas.height / rect.height);
          const { scale, offsetX, offsetY, camX, camY } = this._renderTransform;
          const wx = (px - offsetX) / scale + camX;
          const wy = (py - offsetY) / scale + camY;

          // Якщо тапнули біля маркера сходів — одразу запускаємо підйом/спуск!
          const cfg = this.roomsConfig[this.currentRoom];
          if (cfg && cfg.stairPaths) {
            for (const sp of cfg.stairPaths) {
              const bot = sp.points[0], top = sp.points[sp.points.length - 1];
              if (Math.hypot(wx - bot.x, wy - bot.y) < 120 && Math.hypot(this.player.x - bot.x, this.player.y - bot.y) < 260) {
                this.startAutoStairClimb({ sp, dir: 1 });
                return;
              }
              if (Math.hypot(wx - top.x, wy - top.y) < 120 && Math.hypot(this.player.x - top.x, this.player.y - top.y) < 260) {
                this.startAutoStairClimb({ sp, dir: -1 });
                return;
              }
            }
          }
          this.player.navTarget = { x: Math.max(95, Math.min(this.WORLD_W - 95, wx)), y: wy };
        });
      }

      // Віртуальний джойстик
      const joyZone = document.getElementById('sp-joystick-zone');
      const joyKnob = document.getElementById('sp-joystick-knob');
      if (joyZone && joyKnob) {
        let activeId = null;
        const updateJoy = (clientX, clientY) => {
          const rect = joyZone.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          let dx = clientX - cx, dy = clientY - cy;
          const maxR = rect.width * 0.36;
          const dist = Math.hypot(dx, dy);
          if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
          joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
          this.joyVec.x = dx / maxR;
          this.joyVec.y = dy / maxR;
        };
        joyZone.addEventListener('pointerdown', (e) => {
          e.stopPropagation(); activeId = e.pointerId;
          joyZone.setPointerCapture(e.pointerId);
          updateJoy(e.clientX, e.clientY);
        });
        joyZone.addEventListener('pointermove', (e) => { if (e.pointerId === activeId) updateJoy(e.clientX, e.clientY); });
        const endJoy = (e) => {
          if (e.pointerId === activeId) {
            activeId = null; this.joyVec.x = 0; this.joyVec.y = 0;
            joyKnob.style.transform = 'translate(0px, 0px)';
          }
        };
        joyZone.addEventListener('pointerup', endJoy);
        joyZone.addEventListener('pointercancel', endJoy);
      }
    }

    onResize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(window.innerWidth * dpr);
      this.canvas.height = Math.round(window.innerHeight * dpr);
    }

    awardCoins(amount) {
      this.progress.coins = (this.progress.coins || 0) + amount;
      if (window.game && window.game.state) {
        window.game.state.coins = (window.game.state.coins || 0) + amount;
        if (window.game.saveState) window.game.saveState();
      }
      this.saveProgress();
      this.syncHUD();
    }

    awardXP(amount) {
      const oldLvl = this.getLevel();
      this.progress.xp = (this.progress.xp || 0) + amount;
      const newLvl = this.getLevel();
      if (newLvl > oldLvl) {
        this.progress.level = newLvl;
        if (window.confetti) window.confetti({ particleCount: 95, spread: 85 });
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        this.showToast(`🎉 НОВИЙ РІВЕНЬ ${newLvl}! Перевір Карту Гандії та Гардероб!`);
      }
      this.saveProgress();
      this.syncHUD();
    }

    syncHUD() {
      const cEl = document.getElementById('sp-coins-val');
      const xEl = document.getElementById('sp-xp-val');
      const lEl = document.getElementById('sp-lvl-val');
      const uEl = document.getElementById('sp-unlocked-count');
      const qEl = document.getElementById('sp-quests-count');
      if (cEl) cEl.textContent = this.progress.coins || 0;
      if (xEl) xEl.textContent = this.progress.xp || 0;
      if (lEl) lEl.textContent = this.getLevel();
      if (uEl) uEl.textContent = this.progress.unlockedRooms.length;
      if (qEl) qEl.textContent = this.progress.completedQuests.length;
    }

    showToast(msg) {
      const el = document.getElementById('sp-toast');
      if (!el) return;
      el.textContent = msg;
      el.style.display = 'block';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3600);
    }
  }

  window.roblox3D = new DanikaSpiritWorld2D();
})();
