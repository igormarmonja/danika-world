// ============================================================================
// DANIKA & BRUNO: CARTOON 3D WORLD (PIXAR / NINTENDO SWITCH / TOON RPG STYLE)
// Деталізовані округлі 3D-моделі Даніки та песика Бруно за їхніми ілюстраціями,
// пухкі мультяшні меблі, панорама моря та маяка Гандії за вікном,
// паркур по пухнастих 3D-хмаринках та Інкубатор 3D-улюбленців!
// ============================================================================

(function () {
  class DanikaRoblox3DWorld {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      // За замовчуванням відкриваємо 3-тю особу, щоб одразу було видно красуню 3D-Даніку та Бруно,
      // з миттєвим перемиканням у 1-шу особу кнопкою 👁️!
      this.cameraMode = 'third';
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = null;
      this.animFrameId = null;

      this.player = {
        x: 0,
        y: 0,
        z: 3.8,
        vx: 0,
        vy: 0,
        vz: 0,
        yaw: 0,
        pitch: -0.12,
        height: 1.65,
        radius: 0.42,
        onGround: true,
        walkCycle: 0,
        heldItem: 'wand', // 'wand', 'bone', 'pizza', 'cupcake', 'none'
        outfitStyle: 0,   // 0 = Фірмова біла футболка-поло та сині шорти Даніки, 1 = Рожева сукня принцеси, 2 = Небесна фея, 3 = Смарагдовий стиль
        hasCrown: true,
        hasWings: false
      };

      this.bruno = {
        mesh: null,
        x: 1.35,
        y: 0,
        z: 3.1,
        tailAngle: 0,
        flipTimer: 0
      };

      // Додаткові 3D-улюбленці з Інкубатора (бігають за Данікою разом із Бруно!)
      this.extraPets = [];
      this.hatchedPetCount = 0;

      this.keys = {};
      this.joyVec = { x: 0, y: 0 };
      this.lookTouchId = null;
      this.lastLookX = 0;
      this.lastLookY = 0;
      this.isMouseLooking = false;

      this.colliders = [];
      this.interactables = [];
      this.nearestInteractable = null;
      this.collectibleCoins = [];
      this.particles3D = [];
      this.floatingClouds = [];

      this.doorOpen = false;
      this.doorAngle = 0;
      this.fridgeOpen = false;
      this.fridgeAngle = 0;
      this.tvChannel = 0;
      this.discoMode = false;
      this.discoLights = [];
      this.chestLid = null;
      this.chestOpenAngle = 0;
      this.globeMesh = null;
      this.eggMesh = null;

      this.rpgQuests = [
        {
          q: '🏫 Урок Математики Вчительки Даніки: У Бруно було 5 золотих кісточок, і він знайшов ще 4. Скільки всього?',
          options: ['9 кісточок 🦴', '8 кісточок', '10 кісточок'],
          correct: 0,
          rewardCoins: 15
        },
        {
          q: '🇪🇸 Іспанська в Гандії: Як іспанською сказати «Привіт, друже!»?',
          options: ['¡Buenas noches! 🌙', '¡Hola, amigo! ☀️', '¡Muchas gracias! 🌸'],
          correct: 1,
          rewardCoins: 15
        },
        {
          q: '🔬 Цікава Наука: Завдяки чому ми не літаємо в повітрі, а стоїмо на Землі?',
          options: ['Сила тяжіння (Гравітація) 🌍', 'Вітер 💨', 'Сонячне світло ☀️'],
          correct: 0,
          rewardCoins: 15
        },
        {
          q: '🇬🇧 English Class: Як англійською мовою буде «Щасливе цуценя»?',
          options: ['Happy Puppy 🐶', 'Magic Castle 🏰', 'Golden Star ⭐'],
          correct: 0,
          rewardCoins: 15
        },
        {
          q: '🧮 Загадка Скрині: Скільки буде 6 + 6?',
          options: ['10', '12 🌟', '14'],
          correct: 1,
          rewardCoins: 20
        }
      ];
      this.currentQuestIdx = 0;
    }

    // ------------------------------------------------------------------------
    // ВІДКРИТТЯ / ЗАКРИТТЯ 3D СВІТУ
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
    // UI ІНТЕРФЕЙС 3D-СВІТУ
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
            background: #1e1b4b;
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
          #r3d-crosshair {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            border: 2.5px solid rgba(255,255,255,0.9);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            pointer-events: none;
            z-index: 10;
            transition: transform 0.15s, border-color 0.15s, background 0.15s;
          }
          #r3d-crosshair.target-active {
            transform: translate(-50%, -50%) scale(1.7);
            border-color: #fde047;
            background: rgba(253, 224, 71, 0.35);
          }
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
            background: rgba(15, 23, 42, 0.80);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.35);
            color: #fff;
            padding: 7px 14px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 0.92rem;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.35);
          }
          .r3d-btn {
            cursor: pointer;
            transition: transform 0.12s, filter 0.15s;
          }
          .r3d-btn:hover {
            filter: brightness(1.08);
          }
          .r3d-btn:active {
            transform: scale(0.93);
          }
          .r3d-btn-primary {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border-color: #fbcfe8;
          }
          .r3d-btn-cam {
            background: linear-gradient(135deg, #0ea5e9, #2563eb);
            border-color: #bae6fd;
          }
          .r3d-btn-exit {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-color: #fecaca;
          }
          #r3d-interact-prompt {
            position: absolute;
            bottom: 132px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            color: #fff;
            border: 3px solid #fff;
            border-radius: 24px;
            padding: 10px 22px;
            font-weight: 900;
            font-size: 1.02rem;
            box-shadow: 0 10px 28px rgba(234, 88, 12, 0.55);
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
          .r3d-hotbar {
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 7px;
            background: rgba(15, 23, 42, 0.82);
            backdrop-filter: blur(10px);
            padding: 6px 10px;
            border-radius: 20px;
            border: 2px solid rgba(255,255,255,0.28);
            z-index: 20;
            box-shadow: 0 8px 24px rgba(0,0,0,0.45);
          }
          .r3d-slot {
            width: 52px;
            height: 52px;
            border-radius: 14px;
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
          #r3d-joystick-zone {
            position: absolute;
            bottom: 24px;
            left: 22px;
            width: 126px;
            height: 126px;
            border-radius: 50%;
            background: rgba(255,255,255,0.16);
            border: 2.5px solid rgba(255,255,255,0.42);
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
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #ec4899, #db2777);
            font-size: 0.7rem;
          }
          #r3d-toast {
            position: absolute;
            top: 66px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.92);
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

        <div id="r3d-canvas-host"></div>
        <div id="r3d-crosshair"></div>

        <div class="r3d-top-bar">
          <div class="r3d-top-group">
            <div class="r3d-pill" style="background:linear-gradient(135deg,#ec4899,#8b5cf6); border-color:#fff;">
              🌟 <span>Даніка 3D World</span>
            </div>
            <div class="r3d-pill">
              🪙 <span id="r3d-coins-val">30</span>
            </div>
            <div class="r3d-pill">
              ⭐ <span id="r3d-xp-val">140</span> XP
            </div>
            <div class="r3d-pill" id="r3d-room-indicator">
              🏠 Кімната 1: Затишна Вітальня
            </div>
          </div>

          <div class="r3d-top-group">
            <button class="r3d-pill r3d-btn r3d-btn-cam" id="r3d-cam-toggle-btn" onclick="window.roblox3D.toggleCameraMode()">
              🎥 Вигляд: 3-тя особа (Даніка)
            </button>
            <button class="r3d-pill r3d-btn r3d-btn-primary" onclick="window.roblox3D.teleportToOtherRoom()">
              🚪 В іншу кімнату
            </button>
            <button class="r3d-pill r3d-btn r3d-btn-exit" onclick="window.roblox3D.close()">
              ✕ У 2D Світ
            </button>
          </div>
        </div>

        <div id="r3d-toast">✨ Ласкаво просимо в Мультяшний 3D-Світ Даніки та Бруно!</div>

        <button id="r3d-interact-prompt" onclick="window.roblox3D.triggerNearestInteract()">
          <span id="r3d-interact-icon">🖐️</span>
          <span id="r3d-interact-text">Взаємодіяти</span>
        </button>

        <div id="r3d-joystick-zone">
          <div id="r3d-joystick-knob"></div>
        </div>

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
            <span>🧁</span><span class="lbl">Тортик</span>
          </div>
          <div class="r3d-slot" id="r3d-slot-none" onclick="window.roblox3D.equipItem('none')">
            <span>✋</span><span class="lbl">Ручки</span>
          </div>
        </div>

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

        <div id="r3d-quest-modal">
          <div class="r3d-quest-card">
            <div style="font-size:2.4rem; margin-bottom:4px;">🎁✨</div>
            <h3 style="margin:0 0 8px; font-size:1.25rem; font-family:'Fredoka',cursive;">Чарівна Скриня Знань Даніки та Бруно</h3>
            <p id="r3d-quest-question" style="font-weight:800; font-size:1.02rem; margin-bottom:14px; line-height:1.4;"></p>
            <div id="r3d-quest-options"></div>
            <button onclick="document.getElementById('r3d-quest-modal').style.display='none'" style="margin-top:10px; background:transparent; border:none; color:#92400e; font-weight:800; cursor:pointer;">Закрити</button>
          </div>
        </div>

        <div id="r3d-loading-banner" style="position:absolute; inset:0; background:#1e1b4b; color:#fff; display:none; align-items:center; justify-content:center; font-size:1.3rem; font-weight:900; z-index:80;">
          🚀 Будуємо Мультяшний 3D-Світ Даніки та Бруно...
        </div>
      `;
      document.body.appendChild(wrap);
      this.bindControls();
    }

    // ------------------------------------------------------------------------
    // ХУДОЖНІ ТЕКСТУРИ ВИСОКОЇ ЧІТКОСТІ (ПАРКЕТ, ШПАЛЕРИ, КАРТИНИ, ЕКРАНИ)
    // ------------------------------------------------------------------------
    makeWoodParquetTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#e6aa68';
      ctx.fillRect(0, 0, 512, 512);

      const rows = 8;
      const h = 512 / rows;
      for (let r = 0; r < rows; r++) {
        const y = r * h;
        const offset = (r % 2) * 128;
        for (let col = -1; col < 4; col++) {
          const x = col * 170 + offset;
          const tones = ['#eab376', '#df9f5d', '#e5a967', '#d89551'];
          ctx.fillStyle = tones[(r + col + 4) % tones.length];
          ctx.fillRect(x + 2, y + 2, 166, h - 4);

          // М'які волокна дерева
          ctx.strokeStyle = 'rgba(139, 79, 28, 0.14)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 12, y + h * 0.35);
          ctx.bezierCurveTo(x + 60, y + h * 0.2, x + 110, y + h * 0.5, x + 155, y + h * 0.35);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(120, 64, 18, 0.28)';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x + 1, y + 1, 168, h - 2);
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(5, 9);
      return tex;
    }

    makeCozyWallpaperTexture(topColor, bottomColor, accentColor) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 512;
      const ctx = c.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 0, 380);
      grad.addColorStop(0, topColor);
      grad.addColorStop(1, bottomColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 380);

      // Ніжні візерунки-зірочки та хмаринки на шпалерах
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let y = 35; y < 340; y += 64) {
        for (let x = 32; x < 256; x += 64) {
          const sx = x + ((y / 64) % 2 === 0 ? 0 : 32);
          ctx.beginPath();
          ctx.arc(sx, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Біла дерев'яна панель wainscotting унизу стіни
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 380, 256, 132);
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 372, 256, 10);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      for (let x = 16; x < 256; x += 64) {
        ctx.strokeRect(x, 394, 48, 96);
      }
      // Плінтус
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 498, 256, 14);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(6, 1);
      return tex;
    }

    makeRugTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fdf2f8';
      ctx.fillRect(0, 0, 512, 512);

      const rings = ['#fbcfe8', '#f472b6', '#fdf2f8', '#c084fc', '#fef08a'];
      rings.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(256, 256, 250 - i * 42, 0, Math.PI * 2);
        ctx.fill();
      });

      // Зірка в центрі килима
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐', 256, 260);
      return new THREE.CanvasTexture(c);
    }

    makeTVScreenTexture(channelIdx) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 288;
      const ctx = c.getContext('2d');
      const channels = [
        { bg1: '#0284c7', bg2: '#7dd3fc', title: '🐾 ПРИГОДИ ДАНІКИ І БРУНО В ГАНДІЇ', emoji: '👧🏼🐶🏖️☀️' },
        { bg1: '#9333ea', bg2: '#f472b6', title: '🌈 ХМАРНИЙ ПАРКУР ЧЕМПІОНІВ!', emoji: '☁️🏆🧚‍♀️✨' },
        { bg1: '#0f172a', bg2: '#312e81', title: '🪐 КОСМІЧНА АКАДЕМІЯ НАУК', emoji: '🚀🌍🔭⭐' }
      ];
      const ch = channels[channelIdx % channels.length];
      const grad = ctx.createLinearGradient(0, 0, 0, 288);
      grad.addColorStop(0, ch.bg1);
      grad.addColorStop(1, ch.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 288);

      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(256, 160, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ch.title, 256, 62);
      ctx.font = '72px sans-serif';
      ctx.fillText(ch.emoji, 256, 185);
      return new THREE.CanvasTexture(c);
    }

    makeChalkboardTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 280;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 512, 280);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 18;
      ctx.strokeRect(0, 0, 512, 280);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👩‍🏫 АКАДЕМІЯ ВЧИТЕЛЬКИ ДАНІКИ', 256, 56);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('5 + 4 = 9 🦴   |   ¡Hola, Amigo! 🇪🇸', 256, 125);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Натисни 🖐️ щоб провести урок (+15 🪙)', 256, 205);
      return new THREE.CanvasTexture(c);
    }

    makeWallPaintingTexture(theme) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      if (theme === 'gandia') {
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, '#38bdf8');
        g.addColorStop(0.6, '#bae6fd');
        g.addColorStop(0.61, '#0284c7');
        g.addColorStop(0.82, '#fde68a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);
        ctx.font = '70px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌴🏖️⛵', 128, 165);
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, '#fdf4ff');
        g.addColorStop(1, '#fbcfe8');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);
        ctx.font = '70px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑🐶💖', 128, 155);
      }
      return new THREE.CanvasTexture(c);
    }

    // ------------------------------------------------------------------------
    // ІНІЦІАЛІЗАЦІЯ СЦЕНИ ТА ОСВІТЛЕННЯ (PIXAR / NINTENDO TOON SHADING)
    // ------------------------------------------------------------------------
    initThreeWorld() {
      const host = document.getElementById('r3d-canvas-host');
      if (!host) return;
      host.innerHTML = '';

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x7dd3fc);
      this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.015);

      this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 90);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }
      host.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();
      this.colliders = [];
      this.interactables = [];
      this.collectibleCoins = [];
      this.extraPets = [];
      this.floatingClouds = [];

      // М'яке тепле освітлення як у мультфільмах Pixar
      const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0xfde68a, 0.78);
      hemiLight.position.set(0, 15, 0);
      this.scene.add(hemiLight);

      const sunLight = new THREE.DirectionalLight(0xfff7ed, 0.85);
      sunLight.position.set(-12, 18, 8);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      this.scene.add(sunLight);

      // Теплі стельові світильники у двох кімнатах
      const warm1 = new THREE.PointLight(0xffedd5, 0.65, 16);
      warm1.position.set(0, 4.4, 0);
      const warm2 = new THREE.PointLight(0xffedd5, 0.65, 16);
      warm2.position.set(0, 4.4, -12);
      this.scene.add(warm1, warm2);

      // Диско-прожектори
      const disco1 = new THREE.PointLight(0xff007f, 0, 14);
      disco1.position.set(-2.5, 4.0, 0);
      const disco2 = new THREE.PointLight(0x00f0ff, 0, 14);
      disco2.position.set(2.5, 4.0, 0);
      this.scene.add(disco1, disco2);
      this.discoLights = [disco1, disco2];

      // 1. Будуємо архітектуру 2 просторих кімнат + Пейзаж Гандії з морем та маяком за вікном
      this.buildRoomsAndGandiaVista();

      // 2. Будуємо деталізовані мультяшні меблі Кімнати 1 (Диван-хмаринка, Ліжко з балдахіном, Ретро-холодильник Smeg, Кінотеатр, Лежак Бруно)
      this.buildDetailedRoom1();

      // 3. Будуємо Кімнату 2 (Школа Вчительки Даніки, Скриня Скарбів, Подіум Принцеси, Інкубатор Улюбленців та Хмарний Паркур)
      this.buildDetailedRoom2();

      // 4. Будуємо деталізовану мультяшну 3D-Даніку (100% за образом з картинки!) + 3D-ручки від першої особи
      this.buildSculptedDanika3D();

      // 5. Будуємо деталізованого мультяшного 3D-Бруно (за образом з картинки!)
      this.buildSculptedBruno3D();

      // 6. Розкладаємо сяючі золоті монетки з зірочками
      this.spawnRoomCoins();

      window.addEventListener('resize', () => this.onResize());
      this.isInitialized = true;
      this.showToast('🌟 Подивись на нову 3D-Даніку, 3D-Бруно, море з маяком за вікном та Хмарний Паркур!');
    }

    toonMat(hexColor, roughness = 0.45, metalness = 0.05) {
      return new THREE.MeshStandardMaterial({
        color: hexColor,
        roughness: roughness,
        metalness: metalness
      });
    }

    addBoxCollider(minX, maxX, minZ, maxZ, maxY, isTrampoline = false) {
      this.colliders.push({ minX, maxX, minZ, maxZ, maxY, isTrampoline });
    }

    // ------------------------------------------------------------------------
    // АРХІТЕКТУРА КІМНАТ + 3D ПЕЙЗАЖ МОРЯ ТА МАЯКА ГАНДІЇ ЗА ВІКНОМ
    // ------------------------------------------------------------------------
    buildRoomsAndGandiaVista() {
      const parquetTex = this.makeWoodParquetTexture();
      const wallTex1 = this.makeCozyWallpaperTexture('#ffe4e6', '#fff1f2', '#f43f5e');
      const wallTex2 = this.makeCozyWallpaperTexture('#e0f2fe', '#f0f9ff', '#0284c7');

      // Підлога на обидві кімнати (X: -6.5..6.5, Z: -19..6.5)
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 25.5),
        new THREE.MeshStandardMaterial({ map: parquetTex, roughness: 0.35 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, -6.25);
      floor.receiveShadow = true;
      this.scene.add(floor);

      // Стеля з красивими круглими 3D-люстрами
      const ceil = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 25.5),
        new THREE.MeshBasicMaterial({ color: 0xfffbeb, side: THREE.DoubleSide })
      );
      ceil.rotation.x = Math.PI / 2;
      ceil.position.set(0, 5.4, -6.25);
      this.scene.add(ceil);

      [0, -12].forEach(zPos => {
        const chandelier = new THREE.Group();
        chandelier.position.set(0, 5.15, zPos);
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.55, 0.14, 24), this.toonMat(0xfacc15, 0.3, 0.4));
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
        dome.position.y = -0.15;
        chandelier.add(plate, dome);
        this.scene.add(chandelier);
      });

      const wallH = 5.4;
      const wallMat1 = new THREE.MeshStandardMaterial({ map: wallTex1, roughness: 0.7 });
      const wallMat2 = new THREE.MeshStandardMaterial({ map: wallTex2, roughness: 0.7 });

      // Задня стіна Кімнати 1 (Z = +6.5)
      const wBack1 = new THREE.Mesh(new THREE.BoxGeometry(13, wallH, 0.3), wallMat1);
      wBack1.position.set(0, wallH / 2, 6.5);
      this.scene.add(wBack1);
      this.addBoxCollider(-6.6, 6.6, 6.15, 6.8, wallH);

      // Права стіна Кімнати 1 (X = +6.5) та Кімнати 2
      const wRight1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 13), wallMat1);
      wRight1.position.set(6.5, wallH / 2, 0);
      const wRight2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12.5), wallMat2);
      wRight2.position.set(6.5, wallH / 2, -12.75);
      this.scene.add(wRight1, wRight2);
      this.addBoxCollider(6.15, 6.8, -19.2, 6.6, wallH);

      // Ліва стіна Кімнати 1 з ВЕЛИКИМ ПАНОРАМНИМ ВІКНОМ НА МОРЕ (X = -6.5)
      // Нижня частина під вікном
      const wLeftBottom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 13), wallMat1);
      wLeftBottom.position.set(-6.5, 0.55, 0);
      // Верхня частина над вікном
      const wLeftTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 13), wallMat1);
      wLeftTop.position.set(-6.5, 4.85, 0);
      // Бічні колони вікна
      const wLeftCol1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 3.5), wallMat1);
      wLeftCol1.position.set(-6.5, 2.7, 4.75);
      const wLeftCol2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 3.5), wallMat1);
      wLeftCol2.position.set(-6.5, 2.7, -4.75);
      this.scene.add(wLeftBottom, wLeftTop, wLeftCol1, wLeftCol2);

      // Біла рама панорамного вікна та рожеві об'ємні штори з боків
      const frameMat = this.toonMat(0xffffff, 0.3);
      const sill = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 6.4), frameMat);
      sill.position.set(-6.4, 1.12, 0);
      const mullion = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 12), frameMat);
      mullion.position.set(-6.45, 2.7, 0);
      this.scene.add(sill, mullion);

      // Пухкі мультяшні штори з боків вікна
      const curtainMat = this.toonMat(0xf472b6, 0.5);
      [-2.9, 2.9].forEach(zPos => {
        const curtain = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 3.35, 16), curtainMat);
        curtain.position.set(-6.25, 2.7, zPos);
        const tie = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 10, 20), this.toonMat(0xfacc15));
        tie.rotation.x = Math.PI / 2;
        tie.position.set(-6.25, 2.2, zPos);
        this.scene.add(curtain, tie);
      });

      // Ліва стіна Кімнати 2 та Дальня стіна Кімнати 2
      const wLeft2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 12.5), wallMat2);
      wLeft2.position.set(-6.5, wallH / 2, -12.75);
      const wFar2 = new THREE.Mesh(new THREE.BoxGeometry(13, wallH, 0.3), wallMat2);
      wFar2.position.set(0, wallH / 2, -19);
      this.scene.add(wLeft2, wFar2);
      this.addBoxCollider(-6.8, -6.15, -19.2, 6.6, wallH);
      this.addBoxCollider(-6.6, 6.6, -19.3, -18.65, wallH);

      // Картини у золотих рамах на стінах
      this.addFramedPainting(3.6, 2.9, 6.32, Math.PI, 'gandia');
      this.addFramedPainting(-3.6, 2.9, 6.32, Math.PI, 'bruno');

      // Міжкімнатна стіна з арковим дверним прорізом (Z = -6.2)
      const partL = new THREE.Mesh(new THREE.BoxGeometry(5.1, wallH, 0.34), wallMat1);
      partL.position.set(-3.95, wallH / 2, -6.2);
      const partR = new THREE.Mesh(new THREE.BoxGeometry(5.1, wallH, 0.34), wallMat1);
      partR.position.set(3.95, wallH / 2, -6.2);
      const partTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.9, 0.34), wallMat1);
      partTop.position.set(0, wallH - 0.95, -6.2);
      this.scene.add(partL, partR, partTop);

      this.addBoxCollider(-6.5, -1.35, -6.45, -5.95, wallH);
      this.addBoxCollider(1.35, 6.5, -6.45, -5.95, wallH);

      // Красиві різьблені двері з круглим віконцем-ілюмінатором
      this.doorPivot = new THREE.Group();
      this.doorPivot.position.set(-1.35, 0, -6.2);
      const doorBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 3.45, 0.16),
        this.toonMat(0xf59e0b, 0.4)
      );
      doorBody.position.set(1.35, 1.725, 0);

      const doorWindow = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.07, 12, 24),
        this.toonMat(0xfef08a, 0.3, 0.3)
      );
      doorWindow.position.set(1.35, 2.35, 0.09);

      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), this.toonMat(0xfde047, 0.2, 0.6));
      knob.position.set(2.35, 1.65, 0.16);
      const knob2 = knob.clone();
      knob2.position.z = -0.16;

      this.doorPivot.add(doorBody, doorWindow, knob, knob2);
      this.scene.add(this.doorPivot);

      this.interactables.push({
        id: 'room_door',
        mesh: doorBody,
        x: 0,
        y: 1.6,
        z: -6.2,
        radius: 3.0,
        label: 'Двері в Чарівну Академію та Хмарний Паркур',
        icon: '🚪',
        onInteract: () => {
          this.doorOpen = !this.doorOpen;
          if (window.soundFX && window.soundFX.playWhoosh) window.soundFX.playWhoosh();
          this.showToast(this.doorOpen ? '🚪 Двері відкрито! Заходь у Кімнату 2!' : '🚪 Двері зачинено!');
        }
      });

      // ----------------------------------------------------------------------
      // 3D-ПЕЙЗАЖ ЗА ВІКНОМ: МОРЕ ГАНДІЇ, ПІЩАНИЙ ОСТРІВ З ПАЛЬМАМИ ТА МАЯК!
      // ----------------------------------------------------------------------
      const sea = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        this.toonMat(0x0ea5e9, 0.2, 0.1)
      );
      sea.rotation.x = -Math.PI / 2;
      sea.position.set(-26, -0.4, 0);
      this.scene.add(sea);

      // Піщаний острів із маяком (як на картинці з 2D-вікна!)
      const island = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 6.2, 1.4, 24),
        this.toonMat(0xfde68a, 0.6)
      );
      island.position.set(-18, 0.1, -1.5);
      this.scene.add(island);

      // Біло-червоний 3D-Маяк Гандії
      const lighthouse = new THREE.Group();
      lighthouse.position.set(-18, 0.8, -1.5);
      const lhBase = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 3.6, 20), this.toonMat(0xffffff));
      lhBase.position.y = 1.8;
      const lhStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.96, 1.1, 20), this.toonMat(0xef4444));
      lhStripe.position.y = 1.8;
      const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.9, 20), this.toonMat(0xef4444));
      lhRoof.position.y = 4.25;
      const lhLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.6, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lhLamp.position.y = 3.7;
      lighthouse.add(lhBase, lhStripe, lhRoof, lhLamp);
      this.scene.add(lighthouse);

      // 3D-Пальма біля маяка
      const palmTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.6, 12), this.toonMat(0xb45309));
      palmTrunk.position.set(-15.8, 1.8, 1.2);
      palmTrunk.rotation.z = -0.18;
      this.scene.add(palmTrunk);
      for (let a = 0; a < 5; a++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 8), this.toonMat(0x22c55e));
        leaf.scale.set(1.8, 0.25, 0.6);
        leaf.position.set(-15.5 + Math.cos(a * 1.25) * 0.8, 3.1, 1.2 + Math.sin(a * 1.25) * 0.8);
        leaf.rotation.y = -a * 1.25;
        this.scene.add(leaf);
      }

      // Пухнасті 3D-хмаринки в небі за вікном
      [-4, 2, -9].forEach((zC, idx) => {
        const cl = this.createFluffyCloudMesh(0xffffff, 1.3);
        cl.position.set(-16 - idx * 3, 4.5 + (idx % 2) * 0.9, zC);
        this.scene.add(cl);
        this.floatingClouds.push({ mesh: cl, baseZ: zC, speed: 0.4 + idx * 0.15 });
      });
    }

    addFramedPainting(x, y, z, rotY, theme) {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.rotation.y = rotY;
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.75, 0.08), this.toonMat(0xd97706, 0.35));
      const art = new THREE.Mesh(
        new THREE.PlaneGeometry(1.52, 1.52),
        new THREE.MeshBasicMaterial({ map: this.makeWallPaintingTexture(theme) })
      );
      art.position.z = 0.05;
      g.add(frame, art);
      this.scene.add(g);
    }

    // Пухнаста 3D-хмаринка, зібрана з м'яких сфер (жодних кубиків!)
    createFluffyCloudMesh(hexColor = 0xffffff, scale = 1.0) {
      const g = new THREE.Group();
      const mat = this.toonMat(hexColor, 0.35, 0.02);
      const puffs = [
        { x: 0, y: 0, z: 0, r: 0.62 },
        { x: -0.52, y: -0.06, z: 0.08, r: 0.48 },
        { x: 0.52, y: -0.06, z: -0.05, r: 0.48 },
        { x: -0.25, y: 0.16, z: -0.22, r: 0.46 },
        { x: 0.26, y: 0.18, z: 0.22, r: 0.46 }
      ];
      puffs.forEach(p => {
        const sp = new THREE.Mesh(new THREE.SphereGeometry(p.r, 18, 16), mat);
        sp.scale.y = 0.65;
        sp.position.set(p.x, p.y, p.z);
        g.add(sp);
      });
      g.scale.setScalar(scale);
      return g;
    }

    // ------------------------------------------------------------------------
    // КІМНАТА 1: ДЕТАЛІЗОВАНІ МУЛЬТЯШНІ МЕБЛІ (ДИВАН-ХМАРИНКА, ЛІЖКО ПРИНЦЕСИ, SMEG-ХОЛОДИЛЬНИК)
    // ------------------------------------------------------------------------
    buildDetailedRoom1() {
      // 1. Круглий килим із зіркою в центрі кімнати
      const rug = new THREE.Mesh(
        new THREE.CylinderGeometry(2.7, 2.7, 0.03, 40),
        new THREE.MeshStandardMaterial({ map: this.makeRugTexture(), roughness: 0.8 })
      );
      rug.position.set(0, 0.02, 0.6);
      this.scene.add(rug);

      // 2. ПУХКИЙ МУЛЬТЯШНИЙ ДИВАН-БАТУТ (із круглими підлокітниками та подушками!)
      const sofaGroup = new THREE.Group();
      sofaGroup.position.set(-4.1, 0, 0.5);
      const velvetMat = this.toonMat(0xa855f7, 0.4);
      const pinkPillowMat = this.toonMat(0xf472b6, 0.4);
      const yellowPillowMat = this.toonMat(0xfde047, 0.4);

      // Округла основа дивана
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.2, 20), velvetMat);
      seat.rotation.x = Math.PI / 2;
      seat.scale.set(0.95, 0.52, 1);
      seat.position.set(0.15, 0.42, 0);

      // Пухка спинка дивана з 3 округлих секцій
      [-1.0, 0, 1.0].forEach(zOff => {
        const backPuff = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 18), velvetMat);
        backPuff.scale.set(0.48, 1.15, 0.85);
        backPuff.position.set(-0.42, 0.88, zOff);
        sofaGroup.add(backPuff);
      });

      // Круглі підлокітники-валики
      [-1.55, 1.55].forEach(zOff => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.35, 16), pinkPillowMat);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(0.05, 0.72, zOff);
        sofaGroup.add(arm);
      });

      // Декоративні подушки на дивані
      [-0.85, 0.85].forEach((zOff, i) => {
        const pil = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), i === 0 ? yellowPillowMat : pinkPillowMat);
        pil.scale.set(0.55, 0.95, 0.95);
        pil.position.set(-0.05, 0.88, zOff);
        sofaGroup.add(pil);
      });

      sofaGroup.add(seat);
      this.scene.add(sofaGroup);
      this.addBoxCollider(-4.9, -3.1, -1.25, 2.25, 0.85, true);

      this.interactables.push({
        id: 'sofa_bounce',
        mesh: sofaGroup,
        x: -4.1,
        y: 0.8,
        z: 0.5,
        radius: 2.6,
        label: 'Пухкий Диван-Батут (Стрибай високо!)',
        icon: '🛋️',
        onInteract: () => {
          this.player.x = -3.9;
          this.player.z = 0.5;
          this.player.y = 1.05;
          this.player.vy = 9.8;
          this.player.onGround = false;
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
          this.showToast('🤸‍♀️ Вжух! Пухкий диван-батут підкинув Даніку в повітря!');
        }
      });

      // 3. КАЗКОВЕ ЛІЖКО ДАНІКИ З ПЛЮШЕВИМ ВЕДМЕДИКОМ (у лівому дальньому кутку Кімнати 1)
      const bedGroup = new THREE.Group();
      bedGroup.position.set(-4.2, 0, 4.4);
      const bedFrameMat = this.toonMat(0xfbcfe8, 0.35);
      const blanketMat = this.toonMat(0xf43f5e, 0.45);
      const sheetMat = this.toonMat(0xffffff, 0.4);

      const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.48, 1.8), sheetMat);
      mattress.position.y = 0.34;
      const blanket = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 1.75, 20), blanketMat);
      blanket.rotation.x = Math.PI / 2;
      blanket.scale.set(1.0, 0.36, 1.02);
      blanket.position.set(0.28, 0.46, 0);

      // Округле узголів'я у формі корони
      const headboard = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.22, 24), bedFrameMat);
      headboard.rotation.z = Math.PI / 2;
      headboard.position.set(-1.15, 0.95, 0);

      // Плюшевий 3D-ведмедик на подушці!
      const teddy = new THREE.Group();
      teddy.position.set(-0.65, 0.78, 0);
      teddy.rotation.y = Math.PI / 2;
      const bearMat = this.toonMat(0xd97706, 0.5);
      const tBody = new THREE.Mesh(new THREE.SphereGeometry(0.20, 16, 16), bearMat);
      const tHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), bearMat);
      tHead.position.y = 0.26;
      const tEarL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), bearMat);
      tEarL.position.set(-0.13, 0.39, 0);
      const tEarR = tEarL.clone();
      tEarR.position.x = 0.13;
      teddy.add(tBody, tHead, tEarL, tEarR);

      bedGroup.add(mattress, blanket, headboard, teddy);
      this.scene.add(bedGroup);
      this.addBoxCollider(-5.5, -2.9, 3.4, 5.4, 0.75, true);

      // 4. КРУГЛИЙ М'ЯКИЙ ЛЕЖАК ПЕСИКА БРУНО + МИСОЧКИ
      const dogBed = new THREE.Group();
      dogBed.position.set(2.3, 0, 4.8);
      const bedRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.18, 16, 28), this.toonMat(0x0ea5e9, 0.45));
      bedRing.rotation.x = Math.PI / 2;
      bedRing.position.y = 0.16;
      const bedPad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.12, 24), this.toonMat(0xfef08a, 0.5));
      bedPad.position.y = 0.08;
      dogBed.add(bedRing, bedPad);
      this.scene.add(dogBed);

      // 5. ДОМАШНІЙ КІНОТЕАТР ІЗ ЗАОКРУГЛЕНОЮ ТУМБОЮ ТА КОЛОНКАМИ
      const tvStand = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.8, 20), this.toonMat(0x92400e, 0.35));
      tvStand.rotation.z = Math.PI / 2;
      tvStand.scale.set(0.65, 1, 0.8);
      tvStand.position.set(0, 0.36, 5.65);

      this.tvScreenMat = new THREE.MeshBasicMaterial({ map: this.makeTVScreenTexture(0) });
      const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.65, 1.55, 0.14), this.toonMat(0x1e293b, 0.2, 0.3));
      tvFrame.position.set(0, 1.65, 5.65);
      const tvDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.48, 1.38), this.tvScreenMat);
      tvDisplay.position.set(0, 1.65, 5.56);
      tvDisplay.rotation.y = Math.PI;
      this.scene.add(tvStand, tvFrame, tvDisplay);
      this.addBoxCollider(-1.5, 1.5, 5.1, 6.1, 1.8);

      this.interactables.push({
        id: 'tv_set',
        mesh: tvFrame,
        x: 0,
        y: 1.5,
        z: 5.5,
        radius: 3.1,
        label: 'Перемкнути мультик на 3D-Телевізорі (+5 XP)',
        icon: '📺',
        onInteract: () => {
          this.tvChannel = (this.tvChannel + 1) % 3;
          this.tvScreenMat.map = this.makeTVScreenTexture(this.tvChannel);
          this.tvScreenMat.needsUpdate = true;
          this.awardXP(5);
          if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
          this.showToast('📺 Увімкнено новий мультик! (+5 XP)');
        }
      });

      // 6. РЕТРО-ХОЛОДИЛЬНИК SMEG (округлий м'ятно-блакитний з полицями та 3D-їжею всередині!)
      const fridgeGroup = new THREE.Group();
      fridgeGroup.position.set(5.3, 0, 2.3);
      const smegMat = this.toonMat(0x38bdf8, 0.25, 0.15);
      const fBody = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.4, 24), smegMat);
      fBody.position.y = 1.2;
      const fTopCap = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 16), smegMat);
      fTopCap.scale.y = 0.35;
      fTopCap.position.y = 2.4;
      fridgeGroup.add(fBody, fTopCap);
      this.scene.add(fridgeGroup);
      this.addBoxCollider(4.45, 6.2, 1.45, 3.15, 2.6);

      // Округлі дверцята холодильника з хромованою ручкою
      this.fridgeDoorPivot = new THREE.Group();
      this.fridgeDoorPivot.position.set(4.58, 1.2, 2.85);
      const fDoor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.25, 1.15), this.toonMat(0x7dd3fc, 0.2, 0.2));
      fDoor.position.set(0, 0, -0.57);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), this.toonMat(0xfef08a, 0.1, 0.8));
      handle.position.set(-0.12, 0.15, -0.95);
      this.fridgeDoorPivot.add(fDoor, handle);
      this.scene.add(this.fridgeDoorPivot);

      this.interactables.push({
        id: 'fridge_food',
        mesh: fridgeGroup,
        x: 4.8,
        y: 1.3,
        z: 2.3,
        radius: 2.8,
        label: 'Ретро-Холодильник: Взяти 3D-Тортик, Піцу або Кісточку',
        icon: '🧊',
        onInteract: () => {
          this.fridgeOpen = !this.fridgeOpen;
          const foods = ['cupcake', 'pizza', 'bone'];
          const nextFood = foods[Math.floor(Math.random() * foods.length)];
          this.equipItem(nextFood);
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
          const names = {
            pizza: '🍕 Італійську Піцу з пепероні',
            cupcake: '🧁 Полуничний Тортик з вершками',
            bone: '🦴 Смачну Кісточку для Бруно'
          };
          this.showToast(`🧊 Ти взяла з холодильника: ${names[nextFood]}!`);
        }
      });

      // 7. КУХОННИЙ ОСТРІВ З МАРМУРОВОЮ СТІЛЬНИЦЕЮ, ТОРТОМ ТА МУЗИЧНИМ ДИСКО-БУМБОКСОМ
      const islandGroup = new THREE.Group();
      islandGroup.position.set(5.2, 0, -0.8);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.95, 2.8), this.toonMat(0xfde68a, 0.4));
      cab.position.y = 0.475;
      const marbleTop = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 3.0, 20), this.toonMat(0xffffff, 0.15));
      marbleTop.rotation.x = Math.PI / 2;
      marbleTop.scale.set(0.9, 0.14, 1);
      marbleTop.position.y = 0.98;

      // Округлий ретро-бумбокс із двома круглими динаміками
      const boomGroup = new THREE.Group();
      boomGroup.position.set(-0.1, 1.24, -0.4);
      const bBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.88, 16), this.toonMat(0xf43f5e, 0.3));
      bBody.rotation.x = Math.PI / 2;
      [-0.24, 0.24].forEach(zSp => {
        const spk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16), this.toonMat(0x1e293b));
        spk.rotation.z = Math.PI / 2;
        spk.position.set(-0.22, 0, zSp);
        boomGroup.add(spk);
      });
      boomGroup.add(bBody);

      // Деталізований 3D-торт на підставці на кухонному столі
      const cakeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.18, 0.14, 16), this.toonMat(0xfbcfe8));
      cakeStand.position.set(-0.1, 1.12, 0.65);
      const cakeLayer = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.22, 18), this.toonMat(0xfef08a));
      cakeLayer.position.set(-0.1, 1.28, 0.65);
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), this.toonMat(0xef4444));
      berry.position.set(-0.1, 1.43, 0.65);

      islandGroup.add(cab, marbleTop, boomGroup, cakeStand, cakeLayer, berry);
      this.scene.add(islandGroup);
      this.addBoxCollider(4.4, 6.2, -2.3, 0.7, 1.1);

      this.interactables.push({
        id: 'disco_boombox',
        mesh: boomGroup,
        x: 5.0,
        y: 1.25,
        z: -1.2,
        radius: 2.7,
        label: 'Музичний Бумбокс: Увімкнути Диско-Вечірку!',
        icon: '📻',
        onInteract: () => {
          this.discoMode = !this.discoMode;
          this.discoLights.forEach(l => { l.intensity = this.discoMode ? 1.8 : 0; });
          if (this.discoMode) {
            this.commandBrunoFlip();
            this.showToast('🪩 ДИСКО-ВЕЧІРКА! Бруно та всі улюбленці танцюють!');
          } else {
            this.showToast('📻 Диско-світло вимкнено');
          }
        }
      });

      // 8. ВАЗОН ІЗ ПИШНОЮ МОНСТЕРОЮ У КУТКУ КІМНАТИ 1
      this.addPottedPlant(5.3, 5.2);
      this.addPottedPlant(-5.3, -4.8);
    }

    addPottedPlant(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.26, 0.55, 18), this.toonMat(0xea580c, 0.5));
      pot.position.y = 0.28;
      g.add(pot);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 12), this.toonMat(0x16a34a, 0.4));
        leaf.scale.set(1.3, 0.25, 0.75);
        leaf.position.set(Math.cos(angle) * 0.28, 0.65 + (i % 2) * 0.15, Math.sin(angle) * 0.28);
        leaf.rotation.y = -angle;
        leaf.rotation.z = 0.35;
        g.add(leaf);
      }
      this.scene.add(g);
    }

    // ------------------------------------------------------------------------
    // КІМНАТА 2: АКАДЕМІЯ ДАНІКИ, ПІРАТСЬКА СКРИНЯ, ІНКУБАТОР ТВАРИНОК ТА ХМАРНИЙ ПАРКУР
    // ------------------------------------------------------------------------
    buildDetailedRoom2() {
      // 1. ДОШКА ВЧИТЕЛЬКИ ДАНІКИ + СТІЛ ІЗ 3D-ГЛОБУСОМ, ЩО КРУТИТЬСЯ
      const boardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 2.35, 0.16),
        new THREE.MeshBasicMaterial({ map: this.makeChalkboardTexture() })
      );
      boardMesh.position.set(0, 2.45, -18.72);
      this.scene.add(boardMesh);

      // Стіл вчительки та 3D-Глобус Землі
      const desk = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.82, 24), this.toonMat(0xd97706, 0.4));
      desk.position.set(-2.4, 0.41, -16.8);
      this.globeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), this.toonMat(0x0284c7, 0.3));
      this.globeMesh.position.set(-2.4, 1.18, -16.8);
      this.scene.add(desk, this.globeMesh);

      this.interactables.push({
        id: 'teacher_board',
        mesh: boardMesh,
        x: 0,
        y: 2.0,
        z: -18.2,
        radius: 3.6,
        label: 'Провести урок Вчительки Даніки (+15 🪙)',
        icon: '👩‍🏫',
        onInteract: () => this.openRPGQuestModal()
      });

      // 2. КАЗКОВА ОПУКЛА 3D-СКРИНЯ СКАРБІВ З КОРОНОЮ ТА САМОЦВІТАМИ
      const chestGroup = new THREE.Group();
      chestGroup.position.set(0, 0, -15.2);
      const woodMat = this.toonMat(0xb45309, 0.4);
      const goldMat = this.toonMat(0xfacc15, 0.25, 0.5);

      const chestBase = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.72, 0.96), woodMat);
      chestBase.position.y = 0.36;
      const band1 = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.74, 0.16), goldMat);
      band1.position.set(0, 0.36, 0);
      const lockPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), goldMat);
      lockPlate.rotation.x = Math.PI / 2;
      lockPlate.position.set(0, 0.65, 0.50);

      // Опукла циліндрична кришка скрині!
      this.chestLid = new THREE.Group();
      this.chestLid.position.set(0, 0.72, -0.48);
      const lidCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.44, 20, 1, false, 0, Math.PI), woodMat);
      lidCyl.rotation.z = Math.PI / 2;
      lidCyl.position.set(0, 0, 0.48);
      this.chestLid.add(lidCyl);

      chestGroup.add(chestBase, band1, lockPlate, this.chestLid);
      this.scene.add(chestGroup);
      this.addBoxCollider(-0.8, 0.8, -15.75, -14.65, 1.15);

      this.interactables.push({
        id: 'rpg_treasure_chest',
        mesh: chestGroup,
        x: 0,
        y: 0.8,
        z: -15.2,
        radius: 2.8,
        label: 'Відкрити Казкову Скриню Скарбів (+Монети 🪙)',
        icon: '🎁',
        onInteract: () => this.openRPGQuestModal()
      });

      // 3. 🥚 МАГІЧНИЙ ІНКУБАТОР 3D-УЛЮБЛЕНЦІВ (Зліва в Кімнаті 2: вилуплює Котика, Зайчика, Єдинорога!)
      const incGroup = new THREE.Group();
      incGroup.position.set(-4.3, 0, -9.2);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 0.55, 24), this.toonMat(0x8b5cf6, 0.3));
      ped.position.y = 0.275;
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 1.35, 24),
        new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.32 })
      );
      glass.position.y = 1.22;

      // Чарівне 3D-Яйце всередині капсули
      this.eggMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), this.toonMat(0xfef08a, 0.25, 0.15));
      this.eggMesh.scale.set(1, 1.32, 1);
      this.eggMesh.position.y = 1.15;

      incGroup.add(ped, glass, this.eggMesh);
      this.scene.add(incGroup);
      this.addBoxCollider(-5.2, -3.4, -10.1, -8.3, 1.8);

      this.interactables.push({
        id: 'pet_incubator',
        mesh: incGroup,
        x: -4.3,
        y: 1.1,
        z: -9.2,
        radius: 2.8,
        label: '🥚 Магічний Інкубатор: Вилупити нового 3D-друга для Бруно!',
        icon: '🥚',
        onInteract: () => this.hatchNew3DPet()
      });

      // 4. 👗 КОРОЛІВСЬКИЙ ПОДІУМ ПЕРЕВДЯГАННЯ ДАНІКИ (Зліва далі в Кімнаті 2)
      const boothGroup = new THREE.Group();
      boothGroup.position.set(-4.3, 0, -13.5);
      const stagePad = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, 0.22, 32), this.toonMat(0xec4899, 0.3));
      stagePad.position.y = 0.11;
      const goldRing = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.06, 14, 32), this.toonMat(0xfde047, 0.2, 0.6));
      goldRing.rotation.x = Math.PI / 2;
      goldRing.position.y = 0.24;
      boothGroup.add(stagePad, goldRing);
      this.scene.add(boothGroup);

      this.interactables.push({
        id: 'avatar_booth',
        mesh: boothGroup,
        x: -4.3,
        y: 1.0,
        z: -13.5,
        radius: 2.6,
        label: 'Королівський Подіум: Змінити вбрання Даніки та Крила Феї!',
        icon: '👗',
        onInteract: () => {
          this.player.outfitStyle = (this.player.outfitStyle + 1) % 4;
          this.player.hasWings = (this.player.outfitStyle === 1 || this.player.outfitStyle === 2);
          this.updateDanikaOutfitVisuals();
          this.spawn3DBurst(-4.3, 1.5, -13.5, 0xfef08a);
          if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
          const styleNames = [
            '👕 Фірмова біла футболка-поло та сині шортики Даніки!',
            '👑 Пишна Рожева Сукня Принцеси + Сяючі Крила Феї!',
            '🧚‍♀️ Небесно-блакитне вбрання Чарівниці + Крила!',
            '🌟 Смарагдовий костюм Дослідниці Гандії!'
          ];
          this.showToast(styleNames[this.player.outfitStyle]);
        }
      });

      // 5. ☁️ ПАРКУР ПО ПУХНАСТИХ 3D-ХМАРИНКАХ ДО ЗОЛОТОГО КУБКА (Справа в Кімнаті 2)
      const cloudSteps = [
        { x: 3.9, y: 0.58, z: -8.2, color: 0xfbcfe8 },
        { x: 4.5, y: 1.15, z: -10.1, color: 0xfef08a },
        { x: 3.7, y: 1.72, z: -12.0, color: 0xbae6fd },
        { x: 4.6, y: 2.30, z: -13.9, color: 0xd8b4fe },
        { x: 3.8, y: 2.88, z: -15.7, color: 0x86efac },
        { x: 4.3, y: 3.45, z: -17.3, color: 0xffffff }
      ];

      cloudSteps.forEach((st) => {
        const cloudPlat = this.createFluffyCloudMesh(st.color, 1.15);
        cloudPlat.position.set(st.x, st.y - 0.1, st.z);
        this.scene.add(cloudPlat);
        this.addBoxCollider(st.x - 0.9, st.x + 0.9, st.z - 0.8, st.z + 0.8, st.y + 0.15, false);
      });

      // Великий різьблений Золотий Кубок Чемпіона на верхній хмаринці
      this.obbyTrophy = new THREE.Group();
      this.obbyTrophy.position.set(4.3, 4.15, -17.3);
      const tMat = this.toonMat(0xfacc15, 0.2, 0.7);
      const cupBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.16, 16), tMat);
      const cupBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.14, 0.38, 20), tMat);
      cupBowl.position.y = 0.24;
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      gem.position.y = 0.56;
      this.obbyTrophy.add(cupBase, cupBowl, gem);
      this.scene.add(this.obbyTrophy);

      this.interactables.push({
        id: 'obby_trophy',
        mesh: this.obbyTrophy,
        x: 4.3,
        y: 4.15,
        z: -17.3,
        radius: 2.3,
        label: '🏆 Забрати Кубок Хмарного Паркуру (+25 🪙)',
        icon: '🏆',
        onInteract: () => {
          this.awardCoins(25);
          this.awardXP(30);
          this.spawn3DBurst(4.3, 4.2, -17.3, 0xfacc15);
          if (window.confetti) window.confetti({ particleCount: 75, spread: 80 });
          if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
          this.showToast('🏆 УРА! Ти дострибала по 3D-хмаринках до самої вершини! +25 Монет та +30 XP!');
        }
      });
    }

    // ------------------------------------------------------------------------
    // ДЕТАЛІЗОВАНА МУЛЬТЯШНА 3D-МОДЕЛЬ ДАНІКИ (ЗА ЇЇ СПРАВЖНІМ ОБРАЗОМ З КАРТИНКИ!)
    // Великі блакитні очі з відблисками, русявий хвостик із блакитною резинкою,
    // біла футболка-поло з темно-синім V-комірцем, сині шортики та білі кросівки!
    // ------------------------------------------------------------------------
    buildSculptedDanika3D() {
      // 1. Округлі мультяшні 3D-ручки для режиму 1-ї особи
      this.scene.add(this.camera);
      this.fpGroup = new THREE.Group();
      this.camera.add(this.fpGroup);

      const skinMat = this.toonMat(0xffd5b8, 0.45, 0.02);
      const sleeveMat = this.toonMat(0xffffff, 0.5);

      const makeSmoothArm = () => {
        const g = new THREE.Group();
        const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.22, 16), sleeveMat);
        sleeve.rotation.x = Math.PI / 2;
        sleeve.position.z = 0.14;
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.28, 16), skinMat);
        forearm.rotation.x = Math.PI / 2;
        forearm.position.z = -0.08;
        const palm = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), skinMat);
        palm.position.z = -0.22;
        const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), skinMat);
        thumb.position.set(-0.055, 0.02, -0.20);
        g.add(sleeve, forearm, palm, thumb);
        return g;
      };

      this.fpLeftHand = makeSmoothArm();
      this.fpLeftHand.position.set(-0.34, -0.28, -0.48);
      this.fpRightHand = makeSmoothArm();
      this.fpRightHand.position.set(0.36, -0.27, -0.50);

      this.heldItemGroup = new THREE.Group();
      this.heldItemGroup.position.set(0, 0.08, -0.24);
      this.fpRightHand.add(this.heldItemGroup);
      this.fpGroup.add(this.fpLeftHand, this.fpRightHand);
      this.fpGroup.visible = (this.cameraMode === 'first');

      // 2. ПОВНОРОЗМІРНА МУЛЬТЯШНА 3D-ДАНІКА (Жодних кубиків Майнкрафту!)
      this.danika3D = new THREE.Group();

      const hairMat = this.toonMat(0xf5c26b, 0.38, 0.08);      // Золотисто-русяве волосся Даніки
      const hairTieMat = this.toonMat(0x38bdf8, 0.3);          // Блакитна резинка для хвостика
      this.shirtMat = this.toonMat(0xffffff, 0.45);            // Біла футболка-поло
      const navyMat = this.toonMat(0x1e293b, 0.5);             // Темно-сині шортики та V-комірець
      const shoeMat = this.toonMat(0xffffff, 0.35);            // Білі кросівки

      // --- ГОЛОВА ТА ОБЛИЧЧЯ ДАНІКИ (повернуті вперед у напрямку руху -Z) ---
      const headGroup = new THREE.Group();
      headGroup.position.y = 1.44;

      const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.26, 28, 28), skinMat);
      headSphere.scale.set(1.02, 0.98, 0.96);
      headGroup.add(headSphere);

      // Вушка
      [-0.25, 0.25].forEach(xEar => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), skinMat);
        ear.position.set(xEar, -0.02, 0);
        headGroup.add(ear);
      });

      // Великі виразні блакитні очі Даніки з подвійними білими зірочками-відблисками!
      const scleraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const irisMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xfda4af, transparent: true, opacity: 0.65 });

      [-0.095, 0.095].forEach(xEye => {
        const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.058, 18, 18), scleraMat);
        eyeWhite.scale.set(1.0, 1.15, 0.55);
        eyeWhite.position.set(xEye, 0.015, -0.225);

        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.044, 16, 16), irisMat);
        iris.scale.set(1.0, 1.12, 0.55);
        iris.position.set(xEye, 0.015, -0.238);

        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 14), pupilMat);
        pupil.scale.set(1.0, 1.1, 0.55);
        pupil.position.set(xEye, 0.015, -0.248);

        // Яскравий білий блік в оці
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), scleraMat);
        spark.position.set(xEye - 0.014, 0.032, -0.258);

        // Вії / брівка над оком
        const brow = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.085, 10), this.toonMat(0xb47b38));
        brow.rotation.z = Math.PI / 2 + (xEye < 0 ? 0.12 : -0.12);
        brow.position.set(xEye, 0.095, -0.225);

        headGroup.add(eyeWhite, iris, pupil, spark, brow);
      });

      // Рум'яні щічки, носик-кнопочка та мила усмішка
      [-0.145, 0.145].forEach(xBlush => {
        const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), blushMat);
        cheek.scale.set(1.2, 0.75, 0.4);
        cheek.position.set(xBlush, -0.045, -0.225);
        headGroup.add(cheek);
      });

      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), skinMat);
      nose.position.set(0, -0.025, -0.258);

      const smile = new THREE.Mesh(
        new THREE.TorusGeometry(0.042, 0.011, 10, 20, Math.PI),
        new THREE.MeshBasicMaterial({ color: 0xe11d48 })
      );
      smile.rotation.x = Math.PI;
      smile.position.set(0, -0.072, -0.242);
      headGroup.add(nose, smile);

      // --- ЗАЧІСКА ДАНІКИ: пишне хвилясте волосся + чубчик набік + високий бічний хвостик із блакитною резинкою ---
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.278, 28, 24), hairMat);
      hairCap.position.set(0, 0.035, 0.025);
      headGroup.add(hairCap);

      // Хвилястий чубчик набік над чолом
      const bang1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 16), hairMat);
      bang1.scale.set(1.45, 0.65, 0.75);
      bang1.position.set(-0.08, 0.145, -0.185);
      bang1.rotation.z = 0.25;
      const bang2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 16), hairMat);
      bang2.scale.set(1.3, 0.6, 0.7);
      bang2.position.set(0.11, 0.135, -0.175);
      bang2.rotation.z = -0.32;
      headGroup.add(bang1, bang2);

      // Бічні локони біля щічок
      [-0.24, 0.24].forEach(xCurl => {
        const sideLock = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.025, 0.24, 14), hairMat);
        sideLock.position.set(xCurl, -0.05, -0.08);
        headGroup.add(sideLock);
      });

      // Блакитна резинка та пишний бічний хвостик (як на картинці Даніки!)
      this.ponytailGroup = new THREE.Group();
      this.ponytailGroup.position.set(0.22, 0.14, 0.08);
      const blueScrunchie = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.025, 12, 20), hairTieMat);
      blueScrunchie.rotation.y = Math.PI / 3;
      const tailPuff1 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 18), hairMat);
      tailPuff1.scale.set(0.9, 1.35, 0.9);
      tailPuff1.position.set(0.09, -0.06, 0.05);
      const tailPuff2 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), hairMat);
      tailPuff2.scale.set(0.85, 1.3, 0.85);
      tailPuff2.position.set(0.14, -0.22, 0.08);
      const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 14), hairMat);
      tailTip.rotation.x = Math.PI;
      tailTip.rotation.z = 0.35;
      tailTip.position.set(0.17, -0.36, 0.09);
      this.ponytailGroup.add(blueScrunchie, tailPuff1, tailPuff2, tailTip);
      headGroup.add(this.ponytailGroup);

      // Золота корона Принцеси Даніки
      this.crownMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.10, 0.11, 7), this.toonMat(0xfde047, 0.2, 0.6));
      this.crownMesh.position.set(0, 0.30, -0.02);
      headGroup.add(this.crownMesh);

      // --- ШИЯ ТА ТУЛУБ У БІЛІЙ ФУТБОЛЦІ-ПОЛО З ЕМБЛЕМОЮ ---
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 16), skinMat);
      neck.position.y = 1.18;

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.54, 24), this.shirtMat);
      torso.scale.set(1.12, 1, 0.78);
      torso.position.y = 0.90;

      // Темно-синій V-комірець та шкільна емблема на грудях (як на картинці!)
      const collarV = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.022, 10, 20), navyMat);
      collarV.rotation.x = Math.PI / 2.3;
      collarV.position.set(0, 1.14, -0.06);

      const crest = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.02, 12), navyMat);
      crest.rotation.x = Math.PI / 2;
      crest.position.set(0.085, 1.00, -0.155);

      // Пишна спідниця принцеси (вмикається на Подіумі в стилях 1 і 2)
      this.princessSkirt = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.42, 24), this.toonMat(0xf472b6, 0.35));
      this.princessSkirt.position.y = 0.58;
      this.princessSkirt.visible = false;

      // Темно-сині шортики Даніки
      this.shortsGroup = new THREE.Group();
      const hipBase = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.18, 22), navyMat);
      hipBase.scale.set(1.1, 1, 0.78);
      hipBase.position.y = 0.58;
      this.shortsGroup.add(hipBase);

      // --- КРИЛА ФЕЇ ---
      this.wingsGroup = new THREE.Group();
      const wingMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8, transparent: true, opacity: 0.78 });
      [-1, 1].forEach(side => {
        const wTop = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), wingMat);
        wTop.scale.set(1.3, 0.85, 0.12);
        wTop.position.set(side * 0.28, 1.02, 0.18);
        wTop.rotation.z = side * 0.35;
        const wBot = new THREE.Mesh(new THREE.SphereGeometry(0.20, 14, 14), wingMat);
        wBot.scale.set(1.1, 0.75, 0.12);
        wBot.position.set(side * 0.24, 0.78, 0.18);
        this.wingsGroup.add(wTop, wBot);
      });
      this.wingsGroup.visible = this.player.hasWings;

      // --- ОКРУГЛІ РУЧКИ З РУКАВАМИ ФУТБОЛКИ ---
      const makeFullArm = (side) => {
        const piv = new THREE.Group();
        piv.position.set(side * 0.25, 1.10, 0);
        const slv = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.16, 16), this.shirtMat);
        slv.position.y = -0.07;
        const armCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.32, 16), skinMat);
        armCyl.position.y = -0.26;
        const handSp = new THREE.Mesh(new THREE.SphereGeometry(0.056, 14, 14), skinMat);
        handSp.position.y = -0.43;
        piv.add(slv, armCyl, handSp);
        return piv;
      };
      this.dLeftArm = makeFullArm(-1);
      this.dRightArm = makeFullArm(1);

      // --- ОКРУГЛІ НІЖКИ У ШОРТИКАХ ТА БІЛИХ КРОСІВКАХ ---
      const makeFullLeg = (side) => {
        const piv = new THREE.Group();
        piv.position.set(side * 0.11, 0.52, 0);
        const shortCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.082, 0.16, 16), navyMat);
        shortCuff.position.y = -0.06;
        const legCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.32, 16), skinMat);
        legCyl.position.y = -0.26;
        const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.060, 0.10, 16), shoeMat);
        sock.position.y = -0.40;
        // Округлий білий кросівок
        const sneaker = new THREE.Mesh(new THREE.SphereGeometry(0.082, 16, 16), shoeMat);
        sneaker.scale.set(0.92, 0.72, 1.45);
        sneaker.position.set(0, -0.46, -0.035);
        piv.add(shortCuff, legCyl, sock, sneaker);
        return piv;
      };
      this.dLeftLeg = makeFullLeg(-1);
      this.dRightLeg = makeFullLeg(1);

      this.danika3D.add(
        headGroup,
        neck,
        torso,
        collarV,
        crest,
        this.princessSkirt,
        this.shortsGroup,
        this.wingsGroup,
        this.dLeftArm,
        this.dRightArm,
        this.dLeftLeg,
        this.dRightLeg
      );
      this.danika3D.visible = (this.cameraMode === 'third');
      this.scene.add(this.danika3D);

      this.rebuildHeldItemMesh();
    }

    updateDanikaOutfitVisuals() {
      const st = this.player.outfitStyle;
      if (st === 0) {
        this.shirtMat.color.setHex(0xffffff);
        if (this.princessSkirt) this.princessSkirt.visible = false;
      } else if (st === 1) {
        this.shirtMat.color.setHex(0xf472b6);
        if (this.princessSkirt) {
          this.princessSkirt.material.color.setHex(0xf472b6);
          this.princessSkirt.visible = true;
        }
      } else if (st === 2) {
        this.shirtMat.color.setHex(0x38bdf8);
        if (this.princessSkirt) {
          this.princessSkirt.material.color.setHex(0x7dd3fc);
          this.princessSkirt.visible = true;
        }
      } else {
        this.shirtMat.color.setHex(0x10b981);
        if (this.princessSkirt) this.princessSkirt.visible = false;
      }
      if (this.wingsGroup) this.wingsGroup.visible = this.player.hasWings;
    }

    rebuildHeldItemMesh() {
      if (!this.heldItemGroup) return;
      while (this.heldItemGroup.children.length > 0) {
        this.heldItemGroup.remove(this.heldItemGroup.children[0]);
      }

      const type = this.player.heldItem;
      if (type === 'wand') {
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.48, 14), this.toonMat(0xf472b6));
        stick.rotation.x = Math.PI / 3;
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        star.position.set(0, 0.14, -0.21);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.015, 10, 24), new THREE.MeshBasicMaterial({ color: 0xfbcfe8 }));
        halo.position.set(0, 0.14, -0.21);
        this.heldItemGroup.add(stick, star, halo);
      } else if (type === 'bone') {
        const boneMat = this.toonMat(0xfffbeb, 0.3);
        const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.28, 12), boneMat);
        mid.rotation.z = Math.PI / 2;
        [-0.14, 0.14].forEach(xEnd => {
          [-0.03, 0.03].forEach(yEnd => {
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), boneMat);
            knob.position.set(xEnd, yEnd, 0);
            this.heldItemGroup.add(knob);
          });
        });
        this.heldItemGroup.add(mid);
      } else if (type === 'pizza') {
        const crust = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.34, 16), this.toonMat(0xfacc15));
        crust.rotation.x = -Math.PI / 2;
        crust.scale.y = 0.25;
        const pep1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), this.toonMat(0xef4444));
        pep1.position.set(0, 0.04, -0.04);
        this.heldItemGroup.add(crust, pep1);
      } else if (type === 'cupcake') {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.075, 0.13, 16), this.toonMat(0xf43f5e));
        const cream = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), this.toonMat(0xfbcfe8));
        cream.position.y = 0.09;
        const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), this.toonMat(0xdc2626));
        cherry.position.y = 0.20;
        this.heldItemGroup.add(cup, cream, cherry);
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
    // ДЕТАЛІЗОВАНИЙ МУЛЬТЯШНИЙ 3D-ПЕСИК БРУНО (ЗА ЙОГО КАРТИНКОЮ В ГРІ!)
    // Чорно-підпалий округлий цуцик з великими карими очима, рудими брівками-крапельками,
    // блакитним нашийником із золотою зіркою, висячими вушками і пухкими лапками!
    // ------------------------------------------------------------------------
    buildSculptedBruno3D() {
      const g = new THREE.Group();
      const blackFur = this.toonMat(0x231f20, 0.45);
      const tanFur = this.toonMat(0xd97706, 0.45);
      const collarMat = this.toonMat(0x0284c7, 0.3);
      const goldMat = this.toonMat(0xfacc15, 0.2, 0.7);
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const darkBrownMat = new THREE.MeshBasicMaterial({ color: 0x3b1d0a });

      // Округлий тулуб цуцика
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), blackFur);
      body.scale.set(0.95, 0.88, 1.38);
      body.position.set(0, 0.32, 0);

      // Руда плямка на грудях
      const chestTan = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 18), tanFur);
      chestTan.scale.set(0.95, 0.8, 0.65);
      chestTan.position.set(0, 0.31, -0.22);

      // Велика мила кругла голівка Бруно
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.62, -0.24);

      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 28), blackFur);
      skull.scale.set(1.06, 0.98, 0.98);

      // Пухка руда мордочка та чорний носик-кнопочка
      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 20), tanFur);
      muzzle.scale.set(1.15, 0.78, 0.95);
      muzzle.position.set(0, -0.055, -0.17);

      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), this.toonMat(0x0f172a, 0.15));
      nose.scale.set(1.2, 0.85, 0.9);
      nose.position.set(0, -0.015, -0.29);

      // Рожевий язичок
      const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), this.toonMat(0xf43f5e, 0.3));
      tongue.scale.set(0.9, 0.4, 1.1);
      tongue.position.set(0, -0.115, -0.24);

      // Великі блискучі карі очі + фірмові руді брівки-крапельки Бруно!
      [-0.095, 0.095].forEach(xEye => {
        const eyeBg = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), whiteMat);
        eyeBg.scale.set(1, 1.1, 0.55);
        eyeBg.position.set(xEye, 0.035, -0.205);

        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.044, 16, 16), darkBrownMat);
        iris.scale.set(1, 1.1, 0.55);
        iris.position.set(xEye, 0.035, -0.218);

        const shine = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), whiteMat);
        shine.position.set(xEye - 0.014, 0.052, -0.232);

        // Руда брівка-цятка над оком
        const tanBrow = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), tanFur);
        tanBrow.scale.set(1.2, 0.75, 0.5);
        tanBrow.position.set(xEye * 0.92, 0.115, -0.195);

        headGroup.add(eyeBg, iris, shine, tanBrow);
      });

      // М'які висячі вушка Бруно
      [-0.23, 0.23].forEach(xEar => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), blackFur);
        ear.scale.set(0.45, 1.35, 0.75);
        ear.position.set(xEar, 0.02, -0.02);
        ear.rotation.z = xEar < 0 ? 0.28 : -0.28;
        headGroup.add(ear);
      });

      headGroup.add(skull, muzzle, nose, tongue);

      // Блакитний нашийник із золотою зірочкою
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.035, 12, 24), collarMat);
      collar.rotation.x = Math.PI / 2.2;
      collar.position.set(0, 0.45, -0.20);
      const starMedal = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), goldMat);
      starMedal.position.set(0, 0.39, -0.36);

      // Пухкі лапки з рудими подушечками
      const pawCoords = [
        { x: -0.13, z: -0.18 },
        { x: 0.13, z: -0.18 },
        { x: -0.14, z: 0.18 },
        { x: 0.14, z: 0.18 }
      ];
      pawCoords.forEach(pc => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.20, 14), blackFur);
        leg.position.set(pc.x, 0.14, pc.z);
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), tanFur);
        paw.scale.set(1, 0.65, 1.25);
        paw.position.set(pc.x, 0.045, pc.z - 0.02);
        g.add(leg, paw);
      });

      // Хвостик Бруно, що весело махає
      this.brunoTail = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.045, 0.24, 12), blackFur);
      this.brunoTail.position.set(0, 0.44, 0.32);
      this.brunoTail.rotation.x = 0.55;

      g.add(body, chestTan, headGroup, collar, starMedal, this.brunoTail);
      g.position.set(this.bruno.x, 0, this.bruno.z);
      this.scene.add(g);
      this.bruno.mesh = g;

      this.interactables.push({
        id: 'bruno_pet',
        mesh: g,
        get x() { return g.position.x; },
        get y() { return 0.5; },
        get z() { return g.position.z; },
        radius: 2.5,
        label: 'Погладити / Пригостити 3D-Бруно (+10 XP)',
        icon: '🐶',
        onInteract: () => {
          this.commandBrunoFlip();
          if (this.player.heldItem === 'bone') {
            this.awardCoins(10);
            this.awardXP(15);
            this.showToast('🦴 Гав-гав! Бруно з’їв кісточку, зробив сальто і приніс +10 Монет та +15 XP!');
          } else {
            this.awardXP(10);
            this.showToast('🐶 Бруно радісно робить 3D-сальто!');
          }
        }
      });
    }

    // ------------------------------------------------------------------------
    // 🥚 ВИЛУПЛЕННЯ НОВИХ 3D-ДРУЗІВ ІЗ МАГІЧНОГО ІНКУБАТОРА (КОТИК, ЄДИНОРІГ, ЗАЙЧИК)
    // ------------------------------------------------------------------------
    hatchNew3DPet() {
      const petTypes = [
        { name: '🐱 Рожеве Кошеня Мурчик', color: 0xf472b6, earScaleY: 1.1, hasHorn: false },
        { name: '🦄 Чарівний Єдиноріг Зірочка', color: 0xe0f2fe, earScaleY: 1.0, hasHorn: true },
        { name: '🐰 Пухнастий Зайчик Стрибунець', color: 0xfef08a, earScaleY: 2.2, hasHorn: false }
      ];
      const spec = petTypes[this.hatchedPetCount % petTypes.length];
      this.hatchedPetCount++;

      const petGroup = new THREE.Group();
      const furMat = this.toonMat(spec.color, 0.35);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), furMat);
      body.scale.set(0.95, 0.88, 1.25);
      body.position.y = 0.22;

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), furMat);
      head.position.set(0, 0.42, -0.15);

      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      [-0.065, 0.065].forEach(xE => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), eyeMat);
        eye.position.set(xE, 0.44, -0.30);
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14 * spec.earScaleY, 12), furMat);
        ear.position.set(xE * 1.3, 0.58, -0.14);
        petGroup.add(eye, ear);
      });

      if (spec.hasHorn) {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 12), this.toonMat(0xfacc15, 0.2, 0.7));
        horn.position.set(0, 0.64, -0.22);
        horn.rotation.x = -0.3;
        petGroup.add(horn);
      }

      petGroup.add(body, head);
      petGroup.position.set(-3.2, 0, -9.2);
      this.scene.add(petGroup);
      this.extraPets.push({ mesh: petGroup, offsetIndex: this.extraPets.length + 1 });

      this.spawn3DBurst(-4.3, 1.2, -9.2, 0xfef08a);
      if (window.confetti) window.confetti({ particleCount: 55, spread: 70 });
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.showToast(`🥚 УРА! З яйця вилупився новий 3D-друг: ${spec.name}! Тепер він бігає за тобою!`);
    }

    commandBrunoFlip() {
      this.bruno.flipTimer = 1.0;
      if (this.bruno.mesh) {
        this.spawn3DBurst(this.bruno.mesh.position.x, 0.8, this.bruno.mesh.position.z, 0xf43f5e);
      }
      if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    }

    // ------------------------------------------------------------------------
    // ЗОЛОТІ 3D-МОНЕТКИ ТА ЧАСТИНКИ
    // ------------------------------------------------------------------------
    spawnRoomCoins() {
      const positions = [
        { x: -1.8, y: 0.65, z: 2.0 },
        { x: 1.8, y: 0.65, z: 1.2 },
        { x: 0, y: 0.65, z: -3.2 },
        { x: -2.2, y: 0.65, z: -9.5 },
        { x: 1.5, y: 0.65, z: -12.0 },
        { x: 3.7, y: 2.25, z: -12.0 }
      ];
      positions.forEach(p => this.createCoinAt(p.x, p.y, p.z));
    }

    createCoinAt(x, y, z) {
      const g = new THREE.Group();
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.055, 12, 24), this.toonMat(0xfacc15, 0.2, 0.7));
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.05, 20), this.toonMat(0xfef08a, 0.3, 0.5));
      core.rotation.x = Math.PI / 2;
      g.add(rim, core);
      g.position.set(x, y, z);
      this.scene.add(g);
      this.collectibleCoins.push({ mesh: g, baseY: y });
    }

    spawn3DBurst(x, y, z, hexColor) {
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 10, 10),
          new THREE.MeshBasicMaterial({ color: hexColor })
        );
        p.position.set(x, y, z);
        this.scene.add(p);
        this.particles3D.push({
          mesh: p,
          vx: (Math.random() - 0.5) * 4.2,
          vy: 2.2 + Math.random() * 3.5,
          vz: (Math.random() - 0.5) * 4.2,
          life: 0.85
        });
      }
    }

    // ------------------------------------------------------------------------
    // RPG-КВЕСТИ ТА СИНХРОНІЗАЦІЯ З ОСНОВНОЮ ГРОЮ
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
        this.chestOpenAngle = -1.25;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const tx = Math.cos(angle) * 2.1;
          const tz = -14.6 + Math.sin(angle) * 1.8;
          this.createCoinAt(tx, 0.65, tz);
        }
        this.awardCoins(quest.rewardCoins);
        this.awardXP(20);
        this.spawn3DBurst(0, 1.2, -15.2, 0xfacc15);
        if (window.confetti) window.confetti({ particleCount: 55, spread: 70 });
        if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
        this.showToast(`🎉 Правильно! +${quest.rewardCoins} Монет! Збери золоті монетки навколо скрині!`);
      } else {
        if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
        this.showToast('🤔 Майже! Спробуй іншу відповідь!');
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
      }, 3900);
    }

    // ------------------------------------------------------------------------
    // КАМЕРА ТА ДІЇ
    // ------------------------------------------------------------------------
    toggleCameraMode() {
      this.cameraMode = (this.cameraMode === 'first') ? 'third' : 'first';
      const btn = document.getElementById('r3d-cam-toggle-btn');
      if (btn) {
        btn.textContent = this.cameraMode === 'first'
          ? '👁️ Вигляд: 1-ша особа (Очима)'
          : '🎥 Вигляд: 3-тя особа (Даніка)';
      }
      if (this.danika3D) this.danika3D.visible = (this.cameraMode === 'third');
      if (this.fpGroup) this.fpGroup.visible = (this.cameraMode === 'first');
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }

    teleportToOtherRoom() {
      this.doorOpen = true;
      if (this.player.z > -6.2) {
        this.player.x = 0;
        this.player.y = 0;
        this.player.z = -10.5;
        this.player.yaw = 0;
        this.showToast('🏫 Кімната 2: Чарівна Академія, Інкубатор Улюбленців та Хмарний Паркур!');
      } else {
        this.player.x = 0;
        this.player.y = 0;
        this.player.z = 2.8;
        this.player.yaw = Math.PI;
        this.showToast('🏠 Кімната 1: Затишна Вітальня з видом на море Гандії!');
      }
    }

    jump() {
      if (this.player.onGround) {
        this.player.vy = 6.7;
        this.player.onGround = false;
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
      }
    }

    useOrInteract() {
      this._handSwingTimer = 0.35;
      if (this.nearestInteractable) {
        this.nearestInteractable.onInteract();
        return;
      }
      const item = this.player.heldItem;
      if (item === 'wand') {
        const fxX = this.player.x - Math.sin(this.player.yaw) * 1.5;
        const fxZ = this.player.z - Math.cos(this.player.yaw) * 1.5;
        this.spawn3DBurst(fxX, this.player.y + 1.2, fxZ, 0xfef08a);
        if (window.soundFX && window.soundFX.playMagicSparkle) window.soundFX.playMagicSparkle();
        this.showToast('🪄 Чарівна паличка створила магічний салют!');
      } else if (item === 'pizza' || item === 'cupcake') {
        this.awardXP(5);
        if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
        this.showToast('😋 Ням-ням! Дуже смачно! (+5 XP)');
      } else if (item === 'bone') {
        this.commandBrunoFlip();
        this.showToast('🦴 Бруно побачив кісточку і зробив сальто!');
      }
    }

    triggerNearestInteract() {
      if (this.nearestInteractable) {
        this.nearestInteractable.onInteract();
      }
    }

    // ------------------------------------------------------------------------
    // ОБРОБНИКИ КЕРУВАННЯ
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
          this.player.pitch = Math.max(-0.95, Math.min(0.95, this.player.pitch - dy * 0.005));
        });

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
              this.player.pitch = Math.max(-0.95, Math.min(0.95, this.player.pitch - dy * 0.0055));
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
    // ГОЛОВНИЙ ІГРОВИЙ ЦИКЛ
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
      if (this.keys['KeyQ'] || this.keys['ArrowLeft']) this.player.yaw += 2.2 * dt;
      if (this.keys['KeyR'] || this.keys['ArrowRight']) this.player.yaw -= 2.2 * dt;

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

      const nextX = this.player.x + dx;
      const nextZ = this.player.z + dz;

      if (!this.checkHorizontalCollision(nextX, this.player.z, this.player.y)) {
        this.player.x = nextX;
      }
      if (!this.checkHorizontalCollision(this.player.x, nextZ, this.player.y)) {
        this.player.z = nextZ;
      }

      // Гравітація та батути/хмаринки
      this.player.vy -= 17.5 * dt;
      this.player.y += this.player.vy * dt;

      const support = this.getFloorHeightAt(this.player.x, this.player.z, this.player.y);
      if (this.player.y <= support.height) {
        this.player.y = support.height;
        if (support.isTrampoline) {
          this.player.vy = 9.4;
          this.player.onGround = false;
          if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
        } else {
          this.player.vy = 0;
          this.player.onGround = true;
        }
      }

      // Анімація ходьби Даніки (ніжки, ручки та пружинистий хвостик волосся!)
      const isMoving = Math.hypot(moveForward, moveRight) > 0.12;
      if (isMoving && this.player.onGround) {
        this.player.walkCycle += dt * 11;
      } else {
        this.player.walkCycle *= 0.85;
      }

      const swing = Math.sin(this.player.walkCycle) * 0.045;
      if (this.fpLeftHand && this.fpRightHand) {
        this.fpLeftHand.position.y = -0.28 + swing;
        this.fpLeftHand.position.z = -0.48 - swing;
        let useBonus = 0;
        if (this._handSwingTimer > 0) {
          this._handSwingTimer -= dt;
          useBonus = Math.sin(this._handSwingTimer * Math.PI * 3) * 0.16;
        }
        this.fpRightHand.position.y = -0.27 - swing + useBonus;
        this.fpRightHand.position.z = -0.50 + swing - useBonus;
      }

      if (this.danika3D) {
        this.danika3D.position.set(this.player.x, this.player.y, this.player.z);
        this.danika3D.rotation.y = this.player.yaw;
        const limbAngle = Math.sin(this.player.walkCycle) * 0.55;
        this.dLeftLeg.rotation.x = limbAngle;
        this.dRightLeg.rotation.x = -limbAngle;
        this.dLeftArm.rotation.x = -limbAngle;
        this.dRightArm.rotation.x = limbAngle;
        if (this.ponytailGroup) {
          this.ponytailGroup.rotation.z = Math.abs(Math.sin(this.player.walkCycle)) * 0.22;
        }
      }

      // Камера (1-ша особа або 3-тя особа з захистом від виходу за стіни)
      if (this.cameraMode === 'first') {
        const bob = isMoving && this.player.onGround ? Math.sin(this.player.walkCycle * 2) * 0.035 : 0;
        this.camera.position.set(this.player.x, this.player.y + this.player.height + bob, this.player.z);
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.player.yaw;
        this.camera.rotation.x = this.player.pitch;
      } else {
        const camDist = 2.85;
        let cx = this.player.x + Math.sin(this.player.yaw) * camDist;
        let cz = this.player.z + Math.cos(this.player.yaw) * camDist;
        cx = Math.max(-6.0, Math.min(6.0, cx));
        cz = Math.max(-18.5, Math.min(6.0, cz));
        const cy = Math.min(4.8, Math.max(0.6, this.player.y + 2.15 - this.player.pitch * 1.1));
        this.camera.position.set(cx, cy, cz);
        this.camera.lookAt(this.player.x, this.player.y + 1.25, this.player.z);
      }

      const roomLbl = document.getElementById('r3d-room-indicator');
      if (roomLbl) {
        roomLbl.textContent = this.player.z < -6.2
          ? '🏫 Кімната 2: Чарівна Академія та Хмарний Паркур'
          : '🏠 Кімната 1: Затишна Вітальня';
      }

      // Плавна анімація об'єктів
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
        this.obbyTrophy.rotation.y += 2.0 * dt;
      }
      if (this.globeMesh) {
        this.globeMesh.rotation.y += 0.9 * dt;
      }
      if (this.eggMesh) {
        this.eggMesh.rotation.z = Math.sin(performance.now() * 0.005) * 0.12;
      }

      // Рух пухнастих хмаринок за вікном
      this.floatingClouds.forEach(fc => {
        fc.mesh.position.z = fc.baseZ + Math.sin(performance.now() * 0.0005 * fc.speed) * 2.5;
      });

      this.updateBrunoAndPetsAI(dt);
      this.updateInteractFocus();
      this.updateCoinsAndParticles(dt);
    }

    checkHorizontalCollision(x, z, y) {
      const r = this.player.radius;
      if (!this.doorOpen && x > -1.35 && x < 1.35 && z > -6.55 && z < -5.85) {
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
        if (c.maxY <= 4.2 && currentY >= c.maxY - 0.45) {
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

    updateBrunoAndPetsAI(dt) {
      if (!this.bruno.mesh) return;
      const b = this.bruno;
      b.tailAngle += dt * 14;
      if (this.brunoTail) {
        this.brunoTail.rotation.z = Math.sin(b.tailAngle) * 0.45;
      }

      if (b.flipTimer > 0) {
        b.flipTimer = Math.max(0, b.flipTimer - dt * 1.4);
        const phase = 1 - b.flipTimer;
        b.mesh.position.y = Math.sin(phase * Math.PI) * 1.35;
        b.mesh.rotation.x = phase * Math.PI * 2;
        if (b.flipTimer === 0) {
          b.mesh.position.y = 0;
          b.mesh.rotation.x = 0;
        }
      } else {
        const dx = this.player.x - b.mesh.position.x;
        const dz = this.player.z - b.mesh.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 1.65) {
          const step = Math.min(dist - 1.4, 3.8 * dt);
          b.mesh.position.x += (dx / dist) * step;
          b.mesh.position.z += (dz / dist) * step;
          b.mesh.position.y = Math.abs(Math.sin(b.tailAngle * 0.8)) * 0.11;
        } else {
          b.mesh.position.y = 0;
        }
        b.mesh.rotation.y = Math.atan2(-dx, -dz);
      }

      // Вилуплені з Інкубатора 3D-улюбленці теж біжать вервечкою за Данікою та Бруно!
      let leaderX = b.mesh.position.x;
      let leaderZ = b.mesh.position.z;
      this.extraPets.forEach((ep, idx) => {
        const edx = leaderX - ep.mesh.position.x;
        const edz = leaderZ - ep.mesh.position.z;
        const edist = Math.hypot(edx, edz);
        if (edist > 1.15) {
          const estep = Math.min(edist - 0.95, 3.6 * dt);
          ep.mesh.position.x += (edx / edist) * estep;
          ep.mesh.position.z += (edz / edist) * estep;
          ep.mesh.position.y = Math.abs(Math.sin(b.tailAngle + idx)) * 0.12;
        } else {
          ep.mesh.position.y = 0;
        }
        ep.mesh.rotation.y = Math.atan2(-edx, -edz);
        leaderX = ep.mesh.position.x;
        leaderZ = ep.mesh.position.z;
      });
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
          const dot = (dx * forwardX + dz * forwardZ) / (dist || 1);
          if (dot > 0.15) {
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
        c.mesh.rotation.y += 3.0 * dt;
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
