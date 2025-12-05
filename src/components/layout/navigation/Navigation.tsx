import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./useNavigation";
import {
  SkipLink,
  DesktopNavigation,
  MobileNavigation,
  MobileMenu,
} from "./Navigation.components";

const Navigation = memo(() => {
  const {
    navRef,
    mobileMenuOpen,
    isScrolled,
    isMdUp,
    isWhitePage,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogoClick,
  } = useNavigation();

  const getNavAnimationProps = () => {
    const shouldShowWhiteBackground = isWhitePage || isScrolled;

    // Usar valores RGBA consistentes para mejor interpolación en móvil
    const backgroundColor = shouldShowWhiteBackground
      ? isMdUp
        ? "rgba(255, 255, 255, 0)" // transparent para desktop
        : "rgba(255, 255, 255, 1)" // blanco sólido para móvil
      : "rgba(255, 255, 255, 0)"; // transparent

    const borderBottomColor = shouldShowWhiteBackground
      ? isMdUp
        ? "rgba(229, 231, 235, 0)" // transparent para desktop
        : "rgba(229, 231, 235, 1)" // gris para móvil
      : "rgba(229, 231, 235, 0)"; // transparent

    const borderBottomWidth = shouldShowWhiteBackground ? (isMdUp ? 0 : 1) : 0;

    return {
      backgroundColor,
      borderBottomColor,
      borderBottomWidth,
    };
  };

  const navAnimationProps = getNavAnimationProps();

  // Estado inicial: siempre transparente en RGBA para mejor interpolación
  const initialBackgroundColor = "rgba(255, 255, 255, 0)";
  const initialBorderColor = "rgba(229, 231, 235, 0)";

  // Transición coordinada: 800ms para todos los elementos en móvil
  const transition = isMdUp
    ? {
        opacity: { duration: 1.0, delay: 0.1 },
        backgroundColor: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
        borderBottomColor: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {
        backgroundColor: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
        borderBottomColor: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
      };

  return (
    <>
      <SkipLink />
      <motion.nav
        ref={navRef as any}
        role="navigation"
        aria-label="Navegación principal"
        className="fixed top-0 left-0 right-0 z-50 md:backdrop-blur-sm"
        initial={
          isMdUp
            ? {
                opacity: 0,
                backgroundColor: initialBackgroundColor,
                borderBottomColor: initialBorderColor,
              }
            : {
                backgroundColor: initialBackgroundColor,
                borderBottomColor: initialBorderColor,
              }
        }
        animate={{
          opacity: isMdUp ? 1 : undefined,
          backgroundColor: navAnimationProps.backgroundColor,
          borderBottomColor: navAnimationProps.borderBottomColor,
        }}
        transition={transition}
        style={{
          borderBottomWidth: navAnimationProps.borderBottomWidth,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 md:py-5 h-[70px] md:h-auto flex items-center">
          <DesktopNavigation
            isScrolled={isScrolled}
            onLogoClick={handleLogoClick}
          />

          <MobileNavigation
            isScrolled={isScrolled}
            isWhitePage={isWhitePage}
            mobileMenuOpen={mobileMenuOpen}
            onLogoClick={handleLogoClick}
            onMenuToggle={toggleMobileMenu}
          />

          <MobileMenu
            isOpen={mobileMenuOpen}
            isScrolled={isScrolled}
            isWhitePage={isWhitePage}
            onClose={closeMobileMenu}
          />
        </div>
      </motion.nav>
    </>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
