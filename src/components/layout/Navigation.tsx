import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import RollingTextButton from "@/components/common/RollingTextButton";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { IoLogoWhatsapp, IoMail } from "react-icons/io5";

// Skip link component for accessibility
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-md focus:shadow-lg"
  >
    Saltar al contenido principal
  </a>
);

const navigationItems = [
  { label: "Coches", pagePath: "/coches" },
  { label: "Servicios", pagePath: "/servicios" },
  { label: "Nosotros", pagePath: "/nosotros" },
  { label: "Contacto", pagePath: "/contacto" },
];

const NavCtaButton = ({ isScrolled = false }: { isScrolled?: boolean }) => (
  <RollingTextButton
    primaryText="Reserva tu cita"
    secondaryText="Pedir cita"
    to="/contacto"
    ariaLabel="Pedir cita"
    backgroundColor={isScrolled ? "bg-black" : "bg-white"}
    textColor={isScrolled ? "text-white" : "text-black"}
    className="px-6 md:px-8"
  />
);

const Navigation = memo(() => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMdUp, setIsMdUp] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth >= 768 : false)
  );
  const { handleWhatsAppClick } = useWhatsApp();

  // Páginas con fondo blanco donde el nav debe ser negro desde el inicio
  const whiteBackgroundPages = ["/coches", "/servicios", "/nosotros", "/contacto"];
  const isWhitePage = whiteBackgroundPages.includes(location.pathname) || location.pathname.startsWith("/coches/");

  // Medir altura real del header y exponerla como variable CSS
  const navRef = useRef<HTMLElement | null>(null);
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
      setIsMdUp(window.innerWidth >= 768);
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
        const isMobile = window.innerWidth < 768;
        const heroHeight = isMobile 
          ? window.innerHeight * 1.0  // Móvil: 100vh
          : window.innerHeight * 1.3; // Desktop: 130vh
        const triggerPoint = isMobile 
          ? heroHeight * 0.5  // Móvil: cambia al 50% del hero
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

  return (
    <>
      <SkipLink />
      <motion.nav
        ref={navRef as any}
        role="navigation"
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isWhitePage 
            ? "bg-white md:bg-transparent md:backdrop-blur-sm border-b border-gray-300 md:border-transparent" 
            : isScrolled 
              ? "bg-white md:bg-transparent md:backdrop-blur-sm border-b border-gray-300 md:border-transparent" 
              : "bg-transparent border-b border-transparent"
        }`}
        initial={isMdUp ? { opacity: 0 } : false}
        animate={isMdUp ? { opacity: 1 } : undefined}
        transition={isMdUp ? { duration: 1.0, delay: 0.1 } : undefined}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 md:py-5 h-[70px] md:h-auto flex items-center">
          {/* Desktop Layout: Logo Left | Links Center | CTA Right */}
          <div className="hidden md:grid md:grid-cols-3 md:items-center w-full">
            {/* Logo - Left */}
            <div className="flex justify-start">
              <Link
                to="/"
                className="flex items-center space-x-2 group"
                onClick={(e) => {
                  // Si ya estamos en la página de inicio, hacer scroll al inicio
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <span
                  className={`text-lg font-semibold tracking-wide transition-colors duration-300 ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                >
                  AutoHaus®
                </span>
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="flex justify-center items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.pagePath}
                  to={item.pagePath}
                  className="text-sm font-normal transition-colors duration-300"
                  style={{
                    color: isScrolled ? "#000000" : "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isScrolled ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isScrolled ? "#000000" : "#ffffff";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Button - Right */}
            <div className="flex justify-end items-center min-w-0">
              <NavCtaButton isScrolled={isScrolled} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-center w-full relative">
            {/* Logo - Centered */}
            <Link
              to="/"
              className="flex items-center space-x-2 absolute left-1/2 -translate-x-1/2 z-[60]"
              onClick={(e) => {
                // Si ya estamos en la página de inicio, hacer scroll al inicio
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <span 
                className={`text-lg font-semibold tracking-wide transition-colors duration-300 ${
                  isScrolled || isWhitePage || mobileMenuOpen ? "text-black" : "text-white"
                }`}
              >
                AutoHaus®
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={`p-2 -mr-2 transition-colors duration-300 absolute right-0 z-[60] ${
                isScrolled || isWhitePage || mobileMenuOpen ? "text-black" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={false}
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                    <motion.path
                      key="close"
                      d="M6 18L18 6M6 6l12 12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                ) : (
                    <motion.g
                      key="menu"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                    </motion.g>
                )}
                </AnimatePresence>
              </motion.svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
                <motion.div
                  className={`fixed inset-0 bg-white backdrop-blur-lg md:hidden z-40 ${
                    isScrolled || isWhitePage ? 'top-[70px]' : 'top-0'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
              />

                {/* Menu Panel */}
                <motion.div 
                  className={`fixed inset-0 md:hidden z-50 pointer-events-none ${
                    isScrolled || isWhitePage ? 'top-[70px]' : 'top-0'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="h-full flex flex-col items-center justify-center px-6 pointer-events-auto">
                    {/* Navigation Links - Centered */}
                    <motion.div 
                      className="flex flex-col items-center space-y-6 mb-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
                    >
                      {navigationItems.map((item, index) => (
                        <motion.div
                          key={item.pagePath}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.15 + (index * 0.05),
                            ease: "easeInOut" 
                          }}
                        >
                      <Link
                        to={item.pagePath}
                            className="text-2xl font-bold text-black hover:text-black/70 transition-colors duration-200 text-center block"
                            onClick={() => setMobileMenuOpen(false)}
                      >
                            {item.label}
                      </Link>
                        </motion.div>
                    ))}
                    </motion.div>

                    {/* CTA Button - Centered */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.35,
                        ease: "easeInOut" 
                      }}
                    >
                      <NavCtaButton isScrolled={false} />
                    </motion.div>

                    {/* Social Links - Bottom */}
                    <motion.div
                      className="absolute bottom-8 left-0 right-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.4,
                        ease: "easeInOut" 
                      }}
                    >
                      <div className="flex justify-center items-center gap-6">
                        {/* WhatsApp */}
                        <button
                          onClick={() => {
                            handleWhatsAppClick();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 text-black hover:text-black/70 transition-colors duration-200"
                          aria-label="Contactar por WhatsApp"
                        >
                          <IoLogoWhatsapp size={24} />
                          <span className="text-sm font-medium">WhatsApp</span>
                        </button>

                        {/* Email */}
                        <a
                          href="mailto:info@autohaus.com"
                          className="flex items-center gap-2 text-black hover:text-black/70 transition-colors duration-200"
                          aria-label="Enviar correo electrónico"
                        >
                          <IoMail size={24} />
                          <span className="text-sm font-medium">Email</span>
                        </a>
                    </div>
                    </motion.div>
                  </div>
                </motion.div>
            </>
          )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
