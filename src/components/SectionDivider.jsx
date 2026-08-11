import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

export default function SectionDivider() {
  return (
    <div
      style={{
        position: 'relative',
        padding: '5rem 0',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #08080A 0%, #121318 50%, #08080A 100%)',
        borderTop: '1px solid rgba(188, 172, 147, 0.2)',
        borderBottom: '1px solid rgba(188, 172, 147, 0.2)',
        zIndex: 10
      }}
    >
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 5 }}>
        {/* Floating Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Fira Code', monospace",
            fontSize: '0.85rem',
            color: '#BCAC93',
            background: 'rgba(188, 172, 147, 0.12)',
            padding: '6px 18px',
            borderRadius: '30px',
            border: '1px solid rgba(188, 172, 147, 0.4)',
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(188, 172, 147, 0.25)'
          }}
        >
          <Sparkles size={16} /> <InteractiveTitle text="CORE TECHNICAL PHILOSOPHY" />
        </motion.div>

        {/* Large Typographic Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: "'Array', sans-serif",
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            maxWidth: '1000px',
            margin: '0 auto',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}
        >
          <InteractiveTitle text="Bridging Robust" />{' '}
          <span style={{ color: '#BCAC93', textShadow: '0 0 25px rgba(188,172,147,0.6)' }}>
            <InteractiveTitle text="Backend Architectures" />
          </span>{' '}
          <InteractiveTitle text="& Automated Cloud Pipelines" />
        </motion.h2>

        {/* Animated Marquee Ribbon */}
        <div style={{ marginTop: '2.5rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            style={{
              display: 'inline-flex',
              gap: '3rem',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#C4C4CD'
            }}
          >
            <span>&bull; PYTHON FULL-STACK</span>
            <span>&bull; DJANGO REST APIS</span>
            <span>&bull; AWS CLOUD AUTOMATION</span>
            <span>&bull; DOCKER CONTAINERS</span>
            <span>&bull; BASH AUTOMATION</span>
            <span>&bull; MYSQL SECURITY</span>
            <span>&bull; PYTHON FULL-STACK</span>
            <span>&bull; DJANGO REST APIS</span>
            <span>&bull; AWS CLOUD AUTOMATION</span>
            <span>&bull; DOCKER CONTAINERS</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
