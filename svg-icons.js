/**
 * SVG Game Icons Registry for Danika's Quest App
 * Diegetic 2D Game Assets (Frameless World Objects & Props)
 * Style: Casual mobile game art, thick smooth dark brown outlines (#3b1803),
 * clean cel-shaded coloring with soft glossy highlights, warm appetizing tones,
 * NO circular badges or frames.
 */
(function() {
  'use strict';

  const GAME_ICONS = {
    // =========================================================================
    // 1. PIZZARIA & PROPS (12 DRAGGABLE WORLD OBJECTS - PIZZA PROMPT STYLE)
    // =========================================================================
    "icon-prop-pizza": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-piz-crust" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde68a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="gi-piz-cheese" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="45%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
        <linearGradient id="gi-piz-pep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="60%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <!-- Пухка золотиста скоринка піци -->
      <path d="M18 24 C36 10 68 10 84 26 C88 30 84 38 78 36 C62 24 38 24 22 36 C16 38 14 28 18 24 Z" fill="url(#gi-piz-crust)" stroke="#3b1803" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Тісто під сиром (тонка лінія об'єму) -->
      <path d="M22 33 L49 88 L78 33 Z" fill="#d97706" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <!-- Розплавлений тягучий сир з краплями по боках -->
      <path d="M21 30 Q50 20 79 30 L72 46 C73 52 70 55 68 50 L62 62 C63 69 59 71 57 65 L50 86 L43 68 C40 73 36 70 38 63 L31 49 C28 55 24 52 26 44 Z" fill="url(#gi-piz-cheese)" stroke="#3b1803" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Глянцеві кружальця пепероні -->
      <circle cx="48" cy="38" r="9.5" fill="url(#gi-piz-pep)" stroke="#3b1803" stroke-width="3"/>
      <circle cx="45" cy="35" r="2" fill="#fecdd3"/>
      <circle cx="51" cy="40" r="1.4" fill="#fecdd3"/>
      <circle cx="36" cy="52" r="8" fill="url(#gi-piz-pep)" stroke="#3b1803" stroke-width="3"/>
      <circle cx="34" cy="50" r="1.6" fill="#fecdd3"/>
      <circle cx="58" cy="55" r="8.5" fill="url(#gi-piz-pep)" stroke="#3b1803" stroke-width="3"/>
      <circle cx="56" cy="52" r="1.8" fill="#fecdd3"/>
      <circle cx="49" cy="69" r="6.5" fill="url(#gi-piz-pep)" stroke="#3b1803" stroke-width="2.8"/>
      <!-- Свіжі листочки базиліку -->
      <path d="M48 47 C42 44 40 50 46 53 C52 55 54 49 48 47 Z" fill="#22c55e" stroke="#3b1803" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M54 34 C58 29 65 32 61 38 C57 42 51 38 54 34 Z" fill="#16a34a" stroke="#3b1803" stroke-width="2.4" stroke-linejoin="round"/>
      <!-- М'які глянцеві бліки на скоринці та сирі -->
      <path d="M28 21 Q48 14 68 21" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
      <ellipse cx="33" cy="36" rx="4" ry="2" fill="#ffffff" opacity="0.8" transform="rotate(-15 33 36)"/>
    </svg>`,

    "icon-prop-apple": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-app-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fb7185"/>
          <stop offset="50%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#9f1239"/>
        </linearGradient>
      </defs>
      <!-- Гілочка -->
      <path d="M48 28 Q50 14 56 12" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M48 28 Q50 14 56 12" stroke="#3b1803" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Соковитий зелений листочок -->
      <path d="M52 22 C60 12 76 14 74 24 C72 32 58 30 52 22 Z" fill="#22c55e" stroke="#3b1803" stroke-width="3.2" stroke-linejoin="round"/>
      <!-- Тіло яблучка -->
      <path d="M50 30 C34 22 16 34 18 56 C20 76 36 88 46 86 C49 85 51 85 54 86 C64 88 80 76 82 56 C84 34 66 22 50 30 Z" fill="url(#gi-app-red)" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <!-- Ямочка зверху -->
      <path d="M40 31 Q50 36 60 31" stroke="#3b1803" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <!-- Глянцевий блік -->
      <ellipse cx="32" cy="46" rx="6" ry="11" fill="#ffffff" opacity="0.75" transform="rotate(-20 32 46)"/>
      <circle cx="28" cy="62" r="3" fill="#ffffff" opacity="0.7"/>
    </svg>`,

    "icon-prop-croissant": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-cro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="45%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <!-- Крайні ріжки круасана -->
      <path d="M18 62 C10 56 10 40 22 36 C28 34 32 46 26 58 Z" fill="#d97706" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M82 62 C90 56 90 40 78 36 C72 34 68 46 74 58 Z" fill="#d97706" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <!-- Бокові сегменти -->
      <path d="M22 44 C18 30 32 22 44 26 C46 36 36 52 24 52 Z" fill="url(#gi-cro-gold)" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M78 44 C82 30 68 22 56 26 C54 36 64 52 76 52 Z" fill="url(#gi-cro-gold)" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <!-- Центральний пухкий сегмент -->
      <ellipse cx="50" cy="36" rx="20" ry="15" fill="url(#gi-cro-gold)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Бліки глазурі -->
      <path d="M38 29 Q50 24 62 29" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.85"/>
    </svg>`,

    "icon-prop-juice": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-jui-box" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="50%" stop-color="#fb923c"/>
          <stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
      </defs>
      <!-- Соломинка -->
      <path d="M56 30 L62 14 L76 18" stroke="#f43f5e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M56 30 L62 14 L76 18" stroke="#3b1803" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Верхня грань коробочки -->
      <polygon points="26,30 34,22 72,22 66,30" fill="#fed7aa" stroke="#3b1803" stroke-width="3.2" stroke-linejoin="round"/>
      <!-- Основний корпус соку -->
      <rect x="26" y="30" width="44" height="56" rx="6" fill="url(#gi-jui-box)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Кружальце апельсина на упаковці -->
      <circle cx="48" cy="58" r="13" fill="#fffbeb" stroke="#3b1803" stroke-width="2.5"/>
      <circle cx="48" cy="58" r="9.5" fill="#f97316"/>
      <line x1="48" y1="48" x2="48" y2="68" stroke="#fffbeb" stroke-width="2"/>
      <line x1="38" y1="58" x2="58" y2="58" stroke="#fffbeb" stroke-width="2"/>
      <!-- Блік -->
      <line x1="32" y1="36" x2="32" y2="76" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    </svg>`,

    "icon-prop-lollipop": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-lol-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbcfe8"/>
          <stop offset="50%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <!-- Паличка льодяника -->
      <rect x="46" y="54" width="8" height="36" rx="4" fill="#ffffff" stroke="#3b1803" stroke-width="3.2"/>
      <!-- Бантик на паличці -->
      <path d="M50 64 L36 58 L38 70 Z" fill="#38bdf8" stroke="#3b1803" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M50 64 L64 58 L62 70 Z" fill="#38bdf8" stroke="#3b1803" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Цукерка -->
      <circle cx="50" cy="36" r="24" fill="url(#gi-lol-pink)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Спіраль -->
      <path d="M50 36 C54 32 58 38 52 42 C44 46 36 38 42 28 C48 18 64 24 64 38 C64 50 46 56 34 46" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M50 36 C54 32 58 38 52 42 C44 46 36 38 42 28 C48 18 64 24 64 38" stroke="#3b1803" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Блік -->
      <ellipse cx="36" cy="24" rx="5" ry="2.5" fill="#ffffff" opacity="0.9" transform="rotate(-30 36 24)"/>
    </svg>`,

    "icon-prop-dogfood": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-can-tin" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="50%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#b91c1c"/>
        </linearGradient>
      </defs>
      <!-- Корпус консервної баночки -->
      <path d="M22 34 L22 72 C22 82 78 82 78 72 L78 34 Z" fill="url(#gi-can-tin)" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <!-- Золотиста етикетка -->
      <path d="M22 46 Q50 54 78 46 L78 64 Q50 72 22 64 Z" fill="#fef08a" stroke="#3b1803" stroke-width="2.8"/>
      <!-- Металева кришка зверху -->
      <ellipse cx="50" cy="34" rx="28" ry="10" fill="#e2e8f0" stroke="#3b1803" stroke-width="3.6"/>
      <ellipse cx="50" cy="34" rx="22" ry="7" fill="#cbd5e1" stroke="#3b1803" stroke-width="2"/>
      <!-- Кільце відкривачки -->
      <circle cx="44" cy="34" r="4" fill="none" stroke="#3b1803" stroke-width="2.5"/>
      <!-- Лапка на етикетці -->
      <circle cx="50" cy="58" r="4.5" fill="#b45309"/>
      <circle cx="44" cy="52" r="2.2" fill="#b45309"/>
      <circle cx="50" cy="50" r="2.2" fill="#b45309"/>
      <circle cx="56" cy="52" r="2.2" fill="#b45309"/>
    </svg>`,

    "icon-prop-bone": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-bone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-25 50 50)">
        <path d="M26 42 C18 34 10 42 16 50 C10 58 18 66 26 58 L74 58 C82 66 90 58 84 50 C90 42 82 34 74 42 Z" fill="url(#gi-bone-grad)" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
        <line x1="32" y1="47" x2="66" y2="47" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
      </g>
    </svg>`,

    "icon-prop-ball": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-ball-lime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ecfccb"/>
          <stop offset="45%" stop-color="#a3e635"/>
          <stop offset="100%" stop-color="#4d7c0f"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="32" fill="url(#gi-ball-lime)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Білі шви тенісного м'ячика -->
      <path d="M24 32 Q46 50 24 68" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M76 32 Q54 50 76 68" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Зовнішній контур поверх швів -->
      <circle cx="50" cy="50" r="32" fill="none" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Блік -->
      <ellipse cx="38" cy="30" rx="6" ry="3" fill="#ffffff" opacity="0.85" transform="rotate(-25 38 30)"/>
    </svg>`,

    "icon-prop-teddy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-ted-fur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="60%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </linearGradient>
      </defs>
      <!-- Вушка -->
      <circle cx="28" cy="24" r="11" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.4"/>
      <circle cx="28" cy="24" r="5.5" fill="#fde68a"/>
      <circle cx="72" cy="24" r="11" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.4"/>
      <circle cx="72" cy="24" r="5.5" fill="#fde68a"/>
      <!-- Лапки нижні та верхні -->
      <circle cx="24" cy="60" r="9" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.2"/>
      <circle cx="76" cy="60" r="9" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.2"/>
      <!-- Животик -->
      <ellipse cx="50" cy="66" rx="22" ry="20" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.6"/>
      <ellipse cx="50" cy="67" rx="13" ry="12" fill="#fef3c7"/>
      <!-- Голівка -->
      <circle cx="50" cy="38" r="21" fill="url(#gi-ted-fur)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Мордочка -->
      <ellipse cx="50" cy="43" rx="9" ry="7" fill="#fef3c7" stroke="#3b1803" stroke-width="2.4"/>
      <ellipse cx="50" cy="40" rx="3.5" ry="2.5" fill="#3b1803"/>
      <!-- Оченята -->
      <circle cx="42" cy="34" r="2.8" fill="#3b1803"/>
      <circle cx="58" cy="34" r="2.8" fill="#3b1803"/>
      <!-- Червоний бантик -->
      <polygon points="50,54 38,49 40,59" fill="#ef4444" stroke="#3b1803" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="50,54 62,49 60,59" fill="#ef4444" stroke="#3b1803" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="50" cy="54" r="3" fill="#facc15" stroke="#3b1803" stroke-width="2"/>
    </svg>`,

    "icon-prop-shampoo": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-sha-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbcfe8"/>
          <stop offset="50%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <!-- Дозатор -->
      <rect x="44" y="20" width="12" height="12" rx="2" fill="#fef08a" stroke="#3b1803" stroke-width="3"/>
      <path d="M40 16 L64 16 C68 16 68 22 62 22 L40 22 Z" fill="#ffffff" stroke="#3b1803" stroke-width="3" stroke-linejoin="round"/>
      <!-- Флакон шампуню -->
      <path d="M32 32 L68 32 C76 42 76 76 68 86 L32 86 C24 76 24 42 32 32 Z" fill="url(#gi-sha-pink)" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <!-- Етикетка-крапелька -->
      <circle cx="50" cy="58" r="13" fill="#ffffff" stroke="#3b1803" stroke-width="2.6"/>
      <path d="M50 50 C44 58 44 64 50 64 C56 64 56 58 50 50 Z" fill="#38bdf8"/>
      <!-- Блік -->
      <path d="M33 40 Q30 58 33 76" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
    </svg>`,

    "icon-prop-duck": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-duck-yel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="55%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <!-- Тіло качечки -->
      <path d="M22 58 C18 46 32 44 42 48 C56 52 68 46 78 40 C84 52 82 78 54 80 C26 82 24 68 22 58 Z" fill="url(#gi-duck-yel)" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <!-- Голівка -->
      <circle cx="38" cy="34" r="17" fill="url(#gi-duck-yel)" stroke="#3b1803" stroke-width="3.6"/>
      <!-- Крильце -->
      <path d="M42 56 C54 52 66 56 62 66 C58 72 44 70 42 56 Z" fill="#eab308" stroke="#3b1803" stroke-width="3" stroke-linejoin="round"/>
      <!-- Помаранчевий дзьобик -->
      <path d="M22 32 C12 32 12 40 24 41 C28 41 26 32 22 32 Z" fill="#f97316" stroke="#3b1803" stroke-width="3" stroke-linejoin="round"/>
      <!-- Очко -->
      <circle cx="34" cy="31" r="3.2" fill="#3b1803"/>
      <circle cx="33" cy="29.8" r="1.1" fill="#ffffff"/>
      <!-- Блік -->
      <ellipse cx="42" cy="23" rx="5" ry="2.2" fill="#ffffff" opacity="0.85" transform="rotate(-15 42 23)"/>
    </svg>`,

    // =========================================================================
    // 2. ROOM SWITCHER, HOTSPOTS & WORLD QUEST ICONS
    // =========================================================================
    "icon-room-bed": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-bed-wood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="50%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="gi-bed-quilt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bae6fd"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="gi-bed-star" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect x="14" y="24" width="72" height="42" rx="10" fill="url(#gi-bed-wood)" stroke="#3b1803" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="12" y="60" width="8" height="26" rx="4" fill="url(#gi-bed-wood)" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="80" y="60" width="8" height="26" rx="4" fill="url(#gi-bed-wood)" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="22" y="32" width="56" height="22" rx="10" fill="#ffffff" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M30 43 Q50 48 70 43" stroke="#cbd5e1" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M14 50 L86 50 C86 50 88 78 86 80 C84 82 16 82 14 80 C12 78 14 50 14 50 Z" fill="url(#gi-bed-quilt)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M14 50 Q50 56 86 50 L86 58 Q50 64 14 58 Z" fill="#e0f2fe" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <polygon points="50,60 53,67 60,68 55,73 57,80 50,76 43,80 45,73 40,68 47,67" fill="url(#gi-bed-star)" stroke="#3b1803" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="26" cy="30" rx="6" ry="2.5" fill="#ffffff" opacity="0.8" transform="rotate(-10 26 30)"/>
    </svg>`,

    "icon-room-bath": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-bath-tub" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="gi-bath-foam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#bae6fd"/>
        </linearGradient>
      </defs>
      <path d="M22 68 Q18 84 14 86" stroke="#d97706" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M78 68 Q82 84 86 86" stroke="#d97706" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M12 44 Q14 74 50 75 Q86 74 88 44 Z" fill="url(#gi-bath-tub)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="50" cy="44" rx="42" ry="9" fill="#f8fafc" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="30" cy="40" r="10" fill="url(#gi-bath-foam)" stroke="#3b1803" stroke-width="2.5"/>
      <circle cx="44" cy="38" r="11" fill="url(#gi-bath-foam)" stroke="#3b1803" stroke-width="2.5"/>
      <circle cx="58" cy="40" r="9" fill="url(#gi-bath-foam)" stroke="#3b1803" stroke-width="2.5"/>
      <circle cx="70" cy="42" r="8" fill="url(#gi-bath-foam)" stroke="#3b1803" stroke-width="2.5"/>
      <g transform="translate(42, 22) scale(0.65)">
        <path d="M10 24 Q18 16 30 20 Q36 22 36 28 Q36 34 26 34 Q10 34 10 24 Z" fill="#facc15" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="16" cy="14" r="9" fill="#facc15" stroke="#3b1803" stroke-width="3.5"/>
        <path d="M8 14 Q2 15 6 18 Q12 18 10 14 Z" fill="#f97316" stroke="#3b1803" stroke-width="2.5"/>
        <circle cx="15" cy="12" r="2" fill="#1e293b"/>
      </g>
    </svg>`,

    "icon-room-kitchen": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-pan-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="60%" stop-color="#0891b2"/>
          <stop offset="100%" stop-color="#155e75"/>
        </linearGradient>
        <linearGradient id="gi-pan-handle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="gi-egg-yolk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <path d="M72 68 L88 84 A6 6 0 0 1 80 92 L64 76 Z" fill="url(#gi-pan-handle)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="44" cy="52" r="32" fill="url(#gi-pan-body)" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="44" cy="52" r="26" fill="#164e63" stroke="#0891b2" stroke-width="2"/>
      <path d="M34 42 Q46 36 54 44 Q62 50 56 60 Q48 68 36 64 Q26 58 34 42 Z" fill="#ffffff" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <circle cx="45" cy="52" r="8" fill="url(#gi-egg-yolk)" stroke="#3b1803" stroke-width="2.2"/>
      <ellipse cx="43" cy="49" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.9"/>
    </svg>`,

    "icon-room-studio": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-palette-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="gi-brush-handle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0e7ff"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
      <path d="M20 35 C12 50 14 74 34 82 C54 90 78 84 84 66 C88 54 82 42 74 44 C66 46 62 38 66 30 C70 20 54 12 38 18 C26 22 22 28 20 35 Z" fill="url(#gi-palette-wood)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="70" cy="64" rx="6" ry="8" fill="#1e293b" opacity="0.25" stroke="#3b1803" stroke-width="2.5"/>
      <circle cx="32" cy="28" r="5.5" fill="#ef4444" stroke="#3b1803" stroke-width="2.2"/>
      <circle cx="48" cy="24" r="5.5" fill="#facc15" stroke="#3b1803" stroke-width="2.2"/>
      <circle cx="28" cy="48" r="5.5" fill="#3b82f6" stroke="#3b1803" stroke-width="2.2"/>
      <circle cx="34" cy="68" r="5.5" fill="#10b981" stroke="#3b1803" stroke-width="2.2"/>
      <circle cx="52" cy="76" r="5.5" fill="#ec4899" stroke="#3b1803" stroke-width="2.2"/>
      <g transform="rotate(-35 60 45)">
        <rect x="56" y="15" width="8" height="50" rx="3" fill="url(#gi-brush-handle)" stroke="#3b1803" stroke-width="2.8"/>
        <rect x="56" y="65" width="8" height="8" fill="#94a3b8" stroke="#3b1803" stroke-width="2.2"/>
        <path d="M56 73 C56 82 60 85 60 85 C60 85 64 82 64 73 Z" fill="#ec4899" stroke="#3b1803" stroke-width="2.2"/>
      </g>
    </svg>`,

    "icon-room-secret": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-key-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="30%" stop-color="#fef08a"/>
          <stop offset="70%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect x="36" y="44" width="46" height="12" rx="5" transform="rotate(45 50 50)" fill="url(#gi-key-gold)" stroke="#3b1803" stroke-width="3.5"/>
      <path d="M68 62 L74 68 L70 72 L64 66 Z" fill="url(#gi-key-gold)" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M76 70 L82 76 L78 80 L72 74 Z" fill="url(#gi-key-gold)" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <circle cx="34" cy="34" r="18" fill="url(#gi-key-gold)" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="34" cy="34" r="7.5" fill="#0f172a" opacity="0.8" stroke="#3b1803" stroke-width="2.2"/>
      <ellipse cx="28" cy="26" rx="4" ry="2" fill="#ffffff" opacity="0.9" transform="rotate(-30 28 26)"/>
    </svg>`,

    "icon-tablet": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-tab-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="gi-tab-screen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e0f2fe"/>
        </linearGradient>
      </defs>
      <rect x="16" y="14" width="68" height="74" rx="14" fill="url(#gi-tab-body)" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="22" y="20" width="56" height="60" rx="8" fill="url(#gi-tab-screen)" stroke="#3b1803" stroke-width="2.8"/>
      <rect x="28" y="26" width="12" height="12" rx="3.5" fill="#f59e0b"/>
      <rect x="44" y="26" width="12" height="12" rx="3.5" fill="#10b981"/>
      <rect x="60" y="26" width="12" height="12" rx="3.5" fill="#ec4899"/>
      <circle cx="32" cy="48" r="3.5" fill="#10b981"/>
      <rect x="40" y="46" width="30" height="4" rx="2" fill="#94a3b8"/>
      <circle cx="32" cy="58" r="3.5" fill="#38bdf8"/>
      <rect x="40" y="56" width="24" height="4" rx="2" fill="#94a3b8"/>
      <circle cx="32" cy="68" r="3.5" fill="#f59e0b"/>
      <rect x="40" y="66" width="28" height="4" rx="2" fill="#94a3b8"/>
      <circle cx="76" cy="18" r="10" fill="#ef4444" stroke="#3b1803" stroke-width="2.5"/>
      <polygon points="76,12 78,16 82,17 79,20 80,24 76,22 72,24 73,20 70,17 74,16" fill="#ffffff"/>
    </svg>`,

    "icon-wardrobe": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-dress-pink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fce7f3"/>
          <stop offset="40%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
        <linearGradient id="gi-bow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="9" fill="url(#gi-dress-pink)" stroke="#3b1803" stroke-width="3.2"/>
      <circle cx="70" cy="30" r="9" fill="url(#gi-dress-pink)" stroke="#3b1803" stroke-width="3.2"/>
      <path d="M34 26 Q50 34 66 26 L64 48 Q50 52 36 48 Z" fill="url(#gi-dress-pink)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M36 48 Q14 74 16 84 Q50 88 84 84 Q86 74 64 48 Z" fill="url(#gi-dress-pink)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="34" y="47" width="32" height="6" rx="2" fill="url(#gi-bow-gold)" stroke="#3b1803" stroke-width="2.2"/>
      <circle cx="50" cy="50" r="4" fill="url(#gi-bow-gold)" stroke="#3b1803" stroke-width="2.2"/>
      <ellipse cx="42" cy="36" rx="4" ry="2" fill="#ffffff" opacity="0.75" transform="rotate(-15 42 36)"/>
    </svg>`,

    "icon-map": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-map-paper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="60%" stop-color="#fef3c7"/>
          <stop offset="100%" stop-color="#fde68a"/>
        </linearGradient>
      </defs>
      <path d="M22 18 C14 26 22 84 18 86 C24 84 76 88 84 82 C78 78 84 20 82 16 C74 22 26 14 22 18 Z" fill="url(#gi-map-paper)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M24 38 Q36 32 44 42 T66 40" stroke="#38bdf8" stroke-width="3.2" stroke-linecap="round" fill="none"/>
      <path d="M30 68 Q40 54 50 62 T68 50" stroke="#b45309" stroke-width="2.8" stroke-dasharray="4,4" stroke-linecap="round" fill="none"/>
      <path d="M64 44 L76 56 M76 44 L64 56" stroke="#ef4444" stroke-width="4.2" stroke-linecap="round"/>
      <circle cx="34" cy="66" r="8" fill="#ffffff" stroke="#3b1803" stroke-width="2.4"/>
      <polygon points="34,60 36,66 34,72 32,66" fill="#ef4444"/>
    </svg>`,

    "icon-trophy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="35%" stop-color="#fef08a"/>
          <stop offset="70%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="gi-trophy-base" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M26 30 C12 30 12 50 28 54" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M26 30 C12 30 12 50 28 54" stroke="#3b1803" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M74 30 C88 30 88 50 72 54" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M74 30 C88 30 88 50 72 54" stroke="#3b1803" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M26 22 L74 22 L68 50 Q64 64 50 64 Q36 64 32 50 Z" fill="url(#gi-trophy-gold)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M44 64 L42 76 L58 76 L56 64 Z" fill="url(#gi-trophy-gold)" stroke="#3b1803" stroke-width="2.8"/>
      <rect x="30" y="76" width="40" height="14" rx="4" fill="url(#gi-trophy-base)" stroke="#3b1803" stroke-width="3.2"/>
      <polygon points="50,30 52,36 58,37 54,41 55,47 50,44 45,47 46,41 42,37 48,36" fill="#ffffff" stroke="#d97706" stroke-width="1.4"/>
    </svg>`,

    "icon-settings": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-gear-mint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a7f3d0"/>
          <stop offset="50%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
        <linearGradient id="gi-lock-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <g fill="url(#gi-gear-mint)" stroke="#3b1803" stroke-width="3.2" stroke-linejoin="round">
        <circle cx="50" cy="50" r="34"/>
        <rect x="44" y="10" width="12" height="12" rx="4"/>
        <rect x="44" y="78" width="12" height="12" rx="4"/>
        <rect x="10" y="44" width="12" height="12" rx="4"/>
        <rect x="78" y="44" width="12" height="12" rx="4"/>
      </g>
      <circle cx="50" cy="50" r="22" fill="#0f172a" stroke="#3b1803" stroke-width="2.5"/>
      <path d="M43 47 L43 40 A7 7 0 0 1 57 40 L57 47" stroke="url(#gi-lock-gold)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <rect x="38" y="46" width="24" height="18" rx="4" fill="url(#gi-lock-gold)" stroke="#3b1803" stroke-width="2.2"/>
    </svg>`,

    "icon-coin-gold": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-coin-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#92400e"/>
        </linearGradient>
        <linearGradient id="gi-coin-face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="50%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="38" ry="38" fill="#78350f"/>
      <circle cx="50" cy="50" r="38" fill="url(#gi-coin-rim)" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="50" cy="50" r="29" fill="url(#gi-coin-face)" stroke="#92400e" stroke-width="2"/>
      <polygon points="50,28 54,40 66,41 57,49 60,61 50,54 40,61 43,49 34,41 46,40" fill="#ffffff" stroke="#b45309" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M26 30 C34 22 46 18 56 18" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.85"/>
    </svg>`,

    "icon-gem-magic": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-gem-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="45%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="gi-gem-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#bae6fd"/>
        </linearGradient>
      </defs>
      <g stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round">
        <polygon points="14,36 50,86 30,36" fill="#0284c7"/>
        <polygon points="30,36 50,86 70,36" fill="url(#gi-gem-main)"/>
        <polygon points="70,36 50,86 86,36" fill="#0369a1"/>
        <polygon points="14,36 28,18 30,36" fill="#38bdf8"/>
        <polygon points="30,36 28,18 72,18 70,36" fill="url(#gi-gem-top)"/>
        <polygon points="70,36 72,18 86,36" fill="#38bdf8"/>
      </g>
      <polygon points="36,24 64,24 50,32" fill="#ffffff" opacity="0.7"/>
    </svg>`,

    "icon-backpack": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-bag-orange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdba74"/>
          <stop offset="50%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
        <linearGradient id="gi-bag-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <path d="M38 24 Q50 10 62 24" stroke="#c2410c" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M38 24 Q50 10 62 24" stroke="#3b1803" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <rect x="22" y="24" width="56" height="62" rx="18" fill="url(#gi-bag-orange)" stroke="#3b1803" stroke-width="3.5"/>
      <path d="M22 36 Q50 48 78 36 L78 28 Q50 22 22 28 Z" fill="#fb923c" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <rect x="28" y="52" width="44" height="28" rx="8" fill="url(#gi-bag-blue)" stroke="#3b1803" stroke-width="2.8"/>
      <line x1="32" y1="58" x2="68" y2="58" stroke="#ffffff" stroke-width="2.2" stroke-dasharray="3,2"/>
    </svg>`,

    "icon-hammer-wrench": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-tool-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
        <linearGradient id="gi-tool-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#67e8f9"/>
          <stop offset="100%" stop-color="#0891b2"/>
        </linearGradient>
      </defs>
      <g transform="rotate(45 50 50)">
        <rect x="46" y="24" width="8" height="56" rx="4" fill="#d97706" stroke="#3b1803" stroke-width="3.2"/>
        <rect x="36" y="20" width="28" height="16" rx="5" fill="url(#gi-tool-gold)" stroke="#3b1803" stroke-width="3.2"/>
      </g>
      <g transform="rotate(-45 50 50)">
        <rect x="46" y="22" width="8" height="56" rx="4" fill="url(#gi-tool-teal)" stroke="#3b1803" stroke-width="3.2"/>
        <path d="M42 24 C40 14 60 14 58 24 L54 26 C53 23 47 23 46 26 Z" fill="url(#gi-tool-teal)" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      </g>
    </svg>`,

    "icon-theater-masks": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-mask-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fce7f3"/>
          <stop offset="50%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
        <linearGradient id="gi-mask-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="60%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <g transform="translate(18, 8) rotate(15 50 50)">
        <path d="M26 22 C12 36 14 66 36 74 C58 82 72 62 70 38 C68 22 40 14 26 22 Z" fill="url(#gi-mask-gold)" stroke="#3b1803" stroke-width="3.2" stroke-linejoin="round"/>
        <ellipse cx="38" cy="38" rx="4" ry="6" fill="#1e293b"/>
        <ellipse cx="56" cy="40" rx="4" ry="6" fill="#1e293b"/>
        <path d="M38 54 Q48 64 58 54" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>
      <g transform="translate(-8, 6) rotate(-10 50 50)">
        <path d="M26 22 C12 36 14 66 36 74 C58 82 72 62 70 38 C68 22 40 14 26 22 Z" fill="url(#gi-mask-pink)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="36" cy="38" r="4" fill="#ffffff" stroke="#3b1803" stroke-width="1.8"/>
        <circle cx="56" cy="38" r="4" fill="#ffffff" stroke="#3b1803" stroke-width="1.8"/>
        <path d="M36 50 Q46 64 56 50 Z" fill="#991b1b" stroke="#3b1803" stroke-width="2.2"/>
      </g>
    </svg>`,

    "icon-book-spanish": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-book-cover" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <path d="M12 28 Q50 36 88 28 L88 78 Q50 86 12 78 Z" fill="url(#gi-book-cover)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M16 26 Q50 32 50 74 Q16 68 16 26 Z" fill="#ffffff" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M84 26 Q50 32 50 74 Q84 68 84 26 Z" fill="#f8fafc" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <line x1="22" y1="36" x2="42" y2="38" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="22" y1="44" x2="40" y2="46" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round"/>
      <g transform="translate(56, 36)">
        <rect x="0" y="0" width="22" height="5" fill="#ef4444"/>
        <rect x="0" y="5" width="22" height="8" fill="#facc15"/>
        <rect x="0" y="13" width="22" height="5" fill="#ef4444"/>
        <rect x="0" y="0" width="22" height="18" fill="none" stroke="#3b1803" stroke-width="1.8"/>
      </g>
      <path d="M50 32 L50 84 L46 80 L42 84 L42 32 Z" fill="#f59e0b" stroke="#3b1803" stroke-width="1.8"/>
    </svg>`,

    "icon-ant-farm": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-sand-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect x="16" y="80" width="68" height="10" rx="3" fill="#78350f" stroke="#3b1803" stroke-width="3.2"/>
      <rect x="20" y="14" width="60" height="8" rx="3" fill="#78350f" stroke="#3b1803" stroke-width="3.2"/>
      <rect x="20" y="20" width="60" height="62" rx="4" fill="#e0f2fe" fill-opacity="0.65" stroke="#3b1803" stroke-width="3.4"/>
      <path d="M22 45 Q36 40 48 48 T78 44 L78 80 L22 80 Z" fill="url(#gi-sand-grad)" stroke="#3b1803" stroke-width="2"/>
      <path d="M30 65 Q45 55 55 68 T70 60" stroke="#78350f" stroke-width="6" stroke-linecap="round" fill="none"/>
      <g transform="translate(42, 52) scale(0.85)">
        <circle cx="8" cy="10" r="4" fill="#3b1803"/>
        <circle cx="15" cy="11" r="3.5" fill="#3b1803"/>
        <circle cx="23" cy="11" r="5" fill="#3b1803"/>
      </g>
    </svg>`,

    "icon-skateboard": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-skate-deck" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#a855f7"/>
          <stop offset="50%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <circle cx="26" cy="68" r="8.5" fill="#facc15" stroke="#3b1803" stroke-width="3.2"/>
      <circle cx="26" cy="68" r="3" fill="#475569"/>
      <circle cx="74" cy="68" r="8.5" fill="#facc15" stroke="#3b1803" stroke-width="3.2"/>
      <circle cx="74" cy="68" r="3" fill="#475569"/>
      <rect x="22" y="56" width="8" height="8" rx="2" fill="#94a3b8" stroke="#3b1803" stroke-width="2.4"/>
      <rect x="70" y="56" width="8" height="8" rx="2" fill="#94a3b8" stroke="#3b1803" stroke-width="2.4"/>
      <path d="M12 44 Q16 56 26 56 L74 56 Q84 56 88 44 Q82 48 72 48 L28 48 Q18 48 12 44 Z" fill="url(#gi-skate-deck)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,

    "icon-soap-bubble": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-soap-bottle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bae6fd"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <rect x="28" y="34" width="44" height="52" rx="14" fill="url(#gi-soap-bottle)" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="44" y="24" width="12" height="10" fill="#f8fafc" stroke="#3b1803" stroke-width="2.8"/>
      <path d="M38 20 L56 20 L56 24 L38 24 Z" fill="#f8fafc" stroke="#3b1803" stroke-width="2.8"/>
      <rect x="36" y="48" width="28" height="24" rx="6" fill="#ffffff" stroke="#3b1803" stroke-width="2.4"/>
      <circle cx="50" cy="62" r="4.5" fill="#f43f5e"/>
      <circle cx="44" cy="55" r="2" fill="#f43f5e"/>
      <circle cx="50" cy="53" r="2" fill="#f43f5e"/>
      <circle cx="56" cy="55" r="2" fill="#f43f5e"/>
    </svg>`,

    "icon-toothbrush": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-brush-stem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
        <linearGradient id="gi-paste-mint" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#34d399"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-30 50 50)">
        <path d="M46 30 L46 84 A6 6 0 0 0 54 84 L54 30 Z" fill="url(#gi-brush-stem)" stroke="#3b1803" stroke-width="3.5"/>
        <rect x="42" y="16" width="16" height="14" rx="3" fill="#ffffff" stroke="#3b1803" stroke-width="2.8"/>
        <path d="M38 16 Q45 8 58 14 Q64 18 56 20 Z" fill="url(#gi-paste-mint)" stroke="#3b1803" stroke-width="2.4" stroke-linejoin="round"/>
      </g>
    </svg>`,

    "icon-dishes": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-plate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#e0f2fe"/>
          <stop offset="100%" stop-color="#bae6fd"/>
        </linearGradient>
      </defs>
      <ellipse cx="44" cy="46" rx="32" ry="24" fill="#cbd5e1" stroke="#3b1803" stroke-width="3.2"/>
      <ellipse cx="52" cy="54" rx="32" ry="24" fill="url(#gi-plate-grad)" stroke="#3b1803" stroke-width="3.5"/>
      <ellipse cx="52" cy="54" rx="22" ry="15" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2.2"/>
      <path d="M52 42 L54 48 L60 50 L54 52 L52 58 L50 52 L44 50 L50 48 Z" fill="#fef08a" stroke="#3b1803" stroke-width="1.6"/>
    </svg>`,

    "icon-fridge": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-fridge-mint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a7f3d0"/>
          <stop offset="50%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <rect x="22" y="12" width="56" height="78" rx="12" fill="url(#gi-fridge-mint)" stroke="#3b1803" stroke-width="3.5"/>
      <line x1="22" y1="40" x2="78" y2="40" stroke="#3b1803" stroke-width="3.2"/>
      <rect x="26" y="24" width="5" height="12" rx="2" fill="#ffffff" stroke="#3b1803" stroke-width="2"/>
      <rect x="26" y="46" width="5" height="20" rx="2" fill="#ffffff" stroke="#3b1803" stroke-width="2"/>
      <circle cx="60" cy="26" r="4.5" fill="#f43f5e" stroke="#3b1803" stroke-width="1.8"/>
      <rect x="42" y="52" width="14" height="16" rx="2" fill="#fef08a" stroke="#3b1803" stroke-width="1.8"/>
    </svg>`,

    "icon-breakfast": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-pancake-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="74" rx="42" ry="14" fill="#ffffff" stroke="#3b1803" stroke-width="3.5"/>
      <ellipse cx="50" cy="62" rx="34" ry="11" fill="url(#gi-pancake-grad)" stroke="#3b1803" stroke-width="2.8"/>
      <ellipse cx="50" cy="52" rx="32" ry="11" fill="url(#gi-pancake-grad)" stroke="#3b1803" stroke-width="2.8"/>
      <ellipse cx="50" cy="42" rx="30" ry="10" fill="url(#gi-pancake-grad)" stroke="#3b1803" stroke-width="3.2"/>
      <path d="M42 40 Q48 48 54 44 Q60 52 56 60 Q52 54 46 56 Z" fill="#e11d48" stroke="#3b1803" stroke-width="1.8"/>
      <polygon points="46,32 56,28 62,34 52,38" fill="#fef08a" stroke="#3b1803" stroke-width="2.2"/>
    </svg>`,

    "icon-dog-bowl": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-bowl-red" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="60%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <path d="M16 54 L24 78 Q50 86 76 78 L84 54 Z" fill="url(#gi-bowl-red)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="50" cy="54" rx="34" ry="12" fill="#ef4444" stroke="#3b1803" stroke-width="3.5"/>
      <ellipse cx="50" cy="53" rx="28" ry="9" fill="#78350f"/>
      <circle cx="44" cy="52" r="3" fill="#b45309"/>
      <circle cx="52" cy="54" r="3.5" fill="#b45309"/>
      <circle cx="58" cy="51" r="3" fill="#b45309"/>
    </svg>`,

    "icon-craft": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <polygon points="16,36 48,16 42,56" fill="#38bdf8" stroke="#3b1803" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="48,16 68,36 42,56" fill="#bae6fd" stroke="#3b1803" stroke-width="3" stroke-linejoin="round"/>
      <g transform="translate(10, 10)">
        <path d="M40 40 L68 68" stroke="#94a3b8" stroke-width="7" stroke-linecap="round"/>
        <path d="M68 40 L40 68" stroke="#94a3b8" stroke-width="7" stroke-linecap="round"/>
        <circle cx="36" cy="72" r="10" fill="none" stroke="#ec4899" stroke-width="6"/>
        <circle cx="72" cy="72" r="10" fill="none" stroke="#ec4899" stroke-width="6"/>
        <circle cx="54" cy="54" r="3" fill="#facc15" stroke="#3b1803" stroke-width="1.8"/>
      </g>
    </svg>`,

    "icon-sewing": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-sew-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e9d5ff"/>
          <stop offset="50%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#9333ea"/>
        </linearGradient>
      </defs>
      <rect x="14" y="68" width="72" height="14" rx="4" fill="url(#gi-sew-violet)" stroke="#3b1803" stroke-width="3.5"/>
      <path d="M68 68 L68 34 Q68 22 56 22 L28 22 Q24 22 24 28 L24 40 L34 40 L34 32 L56 32 L56 68 Z" fill="url(#gi-sew-violet)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <line x1="28" y1="40" x2="28" y2="62" stroke="#3b1803" stroke-width="2.8"/>
      <rect x="42" y="14" width="10" height="9" rx="2" fill="#f59e0b" stroke="#3b1803" stroke-width="2.4"/>
      <ellipse cx="68" cy="46" rx="5" ry="12" fill="#facc15" stroke="#3b1803" stroke-width="2.8"/>
    </svg>`,

    "icon-home": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <linearGradient id="gi-roof-orange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdba74"/>
          <stop offset="60%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#9a3412"/>
        </linearGradient>
        <linearGradient id="gi-house-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
      </defs>
      <rect x="24" y="44" width="52" height="42" rx="6" fill="url(#gi-house-wall)" stroke="#3b1803" stroke-width="3.5"/>
      <polygon points="50,14 14,46 86,46" fill="url(#gi-roof-orange)" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="42" y="56" width="16" height="30" rx="3" fill="#f59e0b" stroke="#3b1803" stroke-width="2.8"/>
      <circle cx="50" cy="34" r="6" fill="#38bdf8" stroke="#3b1803" stroke-width="2.4"/>
    </svg>`,

    // =========================================================================
    // 3. ADDITIONAL TASK & WORLD ICONS (BROOM, BROCCOLI, SPORT, BOOKS, ETC.)
    // =========================================================================
    "icon-broom": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <g transform="rotate(28 50 50)">
        <rect x="46" y="12" width="8" height="44" rx="4" fill="#d97706" stroke="#3b1803" stroke-width="3.4"/>
        <path d="M36 54 L64 54 L72 86 Q50 90 28 86 Z" fill="#facc15" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
        <rect x="35" y="52" width="30" height="7" rx="3" fill="#ef4444" stroke="#3b1803" stroke-width="2.8"/>
        <line x1="44" y1="68" x2="41" y2="85" stroke="#3b1803" stroke-width="2.4" stroke-linecap="round"/>
        <line x1="56" y1="68" x2="59" y2="85" stroke="#3b1803" stroke-width="2.4" stroke-linecap="round"/>
      </g>
    </svg>`,

    "icon-broccoli": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M40 52 L44 84 Q50 88 56 84 L60 52 Z" fill="#86efac" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="34" cy="44" r="16" fill="#22c55e" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="66" cy="44" r="16" fill="#16a34a" stroke="#3b1803" stroke-width="3.5"/>
      <circle cx="50" cy="32" r="19" fill="#4ade80" stroke="#3b1803" stroke-width="3.5"/>
      <ellipse cx="44" cy="24" rx="5" ry="2.5" fill="#ffffff" opacity="0.75" transform="rotate(-15 44 24)"/>
    </svg>`,

    "icon-sneaker-sport": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M18 42 L44 42 L62 56 L82 58 C88 60 88 74 80 76 L18 76 C14 76 14 54 18 42 Z" fill="#f97316" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="14" y="70" width="72" height="10" rx="5" fill="#ffffff" stroke="#3b1803" stroke-width="3.2"/>
      <polygon points="32,52 48,52 42,60 54,60 36,68" fill="#fef08a" stroke="#3b1803" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>`,

    "icon-math-ruler": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <polygon points="18,18 18,82 82,82" fill="#facc15" stroke="#3b1803" stroke-width="3.6" stroke-linejoin="round"/>
      <polygon points="30,44 30,70 56,70" fill="#fffbeb" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <line x1="18" y1="34" x2="25" y2="34" stroke="#3b1803" stroke-width="2.5"/>
      <line x1="18" y1="48" x2="25" y2="48" stroke="#3b1803" stroke-width="2.5"/>
      <line x1="18" y1="62" x2="25" y2="62" stroke="#3b1803" stroke-width="2.5"/>
    </svg>`,

    "icon-book-ua": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M12 28 Q50 36 88 28 L88 78 Q50 86 12 78 Z" fill="#eab308" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M16 26 Q50 32 50 74 Q16 68 16 26 Z" fill="#ffffff" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M84 26 Q50 32 50 74 Q84 68 84 26 Z" fill="#f8fafc" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <g transform="translate(56, 36)">
        <rect x="0" y="0" width="22" height="9" fill="#0284c7"/>
        <rect x="0" y="9" width="22" height="9" fill="#facc15"/>
        <rect x="0" y="0" width="22" height="18" fill="none" stroke="#3b1803" stroke-width="1.8"/>
      </g>
    </svg>`,

    "icon-book-en": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M12 28 Q50 36 88 28 L88 78 Q50 86 12 78 Z" fill="#ef4444" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M16 26 Q50 32 50 74 Q16 68 16 26 Z" fill="#ffffff" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M84 26 Q50 32 50 74 Q84 68 84 26 Z" fill="#f8fafc" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <g transform="translate(56, 36)">
        <rect x="0" y="0" width="22" height="18" fill="#1d4ed8" stroke="#3b1803" stroke-width="1.8"/>
        <line x1="11" y1="0" x2="11" y2="18" stroke="#ef4444" stroke-width="4"/>
        <line x1="0" y1="9" x2="22" y2="9" stroke="#ef4444" stroke-width="4"/>
      </g>
    </svg>`,

    "icon-sofa": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <rect x="20" y="28" width="60" height="36" rx="10" fill="#fb923c" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="12" y="44" width="16" height="28" rx="7" fill="#ea580c" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="72" y="44" width="16" height="28" rx="7" fill="#ea580c" stroke="#3b1803" stroke-width="3.5"/>
      <rect x="20" y="54" width="60" height="18" rx="6" fill="#fdba74" stroke="#3b1803" stroke-width="3.5"/>
    </svg>`,

    "icon-bat-craft": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M50 42 C34 26 14 30 12 52 C22 48 30 54 36 60 C42 54 46 58 50 64 C54 58 58 54 64 60 C70 54 78 48 88 52 C86 30 66 26 50 42 Z" fill="#9333ea" stroke="#3b1803" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="50" cy="46" r="12" fill="#a855f7" stroke="#3b1803" stroke-width="3.2"/>
      <polygon points="40,36 44,24 48,35" fill="#9333ea" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <polygon points="60,36 56,24 52,35" fill="#9333ea" stroke="#3b1803" stroke-width="2.8" stroke-linejoin="round"/>
      <circle cx="46" cy="45" r="2.5" fill="#fef08a"/>
      <circle cx="54" cy="45" r="2.5" fill="#fef08a"/>
    </svg>`,

    "icon-board-dice": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <rect x="22" y="22" width="56" height="56" rx="14" fill="#fffbeb" stroke="#3b1803" stroke-width="3.6"/>
      <circle cx="36" cy="36" r="5" fill="#ef4444"/>
      <circle cx="64" cy="36" r="5" fill="#3b82f6"/>
      <circle cx="50" cy="50" r="5.5" fill="#f59e0b"/>
      <circle cx="36" cy="64" r="5" fill="#10b981"/>
      <circle cx="64" cy="64" r="5" fill="#ec4899"/>
    </svg>`,

    "icon-butterfly": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <path d="M48 46 C28 18 12 28 18 48 C22 58 38 56 48 52 Z" fill="#facc15" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M52 46 C72 18 88 28 82 48 C78 58 62 56 52 52 Z" fill="#facc15" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M48 52 C30 56 22 74 34 80 C44 84 48 68 48 56 Z" fill="#34d399" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M52 52 C70 56 78 74 66 80 C56 84 52 68 52 56 Z" fill="#34d399" stroke="#3b1803" stroke-width="3.4" stroke-linejoin="round"/>
      <rect x="47" y="34" width="6" height="36" rx="3" fill="#3b1803"/>
    </svg>`,

    "icon-love-note": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <rect x="16" y="26" width="68" height="48" rx="8" fill="#fef3c7" stroke="#3b1803" stroke-width="3.5"/>
      <path d="M16 30 L50 56 L84 30" fill="#fde68a" stroke="#3b1803" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M50 48 C50 42 40 38 38 45 C36 52 50 62 50 62 C50 62 64 52 62 45 C60 38 50 42 50 48 Z" fill="#f43f5e" stroke="#3b1803" stroke-width="2.5"/>
    </svg>`,

    "icon-learn-riddle": `<img src="assets/icons/learn_riddle.png?v=20261007_3" alt="Загадка" class="game-png-icon" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;">`,
    "icon-learn-math": `<img src="assets/icons/learn_math.png?v=20261007_3" alt="Математика" class="game-png-icon" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;">`,
    "icon-learn-english": `<img src="assets/icons/learn_english.png?v=20261007_3" alt="Англійська" class="game-png-icon" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;">`,
    "icon-learn-poem": `<img src="assets/icons/learn_poem.png?v=20261007_3" alt="Віршик" class="game-png-icon" style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;">`,

    "icon-star-orb": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="game-svg-icon" aria-hidden="true">
      <defs>
        <radialGradient id="gi-orb-gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill="url(#gi-orb-gold)" stroke="#3b1803" stroke-width="3.6"/>
      <polygon points="50,24 57,40 74,42 61,54 65,71 50,62 35,71 39,54 26,42 43,40" fill="#ffffff" stroke="#3b1803" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="36" cy="30" rx="6" ry="3" fill="#ffffff" opacity="0.85" transform="rotate(-25 36 30)"/>
    </svg>`
  };

  // Emoji to Icon key mapping for seamless replacement across the whole game (NO raw emojis!)
  const EMOJI_MAP = {
    '🍕': 'icon-prop-pizza',
    '🍎': 'icon-prop-apple',
    '🍊': 'icon-prop-apple',
    '🍓': 'icon-prop-apple',
    '🍒': 'icon-prop-apple',
    '🍉': 'icon-prop-apple',
    '🍑': 'icon-prop-apple',
    '🍐': 'icon-prop-apple',
    '🍇': 'icon-prop-apple',
    '🍌': 'icon-prop-apple',
    '🥐': 'icon-prop-croissant',
    '🥖': 'icon-prop-croissant',
    '🥨': 'icon-prop-croissant',
    '🍪': 'icon-prop-croissant',
    '🎂': 'icon-prop-croissant',
    '🧁': 'icon-prop-croissant',
    '🍰': 'icon-prop-croissant',
    '🍩': 'icon-prop-croissant',
    '🧃': 'icon-prop-juice',
    '🍹': 'icon-prop-juice',
    '🥤': 'icon-prop-juice',
    '🥛': 'icon-prop-juice',
    '🍭': 'icon-prop-lollipop',
    '🍬': 'icon-prop-lollipop',
    '🍦': 'icon-prop-lollipop',
    '🍫': 'icon-prop-lollipop',
    '🍯': 'icon-prop-lollipop',
    '🥫': 'icon-prop-dogfood',
    '🥩': 'icon-prop-dogfood',
    '🐟': 'icon-prop-dogfood',
    '🧀': 'icon-prop-breakfast',
    '🦴': 'icon-prop-bone',
    '🐾': 'icon-prop-bone',
    '🐶': 'icon-prop-bone',
    '🐕': 'icon-prop-bone',
    '🎾': 'icon-prop-ball',
    '⚽': 'icon-prop-ball',
    '🏀': 'icon-prop-ball',
    '🏐': 'icon-prop-ball',
    '🪁': 'icon-prop-ball',
    '🎈': 'icon-prop-ball',
    '🧸': 'icon-prop-teddy',
    '🎠': 'icon-prop-teddy',
    '🎡': 'icon-prop-teddy',
    '🎢': 'icon-prop-teddy',
    '🎪': 'icon-prop-teddy',
    '🕹️': 'icon-board-dice',
    '🕹': 'icon-board-dice',
    '🎮': 'icon-board-dice',
    '🧩': 'icon-board-dice',
    '🧴': 'icon-prop-shampoo',
    '🦆': 'icon-prop-duck',
    '🦢': 'icon-prop-duck',
    '🐚': 'icon-prop-duck',
    '🦀': 'icon-prop-duck',
    '🐬': 'icon-prop-duck',
    '⛵': 'icon-prop-duck',
    '🏖️': 'icon-prop-duck',
    '🏖': 'icon-prop-duck',
    '🌊': 'icon-prop-duck',
    '⛲': 'icon-soap-bubble',
    '🏰': 'icon-trophy',
    '👑': 'icon-trophy',
    '🌟': 'icon-star-orb',
    '⭐': 'icon-star-orb',
    '✨': 'icon-star-orb',
    '🛏️': 'icon-room-bed',
    '🛏': 'icon-room-bed',
    '🛁': 'icon-room-bath',
    '🚿': 'icon-room-bath',
    '🍳': 'icon-room-kitchen',
    '🍲': 'icon-room-kitchen',
    '🎨': 'icon-room-studio',
    '🖼️': 'icon-room-studio',
    '🖼': 'icon-room-studio',
    '🎬': 'icon-theater-masks',
    '🍿': 'icon-prop-juice',
    '🗝️': 'icon-room-secret',
    '🗝': 'icon-room-secret',
    '🔮': 'icon-learn-riddle',
    '❓': 'icon-learn-riddle',
    '❔': 'icon-learn-riddle',
    '💡': 'icon-learn-riddle',
    '🧮': 'icon-learn-math',
    '🔢': 'icon-learn-math',
    '📜': 'icon-learn-poem',
    '📖': 'icon-learn-poem',
    '📚': 'icon-learn-poem',
    '📱': 'icon-tablet',
    '👗': 'icon-wardrobe',
    '🛍️': 'icon-wardrobe',
    '🛍': 'icon-wardrobe',
    '🛒': 'icon-wardrobe',
    '👕': 'icon-wardrobe',
    '🗺️': 'icon-map',
    '🗺': 'icon-map',
    '🏆': 'icon-trophy',
    '⚙️': 'icon-settings',
    '⚙': 'icon-settings',
    '🪙': 'icon-coin-gold',
    '💎': 'icon-gem-magic',
    '🎒': 'icon-backpack',
    '🏫': 'icon-backpack',
    '🛠️': 'icon-hammer-wrench',
    '🛠': 'icon-hammer-wrench',
    '🎭': 'icon-theater-masks',
    '🇪🇸': 'icon-book-spanish',
    '🇺🇦': 'icon-book-ua',
    '🇬🇧': 'icon-learn-english',
    '🐜': 'icon-ant-farm',
    '🔬': 'icon-ant-farm',
    '🧪': 'icon-ant-farm',
    '🌳': 'icon-broccoli',
    '🌲': 'icon-broccoli',
    '🌴': 'icon-broccoli',
    '🌿': 'icon-broccoli',
    '🌸': 'icon-butterfly',
    '🌻': 'icon-butterfly',
    '🌺': 'icon-butterfly',
    '🛹': 'icon-skateboard',
    '🚲': 'icon-skateboard',
    '🛴': 'icon-skateboard',
    '🛼': 'icon-skateboard',
    '🧼': 'icon-soap-bubble',
    '🫧': 'icon-soap-bubble',
    '🪥': 'icon-toothbrush',
    '🍽️': 'icon-dishes',
    '🍽': 'icon-dishes',
    '🥄': 'icon-dishes',
    '🍴': 'icon-dishes',
    '📋': 'icon-fridge',
    '🥞': 'icon-breakfast',
    '🥣': 'icon-dog-bowl',
    '✂️': 'icon-craft',
    '✂': 'icon-craft',
    '🧵': 'icon-sewing',
    '🏠': 'icon-home',
    '🏡': 'icon-home',
    '🧹': 'icon-broom',
    '🧺': 'icon-broom',
    '🥦': 'icon-broccoli',
    '🥕': 'icon-broccoli',
    '🥒': 'icon-broccoli',
    '🍅': 'icon-prop-apple',
    '🌽': 'icon-broccoli',
    '🥔': 'icon-prop-croissant',
    '🦵': 'icon-sneaker-sport',
    '🤸‍♀️': 'icon-sneaker-sport',
    '🤸': 'icon-sneaker-sport',
    '🧗‍♀️': 'icon-sneaker-sport',
    '🧗': 'icon-sneaker-sport',
    '🏃‍♀️': 'icon-sneaker-sport',
    '🏃': 'icon-sneaker-sport',
    '📐': 'icon-math-ruler',
    '📏': 'icon-math-ruler',
    '🛋️': 'icon-sofa',
    '🛋': 'icon-sofa',
    '🪑': 'icon-sofa',
    '🦇': 'icon-bat-craft',
    '🎲': 'icon-board-dice',
    '🦋': 'icon-butterfly',
    '🐝': 'icon-butterfly',
    '🦊': 'icon-prop-teddy',
    '🐿️': 'icon-prop-teddy',
    '🐿': 'icon-prop-teddy',
    '🦔': 'icon-prop-teddy',
    '🦉': 'icon-prop-teddy',
    '👵': 'icon-love-note',
    '💌': 'icon-love-note',
    '✍️': 'icon-love-note',
    '📝': 'icon-love-note'
  };

  let svgInstanceCounter = 0;

  function uniquifySvgIds(svgStr) {
    const uid = ++svgInstanceCounter;
    return svgStr
      .replace(/\bid="([^"]+)"/g, `id="$1_${uid}"`)
      .replace(/url\(#([^)]+)\)/g, `url(#$1_${uid})`);
  }

  function getGameIcon(keyOrEmoji, customClass = '', customStyle = '') {
    if (!keyOrEmoji) return '';
    const cleanKey = String(keyOrEmoji).trim();
    const iconKey = EMOJI_MAP[cleanKey] || cleanKey;
    let svg = GAME_ICONS[iconKey] || GAME_ICONS['icon-star-orb'];

    if (svg.startsWith('<img ')) {
      if (customClass || customStyle) {
        return svg.replace('<img ', `<img class="${customClass ? customClass + ' ' : ''}game-png-icon" ${customStyle ? `style="${customStyle}" ` : ''}`);
      }
      return svg;
    }

    svg = uniquifySvgIds(svg);

    if (customClass || customStyle) {
      svg = svg.replace('<svg ', `<svg class="${customClass ? customClass + ' ' : ''}game-svg-icon" ${customStyle ? `style="${customStyle}" ` : ''}`);
    }
    return svg;
  }

  function applyGameIcons(root = document) {
    if (!root || !root.querySelectorAll) return;
    const elements = root.querySelectorAll('[data-game-icon]');
    elements.forEach(el => {
      const iconKey = el.getAttribute('data-game-icon');
      if (iconKey) {
        el.innerHTML = getGameIcon(iconKey);
      }
    });

    const searchRoot = root === document ? document.body : root;
    if (searchRoot && GAME_ICONS['icon-coin-gold']) {
      const walker = document.createTreeWalker(searchRoot, NodeFilter.SHOW_TEXT, null, false);
      const nodes = [];
      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue && walker.currentNode.nodeValue.includes('🪙')) {
          nodes.push(walker.currentNode);
        }
      }
      nodes.forEach(node => {
        if (node.parentNode && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
          const span = document.createElement('span');
          span.innerHTML = node.nodeValue.replace(/🪙/g, () => `<span class="inline-svg-coin" style="display:inline-flex;width:16px;height:16px;vertical-align:-3px;margin:0 1px;">${getGameIcon('icon-coin-gold')}</span>`);
          node.parentNode.replaceChild(span, node);
        }
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applyGameIcons());
    } else {
      applyGameIcons();
    }
  }

  window.GAME_ICONS = GAME_ICONS;
  window.GAME_EMOJI_MAP = EMOJI_MAP;
  window.getGameIcon = getGameIcon;
  window.applyGameIcons = applyGameIcons;

})();
