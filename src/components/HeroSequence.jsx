import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_HERO_FRAMES = 300;

export default function HeroSequence({ heroImages, mobileImages }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dollyRef = useRef(null);
  const morphRef = useRef(null);
  const subtitleRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSubtitle, setShowSubtitle] = useState(true);

  // TV Power & Terminal State
  const [tvPoweredOn, setTvPoweredOn] = useState(false);
  const [terminalStage, setTerminalStage] = useState('off'); // 'off', 'powerOn', 'boot', 'clear', 'cmd1', 'out1', 'cmd2', 'out2', 'complete'
  const [bootText, setBootText] = useState([]);
  const [cmd1Text, setCmd1Text] = useState('');
  const [out1Text, setOut1Text] = useState('');
  const [cmd2Text, setCmd2Text] = useState('');
  const [out2Text, setOut2Text] = useState('');

  // 60 FPS Hardware-Accelerated Lerp Interpolation Refs
  const frameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const lastLoadedFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const scrollProgRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeImages = isMobile && mobileImages && mobileImages.length > 0 ? mobileImages : heroImages;

  // Search for the closest loaded frame to eliminate any black screens or missing visuals
  const getNearestLoadedImage = (primaryImages, fallbackImages, targetIndex) => {
    const list = primaryImages && primaryImages.length > 0 ? primaryImages : fallbackImages;
    if (!list || list.length === 0) return null;

    const target = Math.max(0, Math.min(TOTAL_HERO_FRAMES - 1, Math.round(targetIndex)));

    // 1. Direct hit on target
    if (list[target] && list[target].complete && list[target].naturalWidth > 0) {
      return { img: list[target], index: target };
    }

    // 2. Search outward in primary list
    for (let offset = 1; offset < 40; offset++) {
      const prev = target - offset;
      if (prev >= 0 && list[prev] && list[prev].complete && list[prev].naturalWidth > 0) {
        return { img: list[prev], index: prev };
      }
      const next = target + offset;
      if (next < list.length && list[next] && list[next].complete && list[next].naturalWidth > 0) {
        return { img: list[next], index: next };
      }
    }

    // 3. Fallback to alternate list (e.g. desktop frames if on mobile)
    const fallbackList = fallbackImages && fallbackImages.length > 0 ? fallbackImages : null;
    if (fallbackList) {
      for (let offset = 0; offset < 40; offset++) {
        const prev = target - offset;
        if (prev >= 0 && fallbackList[prev] && fallbackList[prev].complete && fallbackList[prev].naturalWidth > 0) {
          return { img: fallbackList[prev], index: prev };
        }
      }
    }

    // 4. Any loaded frame
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].complete && list[i].naturalWidth > 0) {
        return { img: list[i], index: i };
      }
    }

    return null;
  };

  // Render Frame directly to canvas with aspect-ratio cover
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const match = getNearestLoadedImage(activeImages, isMobile ? heroImages : mobileImages, index);
    if (!match || !match.img) return;
    const img = match.img;

    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    if (imgWidth === 0 || imgHeight === 0) return;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    // Direct draw without clearRect to prevent black flash glitch
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastRenderedFrameRef.current = match.index;
  };

  // High-Performance 60 FPS Animation & Render Loop
  useEffect(() => {
    let isRunning = true;

    const updateLoop = () => {
      if (!isRunning) return;

      const current = frameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      // Smooth buttery lerp convergence
      if (Math.abs(diff) > 0.02) {
        frameRef.current = current + diff * 0.28;
      } else {
        frameRef.current = target;
      }

      const roundedFrame = Math.round(frameRef.current);
      if (roundedFrame !== lastRenderedFrameRef.current) {
        renderFrame(roundedFrame);
      }

      // Smooth Dolly Zoom transform without React state re-render
      if (dollyRef.current) {
        const progress = scrollProgRef.current;
        const zoomProgress = Math.max(0, (progress - 0.93) / 0.07);
        const tvScale = 1 + Math.pow(zoomProgress, 2) * 11;
        const origin = isMobile ? '34% 38%' : '25.5% 37.0%';
        dollyRef.current.style.transform = `scale(${tvScale})`;
        dollyRef.current.style.transformOrigin = origin;
      }

      // Seamless TV morph transition overlay
      if (morphRef.current) {
        const progress = scrollProgRef.current;
        const morphOpacity = Math.min(1, Math.max(0, (progress - 0.97) * 35));
        morphRef.current.style.opacity = morphOpacity;
      }

      // Smooth Subtitle Fade & Float without re-rendering
      if (subtitleRef.current) {
        const progress = scrollProgRef.current;
        const subOpacity = Math.max(0, 1 - progress * 6.5);
        const subY = progress * -30;
        subtitleRef.current.style.opacity = subOpacity;
        subtitleRef.current.style.transform = `translate(-50%, ${subY}px)`;
        subtitleRef.current.style.display = subOpacity <= 0.01 ? 'none' : 'block';
      }

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeImages, isMobile]);

  // Handle Resize and Initial Render
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(Math.round(frameRef.current));
    };

    handleResize();
    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeImages]);

  // GSAP ScrollTrigger Binding
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
      scrub: 0.15,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollProgRef.current = progress;

        const targetFrame = Math.min(
          TOTAL_HERO_FRAMES - 1,
          Math.floor(progress * (TOTAL_HERO_FRAMES - 1))
        );
        targetFrameRef.current = targetFrame;

        // Subtitle visibility
        const shouldShowSubtitle = progress < 0.18;
        setShowSubtitle((prev) => (prev !== shouldShowSubtitle ? shouldShowSubtitle : prev));

        // -------------------------------------------------------------------------
        // STORY TIMING BEATS:
        // 0.00 - 0.73: Room -> Enters -> Sits -> Laptop Opens -> Hands on Keys (TV OFF)
        // 0.73 - 0.75: First Key Press -> TV Powers ON -> Blinking Cursor Only (1.0s Pause)
        // 0.75 - 0.83: Slower Boot Sequence ($ boot, SYSTEM INITIALIZING... -> READY)
        // 0.83 - 0.85: Smooth Screen Clear & 700ms Pause
        // 0.85 - 0.93: Slower Command Typing ($ whoami -> HI I AM SRINIVASAN -> $ profession -> I AM A PYTHON FULL-STACK DEVELOPER)
        // 0.93 - 1.00: Camera Dollies into TV Screen -> Morph into About Section
        // -------------------------------------------------------------------------

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
        } else if (progress >= 0.73 && progress < 0.75) {
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
        } else if (progress >= 0.75 && progress < 0.83) {
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
        } else if (progress >= 0.83 && progress < 0.85) {
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
        } else if (progress >= 0.85) {
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
              prevStage = 'cmd1';
              prevCmd1 = text;
              setTerminalStage('cmd1');
              setCmd1Text(text);
              setOut1Text('');
              setCmd2Text('');
              setOut2Text('');
            }
          } else if (typeProg <= 0.50) {
            const o1 = Math.floor(((typeProg - 0.25) / 0.25) * out1.length);
            const text = out1.slice(0, o1);
            if (prevStage !== 'out1' || prevOut1 !== text) {
              prevStage = 'out1';
              prevOut1 = text;
              setTerminalStage('out1');
              setCmd1Text(cmd1);
              setOut1Text(text);
              setCmd2Text('');
              setOut2Text('');
            }
          } else if (typeProg <= 0.75) {
            const c2 = Math.floor(((typeProg - 0.50) / 0.25) * cmd2.length);
            const text = cmd2.slice(0, c2);
            if (prevStage !== 'cmd2' || prevCmd2 !== text) {
              prevStage = 'cmd2';
              prevCmd2 = text;
              setTerminalStage('cmd2');
              setCmd1Text(cmd1);
              setOut1Text(out1);
              setCmd2Text(text);
              setOut2Text('');
            }
          } else {
            const o2 = Math.floor(((typeProg - 0.75) / 0.25) * out2.length);
            const text = out2.slice(0, o2);
            if (prevStage !== 'complete' || prevOut2 !== text) {
              prevStage = 'complete';
              prevOut2 = text;
              setTerminalStage('complete');
              setCmd1Text(cmd1);
              setOut1Text(out1);
              setCmd2Text(cmd2);
              setOut2Text(text);
            }
          }
        }
      }
    });

    return () => {
      trigger.kill();
    };
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#050505',
                zIndex: 1
              }}
            />

            {/* Layer 2: Glossy OLED Glass Reflection */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 60%)',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            />

            {/* Layer 3: CRT Scanlines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 3px',
                zIndex: 9,
                pointerEvents: 'none',
                opacity: 0.3
              }}
            />

            {/* Layer 4: Screen Edge Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.85) 100%)',
                zIndex: 11,
                pointerEvents: 'none'
              }}
            />

            {/* Layer 5: Terminal Content Mapped to Projected Trapezoid Surface */}
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
                        color: '#BCAC93',
                        fontWeight: '800',
                        fontSize: '1.05em',
                        marginTop: '2px',
                        marginBottom: '4px',
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
                        color: '#BCAC93',
                        fontWeight: '800',
                        fontSize: '1.05em',
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

      {/* Hero Story Subtitles: Smooth Ref-Driven Non-Flickering Fade */}
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
          willChange: 'opacity, transform',
          transition: 'opacity 0.1s linear'
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
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#08080A',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 40
        }}
      />

      {/* Bottom Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
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
          pointerEvents: 'none'
        }}
      >
        <span>SCROLL DOWN</span>
        <ChevronDown size={18} color="#BCAC93" />
      </motion.div>

      {/* Retro OLED CSS Styles */}
      <style>{`
        @keyframes tvOledPowerOn {
          0% { opacity: 0; filter: brightness(3); }
          50% { opacity: 0.8; filter: brightness(1.8); }
          100% { opacity: 1; filter: brightness(1); }
        }
        @keyframes subtleFlicker {
          0% { opacity: 0.97; }
          100% { opacity: 1; }
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
