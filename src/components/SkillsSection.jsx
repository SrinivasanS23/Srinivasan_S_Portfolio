import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Terminal, Code, Database } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const SKILLS_DATA = [
  {
    category: 'Cloud & DevOps',
    icon: Cloud,
    skills: [
      { name: 'AWS (VPC, EC2, S3, IAM)', level: 85 },
      { name: 'GitHub Actions & Jenkins', level: 80 },
      { name: 'Docker Containers', level: 75 },
      { name: 'Git & GitHub Workflows', level: 90 }
    ]
  },
  {
    category: 'OS & Scripting',
    icon: Terminal,
    skills: [
      { name: 'Linux Systems & Security', level: 85 },
      { name: 'Bash Shell Scripting', level: 80 }
    ]
  },
  {
    category: 'Development',
    icon: Code,
    skills: [
      { name: 'Python Programming', level: 80 },
      { name: 'Django Framework', level: 75 },
      { name: 'HTML5 & CSS3 Styling', level: 85 },
      { name: 'JavaScript & Web Tech', level: 70 }
    ]
  },
  {
    category: 'Databases',
    icon: Database,
    skills: [
      { name: 'MySQL Query Design', level: 75 }
    ]
  }
];

export default function SkillsSection() {
  return (
    <section id="skills" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ maxWidth: '1480px' }}>
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="EXCELLENCE & MASTERY" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Technical Skills" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* PROMINENT, READABLE SINGLE HORIZONTAL LINE GRID WITH BIGGER BOXES */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.75rem',
            alignItems: 'stretch'
          }}
          className="skills-horizontal-grid"
        >
          {SKILLS_DATA.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="glass-card"
                style={{
                  padding: '2.25rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  height: '100%',
                  minHeight: '360px',
                  borderRadius: '28px'
                }}
              >
                {/* Category Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '1rem'
                  }}
                >
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(188, 172, 147, 0.18)',
                      color: '#BCAC93',
                      flexShrink: 0
                    }}
                  >
                    <CatIcon size={24} color="#BCAC93" />
                  </div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      fontFamily: "'Array', sans-serif"
                    }}
                  >
                    <InteractiveTitle text={cat.category} />
                  </h3>
                </div>

                {/* Prominent Skills Progress Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flexGrow: 1 }}>
                  {cat.skills.map((skill) => (
                    <div key={skill.name}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.92rem',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          marginBottom: '0.45rem'
                        }}
                      >
                        <span>{skill.name}</span>
                        <span style={{ color: '#BCAC93', fontWeight: '800', fontSize: '0.95rem' }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                          style={{
                            height: '100%',
                            backgroundColor: '#BCAC93',
                            borderRadius: '5px',
                            boxShadow: '0 0 12px rgba(188, 172, 147, 0.7)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .skills-horizontal-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .skills-horizontal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
