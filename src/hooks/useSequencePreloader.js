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
    const isMobileClient = typeof window !== 'undefined' && window.innerWidth < 768;

    let loadedCount = 0;
    const heroCache = new Array(TOTAL_HERO_FRAMES);
    const mobileCache = new Array(TOTAL_MOBILE_FRAMES);
    const footCache = new Array(TOTAL_FOOT_FRAMES);

    const finishLoading = () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;
      setHeroImages([...heroCache]);
      setMobileImages([...mobileCache]);
      setFootImages([...footCache]);
      setProgress(100);
      setIsLoaded(true);
    };

    const handleLoad = () => {
      loadedCount++;
      const pct = Math.min(100, Math.floor((loadedCount / 60) * 100));
      setProgress((prev) => Math.max(prev, pct));

      // Show content as soon as first batch of critical frames loaded
      if (loadedCount >= 15 && !isCompletedRef.current) {
        setHeroImages([...heroCache]);
        setMobileImages([...mobileCache]);
        setFootImages([...footCache]);
        setIsLoaded(true);
      }
    };

    // ─── Priority Loading Strategy ───
    // On mobile: Load mobile frames FIRST in sequential batches, defer desktop frames
    // On desktop: Load hero frames FIRST, defer mobile frames

    const primaryPath = isMobileClient ? '/assets/Mobile-trns' : '/assets/Hero-trns';
    const primaryCache = isMobileClient ? mobileCache : heroCache;
    const secondaryPath = isMobileClient ? '/assets/Hero-trns' : '/assets/Mobile-trns';
    const secondaryCache = isMobileClient ? heroCache : mobileCache;
    const primaryTotal = isMobileClient ? TOTAL_MOBILE_FRAMES : TOTAL_HERO_FRAMES;

    // PHASE 1: Load primary frames (the ones visible on this device)
    // Use staggered batch loading: first 50 frames get onload tracking for progress
    for (let i = 1; i <= primaryTotal; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `${primaryPath}/ezgif-frame-${frameNum}.png`;
      img.onload = handleLoad;
      img.onerror = handleLoad;
      primaryCache[i - 1] = img;
    }

    // PHASE 2: Load secondary frames (deferred, no progress tracking)
    // Delay secondary loading on mobile to avoid network contention
    const secondaryDelay = isMobileClient ? 3000 : 500;
    const secondaryTimer = setTimeout(() => {
      const secondaryTotal = isMobileClient ? TOTAL_HERO_FRAMES : TOTAL_MOBILE_FRAMES;
      for (let i = 1; i <= secondaryTotal; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `${secondaryPath}/ezgif-frame-${frameNum}.png`;
        secondaryCache[i - 1] = img;
      }
    }, secondaryDelay);

    // PHASE 3: Load footer frames (lowest priority)
    const footTimer = setTimeout(() => {
      for (let i = 1; i <= TOTAL_FOOT_FRAMES; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `/assets/Foot-trns/ezgif-frame-${frameNum}.png`;
        footCache[i - 1] = img;
      }
      // Update foot images ref
      setFootImages([...footCache]);
    }, isMobileClient ? 5000 : 1500);

    // Expose primary cache immediately so first frame can render
    if (isMobileClient) {
      setMobileImages([...mobileCache]);
    } else {
      setHeroImages([...heroCache]);
    }

    // Fail-safe: finish loading after max timeout
    const failSafe = setTimeout(finishLoading, isMobileClient ? 4000 : 2000);

    return () => {
      clearTimeout(secondaryTimer);
      clearTimeout(footTimer);
      clearTimeout(failSafe);
    };
  }, []);

  return { isLoaded, progress, heroImages, mobileImages, footImages };
}
