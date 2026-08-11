import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Preloader({ progress, isLoaded, onStart }) {
  useEffect(() => {
    let autoTimer;
    if (isLoaded) {
      autoTimer = setTimeout(() => {
        onStart();
      }, 1400);
    }

    const handleKeyDown = (e) => {
      if (isLoaded && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(autoTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoaded, onStart]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: '#1C1C1E',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Soft Ambient Sandstone Gold & Deep Bronze Center Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(188, 172, 147, 0.15) 0%, rgba(42, 23, 19, 0.25) 50%, rgba(28, 28, 30, 0) 75%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* TOP HEADER: Editorial Luxury Metadata */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1300px',
          fontSize: '0.8rem',
          fontFamily: "'Array', 'Fira Code', monospace",
          color: 'rgba(255, 255, 255, 0.65)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#BCAC93', boxShadow: '0 0 12px #BCAC93' }} />
          <span style={{ color: '#FFFFFF', fontWeight: '800', letterSpacing: '0.05em' }}>SRINIVASAN. S</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span style={{ color: '#BCAC93' }}>PORTFOLIO 2026</span>
        </div>

        <div style={{ opacity: 0.8, letterSpacing: '0.12em' }}>
          [ 60 FPS MOTION ]
        </div>
      </div>

      {/* CENTER: GIANT TYPOGRAPHIC NUMERIC COUNTER IN ARRAY FONT */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          margin: 'auto 0'
        }}
      >
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            fontFamily: "'Array', sans-serif",
            color: '#BCAC93',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            padding: '5px 16px',
            borderRadius: '20px',
            background: 'rgba(188, 172, 147, 0.12)',
            border: '1px solid rgba(188, 172, 147, 0.35)'
          }}
        >
          <Sparkles size={13} color="#BCAC93" />
          {isLoaded ? 'EXPERIENCE READY' : 'INITIALIZING ASSETS'}
        </motion.div>

        {/* Giant Array Font Counter */}
        <div
          style={{
            fontFamily: "'Array', sans-serif",
            fontSize: 'clamp(5.5rem, 16vw, 10.5rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'baseline',
            textShadow: '0 0 50px rgba(188, 172, 147, 0.25)'
          }}
        >
          <span>{String(progress).padStart(2, '0')}</span>
          <span style={{ fontSize: '0.45em', color: '#BCAC93', marginLeft: '8px', fontWeight: 800 }}>%</span>
        </div>

        {/* Razor-Thin Glowing Progress Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: '300px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '2rem',
            position: 'relative'
          }}
        >
          <motion.div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#BCAC93',
              boxShadow: '0 0 14px #BCAC93, 0 0 28px rgba(188, 172, 147, 0.5)',
              transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        {/* Minimal Subtext */}
        <div
          style={{
            marginTop: '1.25rem',
            fontSize: '0.85rem',
            fontFamily: "'Outfit', sans-serif",
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.05em'
          }}
        >
          {isLoaded ? (
            <span style={{ color: '#E0E0E0' }}>All visual frames loaded in 60 FPS memory</span>
          ) : (
            <span>Preloading cinematic assets &bull; {progress}%</span>
          )}
        </div>

        {/* Ultra-Chic Pure Gold Enter Button */}
        <div style={{ minHeight: '65px', marginTop: '2rem', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {isLoaded && (
              <motion.button
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.05, backgroundColor: '#FFE247', boxShadow: '0 0 35px rgba(255, 215, 0, 0.8)' }}
                whileTap={{ scale: 0.96 }}
                onClick={onStart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 42px',
                  borderRadius: '40px',
                  backgroundColor: '#FFD700',
                  color: '#08080A',
                  fontFamily: "'Array', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>ENTER PORTFOLIO</span>
                <ArrowRight size={18} color="#08080A" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM FOOTER: Minimalist Coordinates */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1300px',
          fontSize: '0.75rem',
          fontFamily: "'Array', monospace",
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.08em',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div>PYTHON FULL-STACK &bull; DEVOPS</div>
        <div>COIMBATORE, TAMIL NADU</div>
      </div>
    </motion.div>
  );
}
