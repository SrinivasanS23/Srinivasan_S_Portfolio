import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_HERO_FRAMES = 300;

export default function HeroSequence({ heroImages, mobileImages }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dollyRef = useRef(null);
  const morphRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollHintRef = useRef(null);
  const ctxRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // TV Power & Terminal State
  const [tvPoweredOn, setTvPoweredOn] = useState(false);
  const [terminalStage, setTerminalStage] = useState('off');
  const [bootText, setBootText] = useState([]);
  const [cmd1Text, setCmd1Text] = useState('');
  const [out1Text, setOut1Text] = useState('');
  const [cmd2Text, setCmd2Text] = useState('');
  const [out2Text, setOut2Text] = useState('');

  // Pure ref-driven animation state (zero React re-renders during scroll)
  const frameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const animFrameIdRef = useRef(null);
  const scrollProgRef = useRef(0);
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  // Track which images are confirmed loaded for instant access
  const loadedSetRef = useRef(new Set());

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeImages = isMobile && mobileImages && mobileImages.length > 0 ? mobileImages : heroImages;

  // Build loaded-set whenever activeImages changes
  useEffect(() => {
    if (!activeImages || activeImages.length === 0) return;
    const set = loadedSetRef.current;
    set.clear();

    const checkAll = () => {
      for (let i = 0; i < activeImages.length; i++) {
        const img = activeImages[i];
        if (img && img.complete && img.naturalWidth > 0) {
          set.add(i);
        }
      }
    };

    checkAll();

    // Listen for late-loading frames
    const handlers = [];
    for (let i = 0; i < activeImages.length; i++) {
      const img = activeImages[i];
      if (img && !set.has(i)) {
        const handler = () => {
          if (img.naturalWidth > 0) set.add(i);
        };
        img.addEventListener('load', handler);
        handlers.push({ img, handler });
      }
    }

    // Periodic sweep for any missed loads
    const interval = setInterval(checkAll, 500);

    return () => {
      clearInterval(interval);
      handlers.forEach(({ img, handler }) => img.removeEventListener('load', handler));
    };
  }, [activeImages]);

  // Find the best available frame (instant O(1) lookup with fallback search)
  const getBestFrame = useCallback((targetIndex) => {
    if (!activeImages || activeImages.length === 0) return null;
    const set = loadedSetRef.current;
    const target = Math.max(0, Math.min(TOTAL_HERO_FRAMES - 1, Math.round(targetIndex)));

    // Direct hit
    if (set.has(target)) return activeImages[target];

    // Search outward ±1, ±2, ±3... up to ±50
    for (let offset = 1; offset <= 50; offset++) {
      const prev = target - offset;
      if (prev >= 0 && set.has(prev)) return activeImages[prev];
      const next = target + offset;
      if (next < activeImages.length && set.has(next)) return activeImages[next];
    }

    // Last resort: any loaded frame
    for (const idx of set) {
      return activeImages[idx];
    }

    return null;
  }, [activeImages]);

  // Render a single frame to canvas (optimized: cached ctx, cover-fit math)
  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d', { alpha: false });
      ctxRef.current = ctx;
    }

    const img = getBestFrame(index);
    if (!img) return;

    const { w: cw, h: ch } = canvasSizeRef.current;
    if (cw === 0 || ch === 0) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    // Cover-fit calculation
    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let dw, dh, ox, oy;
    if (canvasRatio > imgRatio) {
      dw = cw;
      dh = cw / imgRatio;
      ox = 0;
      oy = (ch - dh) / 2;
    } else {
      dw = ch * imgRatio;
      dh = ch;
      ox = (cw - dw) / 2;
      oy = 0;
    }

    ctx.drawImage(img, ox, oy, dw, dh);
    lastRenderedFrameRef.current = Math.round(index);
  }, [getBestFrame]);

  // ─── 60 FPS Hardware-Accelerated Render Loop ───
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      // Smooth exponential lerp: slower factor = smoother motion
      const current = frameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        // Use a gentler lerp (0.12) for silky smooth scrubbing
        frameRef.current = current + diff * 0.12;
      } else {
        frameRef.current = target;
      }

      // Only redraw when the visible frame actually changes
      const visibleFrame = Math.round(frameRef.current);
      if (visibleFrame !== lastRenderedFrameRef.current) {
        renderFrame(visibleFrame);
      }

      // ─── Direct DOM transforms (zero React re-renders) ───

      const progress = scrollProgRef.current;

      // Dolly zoom
      if (dollyRef.current) {
        const zp = Math.max(0, (progress - 0.93) / 0.07);
        const scale = 1 + zp * zp * 11;
        dollyRef.current.style.transform = `scale(${scale})`;
        dollyRef.current.style.transformOrigin = isMobile ? '34% 38%' : '25.5% 37.0%';
      }

      // Morph overlay
      if (morphRef.current) {
        const mo = Math.min(1, Math.max(0, (progress - 0.97) * 35));
        morphRef.current.style.opacity = mo;
      }

      // Subtitle fade
      if (subtitleRef.current) {
        const so = Math.max(0, 1 - progress * 6.5);
        subtitleRef.current.style.opacity = so;
        subtitleRef.current.style.transform = `translate(-50%, ${progress * -30}px)`;
        subtitleRef.current.style.display = so <= 0.01 ? 'none' : 'block';
      }

      // Scroll hint fade
      if (scrollHintRef.current) {
        const ho = Math.max(0, 1 - progress * 8);
        scrollHintRef.current.style.opacity = ho;
        scrollHintRef.current.style.display = ho <= 0.01 ? 'none' : 'flex';
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [activeImages, isMobile, renderFrame]);

  // ─── Canvas Sizing (use 1x DPR on mobile for performance) ───
  useEffect(() => {
    const sizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Use lower DPR on mobile to keep frame draws fast
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      canvasSizeRef.current = { w, h };
      // Reset ctx after resize (canvas resize clears context)
      ctxRef.current = null;
      renderFrame(Math.round(frameRef.current));
    };

    sizeCanvas();
    // Deferred re-draw to catch late-loading first frame
    const t1 = setTimeout(sizeCanvas, 150);
    const t2 = setTimeout(sizeCanvas, 600);
    window.addEventListener('resize', sizeCanvas);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', sizeCanvas);
    };
  }, [activeImages, isMobile, renderFrame]);

  // ─── GSAP ScrollTrigger ───
  useEffect(() => {
    if (!activeImages || activeImages.length === 0) return;

    const container = containerRef.current;

    let prevStage = 'off';
    let prevCmd1 = '';
    let prevOut1 = '';
    let prevCmd2 = '';
    let prevOut2 = '';
    let prevBootLinesCount = 0;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 0.6,  // Smoother scrub (higher = more smoothing between scroll and progress)
      onUpdate: (self) => {
        const progress = self.progress;
        scrollProgRef.current = progress;

        // Map progress to target frame index
        targetFrameRef.current = Math.min(
          TOTAL_HERO_FRAMES - 1,
          Math.floor(progress * (TOTAL_HERO_FRAMES - 1))
        );

        // ── Terminal Story Beats (only update state when stage changes) ──
        if (progress < 0.73) {
          if (prevStage !== 'off') {
            prevStage = 'off';
            setTvPoweredOn(false);
            setTerminalStage('off');
            setBootText([]);
            setCmd1Text('');
            setOut1Text('');
            setCmd2Text('');
            setOut2Text('');
          }
        } else if (progress < 0.75) {
          if (prevStage !== 'powerOn') {
            prevStage = 'powerOn';
            setTvPoweredOn(true);
            setTerminalStage('powerOn');
            setBootText([]);
            setCmd1Text('');
            setOut1Text('');
            setCmd2Text('');
            setOut2Text('');
          }
        } else if (progress < 0.83) {
          const bootProg = (progress - 0.75) / 0.08;
          const bootLines = [
            "$ boot",
            "SYSTEM INITIALIZING...",
            "Loading Portfolio...",
            "Loading Assets...",
            "Connecting...",
            "READY"
          ];
          const visibleCount = Math.min(6, Math.floor(bootProg * 6.5));
          if (prevStage !== 'boot' || prevBootLinesCount !== visibleCount) {
            prevStage = 'boot';
            prevBootLinesCount = visibleCount;
            setTvPoweredOn(true);
            setTerminalStage('boot');
            setBootText(bootLines.slice(0, visibleCount));
            setCmd1Text('');
            setOut1Text('');
            setCmd2Text('');
            setOut2Text('');
          }
        } else if (progress < 0.85) {
          if (prevStage !== 'clear') {
            prevStage = 'clear';
            setTvPoweredOn(true);
            setTerminalStage('clear');
            setBootText([]);
            setCmd1Text('');
            setOut1Text('');
            setCmd2Text('');
            setOut2Text('');
          }
        } else {
          const typeProg = Math.min(1, (progress - 0.85) / 0.08);
          const cmd1 = "whoami";
          const out1 = "HI I AM SRINIVASAN";
          const cmd2 = "profession";
          const out2 = "I AM A PYTHON FULL-STACK\nDEVELOPER";

          setTvPoweredOn(true);

          if (typeProg <= 0.25) {
            const c1 = Math.floor((typeProg / 0.25) * cmd1.length);
            const text = cmd1.slice(0, c1);
            if (prevStage !== 'cmd1' || prevCmd1 !== text) {
              prevStage = 'cmd1'; prevCmd1 = text;
              setTerminalStage('cmd1');
              setCmd1Text(text); setOut1Text(''); setCmd2Text(''); setOut2Text('');
            }
          } else if (typeProg <= 0.50) {
            const o1 = Math.floor(((typeProg - 0.25) / 0.25) * out1.length);
            const text = out1.slice(0, o1);
            if (prevStage !== 'out1' || prevOut1 !== text) {
              prevStage = 'out1'; prevOut1 = text;
              setTerminalStage('out1');
              setCmd1Text(cmd1); setOut1Text(text); setCmd2Text(''); setOut2Text('');
            }
          } else if (typeProg <= 0.75) {
            const c2 = Math.floor(((typeProg - 0.50) / 0.25) * cmd2.length);
            const text = cmd2.slice(0, c2);
            if (prevStage !== 'cmd2' || prevCmd2 !== text) {
              prevStage = 'cmd2'; prevCmd2 = text;
              setTerminalStage('cmd2');
              setCmd1Text(cmd1); setOut1Text(out1); setCmd2Text(text); setOut2Text('');
            }
          } else {
            const o2 = Math.floor(((typeProg - 0.75) / 0.25) * out2.length);
            const text = out2.slice(0, o2);
            if (prevStage !== 'complete' || prevOut2 !== text) {
              prevStage = 'complete'; prevOut2 = text;
              setTerminalStage('complete');
              setCmd1Text(cmd1); setOut1Text(out1); setCmd2Text(cmd2); setOut2Text(text);
            }
          }
        }
      }
    });

    return () => trigger.kill();
  }, [activeImages]);

  return (
    <section
      ref={containerRef}
      id="home"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000'
      }}
    >
      {/* Dolly Zoom Container */}
      <div
        ref={dollyRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          willChange: 'transform'
        }}
      >
        {/* Rendered 3D Sequence Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Hero Ambient Vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.45) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* 3D PERSPECTIVE TRAPEZOID MAPPED TERMINAL SURFACE */}
        {tvPoweredOn && (
          <div
            className="tv-perspective-surface"
            style={{
              position: 'absolute',
              top: isMobile ? '29%' : '28.2%',
              left: isMobile ? '16%' : '19.4%',
              width: isMobile ? '32%' : '12.2%',
              height: isMobile ? '18%' : '17.2%',
              overflow: 'hidden',
              perspective: '1000px',
              transform: isMobile
                ? 'none'
                : 'rotateY(10deg) rotateX(-1.5deg) skewY(-1deg)',
              clipPath: 'polygon(0% 1.8%, 100% 0%, 98.5% 97.5%, 1.5% 100%)',
              pointerEvents: 'none',
              zIndex: 25,
              animation: 'tvOledPowerOn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Layer 1: Dark OLED Screen Surface */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#050505', zIndex: 1 }} />

            {/* Layer 2: Glossy OLED Glass Reflection */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 60%)',
                zIndex: 10, pointerEvents: 'none'
              }}
            />

            {/* Layer 3: CRT Scanlines */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 3px',
                zIndex: 9, pointerEvents: 'none', opacity: 0.3
              }}
            />

            {/* Layer 4: Screen Edge Vignette */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.85) 100%)',
                zIndex: 11, pointerEvents: 'none'
              }}
            />

            {/* Layer 5: Terminal Content */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                padding: '6%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                textAlign: 'left',
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                zIndex: 15,
                overflow: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                backfaceVisibility: 'hidden'
              }}
            >
              {terminalStage === 'powerOn' && (
                <div style={{ fontSize: isMobile ? '0.6rem' : '0.8rem' }}>
                  <span className="oled-cursor">█</span>
                </div>
              )}

              {terminalStage === 'boot' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: isMobile ? '0.52rem' : '0.68rem' }}>
                  {bootText.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        color: line === 'READY' ? '#4ADE80' : line.startsWith('$') ? '#BCAC93' : '#D4D4D4',
                        fontWeight: line === 'READY' ? '700' : '400',
                        textShadow: line === 'READY' ? '0 0 6px #4ADE80' : 'none'
                      }}
                    >
                      {line}
                    </div>
                  ))}
                  <span className="oled-cursor">█</span>
                </div>
              )}

              {terminalStage === 'clear' && (
                <div style={{ fontSize: isMobile ? '0.6rem' : '0.8rem' }}>
                  <span className="oled-cursor">█</span>
                </div>
              )}

              {terminalStage !== 'off' && terminalStage !== 'powerOn' && terminalStage !== 'boot' && terminalStage !== 'clear' && (
                <div
                  style={{
                    width: '100%',
                    fontSize: isMobile ? 'clamp(0.5rem, 1.6vw, 0.7rem)' : 'clamp(0.5rem, 0.72vw, 0.82rem)',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  <div>
                    <span style={{ color: '#BCAC93', fontWeight: 'bold' }}>$&nbsp;</span>
                    <span style={{ color: '#F9F9F9', fontWeight: '600' }}>{cmd1Text}</span>
                    {terminalStage === 'cmd1' && <span className="oled-cursor">█</span>}
                  </div>

                  {out1Text && (
                    <div
                      style={{
                        color: '#BCAC93', fontWeight: '800', fontSize: '1.05em',
                        marginTop: '2px', marginBottom: '4px',
                        textShadow: '0 0 8px rgba(188, 172, 147, 0.85)'
                      }}
                    >
                      {out1Text}
                      {terminalStage === 'out1' && <span className="oled-cursor">█</span>}
                    </div>
                  )}

                  {cmd2Text && (
                    <div>
                      <span style={{ color: '#BCAC93', fontWeight: 'bold' }}>$&nbsp;</span>
                      <span style={{ color: '#F9F9F9', fontWeight: '600' }}>{cmd2Text}</span>
                      {terminalStage === 'cmd2' && <span className="oled-cursor">█</span>}
                    </div>
                  )}

                  {out2Text && (
                    <div
                      style={{
                        color: '#BCAC93', fontWeight: '800', fontSize: '1.05em',
                        marginTop: '2px',
                        textShadow: '0 0 8px rgba(188, 172, 147, 0.85)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {out2Text}
                      {terminalStage === 'complete' && <span className="oled-cursor">█</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hero Story Subtitles */}
      <div
        ref={subtitleRef}
        style={{
          position: 'absolute',
          bottom: '10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 30,
          pointerEvents: 'none',
          width: '90%',
          maxWidth: '680px',
          willChange: 'opacity, transform'
        }}
      >
        <h1
          style={{
            fontFamily: "'Array', sans-serif",
            fontSize: isMobile ? '1.8rem' : '2.8rem',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.85)'
          }}
        >
          <span>
            <InteractiveTitle text="SRINIVASAN. S" />
          </span>
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#E0E0E0', fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: 1.6 }}>
          Scroll downward as the developer enters the room.
        </p>
      </div>

      {/* SEAMLESS TV MORPH TRANSITION INTO ABOUT SECTION */}
      <div
        ref={morphRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: '#08080A',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 40
        }}
      />

      {/* Bottom Scroll Down Hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: '#BCAC93',
          fontFamily: "'Fira Code', monospace",
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          animation: 'scrollBounce 2s ease-in-out infinite'
        }}
      >
        <span>SCROLL DOWN</span>
        <ChevronDown size={18} color="#BCAC93" />
      </div>

      {/* Retro OLED CSS Styles */}
      <style>{`
        @keyframes tvOledPowerOn {
          0% { opacity: 0; filter: brightness(3); }
          50% { opacity: 0.8; filter: brightness(1.8); }
          100% { opacity: 1; filter: brightness(1); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        .oled-cursor {
          display: inline-block;
          color: #BCAC93;
          animation: oledBlink 0.7s step-start infinite;
          margin-left: 2px;
          text-shadow: 0 0 8px rgba(188, 172, 147, 0.8);
        }
        @keyframes oledBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
