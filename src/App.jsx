import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { useSequencePreloader } from './hooks/useSequencePreloader';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroSequence from './components/HeroSequence';
import AboutSection from './components/AboutSection';
import SectionDivider from './components/SectionDivider';
import SkillsSection from './components/SkillsSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import InternshipSection from './components/InternshipSection';
import CertificationsSection from './components/CertificationsSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import FooterSequence from './components/FooterSequence';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  const { isLoaded, progress, heroImages, mobileImages, footImages } = useSequencePreloader();
  const [started, setStarted] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#08080A', color: '#FFFFFF' }}>
      {/* Interactive Cosmic Space Stars & Floating Planets */}
      <ParticleBackground />

      {/* Background Ambient Glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {/* Preloader Screen */}
      <AnimatePresence>
        {!started && (
          <Preloader
            progress={progress}
            isLoaded={isLoaded}
            onStart={() => setStarted(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Portfolio Content */}
      <div style={{ opacity: started ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: started ? 'auto' : 'none' }}>
        <Navbar />
        <HeroSequence heroImages={heroImages} mobileImages={mobileImages} />
        <AboutSection />
        <SectionDivider />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <EducationSection />
        <InternshipSection />
        <CertificationsSection />
        <AchievementsSection />
        <ContactSection />
        <FooterSequence footImages={footImages} />
      </div>
    </div>
  );
}
