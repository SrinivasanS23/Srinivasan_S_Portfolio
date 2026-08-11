import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FOOT_FRAMES = 300;

export default function FooterSequence({ footImages }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Animation & Interpolation refs for 60 FPS stutter-free rendering
  const frameRef = useRef(TOTAL_FOOT_FRAMES - 1); // Start at last frame (index 299 = 00300.jpg)
  const targetFrameRef = useRef(TOTAL_FOOT_FRAMES - 1);
  const animFrameIdRef = useRef(null);
  const lastRenderedFrameRef = useRef(-1);

  // Render Frame directly to canvas with crisp aspect-ratio cover
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !footImages || footImages.length === 0) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FOOT_FRAMES - 1, Math.round(index)));
    const img = footImages[clampedIndex];
    if (!img) return;
    if (!img.complete) {
      img.onload = () => renderFrame(index);
      return;
    }

    const ctx = canvas.getContext('2d');
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
    lastRenderedFrameRef.current = clampedIndex;
  };

  // High-performance 60 FPS render loop with smooth frame interpolation
  useEffect(() => {
    let isRunning = true;

    const updateLoop = () => {
      if (!isRunning) return;

      // Smooth lerp interpolation between current frame and target frame to eliminate stutter
      const current = frameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        // Fast yet buttery-smooth convergence
        frameRef.current = current + diff * 0.22;
      } else {
        frameRef.current = target;
      }

      const roundedFrame = Math.round(frameRef.current);
      if (roundedFrame !== lastRenderedFrameRef.current) {
        renderFrame(roundedFrame);
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
  }, [footImages]);

  // Handle Resize
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [footImages]);

  // ScrollTrigger for Reverse Sequence Playback (300 -> 1) & Seamless Thanks Card Reveal
  useEffect(() => {
    if (!footImages || footImages.length === 0) return;

    const container = containerRef.current;

    // Start with last frame rendered (index 299 = 00300.jpg)
    frameRef.current = TOTAL_FOOT_FRAMES - 1;
    targetFrameRef.current = TOTAL_FOOT_FRAMES - 1;
    renderFrame(TOTAL_FOOT_FRAMES - 1);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.4, // Smooth scrub synchronization
      refreshPriority: -1,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);

        // Phase 1 (progress 0.00 -> 0.75): Reverse frame sequence (300 -> 1)
        // Phase 2 (progress 0.75 -> 1.00): Frame stays locked at 1 (index 0) while Thanks Card smoothly reveals
        if (progress <= 0.75) {
          const normProgress = Math.min(1, Math.max(0, progress / 0.75));
          // Exactly maps from index 299 (00300.jpg) down to index 0 (00001.jpg)
          const target = (1 - normProgress) * (TOTAL_FOOT_FRAMES - 1);
          targetFrameRef.current = Math.max(0, Math.min(TOTAL_FOOT_FRAMES - 1, target));
        } else {
          // Reached final frame (00001.jpg) -> hold firmly at index 0
          targetFrameRef.current = 0;
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [footImages]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Card Reveal Calculation: strictly appears ONLY AFTER animation reaches final frame 00001.jpg (progress >= 0.75)
  const cardRevealProgress = scrollProgress >= 0.75
    ? Math.min(1, Math.max(0, (scrollProgress - 0.75) / 0.25))
    : 0;

  // Smooth easing for opacity, upward translation, and subtle scaling
  const cardOpacity = Math.pow(cardRevealProgress, 1.2);
  const cardTranslateY = (1 - cardRevealProgress) * 35;
  const cardScale = 0.95 + cardRevealProgress * 0.05;

  return (
    <footer
      ref={containerRef}
      id="ending"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000',
        zIndex: 5
      }}
    >
      {/* Reverse Ending Frame Sequence Canvas */}
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

      {/* Fade to Black Finale Overlay & Seamless Thanks Card Reveal (Only after frame 00001.jpg) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          opacity: cardOpacity,
          zIndex: 30,
          pointerEvents: scrollProgress >= 0.88 ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          willChange: 'opacity, transform'
        }}
      >
        <div
          style={{
            transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
            transition: 'transform 0.05s linear',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '960px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {/* Sparkles Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Sparkles size={40} color="#FFD700" style={{ marginBottom: '1.25rem' }} />
          </motion.div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Array', sans-serif",
              fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
              textAlign: 'center',
              textShadow: '0 0 30px rgba(255,215,0,0.35)'
            }}
          >
            <InteractiveTitle text="Thanks for Visiting" />
          </h1>

          {/* Author Name without Tagline */}
          <p style={{ color: '#FFFFFF', fontSize: '1.35rem', fontFamily: "'Array', sans-serif", fontWeight: '700', marginTop: '0.4rem', letterSpacing: '0.04em' }}>
            <InteractiveTitle text="Srinivasan. S" />
          </p>

          {/* Replay Button */}
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToTop}
              className="btn-primary"
              style={{ padding: '0.9rem 2.2rem', cursor: 'pointer' }}
            >
              Replay Experience <RefreshCw size={18} />
            </motion.button>
          </div>

          {/* Copyright */}
          <div style={{ marginTop: '4rem', fontSize: '0.85rem', color: '#666666', fontFamily: "'Fira Code', monospace" }}>
            &copy; 2026 SRINIVASAN. S &bull; ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
