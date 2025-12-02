import { useState, useEffect, useCallback, useMemo } from "react";

interface HeroImage {
  src: string;
  alt: string;
}

export const useHeroImages = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const heroImages = useMemo(
    () => [
      {
        src: "/images/UI/hero.png",
        alt: "AutoHaus - Concesionario de Vehículos en Madrid",
      },
    ],
    []
  );

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = heroImages.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 1) {
        setIsFirstImageLoaded(true);
      }
      if (loadedCount === totalImages) {
        setAllImagesLoaded(true);
      }
    };

    // Preload all images immediately
    heroImages.forEach((image) => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.src = image.src;
    });

    // Start slider after a short delay
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  return {
    heroImages,
    currentSlide,
    isFirstImageLoaded,
    allImagesLoaded,
    handleSlideChange,
  };
};
