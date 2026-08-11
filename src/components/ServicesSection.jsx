import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Palette, ArrowUpRight, CheckCircle } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const SERVICES = [
  {
    title: 'Website Development',
    subtitle: 'Custom Modern Web Applications & Cloud Hosting',
    icon: Layout,
    desc: 'From responsive full-stack interfaces to scalable Django backends and AWS cloud deployments. I design and build high-performance web solutions tailored to client needs.',
    features: [
      'Custom React & Full-Stack Architecture',
      'Django & Python REST API Integration',
      'AWS S3 & Cloudflare High-Speed Hosting',
      'SEO Optimization & 60 FPS Performance'
    ]
  },
  {
    title: 'Poster Designing',
    subtitle: 'Visual Media, Branding & Digital Artwork',
    icon: Palette,
    desc: 'Creating striking graphic designs, promotional posters, and visual brand assets that captivate audiences and elevate client brand identity across social media and web platforms.',
    features: [
      'High-Resolution Promotional Posters',
      'Brand Identity & Logo Typography',
      'Social Media Banners & Graphics',
      'Modern Minimal & Cinematic Visual Styles'
    ]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="WHAT I OFFER" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Services Provided" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* 2 Card Parallax Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {SERVICES.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                whileHover={{ rotateY: index === 0 ? 5 : -5, rotateX: -4, y: -10 }}
                style={{ perspective: 1000 }}
                className="glass-card"
              >
                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Top Icon & Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(188, 172, 147, 0.18)',
                        color: '#BCAC93'
                      }}
                    >
                      <ServiceIcon size={32} color="#BCAC93" />
                    </div>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#1C1C1E',
                        color: '#BCAC93'
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        fontFamily: "'Array', sans-serif"
                      }}
                    >
                      <InteractiveTitle text={service.title} />
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#BCAC93', fontWeight: '600', marginTop: '0.25rem' }}>
                      <InteractiveTitle text={service.subtitle} />
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{ color: '#C4C4CD', fontSize: '0.975rem', lineHeight: 1.6 }}>
                    {service.desc}
                  </p>

                  {/* Bullet points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                    {service.features.map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#FFFFFF', fontWeight: '500' }}>
                        <CheckCircle size={16} color="#BCAC93" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Contact CTA button */}
                  <div style={{ marginTop: '1rem' }}>
                    <a
                      href="#contact"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#BCAC93',
                        textDecoration: 'underline'
                      }}
                    >
                      Inquire About {service.title} &rarr;
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
