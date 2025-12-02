import { useState, useEffect } from "react";

let menuState: boolean = false;
let listeners: Array<(isOpen: boolean) => void> = [];

export const useHamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(menuState);

  const updateMenuState = (newState: boolean) => {
    menuState = newState;
    listeners.forEach((listener) => listener(newState));
  };

  // Suscribirse a cambios
  useEffect(() => {
    const listener = (newState: boolean) => setIsOpen(newState);
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    isOpen,
    updateMenuState,
  };
};
