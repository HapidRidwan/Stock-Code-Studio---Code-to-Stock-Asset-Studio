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
    js: `// High-Performance 60FPS Particle Physics Simulator
(function() {
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
  const particles = [];

  const PALETTES = [
    { r: 59, g: 130, b: 246 },   // Electric Blue
    { r: 147, g: 51, b: 234 },   // Neon Purple
    { r: 236, g: 72, b: 153 },   // Vivid Pink
    { r: 45, g: 212, b: 191 },   // Aqua Cyan
    { r: 251, g: 191, b: 36 }    // Warm Gold
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = -(Math.random() * 1.5 + 0.4); // Anti-gravity floating upward
      this.radius = Math.random() * 3.5 + 1.2;
      this.color = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      this.alpha = Math.random() * 0.7 + 0.3;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseAngle += this.pulseSpeed;

      // Soft boundary wrap
      if (this.y < -30) this.reset(false);
      if (this.x < -30) this.x = width + 30;
      if (this.x > width + 30) this.x = -30;
    }

    draw(ctx) {
      const currentAlpha = this.alpha * (0.8 + Math.sin(this.pulseAngle) * 0.2);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(\${this.color.r}, \${this.color.g}, \${this.color.b}, \${currentAlpha})\`;
      ctx.shadowBlur = this.radius * 6;
      ctx.shadowColor = \`rgba(\${this.color.r}, \${this.color.g}, \${this.color.b}, 0.8)\`;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, width, height);

    // Draw neural connection filaments
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = \`rgba(99, 102, 241, \${lineAlpha})\`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    for (const p of particles) {
      p.update();
      p.draw(ctx);
    }

    requestAnimationFrame(render);
  }

  render();
})();`
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
