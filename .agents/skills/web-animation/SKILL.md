---
name: web-animation
description: >-
  Specialized skill for implementing smooth web micro-animations, playful bounce physics, particle explosions,
  confetti cannons, floating feedback, and character walking cycles in HTML5 games and interactive web apps.
---

# Web Animation & Game VFX

This skill provides production-grade animation keyframes, physics easings, procedural particle systems, and confetti cannons optimized for 60fps web performance.

---

## 1. Physics & Easing Functions

Children's games require exaggerated, organic bounce and overshoot animations rather than linear transitions:

```css
:root {
  /* Playful Elastic Overshoot (Buttons, Popups, Modals) */
  --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Snappy Boing (Squish & Bounce) */
  --ease-boing: cubic-bezier(0.68, -0.55, 0.27, 1.55);
  /* Smooth Natural Glide (Character Walking) */
  --ease-glide: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. Essential Animation Recipes

### Character Walk Cycle (Gentle Bob & Step)
```css
@keyframes characterWalkBob {
  0% { transform: scaleX(var(--flip-x, 1)) translateY(0) rotate(0deg); }
  50% { transform: scaleX(var(--flip-x, 1)) translateY(-10px) rotate(2deg); }
  100% { transform: scaleX(var(--flip-x, 1)) translateY(0) rotate(-2deg); }
}

.character-wrap.walking {
  animation: characterWalkBob 0.34s ease-in-out infinite alternate !important;
}
```

### Triumphant Jump / Reward Bounce
```css
@keyframes victoryJump {
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(1.15, 0.85) translateY(0); } /* Anticipation squash */
  50% { transform: scale(0.9, 1.2) translateY(-40px); } /* Airborne stretch */
  75% { transform: scale(1.05, 0.95) translateY(0); } /* Impact recovery */
  100% { transform: scale(1) translateY(0); }
}

.jumping {
  animation: victoryJump 0.65s var(--ease-elastic) forwards;
}
```

### Floating Pulse (Sleeping Zzz, Hotspot Pins)
```css
@keyframes gentleFloat {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-8px) scale(1.04); }
}

.floating-idle {
  animation: gentleFloat 2.6s ease-in-out infinite alternate;
}
```

---

## 3. High-Performance Confetti Cannon

Canvas-based celebration cannon with physics (gravity, drag, wobble):

```javascript
function launchCelebrationConfetti(originXPct = 50, originYPct = 40) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f59e0b', '#ec4899', '#38bdf8', '#22c55e', '#a855f7', '#f43f5e', '#fbbf24'];
  const particles = [];
  const startX = (originXPct / 100) * canvas.width;
  const startY = (originYPct / 100) * canvas.height;

  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 8 + Math.random() * 14;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 4, // initial upward kick
      size: 7 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42; // Gravity
      p.vx *= 0.98; // Air drag
      p.rotation += p.vRot;
      p.opacity -= 0.012; // Gradual fade

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  update();
}
```

---

## 4. Floating Emoji Feedback Particles

```javascript
function spawnFloatingEmoji(x, y, emojis = ['✨', '⭐', '💖']) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const el = document.createElement('div');
  el.className = 'floating-feedback-particle';
  el.innerText = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1200);
}
```

```css
.floating-feedback-particle {
  position: fixed;
  font-size: 2rem;
  pointer-events: none;
  z-index: 1000;
  animation: floatFadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes floatFadeUp {
  0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
  20% { opacity: 1; transform: translate(-50%, -15px) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -70px) scale(0.9); }
}
```
