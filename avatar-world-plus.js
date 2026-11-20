/**
 * Avatar World Plus Engine (v20261120_2)
 * Додає плавну безперервну ходьбу (клавіатура, кнопки ◀ ▶, тап по підлозі),
 * автоматичний перехід між кімнатами, миттєве перевдягання без зайвих замків,
 * інтерактивну шафу, день/ніч та танцювальну вечірку у Живій Кімнаті Avatar World.
 */
(function () {
  if (typeof AdventureWorldGame === 'undefined') return;

  const STARTER_FREE_OUTFITS = new Set([
    'danika_abece', 'danika_casual', 'danika_skater', 'danika_pajama',
    'danika_spa_towel', 'danika_princess', 'danika_beach', 'danika_artist',
    'danika_sport', 'danika_cat_hoodie', 'danika_denim', 'danika_mermaid',
    'danika_daisy', 'danika_fairy', 'danika_hoodie_unicorn', 'danika_hoodie_mint_bear',
    'danika_street_pink_bomber', 'danika_street_lavender_puffer'
  ]);

  const STARTER_FREE_ACCS = new Set([
    'acc_none', 'acc_bow_headband', 'acc_glasses_heart', 'acc_crown',
    'acc_flower_wreath', 'acc_headphones', 'acc_star_wand', 'acc_panama_hat',
    'acc_cap_abece', 'acc_star_clips'
  ]);

  const TEMP_LIVE_POSES = [
    'danika_pose_chef',
    'danika_pose_detective',
    'danika_pose_sleeping',
    'danika_pose_teacher',
    'danika_pose_popstar',
    'danika_pose_scientist'
  ];

  // 1. Розблокування стартової колекції гардеробу Avatar World
  AdventureWorldGame.prototype.unlockStarterAvatarWardrobe = function () {
    if (!this.state || !this.state.wardrobe) return;
    if (Array.isArray(this.state.wardrobe.danikaOutfits)) {
      this.state.wardrobe.danikaOutfits.forEach(o => {
        if (STARTER_FREE_OUTFITS.has(o.id)) o.unlocked = true;
      });
    }
    if (Array.isArray(this.state.wardrobe.danikaAccessories)) {
      this.state.wardrobe.danikaAccessories.forEach(a => {
        if (STARTER_FREE_ACCS.has(a.id)) a.unlocked = true;
      });
    }
  };

  const origLoadState = AdventureWorldGame.prototype.loadState;
  AdventureWorldGame.prototype.loadState = function () {
    const res = origLoadState.apply(this, arguments);
    this.unlockStarterAvatarWardrobe();
    return res;
  };

  // 2. Покращене перевдягання: пробуджує з ліжечка, скидає тимчасову позу та миттєво оновлює образ
  const origSelectOutfit = AdventureWorldGame.prototype.selectDanikaOutfit;
  AdventureWorldGame.prototype.selectDanikaOutfit = function (id, forceApply = false) {
    if (this.state && this.state.avatarLiveRoom && this.state.avatarLiveRoom.danikaSleepingInCloudBed) {
      this.state.avatarLiveRoom.danikaSleepingInCloudBed = false;
      const dEl = document.getElementById('character-danika');
      if (dEl) {
        dEl.style.bottom = '56px';
        dEl.style.zIndex = '45';
      }
    }
    const res = origSelectOutfit.call(this, id, forceApply);
    const item = this.state && this.state.wardrobe && this.state.wardrobe.danikaOutfits
      ? this.state.wardrobe.danikaOutfits.find(o => o.id === id)
      : null;
    if (item && (item.unlocked || forceApply)) {
      const roomImg = document.getElementById('room-danika-img');
      const locImg = document.getElementById('loc-danika-img');
      if (roomImg) roomImg.src = item.img;
      if (locImg) locImg.src = item.img;
      const danikaEl = document.getElementById('character-danika');
      if (danikaEl) {
        danikaEl.classList.add('jumping');
        setTimeout(() => danikaEl.classList.remove('jumping'), 550);
      }
      if (this.spawnPoseParticles) this.spawnPoseParticles(['👗', '✨', '💖', '🌟']);
      if (document.getElementById('avatar-live-room-stage')) {
        this.renderAvatarLiveRoom();
      }
    }
    return res;
  };

  // 3. Відновлення звичайного вбрання Даніки, коли вона починає йти з тимчасової пози або ліжка
  AdventureWorldGame.prototype.prepareDanikaForWalking = function () {
    const danikaEl = document.getElementById('character-danika');
    const danikaImg = document.getElementById('room-danika-img');

    if (this.state && this.state.avatarLiveRoom && this.state.avatarLiveRoom.danikaSleepingInCloudBed) {
      this.state.avatarLiveRoom.danikaSleepingInCloudBed = false;
      if (danikaEl) {
        danikaEl.style.bottom = '56px';
        danikaEl.style.zIndex = '45';
      }
      if (document.getElementById('avatar-live-room-stage')) {
        this.renderAvatarLiveRoom();
      }
    }

    if (danikaImg && danikaImg.src) {
      const isTempPose = TEMP_LIVE_POSES.some(p => danikaImg.src.includes(p));
      if (isTempPose) {
        danikaImg.src = (this.state && this.state.activeDanikaAvatar) || 'assets/characters/danika_danika_abece.png';
      }
    }
  };

  // 4. Покращений тап по підлозі (ігнорує меблі Живої Кімнати та панель керування)
  const origWalkDanikaTo = AdventureWorldGame.prototype.walkDanikaTo;
  AdventureWorldGame.prototype.walkDanikaTo = function (targetXPct, onArrive = null) {
    this.prepareDanikaForWalking();
    return origWalkDanikaTo.call(this, targetXPct, onArrive);
  };

  AdventureWorldGame.prototype.initCharacterMovement = function () {
    const viewport = document.getElementById('world-viewport');
    if (!viewport || this._movementInitialized) return;
    this._movementInitialized = true;

    viewport.addEventListener('click', (e) => {
      if (e.target.closest(
        '.room-hotspot, button, .character-danika-wrap, .character-bruno-wrap, .character-npc-wrap, .character-custom-friend-wrap, ' +
        '.room-prop-item, .props-pocket-tray, .tamagotchi-hud, #secret-build-toolbar, #secret-item-picker-drawer, ' +
        '#bruno-poses-drawer, #toy-ball, .danika-actions-drawer, .live-obj, .live-bed-blanket-foreground, ' +
        '.live-fridge-shelf-popup, .live-crafting-bar, .live-closet-strip, .live-quick-fab, .live-hide-seek-fab, ' +
        '.game-side-drawer, #avatar-walk-dock'
      )) {
        return;
      }

      const secretEl = e.target.closest('.secret-item, .secret-placed-item');
      if (secretEl && secretEl.id !== 'secret-dom-sr_22_rainbow_rug') {
        return;
      }

      const coords = this.getStageCoords(e.clientX, e.clientY, viewport);
      const clickYRel = coords.yPct / 100;
      if (clickYRel < 0.18) return;

      this.spawnFloorRipple(e.clientX, e.clientY);
      const targetXPct = Math.max(8, Math.min(92, coords.xPct));
      this.walkDanikaTo(targetXPct);
    });
  };

  // 5. Плавна безперервна ходьба (клавіатура ←/→, A/D, Пробіл + екранні кнопки ◀ ▶ ⬆)
  AdventureWorldGame.prototype.danikaJump = function () {
    const danikaEl = document.getElementById('character-danika');
    if (!danikaEl) return;
    this.prepareDanikaForWalking();
    danikaEl.classList.remove('jumping');
    void danikaEl.offsetWidth;
    danikaEl.classList.add('jumping');
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    if (this.spawnPoseParticles) this.spawnPoseParticles(['⭐', '✨', '🌸']);
    setTimeout(() => danikaEl.classList.remove('jumping'), 580);
  };

  AdventureWorldGame.prototype.initContinuousWalkControls = function () {
    if (this._continuousWalkInit) return;
    this._continuousWalkInit = true;

    const walkState = { left: false, right: false, lastTs: 0, stepAccum: 0, edgeCooldown: 0 };
    this._continuousWalkState = walkState;

    const startHold = (dir) => {
      walkState[dir] = true;
      const btn = document.getElementById(dir === 'left' ? 'walk-btn-left' : 'walk-btn-right');
      if (btn) btn.classList.add('active-hold');
      ensureLoop();
    };
    const stopHold = (dir) => {
      walkState[dir] = false;
      const btn = document.getElementById(dir === 'left' ? 'walk-btn-left' : 'walk-btn-right');
      if (btn) btn.classList.remove('active-hold');
      if (!walkState.left && !walkState.right) {
        const dEl = document.getElementById('character-danika');
        const bEl = document.getElementById('character-bruno');
        if (dEl) dEl.classList.remove('walking');
        if (bEl) bEl.classList.remove('trotting');
      }
    };

    const bindHoldBtn = (btnId, dir) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startHold(dir);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
        btn.addEventListener(ev, () => stopHold(dir));
      });
    };
    bindHoldBtn('walk-btn-left', 'left');
    bindHoldBtn('walk-btn-right', 'right');

    window.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (document.querySelector('.modal-overlay.active')) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
        startHold('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        startHold('right');
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (e.key === ' ') e.preventDefault();
        this.danikaJump();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
        stopHold('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        stopHold('right');
      }
    });

    let rafId = null;
    const stepFrame = (ts) => {
      if (!walkState.left && !walkState.right) {
        rafId = null;
        walkState.lastTs = 0;
        return;
      }

      const dt = walkState.lastTs ? Math.min(0.06, (ts - walkState.lastTs) / 1000) : 0.016;
      walkState.lastTs = ts;
      if (walkState.edgeCooldown > 0) walkState.edgeCooldown -= dt;

      const dir = (walkState.right ? 1 : 0) - (walkState.left ? 1 : 0);
      const danikaEl = document.getElementById('character-danika');
      const brunoEl = document.getElementById('character-bruno');
      const viewport = document.getElementById('world-viewport');

      if (dir !== 0 && danikaEl && viewport) {
        // Скидаємо попередній CSS-перехід від тап-ходьби
        if (this._walkTimer) { clearTimeout(this._walkTimer); this._walkTimer = null; }
        if (this._stepInterval) { clearInterval(this._stepInterval); this._stepInterval = null; }
        this.prepareDanikaForWalking();

        if (danikaEl.classList.contains('danika-in-pool')) this.danikaExitPool(false);
        if (danikaEl.classList.contains('danika-in-ballpit')) this.danikaExitBallPit(false);
        if (danikaEl.classList.contains('danika-in-tub')) this.danikaExitBath(false);
        if (danikaEl.classList.contains('danika-in-bed')) this.danikaExitBed(false);
        if (this.state.activeDanikaPose === 'danika_sleeping' || this.state.activeDanikaPose === 'danika_school_desk') {
          this.resetDanikaPose();
        }

        let curX = parseFloat(danikaEl.dataset.xPct);
        if (isNaN(curX)) {
          curX = this.getElementVisualCoords(danikaEl, viewport).xPct;
        }
        const speedPctPerSec = 30;
        let nextX = curX + dir * speedPctPerSec * dt;

        // Перехід у сусідню кімнату при досягненні краю
        if (walkState.edgeCooldown <= 0 && (nextX < 5.5 || nextX > 94.5)) {
          const curRoomIdx = this.state.activeRoomIndex || 0;
          const totalRooms = (this.rooms && this.rooms.length) ? this.rooms.length : 5;
          if (nextX > 94.5 && curRoomIdx < totalRooms - 1) {
            walkState.edgeCooldown = 0.8;
            this.switchRoom(curRoomIdx + 1, true);
            nextX = 12;
          } else if (nextX < 5.5 && curRoomIdx > 0) {
            walkState.edgeCooldown = 0.8;
            this.switchRoom(curRoomIdx - 1, true);
            nextX = 88;
          } else {
            nextX = Math.max(6, Math.min(94, nextX));
          }
        } else {
          nextX = Math.max(6, Math.min(94, nextX));
        }

        danikaEl.style.transition = 'none';
        danikaEl.style.left = `${nextX}%`;
        danikaEl.dataset.xPct = nextX;
        danikaEl.classList.add('walking');

        const spriteStage = document.getElementById('danika-sprite-stage');
        if (spriteStage) spriteStage.style.setProperty('--flip-x', dir > 0 ? '1' : '-1');

        // Кроки та пухнастий пил
        walkState.stepAccum += dt;
        if (walkState.stepAccum >= 0.24) {
          walkState.stepAccum = 0;
          if (window.soundFX && window.soundFX.playStep) window.soundFX.playStep();
          if (this.spawnStepDust) this.spawnStepDust(danikaEl);
        }

        // Бруно біжить слідом за Данікою
        if (brunoEl && !this.state.brunoHidden && (!this.isBrunoStationary || !this.isBrunoStationary())) {
          let brunoX = parseFloat(brunoEl.dataset.xPct);
          if (isNaN(brunoX)) brunoX = this.getElementVisualCoords(brunoEl, viewport).xPct;
          const targetBrunoX = Math.max(6, Math.min(94, nextX + (dir > 0 ? -11 : 11)));
          const diff = targetBrunoX - brunoX;
          if (Math.abs(diff) > 0.6) {
            brunoX += Math.sign(diff) * Math.min(Math.abs(diff), 29 * dt);
            brunoEl.style.transition = 'none';
            brunoEl.style.left = `${brunoX}%`;
            brunoEl.dataset.xPct = brunoX;
            brunoEl.classList.add('trotting');
            const bStage = document.getElementById('bruno-sprite-stage');
            if (bStage) bStage.style.setProperty('--bruno-flip-x', diff > 0 ? '1' : '-1');
          } else {
            brunoEl.classList.remove('trotting');
          }
        }
      }

      rafId = requestAnimationFrame(stepFrame);
    };

    const ensureLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(stepFrame);
    };
  };

  // 6. Захист від подвійного кліку по Даніці + поїдання приготованої страви / годування Бруно
  const origHandleDanikaClick = AdventureWorldGame.prototype.handleDanikaClick;
  AdventureWorldGame.prototype.handleDanikaClick = function (e) {
    const now = Date.now();
    if (this._lastDanikaClickTs && now - this._lastDanikaClickTs < 240) return;
    this._lastDanikaClickTs = now;

    if (this.state && this.state.danikaHeldItem && this.state.danikaHeldItem.id === 'cooked_dish') {
      const dish = this.state.danikaHeldItem;
      this.state.danikaHeldItem = null;
      if (this.renderHeldItems) this.renderHeldItems();
      if (this.modifyTamagotchi) this.modifyTamagotchi({ hunger: 25, happiness: 20 });
      if (window.soundFX && window.soundFX.playSparkle) window.soundFX.playSparkle();
      if (this.spawnPoseParticles) this.spawnPoseParticles(['😋', dish.emoji || '🍕', '💖', '✨']);
      this.showDanikaThought(`Ням-ням! «${dish.title}» просто неймовірно смачно! 😋💖`);
      this.speak(`Ням-ням! Дуже смачна страва ${dish.title}!`);
      this.saveState();
      return;
    }

    return origHandleDanikaClick.apply(this, arguments);
  };

  const origHandleBrunoClick = AdventureWorldGame.prototype.handleBrunoClick;
  if (typeof origHandleBrunoClick === 'function') {
    AdventureWorldGame.prototype.handleBrunoClick = function (e) {
      if (this.state && this.state.danikaHeldItem && this.state.danikaHeldItem.id === 'cooked_dish') {
        const dish = this.state.danikaHeldItem;
        this.state.danikaHeldItem = null;
        if (this.renderHeldItems) this.renderHeldItems();
        if (this.addBrunoGrowthXP) this.addBrunoGrowthXP(15, 'Смаколик для Бруно!');
        if (window.soundFX && window.soundFX.playBark) window.soundFX.playBark();
        if (this.spawnPoseParticles) this.spawnPoseParticles(['🐶', '🍖', '💖', '✨']);
        this.showDanikaThought(`Бруно з задоволенням з’їв «${dish.title}»! +15 XP Бруно! 🐶💖`);
        this.speak(`Гав-гав! Бруно дуже сподобалася страва ${dish.title}!`);
        this.saveState();
        return;
      }
      return origHandleBrunoClick.apply(this, arguments);
    };
  }

  // 7. Розширена Жива Кімната Avatar World: Шафа швидкого перевдягання + День/Ніч + Дискотека
  AdventureWorldGame.prototype.toggleLiveClosetStrip = function (event) {
    if (event) event.stopPropagation();
    const st = this.ensureAvatarLiveRoomState();
    st.closetStripOpen = !st.closetStripOpen;
    if (window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
    if (st.closetStripOpen) {
      this.walkDanikaTo(40);
      this.showDanikaThought('Обирай будь-яке вбрання прямо з шафи! 👗✨');
    }
    this.renderAvatarLiveRoom();
  };

  AdventureWorldGame.prototype.toggleLiveNightMode = function (event) {
    if (event) event.stopPropagation();
    const st = this.ensureAvatarLiveRoomState();
    st.nightMode = !st.nightMode;
    if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    if (st.nightMode) {
      this.spawnPoseParticles(['🌙', '⭐', '✨']);
      this.showDanikaThought('Затишний вечірній режим увімкнено! 🌙✨');
    } else {
      this.spawnPoseParticles(['☀️', '🌈', '✨']);
      this.showDanikaThought('Сонячний день повернувся! ☀️🌈');
    }
    this.renderAvatarLiveRoom();
  };

  AdventureWorldGame.prototype.toggleLiveDanceParty = function (event) {
    if (event) event.stopPropagation();
    const st = this.ensureAvatarLiveRoomState();
    st.danceParty = !st.danceParty;
    const danikaEl = document.getElementById('character-danika');
    const brunoEl = document.getElementById('character-bruno');

    if (st.danceParty) {
      this.prepareDanikaForWalking();
      if (danikaEl) danikaEl.classList.add('avatar-party-dance');
      if (brunoEl) brunoEl.classList.add('avatar-party-dance');
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      if (this.spawnPoseParticles) this.spawnPoseParticles(['🎵', '🎶', '💃', '🕺', '✨']);
      this.showDanikaThought('Ура! Танцювальна вечірка з Бруно! 🎵💃🐶');
      if (this._partyNoteTimer) clearInterval(this._partyNoteTimer);
      this._partyNoteTimer = setInterval(() => {
        if (!this.state.avatarLiveRoom || !this.state.avatarLiveRoom.danceParty) {
          clearInterval(this._partyNoteTimer);
          return;
        }
        if (this.spawnPoseParticles) this.spawnPoseParticles(['🎵', '🎶', '✨']);
      }, 1400);
    } else {
      if (danikaEl) danikaEl.classList.remove('avatar-party-dance');
      if (brunoEl) brunoEl.classList.remove('avatar-party-dance');
      if (this._partyNoteTimer) clearInterval(this._partyNoteTimer);
      if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    }
    this.renderAvatarLiveRoom();
  };

  const origRenderAvatarLiveRoom = AdventureWorldGame.prototype.renderAvatarLiveRoom;
  AdventureWorldGame.prototype.renderAvatarLiveRoom = function () {
    origRenderAvatarLiveRoom.apply(this, arguments);
    const stage = document.getElementById('avatar-live-room-stage');
    if (!stage) return;
    const st = this.ensureAvatarLiveRoomState();

    // Зупиняємо спливання кліків з меблів на підлогу
    stage.querySelectorAll('.live-obj, .live-bed-blanket-foreground, .live-hide-seek-fab').forEach(el => {
      el.addEventListener('click', (ev) => ev.stopPropagation());
    });

    // Нічне підсвічування кімнати
    stage.classList.toggle('live-room-night', Boolean(st.nightMode));

    // Компактні круглі кнопки праворуч угорі: Шафа 👗, Вечірка 🎵, День/Ніч 🌙
    const fabWrap = document.createElement('div');
    fabWrap.className = 'live-quick-fab-group';
    fabWrap.innerHTML = `
      <button type="button" class="live-quick-fab ${st.closetStripOpen ? 'active' : ''}" onclick="window.game.toggleLiveClosetStrip(event)" title="Швидка шафа одягу 👗">👗</button>
      <button type="button" class="live-quick-fab ${st.danceParty ? 'active' : ''}" onclick="window.game.toggleLiveDanceParty(event)" title="Танцювальна вечірка з Бруно 🎵">🎵</button>
      <button type="button" class="live-quick-fab ${st.nightMode ? 'active' : ''}" onclick="window.game.toggleLiveNightMode(event)" title="Перемкнути День / Ніч">${st.nightMode ? '☀️' : '🌙'}</button>
    `;
    stage.appendChild(fabWrap);

    // Якщо відкрито швидку шафу в кімнаті — показуємо карусель одягу Avatar World прямо на сцені
    if (st.closetStripOpen) {
      const outfits = (this.state.wardrobe && Array.isArray(this.state.wardrobe.danikaOutfits))
        ? this.state.wardrobe.danikaOutfits.filter(o => o.unlocked)
        : [];
      const cleanPath = (p) => String(p || '').split('?')[0];
      const strip = document.createElement('div');
      strip.className = 'live-closet-strip';
      strip.onclick = (ev) => ev.stopPropagation();
      strip.innerHTML = `
        <div class="live-closet-strip-head">
          <span>👗 Швидке перевдягання</span>
          <div class="live-closet-strip-actions">
            <button type="button" class="live-closet-all-btn" onclick="window.game.openSideDrawer('wardrobe')">Усі 51 👗</button>
            <button type="button" class="live-closet-close-btn" onclick="window.game.toggleLiveClosetStrip(event)">✕</button>
          </div>
        </div>
        <div class="live-closet-strip-row">
          ${outfits.map(item => {
            const isEq = cleanPath(this.state.activeDanikaAvatar) === cleanPath(item.img);
            return `
              <button type="button" class="live-closet-item ${isEq ? 'equipped' : ''}"
                      onclick="window.game.selectDanikaOutfit('${item.id}')" title="${item.title}">
                <img src="${item.tileIcon || item.img}" alt="${item.title}">
                <span>${item.title.split(' ')[0]}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
      stage.appendChild(strip);
    }
  };

  // Автоініціалізація при завантаженні
  const origInit = AdventureWorldGame.prototype.init;
  AdventureWorldGame.prototype.init = function () {
    const res = origInit.apply(this, arguments);
    this.unlockStarterAvatarWardrobe();
    this.initContinuousWalkControls();
    return res;
  };

  // Якщо екземпляр window.game вже створено до завантаження цього скрипту
  if (window.game) {
    window.game.unlockStarterAvatarWardrobe();
    window.game.initContinuousWalkControls();
    if (window.game.renderWardrobeGrid) window.game.renderWardrobeGrid();
    if (document.getElementById('avatar-live-room-stage')) {
      window.game.renderAvatarLiveRoom();
    }
  }
})();
