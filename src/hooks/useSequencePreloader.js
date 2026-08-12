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
    let heroLoadedCount = 0;
    const heroCache = new Array(TOTAL_HERO_FRAMES);
    const mobileCache = new Array(TOTAL_MOBILE_FRAMES);
    const footCache = new Array(TOTAL_FOOT_FRAMES);

    // Initial critical threshold for quick start (first 25 frames)
    const criticalThreshold = 25;

    const finishLoading = () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;
      setHeroImages(heroCache);
      setMobileImages(mobileCache);
      setFootImages(footCache);
      setProgress(100);
      setIsLoaded(true);
    };

    const handleFrameLoad = () => {
      heroLoadedCount++;
      const pct = Math.min(100, Math.floor((heroLoadedCount / 100) * 100));
      setProgress((prev) => Math.max(prev, pct));

      if (heroLoadedCount >= criticalThreshold && !isCompletedRef.current) {
        // Expose cached arrays so scrubbing works immediately
        setHeroImages(heroCache);
        setMobileImages(mobileCache);
        setFootImages(footCache);
        setIsLoaded(true);
      }
      if (heroLoadedCount >= 90) {
        finishLoading();
      }
    };

    // 1. Preload ALL 300 Hero Frames (Batch Priority)
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Hero-trns/ezgif-frame-${frameNum}.png`;
      img.onload = handleFrameLoad;
      img.onerror = handleFrameLoad;
      heroCache[i - 1] = img;
    }

    // 2. Preload Mobile Frames
    for (let i = 1; i <= TOTAL_MOBILE_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Mobile-trns/ezgif-frame-${frameNum}.png`;
      mobileCache[i - 1] = img;
    }

    // 3. Preload Foot Frames
    for (let i = 1; i <= TOTAL_FOOT_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Foot-trns/ezgif-frame-${frameNum}.png`;
      footCache[i - 1] = img;
    }

    // Fail-safe guarantee: Max 1.8s
    const failSafeTimeout = setTimeout(() => {
      finishLoading();
    }, 1800);

    return () => {
      clearTimeout(failSafeTimeout);
    };
  }, []);

  return { isLoaded, progress, heroImages, mobileImages, footImages };
}
