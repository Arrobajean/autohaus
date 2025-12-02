import { useEffect, useState } from "react";
import { useHamburgerMenu } from "@/hooks/useHamburgerMenu";
import { useHamburgerMenuAnimations } from "@/hooks/useHamburgerMenuAnimations";
import { HamburgerMenuUI } from "./HamburgerMenuUI";
import useNavigationLogic from "../Navigation.logic";

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateMenuState } = useHamburgerMenu();
  const { openMenu, closeMenu, ...refs } = useHamburgerMenuAnimations();
  const { isNavVisible } = useNavigationLogic();

  // Función para emitir eventos de estado del menú
  const emitMenuStateChange = (isOpen: boolean) => {
    const event = new CustomEvent("hamburgerMenuToggle", {
      detail: { isOpen },
    });
    window.dispatchEvent(event);
  };

  const toggleMenu = () => {
    if (isOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  };

  const handleOpenMenu = () => {
    setIsOpen(true);
    updateMenuState(true);
    emitMenuStateChange(true);
    openMenu();

    // Prevenir scroll del body cuando el menú esté abierto
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const handleCloseMenu = () => {
    closeMenu(() => {
      setIsOpen(false);
      updateMenuState(false);
      emitMenuStateChange(false);

      // Restaurar scroll del body
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    });
  };

  // Cerrar menú con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCloseMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      // Asegurar que el scroll se restaure si el componente se desmonta
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <HamburgerMenuUI
      isOpen={isOpen}
      onToggle={toggleMenu}
      onClose={handleCloseMenu}
      isNavVisible={isNavVisible}
      refs={refs}
    />
  );
};
