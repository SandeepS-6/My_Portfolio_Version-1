/*
  Skill badge motion helpers (plain JS, no React).

  - Idle drift + edge wrapping (always on)
  - Mouse repulsion (same math as before)
  - Soft visual breathing

  Hero.jsx only runs the rAF loop and writes to the DOM.
*/

export const REPULSION_RADIUS = 130;
export const MAX_PUSH = 55;
export const RETURN_SPEED_FACTOR = 0.55;
export const REST_THRESHOLD = 0.05;

const REPULSION_RADIUS_SQ = REPULSION_RADIUS * REPULSION_RADIUS;
const WRAP_MARGIN = 90;

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function unitRandom(seed, salt) {
  const x = Math.sin(seed * 0.0001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pick(seed, salt, min, max) {
  return min + unitRandom(seed, salt) * (max - min);
}

export function createMotionState(skill) {
  const seed = hashString(skill.id || skill.title || "skill");
  const escapeSpeed = skill.animationSpeed ?? 0.12;

  // Direction in degrees from CMS, or a unique random heading
  const directionDeg =
    skill.direction ?? pick(seed, 1, 0, 360);
  const angle = (directionDeg * Math.PI) / 180;

  // Pixels per frame at 60fps — slow drift
  const speed = skill.speed ?? pick(seed, 2, 0.25, 0.75);

  return {
    // Live world position (pixels) — set on first sized frame
    posX: 0,
    posY: 0,
    ready: false,
    spawnXPercent: skill.initialPosition?.x ?? pick(seed, 3, 5, 95),
    spawnYPercent: skill.initialPosition?.y ?? pick(seed, 4, 5, 95),

    // Drift
    angle,
    targetAngle: angle + pick(seed, 5, -0.8, 0.8),
    speed,
    driftStrength: skill.driftStrength ?? pick(seed, 6, 0.35, 1),
    turnTimer: pick(seed, 7, 90, 220),
    rotation: pick(seed, 8, -12, 12),
    rotationSpeed: skill.rotationSpeed ?? pick(seed, 9, -0.15, 0.15),

    // Repulsion offsets (unchanged system)
    offsetX: 0,
    offsetY: 0,
    escapeSpeed,
    returnSpeed: escapeSpeed * RETURN_SPEED_FACTOR,
    strength: skill.repulsionStrength ?? 1,
    isResting: true,

    // Visual base (CMS)
    baseScale: skill.scale ?? pick(seed, 10, 0.78, 1.05),
    baseBlur: skill.blur ?? pick(seed, 11, 0.9, 2.4),
    baseOpacity: skill.opacity ?? pick(seed, 12, 0.45, 0.78),
    phase: pick(seed, 13, 0, Math.PI * 2),
    pulseSpeed: pick(seed, 14, 0.35, 0.9),

    // Current rendered visuals
    scale: skill.scale ?? 1,
    blur: skill.blur ?? 1.2,
    opacity: skill.opacity ?? 0.7,

    // Soft circle used for badge ↔ badge collision
    radius: (skill.collisionRadius ?? 48) * (skill.scale ?? 1),
  };
}

export function createMotionMap(skills) {
  const motionMap = {};
  skills.forEach((skill) => {
    motionMap[skill.id] = createMotionState(skill);
  });
  return motionMap;
}

function ensurePosition(motion, width, height) {
  if (!motion.ready && width > 0 && height > 0) {
    motion.posX = (motion.spawnXPercent / 100) * width;
    motion.posY = (motion.spawnYPercent / 100) * height;
    motion.ready = true;
  }
}

function wrapBadge(motion, width, height) {
  // Exit right → enter left at a new vertical spot
  if (motion.posX > width + WRAP_MARGIN) {
    motion.posX = -WRAP_MARGIN;
    motion.posY = Math.random() * height;
    motion.targetAngle = pick(Date.now(), Math.random() * 10, 0, Math.PI * 2);
    return;
  }

  // Exit left → enter right
  if (motion.posX < -WRAP_MARGIN) {
    motion.posX = width + WRAP_MARGIN;
    motion.posY = Math.random() * height;
    motion.targetAngle = pick(Date.now(), Math.random() * 10, 0, Math.PI * 2);
    return;
  }

  // Exit bottom → enter top
  if (motion.posY > height + WRAP_MARGIN) {
    motion.posY = -WRAP_MARGIN;
    motion.posX = Math.random() * width;
    motion.targetAngle = pick(Date.now(), Math.random() * 10, 0, Math.PI * 2);
    return;
  }

  // Exit top → enter bottom
  if (motion.posY < -WRAP_MARGIN) {
    motion.posY = height + WRAP_MARGIN;
    motion.posX = Math.random() * width;
    motion.targetAngle = pick(Date.now(), Math.random() * 10, 0, Math.PI * 2);
  }
}

function updateIdleDrift(motion, width, height, dt) {
  // Slowly steer toward a shifting target angle (organic, not linear)
  motion.turnTimer -= dt;
  if (motion.turnTimer <= 0) {
    const wobble = (Math.random() - 0.5) * Math.PI * motion.driftStrength;
    motion.targetAngle = motion.angle + wobble;
    motion.turnTimer = 100 + Math.random() * 200;
  }

  const steer = 0.012 * motion.driftStrength * dt;
  let delta = motion.targetAngle - motion.angle;
  // shortest rotation
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  motion.angle += delta * steer;

  motion.posX += Math.cos(motion.angle) * motion.speed * dt;
  motion.posY += Math.sin(motion.angle) * motion.speed * dt;
  motion.rotation += motion.rotationSpeed * dt;

  wrapBadge(motion, width, height);
}

function updateVisualBreathing(motion, timeMs) {
  const t = timeMs * 0.001;
  const wave = Math.sin(t * motion.pulseSpeed + motion.phase);
  const wave2 = Math.sin(t * motion.pulseSpeed * 0.73 + motion.phase * 1.3);

  motion.scale = motion.baseScale * (1 + wave * 0.035);
  motion.opacity = motion.baseOpacity + wave2 * 0.05;
  motion.blur = motion.baseBlur + wave * 0.25;
}

/*
  Same repulsion math as before.
  "Home" is now the drifting world position (posX / posY).
*/
function updateRepulsion(motion, mouse) {
  const homeX = motion.posX;
  const homeY = motion.posY;

  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let isEscaping = false;

  if (mouse.isInside) {
    const dx = homeX - mouse.x;
    const dy = homeY - mouse.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < REPULSION_RADIUS_SQ && distanceSq > 0.0001) {
      const distance = Math.sqrt(distanceSq);
      const force =
        (1 - distance / REPULSION_RADIUS) * motion.strength * MAX_PUSH;

      targetOffsetX = (dx / distance) * force;
      targetOffsetY = (dy / distance) * force;
      isEscaping = true;
    }
  }

  const speed = isEscaping ? motion.escapeSpeed : motion.returnSpeed;

  motion.offsetX += (targetOffsetX - motion.offsetX) * speed;
  motion.offsetY += (targetOffsetY - motion.offsetY) * speed;

  if (
    !isEscaping &&
    Math.abs(motion.offsetX) < REST_THRESHOLD &&
    Math.abs(motion.offsetY) < REST_THRESHOLD
  ) {
    motion.offsetX = 0;
    motion.offsetY = 0;
    motion.isResting = true;
  } else {
    motion.isResting = false;
  }
}

/* One full frame for a badge — always moves (idle never sleeps). */
export function updateBadgeMotion(motion, mouse, cloudWidth, cloudHeight, dt, timeMs) {
  ensurePosition(motion, cloudWidth, cloudHeight);
  if (!motion.ready) return false;

  updateIdleDrift(motion, cloudWidth, cloudHeight, dt);
  updateRepulsion(motion, mouse);
  updateVisualBreathing(motion, timeMs);

  return true;
}

/*
  Soft collisions between badges.
  When two pills overlap, gently push them apart and nudge headings.
*/
export function resolveBadgeCollisions(motionList) {
  const count = motionList.length;

  for (let i = 0; i < count; i++) {
    const a = motionList[i];
    if (!a?.ready) continue;

    const ax = a.posX + a.offsetX;
    const ay = a.posY + a.offsetY;

    for (let j = i + 1; j < count; j++) {
      const b = motionList[j];
      if (!b?.ready) continue;

      const bx = b.posX + b.offsetX;
      const by = b.posY + b.offsetY;

      let dx = bx - ax;
      let dy = by - ay;
      let distSq = dx * dx + dy * dy;
      const minDist = a.radius + b.radius;

      if (distSq >= minDist * minDist || distSq === 0) {
        // Exact overlap — give a tiny random separation
        if (distSq === 0) {
          dx = (Math.random() - 0.5) * 0.01;
          dy = (Math.random() - 0.5) * 0.01;
          distSq = dx * dx + dy * dy;
        } else {
          continue;
        }
      }

      const dist = Math.sqrt(distSq);
      if (dist >= minDist) continue;

      const overlap = (minDist - dist) * 0.5;
      const nx = dx / dist;
      const ny = dy / dist;

      // Push world positions apart (keeps mouse offset intact)
      a.posX -= nx * overlap;
      a.posY -= ny * overlap;
      b.posX += nx * overlap;
      b.posY += ny * overlap;

      // Nudge drift headings away from each other (feels like a bounce)
      const awayA = Math.atan2(-ny, -nx);
      const awayB = Math.atan2(ny, nx);
      a.targetAngle = awayA;
      b.targetAngle = awayB;
      a.angle += (awayA - a.angle) * 0.08;
      b.angle += (awayB - b.angle) * 0.08;
    }
  }
}

export function applyBadgeTransform(element, motion) {
  const travel = Math.hypot(motion.offsetX, motion.offsetY);
  const clarity = Math.min(1, travel / 40);

  const blur = Math.max(0, motion.blur * (1 - clarity * 0.55));
  const opacity = Math.min(
    0.95,
    motion.opacity + (0.9 - motion.opacity) * clarity * 0.7
  );

  const x = motion.posX + motion.offsetX;
  const y = motion.posY + motion.offsetY;

  element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${motion.rotation.toFixed(2)}deg) scale(${motion.scale.toFixed(3)})`;
  element.style.filter = blur > 0.08 ? `blur(${blur.toFixed(2)}px)` : "none";
  element.style.opacity = String(opacity.toFixed(3));
}
