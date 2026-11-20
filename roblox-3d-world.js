// ============================================================================
// DANIKA & BRUNO: SPIRITFARER 2D WIDE WORLD ENGINE (v20261120_4)
// - Величезні багатозонні локації (до 14,400px ширини — 4-6 зон у кожній!)
// - Схованки / невидимі інтерактивні предмети з призами на кожній локації
// - 15 локацій: 5 відкритих (Дім, Меркадона, Школа, Парк, Чачі Пірулі) + 10 за прогрес
// - Інтерактивна Карта на Canvas (не блокується AdBlock!) з ходьбою ПО ДОРІЖКАХ
// - Легкий прозорий градієнтний інтерфейс, 100% векторні SVG-іконки (ЖОДНОГО емоджі!)
// - Усі 56 костюмів Даніки, всі образи Бруно та всі завдання з Avatar World!
// ============================================================================

(function () {
  const SAVE_KEY = 'danika_spirit_world_v3';
  const ASSET_VER = '20261120_4';
  const ZONE_W = 2400;
  const WORLD_H = 1350;

  class DanikaSpiritWorld2D {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.canvas = null;
      this.ctx = null;
      this.animFrameId = null;
      this.lastTime = 0;

      this.WORLD_H = WORLD_H;
      this.WORLD_W = ZONE_W;

      this.locations = window.SPIRIT_LOCATIONS || {};
      this.mapEdges = window.SPIRIT_MAP_EDGES || [];
      this.questDefs = window.getSpiritQuests ? window.getSpiritQuests() : [];
      this.wardrobeCatalog = window.getSpiritWardrobe ? window.getSpiritWardrobe() : { danika: [], bruno: [], pets: [] };

      this.progress = this.loadProgress();
      this.currentRoom = this.locations[this.progress.lastRoom] ? this.progress.lastRoom : 'danika_home';

      this.camera = { x: 0, y: 0, zoomMode: 'follow' };

      this.player = {
        x: 920,
        y: 1145,
        vx: 0,
        vy: 0,
        facing: 1,
        onGround: true,
        walkTimer: 0,
        actionTimer: 0,
        outfitId: this.progress.activeOutfit || 'gandia_polo',
        stairClimb: null,
        navTarget: null
      };

      this.bruno = {
        x: 780,
        y: 1145,
        facing: 1,
        skinId: this.progress.activeBrunoSkin || 'custom_bruno',
        walkTimer: 0,
        isMoving: false,
        flipTimer: 0,
        barkBubbleTimer: 0,
        barkText: 'Гав-гав!'
      };

      this.companionPets = [];
      this.droppedCoins = [];
      this.particles = [];
      this.floatingTexts = [];
      this.keys = {};
      this.joyVec = { x: 0, y: 0 };

      this.bgImages = {};
      this.sprites = {};
      this.dataUrls = {};
      this.danikaWalkFrames = [];
      this.brunoWalkFrames = [];
      this.nearestStation = null;
      this.nearStairInfo = null;
      this.nearSecret = null;

      // Стан інтерактивної карти світу прямо на Canvas (жодних попапів — AdBlock не блокує!)
      this.atlasMode = false;
      this.atlasWalk = null; // { pathIds, segIdx, t, targetRoomId }
      this.atlasSelectedLocked = null;
      this.atlasBgImg = null;
      this.atlasHoverId = null;

      this.challenges = [
        { q: 'Рецепт Шефа: 6 полуничок + 4 вишеньки. Скільки всього ягідок?', options: ['10 ягідок', '9 ягідок', '11 ягідок'], correct: 0 },
        { q: 'Іспанська в Гандії: Як сказати «Море і Сонце»?', options: ['Mar y Sol', 'Perro y Gato', 'Casa Azul'], correct: 0 },
        { q: 'Наукова лабораторія: Який колір вийде, якщо змішати Синій і Жовтий?', options: ['Червоний', 'Зелений', 'Фіолетовий'], correct: 1 },
        { q: 'Математика з Бруно: У Бруно 4 лапки, і у Кошеняти 4 лапки. Скільки разом?', options: ['6 лапок', '8 лапок', '10 лапок'], correct: 1 },
        { q: 'Англійська на пляжі: Як перекладається «Lighthouse»?', options: ['Маяк', 'Корабель', 'Морозиво'], correct: 0 },
        { q: 'Швидка математика: Скільки буде 14 - 6?', options: ['7', '8', '9'], correct: 1 },
        { q: 'Меркадона: Що означає іспанське слово «Naranja»?', options: ['Апельсин', 'Яблуко', 'Банан'], correct: 0 },
        { q: 'Скарби Гандії: Як англійською «Treasure Chest»?', options: ['Скриня Скарбів', 'Чарівне Дзеркало', 'Золота Корона'], correct: 0 },
        { q: 'Готельний басейн: Було 5 качечок, припливли ще 7. Скільки стало?', options: ['11 качечок', '12 качечок', '13 качечок'], correct: 1 },
        { q: 'Академія зірок: Як називається наша галактика?', options: ['Чумацький Шлях', 'Сонячна Хмарка', 'Зоряна Ріка'], correct: 0 }
      ];
      this.challengeIdx = 0;

      (this.progress.rescuedPets || []).forEach((pid, idx) => {
        const spec = this.wardrobeCatalog.pets.find(p => p.id === pid);
        if (spec) {
          this.companionPets.push({ id: spec.id, title: spec.title, x: 680 - idx * 90, y: 1145, facing: 1, hopPhase: idx });
        }
      });
    }

    // ------------------------------------------------------------------------
    // ЗБЕРЕЖЕННЯ ПРОГРЕСУ (5 ВІДКРИТИХ ЛОКАЦІЙ СТАРТОВО)
    // ------------------------------------------------------------------------
    loadProgress() {
      const defaults = {
        coins: 40,
        xp: 0,
        level: 1,
        unlockedRooms: ['danika_home', 'mercadona', 'school_abece', 'park', 'chachi_piruli'],
        unlockedOutfits: ['gandia_polo'],
        unlockedBrunoSkins: ['custom_bruno'],
        completedQuests: [],
        openedChests: {},
        foundSecrets: {},
        rescuedPets: [],
        activeOutfit: 'gandia_polo',
        activeBrunoSkin: 'custom_bruno',
        lastRoom: 'danika_home'
      };
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const merged = Object.assign({}, defaults, parsed);
          defaults.unlockedRooms.forEach(r => {
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
    // ВІДКРИТТЯ ТА СТВОРЕННЯ ЛЕГКОГО ГРАДІЄНТНОГО ІНТЕРФЕЙСУ (0 ЕМОДЖІ!)
    // ------------------------------------------------------------------------
    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this.createInterfaceDOM();
      if (!this.isInitialized) {
        this.initCanvasWorld();
      }
      this.syncHUD();
      this.updateQuestBanner();
      this.onResize();
      this.startLoop();
    }

    close() {
      this.isOpen = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      const el = document.getElementById('danika-world-stage');
      if (el) el.style.display = 'none';
      if (window.location.pathname.endsWith('3d.html')) {
        window.location.href = 'index.html?v=' + ASSET_VER;
      }
    }

    icon(name, size = 16) {
      const svg = (window.SPIRIT_ICONS && window.SPIRIT_ICONS[name]) || '';
      return `<span class="sp-ico" style="width:${size}px;height:${size}px;">${svg}</span>`;
    }

    createInterfaceDOM() {
      let wrap = document.getElementById('danika-world-stage');
      if (wrap) {
        wrap.style.display = 'block';
        return;
      }
      wrap = document.createElement('div');
      wrap.id = 'danika-world-stage';
      wrap.innerHTML = `
        <style>
          #danika-world-stage {
            position: fixed; inset: 0; z-index: 99999; background: #0b1220;
            overflow: hidden; user-select: none; -webkit-user-select: none;
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          #spirit-2d-canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: pointer; }
          .sp-ico { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .sp-ico svg { width: 100%; height: 100%; display: block; }

          /* Легка прозора верхня панель із градієнтом у прозорість */
          .sp-hud-top {
            position: absolute; top: 0; left: 0; right: 0;
            padding: 10px 14px 22px;
            background: linear-gradient(180deg, rgba(11, 18, 32, 0.72) 0%, rgba(11, 18, 32, 0.28) 65%, rgba(11, 18, 32, 0) 100%);
            display: flex; justify-content: space-between; align-items: center;
            gap: 8px; pointer-events: none; z-index: 20;
          }
          .sp-hud-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; pointer-events: auto; }
          .sp-glass-pill {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.22);
            color: rgba(255, 255, 255, 0.96);
            padding: 5px 11px; border-radius: 12px;
            font-weight: 800; font-size: 0.79rem; letter-spacing: 0.01em;
            display: inline-flex; align-items: center; gap: 6px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
            transition: background 0.16s, transform 0.12s, border-color 0.16s;
          }
          .sp-glass-btn { cursor: pointer; }
          .sp-glass-btn:hover {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 100%);
            border-color: rgba(255, 255, 255, 0.42);
          }
          .sp-glass-btn:active { transform: scale(0.95); }
          .sp-glass-accent {
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.34) 0%, rgba(14, 165, 233, 0.12) 100%);
            border-color: rgba(125, 211, 252, 0.42);
          }

          /* Легкий напівпрозорий рядок поточного завдання у лівому верхньому кутку (не перекриває сцену!) */
          #sp-objective-bar {
            position: absolute; top: 50px; left: 14px;
            background: linear-gradient(90deg, rgba(15, 23, 42, 0.62) 0%, rgba(15, 23, 42, 0.18) 82%, rgba(15, 23, 42, 0) 100%);
            backdrop-filter: blur(6px);
            border-left: 2.5px solid #38bdf8;
            padding: 5px 18px 5px 10px; border-radius: 0 10px 10px 0;
            color: rgba(248, 250, 252, 0.92); font-size: 0.77rem; font-weight: 700;
            display: flex; align-items: center; gap: 7px; z-index: 18;
            max-width: min(440px, 68vw); cursor: pointer;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          }

          /* Індикатор поточної зони великої локації внизу по центру */
          #sp-zone-indicator {
            position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(90deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.56) 22%, rgba(15,23,42,0.56) 78%, rgba(15,23,42,0) 100%);
            padding: 4px 24px; color: rgba(241, 245, 249, 0.88);
            font-size: 0.76rem; font-weight: 800; letter-spacing: 0.02em;
            z-index: 18; pointer-events: none; white-space: nowrap;
            text-shadow: 0 1px 3px rgba(0,0,0,0.6);
          }

          /* Компактні прозорі контекстні кнопки праворуч над керуванням (не закривають Даніку!) */
          .sp-context-stack {
            position: absolute; bottom: 92px; right: 18px;
            display: flex; flex-direction: column; align-items: flex-end; gap: 7px;
            z-index: 25; pointer-events: auto;
          }
          .sp-ctx-pill {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(30, 41, 59, 0.56));
            backdrop-filter: blur(10px);
            border: 1.5px solid rgba(250, 204, 21, 0.65);
            color: #fef9c3; padding: 8px 15px; border-radius: 14px;
            font-weight: 800; font-size: 0.82rem; cursor: pointer;
            display: none; align-items: center; gap: 7px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          }
          .sp-ctx-pill.stair { border-color: rgba(56, 189, 248, 0.75); color: #e0f2fe; }
          .sp-ctx-pill.secret { border-color: rgba(244, 114, 182, 0.8); color: #fce7f3; }

          /* Джойстик і праві кнопки — легкі та напівпрозорі */
          #sp-joystick-zone {
            position: absolute; bottom: 18px; left: 18px; width: 108px; height: 108px;
            border-radius: 50%; background: rgba(15, 23, 42, 0.3);
            border: 1.5px solid rgba(255, 255, 255, 0.32); backdrop-filter: blur(4px);
            z-index: 25; touch-action: none;
          }
          #sp-joystick-knob {
            position: absolute; top: 50%; left: 50%; width: 44px; height: 44px;
            margin-left: -22px; margin-top: -22px; border-radius: 50%;
            background: radial-gradient(circle at 32% 32%, rgba(255,255,255,0.92), rgba(203,213,225,0.72));
            box-shadow: 0 3px 10px rgba(0,0,0,0.35); pointer-events: none;
          }
          .sp-right-controls {
            position: absolute; bottom: 18px; right: 18px;
            display: flex; align-items: flex-end; gap: 9px; z-index: 25;
          }
          .sp-ctrl-circle {
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(145deg, rgba(255,255,255,0.22), rgba(15,23,42,0.48));
            backdrop-filter: blur(8px);
            border: 1.5px solid rgba(255,255,255,0.42);
            color: #fff; font-weight: 800; font-size: 0.64rem;
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
            cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.32);
          }
          .sp-ctrl-circle:active { transform: scale(0.92); }

          /* Тост-сповіщення (акуратний, не блокує огляд) */
          #sp-toast {
            position: absolute; top: 84px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(90deg, rgba(15,23,42,0.84), rgba(30,41,59,0.72));
            backdrop-filter: blur(10px);
            color: #fef08a; border: 1px solid rgba(253, 224, 71, 0.45);
            padding: 7px 16px; border-radius: 12px; font-weight: 800; font-size: 0.82rem;
            z-index: 40; display: none; text-align: center; pointer-events: none;
          }

          /* Легкі скляні панелі (Журнал, Гардероб, Міні-завдання, Відкриття локації) */
          .sp-sheet-wrap {
            position: absolute; inset: 0; background: rgba(7, 11, 22, 0.66);
            backdrop-filter: blur(8px); z-index: 60; display: none;
            align-items: center; justify-content: center; padding: 14px;
          }
          .sp-sheet-card {
            background: linear-gradient(165deg, rgba(24, 32, 54, 0.94), rgba(12, 18, 32, 0.92));
            border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 20px;
            max-width: 760px; width: 100%; max-height: 88vh; overflow-y: auto;
            padding: 18px; color: #f8fafc; box-shadow: 0 24px 60px rgba(0,0,0,0.65);
          }
          .sp-sheet-head {
            display: flex; justify-content: space-between; align-items: center;
            padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.12);
          }
          .sp-sheet-title { margin: 0; font-size: 1.08rem; font-weight: 900; display: flex; align-items: center; gap: 8px; }
          .sp-close-x {
            background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; width: 32px; height: 32px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
          }
          .sp-wardrobe-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
            gap: 9px; margin-top: 10px;
          }
          .sp-w-item {
            background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
            border-radius: 14px; padding: 8px; text-align: center; cursor: pointer;
            transition: transform 0.14s, background 0.14s;
          }
          .sp-w-item:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
          .sp-w-item.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.2); }
          .sp-w-item.locked { opacity: 0.7; }
          .sp-qlog-row {
            display: flex; justify-content: space-between; align-items: center; gap: 10px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; padding: 9px 12px; margin-top: 7px;
          }
          .sp-qlog-row.done { background: rgba(16, 185, 129, 0.16); border-color: rgba(52, 211, 153, 0.4); }
          .sp-quest-opt {
            display: block; width: 100%; padding: 11px 14px; margin: 7px 0;
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.08); color: #fff;
            font-weight: 800; font-size: 0.94rem; cursor: pointer; text-align: left;
          }
          .sp-quest-opt:hover { background: rgba(56, 189, 248, 0.25); border-color: #38bdf8; }

          /* Панель керування Атласом (коли відкрита карта на Canvas) */
          #sp-atlas-bar {
            position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(90deg, rgba(15,23,42,0.88), rgba(30,41,59,0.78));
            backdrop-filter: blur(12px); border: 1px solid rgba(125,211,252,0.45);
            border-radius: 16px; padding: 9px 16px; color: #f8fafc;
            display: none; align-items: center; gap: 12px; z-index: 30;
            max-width: 92vw; font-size: 0.82rem; font-weight: 700;
          }
          @media (max-width: 680px) {
            .sp-glass-pill { padding: 4px 8px; font-size: 0.72rem; }
            #sp-joystick-zone { width: 92px; height: 92px; }
            .sp-ctrl-circle { width: 50px; height: 50px; }
          }
        </style>

        <canvas id="spirit-2d-canvas"></canvas>

        <!-- Верхня легка прозора панель -->
        <div class="sp-hud-top">
          <div class="sp-hud-row">
            <div class="sp-glass-pill sp-glass-accent">
              ${this.icon('pin', 15)}
              <span id="sp-room-title">Кімната Даніки та Вілла</span>
            </div>
            <div class="sp-glass-pill">${this.icon('trophy', 15)}<span>Рів. <b id="sp-lvl-val">1</b></span></div>
            <div class="sp-glass-pill">${this.icon('coin', 15)}<b id="sp-coins-val">40</b></div>
            <div class="sp-glass-pill">${this.icon('star', 15)}<span><b id="sp-xp-val">0</b> XP</span></div>
          </div>

          <div class="sp-hud-row">
            <button class="sp-glass-pill sp-glass-btn sp-glass-accent" id="sp-atlas-toggle-btn" onclick="window.roblox3D.toggleAtlasMap()">
              ${this.icon('map', 15)}<span>Карта (<span id="sp-unlocked-count">5</span>/15)</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.openQuestLog()">
              ${this.icon('scroll', 15)}<span>Завдання (<span id="sp-quests-count">0</span>)</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.openWardrobeModal()">
              ${this.icon('hanger', 15)}<span>Гардероб</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" id="sp-zoom-btn" onclick="window.roblox3D.toggleCameraZoom()">
              ${this.icon('camera', 15)}<span>Камера</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.close()" title="Вийти">
              ${this.icon('close', 14)}
            </button>
          </div>
        </div>

        <div id="sp-objective-bar" onclick="window.roblox3D.openQuestLog()">
          ${this.icon('scroll', 14)}
          <span id="sp-quest-text">Досліджуй світ Гандії...</span>
        </div>

        <div id="sp-toast"></div>
        <div id="sp-zone-indicator">Зона 1 / 6</div>

        <!-- Контекстні кнопки праворуч (не перекривають Даніку!) -->
        <div class="sp-context-stack">
          <button id="sp-secret-btn" class="sp-ctx-pill secret" onclick="window.roblox3D.collectNearSecret()">
            ${this.icon('sparkle', 16)}<span id="sp-secret-label">Оглянути схованку</span>
          </button>
          <button id="sp-stair-btn" class="sp-ctx-pill stair" onclick="window.roblox3D.startAutoStairClimb()">
            ${this.icon('stairs', 16)}<span id="sp-stair-label">Піднятися сходами</span>
          </button>
          <button id="sp-interact-btn" class="sp-ctx-pill" onclick="window.roblox3D.triggerNearestStation()">
            ${this.icon('hand', 16)}<span id="sp-interact-label">Взаємодіяти</span>
          </button>
        </div>

        <!-- Панель Атласу (внизу під час перегляду карти) -->
        <div id="sp-atlas-bar">
          <span id="sp-atlas-msg">Натисни на будь-яку відкриту локацію на карті — Даніка та Бруно підуть туди по доріжках!</span>
          <button id="sp-atlas-unlock-btn" class="sp-glass-pill sp-glass-btn sp-glass-accent" style="display:none;" onclick="window.roblox3D.confirmUnlockSelectedLocation()">Відкрити</button>
          <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.toggleAtlasMap(false)">Назад у світ</button>
        </div>

        <div id="sp-joystick-zone"><div id="sp-joystick-knob"></div></div>

        <div class="sp-right-controls" id="sp-right-controls">
          <button class="sp-ctrl-circle" onclick="window.roblox3D.commandBrunoTrick()" title="Трюк Бруно">
            ${this.icon('paw', 20)}<span>Бруно</span>
          </button>
          <button class="sp-ctrl-circle" onclick="window.roblox3D.useOrMagic()" title="Дія [E]">
            ${this.icon('hand', 20)}<span>Дія</span>
          </button>
          <button class="sp-ctrl-circle" onclick="window.roblox3D.jump()" title="Стрибок">
            ${this.icon('up', 20)}<span>Стрибок</span>
          </button>
        </div>

        <!-- Журнал Завдань -->
        <div id="sp-qlog-sheet" class="sp-sheet-wrap">
          <div class="sp-sheet-card">
            <div class="sp-sheet-head">
              <h3 class="sp-sheet-title">${this.icon('scroll', 18)}<span>Журнал Завдань та Пригод</span></h3>
              <button class="sp-close-x" onclick="document.getElementById('sp-qlog-sheet').style.display='none'">${this.icon('close', 15)}</button>
            </div>
            <div id="sp-qlog-list" style="margin-top:8px;"></div>
          </div>
        </div>

        <!-- Гардеробна (56 образів Даніки + усі образи Бруно) -->
        <div id="sp-wardrobe-sheet" class="sp-sheet-wrap">
          <div class="sp-sheet-card">
            <div class="sp-sheet-head">
              <h3 class="sp-sheet-title">${this.icon('hanger', 18)}<span>Гардероб Даніки та Бруно</span></h3>
              <button class="sp-close-x" onclick="document.getElementById('sp-wardrobe-sheet').style.display='none'">${this.icon('close', 15)}</button>
            </div>
            <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">Виконуй завдання, шукай схованки та збирай монетки, щоб відкривати всі костюми з Avatar World!</div>
            <div style="font-weight:900; color:#7dd3fc; margin-top:12px; font-size:0.86rem;">Образи Даніки (<span id="sp-d-outfit-cnt">0</span>)</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-danika-grid"></div>
            <div style="font-weight:900; color:#fde68a; margin-top:16px; font-size:0.86rem;">Образи Бруно (<span id="sp-b-outfit-cnt">0</span>)</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-bruno-grid"></div>
          </div>
        </div>

        <!-- Міні-завдання станції -->
        <div id="sp-challenge-sheet" class="sp-sheet-wrap">
          <div class="sp-sheet-card" style="max-width:460px;">
            <div class="sp-sheet-head">
              <h3 class="sp-sheet-title">${this.icon('sparkle', 18)}<span>Завдання Даніки</span></h3>
              <button class="sp-close-x" onclick="document.getElementById('sp-challenge-sheet').style.display='none'">${this.icon('close', 15)}</button>
            </div>
            <p id="sp-q-text" style="font-weight:800; font-size:0.98rem; margin:14px 0; line-height:1.45;"></p>
            <div id="sp-q-options"></div>
          </div>
        </div>
      `;
      document.body.appendChild(wrap);
      this.bindControls();
    }

    // ------------------------------------------------------------------------
    // ЗАВАНТАЖЕННЯ СПРАЙТІВ (8-КАДРОВА ДАНІКА + 8-КАДРОВИЙ БРУНО + КАРТА)
    // ------------------------------------------------------------------------
    initCanvasWorld() {
      this.canvas = document.getElementById('spirit-2d-canvas');
      this.ctx = this.canvas.getContext('2d');
      window.addEventListener('resize', () => this.onResize());

      // Карта Гандії для фону Canvas-Атласу
      const mapImg = new Image();
      mapImg.src = 'assets/characters/pixar/spirit_world_map_gandia.jpg?v=' + ASSET_VER;
      mapImg.onload = () => { this.atlasBgImg = mapImg; };

      // 8-кадрова плавна ходьба Даніки
      const dWalkSrc = 'assets/characters/pixar/danika_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        this.extractTransparentSprite('d_walk_' + i, dWalkSrc, { x: (i % 4) * 0.25, y: Math.floor(i / 4) * 0.5, w: 0.25, h: 0.5 }, (c) => {
          this.danikaWalkFrames[i] = c;
        });
      }

      // 8-кадрова плавна ходьба твого Бруно
      const bWalkSrc = 'assets/characters/pixar/bruno_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        this.extractTransparentSprite('b_walk_' + i, bWalkSrc, { x: (i % 4) * 0.25, y: Math.floor(i / 4) * 0.5, w: 0.25, h: 0.5 }, (c) => {
          this.brunoWalkFrames[i] = c;
        });
      }

      const actSrc = 'assets/characters/pixar/danika_pixar_actions.jpg';
      this.extractTransparentSprite('danika_jump', actSrc, { x: 0, y: 0.5, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_action', actSrc, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 });

      // Попередньо завантажуємо базові образи + активний костюм
      this.ensureOutfitSpriteLoaded('gandia_polo');
      this.ensureOutfitSpriteLoaded(this.player.outfitId);
      this.ensureBrunoSpriteLoaded('custom_bruno');
      this.ensureBrunoSpriteLoaded(this.bruno.skinId);
      this.wardrobeCatalog.pets.forEach(p => {
        this.extractTransparentSprite('pet_' + p.id, p.src, p.crop);
      });

      this.switchRoom(this.currentRoom, 900, null, true);
      this.isInitialized = true;
    }

    ensureOutfitSpriteLoaded(outfitId) {
      const item = this.wardrobeCatalog.danika.find(d => d.id === outfitId);
      if (!item) return;
      const key = 'outfit_' + item.id;
      if (this.sprites[key]) return;
      if (item.isPngSprite) {
        const img = new Image();
        img.onload = () => { this.sprites[key] = img; };
        img.src = item.src;
      } else {
        this.extractTransparentSprite(key, item.src, item.crop);
      }
    }

    ensureBrunoSpriteLoaded(skinId) {
      const item = this.wardrobeCatalog.bruno.find(b => b.id === skinId);
      if (!item) return;
      const key = 'bruno_' + item.id;
      if (this.sprites[key]) return;
      if (item.isPngSprite) {
        const img = new Image();
        img.onload = () => { this.sprites[key] = img; };
        img.src = item.src;
      } else {
        this.extractTransparentSprite(key, item.src, item.crop);
      }
    }

    loadZoneImages(roomCfg) {
      (roomCfg.zones || []).forEach(z => {
        if (!this.bgImages[z.bgSrc]) {
          const img = new Image();
          img.src = z.bgSrc + '?v=' + ASSET_VER;
          img.onload = () => { this.bgImages[z.bgSrc] = img; };
        }
      });
    }

    extractTransparentSprite(key, imgSrc, cropNorm, onReady) {
      if (this.sprites[key]) { if (onReady) onReady(this.sprites[key]); return; }
      this._rawCache = this._rawCache || {};
      const process = (img) => {
        const sx = Math.round(cropNorm.x * img.width);
        const sy = Math.round(cropNorm.y * img.height);
        const sw = Math.round(cropNorm.w * img.width);
        const sh = Math.round(cropNorm.h * img.height);
        const c = document.createElement('canvas');
        c.width = sw; c.height = sh;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        const imgData = ctx.getImageData(0, 0, sw, sh);
        const d = imgData.data;
        const w = sw, h = sh;
        const visited = new Uint8Array(w * h);
        const q = new Int32Array(w * h);
        let head = 0, tail = 0;

        const isBg = (idx) => {
          const p = idx * 4;
          if (d[p + 3] < 20) return true;
          return d[p] >= 235 && d[p + 1] >= 235 && d[p + 2] >= 235;
        };
        const push = (x, y) => {
          if (x < 0 || x >= w || y < 0 || y >= h) return;
          const idx = y * w + x;
          if (!visited[idx] && isBg(idx)) { visited[idx] = 1; q[tail++] = idx; }
        };
        for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
        for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
        while (head < tail) {
          const curr = q[head++];
          const cx = curr % w, cy = (curr / w) | 0;
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
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const pad = 4;
        minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
        maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
        const cw = Math.max(16, maxX - minX + 1), ch = Math.max(16, maxY - minY + 1);
        const outC = document.createElement('canvas');
        outC.width = cw; outC.height = ch;
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
        img.onload = () => { this._rawCache[imgSrc] = img; process(img); };
        img.src = imgSrc + '?v=' + ASSET_VER;
      }
    }

    // ------------------------------------------------------------------------
    // ПЕРЕМИКАННЯ ЛОКАЦІЙ (ВЕЛИКІ БАГАТОЗОННІ СВІТИ ДО 14,400PX!)
    // ------------------------------------------------------------------------
    switchRoom(roomKey, spawnX, spawnY, silent = false) {
      const cfg = this.locations[roomKey] || this.locations.danika_home;
      this.currentRoom = cfg.id;
      this.WORLD_W = Math.max(1, cfg.zones.length) * ZONE_W;
      this.loadZoneImages(cfg);

      const z0 = cfg.zones[0];
      this.player.x = spawnX || 860;
      this.player.y = spawnY || z0.groundY;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.stairClimb = null;
      this.player.navTarget = null;
      this.bruno.x = this.player.x - 130;
      this.bruno.y = this.player.y;
      this.companionPets.forEach((p, i) => { p.x = this.player.x - 210 - i * 85; p.y = this.player.y; });

      const titleEl = document.getElementById('sp-room-title');
      if (titleEl) titleEl.textContent = cfg.name;
      this.seedInitialRoomCoins(cfg);
      this.updateQuestBanner();
      this.saveProgress();
      if (!silent) {
        if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
        this.showToast(`Локація: ${cfg.name} (${cfg.zones.length} зон)`);
      }
    }

    getZoneAt(worldX) {
      const cfg = this.locations[this.currentRoom];
      if (!cfg || !cfg.zones.length) return { idx: 0, zone: { groundY: 1145, platforms: [], stairPaths: [] }, offsetX: 0 };
      const idx = Math.max(0, Math.min(cfg.zones.length - 1, Math.floor(worldX / ZONE_W)));
      return { idx, zone: cfg.zones[idx], offsetX: idx * ZONE_W };
    }

    seedInitialRoomCoins(cfg) {
      this.droppedCoins = [];
      (cfg.zones || []).forEach((zn, zi) => {
        const ox = zi * ZONE_W;
        [520, 1200, 1880].forEach(lx => {
          this.droppedCoins.push({ x: ox + lx, y: zn.groundY - 52, vx: 0, vy: 0, grounded: true });
        });
        (zn.platforms || []).slice(0, 2).forEach(pl => {
          this.droppedCoins.push({ x: ox + (pl.x1 + pl.x2) * 0.5, y: pl.y - 52, vx: 0, vy: 0, grounded: true });
        });
      });
    }

    // ------------------------------------------------------------------------
    // ІНТЕРАКТИВНА КАРТА СВІТУ НА CANVAS (З ХОДЬБОЮ ПО ДОРІЖКАХ, БЕЗ ADBLOCK!)
    // ------------------------------------------------------------------------
    toggleAtlasMap(forceState) {
      this.atlasMode = typeof forceState === 'boolean' ? forceState : !this.atlasMode;
      this.atlasSelectedLocked = null;
      this.atlasWalk = null;
      const bar = document.getElementById('sp-atlas-bar');
      const joy = document.getElementById('sp-joystick-zone');
      const ctrls = document.getElementById('sp-right-controls');
      const obj = document.getElementById('sp-objective-bar');
      const zInd = document.getElementById('sp-zone-indicator');
      const ctxStack = document.querySelector('.sp-context-stack');

      if (bar) bar.style.display = this.atlasMode ? 'flex' : 'none';
      if (joy) joy.style.display = this.atlasMode ? 'none' : 'block';
      if (ctrls) ctrls.style.display = this.atlasMode ? 'none' : 'flex';
      if (obj) obj.style.display = this.atlasMode ? 'none' : 'flex';
      if (zInd) zInd.style.display = this.atlasMode ? 'none' : 'block';
      if (ctxStack) ctxStack.style.display = this.atlasMode ? 'none' : 'flex';

      const unlockBtn = document.getElementById('sp-atlas-unlock-btn');
      if (unlockBtn) unlockBtn.style.display = 'none';
      const msg = document.getElementById('sp-atlas-msg');
      if (msg) msg.textContent = 'Натисни на локацію — Даніка та Бруно підуть туди по доріжках карти!';
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    findRoadPath(startId, endId) {
      if (startId === endId) return [startId];
      const adj = {};
      this.mapEdges.forEach(([a, b]) => {
        if (!adj[a]) adj[a] = [];
        if (!adj[b]) adj[b] = [];
        adj[a].push(b);
        adj[b].push(a);
      });
      const q = [[startId]];
      const seen = new Set([startId]);
      while (q.length) {
        const path = q.shift();
        const last = path[path.length - 1];
        for (const nb of (adj[last] || [])) {
          if (nb === endId) return path.concat(nb);
          if (!seen.has(nb)) {
            seen.add(nb);
            q.push(path.concat(nb));
          }
        }
      }
      return [startId, endId];
    }

    handleAtlasPointer(clientX, clientY) {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 100;
      const ny = ((clientY - rect.top) / rect.height) * 100;

      // Шукаємо найближчий вузол локації
      let hit = null, bestD = 7.5;
      Object.values(this.locations).forEach(loc => {
        const d = Math.hypot(nx - loc.mapNode.x, ny - loc.mapNode.y);
        if (d < bestD) { bestD = d; hit = loc; }
      });
      if (!hit) return;

      const unlocked = this.progress.unlockedRooms.includes(hit.id);
      const msg = document.getElementById('sp-atlas-msg');
      const unlockBtn = document.getElementById('sp-atlas-unlock-btn');

      if (!unlocked) {
        this.atlasSelectedLocked = hit;
        const req = hit.unlockReq;
        const curLvl = this.getLevel();
        const doneQ = this.progress.completedQuests.length;
        const canOpen = curLvl >= req.level && doneQ >= req.quests && this.progress.coins >= req.coins;
        if (msg) {
          msg.textContent = `${hit.name} — Потрібно: Рівень ${req.level} (${curLvl}), ${req.quests} завдань (${doneQ}), ${req.coins} монет (${this.progress.coins})`;
        }
        if (unlockBtn) {
          unlockBtn.style.display = canOpen ? 'inline-flex' : 'none';
          unlockBtn.textContent = `Відкрити за ${req.coins} монет`;
        }
        if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        return;
      }

      this.atlasSelectedLocked = null;
      if (unlockBtn) unlockBtn.style.display = 'none';

      if (hit.id === this.currentRoom) {
        this.toggleAtlasMap(false);
        return;
      }

      // Даніка та Бруно йдуть по доріжках карти до вибраної локації!
      const pathIds = this.findRoadPath(this.currentRoom, hit.id);
      this.atlasWalk = { pathIds, segIdx: 0, t: 0, targetRoomId: hit.id, walkTimer: 0 };
      if (msg) msg.textContent = `Даніка та Бруно крокують по доріжці до: ${hit.name}...`;
      if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
    }

    confirmUnlockSelectedLocation() {
      const loc = this.atlasSelectedLocked;
      if (!loc || !loc.unlockReq) return;
      const req = loc.unlockReq;
      if (this.getLevel() >= req.level && this.progress.completedQuests.length >= req.quests && this.progress.coins >= req.coins) {
        this.progress.coins -= req.coins;
        this.progress.unlockedRooms.push(loc.id);
        this.saveProgress();
        this.syncHUD();
        this.atlasSelectedLocked = null;
        const unlockBtn = document.getElementById('sp-atlas-unlock-btn');
        if (unlockBtn) unlockBtn.style.display = 'none';
        if (window.confetti) window.confetti({ particleCount: 85, spread: 80 });
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        const msg = document.getElementById('sp-atlas-msg');
        if (msg) msg.textContent = `Локацію «${loc.name}» відкрито! Натисни на неї, щоб піти туди!`;
      }
    }

    // ------------------------------------------------------------------------
    // СХОВАНКИ, СКРИНІ, КВЕСТИ ТА ГАРДЕРОБ
    // ------------------------------------------------------------------------
    collectNearSecret(secretObj) {
      const sec = secretObj || this.nearSecret;
      if (!sec || this.progress.foundSecrets[sec.id]) return;
      this.progress.foundSecrets[sec.id] = true;
      this.awardCoins(sec.coins);
      this.awardXP(sec.xp);
      this.saveProgress();
      const wx = sec.zoneIdx * ZONE_W + sec.x;
      this.spawnCoinFountain(wx, sec.y, 6);
      this.spawnSparkleBurst(wx, sec.y, '#f472b6', 28);
      this.addFloatingText(wx, sec.y - 70, `Схованка! ${sec.label} (+${sec.coins} монет)`, '#f9a8d4');
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.showToast(`Знайдено схованку: ${sec.label}! +${sec.coins} монет, +${sec.xp} XP`);
      this.nearSecret = null;
    }

    openTreasureChest(chestId, x, y, bonusCoins) {
      if (this.progress.openedChests[chestId]) {
        this.spawnSparkleBurst(x, y - 80, '#fde047', 16);
        this.showToast('Скарб із цієї скрині вже зібрано! Шукай схованки в інших зонах!');
        return;
      }
      this.progress.openedChests[chestId] = true;
      this.awardCoins(bonusCoins);
      this.awardXP(30);
      this.saveProgress();
      this.spawnCoinFountain(x, y - 90, 9);
      this.spawnSparkleBurst(x, y - 90, '#fde047', 35);
      if (window.confetti) window.confetti({ particleCount: 75, spread: 75 });
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.addFloatingText(x, y - 150, `Скарб знайдено! +${bonusCoins} монет`, '#fde047');
    }

    completeQuest(questId) {
      if (!questId || this.progress.completedQuests.includes(questId)) return;
      const q = this.questDefs.find(x => x.id === questId);
      if (!q) return;
      this.progress.completedQuests.push(questId);
      this.awardCoins(q.coins);
      this.awardXP(q.xp);
      this.saveProgress();
      this.updateQuestBanner();
      if (window.confetti) window.confetti({ particleCount: 65, spread: 70 });
      this.showToast(`Завдання виконано! +${q.coins} монет, +${q.xp} XP`);
    }

    startStationQuest(questId, onSuccess) {
      const sheet = document.getElementById('sp-challenge-sheet');
      const qText = document.getElementById('sp-q-text');
      const qOpts = document.getElementById('sp-q-options');
      if (!sheet || !qText || !qOpts) return;

      const ch = this.challenges[this.challengeIdx % this.challenges.length];
      qText.textContent = ch.q;
      this._pendingQuestCallback = () => {
        this.challengeIdx++;
        if (questId) this.completeQuest(questId);
        else { this.awardCoins(15); this.awardXP(20); }
        this.player.actionTimer = 0.8;
        if (onSuccess) onSuccess();
      };
      qOpts.innerHTML = ch.options.map((opt, idx) => `
        <button class="sp-quest-opt" onclick="window.roblox3D.submitStationAnswer(${idx}, ${ch.correct})">${opt}</button>
      `).join('');
      sheet.style.display = 'flex';
    }

    submitStationAnswer(choiceIdx, correctIdx) {
      const sheet = document.getElementById('sp-challenge-sheet');
      if (choiceIdx === correctIdx) {
        if (sheet) sheet.style.display = 'none';
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        if (this._pendingQuestCallback) this._pendingQuestCallback();
      } else {
        if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        this.showToast('Спробуй інший варіант відповіді!');
      }
    }

    openQuestLog() {
      const sheet = document.getElementById('sp-qlog-sheet');
      const list = document.getElementById('sp-qlog-list');
      if (!sheet || !list) return;
      list.innerHTML = this.questDefs.map(q => {
        const done = this.progress.completedQuests.includes(q.id);
        const roomUnlocked = this.progress.unlockedRooms.includes(q.room);
        return `
          <div class="sp-qlog-row ${done ? 'done' : ''}">
            <div style="display:flex; align-items:center; gap:9px;">
              ${done ? this.icon('check', 16) : (roomUnlocked ? this.icon('star', 16) : this.icon('lock', 16))}
              <div>
                <div style="font-weight:800; font-size:0.86rem;">${q.title}</div>
                <div style="font-size:0.74rem; color:#fde68a;">Нагорода: +${q.coins} монет, +${q.xp} XP</div>
              </div>
            </div>
            ${!done && q.isDaily
              ? `<button class="sp-glass-pill sp-glass-btn sp-glass-accent" onclick="window.roblox3D.completeQuest('${q.id}'); window.roblox3D.openQuestLog()">Виконано</button>`
              : (!done && roomUnlocked
                ? `<button class="sp-glass-pill sp-glass-btn" onclick="document.getElementById('sp-qlog-sheet').style.display='none'; window.roblox3D.switchRoom('${q.room}')">Перейти</button>`
                : '')}
          </div>
        `;
      }).join('');
      sheet.style.display = 'flex';
    }

    updateQuestBanner() {
      const el = document.getElementById('sp-quest-text');
      const qCount = document.getElementById('sp-quests-count');
      if (qCount) qCount.textContent = this.progress.completedQuests.length;
      if (!el) return;
      const nextHere = this.questDefs.find(q => q.room === this.currentRoom && !q.isDaily && !this.progress.completedQuests.includes(q.id));
      const nextAny = nextHere || this.questDefs.find(q => this.progress.unlockedRooms.includes(q.room) && !this.progress.completedQuests.includes(q.id));
      el.textContent = nextAny ? nextAny.title : 'Відкрий нові локації на Карті Гандії та шукай таємні схованки!';
    }

    openWardrobeModal() {
      const sheet = document.getElementById('sp-wardrobe-sheet');
      const dGrid = document.getElementById('sp-wardrobe-danika-grid');
      const bGrid = document.getElementById('sp-wardrobe-bruno-grid');
      const dCnt = document.getElementById('sp-d-outfit-cnt');
      const bCnt = document.getElementById('sp-b-outfit-cnt');
      if (dCnt) dCnt.textContent = this.wardrobeCatalog.danika.length;
      if (bCnt) bCnt.textContent = this.wardrobeCatalog.bruno.length;

      if (dGrid) {
        dGrid.innerHTML = this.wardrobeCatalog.danika.map(d => {
          const unlocked = this.progress.unlockedOutfits.includes(d.id);
          const active = this.player.outfitId === d.id ? 'active' : '';
          const thumbSrc = d.thumb || this.dataUrls['outfit_' + d.id] || d.src;
          const status = unlocked ? (active ? 'Надіто' : 'Одягнути') : `${d.cost} монет • Рів.${d.reqLevel}`;
          return `
            <div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectDanikaOutfit('${d.id}')">
              <img src="${thumbSrc}" loading="lazy" style="width:70px; height:82px; object-fit:contain;">
              <div style="font-weight:800; font-size:0.74rem; margin-top:4px; line-height:1.2;">${d.title}</div>
              <div style="font-size:0.68rem; color:${unlocked ? '#4ade80' : '#fde68a'}; margin-top:3px; font-weight:700;">${status}</div>
            </div>
          `;
        }).join('');
      }
      if (bGrid) {
        bGrid.innerHTML = this.wardrobeCatalog.bruno.map(b => {
          const unlocked = this.progress.unlockedBrunoSkins.includes(b.id);
          const active = this.bruno.skinId === b.id ? 'active' : '';
          const thumbSrc = this.dataUrls['bruno_' + b.id] || b.src;
          const status = unlocked ? (active ? 'Надіто' : 'Одягнути') : `${b.cost} монет • Рів.${b.reqLevel}`;
          return `
            <div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectBrunoSkin('${b.id}')">
              <img src="${thumbSrc}" loading="lazy" style="width:70px; height:74px; object-fit:contain;">
              <div style="font-weight:800; font-size:0.74rem; margin-top:4px; line-height:1.2;">${b.title}</div>
              <div style="font-size:0.68rem; color:${unlocked ? '#4ade80' : '#fde68a'}; margin-top:3px; font-weight:700;">${status}</div>
            </div>
          `;
        }).join('');
      }
      if (sheet) sheet.style.display = 'flex';
    }

    selectDanikaOutfit(outfitId) {
      const item = this.wardrobeCatalog.danika.find(d => d.id === outfitId);
      if (!item) return;
      if (!this.progress.unlockedOutfits.includes(outfitId)) {
        if (this.getLevel() < item.reqLevel) {
          this.showToast(`Потрібен Рівень ${item.reqLevel} — виконуй завдання!`);
          return;
        }
        if (this.progress.coins < item.cost) {
          this.showToast(`Потрібно ${item.cost} монет — збирай монетки та шукай схованки!`);
          return;
        }
        this.progress.coins -= item.cost;
        this.progress.unlockedOutfits.push(outfitId);
        if (window.confetti) window.confetti({ particleCount: 55, spread: 65 });
      }
      this.ensureOutfitSpriteLoaded(outfitId);
      this.player.outfitId = outfitId;
      this.saveProgress();
      this.syncHUD();
      this.openWardrobeModal();
      this.spawnSparkleBurst(this.player.x, this.player.y - 110, '#f472b6', 20);
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
    }

    selectBrunoSkin(skinId) {
      const item = this.wardrobeCatalog.bruno.find(b => b.id === skinId);
      if (!item) return;
      if (!this.progress.unlockedBrunoSkins.includes(skinId)) {
        if (this.getLevel() < item.reqLevel || this.progress.coins < item.cost) {
          this.showToast(`Потрібен Рівень ${item.reqLevel} та ${item.cost} монет!`);
          return;
        }
        this.progress.coins -= item.cost;
        this.progress.unlockedBrunoSkins.push(skinId);
      }
      this.ensureBrunoSpriteLoaded(skinId);
      this.bruno.skinId = skinId;
      this.saveProgress();
      this.syncHUD();
      this.openWardrobeModal();
      this.commandBrunoTrick('Гав-гав! Супер-образ!');
    }

    // ------------------------------------------------------------------------
    // СХОДИ ТА ВЗАЄМОДІЯ
    // ------------------------------------------------------------------------
    findNearbyStair() {
      const { zone, offsetX } = this.getZoneAt(this.player.x);
      if (!zone || !zone.stairPaths) return null;
      for (const sp of zone.stairPaths) {
        const startPt = { x: offsetX + sp.points[0].x, y: sp.points[0].y };
        const endPt = { x: offsetX + sp.points[sp.points.length - 1].x, y: sp.points[sp.points.length - 1].y };
        if (Math.hypot(this.player.x - startPt.x, this.player.y - startPt.y) < 170) {
          return { sp, offsetX, dir: 1, label: 'Піднятися сходами' };
        }
        if (Math.hypot(this.player.x - endPt.x, this.player.y - endPt.y) < 170) {
          return { sp, offsetX, dir: -1, label: 'Спуститися сходами' };
        }
      }
      return null;
    }

    startAutoStairClimb(customInfo) {
      const info = customInfo || this.nearStairInfo || this.findNearbyStair();
      if (!info) return;
      const worldPts = info.sp.points.map(pt => ({ x: info.offsetX + pt.x, y: pt.y }));
      const pts = info.dir === 1 ? worldPts : worldPts.reverse();
      this.player.stairClimb = {
        points: pts, segIdx: 0, t: 0, dir: info.dir,
        onFinishQuest: info.dir === 1 ? info.sp.onReachTopQuest : null
      };
      this.player.vx = 0; this.player.vy = 0; this.player.onGround = true;
    }

    triggerNearestStation() {
      const st = this.nearestStation;
      if (!st) return;
      this.player.actionTimer = 0.65;
      const wx = st.zoneIdx * ZONE_W + st.x;
      if (st.action === 'wardrobe') { this.openWardrobeModal(); return; }
      if (st.chestId) {
        if (st.questId) this.completeQuest(st.questId);
        this.openTreasureChest(st.chestId, wx, st.y, st.bonus || 35);
        return;
      }
      this.startStationQuest(st.questId, () => {
        if (st.action === 'rescue_pet') {
          const spec = this.wardrobeCatalog.pets[this.companionPets.length % this.wardrobeCatalog.pets.length];
          if (!this.companionPets.find(p => p.id === spec.id)) {
            this.companionPets.push({ id: spec.id, title: spec.title, x: wx, y: st.y, facing: 1, hopPhase: 0 });
            if (!this.progress.rescuedPets.includes(spec.id)) this.progress.rescuedPets.push(spec.id);
            this.saveProgress();
          }
          this.addFloatingText(wx, st.y - 160, `Приручено: ${spec.title}!`, '#f472b6');
        }
        this.spawnCoinFountain(wx, st.y - 90, 6);
        this.spawnSparkleBurst(wx, st.y - 90, '#fde047', 24);
      });
    }

    jump() {
      if (this.player.stairClimb || this.atlasMode) return;
      if (this.player.onGround) {
        this.player.vy = -940;
        this.player.onGround = false;
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
      }
    }

    useOrMagic() {
      if (this.atlasMode) return;
      this.player.actionTimer = 0.6;
      if (this.nearSecret) { this.collectNearSecret(); return; }
      if (this.nearestStation) { this.triggerNearestStation(); return; }
      if (this.nearStairInfo) { this.startAutoStairClimb(); return; }
      this.spawnSparkleBurst(this.player.x + this.player.facing * 90, this.player.y - 120, '#fde047', 18);
      if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
    }

    commandBrunoTrick(customText) {
      this.bruno.flipTimer = 0.85;
      this.bruno.barkBubbleTimer = 2.4;
      this.bruno.barkText = customText || 'Гав-гав! Супер-сальто!';
      this.spawnSparkleBurst(this.bruno.x, this.bruno.y - 70, '#38bdf8', 16);
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }

    toggleCameraZoom() {
      this.camera.zoomMode = this.camera.zoomMode === 'follow' ? 'wide' : 'follow';
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    // ------------------------------------------------------------------------
    // ОСНОВНИЙ ЦИКЛ ОНОВЛЕННЯ (60 FPS)
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
      // Якщо відкрита Карта Гандії — оновлюємо ходьбу Даніки та Бруно ПО ДОРІЖКАХ!
      if (this.atlasMode) {
        if (this.atlasWalk) {
          const aw = this.atlasWalk;
          const a = this.locations[aw.pathIds[aw.segIdx]].mapNode;
          const b = this.locations[aw.pathIds[aw.segIdx + 1]].mapNode;
          const dist = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
          aw.t += (22 * dt) / dist;
          aw.walkTimer += dt * 12;
          if (aw.t >= 1) {
            aw.segIdx++;
            aw.t = 0;
            if (aw.segIdx >= aw.pathIds.length - 1) {
              const dest = aw.targetRoomId;
              this.atlasWalk = null;
              this.toggleAtlasMap(false);
              this.switchRoom(dest, 880, null, false);
            }
          }
        }
        return;
      }

      const cfg = this.locations[this.currentRoom];
      if (!cfg) return;

      let moveX = this.joyVec.x;
      let moveY = this.joyVec.y;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
      moveX = Math.max(-1, Math.min(1, moveX));
      if (Math.abs(moveX) > 0.15) this.player.navTarget = null;

      if (this.player.stairClimb) {
        const sc = this.player.stairClimb;
        const a = sc.points[sc.segIdx], b = sc.points[sc.segIdx + 1];
        const segLen = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        sc.t += (420 * dt) / segLen;
        this.player.facing = (b.x - a.x) >= 0 ? 1 : -1;
        this.player.walkTimer += dt * 11.5;
        this.player.vx = (b.x - a.x) >= 0 ? 220 : -220;
        if (sc.t >= 1) {
          this.player.x = b.x; this.player.y = b.y;
          sc.segIdx++; sc.t = 0;
          if (sc.segIdx >= sc.points.length - 1) {
            const qId = sc.onFinishQuest;
            this.player.stairClimb = null; this.player.vx = 0; this.player.vy = 0; this.player.onGround = true;
            if (qId) this.completeQuest(qId);
          }
        } else {
          this.player.x = a.x + (b.x - a.x) * sc.t;
          this.player.y = a.y + (b.y - a.y) * sc.t;
        }
      } else {
        if (this.player.navTarget) {
          const dx = this.player.navTarget.x - this.player.x;
          if (Math.abs(dx) > 22) moveX = Math.sign(dx);
          else this.player.navTarget = null;
        }

        const nearStair = this.findNearbyStair();
        this.nearStairInfo = nearStair;
        if (nearStair) {
          if (nearStair.dir === 1 && moveY < -0.45) this.startAutoStairClimb(nearStair);
          else if (nearStair.dir === -1 && moveY > 0.45) this.startAutoStairClimb(nearStair);
        }

        this.player.vx = moveX * 430;
        if (Math.abs(moveX) > 0.1) {
          this.player.facing = moveX > 0 ? 1 : -1;
          this.player.walkTimer += dt * 11.5;
        } else {
          this.player.walkTimer = 0;
        }
        if (this.player.actionTimer > 0) this.player.actionTimer = Math.max(0, this.player.actionTimer - dt);

        const prevY = this.player.y;
        this.player.x = Math.max(95, Math.min(this.WORLD_W - 95, this.player.x + this.player.vx * dt));
        this.player.vy += 2250 * dt;
        this.player.y += this.player.vy * dt;

        const { zone, offsetX } = this.getZoneAt(this.player.x);
        const localX = this.player.x - offsetX;
        let landed = false;
        const dropThrough = moveY > 0.65 && !nearStair;

        if (!dropThrough && this.player.vy >= 0) {
          for (const p of (zone.platforms || [])) {
            if (localX >= p.x1 && localX <= p.x2 && prevY <= p.y + 24 && this.player.y >= p.y) {
              this.player.y = p.y;
              if (p.isTrampoline) {
                this.player.vy = -1260; this.player.onGround = false;
              } else {
                this.player.vy = 0; this.player.onGround = true;
              }
              landed = true;
              break;
            }
          }
        }
        if (!landed && this.player.y >= zone.groundY) {
          this.player.y = zone.groundY;
          this.player.vy = 0;
          this.player.onGround = true;
        }
      }

      // Оновлення індикатора поточної зони
      const curZ = this.getZoneAt(this.player.x);
      const zEl = document.getElementById('sp-zone-indicator');
      if (zEl) zEl.textContent = `Зона ${curZ.idx + 1} / ${cfg.zones.length}  •  ${curZ.zone.label}`;

      // Бруно біжить слідом за Данікою
      const bdx = (this.player.x - this.player.facing * 130) - this.bruno.x;
      const bdy = this.player.y - this.bruno.y;
      const bDist = Math.hypot(bdx, bdy);
      if (bDist > 20) {
        const step = Math.min(bDist, 415 * dt);
        this.bruno.x += (bdx / bDist) * step;
        this.bruno.y += (bdy / bDist) * step;
        if (Math.abs(bdx) > 8) this.bruno.facing = bdx > 0 ? 1 : -1;
        this.bruno.walkTimer += dt * 12.5;
        this.bruno.isMoving = true;
      } else {
        this.bruno.isMoving = false;
        this.bruno.walkTimer = 0;
      }
      if (this.bruno.flipTimer > 0) this.bruno.flipTimer = Math.max(0, this.bruno.flipTimer - dt);
      if (this.bruno.barkBubbleTimer > 0) this.bruno.barkBubbleTimer = Math.max(0, this.bruno.barkBubbleTimer - dt);

      let lx = this.bruno.x, ly = this.bruno.y;
      this.companionPets.forEach((pet, idx) => {
        const dx = (lx - this.player.facing * (95 + idx * 12)) - pet.x;
        if (Math.abs(dx) > 20) { pet.x += Math.sign(dx) * Math.min(Math.abs(dx), 380 * dt); pet.facing = dx > 0 ? 1 : -1; pet.hopPhase += dt * 11; }
        else pet.hopPhase = 0;
        pet.y += (ly - pet.y) * Math.min(1, 8 * dt);
        lx = pet.x; ly = pet.y;
      });

      // Монетки
      for (let i = this.droppedCoins.length - 1; i >= 0; i--) {
        const c = this.droppedCoins[i];
        if (!c.grounded) {
          c.vy += 1500 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
          const gz = this.getZoneAt(c.x).zone.groundY;
          if (c.y >= gz - 25) { c.y = gz - 25; c.vy = -c.vy * 0.35; c.vx *= 0.6; if (Math.abs(c.vy) < 60) c.grounded = true; }
        }
        if (Math.hypot(c.x - this.player.x, c.y - (this.player.y - 95)) < 115) {
          this.droppedCoins.splice(i, 1);
          this.awardCoins(5);
          this.spawnSparkleBurst(c.x, c.y, '#fde047', 8);
          this.addFloatingText(c.x, c.y - 30, '+5 монет', '#fde047');
          if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
          else if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt; p.vy += 360 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.life -= dt; ft.y -= 50 * dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }

      // Найближча станція
      let bestSt = null, bestDist = Infinity;
      (cfg.stations || []).forEach(st => {
        const wx = st.zoneIdx * ZONE_W + st.x;
        const d = Math.hypot(wx - this.player.x, st.y - this.player.y);
        if (d < 185 && d < bestDist) { bestDist = d; bestSt = st; }
      });
      this.nearestStation = bestSt;

      // Найближча невидима схованка
      let bestSec = null;
      (cfg.secrets || []).forEach(sec => {
        if (this.progress.foundSecrets[sec.id]) return;
        const wx = sec.zoneIdx * ZONE_W + sec.x;
        if (Math.hypot(wx - this.player.x, sec.y - (this.player.y - 80)) < 210) {
          bestSec = sec;
        }
      });
      this.nearSecret = bestSec;

      const stairBtn = document.getElementById('sp-stair-btn');
      if (stairBtn) {
        if (!this.player.stairClimb && this.nearStairInfo) {
          stairBtn.style.display = 'flex';
          document.getElementById('sp-stair-label').textContent = this.nearStairInfo.label;
        } else stairBtn.style.display = 'none';
      }
      const intBtn = document.getElementById('sp-interact-btn');
      if (intBtn) {
        if (bestSt && !this.player.stairClimb) {
          intBtn.style.display = 'flex';
          document.getElementById('sp-interact-label').textContent = bestSt.prompt;
        } else intBtn.style.display = 'none';
      }
      const secBtn = document.getElementById('sp-secret-btn');
      if (secBtn) {
        if (bestSec && !this.player.stairClimb) {
          secBtn.style.display = 'flex';
          document.getElementById('sp-secret-label').textContent = 'Перевірити таємну схованку!';
        } else secBtn.style.display = 'none';
      }
    }

    // ------------------------------------------------------------------------
    // РЕНДЕРИНГ (АБО КАРТА ГАНДІЇ НА CANVAS, АБО ВЕЛИКИЙ БАГАТОЗОННИЙ СВІТ)
    // ------------------------------------------------------------------------
    render() {
      if (!this.ctx || !this.canvas) return;
      if (this.atlasMode) {
        this.renderAtlasMap(this.ctx, this.canvas.width, this.canvas.height);
        return;
      }

      const ctx = this.ctx;
      const sw = this.canvas.width;
      const sh = this.canvas.height;
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, sw, sh);

      let scale;
      if (this.camera.zoomMode === 'wide') {
        scale = Math.min(sw / ZONE_W, sh / WORLD_H);
      } else {
        // Приємний Spiritfarer зум — добре видно деталі та довгу прогулянку по зонах
        scale = Math.max(sh / WORLD_H, sw / 1650);
      }

      const viewW = sw / scale;
      const viewH = sh / scale;
      const targetCamX = Math.max(0, Math.min(this.WORLD_W - viewW, this.player.x - viewW * 0.5));
      const targetCamY = Math.max(0, Math.min(WORLD_H - viewH, (this.player.y - 160) - viewH * 0.55));
      this.camera.x += (targetCamX - this.camera.x) * 0.12;
      this.camera.y += (targetCamY - this.camera.y) * 0.12;

      const offsetX = Math.max(0, (sw - this.WORLD_W * scale) * 0.5);
      const offsetY = Math.max(0, (sh - WORLD_H * scale) * 0.5);
      this._renderTransform = { scale, offsetX, offsetY, camX: this.camera.x, camY: this.camera.y };

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-this.camera.x, -this.camera.y);

      const cfg = this.locations[this.currentRoom];
      // Малюємо лише видимі зони великої локації
      (cfg.zones || []).forEach((zn, zi) => {
        const zx = zi * ZONE_W;
        if (zx + ZONE_W < this.camera.x - 100 || zx > this.camera.x + viewW + 100) return;
        const img = this.bgImages[zn.bgSrc];
        if (img) ctx.drawImage(img, zx, 0, ZONE_W, WORLD_H);
        else { ctx.fillStyle = '#1e293b'; ctx.fillRect(zx, 0, ZONE_W, WORLD_H); }
        if (zn.tint) { ctx.fillStyle = zn.tint; ctx.fillRect(zx, 0, ZONE_W, WORLD_H); }

        // М'який градієнтний стик між зонами
        if (zi > 0) {
          const grad = ctx.createLinearGradient(zx - 60, 0, zx + 60, 0);
          grad.addColorStop(0, 'rgba(11,18,32,0)');
          grad.addColorStop(0.5, 'rgba(11,18,32,0.42)');
          grad.addColorStop(1, 'rgba(11,18,32,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(zx - 60, 0, 120, WORLD_H);
        }
      });

      // Тонкі світлячкові підказки (ЖОДНИХ емоджі в кружечках!)
      this.renderSubtleWorldHints(ctx, cfg);
      this.renderCoins(ctx);

      this.companionPets.forEach(pet => {
        const sp = this.sprites['pet_' + pet.id];
        const hopY = Math.abs(Math.sin(pet.hopPhase)) * 15;
        this.drawCharacterSprite(ctx, sp, pet.x, pet.y - hopY, 125, 130, pet.facing, 0, pet.title);
      });

      this.renderBrunoAnimated(ctx);
      this.renderDanikaAnimated(ctx);
      this.renderParticlesAndTexts(ctx);
      ctx.restore();
    }

    // Малюємо тонкі світлові орієнтири без жодного емоджі в кружечках!
    renderSubtleWorldHints(ctx, cfg) {
      const t = performance.now() * 0.004;

      // 1. М'яке золотисте сяйво під станціями (без кружечків з емоджі!)
      (cfg.stations || []).forEach(st => {
        const wx = st.zoneIdx * ZONE_W + st.x;
        const isNear = this.nearestStation && this.nearestStation.id === st.id;
        ctx.save();
        const rad = isNear ? 78 : 48;
        const g = ctx.createRadialGradient(wx, st.y - 8, 6, wx, st.y - 8, rad);
        g.addColorStop(0, isNear ? 'rgba(253, 224, 71, 0.55)' : 'rgba(253, 224, 71, 0.22)');
        g.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(wx, st.y - 8, rad, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Тонкий світлячок-іскорка над станцією
        const sy = st.y - 120 + Math.sin(t + wx * 0.01) * 8;
        ctx.fillStyle = isNear ? '#fef08a' : 'rgba(254, 240, 138, 0.72)';
        ctx.beginPath();
        ctx.arc(wx, sy, isNear ? 7 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        if (isNear) {
          ctx.font = '800 20px "Nunito", sans-serif';
          const tw = ctx.measureText(st.title).width + 26;
          ctx.fillStyle = 'rgba(11, 18, 32, 0.78)';
          ctx.beginPath(); ctx.roundRect(wx - tw / 2, sy - 46, tw, 32, 10); ctx.fill();
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#fef9c3'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(st.title, wx, sy - 30);
        }
        ctx.restore();
      });

      // 2. Схованки (НЕВИДИМІ здалеку! Лише ледь помітний блиск світлячка, коли Даніка поруч!)
      (cfg.secrets || []).forEach(sec => {
        if (this.progress.foundSecrets[sec.id]) return;
        const wx = sec.zoneIdx * ZONE_W + sec.x;
        const dist = Math.hypot(wx - this.player.x, sec.y - (this.player.y - 80));
        if (dist < 380) {
          const alpha = Math.max(0.15, (1 - dist / 380) * (0.55 + 0.45 * Math.sin(t * 2.2)));
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#f9a8d4';
          ctx.beginPath();
          ctx.arc(wx, sec.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(wx - 12, sec.y); ctx.lineTo(wx + 12, sec.y);
          ctx.moveTo(wx, sec.y - 12); ctx.lineTo(wx, sec.y + 12);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 3. Делікатні стрілки на початку сходів (векторні, без емоджі)
      (cfg.zones || []).forEach((zn, zi) => {
        const ox = zi * ZONE_W;
        (zn.stairPaths || []).forEach(sp => {
          [
            { pt: { x: ox + sp.points[0].x, y: sp.points[0].y }, up: true },
            { pt: { x: ox + sp.points[sp.points.length - 1].x, y: sp.points[sp.points.length - 1].y }, up: false }
          ].forEach(m => {
            ctx.save();
            ctx.translate(m.pt.x, m.pt.y - 38 + Math.sin(t * 1.4) * 4);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.72)';
            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath();
            if (m.up) { ctx.moveTo(-7, 3); ctx.lineTo(0, -6); ctx.lineTo(7, 3); }
            else { ctx.moveTo(-7, -3); ctx.lineTo(0, 6); ctx.lineTo(7, -3); }
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
            ctx.restore();
          });
        });
      });
    }

    // ------------------------------------------------------------------------
    // РЕНДЕРИНГ ІНТЕРАКТИВНОЇ КАРТИ НА CANVAS З ДОРІЖКАМИ ТА ХОДЬБОЮ ДАНІКИ І БРУНО
    // ------------------------------------------------------------------------
    renderAtlasMap(ctx, sw, sh) {
      // Фон карти (ілюстрована карта Гандії)
      if (this.atlasBgImg) {
        ctx.drawImage(this.atlasBgImg, 0, 0, sw, sh);
        ctx.fillStyle = 'rgba(11, 18, 32, 0.22)';
        ctx.fillRect(0, 0, sw, sh);
      } else {
        const g = ctx.createLinearGradient(0, 0, sw, sh);
        g.addColorStop(0, '#0c4a6e'); g.addColorStop(1, '#0f766e');
        ctx.fillStyle = g; ctx.fillRect(0, 0, sw, sh);
      }

      const toXY = (node) => ({ x: (node.x / 100) * sw, y: (node.y / 100) * sh });

      // 1. Малюємо мальовничі доріжки між усіма 15 локаціями!
      ctx.save();
      this.mapEdges.forEach(([aId, bId]) => {
        const la = this.locations[aId], lb = this.locations[bId];
        if (!la || !lb) return;
        const pa = toXY(la.mapNode), pb = toXY(lb.mapNode);
        const bothOpen = this.progress.unlockedRooms.includes(aId) && this.progress.unlockedRooms.includes(bId);
        // Підкладка доріжки
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = bothOpen ? 'rgba(254, 243, 199, 0.78)' : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = bothOpen ? 8 : 5;
        ctx.lineCap = 'round';
        ctx.setLineDash(bothOpen ? [] : [8, 8]);
        ctx.stroke();

        // Внутрішній пунктир доріжки
        if (bothOpen) {
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.55)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 8]);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Малюємо вузли 15 локацій (легкі скляні плашки, 0 емоджі)
      Object.values(this.locations).forEach(loc => {
        const p = toXY(loc.mapNode);
        const unlocked = this.progress.unlockedRooms.includes(loc.id);
        const isCur = loc.id === this.currentRoom;

        ctx.save();
        // Точка на дорозі
        ctx.beginPath();
        ctx.arc(p.x, p.y, isCur ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isCur ? '#4ade80' : (unlocked ? '#38bdf8' : '#64748b');
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Скляна табличка з назвою
        ctx.font = '800 13px "Nunito", sans-serif';
        const label = unlocked ? loc.shortName : `${loc.shortName} (Рів.${loc.unlockReq.level})`;
        const tw = ctx.measureText(label).width + 20;
        const bx = p.x - tw / 2;
        const by = p.y + 15;
        ctx.fillStyle = isCur ? 'rgba(6, 78, 59, 0.86)' : (unlocked ? 'rgba(15, 23, 42, 0.82)' : 'rgba(30, 41, 59, 0.72)');
        ctx.beginPath();
        ctx.roundRect(bx, by, tw, 24, 9);
        ctx.fill();
        ctx.strokeStyle = isCur ? '#4ade80' : (unlocked ? 'rgba(125,211,252,0.7)' : 'rgba(148,163,184,0.45)');
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = unlocked ? '#f8fafc' : '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, p.x, by + 12);
        ctx.restore();
      });

      // 3. Малюємо Даніку та Бруно, які ХОДЯТЬ ПО ДОРІЖЦІ КАРТИ!
      let dx, dy, facing = 1, walking = false, wTimer = 0;
      if (this.atlasWalk) {
        const aw = this.atlasWalk;
        const a = toXY(this.locations[aw.pathIds[aw.segIdx]].mapNode);
        const b = toXY(this.locations[aw.pathIds[aw.segIdx + 1]].mapNode);
        dx = a.x + (b.x - a.x) * aw.t;
        dy = a.y + (b.y - a.y) * aw.t;
        facing = (b.x - a.x) >= 0 ? 1 : -1;
        walking = true;
        wTimer = aw.walkTimer;
      } else {
        const cur = toXY(this.locations[this.currentRoom].mapNode);
        dx = cur.x; dy = cur.y;
      }

      const dSprite = walking && this.danikaWalkFrames.length >= 8
        ? this.danikaWalkFrames[Math.floor(wTimer) % 8]
        : (this.sprites['outfit_' + this.player.outfitId] || this.danikaWalkFrames[0]);
      const bSprite = walking && this.brunoWalkFrames.length >= 8
        ? this.brunoWalkFrames[Math.floor(wTimer) % 8]
        : (this.sprites['bruno_custom_bruno'] || this.brunoWalkFrames[0]);

      this.drawCharacterSprite(ctx, bSprite, dx - facing * 28, dy, 40, 38, facing, 0, null);
      this.drawCharacterSprite(ctx, dSprite, dx, dy, 54, 72, facing, 0, null);
    }

    renderBrunoAnimated(ctx) {
      const b = this.bruno;
      let sprite = null;
      if (b.skinId !== 'custom_bruno') {
        sprite = this.sprites['bruno_' + b.skinId];
      } else if (b.isMoving && this.brunoWalkFrames.length >= 8) {
        sprite = this.brunoWalkFrames[Math.floor(b.walkTimer) % 8];
      } else {
        sprite = this.sprites['bruno_custom_bruno'] || this.brunoWalkFrames[0];
      }
      const flipAngle = b.flipTimer > 0 ? (1 - b.flipTimer / 0.85) * Math.PI * 2 : 0;
      const flipY = b.flipTimer > 0 ? Math.sin((1 - b.flipTimer / 0.85) * Math.PI) * 110 : 0;
      const bobY = b.isMoving ? Math.abs(Math.sin(b.walkTimer * 0.8)) * 5 : 0;
      this.drawCharacterSprite(ctx, sprite, b.x, b.y - bobY - flipY, 146, 136, b.facing, flipAngle, 'Бруно');
      if (b.barkBubbleTimer > 0) this.drawSpeechBubble(ctx, b.x, b.y - 170, b.barkText);
    }

    renderDanikaAnimated(ctx) {
      const p = this.player;
      const isMoving = Math.abs(p.vx) > 20 || Boolean(p.stairClimb);
      let sprite = null, bobY = 0, tilt = 0;

      if (!p.onGround) {
        sprite = this.sprites['danika_jump'] || this.danikaWalkFrames[3];
      } else if (p.actionTimer > 0) {
        sprite = this.sprites['danika_action'] || this.sprites['outfit_' + p.outfitId];
      } else if (isMoving && p.outfitId === 'gandia_polo' && this.danikaWalkFrames.length >= 8) {
        sprite = this.danikaWalkFrames[Math.floor(p.walkTimer) % 8];
        bobY = Math.abs(Math.sin(p.walkTimer * Math.PI * 0.25)) * 5;
      } else if (isMoving) {
        sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[Math.floor(p.walkTimer) % 8];
        bobY = Math.abs(Math.sin(p.walkTimer * 0.85)) * 12;
        tilt = Math.sin(p.walkTimer * 0.85) * 0.04;
      } else {
        sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[1];
      }
      this.drawCharacterSprite(ctx, sprite, p.x, p.y - bobY, 196, 260, p.facing, tilt, 'Даніка');
    }

    drawCharacterSprite(ctx, sprite, x, y, maxW, maxH, facing, rotAngle, nameTag) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y - 4, maxW * 0.28, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(11, 18, 32, 0.32)';
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
        ctx.font = '800 17px "Nunito", sans-serif';
        const tw = ctx.measureText(nameTag).width + 18;
        ctx.fillStyle = 'rgba(11, 18, 32, 0.58)';
        ctx.beginPath(); ctx.roundRect(x - tw / 2, y + 6, tw, 24, 9); ctx.fill();
        ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(nameTag, x, y + 18);
        ctx.restore();
      }
    }

    drawSpeechBubble(ctx, x, y, text) {
      ctx.save();
      ctx.font = '800 18px "Nunito", sans-serif';
      const tw = ctx.measureText(text).width + 24;
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 20, tw, 36, 12); ctx.fill();
      ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y - 2);
      ctx.restore();
    }

    renderCoins(ctx) {
      const t = performance.now() * 0.005;
      this.droppedCoins.forEach((c, idx) => {
        const fy = c.grounded ? Math.sin(t + idx) * 5 : 0;
        ctx.save();
        ctx.translate(c.x, c.y + fy);
        ctx.scale(0.68 + 0.32 * Math.abs(Math.cos(t + idx)), 1);
        ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15'; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#b45309'; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.restore();
      });
    }

    renderParticlesAndTexts(ctx) {
      this.particles.forEach(p => {
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      this.floatingTexts.forEach(ft => {
        ctx.save(); ctx.globalAlpha = Math.min(1, ft.life);
        ctx.font = '800 22px "Nunito", sans-serif'; ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(11, 18, 32, 0.85)'; ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color; ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    // ------------------------------------------------------------------------
    // КЕРУВАННЯ
    // ------------------------------------------------------------------------
    bindControls() {
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        this.keys[e.code] = true;
        if (e.code === 'Space') { e.preventDefault(); this.jump(); }
        if (e.code === 'KeyE') this.useOrMagic();
        if (e.code === 'KeyM') this.toggleAtlasMap();
      });
      window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

      const canvas = document.getElementById('spirit-2d-canvas');
      if (canvas) {
        canvas.addEventListener('pointerdown', (e) => {
          if (this.atlasMode) {
            this.handleAtlasPointer(e.clientX, e.clientY);
            return;
          }
          if (!this._renderTransform) return;
          const rect = canvas.getBoundingClientRect();
          const px = (e.clientX - rect.left) * (canvas.width / rect.width);
          const py = (e.clientY - rect.top) * (canvas.height / rect.height);
          const { scale, offsetX, offsetY, camX, camY } = this._renderTransform;
          const wx = (px - offsetX) / scale + camX;
          const wy = (py - offsetY) / scale + camY;

          // Перевіряємо клік по прихованій схованці!
          const cfg = this.locations[this.currentRoom];
          for (const sec of (cfg.secrets || [])) {
            if (this.progress.foundSecrets[sec.id]) continue;
            const sx = sec.zoneIdx * ZONE_W + sec.x;
            if (Math.hypot(wx - sx, wy - sec.y) < 110) {
              this.collectNearSecret(sec);
              return;
            }
          }

          // Перевіряємо клік по сходах
          const { zone, offsetX: zox } = this.getZoneAt(wx);
          for (const sp of (zone.stairPaths || [])) {
            const bot = { x: zox + sp.points[0].x, y: sp.points[0].y };
            const top = { x: zox + sp.points[sp.points.length - 1].x, y: sp.points[sp.points.length - 1].y };
            if (Math.hypot(wx - bot.x, wy - bot.y) < 115 && Math.hypot(this.player.x - bot.x, this.player.y - bot.y) < 320) {
              this.startAutoStairClimb({ sp, offsetX: zox, dir: 1 });
              return;
            }
            if (Math.hypot(wx - top.x, wy - top.y) < 115 && Math.hypot(this.player.x - top.x, this.player.y - top.y) < 320) {
              this.startAutoStairClimb({ sp, offsetX: zox, dir: -1 });
              return;
            }
          }
          this.player.navTarget = { x: Math.max(95, Math.min(this.WORLD_W - 95, wx)), y: wy };
        });
      }

      const joyZone = document.getElementById('sp-joystick-zone');
      const joyKnob = document.getElementById('sp-joystick-knob');
      if (joyZone && joyKnob) {
        let activeId = null;
        const updateJoy = (clientX, clientY) => {
          const rect = joyZone.getBoundingClientRect();
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          let dx = clientX - cx, dy = clientY - cy;
          const maxR = rect.width * 0.36;
          const dist = Math.hypot(dx, dy);
          if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
          joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
          this.joyVec.x = dx / maxR; this.joyVec.y = dy / maxR;
        };
        joyZone.addEventListener('pointerdown', (e) => {
          e.stopPropagation(); activeId = e.pointerId; joyZone.setPointerCapture(e.pointerId);
          updateJoy(e.clientX, e.clientY);
        });
        joyZone.addEventListener('pointermove', (e) => { if (e.pointerId === activeId) updateJoy(e.clientX, e.clientY); });
        const endJoy = (e) => {
          if (e.pointerId === activeId) { activeId = null; this.joyVec.x = 0; this.joyVec.y = 0; joyKnob.style.transform = 'translate(0px, 0px)'; }
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
      this.saveProgress();
      this.syncHUD();
    }

    awardXP(amount) {
      const oldLvl = this.getLevel();
      this.progress.xp = (this.progress.xp || 0) + amount;
      const newLvl = this.getLevel();
      if (newLvl > oldLvl) {
        this.progress.level = newLvl;
        if (window.confetti) window.confetti({ particleCount: 90, spread: 80 });
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        this.showToast(`Новий Рівень ${newLvl}! Перевір Карту Гандії та Гардероб!`);
      }
      this.saveProgress();
      this.syncHUD();
    }

    spawnCoinFountain(x, y, count = 6) {
      for (let i = 0; i < count; i++) {
        this.droppedCoins.push({ x, y, vx: (Math.random() - 0.5) * 440, vy: -420 - Math.random() * 300, grounded: false });
      }
    }

    spawnSparkleBurst(x, y, color = '#fde047', count = 18) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2, spd = 80 + Math.random() * 240;
        this.particles.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 100, size: 4 + Math.random() * 5, color, life: 0.7 + Math.random() * 0.4 });
      }
    }

    addFloatingText(x, y, text, color = '#fde047') {
      this.floatingTexts.push({ x, y, text, color, life: 1.5 });
    }

    syncHUD() {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('sp-coins-val', this.progress.coins || 0);
      set('sp-xp-val', this.progress.xp || 0);
      set('sp-lvl-val', this.getLevel());
      set('sp-unlocked-count', this.progress.unlockedRooms.length);
      set('sp-quests-count', this.progress.completedQuests.length);
    }

    showToast(msg) {
      const el = document.getElementById('sp-toast');
      if (!el) return;
      el.textContent = msg;
      el.style.display = 'block';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3400);
    }
  }

  window.roblox3D = new DanikaSpiritWorld2D();
})();
