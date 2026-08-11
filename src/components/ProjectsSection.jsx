import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Code2 } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const PROJECTS = [
  {
    id: 'sri-makeovers',
    title: 'Sri Makeovers Studio',
    subtitle: 'Full Responsive Bridal & Artistry Client Interface',
    url: 'https://srimakeovers.vercel.app/',
    image: '/assets/sri_makeovers_preview.png',
    tags: ['HTML5 & CSS3', 'Bootstrap 5', 'Responsive UI', 'Vercel Deployment'],
    description: 'Designed and engineered the official web client for Sri Makeovers. Features custom visual layout galleries, client testimonials, service catalogs, and instant click-to-book integration.'
  },
  {
    id: 'ski-rays',
    title: 'SKiI RAYS - Heaven City Kodaikanal',
    subtitle: 'Real Estate & Luxury Villa Community Portal',
    url: 'https://www.skirayshomess.com',
    image: '/assets/ski_rays_preview.png',
    tags: ['HTML5 & CSS3', 'JavaScript', 'AWS S3 Hosting', 'Custom Styling'],
    description: 'Created and deployed the official community portal for Ski Rays Homes Private Limited in Kodaikanal. Highlights luxury flat communities, location maps, and villa specs with seamless responsiveness.'
  },
  {
    id: 'eknow-studios',
    title: 'EKNOW-LUXURY VISUAL STORYTELLING AGENCY',
    subtitle: 'Cinematic Storytelling Interactive Architecture',
    url: 'https://eknow-studios.vercel.app/',
    image: '/assets/eknow_wallpaper.jpeg',
    tags: ['React + Vite', 'GSAP ScrollTrigger', 'Lenis Smooth Scroll', 'Three.js'],
    description: 'Award-inspired interactive storytelling web app utilizing scroll-driven frame playback, smooth momentum dynamics, glassmorphism UI, and cinematic visual pacing.'
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="FEATURED SHOWCASE" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Projects Developed" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Eknow-Inspired Storytelling Full-Width Cards Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {PROJECTS.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ scale: 1.01, y: -6 }}
              className="glass-card"
              style={{
                width: '100%',
                padding: '2.5rem',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Left: Interactive Preview Image with Zoom Effect */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    border: '1px solid rgba(180, 178, 92, 0.3)'
                  }}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }}
                  />
                </motion.div>

                {/* Right: Content Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: "'Fira Code', monospace",
                          fontWeight: '600',
                          backgroundColor: 'rgba(188, 172, 147, 0.15)',
                          color: '#BCAC93',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          border: '1px solid rgba(188, 172, 147, 0.35)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3
                      style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        fontFamily: "'Array', sans-serif"
                      }}
                    >
                      <InteractiveTitle text={proj.title} />
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#BCAC93', fontWeight: '700', marginTop: '0.2rem' }}>
                      <InteractiveTitle text={proj.subtitle} />
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{ color: '#C4C4CD', fontSize: '1rem', lineHeight: '1.6' }}>
                    {proj.description}
                  </p>

                  {/* Link CTA Button */}
                  <div>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '0.8rem 1.8rem' }}
                    >
                      Visit Live Project <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtext Notice */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '1.5rem',
            borderRadius: '20px',
            background: 'rgba(18, 19, 24, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#C4C4CD',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            <Sparkles size={18} color="#BCAC93" />
            Stay tuned for upcoming projects.
          </div>
        </div>
      </div>
    </section>
  );
}
