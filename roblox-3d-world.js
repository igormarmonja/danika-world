// ============================================================================
// DANIKA & BRUNO: SPIRITFARER / CUPHEAD STYLE 2D WIDE INTERACTIVE WORLD
// Широкий двоповерховий 2D-світ із плавною камерою, живою покадровою анімацією
// бігу та стрибків Pixar-Даніки і Бруно, сходами на 2-й поверх, хмарними
// платформами, Спа-центром порятунку тваринок, випіканням смаколиків та квестами!
// ============================================================================

(function () {
  class DanikaSpiritWorld2D {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.canvas = null;
      this.ctx = null;
      this.animFrameId = null;
      this.lastTime = 0;

      // Розмір панорамного рівня у віртуальних координатах (16:9 високої чіткості)
      this.WORLD_W = 2400;
      this.WORLD_H = 1350;

      // Поточна кімната: 'villa' (Вілла та Тераса Гандії) або 'academy' (Чарівна Академія та Хмарна Обсерваторія)
      this.currentRoom = 'villa';

      // Камера (плавно слідує за Данікою + режим огляду всієї панорами)
      this.camera = {
        x: 0,
        y: 0,
        zoomMode: 'follow' // 'follow' (крупний план як у Spiritfarer) або 'wide' (видно весь 2-поверховий будинок)
      };

      // Стан Даніки у 2D-світі
      this.player = {
        x: 920,
        y: 1140,
        vx: 0,
        vy: 0,
        facing: 1,       // 1 = вправо, -1 = вліво
        onGround: true,
        onStairs: false,
        walkTimer: 0,
        actionTimer: 0,
        outfitId: 'gandia_polo', // 'gandia_polo', 'princess_rose', 'fairy_sky', 'kawaii_hoodie', 'teacher_suit'
        heldFood: null           // null, '🧁 Кекс', '🍕 Піца', '🧪 Зілля', '🦴 Кісточка'
      };

      // Стан песика Бруно
      this.bruno = {
        x: 780,
        y: 1140,
        vx: 0,
        vy: 0,
        facing: 1,
        skinId: 'star_collar', // 'star_collar', 'king_crown'
        hopPhase: 0,
        flipTimer: 0,
        barkBubbleTimer: 0,
        barkText: 'Гав-гав! 🐾'
      };

      // Врятовані улюбленці, які бігають за Данікою та Бруно
      this.companionPets = [];

      // Фізичні монетки, смаколики та частинки, які вилітають зі скринь/печі і які треба збирати!
      this.droppedCoins = [];
      this.particles = [];
      this.floatingTexts = [];

      // Керування (Клавіатура + Віртуальний джойстик + Тач)
      this.keys = {};
      this.joyVec = { x: 0, y: 0 };

      // Стан інтерактивних станцій світу
      this.stationStates = {
        ovenBaking: 0,      // Таймер випікання у печі
        fireplaceLit: true,
        cauldronBubbling: 0,
        fountainActive: 0,
        openedChests: {}
      };

      // Активний щоденний квест-орієнтир угорі екрана
      this.questSteps = [
        { id: 'bake_cake', room: 'villa', title: '🥐 Завдання 1: Підійди до Печі на кухні зліва та спечи Полуничний Кекс!', done: false },
        { id: 'climb_loft', room: 'villa', title: '🪜 Завдання 2: Піднімися дерев’яними сходами на 2-й поверх Вілли до столу Даніки!', done: false },
        { id: 'go_academy', room: 'villa', title: '🌴 Завдання 3: Вийди направо на Сонячну Терасу з маяком і перейди в Чарівну Академію!', done: false },
        { id: 'rescue_pet', room: 'academy', title: '🛁 Завдання 4: У центрі Академії в Кришталевому Спа приручи Кошеня або Єдинорога!', done: false },
        { id: 'sky_chest', room: 'academy', title: '☁️ Завдання 5: Застрибни по пухнастих хмаринках під зоряний купол до Небесної Скрині!', done: false }
      ];

      // Кеш завантажених фонів та вирізаних прозорих Pixar-спрайтів
      this.bgImages = {};
      this.sprites = {};
      this.dataUrls = {};
      this.nearestStation = null;

      // Каталог образів для Гардеробної Героя
      this.wardrobeCatalog = {
        danika: [
          { id: 'gandia_polo', title: '👕 Фірмове Поло (Colegio Abecé)', src: 'assets/characters/pixar/danika_pixar_base.jpg', crop: { x: 0, y: 0, w: 1, h: 1 } },
          { id: 'princess_rose', title: '👑 Принцеса Троянд', src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0, w: 0.5, h: 0.5 } },
          { id: 'fairy_sky', title: '🧚‍♀️ Небесна Фея з крилами', src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } },
          { id: 'kawaii_hoodie', title: '🍓 Полуничне Худі та Навушники', src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
          { id: 'teacher_suit', title: '👩‍🏫 Вчителька Академії', src: 'assets/characters/pixar/danika_pixar_outfits.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
        ],
        bruno: [
          { id: 'star_collar', title: '🐶 Бруно з зірочкою', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0, y: 0, w: 0.5, h: 0.5 } },
          { id: 'king_crown', title: '👑 Супер-Король Бруно', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0, w: 0.5, h: 0.5 } }
        ],
        pets: [
          { id: 'pixar_kitten', title: '🐱 Рожеве Кошеня Мурчик', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0, y: 0.5, w: 0.5, h: 0.5 } },
          { id: 'pixar_unicorn', title: '🦄 Чарівний Єдиноріг Зірочка', src: 'assets/characters/pixar/bruno_pixar_sheet.jpg', crop: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 } }
        ]
      };

      // Освітні міні-завдання для станцій (Кухня, Алхімія, Спа Тваринок, Скрині Скарбів)
      this.challenges = [
        {
          q: '🧁 Рецепт Шефа Даніки: Для тіста потрібно 6 полуничок і ще 3 вишеньки. Скільки всього ягідок?',
          options: ['9 ягідок 🍓', '8 ягідок', '10 ягідок'],
          correct: 0
        },
        {
          q: '🇪🇸 Іспанська на Терасі Гандії: Як іспанською мовою сказати «Море і Сонце»?',
          options: ['Mar y Sol ☀️🌊', 'Gato y Perro 🐱🐶', 'Casa Grande 🏠'],
          correct: 0
        },
        {
          q: '🧪 Загадка Алхімічної Лабораторії: Який колір утвориться, якщо змішати Синій та Жовтий?',
          options: ['Червоний 🔴', 'Зелений 🟢', 'Фіолетовий 🟣'],
          correct: 1
        },
        {
          q: '🛁 Спа-Порятунок Улюбленця: У кошеняти 4 лапки, а у Бруно ще 4. Скільки лапок треба помити піною?',
          options: ['6 лапок', '8 лапок 🐾', '10 лапок'],
          correct: 1
        },
        {
          q: '🔭 Зоряна Обсерваторія: Як називається наша галактика, яку видно крізь скляний купол?',
          options: ['Чумацький Шлях (Milky Way) 🌌', 'Сонячна Хмаринка ☁️', 'Велика Ведмедиця 🐻'],
          correct: 0
        },
        {
          q: '🇬🇧 English Academy: Як англійською перекладається «Treasure Chest» (Скриня Скарбів)?',
          options: ['Скриня Скарбів 🎁', 'Чарівна Книга 📖', 'Літаючий Корабель ⛵'],
          correct: 0
        },
        {
          q: '🧮 Швидка Математика: Скільки буде 15 - 7?',
          options: ['7', '8 🌟', '9'],
          correct: 1
        }
      ];
      this.challengeIdx = 0;

      // Геометрія платформ, сходів та інтерактивних станцій для обох кімнат
      this.roomsConfig = this.buildRoomsConfig();
    }

    // ------------------------------------------------------------------------
    // КОНФІГУРАЦІЯ ПЛАТФОРМ, СХОДІВ ТА ІНТЕРАКТИВНИХ ОБ'ЄКТІВ (2 ПАНОРАМНІ КІМНАТИ)
    // ------------------------------------------------------------------------
    buildRoomsConfig() {
      return {
        villa: {
          title: '🏡 Кімната 1: Двоповерхова Вілла та Тераса Гандії',
          bgSrc: 'assets/characters/pixar/spirit_room1_villa.jpg',
          groundY: 1145,
          // Горизонтальні платформи (на які можна застрибувати або підніматися сходами)
          platforms: [
            // Головний балкон 2-го поверху (Антресоль над вітальнею)
            { x1: 695, x2: 1685, y: 452, label: '2-й Поверх: Спальня-Балкон' },
            // Кухонний стіл зліва (можна застрибнути)
            { x1: 470, x2: 640, y: 970 },
            // Пухке крісло біля каміна (працює як батут!)
            { x1: 810, x2: 990, y: 955, isTrampoline: true },
            // Проміжні сходинки дерев'яних сходів справа наліво (від X=1640, Y=1145 до X=1240, Y=452)
            { x1: 1520, x2: 1690, y: 1010 },
            { x1: 1420, x2: 1580, y: 875 },
            { x1: 1320, x2: 1480, y: 740 },
            { x1: 1220, x2: 1380, y: 600 }
          ],
          // Діагональні сходи (коли йдеш по них і тримаєш Вгору або просто крокуєш по сходинках)
          stairs: { xBottom: 1650, yBottom: 1145, xTop: 1230, yTop: 452 },
          // Інтерактивні станції у Віллі
          stations: [
            {
              id: 'kitchen_oven',
              x: 335,
              y: 1145,
              radius: 170,
              icon: '🧁',
              title: 'Кухонна Піч Шефа Даніки',
              prompt: '🧁 Спекти Полуничний Кекс (+20 🪙)',
              onUse: () => this.startStationQuest('kitchen_oven', 'bake_cake', () => {
                this.stationStates.ovenBaking = 2.6;
                this.player.heldFood = '🧁 Гарячий Кекс';
                this.spawnCoinFountain(335, 960, 7);
                this.addFloatingText(335, 880, '🧁 Кекс спечено! +20 🪙', '#fde047');
                this.showToast('🧁 Ммм! Ароматний Полуничний Кекс готовий! Збери монетки на кухні!');
              })
            },
            {
              id: 'cozy_armchair',
              x: 900,
              y: 1145,
              radius: 150,
              icon: '🛋️',
              title: 'Пружинне Крісло-Батут',
              prompt: '🤸‍♀️ Підстрибнути на 2-й Поверх!',
              onUse: () => {
                this.player.x = 900;
                this.player.y = 940;
                this.player.vy = -1280;
                this.player.onGround = false;
                if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
                this.addFloatingText(900, 860, '🤸‍♀️ ВЖУХ НА 2-Й ПОВЕРХ!', '#f472b6');
              }
            },
            {
              id: 'fireplace_warm',
              x: 1110,
              y: 1145,
              radius: 155,
              icon: '🔥',
              title: 'Камін Затишної Вітальні',
              prompt: '🔥 Підкинути чарівні дрова (+10 XP)',
              onUse: () => {
                this.awardXP(10);
                this.spawnSparkleBurst(1110, 960, '#fb923c', 22);
                this.commandBrunoTrick('Гав! Як тепло біля каміна! 🔥');
                this.addFloatingText(1110, 880, '🔥 +10 XP Тепло та Затишок!', '#fdba74');
              }
            },
            {
              id: 'stairs_up_helper',
              x: 1600,
              y: 1145,
              radius: 165,
              icon: '🪜',
              title: 'Дерев’яні Сходи на 2-й Поверх',
              prompt: '🪜 Піднятися сходами на Балкон 2-го поверху',
              onUse: () => {
                this.player.x = 1260;
                this.player.y = 452;
                this.player.vy = -220;
                this.completeQuestStep('climb_loft');
                if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
                this.addFloatingText(1260, 360, '✨ 2-й Поверх Вілли!', '#38bdf8');
              }
            },
            {
              id: 'loft_wardrobe',
              x: 910,
              y: 452,
              radius: 175,
              icon: '👗',
              title: 'Гардеробна Шафа Героя (2-й Поверх)',
              prompt: '🪞👗 Відкрити Гардероб Даніки та Бруно',
              onUse: () => {
                this.completeQuestStep('climb_loft');
                this.openWardrobeModal();
              }
            },
            {
              id: 'loft_study_desk',
              x: 1520,
              y: 452,
              radius: 175,
              icon: '📖',
              title: 'Стіл Відкриттів Даніки (2-й Поверх)',
              prompt: '📖 Розв’язати задачу в Щоденнику (+20 🪙)',
              onUse: () => {
                this.completeQuestStep('climb_loft');
                this.startStationQuest('loft_study_desk', 'climb_loft', () => {
                  this.spawnCoinFountain(1520, 350, 7);
                  this.addFloatingText(1520, 300, '🌟 Розумничка! +20 🪙', '#fde047');
                });
              }
            },
            {
              id: 'terrace_portal',
              x: 2080,
              y: 1145,
              radius: 210,
              icon: '🌴',
              title: 'Сонячна Тераса Гандії та Маяк',
              prompt: '🚪 Вирушити в Чарівну Академію (Кімната 2) ➔',
              onUse: () => {
                this.completeQuestStep('go_academy');
                this.switchRoom('academy', 220, 1155);
              }
            }
          ]
        },

        academy: {
          title: '🔮 Кімната 2: Чарівна Академія, Спа Тваринок та Хмарна Обсерваторія',
          bgSrc: 'assets/characters/pixar/spirit_room2_academy.jpg',
          groundY: 1155,
          platforms: [
            // Лівий балкон 2-го поверху (Верхня Алхімічна Бібліотека)
            { x1: 110, x2: 860, y: 655, label: '2-й Поверх: Зоряна Бібліотека' },
            // Хмаринка 1 (справа внизу над дерев'яними сходами)
            { x1: 1850, x2: 2160, y: 920, isCloud: true },
            // Хмаринка 2 (посередині справа)
            { x1: 1450, x2: 1730, y: 780, isCloud: true },
            // Балкон Зоряної Обсерваторії справа вгорі (зі скринями та золотою сферою)
            { x1: 1760, x2: 2290, y: 650, label: 'Зоряна Обсерваторія' },
            // Найвища Хмаринка 3 зі Скринею Скарбів під куполом!
            { x1: 1290, x2: 1620, y: 535, isCloud: true, label: 'Небесна Хмаринка Скарбів' },
            // Сходинки дерев'яного містка справа внизу
            { x1: 1680, x2: 1860, y: 1035 }
          ],
          stairs: { xBottom: 1710, yBottom: 1155, xTop: 1960, yTop: 920 },
          stations: [
            {
              id: 'door_back_villa',
              x: 130,
              y: 1155,
              radius: 160,
              icon: '🏡',
              title: 'Портал до Вілли Гандії',
              prompt: '⬅ Повернутися у Віллу Даніки (Кімната 1)',
              onUse: () => {
                this.switchRoom('villa', 1980, 1145);
              }
            },
            {
              id: 'alchemy_cauldron_1',
              x: 495,
              y: 1155,
              radius: 175,
              icon: '🧪',
              title: 'Алхімічний Казан Науки',
              prompt: '🧪 Зварити Смарагдове Зілля Знань (+20 🪙)',
              onUse: () => this.startStationQuest('alchemy_cauldron_1', null, () => {
                this.stationStates.cauldronBubbling = 3.5;
                this.player.heldFood = '🧪 Зілля Мудрості';
                this.spawnCoinFountain(495, 980, 7);
                this.spawnSparkleBurst(495, 960, '#4ade80', 26);
                this.addFloatingText(495, 880, '🧪 Зілля зварено! +20 🪙', '#4ade80');
              })
            },
            {
              id: 'crystal_pet_spa',
              x: 1160,
              y: 1155,
              radius: 210,
              icon: '🛁',
              title: 'Кришталевий Спа-Салон та Порятунок Улюбленців',
              prompt: '🛁🦄 Помити піною та приручити нового Pixar-Улюбленця!',
              onUse: () => this.startStationQuest('crystal_pet_spa', 'rescue_pet', () => {
                this.rescueNewCompanionPet();
              })
            },
            {
              id: 'wishing_fountain',
              x: 1425,
              y: 1155,
              radius: 145,
              icon: '⛲',
              title: 'Кришталевий Фонтан Бажань',
              prompt: '⛲ Підкинути монетку на щастя (+15 XP)',
              onUse: () => {
                this.stationStates.fountainActive = 3.0;
                this.awardXP(15);
                this.spawnSparkleBurst(1425, 1020, '#38bdf8', 25);
                this.addFloatingText(1425, 920, '⛲ Бажання здійсниться! +15 XP', '#7dd3fc');
              }
            },
            {
              id: 'cloud_elevator_helper',
              x: 1760,
              y: 1155,
              radius: 165,
              icon: '☁️',
              title: 'Хмарні Сходи під Зоряний Купол',
              prompt: '☁️ Застрибнути на першу Хмаринку!',
              onUse: () => {
                this.player.x = 1980;
                this.player.y = 920;
                this.player.vy = -300;
                if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
              }
            },
            {
              id: 'observatory_chests',
              x: 1960,
              y: 650,
              radius: 190,
              icon: '🔭',
              title: 'Королівські Скрині Зоряної Обсерваторії',
              prompt: '🎁 Відкрити Скрині Обсерваторії (+25 🪙)',
              onUse: () => this.startStationQuest('observatory_chests', 'sky_chest', () => {
                this.spawnCoinFountain(1960, 540, 9);
                this.addFloatingText(1960, 460, '🔭 Скарб Обсерваторії! +25 🪙', '#fde047');
              })
            },
            {
              id: 'top_cloud_chest',
              x: 1455,
              y: 535,
              radius: 180,
              icon: '👑',
              title: 'Небесна Скриня на Вершині Хмар',
              prompt: '👑 Відкрити Небесну Скриню Чемпіона (+30 🪙)',
              onUse: () => this.startStationQuest('top_cloud_chest', 'sky_chest', () => {
                this.completeQuestStep('sky_chest');
                this.spawnCoinFountain(1455, 420, 12);
                if (window.confetti) window.confetti({ particleCount: 80, spread: 80 });
                this.addFloatingText(1455, 350, '🏆 ЧЕМПІОН ХМАР! +30 🪙', '#fde047');
              })
            },
            {
              id: 'upper_library_cauldron',
              x: 480,
              y: 655,
              radius: 180,
              icon: '📚',
              title: 'Таємна Бібліотека 2-го Поверху',
              prompt: '📚 Відкрити Таємний Сувій Вчительки Даніки (+25 🪙)',
              onUse: () => this.startStationQuest('upper_library_cauldron', null, () => {
                this.spawnCoinFountain(480, 540, 8);
                this.addFloatingText(480, 460, '📚 Таємницю відкрито! +25 🪙', '#c084fc');
              })
            }
          ]
        }
      };
    }

    // ------------------------------------------------------------------------
    // ВІДКРИТТЯ / ЗАКРИТТЯ СВІТУ
    // ------------------------------------------------------------------------
    open() {
      this.ensureDOM();
      const overlay = document.getElementById('roblox-3d-overlay');
      if (!overlay) return;
      overlay.style.display = 'flex';
      this.isOpen = true;

      if (!this.isInitialized) {
        this.initCanvasWorld();
      }
      this.onResize();
      this.syncHUD();
      this.updateQuestBanner();
      this.startLoop();
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
    }

    close() {
      this.isOpen = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      const overlay = document.getElementById('roblox-3d-overlay');
      if (overlay) overlay.style.display = 'none';
      if (window.game && typeof window.game.updateUI === 'function') {
        window.game.updateUI();
      }
    }

    // ------------------------------------------------------------------------
    // DOM ТА UI ПАНЕЛІ (SPIRITFARER HUD + КВЕСТ-БАНЕР + ГАРДЕРОБНА + КЕРУВАННЯ)
    // ------------------------------------------------------------------------
    ensureDOM() {
      if (document.getElementById('roblox-3d-overlay')) return;

      const wrap = document.createElement('div');
      wrap.id = 'roblox-3d-overlay';
      wrap.innerHTML = `
        <style>
          #roblox-3d-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #0f172a;
            display: none;
            flex-direction: column;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
            font-family: 'Nunito', 'Fredoka', sans-serif;
            overflow: hidden;
          }
          #spirit-2d-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: block;
          }
          .sp-top-bar {
            position: absolute;
            top: 10px;
            left: 12px;
            right: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            z-index: 25;
            pointer-events: none;
            flex-wrap: wrap;
          }
          .sp-top-group {
            display: flex;
            align-items: center;
            gap: 7px;
            pointer-events: auto;
            flex-wrap: wrap;
          }
          .sp-pill {
            background: rgba(15, 23, 42, 0.84);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.32);
            color: #fff;
            padding: 7px 14px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 0.90rem;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.4);
          }
          .sp-btn {
            cursor: pointer;
            transition: transform 0.12s, filter 0.15s;
          }
          .sp-btn:hover { filter: brightness(1.12); }
          .sp-btn:active { transform: scale(0.93); }
          .sp-btn-hero {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            border-color: #fbcfe8;
          }
          .sp-btn-room {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-color: #fde68a;
          }
          .sp-btn-zoom {
            background: linear-gradient(135deg, #0ea5e9, #2563eb);
            border-color: #bae6fd;
          }
          .sp-btn-exit {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-color: #fecaca;
          }

          /* Активний банер поточного завдання (як у Spiritfarer) */
          #sp-quest-tracker {
            position: absolute;
            top: 58px;
            left: 14px;
            background: linear-gradient(135deg, rgba(30, 27, 75, 0.92), rgba(49, 46, 129, 0.92));
            border: 2.5px solid #fbbf24;
            color: #fef08a;
            padding: 8px 16px;
            border-radius: 18px;
            font-weight: 900;
            font-size: 0.88rem;
            z-index: 22;
            max-width: min(540px, calc(100vw - 28px));
            box-shadow: 0 8px 22px rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            gap: 10px;
          }

          /* Контекстна кнопка взаємодії зі станцією */
          #sp-interact-btn {
            position: absolute;
            bottom: 112px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            color: #fff;
            border: 3px solid #fff;
            border-radius: 999px;
            padding: 12px 26px;
            font-weight: 900;
            font-size: 1.05rem;
            box-shadow: 0 10px 28px rgba(234, 88, 12, 0.6);
            z-index: 30;
            display: none;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            animation: spPulse 1.0s infinite alternate;
          }
          @keyframes spPulse {
            from { transform: translateX(-50%) scale(1); }
            to { transform: translateX(-50%) scale(1.06); }
          }

          /* Віртуальний джойстик зліва */
          #sp-joystick-zone {
            position: absolute;
            bottom: 22px;
            left: 22px;
            width: 124px;
            height: 124px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.45);
            border: 3px solid rgba(255,255,255,0.55);
            z-index: 25;
            touch-action: none;
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          }
          #sp-joystick-knob {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 54px;
            height: 54px;
            margin-left: -27px;
            margin-top: -27px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffffff, #cbd5e1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
            pointer-events: none;
          }

          /* Праві кнопки керування (Стрибок, Дія, Погладити Бруно) */
          .sp-right-controls {
            position: absolute;
            bottom: 22px;
            right: 22px;
            display: flex;
            align-items: flex-end;
            gap: 12px;
            z-index: 25;
          }
          .sp-action-circle {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            border: 3px solid #fff;
            color: #fff;
            font-weight: 900;
            font-size: 0.78rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
          }
          .sp-action-circle:active { transform: scale(0.91); }

          /* Тост-повідомлення */
          #sp-toast {
            position: absolute;
            top: 108px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.94);
            color: #fde047;
            border: 2px solid #fde047;
            padding: 9px 20px;
            border-radius: 999px;
            font-weight: 900;
            font-size: 0.95rem;
            z-index: 40;
            display: none;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
            pointer-events: none;
          }

          /* Гардеробна Кімнати Героя */
          #sp-wardrobe-modal, #sp-quest-modal {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.76);
            backdrop-filter: blur(8px);
            z-index: 60;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
          .sp-modal-card {
            background: linear-gradient(180deg, #1e1b4b, #0f172a);
            border: 3px solid #f472b6;
            border-radius: 28px;
            max-width: 640px;
            width: 100%;
            max-height: 88vh;
            overflow-y: auto;
            padding: 20px;
            color: #fff;
            box-shadow: 0 24px 60px rgba(0,0,0,0.75);
          }
          .sp-wardrobe-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
            gap: 10px;
            margin-top: 12px;
          }
          .sp-w-item {
            background: rgba(255,255,255,0.08);
            border: 2px solid rgba(255,255,255,0.18);
            border-radius: 18px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.15s;
          }
          .sp-w-item:hover { background: rgba(255,255,255,0.16); transform: translateY(-2px); }
          .sp-w-item.active {
            background: linear-gradient(135deg, rgba(236,72,153,0.45), rgba(139,92,246,0.45));
            border-color: #fde047;
            box-shadow: 0 0 16px rgba(253, 224, 71, 0.5);
          }
          .sp-quest-card {
            background: linear-gradient(180deg, #fffbeb, #fef3c7);
            border: 4px solid #f59e0b;
            border-radius: 26px;
            max-width: 460px;
            width: 100%;
            padding: 22px;
            text-align: center;
            color: #451a03;
            box-shadow: 0 20px 50px rgba(0,0,0,0.65);
          }
          .sp-quest-opt {
            display: block;
            width: 100%;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 16px;
            border: 2.5px solid #fbbf24;
            background: #ffffff;
            color: #451a03;
            font-weight: 900;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.12s, background 0.15s;
          }
          .sp-quest-opt:hover { background: #fef08a; transform: scale(1.02); }
          @media (max-width: 680px) {
            #sp-joystick-zone { width: 106px; height: 106px; bottom: 14px; left: 14px; }
            .sp-right-controls { bottom: 14px; right: 14px; gap: 8px; }
            .sp-action-circle { width: 58px; height: 58px; font-size: 0.7rem; }
            #sp-quest-tracker { top: 92px; font-size: 0.78rem; padding: 6px 12px; }
          }
        </style>

        <canvas id="spirit-2d-canvas"></canvas>

        <!-- Верхня панель -->
        <div class="sp-top-bar">
          <div class="sp-top-group">
            <div class="sp-pill" style="background:linear-gradient(135deg,#ec4899,#8b5cf6); border-color:#fff;">
              🌟 <span id="sp-room-title">🏡 Вілла та Тераса Гандії</span>
            </div>
            <div class="sp-pill">
              🪙 <span id="sp-coins-val">30</span>
            </div>
            <div class="sp-pill">
              ⭐ <span id="sp-xp-val">140</span> XP
            </div>
          </div>

          <div class="sp-top-group">
            <button class="sp-pill sp-btn sp-btn-hero" onclick="window.roblox3D.openWardrobeModal()">
              🪞👗 Образи Даніки і Бруно
            </button>
            <button class="sp-pill sp-btn sp-btn-zoom" id="sp-zoom-btn" onclick="window.roblox3D.toggleCameraZoom()">
              🔍 Камера: Крупний план
            </button>
            <button class="sp-pill sp-btn sp-btn-room" onclick="window.roblox3D.toggleRoom()">
              🚪 Інша локація (1/2)
            </button>
            <button class="sp-pill sp-btn sp-btn-exit" onclick="window.roblox3D.close()">
              ✕ Головне меню
            </button>
          </div>
        </div>

        <!-- Живий трекер завдань у стилі Spiritfarer -->
        <div id="sp-quest-tracker">
          <span style="font-size:1.3rem;">📜</span>
          <span id="sp-quest-text">Завантаження пригоди...</span>
        </div>

        <div id="sp-toast">✨ Ласкаво просимо у світ пригод Даніки та Бруно!</div>

        <!-- Контекстна кнопка дії біля станції -->
        <button id="sp-interact-btn" onclick="window.roblox3D.triggerNearestStation()">
          <span id="sp-interact-icon" style="font-size:1.35rem;">🖐️</span>
          <span id="sp-interact-label">Взаємодіяти</span>
        </button>

        <!-- Джойстик руху (Вліво / Вправо / Вгору по сходах) -->
        <div id="sp-joystick-zone">
          <div id="sp-joystick-knob"></div>
        </div>

        <!-- Праві кнопки: Трюк Бруно, Дія, Стрибок -->
        <div class="sp-right-controls">
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#ec4899,#db2777); width:56px; height:56px;" onclick="window.roblox3D.commandBrunoTrick()">
            <span style="font-size:1.25rem;">🐶</span>
            <span>Бруно!</span>
          </button>
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#f59e0b,#d97706);" onclick="window.roblox3D.useOrMagic()">
            <span style="font-size:1.4rem;">🖐️</span>
            <span>ДІЯ [E]</span>
          </button>
          <button class="sp-action-circle" style="background:linear-gradient(135deg,#10b981,#059669);" onclick="window.roblox3D.jump()">
            <span style="font-size:1.4rem;">⬆️</span>
            <span>СТРИБОК</span>
          </button>
        </div>

        <!-- Модальне вікно Гардеробної Даніки та Бруно -->
        <div id="sp-wardrobe-modal">
          <div class="sp-modal-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; font-family:'Fredoka',cursive; font-size:1.3rem; color:#fbcfe8;">🪞👗 Кімнатка Героя: Образи Pixar-Даніки та Бруно</h3>
              <button onclick="document.getElementById('sp-wardrobe-modal').style.display='none'" style="background:rgba(255,255,255,0.15); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-weight:900; cursor:pointer;">✕</button>
            </div>
            <p style="margin:6px 0 10px; font-size:0.86rem; color:#cbd5e1;">Обери улюблений образ Даніки та костюм для Бруно:</p>
            <div style="font-weight:900; color:#fde047; margin-top:6px;">👧 Образи Даніки (5):</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-danika-grid"></div>
            <div style="font-weight:900; color:#7dd3fc; margin-top:14px;">🐶 Образи Бруно (2):</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-bruno-grid"></div>
          </div>
        </div>

        <!-- Модальне вікно Завдання Станції -->
        <div id="sp-quest-modal">
          <div class="sp-quest-card">
            <div id="sp-q-icon" style="font-size:2.5rem; margin-bottom:4px;">🧁✨</div>
            <h3 id="sp-q-title" style="margin:0 0 8px; font-size:1.22rem; font-family:'Fredoka',cursive;">Завдання Даніки</h3>
            <p id="sp-q-text" style="font-weight:800; font-size:1.02rem; margin-bottom:14px; line-height:1.4;"></p>
            <div id="sp-q-options"></div>
            <button onclick="document.getElementById('sp-quest-modal').style.display='none'" style="margin-top:10px; background:transparent; border:none; color:#92400e; font-weight:800; cursor:pointer;">Закрити</button>
          </div>
        </div>
      `;
      document.body.appendChild(wrap);
      this.bindControls();
    }

    // ------------------------------------------------------------------------
    // ЗАВАНТАЖЕННЯ ПАНОРАМНИХ ФОНІВ ТА ВИРІЗАННЯ ПРОЗОРИХ PIXAR-СПРАЙТІВ
    // ------------------------------------------------------------------------
    initCanvasWorld() {
      this.canvas = document.getElementById('spirit-2d-canvas');
      this.ctx = this.canvas.getContext('2d');
      window.addEventListener('resize', () => this.onResize());

      // 1. Завантажуємо 2 панорамні локації Spiritfarer
      ['villa', 'academy'].forEach(rKey => {
        const img = new Image();
        img.src = this.roomsConfig[rKey].bgSrc + '?v=20261120_1';
        img.onload = () => { this.bgImages[rKey] = img; };
      });

      // 2. Вирізаємо 4 анімаційні кадри руху Даніки з danika_pixar_actions.jpg (Walk1, Walk2, Jump, Action)
      const actSrc = 'assets/characters/pixar/danika_pixar_actions.jpg';
      this.extractTransparentSprite('danika_walk1', actSrc, { x: 0, y: 0, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_walk2', actSrc, { x: 0.5, y: 0, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_jump', actSrc, { x: 0, y: 0.5, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_action', actSrc, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 });

      // 3. Вирізаємо всі 5 костюмів Даніки та 4 образи Бруно/Тваринок
      this.wardrobeCatalog.danika.forEach(d => {
        this.extractTransparentSprite('outfit_' + d.id, d.src, d.crop, () => this.renderWardrobeGrids());
      });
      this.wardrobeCatalog.bruno.forEach(b => {
        this.extractTransparentSprite('bruno_' + b.id, b.src, b.crop, () => this.renderWardrobeGrids());
      });
      this.wardrobeCatalog.pets.forEach(p => {
        this.extractTransparentSprite('pet_' + p.id, p.src, p.crop);
      });

      // Розкладаємо стартові монетки на платформах та сходах
      this.seedInitialRoomCoins();
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

        const isWhite = (idx) => {
          const p = idx * 4;
          return d[p] >= 238 && d[p + 1] >= 238 && d[p + 2] >= 238;
        };
        const push = (x, y) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (!visited[idx] && isWhite(idx)) {
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
                if (lum > 225) {
                  d[p + 3] = Math.max(0, Math.min(255, (255 - lum) * 8));
                }
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

        const pad = 6;
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
        img.src = imgSrc + '?v=20261120_1';
      }
    }

    // ------------------------------------------------------------------------
    // ПЕРЕМИКАННЯ ЛОКАЦІЙ, КАМЕРИ ТА КВЕСТІВ
    // ------------------------------------------------------------------------
    switchRoom(roomKey, spawnX, spawnY) {
      this.currentRoom = roomKey;
      const cfg = this.roomsConfig[roomKey];
      this.player.x = spawnX || 650;
      this.player.y = spawnY || cfg.groundY;
      this.player.vx = 0;
      this.player.vy = 0;
      this.bruno.x = this.player.x - 120;
      this.bruno.y = this.player.y;
      this.companionPets.forEach((p, i) => {
        p.x = this.player.x - 200 - i * 85;
        p.y = this.player.y;
      });
      const titleEl = document.getElementById('sp-room-title');
      if (titleEl) titleEl.textContent = cfg.title;
      this.seedInitialRoomCoins();
      this.updateQuestBanner();
      if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
      this.showToast(`✨ Локація: ${cfg.title}`);
    }

    toggleRoom() {
      if (this.currentRoom === 'villa') {
        this.completeQuestStep('go_academy');
        this.switchRoom('academy', 260, 1155);
      } else {
        this.switchRoom('villa', 1950, 1145);
      }
    }

    toggleCameraZoom() {
      this.camera.zoomMode = this.camera.zoomMode === 'follow' ? 'wide' : 'follow';
      const btn = document.getElementById('sp-zoom-btn');
      if (btn) {
        btn.textContent = this.camera.zoomMode === 'follow'
          ? '🔍 Камера: Крупний план'
          : '🖼️ Камера: Вся Панорама';
      }
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    completeQuestStep(stepId) {
      const st = this.questSteps.find(s => s.id === stepId);
      if (st && !st.done) {
        st.done = true;
        this.updateQuestBanner();
      }
    }

    updateQuestBanner() {
      const el = document.getElementById('sp-quest-text');
      if (!el) return;
      const nextStep = this.questSteps.find(s => !s.done);
      if (nextStep) {
        el.textContent = nextStep.title;
      } else {
        el.textContent = '🏆 Усі 5 головних завдань виконано! Досліджуй світ, печи смаколики та збирай монетки!';
      }
    }

    // ------------------------------------------------------------------------
    // МОНЕТКИ, САЛЮТИ ТА НАГОРОДИ
    // ------------------------------------------------------------------------
    seedInitialRoomCoins() {
      this.droppedCoins = [];
      if (this.currentRoom === 'villa') {
        // Монетки на сходах та балконі 2-го поверху Вілли
        const pts = [
          { x: 550, y: 920 },
          { x: 1580, y: 960 },
          { x: 1450, y: 825 },
          { x: 1320, y: 690 },
          { x: 1120, y: 400 },
          { x: 820, y: 400 },
          { x: 1920, y: 1095 }
        ];
        pts.forEach(p => this.droppedCoins.push({ x: p.x, y: p.y, vx: 0, vy: 0, grounded: true }));
      } else {
        // Монетки на хмаринках та балконах Академії
        const pts = [
          { x: 1980, y: 870 },
          { x: 1580, y: 730 },
          { x: 1450, y: 485 },
          { x: 2050, y: 600 },
          { x: 640, y: 605 },
          { x: 320, y: 605 }
        ];
        pts.forEach(p => this.droppedCoins.push({ x: p.x, y: p.y, vx: 0, vy: 0, grounded: true }));
      }
    }

    spawnCoinFountain(x, y, count = 6) {
      for (let i = 0; i < count; i++) {
        this.droppedCoins.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 480,
          vy: -420 - Math.random() * 340,
          grounded: false
        });
      }
    }

    spawnSparkleBurst(x, y, color = '#fde047', count = 18) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 80 + Math.random() * 260;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 120,
          size: 4 + Math.random() * 6,
          color: color,
          life: 0.7 + Math.random() * 0.4
        });
      }
    }

    addFloatingText(x, y, text, color = '#fde047') {
      this.floatingTexts.push({ x, y, text, color, life: 1.5 });
    }

    // ------------------------------------------------------------------------
    // ОСВІТНІ ЗАВДАННЯ СТАНЦІЙ ТА ПОРЯТУНОК УЛЮБЛЕНЦІВ
    // ------------------------------------------------------------------------
    startStationQuest(stationId, questStepId, onSuccess) {
      const modal = document.getElementById('sp-quest-modal');
      const qText = document.getElementById('sp-q-text');
      const qOpts = document.getElementById('sp-q-options');
      if (!modal || !qText || !qOpts) return;

      const ch = this.challenges[this.challengeIdx % this.challenges.length];
      qText.textContent = ch.q;
      this._pendingQuestCallback = () => {
        this.challengeIdx++;
        this.awardCoins(20);
        this.awardXP(20);
        if (questStepId) this.completeQuestStep(questStepId);
        this.player.actionTimer = 0.9;
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
      const petSpecs = this.wardrobeCatalog.pets;
      const spec = petSpecs[this.companionPets.length % petSpecs.length];
      this.companionPets.push({
        id: spec.id,
        title: spec.title,
        x: 1160,
        y: 1155,
        facing: 1,
        hopPhase: Math.random() * 3
      });
      this.spawnSparkleBurst(1160, 1020, '#f472b6', 30);
      this.spawnCoinFountain(1160, 1000, 6);
      if (window.confetti) window.confetti({ particleCount: 65, spread: 70 });
      this.addFloatingText(1160, 880, `🎉 Приручено: ${spec.title}!`, '#f472b6');
      this.showToast(`🛁✨ Ти помила й приручила нового друга: ${spec.title}! Тепер він бігає за тобою!`);
    }

    // ------------------------------------------------------------------------
    // ГАРДЕРОБНА ДАНИКИ ТА БРУНО
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
      if (dGrid) {
        dGrid.innerHTML = this.wardrobeCatalog.danika.map(d => {
          const url = this.dataUrls['outfit_' + d.id] || '';
          const active = this.player.outfitId === d.id ? 'active' : '';
          return `
            <div class="sp-w-item ${active}" onclick="window.roblox3D.selectDanikaOutfit('${d.id}')">
              ${url ? `<img src="${url}" style="width:80px; height:96px; object-fit:contain;">` : ''}
              <div style="font-weight:900; font-size:0.8rem; margin-top:4px;">${d.title}</div>
            </div>
          `;
        }).join('');
      }
      if (bGrid) {
        bGrid.innerHTML = this.wardrobeCatalog.bruno.map(b => {
          const url = this.dataUrls['bruno_' + b.id] || '';
          const active = this.bruno.skinId === b.id ? 'active' : '';
          return `
            <div class="sp-w-item ${active}" onclick="window.roblox3D.selectBrunoSkin('${b.id}')">
              ${url ? `<img src="${url}" style="width:80px; height:84px; object-fit:contain;">` : ''}
              <div style="font-weight:900; font-size:0.8rem; margin-top:4px;">${b.title}</div>
            </div>
          `;
        }).join('');
      }
    }

    selectDanikaOutfit(outfitId) {
      this.player.outfitId = outfitId;
      this.renderWardrobeGrids();
      this.spawnSparkleBurst(this.player.x, this.player.y - 110, '#f472b6', 22);
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
      const url = this.dataUrls['outfit_' + outfitId];
      if (url) {
        const rImg = document.getElementById('room-danika-img');
        const hImg = document.getElementById('hud-danika-avatar');
        if (rImg) rImg.src = url;
        if (hImg) hImg.src = url;
      }
    }

    selectBrunoSkin(skinId) {
      this.bruno.skinId = skinId;
      this.renderWardrobeGrids();
      this.commandBrunoTrick('Гав-гав! Який крутий образ! 👑');
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
    }

    // ------------------------------------------------------------------------
    // РУХ, СТРИБКИ ТА ДІЇ ГРАВЦЯ
    // ------------------------------------------------------------------------
    jump() {
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
      // Магічний помах чарівною паличкою
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
    // ФІЗИКА СХОДІВ, ПЛАТФОРМ ТА ОНОВЛЕННЯ СВІТУ (60 FPS)
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

      // 1. Вхідні команди руху вліво/вправо та вгору/вниз по сходах
      let moveX = this.joyVec.x;
      let moveY = this.joyVec.y;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;

      moveX = Math.max(-1, Math.min(1, moveX));

      const walkSpeed = 440;
      this.player.vx = moveX * walkSpeed;
      if (Math.abs(moveX) > 0.1) {
        this.player.facing = moveX > 0 ? 1 : -1;
        this.player.walkTimer += dt * 9.5;
      } else {
        this.player.walkTimer = 0;
      }

      if (this.player.actionTimer > 0) {
        this.player.actionTimer = Math.max(0, this.player.actionTimer - dt);
      }

      const prevY = this.player.y;
      this.player.x += this.player.vx * dt;
      this.player.x = Math.max(95, Math.min(this.WORLD_W - 95, this.player.x));

      // 2. Гравітація та приземлення на платформи / підлогу (One-Way Platforms як у Spiritfarer & Cuphead)
      this.player.vy += 2250 * dt;
      this.player.y += this.player.vy * dt;

      let landed = false;
      const dropThrough = moveY > 0.55; // Якщо тягнеш джойстик вниз або S — можна зістрибнути з платформи вниз!

      if (!dropThrough && this.player.vy >= 0) {
        for (let i = 0; i < cfg.platforms.length; i++) {
          const p = cfg.platforms[i];
          if (this.player.x >= p.x1 && this.player.x <= p.x2) {
            if (prevY <= p.y + 18 && this.player.y >= p.y) {
              this.player.y = p.y;
              if (p.isTrampoline) {
                this.player.vy = -1260;
                this.player.onGround = false;
                if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
                this.addFloatingText(this.player.x, this.player.y - 120, '🤸‍♀️ БАТУТ!', '#f472b6');
              } else {
                this.player.vy = 0;
                this.player.onGround = true;
                if (p.y < 500 && this.currentRoom === 'villa') {
                  this.completeQuestStep('climb_loft');
                }
              }
              landed = true;
              break;
            }
          }
        }
      }

      // Головна підлога 1-го поверху
      if (!landed && this.player.y >= cfg.groundY) {
        this.player.y = cfg.groundY;
        this.player.vy = 0;
        this.player.onGround = true;
      }

      // 3. Штучний інтелект песика Бруно та приручених улюбленців (біжать слідом за Данікою і застрибують на платформи!)
      this.updateCompanionAI(this.bruno, this.player.x - this.player.facing * 125, this.player.y, dt);
      if (this.bruno.flipTimer > 0) this.bruno.flipTimer = Math.max(0, this.bruno.flipTimer - dt);
      if (this.bruno.barkBubbleTimer > 0) this.bruno.barkBubbleTimer = Math.max(0, this.bruno.barkBubbleTimer - dt);

      let leadX = this.bruno.x;
      let leadY = this.bruno.y;
      this.companionPets.forEach((pet, idx) => {
        this.updateCompanionAI(pet, leadX - this.player.facing * (95 + idx * 15), leadY, dt);
        leadX = pet.x;
        leadY = pet.y;
      });

      // 4. Таймери станцій (Піч, Казан, Фонтан)
      if (this.stationStates.ovenBaking > 0) {
        this.stationStates.ovenBaking = Math.max(0, this.stationStates.ovenBaking - dt);
      }
      if (this.stationStates.cauldronBubbling > 0) {
        this.stationStates.cauldronBubbling = Math.max(0, this.stationStates.cauldronBubbling - dt);
      }
      if (this.stationStates.fountainActive > 0) {
        this.stationStates.fountainActive = Math.max(0, this.stationStates.fountainActive - dt);
      }

      // 5. Фізика монеток, що розлітаються, та їх збір Данікою
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
        // Перевірка підбору монетки Данікою або Бруно
        const distP = Math.hypot(c.x - this.player.x, c.y - (this.player.y - 95));
        if (distP < 110) {
          this.droppedCoins.splice(i, 1);
          this.awardCoins(5);
          this.spawnSparkleBurst(c.x, c.y, '#fde047', 8);
          this.addFloatingText(c.x, c.y - 30, '+5 🪙', '#fde047');
          if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
          else if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
        }
      }

      // 6. Оновлення частинок та спливаючого тексту
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.vy += 380 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.life -= dt;
        ft.y -= 55 * dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }

      // 7. Пошук найближчої інтерактивної станції поруч із Данікою
      let bestSt = null;
      let bestDist = Infinity;
      for (let i = 0; i < cfg.stations.length; i++) {
        const st = cfg.stations[i];
        const d = Math.hypot(st.x - this.player.x, st.y - this.player.y);
        if (d <= st.radius && d < bestDist) {
          bestDist = d;
          bestSt = st;
        }
      }
      this.nearestStation = bestSt;
      const btnEl = document.getElementById('sp-interact-btn');
      if (btnEl) {
        if (bestSt) {
          btnEl.style.display = 'flex';
          document.getElementById('sp-interact-icon').textContent = bestSt.icon;
          document.getElementById('sp-interact-label').textContent = bestSt.prompt;
        } else {
          btnEl.style.display = 'none';
        }
      }
    }

    updateCompanionAI(pet, targetX, targetY, dt) {
      const dx = targetX - pet.x;
      const dy = targetY - pet.y;
      if (Math.abs(dx) > 22) {
        const step = Math.sign(dx) * Math.min(Math.abs(dx), 390 * dt);
        pet.x += step;
        pet.facing = dx > 0 ? 1 : -1;
        pet.hopPhase += dt * 12;
      } else {
        pet.hopPhase = 0;
      }
      // Плавне переміщення на 2-й поверх / хмаринки за Данікою
      pet.y += dy * Math.min(1, 8 * dt);
    }

    // ------------------------------------------------------------------------
    // РЕНДЕРИНГ ПАНОРАМНОГО СВІТУ SPIRITFARER НА HTML5 CANVAS
    // ------------------------------------------------------------------------
    render() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const sw = this.canvas.width;
      const sh = this.canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, sw, sh);

      // Розрахунок масштабу та положення камери
      let scale;
      if (this.camera.zoomMode === 'wide') {
        scale = Math.min(sw / this.WORLD_W, sh / this.WORLD_H);
      } else {
        // У режимі 'follow' показуємо висоту світу на весь екран (або трохи збільшено на мобільних у портреті)
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

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-this.camera.x, -this.camera.y);

      // 1. Малюємо панорамний фон локації (Вілла Гандії або Чарівна Академія)
      const bg = this.bgImages[this.currentRoom];
      if (bg) {
        ctx.drawImage(bg, 0, 0, this.WORLD_W, this.WORLD_H);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, this.WORLD_W, this.WORLD_H);
      }

      // 2. Малюємо інтерактивні маркери станцій (сяючі іконки-бульбашки над інтерактивними місцями, як у Spiritfarer!)
      this.renderWorldStations(ctx);

      // 3. Малюємо фізичні золоті монетки на підлозі та платформах
      this.renderCoins(ctx);

      // 4. Малюємо приручених улюбленців (Кошеня Мурчик, Єдиноріг Зірочка)
      this.companionPets.forEach(pet => {
        const sp = this.sprites['pet_' + pet.id];
        const hopY = Math.abs(Math.sin(pet.hopPhase)) * 18;
        this.drawCharacterSprite(ctx, sp, pet.x, pet.y - hopY, 130, 135, pet.facing, 0, pet.title);
      });

      // 5. Малюємо песика Бруно
      const brunoSprite = this.sprites['bruno_' + this.bruno.skinId] || this.sprites['bruno_star_collar'];
      const brunoHop = Math.abs(Math.sin(this.bruno.hopPhase)) * 18;
      const brunoFlipAngle = this.bruno.flipTimer > 0 ? (1 - this.bruno.flipTimer / 0.85) * Math.PI * 2 : 0;
      const brunoFlipY = this.bruno.flipTimer > 0 ? Math.sin((1 - this.bruno.flipTimer / 0.85) * Math.PI) * 120 : 0;
      this.drawCharacterSprite(
        ctx,
        brunoSprite,
        this.bruno.x,
        this.bruno.y - brunoHop - brunoFlipY,
        155,
        162,
        this.bruno.facing,
        brunoFlipAngle,
        '🐾 Бруно'
      );

      if (this.bruno.barkBubbleTimer > 0) {
        this.drawSpeechBubble(ctx, this.bruno.x, this.bruno.y - 190, this.bruno.barkText);
      }

      // 6. Малюємо Pixar-Даніку з живою покадровою анімацією бігу, стрибка та магії!
      this.renderDanikaAnimated(ctx);

      // 7. Малюємо частинки та спливаючі написи
      this.renderParticlesAndTexts(ctx);

      ctx.restore();
    }

    renderWorldStations(ctx) {
      const cfg = this.roomsConfig[this.currentRoom];
      if (!cfg) return;
      const time = performance.now() * 0.004;

      cfg.stations.forEach(st => {
        const isNear = (this.nearestStation && this.nearestStation.id === st.id);
        const floatY = Math.sin(time + st.x * 0.01) * 8;
        const bx = st.x;
        const by = st.y - 185 + floatY;

        // Сяючий ореол під станцією
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(st.x, st.y - 6, isNear ? 75 : 52, isNear ? 18 : 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.22)';
        ctx.fill();

        // Кругла іконка-маячок станції
        const r = isNear ? 38 : 30;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? '#f59e0b' : 'rgba(15, 23, 42, 0.78)';
        ctx.fill();
        ctx.lineWidth = isNear ? 4 : 2.5;
        ctx.strokeStyle = isNear ? '#ffffff' : '#fde047';
        ctx.stroke();

        ctx.font = `${isNear ? 32 : 25}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.icon, bx, by + 2);

        if (isNear) {
          ctx.font = 'bold 20px "Nunito", sans-serif';
          const tw = ctx.measureText(st.title).width + 26;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath();
          ctx.roundRect(bx - tw / 2, by - 74, tw, 32, 16);
          ctx.fill();
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#fef08a';
          ctx.fillText(st.title, bx, by - 58);
        }
        ctx.restore();
      });
    }

    renderDanikaAnimated(ctx) {
      const p = this.player;
      const isMoving = Math.abs(p.vx) > 25;
      let sprite = null;
      let bobY = 0;
      let tiltAngle = 0;

      if (!p.onGround) {
        // У повітрі — кадр радісного стрибка!
        sprite = this.sprites['danika_jump'];
      } else if (p.actionTimer > 0) {
        // Під час взаємодії / магії — кадр із чарівною паличкою!
        sprite = this.sprites['danika_action'];
      } else if (isMoving) {
        // Під час ходьби/бігу — чергуємо кадри кроку walk1 -> action -> walk2!
        const phase = Math.floor(p.walkTimer) % 4;
        if (phase === 0) sprite = this.sprites['danika_walk1'];
        else if (phase === 2) sprite = this.sprites['danika_walk2'];
        else sprite = this.sprites['danika_action'] || this.sprites['danika_walk1'];

        bobY = Math.abs(Math.sin(p.walkTimer * Math.PI * 0.5)) * 16;
        tiltAngle = Math.sin(p.walkTimer * Math.PI * 0.5) * 0.04;
      }

      // Якщо стоїть на місці або обрано спеціальний святковий костюм (Принцеса, Фея, Худі, Вчителька)
      if (!sprite || (!isMoving && p.onGround && p.actionTimer <= 0) || p.outfitId !== 'gandia_polo') {
        if (p.outfitId !== 'gandia_polo') {
          sprite = this.sprites['outfit_' + p.outfitId] || sprite;
          if (!p.onGround) bobY = 12;
          else if (isMoving) {
            bobY = Math.abs(Math.sin(p.walkTimer * 1.4)) * 18;
            tiltAngle = Math.sin(p.walkTimer * 1.4) * 0.06;
          }
        } else {
          sprite = this.sprites['outfit_gandia_polo'] || sprite;
        }
      }

      const label = p.heldFood ? `✨ Даніка (${p.heldFood})` : '✨ Даніка';
      this.drawCharacterSprite(ctx, sprite, p.x, p.y - bobY, 210, 275, p.facing, tiltAngle, label);
    }

    drawCharacterSprite(ctx, spriteCanvas, footX, footY, drawW, drawH, facing, angleRad, nameTag) {
      ctx.save();
      // Тінь під ногами на паркеті/платформі
      ctx.beginPath();
      ctx.ellipse(footX, footY - 4, drawW * 0.28, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fill();

      if (spriteCanvas) {
        const aspect = spriteCanvas.width / spriteCanvas.height;
        const h = drawH;
        const w = h * aspect;

        ctx.save();
        ctx.translate(footX, footY - h * 0.5);
        ctx.scale(facing, 1);
        if (angleRad) ctx.rotate(angleRad);
        ctx.drawImage(spriteCanvas, -w * 0.5, -h * 0.5, w, h);
        ctx.restore();
      }

      if (nameTag) {
        ctx.font = 'bold 18px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        const tw = ctx.measureText(nameTag).width + 18;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.beginPath();
        ctx.roundRect(footX - tw / 2, footY + 6, tw, 24, 12);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nameTag, footX, footY + 23);
      }
      ctx.restore();
    }

    drawSpeechBubble(ctx, x, y, text) {
      ctx.save();
      ctx.font = 'bold 20px "Nunito", sans-serif';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(text).width + 28;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x - tw / 2, y - 36, tw, 38, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.fillText(text, x, y - 11);
      ctx.restore();
    }

    renderCoins(ctx) {
      const time = performance.now() * 0.005;
      this.droppedCoins.forEach((c, i) => {
        const bob = Math.sin(time + i) * 6;
        const cx = c.x;
        const cy = c.y + bob;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ca8a04';
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', cx, cy + 1);
        ctx.restore();
      });
    }

    renderParticlesAndTexts(ctx) {
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      this.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        ctx.font = '900 26px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    // ------------------------------------------------------------------------
    // ГАМАНЕЦЬ ТА СИНХРОНІЗАЦІЯ З ОСНОВНОЮ ГРОЮ
    // ------------------------------------------------------------------------
    awardCoins(amount) {
      if (window.game && window.game.state) {
        window.game.state.coins = (Number(window.game.state.coins) || 0) + amount;
        if (typeof window.game.saveState === 'function') window.game.saveState();
      }
      this.syncHUD();
    }

    awardXP(amount) {
      if (window.game && window.game.state) {
        window.game.state.xp = (Number(window.game.state.xp) || 0) + amount;
        if (typeof window.game.saveState === 'function') window.game.saveState();
      }
      this.syncHUD();
    }

    syncHUD() {
      const cEl = document.getElementById('sp-coins-val');
      const xEl = document.getElementById('sp-xp-val');
      if (window.game && window.game.state) {
        if (cEl) cEl.textContent = window.game.state.coins || 0;
        if (xEl) xEl.textContent = window.game.state.xp || 0;
      }
    }

    showToast(msg) {
      const t = document.getElementById('sp-toast');
      if (!t) return;
      t.textContent = msg;
      t.style.display = 'block';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        t.style.display = 'none';
      }, 3800);
    }

    // ------------------------------------------------------------------------
    // ОБРОБНИКИ КЕРУВАННЯ (КЛАВІАТУРА, ДЖОЙСТИК ТА ТАП ПО ЕКРАНУ)
    // ------------------------------------------------------------------------
    bindControls() {
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        this.keys[e.code] = true;
        if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
          if (e.code === 'Space') e.preventDefault();
          this.jump();
        } else if (e.code === 'KeyE' || e.code === 'Enter') {
          this.useOrMagic();
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });

      const joyZone = document.getElementById('sp-joystick-zone');
      const joyKnob = document.getElementById('sp-joystick-knob');
      if (joyZone && joyKnob) {
        let joyActive = false;
        const updateJoy = (clientX, clientY) => {
          const rect = joyZone.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const maxR = rect.width / 2 - 14;
          let dx = clientX - cx;
          let dy = clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > maxR) {
            dx = (dx / dist) * maxR;
            dy = (dy / dist) * maxR;
          }
          joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
          this.joyVec.x = dx / maxR;
          this.joyVec.y = dy / maxR;
          if (this.joyVec.y < -0.65 && this.player.onGround) {
            this.jump();
          }
        };
        const resetJoy = () => {
          joyActive = false;
          joyKnob.style.transform = 'translate(0px, 0px)';
          this.joyVec.x = 0;
          this.joyVec.y = 0;
        };

        joyZone.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          joyActive = true;
          updateJoy(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        joyZone.addEventListener('touchmove', (e) => {
          e.stopPropagation();
          if (joyActive) updateJoy(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        joyZone.addEventListener('touchend', resetJoy);

        joyZone.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          joyActive = true;
          updateJoy(e.clientX, e.clientY);
        });
        window.addEventListener('mousemove', (e) => {
          if (joyActive) updateJoy(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => {
          if (joyActive) resetJoy();
        });
      }
    }

    onResize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  window.roblox3D = new DanikaSpiritWorld2D();
})();
