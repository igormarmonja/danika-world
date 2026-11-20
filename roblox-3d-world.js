// ============================================================================
// DANIKA & BRUNO: SPIRITFARER 2D ADVENTURE ENGINE (v20261120_5)
// Справжня багаторівнева 2D-гра: двоповерхові cutaway-світи, точні сходи,
// живі герої (NPC) з сюжетними діалогами, реальні двері та замки з ключами,
// інвентар знайдених предметів, невидимі схованки, 8-кадрова ходьба Даніки і Бруно,
// Canvas-карта з ходьбою по доріжках та легкий прозорий інтерфейс (0 емоджі).
// ============================================================================

(function () {
  const SAVE_KEY = 'danika_spirit_world_v4';
  const ASSET_VER = '20261120_5';
  const WORLD_W = 2400;
  const WORLD_H = 1350;

  class DanikaSpiritWorld2D {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.canvas = null;
      this.ctx = null;
      this.animFrameId = null;
      this.lastTime = 0;

      this.WORLD_W = WORLD_W;
      this.WORLD_H = WORLD_H;

      this.locations = window.SPIRIT_LOCATIONS || {};
      this.itemsCatalog = window.SPIRIT_ITEMS || {};
      this.mapEdges = window.SPIRIT_MAP_EDGES || [];
      this.questDefs = window.getSpiritQuests ? window.getSpiritQuests() : [];
      this.wardrobeCatalog = window.getSpiritWardrobe ? window.getSpiritWardrobe() : { danika: [], bruno: [], pets: [] };

      this.progress = this.loadProgress();
      this.currentRoom = this.locations[this.progress.lastRoom] ? this.progress.lastRoom : 'villa';

      this.camera = { x: 0, y: 0, zoomMode: 'follow' };

      this.player = {
        x: 920, y: 1135, vx: 0, vy: 0, facing: 1, onGround: true,
        walkTimer: 0, actionTimer: 0,
        outfitId: this.progress.activeOutfit || 'gandia_polo',
        stairClimb: null, navTarget: null
      };

      this.bruno = {
        x: 780, y: 1135, facing: 1,
        skinId: this.progress.activeBrunoSkin || 'custom_bruno',
        walkTimer: 0, isMoving: false, flipTimer: 0,
        barkBubbleTimer: 0, barkText: 'Гав-гав!'
      };

      this.companionPets = [];
      this.droppedCoins = [];
      this.particles = [];
      this.floatingTexts = [];
      this.keys = {};
      this.joyVec = { x: 0, y: 0 };

      this.bgImages = {};
      this.npcSprites = {};
      this.sprites = {};
      this.dataUrls = {};
      this.danikaWalkFrames = [];
      this.brunoWalkFrames = [];

      this.nearestStation = null;
      this.nearStairInfo = null;
      this.nearSecret = null;
      this.nearNpc = null;
      this.nearDoor = null;

      this.atlasMode = false;
      this.atlasWalk = null;
      this.atlasSelectedLocked = null;
      this.atlasBgImg = null;
      this.activeDialogNpc = null;

      this.challenges = [
        { q: 'Рецепт Шефа: 6 полуничок + 4 вишеньки. Скільки всього ягідок?', options: ['10 ягідок', '9 ягідок', '11 ягідок'], correct: 0 },
        { q: 'Іспанська в Гандії: Як сказати «Море і Сонце»?', options: ['Mar y Sol', 'Perro y Gato', 'Casa Azul'], correct: 0 },
        { q: 'Лабораторія: Який колір вийде, якщо змішати Синій і Жовтий?', options: ['Червоний', 'Зелений', 'Фіолетовий'], correct: 1 },
        { q: 'У Бруно 4 лапки, і у Кошеняти 4 лапки. Скільки лапок разом?', options: ['6 лапок', '8 лапок', '10 лапок'], correct: 1 },
        { q: 'Англійська: Як перекладається «Lighthouse»?', options: ['Маяк', 'Корабель', 'Морозиво'], correct: 0 },
        { q: 'Швидка математика: Скільки буде 14 - 6?', options: ['7', '8', '9'], correct: 1 }
      ];
      this.challengeIdx = 0;

      (this.progress.rescuedPets || []).forEach((pid, idx) => {
        const spec = this.wardrobeCatalog.pets.find(p => p.id === pid);
        if (spec) this.companionPets.push({ id: spec.id, title: spec.title, x: 680 - idx * 90, y: 1135, facing: 1, hopPhase: idx });
      });
    }

    loadProgress() {
      const defaults = {
        coins: 40,
        xp: 0,
        level: 1,
        unlockedRooms: ['villa', 'academy', 'beach', 'petpark'],
        unlockedOutfits: ['gandia_polo'],
        unlockedBrunoSkins: ['custom_bruno'],
        completedQuests: [],
        openedChests: {},
        openedDoors: {},
        foundSecrets: {},
        inventory: [],
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
          defaults.unlockedRooms.forEach(r => { if (!merged.unlockedRooms.includes(r)) merged.unlockedRooms.push(r); });
          if (!Array.isArray(merged.inventory)) merged.inventory = [];
          if (!merged.openedDoors) merged.openedDoors = {};
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

    hasItem(itemId) {
      return Array.isArray(this.progress.inventory) && this.progress.inventory.includes(itemId);
    }

    addItem(itemId) {
      if (!itemId || this.hasItem(itemId)) return;
      this.progress.inventory.push(itemId);
      this.saveProgress();
      this.renderInventoryBar();
    }

    // ------------------------------------------------------------------------
    // ІНТЕРФЕЙС (ЛЕГКИЙ ПРОЗОРИЙ ГРАДІЄНТ, 100% SVG-ІКОНКИ, 0 ЕМОДЖІ!)
    // ------------------------------------------------------------------------
    icon(name, size = 16) {
      const svg = (window.SPIRIT_ICONS && window.SPIRIT_ICONS[name]) || '';
      return `<span class="sp-ico" style="width:${size}px;height:${size}px;">${svg}</span>`;
    }

    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this.createInterfaceDOM();
      if (!this.isInitialized) this.initCanvasWorld();
      this.syncHUD();
      this.renderInventoryBar();
      this.updateQuestBanner();
      this.onResize();
      this.startLoop();
    }

    close() {
      this.isOpen = false;
      if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
      const el = document.getElementById('danika-world-stage');
      if (el) el.style.display = 'none';
      if (window.location.pathname.endsWith('3d.html')) window.location.href = 'index.html?v=' + ASSET_VER;
    }

    createInterfaceDOM() {
      let wrap = document.getElementById('danika-world-stage');
      if (wrap) { wrap.style.display = 'block'; return; }
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

          .sp-hud-top {
            position: absolute; top: 0; left: 0; right: 0; padding: 10px 14px 22px;
            background: linear-gradient(180deg, rgba(11, 18, 32, 0.72) 0%, rgba(11, 18, 32, 0.25) 65%, rgba(11, 18, 32, 0) 100%);
            display: flex; justify-content: space-between; align-items: center; gap: 8px;
            pointer-events: none; z-index: 20;
          }
          .sp-hud-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; pointer-events: auto; }
          .sp-glass-pill {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.22); color: rgba(255, 255, 255, 0.96);
            padding: 5px 11px; border-radius: 12px; font-weight: 800; font-size: 0.79rem;
            display: inline-flex; align-items: center; gap: 6px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
            transition: background 0.16s, transform 0.12s;
          }
          .sp-glass-btn { cursor: pointer; }
          .sp-glass-btn:hover { background: linear-gradient(90deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.12) 100%); }
          .sp-glass-btn:active { transform: scale(0.95); }
          .sp-glass-accent {
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.34) 0%, rgba(14, 165, 233, 0.12) 100%);
            border-color: rgba(125, 211, 252, 0.42);
          }

          #sp-objective-bar {
            position: absolute; top: 50px; left: 14px;
            background: linear-gradient(90deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.18) 84%, rgba(15, 23, 42, 0) 100%);
            backdrop-filter: blur(6px); border-left: 2.5px solid #38bdf8;
            padding: 5px 18px 5px 10px; border-radius: 0 10px 10px 0;
            color: rgba(248, 250, 252, 0.94); font-size: 0.77rem; font-weight: 700;
            display: flex; align-items: center; gap: 7px; z-index: 18;
            max-width: min(460px, 70vw); cursor: pointer;
          }

          /* Кишенька знайдених ключів та предметів внизу по центру */
          #sp-inventory-bar {
            position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
            display: flex; align-items: center; gap: 6px; z-index: 22;
            padding: 5px 12px; border-radius: 14px;
            background: linear-gradient(90deg, rgba(15,23,42,0.58), rgba(30,41,59,0.42));
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.18);
            max-width: 58vw; overflow-x: auto;
          }
          .sp-inv-chip {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(255,255,255,0.12); border: 1px solid rgba(253,224,71,0.45);
            color: #fef9c3; border-radius: 9px; padding: 3px 9px;
            font-size: 0.72rem; font-weight: 800; white-space: nowrap;
          }

          /* Контекстні кнопки праворуч над керуванням */
          .sp-context-stack {
            position: absolute; bottom: 92px; right: 18px;
            display: flex; flex-direction: column; align-items: flex-end; gap: 7px;
            z-index: 25; pointer-events: auto;
          }
          .sp-ctx-pill {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.62));
            backdrop-filter: blur(10px); border: 1.5px solid rgba(250, 204, 21, 0.7);
            color: #fef9c3; padding: 8px 15px; border-radius: 14px;
            font-weight: 800; font-size: 0.82rem; cursor: pointer;
            display: none; align-items: center; gap: 7px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          }
          .sp-ctx-pill.stair { border-color: rgba(56, 189, 248, 0.75); color: #e0f2fe; }
          .sp-ctx-pill.secret { border-color: rgba(244, 114, 182, 0.85); color: #fce7f3; }
          .sp-ctx-pill.door { border-color: rgba(74, 222, 128, 0.8); color: #dcfce7; }
          .sp-ctx-pill.npc { border-color: rgba(192, 132, 252, 0.85); color: #f3e8ff; }

          /* Сюжетне діалогове вікно NPC внизу екрана */
          #sp-dialog-box {
            position: absolute; bottom: 86px; left: 50%; transform: translateX(-50%);
            width: min(620px, 90vw);
            background: linear-gradient(160deg, rgba(17, 24, 39, 0.94), rgba(30, 41, 59, 0.88));
            backdrop-filter: blur(14px); border: 1.5px solid rgba(192, 132, 252, 0.55);
            border-radius: 18px; padding: 14px 18px; color: #f8fafc;
            z-index: 45; display: none; box-shadow: 0 18px 45px rgba(0,0,0,0.55);
          }

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
            pointer-events: none;
          }
          .sp-right-controls {
            position: absolute; bottom: 18px; right: 18px;
            display: flex; align-items: flex-end; gap: 9px; z-index: 25;
          }
          .sp-ctrl-circle {
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(145deg, rgba(255,255,255,0.22), rgba(15,23,42,0.48));
            backdrop-filter: blur(8px); border: 1.5px solid rgba(255,255,255,0.42);
            color: #fff; font-weight: 800; font-size: 0.64rem;
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
            cursor: pointer;
          }
          .sp-ctrl-circle:active { transform: scale(0.92); }

          #sp-toast {
            position: absolute; top: 84px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(90deg, rgba(15,23,42,0.88), rgba(30,41,59,0.78));
            backdrop-filter: blur(10px); color: #fef08a; border: 1px solid rgba(253, 224, 71, 0.45);
            padding: 7px 16px; border-radius: 12px; font-weight: 800; font-size: 0.82rem;
            z-index: 40; display: none; text-align: center; pointer-events: none;
          }

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
          .sp-sheet-title { margin: 0; font-size: 1.06rem; font-weight: 900; display: flex; align-items: center; gap: 8px; }
          .sp-close-x {
            background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; width: 32px; height: 32px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center; cursor: pointer;
          }
          .sp-wardrobe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 9px; margin-top: 10px; }
          .sp-w-item {
            background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
            border-radius: 14px; padding: 8px; text-align: center; cursor: pointer;
          }
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

          #sp-atlas-bar {
            position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(90deg, rgba(15,23,42,0.88), rgba(30,41,59,0.78));
            backdrop-filter: blur(12px); border: 1px solid rgba(125,211,252,0.45);
            border-radius: 16px; padding: 9px 16px; color: #f8fafc;
            display: none; align-items: center; gap: 12px; z-index: 30;
            max-width: 92vw; font-size: 0.82rem; font-weight: 700;
          }
        </style>

        <canvas id="spirit-2d-canvas"></canvas>

        <div class="sp-hud-top">
          <div class="sp-hud-row">
            <div class="sp-glass-pill sp-glass-accent">
              ${this.icon('pin', 15)}<span id="sp-room-title">Вілла Гандії</span>
            </div>
            <div class="sp-glass-pill">${this.icon('trophy', 15)}<span>Рів. <b id="sp-lvl-val">1</b></span></div>
            <div class="sp-glass-pill">${this.icon('coin', 15)}<b id="sp-coins-val">40</b></div>
            <div class="sp-glass-pill">${this.icon('star', 15)}<span><b id="sp-xp-val">0</b> XP</span></div>
          </div>

          <div class="sp-hud-row">
            <button class="sp-glass-pill sp-glass-btn sp-glass-accent" onclick="window.roblox3D.toggleAtlasMap()">
              ${this.icon('map', 15)}<span>Карта (<span id="sp-unlocked-count">4</span>/6)</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.openQuestLog()">
              ${this.icon('scroll', 15)}<span>Завдання (<span id="sp-quests-count">0</span>)</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.openWardrobeModal()">
              ${this.icon('hanger', 15)}<span>Гардероб</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.toggleCameraZoom()">
              ${this.icon('camera', 15)}<span>Камера</span>
            </button>
            <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.close()">${this.icon('close', 14)}</button>
          </div>
        </div>

        <div id="sp-objective-bar" onclick="window.roblox3D.openQuestLog()">
          ${this.icon('scroll', 14)}<span id="sp-quest-text">Поговори з Пекарем Пепе у Віллі...</span>
        </div>

        <div id="sp-toast"></div>
        <div id="sp-inventory-bar"></div>

        <!-- Діалог із живим NPC -->
        <div id="sp-dialog-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div style="font-weight:900; color:#e9d5ff; font-size:0.95rem;" id="sp-dialog-speaker">Пекар Пепе</div>
            <button class="sp-close-x" style="width:26px;height:26px;" onclick="window.roblox3D.closeDialog()">${this.icon('close', 13)}</button>
          </div>
          <div id="sp-dialog-text" style="font-size:0.88rem; line-height:1.45; color:#f1f5f9;"></div>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;" id="sp-dialog-actions"></div>
        </div>

        <div class="sp-context-stack">
          <button id="sp-npc-btn" class="sp-ctx-pill npc" onclick="window.roblox3D.talkToNearNpc()">
            ${this.icon('talk', 16)}<span id="sp-npc-label">Поговорити</span>
          </button>
          <button id="sp-door-btn" class="sp-ctx-pill door" onclick="window.roblox3D.useNearDoor()">
            ${this.icon('door', 16)}<span id="sp-door-label">Увійти у двері</span>
          </button>
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

        <div id="sp-atlas-bar">
          <span id="sp-atlas-msg">Натисни на локацію — Даніка та Бруно підуть туди по доріжках карти!</span>
          <button id="sp-atlas-unlock-btn" class="sp-glass-pill sp-glass-btn sp-glass-accent" style="display:none;" onclick="window.roblox3D.confirmUnlockSelectedLocation()">Відкрити</button>
          <button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.toggleAtlasMap(false)">Назад у світ</button>
        </div>

        <div id="sp-joystick-zone"><div id="sp-joystick-knob"></div></div>

        <div class="sp-right-controls" id="sp-right-controls">
          <button class="sp-ctrl-circle" onclick="window.roblox3D.commandBrunoTrick()">${this.icon('paw', 20)}<span>Бруно</span></button>
          <button class="sp-ctrl-circle" onclick="window.roblox3D.useOrMagic()">${this.icon('hand', 20)}<span>Дія</span></button>
          <button class="sp-ctrl-circle" onclick="window.roblox3D.jump()">${this.icon('up', 20)}<span>Стрибок</span></button>
        </div>

        <div id="sp-qlog-sheet" class="sp-sheet-wrap">
          <div class="sp-sheet-card">
            <div class="sp-sheet-head">
              <h3 class="sp-sheet-title">${this.icon('scroll', 18)}<span>Журнал Завдань та Пригод</span></h3>
              <button class="sp-close-x" onclick="document.getElementById('sp-qlog-sheet').style.display='none'">${this.icon('close', 15)}</button>
            </div>
            <div id="sp-qlog-list" style="margin-top:8px;"></div>
          </div>
        </div>

        <div id="sp-wardrobe-sheet" class="sp-sheet-wrap">
          <div class="sp-sheet-card">
            <div class="sp-sheet-head">
              <h3 class="sp-sheet-title">${this.icon('hanger', 18)}<span>Гардероб Даніки та Бруно</span></h3>
              <button class="sp-close-x" onclick="document.getElementById('sp-wardrobe-sheet').style.display='none'">${this.icon('close', 15)}</button>
            </div>
            <div style="font-weight:900; color:#7dd3fc; margin-top:12px; font-size:0.86rem;">Образи Даніки (<span id="sp-d-outfit-cnt">0</span>)</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-danika-grid"></div>
            <div style="font-weight:900; color:#fde68a; margin-top:16px; font-size:0.86rem;">Образи Бруно (<span id="sp-b-outfit-cnt">0</span>)</div>
            <div class="sp-wardrobe-grid" id="sp-wardrobe-bruno-grid"></div>
          </div>
        </div>

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

    renderInventoryBar() {
      const bar = document.getElementById('sp-inventory-bar');
      if (!bar) return;
      const inv = this.progress.inventory || [];
      if (!inv.length) {
        bar.innerHTML = `<span style="font-size:0.73rem; color:rgba(226,232,240,0.75); font-weight:700;">Кишенька порожня — шукай ключі та предмети у схованках!</span>`;
        return;
      }
      bar.innerHTML = inv.map(id => {
        const it = this.itemsCatalog[id];
        if (!it) return '';
        return `<span class="sp-inv-chip">${this.icon(it.icon, 14)}<span>${it.name}</span></span>`;
      }).join('');
    }

    // ------------------------------------------------------------------------
    // ЗАВАНТАЖЕННЯ СПРАЙТІВ, ФОНІВ ТА NPC
    // ------------------------------------------------------------------------
    initCanvasWorld() {
      this.canvas = document.getElementById('spirit-2d-canvas');
      this.ctx = this.canvas.getContext('2d');
      window.addEventListener('resize', () => this.onResize());

      const mapImg = new Image();
      mapImg.src = 'assets/characters/pixar/spirit_world_map_gandia.jpg?v=' + ASSET_VER;
      mapImg.onload = () => { this.atlasBgImg = mapImg; };

      Object.values(this.locations).forEach(loc => {
        const img = new Image();
        img.src = loc.bgSrc + '?v=' + ASSET_VER;
        img.onload = () => { this.bgImages[loc.id] = img; };
        (loc.npcs || []).forEach(npc => {
          if (!this.npcSprites[npc.sprite]) {
            const ni = new Image();
            ni.src = npc.sprite;
            ni.onload = () => { this.npcSprites[npc.sprite] = ni; };
          }
        });
      });

      const dWalkSrc = 'assets/characters/pixar/danika_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        this.extractTransparentSprite('d_walk_' + i, dWalkSrc, { x: (i % 4) * 0.25, y: Math.floor(i / 4) * 0.5, w: 0.25, h: 0.5 }, (c) => { this.danikaWalkFrames[i] = c; });
      }
      const bWalkSrc = 'assets/characters/pixar/bruno_walk_8frames.jpg';
      for (let i = 0; i < 8; i++) {
        this.extractTransparentSprite('b_walk_' + i, bWalkSrc, { x: (i % 4) * 0.25, y: Math.floor(i / 4) * 0.5, w: 0.25, h: 0.5 }, (c) => { this.brunoWalkFrames[i] = c; });
      }

      const actSrc = 'assets/characters/pixar/danika_pixar_actions.jpg';
      this.extractTransparentSprite('danika_jump', actSrc, { x: 0, y: 0.5, w: 0.5, h: 0.5 });
      this.extractTransparentSprite('danika_action', actSrc, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 });

      this.ensureOutfitSpriteLoaded('gandia_polo');
      this.ensureOutfitSpriteLoaded(this.player.outfitId);
      this.ensureBrunoSpriteLoaded('custom_bruno');
      this.ensureBrunoSpriteLoaded(this.bruno.skinId);
      this.wardrobeCatalog.pets.forEach(p => this.extractTransparentSprite('pet_' + p.id, p.src, p.crop));

      this.switchRoom(this.currentRoom, 900, null, true);
      this.isInitialized = true;
    }

    ensureOutfitSpriteLoaded(outfitId) {
      const item = this.wardrobeCatalog.danika.find(d => d.id === outfitId);
      if (!item || this.sprites['outfit_' + item.id]) return;
      if (item.isPngSprite) {
        const img = new Image(); img.onload = () => { this.sprites['outfit_' + item.id] = img; }; img.src = item.src;
      } else {
        this.extractTransparentSprite('outfit_' + item.id, item.src, item.crop);
      }
    }

    ensureBrunoSpriteLoaded(skinId) {
      const item = this.wardrobeCatalog.bruno.find(b => b.id === skinId);
      if (!item || this.sprites['bruno_' + item.id]) return;
      if (item.isPngSprite) {
        const img = new Image(); img.onload = () => { this.sprites['bruno_' + item.id] = img; }; img.src = item.src;
      } else {
        this.extractTransparentSprite('bruno_' + item.id, item.src, item.crop);
      }
    }

    extractTransparentSprite(key, imgSrc, cropNorm, onReady) {
      if (this.sprites[key]) { if (onReady) onReady(this.sprites[key]); return; }
      this._rawCache = this._rawCache || {};
      const process = (img) => {
        const sx = Math.round(cropNorm.x * img.width), sy = Math.round(cropNorm.y * img.height);
        const sw = Math.round(cropNorm.w * img.width), sh = Math.round(cropNorm.h * img.height);
        const c = document.createElement('canvas'); c.width = sw; c.height = sh;
        const ctx = c.getContext('2d'); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        const imgData = ctx.getImageData(0, 0, sw, sh); const d = imgData.data;
        const w = sw, h = sh, visited = new Uint8Array(w * h), q = new Int32Array(w * h);
        let head = 0, tail = 0;
        const isBg = (idx) => { const p = idx * 4; return d[p + 3] < 20 || (d[p] >= 235 && d[p + 1] >= 235 && d[p + 2] >= 235); };
        const push = (x, y) => { if (x < 0 || x >= w || y < 0 || y >= h) return; const idx = y * w + x; if (!visited[idx] && isBg(idx)) { visited[idx] = 1; q[tail++] = idx; } };
        for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
        for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
        while (head < tail) {
          const curr = q[head++], cx = curr % w, cy = (curr / w) | 0;
          d[curr * 4 + 3] = 0;
          if (cx > 0) push(cx - 1, cy); if (cx < w - 1) push(cx + 1, cy);
          if (cy > 0) push(cx, cy - 1); if (cy < h - 1) push(cx, cy + 1);
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
              if (d[p + 3] > 25) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const pad = 4; minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
        maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
        const cw = Math.max(16, maxX - minX + 1), ch = Math.max(16, maxY - minY + 1);
        const outC = document.createElement('canvas'); outC.width = cw; outC.height = ch;
        outC.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
        this.sprites[key] = outC; this.dataUrls[key] = outC.toDataURL('image/png');
        if (onReady) onReady(outC);
      };
      if (this._rawCache[imgSrc] && this._rawCache[imgSrc].complete) process(this._rawCache[imgSrc]);
      else { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => { this._rawCache[imgSrc] = img; process(img); }; img.src = imgSrc + '?v=' + ASSET_VER; }
    }

    // ------------------------------------------------------------------------
    // ПЕРЕМИКАННЯ ЛОКАЦІЙ, ЖИВІ NPC-ДІАЛОГИ ТА РЕАЛЬНІ ДВЕРІ З КЛЮЧАМИ
    // ------------------------------------------------------------------------
    switchRoom(roomKey, spawnX, spawnY, silent = false) {
      const cfg = this.locations[roomKey] || this.locations.villa;
      this.currentRoom = cfg.id;
      this.closeDialog();
      this.player.x = spawnX || 900;
      this.player.y = spawnY || cfg.groundY;
      this.player.vx = 0; this.player.vy = 0;
      this.player.stairClimb = null; this.player.navTarget = null;
      this.bruno.x = this.player.x - 125; this.bruno.y = this.player.y;
      this.companionPets.forEach((p, i) => { p.x = this.player.x - 205 - i * 85; p.y = this.player.y; });

      const titleEl = document.getElementById('sp-room-title');
      if (titleEl) titleEl.textContent = cfg.name;
      this.seedCoins(cfg);
      this.updateQuestBanner();
      this.saveProgress();
      if (!silent) {
        if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
        this.showToast(`Локація: ${cfg.name}`);
      }
    }

    seedCoins(cfg) {
      this.droppedCoins = [];
      [480, 1250, 1850].forEach(x => this.droppedCoins.push({ x, y: cfg.groundY - 50, vx: 0, vy: 0, grounded: true }));
      (cfg.platforms || []).slice(0, 2).forEach(pl => {
        this.droppedCoins.push({ x: (pl.x1 + pl.x2) * 0.5, y: pl.y - 50, vx: 0, vy: 0, grounded: true });
      });
    }

    talkToNearNpc(customNpc) {
      const npc = customNpc || this.nearNpc;
      if (!npc) return;
      this.activeDialogNpc = npc;
      const box = document.getElementById('sp-dialog-box');
      const spk = document.getElementById('sp-dialog-speaker');
      const txt = document.getElementById('sp-dialog-text');
      const act = document.getElementById('sp-dialog-actions');
      if (!box || !spk || !txt || !act) return;

      const done = this.progress.completedQuests.includes(npc.questId);
      const hasNeed = npc.needItem ? this.hasItem(npc.needItem) : false;

      spk.textContent = `${npc.name}  •  ${npc.role}`;
      if (done) {
        txt.textContent = npc.dialogAfter;
        act.innerHTML = `<button class="sp-glass-pill sp-glass-btn" onclick="window.roblox3D.closeDialog()">Дякую!</button>`;
      } else if (hasNeed) {
        txt.textContent = npc.dialogReady;
        act.innerHTML = `<button class="sp-glass-pill sp-glass-btn sp-glass-accent" onclick="window.roblox3D.completeNpcQuest('${npc.id}')">Віддати предмет і отримати нагороду</button>`;
      } else {
        txt.textContent = npc.dialogBefore;
        act.innerHTML = `<button class="sp-glass-pill sp-glass-btn sp-glass-accent" onclick="window.roblox3D.closeDialog()">Зрозуміло, піду шукати!</button>`;
      }
      box.style.display = 'block';
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    completeNpcQuest(npcId) {
      const cfg = this.locations[this.currentRoom];
      const npc = (cfg.npcs || []).find(n => n.id === npcId);
      if (!npc) return;
      this.completeQuest(npc.questId);
      if (npc.rewardItem) {
        this.addItem(npc.rewardItem);
        const it = this.itemsCatalog[npc.rewardItem];
        this.showToast(`Отримано предмет: ${it ? it.name : npc.rewardItem}!`);
      }
      this.spawnSparkleBurst(npc.x, npc.y - 120, '#c084fc', 32);
      this.spawnCoinFountain(npc.x, npc.y - 110, 7);
      this.closeDialog();
    }

    closeDialog() {
      this.activeDialogNpc = null;
      const box = document.getElementById('sp-dialog-box');
      if (box) box.style.display = 'none';
    }

    useNearDoor(customDoor) {
      const door = customDoor || this.nearDoor;
      if (!door) return;
      const alreadyOpen = !door.needKey || this.progress.openedDoors[door.id];

      if (!alreadyOpen) {
        if (this.hasItem(door.needKey)) {
          this.progress.openedDoors[door.id] = true;
          if (door.unlockRoomOnOpen && !this.progress.unlockedRooms.includes(door.unlockRoomOnOpen)) {
            this.progress.unlockedRooms.push(door.unlockRoomOnOpen);
          }
          this.saveProgress();
          this.syncHUD();
          if (window.confetti) window.confetti({ particleCount: 70, spread: 75 });
          if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
          this.showToast(`Двері відімкнено! Шлях до локації відкрито!`);
          setTimeout(() => this.switchRoom(door.targetRoom, door.targetX, door.targetY), 500);
        } else {
          const kName = (this.itemsCatalog[door.needKey] && this.itemsCatalog[door.needKey].name) || 'Ключ';
          this.showToast(`Двері замкнені! Потрібен предмет: ${kName}`);
          if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        }
        return;
      }

      if (door.unlockRoomOnOpen && !this.progress.unlockedRooms.includes(door.unlockRoomOnOpen)) {
        this.progress.unlockedRooms.push(door.unlockRoomOnOpen);
        this.saveProgress();
      }
      this.switchRoom(door.targetRoom, door.targetX, door.targetY);
    }

    collectNearSecret(secretObj) {
      const sec = secretObj || this.nearSecret;
      if (!sec || this.progress.foundSecrets[sec.id]) return;
      this.progress.foundSecrets[sec.id] = true;
      this.awardCoins(sec.coins);
      this.awardXP(sec.xp);
      if (sec.giveItem) {
        this.addItem(sec.giveItem);
        const it = this.itemsCatalog[sec.giveItem];
        this.showToast(`Знайдено важливий предмет: ${it ? it.name : sec.label}!`);
      } else {
        this.showToast(`Схованка: ${sec.label}! +${sec.coins} монет`);
      }
      this.saveProgress();
      this.spawnCoinFountain(sec.x, sec.y, 5);
      this.spawnSparkleBurst(sec.x, sec.y, '#f472b6', 30);
      this.addFloatingText(sec.x, sec.y - 60, sec.label, '#f9a8d4');
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.nearSecret = null;
    }

    // ------------------------------------------------------------------------
    // КАРТА ГАНДІЇ НА CANVAS (З ХОДЬБОЮ ПО ДОРІЖКАХ)
    // ------------------------------------------------------------------------
    toggleAtlasMap(forceState) {
      this.atlasMode = typeof forceState === 'boolean' ? forceState : !this.atlasMode;
      this.atlasSelectedLocked = null;
      this.atlasWalk = null;
      this.closeDialog();
      const setDisp = (sel, val) => { const el = document.querySelector(sel); if (el) el.style.display = val; };
      setDisp('#sp-atlas-bar', this.atlasMode ? 'flex' : 'none');
      setDisp('#sp-joystick-zone', this.atlasMode ? 'none' : 'block');
      setDisp('#sp-right-controls', this.atlasMode ? 'none' : 'flex');
      setDisp('#sp-objective-bar', this.atlasMode ? 'none' : 'flex');
      setDisp('#sp-inventory-bar', this.atlasMode ? 'none' : 'flex');
      setDisp('.sp-context-stack', this.atlasMode ? 'none' : 'flex');
      const uBtn = document.getElementById('sp-atlas-unlock-btn');
      if (uBtn) uBtn.style.display = 'none';
    }

    findRoadPath(startId, endId) {
      if (startId === endId) return [startId];
      const adj = {};
      this.mapEdges.forEach(([a, b]) => { (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); });
      const q = [[startId]], seen = new Set([startId]);
      while (q.length) {
        const path = q.shift(), last = path[path.length - 1];
        for (const nb of (adj[last] || [])) {
          if (nb === endId) return path.concat(nb);
          if (!seen.has(nb)) { seen.add(nb); q.push(path.concat(nb)); }
        }
      }
      return [startId, endId];
    }

    handleAtlasPointer(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 100;
      const ny = ((clientY - rect.top) / rect.height) * 100;
      let hit = null, bestD = 8;
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
        const canOpen = this.getLevel() >= req.level && this.progress.completedQuests.length >= req.quests && this.progress.coins >= req.coins;
        if (msg) msg.textContent = `${hit.name} — Відкрий ключем через двері або за: Рівень ${req.level}, ${req.quests} завд., ${req.coins} монет`;
        if (unlockBtn) { unlockBtn.style.display = canOpen ? 'inline-flex' : 'none'; unlockBtn.textContent = `Відкрити (${req.coins} монет)`; }
        return;
      }
      if (hit.id === this.currentRoom) { this.toggleAtlasMap(false); return; }
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
        this.saveProgress(); this.syncHUD();
        this.atlasSelectedLocked = null;
        document.getElementById('sp-atlas-unlock-btn').style.display = 'none';
        if (window.confetti) window.confetti({ particleCount: 80, spread: 75 });
      }
    }

    // ------------------------------------------------------------------------
    // СХОДИ, КВЕСТИ, ГАРДЕРОБ ТА ДІЇ
    // ------------------------------------------------------------------------
    findNearbyStair() {
      const cfg = this.locations[this.currentRoom];
      if (!cfg || !cfg.stairPaths) return null;
      for (const sp of cfg.stairPaths) {
        const a = sp.points[0], b = sp.points[sp.points.length - 1];
        if (Math.hypot(this.player.x - a.x, this.player.y - a.y) < 170) return { sp, dir: 1, label: 'Піднятися сходами' };
        if (Math.hypot(this.player.x - b.x, this.player.y - b.y) < 170) return { sp, dir: -1, label: 'Спуститися сходами' };
      }
      return null;
    }

    startAutoStairClimb(customInfo) {
      const info = customInfo || this.nearStairInfo || this.findNearbyStair();
      if (!info) return;
      const pts = info.dir === 1 ? info.sp.points.slice() : info.sp.points.slice().reverse();
      this.player.stairClimb = { points: pts, segIdx: 0, t: 0, dir: info.dir, onFinishQuest: info.dir === 1 ? info.sp.onReachTopQuest : null };
      this.player.vx = 0; this.player.vy = 0; this.player.onGround = true;
    }

    triggerNearestStation() {
      const st = this.nearestStation;
      if (!st) return;
      this.player.actionTimer = 0.65;
      if (st.action === 'wardrobe') { this.openWardrobeModal(); return; }
      if (st.chestId) {
        if (st.questId) this.completeQuest(st.questId);
        this.openTreasureChest(st.chestId, st.x, st.y, st.bonus || 40);
        return;
      }
      this.startStationQuest(st.questId, () => {
        if (st.action === 'rescue_pet') {
          const spec = this.wardrobeCatalog.pets[this.companionPets.length % this.wardrobeCatalog.pets.length];
          if (!this.companionPets.find(p => p.id === spec.id)) {
            this.companionPets.push({ id: spec.id, title: spec.title, x: st.x, y: st.y, facing: 1, hopPhase: 0 });
            if (!this.progress.rescuedPets.includes(spec.id)) this.progress.rescuedPets.push(spec.id);
            this.saveProgress();
          }
          this.addFloatingText(st.x, st.y - 160, `Приручено: ${spec.title}!`, '#f472b6');
        }
        this.spawnCoinFountain(st.x, st.y - 90, 6);
        this.spawnSparkleBurst(st.x, st.y - 90, '#fde047', 24);
      });
    }

    openTreasureChest(chestId, x, y, bonus) {
      if (this.progress.openedChests[chestId]) { this.showToast('Цю скриню вже відкрито!'); return; }
      this.progress.openedChests[chestId] = true;
      this.awardCoins(bonus); this.awardXP(35); this.saveProgress();
      this.spawnCoinFountain(x, y - 90, 9); this.spawnSparkleBurst(x, y - 90, '#fde047', 35);
      if (window.confetti) window.confetti({ particleCount: 75, spread: 75 });
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.addFloatingText(x, y - 150, `Скарб! +${bonus} монет`, '#fde047');
    }

    completeQuest(questId) {
      if (!questId || this.progress.completedQuests.includes(questId)) return;
      const q = this.questDefs.find(x => x.id === questId);
      if (!q) return;
      this.progress.completedQuests.push(questId);
      this.awardCoins(q.coins); this.awardXP(q.xp); this.saveProgress(); this.updateQuestBanner();
      if (window.confetti) window.confetti({ particleCount: 65, spread: 70 });
      this.showToast(`Завдання виконано! +${q.coins} монет, +${q.xp} XP`);
    }

    startStationQuest(questId, onSuccess) {
      const sheet = document.getElementById('sp-challenge-sheet');
      const qText = document.getElementById('sp-q-text');
      const qOpts = document.getElementById('sp-q-options');
      const ch = this.challenges[this.challengeIdx % this.challenges.length];
      qText.textContent = ch.q;
      this._pendingQuestCallback = () => {
        this.challengeIdx++;
        if (questId) this.completeQuest(questId); else { this.awardCoins(15); this.awardXP(20); }
        if (onSuccess) onSuccess();
      };
      qOpts.innerHTML = ch.options.map((opt, idx) => `<button class="sp-quest-opt" onclick="window.roblox3D.submitStationAnswer(${idx}, ${ch.correct})">${opt}</button>`).join('');
      sheet.style.display = 'flex';
    }

    submitStationAnswer(choiceIdx, correctIdx) {
      if (choiceIdx === correctIdx) {
        document.getElementById('sp-challenge-sheet').style.display = 'none';
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        if (this._pendingQuestCallback) this._pendingQuestCallback();
      } else { this.showToast('Спробуй інший варіант!'); }
    }

    openQuestLog() {
      const list = document.getElementById('sp-qlog-list');
      list.innerHTML = this.questDefs.map(q => {
        const done = this.progress.completedQuests.includes(q.id);
        const open = this.progress.unlockedRooms.includes(q.room);
        return `
          <div class="sp-qlog-row ${done ? 'done' : ''}">
            <div style="display:flex; align-items:center; gap:9px;">
              ${done ? this.icon('check', 16) : (open ? this.icon('star', 16) : this.icon('lock', 16))}
              <div>
                <div style="font-weight:800; font-size:0.86rem;">${q.title}</div>
                <div style="font-size:0.74rem; color:#fde68a;">Нагорода: +${q.coins} монет, +${q.xp} XP</div>
              </div>
            </div>
            ${!done && q.isDaily
              ? `<button class="sp-glass-pill sp-glass-btn sp-glass-accent" onclick="window.roblox3D.completeQuest('${q.id}'); window.roblox3D.openQuestLog()">Виконано</button>`
              : (!done && open ? `<button class="sp-glass-pill sp-glass-btn" onclick="document.getElementById('sp-qlog-sheet').style.display='none'; window.roblox3D.switchRoom('${q.room}')">Перейти</button>` : '')}
          </div>`;
      }).join('');
      document.getElementById('sp-qlog-sheet').style.display = 'flex';
    }

    updateQuestBanner() {
      const el = document.getElementById('sp-quest-text');
      const qCount = document.getElementById('sp-quests-count');
      if (qCount) qCount.textContent = this.progress.completedQuests.length;
      const nextHere = this.questDefs.find(q => q.room === this.currentRoom && !q.isDaily && !this.progress.completedQuests.includes(q.id));
      const nextAny = nextHere || this.questDefs.find(q => this.progress.unlockedRooms.includes(q.room) && !this.progress.completedQuests.includes(q.id));
      if (el) el.textContent = nextAny ? nextAny.title : 'Досліджуй усі 6 двоповерхових світів та збирай скарби!';
    }

    openWardrobeModal() {
      const dGrid = document.getElementById('sp-wardrobe-danika-grid');
      const bGrid = document.getElementById('sp-wardrobe-bruno-grid');
      document.getElementById('sp-d-outfit-cnt').textContent = this.wardrobeCatalog.danika.length;
      document.getElementById('sp-b-outfit-cnt').textContent = this.wardrobeCatalog.bruno.length;
      dGrid.innerHTML = this.wardrobeCatalog.danika.map(d => {
        const unlocked = this.progress.unlockedOutfits.includes(d.id);
        const active = this.player.outfitId === d.id ? 'active' : '';
        return `<div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectDanikaOutfit('${d.id}')">
          <img src="${d.thumb || this.dataUrls['outfit_' + d.id] || d.src}" loading="lazy" style="width:68px;height:80px;object-fit:contain;">
          <div style="font-weight:800;font-size:0.74rem;margin-top:4px;">${d.title}</div>
          <div style="font-size:0.68rem;color:${unlocked ? '#4ade80' : '#fde68a'};margin-top:2px;">${unlocked ? (active ? 'Надіто' : 'Одягнути') : `${d.cost} монет • Рів.${d.reqLevel}`}</div>
        </div>`;
      }).join('');
      bGrid.innerHTML = this.wardrobeCatalog.bruno.map(b => {
        const unlocked = this.progress.unlockedBrunoSkins.includes(b.id);
        const active = this.bruno.skinId === b.id ? 'active' : '';
        return `<div class="sp-w-item ${active} ${unlocked ? '' : 'locked'}" onclick="window.roblox3D.selectBrunoSkin('${b.id}')">
          <img src="${this.dataUrls['bruno_' + b.id] || b.src}" loading="lazy" style="width:68px;height:72px;object-fit:contain;">
          <div style="font-weight:800;font-size:0.74rem;margin-top:4px;">${b.title}</div>
          <div style="font-size:0.68rem;color:${unlocked ? '#4ade80' : '#fde68a'};margin-top:2px;">${unlocked ? (active ? 'Надіто' : 'Одягнути') : `${b.cost} монет • Рів.${b.reqLevel}`}</div>
        </div>`;
      }).join('');
      document.getElementById('sp-wardrobe-sheet').style.display = 'flex';
    }

    selectDanikaOutfit(id) {
      const item = this.wardrobeCatalog.danika.find(d => d.id === id);
      if (!item) return;
      if (!this.progress.unlockedOutfits.includes(id)) {
        if (this.getLevel() < item.reqLevel || this.progress.coins < item.cost) { this.showToast(`Потрібен Рівень ${item.reqLevel} та ${item.cost} монет!`); return; }
        this.progress.coins -= item.cost; this.progress.unlockedOutfits.push(id);
      }
      this.ensureOutfitSpriteLoaded(id); this.player.outfitId = id;
      this.saveProgress(); this.syncHUD(); this.openWardrobeModal();
    }

    selectBrunoSkin(id) {
      const item = this.wardrobeCatalog.bruno.find(b => b.id === id);
      if (!item) return;
      if (!this.progress.unlockedBrunoSkins.includes(id)) {
        if (this.getLevel() < item.reqLevel || this.progress.coins < item.cost) { this.showToast(`Потрібен Рівень ${item.reqLevel} та ${item.cost} монет!`); return; }
        this.progress.coins -= item.cost; this.progress.unlockedBrunoSkins.push(id);
      }
      this.ensureBrunoSpriteLoaded(id); this.bruno.skinId = id;
      this.saveProgress(); this.syncHUD(); this.openWardrobeModal();
    }

    jump() {
      if (this.player.stairClimb || this.atlasMode) return;
      if (this.player.onGround) { this.player.vy = -940; this.player.onGround = false; if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop(); }
    }

    useOrMagic() {
      if (this.atlasMode) return;
      if (this.nearNpc) { this.talkToNearNpc(); return; }
      if (this.nearDoor) { this.useNearDoor(); return; }
      if (this.nearSecret) { this.collectNearSecret(); return; }
      if (this.nearestStation) { this.triggerNearestStation(); return; }
      if (this.nearStairInfo) { this.startAutoStairClimb(); return; }
      this.player.actionTimer = 0.6;
      this.spawnSparkleBurst(this.player.x + this.player.facing * 90, this.player.y - 120, '#fde047', 18);
    }

    commandBrunoTrick(customText) {
      this.bruno.flipTimer = 0.85; this.bruno.barkBubbleTimer = 2.4;
      this.bruno.barkText = customText || 'Гав-гав! Супер-сальто!';
      this.spawnSparkleBurst(this.bruno.x, this.bruno.y - 70, '#38bdf8', 16);
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }

    toggleCameraZoom() {
      this.camera.zoomMode = this.camera.zoomMode === 'follow' ? 'wide' : 'follow';
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
      if (this.atlasMode) {
        if (this.atlasWalk) {
          const aw = this.atlasWalk;
          const a = this.locations[aw.pathIds[aw.segIdx]].mapNode;
          const b = this.locations[aw.pathIds[aw.segIdx + 1]].mapNode;
          const dist = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
          aw.t += (22 * dt) / dist; aw.walkTimer += dt * 12;
          if (aw.t >= 1) {
            aw.segIdx++; aw.t = 0;
            if (aw.segIdx >= aw.pathIds.length - 1) {
              const dest = aw.targetRoomId; this.atlasWalk = null;
              this.toggleAtlasMap(false); this.switchRoom(dest, 880, null, false);
            }
          }
        }
        return;
      }

      const cfg = this.locations[this.currentRoom];
      if (!cfg) return;

      let moveX = this.joyVec.x, moveY = this.joyVec.y;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
      moveX = Math.max(-1, Math.min(1, moveX));
      if (Math.abs(moveX) > 0.15) { this.player.navTarget = null; this.closeDialog(); }

      if (this.player.stairClimb) {
        const sc = this.player.stairClimb;
        const a = sc.points[sc.segIdx], b = sc.points[sc.segIdx + 1];
        const segLen = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        sc.t += (420 * dt) / segLen;
        this.player.facing = (b.x - a.x) >= 0 ? 1 : -1;
        this.player.walkTimer += dt * 11.5;
        this.player.vx = (b.x - a.x) >= 0 ? 220 : -220;
        if (sc.t >= 1) {
          this.player.x = b.x; this.player.y = b.y; sc.segIdx++; sc.t = 0;
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
          if (Math.abs(dx) > 22) moveX = Math.sign(dx); else this.player.navTarget = null;
        }
        const nearStair = this.findNearbyStair();
        this.nearStairInfo = nearStair;
        if (nearStair) {
          if (nearStair.dir === 1 && moveY < -0.45) this.startAutoStairClimb(nearStair);
          else if (nearStair.dir === -1 && moveY > 0.45) this.startAutoStairClimb(nearStair);
        }

        this.player.vx = moveX * 420;
        if (Math.abs(moveX) > 0.1) { this.player.facing = moveX > 0 ? 1 : -1; this.player.walkTimer += dt * 11.5; }
        else this.player.walkTimer = 0;
        if (this.player.actionTimer > 0) this.player.actionTimer = Math.max(0, this.player.actionTimer - dt);

        const prevY = this.player.y;
        this.player.x = Math.max(95, Math.min(WORLD_W - 95, this.player.x + this.player.vx * dt));
        this.player.vy += 2250 * dt; this.player.y += this.player.vy * dt;

        let landed = false;
        const dropThrough = moveY > 0.65 && !nearStair;
        if (!dropThrough && this.player.vy >= 0) {
          for (const p of (cfg.platforms || [])) {
            if (this.player.x >= p.x1 && this.player.x <= p.x2 && prevY <= p.y + 24 && this.player.y >= p.y) {
              this.player.y = p.y;
              if (p.isTrampoline) { this.player.vy = -1260; this.player.onGround = false; }
              else { this.player.vy = 0; this.player.onGround = true; }
              landed = true; break;
            }
          }
        }
        if (!landed && this.player.y >= cfg.groundY) { this.player.y = cfg.groundY; this.player.vy = 0; this.player.onGround = true; }
      }

      // Бруно біжить слідом
      const bdx = (this.player.x - this.player.facing * 130) - this.bruno.x;
      const bdy = this.player.y - this.bruno.y;
      const bDist = Math.hypot(bdx, bdy);
      if (bDist > 20) {
        const step = Math.min(bDist, 410 * dt);
        this.bruno.x += (bdx / bDist) * step; this.bruno.y += (bdy / bDist) * step;
        if (Math.abs(bdx) > 8) this.bruno.facing = bdx > 0 ? 1 : -1;
        this.bruno.walkTimer += dt * 12.5; this.bruno.isMoving = true;
      } else { this.bruno.isMoving = false; this.bruno.walkTimer = 0; }
      if (this.bruno.flipTimer > 0) this.bruno.flipTimer = Math.max(0, this.bruno.flipTimer - dt);
      if (this.bruno.barkBubbleTimer > 0) this.bruno.barkBubbleTimer = Math.max(0, this.bruno.barkBubbleTimer - dt);

      let lx = this.bruno.x, ly = this.bruno.y;
      this.companionPets.forEach((pet, idx) => {
        const dx = (lx - this.player.facing * (95 + idx * 12)) - pet.x;
        if (Math.abs(dx) > 20) { pet.x += Math.sign(dx) * Math.min(Math.abs(dx), 370 * dt); pet.facing = dx > 0 ? 1 : -1; pet.hopPhase += dt * 11; }
        else pet.hopPhase = 0;
        pet.y += (ly - pet.y) * Math.min(1, 8 * dt); lx = pet.x; ly = pet.y;
      });

      for (let i = this.droppedCoins.length - 1; i >= 0; i--) {
        const c = this.droppedCoins[i];
        if (!c.grounded) {
          c.vy += 1500 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
          if (c.y >= cfg.groundY - 25) { c.y = cfg.groundY - 25; c.vy = -c.vy * 0.35; c.vx *= 0.6; if (Math.abs(c.vy) < 60) c.grounded = true; }
        }
        if (Math.hypot(c.x - this.player.x, c.y - (this.player.y - 95)) < 115) {
          this.droppedCoins.splice(i, 1); this.awardCoins(5);
          this.spawnSparkleBurst(c.x, c.y, '#fde047', 8);
          this.addFloatingText(c.x, c.y - 30, '+5 монет', '#fde047');
        }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]; p.life -= dt; p.vy += 360 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i]; ft.life -= dt; ft.y -= 50 * dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }

      // Пошук найближчого NPC, Дверей, Схованки, Станції
      this.nearNpc = (cfg.npcs || []).find(n => Math.hypot(n.x - this.player.x, n.y - this.player.y) < 190) || null;
      this.nearDoor = (cfg.doors || []).find(d => Math.hypot(d.x - this.player.x, d.y - this.player.y) < 185) || null;
      this.nearSecret = (cfg.secrets || []).find(s => !this.progress.foundSecrets[s.id] && Math.hypot(s.x - this.player.x, s.y - (this.player.y - 80)) < 200) || null;
      this.nearestStation = (cfg.stations || []).find(st => Math.hypot(st.x - this.player.x, st.y - this.player.y) < 180) || null;

      const setCtx = (id, show, labelId, txt) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = (show && !this.player.stairClimb) ? 'flex' : 'none';
        if (show && labelId && txt) document.getElementById(labelId).textContent = txt;
      };
      setCtx('sp-npc-btn', Boolean(this.nearNpc), 'sp-npc-label', this.nearNpc ? `Поговорити: ${this.nearNpc.name}` : '');
      const doorLocked = this.nearDoor && this.nearDoor.needKey && !this.progress.openedDoors[this.nearDoor.id];
      setCtx('sp-door-btn', Boolean(this.nearDoor), 'sp-door-label', this.nearDoor ? (doorLocked ? `Відімкнути: ${this.nearDoor.label}` : this.nearDoor.label) : '');
      setCtx('sp-secret-btn', Boolean(this.nearSecret), 'sp-secret-label', 'Оглянути таємну схованку!');
      setCtx('sp-stair-btn', Boolean(this.nearStairInfo), 'sp-stair-label', this.nearStairInfo ? this.nearStairInfo.label : '');
      setCtx('sp-interact-btn', Boolean(this.nearestStation), 'sp-interact-label', this.nearestStation ? this.nearestStation.prompt : '');
    }

    // ------------------------------------------------------------------------
    // РЕНДЕРИНГ СВІТУ (NPC, ДВЕРІ, СХОВАНКИ, 8-КАДРОВА ДАНІКА ТА БРУНО)
    // ------------------------------------------------------------------------
    render() {
      if (!this.ctx || !this.canvas) return;
      if (this.atlasMode) { this.renderAtlasMap(this.ctx, this.canvas.width, this.canvas.height); return; }

      const ctx = this.ctx, sw = this.canvas.width, sh = this.canvas.height;
      ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, sw, sh);

      const scale = this.camera.zoomMode === 'wide'
        ? Math.min(sw / WORLD_W, sh / WORLD_H)
        : Math.max(sh / WORLD_H, sw / 1500);

      const viewW = sw / scale, viewH = sh / scale;
      const targetCamX = Math.max(0, Math.min(WORLD_W - viewW, this.player.x - viewW * 0.5));
      const targetCamY = Math.max(0, Math.min(WORLD_H - viewH, (this.player.y - 160) - viewH * 0.55));
      this.camera.x += (targetCamX - this.camera.x) * 0.12;
      this.camera.y += (targetCamY - this.camera.y) * 0.12;
      const offsetX = Math.max(0, (sw - WORLD_W * scale) * 0.5);
      const offsetY = Math.max(0, (sh - WORLD_H * scale) * 0.5);
      this._renderTransform = { scale, offsetX, offsetY, camX: this.camera.x, camY: this.camera.y };

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.translate(-this.camera.x, -this.camera.y);

      const bg = this.bgImages[this.currentRoom];
      if (bg) ctx.drawImage(bg, 0, 0, WORLD_W, WORLD_H);

      const cfg = this.locations[this.currentRoom];
      this.renderWorldDoorsAndHints(ctx, cfg);
      this.renderWorldNpcs(ctx, cfg);
      this.renderCoins(ctx);

      this.companionPets.forEach(pet => {
        this.drawCharacterSprite(ctx, this.sprites['pet_' + pet.id], pet.x, pet.y - Math.abs(Math.sin(pet.hopPhase)) * 14, 122, 128, pet.facing, 0, pet.title);
      });
      this.renderBrunoAnimated(ctx);
      this.renderDanikaAnimated(ctx);
      this.renderParticlesAndTexts(ctx);
      ctx.restore();
    }

    renderWorldNpcs(ctx, cfg) {
      const t = performance.now() * 0.003;
      (cfg.npcs || []).forEach(npc => {
        const sp = this.npcSprites[npc.sprite];
        const breathY = Math.sin(t + npc.x * 0.01) * 3;
        const face = this.player.x >= npc.x ? 1 : -1;
        this.drawCharacterSprite(ctx, sp, npc.x, npc.y - breathY, 200, 265, face, 0, npc.name);

        // Векторний ромб завдання над головою NPC (без емоджі!)
        const done = this.progress.completedQuests.includes(npc.questId);
        if (!done) {
          const ready = npc.needItem && this.hasItem(npc.needItem);
          const py = npc.y - 295 + Math.sin(t * 2) * 6;
          ctx.save();
          ctx.translate(npc.x, py);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = ready ? '#4ade80' : '#facc15';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.fillRect(-10, -10, 20, 20);
          ctx.strokeRect(-10, -10, 20, 20);
          ctx.restore();
        }
      });
    }

    renderWorldDoorsAndHints(ctx, cfg) {
      const t = performance.now() * 0.004;

      // 1. Справжні двері / проходи (світловий промінь або замок!)
      (cfg.doors || []).forEach(d => {
        const locked = d.needKey && !this.progress.openedDoors[d.id];
        ctx.save();
        const grad = ctx.createLinearGradient(d.x, d.y - 220, d.x, d.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(1, locked ? 'rgba(244, 114, 182, 0.35)' : 'rgba(74, 222, 128, 0.38)');
        ctx.fillStyle = grad;
        ctx.fillRect(d.x - 44, d.y - 220, 88, 220);

        // Тонка табличка біля дверей, коли Даніка поруч
        if (this.nearDoor && this.nearDoor.id === d.id) {
          ctx.font = '800 19px "Nunito", sans-serif';
          const tw = ctx.measureText(d.label).width + 26;
          ctx.fillStyle = 'rgba(11, 18, 32, 0.82)';
          ctx.beginPath(); ctx.roundRect(d.x - tw / 2, d.y - 250, tw, 32, 10); ctx.fill();
          ctx.strokeStyle = locked ? '#f472b6' : '#4ade80'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(d.label, d.x, d.y - 234);
        }
        ctx.restore();
      });

      // 2. Станції (м'яке золоте сяйво)
      (cfg.stations || []).forEach(st => {
        const isNear = this.nearestStation && this.nearestStation.id === st.id;
        ctx.save();
        const g = ctx.createRadialGradient(st.x, st.y - 8, 6, st.x, st.y - 8, isNear ? 76 : 46);
        g.addColorStop(0, isNear ? 'rgba(253,224,71,0.5)' : 'rgba(253,224,71,0.2)');
        g.addColorStop(1, 'rgba(253,224,71,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(st.x, st.y - 8, isNear ? 76 : 46, 20, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // 3. Невидимі схованки (мерехтять тонкою зірочкою, коли Даніка поруч)
      (cfg.secrets || []).forEach(sec => {
        if (this.progress.foundSecrets[sec.id]) return;
        const dist = Math.hypot(sec.x - this.player.x, sec.y - (this.player.y - 80));
        if (dist < 420) {
          ctx.save();
          ctx.globalAlpha = Math.max(0.2, (1 - dist / 420) * (0.55 + 0.45 * Math.sin(t * 2.4)));
          ctx.fillStyle = sec.giveItem ? '#fde047' : '#f9a8d4';
          ctx.beginPath(); ctx.arc(sec.x, sec.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(sec.x - 14, sec.y); ctx.lineTo(sec.x + 14, sec.y);
          ctx.moveTo(sec.x, sec.y - 14); ctx.lineTo(sec.x, sec.y + 14); ctx.stroke();
          ctx.restore();
        }
      });

      // 4. Векторні стрілки на сходах
      (cfg.stairPaths || []).forEach(sp => {
        [{ pt: sp.points[0], up: true }, { pt: sp.points[sp.points.length - 1], up: false }].forEach(m => {
          ctx.save();
          ctx.translate(m.pt.x, m.pt.y - 36 + Math.sin(t * 1.4) * 4);
          ctx.fillStyle = 'rgba(14, 165, 233, 0.72)'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath();
          if (m.up) { ctx.moveTo(-6, 3); ctx.lineTo(0, -5); ctx.lineTo(6, 3); }
          else { ctx.moveTo(-6, -3); ctx.lineTo(0, 5); ctx.lineTo(6, -3); }
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
          ctx.restore();
        });
      });
    }

    renderAtlasMap(ctx, sw, sh) {
      if (this.atlasBgImg) { ctx.drawImage(this.atlasBgImg, 0, 0, sw, sh); ctx.fillStyle = 'rgba(11,18,32,0.22)'; ctx.fillRect(0, 0, sw, sh); }
      else { ctx.fillStyle = '#0c4a6e'; ctx.fillRect(0, 0, sw, sh); }
      const toXY = (node) => ({ x: (node.x / 100) * sw, y: (node.y / 100) * sh });

      ctx.save();
      this.mapEdges.forEach(([aId, bId]) => {
        const la = this.locations[aId], lb = this.locations[bId];
        if (!la || !lb) return;
        const pa = toXY(la.mapNode), pb = toXY(lb.mapNode);
        const bothOpen = this.progress.unlockedRooms.includes(aId) && this.progress.unlockedRooms.includes(bId);
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = bothOpen ? 'rgba(254, 243, 199, 0.8)' : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = bothOpen ? 8 : 5; ctx.lineCap = 'round';
        ctx.setLineDash(bothOpen ? [] : [8, 8]); ctx.stroke();
      });
      ctx.setLineDash([]); ctx.restore();

      Object.values(this.locations).forEach(loc => {
        const p = toXY(loc.mapNode), unlocked = this.progress.unlockedRooms.includes(loc.id), isCur = loc.id === this.currentRoom;
        ctx.save();
        ctx.beginPath(); ctx.arc(p.x, p.y, isCur ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isCur ? '#4ade80' : (unlocked ? '#38bdf8' : '#64748b'); ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
        ctx.font = '800 13px "Nunito", sans-serif';
        const label = unlocked ? loc.shortName : `${loc.shortName} (Замкнено)`;
        const tw = ctx.measureText(label).width + 20;
        ctx.fillStyle = isCur ? 'rgba(6, 78, 59, 0.86)' : 'rgba(15, 23, 42, 0.82)';
        ctx.beginPath(); ctx.roundRect(p.x - tw / 2, p.y + 15, tw, 24, 9); ctx.fill();
        ctx.strokeStyle = isCur ? '#4ade80' : 'rgba(125,211,252,0.6)'; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, p.x, p.y + 27);
        ctx.restore();
      });

      let dx, dy, facing = 1, walking = false, wTimer = 0;
      if (this.atlasWalk) {
        const aw = this.atlasWalk;
        const a = toXY(this.locations[aw.pathIds[aw.segIdx]].mapNode);
        const b = toXY(this.locations[aw.pathIds[aw.segIdx + 1]].mapNode);
        dx = a.x + (b.x - a.x) * aw.t; dy = a.y + (b.y - a.y) * aw.t;
        facing = (b.x - a.x) >= 0 ? 1 : -1; walking = true; wTimer = aw.walkTimer;
      } else { const cur = toXY(this.locations[this.currentRoom].mapNode); dx = cur.x; dy = cur.y; }
      const dSp = walking && this.danikaWalkFrames.length >= 8 ? this.danikaWalkFrames[Math.floor(wTimer) % 8] : (this.sprites['outfit_' + this.player.outfitId] || this.danikaWalkFrames[0]);
      const bSp = walking && this.brunoWalkFrames.length >= 8 ? this.brunoWalkFrames[Math.floor(wTimer) % 8] : (this.sprites['bruno_custom_bruno'] || this.brunoWalkFrames[0]);
      this.drawCharacterSprite(ctx, bSp, dx - facing * 28, dy, 40, 38, facing, 0, null);
      this.drawCharacterSprite(ctx, dSp, dx, dy, 54, 72, facing, 0, null);
    }

    renderBrunoAnimated(ctx) {
      const b = this.bruno;
      let sprite = b.skinId !== 'custom_bruno' ? this.sprites['bruno_' + b.skinId] : (b.isMoving && this.brunoWalkFrames.length >= 8 ? this.brunoWalkFrames[Math.floor(b.walkTimer) % 8] : (this.sprites['bruno_custom_bruno'] || this.brunoWalkFrames[0]));
      const flipAngle = b.flipTimer > 0 ? (1 - b.flipTimer / 0.85) * Math.PI * 2 : 0;
      const flipY = b.flipTimer > 0 ? Math.sin((1 - b.flipTimer / 0.85) * Math.PI) * 110 : 0;
      this.drawCharacterSprite(ctx, sprite, b.x, b.y - (b.isMoving ? Math.abs(Math.sin(b.walkTimer * 0.8)) * 5 : 0) - flipY, 146, 136, b.facing, flipAngle, 'Бруно');
      if (b.barkBubbleTimer > 0) this.drawSpeechBubble(ctx, b.x, b.y - 170, b.barkText);
    }

    renderDanikaAnimated(ctx) {
      const p = this.player, isMoving = Math.abs(p.vx) > 20 || Boolean(p.stairClimb);
      let sprite = null, bobY = 0, tilt = 0;
      if (!p.onGround) sprite = this.sprites['danika_jump'] || this.danikaWalkFrames[3];
      else if (p.actionTimer > 0) sprite = this.sprites['danika_action'] || this.sprites['outfit_' + p.outfitId];
      else if (isMoving && p.outfitId === 'gandia_polo' && this.danikaWalkFrames.length >= 8) { sprite = this.danikaWalkFrames[Math.floor(p.walkTimer) % 8]; bobY = Math.abs(Math.sin(p.walkTimer * Math.PI * 0.25)) * 5; }
      else if (isMoving) { sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[Math.floor(p.walkTimer) % 8]; bobY = Math.abs(Math.sin(p.walkTimer * 0.85)) * 12; tilt = Math.sin(p.walkTimer * 0.85) * 0.04; }
      else sprite = this.sprites['outfit_' + p.outfitId] || this.danikaWalkFrames[1];
      this.drawCharacterSprite(ctx, sprite, p.x, p.y - bobY, 196, 260, p.facing, tilt, 'Даніка');
    }

    drawCharacterSprite(ctx, sprite, x, y, maxW, maxH, facing, rotAngle, nameTag) {
      ctx.save();
      ctx.beginPath(); ctx.ellipse(x, y - 4, maxW * 0.28, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(11, 18, 32, 0.32)'; ctx.fill();
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
        ctx.save(); ctx.font = '800 17px "Nunito", sans-serif';
        const tw = ctx.measureText(nameTag).width + 18;
        ctx.fillStyle = 'rgba(11, 18, 32, 0.58)';
        ctx.beginPath(); ctx.roundRect(x - tw / 2, y + 6, tw, 24, 9); ctx.fill();
        ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(nameTag, x, y + 18); ctx.restore();
      }
    }

    drawSpeechBubble(ctx, x, y, text) {
      ctx.save(); ctx.font = '800 18px "Nunito", sans-serif';
      const tw = ctx.measureText(text).width + 24;
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 20, tw, 36, 12); ctx.fill();
      ctx.fillStyle = '#0f172a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y - 2); ctx.restore();
    }

    renderCoins(ctx) {
      const t = performance.now() * 0.005;
      this.droppedCoins.forEach((c, idx) => {
        ctx.save(); ctx.translate(c.x, c.y + (c.grounded ? Math.sin(t + idx) * 5 : 0));
        ctx.scale(0.68 + 0.32 * Math.abs(Math.cos(t + idx)), 1);
        ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fillStyle = '#facc15'; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#b45309'; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.restore();
      });
    }

    renderParticlesAndTexts(ctx) {
      this.particles.forEach(p => { ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
      this.floatingTexts.forEach(ft => { ctx.save(); ctx.globalAlpha = Math.min(1, ft.life); ctx.font = '800 22px "Nunito", sans-serif'; ctx.textAlign = 'center'; ctx.strokeStyle = 'rgba(11,18,32,0.85)'; ctx.lineWidth = 4; ctx.strokeText(ft.text, ft.x, ft.y); ctx.fillStyle = ft.color; ctx.fillText(ft.text, ft.x, ft.y); ctx.restore(); });
    }

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
          if (this.atlasMode) { this.handleAtlasPointer(e.clientX, e.clientY); return; }
          if (!this._renderTransform) return;
          const rect = canvas.getBoundingClientRect();
          const px = (e.clientX - rect.left) * (canvas.width / rect.width);
          const py = (e.clientY - rect.top) * (canvas.height / rect.height);
          const { scale, offsetX, offsetY, camX, camY } = this._renderTransform;
          const wx = (px - offsetX) / scale + camX, wy = (py - offsetY) / scale + camY;
          const cfg = this.locations[this.currentRoom];

          // Клік по схованці
          for (const sec of (cfg.secrets || [])) {
            if (!this.progress.foundSecrets[sec.id] && Math.hypot(wx - sec.x, wy - sec.y) < 115) {
              this.collectNearSecret(sec); return;
            }
          }
          // Клік по NPC
          for (const npc of (cfg.npcs || [])) {
            if (Math.hypot(wx - npc.x, wy - (npc.y - 120)) < 130) { this.talkToNearNpc(npc); return; }
          }
          // Клік по сходах
          for (const sp of (cfg.stairPaths || [])) {
            const a = sp.points[0], b = sp.points[sp.points.length - 1];
            if (Math.hypot(wx - a.x, wy - a.y) < 115 && Math.hypot(this.player.x - a.x, this.player.y - a.y) < 320) { this.startAutoStairClimb({ sp, dir: 1 }); return; }
            if (Math.hypot(wx - b.x, wy - b.y) < 115 && Math.hypot(this.player.x - b.x, this.player.y - b.y) < 320) { this.startAutoStairClimb({ sp, dir: -1 }); return; }
          }
          this.player.navTarget = { x: Math.max(95, Math.min(WORLD_W - 95, wx)), y: wy };
        });
      }

      const joyZone = document.getElementById('sp-joystick-zone'), joyKnob = document.getElementById('sp-joystick-knob');
      if (joyZone && joyKnob) {
        let activeId = null;
        const upd = (cx, cy) => {
          const r = joyZone.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
          let dx = cx - ox, dy = cy - oy; const m = r.width * 0.36, d = Math.hypot(dx, dy);
          if (d > m) { dx = (dx / d) * m; dy = (dy / d) * m; }
          joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
          this.joyVec.x = dx / m; this.joyVec.y = dy / m;
        };
        joyZone.addEventListener('pointerdown', (e) => { e.stopPropagation(); activeId = e.pointerId; joyZone.setPointerCapture(e.pointerId); upd(e.clientX, e.clientY); });
        joyZone.addEventListener('pointermove', (e) => { if (e.pointerId === activeId) upd(e.clientX, e.clientY); });
        const end = (e) => { if (e.pointerId === activeId) { activeId = null; this.joyVec.x = 0; this.joyVec.y = 0; joyKnob.style.transform = 'translate(0,0)'; } };
        joyZone.addEventListener('pointerup', end); joyZone.addEventListener('pointercancel', end);
      }
    }

    onResize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(window.innerWidth * dpr);
      this.canvas.height = Math.round(window.innerHeight * dpr);
    }

    awardCoins(a) { this.progress.coins = (this.progress.coins || 0) + a; this.saveProgress(); this.syncHUD(); }
    awardXP(a) {
      const o = this.getLevel(); this.progress.xp = (this.progress.xp || 0) + a;
      if (this.getLevel() > o) { if (window.confetti) window.confetti({ particleCount: 85, spread: 80 }); this.showToast(`Новий Рівень ${this.getLevel()}!`); }
      this.saveProgress(); this.syncHUD();
    }
    spawnCoinFountain(x, y, count = 6) { for (let i = 0; i < count; i++) this.droppedCoins.push({ x, y, vx: (Math.random() - 0.5) * 440, vy: -420 - Math.random() * 300, grounded: false }); }
    spawnSparkleBurst(x, y, color = '#fde047', count = 18) { for (let i = 0; i < count; i++) { const ang = Math.random() * Math.PI * 2, spd = 80 + Math.random() * 240; this.particles.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 100, size: 4 + Math.random() * 5, color, life: 0.7 + Math.random() * 0.4 }); } }
    addFloatingText(x, y, text, color = '#fde047') { this.floatingTexts.push({ x, y, text, color, life: 1.5 }); }

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
      if (!el) return; el.textContent = msg; el.style.display = 'block';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3500);
    }
  }

  window.roblox3D = new DanikaSpiritWorld2D();
})();
