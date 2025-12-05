import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RollingTextButton from "@/components/common/RollingTextButton";
import { IoLogoWhatsapp, IoMail } from "react-icons/io5";
import { navigationItems } from "./Navigation.constants";
import { useMobileMenu } from "./useMobileMenu";

// Skip link component for accessibility
export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-md focus:shadow-lg"
  >
    Saltar al contenido principal
  </a>
);

export const NavCtaButton = ({
  isScrolled = false,
}: {
  isScrolled?: boolean;
}) => (
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

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  textColor: string;
}

export const MobileMenuButton = ({
  isOpen,
  onClick,
  textColor,
}: MobileMenuButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      className={`p-2 -mr-2 transition-colors duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] absolute right-0 z-[60] ${textColor}`}
      onClick={handleClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      type="button"
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
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
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
  );
};

interface DesktopNavigationProps {
  isScrolled: boolean;
  onLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const DesktopNavigation = ({
  isScrolled,
  onLogoClick,
}: DesktopNavigationProps) => (
  <div className="hidden md:grid md:grid-cols-3 md:items-center w-full">
    {/* Logo - Left */}
    <div className="flex justify-start">
      <Link
        to="/"
        className="flex items-center space-x-2 group"
        onClick={onLogoClick}
      >
        <span
          className={`text-lg font-semibold tracking-wide transition-colors duration-300 ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          AutoHaus
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
            e.currentTarget.style.color = isScrolled
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(255, 255, 255, 0.7)";
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
    <div className="flex justify-end items-center min-w-fit">
      <NavCtaButton isScrolled={isScrolled} />
    </div>
  </div>
);

interface MobileNavigationProps {
  isScrolled: boolean;
  isWhitePage: boolean;
  mobileMenuOpen: boolean;
  onLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMenuToggle: () => void;
}

export const MobileNavigation = ({
  isScrolled,
  isWhitePage,
  mobileMenuOpen,
  onLogoClick,
  onMenuToggle,
}: MobileNavigationProps) => {
  const textColor =
    isScrolled || isWhitePage || mobileMenuOpen ? "text-black" : "text-white";

  return (
    <div className="md:hidden flex items-center justify-center w-full relative">
      {/* Logo - Centered */}
      <Link
        to="/"
        className="flex items-center space-x-2 absolute left-1/2 -translate-x-1/2 z-[60]"
        onClick={onLogoClick}
      >
        <span
          className={`text-lg font-semibold tracking-wide transition-colors duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${textColor}`}
        >
          AutoHaus
        </span>
      </Link>

      {/* Mobile Menu Button */}
      <MobileMenuButton
        isOpen={mobileMenuOpen}
        onClick={onMenuToggle}
        textColor={textColor}
      />
    </div>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  isWhitePage: boolean;
  onClose: () => void;
}

export const MobileMenu = ({
  isOpen,
  isScrolled,
  isWhitePage,
  onClose,
}: MobileMenuProps) => {
  const menuTop = isScrolled || isWhitePage ? "top-[70px]" : "top-0";

  const {
    handleLinkClick,
    handleBackdropClick,
    handleWhatsAppClickWithClose,
    handleEmailClick,
  } = useMobileMenu({ isOpen, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={`fixed inset-0 bg-white backdrop-blur-lg md:hidden z-40 ${menuTop}`}
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Menu Panel */}
          <motion.div
            className={`fixed inset-0 md:hidden z-50 pointer-events-none ${menuTop}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col items-center justify-center px-6 pointer-events-auto">
              {/* Navigation Links - Centered */}
              <motion.div
                className="flex flex-col items-center space-y-6 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: "easeInOut",
                }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.pagePath}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15 + index * 0.05,
                      ease: "easeInOut",
                    }}
                  >
                    <Link
                      to={item.pagePath}
                      className="text-2xl font-bold text-black hover:text-black/70 transition-colors duration-200 text-center block"
                      onClick={handleLinkClick}
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
                  ease: "easeInOut",
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
                  ease: "easeInOut",
                }}
              >
                <div className="flex justify-center items-center gap-6">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppClickWithClose}
                    className="flex items-center gap-2 text-black hover:text-black/70 transition-colors duration-200"
                    aria-label="Contactar por WhatsApp"
                  >
                    <IoLogoWhatsapp size={24} />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>

                  {/* Email */}
                  <a
                    href="mailto:info@autohaus.com"
                    onClick={handleEmailClick}
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
  );
};
