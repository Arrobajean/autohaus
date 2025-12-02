import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Hook global para activar Lenis (smooth scrolling) en toda la app.
 *
 * - Respeta `prefers-reduced-motion` (no fuerza el smooth si el usuario lo desactiva)
 * - Se monta una sola vez (por componente donde lo uses, normalmente en `App` o layout raíz)
 * - Expone la instancia globalmente para ScrollToTop
 */
const useLenis = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      // Usuarios que prefieren menos animaciones -> scroll nativo
      return;
    }

    // Desactivar Lenis en móviles (solo activar en escritorio)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });

    // Exponer la instancia globalmente para que ScrollToTop pueda acceder
    (window as any).lenis = lenis;

    let frameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);
};

export { useLenis };
export default useLenis;
