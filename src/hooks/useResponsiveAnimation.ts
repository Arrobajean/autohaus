import { useState, useEffect } from "react";

interface AnimationTiming {
  h1: { duration: number; delay: number };
  subtitle: { duration: number; delay: number };
  buttons: { duration: number; delay: number };
  primaryButton: { duration: number; delay: number };
  secondaryButton: { duration: number; delay: number };
}

export const useResponsiveAnimation = (): AnimationTiming => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    h1: {
      duration: isMobile ? 0.6 : 0.8,
      delay: isMobile ? 0.1 : 0.2,
    },
    subtitle: {
      duration: isMobile ? 0.5 : 0.7,
      delay: isMobile ? 0.25 : 0.4,
    },
    buttons: {
      duration: isMobile ? 0.4 : 0.6,
      delay: isMobile ? 0.4 : 0.6,
    },
    primaryButton: {
      duration: isMobile ? 0.4 : 0.5,
      delay: isMobile ? 0.55 : 0.8,
    },
    secondaryButton: {
      duration: isMobile ? 0.4 : 0.5,
      delay: isMobile ? 0.7 : 0.95,
    },
  };
};
