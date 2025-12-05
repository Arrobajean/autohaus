import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const WHITE_BACKGROUND_PAGES = [
  "/coches",
  "/servicios",
  "/nosotros",
  "/contacto",
];

const MOBILE_BREAKPOINT = 768;

export const useNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth >= MOBILE_BREAKPOINT
      : false
  );
  const navRef = useRef<HTMLElement | null>(null);

  const isWhitePage =
    WHITE_BACKGROUND_PAGES.includes(location.pathname) ||
    location.pathname.startsWith("/coches/");

  // Medir altura real del header y exponerla como variable CSS
  useEffect(() => {
    const updateHeaderHeight = () => {
      const h = navRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Detect current viewport to apply fade-in only on md+ (tablet / desktop)
  useEffect(() => {
    const updateIsMdUp = () => {
      if (typeof window === "undefined") return;
      setIsMdUp(window.innerWidth >= MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", updateIsMdUp);
    return () => window.removeEventListener("resize", updateIsMdUp);
  }, []);

  // Detect scroll to change nav colors (when white gradient starts appearing)
  useEffect(() => {
    const handleScroll = () => {
      // En páginas blancas, siempre mostrar negro. En home, cambiar cuando aparece el degradado
      if (isWhitePage) {
        setIsScrolled(true);
      } else {
        // El hero tiene 100vh en móvil y 130vh en desktop
        // El degradado empieza a ser visible alrededor del 50-75% del hero
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const heroHeight = isMobile
          ? window.innerHeight * 1.0 // Móvil: 100vh
          : window.innerHeight * 1.3; // Desktop: 130vh
        const triggerPoint = isMobile
          ? heroHeight * 0.5 // Móvil: cambia al 50% del hero
          : heroHeight * 0.75; // Desktop: cambia al 75% del hero

        setIsScrolled(window.scrollY > triggerPoint);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isWhitePage]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    // Refs
    navRef,
    // State
    mobileMenuOpen,
    isScrolled,
    isMdUp,
    isWhitePage,
    // Actions
    toggleMobileMenu,
    closeMobileMenu,
    handleLogoClick,
    // Location
    pathname: location.pathname,
  };
};
