---
name: ui-ux-frontend-styling
description: >-
  Specialized skill for designing child-friendly UI/UX and frontend styling. Use when creating or refining
  visual interfaces, whimsical buttons, pastel color palettes, friendly typography, readable badges,
  soft shadows, rounded corners, and tactile responsive design for kids' applications and games.
---

# UI/UX & Frontend Styling (Kids & Family Game Design)

This skill provides guidelines, color tokens, typography recipes, and component patterns for building delightful, intuitive, and tactile interfaces for children (ages 5–10) and family games, modeled after premier titles like *Avatar World*, *Toca Life*, and *Duolingo Kids*.

---

## 1. Core Principles of Child-Centric UI/UX

1. **Visual Over Textual**:
   - Children recognize shapes, emojis, and vibrant icons 3x faster than reading dense text.
   - Use clear circular icon pills with hover/touch tooltips instead of verbose menu buttons.
   - Every important action must have a recognizable visual metaphor (e.g. 📱 for tablet/tasks, 👗 for wardrobe, 🛏️ for bed, 🍳 for kitchen).

2. **Chunky & Tactile (Thumb-Friendly Hit Targets)**:
   - Hit targets must be at least **44x44px** (ideally **52px to 64px** for little hands).
   - Generous padding and spacing between interactive hotspots to prevent accidental taps.
   - Instant visual and acoustic feedback for every tap (scale-down press effect + chime/click sound).

3. **High Contrast with Soft Pastels**:
   - Backgrounds: Warm, cozy pastels that don't strain young eyes.
   - Interactive elements: Vibrant juicy tones (gold, coral, sky blue, emerald) with bold dark outlines (`#451a03` or `#0f172a`).

---

## 2. Color System & Design Tokens

```css
:root {
  /* Pastel Canvas & Cards */
  --bg-pastel-pink: #fdf2f8;
  --bg-pastel-blue: #f0f9ff;
  --bg-pastel-yellow: #fefce8;
  --bg-pastel-purple: #faf5ff;
  --bg-pastel-green: #f0fdf4;

  /* Vibrant Game Accents */
  --gold-primary: #f59e0b;
  --gold-glow: #fbbf24;
  --gold-dark: #b45309;
  
  --sky-primary: #0284c7;
  --sky-light: #38bdf8;
  --sky-dark: #0369a1;

  --pink-bubble: #ec4899;
  --pink-rose: #f43f5e;
  --pink-dark: #be185d;

  --mint-primary: #10b981;
  --mint-light: #34d399;
  --mint-dark: #047857;

  --magic-purple: #8b5cf6;
  --magic-lavender: #c084fc;

  /* Readability & Outlines */
  --text-primary: #1e293b;
  --text-warm: #451a03;
  --text-muted: #64748b;
  --outline-dark: rgba(15, 23, 42, 0.85);

  /* Geometry */
  --radius-full: 9999px;
  --radius-xl: 24px;
  --radius-lg: 18px;
  --radius-md: 12px;

  /* 3D Tactile Shadows */
  --shadow-btn-gold: 0 4px 0 #b45309, 0 8px 16px rgba(245, 158, 11, 0.35);
  --shadow-btn-sky: 0 4px 0 #0369a1, 0 8px 16px rgba(2, 132, 199, 0.35);
  --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-floating: 0 12px 30px rgba(0, 0, 0, 0.3);
}
```

---

## 3. Typography & Badges

Recommended Google Fonts:
- **Fredoka**: Whimsical, rounded, friendly font for headers and button labels.
- **Nunito**: Highly legible rounded sans-serif for body text, numbers, and stats.

```css
body {
  font-family: 'Nunito', 'Fredoka', cursive, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .btn-label {
  font-family: 'Fredoka', cursive;
  font-weight: 700;
  letter-spacing: 0.3px;
}
```

---

## 4. Reusable Component Recipes

### 3D Chunky "Candy" Buttons
Buttons that look like real physical toy buttons with satisfying press action:

```css
.btn-candy-primary {
  font-family: 'Fredoka', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
  border: 2px solid #fef08a;
  border-radius: var(--radius-full);
  padding: 12px 24px;
  box-shadow: var(--shadow-btn-gold);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.12s ease;
  user-select: none;
}

.btn-candy-primary:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 0 #b45309, 0 12px 20px rgba(245, 158, 11, 0.45);
}

.btn-candy-primary:active {
  transform: translateY(4px) scale(0.98);
  box-shadow: 0 1px 0 #b45309, 0 4px 8px rgba(245, 158, 11, 0.2);
}
```

### Glowing Hotspot Pin (Replacing Dark Clunky Badges)
Compact circular pin that pulses gently and reveals clean tooltips on hover:

```css
.hotspot-pin {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  border: 2px solid #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45), 0 0 10px rgba(245, 158, 11, 0.4);
  cursor: pointer;
  position: relative;
  animation: pinPulse 2.4s infinite ease-in-out alternate;
}

.hotspot-pin:hover {
  transform: scale(1.15);
  border-color: #fef08a;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.7);
}

.hotspot-pin .pin-tooltip {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  border: 1.5px solid #f59e0b;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fef08a;
  white-space: nowrap;
  pointer-events: none;
  z-index: 60;
}

.hotspot-pin:hover .pin-tooltip {
  display: block;
  animation: tooltipFadeIn 0.15s ease-out forwards;
}
```
