import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Instagram, Github } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappText = `Hello Srinivasan,%0A%0AI came across your portfolio and I'm interested in your Website Development services.%0A%0AMy Name: ${encodeURIComponent(name || 'Client')}%0AMy Email: ${encodeURIComponent(email || 'N/A')}%0AMessage: ${encodeURIComponent(message || 'I would like to discuss my project with you.')}%0A%0AThank you.`;

    const whatsappUrl = `https://wa.me/918870798720?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="section-full" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-subtitle">
            <InteractiveTitle text="FOR WEBSITE DEVELOPMENT SERVICES" />
          </span>
          <h2 className="section-title">
            <InteractiveTitle text="Get In Touch" />
          </h2>
          <div className="section-line"></div>
        </div>

        {/* Contact Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Direct Methods & Glowing Social Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
          >
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fontFamily: "'Array', sans-serif",
                  marginBottom: '0.75rem'
                }}
              >
                <InteractiveTitle text="Let's discuss your next digital product." />
              </h3>
              <p style={{ color: '#C4C4CD', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Whether you need a high-converting website, full-stack web application, or cloud deployment assistance, feel free to drop a message or reach out on WhatsApp.
              </p>

              {/* Direct Info list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <a
                  href="mailto:srinivasan.sriraman2346@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(188, 172, 147, 0.18)',
                      color: '#BCAC93'
                    }}
                  >
                    <Mail size={22} color="#BCAC93" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888894', display: 'block', fontWeight: '600' }}>
                      WRITE EMAIL
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                      srinivasan.sriraman2346@gmail.com
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+918870798720"
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(188, 172, 147, 0.18)',
                      color: '#BCAC93'
                    }}
                  >
                    <Phone size={22} color="#BCAC93" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888894', display: 'block', fontWeight: '600' }}>
                      CALL DIRECT
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                      +91 88707 98720
                    </span>
                  </div>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(188, 172, 147, 0.18)',
                      color: '#BCAC93'
                    }}
                  >
                    <MapPin size={22} color="#BCAC93" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888894', display: 'block', fontWeight: '600' }}>
                      BASE LOCATION
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                      Coimbatore, Tamil Nadu, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing Circular Social Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {[
                { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/srinivasan-s-0784282a9/' },
                { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/_codewidsrini_' },
                { name: 'GitHub', icon: Github, url: 'https://github.com/SrinivasanS23' },
                { name: 'WhatsApp', icon: MessageSquare, url: 'https://wa.me/918870798720' }
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -4 }}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#1C1C1E',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(188, 172, 147, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon size={22} color="#BCAC93" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: WhatsApp Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card"
            style={{ padding: '2.5rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '1.5rem', fontFamily: "'Array', sans-serif" }}>
              <InteractiveTitle text="Send Project Inquiry" />
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                  Project Details / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello Srinivasan, I would like to discuss a website development project..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Send via WhatsApp <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
