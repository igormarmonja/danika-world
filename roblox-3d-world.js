// ============================================================================
// DANIKA & BRUNO: 3D ROBLOX-STYLE FIRST-PERSON / THIRD-PERSON RPG WORLD
// Повноцінний 3D-прототип із 2 кімнатами, фізикою стрибків (Obby),
// 3D-ручками від першої особи, живим 3D-песиком Бруно та RPG-скринями!
// ============================================================================

(function () {
  class DanikaRoblox3DWorld {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.cameraMode = 'first'; // 'first' (1-ша особа з 3D-руками) або 'third' (Roblox 3-тя особа)
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = null;
      this.animFrameId = null;

      // Стан гравця у 3D
      this.player = {
        x: 0,
        y: 0,
        z: 4.2,
        vx: 0,
        vy: 0,
        vz: 0,
        yaw: 0,        // Поворот вліво-вправо (радіани)
        pitch: -0.05,  // Нахил камери вгору-вниз
        height: 1.75,
        radius: 0.42,
        onGround: true,
        walkCycle: 0,
        heldItem: 'wand', // 'none', 'wand', 'bone', 'pizza', 'cupcake'
        outfitColor: 0xff6b9d,
        hasCrown: true,
        hasWings: false
      };

      // Стан 3D-песика Бруно
      this.bruno = {
        mesh: null,
        x: 1.4,
        y: 0,
        z: 3.2,
        yaw: 0,
        tailAngle: 0,
        flipTimer: 0,
        followMode: true,
        hungerXP: 0
      };

      // Керування (Клавіатура + Мобільний джойстик + Тач-огляд)
      this.keys = {};
      this.joyVec = { x: 0, y: 0 };
      this.lookTouchId = null;
      this.lastLookX = 0;
      this.lastLookY = 0;
      this.isMouseLooking = false;

      // Колізії стін, меблів та Obby-платформ
      this.colliders = [];   // { minX, maxX, minZ, maxZ, maxY, isTrampoline }
      this.interactables = []; // { id, mesh, x, y, z, radius, label, icon, onInteract }
      this.nearestInteractable = null;
      this.collectibleCoins = []; // 3D монетки, які крутяться і збираються
      this.particles3D = [];      // 3D конфетті / сердечка / іскри

      // Стан об'єктів кімнат
      this.doorOpen = false;
      this.doorAngle = 0;
      this.fridgeOpen = false;
      this.fridgeAngle = 0;
      this.tvChannel = 0;
      this.discoMode = false;
      this.discoLights = [];
      this.chestLid = null;
      this.chestOpenAngle = 0;
      this.obbyTrophyCollected = false;

      // RPG міні-квести для Скрині та Дошки Вчительки Даніки
      this.rpgQuests = [
        {
          q: '🏫 Урок Математики: У Бруно було 4 кісточки, а Даніка дала ще 3. Скільки всього кісточок?',
          options: ['7 кісточок 🦴', '6 кісточок', '8 кісточок'],
          correct: 0,
          rewardCoins: 15
        },
        {
          q: '🇪🇸 Іспанська в Гандії: Як іспанською мовою сказати «Песик»?',
          options: ['El Gato 🐱', 'El Perro 🐶', 'La Casa 🏠'],
          correct: 1,
          rewardCoins: 15
        },
        {
          q: '🔬 Цікава Наука: Яка планета Сонячної системи найбільша?',
          options: ['Марс 🔴', 'Юпітер 🪐', 'Меркурій ☀️'],
          correct: 1,
          rewardCoins: 15
        },
        {
          q: '🇬🇧 English Time: Як англійською буде «Веселка»?',
          options: ['Rainbow 🌈', 'Cloud ☁️', 'Star ⭐'],
          correct: 0,
          rewardCoins: 15
        },
        {
          q: '🧮 Загадка Скрині: Що більше: 5 + 5 чи 12 - 3?',
          options: ['5 + 5 (=10) 🌟', '12 - 3 (=9)', 'Вони рівні'],
          correct: 0,
          rewardCoins: 20
        }
      ];
      this.currentQuestIdx = 0;
    }

    // ------------------------------------------------------------------------
    // ВІДКРИТТЯ ТА ІНІЦІАЛІЗАЦІЯ 3D СВІТУ
    // ------------------------------------------------------------------------
    open() {
      this.ensureDOM();
      const modal = document.getElementById('roblox-3d-overlay');
      if (!modal) return;
      modal.style.display = 'flex';
      this.isOpen = true;

      if (!window.THREE) {
        this.loadThreeJS(() => {
          this.initThreeWorld();
          this.startLoop();
        });
      } else {
        if (!this.isInitialized) {
          this.initThreeWorld();
        }
        this.onResize();
        this.startLoop();
      }

      this.syncHUD();
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
    }

    close() {
      this.isOpen = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      const modal = document.getElementById('roblox-3d-overlay');
      if (modal) modal.style.display = 'none';
      if (document.pointerLockElement) {
        try { document.exitPointerLock(); } catch (e) {}
      }
      if (window.game && typeof window.game.updateUI === 'function') {
        window.game.updateUI();
      }
    }

    loadThreeJS(cb) {
      const statusEl = document.getElementById('r3d-loading-banner');
      if (statusEl) statusEl.style.display = 'flex';
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        if (statusEl) statusEl.style.display = 'none';
        cb();
      };
      script.onerror = () => {
        if (statusEl) statusEl.innerHTML = '⚠️ Не вдалося завантажити 3D-рушій. Перевірте інтернет!';
      };
      document.head.appendChild(script);
    }

    // ------------------------------------------------------------------------
    // СТВОРЕННЯ UI ПОВЕРХ 3D-КАНВАСУ (ДЖОЙСТИК, КНОПКИ, ПРИЦІЛ, КВЕСТИ)
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
          #r3d-canvas-host {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
          /* Приціл у центрі екрана (First-Person Crosshair) */
          #r3d-crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            border: 2.5px solid rgba(255,255,255,0.92);
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0,0,0,0.55);
            pointer-events: none;
            z-index: 10;
            transition: transform 0.15s, border-color 0.15s, background 0.15s;
          }
          #r3d-crosshair.target-active {
            transform: translate(-50%, -50%) scale(1.65);
            border-color: #fde047;
            background: rgba(253, 224, 71, 0.35);
          }
          /* Верхня панель 3D HUD */
          .r3d-top-bar {
            position: absolute;
            top: 10px;
            left: 12px;
            right: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            z-index: 20;
            pointer-events: none;
            flex-wrap: wrap;
          }
          .r3d-top-group {
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: auto;
            flex-wrap: wrap;
          }
          .r3d-pill {
            background: rgba(15, 23, 42, 0.82);
            backdrop-filter: blur(8px);
            border: 2px solid rgba(255,255,255,0.28);
            color: #fff;
            padding: 7px 13px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 0.92rem;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          }
          .r3d-btn {
            cursor: pointer;
            transition: transform 0.12s, background 0.15s;
          }
          .r3d-btn:active {
            transform: scale(0.93);
          }
          .r3d-btn-primary {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-color: #e0e7ff;
          }
          .r3d-btn-cam {
            background: linear-gradient(135deg, #0ea5e9, #2563eb);
            border-color: #bae6fd;
          }
          .r3d-btn-exit {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-color: #fecaca;
          }
          /* Підказка предмета у прицілі */
          #r3d-interact-prompt {
            position: absolute;
            bottom: 135px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            color: #fff;
            border: 3px solid #fff;
            border-radius: 22px;
            padding: 10px 22px;
            font-weight: 900;
            font-size: 1.05rem;
            box-shadow: 0 10px 25px rgba(234, 88, 12, 0.55);
            z-index: 25;
            display: none;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            animation: r3dPulse 1.1s infinite alternate;
          }
          @keyframes r3dPulse {
            from { transform: translateX(-50%) scale(1); }
            to { transform: translateX(-50%) scale(1.06); }
          }
          /* Панель предметів у руці (Hotbar як у Roblox / Minecraft) */
          .r3d-hotbar {
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 7px;
            background: rgba(15, 23, 42, 0.82);
            padding: 6px 10px;
            border-radius: 18px;
            border: 2px solid rgba(255,255,255,0.25);
            z-index: 20;
            box-shadow: 0 8px 24px rgba(0,0,0,0.45);
          }
          .r3d-slot {
            width: 50px;
            height: 50px;
            border-radius: 13px;
            background: rgba(255,255,255,0.12);
            border: 2px solid rgba(255,255,255,0.22);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 1.35rem;
            cursor: pointer;
            transition: all 0.15s;
          }
          .r3d-slot span.lbl {
            font-size: 0.58rem;
            font-weight: 800;
            margin-top: -2px;
          }
          .r3d-slot.active {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-color: #fff;
            transform: translateY(-4px) scale(1.07);
            box-shadow: 0 6px 14px rgba(245,158,11,0.5);
          }
          /* Віртуальний джойстик зліва */
          #r3d-joystick-zone {
            position: absolute;
            bottom: 24px;
            left: 22px;
            width: 126px;
            height: 126px;
            border-radius: 50%;
            background: rgba(255,255,255,0.14);
            border: 2.5px solid rgba(255,255,255,0.35);
            z-index: 20;
            touch-action: none;
          }
          #r3d-joystick-knob {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 54px;
            height: 54px;
            margin-left: -27px;
            margin-top: -27px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffffff, #cbd5e1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            pointer-events: none;
          }
          /* Кнопки справа (Стрибок, Дія, Покликати Бруно) */
          .r3d-right-controls {
            position: absolute;
            bottom: 24px;
            right: 22px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            z-index: 20;
          }
          .r3d-action-circle {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            border: 3px solid #fff;
            color: #fff;
            font-weight: 900;
            font-size: 0.78rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 18px rgba(0,0,0,0.45);
            cursor: pointer;
            user-select: none;
          }
          .r3d-action-circle:active {
            transform: scale(0.91);
          }
          #r3d-btn-jump {
            background: linear-gradient(135deg, #10b981, #059669);
          }
          #r3d-btn-use {
            background: linear-gradient(135deg, #f59e0b, #d97706);
          }
          #r3d-btn-bruno-trick {
            width: 54px;
            height: 54px;
            background: linear-gradient(135deg, #ec4899, #db2777);
            font-size: 0.7rem;
          }
          /* Спливаюче повідомлення у 3D */
          #r3d-toast {
            position: absolute;
            top: 66px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.9);
            color: #fde047;
            border: 2px solid #fde047;
            padding: 8px 18px;
            border-radius: 999px;
            font-weight: 900;
            font-size: 0.95rem;
            z-index: 30;
            display: none;
            text-align: center;
            box-shadow: 0 6px 20px rgba(0,0,0,0.45);
            pointer-events: none;
          }
          /* Модальне вікно RPG-Завдання Скрині */
          #r3d-quest-modal {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.72);
            backdrop-filter: blur(6px);
            z-index: 50;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
          .r3d-quest-card {
            background: linear-gradient(180deg, #fffbeb, #fef3c7);
            border: 4px solid #f59e0b;
            border-radius: 26px;
            max-width: 460px;
            width: 100%;
            padding: 20px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            color: #451a03;
          }
          .r3d-quest-opt {
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
          .r3d-quest-opt:hover {
            background: #fef08a;
            transform: scale(1.02);
          }
          @media (max-width: 680px) {
            .r3d-hotbar { bottom: 10px; padding: 4px 7px; gap: 5px; }
            .r3d-slot { width: 42px; height: 42px; font-size: 1.15rem; }
            #r3d-joystick-zone { width: 104px; height: 104px; bottom: 16px; left: 12px; }
            .r3d-right-controls { bottom: 16px; right: 12px; }
            .r3d-action-circle { width: 58px; height: 58px; }
          }
        </style>

        <!-- Канвас Three.js -->
        <div id="r3d-canvas-host"></div>

        <!-- Приціл першої особи -->
        <div id="r3d-crosshair"></div>

        <!-- Верхня панель керування -->
        <div class="r3d-top-bar">
          <div class="r3d-top-group">
            <div class="r3d-pill" style="background:linear-gradient(135deg,#ec4899,#8b5cf6); border-color:#fff;">
              🎮 <span>Даніка 3D World</span>
            </div>
            <div class="r3d-pill">
              🪙 <span id="r3d-coins-val">30</span>
            </div>
            <div class="r3d-pill">
              ⭐ <span id="r3d-xp-val">140</span> XP
            </div>
            <div class="r3d-pill" id="r3d-room-indicator">
              🏠 Кімната 1: Вітальня і Кухня
            </div>
          </div>

          <div class="r3d-top-group">
            <button class="r3d-pill r3d-btn r3d-btn-cam" id="r3d-cam-toggle-btn" onclick="window.roblox3D.toggleCameraMode()">
              👁️ Вигляд: 1-ша особа
            </button>
            <button class="r3d-pill r3d-btn r3d-btn-primary" onclick="window.roblox3D.teleportToOtherRoom()">
              🚪 Перейти в іншу кімнату
            </button>
            <button class="r3d-pill r3d-btn r3d-btn-exit" onclick="window.roblox3D.close()">
              ✕ У 2D Світ
            </button>
          </div>
        </div>

        <!-- Тост-підказка -->
        <div id="r3d-toast">✨ Ласкаво просимо у 3D Світ Даніки та Бруно!</div>

        <!-- Контекстна кнопка взаємодії, коли дивишся на предмет -->
        <button id="r3d-interact-prompt" onclick="window.roblox3D.triggerNearestInteract()">
          <span id="r3d-interact-icon">🖐️</span>
          <span id="r3d-interact-text">Взаємодіяти</span>
        </button>

        <!-- Лівий віртуальний джойстик для ходьби -->
        <div id="r3d-joystick-zone">
          <div id="r3d-joystick-knob"></div>
        </div>

        <!-- Хотбар предметів у 3D-руці Даніки -->
        <div class="r3d-hotbar">
          <div class="r3d-slot active" id="r3d-slot-wand" onclick="window.roblox3D.equipItem('wand')">
            <span>🪄</span><span class="lbl">Паличка</span>
          </div>
          <div class="r3d-slot" id="r3d-slot-bone" onclick="window.roblox3D.equipItem('bone')">
            <span>🦴</span><span class="lbl">Кісточка</span>
          </div>
          <div class="r3d-slot" id="r3d-slot-pizza" onclick="window.roblox3D.equipItem('pizza')">
            <span>🍕</span><span class="lbl">Піца</span>
          </div>
          <div class="r3d-slot" id="r3d-slot-cupcake" onclick="window.roblox3D.equipItem('cupcake')">
            <span>🧁</span><span class="lbl">Кекс</span>
          </div>
          <div class="r3d-slot" id="r3d-slot-none" onclick="window.roblox3D.equipItem('none')">
            <span>✋</span><span class="lbl">Руки</span>
          </div>
        </div>

        <!-- Праві кнопки: Трюк Бруно, Дія, Стрибок -->
        <div class="r3d-right-controls">
          <button class="r3d-action-circle" id="r3d-btn-bruno-trick" onclick="window.roblox3D.commandBrunoFlip()" title="Бруно, зроби сальто!">
            <span style="font-size:1.25rem;">🐶</span>
            <span>Трюк!</span>
          </button>
          <button class="r3d-action-circle" id="r3d-btn-use" onclick="window.roblox3D.useOrInteract()">
            <span style="font-size:1.45rem;">🖐️</span>
            <span>ДІЯ [E]</span>
          </button>
          <button class="r3d-action-circle" id="r3d-btn-jump" onclick="window.roblox3D.jump()">
            <span style="font-size:1.45rem;">⬆️</span>
            <span>СТРИБОК</span>
          </button>
        </div>

        <!-- Вікно RPG-квесту Скрині / Дошки Вчительки Даніки -->
        <div id="r3d-quest-modal">
          <div class="r3d-quest-card">
            <div style="font-size:2.4rem; margin-bottom:4px;">🎁✨</div>
            <h3 style="margin:0 0 8px; font-size:1.25rem; font-family:'Fredoka',cursive;">RPG Скриня Знань Даніки та Бруно</h3>
            <p id="r3d-quest-question" style="font-weight:800; font-size:1.02rem; margin-bottom:14px; line-height:1.4;"></p>
            <div id="r3d-quest-options"></div>
            <button onclick="document.getElementById('r3d-quest-modal').style.display='none'" style="margin-top:10px; background:transparent; border:none; color:#92400e; font-weight:800; cursor:pointer;">Закрити</button>
          </div>
        </div>

        <!-- Банер завантаження -->
        <div id="r3d-loading-banner" style="position:absolute; inset:0; background:#0f172a; color:#fff; display:none; align-items:center; justify-content:center; font-size:1.3rem; font-weight:900; z-index:80;">
          🚀 Завантаження 3D Світу Даніки та Бруно...
        </div>
      `;
      document.body.appendChild(wrap);
      this.bindControls();
    }

    // ------------------------------------------------------------------------
    // ПРОЦЕДУРНІ ТЕКСТУРИ (МИТТЄВЕ ЗАВАНТАЖЕННЯ БЕЗ ЗАТРИМОК)
    // ------------------------------------------------------------------------
    makeWoodTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#d99b66';
      ctx.fillRect(0, 0, 256, 256);
      const planks = 4;
      const h = 256 / planks;
      for (let i = 0; i < planks; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#dfa46f' : '#cf8e55';
        ctx.fillRect(0, i * h, 256, h - 3);
        ctx.fillStyle = '#9c6232';
        ctx.fillRect(0, (i + 1) * h - 3, 256, 3);
        ctx.fillRect((i * 97) % 256, i * h, 3, h);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      return tex;
    }

    makeWallpaperTexture(bgHex, dotHex) {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = dotHex;
      for (let y = 16; y < 128; y += 32) {
        for (let x = 16; x < 128; x += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 3);
      return tex;
    }

    makeTVScreenTexture(channelIdx) {
      const c = document.createElement('canvas');
      c.width = 320;
      c.height = 180;
      const ctx = c.getContext('2d');
      const channels = [
        { bg1: '#38bdf8', bg2: '#bae6fd', title: '🐶 БРУНО СУПЕР-ПЕС ТВ', emoji: '🦴🏆🐾' },
        { bg1: '#a855f7', bg2: '#fbcfe8', title: '🌈 ROBLOX OBBY ПАРКУР!', emoji: '🏃‍♀️⭐👑' },
        { bg1: '#0f172a', bg2: '#1e3a8a', title: '🚀 КОСМІЧНА НАУКА ДАНІКИ', emoji: '🪐🌍✨' }
      ];
      const ch = channels[channelIdx % channels.length];
      const grad = ctx.createLinearGradient(0, 0, 0, 180);
      grad.addColorStop(0, ch.bg1);
      grad.addColorStop(1, ch.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ch.title, 160, 55);
      ctx.font = '46px sans-serif';
      ctx.fillText(ch.emoji, 160, 125);
      return new THREE.CanvasTexture(c);
    }

    makeChalkboardTexture() {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 220;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, 0, 400, 220);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 14;
      ctx.strokeRect(0, 0, 400, 220);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👩‍🏫 ШКОЛА ВЧИТЕЛЬКИ ДАНІКИ', 200, 48);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('4 + 3 = 7 🦴   |   Hola = Привіт 🇪🇸', 200, 105);
      ctx.fillStyle = '#86efac';
      ctx.fillText('Натисни 🖐️ щоб провести урок (+15 🪙)', 200, 165);
      return new THREE.CanvasTexture(c);
    }

    // ------------------------------------------------------------------------
    // ПОБУДОВА 3D СВІТУ (2 КІМНАТИ + МЕБЛІ + ОББІ-ПАРКУР + БРУНО + 3D-РУКИ)
    // ------------------------------------------------------------------------
    initThreeWorld() {
      const host = document.getElementById('r3d-canvas-host');
      if (!host) return;
      host.innerHTML = '';

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.Fog(0x87ceeb, 18, 42);

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 60);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      host.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();
      this.colliders = [];
      this.interactables = [];
      this.collectibleCoins = [];

      // Освітлення
      const ambient = new THREE.AmbientLight(0xffffff, 0.72);
      this.scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xfff7ed, 0.78);
      dirLight.position.set(8, 16, 10);
      dirLight.castShadow = true;
      this.scene.add(dirLight);

      // Диско-світло для бумбоксу
      const disco1 = new THREE.PointLight(0xff007f, 0, 12);
      disco1.position.set(-2, 3.6, 0);
      const disco2 = new THREE.PointLight(0x00f0ff, 0, 12);
      disco2.position.set(2, 3.6, 0);
      this.scene.add(disco1, disco2);
      this.discoLights = [disco1, disco2];

      // 1. Будуємо КІМНАТУ 1 (Вітальня та Кухня: Z від -6 до +6, X від -6 до +6)
      // та КІМНАТУ 2 (RPG Пригоди, Школа Бруно та Паркур Obby: Z від -18 до -6, X від -6 до +6)
      this.buildRoomsArchitecture();

      // 2. Меблі та інтерактивні об'єкти Кімнати 1
      this.buildRoom1Furniture();

      // 3. Меблі, RPG-Скриня, Дошка Даніки та Паркур-Оббі Кімнати 2
      this.buildRoom2RPGAndObby();

      // 4. 3D-фігурка Даніки (для вигляду від 3-ї особи Roblox) + 3D-руки для 1-ї особи
      this.buildDanika3DAvatarAndHands();

      // 5. 3D-песик Бруно, який бігає за Данікою
      this.buildBruno3DPet();

      // 6. Розкладаємо стартові 3D-монетки по обох кімнатах
      this.spawnRoomCoins();

      window.addEventListener('resize', () => this.onResize());
      this.isInitialized = true;
      this.showToast('🎮 Керування: Джойстик або WASD — ходити, Мишка/Пальцем — дивитись, СТРИБОК — стрибати!');
    }

    addBoxCollider(minX, maxX, minZ, maxZ, maxY, isTrampoline = false) {
      this.colliders.push({ minX, maxX, minZ, maxZ, maxY, isTrampoline });
    }

    buildRoomsArchitecture() {
      const woodTex = this.makeWoodTexture();
      const wallTex1 = this.makeWallpaperTexture('#fff1f2', '#fecdd3'); // Ніжно-рожеві шпалери Кімнати 1
      const wallTex2 = this.makeWallpaperTexture('#eff6ff', '#bfdbfe'); // Небесно-блакитні шпалери Кімнати 2

      // Підлога на обидві кімнати (X: -6..6, Z: -18..6)
      const floorGeo = new THREE.PlaneGeometry(12, 24);
      const floorMat = new THREE.MeshLambertMaterial({ map: woodTex });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, -6);
      floor.receiveShadow = true;
      this.scene.add(floor);

      // Стеля з віконцями світла
      const ceilMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb, side: THREE.DoubleSide });
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(12, 24), ceilMat);
      ceil.rotation.x = Math.PI / 2;
      ceil.position.set(0, 5.2, -6);
      this.scene.add(ceil);

      const wallH = 5.2;
      const wallMat1 = new THREE.MeshLambertMaterial({ map: wallTex1 });
      const wallMat2 = new THREE.MeshLambertMaterial({ map: wallTex2 });

      // Задня стіна Кімнати 1 (Z = +6)
      const wBack1 = new THREE.Mesh(new THREE.BoxGeometry(12, wallH, 0.3), wallMat1);
      wBack1.position.set(0, wallH / 2, 6);
      this.scene.add(wBack1);
      this.addBoxCollider(-6.2, 6.2, 5.7, 6.4, wallH);

      // Ліва та права стіни Кімнати 1 (X = -6, X = +6, Z: -6..6)
      const wLeft1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12), wallMat1);
      wLeft1.position.set(-6, wallH / 2, 0);
      const wRight1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12), wallMat1);
      wRight1.position.set(6, wallH / 2, 0);
      this.scene.add(wLeft1, wRight1);
      this.addBoxCollider(-6.3, -5.7, -18.2, 6.2, wallH);
      this.addBoxCollider(5.7, 6.3, -18.2, 6.2, wallH);

      // Ліва та права стіни Кімнати 2 (X = -6, X = +6, Z: -18..-6)
      const wLeft2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12), wallMat2);
      wLeft2.position.set(-6, wallH / 2, -12);
      const wRight2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12), wallMat2);
      wRight2.position.set(6, wallH / 2, -12);
      this.scene.add(wLeft2, wRight2);

      // Дальня стіна Кімнати 2 (Z = -18)
      const wFar2 = new THREE.Mesh(new THREE.BoxGeometry(12, wallH, 0.3), wallMat2);
      wFar2.position.set(0, wallH / 2, -18);
      this.scene.add(wFar2);
      this.addBoxCollider(-6.2, 6.2, -18.4, -17.7, wallH);

      // Міжкімнатна перегородка з дверним отвором у центрі (Z = -6)
      // Ліва половина перегородки (X: -6..-1.3)
      const partLeft = new THREE.Mesh(new THREE.BoxGeometry(4.7, wallH, 0.32), wallMat1);
      partLeft.position.set(-3.65, wallH / 2, -6);
      // Права половина перегородки (X: 1.3..6)
      const partRight = new THREE.Mesh(new THREE.BoxGeometry(4.7, wallH, 0.32), wallMat1);
      partRight.position.set(3.65, wallH / 2, -6);
      // Перемичка над дверима
      const partTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.9, 0.32), wallMat1);
      partTop.position.set(0, wallH - 0.95, -6);
      this.scene.add(partLeft, partRight, partTop);

      this.addBoxCollider(-6.1, -1.25, -6.25, -5.75, wallH);
      this.addBoxCollider(1.25, 6.1, -6.25, -5.75, wallH);

      // Дверне полотно на петлях (відкривається/закривається!)
      this.doorPivot = new THREE.Group();
      this.doorPivot.position.set(-1.25, 0, -6);
      const doorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 3.25, 0.14),
        new THREE.MeshLambertMaterial({ color: 0xf59e0b })
      );
      doorMesh.position.set(1.225, 1.625, 0);
      // Золота ручка дверей
      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 12, 12),
        new THREE.MeshLambertMaterial({ color: 0xfef08a })
      );
      knob.position.set(2.15, 1.55, 0.14);
      const knobBack = knob.clone();
      knobBack.position.z = -0.14;
      doorMesh.add(knob, knobBack);
      this.doorPivot.add(doorMesh);
      this.scene.add(this.doorPivot);

      this.interactables.push({
        id: 'room_door',
        mesh: doorMesh,
        x: 0,
        y: 1.5,
        z: -6,
        radius: 2.8,
        label: 'Двері у Кімнату Пригод та Паркуру',
        icon: '🚪',
        onInteract: () => {
          this.doorOpen = !this.doorOpen;
          if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
          this.showToast(this.doorOpen ? '🚪 Двері відкрито! Заходь у Кімнату 2 (Школа Бруно та Паркур Obby)!' : '🚪 Двері зачинено!');
        }
      });

      // Панорамне вікно на море Гандії у Кімнаті 1 (на лівій стіні X = -5.82)
      const winFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 2.5, 4.2),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      winFrame.position.set(-5.82, 2.7, 0.5);
      const seaGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 2.2, 3.9),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      seaGlass.position.set(-5.8, 2.7, 0.5);
      // Сонце за вікном
      const sunDisk = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      sunDisk.position.set(-5.7, 3.3, 1.4);
      this.scene.add(winFrame, seaGlass, sunDisk);
    }

    buildRoom1Furniture() {
      // 1. Затишний круглий килим у центрі вітальні
      const rug = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 0.03, 32),
        new THREE.MeshLambertMaterial({ color: 0xf472b6 })
      );
      rug.position.set(0, 0.02, 0.5);
      this.scene.add(rug);

      // 2. ДИВАН-БАТУТ (Можна застрибувати і високо підлітати!)
      const sofaGroup = new THREE.Group();
      sofaGroup.position.set(-3.8, 0, 0.5);
      const sofaMat = new THREE.MeshLambertMaterial({ color: 0xa855f7 });
      const cushionMat = new THREE.MeshLambertMaterial({ color: 0xe879f9 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 3.4), sofaMat);
      base.position.y = 0.28;
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.35, 3.4), sofaMat);
      back.position.set(-0.58, 0.7, 0);
      const cush = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 3.1), cushionMat);
      cush.position.set(0.1, 0.62, 0);
      sofaGroup.add(base, back, cush);
      this.scene.add(sofaGroup);
      // Колайдер дивана з ефектом батута (isTrampoline = true)
      this.addBoxCollider(-4.6, -3.0, -1.2, 2.2, 0.8, true);

      this.interactables.push({
        id: 'sofa_bounce',
        mesh: sofaGroup,
        x: -3.8,
        y: 0.8,
        z: 0.5,
        radius: 2.5,
        label: 'Диван-Батут (Застрибни зверху!)',
        icon: '🛋️',
        onInteract: () => {
          this.player.x = -3.6;
          this.player.z = 0.5;
          this.player.y = 1.0;
          this.player.vy = 9.5;
          this.player.onGround = false;
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
          this.showToast('🤸‍♀️ Вжух! Диван-батут підкинув Даніку під саму стелю!');
        }
      });

      // 3. ВЕЛИКИЙ 3D ТЕЛЕВІЗОР + Тумба
      const tvStand = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.65, 0.8),
        new THREE.MeshLambertMaterial({ color: 0x78350f })
      );
      tvStand.position.set(0, 0.325, 5.3);
      this.tvScreenMat = new THREE.MeshBasicMaterial({ map: this.makeTVScreenTexture(0) });
      const tvBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 1.35, 0.14),
        new THREE.MeshLambertMaterial({ color: 0x1e293b })
      );
      tvBody.position.set(0, 1.45, 5.3);
      const tvDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 1.2), this.tvScreenMat);
      tvDisplay.position.set(0, 1.45, 5.22);
      tvDisplay.rotation.y = Math.PI;
      this.scene.add(tvStand, tvBody, tvDisplay);
      this.addBoxCollider(-1.4, 1.4, 4.85, 5.8, 1.5);

      this.interactables.push({
        id: 'tv_set',
        mesh: tvBody,
        x: 0,
        y: 1.4,
        z: 5.2,
        radius: 3.0,
        label: 'Перемкнути телеканал (+5 XP)',
        icon: '📺',
        onInteract: () => {
          this.tvChannel = (this.tvChannel + 1) % 3;
          this.tvScreenMat.map = this.makeTVScreenTexture(this.tvChannel);
          this.tvScreenMat.needsUpdate = true;
          this.awardXP(5);
          if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
          this.showToast('📺 Канал перемкнено! (+5 XP)');
        }
      });

      // 4. КУХОННИЙ КУТОЧОК ТА 3D-ХОЛОДИЛЬНИК (Справа в Кімнаті 1)
      const fridgeBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 2.5, 1.2),
        new THREE.MeshLambertMaterial({ color: 0xe0f2fe })
      );
      fridgeBody.position.set(5.1, 1.25, 2.2);
      this.scene.add(fridgeBody);
      this.addBoxCollider(4.4, 5.8, 1.5, 2.9, 2.5);

      // Дверцята холодильника на петлях
      this.fridgeDoorPivot = new THREE.Group();
      this.fridgeDoorPivot.position.set(4.44, 1.25, 2.8);
      const fDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.42, 1.18),
        new THREE.MeshLambertMaterial({ color: 0x38bdf8 })
      );
      fDoor.position.set(0, 0, -0.59);
      this.fridgeDoorPivot.add(fDoor);
      this.scene.add(this.fridgeDoorPivot);

      this.interactables.push({
        id: 'fridge_food',
        mesh: fridgeBody,
        x: 4.5,
        y: 1.3,
        z: 2.2,
        radius: 2.7,
        label: 'Холодильник: Взяти смаколик або кісточку',
        icon: '🧊',
        onInteract: () => {
          this.fridgeOpen = !this.fridgeOpen;
          const foods = ['pizza', 'cupcake', 'bone'];
          const nextFood = foods[Math.floor(Math.random() * foods.length)];
          this.equipItem(nextFood);
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
          const names = { pizza: '🍕 Гарячу Піцу', cupcake: '🧁 Полуничний Кекс', bone: '🦴 Смачну Кісточку для Бруно' };
          this.showToast(`🧊 Ти взяла з холодильника: ${names[nextFood]}! Подивись на свою 3D-руку!`);
        }
      });

      // 5. ДИСКО-БУМБОКС на кухонному столі
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.95, 2.6),
        new THREE.MeshLambertMaterial({ color: 0xfde68a })
      );
      counter.position.set(5.1, 0.475, -0.5);
      const boombox = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.42, 0.9),
        new THREE.MeshLambertMaterial({ color: 0xef4444 })
      );
      boombox.position.set(5.0, 1.16, -0.5);
      this.scene.add(counter, boombox);
      this.addBoxCollider(4.4, 5.8, -1.85, 0.85, 1.0);

      this.interactables.push({
        id: 'disco_boombox',
        mesh: boombox,
        x: 4.8,
        y: 1.2,
        z: -0.5,
        radius: 2.6,
        label: 'Диско-Бумбокс: Увімкнути вечірку!',
        icon: '📻',
        onInteract: () => {
          this.discoMode = !this.discoMode;
          this.discoLights.forEach(l => { l.intensity = this.discoMode ? 1.6 : 0; });
          if (this.discoMode) {
            this.commandBrunoFlip();
            this.showToast('🪩 ДИСКО-ВЕЧІРКА! Бруно танцює!');
          } else {
            this.showToast('📻 Диско-світло вимкнено');
          }
        }
      });
    }

    buildRoom2RPGAndObby() {
      // 1. ДОШКА ВЧИТЕЛЬКИ ДАНІКИ на дальній стіні Кімнати 2 (Z = -17.75)
      const boardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 2.2, 0.16),
        new THREE.MeshBasicMaterial({ map: this.makeChalkboardTexture() })
      );
      boardMesh.position.set(0, 2.3, -17.72);
      this.scene.add(boardMesh);

      this.interactables.push({
        id: 'teacher_board',
        mesh: boardMesh,
        x: 0,
        y: 2.0,
        z: -17.5,
        radius: 3.4,
        label: 'Провести урок Вчительки Даніки (+15 🪙)',
        icon: '👩‍🏫',
        onInteract: () => this.openRPGQuestModal()
      });

      // 2. ЗОЛОТА RPG-СКРИНЯ СКАРБІВ перед дошкою (Z = -14.8, X = 0)
      const chestGroup = new THREE.Group();
      chestGroup.position.set(0, 0, -14.8);
      const chestBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.75, 0.95),
        new THREE.MeshLambertMaterial({ color: 0xb45309 })
      );
      chestBase.position.y = 0.375;
      const goldTrim = new THREE.Mesh(
        new THREE.BoxGeometry(1.46, 0.18, 1.0),
        new THREE.MeshLambertMaterial({ color: 0xfacc15 })
      );
      goldTrim.position.y = 0.68;

      this.chestLid = new THREE.Group();
      this.chestLid.position.set(0, 0.75, -0.45);
      const lidMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.42, 0.45, 0.95),
        new THREE.MeshLambertMaterial({ color: 0xd97706 })
      );
      lidMesh.position.set(0, 0.22, 0.45);
      this.chestLid.add(lidMesh);

      chestGroup.add(chestBase, goldTrim, this.chestLid);
      this.scene.add(chestGroup);
      this.addBoxCollider(-0.75, 0.75, -15.35, -14.25, 1.1);

      this.interactables.push({
        id: 'rpg_treasure_chest',
        mesh: chestGroup,
        x: 0,
        y: 0.8,
        z: -14.8,
        radius: 2.8,
        label: 'Відкрити RPG-Скриню Скарбів (+Монети 🪙)',
        icon: '🎁',
        onInteract: () => this.openRPGQuestModal()
      });

      // 3. 3D ПОДІУМ ПЕРЕВДЯГАННЯ (Avatar Dress-Up Booth у Кімнаті 2 зліва)
      const boothPad = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.35, 0.18, 24),
        new THREE.MeshLambertMaterial({ color: 0xec4899 })
      );
      boothPad.position.set(-4.1, 0.09, -11.5);
      const boothRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.06, 12, 32),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      boothRing.rotation.x = Math.PI / 2;
      boothRing.position.set(-4.1, 0.22, -11.5);
      this.scene.add(boothPad, boothRing);

      this.interactables.push({
        id: 'avatar_booth',
        mesh: boothPad,
        x: -4.1,
        y: 1.0,
        z: -11.5,
        radius: 2.5,
        label: 'Магічний Подіум: Змінити 3D-костюм та крила Феї!',
        icon: '👗',
        onInteract: () => {
          const palette = [0xff6b9d, 0x38bdf8, 0xa855f7, 0x10b981, 0xf59e0b];
          const curIdx = palette.indexOf(this.player.outfitColor);
          this.player.outfitColor = palette[(curIdx + 1) % palette.length];
          this.player.hasWings = !this.player.hasWings;
          this.updateDanikaOutfitVisuals();
          this.spawn3DBurst(-4.1, 1.5, -11.5, 0xfef08a);
          if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
          this.showToast(this.player.hasWings ? '🧚 Ти одягла Сяючі Крила Феї та новий костюм! (Увімкни 3-тю особу щоб побачити!)' : '👑 Новий колір костюма Даніки!');
        }
      });

      // 4. ROBLOX ПАРКУР «НЕБЕСНИЙ ОББІ» (Справа в Кімнаті 2: 6 кольорових платформ угору до Кубка!)
      const obbySteps = [
        { x: 3.8, y: 0.55, z: -8.2, color: 0xef4444 },
        { x: 4.3, y: 1.10, z: -10.0, color: 0xf97316 },
        { x: 3.6, y: 1.65, z: -11.8, color: 0xfacc15 },
        { x: 4.4, y: 2.20, z: -13.6, color: 0x22c55e },
        { x: 3.7, y: 2.75, z: -15.3, color: 0x3b82f6 },
        { x: 4.2, y: 3.30, z: -16.8, color: 0xa855f7 }
      ];

      obbySteps.forEach((st) => {
        const plat = new THREE.Mesh(
          new THREE.BoxGeometry(1.55, 0.24, 1.35),
          new THREE.MeshLambertMaterial({ color: st.color })
        );
        plat.position.set(st.x, st.y, st.z);
        this.scene.add(plat);
        this.addBoxCollider(st.x - 0.85, st.x + 0.85, st.z - 0.75, st.z + 0.75, st.y + 0.12, false);
      });

      // Золотий Кубок Чемпіона Паркуру на верхній платформі!
      this.obbyTrophy = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        new THREE.MeshLambertMaterial({ color: 0xfde047 })
      );
      this.obbyTrophy.position.set(4.2, 4.05, -16.8);
      this.scene.add(this.obbyTrophy);

      this.interactables.push({
        id: 'obby_trophy',
        mesh: this.obbyTrophy,
        x: 4.2,
        y: 4.0,
        z: -16.8,
        radius: 2.2,
        label: '🏆 Забрати Кубок Чемпіона Паркуру (+25 🪙)',
        icon: '🏆',
        onInteract: () => {
          this.awardCoins(25);
          this.awardXP(30);
          this.spawn3DBurst(4.2, 4.1, -16.8, 0xfacc15);
          if (window.confetti) window.confetti({ particleCount: 70, spread: 75 });
          if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
          this.showToast('🏆 ВАУ! Ти пройшла Roblox-Паркур до самої стелі! +25 Монет та +30 XP!');
        }
      });
    }

    // ------------------------------------------------------------------------
    // 3D-АВАТАР ДАНІКИ (ДЛЯ 3-Ї ОСОБИ ROBLOX) ТА 3D-РУКИ З ПРЕДМЕТОМ (ДЛЯ 1-Ї ОСОБИ)
    // ------------------------------------------------------------------------
    buildDanika3DAvatarAndHands() {
      // 1. 3D-руки першої особи, прикріплені до камери
      this.scene.add(this.camera);
      this.fpGroup = new THREE.Group();
      this.camera.add(this.fpGroup);

      const skinMat = new THREE.MeshLambertMaterial({ color: 0xffd1b3 });

      // Ліва рука
      this.fpLeftHand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.45), skinMat);
      this.fpLeftHand.position.set(-0.36, -0.30, -0.55);
      // Права рука (тримає предмети)
      this.fpRightHand = new THREE.Group();
      this.fpRightHand.position.set(0.38, -0.28, -0.58);
      const rArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.48), skinMat);
      this.fpRightHand.add(rArm);

      // Контейнер предмета в руці
      this.heldItemGroup = new THREE.Group();
      this.heldItemGroup.position.set(0, 0.12, -0.22);
      this.fpRightHand.add(this.heldItemGroup);

      this.fpGroup.add(this.fpLeftHand, this.fpRightHand);

      // 2. Повнорозмірна 3D-фігурка Даніки у стилі Roblox (видно в режимі 3-ї особи)
      this.danika3D = new THREE.Group();
      this.torsoMat = new THREE.MeshLambertMaterial({ color: this.player.outfitColor });
      const legMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const hairMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.65, 0.30), this.torsoMat);
      torso.position.y = 0.95;

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), skinMat);
      head.position.y = 1.52;

      // Волосся та хвостик Даніки
      const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.22, 0.50), hairMat);
      hairTop.position.y = 1.72;
      const ponytail = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.45, 0.20), hairMat);
      ponytail.position.set(0, 1.52, 0.30);

      // Золота корона
      this.crownMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.15, 0.14, 6),
        new THREE.MeshLambertMaterial({ color: 0xfde047 })
      );
      this.crownMesh.position.y = 1.88;

      // Крила феї
      this.wingsGroup = new THREE.Group();
      const wingMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8, transparent: true, opacity: 0.8 });
      const wL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.04), wingMat);
      wL.position.set(-0.35, 1.1, 0.18);
      wL.rotation.y = 0.3;
      const wR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.04), wingMat);
      wR.position.set(0.35, 1.1, 0.18);
      wR.rotation.y = -0.3;
      this.wingsGroup.add(wL, wR);
      this.wingsGroup.visible = this.player.hasWings;

      // Руки та ніжки для анімації ходьби
      this.dLeftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.24), legMat);
      this.dLeftLeg.position.set(-0.14, 0.31, 0);
      this.dRightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.24), legMat);
      this.dRightLeg.position.set(0.14, 0.31, 0);

      this.dLeftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.58, 0.20), skinMat);
      this.dLeftArm.position.set(-0.38, 0.95, 0);
      this.dRightArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.58, 0.20), skinMat);
      this.dRightArm.position.set(0.38, 0.95, 0);

      this.danika3D.add(torso, head, hairTop, ponytail, this.crownMesh, this.wingsGroup, this.dLeftLeg, this.dRightLeg, this.dLeftArm, this.dRightArm);
      this.danika3D.visible = (this.cameraMode === 'third');
      this.scene.add(this.danika3D);

      this.rebuildHeldItemMesh();
    }

    updateDanikaOutfitVisuals() {
      if (this.torsoMat) this.torsoMat.color.setHex(this.player.outfitColor);
      if (this.wingsGroup) this.wingsGroup.visible = this.player.hasWings;
    }

    rebuildHeldItemMesh() {
      if (!this.heldItemGroup) return;
      while (this.heldItemGroup.children.length > 0) {
        this.heldItemGroup.remove(this.heldItemGroup.children[0]);
      }

      const type = this.player.heldItem;
      if (type === 'wand') {
        const stick = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.03, 0.52, 8),
          new THREE.MeshLambertMaterial({ color: 0xf472b6 })
        );
        stick.rotation.x = Math.PI / 3;
        const star = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.10, 0),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        star.position.set(0, 0.14, -0.22);
        this.heldItemGroup.add(stick, star);
      } else if (type === 'bone') {
        const bone = new THREE.Mesh(
          new THREE.BoxGeometry(0.34, 0.09, 0.09),
          new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        this.heldItemGroup.add(bone);
      } else if (type === 'pizza') {
        const slice = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.34, 3),
          new THREE.MeshLambertMaterial({ color: 0xfbbf24 })
        );
        slice.rotation.x = -Math.PI / 2;
        this.heldItemGroup.add(slice);
      } else if (type === 'cupcake') {
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.08, 0.14, 12),
          new THREE.MeshLambertMaterial({ color: 0xf43f5e })
        );
        const frosting = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshLambertMaterial({ color: 0xfbcfe8 })
        );
        frosting.position.y = 0.10;
        this.heldItemGroup.add(cup, frosting);
      }
    }

    equipItem(itemKey) {
      this.player.heldItem = itemKey;
      ['wand', 'bone', 'pizza', 'cupcake', 'none'].forEach(k => {
        const el = document.getElementById(`r3d-slot-${k}`);
        if (el) el.classList.toggle('active', k === itemKey);
      });
      this.rebuildHeldItemMesh();
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    // ------------------------------------------------------------------------
    // 3D-ПЕСИК БРУНО (ЖИВИЙ СУПУТНИК, ЩО ХОДИТЬ ЗА ДАНІКОЮ І РОБИТЬ САЛЬТО)
    // ------------------------------------------------------------------------
    buildBruno3DPet() {
      const g = new THREE.Group();
      const blackFur = new THREE.MeshLambertMaterial({ color: 0x1e1b18 });
      const tanFur = new THREE.MeshLambertMaterial({ color: 0xd97706 });
      const collarMat = new THREE.MeshLambertMaterial({ color: 0x0ea5e9 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.68), blackFur);
      body.position.y = 0.34;

      const chestSpot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.05), tanFur);
      chestSpot.position.set(0, 0.32, -0.33);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.38), blackFur);
      head.position.set(0, 0.58, -0.34);

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.18), tanFur);
      snout.position.set(0, 0.51, -0.55);

      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.22, 0.14), blackFur);
      earL.position.set(-0.22, 0.62, -0.32);
      const earR = earL.clone();
      earR.position.x = 0.22;

      const collar = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.08, 0.41), collarMat);
      collar.position.set(0, 0.44, -0.30);

      // Хвостик, що виляє
      this.brunoTail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), blackFur);
      this.brunoTail.position.set(0, 0.50, 0.35);

      // Лапки
      const pawGeo = new THREE.BoxGeometry(0.11, 0.22, 0.11);
      const p1 = new THREE.Mesh(pawGeo, tanFur); p1.position.set(-0.14, 0.11, -0.22);
      const p2 = new THREE.Mesh(pawGeo, tanFur); p2.position.set(0.14, 0.11, -0.22);
      const p3 = new THREE.Mesh(pawGeo, tanFur); p3.position.set(-0.14, 0.11, 0.22);
      const p4 = new THREE.Mesh(pawGeo, tanFur); p4.position.set(0.14, 0.11, 0.22);

      g.add(body, chestSpot, head, snout, earL, earR, collar, this.brunoTail, p1, p2, p3, p4);
      g.position.set(this.bruno.x, 0, this.bruno.z);
      this.scene.add(g);
      this.bruno.mesh = g;

      this.interactables.push({
        id: 'bruno_pet',
        mesh: g,
        get x() { return g.position.x; },
        get y() { return 0.5; },
        get z() { return g.position.z; },
        radius: 2.4,
        label: 'Погладити / Нагодувати 3D-Бруно (+10 XP)',
        icon: '🐶',
        onInteract: () => {
          this.commandBrunoFlip();
          if (this.player.heldItem === 'bone') {
            this.awardCoins(10);
            this.awardXP(15);
            this.showToast('🦴 Гав-гав! Бруно з’їв кісточку, зробив сальто і приніс +10 Монет та +15 XP!');
          } else {
            this.awardXP(10);
            this.showToast('🐶 Бруно радісно робить 3D-сальто! (Візьми кісточку 🦴 у слоті внизу, щоб пригостити його!)');
          }
        }
      });
    }

    commandBrunoFlip() {
      this.bruno.flipTimer = 1.0;
      this.spawn3DBurst(this.bruno.mesh.position.x, 0.8, this.bruno.mesh.position.z, 0xf43f5e);
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }

    // ------------------------------------------------------------------------
    // ЗОЛОТІ 3D-МОНЕТКИ У КІМНАТАХ (ЗБИРАЮТЬСЯ ПРИ ПРОБІЖЦІ КРІЗЬ НИХ)
    // ------------------------------------------------------------------------
    spawnRoomCoins() {
      const positions = [
        { x: -1.8, y: 0.65, z: 2.0 },
        { x: 1.8, y: 0.65, z: 1.2 },
        { x: 0, y: 0.65, z: -3.2 },
        { x: -2.2, y: 0.65, z: -9.5 },
        { x: 1.5, y: 0.65, z: -12.0 },
        { x: 3.6, y: 2.15, z: -11.8 } // На платформі паркуру!
      ];
      positions.forEach(p => this.createCoinAt(p.x, p.y, p.z));
    }

    createCoinAt(x, y, z, vx = 0, vy = 0, vz = 0) {
      const coinMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.26, 0.07, 16),
        new THREE.MeshLambertMaterial({ color: 0xfacc15 })
      );
      coinMesh.rotation.z = Math.PI / 2;
      coinMesh.position.set(x, y, z);
      this.scene.add(coinMesh);
      this.collectibleCoins.push({ mesh: coinMesh, vx, vy, vz, baseY: y });
    }

    spawn3DBurst(x, y, z, hexColor) {
      for (let i = 0; i < 14; i++) {
        const p = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.11, 0.11),
          new THREE.MeshBasicMaterial({ color: hexColor })
        );
        p.position.set(x, y, z);
        this.scene.add(p);
        this.particles3D.push({
          mesh: p,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 3.5,
          vz: (Math.random() - 0.5) * 4,
          life: 0.85
        });
      }
    }

    // ------------------------------------------------------------------------
    // RPG-КВЕСТИ СКРИНІ ТА НАГОРОДИ (СИНХРОНІЗАЦІЯ З ОСНОВНОЮ ГРОЮ)
    // ------------------------------------------------------------------------
    openRPGQuestModal() {
      const modal = document.getElementById('r3d-quest-modal');
      const qEl = document.getElementById('r3d-quest-question');
      const optsEl = document.getElementById('r3d-quest-options');
      if (!modal || !qEl || !optsEl) return;

      const quest = this.rpgQuests[this.currentQuestIdx % this.rpgQuests.length];
      qEl.textContent = quest.q;
      optsEl.innerHTML = quest.options.map((opt, idx) => `
        <button class="r3d-quest-opt" onclick="window.roblox3D.answerRPGQuest(${idx})">${opt}</button>
      `).join('');
      modal.style.display = 'flex';
    }

    answerRPGQuest(choiceIdx) {
      const quest = this.rpgQuests[this.currentQuestIdx % this.rpgQuests.length];
      const modal = document.getElementById('r3d-quest-modal');
      if (choiceIdx === quest.correct) {
        if (modal) modal.style.display = 'none';
        this.currentQuestIdx++;
        this.chestOpenAngle = -1.2;
        // Викидаємо фонтан 3D-монеток із скрині по кімнаті!
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const tx = Math.cos(angle) * 2.1;
          const tz = -14.2 + Math.sin(angle) * 1.8;
          this.createCoinAt(tx, 0.65, tz);
        }
        this.awardCoins(quest.rewardCoins);
        this.awardXP(20);
        this.spawn3DBurst(0, 1.2, -14.8, 0xfacc15);
        if (window.confetti) window.confetti({ particleCount: 55, spread: 70 });
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        this.showToast(`🎉 Правильно! +${quest.rewardCoins} Монет! Збери золоті 3D-монетки, що вилетіли зі скрині!`);
      } else {
        if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        this.showToast('🤔 Майже! Спробуй інший варіант!');
      }
    }

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
      const cEl = document.getElementById('r3d-coins-val');
      const xEl = document.getElementById('r3d-xp-val');
      if (window.game && window.game.state) {
        if (cEl) cEl.textContent = window.game.state.coins || 0;
        if (xEl) xEl.textContent = window.game.state.xp || 0;
      }
    }

    showToast(msg) {
      const t = document.getElementById('r3d-toast');
      if (!t) return;
      t.textContent = msg;
      t.style.display = 'block';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        t.style.display = 'none';
      }, 3800);
    }

    // ------------------------------------------------------------------------
    // ПЕРЕМИКАЧ КАМЕРИ (1-ША ОСОБА / 3-ТЯ ОСОБА ROBLOX) ТА ДІЇ
    // ------------------------------------------------------------------------
    toggleCameraMode() {
      this.cameraMode = (this.cameraMode === 'first') ? 'third' : 'first';
      const btn = document.getElementById('r3d-cam-toggle-btn');
      if (btn) {
        btn.textContent = this.cameraMode === 'first' ? '👁️ Вигляд: 1-ша особа' : '🎥 Вигляд: 3-тя особа (Roblox)';
      }
      if (this.danika3D) this.danika3D.visible = (this.cameraMode === 'third');
      if (this.fpGroup) this.fpGroup.visible = (this.cameraMode === 'first');
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    teleportToOtherRoom() {
      this.doorOpen = true;
      if (this.player.z > -6) {
        this.player.x = 0;
        this.player.y = 0;
        this.player.z = -10.5;
        this.player.yaw = 0;
        this.showToast('🚪 Ти перейшла у Кімнату 2: Школа Бруно, RPG-Скриня та Паркур Obby!');
      } else {
        this.player.x = 0;
        this.player.y = 0;
        this.player.z = 2.5;
        this.player.yaw = Math.PI;
        this.showToast('🏠 Ти повернулася у Кімнату 1: Вітальня та Кухня!');
      }
    }

    jump() {
      if (this.player.onGround) {
        this.player.vy = 6.6;
        this.player.onGround = false;
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
      }
    }

    useOrInteract() {
      // Анімація помаху правою рукою
      this._handSwingTimer = 0.35;

      if (this.nearestInteractable) {
        this.nearestInteractable.onInteract();
        return;
      }

      // Якщо нічого поруч немає, використовуємо предмет у руці!
      const item = this.player.heldItem;
      if (item === 'wand') {
        const fxX = this.player.x - Math.sin(this.player.yaw) * 1.6;
        const fxZ = this.player.z - Math.cos(this.player.yaw) * 1.6;
        this.spawn3DBurst(fxX, this.player.y + 1.3, fxZ, 0xfef08a);
        if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
        this.showToast('🪄 Вжух! Чарівна паличка випустила магічні 3D-зірочки!');
      } else if (item === 'pizza' || item === 'cupcake') {
        this.awardXP(5);
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
        this.showToast('😋 Ням-ням! Дуже смачно! (+5 XP)');
      } else if (item === 'bone') {
        this.commandBrunoFlip();
        this.showToast('🦴 Бруно побачив кісточку у твоїй руці та зробив сальто!');
      }
    }

    triggerNearestInteract() {
      if (this.nearestInteractable) {
        this.nearestInteractable.onInteract();
      }
    }

    // ------------------------------------------------------------------------
    // ОБРОБНИКИ КЛАВІАТУРИ, МИШІ ТА СЕНСОРНОГО ДЖОЙСТИКА
    // ------------------------------------------------------------------------
    bindControls() {
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        this.keys[e.code] = true;
        if (e.code === 'Space') {
          e.preventDefault();
          this.jump();
        } else if (e.code === 'KeyE' || e.code === 'Enter') {
          this.useOrInteract();
        } else if (e.code === 'KeyV') {
          this.toggleCameraMode();
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });

      // Огляд мишкою на ПК (при затиснутій кнопці миші на канвасі)
      const host = document.getElementById('r3d-canvas-host');
      if (host) {
        host.addEventListener('mousedown', (e) => {
          this.isMouseLooking = true;
          this.lastLookX = e.clientX;
          this.lastLookY = e.clientY;
        });
        window.addEventListener('mouseup', () => {
          this.isMouseLooking = false;
        });
        window.addEventListener('mousemove', (e) => {
          if (!this.isOpen || !this.isMouseLooking) return;
          const dx = e.clientX - this.lastLookX;
          const dy = e.clientY - this.lastLookY;
          this.lastLookX = e.clientX;
          this.lastLookY = e.clientY;
          this.player.yaw -= dx * 0.0055;
          this.player.pitch = Math.max(-1.05, Math.min(1.05, this.player.pitch - dy * 0.005));
        });

        // Сенсорний огляд пальцем по правій частині екрана
        host.addEventListener('touchstart', (e) => {
          for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (this.lookTouchId === null) {
              this.lookTouchId = t.identifier;
              this.lastLookX = t.clientX;
              this.lastLookY = t.clientY;
            }
          }
        }, { passive: true });

        host.addEventListener('touchmove', (e) => {
          for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier === this.lookTouchId) {
              const dx = t.clientX - this.lastLookX;
              const dy = t.clientY - this.lastLookY;
              this.lastLookX = t.clientX;
              this.lastLookY = t.clientY;
              this.player.yaw -= dx * 0.0065;
              this.player.pitch = Math.max(-1.0, Math.min(1.0, this.player.pitch - dy * 0.0055));
            }
          }
        }, { passive: true });

        host.addEventListener('touchend', (e) => {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.lookTouchId) {
              this.lookTouchId = null;
            }
          }
        });
      }

      // Віртуальний джойстик зліва
      const joyZone = document.getElementById('r3d-joystick-zone');
      const joyKnob = document.getElementById('r3d-joystick-knob');
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

    // ------------------------------------------------------------------------
    // ГОЛОВНИЙ ІГРОВИЙ ЦИКЛ (ФІЗИКА, КОЛІЗІЇ, КАМЕРА, БРУНО, МОНЕТКИ)
    // ------------------------------------------------------------------------
    startLoop() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      if (this.clock) this.clock.getDelta();
      const step = () => {
        if (!this.isOpen) return;
        const dt = Math.min(this.clock ? this.clock.getDelta() : 0.016, 0.05);
        this.updateWorld(dt);
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
        this.animFrameId = requestAnimationFrame(step);
      };
      this.animFrameId = requestAnimationFrame(step);
    }

    updateWorld(dt) {
      // 1. Поворот клавішами Q/E або стрілками вліво/вправо
      if (this.keys['KeyQ'] || this.keys['ArrowLeft']) this.player.yaw += 2.2 * dt;
      if (this.keys['KeyR'] || this.keys['ArrowRight']) this.player.yaw -= 2.2 * dt;

      // 2. Вектор руху вперед/назад та стрейф вліво/вправо
      let moveForward = -this.joyVec.y;
      let moveRight = this.joyVec.x;

      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveForward += 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveForward -= 1;
      if (this.keys['KeyA']) moveRight -= 1;
      if (this.keys['KeyD']) moveRight += 1;

      const speed = 4.6;
      const sinY = Math.sin(this.player.yaw);
      const cosY = Math.cos(this.player.yaw);

      const dx = (-sinY * moveForward + cosY * moveRight) * speed * dt;
      const dz = (-cosY * moveForward - sinY * moveRight) * speed * dt;

      // Перевірка колізій по X та Z (включно з дверима між кімнатами)
      const nextX = this.player.x + dx;
      const nextZ = this.player.z + dz;

      if (!this.checkHorizontalCollision(nextX, this.player.z, this.player.y)) {
        this.player.x = nextX;
      }
      if (!this.checkHorizontalCollision(this.player.x, nextZ, this.player.y)) {
        this.player.z = nextZ;
      }

      // 3. Гравітація, стрибки та платформи (Obby + Диван-Батут)
      this.player.vy -= 17.5 * dt;
      this.player.y += this.player.vy * dt;

      const support = this.getFloorHeightAt(this.player.x, this.player.z, this.player.y);
      if (this.player.y <= support.height) {
        this.player.y = support.height;
        if (support.isTrampoline) {
          this.player.vy = 9.2;
          this.player.onGround = false;
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
        } else {
          this.player.vy = 0;
          this.player.onGround = true;
        }
      }

      // 4. Анімація ходьби (хитання 3D-рук у 1-й особі та ніжок у 3-й особі)
      const isMoving = Math.hypot(moveForward, moveRight) > 0.12;
      if (isMoving && this.player.onGround) {
        this.player.walkCycle += dt * 11;
      } else {
        this.player.walkCycle *= 0.85;
      }

      const swing = Math.sin(this.player.walkCycle) * 0.045;
      if (this.fpLeftHand && this.fpRightHand) {
        this.fpLeftHand.position.y = -0.30 + swing;
        this.fpLeftHand.position.z = -0.55 - swing;
        let useBonus = 0;
        if (this._handSwingTimer > 0) {
          this._handSwingTimer -= dt;
          useBonus = Math.sin(this._handSwingTimer * Math.PI * 3) * 0.16;
        }
        this.fpRightHand.position.y = -0.28 - swing + useBonus;
        this.fpRightHand.position.z = -0.58 + swing - useBonus;
      }

      // Оновлюємо 3D-фігурку Даніки (для 3-ї особи Roblox)
      if (this.danika3D) {
        this.danika3D.position.set(this.player.x, this.player.y, this.player.z);
        this.danika3D.rotation.y = this.player.yaw;
        const legAngle = Math.sin(this.player.walkCycle) * 0.55;
        this.dLeftLeg.rotation.x = legAngle;
        this.dRightLeg.rotation.x = -legAngle;
        this.dLeftArm.rotation.x = -legAngle;
        this.dRightArm.rotation.x = legAngle;
      }

      // 5. Позиція камери (1-ша особа vs 3-тя особа Roblox)
      if (this.cameraMode === 'first') {
        const bob = isMoving && this.player.onGround ? Math.sin(this.player.walkCycle * 2) * 0.035 : 0;
        this.camera.position.set(this.player.x, this.player.y + this.player.height + bob, this.player.z);
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.player.yaw;
        this.camera.rotation.x = this.player.pitch;
      } else {
        const camDist = 3.2;
        const cx = this.player.x + Math.sin(this.player.yaw) * camDist;
        const cz = this.player.z + Math.cos(this.player.yaw) * camDist;
        const cy = this.player.y + 2.35 - this.player.pitch * 1.2;
        this.camera.position.set(cx, Math.max(0.5, cy), cz);
        this.camera.lookAt(this.player.x, this.player.y + 1.35, this.player.z);
      }

      // Індикатор поточної кімнати
      const roomLbl = document.getElementById('r3d-room-indicator');
      if (roomLbl) {
        roomLbl.textContent = this.player.z < -6
          ? '🏫 Кімната 2: Школа Бруно та Паркур Obby'
          : '🏠 Кімната 1: Вітальня і Кухня';
      }

      // 6. Плавна анімація дверей, холодильника, скрині та Кубка Оббі
      const targetDoorAngle = this.doorOpen ? -Math.PI * 0.55 : 0;
      this.doorAngle += (targetDoorAngle - this.doorAngle) * 8 * dt;
      if (this.doorPivot) this.doorPivot.rotation.y = this.doorAngle;

      const targetFridge = this.fridgeOpen ? Math.PI * 0.6 : 0;
      this.fridgeAngle += (targetFridge - this.fridgeAngle) * 8 * dt;
      if (this.fridgeDoorPivot) this.fridgeDoorPivot.rotation.y = this.fridgeAngle;

      if (this.chestLid) {
        this.chestLid.rotation.x += (this.chestOpenAngle - this.chestLid.rotation.x) * 6 * dt;
      }
      if (this.obbyTrophy) {
        this.obbyTrophy.rotation.y += 2.2 * dt;
      }

      // 7. Штучний інтелект 3D-Бруно (біжить за Данікою і виляє хвостиком)
      this.updateBrunoAI(dt);

      // 8. Перевірка найближчого інтерактивного об'єкта у фокусі
      this.updateInteractFocus();

      // 9. Обертання та збір 3D-монеток і частинок
      this.updateCoinsAndParticles(dt);
    }

    checkHorizontalCollision(x, z, y) {
      const r = this.player.radius;
      // Якщо міжкімнатні двері зачинені, блокуємо прохід у дверях (Z = -6)
      if (!this.doorOpen && x > -1.3 && x < 1.3 && z > -6.35 && z < -5.65) {
        return true;
      }
      for (let i = 0; i < this.colliders.length; i++) {
        const c = this.colliders[i];
        if (y + 0.25 < c.maxY) {
          if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) {
            return true;
          }
        }
      }
      return false;
    }

    getFloorHeightAt(x, z, currentY) {
      let maxH = 0;
      let isTrampoline = false;
      const r = this.player.radius * 0.85;
      for (let i = 0; i < this.colliders.length; i++) {
        const c = this.colliders[i];
        if (c.maxY <= 4.0 && currentY >= c.maxY - 0.42) {
          if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) {
            if (c.maxY > maxH) {
              maxH = c.maxY;
              isTrampoline = !!c.isTrampoline;
            }
          }
        }
      }
      return { height: maxH, isTrampoline };
    }

    updateBrunoAI(dt) {
      if (!this.bruno.mesh) return;
      const b = this.bruno;
      b.tailAngle += dt * 14;
      if (this.brunoTail) {
        this.brunoTail.rotation.z = Math.sin(b.tailAngle) * 0.45;
      }

      // Якщо Бруно робить сальто
      if (b.flipTimer > 0) {
        b.flipTimer = Math.max(0, b.flipTimer - dt * 1.4);
        const phase = 1 - b.flipTimer;
        b.mesh.position.y = Math.sin(phase * Math.PI) * 1.35;
        b.mesh.rotation.x = phase * Math.PI * 2;
        if (b.flipTimer === 0) {
          b.mesh.position.y = 0;
          b.mesh.rotation.x = 0;
        }
        return;
      }

      // Плавне слідування за Данікою
      const dx = this.player.x - b.mesh.position.x;
      const dz = this.player.z - b.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 1.75) {
        // Якщо міжкімнатні двері зачинені, Бруно теж відкриває їх носом або чекає
        const step = Math.min(dist - 1.5, 3.6 * dt);
        b.mesh.position.x += (dx / dist) * step;
        b.mesh.position.z += (dz / dist) * step;
        b.mesh.position.y = Math.abs(Math.sin(b.tailAngle * 0.8)) * 0.12;
      } else {
        b.mesh.position.y = 0;
      }
      b.mesh.rotation.y = Math.atan2(-dx, -dz);
    }

    updateInteractFocus() {
      let best = null;
      let bestScore = Infinity;

      const forwardX = -Math.sin(this.player.yaw);
      const forwardZ = -Math.cos(this.player.yaw);

      for (let i = 0; i < this.interactables.length; i++) {
        const it = this.interactables[i];
        const dx = it.x - this.player.x;
        const dz = it.z - this.player.z;
        const dist = Math.hypot(dx, dz);
        if (dist <= it.radius) {
          // Перевіряємо кут погляду
          const dot = (dx * forwardX + dz * forwardZ) / (dist || 1);
          if (dot > 0.25) {
            const score = dist * (1.5 - dot);
            if (score < bestScore) {
              bestScore = score;
              best = it;
            }
          }
        }
      }

      this.nearestInteractable = best;
      const promptEl = document.getElementById('r3d-interact-prompt');
      const crossEl = document.getElementById('r3d-crosshair');
      if (best) {
        if (promptEl) {
          promptEl.style.display = 'flex';
          document.getElementById('r3d-interact-icon').textContent = best.icon || '🖐️';
          document.getElementById('r3d-interact-text').textContent = best.label;
        }
        if (crossEl) crossEl.classList.add('target-active');
      } else {
        if (promptEl) promptEl.style.display = 'none';
        if (crossEl) crossEl.classList.remove('target-active');
      }
    }

    updateCoinsAndParticles(dt) {
      const time = performance.now() * 0.003;
      for (let i = this.collectibleCoins.length - 1; i >= 0; i--) {
        const c = this.collectibleCoins[i];
        c.mesh.rotation.x += 3.0 * dt;
        c.mesh.position.y = c.baseY + Math.sin(time + i) * 0.12;

        const dist = Math.hypot(c.mesh.position.x - this.player.x, c.mesh.position.z - this.player.z);
        const dy = Math.abs(c.mesh.position.y - (this.player.y + 0.7));
        if (dist < 0.95 && dy < 1.3) {
          this.scene.remove(c.mesh);
          this.collectibleCoins.splice(i, 1);
          this.awardCoins(5);
          this.spawn3DBurst(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z, 0xfacc15);
          if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
          else if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
          this.showToast('🪙 +5 Золотих монеток зібрано!');
        }
      }

      for (let i = this.particles3D.length - 1; i >= 0; i--) {
        const p = this.particles3D[i];
        p.life -= dt;
        p.vy -= 9.8 * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.mesh.rotation.x += 5 * dt;
        p.mesh.rotation.y += 5 * dt;
        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          this.particles3D.splice(i, 1);
        }
      }
    }

    onResize() {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  window.roblox3D = new DanikaRoblox3DWorld();
})();
