import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_HERO_FRAMES = 300;

export default function HeroSequence({ heroImages, mobileImages }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // TV Power & Terminal State Machine
  const [tvPoweredOn, setTvPoweredOn] = useState(false);
  const [terminalStage, setTerminalStage] = useState('off'); // 'off', 'powerOn', 'boot', 'clear', 'cmd1', 'out1', 'cmd2', 'out2', 'complete'
  const [bootText, setBootText] = useState([]);
  const [cmd1Text, setCmd1Text] = useState('');
  const [out1Text, setOut1Text] = useState('');
  const [cmd2Text, setCmd2Text] = useState('');
  const [out2Text, setOut2Text] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeImages = isMobile && mobileImages && mobileImages.length > 0 ? mobileImages : heroImages;

  // Render Canvas Frame
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeImages || !activeImages[index]) return;
    const ctx = canvas.getContext('2d');
    const img = activeImages[index];

    if (!img.complete) {
      img.onload = () => renderFrame(index);
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

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

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrameIndex);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeImages, currentFrameIndex]);

  useEffect(() => {
    renderFrame(currentFrameIndex);
  }, [currentFrameIndex, activeImages]);

  // GSAP ScrollTrigger Binding with Cinematic Timing
  useEffect(() => {
    if (!activeImages || activeImages.length === 0) return;

    const container = containerRef.current;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=600%',
      pin: true,
      scrub: 0.2,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        const targetFrame = Math.min(
          TOTAL_HERO_FRAMES - 1,
          Math.floor(progress * (TOTAL_HERO_FRAMES - 1))
        );
        setCurrentFrameIndex(targetFrame);
        renderFrame(targetFrame);

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
          setTvPoweredOn(false);
          setTerminalStage('off');
          setBootText([]);
          setCmd1Text('');
          setOut1Text('');
          setCmd2Text('');
          setOut2Text('');
        } else if (progress >= 0.73 && progress < 0.75) {
          setTvPoweredOn(true);
          setTerminalStage('powerOn');
          setBootText([]);
          setCmd1Text('');
          setOut1Text('');
          setCmd2Text('');
          setOut2Text('');
        } else if (progress >= 0.75 && progress < 0.83) {
          setTvPoweredOn(true);
          setTerminalStage('boot');
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
          setBootText(bootLines.slice(0, visibleCount));
          setCmd1Text('');
          setOut1Text('');
          setCmd2Text('');
          setOut2Text('');
        } else if (progress >= 0.83 && progress < 0.85) {
          setTvPoweredOn(true);
          setTerminalStage('clear');
          setBootText([]);
          setCmd1Text('');
          setOut1Text('');
          setCmd2Text('');
          setOut2Text('');
        } else if (progress >= 0.85) {
          setTvPoweredOn(true);
          setBootText([]);
          const typeProg = Math.min(1, (progress - 0.85) / 0.08);

          const cmd1 = "whoami";
          const out1 = "HI I AM SRINIVASAN";
          const cmd2 = "profession";
          const out2 = "I AM A PYTHON FULL-STACK\nDEVELOPER";

          if (typeProg <= 0.25) {
            setTerminalStage('cmd1');
            const c1 = Math.floor((typeProg / 0.25) * cmd1.length);
            setCmd1Text(cmd1.slice(0, c1));
            setOut1Text('');
            setCmd2Text('');
            setOut2Text('');
          } else if (typeProg <= 0.50) {
            setCmd1Text(cmd1);
            setTerminalStage('out1');
            const o1 = Math.floor(((typeProg - 0.25) / 0.25) * out1.length);
            setOut1Text(out1.slice(0, o1));
            setCmd2Text('');
            setOut2Text('');
          } else if (typeProg <= 0.75) {
            setCmd1Text(cmd1);
            setOut1Text(out1);
            setTerminalStage('cmd2');
            const c2 = Math.floor(((typeProg - 0.50) / 0.25) * cmd2.length);
            setCmd2Text(cmd2.slice(0, c2));
            setOut2Text('');
          } else {
            setCmd1Text(cmd1);
            setOut1Text(out1);
            setCmd2Text(cmd2);
            setTerminalStage('complete');
            const o2 = Math.floor(((typeProg - 0.75) / 0.25) * out2.length);
            setOut2Text(out2.slice(0, o2));
          }
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [activeImages]);

  // Camera Dolly Zoom pivoting directly on the 3D TV Screen Surface (progress 0.93 -> 1.00)
  const zoomProgress = Math.max(0, (scrollProgress - 0.93) / 0.07);
  const tvScale = 1 + Math.pow(zoomProgress, 2) * 11;
  const morphOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.97) * 35));

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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${tvScale})`,
          transformOrigin: isMobile ? '34% 38%' : '25.5% 37.0%',
          willChange: 'transform',
          transition: 'transform 0.08s linear'
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

        {/* --------------------------------------------------------------------------------------- */}
        {/* 3D PERSPECTIVE TRAPEZOID MAPPED TERMINAL SURFACE                                        */}
        {/* Mapped to the 4 corners of the physical TV display quad (TL, TR, BR, BL)                 */}
        {/* Top-Left: (19.4%, 28.5%) | Top-Right: (31.6%, 28.2%) | BR: (31.4%, 45.4%) | BL: (19.6%, 45.8%) */}
        {/* --------------------------------------------------------------------------------------- */}
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
              // 3D Perspective matrix projection matching the camera angle & trapezoidal slant
              transform: isMobile
                ? 'none'
                : 'rotateY(10deg) rotateX(-1.5deg) skewY(-1deg)',
              // Polygon clipping forming the exact trapezoid surface of the OLED screen
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

            {/* Layer 3: CRT Scanlines (Subtle) */}
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
                animation: 'subtleFlicker 0.2s infinite alternate'
              }}
            >
              {/* STAGE 1: POWER ON BLINKING CURSOR ONLY FOR 1.0s PAUSE */}
              {terminalStage === 'powerOn' && (
                <div style={{ fontSize: isMobile ? '0.6rem' : '0.8rem' }}>
                  <span className="oled-cursor">█</span>
                </div>
              )}

              {/* STAGE 2: BOOT SEQUENCE ($ boot, SYSTEM INITIALIZING...) */}
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

              {/* STAGE 3: CLEAR PAUSE */}
              {terminalStage === 'clear' && (
                <div style={{ fontSize: isMobile ? '0.6rem' : '0.8rem' }}>
                  <span className="oled-cursor">█</span>
                </div>
              )}

              {/* STAGE 4: COMMAND TYPING ($ whoami & $ profession) */}
              {terminalStage !== 'off' && terminalStage !== 'powerOn' && terminalStage !== 'boot' && terminalStage !== 'clear' && (
                <div
                  style={{
                    width: '100%',
                    fontSize: isMobile ? 'clamp(0.5rem, 1.6vw, 0.7rem)' : 'clamp(0.5rem, 0.72vw, 0.82rem)',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  {/* $ whoami */}
                  <div>
                    <span style={{ color: '#BCAC93', fontWeight: 'bold' }}>$&nbsp;</span>
                    <span style={{ color: '#F9F9F9', fontWeight: '600' }}>{cmd1Text}</span>
                    {terminalStage === 'cmd1' && <span className="oled-cursor">█</span>}
                  </div>

                  {/* HI I AM SRINIVASAN */}
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

                  {/* $ profession */}
                  {cmd2Text && (
                    <div>
                      <span style={{ color: '#BCAC93', fontWeight: 'bold' }}>$&nbsp;</span>
                      <span style={{ color: '#F9F9F9', fontWeight: '600' }}>{cmd2Text}</span>
                      {terminalStage === 'cmd2' && <span className="oled-cursor">█</span>}
                    </div>
                  )}

                  {/* I AM A PYTHON FULL-STACK DEVELOPER */}
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

      {/* Hero Story Subtitles */}
      <AnimatePresence>
        {scrollProgress < 0.20 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: isMobile ? '16%' : '14%',
              right: isMobile ? '5%' : '8%',
              maxWidth: '550px',
              color: '#FFFFFF',
              zIndex: 10,
              textAlign: 'right',
              pointerEvents: 'none'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#BCAC93',
                fontSize: '0.8rem',
                fontFamily: "'Fira Code', monospace",
                marginBottom: '0.75rem',
                background: 'rgba(28, 28, 30, 0.75)',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(188, 172, 147, 0.45)'
              }}
            >
              <Sparkles size={14} /> CINEMATIC STORY EXPERIENCE
            </motion.div>
            <h1
              style={{
                fontFamily: "'Array', sans-serif",
                fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#FFFFFF',
                textShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}
            >
              Crafting Digital<br />
              <span style={{ color: '#BCAC93', textShadow: '0 0 25px rgba(188,172,147,0.6)' }}>
                Masterpieces.
              </span>
            </h1>
            <p style={{ marginTop: '0.5rem', color: '#E0E0E0', fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: 1.6 }}>
              Scroll downward as the developer enters the room.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEAMLESS TV MORPH TRANSITION INTO ABOUT SECTION */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#08080A',
          opacity: morphOpacity,
          pointerEvents: 'none',
          zIndex: 40,
          transition: 'opacity 0.05s linear'
        }}
      />

      {/* Bottom Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: '0.8rem',
          fontFamily: "'Fira Code', monospace",
          zIndex: 10,
          pointerEvents: 'none',
          opacity: scrollProgress > 0.8 ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <span>SCROLL TO ADVANCE MOVIE</span>
        <ChevronDown size={22} color="#BCAC93" />
      </motion.div>

      <style>{`
        @keyframes tvOledPowerOn {
          0% {
            opacity: 0;
            transform: rotateY(10deg) rotateX(-1.5deg) skewY(-1deg) scale(0.96);
            filter: brightness(0.2);
          }
          40% {
            opacity: 0.85;
            filter: brightness(1.5);
          }
          100% {
            opacity: 1;
            transform: rotateY(10deg) rotateX(-1.5deg) skewY(-1deg) scale(1);
            filter: brightness(1);
          }
        }

        @keyframes subtleFlicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.97; }
        }

        .oled-cursor {
          animation: oledBlink 0.75s infinite;
          margin-left: 2px;
          color: #BCAC93;
          font-weight: bold;
        }

        @keyframes oledBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
