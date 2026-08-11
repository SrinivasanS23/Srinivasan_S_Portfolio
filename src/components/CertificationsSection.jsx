import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Terminal, Infinity, Bot, Cloud, Sparkles } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const CERTIFICATIONS = [
  {
    title: 'MVIII TECH - DEVOPS TRAINING',
    provider: 'MVIII Tech (OPC) Pvt Ltd',
    year: '2025',
    icon: Cloud,
    desc: 'Intensive DevOps engineering training covering Docker containerization, CI/CD pipeline automation, Linux administration, and cloud infrastructure deployment.'
  },
  {
    title: 'INTRODUCTION TO GENERATIVE AI - AWS',
    provider: 'Amazon Web Services (AWS)',
    year: '2025',
    icon: Bot,
    desc: 'Foundational certification in Generative AI architectures, Large Language Models (LLMs), prompt engineering, and cloud AI application deployment on AWS.'
  },
  {
    title: 'Certified Python Full-Stack Developer',
    provider: 'Pumo Technovation Pvt Ltd',
    year: '2024',
    icon: Award,
    desc: 'Comprehensive training in Python programming, Django web backend framework, HTML5/CSS3/JS frontend integration, and database management.'
  },
  {
    title: 'Professional Certificate in DevOps',
    provider: 'Udemy',
    year: '2025',
    icon: Infinity,
    desc: 'Professional certification covering containerization with Docker, automated deployment pipelines, and modern cloud DevOps workflows.'
  },
  {
    title: 'Bash Scripting & Shell Automation',
    provider: 'Udemy Certification',
    year: 'Credentials Earned',
    icon: Terminal,
    desc: 'Mastery in Linux command line tools, shell scripts, cron schedule automation, and system administration workflows.'
  }
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="VERIFIED CREDENTIALS" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Certifications" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Dynamic Centered Flex Grid: Top 3 & Bottom 2 Centered */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.75rem',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {CERTIFICATIONS.map((cert, idx) => {
            const CertIcon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card"
                style={{
                  flex: '1 1 350px',
                  maxWidth: '395px',
                  minWidth: '290px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* White Visible Logo Badge */}
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CertIcon size={24} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: "'Fira Code', monospace",
                      fontWeight: '700',
                      color: '#BCAC93',
                      backgroundColor: 'rgba(188, 172, 147, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid rgba(188, 172, 147, 0.3)'
                    }}
                  >
                    {cert.year}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', fontFamily: "'Array', sans-serif", lineHeight: 1.3 }}>
                    <InteractiveTitle text={cert.title} />
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#BCAC93', fontWeight: '700', marginTop: '0.35rem' }}>
                    <InteractiveTitle text={cert.provider} />
                  </p>
                </div>

                <p style={{ color: '#C4C4CD', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {cert.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
