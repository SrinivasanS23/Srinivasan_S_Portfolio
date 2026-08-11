import { useState, useEffect, useRef } from 'react';

const TOTAL_HERO_FRAMES = 300;
const TOTAL_MOBILE_FRAMES = 300;
const TOTAL_FOOT_FRAMES = 300;

export function useSequencePreloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroImages, setHeroImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const [footImages, setFootImages] = useState([]);

  const isCompletedRef = useRef(false);

  useEffect(() => {
    let loadedCount = 0;
    const criticalFrames = 60; // 20 hero + 20 mobile + 20 foot critical frames
    const heroCache = new Array(TOTAL_HERO_FRAMES);
    const mobileCache = new Array(TOTAL_MOBILE_FRAMES);
    const footCache = new Array(TOTAL_FOOT_FRAMES);

    // Smooth fake/real blended ticker for instantaneous, premium UX
    let displayProgress = 0;
    const progressTimer = setInterval(() => {
      if (isCompletedRef.current) {
        displayProgress = 100;
        setProgress(100);
        setIsLoaded(true);
        clearInterval(progressTimer);
        return;
      }

      // Calculate real ratio vs elapsed time
      const targetProg = Math.min(95, Math.floor((loadedCount / criticalFrames) * 95));
      if (displayProgress < targetProg) {
        displayProgress += Math.max(1, Math.floor((targetProg - displayProgress) * 0.3));
      } else if (displayProgress < 85) {
        displayProgress += 1;
      }
      setProgress(displayProgress);
    }, 40);

    const finishLoading = () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;
      setHeroImages(heroCache);
      setMobileImages(mobileCache);
      setFootImages(footCache);
      setProgress(100);
      setIsLoaded(true);
      clearInterval(progressTimer);
    };

    const updateProgress = () => {
      loadedCount++;
      if (loadedCount >= criticalFrames) {
        finishLoading();
      }
    };

    // 1. Prioritize Critical First 30 Frames for Immediate Playback
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Hero-trns/ezgif-frame-${frameNum}.png`;
      if (i <= 30) {
        img.onload = updateProgress;
        img.onerror = updateProgress;
      }
      heroCache[i - 1] = img;
    }

    for (let i = 1; i <= TOTAL_MOBILE_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Mobile-trns/ezgif-frame-${frameNum}.png`;
      if (i <= 15) {
        img.onload = updateProgress;
        img.onerror = updateProgress;
      }
      mobileCache[i - 1] = img;
    }

    for (let i = 1; i <= TOTAL_FOOT_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Foot-trns/ezgif-frame-${frameNum}.png`;
      if (i <= 15 || i >= 285) {
        img.onload = updateProgress;
        img.onerror = updateProgress;
      }
      footCache[i - 1] = img;
    }

    // Fail-safe guarantee: Never hang longer than 2.0s even on 2G connections
    const failSafeTimeout = setTimeout(() => {
      finishLoading();
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(failSafeTimeout);
    };
  }, []);

  return { isLoaded, progress, heroImages, mobileImages, footImages };
}
