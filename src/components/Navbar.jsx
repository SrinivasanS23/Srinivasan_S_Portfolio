import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import InteractiveTitle from './InteractiveTitle';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Internship', href: '#internship' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom >= 220) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '1280px',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          background: 'rgba(16, 17, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(188, 172, 147, 0.35)',
          borderRadius: '50px',
          padding: '0.6rem 1.4rem',
          boxShadow: scrolled
            ? '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(188, 172, 147, 0.25)'
            : '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand Logo & Perfectly Fitted Name */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <img
            src="/assets/logo.png"
            alt="Srinivasan Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(188, 172, 147, 0.45)'
            }}
          />
          <span
            style={{
              fontFamily: "'Array', sans-serif",
              fontWeight: '800',
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              display: 'inline-block'
            }}
          >
            <InteractiveTitle text="SRINIVASAN. S" />
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#BCAC93' : '#E0E0E6',
                  backgroundColor: isActive ? 'rgba(188, 172, 147, 0.2)' : 'transparent',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s ease',
                  border: isActive ? '1px solid rgba(188, 172, 147, 0.5)' : '1px solid transparent'
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <a
            href="/Srinivasan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="desktop-resume-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              backgroundColor: '#1C1C1E',
              color: '#FFFFFF',
              borderRadius: '30px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(42, 23, 19, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <FileText size={14} color="#BCAC93" /> Resume
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1A1A1A',
              padding: '4px'
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div
          style={{
            marginTop: '10px',
            background: 'rgba(16, 17, 22, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(188, 172, 147, 0.4)',
            borderRadius: '24px',
            padding: '1.25rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#FFFFFF',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/Srinivasan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.65rem 1rem',
              backgroundColor: '#BCAC93',
              color: '#1C1C1E',
              borderRadius: '16px',
              fontWeight: '700',
              marginTop: '0.5rem'
            }}
          >
            <FileText size={16} /> Download Resume
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .desktop-nav-links { display: none !important; }
          .desktop-resume-btn { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
