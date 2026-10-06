/**
 * "Danika & Bruno: Adventure World (Gandia Edition)"
 * Повний ігровий рушій: 4 кімнати Avatar World, 20 костюмів у гардеробі,
 * 20 ілюстрованих аксесуарів, чорний цвергпінчер Бруно, та інтерактивна карта Гандії.
 */

class AdventureWorldGame {
  constructor() {
    this.state = (typeof DEFAULT_APP_DATA !== 'undefined' && DEFAULT_APP_DATA)
      ? JSON.parse(JSON.stringify(DEFAULT_APP_DATA))
      : null;
    this.selectedDayKey = this.getTodayKey();
    this.activeWardrobeTab = 'danikaOutfits';
    this.activeTabletTab = 'daily';
    this.enteredPin = '';
    this.parentTab = 'phone';
    this.currentAudio = null;
    this.speechVoice = null;
    this._processedRemoteMsgIds = new Set();
    this._viewportScale = 1;
    this._isRotated90 = false;
    this._portraitRotDeg = 90;
  }

  getTodayKey() {
    const day = new Date().getDay();
    const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return map[day] || 'sat';
  }

  init() {
    this.initResponsiveLandscapeViewport();
    this.loadState();
    this.initSpeech();
    this.render();
    this.renderWorldRooms(this.state.activeLocationId || 'loc_home');
    this.initPropsSystem();
    this.initCharacterMovement();
    this.initDraggableCharacters();
    this.switchRoom(this.state.activeRoomIndex || 0, false);
    this.initParentRemoteSync();
    if (window.applyGameIcons) window.applyGameIcons();

    if (window.location.hash) {
      if (window.location.hash.startsWith('#room')) {
        const rIndex = parseInt(window.location.hash.replace('#room', ''));
        if (!isNaN(rIndex)) this.switchRoom(rIndex, false);
      } else if (window.location.hash.startsWith('#loc_')) {
        const locId = window.location.hash.replace('#', '');
        setTimeout(() => this.travelToLocation(locId), 150);
      } else if (window.location.hash === '#map') {
        setTimeout(() => this.openMapModal(), 150);
      } else if (window.location.hash === '#wardrobe') {
        setTimeout(() => this.openWardrobeModal('danikaOutfits'), 150);
      } else if (window.location.hash === '#demo_pin_remote') {
        this.requestParentApproval({
          id: 'clean_toys',
          title: '🧸 Поприбирати іграшки у своїй кімнаті',
          coins: 20,
          xp: 25,
          icon: '🧸',
          isCatalogQuest: true,
          onApproved: () => {}
        });
      } else if (window.location.hash === '#demo_parent_phone') {
        document.getElementById('parent-modal').classList.add('active');
        this.switchParentTab('phone');
      }
    }
  }

  // =========================================================
  // АВТОМАТИЧНИЙ ГОРИЗОНТАЛЬНИЙ РЕЖИМ «ВЕРСІЯ ДЛЯ ПК» НА МОБІЛЬНОМУ
  // =========================================================
  initResponsiveLandscapeViewport() {
    const savedRot = localStorage.getItem('danika_portrait_rot_deg');
    if (savedRot === '-90' || savedRot === '90') {
      this._portraitRotDeg = parseInt(savedRot, 10);
    }

    const updateViewport = () => this.fitViewportToScreen();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewport, 60);
      setTimeout(updateViewport, 250);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }

    // Спроба зафіксувати горизонтальну орієнтацію на підтримуваних мобільних браузерах
    const tryLockLandscape = () => {
      try {
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}
    };
    document.addEventListener('pointerdown', tryLockLandscape, { once: true });

    this.fitViewportToScreen();
  }

  fitViewportToScreen() {
    const container = document.getElementById('game-app-container');
    if (!container) return;

    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const offsetLeft = vv ? vv.offsetLeft : 0;
    const offsetTop = vv ? vv.offsetTop : 0;

    const shortSide = Math.min(vw, vh);
    const longSide = Math.max(vw, vh);
    const isMobileOrCompact = (shortSide < 700) || (longSide < 1180) || (('ontouchstart' in window) && longSide <= 1366);

    const flipBtn = document.getElementById('btn-flip-landscape');

    if (isMobileOrCompact) {
      container.classList.add('mobile-landscape-stage');

      // Якщо телефон тримають вертикально (або увімкнено блокування автоповороту) —
      // автоматично розвертаємо сцену на 90° горизонтально вздовж довгої сторони екрану!
      const isPortrait = vh > vw;
      this._isRotated90 = isPortrait;

      const landW = isPortrait ? vh : vw;
      const landH = isPortrait ? vw : vh;

      const virtualH = 600;
      const aspect = Math.max(1.78, Math.min(2.85, landW / Math.max(1, landH)));
      const virtualW = Math.max(1220, Math.round(virtualH * aspect));

      const scale = Math.min(landW / virtualW, landH / virtualH);
      this._viewportScale = scale;

      container.style.position = 'fixed';
      container.style.width = `${virtualW}px`;
      container.style.height = `${virtualH}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';
      container.style.left = `${offsetLeft + vw / 2}px`;
      container.style.top = `${offsetTop + vh / 2}px`;
      container.style.transformOrigin = 'center center';

      if (isPortrait) {
        container.style.transform = `translate(-50%, -50%) rotate(${this._portraitRotDeg}deg) scale(${scale})`;
        if (flipBtn) flipBtn.style.display = 'inline-flex';
      } else {
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
        if (flipBtn) flipBtn.style.display = 'none';
      }
    } else {
      container.classList.remove('mobile-landscape-stage');
      this._isRotated90 = false;
      this._viewportScale = 1;
      container.style.position = 'relative';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.maxWidth = '1440px';
      container.style.maxHeight = '900px';
      container.style.left = '';
      container.style.top = '';
      container.style.transform = '';
      if (flipBtn) flipBtn.style.display = 'none';
    }
  }

  flipMobileLandscapeDirection() {
    this._portraitRotDeg = (this._portraitRotDeg === 90) ? -90 : 90;
    try {
      localStorage.setItem('danika_portrait_rot_deg', String(this._portraitRotDeg));
    } catch (e) {}
    if (window.soundFX && window.soundFX.playClick) window.soundFX.playClick();
    this.fitViewportToScreen();
  }

  getStageCoords(clientX, clientY, containerEl) {
    const el = containerEl || document.getElementById('world-viewport') || document.getElementById('game-app-container');
    if (!el) {
      return { xPct: 50, yPct: 50, bottomPx: 60, localX: clientX, localY: clientY };
    }
    const rect = el.getBoundingClientRect();
    const scale = this._viewportScale || 1;
    let xPct = 50;
    let yPct = 50;
    let bottomPx = 60;

    if (!this._isRotated90) {
      xPct = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
      yPct = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;
      bottomPx = (rect.bottom - clientY) / scale;
    } else if (this._portraitRotDeg === 90) {
      xPct = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;
      yPct = ((rect.right - clientX) / Math.max(1, rect.width)) * 100;
      bottomPx = (clientX - rect.left) / scale;
    } else {
      xPct = ((rect.bottom - clientY) / Math.max(1, rect.height)) * 100;
      yPct = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
      bottomPx = (rect.right - clientX) / scale;
    }

    const localW = el.offsetWidth || 1280;
    const localH = el.offsetHeight || 600;
    return {
      xPct,
      yPct,
      bottomPx,
      localX: (xPct / 100) * localW,
      localY: (yPct / 100) * localH
    };
  }

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  loadState() {
    const CURRENT_ECONOMY_VERSION = '20261006_1';
    const todayDateStr = this.getTodayDateString();
    const saved = localStorage.getItem('danika_quest_game_v11');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isSameEconomy = (parsed.economyVersion === CURRENT_ECONOMY_VERSION);
        const isSameDay = (parsed.lastActiveDate === todayDateStr);

        this.state = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_APP_DATA)), parsed);
        this.state.economyVersion = CURRENT_ECONOMY_VERSION;
        this.state.lastActiveDate = todayDateStr;
        if (!isSameDay) {
          this.state.claimedHotspotsToday = {};
          this.state.blitzClaimedDate = null;
        } else {
          this.state.claimedHotspotsToday = parsed.claimedHotspotsToday || {};
        }

        const freshWeekly = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.weeklyQuests));
        if (Array.isArray(parsed.weeklyQuests)) {
          const wMap = new Map(parsed.weeklyQuests.map(wq => [wq.id, wq]));
          freshWeekly.forEach(wq => {
            const prev = wMap.get(wq.id);
            if (prev && typeof prev.current === 'number') {
              wq.current = Math.min(wq.max, prev.current);
              wq.lastStepDate = prev.lastStepDate || null;
            }
          });
        }
        this.state.weeklyQuests = freshWeekly;

        this.state.rewards = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.rewards));
        this.state.wardrobe = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.wardrobe));
        const formerlyFreeModernIds = new Set(['danika_tracksuit_modern', 'danika_hoodie_unicorn', 'danika_denim_jacket_set']);
        if (parsed.wardrobe && parsed.wardrobe.danikaOutfits) {
          const unlockedOutfits = new Set(
            parsed.wardrobe.danikaOutfits.filter(o => o.unlocked).map(o => o.id)
          );
          this.state.wardrobe.danikaOutfits.forEach(o => {
            if (unlockedOutfits.has(o.id)) {
              if (!isSameEconomy && formerlyFreeModernIds.has(o.id)) {
                o.unlocked = false;
              } else {
                o.unlocked = true;
              }
            }
          });
        }
        if (parsed.wardrobe && parsed.wardrobe.danikaAccessories) {
          const unlockedAccs = new Set(
            parsed.wardrobe.danikaAccessories.filter(a => a.unlocked).map(a => a.id)
          );
          this.state.wardrobe.danikaAccessories.forEach(a => {
            if (unlockedAccs.has(a.id)) {
              a.unlocked = true;
            }
          });
        }
        const BRUNO_PROGRESSION_VERSION = '20261006_1';
        if (parsed.wardrobe && parsed.wardrobe.brunoOutfits) {
          const unlockedBruno = new Set(
            parsed.wardrobe.brunoOutfits.filter(b => b.unlocked).map(b => b.id)
          );
          this.state.wardrobe.brunoOutfits.forEach(b => {
            if (unlockedBruno.has(b.id) || b.id === 'bruno_dancer') {
              b.unlocked = true;
            }
          });
        }
        this.state.brunoProgressionVersion = BRUNO_PROGRESSION_VERSION;
        if (!isSameEconomy && this.state.tamagotchi) {
          this.state.tamagotchi.maxEnergy = 999;
        }
        if (typeof parsed.brunoHidden === 'boolean') {
          this.state.brunoHidden = parsed.brunoHidden;
        } else {
          this.state.brunoHidden = false;
        }
        this.state.gandiaLocations = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.gandiaLocations));
        this.state.worldLocations = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.worldLocations));
        this.state.rooms = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.rooms));
        if (!parsed.familyProfiles) {
          this.state.familyProfiles = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.familyProfiles));
        } else {
          this.state.familyProfiles = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_APP_DATA.familyProfiles)), parsed.familyProfiles);
          if (this.state.familyProfiles.danika) {
            const savedDanikaQuests = this.state.familyProfiles.danika.quests || [];
            const doneMap = new Map(savedDanikaQuests.map(q => [q.id, q.completed]));
            this.state.familyProfiles.danika.quests = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.familyProfiles.danika.quests)).map(q => ({
              ...q,
              completed: isSameDay && doneMap.has(q.id) ? doneMap.get(q.id) : false
            }));
          }
          if (this.state.familyProfiles.mom) {
            this.state.familyProfiles.mom.name = DEFAULT_APP_DATA.familyProfiles.mom.name;
            this.state.familyProfiles.mom.avatar = DEFAULT_APP_DATA.familyProfiles.mom.avatar;
            this.state.familyProfiles.mom.sprite = DEFAULT_APP_DATA.familyProfiles.mom.sprite;
          }
          if (this.state.familyProfiles.dad) {
            this.state.familyProfiles.dad.name = DEFAULT_APP_DATA.familyProfiles.dad.name;
            this.state.familyProfiles.dad.avatar = DEFAULT_APP_DATA.familyProfiles.dad.avatar;
            this.state.familyProfiles.dad.sprite = DEFAULT_APP_DATA.familyProfiles.dad.sprite;
          }
        }
        if (!this.state.secretRoomConfig) {
          this.state.secretRoomConfig = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.secretRoomConfig));
        }
        const defaultPoses = DEFAULT_APP_DATA.unlockedPoses || [
          "danika_candy", "danika_reading", "danika_ball", "danika_brush_teeth", "danika_sleeping"
        ];
        if (!Array.isArray(this.state.unlockedPoses)) {
          this.state.unlockedPoses = JSON.parse(JSON.stringify(defaultPoses));
        } else {
          defaultPoses.forEach(pId => {
            if (!this.state.unlockedPoses.includes(pId)) this.state.unlockedPoses.push(pId);
          });
        }
        if (!this.state.activeProfileId) {
          this.state.activeProfileId = "danika";
        }
        this.syncFamilyDanika();

        // Завжди підтягуємо актуальні формулювання завдань із DEFAULT_APP_DATA, зберігаючи прогрес
        const freshCatalog = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.questCatalog));
        if (parsed.questCatalog) {
          ['ingame3', 'once5', 'repeatable5', 'quests10', 'quests20', 'projects30'].forEach(catKey => {
            if (Array.isArray(freshCatalog[catKey]) && Array.isArray(parsed.questCatalog[catKey])) {
              const savedMap = new Map(parsed.questCatalog[catKey].map(item => [item.id, item]));
              freshCatalog[catKey].forEach(item => {
                const prev = savedMap.get(item.id);
                if (prev) {
                  if (catKey === 'ingame3' || catKey === 'once5') {
                    item.completed = isSameDay ? Boolean(prev.completed) : false;
                  } else if (typeof prev.completed === 'boolean') {
                    item.completed = prev.completed;
                  }
                  if (typeof prev.counter === 'number') item.counter = prev.counter;
                  if (catKey === 'repeatable5') {
                    item.dailyCount = isSameDay ? (prev.dailyCount || 0) : 0;
                  }
                }
              });
            }
          });
        }
        this.state.questCatalog = freshCatalog;

        const freshSchedule = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.weekSchedule));
        if (isSameEconomy && parsed.weekSchedule) {
          Object.keys(freshSchedule).forEach(dayKey => {
            if (parsed.weekSchedule[dayKey] && Array.isArray(parsed.weekSchedule[dayKey].quests)) {
              const savedDayMap = new Map(parsed.weekSchedule[dayKey].quests.map(q => [q.id, q]));
              freshSchedule[dayKey].quests.forEach(q => {
                const prev = savedDayMap.get(q.id);
                if (prev) {
                  if (typeof prev.completed === 'boolean') q.completed = prev.completed;
                  if (typeof prev.counter === 'number') q.counter = prev.counter;
                  q.dailyCount = isSameDay ? (prev.dailyCount || 0) : 0;
                }
              });
            }
          });
        }
        this.state.weekSchedule = freshSchedule;
      } catch (e) {
        this.state = JSON.parse(JSON.stringify(DEFAULT_APP_DATA));
        this.state.economyVersion = CURRENT_ECONOMY_VERSION;
        this.state.brunoProgressionVersion = '20261005_4';
        this.state.lastActiveDate = todayDateStr;
      }
    } else {
      this.state = JSON.parse(JSON.stringify(DEFAULT_APP_DATA));
      this.state.economyVersion = CURRENT_ECONOMY_VERSION;
      this.state.brunoProgressionVersion = '20261005_4';
      this.state.lastActiveDate = todayDateStr;
      this.syncFamilyDanika();
    }

    // Перевірка коректності та актуальності аватарів
    const unlockedDanikaOutfits = this.state.wardrobe.danikaOutfits.filter(o => o.unlocked).map(o => o.img);
    const cleanAvatarPath = (p) => String(p || '').split('?')[0];
    const matchedDanikaOutfit = this.state.wardrobe.danikaOutfits.find(
      o => o.unlocked && cleanAvatarPath(o.img) === cleanAvatarPath(this.state.activeDanikaAvatar)
    );
    if (matchedDanikaOutfit) {
      this.state.activeDanikaAvatar = matchedDanikaOutfit.img;
    } else {
      this.state.activeDanikaAvatar = DEFAULT_APP_DATA.activeDanikaAvatar;
    }

    const cleanPath = (p) => String(p || '').split('?')[0];
    const matchedBruno = this.state.wardrobe.brunoOutfits.find(
      b => (b.id === this.state.activeBrunoPoseId || cleanPath(b.img) === cleanPath(this.state.activeBrunoAvatar)) && b.unlocked
    );
    if (matchedBruno) {
      this.state.activeBrunoAvatar = matchedBruno.img;
      this.state.activeBrunoPoseId = matchedBruno.id;
    } else {
      this.state.activeBrunoAvatar = DEFAULT_APP_DATA.activeBrunoAvatar;
      this.state.activeBrunoPoseId = 'bruno_happy';
    }

    if (this.state.activeRoomIndex === undefined || this.state.activeRoomIndex < 0 || this.state.activeRoomIndex > 4) {
      this.state.activeRoomIndex = 0;
    }
    if (!this.state.worldLocations) {
      this.state.worldLocations = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.worldLocations));
    }
    if (!this.state.activeLocationId || !this.state.worldLocations[this.state.activeLocationId]) {
      this.state.activeLocationId = 'loc_home';
    }
    if (!this.state.tamagotchi) {
      this.state.tamagotchi = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.tamagotchi));
    }
    if (this.state.activeDanikaPose === undefined) {
      this.state.activeDanikaPose = null;
    }
    if (!this.state.collectedStickers) {
      this.state.collectedStickers = [];
    }
    if (!this.state.familyNotes) {
      this.state.familyNotes = [];
    }
    if (!this.state.brunoSpecialGifts) {
      this.state.brunoSpecialGifts = [];
    }
    if (!this.state.claimedHotspotsToday) {
      this.state.claimedHotspotsToday = {};
    }
  }

  saveState() {
    localStorage.setItem('danika_quest_game_v11', JSON.stringify(this.state));
  }

  initSpeech() {
    if (!('speechSynthesis' in window)) return;
    const pickVoice = (langPrefix) => {
      const voices = window.speechSynthesis.getVoices() || [];
      const byLang = voices.filter(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith(langPrefix));
      if (!byLang.length) return null;
      const score = (v) => {
        const n = (v.name || '').toLowerCase();
        let sc = 0;
        if (n.includes('natural') || n.includes('online')) sc += 100;   // нейронні голоси Microsoft (Polina / Ostap)
        if (n.includes('polina') || n.includes('lesya') || n.includes('ostap')) sc += 40;
        if (n.includes('google')) sc += 60;                              // Google українська
        if (v.localService === false) sc += 10;
        if (n.includes('microsoft') && !n.includes('online') && !n.includes('natural')) sc -= 20; // старі робо-голоси
        return sc;
      };
      return byLang.sort((x, y) => score(y) - score(x))[0];
    };
    const updateVoices = () => {
      this.speechVoice = pickVoice('uk');
      this.speechVoiceEs = pickVoice('es');
    };
    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  cleanTextForSpeech(text, lang = 'uk') {
    if (!text) return "";
    let t = String(text)
      .replace(/🪙/g, lang === 'uk' ? ' монет ' : ' monedas ')
      .replace(/💎/g, lang === 'uk' ? ' кристалів ' : ' cristales ')
      .replace(/⭐/g, lang === 'uk' ? ' балів досвіду ' : ' estrellas ')
      // емодзі та службові символи
      .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ')
      .replace(/[*#_~^|<>\[\]{}•●→←]/g, ' ');
    if (lang === 'uk') {
      t = t
        // латинські назви та імена -> чиста українська вимова
        .replace(/\bColegio\s+Abec[eé]\b/gi, 'школи Абесе')
        .replace(/\bAbec[eé]\b/gi, 'Абесе')
        .replace(/\bLa\s+Vital\b/gi, 'Ла Віталь')
        .replace(/\bMercadona\b/gi, 'Меркадона')
        .replace(/\bChachi\s+Piruli\b/gi, 'Чачі Пірулі')
        .replace(/\bPlatja\s+de\s+Gandia\b/gi, 'Пляж Гандії')
        .replace(/\bGandia\b/gi, 'Гандія')
        .replace(/\bDanika\b/gi, 'Даніка')
        .replace(/\bBruno\b/gi, 'Бруно')
        .replace(/\bYouTube\b/gi, 'Ютуб')
        .replace(/\bRoblox\b/gi, 'Роблокс')
        .replace(/\bVIP\b/gi, 'віп')
        .replace(/\bPIN\b/g, 'пін')
        .replace(/Кооп-місія/gi, 'Спільна місія')
        .replace(/Сєкрєтн/gi, 'секретн')
        .replace(/Сєкрєтная комната/gi, 'Секретна кімната')
        // гроші, слеші та числа
        .replace(/\(\s*€\s*(\d+)\s*\)/g, '$1 євро')
        .replace(/€\s*(\d+)/g, '$1 євро')
        .replace(/(\d+)\s*€/g, '$1 євро')
        .replace(/\+\s*(\d+)/g, 'плюс $1')
        .replace(/(\d+)\s*\/\s*(\d+)/g, '$1 із $2')
        .replace(/разів\s*\/\s*день/gi, 'разів на день')
        .replace(/([а-яіїєґА-ЯІЇЄҐ]+)\s*\/\s*([а-яіїєґА-ЯІЇЄҐ]+)/g, '$1 або $2')
        .replace(/\bXP\b/g, 'балів досвіду')
        .replace(/\bхв\b\.?/gi, 'хвилин')
        .replace(/[«»"“”]/g, '')
        .replace(/\s[-–—]\s/g, ', ')
        .replace(/\.{2,}/g, '.')
        .replace(/!{2,}/g, '!');
    }
    return t.replace(/\s+([,.!?;:])/g, '$1').replace(/\s+/g, ' ').trim();
  }

  // Розбиваємо на речення (<=170 символів), щоб браузерні голоси не обрізали та не «глючили» на довгому тексті
  splitSpeechChunks(text, maxLen = 170) {
    const sentences = text.match(/[^.!?…]+[.!?…]*/g) || [text];
    const chunks = [];
    let cur = '';
    sentences.forEach(sn => {
      sn = sn.trim();
      if (!sn) return;
      if ((cur + ' ' + sn).trim().length <= maxLen) {
        cur = (cur + ' ' + sn).trim();
      } else {
        if (cur) chunks.push(cur);
        if (sn.length <= maxLen) {
          cur = sn;
        } else {
          const parts = sn.split(/(?<=,)\s+/);
          cur = '';
          parts.forEach(pt => {
            if ((cur + ' ' + pt).trim().length <= maxLen) cur = (cur + ' ' + pt).trim();
            else { if (cur) chunks.push(cur); cur = pt.slice(0, maxLen); }
          });
        }
      }
    });
    if (cur) chunks.push(cur);
    return chunks;
  }

  speakQuest(questId, fallbackText = '') {
    if (window.soundFX && typeof window.soundFX.playClick === 'function') {
      window.soundFX.playClick();
    }
    const manifest = (typeof window !== 'undefined' && window.UK_VOICE_MANIFEST) ? window.UK_VOICE_MANIFEST : null;
    if (manifest && questId && manifest[questId]) {
      this.speak(manifest[questId].text || fallbackText, 'uk', questId);
      return;
    }
    this.speak(fallbackText, 'uk', questId);
  }

  speak(rawText, lang = 'uk', audioKey = null, onEndedCallback = null) {
    if (!this.state.speechEnabled) {
      if (typeof onEndedCallback === 'function') {
        setTimeout(onEndedCallback, 300);
      }
      return;
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = "";
      } catch (e) {}
      this.currentAudio = null;
    }
    const synthOk = 'speechSynthesis' in window;
    if (synthOk) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    const token = (this._speechToken = (this._speechToken || 0) + 1);
    const manifest = (typeof window !== 'undefined' && window.UK_VOICE_MANIFEST) ? window.UK_VOICE_MANIFEST : null;

    const normForMatch = (s) => String(s || '')
      .toLowerCase()
      .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/[^a-zа-яіїєґ0-9]/gi, '');

    // 1. Пріоритет: студійна нейронна озвучка uk-UA-PolinaNeural / es-ES-ElviraNeural із локального MP3
    let entry = null;
    if (manifest && audioKey) {
      entry = manifest[audioKey] || manifest[`pose_${audioKey}`] || null;
    }
    if (!entry && manifest && rawText) {
      const trimmed = String(rawText).trim();
      const normRaw = normForMatch(trimmed);
      for (const k of Object.keys(manifest)) {
        if (manifest[k].text === trimmed || (normRaw.length > 6 && normForMatch(manifest[k].text) === normRaw)) {
          entry = manifest[k];
          break;
        }
      }
    }

    if (entry && entry.audio) {
      try {
        const audio = new Audio(`${entry.audio}?v=20261006_1`);
        this.currentAudio = audio;
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          if (token === this._speechToken && typeof onEndedCallback === 'function') {
            onEndedCallback();
          }
        };
        audio.onended = done;
        audio.onerror = () => {
          if (!finished) {
            finished = true;
            this._speakFallback(rawText, lang, token, onEndedCallback);
          }
        };
        audio.play().catch(() => {
          if (!finished) {
            finished = true;
            this._speakFallback(rawText, lang, token, onEndedCallback);
          }
        });
        return;
      } catch (e) {}
    }

    this._speakFallback(rawText, lang, token, onEndedCallback);
  }

  _speakFallback(rawText, lang = 'uk', token = 0, onEndedCallback = null) {
    const cleanText = this.cleanTextForSpeech(rawText, lang);
    if (!cleanText) {
      if (typeof onEndedCallback === 'function') onEndedCallback();
      return;
    }

    const synthOk = 'speechSynthesis' in window;
    const voice = lang === 'es' ? this.speechVoiceEs : this.speechVoice;
    const langTag = lang === 'es' ? 'es-ES' : 'uk-UA';
    const chunks = this.splitSpeechChunks(cleanText);

    // Перевіряємо, чи є локальний голос справжнім нейронним (Microsoft Online Natural).
    // Старі локальні голоси на iOS (Lesya) та Android часто коверкають українські наголоси,
    // тому при наявності інтернету віддаємо перевагу чистій онлайн-озвучці!
    const vName = voice ? (voice.name || '').toLowerCase() : '';
    const isHighQualityNeuralVoice = vName.includes('natural') || vName.includes('polina') || vName.includes('ostap');

    const playViaBrowserSynth = () => {
      if (!synthOk) {
        if (typeof onEndedCallback === 'function') onEndedCallback();
        return;
      }
      try {
        setTimeout(() => {
          if (token !== this._speechToken) return;
          chunks.forEach((ch, idx) => {
            const u = new SpeechSynthesisUtterance(ch);
            if (voice) u.voice = voice;
            u.lang = langTag;
            u.pitch = 1.04;
            u.rate = 0.96;
            u.volume = 1;
            if (idx === chunks.length - 1 && typeof onEndedCallback === 'function') {
              u.onend = () => {
                if (token === this._speechToken) onEndedCallback();
              };
            }
            window.speechSynthesis.speak(u);
          });
        }, 50);
      } catch (e) {
        if (typeof onEndedCallback === 'function') onEndedCallback();
      }
    };

    if (isHighQualityNeuralVoice && synthOk) {
      playViaBrowserSynth();
      return;
    }

    // Чиста українська онлайн-озвучка по реченнях (якщо немає нейронного голосу в браузері)
    try {
      const queue = chunks.slice();
      const playNext = () => {
        if (token !== this._speechToken) return;
        if (!queue.length) {
          if (typeof onEndedCallback === 'function') onEndedCallback();
          return;
        }
        const part = encodeURIComponent(queue.shift());
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang === 'es' ? 'es' : 'uk'}&client=tw-ob&q=${part}`;
        const audio = new Audio(url);
        this.currentAudio = audio;
        audio.onended = playNext;
        audio.onerror = () => playViaBrowserSynth();
        audio.play().catch(() => playViaBrowserSynth());
      };
      playNext();
    } catch (e) {
      playViaBrowserSynth();
    }
  }

  launchConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#38bdf8', '#22c55e', '#a855f7']
      });
    }
  }

  addXP(amount) {
    const prevDanikaXp = this.state.xp || 0;
    this.state.xp += amount;
    this.syncFamilyDanika();
    const currentLevelObj = this.state.levels.find(l => l.level === this.state.level);
    if (currentLevelObj && this.state.xp >= currentLevelObj.maxXp && this.state.level < 10) {
      this.state.level += 1;
      const nextLevelObj = this.state.levels.find(l => l.level === this.state.level);
      this.state.xpForNextLevel = nextLevelObj ? nextLevelObj.maxXp : 99999;
      
      window.soundFX.playVictory();
      this.launchConfetti();
      
      setTimeout(() => {
        alert(`🎉 ВІТАЄМО, DANIKA! 🎉\nТи досягла Рівня ${this.state.level}: «${nextLevelObj.title}»! 👑`);
        this.speak(`Ура! Вітаю, Даніка! Новий рівень: ${nextLevelObj.title}!`);
      }, 300);
    }
    this.checkFamilyOvertake(prevDanikaXp);
    this.saveState();
  }

  selectDay(dayKey) {
    this.selectedDayKey = dayKey;
    window.soundFX.playClick();
    this.render();
  }

  // =========================================================
  // УНІФІКОВАНИЙ СВІТ ЛОКАЦІЙ (ПО 4 ЕКРАНИ У КОЖНІЙ ЛОКАЦІЇ)
  // =========================================================
  renderWorldRooms(locId) {
    if (!this.state) {
      this.loadState();
    }
    if (!this.state.worldLocations) {
      this.state.worldLocations = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.worldLocations));
    }
    if (!locId || !this.state.worldLocations[locId]) {
      locId = 'loc_home';
    }
    this.state.activeLocationId = locId;
    const loc = this.state.worldLocations[locId];
    if (!loc || !loc.rooms) return;

    const roomCount = loc.rooms.length;
    const slideWidthPct = 100 / roomCount;

    const track = document.getElementById('world-rooms-track');
    if (track) {
      track.style.width = `${roomCount * 100}%`;
      track.innerHTML = loc.rooms.map((room, rIdx) => {
        const hsHtml = (room.hotspots || []).map(hs => {
          if (this.isRoomHotspotCompleted && this.isRoomHotspotCompleted(hs)) {
            return '';
          }
          const cls = hs.cls || '';
          const posStyle = [
            hs.top ? `top: ${hs.top};` : '',
            hs.left ? `left: ${hs.left};` : '',
            hs.bottom ? `bottom: ${hs.bottom};` : '',
            hs.right ? `right: ${hs.right};` : '',
            (hs.top && hs.left && !hs.cls) ? 'transform: translate(-50%, -50%);' : ''
          ].filter(Boolean).join(' ');

          const clickAction = hs.action ? `onclick="window.game._lastClickedHotspotId='${hs.id || ''}'; window.game.${hs.action}"` : '';
          const iconMarkup = window.getGameIcon ? window.getGameIcon(hs.icon || '✨') : (hs.icon || '✨');
          const tagIdAttr = hs.id === 'bed' ? 'id="tag-bed"' : (hs.id === 'kitchen-sink' ? 'id="tag-kitchen-dishes"' : '');
          const textIdAttr = hs.id === 'bed' ? 'id="tag-bed-text"' : (hs.id === 'kitchen-sink' ? 'id="tag-dishes-text"' : '');

          return `
            <div class="room-hotspot ${cls}" id="hotspot-${hs.id || rIdx}" style="${posStyle}" ${clickAction}>
              <div class="hotspot-tag" ${tagIdAttr}>
                <span class="hotspot-world-icon">${iconMarkup}</span>
                <span class="hotspot-tooltip-pill" ${textIdAttr}>${hs.text || ''}</span>
              </div>
            </div>
          `;
        }).join('');

        const isSecretRoom = (room.id === 'room_secret');
        const secretStageHtml = isSecretRoom ? `<div id="secret-furniture-stage" class="secret-furniture-stage"></div>` : '';
        const learningDockHtml = this.getRoomLearningDockHtml ? this.getRoomLearningDockHtml(locId, room.id) : '';

        return `
          <div class="world-room-slide ${isSecretRoom ? 'room-secret-slide' : ''}" id="room-slide-${rIdx}" style="width: ${slideWidthPct}%; background-image: url('${room.bg}?v=20261004_3');">
            ${hsHtml}
            ${learningDockHtml}
            ${secretStageHtml}
          </div>
        `;
      }).join('');
    }

    // Оновлення перемикача кімнат у шапці HUD
    const switcherBar = document.querySelector('.room-switcher-bar');
    if (switcherBar) {
      let homeBtnHtml = '';
      if (locId !== 'loc_home') {
        const homeIconSvg = window.getGameIcon ? window.getGameIcon('icon-home') : '🏠';
        const homeRemaining = this.countUncompletedLearningInLocation ? this.countUncompletedLearningInLocation('loc_home') : 0;
        homeBtnHtml = `
          <button class="room-switcher-pill btn-home-pill" onclick="window.game.switchLocation('loc_home', 0)" title="Повернутися додому в квартиру">
            <span class="room-pill-icon">${homeIconSvg}</span>
            <span class="room-pill-tip">Додому${homeRemaining > 0 ? ` (${homeRemaining})` : ''}</span>
          </button>
        `;
      }

      const roomIconKeys = ['icon-room-bed', 'icon-room-bath', 'icon-room-kitchen', 'icon-room-studio', 'icon-room-secret'];
      const roomPillsHtml = loc.rooms.map((room, idx) => {
        const iconKey = (locId === 'loc_home' && roomIconKeys[idx]) ? roomIconKeys[idx] : (room.shortName ? room.shortName.split(' ')[0] : 'icon-home');
        const iconSvg = window.getGameIcon ? window.getGameIcon(iconKey) : (roomIconKeys[idx] || '🚪');
        const cleanName = (room.shortName || room.name).replace(/^[^\w\sа-яА-ЯіїєґІЇЄҐ]+/, '').trim();
        const roomTasksLeft = this.countUncompletedLearningInRoom ? this.countUncompletedLearningInRoom(locId, room.id) : 0;
        const badgeHtml = roomTasksLeft > 0 ? `<span class="room-pill-task-count">${roomTasksLeft}</span>` : '';
        return `
          <button id="pill-room-${idx}" class="room-switcher-pill ${idx === (this.state.activeRoomIndex || 0) ? 'active' : ''}" onclick="window.game.switchRoom(${idx})" title="${room.name} (${roomTasksLeft} завдань у кімнаті)">
            <span class="room-pill-icon">${iconSvg}</span>
            ${badgeHtml}
            <span class="room-pill-tip">${cleanName}${roomTasksLeft > 0 ? ` (${roomTasksLeft})` : ''}</span>
          </button>
        `;
      }).join('');

      switcherBar.innerHTML = homeBtnHtml + roomPillsHtml;
    }

    const curIndex = Math.min(this.state.activeRoomIndex || 0, roomCount - 1);
    this.state.activeRoomIndex = curIndex;
    if (track) {
      track.style.transform = `translateX(-${curIndex * slideWidthPct}%)`;
    }
    
    // Перевірка, чи це Сєкрєтная комната
    const activeRoomObj = loc.rooms[curIndex];
    const buildBtn = document.getElementById('btn-secret-build-toggle');
    if (activeRoomObj && activeRoomObj.id === 'room_secret') {
      if (buildBtn) buildBtn.style.display = 'flex';
      setTimeout(() => this.renderSecretRoom(), 50);
    } else {
      if (buildBtn) buildBtn.style.display = 'none';
      const buildToolbar = document.getElementById('secret-build-toolbar');
      if (buildToolbar) buildToolbar.style.display = 'none';
    }
  }

  switchLocation(locId, roomIdx = 0) {
    if (!this.state) {
      this.loadState();
    }
    if (!this.state.worldLocations) {
      this.state.worldLocations = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.worldLocations));
    }
    if (!locId || !this.state.worldLocations[locId]) {
      locId = 'loc_home';
    }
    this.state.activeLocationId = locId;
    this.state.activeRoomIndex = roomIdx;
    this.renderWorldRooms(locId);
    this.switchRoom(roomIdx, false);
    window.soundFX.playSparkle();

    const loc = this.state.worldLocations[locId];
    if (loc) {
      if (locId === 'loc_home') {
        this.speak("Ми повернулися додому! Затишна квартира Даніки та Бруно!");
      } else {
        this.speak(`Прибули до локації: ${loc.title}! Чудової пригоди!`);
      }
    }

    this.closeModal('map-modal');
    this.closeModal('action-modal');
    this.saveState();
  }

  // =========================================================
  // МУЛЬТИРУМ: ГОРИЗОНТАЛЬНА НАВІГАЦІЯ (AVATAR WORLD)
  // =========================================================
  switchRoom(index, playSound = true) {
    const currentLoc = this.state.worldLocations ? this.state.worldLocations[this.state.activeLocationId || 'loc_home'] : null;
    const roomCount = (currentLoc && currentLoc.rooms) ? currentLoc.rooms.length : 5;
    if (index < 0 || index >= roomCount) return;
    this.state.activeRoomIndex = index;
    
    if (playSound) {
      window.soundFX.playWhoosh();
    }

    const slideWidthPct = 100 / roomCount;
    const track = document.getElementById('world-rooms-track');
    if (track) {
      track.style.transform = `translateX(-${index * slideWidthPct}%)`;
    }

    // Оновлення кнопок перемикача кімнат
    for (let i = 0; i < roomCount; i++) {
      const pill = document.getElementById(`pill-room-${i}`);
      if (pill) {
        if (i === index) pill.classList.add('active');
        else pill.classList.remove('active');
      }
    }

    const currentRoom = currentLoc && currentLoc.rooms ? currentLoc.rooms[index] : null;
    if (currentRoom && playSound) {
      this.speak(currentRoom.name);
    }

    // Сєкрєтная комната
    const buildBtn = document.getElementById('btn-secret-build-toggle');
    if (currentRoom && currentRoom.id === 'room_secret') {
      if (buildBtn) buildBtn.style.display = 'flex';
      setTimeout(() => this.renderSecretRoom(), 50);
    } else {
      if (buildBtn) buildBtn.style.display = 'none';
      const buildToolbar = document.getElementById('secret-build-toolbar');
      if (buildToolbar) buildToolbar.style.display = 'none';
      const itemPicker = document.getElementById('secret-item-picker-drawer');
      if (itemPicker) itemPicker.style.display = 'none';
    }

    // Інтерактивні предмети поточної кімнати (Drag & Drop)
    if (this.renderRoomProps) {
      this.renderRoomProps(index);
    }

    if (this.isBrunoStationary()) {
      this.applyBrunoFloorPosition(false);
    }

    this.saveState();
  }

  nextRoom() {
    const currentLoc = this.state.worldLocations ? this.state.worldLocations[this.state.activeLocationId || 'loc_home'] : null;
    const roomCount = (currentLoc && currentLoc.rooms) ? currentLoc.rooms.length : 4;
    const cur = this.state.activeRoomIndex || 0;
    const next = (cur + 1) % roomCount;
    this.switchRoom(next, true);
  }

  prevRoom() {
    const currentLoc = this.state.worldLocations ? this.state.worldLocations[this.state.activeLocationId || 'loc_home'] : null;
    const roomCount = (currentLoc && currentLoc.rooms) ? currentLoc.rooms.length : 4;
    const cur = this.state.activeRoomIndex || 0;
    const prev = (cur - 1 + roomCount) % roomCount;
    this.switchRoom(prev, true);
  }

  // =========================================================
  // ІНТЕРАКТИВИ: КІМНАТА 1 (СПАЛЬНЯ ДАНІКИ)
  // =========================================================
  handleBedClick() {
    window.soundFX.playClick();

    // Якщо Даніка вже спить у ліжку — будимо її
    if (this.state.activeDanikaPose === 'danika_sleeping') {
      this.resetDanikaPose();
      const danikaEl = document.getElementById('character-danika');
      if (danikaEl) {
        danikaEl.style.left = '38%';
        danikaEl.style.bottom = '56px';
        danikaEl.dataset.xPct = 38;
      }
      this.speak("Доброго ранку, Даніко! Ти гарно виспалася та готова до нових звершень! ☀️✨");
      this.showDanikaThought("Пора до нових пригод! 🌈");
      return;
    }

    // Якщо Даніка не в ліжку — переміщуємо на ліжко і вмикаємо позу сну
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.style.left = '18%';
      danikaEl.style.bottom = '115px';
      danikaEl.dataset.xPct = 18;
    }
    this.setDanikaPose('danika_sleeping');
    window.soundFX.playVictory();
    this.spawnPoseParticles(['💤', '🌙', '⭐', '🧸']);
    this.showDanikaThought("Солодкі сни у ліжечку... 💤");
    this.speak("Даніка солодко спить у своєму ліжечку... Ззз... 🌙💤");

    const q = this.state.questCatalog && this.state.questCatalog.once5
      ? this.state.questCatalog.once5.find(item => item.id === 'q_make_bed')
      : null;

    if (q && !q.completed) {
      this.createFloatingFeedback(18, 50, `🛏️ Застелити ліжко: +${q.coins || 10} 🪙 у Планшеті!`);
    }
  }

  handleBookshelfClick() {
    window.soundFX.playClick();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.style.left = '80%';
      danikaEl.style.bottom = '85px';
      danikaEl.dataset.xPct = 80;
    }
    this.setDanikaPose('danika_school_desk');
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:48px; margin-bottom:4px;">📚📖✨</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">ЧАРІВНА КНИЖКОВА ПОЛИЦЯ</h2>
        <p style="font-size:0.86rem; color:#78350f; font-weight:700;">
          Вибирай, що ти сьогодні прочитала або вивчила:
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:2px;">
          <button class="btn-primary" style="background:linear-gradient(135deg,#f59e0b,#d97706); box-shadow:0 4px 0 #b45309; padding:10px 8px; font-size:0.84rem;" 
                  onclick="window.game.closeModal('action-modal'); window.game.openLearningModal('poems');">
            📜 12 Віршиків (+20 🪙)
          </button>
          <button class="btn-primary" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9); box-shadow:0 4px 0 #5b21b6; padding:10px 8px; font-size:0.84rem;" 
                  onclick="window.game.closeModal('action-modal'); window.game.openLearningModal('riddles');">
            ❓ 50 Загадок (+10 🪙)
          </button>
          <button class="btn-primary" style="background:linear-gradient(135deg,#0284c7,#0369a1); box-shadow:0 4px 0 #075985; padding:10px 8px; font-size:0.84rem;" 
                  onclick="window.game.closeModal('action-modal'); window.game.openLearningModal('mathPuzzles');">
            🧮 30 Задачок (+12 🪙)
          </button>
          <button class="btn-primary" style="background:linear-gradient(135deg,#ec4899,#db2777); box-shadow:0 4px 0 #9d174d; padding:10px 8px; font-size:0.84rem;" 
                  onclick="window.game.closeModal('action-modal'); window.game.openLearningModal('englishSets');">
            🇬🇧 100 Слів EN (+15 🪙)
          </button>
        </div>

        <div style="border-top:1.5px dashed #cbd5e1; margin:4px 0;"></div>

        <button class="btn-primary" style="background:#0284c7; box-shadow:0 4px 0 #0369a1; text-align:left; padding:10px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('repeatable5', 'q_rep_spanish');">
          🇪🇸 Прочитала 1 сторінку іспанською (+10 🪙)
        </button>

        <button class="btn-primary" style="background:#059669; box-shadow:0 4px 0 #047857; text-align:left; padding:10px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('repeatable5', 'q_rep_ukrainian');">
          🇺🇦 Прочитала 1 сторінку українською (+10 🪙)
        </button>

        <button class="btn-primary" style="background:#7c3aed; box-shadow:0 4px 0 #6d28d9; text-align:left; padding:10px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('repeatable5', 'q_rep_english');">
          🇬🇧 Вивчила 5 слів англійською (+15 🪙)
        </button>

        <div style="border-top:1.5px dashed #cbd5e1; margin:4px 0;"></div>

        <button class="btn-primary" style="background:#f59e0b; box-shadow:0 4px 0 #d97706; text-align:left; padding:10px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.openPoemModal('grandma');">
          👵 Віршик для Бабусі («Щось мале, руде...») (+30 🪙)
        </button>

        <button class="btn-primary" style="background:#ec4899; box-shadow:0 4px 0 #be185d; text-align:left; padding:10px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.openPoemModal('spanish');">
          🦋 Вірш іспанською («Mariposa del aire...») (+30 🪙)
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  handleTerrariumClick() {
    window.soundFX.playClick();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.style.left = '78%';
      danikaEl.style.bottom = '85px';
      danikaEl.dataset.xPct = 78;
    }
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const q = this.state.questCatalog && this.state.questCatalog.projects30
      ? this.state.questCatalog.projects30.find(item => item.id === 'q_proj_ants')
      : null;
    const isDone = q ? q.completed : false;
    const projCoins = (q && q.coins) ? q.coins : 45;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:52px; margin-bottom:4px;">🐜🔬</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">ШТАБ ДОСЛІДЖЕННЯ МУРАХ</h2>
        <p style="font-size:0.9rem; color:#78350f; font-weight:700;">
          Велика презентація-проект! Нагорода: <b>+${projCoins} 🪙</b>!
        </p>
      </div>

      <div style="background:#fff; border:2.5px solid #16a34a; border-radius:16px; padding:14px; margin-bottom:12px;">
        <div style="font-weight:900; color:#15803d; margin-bottom:6px;">🌟 План твоєї презентації:</div>
        <ul style="font-size:0.86rem; color:#334155; line-height:1.45; padding-left:18px;">
          <li><b>Де живуть:</b> мурашник, підземні тунелі та лісові куполи.</li>
          <li><b>Що їдять:</b> солодкий нектар, насіння та листочки.</li>
          <li><b>Як організоване життя:</b> королева, будівельники, захисники та розвідники.</li>
        </ul>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${isDone ? `
          <div style="text-align:center; padding:12px; background:#dcfce7; color:#15803d; border-radius:12px; font-weight:900;">
            🏆 Проект успішно захищено перед батьками (+${projCoins} 🪙)!
          </div>
        ` : `
          <button class="btn-primary" style="background:#16a34a; box-shadow:0 4px 0 #15803d; padding:14px;" 
                  onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('projects30', 'q_proj_ants');">
            🎤 Захистити презентацію перед батьками (+${projCoins} 🪙)!
          </button>
        `}
      </div>
    `;

    modal.classList.add('active');
  }

  handleSkateClick() {
    window.soundFX.playWhoosh();
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.classList.add('jumping');
      setTimeout(() => danikaEl.classList.remove('jumping'), 600);
    }
    this.launchConfetti();
  }

  // =========================================================
  // ІНТЕРАКТИВИ: КІМНАТА 2 (ВАННА КІМНАТА) ТА ІГРОВІ МІКРО-МІСІЇ (+3 🪙)
  // =========================================================
  tryAutoCompleteIngameQuest(questId) {
    if (!this.state.questCatalog || !Array.isArray(this.state.questCatalog.ingame3)) return false;
    const q = this.state.questCatalog.ingame3.find(item => item.id === questId);
    if (!q || q.completed) return false;
    q.completed = true;
    const rewardCoins = q.coins || 3;
    const rewardXp = q.xp || 10;
    this.state.coins = (this.state.coins || 0) + rewardCoins;
    this.addXP(rewardXp);
    if (window.soundFX && window.soundFX.playCoin) {
      setTimeout(() => window.soundFX.playCoin(), 200);
    }
    this.showDanikaThought(`🎮 Ігрова місія: +${rewardCoins} 🪙!`);
    this.checkBrunoQuestUnlock(questId);
    this.saveState();
    this.render();
    if (document.getElementById('adventure-tablet') && document.getElementById('adventure-tablet').classList.contains('active')) {
      this.renderTabletContent();
    }
    return true;
  }

  handleBathBrunoClick() {
    window.soundFX.playWaterBubble();
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
    this.state.roomState.brunoHappiness = 100;
    this.state.roomState.brunoBathed = true;
    const gotBonus = this.tryAutoCompleteIngameQuest('ig_bath_bruno');
    if (!gotBonus) this.addXP(5);
    this.saveState();

    const brunoEl = document.getElementById('character-bruno');
    if (brunoEl) {
      brunoEl.classList.add('petting');
      setTimeout(() => brunoEl.classList.remove('petting'), 600);
    }

    this.launchConfetti();
    this.speak(gotBonus ? "Бруно чистий та блискучий! Плюс 3 ігрові монетки!" : "Бруно чистий, блискучий та радісно махає хвостиком!");
  }

  handleBrushTeethClick() {
    window.soundFX.playSparkle();
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
    this.state.roomState.teethBrushed = true;
    const gotBonus = this.tryAutoCompleteIngameQuest('ig_brush_teeth');
    this.saveState();

    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.classList.add('jumping');
      setTimeout(() => danikaEl.classList.remove('jumping'), 600);
    }

    this.launchConfetti();
    if (gotBonus) {
      this.speak("Зубки сяють чистотою! Плюс 3 монетки на гардероб!");
    } else {
      this.speak("Зубки чисті та блискучі!");
    }
    this.render();
  }

  // =========================================================
  // ІНТЕРАКТИВИ: КІМНАТА 3 (ЗАТИШНА КУХНЯ)
  // =========================================================
  handleDishesClick() {
    window.soundFX.playClick();
    const q = this.state.questCatalog && this.state.questCatalog.once5
      ? this.state.questCatalog.once5.find(item => item.id === 'q_wash_dishes')
      : null;

    if (q && q.completed) {
      alert("✨ Раковина та стіл блищать чистотою! Пінну місію вже виконано!");
      this.speak("Увесь посуд уже сяє чистотою!");
      return;
    }

    this.completeCatalogQuest('once5', 'q_wash_dishes');
  }

  handleFridgeClick() {
    window.soundFX.playClick();
    this.toggleTablet(true);
  }

  handleBreakfastClick() {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:48px; margin-bottom:4px;">${window.getGameIcon ? window.getGameIcon('🥞', '', 'width:54px;height:54px;') : '🥞'} ${window.getGameIcon ? window.getGameIcon('🥦', '', 'width:54px;height:54px;') : '🥦'}</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">ВІТАМІННА СУПЕР-СИЛА ТА СНІДАНОК</h2>
        <p style="font-size:0.86rem; color:#78350f; font-weight:700;">
          Скуштуй корисне міні-деревце броколі або смачні млинчики!
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn-primary" style="background:#059669; box-shadow:0 4px 0 #047857; text-align:left; padding:12px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('once5', 'q_eat_broccoli');">
          🥦 Вітамінна супер-сила: скуштувати броколі (+12 🪙 + Сюрприз 🎁)
        </button>

        <button class="btn-primary" style="background:#f59e0b; box-shadow:0 4px 0 #d97706; text-align:left; padding:12px 14px;" 
                onclick="window.game.eatBreakfastPancakes(); window.game.closeModal('action-modal');">
          🥞 Поласувати теплими млинчиками (+10 ⭐)
        </button>
      </div>
    `;

    modal.classList.add('active');
    if (window.applyGameIcons) window.applyGameIcons(content);
  }

  eatBreakfastPancakes() {
    window.soundFX.playEat();
    this.addXP(10);
    this.launchConfetti();
    this.speak("Смачного сніданку, Даніко! Чудовий день для нових перемог!");
  }

  feedBruno() {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:48px; margin-bottom:4px;">${window.getGameIcon ? window.getGameIcon('🥣', '', 'width:58px;height:58px;') : '🥣'}</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">ПОРАДУВАТИ ПЕСИКА БРУНО</h2>
        <p style="font-size:0.86rem; color:#78350f; font-weight:700;">
          Насип свіжого корму в реальному житті (+10 🪙) або почастуй віртуального Бруно у грі (+3 🪙)!
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn-primary" style="background:#0284c7; box-shadow:0 4px 0 #0369a1; text-align:left; padding:12px 14px;" 
                onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('once5', 'q_clean_bruno');">
          🥣 У реальному житті: чиста мисочка і килимок Бруно (+10 🪙 + Сюрприз 🎁)
        </button>

        <button class="btn-primary" style="background:#f59e0b; box-shadow:0 4px 0 #d97706; text-align:left; padding:12px 14px;" 
                onclick="window.game.feedBrunoDirect(); window.game.closeModal('action-modal');">
          🦴 У грі: дати смаколик для Бруно просто зараз (+3 🪙 без PIN)
        </button>
      </div>
    `;

    modal.classList.add('active');
    if (window.applyGameIcons) window.applyGameIcons(content);
  }

  feedBrunoDirect() {
    window.soundFX.playEat();
    this.state.roomState.brunoHappiness = 100;
    this.state.roomState.brunoFed = true;
    const gotBonus = this.tryAutoCompleteIngameQuest('ig_feed_bruno');
    if (!gotBonus) this.addXP(5);
    this.saveState();

    const brunoEl = document.getElementById('character-bruno');
    if (brunoEl) {
      brunoEl.classList.add('petting');
      setTimeout(() => brunoEl.classList.remove('petting'), 600);
    }

    this.launchConfetti();
    this.speak(gotBonus ? "Смачного, Бруно! Плюс 3 монетки у твій гаманець!" : "Смачного, Бруно! Ти мій найулюбленіший песик у світі!");
    this.render();
  }

  // =========================================================
  // ІНТЕРАКТИВИ: КІМНАТА 4 (ТВОРЧА МАЙСТЕРНЯ МАМИ)
  // =========================================================
  handleMomEaselClick() {
    window.soundFX.playSparkle();
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:52px; margin-bottom:4px;">🎨🏖️✨</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">МАЛЮНОК ГАНДІЇ З МАМОЮ</h2>
        <p style="font-size:0.9rem; color:#78350f; font-weight:700;">
          Малюємо пляж, море, пальми чи фортецю нашої сонячної Гандії!
        </p>
      </div>

      <div style="background:#fff; border:3px solid #ec4899; border-radius:16px; padding:16px; text-align:center; margin-bottom:14px;">
        <div style="font-size:48px; margin-bottom:6px;">⛵🏖️☀️</div>
        <div style="font-weight:900; color:#1e293b; font-size:1.05rem;">«Наше улюблене місто Гандія»</div>
        <div style="font-size:0.85rem; color:#64748b; margin-top:4px;">Нагорода: +18 🪙 монет | +75 ⭐ досвіду</div>
      </div>

      <button class="btn-primary" style="background:#ec4899; box-shadow:0 4px 0 #be185d; padding:14px;" 
              onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('quests10', 'q_draw_gandia');">
        ✨ Я намалювала малюнок! Здати батькам (+18 🪙)!
      </button>
    `;

    modal.classList.add('active');
  }

  handleCraftClick() {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:52px; margin-bottom:4px;">🦇✂️🎨</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">САМОРОБКА КАЖАНА</h2>
        <p style="font-size:0.9rem; color:#78350f; font-weight:700;">
          Кажан — символ нашого регіону Валенсія! Зроби його з паперу чи картону!
        </p>
      </div>

      <div style="background:#f8fafc; border:2.5px dashed #64748b; border-radius:16px; padding:16px; text-align:center; margin-bottom:14px;">
        <div style="font-size:44px; margin-bottom:6px;">🦇🖤✨</div>
        <div style="font-weight:900; color:#1e293b; font-size:1rem;">Творча поробка: «Симпатичний кажанчик»</div>
        <div style="font-size:0.85rem; color:#64748b; margin-top:4px;">Нагорода: +18 🪙 монет | +75 ⭐ досвіду</div>
      </div>

      <button class="btn-primary" style="background:#6366f1; box-shadow:0 4px 0 #4f46e5; padding:14px;" 
              onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('quests10', 'q_bat_craft');">
        ✂️ Я зробила кажанчика! Здати батькам (+18 🪙)!
      </button>
    `;

    modal.classList.add('active');
  }

  handleSewingClick() {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:52px; margin-bottom:4px;">✍️❤️📖</div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">РОЗПОВІДЬ ПРО МАМУ</h2>
        <p style="font-size:0.9rem; color:#78350f; font-weight:700;">
          Написати у зошиті розповідь на 5 речень українською мовою про улюблену матусю!
        </p>
      </div>

      <div style="background:#fdf2f8; border:2.5px solid #ec4899; border-radius:16px; padding:16px; text-align:center; margin-bottom:14px;">
        <div style="font-size:40px; margin-bottom:4px;">👩‍👧💐</div>
        <div style="font-weight:900; color:#9d174d; font-size:1rem;">«Моя найкраща у світі мама»</div>
        <div style="font-size:0.82rem; color:#64748b; margin-top:4px;">5 красивих речень українською мовою</div>
        <div style="font-size:0.85rem; color:#be185d; font-weight:900; margin-top:6px;">Нагорода: +30 🪙 монет | +120 ⭐ досвіду</div>
      </div>

      <button class="btn-primary" style="background:#ec4899; box-shadow:0 4px 0 #be185d; padding:14px;" 
              onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('quests20', 'q_story_mom_ua');">
        💖 Я написала розповідь! Прочитати мамі (+30 🪙)!
      </button>
    `;

    modal.classList.add('active');
  }

  // =========================================================
  // ПЕРСОНАЖІ: КЛІКИ ТА РЕАКЦІЇ
  // =========================================================
  handleDanikaClick() {
    window.soundFX.playClick();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.classList.add('jumping');
      setTimeout(() => danikaEl.classList.remove('jumping'), 600);
    }

    if (this.state.activeDanikaPose && typeof DANIKA_POSES_CATALOG !== 'undefined' && DANIKA_POSES_CATALOG[this.state.activeDanikaPose]) {
      const p = DANIKA_POSES_CATALOG[this.state.activeDanikaPose];
      this.speak(p.speech);
      const bubbleEl = document.getElementById('danika-speech-bubble');
      if (bubbleEl) {
        bubbleEl.innerText = p.speech;
        bubbleEl.style.display = 'block';
        clearTimeout(this._speechBubbleTimer);
        this._speechBubbleTimer = setTimeout(() => {
          bubbleEl.style.display = 'none';
        }, 4000);
      }
      this.spawnPoseParticles(p.particles || ["✨", "💖"]);
    } else {
      this.toggleActionDrawer(true);
      this.speak("Вибирай, яку дію чи настрій увімкнути!");
    }
  }

  startBrunoDanceShow() {
    this.stopBrunoDanceShow();

    const brunoEl = document.getElementById('character-bruno');
    const brunoMainImg = document.getElementById('bruno-main-img');
    const locBrunoImg = document.getElementById('loc-bruno-img');

    if (brunoEl) {
      brunoEl.classList.add('bruno-dancing-live');
    }

    // Встановлюємо анімовану GIF або покадровий цикл танцю Бруно
    const danceFrames = [
      'assets/characters/bruno_dancer_f1.png?v=20261006_1',
      'assets/characters/bruno_dancer_f2.png?v=20261006_1',
      'assets/characters/bruno_dancer_f3.png?v=20261006_1',
      'assets/characters/bruno_dancer_f4.png?v=20261006_1',
      'assets/characters/bruno_dancer_f5.png?v=20261006_1',
      'assets/characters/bruno_dancer_f6.png?v=20261006_1'
    ];
    let frameIdx = 0;
    this._brunoDanceInterval = setInterval(() => {
      const src = danceFrames[frameIdx % danceFrames.length];
      if (brunoMainImg) brunoMainImg.src = src;
      if (locBrunoImg) locBrunoImg.src = src;
      if (frameIdx % 4 === 0 && brunoEl) {
        const notes = ['🎵', '🎶', '🕺', '✨'];
        const note = document.createElement('div');
        note.className = 'floating-heart';
        note.innerText = notes[(frameIdx / 4) % notes.length];
        note.style.left = `${(parseFloat(brunoEl.style.left) || 52) + (Math.random() * 8 - 4)}%`;
        note.style.bottom = `${(parseFloat(brunoEl.style.bottom) || 55) + 95}px`;
        const stage = document.getElementById('world-viewport') || document.body;
        stage.appendChild(note);
        setTimeout(() => note.remove(), 1100);
      }
      frameIdx++;
    }, 180);

    // Показуємо банер керування піснею
    let banner = document.getElementById('bruno-song-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'bruno-song-banner';
      banner.className = 'bruno-song-banner';
      banner.innerHTML = `
        <span>🎵 Бруно Танцюрист запалює!</span>
        <button type="button" onclick="window.game.stopBrunoDanceShow()">⏹ Стоп</button>
      `;
      const container = document.getElementById('game-app-container') || document.body;
      container.appendChild(banner);
    }

    // Запускаємо пісню Бруно Танцюриста
    const audio = new Audio('assets/audio/bruno_dance_song.mp3?v=20261006_1');
    audio.volume = 0.88;
    this._brunoDanceAudio = audio;
    audio.onended = () => {
      this.stopBrunoDanceShow();
    };
    audio.onerror = () => {
      this.stopBrunoDanceShow();
    };
    audio.play().catch(() => {});
  }

  stopBrunoDanceShow() {
    if (this._brunoDanceInterval) {
      clearInterval(this._brunoDanceInterval);
      this._brunoDanceInterval = null;
    }
    if (this._brunoDanceAudio) {
      try {
        this._brunoDanceAudio.pause();
        this._brunoDanceAudio.currentTime = 0;
      } catch (e) {}
      this._brunoDanceAudio = null;
    }
    const brunoEl = document.getElementById('character-bruno');
    if (brunoEl) {
      brunoEl.classList.remove('bruno-dancing-live');
    }
    const banner = document.getElementById('bruno-song-banner');
    if (banner) banner.remove();

    // Повертаємо поточну картинку Бруно
    if (this.state && this.state.activeBrunoAvatar) {
      const brunoMainImg = document.getElementById('bruno-main-img');
      const locBrunoImg = document.getElementById('loc-bruno-img');
      if (brunoMainImg) brunoMainImg.src = this.state.activeBrunoAvatar;
      if (locBrunoImg) locBrunoImg.src = this.state.activeBrunoAvatar;
    }
  }

  handleBrunoClick(e) {
    window.soundFX.playBark();
    setTimeout(() => window.soundFX.playPetting(), 150);

    const brunoEl = document.getElementById('character-bruno');
    if (brunoEl) {
      brunoEl.classList.add('petting');
      setTimeout(() => brunoEl.classList.remove('petting'), 600);
    }

    const stage = document.getElementById('game-app-container') || document.body;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = '❤️';
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    const coords = this.getStageCoords(x, y, stage);
    heart.style.left = `${coords.localX - 15}px`;
    heart.style.top = `${coords.localY - 20}px`;
    stage.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);

    this.addXP(5);
    this.state.roomState.brunoHappiness = Math.min(100, this.state.roomState.brunoHappiness + 10);
    this.modifyTamagotchi({ happiness: 10 });

    const activeBruno = this.getActiveBrunoItem();
    if (activeBruno && activeBruno.id === 'bruno_dancer') {
      this.showBrunoThought(activeBruno.speech);
      this.speak(activeBruno.speech, 'uk', 'bruno_dancer', () => {
        this.startBrunoDanceShow();
      });
    } else {
      // Відкриваємо контекстне меню поз та образів Бруно при кліку на нього!
      this.toggleBrunoDrawer(true);
      if (activeBruno && activeBruno.speech) {
        this.showBrunoThought(activeBruno.speech);
        this.speak(activeBruno.speech, 'uk', activeBruno.id);
      } else {
        this.speak("Гав-гав! Обери мені круту позу або поклади у лежанку!");
      }
    }

    this.saveState();
  }

  handleBallClick(e) {
    const ball = document.getElementById('toy-ball');
    if (!ball) return;

    window.soundFX.playBallBounce();
    ball.classList.add('thrown');
    // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині

    setTimeout(() => {
      window.soundFX.playBark();
      const brunoEl = document.getElementById('character-bruno');
      if (brunoEl) {
        brunoEl.classList.add('petting');
        setTimeout(() => brunoEl.classList.remove('petting'), 600);
      }
    }, 600);

    setTimeout(() => {
      ball.classList.remove('thrown');
      this.addXP(5);
    }, 1200);
  }

  // =========================================================
  // ТАП-КРОК ТА ПЕРЕМІЩЕННЯ ПЕРСОНАЖІВ (TAP-TO-WALK)
  // =========================================================
  initCharacterMovement() {
    const viewport = document.getElementById('world-viewport');
    if (!viewport || this._movementInitialized) return;
    this._movementInitialized = true;

    viewport.addEventListener('click', (e) => {
      // Ігноруємо кліки по інтерактивних кнопках, шапці та персонажах
      if (e.target.closest('.room-hotspot, button, .character-danika-wrap, .character-bruno-wrap, .room-prop-item, .props-pocket-tray, .tamagotchi-hud, #secret-build-toolbar, #secret-item-picker-drawer, #bruno-poses-drawer, #toy-ball, .danika-actions-drawer')) {
        return;
      }

      // У Секретній кімнаті: якщо клікнули на килимок або підлогу, дозволяємо і ходьбу, але для настінних/верхніх предметів — ні
      const secretEl = e.target.closest('.secret-item, .secret-placed-item');
      if (secretEl && secretEl.id !== 'secret-dom-sr_22_rainbow_rug') {
        return;
      }

      const coords = this.getStageCoords(e.clientX, e.clientY, viewport);
      const clickYRel = coords.yPct / 100;
      // Дозволяємо переміщення по підлозі (нижні 75% екрана)
      if (clickYRel < 0.25) return;

      // Створюємо анімовану хвилю на підлозі
      this.spawnFloorRipple(e.clientX, e.clientY);

      // Визначаємо цільову координату X у відсотках (з обмеженнями безпечних меж)
      const targetXPct = Math.max(10, Math.min(90, coords.xPct));
      this.walkDanikaTo(targetXPct);
    });
  }

  spawnFloorRipple(clientX, clientY) {
    const stage = document.getElementById('game-app-container') || document.body;
    const coords = this.getStageCoords(clientX, clientY, stage);
    const ripple = document.createElement('div');
    ripple.className = 'floor-target-ripple';
    ripple.style.left = `${coords.localX}px`;
    ripple.style.top = `${coords.localY}px`;
    stage.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  walkDanikaTo(targetXPct) {
    const danikaEl = document.getElementById('character-danika');
    const brunoEl = document.getElementById('character-bruno');
    if (!danikaEl) return;

    // Якщо Даніка лежала в ліжку чи сиділа — підвести її для ходьби
    if (this.state.activeDanikaPose === 'danika_sleeping' || this.state.activeDanikaPose === 'danika_school_desk') {
      this.resetDanikaPose();
    }

    // Отримуємо поточну позицію Danika
    const currentXPct = parseFloat(danikaEl.dataset.xPct || danikaEl.style.left) || 42;
    const deltaPct = targetXPct - currentXPct;
    if (Math.abs(deltaPct) < 1.2) return;

    const facingRight = deltaPct > 0;
    const spriteStage = document.getElementById('danika-sprite-stage');
    if (spriteStage) {
      spriteStage.style.setProperty('--flip-x', facingRight ? '1' : '-1');
    }

    // Розрахунок тривалості ходьби (натуральна швидкість ходьби ~22% за секунду)
    const durationSec = Math.max(0.4, Math.min(2.4, Math.abs(deltaPct) / 22));

    if (this._walkTimer) clearTimeout(this._walkTimer);
    if (this._stepInterval) clearInterval(this._stepInterval);

    danikaEl.classList.add('walking');
    danikaEl.style.transition = `left ${durationSec}s ease-in-out`;
    danikaEl.style.left = `${targetXPct}%`;
    danikaEl.dataset.xPct = targetXPct;

    // Процедурний звук кроків
    if (window.soundFX && window.soundFX.playStep) {
      window.soundFX.playStep();
      this._stepInterval = setInterval(() => {
        if (danikaEl.classList.contains('walking')) {
          window.soundFX.playStep();
        }
      }, 260);
    }

    this._walkTimer = setTimeout(() => {
      danikaEl.classList.remove('walking');
      clearInterval(this._stepInterval);
    }, durationSec * 1000);

    // Песик Бруно біжить слідом за Данікою ТІЛЬКИ якщо він не вимкнений і НЕ лежить у лежанці / не спить!
    if (brunoEl && !this.state.brunoHidden && !this.isBrunoStationary()) {
      const brunoOffset = facingRight ? -12 : 12;
      const brunoTargetXPct = Math.max(8, Math.min(92, targetXPct + brunoOffset));
      const brunoSpriteStage = document.getElementById('bruno-sprite-stage');
      if (brunoSpriteStage) {
        brunoSpriteStage.style.setProperty('--bruno-flip-x', facingRight ? '1' : '-1');
      }

      if (this._brunoTimer) clearTimeout(this._brunoTimer);
      setTimeout(() => {
        if (this.state.brunoHidden || this.isBrunoStationary()) return;
        brunoEl.classList.add('trotting');
        brunoEl.style.transition = `left ${durationSec}s ease-in-out`;
        brunoEl.style.left = `${brunoTargetXPct}%`;
        brunoEl.dataset.xPct = brunoTargetXPct;

        this._brunoTimer = setTimeout(() => {
          brunoEl.classList.remove('trotting');
        }, durationSec * 1000);
      }, 160);
    }
  }

  // =========================================================
  // ВІЛЬНЕ ПЕРЕТЯГУВАННЯ ПЕРСОНАЖІВ (DRAGGABLE DANIKA & BRUNO)
  // =========================================================
  initDraggableCharacters() {
    this.makeCharacterDraggable('character-danika', (el, wasDrag, dropX, dropY) => {
      if (!wasDrag) {
        this.handleDanikaClick();
      } else {
        const curRoom = this.state.activeRoomIndex || 0;
        const viewport = document.getElementById('world-viewport');
        const coords = this.getStageCoords(dropX, dropY, viewport);
        const dropXPct = coords.xPct;
        const dropYPct = coords.yPct;

        // 1. Дроп на двоярусне ліжко (Спальня, кімната 0: ліва частина X <= 34%, Y >= 28% та Y <= 85%)
        if (curRoom === 0 && dropXPct <= 34 && dropYPct >= 28 && dropYPct <= 85) {
          el.style.left = '18%';
          el.style.bottom = '115px';
          el.dataset.xPct = 18;
          this.setDanikaPose('danika_sleeping');
          window.soundFX.playVictory();
          this.spawnPoseParticles(['💤', '🌙', '⭐', '🧸']);
          this.showDanikaThought("Солодкі сни у ліжечку... 💤");
          return;
        }

        // 2. Дроп за робочий стіл / парту (Спальня, кімната 0: права частина X >= 66%)
        if (curRoom === 0 && dropXPct >= 66) {
          el.style.left = '80%';
          el.style.bottom = '85px';
          el.dataset.xPct = 80;
          this.setDanikaPose('danika_school_desk');
          window.soundFX.playChime();
          this.spawnPoseParticles(['📖', '✏️', '⭐', '💡']);
          this.showDanikaThought("Вчу уроки за столом! 📚");
          return;
        }

        // 3. Дроп у ванну (Ванна, кімната 1: X <= 44%)
        if (curRoom === 1 && dropXPct <= 44) {
          el.style.left = '26%';
          el.style.bottom = '90px';
          el.dataset.xPct = 26;
          this.setDanikaPose('danika_bubble_bath');
          window.soundFX.playPetting();
          this.spawnBubbleParticles(dropX, dropY);
          this.showDanikaThought("Буль-буль у ванні з піною! 🫧");
          return;
        }

        // 4. Дроп за стіл сніданку (Кухня, кімната 2: X >= 52%)
        if (curRoom === 2 && dropXPct >= 52) {
          el.style.left = '64%';
          el.style.bottom = '95px';
          el.dataset.xPct = 64;
          this.setDanikaPose('danika_hot_cocoa');
          window.soundFX.playSparkle();
          this.spawnPoseParticles(['☕', '🥐', '✨', '😋']);
          this.showDanikaThought("Смачний сніданок за столом! ☕");
          return;
        }
      }
    });

    this.makeCharacterDraggable('character-bruno', (el, wasDrag, dropX, dropY) => {
      if (!wasDrag) {
        this.handleBrunoClick();
      } else {
        const curRoom = this.state.activeRoomIndex || 0;
        const viewport = document.getElementById('world-viewport');
        const coords = this.getStageCoords(dropX, dropY, viewport);
        const dropXPct = coords.xPct;

        // Собаче ліжечко (Спальня: X >= 70% внизу)
        if (curRoom === 0 && dropXPct >= 70) {
          this.selectBrunoStyle('bruno_in_bed', true);
          this.modifyTamagotchi({ happiness: 15 });
          this.spawnPoseParticles(['🐾', '❤️', '🦴']);
          return;
        }

        // Миття у ванні (Ванна: X <= 44%)
        if (curRoom === 1 && dropXPct <= 44) {
          this.handleBathBrunoClick();
          return;
        }
      }
    });
  }

  makeCharacterDraggable(elementId, onComplete) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let startX = 0, startY = 0;
    let isDragging = false;
    let dragThresholdPassed = false;

    const onPointerDown = (e) => {
      // Якщо клікнуто на кнопку дій Даніки, не починаємо драг
      if (e.target.closest('#btn-danika-action-trigger')) return;

      isDragging = true;
      dragThresholdPassed = false;
      startX = e.clientX;
      startY = e.clientY;

      el.setPointerCapture(e.pointerId);
      el.style.transition = 'none';
      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!dragThresholdPassed && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        dragThresholdPassed = true;
        el.classList.add('dragging');
      }

      if (dragThresholdPassed) {
        const coords = this.getStageCoords(e.clientX, e.clientY, el.parentElement);
        const newLeftPct = Math.max(8, Math.min(92, coords.xPct));
        const newBottomPx = Math.max(10, Math.min(240, coords.bottomPx));

        el.style.left = `${newLeftPct}%`;
        el.style.bottom = `${newBottomPx}px`;
        el.dataset.xPct = newLeftPct;
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('dragging');
      try { el.releasePointerCapture(e.pointerId); } catch(err) {}

      if (dragThresholdPassed) {
        if (window.soundFX && window.soundFX.playPlop) {
          window.soundFX.playPlop();
        }
        if (onComplete) onComplete(el, true, e.clientX, e.clientY);
      } else {
        if (onComplete) onComplete(el, false, e.clientX, e.clientY);
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
  }

  // =========================================================
  // СИСТЕМА ІНТЕРАКТИВНИХ ПРЕДМЕТІВ (DRAG & DROP PROPS)
  // =========================================================
  initPropsSystem() {
    this.propsCatalog = {
      prop_pizza: { id: 'prop_pizza', name: 'Піца', emoji: '🍕', category: 'food', hunger: 25, happiness: 10, speech: 'Обожнюю піцу з тягучим сиром! Ням!' },
      prop_apple: { id: 'prop_apple', name: 'Яблуко', emoji: '🍎', category: 'food', hunger: 15, happiness: 10, speech: 'Хрумке соковите яблучко!' },
      prop_croissant: { id: 'prop_croissant', name: 'Круасан', emoji: '🥐', category: 'food', hunger: 20, happiness: 15, speech: 'Теплий хрусткий круасанчик!' },
      prop_juice: { id: 'prop_juice', name: 'Сік', emoji: '🧃', category: 'food', hunger: 15, happiness: 10, speech: 'Смачний освіжаючий сік!' },
      prop_lollipop: { id: 'prop_lollipop', name: 'Льодяник', emoji: '🍭', category: 'food', hunger: 10, happiness: 20, speech: 'Солодкий полуничний льодяник!' },
      prop_dogfood: { id: 'prop_dogfood', name: 'Корм Бруно', emoji: '🥫', category: 'pet', brunoHappiness: 30, speech: 'Бруно, твій улюблений паштет!' },
      prop_bone: { id: 'prop_bone', name: 'Кісточка', emoji: '🦴', category: 'pet', brunoHappiness: 35, speech: 'Бруно обожнює смачні кісточки!' },
      prop_ball: { id: 'prop_ball', name: 'М\'ячик', emoji: '🎾', category: 'toy', brunoHappiness: 20, happiness: 15, speech: 'Лови м\'ячик, Бруно! Апорт!' },
      prop_teddy: { id: 'prop_teddy', name: 'Ведмедик', emoji: '🧸', category: 'toy', happiness: 25, energy: 10, speech: 'Мій улюблений плюшевий ведмедик!' },
      prop_shampoo: { id: 'prop_shampoo', name: 'Шампунь', emoji: '🧴', category: 'hygiene', hygiene: 25, speech: 'Бульбашковий шампунь з піною!' },
      prop_duck: { id: 'prop_duck', name: 'Каченя', emoji: '🦆', category: 'toy', hygiene: 10, happiness: 15, speech: 'Кря-кря! Веселе жовте каченя!' },
      prop_palette: { id: 'prop_palette', name: 'Фарби', emoji: '🎨', category: 'art', happiness: 25, speech: 'Намалюю красиву картину для мами й тата!' },
    };

    this.roomDefaultProps = {
      0: [ // Спальня (на поличці та ліжку, підлога вільна для ходьби!)
        { propId: 'prop_teddy', leftPct: 14, bottomPx: 145 },
        { propId: 'prop_lollipop', leftPct: 76, bottomPx: 265 }
      ],
      1: [ // Ванна
        { propId: 'prop_shampoo', leftPct: 18, bottomPx: 135 },
        { propId: 'prop_duck', leftPct: 30, bottomPx: 135 }
      ],
      2: [ // Кухня
        { propId: 'prop_croissant', leftPct: 80, bottomPx: 230 },
        { propId: 'prop_dogfood', leftPct: 34, bottomPx: 95 }
      ],
      3: [ // Студія
        { propId: 'prop_palette', leftPct: 28, bottomPx: 135 },
        { propId: 'prop_juice', leftPct: 74, bottomPx: 135 }
      ],
      4: [ // Сєкрєтная комната
        { propId: 'prop_teddy', leftPct: 16, bottomPx: 135 }
      ]
    };

    this.renderPropsDrawerItems();
    this.renderRoomProps(this.state.activeRoomIndex || 0);
  }

  renderPropsDrawerItems() {
    const container = document.getElementById('props-tray-items');
    if (!container) return;
    container.innerHTML = Object.values(this.propsCatalog).map(p => {
      const svgIcon = window.getGameIcon ? window.getGameIcon(p.emoji) : p.emoji;
      return `
        <div class="props-tray-item-chip" onclick="window.game.spawnPropInRoom('${p.id}')" title="${p.name}">
          <div class="props-tray-chip-emoji">${svgIcon}</div>
          <div class="props-tray-chip-name">${p.name}</div>
        </div>
      `;
    }).join('');
  }

  togglePropsDrawer(force) {
    const tray = document.getElementById('props-pocket-tray');
    if (!tray) return;
    const isVisible = tray.style.display !== 'none';
    const nextState = (typeof force === 'boolean') ? force : !isVisible;
    tray.style.display = nextState ? 'block' : 'none';
    if (nextState && window.soundFX && window.soundFX.playPop) window.soundFX.playPop();
  }

  renderRoomProps(roomIndex) {
    const stage = document.getElementById('room-props-stage');
    if (!stage) return;
    stage.innerHTML = '';

    const propsList = this.roomDefaultProps[roomIndex] || [];
    propsList.forEach((item, idx) => {
      this.spawnPropElement(item.propId, item.leftPct, item.bottomPx, `prop-room-${roomIndex}-${idx}`);
    });
  }

  spawnPropInRoom(propId) {
    if (window.soundFX && window.soundFX.playPlop) window.soundFX.playPlop();
    const danikaEl = document.getElementById('character-danika');
    const danikaXPct = danikaEl ? (parseFloat(danikaEl.dataset.xPct || danikaEl.style.left) || 42) : 42;
    const targetX = Math.max(15, Math.min(85, danikaXPct + (Math.random() > 0.5 ? 8 : -8)));
    this.spawnPropElement(propId, targetX, 70, `prop-spawned-${Date.now()}`);
    this.togglePropsDrawer(false);
  }

  spawnPropElement(propId, leftPct, bottomPx, uniqueId) {
    const stage = document.getElementById('room-props-stage');
    const p = this.propsCatalog ? this.propsCatalog[propId] : null;
    if (!stage || !p) return;

    const propEl = document.createElement('div');
    propEl.className = 'room-prop-item';
    propEl.id = uniqueId;
    propEl.style.left = `${leftPct}%`;
    propEl.style.bottom = `${bottomPx}px`;
    propEl.dataset.propId = propId;

    const svgIcon = window.getGameIcon ? window.getGameIcon(p.emoji) : p.emoji;
    propEl.innerHTML = `
      <div class="prop-badge">
        <span class="prop-emoji">${svgIcon}</span>
        <span class="prop-name">${p.name}</span>
      </div>
    `;

    this.attachPropDrag(propEl, p);
    stage.appendChild(propEl);
  }

  attachPropDrag(propEl, propData) {
    let isDragging = false;

    const onPointerDown = (e) => {
      isDragging = true;
      propEl.setPointerCapture(e.pointerId);
      propEl.classList.add('dragging-prop');
      e.stopPropagation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const coords = this.getStageCoords(e.clientX, e.clientY, propEl.parentElement);
      const currentXPct = Math.max(5, Math.min(95, coords.xPct));
      const currentBottomPx = Math.max(20, Math.min(300, coords.bottomPx));

      propEl.style.left = `${currentXPct}%`;
      propEl.style.bottom = `${currentBottomPx}px`;

      // Hit testing з персонажами
      const danikaEl = document.getElementById('character-danika');
      const brunoEl = document.getElementById('character-bruno');

      if (danikaEl) {
        const dRect = danikaEl.getBoundingClientRect();
        if (e.clientX >= dRect.left && e.clientX <= dRect.right && e.clientY >= dRect.top && e.clientY <= dRect.bottom) {
          danikaEl.classList.add('drop-hover');
        } else {
          danikaEl.classList.remove('drop-hover');
        }
      }

      if (brunoEl) {
        const bRect = brunoEl.getBoundingClientRect();
        if (e.clientX >= bRect.left && e.clientX <= bRect.right && e.clientY >= bRect.top && e.clientY <= bRect.bottom) {
          brunoEl.classList.add('drop-hover');
        } else {
          brunoEl.classList.remove('drop-hover');
        }
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      propEl.classList.remove('dragging-prop');
      try { propEl.releasePointerCapture(e.pointerId); } catch(err) {}

      const danikaEl = document.getElementById('character-danika');
      const brunoEl = document.getElementById('character-bruno');
      if (danikaEl) danikaEl.classList.remove('drop-hover');
      if (brunoEl) brunoEl.classList.remove('drop-hover');

      // Перевіряємо дроп на Даніку
      if (danikaEl) {
        const dRect = danikaEl.getBoundingClientRect();
        if (e.clientX >= dRect.left && e.clientX <= dRect.right && e.clientY >= dRect.top && e.clientY <= dRect.bottom) {
          this.handleDanikaReceiveProp(propEl, propData, e.clientX, e.clientY);
          return;
        }
      }

      // Перевіряємо дроп на Бруно
      if (brunoEl) {
        const bRect = brunoEl.getBoundingClientRect();
        if (e.clientX >= bRect.left && e.clientX <= bRect.right && e.clientY >= bRect.top && e.clientY <= bRect.bottom) {
          this.handleBrunoReceiveProp(propEl, propData, e.clientX, e.clientY);
          return;
        }
      }

      // Звичайне приземлення на поверхню / підлогу
      if (window.soundFX && window.soundFX.playPlop) window.soundFX.playPlop();
    };

    propEl.addEventListener('pointerdown', onPointerDown);
    propEl.addEventListener('pointermove', onPointerMove);
    propEl.addEventListener('pointerup', onPointerUp);
    propEl.addEventListener('pointercancel', onPointerUp);
  }

  handleDanikaReceiveProp(propEl, propData, dropX, dropY) {
    if (propData.category === 'food') {
      if (window.soundFX && window.soundFX.playChew) window.soundFX.playChew();
      this.spawnCrumbParticles(dropX, dropY, ['✨', propData.emoji, '😋']);
      this.modifyTamagotchi({ hunger: propData.hunger, happiness: propData.happiness });
      this.speak(propData.speech);
      this.showDanikaThought(propData.speech);
      // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
      propEl.remove();
    } else if (propData.category === 'pet') {
      this.speak("Це ж смаколик для Бруно! Пригости мого улюбленого песика 🐾");
      if (window.soundFX && window.soundFX.playPlop) window.soundFX.playPlop();
    } else if (propData.category === 'toy' || propData.category === 'art') {
      if (window.soundFX && window.soundFX.playVictory) window.soundFX.playVictory();
      this.spawnPoseParticles(['⭐', '💖', propData.emoji]);
      this.modifyTamagotchi({ happiness: propData.happiness, energy: propData.energy || 0 });
      this.speak(propData.speech);
      this.showDanikaThought(propData.speech);
    } else if (propData.category === 'hygiene') {
      if (window.soundFX && window.soundFX.playPetting) window.soundFX.playPetting();
      this.spawnBubbleParticles(dropX, dropY);
      this.modifyTamagotchi({ hygiene: propData.hygiene });
      this.speak(propData.speech);
      this.showDanikaThought(propData.speech);
    }
  }

  handleBrunoReceiveProp(propEl, propData, dropX, dropY) {
    if (propData.category === 'pet' || propData.category === 'food') {
      if (window.soundFX && window.soundFX.playBark) window.soundFX.playBark();
      setTimeout(() => {
        if (window.soundFX && window.soundFX.playChew) window.soundFX.playChew();
      }, 200);
      this.spawnCrumbParticles(dropX, dropY, ['🐾', '❤️', '🦴']);

      const brunoEl = document.getElementById('character-bruno');
      if (brunoEl) {
        brunoEl.classList.add('petting');
        setTimeout(() => brunoEl.classList.remove('petting'), 600);
      }

      this.modifyTamagotchi({ happiness: 15 });
      this.state.roomState.brunoHappiness = Math.min(100, (this.state.roomState.brunoHappiness || 80) + (propData.brunoHappiness || 20));
      const gotBonus = this.tryAutoCompleteIngameQuest('ig_feed_bruno');
      this.speak(gotBonus ? "Бруно так радісно смакує! Плюс 3 монетки за турботу!" : "Бруно так радісно смакує! 🐶 Дякуємо!");
      // Авто-зміна пози/одягу вимкнена: Даніка перевдягається лише за бажанням гравчині
      propEl.remove();
      this.saveState();
    } else if (propData.category === 'toy') {
      if (window.soundFX && window.soundFX.playBark) window.soundFX.playBark();
      if (window.soundFX && window.soundFX.playBallBounce) window.soundFX.playBallBounce();
      this.spawnPoseParticles(['🐾', '🎾', '⭐']);

      const brunoEl = document.getElementById('character-bruno');
      if (brunoEl) {
        brunoEl.classList.add('petting');
        setTimeout(() => brunoEl.classList.remove('petting'), 600);
      }
      this.state.roomState.brunoHappiness = Math.min(100, (this.state.roomState.brunoHappiness || 80) + 15);
      this.speak("Бруно весело бавиться з іграшкою! 🎾");
      this.saveState();
    } else if (propData.category === 'hygiene') {
      if (window.soundFX && window.soundFX.playPetting) window.soundFX.playPetting();
      this.spawnBubbleParticles(dropX, dropY);
      this.modifyTamagotchi({ hygiene: 20 });
      this.speak("Тепер Бруно чистенький, пахучий і блищить! 🫧");
    }
  }

  showDanikaThought(text) {
    const bubbleEl = document.getElementById('danika-speech-bubble');
    if (bubbleEl) {
      bubbleEl.innerText = text;
      bubbleEl.style.display = 'block';
      clearTimeout(this._speechBubbleTimer);
      this._speechBubbleTimer = setTimeout(() => {
        bubbleEl.style.display = 'none';
      }, 4000);
    }
  }

  spawnCrumbParticles(clientX, clientY, emojis = ['✨', '🍞', '😋']) {
    const stage = document.getElementById('game-app-container') || document.body;
    const coords = this.getStageCoords(clientX, clientY, stage);
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'crumb-particle';
      p.innerText = emojis[i % emojis.length];
      p.style.left = `${coords.localX - 10}px`;
      p.style.top = `${coords.localY - 10}px`;
      p.style.setProperty('--cx', `${(Math.random() - 0.5) * 60}px`);
      p.style.setProperty('--cy', `${-15 - Math.random() * 35}px`);
      stage.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  spawnBubbleParticles(clientX, clientY) {
    const stage = document.getElementById('game-app-container') || document.body;
    const coords = this.getStageCoords(clientX, clientY, stage);
    for (let i = 0; i < 6; i++) {
      const b = document.createElement('div');
      b.className = 'soap-bubble-particle';
      b.innerText = '🫧';
      b.style.left = `${coords.localX - 10}px`;
      b.style.top = `${coords.localY - 10}px`;
      b.style.setProperty('--bx', `${(Math.random() - 0.5) * 50}px`);
      b.style.animationDelay = `${i * 0.08}s`;
      stage.appendChild(b);
      setTimeout(() => b.remove(), 1200);
    }
  }

  // =========================================================
  // ГАРДЕРОБНА (20 ОДЯГУ, 20 АКСЕСУАРІВ, 4 БРУНО)
  // =========================================================
  openWardrobeModal(category = 'danikaOutfits') {
    window.soundFX.playClick();
    this.activeWardrobeTab = category;
    this.renderWardrobeModal();
    this.openModal('wardrobe-modal');
  }

  renderWardrobeCategory(catKey) {
    this.activeWardrobeTab = catKey;
    window.soundFX.playClick();

    document.querySelectorAll('.wardrobe-tab-btn').forEach(b => b.classList.remove('active'));
    if (catKey === 'danikaOutfits' && document.getElementById('w-tab-outfit')) document.getElementById('w-tab-outfit').classList.add('active');
    if (catKey === 'danikaAccessories' && document.getElementById('w-tab-acc')) document.getElementById('w-tab-acc').classList.add('active');
    if (catKey === 'danikaPoses' && document.getElementById('w-tab-poses')) document.getElementById('w-tab-poses').classList.add('active');
    if (catKey === 'brunoOutfits' && document.getElementById('w-tab-bruno')) document.getElementById('w-tab-bruno').classList.add('active');
    if (catKey === 'roomDecor' && document.getElementById('w-tab-decor')) document.getElementById('w-tab-decor').classList.add('active');

    this.renderWardrobeGrid();
  }

  getEnergy() {
    if (!this.state.tamagotchi) {
      this.state.tamagotchi = { hunger: 85, energy: 35, maxEnergy: 999, happiness: 95, hygiene: 80, health: 100 };
    }
    return Math.round(this.state.tamagotchi.energy !== undefined ? this.state.tamagotchi.energy : 35);
  }

  addEnergy(amount) {
    if (!this.state.tamagotchi) {
      this.state.tamagotchi = { hunger: 85, energy: 35, maxEnergy: 999, happiness: 95, hygiene: 80, health: 100 };
    }
    const cur = this.state.tamagotchi.energy !== undefined ? this.state.tamagotchi.energy : 35;
    this.state.tamagotchi.energy = Math.max(0, Math.min(999, cur + amount));
    this.renderTamagotchiHUD();
    this.saveState();
  }

  openEconomyGuideModal() {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const curCoins = this.state.coins || 0;
    const curXp = this.state.xp || 0;
    const curEnergy = this.getEnergy();
    const curCrystals = this.state.crystals || 0;

    content.innerHTML = `
      <div style="text-align:center;">
        <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; color:#b45309; font-weight:900; font-size:0.78rem; padding:3px 12px; border-radius:99px; margin-bottom:6px;">
          💰 ГАМАНЕЦЬ ТА ЕКОНОМІКА ПРИГОД
        </div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03; margin-bottom:8px;">
          Як заробляти та витрачати ресурси?
        </h2>

        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-bottom:12px;">
          <div style="background:#fffbeb; border:2px solid #f59e0b; border-radius:14px; padding:8px;">
            <div style="font-size:1.3rem; font-weight:900; color:#b45309;">🪙 ${curCoins}</div>
            <div style="font-size:0.74rem; font-weight:800; color:#78350f;">Золоті Монети</div>
          </div>
          <div style="background:#faf5ff; border:2px solid #a855f7; border-radius:14px; padding:8px;">
            <div style="font-size:1.3rem; font-weight:900; color:#6b21a8;">⭐ ${curXp}</div>
            <div style="font-size:0.74rem; font-weight:800; color:#581c87;">Бали Досвіду (XP)</div>
          </div>
          <div style="background:#f0f9ff; border:2px solid #0284c7; border-radius:14px; padding:8px;">
            <div style="font-size:1.3rem; font-weight:900; color:#0369a1;">⚡ ${curEnergy}</div>
            <div style="font-size:0.74rem; font-weight:800; color:#075985;">Енергія Героїні</div>
          </div>
          <div style="background:#fdf4ff; border:2px solid #ec4899; border-radius:14px; padding:8px;">
            <div style="font-size:1.3rem; font-weight:900; color:#be185d;">💎 ${curCrystals} (€${curCrystals})</div>
            <div style="font-size:0.74rem; font-weight:800; color:#9d174d;">Кристали (1💎 = 1€)</div>
          </div>
        </div>

        <div style="text-align:left; display:flex; flex-direction:column; gap:8px; font-size:0.8rem; color:#1e293b; margin-bottom:14px;">
          <div style="background:#fff; border:1.5px solid #fcd34d; border-radius:12px; padding:9px 11px;">
            <div style="font-weight:900; color:#b45309; margin-bottom:2px;">🪙 1. Золоті Монети — найвигідніша валюта!</div>
            <div style="font-weight:700; color:#475569; line-height:1.35;">
              Заробляються за <b>реальні справи вдома та навчання</b> (+5..30 🪙 за завдання, підтверджене Мамою або Татом). За монети найвигідніше купувати VIP-купони (YouTube, ігри, смаколики), а також костюми й аксесуари!
            </div>
          </div>

          <div style="background:#fff; border:1.5px solid #d8b4fe; border-radius:12px; padding:9px 11px;">
            <div style="font-weight:900; color:#6b21a8; margin-bottom:2px;">⭐ 2. Бали Досвіду (XP) — твій рівень та знання!</div>
            <div style="font-weight:700; color:#475569; line-height:1.35;">
              Нараховуються за кожне виконане реальне завдання (+20..120 ⭐), читання та вірші. Підвищують твій Рівень у сімейному рейтингу! Якщо накопичити багато досвіду (250–1900 ⭐), ним теж можна відкривати костюми, емоції та пози Бруно.
            </div>
          </div>

          <div style="background:#fff; border:1.5px solid #7dd3fc; border-radius:12px; padding:9px 11px;">
            <div style="font-weight:900; color:#0369a1; margin-bottom:2px;">⚡ 3. Енергія — заряд бадьорості за добрі справи!</div>
            <div style="font-weight:700; color:#475569; line-height:1.35;">
              Коли Мама або Тато підтверджують реальне завдання, Даніка заряджається енергією (<b>+15..60 ⚡</b> за справу!). Накопичивши багато енергії (100–760 ⚡), ти можеш витратити її на відкриття нових образів Бруно, одягу або дій.
            </div>
          </div>

          <div style="background:#fff; border:1.5px solid #f9a8d4; border-radius:12px; padding:9px 11px;">
            <div style="font-weight:900; color:#be185d; margin-bottom:2px;">💎 4. Магічні Кристали (1 💎 = 1 € у скарбничку)</div>
            <div style="font-weight:700; color:#475569; line-height:1.35;">
              Заробляються за <b>5-денні Системні Звички</b> у Планшеті й обмінюються на справжні євро на твої мрії!
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn-primary" style="background:#0284c7; box-shadow:0 4px 0 #0369a1;" onclick="window.game.closeModal('action-modal'); window.game.openTablet('daily');">
            📱 До Завдань
          </button>
          <button class="btn-primary" style="background:#10b981; box-shadow:0 4px 0 #059669;" onclick="window.game.closeModal('action-modal'); window.game.openTablet('rewards');">
            🏪 Лавка Нагород
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    this.speak("Ось твій гаманець пригод! Найшвидше відкривати всі обновки та купони за золоті монетки, які даються за реальні добрі справи вдома!");
  }

  renderWardrobeModal() {
    const coinsEl = document.getElementById('wardrobe-coins-balance');
    const curEnergy = this.getEnergy();
    if (coinsEl) coinsEl.innerText = `${this.state.coins || 0} 🪙 | ${this.state.xp || 0} ⭐ | ${curEnergy} ⚡`;

    this.renderWardrobeCategory(this.activeWardrobeTab);
  }

  renderWardrobeGrid() {
    const grid = document.getElementById('wardrobe-grid-items');
    if (!grid) return;

    const curEnergy = this.getEnergy();
    const coinsEl = document.getElementById('wardrobe-coins-balance');
    if (coinsEl) coinsEl.innerText = `${this.state.coins || 0} 🪙 | ${this.state.xp || 0} ⭐ | ${curEnergy} ⚡`;

    if (this.activeWardrobeTab === 'danikaOutfits') {
      // 20 варіантів одягу: відкриття за монети 🪙, досвід ⭐ або енергію ⚡
      grid.innerHTML = this.state.wardrobe.danikaOutfits.map(item => {
        const isEquipped = !this.state.activeDanikaPose && (this.state.activeDanikaAvatar === item.img);
        const costCoins = item.cost || 120;
        const costXp = item.costXp || (costCoins * 5);
        const costEnergy = item.costEnergy || (costCoins * 2);
        return `
          <div class="wardrobe-card-item ${isEquipped ? 'equipped' : ''}" style="position:relative; ${!item.unlocked ? 'background:#fffbeb; border-color:#f59e0b;' : ''}" onclick="window.game.selectDanikaOutfit('${item.id}')">
            ${!item.unlocked ? `<div style="position:absolute; top:6px; right:6px; background:#fef3c7; border:1px solid #f59e0b; border-radius:99px; padding:1px 6px; font-size:0.6rem; font-weight:900; color:#b45309;">🔒 Закрито</div>` : ''}
            <img src="${item.tileIcon || item.img}" class="wardrobe-clothing-tile-img" alt="${item.title}">
            <div class="wardrobe-item-title">${item.title}</div>
            ${item.unlocked ? `
              <div style="font-size:0.72rem; color:${isEquipped ? '#16a34a' : '#64748b'}; font-weight:900; margin-top:4px;">
                ${isEquipped ? '✔️ Одягнено' : 'Приміряти'}
              </div>
            ` : `
              <div style="display:flex; gap:3px; justify-content:center; flex-wrap:wrap; width:100%; margin-top:5px;">
                <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaOutfits', '${item.id}', 'coins')" title="Купити за ${costCoins} монет">
                  🪙 ${costCoins}
                </button>
                <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaOutfits', '${item.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                  ⭐ ${costXp}
                </button>
                <button class="pose-quick-unlock-btn energy" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaOutfits', '${item.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                  ⚡ ${costEnergy}
                </button>
              </div>
            `}
          </div>
        `;
      }).join('');
    } else if (this.activeWardrobeTab === 'danikaAccessories') {
      // 20 ілюстрованих аксесуарів високої чіткості
      grid.innerHTML = this.state.wardrobe.danikaAccessories.map(item => {
        const isEquipped = !this.state.activeDanikaPose && (this.state.activeDanikaAccessory === item.id);
        const costCoins = item.cost || 60;
        const costXp = item.costXp || (costCoins * 5);
        const costEnergy = item.costEnergy || (costCoins * 2);
        const thumbHtml = item.id === 'acc_none'
          ? `<div style="width:76px; height:76px; display:flex; align-items:center; justify-content:center; font-size:2.4rem; margin-bottom:6px;">🚫</div>`
          : `<img src="${item.icon}?v=20260930_1" class="wardrobe-acc-tile-img" alt="${item.title}">`;
        return `
          <div class="wardrobe-card-item ${isEquipped ? 'equipped' : ''}" style="position:relative; ${!item.unlocked ? 'background:#fffbeb; border-color:#f59e0b;' : ''}" onclick="window.game.selectDanikaAccessory('${item.id}')">
            ${!item.unlocked ? `<div style="position:absolute; top:6px; right:6px; background:#fef3c7; border:1px solid #f59e0b; border-radius:99px; padding:1px 6px; font-size:0.6rem; font-weight:900; color:#b45309;">🔒 Закрито</div>` : ''}
            ${thumbHtml}
            <div class="wardrobe-item-title">${item.title}</div>
            ${item.unlocked ? `
              <div style="font-size:0.72rem; color:${isEquipped ? '#16a34a' : '#64748b'}; font-weight:900; margin-top:4px;">
                ${isEquipped ? '✔️ Надіто' : 'Одягти'}
              </div>
            ` : `
              <div style="display:flex; gap:3px; justify-content:center; flex-wrap:wrap; width:100%; margin-top:5px;">
                <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaAccessories', '${item.id}', 'coins')" title="Купити за ${costCoins} монет">
                  🪙 ${costCoins}
                </button>
                <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaAccessories', '${item.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                  ⭐ ${costXp}
                </button>
                <button class="pose-quick-unlock-btn energy" onclick="event.stopPropagation(); window.game.unlockWardrobeItem('danikaAccessories', '${item.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                  ⚡ ${costEnergy}
                </button>
              </div>
            `}
          </div>
        `;
      }).join('');
    } else if (this.activeWardrobeTab === 'danikaPoses') {
      // 23 дії та емоції Даніки з відкриттям за монети 🪙, бали ⭐ або енергію ⚡
      const posesList = typeof DANIKA_POSES_CATALOG !== 'undefined' ? Object.values(DANIKA_POSES_CATALOG) : [];
      grid.innerHTML = posesList.map(pose => {
        const unlocked = this.isPoseUnlocked(pose.id);
        const isEquipped = this.state.activeDanikaPose === pose.id;
        const costCoins = pose.costCoins || 80;
        const costXp = pose.costXp || 400;
        const costEnergy = pose.costEnergy || 160;
        return `
          <div class="wardrobe-card-item ${isEquipped ? 'equipped' : ''}" style="position:relative; ${!unlocked ? 'background:#fffbeb; border-color:#f59e0b;' : ''}" onclick="window.game.handlePoseCardClick('${pose.id}', true)">
            ${!unlocked ? `<div style="position:absolute; top:6px; right:6px; background:#fef3c7; border:1px solid #f59e0b; border-radius:99px; padding:1px 6px; font-size:0.65rem; font-weight:900; color:#b45309;">🔒 Закрито</div>` : ''}
            <img src="${pose.file}?v=20261005_1" class="wardrobe-item-thumb" style="width:76px; height:84px; object-fit:contain; ${!unlocked ? 'filter:saturate(0.88);' : ''}" alt="${pose.name}">
            <div class="wardrobe-item-title">${pose.icon} ${pose.name}</div>
            ${unlocked ? `
              <div style="font-size:0.72rem; color:${isEquipped ? '#16a34a' : '#7c3aed'}; font-weight:900; margin-top:4px;">
                ${isEquipped ? '✨ Активна зараз' : '▶️ Увімкнути дію'}
              </div>
            ` : `
              <div style="display:flex; gap:3px; justify-content:center; flex-wrap:wrap; width:100%; margin-top:5px;">
                <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'coins')" title="Відкрити за ${costCoins} монет">
                  🪙 ${costCoins}
                </button>
                <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                  ⭐ ${costXp}
                </button>
                <button class="pose-quick-unlock-btn energy" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                  ⚡ ${costEnergy}
                </button>
              </div>
            `}
          </div>
        `;
      }).join('');
    } else if (this.activeWardrobeTab === 'brunoOutfits') {
      // 14 Поз та образів Бруно + керування видимістю, режимом лежанки та відкриттям за монети / бали / енергію / квести
      const isHidden = Boolean(this.state.brunoHidden);
      const isStat = this.isBrunoStationary();
      const unlockedBrunoCount = this.state.wardrobe.brunoOutfits.filter(b => b.unlocked).length;
      const topControlsHtml = `
        <div style="grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:#fffbeb; border:2px solid #f59e0b; border-radius:14px; padding:10px 14px; margin-bottom:6px;">
          <div style="font-size:0.82rem; font-weight:900; color:#92400e;">
            🐶 Образи Бруно (${unlockedBrunoCount}/${this.state.wardrobe.brunoOutfits.length}): ${isHidden ? '<span style="color:#dc2626;">🙈 Вимкнений</span>' : (isStat ? '<span style="color:#0284c7;">🛏️ У лежанці на підлозі</span>' : '<span style="color:#16a34a;">🐾 Бігає за Данікою</span>')}
            <span style="margin-left:8px; background:#fef3c7; border:1px solid #f59e0b; padding:2px 8px; border-radius:99px; font-size:0.74rem;">🪙 ${this.state.coins || 0} | ⭐ ${this.state.xp || 0} | ⚡ ${curEnergy}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.76rem; background:#0284c7; box-shadow:none;"
                    onclick="window.game.selectBrunoStyle('bruno_in_bed'); window.game.renderWardrobeGrid();">
              🛏️ Покласти в лежанку
            </button>
            <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.76rem; background:${isHidden ? '#16a34a' : '#ef4444'}; box-shadow:none;"
                    onclick="window.game.toggleBrunoHidden(${!isHidden}); window.game.renderWardrobeGrid();">
              ${isHidden ? '🐶 Увімкнути Бруно' : '🙈 Вимкнути Бруно'}
            </button>
          </div>
        </div>
      `;
      const cardsHtml = this.state.wardrobe.brunoOutfits.map(item => {
        const isEquipped = !this.state.brunoHidden && (this.state.activeBrunoAvatar === item.img || this.state.activeBrunoPoseId === item.id);
        const costCoins = item.cost || 80;
        const costXp = item.costXp || 400;
        const costEnergy = item.costEnergy || 160;
        return `
          <div class="wardrobe-card-item ${isEquipped ? 'equipped' : ''}" style="position:relative; ${!item.unlocked ? 'background:#fffbeb; border-color:#f59e0b;' : ''}" onclick="window.game.selectBrunoStyle('${item.id}')">
            ${item.stationary ? `<div style="position:absolute; top:6px; left:6px; background:#e0f2fe; border:1px solid #0284c7; border-radius:99px; padding:1px 6px; font-size:0.6rem; font-weight:900; color:#0369a1;">🛏️ На місці</div>` : ''}
            ${!item.unlocked ? `<div style="position:absolute; top:6px; right:6px; background:#fef3c7; border:1px solid #f59e0b; border-radius:99px; padding:1px 6px; font-size:0.6rem; font-weight:900; color:#b45309;">🔒 Закрито</div>` : ''}
            <img src="${item.img}" class="wardrobe-item-thumb" style="width:76px; height:76px; object-fit:contain; object-position:bottom center; ${!item.unlocked ? 'filter:saturate(0.88);' : ''}" alt="${item.title}">
            <div class="wardrobe-item-title">${item.title}</div>
            ${item.unlocked ? `
              <div style="font-size:0.72rem; color:${isEquipped ? '#16a34a' : '#64748b'}; font-weight:900; margin-top:4px;">
                ${isEquipped ? '✔️ Обрано' : (item.stationary ? '🛏️ В лежанку' : '▶️ Обрати позу')}
              </div>
            ` : `
              ${item.questRewardTitle ? `<div class="bruno-quest-reward-tag" title="Безкоштовно за виконання квесту: ${item.questRewardTitle}">🎁 За квест або:</div>` : ''}
              <div style="display:flex; gap:3px; justify-content:center; flex-wrap:wrap; width:100%; margin-top:4px;">
                <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'coins')" title="Відкрити за ${costCoins} монет">
                  🪙 ${costCoins}
                </button>
                <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                  ⭐ ${costXp}
                </button>
                <button class="pose-quick-unlock-btn energy" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                  ⚡ ${costEnergy}
                </button>
              </div>
            `}
          </div>
        `;
      }).join('');
      grid.innerHTML = topControlsHtml + cardsHtml;
    } else if (this.activeWardrobeTab === 'roomDecor') {
      grid.innerHTML = this.state.wardrobe.roomDecor.map(item => {
        return `
          <div class="wardrobe-card-item" onclick="window.game.selectRoomDecor('${item.id}')">
            <div style="font-size:42px; margin-bottom:4px;">${item.icon}</div>
            <div class="wardrobe-item-title">${item.title}</div>
            ${item.unlocked ? `
              <div style="font-size:0.72rem; color:#16a34a; font-weight:900; margin-top:4px;">✔️ Застосовано</div>
            ` : `
              <div class="wardrobe-item-price">🔒 ${item.cost} 🪙</div>
            `}
          </div>
        `;
      }).join('');
    }
  }

  openUnlockWardrobeItemModal(category, id) {
    const list = (this.state.wardrobe && this.state.wardrobe[category]) ? this.state.wardrobe[category] : [];
    const item = list.find(x => x.id === id);
    if (!item) return;
    window.soundFX.playClick();

    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const curCoins = this.state.coins || 0;
    const curXp = this.state.xp || 0;
    const curEnergy = this.getEnergy();

    const costCoins = item.cost || 80;
    const costXp = item.costXp || (costCoins * 5);
    const costEnergy = item.costEnergy || (costCoins * 2);

    const canBuyCoins = curCoins >= costCoins;
    const canBuyXp = curXp >= costXp;
    const canBuyEnergy = curEnergy >= costEnergy;
    const previewImg = item.tileIcon || item.icon || item.img;

    content.innerHTML = `
      <div style="text-align:center;">
        <div style="display:inline-block; background:#fce7f3; border:1.5px solid #ec4899; color:#be185d; font-weight:900; font-size:0.78rem; padding:3px 12px; border-radius:99px; margin-bottom:6px;">
          ${category === 'danikaOutfits' ? '👗 Модний Костюм Даніки' : '🎀 Стильний Аксесуар'}
        </div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03; margin-bottom:6px;">
          ${item.title}
        </h2>
        <div style="background:linear-gradient(180deg,#fffbeb,#fef3c7); border:2.5px solid #f59e0b; border-radius:20px; padding:12px; width:150px; height:155px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(245,158,11,0.18);">
          <img src="${previewImg}" alt="${item.title}" style="max-width:128px; max-height:132px; object-fit:contain;">
        </div>
        <div style="font-size:0.84rem; color:#78350f; font-weight:800; margin-bottom:10px;">
          ${item.desc || 'Чудова обновка для гардеробу Даніки! Виконуй реальні завдання вдома, щоб заробити монетки, досвід або енергію!'}
        </div>

        <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:8px 12px; margin-bottom:12px; font-size:0.82rem; font-weight:900; color:#334155;">
          Твій баланс: 🪙 ${curCoins} монет &nbsp;|&nbsp; ⭐ ${curXp} балів &nbsp;|&nbsp; ⚡ ${curEnergy} енергії
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="${canBuyCoins ? 'background:linear-gradient(180deg,#10b981,#059669); box-shadow:0 4px 0 #047857;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyCoins ? 'disabled' : ''}
                  onclick="window.game.unlockWardrobeItem('${category}', '${item.id}', 'coins')">
            🪙 Відкрити за ${costCoins} 🪙 монет ${!canBuyCoins ? `(ще +${costCoins - curCoins} 🪙)` : '✨'}
          </button>

          <button class="btn-primary" style="${canBuyXp ? 'background:linear-gradient(180deg,#8b5cf6,#6d28d9); box-shadow:0 4px 0 #5b21b6;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyXp ? 'disabled' : ''}
                  onclick="window.game.unlockWardrobeItem('${category}', '${item.id}', 'xp')">
            ⭐ Відкрити за ${costXp} ⭐ балів досвіду ${!canBuyXp ? `(ще +${costXp - curXp} ⭐)` : '🌟'}
          </button>

          <button class="btn-primary" style="${canBuyEnergy ? 'background:linear-gradient(180deg,#0ea5e9,#0284c7); box-shadow:0 4px 0 #0369a1;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyEnergy ? 'disabled' : ''}
                  onclick="window.game.unlockWardrobeItem('${category}', '${item.id}', 'energy')">
            ⚡ Відкрити за ${costEnergy} ⚡ енергії ${!canBuyEnergy ? `(ще +${costEnergy - curEnergy} ⚡)` : '⚡'}
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    this.speak(`${item.title}! Цю обновку можна відкрити за ${costCoins} монет, або за ${costXp} балів досвіду, або за ${costEnergy} енергії!`);
  }

  unlockWardrobeItem(category, id, currencyType = 'coins') {
    const list = (this.state.wardrobe && this.state.wardrobe[category]) ? this.state.wardrobe[category] : [];
    const item = list.find(x => x.id === id);
    if (!item) return;

    if (item.unlocked) {
      this.closeModal('action-modal');
      if (category === 'danikaOutfits') this.selectDanikaOutfit(id, true);
      else if (category === 'danikaAccessories') this.selectDanikaAccessory(id, true);
      return;
    }

    const costCoins = item.cost || 80;
    const costXp = item.costXp || (costCoins * 5);
    const costEnergy = item.costEnergy || (costCoins * 2);

    if (currencyType === 'coins') {
      if ((this.state.coins || 0) < costCoins) {
        this.openUnlockWardrobeItemModal(category, id);
        this.speak(`Не вистачає ще ${costCoins - (this.state.coins || 0)} монеток! Виконуй реальні завдання у Планшеті!`);
        return;
      }
      this.state.coins -= costCoins;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.coins = this.state.coins;
      }
    } else if (currencyType === 'xp') {
      if ((this.state.xp || 0) < costXp) {
        this.openUnlockWardrobeItemModal(category, id);
        this.speak(`Не вистачає ще ${costXp - (this.state.xp || 0)} балів досвіду! Виконуй завдання у реальному житті!`);
        return;
      }
      this.state.xp -= costXp;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.xp = this.state.xp;
      }
    } else if (currencyType === 'energy') {
      const curEnergy = this.getEnergy();
      if (curEnergy < costEnergy) {
        this.openUnlockWardrobeItemModal(category, id);
        this.speak(`Не вистачає ще ${costEnergy - curEnergy} енергії! Виконуй реальні справи вдома, щоб зарядити енергію!`);
        return;
      }
      this.addEnergy(-costEnergy);
    }

    item.unlocked = true;
    this.closeModal('action-modal');
    if (window.soundFX && typeof window.soundFX.playChestOpen === 'function') {
      window.soundFX.playChestOpen();
    }
    this.launchConfetti();
    if (category === 'danikaOutfits') {
      this.selectDanikaOutfit(id, true);
    } else if (category === 'danikaAccessories') {
      this.selectDanikaAccessory(id, true);
    }
  }

  selectDanikaOutfit(id, forceApply = false) {
    const item = this.state.wardrobe.danikaOutfits.find(o => o.id === id);
    if (!item) return;

    if (!forceApply && !item.unlocked) {
      this.openUnlockWardrobeItemModal('danikaOutfits', id);
      return;
    }

    // При виборі одягу одразу вимикаємо активну позу з «Дії та Емоції» і переключаємо на модель у вибраному одязі!
    this.state.activeDanikaPose = null;
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.className = danikaEl.className.replace(/\bpose-\S+/g, '').trim();
      danikaEl.style.transform = '';
    }
    const bubbleEl = document.getElementById('danika-speech-bubble');
    if (bubbleEl) bubbleEl.style.display = 'none';
    this.updateActiveActionCard();

    this.state.activeDanikaAvatar = item.img;
    if (this.state.familyProfiles && this.state.familyProfiles.danika) {
      this.state.familyProfiles.danika.avatar = item.img;
      this.state.familyProfiles.danika.sprite = item.img;
    }
    this.saveState();
    window.soundFX.playSparkle();

    this.renderWardrobeGrid();
    this.render();
    this.speak(`Чудовий вибір! Я вдягла: ${item.title}!`);
  }

  selectDanikaAccessory(id, forceApply = false) {
    const item = this.state.wardrobe.danikaAccessories.find(a => a.id === id);
    if (!item) return;

    if (!forceApply && !item.unlocked) {
      this.openUnlockWardrobeItemModal('danikaAccessories', id);
      return;
    }

    // При виборі аксесуара також одразу переключаємо з пози на модель Даніки з одягом та аксесуаром!
    this.state.activeDanikaPose = null;
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.className = danikaEl.className.replace(/\bpose-\S+/g, '').trim();
      danikaEl.style.transform = '';
    }
    this.updateActiveActionCard();

    this.state.activeDanikaAccessory = item.id;
    this.saveState();
    window.soundFX.playSparkle();

    const accImg = document.getElementById('wardrobe-preview-acc-img');
    if (accImg) accImg.src = item.icon;

    this.renderWardrobeGrid();
    this.render();
  }

  getActiveBrunoItem() {
    if (!this.state || !this.state.wardrobe || !Array.isArray(this.state.wardrobe.brunoOutfits)) return null;
    const cleanPath = (p) => String(p || '').split('?')[0];
    return this.state.wardrobe.brunoOutfits.find(
      b => b.id === this.state.activeBrunoPoseId || cleanPath(b.img) === cleanPath(this.state.activeBrunoAvatar)
    ) || this.state.wardrobe.brunoOutfits[0];
  }

  isBrunoStationary() {
    const item = this.getActiveBrunoItem();
    return Boolean(item && item.stationary);
  }

  getStationaryBrunoFloorPos() {
    const locId = this.state.activeLocationId || 'loc_home';
    const rIdx = this.state.activeRoomIndex || 0;
    if (locId === 'loc_home' && rIdx === 0) {
      // Спальня: червоно-жовта лежанка Бруно справа внизу прямо на підлозі
      return { leftPct: 80, bottomPx: 14 };
    }
    if (locId === 'loc_home' && rIdx === 4) {
      // Секретна кімната: королівська лежанка Бруно справа внизу на підлозі
      return { leftPct: 81, bottomPx: 20 };
    }
    return { leftPct: 78, bottomPx: 16 };
  }

  applyBrunoFloorPosition(animate = false) {
    const brunoEl = document.getElementById('character-bruno');
    if (!brunoEl || this.state.brunoHidden) return;
    if (this.isBrunoStationary()) {
      const pos = this.getStationaryBrunoFloorPos();
      brunoEl.style.transition = animate ? 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none';
      brunoEl.style.left = `${pos.leftPct}%`;
      brunoEl.style.bottom = `${pos.bottomPx}px`;
      brunoEl.dataset.xPct = pos.leftPct;
    } else {
      brunoEl.style.bottom = '54px';
    }
  }

  showBrunoThought(text) {
    const bubbleEl = document.getElementById('bruno-speech-bubble');
    if (bubbleEl) {
      bubbleEl.innerText = text;
      bubbleEl.style.display = 'block';
      clearTimeout(this._brunoBubbleTimer);
      this._brunoBubbleTimer = setTimeout(() => {
        bubbleEl.style.display = 'none';
      }, 4200);
    }
  }

  toggleBrunoHidden(forceHide) {
    const nextHidden = (typeof forceHide === 'boolean') ? forceHide : !this.state.brunoHidden;
    this.state.brunoHidden = nextHidden;
    window.soundFX.playClick();

    if (nextHidden) {
      this.toggleBrunoDrawer(false);
      this.speak("Бруно побіг відпочивати! Натисни кнопку Покликати Бруно, коли захочеш повернути його!");
    } else {
      window.soundFX.playBark();
      this.speak("Гав-гав! Бруно знову повернувся у кімнату!");
    }

    this.render();
    if (this.state.activeLocationId === 'loc_home' && this.state.activeRoomIndex === 4) {
      this.renderSecretRoom();
    }
    this.saveState();
  }

  toggleBrunoDrawer(forceState) {
    const drawer = document.getElementById('bruno-poses-drawer');
    if (!drawer) return;
    const isVisible = (drawer.style.display !== 'none');
    const newState = (forceState !== undefined) ? forceState : !isVisible;

    if (newState) {
      const danikaDrawer = document.getElementById('danika-actions-drawer');
      if (danikaDrawer) danikaDrawer.style.display = 'none';
      const itemPicker = document.getElementById('secret-item-picker-drawer');
      if (itemPicker) itemPicker.style.display = 'none';
      const buildBar = document.getElementById('secret-build-toolbar');
      if (buildBar) buildBar.style.display = 'none';

      drawer.style.display = 'block';
      this.renderBrunoDrawer();
    } else {
      drawer.style.display = 'none';
    }
  }

  renderBrunoDrawer() {
    const grid = document.getElementById('bruno-poses-grid-scroll');
    if (!grid || !this.state.wardrobe || !Array.isArray(this.state.wardrobe.brunoOutfits)) return;

    const allBruno = this.state.wardrobe.brunoOutfits;
    const unlockedCount = allBruno.filter(b => b.unlocked).length;
    const unlockedBadge = document.getElementById('bruno-unlocked-badge');
    if (unlockedBadge) {
      unlockedBadge.innerText = `Відкрито: ${unlockedCount} / ${allBruno.length}`;
    }

    const curEnergy = this.getEnergy();
    const balEl = document.getElementById('bruno-balance-pill');
    if (balEl) {
      balEl.innerText = `🪙 ${this.state.coins || 0} монет | ⭐ ${this.state.xp || 0} балів | ⚡ ${curEnergy} енергії`;
    }

    const statusBadge = document.getElementById('bruno-mode-status-badge');
    if (statusBadge) {
      if (this.isBrunoStationary()) {
        statusBadge.innerText = '🛏️ Лежить на місці (не бігає за Данікою)';
        statusBadge.style.background = '#e0f2fe';
        statusBadge.style.color = '#0369a1';
        statusBadge.style.borderColor = '#0284c7';
      } else {
        statusBadge.innerText = '🐾 Активний (бігає за Данікою)';
        statusBadge.style.background = '#dcfce7';
        statusBadge.style.color = '#15803d';
        statusBadge.style.borderColor = '#22c55e';
      }
    }

    grid.innerHTML = allBruno.map(item => {
      const isEquipped = !this.state.brunoHidden && (this.state.activeBrunoAvatar === item.img || this.state.activeBrunoPoseId === item.id);
      const costCoins = item.cost || 80;
      const costXp = item.costXp || 400;
      const costEnergy = item.costEnergy || 160;
      const modeTag = item.stationary
        ? `<span class="action-stat-tag pos" style="background:#e0f2fe; color:#0369a1; border-color:#7dd3fc;">🛏️ Лежить на місці</span>`
        : `<span class="action-stat-tag pos">🐾 Ходить за Данікою</span>`;

      return `
        <div class="action-pose-card ${isEquipped ? 'active' : ''} ${!item.unlocked ? 'locked-pose-card' : ''}" onclick="window.game.selectBrunoStyle('${item.id}')" title="${item.title}: ${item.desc}">
          <div class="action-pose-preview" style="position:relative;">
            <img src="${item.img}" alt="${item.title}" loading="lazy" style="${!item.unlocked ? 'filter:saturate(0.84) brightness(0.96);' : ''}">
            ${!item.unlocked ? `<span class="pose-lock-corner-badge">🔒</span>` : `<span class="pose-unlocked-corner-badge">✔️</span>`}
          </div>
          <div class="action-pose-title">${item.title}</div>
          <div class="action-pose-stats">
            ${modeTag}
          </div>
          ${item.unlocked ? `
            <div class="pose-card-status-bar unlocked">
              ${isEquipped ? '✨ Обрано зараз' : (item.stationary ? '🛏️ Покласти' : '▶️ Обрати позу')}
            </div>
          ` : `
            ${item.questRewardTitle ? `<div class="bruno-quest-reward-tag" title="Безкоштовно за квест: ${item.questRewardTitle}">🎁 За квест: ${item.questRewardTitle}</div>` : ''}
            <div class="pose-card-unlock-row">
              <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'coins')" title="Відкрити за ${costCoins} монет">
                🪙 ${costCoins}
              </button>
              <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                ⭐ ${costXp}
              </button>
              <button class="pose-quick-unlock-btn energy" onclick="event.stopPropagation(); window.game.unlockBrunoPose('${item.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                ⚡ ${costEnergy}
              </button>
            </div>
          `}
        </div>
      `;
    }).join('');
    const drawer = document.getElementById('bruno-poses-drawer');
    if (window.applyGameIcons && drawer) window.applyGameIcons(drawer);
  }

  openUnlockBrunoModal(id) {
    const item = this.state.wardrobe.brunoOutfits.find(b => b.id === id);
    if (!item) return;
    window.soundFX.playClick();

    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const curCoins = this.state.coins || 0;
    const curXp = this.state.xp || 0;
    const curEnergy = this.getEnergy();

    const costCoins = item.cost || 80;
    const costXp = item.costXp || 400;
    const costEnergy = item.costEnergy || 160;

    const canBuyCoins = curCoins >= costCoins;
    const canBuyXp = curXp >= costXp;
    const canBuyEnergy = curEnergy >= costEnergy;

    content.innerHTML = `
      <div style="text-align:center;">
        <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; color:#b45309; font-weight:900; font-size:0.78rem; padding:3px 12px; border-radius:99px; margin-bottom:6px;">
          ${item.tierLabel || '🐶 Новий образ Бруно'}
        </div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.38rem; color:#451a03; margin-bottom:6px;">
          ${item.title}
        </h2>
        <div style="background:linear-gradient(180deg,#fffbeb,#fef3c7); border:2.5px solid #f59e0b; border-radius:20px; padding:12px; width:155px; height:160px; margin:0 auto 10px; display:flex; align-items:flex-end; justify-content:center; box-shadow:0 6px 16px rgba(245,158,11,0.18);">
          <img src="${item.img}" alt="${item.title}" style="max-width:135px; max-height:135px; object-fit:contain; object-position:bottom center;">
        </div>
        <div style="font-size:0.84rem; color:#78350f; font-weight:800; margin-bottom:6px;">
          ${item.desc}
        </div>
        <div style="font-size:0.84rem; color:#92400e; font-weight:800; font-style:italic; background:#fffbeb; border:1.5px dashed #f59e0b; border-radius:14px; padding:8px 12px; margin-bottom:10px;">
          «${item.speech}»
        </div>

        ${item.questRewardTitle ? `
          <div style="background:linear-gradient(135deg,#dcfce7,#bbf7d0); border:2px solid #22c55e; border-radius:14px; padding:8px 12px; margin-bottom:10px; font-size:0.82rem; font-weight:900; color:#14532d;">
            🎁 Безкоштовно відкривається за виконання завдання:<br>
            <span style="color:#15803d; font-size:0.88rem;">«${item.questRewardTitle}»</span>
          </div>
        ` : ''}

        <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:8px 12px; margin-bottom:12px; font-size:0.82rem; font-weight:900; color:#334155;">
          Баланс: 🪙 ${curCoins} монет &nbsp;|&nbsp; ⭐ ${curXp} балів &nbsp;|&nbsp; ⚡ ${curEnergy} енергії
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="${canBuyCoins ? 'background:linear-gradient(180deg,#10b981,#059669); box-shadow:0 4px 0 #047857;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyCoins ? 'disabled' : ''}
                  onclick="window.game.unlockBrunoPose('${item.id}', 'coins')">
            🪙 Відкрити за ${costCoins} 🪙 монет ${!canBuyCoins ? `(ще +${costCoins - curCoins} 🪙)` : '✨'}
          </button>

          <button class="btn-primary" style="${canBuyXp ? 'background:linear-gradient(180deg,#8b5cf6,#6d28d9); box-shadow:0 4px 0 #5b21b6;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyXp ? 'disabled' : ''}
                  onclick="window.game.unlockBrunoPose('${item.id}', 'xp')">
            ⭐ Відкрити за ${costXp} ⭐ балів досвіду ${!canBuyXp ? `(ще +${costXp - curXp} ⭐)` : '🌟'}
          </button>

          <button class="btn-primary" style="${canBuyEnergy ? 'background:linear-gradient(180deg,#0ea5e9,#0284c7); box-shadow:0 4px 0 #0369a1;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyEnergy ? 'disabled' : ''}
                  onclick="window.game.unlockBrunoPose('${item.id}', 'energy')">
            ⚡ Відкрити за ${costEnergy} ⚡ енергії ${!canBuyEnergy ? `(ще +${costEnergy - curEnergy} ⚡)` : '🐶'}
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.applyGameIcons) window.applyGameIcons(content);
    this.speak(`Образ ${item.title}! Його можна відкрити за ${costCoins} монет, ${costXp} балів досвіду, ${costEnergy} енергії${item.questRewardTitle ? `, або отримати безкоштовно за завдання ${item.questRewardTitle}` : ''}!`);
  }

  unlockBrunoPose(id, currencyType = 'coins') {
    const item = this.state.wardrobe.brunoOutfits.find(b => b.id === id);
    if (!item) return;

    if (item.unlocked) {
      this.closeModal('action-modal');
      this.selectBrunoStyle(id, true);
      return;
    }

    const costCoins = item.cost || 80;
    const costXp = item.costXp || 400;
    const costEnergy = item.costEnergy || 160;

    if (currencyType === 'coins') {
      if ((this.state.coins || 0) < costCoins) {
        this.openUnlockBrunoModal(id);
        this.speak(`Не вистачає ще ${costCoins - (this.state.coins || 0)} монеток! Виконуй реальні завдання вдома!`);
        return;
      }
      this.state.coins -= costCoins;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.coins = this.state.coins;
      }
    } else if (currencyType === 'xp') {
      if ((this.state.xp || 0) < costXp) {
        this.openUnlockBrunoModal(id);
        this.speak(`Не вистачає ще ${costXp - (this.state.xp || 0)} балів досвіду! Виконуй реальні завдання вдома!`);
        return;
      }
      this.state.xp -= costXp;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.xp = this.state.xp;
      }
    } else if (currencyType === 'energy') {
      const curEnergy = this.getEnergy();
      if (curEnergy < costEnergy) {
        this.openUnlockBrunoModal(id);
        this.speak(`Не вистачає ще ${costEnergy - curEnergy} енергії! Виконуй реальні завдання у житті!`);
        return;
      }
      this.addEnergy(-costEnergy);
      this.modifyTamagotchi({ happiness: 15 });
    }

    item.unlocked = true;
    this.closeModal('action-modal');
    if (window.soundFX && typeof window.soundFX.playChestOpen === 'function') {
      window.soundFX.playChestOpen();
    }
    this.launchConfetti();
    this.selectBrunoStyle(id, true);
  }

  checkBrunoQuestUnlock(questId) {
    if (!questId || !this.state.wardrobe || !Array.isArray(this.state.wardrobe.brunoOutfits)) return null;
    const item = this.state.wardrobe.brunoOutfits.find(b => b.questRewardId === questId && !b.unlocked);
    if (!item) return null;

    item.unlocked = true;
    this.launchConfetti();
    setTimeout(() => {
      if (window.soundFX && window.soundFX.playBark) window.soundFX.playBark();
      this.showBrunoThought(`🎁 Відкрито новий образ: ${item.title}!`);
    }, 500);
    return item;
  }

  selectBrunoStyle(id, forceApply = false) {
    const item = this.state.wardrobe.brunoOutfits.find(b => b.id === id);
    if (!item) return;

    if (!forceApply && !item.unlocked) {
      this.openUnlockBrunoModal(id);
      return;
    }

    this.stopBrunoDanceShow();

    this.state.brunoHidden = false;
    this.state.activeBrunoAvatar = item.img;
    this.state.activeBrunoPoseId = item.id;

    const brunoEl = document.getElementById('character-bruno');
    if (brunoEl) {
      brunoEl.classList.remove('trotting');
      if (this._brunoTimer) clearTimeout(this._brunoTimer);

      this.applyBrunoFloorPosition(true);

      brunoEl.classList.add('petting');
      setTimeout(() => brunoEl.classList.remove('petting'), 600);
    }

    if (item.speech) {
      this.showBrunoThought(item.speech);
      if (item.id === 'bruno_dancer') {
        this.speak(item.speech, 'uk', 'bruno_dancer', () => {
          this.startBrunoDanceShow();
        });
      } else {
        this.speak(item.speech, 'uk', item.id);
      }
    }

    this.saveState();
    window.soundFX.playBark();
    this.renderBrunoDrawer();
    if (document.getElementById('wardrobe-modal') && document.getElementById('wardrobe-modal').classList.contains('active')) {
      this.renderWardrobeGrid();
    }
    if (this.state.activeLocationId === 'loc_home' && this.state.activeRoomIndex === 4) {
      this.renderSecretRoom();
    }
    this.render();
  }

  selectRoomDecor(id) {
    const item = this.state.wardrobe.roomDecor.find(d => d.id === id);
    if (!item) return;

    if (!item.unlocked) {
      if (this.state.coins < item.cost) {
        alert(`Тобі не вистачає ще ${item.cost - this.state.coins} 🪙 монет!`);
        return;
      }
      this.state.coins -= item.cost;
      item.unlocked = true;
      this.launchConfetti();
    }

    alert(`✨ Декор «${item.title}» успішно застосовано в кімнаті!`);
    window.soundFX.playSparkle();
    this.saveState();
    this.renderWardrobeGrid();
  }

  // =========================================================
  // КАРТА МІСТА ГАНДІЯ (GANDIA MAP)
  // =========================================================
  openMapModal() {
    window.soundFX.playClick();
    const container = document.getElementById('gandia-map-container');
    if (container) {
      const homeLeft = this.countUncompletedLearningInLocation ? this.countUncompletedLearningInLocation('loc_home') : 0;
      const homePinHtml = `
        <div class="gandia-map-pin" style="left: 50%; top: 50%;" onclick="window.game.travelToLocation('loc_home')" title="Вирушити: Дім Даніки (${homeLeft} завдань)">
          <div class="map-pin-badge">🏠</div>
          <div class="map-pin-label">🏠 Дім Даніки ${homeLeft > 0 ? `<span style="background:#ef4444;color:#fff;border-radius:99px;padding:1px 6px;font-size:0.68rem;margin-left:3px;">🎯 ${homeLeft}</span>` : '✅'}</div>
        </div>
      `;
      // Рендер інтерактивних міток на карті Гандії з прямим переходом на локацію та лічильником завдань
      const pinsHtml = this.state.gandiaLocations.map(loc => {
        const leftCount = this.countUncompletedLearningInLocation ? this.countUncompletedLearningInLocation(loc.id) : 0;
        const countBadge = leftCount > 0
          ? `<span style="background:#f59e0b;color:#fff;border-radius:99px;padding:1px 6px;font-size:0.68rem;margin-left:3px;">🎯 ${leftCount}</span>`
          : '✅';
        return `
          <div class="gandia-map-pin" style="left: ${loc.x}%; top: ${loc.y}%;" onclick="window.game.travelToLocation('${loc.id}')" title="Вирушити: ${loc.title} (${leftCount} завдань)">
            <div class="map-pin-badge">
              ${loc.category === 'school' ? '🏫' : loc.category === 'park' ? '🌳' : loc.category === 'fun' ? '🎈' : loc.category === 'mall' ? '🛍️' : loc.category === 'shop' ? '🛒' : loc.category === 'sports' ? '⚽' : '🏖️'}
            </div>
            <div class="map-pin-label">${loc.title} ${countBadge}</div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <img src="assets/map/gandia_map.jpg?v=20260927_4" alt="Карта міста Гандія" class="gandia-map-img">
        ${homePinHtml}
        ${pinsHtml}
      `;
    }
    this.openModal('map-modal');
  }

  travelToLocation(id) {
    this.closeModal('map-modal');
    this.closeModal('action-modal');
    this.switchLocation(id, 0);
  }

  closeLocationView() {
    this.switchLocation('loc_home', 0);
  }

  completeCurrentLocationMission() {
    if (!this.currentVisitedLocationId) return;
    const subScreens = this.getCurrentSubScreens();
    const currentSub = subScreens[this.currentSubScreenIndex] || subScreens[0];

    const rewardCoins = currentSub.coinsReward || 10;
    const taskTitle = `📍 ${currentSub.name}: ${currentSub.activity}`;

    this.requestParentApproval({
      title: taskTitle,
      coins: rewardCoins,
      xp: 25,
      icon: "📍",
      onApproved: () => {
        this.state.coins += rewardCoins;
        this.addXP(25);
        this.saveState();

        window.soundFX.playVictory();
        this.launchConfetti();
        this.closeModal('action-modal');

        const missionBtn = document.getElementById('location-view-mission-btn');
        if (missionBtn) {
          missionBtn.innerText = '✅ Місію виконано!';
          missionBtn.style.background = '#64748b';
        }

        alert(`🎉 Чудово! Батьки підтвердили місію в «${currentSub.name}»! Отримано +${rewardCoins} 🪙!`);
        this.speak(`Ура! Місію підтверджено батьками! Плюс ${rewardCoins} монети!`);
        this.render();
      }
    });
  }

  // =========================================================
  // ПЛАНШЕТ ПРИГОД (TABLET)
  // =========================================================
  openTablet(tab = 'daily') {
    this.activeTabletTab = tab;
    this.toggleTablet(true);
  }

  toggleTablet(isOpen) {
    const t = document.getElementById('adventure-tablet');
    if (!t) return;
    window.soundFX.playClick();
    if (isOpen) {
      t.classList.add('active');
      this.renderTabletContent();
    } else {
      t.classList.remove('active');
    }
  }

  setTabletTab(tab) {
    this.activeTabletTab = tab;
    window.soundFX.playClick();
    this.renderTabletContent();
  }

  getDailyBlitzQuest() {
    const onceList = (this.state.questCatalog && Array.isArray(this.state.questCatalog.once5))
      ? this.state.questCatalog.once5
      : [];
    if (!onceList.length) return null;
    const now = new Date();
    const daySeed = now.getFullYear() * 400 + (now.getMonth() + 1) * 32 + now.getDate();
    return onceList[daySeed % onceList.length];
  }

  renderTabletContent() {
    const container = document.getElementById('tablet-content-body');
    if (!container) return;

    const activeProfId = this.state.activeProfileId || 'danika';
    if (activeProfId === 'mom' || activeProfId === 'dad') {
      const parentProfile = this.state.familyProfiles ? this.state.familyProfiles[activeProfId] : null;
      if (parentProfile) {
        const quests = parentProfile.quests || [];
        const questsDone = quests.filter(q => q.completed).length;

        container.innerHTML = `
          <div style="background:linear-gradient(135deg, #fef3c7, #fde68a); border:2px solid #f59e0b; border-radius:16px; padding:12px; margin-bottom:14px; display:flex; align-items:center; gap:12px;">
            <img src="${parentProfile.avatar}" style="width:52px; height:52px; border-radius:50%; border:2.5px solid #f59e0b; object-fit:cover;">
            <div>
              <div style="font-weight:900; color:#b45309; font-size:1.05rem;">Кабінет: ${parentProfile.name} • ${parentProfile.role}</div>
              <div style="font-size:0.78rem; color:#78350f; font-weight:700;">
                Баланс: <strong>${parentProfile.xp} XP</strong> | <strong>${parentProfile.coins} 🪙</strong> | Виконано: <strong>${questsDone}/${quests.length}</strong>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:0.9rem; font-weight:900; color:#1e293b;">📋 Щоденні справи ${parentProfile.name}:</div>
            <button class="btn-primary" style="padding:4px 10px; font-size:0.75rem; background:#0284c7;" onclick="window.game.openFamilyLeaderboard('leaderboard')">🏆 Рейтинг сім'ї</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${quests.map(q => `
              <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : '#cbd5e1'}; border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:24px;">${q.icon}</span>
                  <div>
                    <div style="font-size:0.88rem; font-weight:800; color:#1e293b; ${q.completed ? 'text-decoration:line-through; color:#64748b;' : ''}">${q.title}</div>
                    <div style="font-size:0.74rem; color:#64748b;">+${q.xp} ⭐ | +10 🪙</div>
                  </div>
                </div>
                <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; background:${q.completed ? '#e2e8f0' : '#10b981'}; color:${q.completed ? '#64748b' : '#fff'};" 
                        onclick="window.game.toggleProfileTask('${activeProfId}', '${q.id}')">
                  ${q.completed ? 'Виконано ✔️' : 'Зробити (+XP)'}
                </button>
              </div>
            `).join('')}
          </div>
        `;
        return;
      }
    }

    const tabs = ['daily', 'academy', 'special', 'projects', 'weekly', 'rewards', 'surprises'];
    tabs.forEach(tabKey => {
      const btn = document.getElementById(`tablet-tab-btn-${tabKey}`);
      if (btn) {
        btn.style.opacity = (this.activeTabletTab === tabKey) ? '1' : '0.65';
        btn.style.transform = (this.activeTabletTab === tabKey) ? 'scale(1.03)' : 'scale(1)';
      }
    });

    if (this.activeTabletTab === 'daily') {
      const ingameList = (this.state.questCatalog && this.state.questCatalog.ingame3) ? this.state.questCatalog.ingame3 : [];
      const onceList = this.state.questCatalog ? this.state.questCatalog.once5 : [];
      const repList = this.state.questCatalog ? this.state.questCatalog.repeatable5 : [];
      const blitzQ = this.getDailyBlitzQuest();
      const todayDateStr = this.getTodayDateString();
      const blitzDone = (this.state.blitzClaimedDate === todayDateStr) || (blitzQ && blitzQ.completed);

      const todayKey = this.getTodayKey();
      const selKey = this.selectedDayKey || todayKey;
      const selDayObj = (this.state.weekSchedule && this.state.weekSchedule[selKey]) ? this.state.weekSchedule[selKey] : null;
      const isTodaySelected = (selKey === todayKey);

      container.innerHTML = `
        ${blitzQ ? `
          <div style="background:linear-gradient(135deg, #fef3c7, #fde68a); border:2.5px solid #f59e0b; border-radius:16px; padding:11px 13px; margin-bottom:12px; box-shadow:0 4px 10px rgba(245,158,11,0.18);">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <div>
                <div style="font-size:0.74rem; font-weight:900; color:#b45309; text-transform:uppercase; letter-spacing:0.4px;">🔥 БЛІЦ-МІСІЯ ДНЯ (ПОДВІЙНА НАГОРОДА!)</div>
                <div style="font-weight:900; color:#451a03; font-size:0.92rem; margin-top:2px;">${blitzQ.icon} ${blitzQ.title}</div>
                <div style="font-size:0.74rem; color:#78350f; font-weight:700; margin-top:2px;">Виконай сьогодні й отримай <b>+${blitzQ.coins} 🪙 + 5 бонусних 🪙 = ${(blitzQ.coins || 10) + 5} 🪙</b>!</div>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${blitzQ.id}')" title="Озвучити українською 🔊">🔊</button>
                ${blitzDone ? `
                  <span style="background:#dcfce7; color:#15803d; font-weight:900; font-size:0.76rem; padding:6px 10px; border-radius:10px; white-space:nowrap;">🔥 Бонус забрано!</span>
                ` : `
                  <button class="btn-primary" style="width:auto; padding:7px 12px; font-size:0.78rem; background:#ea580c; box-shadow:0 4px 0 #c2410c; white-space:nowrap;"
                          onclick="window.game.completeCatalogQuest('once5', '${blitzQ.id}')">
                    🔥 +${(blitzQ.coins || 10) + 5} 🪙
                  </button>
                `}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 1. Легкі ігрові місії у світі гри (+3 🪙 без PIN-коду) -->
        <div style="background:#f0fdf4; border:2px solid #4ade80; border-radius:14px; padding:10px 12px; margin-bottom:14px;">
          <div style="font-size:0.85rem; font-weight:900; color:#15803d; margin-bottom:4px;">
            🎮 Ігрові місії у кімнатах (по +3 🪙 без PIN-коду — на одяг і декор):
          </div>
          <div style="font-size:0.73rem; color:#166534; font-weight:700; margin-bottom:8px;">
            Піклуйся про віртуальну Даніку та Бруно прямо у кімнатах і заробляй перші монетки самостійно!
          </div>
          <div style="display:flex; flex-direction:column; gap:7px;">
            ${ingameList.map(q => `
              <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : '#bbf7d0'}; border-radius:12px; padding:8px 10px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div style="display:flex; align-items:center; gap:9px; flex:1;">
                  <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                  <div style="flex:1;">
                    <div style="font-size:0.84rem; font-weight:900; color:#1e293b;">${q.title}</div>
                    <div style="font-size:0.72rem; color:#475569; font-weight:600;">${q.desc}</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                  ${q.completed ? `
                    <span style="color:#16a34a; font-weight:900; font-size:0.76rem; padding:4px 8px; background:#dcfce7; border-radius:8px; white-space:nowrap;">Виконано ✔️</span>
                  ` : `
                    <button class="btn-primary" style="width:auto; padding:6px 11px; font-size:0.76rem; background:#10b981; box-shadow:0 3px 0 #059669; white-space:nowrap;"
                            onclick="window.game.completeCatalogQuest('ingame3', '${q.id}')">
                      🎮 +${q.coins} 🪙
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. План пригод за розкладом дня тижня -->
        ${selDayObj ? `
          <div style="background:#eff6ff; border:2px solid #93c5fd; border-radius:14px; padding:10px 12px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <div style="font-size:0.85rem; font-weight:900; color:#1e40af;">
                🗓️ ${selDayObj.dayName}: ${selDayObj.theme}
              </div>
              <span style="font-size:0.7rem; font-weight:800; padding:2px 7px; border-radius:8px; background:${isTodaySelected ? '#dbeafe' : '#fef3c7'}; color:${isTodaySelected ? '#1d4ed8' : '#b45309'};">
                ${isTodaySelected ? 'Сьогоднішній план' : '🔒 Інший день тижня'}
              </span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${selDayObj.quests.map(q => `
                <div style="background:#fff; border:1.5px solid ${q.completed ? '#86efac' : '#bfdbfe'}; border-radius:10px; padding:8px 10px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <div style="display:flex; align-items:center; gap:8px; flex:1;">
                    <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                    <div>
                      <div style="font-size:0.82rem; font-weight:800; color:#1e293b;">${q.title}</div>
                      <div style="font-size:0.7rem; color:#0369a1; font-weight:800;">+${q.coins} 🪙 | +${q.xp} ⭐</div>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                    ${q.completed ? `
                      <span style="color:#16a34a; font-weight:900; font-size:0.76rem; padding:4px 8px; background:#dcfce7; border-radius:8px; white-space:nowrap;">Виконано ✔️</span>
                    ` : isTodaySelected ? `
                      <button class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.75rem; background:#2563eb; box-shadow:0 3px 0 #1d4ed8; white-space:nowrap;"
                              onclick="window.game.toggleDayQuest('${selKey}', '${q.id}')">
                        Здати (+${q.coins} 🪙)
                      </button>
                    ` : `
                      <span style="font-size:0.72rem; color:#64748b; font-weight:800; white-space:nowrap;">🔒 У ${selDayObj.shortName}</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. Щоденні справи в реальному житті (+10-12 🪙 + 🎁) -->
        <div style="font-size:0.85rem; font-weight:900; color:#78350f; margin:10px 0 6px 2px;">
          🌟 Щоденні справи у реальному житті (по 10–12 🪙 + 🎁 Сюрприз):
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
          ${onceList.map(q => `
            <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : '#cbd5e1'}; border-radius:14px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div style="display:flex; align-items:center; gap:10px; flex:1;">
                <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                <div style="flex:1;">
                  <div style="font-size:0.88rem; font-weight:900; color:#1e293b;">${q.title}</div>
                  ${q.desc ? `<div style="font-size:0.75rem; color:#475569; font-weight:600; margin-top:2px; line-height:1.3;">${q.desc}</div>` : ''}
                  <div style="font-size:0.72rem; color:#d97706; font-weight:800; margin-top:3px;">+${q.coins} 🪙 | +${q.xp} ⭐ | 🎁 Сюрприз</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                ${q.completed ? `
                  <span style="color:#16a34a; font-weight:900; font-size:0.8rem; padding:5px 10px; background:#dcfce7; border-radius:10px; white-space:nowrap;">Виконано ✔️</span>
                ` : `
                  <button class="btn-primary" style="width:auto; padding:7px 13px; font-size:0.8rem; background:#f59e0b; white-space:nowrap;" 
                          onclick="window.game.completeCatalogQuest('once5', '${q.id}')">
                    Зробити (+${q.coins} 🪙)
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 4. Системні навички та читання (до 3 разів на день кожна) -->
        <div style="font-size:0.85rem; font-weight:900; color:#78350f; margin:10px 0 6px 2px;">
          🔄 Системні навички та читання (по 10 🪙, до 3 разів на день):
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${repList.map(q => {
            const dCount = q.dailyCount || 0;
            const maxD = q.maxDaily || 3;
            const reachedCap = dCount >= maxD;
            return `
              <div style="background:#fff; border:2px solid ${reachedCap ? '#86efac' : '#93c5fd'}; border-radius:14px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="display:flex; align-items:center; gap:10px; flex:1;">
                  <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                  <div style="flex:1;">
                    <div style="font-size:0.88rem; font-weight:900; color:#1e293b;">${q.title}</div>
                    ${q.desc ? `<div style="font-size:0.75rem; color:#475569; font-weight:600; margin-top:2px; line-height:1.3;">${q.desc}</div>` : ''}
                    <div style="font-size:0.72rem; color:#0369a1; font-weight:800; margin-top:3px;">
                      Сьогодні: <b>${dCount}/${maxD}</b> • Всього: ${q.counter || 0} разів (+${(q.counter || 0) * q.coins} 🪙)
                    </div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                  ${reachedCap ? `
                    <span style="color:#16a34a; font-weight:900; font-size:0.76rem; padding:5px 9px; background:#dcfce7; border-radius:10px; white-space:nowrap;">Денна норма ${maxD}/${maxD} ✔️</span>
                  ` : `
                    <button class="btn-primary" style="width:auto; padding:7px 13px; font-size:0.8rem; background:#0284c7; box-shadow:0 4px 0 #0369a1; white-space:nowrap;" 
                            onclick="window.game.completeCatalogQuest('repeatable5', '${q.id}')">
                      ➕ Здати (+${q.coins} 🪙)
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeTabletTab === 'special') {
      const q10 = this.state.questCatalog ? this.state.questCatalog.quests10 : [];
      const q20 = this.state.questCatalog ? this.state.questCatalog.quests20 : [];

      container.innerHTML = `
        <div style="background:#fff; border:2px solid #f59e0b; border-radius:14px; padding:10px; margin-bottom:12px;">
          <div style="font-weight:900; color:#b45309; font-size:0.95rem;">⭐ Особливі Пригоди, Детектив та Кооп з Батьками (18 🪙 та 30 🪙)</div>
          <div style="font-size:0.75rem; color:#78350f; font-weight:700;">
            Пошукові ігри вдома, секретні добрі справи, кулінарні та спортивні дуети з мамою і татом!
          </div>
        </div>

        <div style="font-size:0.85rem; font-weight:900; color:#78350f; margin:10px 0 6px 2px;">
          🕵️‍♀️ Детективні, добрі та творчі місії на 18 монет:
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
          ${q10.map(q => `
            <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : '#cbd5e1'}; border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div style="display:flex; align-items:center; gap:10px; flex:1;">
                <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                <div>
                  <div style="font-size:0.86rem; font-weight:800; color:#1e293b;">${q.title}</div>
                  <div style="font-size:0.74rem; color:#475569; font-weight:600;">${q.desc}</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                ${q.completed ? `
                  <span style="color:#16a34a; font-weight:900; font-size:0.8rem; padding:4px 8px; background:#dcfce7; border-radius:8px; white-space:nowrap;">Виконано ✔️</span>
                ` : `
                  <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; background:#f59e0b; white-space:nowrap;" 
                          onclick="window.game.completeCatalogQuest('quests10', '${q.id}')">
                    Виконати (+${q.coins} 🪙)
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="font-size:0.85rem; font-weight:900; color:#78350f; margin:10px 0 6px 2px;">
          🌟 Великі та Сімейні Кооп-місії на 30 монет:
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${q20.map(q => `
            <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : (q.coopWith ? '#f472b6' : '#e2e8f0')}; border-radius:12px; padding:10px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div style="display:flex; gap:10px; align-items:center; flex:1;">
                  <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                  <div>
                    ${q.coopWith ? `<div style="display:inline-block; font-size:0.68rem; font-weight:900; background:#fdf2f8; color:#be185d; border:1px solid #f9a8d4; border-radius:6px; padding:1px 6px; margin-bottom:3px;">🤝 СПІЛЬНА МІСІЯ (+${q.coins} 🪙 і +${q.xp} XP також ${q.coopWith === 'mom' ? 'Мамі' : 'Татові'}!)</div>` : ''}
                    <div style="font-weight:900; color:#1e293b; font-size:0.88rem;">${q.title}</div>
                    <div style="font-size:0.74rem; color:#475569; font-weight:600;">${q.desc}</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                  <div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:10px; padding:2px 6px; font-weight:900; color:#b45309; font-size:0.78rem; white-space:nowrap;">
                    +${q.coins} 🪙
                  </div>
                </div>
              </div>
              <div style="margin-top:8px; display:flex; justify-content:flex-end; gap:6px;">
                ${q.id === 'q_grandma_poem' ? `
                  <button class="btn-primary" style="width:auto; padding:4px 10px; font-size:0.75rem; background:#0284c7; box-shadow:0 3px 0 #0369a1;" 
                          onclick="window.game.openPoemModal('grandma')">
                    📖 Читати вірш
                  </button>
                ` : ''}
                ${q.id === 'q_spanish_poem' ? `
                  <button class="btn-primary" style="width:auto; padding:4px 10px; font-size:0.75rem; background:#0284c7; box-shadow:0 3px 0 #0369a1;" 
                          onclick="window.game.openPoemModal('spanish')">
                    📖 Читати вірш
                  </button>
                ` : ''}
                ${q.completed ? `
                  <span style="color:#16a34a; font-weight:900; font-size:0.8rem; padding:4px 8px; background:#dcfce7; border-radius:8px;">Виконано ✔️</span>
                ` : `
                  <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.8rem; background:#16a34a; box-shadow:0 4px 0 #15803d;" 
                          onclick="window.game.completeCatalogQuest('quests20', '${q.id}')">
                    Здати батькам (+${q.coins} 🪙)
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.activeTabletTab === 'projects') {
      const p30 = this.state.questCatalog ? this.state.questCatalog.projects30 : [];

      container.innerHTML = `
        <div style="background:#fff; border:2px solid #0284c7; border-radius:14px; padding:10px; margin-bottom:12px;">
          <div style="font-weight:900; color:#0369a1; font-size:0.95rem;">🎓 Проекти-Презентації (по 45 🪙)</div>
          <div style="font-size:0.75rem; color:#075985; font-weight:700;">
            Підготуй презентацію, покажи малюнки та факти і захисти перед родиною!
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${p30.map(q => `
            <div style="background:#fff; border:2px solid ${q.completed ? '#86efac' : '#cbd5e1'}; border-radius:14px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div style="display:flex; gap:10px; align-items:center; flex:1;">
                  <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                  <div>
                    <div style="font-weight:900; color:#1e293b; font-size:0.9rem;">${q.title}</div>
                    <div style="font-size:0.74rem; color:#64748b; margin-top:2px;">${q.desc}</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                  <div style="background:#dbeafe; border:1.5px solid #3b82f6; border-radius:12px; padding:3px 8px; font-weight:900; color:#1d4ed8; font-size:0.82rem; white-space:nowrap;">
                    +${q.coins} 🪙
                  </div>
                </div>
              </div>
              <div style="margin-top:10px; display:flex; justify-content:flex-end;">
                ${q.completed ? `
                  <span style="color:#16a34a; font-weight:900; font-size:0.85rem; padding:4px 10px; background:#dcfce7; border-radius:8px;">🏆 Захищено ✔️</span>
                ` : `
                  <button class="btn-primary" style="width:auto; padding:6px 14px; font-size:0.82rem; background:#0284c7; box-shadow:0 4px 0 #0369a1;" 
                          onclick="window.game.completeCatalogQuest('projects30', '${q.id}')">
                    🎓 Захистити проект перед батьками (+${q.coins} 🪙)
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.activeTabletTab === 'weekly') {
      const todayDateStr = this.getTodayDateString();
      container.innerHTML = `
        <div style="background:#faf5ff; border:2px solid #c084fc; border-radius:14px; padding:10px 12px; margin-bottom:10px;">
          <div style="font-size:0.88rem; font-weight:900; color:#6b21a8;">
            🏔️ 5-денні Системні Звички за Справжні Євро (€) та Кристали 💎
          </div>
          <div style="font-size:0.74rem; color:#581c87; font-weight:700; margin-top:2px;">
            Кожна звичка триває 5 днів (по 1 кроку на день). Завершивши всі 5 кроків, ти отримуєш кристали 💎 (1 💎 = 1 €) та бонусні монети!
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${this.state.weeklyQuests.map(q => {
            const isDone = q.current >= q.max;
            const doneToday = (q.lastStepDate === todayDateStr);
            const pct = Math.min(100, Math.round((q.current / (q.max || 5)) * 100));
            return `
              <div style="background:#fff; border:2px solid ${isDone ? '#86efac' : '#cbd5e1'}; border-radius:14px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                  <div style="display:flex; gap:10px; align-items:center; flex:1;">
                    <span class="quest-card-svg-icon">${window.getGameIcon ? window.getGameIcon(q.icon) : q.icon}</span>
                    <div>
                      <div style="font-weight:900; color:#1e293b; font-size:0.88rem;">${q.title}</div>
                      <div style="font-size:0.72rem; color:#64748b;">${q.description}</div>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <button class="btn-quest-voice" onclick="event.stopPropagation(); window.game.speakQuest('${q.id}')" title="Озвучити українською 🔊">🔊</button>
                    <div style="background:#f3e8ff; border:1.5px solid #a855f7; border-radius:12px; padding:2px 8px; font-weight:900; color:#7e22ce; font-size:0.78rem; white-space:nowrap;">
                      +${q.crystals} 💎 (${q.crystals} €) + ${q.coins} 🪙
                    </div>
                  </div>
                </div>
                <div style="background:#f1f5f9; height:8px; border-radius:99px; overflow:hidden; margin:8px 0 6px;">
                  <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #a855f7, #ec4899); border-radius:99px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.78rem; font-weight:800; color:#78350f;">Прогрес: ${q.current}/${q.max} днів</span>
                  ${isDone ? '<span style="color:#16a34a; font-weight:900;">🏆 Завершено</span>' : doneToday ? `
                    <span style="color:#0284c7; font-weight:800; font-size:0.75rem; background:#e0f2fe; padding:4px 8px; border-radius:8px;">Сьогодні зараховано ✔️</span>
                  ` : `
                    <button class="btn-primary" style="width:auto; padding:5px 11px; font-size:0.75rem; background:#9333ea; box-shadow:0 3px 0 #7e22ce;" onclick="window.game.addWeeklyProgress('${q.id}')">
                      ➕ Зарахувати день (+1)
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeTabletTab === 'rewards') {
      container.innerHTML = `
        <div style="background:linear-gradient(135deg, #fffbeb, #fef3c7); border:2px solid #f59e0b; border-radius:14px; padding:10px 12px; margin-bottom:12px;">
          <div style="font-weight:900; color:#b45309; font-size:0.95rem;">🏪 Лавка Нагород та Купонів Володарки Дня</div>
          <div style="font-size:0.75rem; color:#78350f; font-weight:700; margin-top:2px;">
            Твій гаманець: <b>${this.state.coins} 🪙 монет</b> та <b>${this.state.crystals} 💎 кристалів (${this.state.crystals} €)</b>. Обирай призи або збирай на велику мрію!
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${this.renderRewardsListHtml()}
        </div>
      `;
    } else if (this.activeTabletTab === 'surprises') {
      const allStickers = (typeof MYSTERY_STICKERS !== 'undefined' ? MYSTERY_STICKERS : []);
      const myStickers = this.state.collectedStickers || [];
      const myNotes = this.state.familyNotes || [];
      const allGifts = (typeof BRUNO_SPECIAL_GIFTS !== 'undefined' ? BRUNO_SPECIAL_GIFTS : []);
      const myGifts = this.state.brunoSpecialGifts || [];

      container.innerHTML = `
        <div style="background:linear-gradient(135deg, #fdf2f8, #fce7f3); border:2px solid #ec4899; border-radius:14px; padding:12px; margin-bottom:14px; text-align:center;">
          <div style="font-weight:900; color:#be185d; font-size:1.05rem;">🎁 ТАЄМНИЧА СКАРБНИЧКА СЮРПРИЗІВ</div>
          <div style="font-size:0.78rem; color:#9d174d; font-weight:700; margin-top:3px;">
            Кожне виконане завдання дарує шанс знайти рідкісний стікер, теплі слова від рідних або подарунок для Бруно!
          </div>
        </div>

        <!-- 1. Альбом стікерів -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-weight:900; color:#78350f; font-size:0.92rem;">
            🌟 Альбом Стікерів (${myStickers.length}/${allStickers.length})
          </div>
          <span style="font-size:0.75rem; font-weight:800; color:#ec4899; background:#fff; padding:2px 8px; border-radius:10px; border:1px solid #fbcfe8;">
            ${Math.round((myStickers.length / (allStickers.length || 1)) * 100)}% зібрано
          </span>
        </div>
        <div class="stickers-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(78px, 1fr)); gap:8px; margin-bottom:18px;">
          ${allStickers.map(stk => {
            const isUnlocked = myStickers.includes(stk.id);
            return `
              <div class="sticker-slot ${isUnlocked ? 'unlocked' : 'locked'}" title="${isUnlocked ? stk.name + ' - ' + stk.desc : 'Виконуй завдання, щоб відкрити цей стікер!'}">
                <div class="sticker-icon">${isUnlocked ? stk.icon : '🔒'}</div>
                <div class="sticker-name">${isUnlocked ? stk.name : '???'}</div>
                <div class="sticker-rarity">${isUnlocked ? stk.rarity : 'Секрет'}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 2. Теплі записки від сім'ї -->
        <div style="font-weight:900; color:#78350f; font-size:0.92rem; margin-bottom:8px;">
          💌 Записки Любові від Родини (${myNotes.length})
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:18px;">
          ${myNotes.length === 0 ? `
            <div style="background:#fff; border:2px dashed #f59e0b; border-radius:12px; padding:14px; text-align:center; color:#92400e; font-size:0.82rem; font-weight:700;">
              💌 Тут з'являтимуться таємні теплі записки від мами, тата, бабусі та песика Бруно за твої старання!
            </div>
          ` : myNotes.map(n => `
            <div class="family-note-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-weight:900; color:#b45309; font-size:0.85rem;">${n.from}</span>
                <span style="font-size:0.7rem; color:#92400e; background:#fef3c7; padding:1px 6px; border-radius:6px;">${n.date || 'Сьогодні'}</span>
              </div>
              <div style="font-size:0.82rem; color:#451a03; line-height:1.45; font-style:italic; font-weight:600;">
                "${n.text}"
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 3. Подарунки для Бруно -->
        <div style="font-weight:900; color:#78350f; font-size:0.92rem; margin-bottom:8px;">
          🎾 Подарунки та Ласощі для Бруно (${myGifts.length}/${allGifts.length})
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${allGifts.map(g => {
            const hasGift = myGifts.includes(g.id);
            return `
              <div style="background:#fff; border:2px solid ${hasGift ? '#86efac' : '#e2e8f0'}; border-radius:12px; padding:10px; display:flex; justify-content:space-between; align-items:center; opacity:${hasGift ? '1' : '0.6'};">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:26px;">${hasGift ? g.icon : '🔒'}</span>
                  <div>
                    <div style="font-weight:900; color:#1e293b; font-size:0.86rem;">${hasGift ? g.name : 'Секретна іграшка'}</div>
                    <div style="font-size:0.72rem; color:#64748b;">${hasGift ? g.desc : 'Виконуй завдання, щоб подарувати Бруно!'}</div>
                  </div>
                </div>
                ${hasGift ? `
                  <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.76rem; background:#10b981; box-shadow:0 3px 0 #059669;" onclick="window.game.playWithBrunoGift('${g.id}')">
                    🐾 Дати Бруно!
                  </button>
                ` : `
                  <span style="font-size:0.75rem; color:#94a3b8; font-weight:800;">Зачинено</span>
                `}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeTabletTab === 'academy') {
      container.innerHTML = this.renderAcademyTabletHtml ? this.renderAcademyTabletHtml() : '';
    }
    if (window.applyGameIcons) window.applyGameIcons();
  }

  rollMysteryReward(questTitle) {
    if (!this.state.collectedStickers) this.state.collectedStickers = [];
    if (!this.state.familyNotes) this.state.familyNotes = [];
    if (!this.state.brunoSpecialGifts) this.state.brunoSpecialGifts = [];

    const roll = Math.random();
    let reward = null;

    if (roll < 0.42) {
      // 1. Стікер для альбому (1 з 12)
      const allStickers = (typeof MYSTERY_STICKERS !== 'undefined' ? MYSTERY_STICKERS : []);
      const uncollected = allStickers.filter(s => !this.state.collectedStickers.includes(s.id));
      const sticker = (uncollected.length > 0)
        ? uncollected[Math.floor(Math.random() * uncollected.length)]
        : allStickers[Math.floor(Math.random() * allStickers.length)];

      if (sticker) {
        const isNew = !this.state.collectedStickers.includes(sticker.id);
        if (isNew) {
          this.state.collectedStickers.push(sticker.id);
        }
        reward = {
          type: 'sticker',
          title: sticker.name,
          icon: sticker.icon,
          desc: sticker.desc,
          rarity: sticker.rarity,
          badge: isNew ? '🌟 НОВИЙ СТІКЕР В АЛЬБОМ!' : '⭐ СТІКЕР З КОЛЕКЦІЇ',
          isNew: isNew
        };
      }
    } else if (roll < 0.70) {
      // 2. Секретна тепла записка від рідних
      const allNotes = (typeof FAMILY_LOVE_NOTES !== 'undefined' ? FAMILY_LOVE_NOTES : []);
      const uncollected = allNotes.filter(n => !this.state.familyNotes.some(fn => fn.id === n.id));
      const note = (uncollected.length > 0)
        ? uncollected[Math.floor(Math.random() * uncollected.length)]
        : allNotes[Math.floor(Math.random() * allNotes.length)];

      if (note) {
        const isNew = !this.state.familyNotes.some(fn => fn.id === note.id);
        if (isNew) {
          this.state.familyNotes.push({
            ...note,
            date: new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
          });
        }
        reward = {
          type: 'note',
          title: note.from,
          icon: '💌',
          desc: `"${note.text}"`,
          rarity: 'Зворушлива любов родини ❤️',
          badge: '💌 ТАЄМНА ТЕПЛА ЗАПИСКА',
          isNew: isNew
        };
      }
    } else if (roll < 0.90) {
      // 3. Спеціальний подарунок чи смаколик для Бруно
      const allGifts = (typeof BRUNO_SPECIAL_GIFTS !== 'undefined' ? BRUNO_SPECIAL_GIFTS : []);
      const gift = allGifts[Math.floor(Math.random() * allGifts.length)];

      if (gift) {
        const isNew = !this.state.brunoSpecialGifts.includes(gift.id);
        if (isNew) {
          this.state.brunoSpecialGifts.push(gift.id);
        }
        reward = {
          type: 'bruno_gift',
          title: gift.name,
          icon: gift.icon,
          desc: gift.desc,
          rarity: 'Для вірного песика Бруно 🐶',
          badge: '🐾 ПОДАРУНОК ДЛЯ БРУНО!',
          isNew: isNew
        };
      }
    } else {
      // 4. Золота скарбничка (+5 бонусних монет; кристали заробляються лише за 5-денні тижневі цілі!)
      this.state.coins = (this.state.coins || 0) + 5;
      reward = {
        type: 'jackpot',
        title: 'Золота Скарбничка (+5 🪙 бонусних монет)',
        icon: '🪙',
        desc: 'Секретні бонусні монетки! На крок ближче до нового одягу або купона володарки дня!',
        rarity: 'ЗОЛОТИЙ БОНУС! 💰',
        badge: '💰 ЗОЛОТИЙ БОНУС!',
        isNew: true
      };
    }

    this.saveState();
    return reward;
  }

  showMysteryRewardModal(quest, reward) {
    if (!reward) return;

    const modal = document.getElementById('mystery-modal');
    if (!modal) return;

    const boxAnim = document.getElementById('mystery-box-animation');
    const badgeEl = document.getElementById('mystery-badge');
    const titleEl = document.getElementById('mystery-title');
    const sourceEl = document.getElementById('mystery-task-source');
    const iconEl = document.getElementById('mystery-item-icon');
    const descEl = document.getElementById('mystery-item-desc');
    const rarityEl = document.getElementById('mystery-item-rarity');
    const bonusEl = document.getElementById('mystery-currency-bonus');

    if (badgeEl) badgeEl.innerText = reward.badge || 'ТАЄМНИЧИЙ СЮРПРИЗ! 🎁';
    if (titleEl) titleEl.innerText = reward.title;
    if (sourceEl) sourceEl.innerText = `За виконання: «${quest ? quest.title : 'Квест'}»`;
    if (iconEl) iconEl.innerText = reward.icon;
    if (descEl) descEl.innerText = reward.desc;
    if (rarityEl) rarityEl.innerText = reward.rarity || 'Особливий сюрприз ⭐';
    const qCoins = quest ? (quest.coins || 5) : 5;
    const qXp = quest ? (quest.xp || 20) : 20;
    const qEnergy = quest ? (quest.energy || Math.max(15, qCoins * 3)) : 15;
    if (bonusEl) bonusEl.innerText = `+${qCoins} 🪙 монет | +${qXp} ⭐ досвіду | +${qEnergy} ⚡ енергії`;

    if (boxAnim) {
      boxAnim.classList.remove('box-wobble-open');
      void boxAnim.offsetWidth;
      boxAnim.classList.add('box-wobble-open');
    }

    if (window.soundFX && typeof window.soundFX.playChestOpen === 'function') {
      window.soundFX.playChestOpen();
    }
    this.launchConfetti();

    this.openModal('mystery-modal');
    if (window.applyGameIcons) window.applyGameIcons(modal);
    setTimeout(() => {
      this.speak(`Ура! Тобі випав таємничий сюрприз: ${reward.title}!`);
    }, 450);
  }

  playWithBrunoGift(giftId) {
    const allGifts = (typeof BRUNO_SPECIAL_GIFTS !== 'undefined' ? BRUNO_SPECIAL_GIFTS : []);
    const gift = allGifts.find(g => g.id === giftId);
    if (!gift) return;

    if (window.soundFX) {
      if (typeof window.soundFX.playBark === 'function') window.soundFX.playBark();
      setTimeout(() => {
        if (typeof window.soundFX.playBallBounce === 'function') window.soundFX.playBallBounce();
      }, 250);
    }
    this.launchConfetti();
    this.speak(`Гав-гав! Бруно неймовірно радий: ${gift.name}! Він весело виляє хвостиком і стрибає від щастя!`);

    const brunoEl = document.querySelector('.character-bruno-wrap') || document.getElementById('bruno-character');
    if (brunoEl) {
      brunoEl.classList.add('bruno-super-bounce');
      setTimeout(() => brunoEl.classList.remove('bruno-super-bounce'), 1200);
    }
  }

  completeCatalogQuest(category, questId) {
    if (!this.state.questCatalog || !this.state.questCatalog[category]) return;
    const q = this.state.questCatalog[category].find(item => item.id === questId);
    if (!q) return;

    if (!q.multi && q.completed) {
      alert("✨ Це завдання вже виконано сьогодні!");
      return;
    }

    if (category === 'repeatable5') {
      const dCount = q.dailyCount || 0;
      const maxD = q.maxDaily || 3;
      if (dCount >= maxD) {
        alert(`🌟 Ти вже виконала це тренування ${maxD} рази сьогодні! Відпочинь і продовжуй завтра!`);
        return;
      }
    }

    // 1. Легкі ігрові місії у світі гри (+3 🪙 без PIN-коду батьків)
    if (category === 'ingame3' || q.noPin) {
      q.completed = true;
      const rewardCoins = q.coins || 3;
      const rewardXp = q.xp || 10;
      this.state.coins = (this.state.coins || 0) + rewardCoins;
      this.addXP(rewardXp);
      const unlockedBruno = this.checkBrunoQuestUnlock(questId);
      this.saveState();

      window.soundFX.playVictory();
      setTimeout(() => window.soundFX.playCoin(), 200);
      this.launchConfetti();
      const brunoMsg = unlockedBruno ? ` Та відкрито новий образ: ${unlockedBruno.title}!` : '';
      this.speak(`Чудово! Ігрова місія «${q.title}» виконана! Плюс ${rewardCoins} монетки у гаманець!${brunoMsg}`);
      this.render();
      if (document.getElementById('adventure-tablet').classList.contains('active')) {
        this.renderTabletContent();
      }
      return;
    }

    // 2. Реальні завдання (підтверджуються PIN-кодом батьків)
    this.requestParentApproval({
      title: `${q.icon || '⭐'} ${q.title}`,
      coins: q.coins || 5,
      xp: q.xp || 20,
      icon: q.icon,
      isCatalogQuest: true,
      onApproved: () => {
        if (q.multi) {
          q.counter = (q.counter || 0) + 1;
          q.dailyCount = (q.dailyCount || 0) + 1;
        } else {
          q.completed = true;
        }

        let earnedCoins = q.coins || 5;
        let blitzBonusMsg = '';
        const blitzQ = this.getDailyBlitzQuest();
        const todayDateStr = this.getTodayDateString();
        if (category === 'once5' && blitzQ && blitzQ.id === q.id && this.state.blitzClaimedDate !== todayDateStr) {
          this.state.blitzClaimedDate = todayDateStr;
          earnedCoins += 5;
          blitzBonusMsg = ' 🔥 Включно з +5 🪙 за Бліц-Місію Дня!';
        }

        this.state.coins += earnedCoins;
        this.addXP(q.xp || 20);
        const earnedEnergy = q.energy || Math.max(15, (q.coins || 5) * 3);
        this.addEnergy(earnedEnergy);

        // Якщо це Сімейна Кооп-місія з Мамою чи Татом — нараховуємо бонус і їм у профіль!
        let coopMsg = '';
        if (q.coopWith && this.state.familyProfiles && this.state.familyProfiles[q.coopWith]) {
          const pProf = this.state.familyProfiles[q.coopWith];
          pProf.coins = (pProf.coins || 0) + 20;
          pProf.xp = (pProf.xp || 0) + 80;
          pProf.completedTodayCount = (pProf.completedTodayCount || 0) + 1;
          pProf.completedWeekCount = (pProf.completedWeekCount || 0) + 1;
          coopMsg = ` А ${pProf.name} також отримує плюс 20 монет та 80 досвіду у сімейний рейтинг!`;
        }

        const unlockedBruno = this.checkBrunoQuestUnlock(questId);
        const brunoBonusMsg = unlockedBruno ? ` 🐶 Та відкрито образ: ${unlockedBruno.title}!` : '';

        // Таємничий сюрприз (Variable Reward)
        const mysteryReward = this.rollMysteryReward(q.title);
        this.saveState();

        window.soundFX.playVictory();
        setTimeout(() => window.soundFX.playCoin(), 300);
        this.launchConfetti();

        const msg = q.multi 
          ? `Чудово! Зараховано (${q.dailyCount}/${q.maxDaily || 3} сьогодні): +${earnedCoins} 🪙 та +${earnedEnergy} ⚡!`
          : `Ура! Завдання «${q.title}» виконано! Отримано +${earnedCoins} 🪙 та +${earnedEnergy} ⚡ енергії!${blitzBonusMsg}${coopMsg}${brunoBonusMsg}`;
        this.speak(msg);

        this.render();
        if (document.getElementById('adventure-tablet').classList.contains('active')) {
          this.renderTabletContent();
        }

        // Відкриваємо модалку таємничого сюрпризу
        setTimeout(() => {
          this.showMysteryRewardModal({ ...q, coins: earnedCoins, energy: earnedEnergy }, mysteryReward);
        }, 300);
      }
    });
  }

  openPoemModal(poemType) {
    window.soundFX.playClick();
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    if (poemType === 'grandma') {
      const q = this.state.questCatalog && this.state.questCatalog.quests20
        ? this.state.questCatalog.quests20.find(item => item.id === 'q_grandma_poem')
        : null;
      const isDone = q ? q.completed : false;

      content.innerHTML = `
        <div style="text-align:center; margin-bottom:12px;">
          <div style="font-size:48px; margin-bottom:4px;">👵🐱❤️</div>
          <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">ВІРШИК ДЛЯ БАБУСІ</h2>
          <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; border-radius:12px; padding:3px 12px; font-weight:900; color:#b45309; font-size:0.85rem; margin-top:4px;">
            Нагорода: +20 🪙 монет | +80 ⭐ досвіду | +60 ⚡ енергії
          </div>
        </div>

        <div style="background:#fffbeb; border:2.5px dashed #f59e0b; border-radius:18px; padding:18px; margin-bottom:14px; text-align:center;">
          <div style="font-family:'Fredoka', cursive; font-size:1.15rem; line-height:1.7; color:#1e293b; font-weight:600; white-space:pre-line;">
Щось мале, руде і прудке
по стежині скаче,
це пухнасте кошеня,
але чомусь плаче.

Не журися кошенятко,
я тебе зігрію,
буде в тебе теплий дім,
ласка і надія!
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="background:#0284c7; box-shadow:0 4px 0 #0369a1;" 
                  onclick="window.game.speak('Щось мале, руде і прудке по стежині скаче, це пухнасте кошеня, але чомусь плаче. Не журися кошенятко, я тебе зігрію, буде в тебе теплий дім, ласка і надія!', 'uk', 'poem_grandma')">
            🔊 Прослухати вголос
          </button>
          ${isDone ? `
            <div style="text-align:center; color:#16a34a; font-weight:900; padding:8px;">✅ Вже здано батькам (+20 🪙)!</div>
          ` : `
            <button class="btn-primary" style="background:#16a34a; box-shadow:0 4px 0 #15803d; padding:12px;" 
                    onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('quests20', 'q_grandma_poem');">
              🌟 Я вивчила! Здати батькам (+20 🪙)
            </button>
          `}
        </div>
      `;
    } else if (poemType === 'spanish') {
      const q = this.state.questCatalog && this.state.questCatalog.quests20
        ? this.state.questCatalog.quests20.find(item => item.id === 'q_spanish_poem')
        : null;
      const isDone = q ? q.completed : false;

      content.innerHTML = `
        <div style="text-align:center; margin-bottom:12px;">
          <div style="font-size:48px; margin-bottom:4px;">🦋🇪🇸🌿</div>
          <h2 style="font-family:'Fredoka', cursive; font-size:1.35rem; color:#451a03;">POEMA EN ESPAÑOL</h2>
          <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; border-radius:12px; padding:3px 12px; font-weight:900; color:#b45309; font-size:0.85rem; margin-top:4px;">
            Premio: +20 🪙 monedas | +80 ⭐ | +60 ⚡
          </div>
        </div>

        <div style="background:#f0fdf4; border:2.5px dashed #22c55e; border-radius:18px; padding:18px; margin-bottom:14px; text-align:center;">
          <div style="font-family:'Fredoka', cursive; font-size:1.15rem; line-height:1.7; color:#1e293b; font-weight:600; white-space:pre-line;">
Mariposa del aire,
qué hermosa eres,
mariposa del aire
dorada y verde.

Luz de candil,
mariposa del aire,
¡quédate ahí, ahí, ahí!
          </div>
          <div style="font-size:0.8rem; color:#15803d; margin-top:8px; font-weight:700;">— Federico García Lorca</div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="background:#0284c7; box-shadow:0 4px 0 #0369a1;" 
                  onclick="window.game.speak('Mariposa del aire, qué hermosa eres, mariposa del aire dorada y verde. Luz de candil, mariposa del aire, quédate ahí, ahí, ahí!', 'es', 'poem_spanish')">
            🔊 Escuchar en español
          </button>
          ${isDone ? `
            <div style="text-align:center; color:#16a34a; font-weight:900; padding:8px;">✅ Вже здано батькам (+20 🪙)!</div>
          ` : `
            <button class="btn-primary" style="background:#16a34a; box-shadow:0 4px 0 #15803d; padding:12px;" 
                    onclick="window.game.closeModal('action-modal'); window.game.completeCatalogQuest('quests20', 'q_spanish_poem');">
              🌟 Я вивчила! Здати батькам (+20 🪙)
            </button>
          `}
        </div>
      `;
    }

    modal.classList.add('active');
  }

  toggleDayQuest(dayKey, questId, fromParent = false) {
    const dayObj = this.state.weekSchedule[dayKey];
    if (!dayObj) return;

    if (!fromParent && dayKey !== this.getTodayKey()) {
      alert(`🔒 Це розклад на «${dayObj.dayName}»! Сьогодні виконуємо сьогоднішній план пригод!`);
      return;
    }

    const q = dayObj.quests.find(item => item.id === questId);
    if (!q) return;

    if (!q.multi && q.completed) {
      alert("✨ Це завдання вже виконано сьогодні!");
      return;
    }

    if (q.multi && (q.dailyCount || 0) >= 3) {
      alert("🌟 Денну норму (3/3) для цієї вправи вже виконано сьогодні!");
      return;
    }

    const executeCompletion = () => {
      if (q.multi) {
        q.counter = (q.counter || 0) + 1;
        q.dailyCount = (q.dailyCount || 0) + 1;
      } else {
        q.completed = true;
      }

      const earnedCoins = q.coins || 5;
      const earnedEnergy = Math.max(15, earnedCoins * 3);
      this.state.coins += earnedCoins;
      this.addXP(q.xp || 20);
      this.addEnergy(earnedEnergy);

      // Таємничий сюрприз (Variable Reward)
      const mysteryReward = this.rollMysteryReward(q.title);
      this.saveState();

      window.soundFX.playVictory();
      setTimeout(() => window.soundFX.playCoin(), 300);
      this.launchConfetti();

      const msg = q.multi 
        ? `Чудово! Зараховано ще раз (${q.dailyCount}/3 сьогодні): +${earnedCoins} 🪙 та +${earnedEnergy} ⚡!`
        : `Супер! Завдання «${q.title}» виконано! Нараховано +${earnedCoins} 🪙 та +${earnedEnergy} ⚡!`;
      this.speak(msg);

      this.render();
      if (document.getElementById('adventure-tablet').classList.contains('active')) {
        this.renderTabletContent();
      }

      if (!fromParent) {
        setTimeout(() => {
          this.showMysteryRewardModal({ ...q, energy: earnedEnergy }, mysteryReward);
        }, 300);
      }
    };

    if (fromParent) {
      executeCompletion();
    } else {
      this.requestParentApproval({
        title: `${q.icon || '⭐'} ${q.title}`,
        coins: q.coins || 5,
        xp: q.xp || 20,
        icon: q.icon,
        isCatalogQuest: true,
        onApproved: executeCompletion
      });
    }
  }

  addWeeklyProgress(id, fromParent = false) {
    const q = this.state.weeklyQuests.find(item => item.id === id);
    if (!q || q.current >= q.max) return;

    const todayDateStr = this.getTodayDateString();
    if (!fromParent && q.lastStepDate === todayDateStr) {
      alert("🌟 Сьогоднішній крок для цієї 5-денної звички вже зараховано! Продовжуємо завтра!");
      return;
    }

    const executeStep = () => {
      q.current += 1;
      q.lastStepDate = todayDateStr;
      window.soundFX.playClick();

      if (q.current === q.max) {
        this.state.coins += q.coins;
        this.state.crystals += q.crystals;
        this.addXP(q.xp);
        this.addEnergy(50);

        const mysteryReward = this.rollMysteryReward(q.title);

        window.soundFX.playChestOpen();
        this.launchConfetti();
        this.speak(`УРА! Ти завершила 5-денну ціль: ${q.title}! Нагорода: плюс ${q.crystals} євро у скарбничку, ${q.coins} монет та 50 енергії!`);
        if (!fromParent) {
          setTimeout(() => {
            this.showMysteryRewardModal({ ...q, energy: 50 }, mysteryReward);
          }, 400);
        }
      } else {
        this.state.coins += 5;
        this.addXP(20);
        this.addEnergy(15);
        this.speak(`Чудово! День ${q.current} із ${q.max} зараховано! Плюс 5 монеток та 15 енергії за старанність!`);
      }

      this.saveState();
      this.render();
      if (document.getElementById('adventure-tablet').classList.contains('active')) {
        this.renderTabletContent();
      }
    };

    if (fromParent) {
      executeStep();
    } else {
      this.requestParentApproval({
        title: `🏔️ ${q.title} (День ${q.current + 1}/${q.max})`,
        coins: q.current + 1 === q.max ? q.coins : 5,
        xp: q.current + 1 === q.max ? q.xp : 20,
        icon: q.icon,
        isCatalogQuest: true,
        onApproved: executeStep
      });
    }
  }

  // =========================================================
  // МАГАЗИН НАГОРОД ТА КУПОНІВ ВОЛОДАРКИ ДНЯ (SHOP)
  // =========================================================
  renderRewardsListHtml() {
    return (this.state.rewards || []).map(r => {
      const canBuy = (r.costCoins > 0 && this.state.coins >= r.costCoins) || (r.costCrystals > 0 && this.state.crystals >= r.costCrystals);
      const pct = r.costCoins > 0
        ? Math.min(100, Math.round(((this.state.coins || 0) / r.costCoins) * 100))
        : Math.min(100, Math.round(((this.state.crystals || 0) / (r.costCrystals || 1)) * 100));
      return `
        <div style="background:#fff; border:2px solid ${canBuy ? '#10b981' : '#b89158'}; border-radius:16px; padding:14px; text-align:center; box-shadow:0 4px 8px rgba(0,0,0,0.08);">
          ${r.tier ? `
            <div style="display:inline-block; font-size:0.7rem; font-weight:900; padding:2px 8px; border-radius:99px; background:#fef3c7; color:#b45309; border:1px solid #f59e0b; margin-bottom:6px;">
              ${r.tier}
            </div>
          ` : ''}
          ${r.ticketImg ? `
            <div><img src="${r.ticketImg}" alt="${r.title}" style="width:100%; max-width:220px; border-radius:12px; margin-bottom:8px; box-shadow:0 4px 10px rgba(0,0,0,0.15);"></div>
          ` : `
            <div style="font-size:42px; margin-bottom:4px;">${r.icon}</div>
          `}
          <h3 style="font-family:'Fredoka', cursive; font-size:1.1rem; color:#451a03;">${r.title}</h3>
          <p style="font-size:0.82rem; color:#78350f; font-weight:700; margin:6px 0;">${r.description}</p>
          <div style="background:#f1f5f9; height:7px; border-radius:99px; overflow:hidden; margin:8px auto; max-width:240px;">
            <div style="width:${pct}%; height:100%; background:${canBuy ? '#10b981' : '#f59e0b'}; border-radius:99px;"></div>
          </div>
          <div style="font-size:0.72rem; font-weight:800; color:#64748b; margin-bottom:8px;">
            ${r.costCoins > 0 ? `Зібрано: ${this.state.coins}/${r.costCoins} 🪙 (${pct}%)` : `Зібрано: ${this.state.crystals}/${r.costCrystals} 💎 (${pct}%)`}
          </div>
          <button class="btn-primary" ${!canBuy ? 'disabled style="background:#cbd5e1; box-shadow:none; cursor:not-allowed;"' : ''} onclick="window.game.buyReward('${r.id}')">
            ${r.costCoins > 0 ? `Забрати за ${r.costCoins} 🪙` : `Обміняти на ${r.costCrystals} 💎 (${r.costCrystals} €)`}
          </button>
        </div>
      `;
    }).join('');
  }

  openShopModal() {
    window.soundFX.playClick();
    const container = document.getElementById('shop-container');
    if (container) {
      container.innerHTML = this.renderRewardsListHtml();
    }
    this.openModal('shop-modal');
  }

  buyReward(id) {
    const r = this.state.rewards.find(item => item.id === id);
    if (!r) return;

    if (r.costCoins > 0 && this.state.coins < r.costCoins) {
      alert(`Тобі не вистачає ще ${r.costCoins - this.state.coins} 🪙 монет!`);
      return;
    }

    if (r.costCrystals > 0 && this.state.crystals < r.costCrystals) {
      alert(`Тобі не вистачає ще ${r.costCrystals - this.state.crystals} 💎 кристалів (€)!`);
      return;
    }

    if (r.costCoins > 0) this.state.coins -= r.costCoins;
    if (r.costCrystals > 0) this.state.crystals -= r.costCrystals;

    this.saveState();
    window.soundFX.playChestOpen();
    this.launchConfetti();
    this.closeModal('shop-modal');
    if (document.getElementById('adventure-tablet') && document.getElementById('adventure-tablet').classList.contains('active')) {
      this.renderTabletContent();
    }

    if (r.ticketImg) {
      this.showVipTicketModal(r);
    } else {
      alert(`🎉 УРА! Ти отримала: «${r.title}»! Покажи батькам для отримання нагороди!`);
      this.speak(`Ура! Вітаю, Даніка! Ти отримала нагороду: ${r.title}! Покажи батькам!`);
    }
    this.render();
  }

  showVipTicketModal(r) {
    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');

    content.innerHTML = `
      <div class="vip-ticket-card-view">
        <h2 style="font-family:'Fredoka', cursive; font-size:1.45rem; color:#b45309; margin-bottom:8px;">
          🎉 ВІТАЄМО, ДАНІКО! 🎉
        </h2>
        <img src="${r.ticketImg}" alt="VIP Ticket" class="vip-ticket-badge-img">
        <div style="font-size:1.05rem; font-weight:900; color:#1e293b; margin:6px 0;">${r.title}</div>
        <p style="font-size:0.88rem; color:#78350f; font-weight:700;">${r.description}</p>
        <div class="vip-activated-stamp">✔️ АКТИВОВАНО</div>
        <div style="margin-top:14px;">
          <button class="btn-primary" style="padding:14px; font-size:1.05rem;" onclick="window.game.closeModal('action-modal')">
            Показати Татові / Мамі! 🌟
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    this.speak(`Ура! Вітаю, Даніка! Ти заробила нагороду: ${r.title}! Покажи квиток батькам!`);
  }

  // =========================================================
  // БАТЬКІВСЬКИЙ КОНТРОЛЬ, МОБІЛЬНИЙ ПУЛЬТ МАМИ І ТАТА ТА КАБІНЕТ (PIN 1234)
  // =========================================================
  getFamilySyncCode() {
    if (!this.state.familySyncCode) {
      this.state.familySyncCode = 'DANIKA-777';
    }
    return String(this.state.familySyncCode).trim().toUpperCase();
  }

  getNtfyTopic() {
    const cleanCode = this.getFamilySyncCode().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    return `danika_quest_${cleanCode}`;
  }

  computeTaskApprovalCode(title, coins) {
    const seedStr = `${String(title || '').trim()}|${coins || 5}|${this.getTodayDateString()}|${this.state.parentPin || '1234'}`;
    let hash = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
      hash ^= seedStr.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const num = Math.abs(hash) % 9000 + 1000;
    return String(num);
  }

  getParentRemoteUrl(pendingReq = null) {
    let baseUrl = 'https://igormarmonja.github.io/danika-world/parent.html';
    if (window.location.protocol.startsWith('http') && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      baseUrl = window.location.href.split('?')[0].split('#')[0];
      if (baseUrl.endsWith('index.html')) {
        baseUrl = baseUrl.slice(0, -'index.html'.length) + 'parent.html';
      } else if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl + 'parent.html';
      } else {
        baseUrl = baseUrl.replace(/\/[^\/]*$/, '/parent.html');
      }
    }

    const params = new URLSearchParams();
    params.set('code', this.getFamilySyncCode());
    if (pendingReq) {
      params.set('reqId', pendingReq.reqId || String(Date.now()));
      params.set('title', pendingReq.title || 'Завдання Даніки');
      params.set('coins', String(pendingReq.coins || 5));
      params.set('xp', String(pendingReq.xp || 20));
      params.set('icon', pendingReq.icon || '⭐');
      params.set('pin4', pendingReq.pin4 || this.computeTaskApprovalCode(pendingReq.title, pendingReq.coins));
    }
    return `${baseUrl}?${params.toString()}`;
  }

  initParentRemoteSync() {
    // 1. Міжвкладкова синхронізація на одному пристрої (BroadcastChannel + storage)
    try {
      if ('BroadcastChannel' in window) {
        if (this._parentBroadcast) this._parentBroadcast.close();
        this._parentBroadcast = new BroadcastChannel('danika_parent_channel');
        this._parentBroadcast.onmessage = (ev) => {
          if (ev && ev.data) this.handleRemoteParentPayload(ev.data);
        };
      }
      window.addEventListener('storage', (ev) => {
        if ((ev.key === 'danika_remote_parent_cmd' || ev.key === 'danika_remote_signal') && ev.newValue) {
          try {
            this.handleRemoteParentPayload(JSON.parse(ev.newValue));
          } catch (e) {}
        }
      });
    } catch (e) {}

    // 2. Хмарна синхронізація в реальному часі між телефоном Мами/Тата та планшетом/ПК Даніки (ntfy.sh SSE)
    const sseDelay = window.location.protocol === 'file:' ? 8000 : 800;
    setTimeout(() => this.connectRemoteEventSource(), sseDelay);
  }

  connectRemoteEventSource() {
    if (this._ntfyEventSource) {
      try { this._ntfyEventSource.close(); } catch (e) {}
      this._ntfyEventSource = null;
    }
    const topic = this.getNtfyTopic();
    try {
      const es = new EventSource(`https://ntfy.sh/${topic}/sse`);
      this._ntfyEventSource = es;
      es.onmessage = (ev) => {
        try {
          const outer = JSON.parse(ev.data);
          if (outer && outer.id && this._processedRemoteMsgIds.has(outer.id)) return;
          if (outer && outer.id) this._processedRemoteMsgIds.add(outer.id);
          if (outer && outer.message) {
            const payload = JSON.parse(outer.message);
            this.handleRemoteParentPayload(payload);
          }
        } catch (err) {}
      };
    } catch (e) {}
  }

  async publishParentSyncMessage(payload) {
    const topic = this.getNtfyTopic();
    try {
      if (this._parentBroadcast) {
        this._parentBroadcast.postMessage(payload);
      }
    } catch (e) {}
    try {
      await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  }

  async pollRemoteParentMessages() {
    const topic = this.getNtfyTopic();
    try {
      const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1&since=30s`);
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.split('\n').filter(Boolean);
      lines.forEach(line => {
        try {
          const outer = JSON.parse(line);
          if (outer && outer.id && this._processedRemoteMsgIds.has(outer.id)) return;
          if (outer && outer.id) this._processedRemoteMsgIds.add(outer.id);
          if (outer && outer.message) {
            const payload = JSON.parse(outer.message);
            this.handleRemoteParentPayload(payload);
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  handleRemoteParentPayload(payload) {
    if (!payload || !payload.type) return;
    if (payload.msgId && this._processedRemoteMsgIds.has(payload.msgId)) return;
    if (payload.msgId) this._processedRemoteMsgIds.add(payload.msgId);

    const parentName = payload.parentName || 'Мама і Тато';

    // 1. Підтвердження поточного відкритого запиту з телефона!
    if (payload.type === 'REMOTE_APPROVE') {
      if (this.pendingApproval && (!payload.reqId || payload.reqId === this.pendingApproval.reqId || payload.reqId === 'any')) {
        const approval = this.pendingApproval;
        this.pendingApproval = null;
        this.closePinModal();

        if (typeof approval.onApproved === 'function') {
          approval.onApproved();
        }
        const praiseText = payload.praise
          ? `${parentName} підтвердили завдання з телефона і передають: ${payload.praise}`
          : `Ура! ${parentName} щойно підтвердили твоє завдання з телефона!`;
        this.showDanikaThought(`📱 ${parentName}: Підтверджено! ❤️`);
        setTimeout(() => this.speak(praiseText), 400);
        return;
      }

      // Якщо Мама або Тато натиснули підтвердити конкретне завдання зі списку на телефоні, навіть коли модалка PIN закрита:
      const targetQuestId = payload.questId || payload.taskId;
      if (targetQuestId) {
        if (payload.questCategory === 'day' && payload.dayKey) {
          this.toggleDayQuest(payload.dayKey, targetQuestId, true);
          this.showDanikaThought(`📱 ${parentName} зарахували завдання з телефона!`);
        } else if (payload.questCategory === 'weekly') {
          this.addWeeklyProgress(targetQuestId, true);
          this.showDanikaThought(`📱 ${parentName} додали прогрес тижневої цілі!`);
        } else if (this.state.questCatalog) {
          const cats = payload.questCategory ? [payload.questCategory] : Object.keys(this.state.questCatalog);
          let foundQuest = null;
          for (const catKey of cats) {
            const arr = this.state.questCatalog[catKey];
            if (Array.isArray(arr)) {
              const match = arr.find(it => it.id === targetQuestId);
              if (match) {
                foundQuest = match;
                break;
              }
            }
          }
          if (foundQuest && (!foundQuest.completed || foundQuest.multi)) {
            if (foundQuest.multi) {
              foundQuest.counter = (foundQuest.counter || 0) + 1;
              foundQuest.dailyCount = (foundQuest.dailyCount || 0) + 1;
            } else {
              foundQuest.completed = true;
            }
            const earnedCoins = foundQuest.coins || payload.coins || 5;
            const earnedEnergy = foundQuest.energy || Math.max(15, earnedCoins * 3);
            this.state.coins = (this.state.coins || 0) + earnedCoins;
            this.addXP(foundQuest.xp || payload.xp || 20);
            this.addEnergy(earnedEnergy);
            this.checkBrunoQuestUnlock(foundQuest.id);
            this.saveState();
            window.soundFX.playVictory();
            this.launchConfetti();
            this.render();
            this.showDanikaThought(`📱 ${parentName}: +${earnedCoins} 🪙 та +${earnedEnergy} ⚡ за «${foundQuest.title}»!`);
            this.speak(`Ура! ${parentName} підтвердили з телефона завдання: ${foundQuest.title}! Плюс ${earnedCoins} монет та ${earnedEnergy} енергії!`);
          } else if (!foundQuest && payload.title) {
            if (!this.state.learningProgress) this.state.learningProgress = {};
            if (targetQuestId) this.state.learningProgress[targetQuestId] = true;
            const earnedCoins = Number(payload.coins || 15);
            const earnedEnergy = Math.max(15, earnedCoins * 3);
            this.state.coins = (this.state.coins || 0) + earnedCoins;
            this.addXP(Number(payload.xp || 40));
            this.addEnergy(earnedEnergy);
            this.saveState();
            window.soundFX.playVictory();
            this.launchConfetti();
            this.render();
            if (this.currentLocationId) this.renderWorldRooms(this.currentLocationId);
            if (document.getElementById('adventure-tablet')?.classList.contains('active')) {
              this.renderTabletContent();
            }
            this.showDanikaThought(`📱 ${parentName}: +${earnedCoins} 🪙 та +${earnedEnergy} ⚡ за «${payload.title}»!`);
            this.speak(`Ура! ${parentName} підтвердили з телефона завдання: ${payload.title}! Плюс ${earnedCoins} монет та ${earnedEnergy} енергії!`);
          }
        }
      }
    }

    // 2. Бонусні монетки, кристали або тепла записка/голосове повідомлення з телефона Мами чи Тата!
    if (payload.type === 'REMOTE_BONUS' || payload.type === 'REMOTE_MESSAGE') {
      const addCoins = parseInt(payload.coins || 0, 10);
      const addCrystals = parseInt(payload.crystals || payload.gems || 0, 10);
      const noteText = String(payload.message || payload.note || payload.praise || '').trim();

      if (addCoins > 0) {
        this.state.coins = (this.state.coins || 0) + addCoins;
        this.addXP(addCoins * 3);
        this.addEnergy(addCoins * 3);
      }
      if (addCrystals > 0) {
        this.state.crystals = (this.state.crystals || 0) + addCrystals;
      }
      if (noteText) {
        if (!Array.isArray(this.state.familyNotes)) this.state.familyNotes = [];
        this.state.familyNotes.unshift({
          id: `remote_note_${Date.now()}`,
          from: `${parentName} 📱`,
          text: noteText,
          date: new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
        });
      }

      this.saveState();
      this.render();
      if (window.soundFX && window.soundFX.playChestOpen) window.soundFX.playChestOpen();
      this.launchConfetti();

      const modal = document.getElementById('action-modal');
      const content = document.getElementById('action-modal-content');
      if (modal && content) {
        content.innerHTML = `
          <div style="text-align:center; padding:8px;">
            <div style="font-size:54px; margin-bottom:6px;">💌📱💖</div>
            <h2 style="font-family:'Fredoka', cursive; font-size:1.4rem; color:#451a03; margin-bottom:6px;">
              ${payload.type === 'REMOTE_MESSAGE' ? `ЛИСТ ДЛЯ ДАНІЧКИ ВІД: ${parentName.toUpperCase()}!` : `ПРИВІТ З ТЕЛЕФОНА ВІД: ${parentName.toUpperCase()}!`}
            </h2>
            ${(addCoins > 0 || addCrystals > 0) ? `
              <div style="display:inline-block; background:#dcfce7; border:2px solid #22c55e; border-radius:14px; padding:8px 16px; font-weight:900; color:#15803d; font-size:1.05rem; margin-bottom:10px;">
                🎁 Нагорода: ${addCoins > 0 ? `+${addCoins} 🪙 монет ` : ''}${addCrystals > 0 ? `+${addCrystals} 💎 (€)` : ''}
              </div>
            ` : ''}
            ${noteText ? `
              <div style="background:#fffbeb; border:2.5px dashed #f59e0b; border-radius:18px; padding:14px; margin-bottom:14px; font-size:1.05rem; color:#78350f; font-weight:800; font-style:italic; line-height:1.45;">
                «${noteText}»
              </div>
            ` : ''}
            <button class="btn-primary" style="background:#10b981; box-shadow:0 4px 0 #059669; padding:12px;" onclick="window.game.closeModal('action-modal')">
              💖 Дякую! Обіймаю!
            </button>
          </div>
        `;
        modal.classList.add('active');
        if (window.applyGameIcons) window.applyGameIcons(content);
      }

      this.showDanikaThought(noteText ? `💌 ${parentName}: «${noteText}»` : `🎁 Бонус від ${parentName}!`);
      const speechMsg = noteText
        ? `Повідомлення з телефона від ${parentName}: ${noteText}!`
        : `Ура! ${parentName} надіслали тобі з телефона бонус: ${addCoins > 0 ? `плюс ${addCoins} монет` : `плюс ${addCrystals} кристал`}!`;
      this.speak(speechMsg);
    }

    // 3. Дистанційне встановлення секретного PIN-коду батьків виключно з телефона!
    if (payload.type === 'REMOTE_SET_PIN') {
      const newPin = String(payload.newPin || '').trim();
      if (/^\d{4}$/.test(newPin)) {
        this.state.parentPin = newPin;
        this.saveState();
        if (document.getElementById('parent-modal') && document.getElementById('parent-modal').classList.contains('active')) {
          this.renderParentContent();
        }
      }
    }
  }

  requestParentApproval({ title, coins, xp, icon, isCatalogQuest, onApproved }) {
    window.soundFX.playClick();
    const clickedHsId = this._lastClickedHotspotId || null;

    // Обмеження на інтерактивні точки локацій міста (1 раз на день по +5 🪙, щоб не вифармити всі призи за 1 день)
    if (!isCatalogQuest) {
      if (!this.state.claimedHotspotsToday) this.state.claimedHotspotsToday = {};
      if (this.state.claimedHotspotsToday[title]) {
        alert("🌟 Цю пригоду на локації вже зараховано сьогодні! Завтра її можна буде виконати знову!");
        return;
      }
      const cappedCoins = Math.min(coins || 5, 5);
      const origApproved = onApproved;
      coins = cappedCoins;
      onApproved = () => {
        this.state.claimedHotspotsToday[title] = true;
        if (clickedHsId) this.state.claimedHotspotsToday[clickedHsId] = true;
        const prevCoins = this.state.coins || 0;
        if (typeof origApproved === 'function') origApproved();
        this.addEnergy(15);
        // Нормалізуємо приріст монет із хотспоту до +5 🪙
        if ((this.state.coins || 0) - prevCoins > cappedCoins) {
          this.state.coins = prevCoins + cappedCoins;
        }
        this.saveState();
        this.render();
        if (this.renderWorldRooms) this.renderWorldRooms(this.state.activeLocationId || 'loc_home');
      };
    } else {
      const origApproved = onApproved;
      onApproved = () => {
        if (!this.state.claimedHotspotsToday) this.state.claimedHotspotsToday = {};
        if (clickedHsId) this.state.claimedHotspotsToday[clickedHsId] = true;
        if (typeof origApproved === 'function') origApproved();
        if (this.renderWorldRooms) this.renderWorldRooms(this.state.activeLocationId || 'loc_home');
      };
    }

    const reqId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const pin4 = this.computeTaskApprovalCode(title, coins);
    this.pendingApproval = { reqId, title, coins, xp, icon, pin4, onApproved };

    const iconEl = document.getElementById('pin-modal-icon');
    const titleEl = document.getElementById('pin-modal-title');
    const badgeEl = document.getElementById('pin-modal-task-badge');
    const taskTitleEl = document.getElementById('pin-modal-task-title');
    const taskRewardEl = document.getElementById('pin-modal-task-reward');
    const descEl = document.getElementById('pin-modal-desc');
    const remoteBox = document.getElementById('pin-remote-approval-box');
    const qrImg = document.getElementById('pin-remote-qr-img');

    if (iconEl) iconEl.innerText = icon || '👨‍👩‍👧';
    if (titleEl) titleEl.innerText = '👨‍👩‍👧 Підтвердження від Батьків';
    if (badgeEl) badgeEl.style.display = 'block';
    if (taskTitleEl) taskTitleEl.innerText = title;
    const estEnergy = Math.max(15, (coins || 5) * 3);
    if (taskRewardEl) taskRewardEl.innerText = `Нагорода: +${coins} 🪙 монет` + (xp ? ` | +${xp} ⭐` : '') + ` | +${estEnergy} ⚡`;
    if (descEl) descEl.innerText = 'Або введіть секретний PIN-код батьків чи 4-значний код із телефона:';

    if (remoteBox) {
      remoteBox.style.display = 'block';
      const remoteUrl = this.getParentRemoteUrl(this.pendingApproval);
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=6&data=${encodeURIComponent(remoteUrl)}`;
      }
    }

    // Відправляємо запит у сімейний хмарний канал, щоб телефон Мами чи Тата одразу побачив його!
    this.publishParentSyncMessage({
      type: 'QUEST_REQUEST',
      msgId: reqId,
      reqId,
      title,
      coins: coins || 5,
      xp: xp || 20,
      icon: icon || '⭐',
      pin4,
      timestamp: Date.now()
    });

    if (this._remotePollInterval) clearInterval(this._remotePollInterval);
    this._remotePollInterval = setInterval(() => {
      if (this.pendingApproval) {
        this.pollRemoteParentMessages();
      } else {
        clearInterval(this._remotePollInterval);
      }
    }, 3500);

    this.enteredPin = '';
    this.updatePinDots();
    this.openModal('pin-modal');
    if (window.applyGameIcons) window.applyGameIcons(document.getElementById('pin-modal'));
  }

  shareApprovalToPhone(channel = 'whatsapp') {
    if (!this.pendingApproval) return;
    const p = this.pendingApproval;
    const remoteUrl = this.getParentRemoteUrl(p);
    const msgText = `👧 Даніка виконала завдання у грі:\n«${p.title}» (+${p.coins || 5} 🪙)\n\n📱 Натисніть посилання на телефоні, щоб підтвердити виконання:\n${remoteUrl}`;

    if (channel === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(msgText)}`, '_blank');
    } else if (channel === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(remoteUrl)}&text=${encodeURIComponent(`👧 Даніка просить підтвердити завдання: «${p.title}» (+${p.coins || 5} 🪙)`)}`, '_blank');
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(remoteUrl).then(() => {
          alert("🔗 Посилання для телефона Мами/Тата скопійовано! Надішліть його у будь-який месенджер.");
        }).catch(() => {
          prompt("Скопіюйте посилання для телефона Мами/Тата:", remoteUrl);
        });
      } else {
        prompt("Скопіюйте посилання для телефона Мами/Тата:", remoteUrl);
      }
    }
  }

  closePinModal() {
    if (this._remotePollInterval) {
      clearInterval(this._remotePollInterval);
      this._remotePollInterval = null;
    }
    this.closeModal('pin-modal');
  }

  openParentPin() {
    this.pendingApproval = null;
    const iconEl = document.getElementById('pin-modal-icon');
    const titleEl = document.getElementById('pin-modal-title');
    const badgeEl = document.getElementById('pin-modal-task-badge');
    const descEl = document.getElementById('pin-modal-desc');
    const remoteBox = document.getElementById('pin-remote-approval-box');

    if (iconEl) iconEl.innerText = '🔒';
    if (titleEl) titleEl.innerText = '🔒 Батьківський Вхід';
    if (badgeEl) badgeEl.style.display = 'none';
    if (remoteBox) remoteBox.style.display = 'none';
    if (descEl) descEl.innerText = 'Введіть секретний PIN-код батьків:';

    this.enteredPin = '';
    this.updatePinDots();
    this.openModal('pin-modal');
  }

  handlePin(n) {
    window.soundFX.playClick();
    if (n === 'clear') {
      this.enteredPin = '';
      this.updatePinDots();
      return;
    }
    if (n === 'back') {
      this.enteredPin = this.enteredPin.slice(0, -1);
      this.updatePinDots();
      return;
    }
    if (this.enteredPin.length < 4) {
      this.enteredPin += n;
      this.updatePinDots();
      if (this.enteredPin.length === 4) {
        setTimeout(() => {
          const isMasterPin = (this.enteredPin === this.state.parentPin);
          const isTaskPhoneCode = Boolean(this.pendingApproval && this.pendingApproval.pin4 && this.enteredPin === this.pendingApproval.pin4);

          if (isMasterPin || isTaskPhoneCode) {
            const approval = this.pendingApproval;
            this.pendingApproval = null;
            this.closePinModal();

            if (approval && typeof approval.onApproved === 'function') {
              approval.onApproved();
            } else {
              this.openParentDashboard();
            }
          } else {
            alert("Невірний PIN-код! Введіть секретний PIN-код батьків або 4-значний код із телефона Мами/Тата.");
            this.enteredPin = '';
            this.updatePinDots();
          }
        }, 150);
      }
    }
  }

  updatePinDots() {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`pin-dot-${i}`);
      if (dot) {
        if (i <= this.enteredPin.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
      }
    }
  }

  setParentTab(tab) {
    this.parentTab = tab;
    window.soundFX.playClick();
    this.renderParentContent();
  }

  openParentDashboard() {
    if (!this.parentTab) this.parentTab = 'phone';
    this.openModal('parent-modal');
    this.renderParentContent();
  }

  saveFamilySyncCode() {
    const inp = document.getElementById('p-sync-code');
    if (!inp) return;
    const val = String(inp.value || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!val || val.length < 3) {
      alert("Введіть код довжиною мінімум 3 символи (наприклад: DANIKA-777)");
      return;
    }
    this.state.familySyncCode = val;
    this.saveState();
    this.connectRemoteEventSource();
    this.renderParentContent();
    alert(`✅ Сімейний код синхронізації оновлено: ${val}`);
  }

  renderParentContent() {
    const container = document.getElementById('parent-dashboard-body');
    if (!container) return;

    if (this.parentTab === 'phone') {
      const syncCode = this.getFamilySyncCode();
      const remoteUrl = this.getParentRemoteUrl();
      const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(remoteUrl)}`;
      container.innerHTML = `
        <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe); border:2.5px solid #38bdf8; border-radius:18px; padding:16px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
            <div style="background:#fff; padding:8px; border-radius:14px; border:2px solid #60a5fa; text-align:center; box-shadow:0 4px 12px rgba(2,132,199,0.12);">
              <img src="${qrSrc}" alt="QR Пульт Батьків" style="width:140px; height:140px; display:block; border-radius:8px;">
              <div style="font-size:0.7rem; font-weight:900; color:#0369a1; margin-top:4px;">📷 Наведіть камеру телефона</div>
            </div>
            <div style="flex:1; min-width:220px;">
              <h3 style="font-family:'Fredoka', cursive; font-size:1.15rem; color:#0c4a6e; margin-bottom:6px;">
                📱 Мобільний Пульт Мами і Тата
              </h3>
              <p style="font-size:0.83rem; color:#1e3a8a; font-weight:700; line-height:1.45; margin-bottom:10px;">
                Зіскануйте QR-код телефоном або відкрийте посилання нижче. З телефона ви можете підтверджувати завдання Даніки в 1 клік, писати їй повідомлення на екран та змінювати секретний PIN-код батьків!
              </p>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
                <a href="${remoteUrl}" target="_blank" class="btn-primary" style="width:auto; padding:8px 14px; font-size:0.8rem; background:#0284c7; box-shadow:0 3px 0 #0369a1; text-decoration:none; display:inline-block;">
                  🚀 Відкрити Пульт Батьків
                </a>
                <button type="button" class="btn-primary" style="width:auto; padding:8px 14px; font-size:0.8rem; background:#10b981; box-shadow:0 3px 0 #059669;" onclick="navigator.clipboard.writeText('${remoteUrl}').then(() => alert('Посилання на Мобільний Пульт скопійовано! Надішліть його у Telegram/WhatsApp Мамі і Татові.'))">
                  📋 Скопіювати посилання для телефона
                </button>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; background:#fff; padding:8px 10px; border-radius:12px; border:1.5px solid #93c5fd;">
                <span style="font-size:0.78rem; font-weight:900; color:#0369a1;">🔑 Сімейний код каналу:</span>
                <input type="text" id="p-sync-code" value="${syncCode}" style="width:130px; padding:4px 8px; border:1.5px solid #cbd5e1; border-radius:8px; font-weight:900; color:#0f172a; text-transform:uppercase;">
                <button type="button" class="btn-primary" style="width:auto; padding:4px 10px; font-size:0.75rem;" onclick="window.game.saveFamilySyncCode()">Зберегти код</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.parentTab === 'week') {
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      container.innerHTML = `
        <h3 style="font-size:1.1rem; color:#451a03; margin-bottom:10px;">📅 Управління розкладом тижня</h3>
        ${days.map(dKey => {
          const dObj = this.state.weekSchedule[dKey];
          return `
            <div style="background:#fff; border:2px solid #e2e8f0; border-radius:12px; padding:10px; margin-bottom:10px;">
              <div style="font-weight:900; color:#b45309; margin-bottom:6px;">${dObj.dayName} • ${dObj.theme}</div>
              ${dObj.quests.map(q => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding:4px 0;">
                  <span style="font-size:0.85rem; font-weight:700;">${q.icon} ${q.title} (+${q.coins} 🪙)</span>
                  <button class="btn-primary" style="width:auto; padding:4px 8px; font-size:0.75rem;" onclick="window.game.toggleDayQuest('${dKey}', '${q.id}', true); window.game.renderParentContent();">
                    ${q.completed ? 'Виконано ✔️' : 'Зарахувати'}
                  </button>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      `;
    } else if (this.parentTab === 'weekly') {
      container.innerHTML = `
        <h3 style="font-size:1.1rem; color:#451a03; margin-bottom:10px;">🏔️ Великі досягнення тижня (€) (5-10 € макс)</h3>
        ${this.state.weeklyQuests.map(q => `
          <div style="background:#fff; border:2px solid #e2e8f0; border-radius:12px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:900; color:#1e293b;">${q.icon} ${q.title}</div>
              <div style="font-size:0.8rem; color:#64748b;">Прогрес: ${q.current} / ${q.max} | +${q.crystals} 💎 (${q.crystals} €)</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn-primary" style="width:auto; padding:4px 10px; font-size:0.85rem;" onclick="window.game.addWeeklyProgress('${q.id}', true); window.game.renderParentContent();">+1</button>
            </div>
          </div>
        `).join('')}
      `;
    } else if (this.parentTab === 'settings') {
      container.innerHTML = `
        <h3 style="font-size:1.1rem; color:#451a03; margin-bottom:10px;">⚙️ Баланс та налаштування</h3>
        <div style="background:#eff6ff; border:2px solid #93c5fd; border-radius:12px; padding:10px 12px; margin-bottom:12px; font-size:0.8rem; color:#1e3a8a; font-weight:700;">
          🔐 <b>Секретний PIN-код Батьків</b> задається та змінюється <b>виключно з телефона Мами або Тата</b> у Мобільному Пульті (вкладка «📱 Пульт на Телефоні»). На екрані гри пароль ніде не відображається.
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <label style="display:block; font-weight:800; font-size:0.85rem; margin-bottom:4px;">Монети Даніки 🪙:</label>
          <input type="number" id="p-coins" class="form-input" style="width:100%; padding:8px; border:2px solid #cbd5e1; border-radius:8px;" value="${this.state.coins}">
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <label style="display:block; font-weight:800; font-size:0.85rem; margin-bottom:4px;">Досвід Даніки ⭐ (XP):</label>
          <input type="number" id="p-xp" class="form-input" style="width:100%; padding:8px; border:2px solid #cbd5e1; border-radius:8px;" value="${this.state.xp || 0}">
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <label style="display:block; font-weight:800; font-size:0.85rem; margin-bottom:4px;">Енергія Даніки ⚡:</label>
          <input type="number" id="p-energy" class="form-input" style="width:100%; padding:8px; border:2px solid #cbd5e1; border-radius:8px;" value="${this.getEnergy()}">
        </div>
        <div class="form-group" style="margin-bottom:12px;">
          <label style="display:block; font-weight:800; font-size:0.85rem; margin-bottom:4px;">Кристали Даніки 💎 (1 💎 = 1 €):</label>
          <input type="number" id="p-crystals" class="form-input" style="width:100%; padding:8px; border:2px solid #cbd5e1; border-radius:8px;" value="${this.state.crystals}">
        </div>
        <button class="btn-primary" style="margin-bottom:14px;" onclick="window.game.saveParentBalances()">Зберегти Баланс</button>
      `;
    }
    if (window.applyGameIcons) window.applyGameIcons(container);
  }

  saveParentBalances() {
    const c = parseInt(document.getElementById('p-coins')?.value, 10);
    const x = parseInt(document.getElementById('p-xp')?.value, 10);
    const en = parseInt(document.getElementById('p-energy')?.value, 10);
    const cr = parseInt(document.getElementById('p-crystals')?.value, 10);
    if (!isNaN(c)) this.state.coins = c;
    if (!isNaN(x)) this.state.xp = x;
    if (!isNaN(en)) {
      this.state.energy = en;
      if (this.state.tamagotchi) this.state.tamagotchi.energy = en;
    }
    if (!isNaN(cr)) this.state.crystals = cr;
    this.saveState();
    this.render();
    alert("Баланс успішно збережено!");
  }

  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
  }

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  }


  // =========================================================
  // ОБРОБНИКИ ДЛЯ ВСІХ 28 ЕКРАНІВ ЛОКАЦІЙ У ГАНДІЇ
  // =========================================================

  // --- ДОМАШНІ АЛІАСИ ТА КВЕСТИ ---
  handleReadingClick() { this.handleBookshelfClick(); }
  handleAntFarmClick() { this.handleTerrariumClick(); }
  handleEaselClick() { this.handleMomEaselClick(); }

  handleBackpackClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🎒 Зібрати рюкзак та шкільну форму",
      coins: 10,
      xp: 35,
      icon: "🎒",
      isCatalogQuest: true,
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(35);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Рюкзак та форма зібрані на відмінно! Готові до школи!");
        this.render();
      }
    });
  }

  handleBroccoliClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🥦 З'їсти смачне броколі",
      coins: 12,
      xp: 45,
      icon: "🥦",
      isCatalogQuest: true,
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(45);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Броколі з'їдено! Вітаміни дарують сили та здоров'я!");
        this.render();
      }
    });
  }

  handleBrunoZoneClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🐾 Прибрати зону песика Бруно",
      coins: 5,
      xp: 20,
      icon: "🐾",
      onApproved: () => {
        this.state.coins += 5;
        this.addXP(20);
        this.saveState();
        window.soundFX.playBark();
        this.launchConfetti();
        this.speak("Зона Бруно чиста та охайна! Песик радісно виляє хвостиком!");
        this.render();
      }
    });
  }

  // --- ШКОЛА: COLEGIO ABECÉ ---
  handleMathClick() {
    window.soundFX.playClick();
    if (this.openLearningModal) {
      this.openLearningModal('mathPuzzles', null, 'abece_math', 'loc_abece');
      return;
    }
  }

  handleAbacusClick() {
    window.soundFX.playSparkle();
    this.speak("Рахівниця та підручники Abecé! Рахувати легко і весело!");
    if (this.openLearningModal) {
      this.openLearningModal('mathPuzzles', null, 'abece_math', 'loc_abece');
    }
  }

  handleCanteenFoodClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🍽️ З'їсти корисний шкільний обід",
      coins: 10,
      xp: 25,
      icon: "🍽️",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Смачний шкільний обід у столовій додав багато енергії!");
        this.render();
      }
    });
  }

  handleCanteenFruitClick() {
    window.soundFX.playSparkle();
    this.speak("Соковиті валенсійські апельсини! Вітамін С для міцного імунітету!");
  }

  handleScienceExperimentClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🧪 Науковий дослід з хімії",
      coins: 12,
      xp: 30,
      icon: "🧪",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Хімічний дослід вдався на славу! Справжнє наукове відкриття!");
        this.render();
      }
    });
  }

  handleScienceMicroscopeClick() {
    window.soundFX.playSparkle();
    this.speak("У мікроскопі видно чарівні кристали солі та будову листочка!");
  }

  handleGymSquatsClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🏀 10 присідань у спортзалі",
      coins: 10,
      xp: 25,
      icon: "🏀",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        const danikaEl = document.getElementById('character-danika');
        if (danikaEl) {
          danikaEl.classList.add('jumping');
          setTimeout(() => danikaEl.classList.remove('jumping'), 600);
        }
        this.speak("10 присідань виконано бадьоро і весело! Молодець!");
        this.render();
      }
    });
  }

  handleGymnasticsClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🤸‍♀️ 3 хвилини гімнастики та розтяжки",
      coins: 10,
      xp: 25,
      icon: "🤸‍♀️",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Гімнастика завершена! Тіло гнучке, а настрій чудовий!");
        this.render();
      }
    });
  }

  // --- ТЦ LA VITAL ---
  handleVitalToyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🧸 Обрати улюблену іграшку в La Vital",
      coins: 12,
      xp: 30,
      icon: "🧸",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Яка чудова іграшка в дитячому магазині La Vital!");
        this.render();
      }
    });
  }

  handleVitalBalloonClick() {
    window.soundFX.playWhoosh();
    this.speak("Чарівна повітряна куля летить високо над торговим центром!");
  }

  handleVitalFountainClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "⛲ Загадати бажання біля фонтану La Vital",
      coins: 8,
      xp: 20,
      icon: "⛲",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.speak("Бажання загадано біля кришталевого фонтану! Нехай здійсниться!");
        this.render();
      }
    });
  }

  handleVitalWalkClick() {
    window.soundFX.playSparkle();
    this.speak("Прогулянка атріумом під скляним куполом та зеленими пальмами!");
  }

  handleVitalDressClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "👗 Приміряти модний образ у бутику",
      coins: 10,
      xp: 25,
      icon: "👗",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Неймовірно красива та стильна сукня! Даніка - справжня модель!");
        this.render();
      }
    });
  }

  handleVitalMirrorClick() {
    window.soundFX.playSparkle();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.classList.add('jumping');
      setTimeout(() => danikaEl.classList.remove('jumping'), 600);
    }
    this.speak("Дзеркало показує найгарнішу дівчинку в усій Гандії!");
  }

  handleVitalChurrosClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🥐 Хрусткі чуррос з гарячим шоколадом",
      coins: 10,
      xp: 25,
      icon: "🥐",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Ммм, теплі іспанські чуррос з густим шоколадом! Дуже смачно!");
        this.render();
      }
    });
  }

  handleVitalGelatoClick() {
    window.soundFX.playSparkle();
    this.speak("Смачне вершкове джелато з полуницею та шоколадною крихтою!");
  }

  // --- ПЛЯЖ: PLATJA DE GANDIA ---
  handleYachtHelmClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "⛵ Капітанський штурвал на яхті",
      coins: 15,
      xp: 35,
      icon: "⛵",
      onApproved: () => {
        this.state.coins += 15;
        this.addXP(35);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Капітан Даніка тримає курс у відкрите Середземне море!");
        this.render();
      }
    });
  }

  handleYachtSeaClick() {
    window.soundFX.playSparkle();
    this.speak("Морський бриз, білосніжні вітрила та грайливі дельфіни біля яхти!");
  }

  handleKitesFlyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🪁 Запустити яскравого повітряного змія",
      coins: 12,
      xp: 30,
      icon: "🪁",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Повітряний змій злітає прямо до хмаринок під теплим вітром Гандії!");
        this.render();
      }
    });
  }

  handleBeachSandcastleClick() {
    window.soundFX.playSparkle();
    this.speak("Величезний піщаний замок з баштами та мушлями побудовано!");
  }

  handleBeachDrinkClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🥥 Свіжий кокосовий напій у пляжному кафе",
      coins: 10,
      xp: 25,
      icon: "🥥",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Освіжаючий кокосовий напій з трубочкою прямо на березі моря!");
        this.render();
      }
    });
  }

  handleBeachLoungeClick() {
    window.soundFX.playSparkle();
    this.speak("Затишний пляжний шезлонг, теплий пісочок та лагідне сонечко!");
  }

  handleWaterparkSlideClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🌊 Спуск з райдужної водяної гірки",
      coins: 15,
      xp: 35,
      icon: "🌊",
      onApproved: () => {
        this.state.coins += 15;
        this.addXP(35);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Вжууух! Веселий спуск з водяної гірки прямо в теплий басейн!");
        this.render();
      }
    });
  }

  handleWaterparkDolphinClick() {
    window.soundFX.playSparkle();
    this.speak("Веселий дельфін перевертає відро з теплою водою! Водяний салют!");
  }

  // --- ПАРК: PARC DE L'ESTACIÓ ---
  handleParkFountainClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "⛲ Загадати бажання у фонтані парку",
      coins: 8,
      xp: 20,
      icon: "⛲",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.speak("Монетка полетіла у мармуровий фонтан на щастя та радість!");
        this.render();
      }
    });
  }

  handleParkFlowersClick() {
    window.soundFX.playSparkle();
    this.speak("Ароматні квітучі троянди та фіолетова лаванда у парку Гандії!");
  }

  handlePlaygroundSwingsClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🎠 Покататися на гойдалках у парку",
      coins: 10,
      xp: 25,
      icon: "🎠",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Гойдалки літають високо до неба! Сміх та радість навколо!");
        this.render();
      }
    });
  }

  handlePlaygroundTowerClick() {
    window.soundFX.playWhoosh();
    this.speak("Справжня лицарська фортечна вежа та довга гвинтова гірка!");
  }

  handleParkCottonCandyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🍥 Рожева солодка вата у кіоску парку",
      coins: 10,
      xp: 25,
      icon: "🍥",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Величезна ніжна хмаринка солодкої вати! Смакота!");
        this.render();
      }
    });
  }

  handleParkGelatoClick() {
    window.soundFX.playSparkle();
    this.speak("Прохолодне ягідне джелато рятує від спеки під тінню дерев!");
  }

  handleDogparkHoopClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🐕 Тренування Бруно: стрибок у кільце",
      coins: 12,
      xp: 30,
      icon: "🐕",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playBark();
        this.launchConfetti();
        const brunoEl = document.getElementById('character-bruno');
        if (brunoEl) {
          brunoEl.classList.add('jumping');
          setTimeout(() => brunoEl.classList.remove('jumping'), 600);
        }
        this.speak("Бруно неймовірно легко перестрибнув через кільце! Розумний песик!");
        this.render();
      }
    });
  }

  handleDogparkWaterClick() {
    window.soundFX.playBark();
    this.speak("Бруно напився свіжої водички з поїлки і радісно гавкає!");
  }

  // --- СУПЕРМАРКЕТ: MERCADONA ---
  handleMercBakeryCakeClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🎂 Допомогти вибрати святковий тортик у Mercadona",
      coins: 10,
      xp: 25,
      icon: "🎂",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Ароматні круасани та святковий тортик з вишенькою обрані!");
        this.render();
      }
    });
  }

  handleMercBakeryCandyClick() {
    window.soundFX.playSparkle();
    this.speak("Яскраві пакетики з мармеладками Haribo та свіжі булочки!");
  }

  handleMercProduceOrangeClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🍊 Обрати стиглі валенсійські апельсини",
      coins: 10,
      xp: 25,
      icon: "🍊",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Справжні солодкі апельсини Валенсії прямо з дерева!");
        this.render();
      }
    });
  }

  handleMercProduceVeggiesClick() {
    window.soundFX.playSparkle();
    this.speak("Хрустке свіже броколі, соковита морква та зелені яблука!");
  }

  handleMercMeatJamonClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🥓 Скуштувати іспанський делікатес хамон",
      coins: 10,
      xp: 25,
      icon: "🥓",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Знаменитий іспанський делікатес хамон - гордість Іспанії!");
        this.render();
      }
    });
  }

  handleMercMeatBoneClick() {
    window.soundFX.playBark();
    this.speak("Смачна велика кісточка з натурального м'яса для песика Бруно!");
  }

  handleMercDrinksWaterClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "💧 Взяти пляшку чистої води Font Vella",
      coins: 8,
      xp: 20,
      icon: "💧",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.speak("Чиста гірська вода Font Vella чудово втамовує спрагу!");
        this.render();
      }
    });
  }

  handleMercDrinksJuiceClick() {
    window.soundFX.playSparkle();
    this.speak("Апарат прямо на очах вичавлює свіжий апельсиновий сік у пляшечку!");
  }

  // --- КАФЕ РОЗВАГ: CHACHI PIRULI ---
  handleChachiBouncyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🏰 Стрибки на надувному замку-батуті",
      coins: 12,
      xp: 30,
      icon: "🏰",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        const danikaEl = document.getElementById('character-danika');
        if (danikaEl) {
          danikaEl.classList.add('jumping');
          setTimeout(() => danikaEl.classList.remove('jumping'), 600);
        }
        this.speak("Стрибки до самої стелі на величезному надувному замку!");
        this.render();
      }
    });
  }

  handleChachiMatClick() {
    window.soundFX.playSparkle();
    this.speak("М'які надувні бастіони та вежі в Chachi Piruli!");
  }

  handleChachiClimbClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🧗 Підкорити скеледром у Chachi Piruli",
      coins: 15,
      xp: 35,
      icon: "🧗",
      onApproved: () => {
        this.state.coins += 15;
        this.addXP(35);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Вершина скеледрому підкорена! Справжня смілива альпіністка!");
        this.render();
      }
    });
  }

  handleChachiHelmetClick() {
    window.soundFX.playSparkle();
    this.speak("Яскравий шолом та міцна страховка надійно захищають на скеледромі!");
  }

  handleChachiBallpitClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🔮 Пірнути в океан з 10 000 кольорових кульок",
      coins: 15,
      xp: 35,
      icon: "🔮",
      onApproved: () => {
        this.state.coins += 15;
        this.addXP(35);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Плюх! Море з десяти тисяч різнокольорових кульок навколо!");
        this.render();
      }
    });
  }

  handleChachiSlideClick() {
    window.soundFX.playWhoosh();
    this.speak("Швидка кручена гірка з'їжджає прямо в басейн кульок!");
  }

  handleChachiHockeyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "⚡ Перемога у турнірі з аерохокею",
      coins: 12,
      xp: 30,
      icon: "⚡",
      onApproved: () => {
        this.state.coins += 12;
        this.addXP(30);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Гооол! Блискавичний кидок і перемога в аерохокеї!");
        this.render();
      }
    });
  }

  handleChachiClawClick() {
    window.soundFX.playSparkle();
    this.speak("Хапайка з м'якими іграшками! Рожевий зайчик майже в руках!");
  }

  handleChachiBasketClick() {
    window.soundFX.playSparkle();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.classList.add('jumping');
      setTimeout(() => danikaEl.classList.remove('jumping'), 600);
    }
    this.speak("Влучний триочковий кидок прямо в кошик баскетбольного автомата!");
  }


  // =========================================================
  // ЗАГАЛЬНІ ЕКРАНИ ЛОКАЦІЙ (ВХІД / ПАНОРАМА 🏛️)
  // =========================================================
  handleAbeceYardClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🏫 Прибути до школи Abecé та підготувати рюкзак",
      coins: 5,
      xp: 20,
      icon: "🏫",
      onApproved: () => {
        this.state.coins += 5;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Шкільне подвір'я Colegio Abecé! Даніка готова до занять!");
        this.render();
      }
    });
  }

  handleAbeceBellClick() {
    window.soundFX.playSparkle();
    this.speak("Дзень-дзелень! Шкільний дзвінок Abecé кличе на цікавий урок!");
  }

  handleVitalMainHallClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🛍️ Прогулянка торгівельним центром La Vital",
      coins: 8,
      xp: 20,
      icon: "🛍️",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Головний атріум La Vital! Стільки яскравих магазинів!");
        this.render();
      }
    });
  }

  handleVitalCinemaClick() {
    window.soundFX.playSparkle();
    this.speak("Кінотеатр та яскраві вітрини La Vital! Можна переглянути новий мультик!");
  }

  handleBeachSeaViewClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🌊 Прогулянка золотим пляжем Platja de Gandia",
      coins: 8,
      xp: 20,
      icon: "🌊",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Неймовірне Середземне море та теплий пісочок Гандії!");
        this.render();
      }
    });
  }

  handleBeachPromenadeClick() {
    window.soundFX.playSparkle();
    this.speak("Морська набережна з пальмами! Чудове місце для скейта та прогулянок з Бруно!");
  }

  handleParkEntranceClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🌳 Весела прогулянка з Бруно у Parc de l'Estació",
      coins: 8,
      xp: 20,
      icon: "🌳",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Затишний парк Гандії! Зелені алеї та чисте повітря!");
        this.render();
      }
    });
  }

  handleParkPalmsClick() {
    window.soundFX.playSparkle();
    this.speak("Високі валенсійські пальми шелестять під теплим вітерцем!");
  }

  handleMercCartClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🛒 Допомогти вибрати корисні покупки в Mercadona",
      coins: 8,
      xp: 20,
      icon: "🛒",
      onApproved: () => {
        this.state.coins += 8;
        this.addXP(20);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Беремо зручний візочок для смачних і корисних покупок!");
        this.render();
      }
    });
  }

  handleMercAislesClick() {
    window.soundFX.playSparkle();
    this.speak("Просторі полички супермаркету Mercadona у Гандії! Тут є все смачненьке!");
  }

  handleChachiPartyClick() {
    window.soundFX.playClick();
    this.requestParentApproval({
      title: "🎈 Святковий візит до розважального центру Chachi Piruli",
      coins: 10,
      xp: 25,
      icon: "🎈",
      onApproved: () => {
        this.state.coins += 10;
        this.addXP(25);
        this.saveState();
        window.soundFX.playSparkle();
        this.launchConfetti();
        this.speak("Свято та веселощі у Chachi Piruli! Тут неймовірно радісно!");
        this.render();
      }
    });
  }

  handleChachiWelcomeClick() {
    window.soundFX.playSparkle();
    this.speak("Ласкаво просимо до казкового дитячого центру Chachi Piruli!");
  }

  // =========================================================
  // СІМЕЙНИЙ РЕЙТИНГ ТА ПРОФІЛІ (ДАНІКА, МАМА, ТАТО 🏆)
  // =========================================================
  syncFamilyDanika() {
    if (!this.state.familyProfiles) {
      if (typeof DEFAULT_APP_DATA !== 'undefined' && DEFAULT_APP_DATA.familyProfiles) {
        this.state.familyProfiles = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.familyProfiles));
      } else {
        return;
      }
    }
    if (!this.state.familyProfiles.danika) {
      this.state.familyProfiles.danika = {
        id: "danika",
        name: "Даніка",
        role: "Донечка-Шукачка 👑",
        badge: "👧",
        avatar: this.state.activeDanikaAvatar || "assets/characters/danika_danika_abece.png",
        level: this.state.level || 1,
        xp: this.state.xp || 140,
        coins: this.state.coins || 30,
        streakDays: this.state.streakDays || 3,
        completedTodayCount: 2,
        completedWeekCount: 14
      };
    }
    const d = this.state.familyProfiles.danika;
    d.xp = this.state.xp || 0;
    d.coins = this.state.coins || 0;
    d.level = this.state.level || 1;
    d.streakDays = this.state.streakDays || 3;
    if (this.state.activeDanikaAvatar) {
      d.avatar = this.state.activeDanikaAvatar;
    }
  }

  checkFamilyOvertake(prevXp) {
    if (!this.state.familyProfiles) return;
    const momXp = this.state.familyProfiles.mom ? this.state.familyProfiles.mom.xp : 0;
    const dadXp = this.state.familyProfiles.dad ? this.state.familyProfiles.dad.xp : 0;
    const curXp = this.state.xp;

    if (prevXp <= dadXp && curXp > dadXp) {
      setTimeout(() => {
        this.speak("Ура! Даніка щойно обігнала Тата у сімейному рейтингу! Неймовірно!");
        this.launchConfetti();
      }, 800);
    }
    if (prevXp <= momXp && curXp > momXp) {
      setTimeout(() => {
        this.speak("Фантастика! Даніка обігнала Маму і стала номер один у рейтингу сім'ї! Справжня чемпіонка!");
        this.launchConfetti();
      }, 1000);
    }
  }

  openFamilyLeaderboard(activeTab = 'leaderboard') {
    this.familyActiveTab = activeTab;
    this.syncFamilyDanika();
    window.soundFX.playClick();

    const modal = document.getElementById('family-modal');
    if (!modal) return;

    const bodyEl = document.getElementById('family-modal-body');
    if (!bodyEl) return;

    const profiles = [
      this.state.familyProfiles.danika,
      this.state.familyProfiles.mom,
      this.state.familyProfiles.dad
    ].filter(Boolean);

    // Сортування за зменшенням XP
    const ranked = [...profiles].sort((a, b) => b.xp - a.xp);
    const danikaRank = ranked.findIndex(p => p.id === 'danika') + 1;

    let bannerHtml = '';
    if (danikaRank === 1) {
      bannerHtml = `
        <div class="family-status-banner rank-first">
          <span class="banner-icon">👑</span>
          <div class="banner-text">
            <strong>Даніка лідирує у сім'ї! 🥇 1-е місце!</strong>
            <span>Супер-розумничка! Продовжуй виконувати завдання та утримуй кубок!</span>
          </div>
        </div>
      `;
    } else {
      const leader = ranked[0];
      const diff = leader.xp - this.state.familyProfiles.danika.xp;
      bannerHtml = `
        <div class="family-status-banner rank-chase">
          <span class="banner-icon">🔥</span>
          <div class="banner-text">
            <strong>Даніка на ${danikaRank}-му місці! До лідера (${leader.name}) всього ${diff} XP!</strong>
            <span>Виконай 1-2 завдання, щоб обігнати ${leader.name} та очолити рейтинг!</span>
          </div>
        </div>
      `;
    }

    // Вкладки
    const momDone = this.state.familyProfiles.mom.quests ? this.state.familyProfiles.mom.quests.filter(q => q.completed).length : 0;
    const momTotal = this.state.familyProfiles.mom.quests ? this.state.familyProfiles.mom.quests.length : 0;
    const dadDone = this.state.familyProfiles.dad.quests ? this.state.familyProfiles.dad.quests.filter(q => q.completed).length : 0;
    const dadTotal = this.state.familyProfiles.dad.quests ? this.state.familyProfiles.dad.quests.length : 0;

    const tabsHtml = `
      <div class="family-tabs-bar">
        <button class="family-tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}" onclick="window.game.openFamilyLeaderboard('leaderboard')">
          🏆 Загальний Рейтинг
        </button>
        <button class="family-tab-btn ${activeTab === 'mom' ? 'active' : ''}" onclick="window.game.openFamilyLeaderboard('mom')">
          👩 Завдання Мами (${momDone}/${momTotal})
        </button>
        <button class="family-tab-btn ${activeTab === 'dad' ? 'active' : ''}" onclick="window.game.openFamilyLeaderboard('dad')">
          👨 Завдання Тата (${dadDone}/${dadTotal})
        </button>
      </div>
    `;

    let contentHtml = '';

    if (activeTab === 'leaderboard') {
      const rankBadges = ['🥇', '🥈', '🥉'];
      const rankClasses = ['rank-gold', 'rank-silver', 'rank-bronze'];

      const cardsHtml = ranked.map((p, idx) => {
        const isDanika = p.id === 'danika';
        const rankBadge = rankBadges[idx] || `${idx + 1}`;
        const rankCls = rankClasses[idx] || '';

        return `
          <div class="family-player-card ${rankCls} ${isDanika ? 'is-danika' : ''}">
            <div class="player-rank-col">
              <span class="rank-medal">${rankBadge}</span>
              <span class="rank-num">#${idx + 1}</span>
            </div>
            <div class="player-avatar-col">
              <img src="${p.avatar || 'assets/characters/danika_danika_abece.png'}" alt="${p.name}" class="player-avatar-img">
              <span class="player-badge-emoji">${p.badge || '⭐'}</span>
            </div>
            <div class="player-info-col">
              <div class="player-name-row">
                <span class="player-name">${p.name}</span>
                <span class="player-role">${p.role}</span>
              </div>
              <div class="player-stats-row">
                <span class="stat-pill xp-pill">⭐ ${p.xp} XP</span>
                <span class="stat-pill streak-pill">🔥 ${p.streakDays} дні</span>
                <span class="stat-pill task-pill">✅ ${p.completedTodayCount || 0} сьог. / ${p.completedWeekCount || 0} тиж.</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      contentHtml = `
        <div class="family-leaderboard-list">
          ${cardsHtml}
        </div>
      `;
    } else if (activeTab === 'mom' || activeTab === 'dad') {
      const parentProfile = this.state.familyProfiles[activeTab];
      const quests = parentProfile.quests || [];

      const questsHtml = quests.map(q => {
        return `
          <div class="parent-task-item ${q.completed ? 'completed' : ''}">
            <div class="task-checkbox" onclick="window.game.completeParentTask('${activeTab}', '${q.id}')">
              ${q.completed ? '✅' : '⚪'}
            </div>
            <div class="task-info" onclick="window.game.completeParentTask('${activeTab}', '${q.id}')">
              <span class="task-icon">${q.icon || '📌'}</span>
              <span class="task-title ${q.completed ? 'task-done-title' : ''}">${q.title}</span>
            </div>
            <div class="task-reward-badge">
              +${q.xp} ⭐
            </div>
            <button class="btn-task-action ${q.completed ? 'btn-done' : 'btn-do'}" onclick="window.game.completeParentTask('${activeTab}', '${q.id}')">
              ${q.completed ? 'Скасувати' : 'Виконано!'}
            </button>
          </div>
        `;
      }).join('');

      contentHtml = `
        <div class="parent-tasks-container">
          <div class="parent-header-card">
            <span class="parent-header-icon">${parentProfile.badge}</span>
            <div>
              <div class="parent-header-name">${parentProfile.name} • ${parentProfile.role}</div>
              <div class="parent-header-desc">Поточний баланс: <strong>${parentProfile.xp} XP</strong> | Виконано сьогодні: <strong>${parentProfile.completedTodayCount || 0}</strong></div>
            </div>
          </div>
          <div class="parent-tasks-list">
            ${questsHtml}
          </div>
        </div>
      `;
    }

    bodyEl.innerHTML = bannerHtml + tabsHtml + contentHtml;
    this.openModal('family-modal');
  }

  completeParentTask(profileId, questId) {
    if (!this.state.familyProfiles || !this.state.familyProfiles[profileId]) return;
    const profile = this.state.familyProfiles[profileId];
    const quest = profile.quests ? profile.quests.find(q => q.id === questId) : null;
    if (!quest) return;

    if (quest.completed) {
      quest.completed = false;
      profile.xp = Math.max(0, profile.xp - quest.xp);
      profile.completedTodayCount = Math.max(0, (profile.completedTodayCount || 1) - 1);
      window.soundFX.playClick();
      this.speak(`Завдання скасовано.`);
    } else {
      quest.completed = true;
      profile.xp += quest.xp;
      profile.completedTodayCount = (profile.completedTodayCount || 0) + 1;
      profile.completedWeekCount = (profile.completedWeekCount || 0) + 1;
      window.soundFX.playSparkle();
      this.launchConfetti();
      this.speak(`Чудово! ${profile.name} виконує: ${quest.title}! Плюс ${quest.xp} балів до рейтингу!`);
    }

    this.saveState();
    this.openFamilyLeaderboard(this.familyActiveTab || 'leaderboard');
  }

  // =========================================================
  // ТОЧНЕ ЦЕНТРУВАННЯ АКСЕСУАРІВ НА ДАНІЦІ (ЗА КОСТЮМОМ І ТИПОМ)
  // =========================================================
  getAccessoryPlacement(accId, avatarSrc) {
    const src = (avatarSrc || '').toLowerCase();
    let faceX = 50.0;
    let dy = 0.0;

    if (src.includes('abece') || src.includes('casual')) {
      faceX = 43.5;
    } else if (src.includes('danika_artist.png') && !src.includes('danika_danika_artist')) {
      faceX = 46.5;
    } else if (src.includes('beach') || src.includes('pajama')) {
      faceX = 47.0;
    } else if (src.includes('morning_undies') || src.includes('varsity')) {
      faceX = 47.5;
    } else if (src.includes('astronaut') || src.includes('flamenco')) {
      faceX = 48.5;
    } else if (src.includes('fairy')) {
      faceX = 50.0;
      dy = 3.2;
    } else if (src.includes('raincoat') || src.includes('sport')) {
      faceX = 52.5;
    } else if (src.includes('skater')) {
      faceX = 53.5;
    }

    const accMap = {
      acc_crown:                { dx: 0.0,   y: 9.5,  w: 32.0 },
      acc_mermaid_tiara:        { dx: 0.0,   y: 10.5, w: 34.0 },
      acc_bow_headband:         { dx: 0.0,   y: 15.0, w: 42.0 },
      acc_flower_wreath:        { dx: 0.0,   y: 15.5, w: 44.0 },
      acc_skater_helmet:        { dx: 0.0,   y: 12.5, w: 46.0 },
      acc_panama_hat:           { dx: 0.0,   y: 13.5, w: 46.0 },
      acc_pirate_bandana:       { dx: 1.0,   y: 13.5, w: 45.0 },
      acc_cap_abece:            { dx: 0.0,   y: 12.5, w: 45.0 },
      acc_cat_beanie:           { dx: 0.0,   y: 13.2, w: 44.0 },
      acc_artist_beret:         { dx: -1.5,  y: 12.5, w: 45.0 },
      acc_headphones:           { dx: 0.0,   y: 21.0, w: 50.0 },
      acc_glasses_heart:        { dx: 0.0,   y: 28.8, w: 39.0 },
      acc_smart_glasses:        { dx: 0.0,   y: 28.8, w: 39.0 },
      acc_sleep_mask:           { dx: 0.0,   y: 28.2, w: 40.0 },
      acc_star_clips:           { dx: -11.5, y: 18.5, w: 17.0 },
      acc_seashell_necklace:    { dx: 0.0,   y: 41.0, w: 22.0 },
      acc_crystal_pendant:      { dx: 0.0,   y: 42.0, w: 21.0 },
      acc_crossbody_bag:        { dx: 1.5,   y: 52.5, w: 34.0 },
      acc_star_wand:            { dx: 25.5,  y: 40.5, w: 26.0 },
      acc_friendship_bracelets: { dx: -19.5, y: 59.5, w: 14.0 }
    };

    const cfg = accMap[accId] || { dx: 0.0, y: 14.0, w: 38.0 };
    return {
      left: +(faceX + cfg.dx).toFixed(2),
      top: +(cfg.y + dy).toFixed(2),
      width: cfg.w
    };
  }

  // =========================================================
  // ПЕРЕМИКАННЯ ПРОФІЛІВ ТА КАБІНЕТИ (ДАНІКА, МАМА, ТАТО 👑)
  // =========================================================
  switchProfile(profileId) {
    if (!this.state.familyProfiles || !this.state.familyProfiles[profileId]) return;
    this.state.activeProfileId = profileId;
    window.soundFX.playSparkle();

    const p = this.state.familyProfiles[profileId];
    if (profileId === 'danika') {
      this.syncFamilyDanika();
      this.speak("Привіт, Даніка! Шукачка скарбів знову у грі!");
    } else if (profileId === 'mom') {
      this.speak("Вітаємо, Мама Ксюша! Ваш кабінет відкрито!");
    } else if (profileId === 'dad') {
      this.speak("Вітаємо, Тато! Ваш кабінет відкрито!");
    }

    this.render();
    if (this.state.activeLocationId === 'loc_home' && this.state.activeRoomIndex === 4) {
      this.renderSecretRoom();
    }
    const tablet = document.getElementById('adventure-tablet');
    if (tablet && tablet.classList.contains('active')) {
      this.renderTabletContent();
    }
    this.closeModal('profile-modal');
    this.saveState();
  }

  openProfileModal() {
    this.syncFamilyDanika();
    window.soundFX.playClick();
    const container = document.getElementById('profile-modal-cards');
    if (!container) return;

    const curId = this.state.activeProfileId || 'danika';
    const profiles = [
      this.state.familyProfiles.danika,
      this.state.familyProfiles.mom,
      this.state.familyProfiles.dad
    ].filter(Boolean);

    container.innerHTML = profiles.map(p => {
      const isActive = p.id === curId;
      const questsDone = (p.quests || []).filter(q => q.completed).length;
      const questsTotal = (p.quests || []).length;
      return `
        <div class="profile-select-card ${isActive ? 'active' : ''}" onclick="window.game.switchProfile('${p.id}')">
          <img src="${p.avatar || 'assets/characters/danika_danika_abece.png'}" alt="${p.name}" class="profile-select-avatar">
          <div class="profile-select-info">
            <div class="profile-select-name">
              <span>${p.badge} ${p.name}</span>
              ${isActive ? '<span style="font-size:0.75rem; background:#22c55e; color:#fff; padding:2px 8px; border-radius:10px;">Активний зараз</span>' : ''}
            </div>
            <div class="profile-select-role">${p.role}</div>
            <div class="profile-select-stats">
              <span class="profile-stat-badge">⭐ ${p.xp || 0} XP</span>
              <span class="profile-stat-badge">🪙 ${p.coins || 0} монет</span>
              <span class="profile-stat-badge">📋 ${questsDone}/${questsTotal} завдань</span>
              <span class="profile-stat-badge">🔥 ${p.streakDays || 1} дні</span>
            </div>
          </div>
          <button class="btn-select-profile">
            ${isActive ? 'Вибрано ✔️' : 'Грати 🎮'}
          </button>
        </div>
      `;
    }).join('');

    this.openModal('profile-modal');
  }

  toggleProfileTask(profileId, questId) {
    if (!this.state.familyProfiles || !this.state.familyProfiles[profileId]) return;
    const profile = this.state.familyProfiles[profileId];
    const quest = profile.quests ? profile.quests.find(q => q.id === questId) : null;
    if (!quest) return;

    if (quest.completed) {
      quest.completed = false;
      profile.xp = Math.max(0, profile.xp - quest.xp);
      profile.coins = Math.max(0, (profile.coins || 10) - 10);
      window.soundFX.playClick();
      this.speak("Справу скасовано.");
    } else {
      quest.completed = true;
      profile.xp += quest.xp;
      profile.coins = (profile.coins || 0) + 10;
      profile.completedTodayCount = (profile.completedTodayCount || 0) + 1;
      profile.completedWeekCount = (profile.completedWeekCount || 0) + 1;
      window.soundFX.playSparkle();
      this.launchConfetti();
      this.speak(`Супер! ${profile.name} виконав: ${quest.title}! Плюс ${quest.xp} балів та 10 монет!`);
    }

    this.saveState();
    this.render();
    this.renderTabletContent();
  }

  // =========================================================
  // СЄКРЄТНАЯ КОМНАТА 2.0: 30 ПРЕДМЕТІВ + МЕНЮ ВИБОРУ МОДЕЛЕЙ ПРИ КЛІКУ НА ПРЕДМЕТ
  // =========================================================
  getSecretRoomCatalog() {
    return (typeof SECRET_ROOM_ITEMS_CATALOG !== 'undefined' && Array.isArray(SECRET_ROOM_ITEMS_CATALOG))
      ? SECRET_ROOM_ITEMS_CATALOG
      : [];
  }

  ensureSecretRoomConfig() {
    const catalog = this.getSecretRoomCatalog();
    const allIds = catalog.map(it => it.id);
    if (!this.state.secretRoomConfig || this.state.secretRoomConfig.version !== '20261004_3') {
      this.state.secretRoomConfig = {
        version: '20261004_3',
        exposureMode: 'day',
        isSleeping: false,
        lightStates: {
          sr_01_chandelier: true,
          sr_02_fairy_lights: true,
          sr_13_moon_lamp: true,
          sr_16_star_lantern: true
        },
        selectedVariants: {
          sr_09_canopy_bed: 'bed_default',
          sr_22_rainbow_rug: 'rug_default',
          sr_20_floor_monstera: 'plant_default',
          sr_25_bruno_royal_bed: 'bruno_bed_default',
          sr_24_acoustic_guitar: 'sport_default'
        },
        enabledItems: allIds
      };
    } else if (!Array.isArray(this.state.secretRoomConfig.enabledItems)) {
      this.state.secretRoomConfig.enabledItems = allIds;
    }
    if (!this.state.secretRoomConfig.lightStates) {
      this.state.secretRoomConfig.lightStates = {};
    }
    if (!this.state.secretRoomConfig.selectedVariants) {
      this.state.secretRoomConfig.selectedVariants = {
        sr_09_canopy_bed: 'bed_default',
        sr_22_rainbow_rug: 'rug_default',
        sr_20_floor_monstera: 'plant_default',
        sr_25_bruno_royal_bed: 'bruno_bed_default',
        sr_24_acoustic_guitar: 'sport_default'
      };
    }
    return this.state.secretRoomConfig;
  }

  getActiveSecretVariant(slotId) {
    if (typeof SECRET_ROOM_ITEM_VARIANTS === 'undefined' || !SECRET_ROOM_ITEM_VARIANTS[slotId]) {
      return null;
    }
    const cfg = this.ensureSecretRoomConfig();
    const slotGroup = SECRET_ROOM_ITEM_VARIANTS[slotId];
    const selectedId = cfg.selectedVariants[slotId];
    return slotGroup.variants.find(v => v.id === selectedId) || slotGroup.variants[0];
  }

  renderSecretRoom() {
    const stage = document.getElementById('secret-furniture-stage');
    if (!stage) return;

    const cfg = this.ensureSecretRoomConfig();
    const catalog = this.getSecretRoomCatalog();
    const enabledSet = new Set(cfg.enabledItems || []);

    // Застосування режиму експозиції кімнати (day / sunset / night_magic)
    const slideEl = stage.closest('.room-secret-slide');
    if (slideEl) {
      slideEl.classList.remove('exposure-day', 'exposure-sunset', 'exposure-night');
      if (cfg.exposureMode === 'sunset') slideEl.classList.add('exposure-sunset');
      else if (cfg.exposureMode === 'night_magic') slideEl.classList.add('exposure-night');
      else slideEl.classList.add('exposure-day');
    }

    const badgeEl = document.getElementById('secret-active-count-badge');
    if (badgeEl) {
      badgeEl.innerText = `${enabledSet.size}/${catalog.length}`;
    }

    // Якщо вибране тематичне ліжко (Космос, Щенячий Патруль, Зоотрополіс, Єдиноріг),
    // ховаємо окремі накладні подушки/єдинорога зі старого ліжка, щоб не перекривати тематичні подушки нового ліжка
    const activeBedVariant = cfg.selectedVariants && cfg.selectedVariants.sr_09_canopy_bed;
    const isCustomBed = activeBedVariant && activeBedVariant !== 'bed_default';
    const activeBruno = this.getActiveBrunoItem();
    const isBrunoInBedSprite = !this.state.brunoHidden && activeBruno && activeBruno.id === 'bruno_in_bed';

    // Сортуємо за zIndex для правильного перекриття в перспективі
    const activeItems = catalog
      .filter(item => {
        if (!enabledSet.has(item.id)) return false;
        if (isCustomBed && (item.id === 'sr_10_star_pillows' || item.id === 'sr_11_plush_unicorn')) {
          return false;
        }
        if (isBrunoInBedSprite && item.id === 'sr_25_bruno_royal_bed') {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.zIndex || 10) - (b.zIndex || 10));

    stage.innerHTML = activeItems.map(item => {
      const slotId = (typeof SECRET_ROOM_SLOT_ALIASES !== 'undefined' && SECRET_ROOM_SLOT_ALIASES[item.id])
        ? SECRET_ROOM_SLOT_ALIASES[item.id]
        : item.id;
      const activeVar = (slotId === item.id) ? this.getActiveSecretVariant(slotId) : null;
      const hasVariants = (typeof SECRET_ROOM_ITEM_VARIANTS !== 'undefined' && !!SECRET_ROOM_ITEM_VARIANTS[slotId]);

      const b = (activeVar && activeVar.bbox) ? activeVar.bbox : (item.bbox || { leftPct: 10, topPct: 10, widthPct: 10, heightPct: 10 });
      const fileSrc = (activeVar && activeVar.file) ? activeVar.file : item.file;
      const displayName = (activeVar && activeVar.name) ? activeVar.name : item.name;
      const displayIcon = (activeVar && activeVar.icon) ? activeVar.icon : item.icon;

      const isLightOn = cfg.lightStates[item.id] !== false;
      const isGlowing = item.exposure && item.exposure.lightSource && isLightOn;
      const glowStyle = isGlowing
        ? `filter: drop-shadow(${item.exposure.shadow || '0 0 14px rgba(251,191,36,0.65)'}) brightness(1.06);`
        : `filter: drop-shadow(${(item.exposure && item.exposure.shadow) || '0 6px 12px rgba(35,15,5,0.3)'});`;

      const zzzOverlay = ((item.id === 'sr_09_canopy_bed' || item.id === 'sr_09_princess_bed') && cfg.isSleeping)
        ? `<div class="secret-zzz-anim">💤 Zzz...</div>`
        : '';

      const customClass = hasVariants ? 'secret-item-customizable' : '';
      const hintAttr = hasVariants ? `data-variant-hint="🎨 Натисни: обрати стиль"` : '';

      return `
        <div class="secret-item secret-mapped-item ${isGlowing ? 'secret-item-lit' : ''} ${customClass}"
             id="secret-dom-${item.id}"
             ${hintAttr}
             style="left:${b.leftPct}%; top:${b.topPct}%; width:${b.widthPct}%; height:${b.heightPct}%; z-index:${item.zIndex || 10};"
             onclick="window.game.interactSecretItem('${item.id}')"
             title="${displayIcon} ${displayName}${hasVariants ? ' — Натисни, щоб обрати іншу модель!' : ''}">
          <img src="${fileSrc}?v=20261005_2" alt="${displayName}" class="secret-mapped-img" style="${glowStyle}">
          ${zzzOverlay}
        </div>
      `;
    }).join('');
  }

  interactSecretItem(itemId) {
    const cfg = this.ensureSecretRoomConfig();
    const catalog = this.getSecretRoomCatalog();
    const item = catalog.find(it => it.id === itemId);
    if (!item) return;

    const domEl = document.getElementById(`secret-dom-${itemId}`);
    if (domEl) {
      domEl.classList.remove('secret-item-pop');
      void domEl.offsetWidth;
      domEl.classList.add('secret-item-pop');
    }

    // Перевіряємо, чи має цей предмет (або його слот) меню варіантів (Ліжка, Килимки, Вазони, Лежанка Бруно, Спорт)
    const slotId = (typeof SECRET_ROOM_SLOT_ALIASES !== 'undefined' && SECRET_ROOM_SLOT_ALIASES[itemId])
      ? SECRET_ROOM_SLOT_ALIASES[itemId]
      : itemId;

    if (typeof SECRET_ROOM_ITEM_VARIANTS !== 'undefined' && SECRET_ROOM_ITEM_VARIANTS[slotId]) {
      window.soundFX.playSparkle();
      this.openSecretItemPicker(slotId);
      return;
    }

    this.performSecretItemInteraction(itemId);
  }

  performSecretItemInteraction(itemId) {
    const cfg = this.ensureSecretRoomConfig();
    const catalog = this.getSecretRoomCatalog();
    const item = catalog.find(it => it.id === itemId);
    if (!item) return;

    const activeVar = this.getActiveSecretVariant(itemId);
    const inter = item.interaction || {};
    const speechText = (activeVar && activeVar.speech) ? activeVar.speech : inter.speech;
    const xpGain = inter.xp || 5;
    this.addXP(xpGain);

    if (inter.bonusCoin) {
      this.state.coins = (this.state.coins || 0) + inter.bonusCoin;
      if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
    }

    if (inter.type === 'sleep_bed') {
      cfg.isSleeping = !cfg.isSleeping;
      window.soundFX.playSparkle();
      const danikaEl = document.getElementById('character-danika');
      if (cfg.isSleeping) {
        if (danikaEl) {
          danikaEl.style.left = '18%';
          danikaEl.style.bottom = '115px';
          danikaEl.dataset.xPct = 18;
        }
        this.setDanikaPose('danika_sleeping');
        this.speak(speechText);
      } else {
        if (danikaEl) {
          danikaEl.style.left = '42%';
          danikaEl.style.bottom = '56px';
          danikaEl.dataset.xPct = 42;
        }
        this.resetDanikaPose();
        this.speak("Прокидаємось бадьорими та готовими до нових пригод!");
      }
    } else if (inter.type === 'study_desk' || inter.type === 'science_kit') {
      window.soundFX.playClick();
      const danikaEl = document.getElementById('character-danika');
      if (danikaEl) {
        danikaEl.style.left = '72%';
        danikaEl.style.bottom = '85px';
        danikaEl.dataset.xPct = 72;
      }
      this.setDanikaPose(inter.type === 'science_kit' ? 'danika_scientist' : 'danika_school_desk', false);
      this.speak(speechText);
    } else if (inter.type === 'paint_easel') {
      window.soundFX.playSparkle();
      const danikaEl = document.getElementById('character-danika');
      if (danikaEl) {
        danikaEl.style.left = '26%';
        danikaEl.style.bottom = '75px';
        danikaEl.dataset.xPct = 26;
      }
      this.setDanikaPose('danika_painting', false);
      this.speak(speechText);
    } else if (inter.type === 'call_bruno' || inter.type === 'call_bruno_bed') {
      window.soundFX.playBark();
      this.launchConfetti();
      const brunoEl = document.getElementById('character-bruno');
      if (brunoEl) {
        brunoEl.style.transition = 'all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
        if (inter.type === 'call_bruno_bed') {
          brunoEl.style.left = '81%';
          brunoEl.style.bottom = '20px';
        } else {
          brunoEl.style.left = '48%';
          brunoEl.style.bottom = '52px';
        }
        brunoEl.style.transform = 'scale(1.14)';
        setTimeout(() => {
          brunoEl.style.transform = '';
        }, 1200);
      }
      this.speak(speechText);
    } else if (inter.type === 'toggle_light' || inter.type === 'toggle_glow') {
      cfg.lightStates[itemId] = !(cfg.lightStates[itemId] !== false);
      window.soundFX.playSparkle();
      this.speak(cfg.lightStates[itemId] ? speechText : `Світло «${item.name}» переведено у м'який режим.`);
    } else if (inter.type === 'confetti' || inter.type === 'music') {
      window.soundFX.playVictory();
      this.launchConfetti();
      this.speak(speechText);
    } else {
      window.soundFX.playSparkle();
      this.speak(speechText || `${item.icon} ${item.name}!`);
    }

    this.renderSecretRoom();
    this.render();
    this.saveState();
  }

  // =========================================================
  // КОНТЕКСТНЕ МЕНЮ ВИБОРУ МОДЕЛЕЙ ПРЕДМЕТА ПРИ КЛІКУ
  // =========================================================
  openSecretItemPicker(slotId) {
    if (typeof SECRET_ROOM_ITEM_VARIANTS === 'undefined' || !SECRET_ROOM_ITEM_VARIANTS[slotId]) return;
    this.activeSecretPickerSlot = slotId;

    // Закриваємо загальну панель дизайну та панель емоцій, щоб не перекривались
    const buildBar = document.getElementById('secret-build-toolbar');
    if (buildBar) buildBar.style.display = 'none';
    const actionDrawer = document.getElementById('danika-actions-drawer');
    if (actionDrawer) actionDrawer.style.display = 'none';

    const drawer = document.getElementById('secret-item-picker-drawer');
    if (!drawer) return;
    drawer.style.display = 'block';
    this.renderSecretItemPicker(slotId);
  }

  closeSecretItemPicker() {
    const drawer = document.getElementById('secret-item-picker-drawer');
    if (drawer) drawer.style.display = 'none';
    window.soundFX.playClick();
  }

  triggerSecretSlotAction() {
    const slotId = this.activeSecretPickerSlot || 'sr_09_canopy_bed';
    this.closeSecretItemPicker();
    this.performSecretItemInteraction(slotId);
  }

  renderSecretItemPicker(slotId) {
    slotId = slotId || this.activeSecretPickerSlot || 'sr_09_canopy_bed';
    if (typeof SECRET_ROOM_ITEM_VARIANTS === 'undefined' || !SECRET_ROOM_ITEM_VARIANTS[slotId]) return;
    this.activeSecretPickerSlot = slotId;

    const cfg = this.ensureSecretRoomConfig();
    const slotData = SECRET_ROOM_ITEM_VARIANTS[slotId];
    const currentVarId = cfg.selectedVariants[slotId] || slotData.variants[0].id;

    const titleEl = document.getElementById('secret-picker-title');
    if (titleEl) titleEl.innerText = `${slotData.slotTitle} (${slotData.variants.length})`;

    const subEl = document.getElementById('secret-picker-subtitle');
    if (subEl) subEl.innerText = slotData.slotSubtitle || '';

    const actionBtn = document.getElementById('secret-picker-action-btn');
    if (actionBtn) {
      actionBtn.innerText = slotData.actionLabel || '✨ Взаємодіяти';
    }

    // Швидкі вкладки перемикання між 5 категоріями предметів з варіантами
    const tabsEl = document.getElementById('secret-picker-slot-tabs');
    if (tabsEl) {
      const slotShortLabels = {
        sr_09_canopy_bed: '🛏️ Ліжка (5)',
        sr_22_rainbow_rug: '☁️ Килимки (7)',
        sr_20_floor_monstera: '🪴 Вазони (5)',
        sr_25_bruno_royal_bed: '🐶 Лежанки Бруно (5)',
        sr_24_acoustic_guitar: '🛹 Спорт (5)'
      };
      tabsEl.innerHTML = Object.keys(SECRET_ROOM_ITEM_VARIANTS).map(sKey => {
        const isAct = sKey === slotId;
        return `
          <button class="secret-slot-pill ${isAct ? 'active' : ''}" onclick="window.game.openSecretItemPicker('${sKey}')">
            ${slotShortLabels[sKey] || SECRET_ROOM_ITEM_VARIANTS[sKey].slotTitle}
          </button>
        `;
      }).join('');
    }

    const rowEl = document.getElementById('secret-picker-variants-row');
    if (!rowEl) return;

    rowEl.innerHTML = slotData.variants.map(v => {
      const isSelected = (v.id === currentVarId);
      return `
        <div class="secret-variant-card ${isSelected ? 'active' : ''}" onclick="window.game.selectSecretItemVariant('${slotId}', '${v.id}')">
          <div class="secret-variant-theme-tag">${v.icon} ${v.theme}</div>
          <div class="secret-variant-thumb-wrap">
            <img src="${v.file}?v=20261005_2" alt="${v.name}" class="secret-variant-thumb">
          </div>
          <div class="secret-variant-name">${v.name}</div>
          <div class="secret-variant-status">
            ${isSelected ? 'Встановлено ✔️' : '✨ Обрати'}
          </div>
        </div>
      `;
    }).join('');
  }

  selectSecretItemVariant(slotId, variantId) {
    if (typeof SECRET_ROOM_ITEM_VARIANTS === 'undefined' || !SECRET_ROOM_ITEM_VARIANTS[slotId]) return;
    const cfg = this.ensureSecretRoomConfig();
    const slotData = SECRET_ROOM_ITEM_VARIANTS[slotId];
    const variant = slotData.variants.find(v => v.id === variantId);
    if (!variant) return;

    cfg.selectedVariants[slotId] = variantId;

    // Переконуємося, що слот увімкнений у кімнаті
    const enabledSet = new Set(cfg.enabledItems || []);
    enabledSet.add(slotId);
    cfg.enabledItems = Array.from(enabledSet);

    const gotBonus = this.tryAutoCompleteIngameQuest('ig_secret_room');
    window.soundFX.playSparkle();
    if (gotBonus) {
      this.launchConfetti();
    }

    this.renderSecretRoom();
    this.renderSecretItemPicker(slotId);
    const buildBar = document.getElementById('secret-build-toolbar');
    if (buildBar && buildBar.style.display !== 'none') {
      this.renderBuildToolbar();
    }

    // Підсвічуємо та анімуємо оновлений предмет на сцені
    const domEl = document.getElementById(`secret-dom-${slotId}`);
    if (domEl) {
      domEl.classList.remove('secret-item-pop');
      void domEl.offsetWidth;
      domEl.classList.add('secret-item-pop');
    }

    this.speak(gotBonus ? `${variant.speech} Плюс 3 монетки дизайнера!` : variant.speech);
    this.render();
    this.saveState();
  }

  toggleSecretRoomItem(itemId) {
    const cfg = this.ensureSecretRoomConfig();
    const set = new Set(cfg.enabledItems || []);
    if (set.has(itemId)) {
      set.delete(itemId);
    } else {
      set.add(itemId);
    }
    cfg.enabledItems = Array.from(set);
    const gotBonus = this.tryAutoCompleteIngameQuest('ig_secret_room');
    window.soundFX.playSparkle();
    this.renderSecretRoom();
    this.renderBuildToolbar();
    this.saveState();
    if (gotBonus) {
      this.launchConfetti();
      this.speak("Чудовий вибір! Новий дизайн встановлено! Плюс 3 монетки дизайнера!");
    }
  }

  setAllSecretItems(enableAll) {
    const cfg = this.ensureSecretRoomConfig();
    const catalog = this.getSecretRoomCatalog();
    cfg.enabledItems = enableAll ? catalog.map(it => it.id) : [];
    const gotBonus = this.tryAutoCompleteIngameQuest('ig_secret_room');
    window.soundFX.playSparkle();
    if (enableAll) this.launchConfetti();
    this.renderSecretRoom();
    this.renderBuildToolbar();
    this.saveState();
    this.speak(enableAll
      ? (gotBonus ? "Усі 30 гармонійних деталей встановлено на свої місця! Плюс 3 монетки дизайнера!" : "Усі 30 гармонійних деталей встановлено в кімнаті!")
      : "Кімнату очищено! Тепер ти можеш додавати кожну деталь окремо!");
  }

  cycleSecretExposure() {
    const cfg = this.ensureSecretRoomConfig();
    const modes = ['day', 'sunset', 'night_magic'];
    const labels = {
      day: "☀️ Сонячний День (4800K, 0.0 EV)",
      sunset: "🌅 Теплий Захід Сонця (3800K, +0.15 EV)",
      night_magic: "🌙 Вечірня Магія та Гірлянди (6200K, -0.25 EV)"
    };
    const nextIdx = (modes.indexOf(cfg.exposureMode || 'day') + 1) % modes.length;
    cfg.exposureMode = modes[nextIdx];
    window.soundFX.playSparkle();
    this.renderSecretRoom();
    this.saveState();
    this.speak(`Режим експозиції кімнати: ${labels[cfg.exposureMode]}`);
  }

  toggleBuildToolbar(isOpen) {
    const bar = document.getElementById('secret-build-toolbar');
    if (!bar) return;
    window.soundFX.playClick();
    if (isOpen === undefined) {
      isOpen = (bar.style.display === 'none' || !bar.style.display);
    }
    if (isOpen) {
      const picker = document.getElementById('secret-item-picker-drawer');
      if (picker) picker.style.display = 'none';
    }
    bar.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      if (!this.activeBuildCategory) this.activeBuildCategory = 'all';
      this.renderBuildToolbar();
    }
  }

  setBuildCategory(catKey) {
    this.activeBuildCategory = catKey;
    window.soundFX.playClick();
    this.renderBuildToolbar();
  }

  setSecretRoomItem(category, itemId) {
    this.toggleSecretRoomItem(itemId);
  }

  renderBuildToolbar() {
    const catBar = document.getElementById('build-categories-bar');
    const optionsRow = document.getElementById('build-options-row');
    if (!catBar || !optionsRow) return;

    const cfg = this.ensureSecretRoomConfig();
    const catalog = this.getSecretRoomCatalog();
    const enabledSet = new Set(cfg.enabledItems || []);
    const categories = (typeof SECRET_ROOM_CATEGORIES !== 'undefined')
      ? SECRET_ROOM_CATEGORIES
      : { all: { id: 'all', title: '✨ Усі (30)' } };

    const activeCat = (this.activeBuildCategory && categories[this.activeBuildCategory]) ? this.activeBuildCategory : 'all';

    catBar.innerHTML = Object.keys(categories).map(catKey => {
      const cat = categories[catKey];
      const isActive = catKey === activeCat;
      const countInCat = catKey === 'all'
        ? catalog.length
        : catalog.filter(it => it.category === catKey).length;
      return `
        <button class="build-cat-tab ${isActive ? 'active' : ''}" onclick="window.game.setBuildCategory('${catKey}')">
          ${cat.title} <span style="opacity:0.75; font-size:0.75rem;">(${countInCat})</span>
        </button>
      `;
    }).join('');

    const filteredItems = activeCat === 'all'
      ? catalog
      : catalog.filter(it => it.category === activeCat);

    optionsRow.innerHTML = filteredItems.map(item => {
      const isSelected = enabledSet.has(item.id);
      const activeVar = this.getActiveSecretVariant(item.id);
      const hasVariants = (typeof SECRET_ROOM_ITEM_VARIANTS !== 'undefined' && !!SECRET_ROOM_ITEM_VARIANTS[item.id]);
      const varCount = hasVariants ? SECRET_ROOM_ITEM_VARIANTS[item.id].variants.length : 1;
      const imgFile = (activeVar && activeVar.file) ? activeVar.file : item.file;
      const itemTitle = (activeVar && activeVar.name) ? activeVar.name : item.name;
      const itemIcon = (activeVar && activeVar.icon) ? activeVar.icon : item.icon;
      const b = (activeVar && activeVar.bbox) ? activeVar.bbox : (item.bbox || {});

      return `
        <div class="build-option-card ${isSelected ? 'active' : ''}" onclick="${hasVariants ? `window.game.openSecretItemPicker('${item.id}')` : `window.game.toggleSecretRoomItem('${item.id}')`}">
          <img src="${imgFile}?v=20261005_2" alt="${itemTitle}" class="build-option-thumb">
          <div class="build-option-meta">
            <div class="build-option-title">${itemIcon} ${itemTitle}</div>
            <div class="build-option-desc">${item.desc}</div>
            ${hasVariants ? `<div style="font-size:0.72rem; color:#fde047; margin-top:3px; font-weight:900;">🎨 Доступно ${varCount} моделей (натисни, щоб обрати)</div>` : `<div style="font-size:0.68rem; color:#fbbf24; margin-top:3px; font-weight:700;">📐 X:${b.leftPct}% Y:${b.topPct}%</div>`}
          </div>
          ${hasVariants
            ? `<span class="build-option-badge" style="background:linear-gradient(135deg,#f59e0b,#ea580c);">🎨 Моделі (${varCount})</span>`
            : (isSelected ? '<span class="build-option-badge">У кімнаті ✔️</span>' : '<span class="build-option-badge" style="background:#475569;">Сховано ➕</span>')}
        </div>
      `;
    }).join('');
  }


  // =========================================================
  // ТАМАГОЧІ ТА AVATAR WORLD: ПОЗИ, ЕМОЦІЇ ТА ЖИТТЄВІ ПОТРЕБИ
  // =========================================================
  renderTamagotchiHUD() {
    if (!this.state.tamagotchi) {
      this.state.tamagotchi = { hunger: 85, energy: 35, happiness: 95, hygiene: 80, health: 100 };
    }
    const t = this.state.tamagotchi;
    const stats = ['hunger', 'energy', 'happiness', 'hygiene', 'health'];
    stats.forEach(s => {
      const rawVal = (s === 'energy')
        ? this.getEnergy()
        : Math.round(t[s] !== undefined ? t[s] : 100);
      const barPct = Math.max(0, Math.min(100, rawVal));
      const fillEl = document.getElementById(`fill-${s}`);
      const valEl = document.getElementById(`val-${s}`);
      const meterEl = document.getElementById(`meter-${s}`);
      if (fillEl) fillEl.style.width = `${barPct}%`;
      if (valEl) valEl.innerText = (s === 'energy') ? `${rawVal} ⚡` : `${rawVal}%`;
      if (meterEl) {
        if (rawVal < 20) meterEl.classList.add('meter-critical');
        else meterEl.classList.remove('meter-critical');
      }
    });
  }

  modifyTamagotchi(deltas) {
    if (!this.state.tamagotchi) {
      this.state.tamagotchi = { hunger: 85, energy: 35, happiness: 95, hygiene: 80, health: 100 };
    }
    const stats = ['hunger', 'energy', 'happiness', 'hygiene', 'health'];
    stats.forEach(s => {
      if (deltas && deltas[s] !== undefined) {
        if (s === 'energy') {
          const curEn = this.getEnergy();
          // Ігрові предмети підіймають енергію максимум до 60 ⚡ (щоб високу енергію для покупок заробляти реальними завданнями в житті!)
          if (deltas.energy > 0) {
            if (curEn < 60) {
              const nextEn = Math.min(60, curEn + Math.min(3, deltas.energy));
              this.state.energy = nextEn;
              this.state.tamagotchi.energy = nextEn;
            }
          } else {
            const nextEn = Math.max(0, curEn + deltas.energy);
            this.state.energy = nextEn;
            this.state.tamagotchi.energy = nextEn;
          }
        } else {
          const cur = this.state.tamagotchi[s] !== undefined ? this.state.tamagotchi[s] : 80;
          this.state.tamagotchi[s] = Math.max(0, Math.min(100, cur + deltas[s]));
        }
      }
    });
    this.renderTamagotchiHUD();
    this.saveState();
  }

  isPoseUnlocked(poseKey) {
    if (typeof DANIKA_POSES_CATALOG === 'undefined' || !DANIKA_POSES_CATALOG[poseKey]) return false;
    const pose = DANIKA_POSES_CATALOG[poseKey];
    if (pose.unlockedByDefault) return true;
    if (!Array.isArray(this.state.unlockedPoses)) {
      this.state.unlockedPoses = ["danika_candy", "danika_reading", "danika_ball", "danika_brush_teeth", "danika_sleeping"];
    }
    return this.state.unlockedPoses.includes(poseKey);
  }

  handlePoseCardClick(poseKey, fromWardrobe = false) {
    if (this.isPoseUnlocked(poseKey)) {
      this.setDanikaPose(poseKey, true, true);
      if (fromWardrobe) {
        this.renderWardrobeGrid();
      }
    } else {
      this.openUnlockPoseModal(poseKey);
    }
  }

  openUnlockPoseModal(poseKey) {
    if (typeof DANIKA_POSES_CATALOG === 'undefined' || !DANIKA_POSES_CATALOG[poseKey]) return;
    const pose = DANIKA_POSES_CATALOG[poseKey];
    window.soundFX.playClick();

    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const curCoins = this.state.coins || 0;
    const curXp = this.state.xp || 0;
    const curEnergy = this.getEnergy();
    const costCoins = pose.costCoins || 80;
    const costXp = pose.costXp || (costCoins * 5);
    const costEnergy = pose.costEnergy || (costCoins * 2);
    const canBuyCoins = curCoins >= costCoins;
    const canBuyXp = curXp >= costXp;
    const canBuyEnergy = curEnergy >= costEnergy;

    const statBadges = [];
    if (pose.vitality) {
      if (pose.vitality.hunger) statBadges.push(`<span class="action-stat-tag ${pose.vitality.hunger > 0 ? 'pos' : 'neg'}">${pose.vitality.hunger > 0 ? '+' : ''}${pose.vitality.hunger} 🍔 Ситість</span>`);
      if (pose.vitality.energy) statBadges.push(`<span class="action-stat-tag ${pose.vitality.energy > 0 ? 'pos' : 'neg'}">${pose.vitality.energy > 0 ? '+' : ''}${pose.vitality.energy} ⚡ Енергія</span>`);
      if (pose.vitality.happiness) statBadges.push(`<span class="action-stat-tag ${pose.vitality.happiness > 0 ? 'pos' : 'neg'}">${pose.vitality.happiness > 0 ? '+' : ''}${pose.vitality.happiness} 💖 Настрій</span>`);
      if (pose.vitality.hygiene) statBadges.push(`<span class="action-stat-tag ${pose.vitality.hygiene > 0 ? 'pos' : 'neg'}">${pose.vitality.hygiene > 0 ? '+' : ''}${pose.vitality.hygiene} 🫧 Чистота</span>`);
      if (pose.vitality.health) statBadges.push(`<span class="action-stat-tag ${pose.vitality.health > 0 ? 'pos' : 'neg'}">${pose.vitality.health > 0 ? '+' : ''}${pose.vitality.health} 💊 Здоров'я</span>`);
    }

    content.innerHTML = `
      <div style="text-align:center;">
        <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; color:#b45309; font-weight:900; font-size:0.78rem; padding:3px 12px; border-radius:99px; margin-bottom:6px;">
          ${pose.tierLabel || '🎭 Нова дія та емоція'}
        </div>
        <h2 style="font-family:'Fredoka', cursive; font-size:1.38rem; color:#451a03; margin-bottom:6px;">
          ${pose.icon} ${pose.name}
        </h2>
        <div style="background:linear-gradient(180deg,#fdf4ff,#fae8ff); border:2.5px solid #d8b4fe; border-radius:20px; padding:12px; width:150px; height:165px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(147,51,234,0.14);">
          <img src="${pose.file}?v=20261005_1" alt="${pose.name}" style="max-width:130px; max-height:145px; object-fit:contain;">
        </div>
        <div style="font-size:0.86rem; color:#581c87; font-weight:800; font-style:italic; background:#faf5ff; border:1.5px dashed #c084fc; border-radius:14px; padding:8px 12px; margin-bottom:10px;">
          «${pose.speech}»
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-bottom:12px;">
          ${statBadges.join('')}
        </div>

        <div style="background:#fffbeb; border:2px solid #fcd34d; border-radius:14px; padding:8px 12px; margin-bottom:12px; font-size:0.82rem; font-weight:900; color:#92400e;">
          Твій баланс: 🪙 ${curCoins} &nbsp;|&nbsp; ⭐ ${curXp} XP &nbsp;|&nbsp; ⚡ ${curEnergy} енергії
        </div>

        <div style="font-size:0.78rem; color:#475569; font-weight:800; margin-bottom:8px;">
          Обери, за що хочеш відкрити цю дію (виконуй реальні завдання вдома, щоб заробляти більше!):
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="${canBuyCoins ? 'background:linear-gradient(180deg,#10b981,#059669); box-shadow:0 4px 0 #047857;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyCoins ? 'disabled' : ''}
                  onclick="window.game.unlockDanikaPose('${pose.id}', 'coins')">
            🪙 За монетки: ${costCoins} 🪙 ${!canBuyCoins ? `(ще +${costCoins - curCoins} 🪙)` : '✨'}
          </button>

          <button class="btn-primary" style="${canBuyXp ? 'background:linear-gradient(180deg,#8b5cf6,#6d28d9); box-shadow:0 4px 0 #5b21b6;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyXp ? 'disabled' : ''}
                  onclick="window.game.unlockDanikaPose('${pose.id}', 'xp')">
            ⭐ За досвід: ${costXp} ⭐ XP ${!canBuyXp ? `(ще +${costXp - curXp} ⭐)` : '🌟'}
          </button>

          <button class="btn-primary" style="${canBuyEnergy ? 'background:linear-gradient(180deg,#0284c7,#0369a1); box-shadow:0 4px 0 #075985;' : 'background:#cbd5e1; box-shadow:none; cursor:not-allowed;'}"
                  ${!canBuyEnergy ? 'disabled' : ''}
                  onclick="window.game.unlockDanikaPose('${pose.id}', 'energy')">
            ⚡ За енергію: ${costEnergy} ⚡ ${!canBuyEnergy ? `(ще +${costEnergy - curEnergy} ⚡)` : '⚡'}
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    this.speak(`Нова дія: ${pose.name}! Можна відкрити за ${costCoins} монет, ${costXp} досвіду або ${costEnergy} енергії!`);
  }

  unlockDanikaPose(poseKey, currencyType = 'coins') {
    if (typeof DANIKA_POSES_CATALOG === 'undefined' || !DANIKA_POSES_CATALOG[poseKey]) return;
    const pose = DANIKA_POSES_CATALOG[poseKey];

    if (this.isPoseUnlocked(poseKey)) {
      this.closeModal('action-modal');
      this.setDanikaPose(poseKey, true, true);
      return;
    }

    const costCoins = pose.costCoins || 80;
    const costXp = pose.costXp || (costCoins * 5);
    const costEnergy = pose.costEnergy || (costCoins * 2);

    if (currencyType === 'coins') {
      if ((this.state.coins || 0) < costCoins) {
        this.openUnlockPoseModal(poseKey);
        this.speak(`Тобі не вистачає ще ${costCoins - (this.state.coins || 0)} монеток! Виконуй реальні завдання у Планшеті Пригод!`);
        return;
      }
      this.state.coins -= costCoins;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.coins = this.state.coins;
      }
    } else if (currencyType === 'xp') {
      if ((this.state.xp || 0) < costXp) {
        this.openUnlockPoseModal(poseKey);
        this.speak(`Тобі не вистачає ще ${costXp - (this.state.xp || 0)} балів досвіду! Виконуй корисні справи вдома!`);
        return;
      }
      this.state.xp -= costXp;
      if (this.state.familyProfiles && this.state.familyProfiles.danika) {
        this.state.familyProfiles.danika.xp = this.state.xp;
      }
    } else if (currencyType === 'energy') {
      const curEn = this.getEnergy();
      if (curEn < costEnergy) {
        this.openUnlockPoseModal(poseKey);
        this.speak(`Тобі не вистачає ще ${costEnergy - curEn} одиниць енергії! Виконуй реальні завдання у житті!`);
        return;
      }
      const nextEn = Math.max(0, curEn - costEnergy);
      this.state.energy = nextEn;
      if (this.state.tamagotchi) this.state.tamagotchi.energy = nextEn;
    }

    if (!Array.isArray(this.state.unlockedPoses)) {
      this.state.unlockedPoses = ["danika_candy", "danika_reading", "danika_ball", "danika_brush_teeth", "danika_sleeping"];
    }
    if (!this.state.unlockedPoses.includes(poseKey)) {
      this.state.unlockedPoses.push(poseKey);
    }

    this.closeModal('action-modal');
    if (window.soundFX) {
      if (typeof window.soundFX.playChestOpen === 'function') window.soundFX.playChestOpen();
      setTimeout(() => {
        if (typeof window.soundFX.playVictory === 'function') window.soundFX.playVictory();
      }, 220);
    }
    this.launchConfetti();
    this.setDanikaPose(poseKey, false, true);
    this.speak(`Ура! Ти відкрила нову дію та емоцію: ${pose.name}! ${pose.speech}`);

    this.renderActionDrawer(this._activeActionCategory || 'all');
    if (document.getElementById('wardrobe-modal') && document.getElementById('wardrobe-modal').classList.contains('active')) {
      this.renderWardrobeGrid();
    }
    this.render();
    this.saveState();
  }

  setDanikaPose(poseKey, playSpeech = true, forceApply = false) {
    const POSE_ALIASES = {
      'danika_sleep': 'danika_sleeping',
      'sleep': 'danika_sleeping',
      'sleeping': 'danika_sleeping',
      'danika_desk': 'danika_school_desk',
      'desk': 'danika_school_desk',
      'study': 'danika_school_desk',
      'danika_draw': 'danika_painting',
      'draw': 'danika_painting',
      'paint': 'danika_painting',
      'danika_bath': 'danika_bubble_bath',
      'bath': 'danika_bubble_bath',
      'danika_teeth': 'danika_brush_teeth',
      'teeth': 'danika_brush_teeth',
      'danika_cocoa': 'danika_hot_cocoa',
      'cocoa': 'danika_hot_cocoa',
      'danika_pizza': 'danika_pizza_chef'
    };
    poseKey = POSE_ALIASES[poseKey] || poseKey;

    if (typeof DANIKA_POSES_CATALOG === 'undefined' || !DANIKA_POSES_CATALOG[poseKey]) {
      console.warn('Unknown pose:', poseKey);
      return;
    }

    if (!forceApply && !this.isPoseUnlocked(poseKey)) {
      this.openUnlockPoseModal(poseKey);
      return;
    }

    const pose = DANIKA_POSES_CATALOG[poseKey];
    this.state.activeDanikaPose = poseKey;

    // Миттєве оновлення зображення на сцені
    const roomDanikaImg = document.getElementById('room-danika-img');
    if (roomDanikaImg && pose.file) {
      roomDanikaImg.src = `${pose.file}?v=20261005_1`;
    }

    // Оновлюємо показники Тамагочі
    if (pose.vitality) {
      this.modifyTamagotchi(pose.vitality);
    }

    // Звуковий ефект та анімація стрибка
    window.soundFX.playSparkle();
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.className = danikaEl.className.replace(/\bpose-\S+/g, '').trim();
      danikaEl.classList.add(`pose-${poseKey}`);
      if (poseKey !== 'danika_sleeping') {
        danikaEl.classList.add('jumping');
        setTimeout(() => danikaEl.classList.remove('jumping'), 600);
      }
    }

    // Спливаючі частинки (емодзі)
    this.spawnPoseParticles(pose.particles || ["✨", "💖"]);

    // Хмаринка думок
    const bubbleEl = document.getElementById('danika-speech-bubble');
    if (bubbleEl) {
      bubbleEl.innerText = pose.speech;
      bubbleEl.style.display = 'block';
      clearTimeout(this._speechBubbleTimer);
      this._speechBubbleTimer = setTimeout(() => {
        bubbleEl.style.display = 'none';
      }, 4500);
    }

    // Голосове озвучення українською (студійна нейронна модель uk-UA-PolinaNeural)
    if (playSpeech && pose.speech) {
      this.speak(pose.speech, 'uk', `pose_${poseKey}`);
    }

    this.render();
    this.saveState();

    // Оновлення активної картки у панелі
    this.updateActiveActionCard();
  }

  resetDanikaPose() {
    this.state.activeDanikaPose = null;
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl) {
      danikaEl.className = danikaEl.className.replace(/\bpose-\S+/g, '').trim();
      danikaEl.style.transform = '';
    }
    const bubbleEl = document.getElementById('danika-speech-bubble');
    if (bubbleEl) bubbleEl.style.display = 'none';
    window.soundFX.playClick();
    this.render();
    this.saveState();
    this.updateActiveActionCard();
    this.speak("Я повернулася у свій улюблений наряд!");
  }

  toggleActionDrawer(forceState) {
    const drawer = document.getElementById('danika-actions-drawer');
    if (!drawer) return;
    const isVisible = (drawer.style.display !== 'none');
    const newState = (forceState !== undefined) ? forceState : !isVisible;

    if (newState) {
      drawer.style.display = 'block';
      window.soundFX.playSparkle();
      this.renderActionDrawer(this._activeActionCategory || 'all');
    } else {
      drawer.style.display = 'none';
    }
  }

  filterActionDrawer(cat) {
    this._activeActionCategory = cat;
    window.soundFX.playClick();
    const tabs = document.querySelectorAll('.action-tab-btn');
    tabs.forEach(t => {
      const isTarget = t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${cat}'`);
      if (isTarget) t.classList.add('active');
      else t.classList.remove('active');
    });
    this.renderActionDrawer(cat);
  }

  renderActionDrawer(cat = 'all') {
    const grid = document.getElementById('actions-grid-scroll');
    if (!grid || typeof DANIKA_POSES_CATALOG === 'undefined') return;

    const allPoses = Object.values(DANIKA_POSES_CATALOG);
    const unlockedCount = allPoses.filter(p => this.isPoseUnlocked(p.id)).length;
    const badgeEl = document.getElementById('actions-unlocked-badge');
    if (badgeEl) badgeEl.innerText = `Відкрито: ${unlockedCount} / ${allPoses.length}`;

    const balEl = document.getElementById('actions-balance-pill');
    if (balEl) balEl.innerText = `🪙 ${this.state.coins || 0} | ⭐ ${this.state.xp || 0} XP | ⚡ ${this.getEnergy()}`;

    const posesList = allPoses.filter(p => {
      if (cat === 'all') return true;
      return p.category === cat;
    });

    grid.innerHTML = posesList.map(pose => {
      const unlocked = this.isPoseUnlocked(pose.id);
      const isActive = (this.state.activeDanikaPose === pose.id);
      const costCoins = pose.costCoins || 80;
      const costXp = pose.costXp || (costCoins * 5);
      const costEnergy = pose.costEnergy || (costCoins * 2);
      const statBadges = [];
      if (pose.vitality) {
        if (pose.vitality.hunger) statBadges.push(`<span class="action-stat-tag ${pose.vitality.hunger > 0 ? 'pos' : 'neg'}">${pose.vitality.hunger > 0 ? '+' : ''}${pose.vitality.hunger} 🍔</span>`);
        if (pose.vitality.energy) statBadges.push(`<span class="action-stat-tag ${pose.vitality.energy > 0 ? 'pos' : 'neg'}">${pose.vitality.energy > 0 ? '+' : ''}${pose.vitality.energy} ⚡</span>`);
        if (pose.vitality.happiness) statBadges.push(`<span class="action-stat-tag ${pose.vitality.happiness > 0 ? 'pos' : 'neg'}">${pose.vitality.happiness > 0 ? '+' : ''}${pose.vitality.happiness} 💖</span>`);
        if (pose.vitality.hygiene) statBadges.push(`<span class="action-stat-tag ${pose.vitality.hygiene > 0 ? 'pos' : 'neg'}">${pose.vitality.hygiene > 0 ? '+' : ''}${pose.vitality.hygiene} 🫧</span>`);
        if (pose.vitality.health) statBadges.push(`<span class="action-stat-tag ${pose.vitality.health > 0 ? 'pos' : 'neg'}">${pose.vitality.health > 0 ? '+' : ''}${pose.vitality.health} 💊</span>`);
      }

      return `
        <div class="action-pose-card ${isActive ? 'active' : ''} ${!unlocked ? 'locked-pose-card' : ''}" id="card-pose-${pose.id}" onclick="window.game.handlePoseCardClick('${pose.id}', false)" title="${pose.name}: ${pose.speech}">
          <div class="action-pose-preview" style="position:relative;">
            <img src="${pose.file}?v=20261005_1" alt="${pose.name}" loading="lazy" style="${!unlocked ? 'filter:saturate(0.82) brightness(0.96);' : ''}">
            ${!unlocked ? `<span class="pose-lock-corner-badge">🔒</span>` : `<span class="pose-unlocked-corner-badge">✔️</span>`}
          </div>
          <div class="action-pose-title">${pose.icon} ${pose.name}</div>
          <div class="action-pose-stats">
            ${statBadges.join('')}
          </div>
          ${unlocked ? `
            <div class="pose-card-status-bar unlocked">
              ${isActive ? '✨ Активна дія' : '▶️ Увімкнути'}
            </div>
          ` : `
            <div class="pose-card-unlock-row" style="gap:3px;">
              <button class="pose-quick-unlock-btn coins" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'coins')" title="Відкрити за ${costCoins} монет">
                🪙 ${costCoins}
              </button>
              <button class="pose-quick-unlock-btn xp" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'xp')" title="Відкрити за ${costXp} балів досвіду">
                ⭐ ${costXp}
              </button>
              <button class="pose-quick-unlock-btn" style="background:linear-gradient(180deg,#0284c7,#0369a1); color:#fff; border:1px solid #38bdf8;" onclick="event.stopPropagation(); window.game.unlockDanikaPose('${pose.id}', 'energy')" title="Відкрити за ${costEnergy} енергії">
                ⚡ ${costEnergy}
              </button>
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  updateActiveActionCard() {
    const curPose = this.state.activeDanikaPose;
    document.querySelectorAll('.action-pose-card').forEach(card => {
      const isCur = card.id === `card-pose-${curPose}`;
      if (isCur) card.classList.add('active');
      else card.classList.remove('active');
    });
  }

  spawnPoseParticles(emojis) {
    if (!emojis || !emojis.length) emojis = ['✨', '💖', '⭐'];
    const container = document.getElementById('character-danika') || document.body;
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'floating-pose-particle';
      p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      const dx = (Math.random() - 0.5) * 120;
      const dy = -(30 + Math.random() * 80);
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.left = `calc(50% + ${(Math.random() - 0.5) * 40}px)`;
      p.style.top = `calc(40% + ${(Math.random() - 0.5) * 60}px)`;
      container.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }

  // =========================================================
  // ОСНОВНИЙ РЕНДЕР
  // =========================================================
  render() {
    const pId = this.state.activeProfileId || 'danika';
    const profile = (this.state.familyProfiles && this.state.familyProfiles[pId])
      ? this.state.familyProfiles[pId]
      : (this.state.familyProfiles ? this.state.familyProfiles.danika : null);

    const coinsEl = document.getElementById('top-coins-count');
    if (coinsEl) coinsEl.innerText = profile ? profile.coins : this.state.coins;

    const topXpEl = document.getElementById('top-xp-count');
    if (topXpEl) topXpEl.innerText = profile ? (profile.xp || 0) : (this.state.xp || 0);

    const topEnergyEl = document.getElementById('top-energy-count');
    if (topEnergyEl) topEnergyEl.innerText = this.getEnergy();

    const crystalsEl = document.getElementById('top-crystals-count');
    const crystalCount = profile ? (profile.crystals || 0) : this.state.crystals;
    if (crystalsEl) crystalsEl.innerText = `${crystalCount} (€${crystalCount})`;

    const nameEl = document.getElementById('hud-profile-name');
    if (nameEl && profile) nameEl.innerText = profile.name;

    const levelObj = this.state.levels.find(l => l.level === (profile ? profile.level : this.state.level)) || this.state.levels[0];
    const levelTitleEl = document.getElementById('hud-level-text');
    if (levelTitleEl) {
      if (profile && profile.role) {
        levelTitleEl.innerText = `Рівень ${profile.level || 1} • ${profile.role}`;
      } else {
        levelTitleEl.innerText = `Рівень ${this.state.level} • ${levelObj.title}`;
      }
    }

    const curXp = profile ? profile.xp : this.state.xp;
    const maxXp = levelObj.maxXp || 1000;
    const xpPercent = Math.min(100, Math.round((curXp / maxXp) * 100));
    const xpFillEl = document.getElementById('hud-xp-fill');
    if (xpFillEl) xpFillEl.style.width = `${xpPercent}%`;

    const hudAvatar = document.getElementById('hud-danika-avatar');
    if (hudAvatar) {
      hudAvatar.src = profile ? profile.avatar : this.state.activeDanikaAvatar;
    }

    // Оновлення показників Тамагочі
    this.renderTamagotchiHUD();

    // Оновлення кнопок швидкого перемикання профілів
    ['danika', 'mom', 'dad'].forEach(k => {
      const btn = document.getElementById(`btn-profile-${k}`);
      if (btn) {
        if (k === pId) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    // Персонажі на сцені у повний зріст
    const roomDanikaImg = document.getElementById('room-danika-img');
    const nameTagEl = document.getElementById('character-name-tag');
    const accSlotEl = document.getElementById('danika-head-accessory');
    const accImgEl = document.getElementById('danika-head-accessory-img');

    if (pId === 'mom') {
      if (roomDanikaImg) roomDanikaImg.src = profile.sprite || 'assets/characters/character_mom_ksyusha.png';
      if (nameTagEl) nameTagEl.innerText = `👩‍🎨 ${profile.name}`;
      if (accImgEl) accImgEl.style.display = 'none';
    } else if (pId === 'dad') {
      if (roomDanikaImg) roomDanikaImg.src = profile.sprite || 'assets/characters/character_dad.png';
      if (nameTagEl) nameTagEl.innerText = `👨‍✈️ ${profile.name}`;
      if (accImgEl) accImgEl.style.display = 'none';
    } else {
      // Режим Даніки: підтримка 23 активних поз (Avatar World)
      if (this.state.activeDanikaPose && typeof DANIKA_POSES_CATALOG !== 'undefined' && DANIKA_POSES_CATALOG[this.state.activeDanikaPose]) {
        const currentPose = DANIKA_POSES_CATALOG[this.state.activeDanikaPose];
        if (roomDanikaImg) roomDanikaImg.src = `${currentPose.file}?v=20261005_1`;
        if (nameTagEl) nameTagEl.innerText = `${currentPose.icon} Даніка • ${currentPose.name}`;
        if (accImgEl) accImgEl.style.display = 'none'; // у позах аксесуари вже намальовані
        const danikaWrapEl = document.getElementById('character-danika');
        if (danikaWrapEl) {
          danikaWrapEl.className = danikaWrapEl.className.replace(/\bpose-\S+/g, '').trim();
          danikaWrapEl.classList.add(`pose-${this.state.activeDanikaPose}`);
        }
      } else {
        const danikaWrapEl = document.getElementById('character-danika');
        if (danikaWrapEl) {
          danikaWrapEl.className = danikaWrapEl.className.replace(/\bpose-\S+/g, '').trim();
        }
        if (roomDanikaImg) roomDanikaImg.src = this.state.activeDanikaAvatar;
        if (nameTagEl) nameTagEl.innerText = '✨ Danika';
        if (accImgEl && accSlotEl) {
          const activeAcc = this.state.wardrobe.danikaAccessories.find(a => a.id === this.state.activeDanikaAccessory);
          if (activeAcc && activeAcc.id !== 'acc_none') {
            const pos = this.getAccessoryPlacement(activeAcc.id, this.state.activeDanikaAvatar);
            accSlotEl.style.left = `${pos.left}%`;
            accSlotEl.style.top = `${pos.top}%`;
            accSlotEl.style.width = `${pos.width}%`;
            accImgEl.style.display = 'block';
            accImgEl.src = `${activeAcc.icon}?v=20260930_1`;
          } else {
            accImgEl.style.display = 'none';
          }
        }
      }
    }

    const roomBrunoImg = document.getElementById('room-bruno-img');
    if (roomBrunoImg) roomBrunoImg.src = this.state.activeBrunoAvatar;

    const brunoWrapEl = document.getElementById('character-bruno');
    const restoreBrunoBtn = document.getElementById('btn-restore-bruno');
    const brunoNameTagEl = document.getElementById('bruno-name-tag');
    const activeBrunoItem = this.getActiveBrunoItem();

    if (this.state.brunoHidden) {
      if (brunoWrapEl) brunoWrapEl.style.display = 'none';
      if (restoreBrunoBtn) restoreBrunoBtn.style.display = 'inline-flex';
    } else {
      if (brunoWrapEl) {
        brunoWrapEl.style.display = 'flex';
        if (this.isBrunoStationary()) {
          brunoWrapEl.classList.add('bruno-stationary');
          this.applyBrunoFloorPosition(false);
        } else {
          brunoWrapEl.classList.remove('bruno-stationary');
        }
      }
      if (restoreBrunoBtn) restoreBrunoBtn.style.display = 'none';
      if (brunoNameTagEl && activeBrunoItem) {
        brunoNameTagEl.innerText = activeBrunoItem.stationary
          ? `🛏️ ${activeBrunoItem.title.replace(/[^\w\sа-яА-ЯіїєґІЇЄҐ']/g, '').trim()}`
          : `🐾 ${activeBrunoItem.title.replace(/[^\w\sа-яА-ЯіїєґІЇЄҐ']/g, '').trim()}`;
      }
    }

    // Підказки над ліжком
    const activeDay = this.state.weekSchedule[this.selectedDayKey];
    const bedQuest = activeDay.quests.find(q => q.id.includes('bed'));
    const tagBed = document.getElementById('tag-bed');
    const tagBedText = document.getElementById('tag-bed-text');
    if (tagBed && tagBedText) {
      if (bedQuest && bedQuest.completed) {
        tagBed.classList.add('completed');
        tagBedText.innerText = "Ліжечко застелено ✔️";
      } else {
        tagBed.classList.remove('completed');
        tagBedText.innerText = "Застелити ліжечко";
      }
    }

    // Нижня навігація днів
    const navBar = document.getElementById('week-bottom-nav');
    if (navBar) {
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      navBar.innerHTML = days.map(dKey => {
        const dObj = this.state.weekSchedule[dKey];
        const isSelected = dKey === this.selectedDayKey;
        const allDone = dObj.quests.every(q => q.completed);
        return `
          <button class="bottom-day-pill ${isSelected ? 'active' : ''}" onclick="window.game.selectDay('${dKey}')">
            ${dObj.shortName} ${allDone ? '✔️' : ''}
          </button>
        `;
      }).join('');
    }
  }

  // =========================================================
  // ОСВІТНЯ АКАДЕМІЯ ПО ВСІХ ЛОКАЦІЯХ ГАНДІЇ:
  // 📜 12 Віршиків (+20 🪙), ❓ 50 Загадок (+10 🪙),
  // 🧮 30 Математичних задачок (+12 🪙), 🇬🇧 20 Наборів Англійської (+15 🪙)
  // Кожне завдання розміщене як жива іконка (room-hotspot) прямо в кімнаті і зникає після виконання!
  // =========================================================
  getLearningCatalog() {
    if (typeof window !== 'undefined' && window.LEARNING_DATA_CATALOG) {
      return window.LEARNING_DATA_CATALOG;
    }
    if (typeof LEARNING_DATA_CATALOG !== 'undefined') {
      return LEARNING_DATA_CATALOG;
    }
    return { poems: [], riddles: [], mathPuzzles: [], englishSets: [] };
  }

  isLearningCompleted(itemId) {
    if (!this.state.learningProgress) this.state.learningProgress = {};
    return !!this.state.learningProgress[itemId];
  }

  isRoomHotspotCompleted(hs) {
    if (!hs || !hs.id) return false;
    // Навігаційні хотспоти (шафа, мапа, книжкова полиця, холодильник) завжди залишаються доступними
    const alwaysVisibleIds = new Set(['wardrobe', 'window', 'bookshelf', 'kitchen-fridge']);
    if (alwaysVisibleIds.has(hs.id)) return false;

    if (this.state.claimedHotspotsToday && this.state.claimedHotspotsToday[hs.id]) {
      return true;
    }
    const activeDay = this.state.weekSchedule && this.state.weekSchedule[this.selectedDayKey];
    if (activeDay && Array.isArray(activeDay.quests)) {
      if (hs.id === 'bed' && activeDay.quests.some(q => q.id.includes('bed') && q.completed)) return true;
      if (hs.id === 'bath-vanity' && activeDay.quests.some(q => q.id.includes('teeth') && q.completed)) return true;
      if (hs.id === 'kitchen-sink' && activeDay.quests.some(q => q.id.includes('dishes') && q.completed)) return true;
    }
    return false;
  }

  getRoomLearningItems(locId, roomId, onlyUncompleted = false) {
    const cat = this.getLearningCatalog();
    if (!cat) return [];
    const results = [];
    ['poems', 'riddles', 'mathPuzzles', 'englishSets'].forEach(catKey => {
      (cat[catKey] || []).forEach(item => {
        const itemLoc = item.locId || item.locationId;
        if (itemLoc === locId && item.roomId === roomId) {
          if (!onlyUncompleted || !this.isLearningCompleted(item.id)) {
            results.push({ ...item, catKey });
          }
        }
      });
    });
    return results;
  }

  countUncompletedLearningInRoom(locId, roomId) {
    return this.getRoomLearningItems(locId, roomId, true).length;
  }

  countUncompletedLearningInLocation(locId) {
    const cat = this.getLearningCatalog();
    if (!cat) return 0;
    let count = 0;
    ['poems', 'riddles', 'mathPuzzles', 'englishSets'].forEach(catKey => {
      (cat[catKey] || []).forEach(item => {
        const itemLoc = item.locId || item.locationId;
        if (itemLoc === locId && !this.isLearningCompleted(item.id)) {
          count++;
        }
      });
    });
    return count;
  }

  getRoomLearningDockHtml(locId, roomId) {
    // Отримуємо всі НЕВИКОНАНІ завдання цієї кімнати і рендеримо кожне як окрему іконку прямо в інтер'єрі кімнати!
    // Як тільки завдання виконано — його іконка зникає з кімнати!
    const items = this.getRoomLearningItems(locId, roomId, true);
    if (items.length === 0) return '';

    return items.map((item, idx) => {
      const topPos = item.top || `${28 + (idx * 16) % 48}%`;
      const leftPos = item.left || `${22 + (idx * 22) % 64}%`;
      const label = item.shortLabel || `${item.title || 'Завдання'} (+${item.coins} 🪙)`;

      return `
        <div class="room-hotspot learning-room-hotspot learn-cat-${item.catKey}"
             id="hotspot-learn-${item.id}"
             style="top: ${topPos}; left: ${leftPos}; transform: translate(-50%, -50%);"
             onclick="event.stopPropagation(); window.game.openLearningHotspot('${item.catKey}', '${item.id}', '${roomId}', '${locId}', '${leftPos}')">
          <div class="hotspot-tag">
            <span class="hotspot-world-icon">
              <span class="icon-fallback learn-badge-${item.catKey}">${item.icon || '✨'}</span>
            </span>
            <span class="hotspot-tooltip-pill">${label}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  openLearningHotspot(catKey, itemId, roomId, locId, leftPctStr) {
    if (window.soundFX) window.soundFX.playClick();
    // Плавно підводимо Даніку до іконки завдання в кімнаті
    const danikaEl = document.getElementById('character-danika');
    if (danikaEl && leftPctStr) {
      const targetX = Math.max(14, Math.min(86, parseFloat(leftPctStr) || 50));
      const curX = parseFloat(danikaEl.dataset.xPct || danikaEl.style.left) || 42;
      const stageEl = danikaEl.querySelector('.danika-sprite-stage');
      if (stageEl) {
        stageEl.style.setProperty('--flip-x', targetX < curX ? -1 : 1);
      }
      danikaEl.classList.add('walking');
      danikaEl.style.left = `${targetX}%`;
      danikaEl.dataset.xPct = targetX;
      setTimeout(() => danikaEl.classList.remove('walking'), 420);
    }
    this.openLearningModal(catKey, itemId, roomId, locId);
  }

  openLearningModal(catKey = 'poems', itemId = null, roomFilter = null, locFilter = null) {
    if (window.soundFX) window.soundFX.playClick();
    const cat = this.getLearningCatalog();
    const allItems = cat[catKey] || [];
    if (allItems.length === 0) return;

    const filteredItems = (roomFilter && locFilter)
      ? allItems.filter(x => x.roomId === roomFilter && (x.locId === locFilter || x.locationId === locFilter))
      : allItems;
    const list = filteredItems.length > 0 ? filteredItems : allItems;

    let currentItem = itemId ? list.find(x => x.id === itemId) || allItems.find(x => x.id === itemId) : null;
    if (!currentItem) {
      currentItem = list.find(x => !this.isLearningCompleted(x.id)) || list[0];
    }

    const poemText = currentItem.text || (Array.isArray(currentItem.lines) ? currentItem.lines.join('\n') : '');
    const itemLocId = currentItem.locId || currentItem.locationId || 'loc_home';

    this._learningState = {
      catKey,
      itemId: currentItem.id,
      roomFilter,
      locFilter,
      poemMemoryMode: this._learningState?.itemId === currentItem.id ? !!this._learningState.poemMemoryMode : false,
      selectedOptionIdx: this._learningState?.itemId === currentItem.id ? this._learningState.selectedOptionIdx : null,
      revealedAnswer: this._learningState?.itemId === currentItem.id ? !!this._learningState.revealedAnswer : false
    };

    const modal = document.getElementById('action-modal');
    const content = document.getElementById('action-modal-content');
    if (!modal || !content) return;

    const curIdx = Math.max(0, list.findIndex(x => x.id === currentItem.id));
    const prevItem = list[(curIdx - 1 + list.length) % list.length];
    const nextItem = list[(curIdx + 1) % list.length];
    const isDone = this.isLearningCompleted(currentItem.id);

    const locObj = (this.state.worldLocations && this.state.worldLocations[itemLocId])
      || (window.DEFAULT_APP_DATA?.worldLocations?.[itemLocId]);
    const roomObj = locObj?.rooms?.find(r => r.id === currentItem.roomId);
    const locTitle = locObj ? locObj.title : 'Гандія';
    const roomTitle = roomObj ? (roomObj.shortName || roomObj.name) : '';

    // Якщо в цій кімнаті кілька завдань — показуємо зручне перемикання між ними
    const navHeaderHtml = list.length > 1 ? `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:6px 10px;">
        <button type="button" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.76rem; background:#64748b; box-shadow:none;"
                onclick="window.game.openLearningModal('${catKey}', '${prevItem.id}', ${roomFilter ? `'${roomFilter}'` : 'null'}, ${locFilter ? `'${locFilter}'` : 'null'})">
          ⬅️ Попереднє
        </button>
        <div style="text-align:center;">
          <div style="font-size:0.75rem; font-weight:900; color:#475569;">
            Завдання ${curIdx + 1} з ${list.length} ${roomFilter ? 'у цій кімнаті' : 'у каталозі'}
          </div>
          <div style="font-size:0.68rem; font-weight:800; color:#0284c7;">
            📍 ${locTitle}${roomTitle ? ` • ${roomTitle}` : ''}
          </div>
        </div>
        <button type="button" class="btn-primary" style="width:auto; padding:5px 10px; font-size:0.76rem; background:#64748b; box-shadow:none;"
                onclick="window.game.openLearningModal('${catKey}', '${nextItem.id}', ${roomFilter ? `'${roomFilter}'` : 'null'}, ${locFilter ? `'${locFilter}'` : 'null'})">
          Наступне ➡️
        </button>
      </div>
    ` : `
      <div style="text-align:center; margin-bottom:8px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:5px 10px; font-size:0.74rem; font-weight:800; color:#0284c7;">
        📍 Локація: ${locTitle}${roomTitle ? ` • ${roomTitle}` : ''}
      </div>
    `;

    let bodyHtml = '';

    // 1. ВІРШИКИ (+20 монет)
    if (catKey === 'poems') {
      const memMode = !!this._learningState.poemMemoryMode;
      const linesHtml = poemText.split('\n').map(line => {
        if (!memMode || !line.trim()) return line;
        const words = line.trim().split(/\s+/);
        return words.map((w, idx) => (idx % 2 === 1 && w.length > 2) ? '___' : w).join(' ');
      }).join('\n');

      const speechText = currentItem.voiceText || `Віршик ${currentItem.title}. ${poemText.replace(/\n+/g, ' ')}`;
      const escapedSpeech = speechText.replace(/'/g, "\\'");

      bodyHtml = `
        <div style="text-align:center; margin-bottom:10px;">
          <div style="font-size:42px; line-height:1;">${currentItem.icon || '📜'}</div>
          <h2 style="font-family:'Fredoka', cursive; font-size:1.28rem; color:#451a03; margin:4px 0;">
            Віршик «${currentItem.title}» ${isDone ? '✅' : ''}
          </h2>
          <div style="display:inline-block; background:#fef3c7; border:1.5px solid #f59e0b; border-radius:99px; padding:3px 12px; font-weight:900; color:#b45309; font-size:0.8rem;">
            Нагорода за вивчення: +20 🪙 монет | +60 ⭐ XP
          </div>
        </div>

        <div class="learning-poem-card" id="learning-poem-text-box" style="white-space:pre-line; font-family:'Fredoka', cursive; font-size:1.12rem; line-height:1.68; color:#451a03; text-align:center;">${linesHtml}</div>

        <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-bottom:12px;">
          <button type="button" class="btn-primary" style="width:auto; flex:1; background:linear-gradient(135deg,#0284c7,#0369a1); box-shadow:0 4px 0 #075985; padding:10px 12px; font-size:0.84rem;"
                  onclick="window.game.speak('${escapedSpeech}', 'uk', 'learn_${currentItem.id}')">
            🔊 Прослухати віршик
          </button>
          <button type="button" class="btn-primary" style="width:auto; flex:1; background:linear-gradient(135deg,#8b5cf6,#6d28d9); box-shadow:0 4px 0 #5b21b6; padding:10px 12px; font-size:0.84rem;"
                  onclick="window.game.togglePoemMemoryMode()">
            ${memMode ? '👀 Показати всі слова' : '🙈 Тренажер пам\'яті'}
          </button>
        </div>

        <button type="button" class="btn-primary" style="background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 0 #047857; padding:13px;"
                onclick="window.game.claimLearningReward('poems', '${currentItem.id}', true)">
          ${isDone ? '✅ Вже вивчено! Закрити вікно' : '🎓 Я вивчила віршик! Отримати +20 🪙!'}
        </button>
      `;
    }

    // 2. ЗАГАДКИ (+10 монет) або 3. МАТЕМАТИЧНІ ЗАДАЧКИ (+12 монет)
    else if (catKey === 'riddles' || catKey === 'mathPuzzles') {
      const isMath = catKey === 'mathPuzzles';
      const rewardCoins = isMath ? 12 : 10;
      const rewardXp = isMath ? 45 : 35;
      const selectedIdx = this._learningState.selectedOptionIdx;
      const revealed = this._learningState.revealedAnswer;

      const qAudioId = `learn_${currentItem.id}`;
      const qSpeech = currentItem.voiceText || (isMath
        ? `${currentItem.title}. ${currentItem.question}`
        : `Загадка. ${currentItem.question}`);

      const optionsHtml = (currentItem.options || []).map((opt, idx) => {
        const isCorrectOpt = String(opt).trim().toLowerCase() === String(currentItem.answer).trim().toLowerCase();
        let cls = 'learning-option-btn';
        if (selectedIdx !== null || revealed) {
          if (isCorrectOpt) cls += ' correct';
          else if (selectedIdx === idx) cls += ' wrong';
        }
        return `
          <button type="button" class="${cls}" onclick="window.game.selectLearningOption('${catKey}', '${currentItem.id}', ${idx})">
            ${opt}
          </button>
        `;
      }).join('');

      const solvedCorrectly = (selectedIdx !== null && String(currentItem.options[selectedIdx]).trim().toLowerCase() === String(currentItem.answer).trim().toLowerCase()) || revealed;

      bodyHtml = `
        <div style="text-align:center; margin-bottom:10px;">
          <div style="font-size:40px; line-height:1;">${currentItem.icon || (isMath ? '🧮' : '❓')}</div>
          <div style="font-size:0.75rem; font-weight:900; color:${isMath ? '#0284c7' : '#7c3aed'}; text-transform:uppercase; margin-top:2px;">
            ${currentItem.categoryTitle || currentItem.category || (isMath ? 'Математична пригода' : 'Цікава загадка')}
          </div>
          <h2 style="font-family:'Fredoka', cursive; font-size:1.2rem; color:#1e293b; margin:3px 0;">
            ${currentItem.title || `Загадка #${curIdx + 1}`} ${isDone ? '✅' : ''}
          </h2>
          <div style="display:inline-block; background:${isMath ? '#e0f2fe' : '#f3e8ff'}; border:1.5px solid ${isMath ? '#0284c7' : '#8b5cf6'}; border-radius:99px; padding:3px 12px; font-weight:900; color:${isMath ? '#0369a1' : '#6d28d9'}; font-size:0.8rem;">
            Нагорода за розв'язання: +${rewardCoins} 🪙 монет | +${rewardXp} ⭐ XP
          </div>
        </div>

        <div style="background:${isMath ? 'linear-gradient(180deg,#f0f9ff,#e0f2fe)' : 'linear-gradient(180deg,#faf5ff,#f3e8ff)'}; border:2.5px solid ${isMath ? '#38bdf8' : '#c084fc'}; border-radius:18px; padding:14px 16px; margin-bottom:12px; font-size:1.05rem; font-weight:800; color:#1e293b; line-height:1.55; text-align:center;">
          ${currentItem.question}
        </div>

        <div style="display:flex; gap:8px; justify-content:center; margin-bottom:10px;">
          <button type="button" class="btn-primary" style="width:auto; flex:1; background:#0284c7; box-shadow:0 3px 0 #0369a1; padding:8px 12px; font-size:0.82rem;"
                  onclick="window.game.speak('${qSpeech.replace(/'/g, "\\'")}', 'uk', '${qAudioId}')">
            🔊 Прослухати умову
          </button>
          <button type="button" class="btn-primary" style="width:auto; flex:1; background:#f59e0b; box-shadow:0 3px 0 #d97706; padding:8px 12px; font-size:0.82rem;"
                  onclick="window.game.revealLearningAnswer('${catKey}', '${currentItem.id}')">
            💡 Підказка / відповідь
          </button>
        </div>

        <div style="font-size:0.8rem; font-weight:900; color:#475569; margin-bottom:6px; text-align:center;">
          👇 Обери правильну відповідь:
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
          ${optionsHtml}
        </div>

        ${solvedCorrectly ? `
          <div style="background:#dcfce7; border:2px solid #16a34a; border-radius:14px; padding:10px 12px; margin-bottom:12px; text-align:center;">
            <div style="font-weight:900; color:#15803d; font-size:0.95rem;">
              🎉 Правильна відповідь: <b>${currentItem.answer}</b>!
            </div>
            ${currentItem.explanation ? `
              <div style="font-size:0.82rem; color:#166534; font-weight:700; margin-top:4px;">
                📐 Пояснення: ${currentItem.explanation}
              </div>
            ` : ''}
            <button type="button" class="btn-primary" style="margin-top:8px; background:#10b981; box-shadow:0 4px 0 #059669; padding:11px;"
                    onclick="window.game.claimLearningReward('${catKey}', '${currentItem.id}', true)">
              ${isDone ? `✅ Виконано! Закрити вікно` : `🎁 Забрати нагороду +${rewardCoins} 🪙 монет!`}
            </button>
          </div>
        ` : ''}
      `;
    }

    // 4. АНГЛІЙСЬКІ СЛОВА (+15 монет за набір з 5 слів)
    else if (catKey === 'englishSets') {
      const wordsHtml = (currentItem.words || []).map(w => `
        <div class="en-word-card" onclick="window.game.speakEnglishWord('${w.id}', '${w.en.replace(/'/g, "\\'")}', '${w.uk.replace(/'/g, "\\'")}')">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:28px; line-height:1;">${w.icon || '🌟'}</span>
            <div>
              <div style="font-weight:900; font-size:1rem; color:#1e293b;">${w.en} <span style="font-size:0.78rem; color:#7c3aed; font-weight:800;">[${w.pron}]</span></div>
              <div style="font-size:0.84rem; color:#047857; font-weight:800;">🇺🇦 ${w.uk}</div>
            </div>
          </div>
          <div style="background:#fce7f3; color:#be185d; border-radius:99px; padding:4px 9px; font-size:0.72rem; font-weight:900;">🔊 Слухати</div>
        </div>
      `).join('');

      bodyHtml = `
        <div style="text-align:center; margin-bottom:10px;">
          <div style="font-size:40px; line-height:1;">${currentItem.icon || '🇬🇧'}</div>
          <h2 style="font-family:'Fredoka', cursive; font-size:1.22rem; color:#831843; margin:4px 0;">
            🇬🇧 ${currentItem.title} ${isDone ? '✅' : ''}
          </h2>
          <div style="display:inline-block; background:#fce7f3; border:1.5px solid #ec4899; border-radius:99px; padding:3px 12px; font-weight:900; color:#be185d; font-size:0.8rem;">
            Нагорода за 5 слів: +15 🪙 монет | +50 ⭐ XP
          </div>
        </div>

        <div style="font-size:0.78rem; font-weight:800; color:#64748b; text-align:center; margin-bottom:6px;">
          Натискай на кожну картку, щоб почути вимову англійською та переклад!
        </div>

        <div class="en-word-grid">
          ${wordsHtml}
        </div>

        <div style="display:flex; gap:8px; margin-bottom:10px;">
          <button type="button" class="btn-primary" style="flex:1; background:linear-gradient(135deg,#0284c7,#0369a1); box-shadow:0 4px 0 #075985; padding:10px; font-size:0.84rem;"
                  onclick="window.game.speakEnglishSet('${currentItem.id}')">
            🔊 Прослухати всі 5 слів підряд
          </button>
        </div>

        <button type="button" class="btn-primary" style="background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 0 #047857; padding:13px;"
                onclick="window.game.claimLearningReward('englishSets', '${currentItem.id}', true)">
          ${isDone ? '✅ Вже вивчено! Закрити вікно' : '🎓 Я вивчила ці 5 слів! Отримати +15 🪙!'}
        </button>
      `;
    }

    content.innerHTML = navHeaderHtml + bodyHtml;
    modal.classList.add('active');
  }

  togglePoemMemoryMode() {
    if (!this._learningState) return;
    this._learningState.poemMemoryMode = !this._learningState.poemMemoryMode;
    this.openLearningModal(
      this._learningState.catKey,
      this._learningState.itemId,
      this._learningState.roomFilter,
      this._learningState.locFilter
    );
  }

  selectLearningOption(catKey, itemId, chosenIdx) {
    const cat = this.getLearningCatalog();
    const item = (cat[catKey] || []).find(x => x.id === itemId);
    if (!item) return;

    if (!this._learningState) this._learningState = { catKey, itemId };
    this._learningState.selectedOptionIdx = chosenIdx;

    const chosenOpt = item.options[chosenIdx];
    const isCorrect = String(chosenOpt).trim().toLowerCase() === String(item.answer).trim().toLowerCase();

    if (isCorrect) {
      if (window.soundFX) window.soundFX.playVictory();
      const ansSpeech = catKey === 'mathPuzzles'
        ? `Правильна відповідь: ${item.answer}. ${item.explanation || ''}`
        : `Відгадка: ${item.answer}!`;
      this.speak(ansSpeech, 'uk', `learn_${item.id}_ans`);
    } else {
      if (window.soundFX) window.soundFX.playClick();
      this.speak("Спробуй ще раз! Подумай уважніше!", 'uk');
    }

    this.openLearningModal(
      catKey,
      itemId,
      this._learningState.roomFilter,
      this._learningState.locFilter
    );
  }

  revealLearningAnswer(catKey, itemId) {
    const cat = this.getLearningCatalog();
    const item = (cat[catKey] || []).find(x => x.id === itemId);
    if (!item) return;

    if (!this._learningState) this._learningState = { catKey, itemId };
    this._learningState.revealedAnswer = true;

    const ansSpeech = catKey === 'mathPuzzles'
      ? `Правильна відповідь: ${item.answer}. ${item.explanation || ''}`
      : `Відгадка: ${item.answer}!`;
    this.speak(ansSpeech, 'uk', `learn_${item.id}_ans`);

    this.openLearningModal(
      catKey,
      itemId,
      this._learningState.roomFilter,
      this._learningState.locFilter
    );
  }

  speakEnglishWord(wordId, enText, ukText) {
    if (window.soundFX) window.soundFX.playClick();
    this.speak(`${enText}. Це означає ${ukText}.`, 'uk', `learn_${wordId}`);
  }

  speakEnglishSet(setId) {
    const cat = this.getLearningCatalog();
    const setItem = (cat.englishSets || []).find(x => x.id === setId);
    if (!setItem) return;
    if (window.soundFX) window.soundFX.playClick();
    const wordsSummary = (setItem.words || []).map(w => `${w.en} — ${w.uk}`).join(', ');
    this.speak(`Набір англійських слів: ${setItem.title}. ${wordsSummary}.`, 'uk', `learn_${setItem.id}`);
  }

  claimLearningReward(catKey, itemId, directInteractiveSolve = true) {
    const cat = this.getLearningCatalog();
    const item = (cat[catKey] || []).find(x => x.id === itemId);
    if (!item) return;

    if (!this.state.learningProgress) this.state.learningProgress = {};
    const alreadyDone = !!this.state.learningProgress[itemId];

    const defaultCoins = catKey === 'poems' ? 20 : (catKey === 'englishSets' ? 15 : (catKey === 'mathPuzzles' ? 12 : 10));
    const defaultXp = catKey === 'poems' ? 60 : (catKey === 'englishSets' ? 50 : (catKey === 'mathPuzzles' ? 45 : 35));
    const earnedCoins = item.coins || defaultCoins;
    const earnedXp = item.xp || defaultXp;
    const earnedEnergy = Math.max(25, earnedCoins * 3);

    if (!alreadyDone) {
      this.state.learningProgress[itemId] = true;
      this.state.coins = (this.state.coins || 0) + earnedCoins;
      this.addXP(earnedXp);
      this.addEnergy(earnedEnergy);
      this.saveState();

      if (window.soundFX) {
        window.soundFX.playVictory();
        setTimeout(() => window.soundFX.playCoin(), 200);
      }
      this.launchConfetti();
      this.speak(`Ура! Завдання виконано! Отримано плюс ${earnedCoins} монет та ${earnedXp} досвіду!`);
      this.showDanikaThought(`🎉 +${earnedCoins} 🪙 та +${earnedXp} ⭐!`);
    }

    // Закриваємо модалку і миттєво оновлюємо кімнату, щоб іконка виконаного завдання ЗНИКЛА!
    this.closeModal('action-modal');
    this.render();
    this.renderWorldRooms(this.state.activeLocationId || 'loc_home');
    if (document.getElementById('adventure-tablet')?.classList.contains('active')) {
      this.renderTabletContent();
    }
  }

  setAcademySubTab(subTab) {
    if (window.soundFX) window.soundFX.playClick();
    this.activeAcademySubTab = subTab;
    this.renderTabletContent();
  }

  jumpToLearningLocation(locId, roomId, catKey, itemId) {
    this.toggleTablet(false);
    const locObj = (this.state.worldLocations && this.state.worldLocations[locId])
      || (window.DEFAULT_APP_DATA?.worldLocations?.[locId]);
    let roomIdx = 0;
    if (locObj && Array.isArray(locObj.rooms)) {
      const idx = locObj.rooms.findIndex(r => r.id === roomId);
      if (idx >= 0) roomIdx = idx;
    }
    this.switchLocation(locId, roomIdx);
    setTimeout(() => {
      this.openLearningModal(catKey, itemId, roomId, locId);
    }, 350);
  }

  renderAcademyTabletHtml() {
    const cat = this.getLearningCatalog();
    const subTab = this.activeAcademySubTab || 'poems';

    const poems = cat.poems || [];
    const riddles = cat.riddles || [];
    const mathPuzzles = cat.mathPuzzles || [];
    const englishSets = cat.englishSets || [];

    const donePoems = poems.filter(x => this.isLearningCompleted(x.id)).length;
    const doneRiddles = riddles.filter(x => this.isLearningCompleted(x.id)).length;
    const doneMath = mathPuzzles.filter(x => this.isLearningCompleted(x.id)).length;
    const doneEn = englishSets.filter(x => this.isLearningCompleted(x.id)).length;

    const subTabsHtml = `
      <div style="background:linear-gradient(135deg,#ecfeff,#e0f2fe); border:2px solid #06b6d4; border-radius:16px; padding:12px; margin-bottom:12px;">
        <div style="font-weight:900; color:#0e7490; font-size:1.02rem; text-align:center;">
          🎓 ОСВІТНЯ АКАДЕМІЯ ГАНДІЇ (ПО ВСІХ ЛОКАЦІЯХ МІСТА!)
        </div>
        <div style="font-size:0.78rem; color:#155e75; font-weight:700; text-align:center; margin-top:3px;">
          Натискай на завдання, слухай студійну озвучку 🔊 або вирушай у потрібну кімнату міста!
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(135px, 1fr)); gap:8px; margin-top:10px;">
          <button type="button" class="btn-primary" style="padding:9px 8px; font-size:0.8rem; background:${subTab === 'poems' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#fff'}; color:${subTab === 'poems' ? '#fff' : '#78350f'}; border:2px solid #f59e0b; box-shadow:none;"
                  onclick="window.game.setAcademySubTab('poems')">
            📜 Віршики (${donePoems}/${poems.length})<br><span style="font-size:0.72rem;">+20 🪙 за вірш</span>
          </button>
          <button type="button" class="btn-primary" style="padding:9px 8px; font-size:0.8rem; background:${subTab === 'riddles' ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : '#fff'}; color:${subTab === 'riddles' ? '#fff' : '#5b21b6'}; border:2px solid #8b5cf6; box-shadow:none;"
                  onclick="window.game.setAcademySubTab('riddles')">
            ❓ Загадки (${doneRiddles}/${riddles.length})<br><span style="font-size:0.72rem;">+10 🪙 за загадку</span>
          </button>
          <button type="button" class="btn-primary" style="padding:9px 8px; font-size:0.8rem; background:${subTab === 'mathPuzzles' ? 'linear-gradient(135deg,#0284c7,#0369a1)' : '#fff'}; color:${subTab === 'mathPuzzles' ? '#fff' : '#075985'}; border:2px solid #0284c7; box-shadow:none;"
                  onclick="window.game.setAcademySubTab('mathPuzzles')">
            🧮 Математика (${doneMath}/${mathPuzzles.length})<br><span style="font-size:0.72rem;">+12 🪙 за задачку</span>
          </button>
          <button type="button" class="btn-primary" style="padding:9px 8px; font-size:0.8rem; background:${subTab === 'englishSets' ? 'linear-gradient(135deg,#ec4899,#db2777)' : '#fff'}; color:${subTab === 'englishSets' ? '#fff' : '#9d174d'}; border:2px solid #ec4899; box-shadow:none;"
                  onclick="window.game.setAcademySubTab('englishSets')">
            🇬🇧 Англійська (${doneEn}/${englishSets.length})<br><span style="font-size:0.72rem;">+15 🪙 за 5 слів</span>
          </button>
        </div>
      </div>
    `;

    const activeList = cat[subTab] || [];
    const cardsHtml = activeList.map((item, idx) => {
      const done = this.isLearningCompleted(item.id);
      const itemLocId = item.locId || item.locationId || 'loc_home';
      const locObj = (this.state.worldLocations && this.state.worldLocations[itemLocId])
        || (window.DEFAULT_APP_DATA?.worldLocations?.[itemLocId]);
      const roomObj = locObj?.rooms?.find(r => r.id === item.roomId);
      const locLabel = `${locObj ? locObj.title : 'Місто'}${roomObj ? ' • ' + (roomObj.shortName || roomObj.name) : ''}`;

      let previewText = '';
      if (subTab === 'poems') {
        const pLines = item.text ? item.text.split('\n') : (item.lines || []);
        previewText = pLines.slice(0, 2).join(' / ') + '...';
      } else if (subTab === 'riddles' || subTab === 'mathPuzzles') {
        previewText = item.question;
      } else if (subTab === 'englishSets') {
        previewText = (item.words || []).map(w => `${w.icon} <b>${w.en}</b> (${w.uk})`).join(' • ');
      }

      return `
        <div style="background:${done ? '#f0fdf4' : '#ffffff'}; border:2px solid ${done ? '#86efac' : '#e2e8f0'}; border-radius:14px; padding:11px 13px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="flex:1; min-width:210px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span style="font-size:1.25rem;">${item.icon || '🌟'}</span>
              <span style="font-weight:900; color:#1e293b; font-size:0.92rem;">
                ${item.title || `Завдання #${idx + 1}`}
              </span>
              <span style="background:#fef3c7; border:1px solid #f59e0b; color:#b45309; font-weight:900; font-size:0.72rem; padding:1px 8px; border-radius:99px;">
                +${item.coins} 🪙 | +${item.xp} ⭐
              </span>
              ${done ? `<span style="background:#dcfce7; color:#15803d; font-weight:900; font-size:0.7rem; padding:1px 8px; border-radius:99px;">✅ Виконано</span>` : ''}
            </div>
            <div style="font-size:0.8rem; color:#475569; font-weight:600; margin-top:4px; line-height:1.4;">
              ${previewText}
            </div>
            <div style="font-size:0.72rem; color:#0284c7; font-weight:800; margin-top:4px;">
              📍 Локація: ${locLabel}
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="btn-primary" style="width:auto; padding:7px 12px; font-size:0.78rem; background:#0284c7; box-shadow:0 3px 0 #0369a1;"
                    onclick="window.game.openLearningModal('${subTab}', '${item.id}')">
              📖 Відкрити
            </button>
            <button type="button" class="btn-primary" style="width:auto; padding:7px 10px; font-size:0.78rem; background:#6366f1; box-shadow:0 3px 0 #4f46e5;"
                    onclick="window.game.jumpToLearningLocation('${itemLocId}', '${item.roomId}', '${subTab}', '${item.id}')"
                    title="Перейти в цю кімнату і відкрити завдання">
              🗺️ У кімнату
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      ${subTabsHtml}
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${cardsHtml}
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new AdventureWorldGame();
  window.game.init();
  const params = new URLSearchParams(window.location.search);
  if (params.get('room') !== null) {
    const rIdx = parseInt(params.get('room'), 10);
    if (!isNaN(rIdx)) window.game.switchRoom(rIdx);
  }
  if (params.get('pose')) {
    window.game.setDanikaPose(params.get('pose'), false);
  }
  if (params.get('bruno')) {
    window.game.selectBrunoStyle(params.get('bruno'), true);
  }
  if (params.get('bruno_drawer') === '1') {
    window.game.toggleBrunoDrawer(true);
  }
  if (params.get('bruno_unlock')) {
    window.game.openUnlockBrunoModal(params.get('bruno_unlock'));
  }
  if (params.get('demo_pin_remote') === '1') {
    window.game.requestParentApproval({
      id: 'clean_toys',
      title: '🧸 Поприбирати іграшки у своїй кімнаті',
      coins: 20,
      xp: 25,
      icon: '🧸',
      isCatalogQuest: true,
      onApproved: () => {}
    });
  }
  if (params.get('demo_parent_phone') === '1') {
    window.game.parentTab = 'phone';
    window.game.openParentDashboard();
  }
  if (params.get('demo_economy') === '1') {
    window.game.openEconomyGuideModal();
  }
  if (params.get('demo_wardrobe') === '1') {
    window.game.openWardrobeModal();
  }
  if (params.get('props') === '1') {
    window.game.togglePropsDrawer(true);
  }
  if (params.get('tablet')) {
    window.game.toggleTablet(true);
    window.game.setTabletTab(params.get('tablet'));
  }
  const srMode = params.get('sr_mode');
  if (srMode) {
    const secretIdx = window.game.rooms.findIndex(r => r.id === 'room_secret');
    if (secretIdx !== -1) window.game.switchRoom(secretIdx);
    if (srMode === 'empty') {
      window.game.clearAllSecretItems();
    } else if (srMode === 'starter') {
      (window.game.state.secretRoom.items || []).forEach((it, idx) => {
        it.owned = idx < 12;
        it.placed = idx < 10;
      });
      window.game.renderSecretRoom();
    } else if (srMode === 'full' || srMode === 'evening' || srMode === 'buildlab') {
      (window.game.state.secretRoom.items || []).forEach(it => {
        it.owned = true;
        it.placed = true;
      });
      if (srMode === 'evening') {
        window.game.secretRoomExposureMode = 'evening';
        const roomStage = document.querySelector('.room-stage');
        if (roomStage) roomStage.style.filter = 'brightness(0.90) contrast(1.06) saturate(1.12) sepia(0.14)';
      }
      if (params.get('sr_cat')) {
        window.game.secretLabCategory = params.get('sr_cat');
      }
      window.game.renderSecretRoom();
      if (srMode === 'buildlab') {
        setTimeout(() => {
          const lab = document.getElementById('secret-build-lab');
          if (lab) lab.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 200);
      }
    }
  }
});

