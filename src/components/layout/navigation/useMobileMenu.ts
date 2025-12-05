import { useEffect } from "react";
import { useWhatsApp } from "@/hooks/useWhatsApp";

interface UseMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useMobileMenu = ({ isOpen, onClose }: UseMobileMenuProps) => {
  const { handleWhatsAppClick } = useWhatsApp();

  // Cerrar menú con tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Manejar clic en link con prevención de propagación
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onClose();
  };

  // Manejar clic en backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Manejar clic en botón hamburguesa
  const handleMenuButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  // Manejar clic en WhatsApp
  const handleWhatsAppClickWithClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleWhatsAppClick();
    onClose();
  };

  // Manejar clic en Email
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onClose();
  };

  return {
    handleLinkClick,
    handleBackdropClick,
    handleMenuButtonClick,
    handleWhatsAppClickWithClose,
    handleEmailClick,
  };
};

