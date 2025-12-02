/**
 * Performance Optimization Utilities for AutoHaus
 * Focuses on improving Core Web Vitals and overall page performance
 */

// Image optimization utilities
export const optimizeImage = (
  src: string,
  width: number,
  quality: number = 80
): string => {
  // Add WebP format support and responsive sizing
  if (src.includes("unsplash.com")) {
    return `${src}&w=${width}&q=${quality}&fm=webp`;
  }

  // For local images, ensure proper sizing
  if (src.startsWith("/images/")) {
    return src;
  }

  return src;
};

// Lazy loading utility for images
export const lazyLoadImage = (element: HTMLImageElement, src: string): void => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  observer.observe(element);
};

// Preload critical resources
export const preloadCriticalResources = (): void => {
  // Preload logo
  const logo = new Image();
  logo.src = "/images/logo/autohaus.png";

  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap";
  fontLink.as = "style";
  document.head.appendChild(fontLink);
};

// Performance monitoring
export const measurePerformance = (): void => {
  // Measure Core Web Vitals
  if ("PerformanceObserver" in window) {
    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);

        // Send to analytics if needed
        if (lastEntry.startTime < 2500) {
          console.log("✅ LCP is good");
        } else {
          console.log("⚠️ LCP needs improvement");
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime);

          const fid = entry.processingStart - entry.startTime;
          if (fid < 100) {
            console.log("✅ FID is good");
          } else {
            console.log("⚠️ FID needs improvement");
          }
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log("CLS:", clsValue);

        if (clsValue < 0.1) {
          console.log("✅ CLS is good");
        } else {
          console.log("⚠️ CLS needs improvement");
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("Performance monitoring not supported:", e);
    }
  }
};

// Resource hints for better performance
export const addResourceHints = (): void => {
  const hints = [
    { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
    { rel: "dns-prefetch", href: "//fonts.gstatic.com" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
  ];

  hints.forEach(({ rel, href, crossorigin }) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (crossorigin) link.setAttribute("crossorigin", crossorigin);
    document.head.appendChild(link);
  });
};

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image compression utility
export const compressImage = async (
  file: File,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          resolve(blob!);
        },
        "image/webp",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
    } catch (error) {
      console.log("Service Worker registration failed:", error);
    }
  }
};

// Initialize performance optimizations
export const initPerformanceOptimizations = (): void => {
  // Add resource hints
  addResourceHints();

  // Preload critical resources
  preloadCriticalResources();

  // Measure performance
  measurePerformance();

  // Register service worker
  registerServiceWorker();

  console.log("🚀 Performance optimizations initialized");
};

export default {
  optimizeImage,
  lazyLoadImage,
  preloadCriticalResources,
  measurePerformance,
  addResourceHints,
  debounce,
  throttle,
  compressImage,
  registerServiceWorker,
  initPerformanceOptimizations,
};
