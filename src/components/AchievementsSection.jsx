import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Sparkles } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const ACHIEVEMENTS = [
  {
    title: 'Infosys BPM Skill Development Program',
    badge: '#1 Overall Winner',
    icon: Trophy,
    desc: 'Secured overall 1st place in the skill development event conducted by Infosys BPM, demonstrating exceptional problem-solving and software execution skills.'
  },
  {
    title: 'Academic Class Topper',
    badge: '#3 Overall Rank',
    icon: Star,
    desc: 'Maintained consistent academic distinction, securing 3rd place overall class topper throughout BCA degree academics.'
  }
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="HONORS & RECOGNITION" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Co-Curricular Achievements" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* 2 Column Card Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {ACHIEVEMENTS.map((ach, idx) => {
            const AchIcon = ach.icon;
            return (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card"
                style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      backgroundColor: '#1C1C1E',
                      color: '#BCAC93'
                    }}
                  >
                    <AchIcon size={28} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      backgroundColor: '#BCAC93',
                      color: '#1C1C1E',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(188, 172, 147, 0.4)'
                    }}
                  >
                    {ach.badge}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      fontFamily: "'Array', sans-serif"
                    }}
                  >
                    <InteractiveTitle text={ach.title} />
                  </h3>
                </div>

                <p style={{ color: '#C4C4CD', fontSize: '0.975rem', lineHeight: '1.6' }}>
                  {ach.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
