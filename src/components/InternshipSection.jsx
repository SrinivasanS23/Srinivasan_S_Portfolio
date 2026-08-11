import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const INTERNSHIP_DETAILS = {
  role: 'Python Full-Stack Developer Intern',
  company: 'Pumo Technovation Pvt Ltd',
  period: '2024 (Internship)',
  location: 'Coimbatore, India',
  bullets: [
    'Assisted in deploying complex Django-based web applications on AWS EC2 & S3 cloud infrastructure.',
    'Supported Linux-based server setup, user management permissions, system services configuration, and troubleshooting.',
    'Applied Git & GitHub workflows for collaborative codebase management and feature branch version control.',
    'Integrated automated test scripts and gained hands-on experience configuring CI/CD pipeline triggers.',
    'Participated proactively in agile software development lifecycles and sprint release deliveries.'
  ]
};

export default function InternshipSection() {
  return (
    <section id="internship" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="PROFESSIONAL EXPERIENCE" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Internship Experience" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Glass Card Internship Detail */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card"
            style={{ padding: '2.5rem' }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderBottom: '1px solid rgba(26,26,26,0.08)',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: '#1C1C1E',
                    color: '#BCAC93'
                  }}
                >
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF', fontFamily: "'Array', sans-serif" }}>
                    <InteractiveTitle text={INTERNSHIP_DETAILS.role} />
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BCAC93', fontWeight: '700', marginTop: '0.2rem' }}>
                    <Building2 size={16} /> <span><InteractiveTitle text={INTERNSHIP_DETAILS.company} /></span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: 'rgba(188, 172, 147, 0.15)',
                  color: '#BCAC93',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(188, 172, 147, 0.35)'
                }}
              >
                <Calendar size={14} color="#BCAC93" /> {INTERNSHIP_DETAILS.period}
              </div>
            </div>

            {/* Bullets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {INTERNSHIP_DETAILS.bullets.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '4px', flexShrink: 0 }}>
                    <CheckCircle2 size={18} color="#BCAC93" />
                  </div>
                  <p style={{ color: '#C4C4CD', fontSize: '1rem', lineHeight: '1.6' }}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
