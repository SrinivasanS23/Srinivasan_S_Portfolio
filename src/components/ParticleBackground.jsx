import React, { useEffect, useRef } from 'react';

/**
 * Enhanced Cosmic Universe Background:
 * 1. Active strictly from the About Section onwards (hidden during Hero Sequence).
 * 2. Refined, subtle "Entering Space" Warp Transition (sleek, elegant light filaments).
 * 3. 24 Real Celestial Worlds & Exoplanets:
 *    - Sun (Stellar Core)
 *    - Mercury, Venus, Earth (+ Moon), Mars
 *    - Ceres, Jupiter, Io, Europa
 *    - Saturn (with rings), Titan
 *    - Uranus (with vertical ring), Neptune, Triton
 *    - Pluto & Charon, Haumea (with ring), Makemake, Eris
 *    - Famous Exoplanets: Kepler-186f, Kepler-22b, Proxima b, 55 Cancri e, HD 189733b
 * 4. Realistic Asteroid Field (30+ tumbling rocky polygons) & Stardust.
 * 5. Interactive Mouse Evasion Physics across all floating celestial elements!
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };
    let mouseTimeout;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.active = false;
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll state tracking relative to About Section
    let spaceOpacity = 0;
    let targetSpaceOpacity = 0;
    let warpFactor = 0;
    let targetWarpFactor = 0;

    const checkScrollSection = () => {
      const aboutEl = document.getElementById('about');
      if (!aboutEl) return;

      const rect = aboutEl.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Inside Hero Sequence (above About)
      if (rect.top > windowH + 120) {
        targetSpaceOpacity = 0;
        targetWarpFactor = 0;
      }
      // Transitioning from Hero into About (Subtle Space Warp)
      else if (rect.top > 0 && rect.top <= windowH + 120) {
        const transitionProgress = 1 - (rect.top / (windowH + 120)); // 0 -> 1
        targetSpaceOpacity = Math.min(1, transitionProgress * 1.4);
        targetWarpFactor = Math.sin(transitionProgress * Math.PI) * 0.55;
      }
      // Inside About Section and all subsequent sections
      else {
        targetSpaceOpacity = 1;
        targetWarpFactor = 0;
      }
    };

    window.addEventListener('scroll', checkScrollSection, { passive: true });
    checkScrollSection();

    // ----------------------------------------------------
    // 1. STAR & STARDUST CLASS
    // ----------------------------------------------------
    class Star {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.prevX = this.x;
        this.prevY = this.y;
        this.baseVx = (Math.random() - 0.5) * 0.12;
        this.baseVy = (Math.random() - 0.5) * 0.12;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.radius = Math.random() * 1.4 + 0.5;
        this.baseAlpha = Math.random() * 0.45 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;

        const cx = width / 2;
        const cy = height / 2;
        const dx = this.x - cx;
        const dy = this.y - cy;
        this.angle = Math.atan2(dy, dx);

        const colors = ['#FFFFFF', '#FFF3D1', '#E8DCBE', '#DCEBFA'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(currentWarp) {
        this.twinklePhase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.2;
        if (this.alpha < 0.08) this.alpha = 0.08;

        if (currentWarp > 0.03) {
          const speed = currentWarp * 10.5;
          this.prevX = this.x;
          this.prevY = this.y;
          this.x += Math.cos(this.angle) * speed;
          this.y += Math.sin(this.angle) * speed;

          if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.x = width / 2 + (Math.random() - 0.5) * 120;
            this.y = height / 2 + (Math.random() - 0.5) * 120;
            const dx = this.x - width / 2;
            const dy = this.y - height / 2;
            this.angle = Math.atan2(dy, dx);
            this.prevX = this.x;
            this.prevY = this.y;
          }
        } else {
          this.prevX = this.x;
          this.prevY = this.y;

          if (mouse.active) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            const repelRadius = 120;

            if (dist < repelRadius && dist > 0) {
              const force = (repelRadius - dist) / repelRadius;
              const angle = Math.atan2(dy, dx);
              this.vx += Math.cos(angle) * force * 1.1;
              this.vy += Math.sin(angle) * force * 1.1;
            }
          }

          this.vx = this.vx * 0.92 + this.baseVx * 0.08;
          this.vy = this.vy * 0.92 + this.baseVy * 0.08;

          this.x += this.vx;
          this.y += this.vy;

          if (this.x < -10) this.x = width + 10;
          if (this.x > width + 10) this.x = -10;
          if (this.y < -10) this.y = height + 10;
          if (this.y > height + 10) this.y = -10;
        }
      }

      draw(currentWarp) {
        ctx.save();
        if (currentWarp > 0.05) {
          ctx.beginPath();
          ctx.moveTo(this.prevX, this.prevY);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = Math.min(1.4, this.radius * (0.8 + currentWarp * 0.6));
          ctx.globalAlpha = Math.min(0.85, this.alpha * (0.5 + currentWarp * 0.4));
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = Math.min(1, Math.max(0, this.alpha));
          ctx.shadowBlur = this.radius > 1.2 ? 4 : 1;
          ctx.shadowColor = this.color;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // ----------------------------------------------------
    // 2. EXPANDED UNIVERSE: 24 REAL PLANETS & EXOPLANETS
    // ----------------------------------------------------
    const ALL_CELESTIAL_BODIES = [
      // --- Solar System Core & Inner Planets ---
      {
        name: 'Sun',
        radius: 14,
        hasRing: false,
        glowColor: 'rgba(255, 200, 0, 0.4)',
        gradient: ['#FFFFFF', '#FFDF00', '#FF8C00', '#7A2000'],
        initialPos: { xRatio: 0.10, yRatio: 0.18 }
      },
      {
        name: 'Mercury',
        radius: 3.5,
        hasRing: false,
        glowColor: 'rgba(200, 200, 200, 0.2)',
        gradient: ['#E5E5EA', '#8E8E93', '#3A3A3C'],
        initialPos: { xRatio: 0.22, yRatio: 0.28 }
      },
      {
        name: 'Venus',
        radius: 5.8,
        hasRing: false,
        glowColor: 'rgba(255, 215, 120, 0.35)',
        gradient: ['#FFF8E1', '#E5A93C', '#6D3F12'],
        initialPos: { xRatio: 0.88, yRatio: 0.22 }
      },
      {
        name: 'Earth',
        radius: 6.5,
        hasRing: false,
        hasMoon: true,
        glowColor: 'rgba(82, 178, 207, 0.45)',
        gradient: ['#FFFFFF', '#4EA8DE', '#1D4E89'],
        initialPos: { xRatio: 0.76, yRatio: 0.58 }
      },
      {
        name: 'Mars',
        radius: 4.5,
        hasRing: false,
        glowColor: 'rgba(235, 87, 87, 0.35)',
        gradient: ['#FFB4A2', '#D94E34', '#4E150D'],
        initialPos: { xRatio: 0.35, yRatio: 0.72 }
      },
      {
        name: 'Ceres',
        radius: 2.8,
        hasRing: false,
        glowColor: 'rgba(180, 180, 180, 0.2)',
        gradient: ['#F0F0F0', '#999999', '#444444'],
        initialPos: { xRatio: 0.44, yRatio: 0.85 }
      },

      // --- Gas & Ice Giants ---
      {
        name: 'Jupiter',
        radius: 12.5,
        hasRing: false,
        glowColor: 'rgba(227, 178, 127, 0.35)',
        gradient: ['#FBE3C5', '#C2844B', '#4E2C14'],
        initialPos: { xRatio: 0.92, yRatio: 0.78 }
      },
      {
        name: 'Io',
        radius: 2.4,
        hasRing: false,
        glowColor: 'rgba(255, 230, 100, 0.3)',
        gradient: ['#FFF59D', '#FBC02D', '#E65100'],
        initialPos: { xRatio: 0.86, yRatio: 0.82 }
      },
      {
        name: 'Europa',
        radius: 2.3,
        hasRing: false,
        glowColor: 'rgba(200, 230, 255, 0.3)',
        gradient: ['#FFFFFF', '#B0BEC5', '#37474F'],
        initialPos: { xRatio: 0.96, yRatio: 0.74 }
      },
      {
        name: 'Saturn',
        radius: 10,
        hasRing: true,
        ringColor: 'rgba(240, 205, 130, 0.6)',
        ringTilt: -0.42,
        ringScale: 2.4,
        glowColor: 'rgba(255, 215, 100, 0.35)',
        gradient: ['#FFF0C2', '#D4AF37', '#503808'],
        initialPos: { xRatio: 0.15, yRatio: 0.70 }
      },
      {
        name: 'Titan',
        radius: 3.2,
        hasRing: false,
        glowColor: 'rgba(255, 180, 80, 0.3)',
        gradient: ['#FFE082', '#FB8C00', '#4E2600'],
        initialPos: { xRatio: 0.08, yRatio: 0.76 }
      },
      {
        name: 'Uranus',
        radius: 7.5,
        hasRing: true,
        ringColor: 'rgba(168, 230, 207, 0.45)',
        ringTilt: 1.15,
        ringScale: 1.85,
        glowColor: 'rgba(120, 220, 200, 0.35)',
        gradient: ['#E8F8F5', '#56C596', '#14382F'],
        initialPos: { xRatio: 0.60, yRatio: 0.15 }
      },
      {
        name: 'Neptune',
        radius: 7.2,
        hasRing: false,
        glowColor: 'rgba(76, 201, 240, 0.4)',
        gradient: ['#90E0EF', '#1E40AF', '#0A1128'],
        initialPos: { xRatio: 0.48, yRatio: 0.38 }
      },
      {
        name: 'Triton',
        radius: 2.6,
        hasRing: false,
        glowColor: 'rgba(230, 200, 255, 0.25)',
        gradient: ['#EDE7F6', '#9575CD', '#311B92'],
        initialPos: { xRatio: 0.54, yRatio: 0.42 }
      },

      // --- Kuiper Belt & Dwarf Worlds ---
      {
        name: 'Pluto',
        radius: 2.7,
        hasRing: false,
        glowColor: 'rgba(200, 180, 160, 0.25)',
        gradient: ['#F3ECE7', '#9B8272', '#3E3129'],
        initialPos: { xRatio: 0.05, yRatio: 0.45 }
      },
      {
        name: 'Charon',
        radius: 1.9,
        hasRing: false,
        glowColor: 'rgba(160, 160, 160, 0.2)',
        gradient: ['#D7CCC8', '#795548', '#271813'],
        initialPos: { xRatio: 0.03, yRatio: 0.49 }
      },
      {
        name: 'Haumea',
        radius: 3.4,
        hasRing: true,
        ringColor: 'rgba(220, 220, 240, 0.35)',
        ringTilt: -0.6,
        ringScale: 2.0,
        glowColor: 'rgba(200, 220, 255, 0.25)',
        gradient: ['#FFFFFF', '#B0BEC5', '#263238'],
        initialPos: { xRatio: 0.32, yRatio: 0.12 }
      },
      {
        name: 'Makemake',
        radius: 2.9,
        hasRing: false,
        glowColor: 'rgba(230, 140, 100, 0.25)',
        gradient: ['#FFCCBC', '#D84315', '#3E1004'],
        initialPos: { xRatio: 0.68, yRatio: 0.88 }
      },
      {
        name: 'Eris',
        radius: 3.0,
        hasRing: false,
        glowColor: 'rgba(220, 240, 255, 0.3)',
        gradient: ['#FFFFFF', '#CFD8DC', '#37474F'],
        initialPos: { xRatio: 0.82, yRatio: 0.08 }
      },

      // --- Famous Exoplanets & Alien Worlds ---
      {
        name: 'Kepler-186f', // Habitable Emerald-Azure Super-Earth
        radius: 5.5,
        hasRing: false,
        glowColor: 'rgba(80, 220, 150, 0.35)',
        gradient: ['#E8F5E9', '#2E7D32', '#0A2E10'],
        initialPos: { xRatio: 0.70, yRatio: 0.36 }
      },
      {
        name: 'Kepler-22b', // Deep Ocean Waterworld
        radius: 6.2,
        hasRing: false,
        glowColor: 'rgba(0, 230, 230, 0.35)',
        gradient: ['#E0F7FA', '#0097A7', '#00363A'],
        initialPos: { xRatio: 0.28, yRatio: 0.52 }
      },
      {
        name: 'Proxima Centauri b', // Red Dwarf Planet
        radius: 4.8,
        hasRing: false,
        glowColor: 'rgba(255, 90, 90, 0.35)',
        gradient: ['#FFCDD2', '#C62828', '#3E0808'],
        initialPos: { xRatio: 0.50, yRatio: 0.66 }
      },
      {
        name: '55 Cancri e', // Sparkling Diamond / Carbon World
        radius: 5.2,
        hasRing: true,
        ringColor: 'rgba(255, 230, 150, 0.45)',
        ringTilt: 0.35,
        ringScale: 2.1,
        glowColor: 'rgba(255, 240, 180, 0.4)',
        gradient: ['#FFFDE7', '#FBC02D', '#3E2723'],
        initialPos: { xRatio: 0.85, yRatio: 0.48 }
      },
      {
        name: 'HD 189733b', // Glass Rain Deep Cobalt Exoplanet
        radius: 6.8,
        hasRing: false,
        glowColor: 'rgba(30, 144, 255, 0.45)',
        gradient: ['#80D8FF', '#0091EA', '#001040'],
        initialPos: { xRatio: 0.18, yRatio: 0.40 }
      }
    ];

    class Planet {
      constructor(data) {
        this.data = data;
        this.radius = data.radius;
        this.x = width * data.initialPos.xRatio + (Math.random() - 0.5) * 40;
        this.y = height * data.initialPos.yRatio + (Math.random() - 0.5) * 40;

        this.baseVx = (Math.random() - 0.5) * 0.14;
        this.baseVy = (Math.random() - 0.5) * 0.14;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.floatPhase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.010 + Math.random() * 0.008;

        if (data.hasMoon) {
          this.moonAngle = Math.random() * Math.PI * 2;
          this.moonOrbitDist = this.radius * 2.3;
        }
      }

      update() {
        this.floatPhase += this.floatSpeed;
        const floatOffset = Math.sin(this.floatPhase) * 0.15;

        // Mouse Evade Physics
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const repelRadius = 180;

          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 1.5;
            this.vy += Math.sin(angle) * force * 1.5;
          }
        }

        this.vx = this.vx * 0.93 + this.baseVx * 0.07;
        this.vy = this.vy * 0.93 + (this.baseVy + floatOffset) * 0.07;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -40) this.x = width + 40;
        if (this.x > width + 40) this.x = -40;
        if (this.y < -40) this.y = height + 40;
        if (this.y > height + 40) this.y = -40;

        if (this.data.hasMoon) {
          this.moonAngle += 0.025;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Atmosphere Glow
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = this.data.glowColor;
        ctx.shadowColor = this.data.glowColor;
        ctx.shadowBlur = 14;
        ctx.fill();

        // 3D Spherical Radial Gradient
        const grad = ctx.createRadialGradient(
          -this.radius * 0.35,
          -this.radius * 0.35,
          this.radius * 0.1,
          0,
          0,
          this.radius
        );
        grad.addColorStop(0, this.data.gradient[0]);
        grad.addColorStop(0.5, this.data.gradient[1]);
        grad.addColorStop(1, this.data.gradient[2]);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = this.data.glowColor;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Optional Planetary Ring
        if (this.data.hasRing) {
          ctx.save();
          ctx.rotate(this.data.ringTilt || -0.4);
          ctx.scale(1, 0.3);

          ctx.beginPath();
          ctx.arc(0, 0, this.radius * (this.data.ringScale || 2.2), 0, Math.PI * 2);
          ctx.strokeStyle = this.data.ringColor;
          ctx.lineWidth = Math.max(1.2, this.radius * 0.22);
          ctx.shadowColor = this.data.ringColor;
          ctx.shadowBlur = 6;
          ctx.stroke();

          ctx.restore();
        }

        // Orbiting Moon
        if (this.data.hasMoon) {
          const mx = Math.cos(this.moonAngle) * this.moonOrbitDist;
          const my = Math.sin(this.moonAngle) * (this.moonOrbitDist * 0.5);
          ctx.beginPath();
          ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#E0E0E0';
          ctx.shadowColor = 'rgba(255,255,255,0.4)';
          ctx.shadowBlur = 3;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // ----------------------------------------------------
    // 3. FLOATING ASTEROID CLASS (Rocky Polygon Debris)
    // ----------------------------------------------------
    class Asteroid {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.8 + 1.4;
        this.baseVx = (Math.random() - 0.5) * 0.22;
        this.baseVy = (Math.random() - 0.5) * 0.22;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;

        const vertexCount = 6 + Math.floor(Math.random() * 3);
        this.vertices = [];
        for (let i = 0; i < vertexCount; i++) {
          const angle = (i / vertexCount) * Math.PI * 2;
          const r = this.radius * (0.7 + Math.random() * 0.5);
          this.vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }

        const shades = ['#5C5F66', '#495057', '#343A40', '#6C584C'];
        this.color = shades[Math.floor(Math.random() * shades.length)];
      }

      update() {
        this.rotation += this.rotSpeed;

        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const repelRadius = 110;

          if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 1.3;
            this.vy += Math.sin(angle) * force * 1.3;
          }
        }

        this.vx = this.vx * 0.94 + this.baseVx * 0.06;
        this.vy = this.vy * 0.94 + this.baseVy * 0.06;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
          ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize Universe Elements
    const starCount = Math.min(100, Math.floor((width * height) / 9500));
    const stars = Array.from({ length: starCount }, () => new Star());
    const planets = ALL_CELESTIAL_BODIES.map((data) => new Planet(data));
    const asteroids = Array.from({ length: 30 }, () => new Asteroid());

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      spaceOpacity += (targetSpaceOpacity - spaceOpacity) * 0.08;
      warpFactor += (targetWarpFactor - warpFactor) * 0.1;

      if (spaceOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = spaceOpacity;

        // 1. Stars
        for (let i = 0; i < stars.length; i++) {
          stars[i].update(warpFactor);
          stars[i].draw(warpFactor);
        }

        // 2. Asteroids & Debris
        if (warpFactor < 0.25) {
          for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
            asteroids[i].draw();
          }
        }

        // 3. 24 Real Planets & Exoplanets
        if (warpFactor < 0.35) {
          for (let i = 0; i < planets.length; i++) {
            planets[i].update();
            planets[i].draw();
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      checkScrollSection();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', checkScrollSection);
      window.removeEventListener('resize', handleResize);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
