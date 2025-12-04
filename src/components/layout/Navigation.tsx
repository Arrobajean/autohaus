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
    const backgroundColor = shouldShowWhiteBackground
      ? isMdUp
        ? "transparent"
        : "rgba(255, 255, 255, 1)"
      : "transparent";
    const borderBottomColor = shouldShowWhiteBackground
      ? isMdUp
        ? "transparent"
        : "rgba(229, 231, 235, 1)"
      : "transparent";
    const borderBottomWidth = shouldShowWhiteBackground ? (isMdUp ? 0 : 1) : 0;

    return {
      backgroundColor,
      borderBottomColor,
      borderBottomWidth,
    };
  };

  const navAnimationProps = getNavAnimationProps();

  return (
    <>
      <SkipLink />
      <motion.nav
        ref={navRef as any}
        role="navigation"
        aria-label="Navegación principal"
        className="fixed top-0 left-0 right-0 z-50 md:backdrop-blur-sm"
        initial={isMdUp ? { opacity: 0 } : false}
        animate={{
          opacity: isMdUp ? 1 : undefined,
          backgroundColor: navAnimationProps.backgroundColor,
          borderBottomColor: navAnimationProps.borderBottomColor,
        }}
        transition={{
          opacity: isMdUp ? { duration: 1.0, delay: 0.1 } : undefined,
          backgroundColor: { duration: 0.8, ease: "easeInOut" },
          borderBottomColor: { duration: 0.8, ease: "easeInOut" },
        }}
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
