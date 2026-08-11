import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, GraduationCap, Github, Download, Trophy, Rocket, Code2, ShieldCheck, Sparkles } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

export default function AboutSection() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [cgpaCount, setCgpaCount] = useState(0);
  const [credentialsCount, setCredentialsCount] = useState(0);

  // Counter roll-up animation effect
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const prog = step / steps;
      setProjectsCount(Math.min(5, Math.floor(prog * 5)));
      setCgpaCount(Number((prog * 8.35).toFixed(2)));
      setCredentialsCount(Math.min(3, Math.floor(prog * 3)));

      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="INTRODUCTION" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="About Me" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Counter Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem'
          }}
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card"
            style={{ padding: '1.75rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#FFFFFF', fontFamily: "'Array', sans-serif" }}>
              {projectsCount}<span>+</span>
            </div>
            <div style={{ color: '#C4C4CD', fontWeight: '600', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Full-Stack &amp; DevOps Projects
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card"
            style={{ padding: '1.75rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#BCAC93', fontFamily: "'Array', sans-serif" }}>
              {cgpaCount} <span style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>CGPA</span>
            </div>
            <div style={{ color: '#C4C4CD', fontWeight: '600', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              BCA DevOps Academic Score
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card"
            style={{ padding: '1.75rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#FFFFFF', fontFamily: "'Array', sans-serif" }}>
              {credentialsCount}<span>+</span>
            </div>
            <div style={{ color: '#C4C4CD', fontWeight: '600', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Industry Certifications
            </div>
          </motion.div>
        </div>

        {/* Main Grid: Floating Trophy Card & Detailed Bio */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left: Floating 3D Trophy Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <motion.div
              whileHover={{ rotateY: 6, rotateX: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="glass-card"
              style={{
                position: 'relative',
                padding: '1.25rem',
                overflow: 'hidden',
                borderRadius: '28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Image Frame perfectly fitted to box with rounded borders */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '480px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#151515',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                }}
              >
                <img
                  src="/assets/sri_trophy.jpg"
                  alt="Srinivasan. S with Trophy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    borderRadius: '20px',
                    display: 'block'
                  }}
                />

                {/* Floating Bio Badge on Image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(18, 19, 24, 0.92)',
                    backdropFilter: 'blur(16px)',
                    padding: '0.9rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(188, 172, 147, 0.45)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ backgroundColor: '#BCAC93', padding: '10px', borderRadius: '12px', color: '#08080A', flexShrink: 0 }}>
                    <Trophy size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                      <InteractiveTitle text="Srinivasan. S" />
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#C4C4CD', margin: '2px 0 0 0' }}>Python Full Stack &amp; DevOps Engineer</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Information Box */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} color="#BCAC93" /> <InteractiveTitle text="Quick Information" />
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4A4540' }}>
                  <MapPin size={16} color="#BCAC93" /> <span>Coimbatore, Tamil Nadu, India</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4A4540' }}>
                  <Mail size={16} color="#BCAC93" />
                  <a href="mailto:srinivasan.sriraman2346@gmail.com" style={{ textDecoration: 'underline' }}>
                    srinivasan.sriraman2346@gmail.com
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4A4540' }}>
                  <GraduationCap size={16} color="#BCAC93" /> <span>BCA DevOps Graduated (2026)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4A4540' }}>
                  <Github size={16} color="#BCAC93" />
                  <a href="https://github.com/SrinivasanS23" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                    github.com/SrinivasanS23
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio & Professional Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(188, 172, 147, 0.15)',
                  color: '#BCAC93',
                  padding: '0.35rem 1rem',
                  borderRadius: '20px',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.825rem',
                  fontWeight: '600',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(188, 172, 147, 0.4)'
                }}
              >
                <Rocket size={14} color="#BCAC93" /> <InteractiveTitle text="MY MISSION" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '1rem', fontFamily: "'Array', sans-serif" }}>
                <InteractiveTitle text="Architecting High-Availability Web Apps & Automated Cloud Infrastructure" />
              </h3>

              <p style={{ color: '#C4C4CD', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                I am a dedicated <strong>Python Full Stack Developer</strong> and <strong>DevOps Engineer</strong> who graduated with a Bachelor of Computer Applications in DevOps &amp; Automation from Coimbatore, Tamil Nadu.
              </p>

              <p style={{ color: '#C4C4CD', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                By combining Python backend frameworks (Django, Flask) with core containerization (Docker, Kubernetes) and AWS cloud automation, I focus on delivering scalable, high-performance web applications with automated deployment pipelines.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a href="/Srinivasan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Download Resume <Download size={18} />
                </a>
                <a href="#contact" className="btn-secondary">
                  Let's Connect &rarr;
                </a>
              </div>
            </div>

            {/* Specialization Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ color: '#BCAC93', marginBottom: '0.5rem' }}>
                  <Code2 size={24} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                  <InteractiveTitle text="Backend Architect" />
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#C4C4CD', marginTop: '0.25rem' }}>
                  Django REST APIs, secure database models, and server logic.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ color: '#BCAC93', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={24} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                  <InteractiveTitle text="DevOps Architect" />
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#C4C4CD', marginTop: '0.25rem' }}>
                  AWS VPC networks, Docker containers, and CI/CD pipelines.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
