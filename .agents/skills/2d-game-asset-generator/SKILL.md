---
name: 2d-game-asset-generator
description: >-
  Specialized skill for generating and styling 2D game assets, characters, furniture, food, and interactive
  props using clean inline SVG and vector CSS. Use when creating game sprites, vector props, character accessories,
  furniture pieces, or room decorations without external image generation dependencies.
---

# 2D Game Asset Generator / SVG Stylist

This skill equips the agent to craft lightweight, infinitely scalable, high-quality 2D cartoon assets using pure SVG and CSS. It ensures all created items match the playful aesthetic of *Avatar World* with bold outlines, clean gradients, and cartoon charm.

---

## 1. Visual Style Specifications

- **Line Art**: Dark warm brown or navy outlines (`#3b1803` or `#0f172a`), width `2.5px` to `4px`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- **Lighting**: Simple 2-tone cell-shading (base fill + darker shadow shape + subtle white highlight curve).
- **Proportions**: Cute "chibi" proportions, rounded corners, soft curves without sharp aggressive angles.

---

## 2. Essential Asset Templates (Copy & Customize)

### Delicious Food: Pizza Slice (`prop_pizza`)
```xml
<svg viewBox="0 0 100 100" class="game-prop-svg" width="64" height="64">
  <defs>
    <linearGradient id="crustGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="cheeseGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <!-- Crust -->
  <path d="M 15 22 Q 50 10 85 22 Q 50 4 15 22 Z" fill="url(#crustGrad)" stroke="#78350f" stroke-width="3" />
  <!-- Cheese Body -->
  <path d="M 17 22 L 50 88 L 83 22 Q 50 28 17 22 Z" fill="url(#cheeseGrad)" stroke="#b45309" stroke-width="2.5" />
  <!-- Pepperoni Slices -->
  <circle cx="45" cy="38" r="9" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
  <circle cx="62" cy="50" r="8" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
  <circle cx="38" cy="60" r="7" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
  <!-- Basil Leaves -->
  <path d="M 48 48 Q 54 44 52 50 Q 46 54 48 48 Z" fill="#22c55e" />
  <!-- Melt Drips -->
  <path d="M 47 88 Q 50 94 53 88 Z" fill="#fbbf24" />
</svg>
```

### Cozy Bedding & Pillow (`furniture_pillow`)
```xml
<svg viewBox="0 0 120 70" width="80" height="46">
  <defs>
    <linearGradient id="pillowGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
  </defs>
  <!-- Fluffy Cloud Pillow -->
  <rect x="8" y="10" width="104" height="50" rx="22" fill="url(#pillowGrad)" stroke="#cbd5e1" stroke-width="3" />
  <!-- Ruffle Accents -->
  <path d="M 20 10 Q 25 5 30 10 Q 35 5 40 10 Q 45 5 50 10 Q 55 5 60 10 Q 65 5 70 10 Q 75 5 80 10 Q 85 5 90 10 Q 95 5 100 10" 
        fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
  <!-- Star Pattern -->
  <text x="52" y="42" font-size="18" fill="#f59e0b">⭐</text>
</svg>
```

### Wooden Study Desk (`furniture_study_desk`)
```xml
<svg viewBox="0 0 140 100" width="100" height="72">
  <defs>
    <linearGradient id="oakWood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <!-- Legs -->
  <rect x="18" y="40" width="10" height="55" rx="3" fill="#b45309" stroke="#78350f" stroke-width="2" />
  <rect x="112" y="40" width="10" height="55" rx="3" fill="#b45309" stroke="#78350f" stroke-width="2" />
  <!-- Desktop Surface -->
  <polygon points="10,40 130,40 122,20 18,20" fill="url(#oakWood)" stroke="#78350f" stroke-width="2.5" />
  <!-- Drawer Box -->
  <rect x="22" y="40" width="96" height="22" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />
  <rect x="58" y="48" width="24" height="6" rx="3" fill="#fef08a" stroke="#92400e" stroke-width="1.5" />
  <!-- Open Notebook on Desk -->
  <polygon points="45,26 85,26 82,36 42,36" fill="#ffffff" stroke="#64748b" stroke-width="1.5" />
  <line x1="63" y1="26" x2="62" y2="36" stroke="#0284c7" stroke-width="1" />
  <!-- Pencil -->
  <line x1="88" y1="28" x2="98" y2="24" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" />
</svg>
```

### Cute Teddy Bear Plushie (`prop_teddy`)
```xml
<svg viewBox="0 0 80 80" width="60" height="60">
  <!-- Ears -->
  <circle cx="22" cy="22" r="10" fill="#b45309" stroke="#78350f" stroke-width="2.5" />
  <circle cx="22" cy="22" r="5" fill="#fde68a" />
  <circle cx="58" cy="22" r="10" fill="#b45309" stroke="#78350f" stroke-width="2.5" />
  <circle cx="58" cy="22" r="5" fill="#fde68a" />
  <!-- Head -->
  <circle cx="40" cy="38" r="22" fill="#d97706" stroke="#78350f" stroke-width="3" />
  <!-- Snout -->
  <ellipse cx="40" cy="44" rx="10" ry="7" fill="#fef08a" stroke="#78350f" stroke-width="2" />
  <ellipse cx="40" cy="41" rx="3.5" ry="2.5" fill="#451a03" />
  <!-- Smiling Mouth -->
  <path d="M 37 45 Q 40 48 43 45" fill="none" stroke="#451a03" stroke-width="2" stroke-linecap="round" />
  <!-- Eyes -->
  <circle cx="31" cy="35" r="3" fill="#451a03" />
  <circle cx="30" cy="34" r="1" fill="#ffffff" />
  <circle cx="49" cy="35" r="3" fill="#451a03" />
  <circle cx="48" cy="34" r="1" fill="#ffffff" />
  <!-- Rosy Cheeks -->
  <ellipse cx="25" cy="41" rx="4" ry="2.5" fill="#fb7185" opacity="0.6" />
  <ellipse cx="55" cy="41" rx="4" ry="2.5" fill="#fb7185" opacity="0.6" />
  <!-- Bow Tie -->
  <polygon points="34,58 46,58 40,63" fill="#ec4899" stroke="#be185d" stroke-width="1.5" />
  <polygon points="34,68 46,68 40,63" fill="#ec4899" stroke="#be185d" stroke-width="1.5" />
  <circle cx="40" cy="63" r="3" fill="#f43f5e" />
</svg>
```

---

## 3. Dynamically Spawning SVG Props in JavaScript

```javascript
function spawnSVGProp(propKey, xPct, yPct) {
  const container = document.getElementById('room-props-stage') || document.body;
  const propEl = document.createElement('div');
  propEl.className = 'room-prop-item custom-svg-prop';
  propEl.style.left = `${xPct}%`;
  propEl.style.bottom = `${yPct}%`;
  propEl.innerHTML = SVG_ASSET_TEMPLATES[propKey];
  container.appendChild(propEl);
  makePropDraggable(propEl);
}
```
