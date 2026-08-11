import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const EDUCATION_DATA = [
  {
    degree: 'BCA - DevOps & Automation',
    status: 'Completed in 2026',
    institution: 'Rathinam College of Arts & Science, Coimbatore',
    period: '2023 - 2026',
    score: 'CGPA: 8.35',
    desc: 'Specialized coursework covering Linux & Windows OS Administration, Docker Container Orchestration, AWS Cloud Architectures, Bash Automation Scripting, and Django Full-Stack Web Development.'
  },
  {
    degree: 'HSC (Higher Secondary Certificate)',
    status: 'Graduated in 2023',
    institution: 'PSG Sarvajana Higher Secondary School, Coimbatore',
    period: '2021 - 2023',
    score: 'Score: 92.1%',
    desc: 'Academic foundation in computer science and mathematics. Secured outstanding distinction reflecting academic excellence and consistent learning performance.'
  }
];

export default function EducationSection() {
  return (
    <section id="education" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="ACADEMIC FOUNDATION" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Education Journey" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Timeline Container */}
        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Accent Line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '28px',
              width: '3px',
              background: 'linear-gradient(to bottom, #BCAC93 0%, rgba(188, 172, 147, 0.2) 100%)',
              borderRadius: '2px'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {EDUCATION_DATA.map((edu, idx) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
              >
                {/* Timeline Node */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#1C1C1E',
                    color: '#BCAC93',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(188, 172, 147, 0.4)',
                    flexShrink: 0,
                    zIndex: 2,
                    border: '3px solid #FFFFFF'
                  }}
                >
                  <GraduationCap size={26} />
                </div>

                {/* Timeline Card Content */}
                <div className="glass-card" style={{ flexGrow: 1, padding: '2rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: '800',
                          color: '#FFFFFF',
                          fontFamily: "'Array', sans-serif"
                        }}
                      >
                        <InteractiveTitle text={edu.degree} />
                      </h3>
                      <span style={{ fontSize: '0.9rem', color: '#C4C4CD', fontWeight: '600' }}>
                        <InteractiveTitle text={edu.institution} />
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: "'Fira Code', monospace",
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          backgroundColor: '#BCAC93',
                          color: '#1C1C1E',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        <CheckCircle2 size={14} /> {edu.status}
                      </span>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#BCAC93',
                          fontWeight: '700',
                          marginTop: '0.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <Calendar size={14} /> {edu.period} &bull; {edu.score}
                      </div>
                    </div>
                  </div>

                  <p style={{ color: '#4A4A4A', fontSize: '0.95rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    {edu.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
