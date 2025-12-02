import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type NavigationItem = {
  label: string;
  pagePath: string;
};

const useNavigationLogic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isBlogPage = location.pathname.startsWith("/blog");
  const isServicesPage = location.pathname === "/servicios";
  const isContactPage = location.pathname === "/contacto";
  const isCompanyPage = location.pathname === "/nosotros";
  const isLegalPage =
    location.pathname.startsWith("/aviso-legal") ||
    location.pathname.startsWith("/politica-privacidad") ||
    location.pathname.startsWith("/politica-cookies");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (isHomePage) {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${sectionId}`);
      }
    },
    [isHomePage, navigate]
  );

  const handleNavigation = useCallback(
    (item: NavigationItem) => {
      navigate(item.pagePath);
    },
    [navigate]
  );

  const isNavVisible = useMemo(
    () =>
      isScrolled ||
      isBlogPage ||
      isServicesPage ||
      isContactPage ||
      isCompanyPage ||
      isLegalPage,
    [
      isScrolled,
      isBlogPage,
      isServicesPage,
      isContactPage,
      isCompanyPage,
      isLegalPage,
    ]
  );

  const logoSrc = "/images/logo/logo_autohaus2.png";

  return {
    // state
    isScrolled,
    // derived
    isNavVisible,
    isLegalPage,
    // actions
    handleNavigation,
    scrollToSection,
    // assets
    logoSrc,
  };
};

export default useNavigationLogic;
