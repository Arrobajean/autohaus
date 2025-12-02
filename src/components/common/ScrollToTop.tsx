import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzar scroll al inicio usando múltiples métodos para asegurar compatibilidad
    // Ejecutar de forma síncrona primero
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Luego con un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Si Lenis está disponible, también usar su método
      const lenisInstance = (window as any).lenis;
      if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
        lenisInstance.scrollTo(0, { immediate: true });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
