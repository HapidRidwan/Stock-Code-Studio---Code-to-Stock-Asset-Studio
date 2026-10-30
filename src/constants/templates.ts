export interface StarterTemplate {
  id: string;
  name: string;
  category: 'Vector' | 'Particle Video' | 'CSS Motion' | 'UI & Badge';
  description: string;
  recommendedPresetId: string;
  recommendedFormat: 'svg' | 'png' | 'mp4' | 'webm';
  html: string;
  css: string;
  js: string;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'geometric-abstract-vector',
    name: 'Geometric Abstract Vector',
    category: 'Vector',
    description: 'Generative Bauhaus & Swiss-inspired geometric composition with pure SVG paths, concentric rings, and vibrant gradients. 100% vector-ready for Adobe Stock SVG/EPS.',
    recommendedPresetId: 'adobe-standard-12mp',
    recommendedFormat: 'svg',
    html: `<!-- Pure Vector Graphic (No foreignObject, EPS & SVG Standard Compliant) -->
<div class="vector-container">
  <svg id="stock-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 3000" width="100%" height="100%">
    <defs>
      <!-- Premium Commercial Gradients -->
      <linearGradient id="gradViolet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5" />
        <stop offset="50%" stop-color="#7c3aed" />
        <stop offset="100%" stop-color="#db2777" />
      </linearGradient>

      <linearGradient id="gradCyan" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>

      <linearGradient id="gradGold" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#ef4444" />
      </linearGradient>

      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0e17" />
        <stop offset="50%" stop-color="#111827" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>

      <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="30" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background Base -->
    <rect width="4000" height="3000" fill="url(#bgGradient)" />

    <!-- Isometric & Geometric Decorative Lines -->
    <g opacity="0.15" stroke="#ffffff" stroke-width="2">
      <line x1="0" y1="500" x2="4000" y2="500" stroke-dasharray="20 20" />
      <line x1="0" y1="1500" x2="4000" y2="1500" stroke-dasharray="10 15" />
      <line x1="0" y1="2500" x2="4000" y2="2500" stroke-dasharray="20 20" />
      <line x1="1000" y1="0" x2="1000" y2="3000" stroke-dasharray="10 15" />
      <line x1="2000" y1="0" x2="2000" y2="3000" stroke-dasharray="20 20" />
      <line x1="3000" y1="0" x2="3000" y2="3000" stroke-dasharray="10 15" />
    </g>

    <!-- Abstract Overlapping Dynamic Geometric Composition -->
    <g id="composition-root" transform="translate(2000, 1500)">
      <!-- Outer Orbit Rings -->
      <circle r="1100" fill="none" stroke="url(#gradCyan)" stroke-width="6" opacity="0.4" stroke-dasharray="40 25" />
      <circle r="850" fill="none" stroke="url(#gradViolet)" stroke-width="12" opacity="0.6" />
      <circle r="600" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.2" stroke-dasharray="8 8" />
      
      <!-- Primary Intersecting Geometry -->
      <path d="M -600,-400 C -200,-900 600,-700 800,-200 C 1000,300 400,800 -100,750 C -600,700 -900,100 -600,-400 Z" 
            fill="url(#gradViolet)" opacity="0.75" />

      <polygon points="0,-650 550,300 -550,300" fill="url(#gradCyan)" opacity="0.6" style="mix-blend-mode: screen;" />

      <!-- Concentric Circle Core with Sharp Angles -->
      <circle r="420" fill="url(#gradGold)" opacity="0.85" />
      <circle r="260" fill="#0b0f19" opacity="0.95" />
      <circle r="180" fill="none" stroke="#ffffff" stroke-width="10" />

      <!-- Dynamic Ray Spokes & Vector Accents -->
      <g id="spokes" stroke="url(#gradCyan)" stroke-width="8" stroke-linecap="round"></g>

      <!-- Center Focal Diamond -->
      <polygon points="0,-100 100,0 0,100 -100,0" fill="#ffffff" />
    </g>
  </svg>
</div>`,
    css: `/* Studio Vector Presentation */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.vector-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}`,
    js: `// Generative SVG Spokes & Mathematical Geometry Builder
(function() {
  const spokesGroup = document.getElementById('spokes');
  if (!spokesGroup) return;
  
  spokesGroup.innerHTML = '';
  const count = 36;
  for (let i = 0; i < count; i++) {
    const angle = (i * (360 / count)) * (Math.PI / 180);
    const r1 = 300 + (i % 2 === 0 ? 40 : 0);
    const r2 = 360 + (i % 3 === 0 ? 80 : 20);
    
    const x1 = Math.cos(angle) * r1;
    const y1 = Math.sin(angle) * r1;
    const x2 = Math.cos(angle) * r2;
    const y2 = Math.sin(angle) * r2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', i % 2 === 0 ? '#38bdf8' : '#f43f5e');
    line.setAttribute('stroke-width', (i % 4 === 0 ? 6 : 3).toString());
    line.setAttribute('opacity', '0.7');
    spokesGroup.appendChild(line);
  }
})();`
  },
  {
    id: 'floating-particles',
    name: 'Anti-Gravity Floating Particles',
    category: 'Particle Video',
    description: 'High-end 4K 60FPS generative particle field with physics simulation, dynamic filaments, depth of field, and ambient volumetric glow.',
    recommendedPresetId: 'video-4k',
    recommendedFormat: 'mp4',
    html: `<div class="canvas-wrapper">
  <canvas id="particle-canvas"></canvas>
  <div class="overlay-brand">
    <div class="glow-orb"></div>
  </div>
</div>`,
    css: `body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #030712;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.overlay-brand {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, transparent 60%, rgba(3, 7, 18, 0.7) 100%);
}`,
    js: `// High-Performance 60FPS Particle Simulator with Deterministic Step Engine
const DURATION = 10.0; // Otomatis terbaca oleh UI
window.ANIMATION_DURATION = DURATION;

let isExporting = false;
let previewStartTime = performance.now();

window.setExportState = function(state) {
  isExporting = state;
  if (!state) previewStartTime = performance.now();
};

window.renderSingleFrame = function(t) {
  drawScene(t); // Menggambar frame tepat di detik t
};

const canvas = document.getElementById('particle-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const PARTICLE_COUNT = 140;
const CONNECTION_DIST = 160;

const PALETTES = [
  { r: 59, g: 130, b: 246 },   // Electric Blue
  { r: 147, g: 51, b: 234 },   // Neon Purple
  { r: 236, g: 72, b: 153 },   // Vivid Pink
  { r: 45, g: 212, b: 191 },   // Aqua Cyan
  { r: 251, g: 191, b: 36 }    // Warm Gold
];

// Seeded deterministic particle parameters
const particleSeeds = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const rand1 = Math.sin(i * 12.9898 + 1.23) * 0.5 + 0.5;
  const rand2 = Math.cos(i * 78.233 + 4.56) * 0.5 + 0.5;
  const rand3 = Math.sin(i * 43.123 + 7.89) * 0.5 + 0.5;
  const rand4 = Math.cos(i * 91.567 + 2.34) * 0.5 + 0.5;

  particleSeeds.push({
    initX: rand1 * width,
    initY: rand2 * height,
    vx: (rand3 - 0.5) * 40,
    vy: rand4 * 80 + 50,
    radius: rand1 * 3.5 + 1.2,
    color: PALETTES[i % PALETTES.length],
    baseAlpha: rand2 * 0.5 + 0.4,
    pulseSpeed: rand3 * 2.5 + 1.0,
    phase: rand4 * Math.PI * 2
  });
}

function drawScene(t) {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, width, height);

  const currentPositions = [];
  const wrapH = height + 80;
  const wrapW = width + 80;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = particleSeeds[i];
    // Deterministic position at time t
    const rawY = p.initY - (p.vy * t * 8);
    const y = ((rawY % wrapH) + wrapH) % wrapH - 40;

    const rawX = p.initX + Math.sin(t * 0.8 + p.phase) * 35 + p.vx * (t / DURATION);
    const x = ((rawX % wrapW) + wrapW) % wrapW - 40;

    const currentAlpha = p.baseAlpha * (0.8 + Math.sin(t * p.pulseSpeed + p.phase) * 0.2);
    currentPositions.push({ x, y, radius: p.radius, color: p.color, alpha: currentAlpha });
  }

  // Draw connection filaments
  for (let i = 0; i < currentPositions.length; i++) {
    const pi = currentPositions[i];
    for (let j = i + 1; j < currentPositions.length; j++) {
      const pj = currentPositions[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DIST) {
        const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.25 * Math.min(pi.alpha, pj.alpha);
        ctx.beginPath();
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
        ctx.strokeStyle = \`rgba(99, 102, 241, \${lineAlpha.toFixed(3)})\`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Draw particles
  for (let i = 0; i < currentPositions.length; i++) {
    const p = currentPositions[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(\${p.color.r}, \${p.color.g}, \${p.color.b}, \${p.alpha.toFixed(3)})\`;
    ctx.shadowBlur = p.radius * 6;
    ctx.shadowColor = \`rgba(\${p.color.r}, \${p.color.g}, \${p.color.b}, 0.8)\`;
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function loop(now) {
  if (!isExporting) {
    const elapsed = ((now - previewStartTime) / 1000) % DURATION;
    drawScene(elapsed);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);`
  },
  {
    id: 'flight-route-radar',
    name: 'Flight Radar & Jet Path Motion',
    category: 'Particle Video',
    description: 'Commercial 4K aviation route tracker with deterministic aircraft kinematics, glowing contrails, waypoint beacons, and HUD coordinates.',
    recommendedPresetId: 'video-4k',
    recommendedFormat: 'mp4',
    html: `<div class="radar-wrapper">
  <canvas id="radar-canvas"></canvas>
  <div class="hud-overlay">
    <div class="hud-header">
      <span class="hud-tag">ATC RADAR • FLIGHT SK-408</span>
      <span class="hud-status">TRACKING ACTIVE</span>
    </div>
  </div>
</div>`,
    css: `body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #060913;
  font-family: 'JetBrains Mono', monospace;
}

.radar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.hud-overlay {
  position: absolute;
  top: 32px;
  left: 32px;
  right: 32px;
  pointer-events: none;
}

.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  letter-spacing: 2px;
}

.hud-tag {
  color: #38bdf8;
  font-weight: 700;
  background: rgba(14, 165, 233, 0.12);
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.hud-status {
  color: #34d399;
  font-weight: 600;
  background: rgba(52, 211, 153, 0.12);
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}`,
    js: `// Commercial Flight Radar & Airplane Route Tracker
const DURATION = 8.0; // Otomatis terbaca oleh UI: 8.0 Detik
window.ANIMATION_DURATION = DURATION;

let isExporting = false;
let previewStartTime = performance.now();

window.setExportState = function(state) {
  isExporting = state;
  if (!state) previewStartTime = performance.now();
};

window.renderSingleFrame = function(t) {
  drawScene(t); // Menggambar frame tepat di detik t
};

const canvas = document.getElementById('radar-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Cubic Bezier waypoint coordinates
function getBezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
  };
}

function getBezierTangent(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
  };
}

function drawScene(t) {
  const progress = Math.min(Math.max((t % DURATION) / DURATION, 0), 1);

  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, width, height);

  // Radar Grid Background
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  const gridSize = 100;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Radar Range Rings
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const maxRadius = Math.min(width, height) * 0.42;

  for (let r = maxRadius * 0.25; r <= maxRadius; r += maxRadius * 0.25) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Rotating Radar Beam sweep
  const sweepAngle = (t * (Math.PI * 2 / 4)) % (Math.PI * 2);
  const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
  sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, maxRadius, sweepAngle - 0.4, sweepAngle);
  ctx.closePath();
  ctx.fillStyle = sweepGrad;
  ctx.fill();
  ctx.restore();

  // Waypoints
  const p0 = { x: width * 0.15, y: height * 0.72 };
  const p1 = { x: width * 0.35, y: height * 0.22 };
  const p2 = { x: width * 0.65, y: height * 0.85 };
  const p3 = { x: width * 0.88, y: height * 0.28 };

  // Draw full planned flight path dashed
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 12]);
  for (let i = 0; i <= 60; i++) {
    const pt = getBezierPoint(p0, p1, p2, p3, i / 60);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw completed path with glowing cyan gradient
  ctx.beginPath();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 14;
  const steps = Math.floor(progress * 60);
  for (let i = 0; i <= steps; i++) {
    const pt = getBezierPoint(p0, p1, p2, p3, i / 60);
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  const currentPlane = getBezierPoint(p0, p1, p2, p3, progress);
  if (steps > 0) ctx.lineTo(currentPlane.x, currentPlane.y);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Waypoint Markers
  [p0, p3].forEach((pt, idx) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = idx === 0 ? '#38bdf8' : '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(idx === 0 ? 'ORIGIN [W-01]' : 'DESTINATION [W-02]', pt.x - 30, pt.y + 24);
  });

  // Current Airplane Position & Heading
  const tangent = getBezierTangent(p0, p1, p2, p3, progress);
  const headingAngle = Math.atan2(tangent.y, tangent.x);

  ctx.save();
  ctx.translate(currentPlane.x, currentPlane.y);
  ctx.rotate(headingAngle);

  // Jet Contrail Trail Particles
  for (let c = 1; c <= 5; c++) {
    ctx.beginPath();
    ctx.arc(-c * 16, 0, 4 - c * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(56, 189, 248, \${(0.6 - c * 0.1).toFixed(2)})\`;
    ctx.fill();
  }

  // Airplane Geometry
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;

  // Fuselage & Wings
  ctx.beginPath();
  ctx.moveTo(22, 0);       // Nose
  ctx.lineTo(-4, -18);     // Left wingtip
  ctx.lineTo(-2, -6);      // Wing trailing
  ctx.lineTo(-14, -14);    // Tail left
  ctx.lineTo(-16, -1);     // Tail center
  ctx.lineTo(-16, 1);
  ctx.lineTo(-14, 14);     // Tail right
  ctx.lineTo(-2, 6);       // Wing trailing
  ctx.lineTo(-4, 18);      // Right wingtip
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Dynamic Telemetry HUD beside plane
  const altitude = Math.round(32000 + Math.sin(progress * Math.PI) * 4000);
  const speedKnots = Math.round(480 + Math.sin(progress * Math.PI * 2) * 25);
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(\`ALT: \${altitude} FT\`, currentPlane.x + 28, currentPlane.y - 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(\`SPD: \${speedKnots} KTS\`, currentPlane.x + 28, currentPlane.y + 4);
  ctx.fillText(\`T: \${t.toFixed(2)}s / \${DURATION.toFixed(1)}s\`, currentPlane.x + 28, currentPlane.y + 20);
}

function loop(now) {
  if (!isExporting) {
    const elapsed = ((now - previewStartTime) / 1000) % DURATION;
    drawScene(elapsed);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);`
  },
  {
    id: 'motion-gradient-bg',
    name: 'Motion Gradient Background',
    category: 'CSS Motion',
    description: 'Ultra-fluid Aurora Borealis mesh animation powered by pure CSS keyframes and radial gradients. Seamless loop perfect for video backgrounds.',
    recommendedPresetId: 'video-fhd',
    recommendedFormat: 'mp4',
    html: `<div class="aurora-container">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
  <div class="blob blob-4"></div>
  <div class="mesh-overlay"></div>
  <div class="vignette"></div>
</div>`,
    css: `body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #05050e;
}

.aurora-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter: blur(80px);
}

.blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: 0.8;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

/* Electric Indigo Blob */
.blob-1 {
  width: 70vw;
  height: 70vw;
  background: radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0) 70%);
  top: -15%;
  left: -15%;
  animation: moveBlob1 12s infinite alternate;
}

/* Hot Magenta Blob */
.blob-2 {
  width: 65vw;
  height: 65vw;
  background: radial-gradient(circle, #ec4899 0%, rgba(236, 72, 153, 0) 70%);
  bottom: -15%;
  right: -10%;
  animation: moveBlob2 15s infinite alternate;
}

/* Bright Cyan Aqua Blob */
.blob-3 {
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #06b6d4 0%, rgba(6, 182, 212, 0) 70%);
  top: 30%;
  left: 25%;
  animation: moveBlob3 10s infinite alternate;
}

/* Radiant Gold Amber */
.blob-4 {
  width: 45vw;
  height: 45vw;
  background: radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0) 70%);
  bottom: 10%;
  left: -5%;
  animation: moveBlob4 14s infinite alternate;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(5, 5, 14, 0.8) 100%);
  pointer-events: none;
}

@keyframes moveBlob1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30%, 25%) scale(1.15); }
  100% { transform: translate(10%, 40%) scale(0.9); }
}

@keyframes moveBlob2 {
  0% { transform: translate(0, 0) scale(1.1); }
  50% { transform: translate(-35%, -20%) scale(0.85); }
  100% { transform: translate(-15%, -40%) scale(1.05); }
}

@keyframes moveBlob3 {
  0% { transform: translate(0, 0) scale(0.9); }
  50% { transform: translate(-25%, 30%) scale(1.2); }
  100% { transform: translate(35%, -15%) scale(1); }
}

@keyframes moveBlob4 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40%, -30%) scale(1.25); }
  100% { transform: translate(15%, -15%) scale(0.95); }
}`,
    js: `// Fluid Loop Controller
console.log('StockCode Studio: Aurora Mesh Motion loaded smoothly.');`
  },
  {
    id: 'infographic-ui-badge',
    name: 'Infographic / UI Tech Badge',
    category: 'UI & Badge',
    description: 'Crisp vector tech badge and futuristic infographic emblem. Pure vector paths, circular gauge charts, and high-tech typography.',
    recommendedPresetId: 'adobe-standard-12mp',
    recommendedFormat: 'svg',
    html: `<div class="badge-container">
  <svg id="badge-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 3000" width="100%" height="100%">
    <defs>
      <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00f2fe" />
        <stop offset="100%" stop-color="#4facfe" />
      </linearGradient>

      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffd200" />
        <stop offset="100%" stop-color="#f7971e" />
      </linearGradient>

      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="50%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
    </defs>

    <!-- Dark Minimalist Backdrop -->
    <rect width="4000" height="3000" fill="#090d16" />

    <!-- Technical Grid Pattern -->
    <g opacity="0.08" stroke="#38bdf8" stroke-width="1.5">
      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" />
      </pattern>
      <rect width="4000" height="3000" fill="url(#grid)" />
    </g>

    <g transform="translate(2000, 1500)">
      <!-- Outer Hexagon Cyber Shield -->
      <polygon points="0,-900 779,-450 779,450 0,900 -779,450 -779,-450" 
               fill="#0d1424" stroke="url(#neonGradient)" stroke-width="16" opacity="0.9" />

      <!-- Concentric Tech Data Rings -->
      <circle r="720" fill="none" stroke="#1e293b" stroke-width="12" />
      <circle r="680" fill="none" stroke="url(#ringGrad)" stroke-width="24" stroke-dasharray="850 300" stroke-linecap="round" />
      <circle r="620" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="12 16" opacity="0.5" />

      <!-- Gauge Markers -->
      <g stroke="#ffffff" stroke-width="4" opacity="0.4">
        <line x1="-580" y1="0" x2="-540" y2="0" />
        <line x1="540" y1="0" x2="580" y2="0" />
        <line x1="0" y1="-580" x2="0" y2="-540" />
        <line x1="0" y1="540" x2="0" y2="580" />
      </g>

      <!-- Center Hex Shield Core -->
      <polygon points="0,-480 416,-240 416,240 0,480 -416,240 -416,-240" 
               fill="#131c31" stroke="url(#goldGradient)" stroke-width="12" />

      <!-- High Tech Typography & Metrics -->
      <text x="0" y="-80" font-family="'Inter', sans-serif" font-weight="900" font-size="130" fill="#ffffff" text-anchor="middle" letter-spacing="12">
        STOCK CODE
      </text>

      <text x="0" y="20" font-family="'Inter', sans-serif" font-weight="700" font-size="52" fill="#38bdf8" text-anchor="middle" letter-spacing="8">
        HIGH RESOLUTION ASSET
      </text>

      <!-- Metric Accents -->
      <rect x="-240" y="90" width="480" height="60" rx="30" fill="url(#neonGradient)" opacity="0.2" />
      <text x="0" y="132" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="38" fill="#38bdf8" text-anchor="middle">
        4000 x 3000 • 12 MP
      </text>

      <!-- Security Star Badge -->
      <g transform="translate(0, 260) scale(1.6)">
        <polygon points="0,-40 12,-12 40,-12 18,6 26,34 0,18 -26,34 -18,6 -40,-12 -12,-12" fill="url(#goldGradient)" />
      </g>
    </g>
  </svg>
</div>`,
    css: `body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #090d16;
}

.badge-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}`,
    js: `// Dynamic Badge Pulse Accent
console.log('Vector UI Badge Ready for Export');`
  }
];
