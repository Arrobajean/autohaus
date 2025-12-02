import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useHamburgerMenu } from "./useHamburgerMenu";

export const useHamburgerMenuAnimations = () => {
  const { isOpen } = useHamburgerMenu();

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    // Timeline para la animación de apertura
    const tl = gsap.timeline();

    // Animar las líneas del menú hamburguesa a X
    tl.to(line1Ref.current, {
      rotation: 45,
      y: 6,
      duration: 0.3,
      ease: "power2.out",
    })
      .to(
        line2Ref.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.3"
      )
      .to(
        line3Ref.current,
        {
          rotation: -45,
          y: -6,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Deslizar el overlay como cortina de izquierda a derecha
    tl.to(
      overlayRef.current,
      {
        x: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.2"
    )
      // Animar los elementos del menú
      .to(
        menuItemsRef.current?.children,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
  };

  const closeMenu = (onComplete?: () => void) => {
    const tl = gsap.timeline({
      onComplete,
    });

    // Animar las líneas de X de vuelta a menú hamburguesa
    tl.to(line1Ref.current, {
      rotation: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    })
      .to(
        line2Ref.current,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        line3Ref.current,
        {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      )
      // Animar los elementos del menú hacia abajo
      .to(
        menuItemsRef.current?.children,
        {
          y: 30,
          opacity: 0,
          duration: 0.2,
          stagger: 0.05,
          ease: "power2.in",
        },
        "-=0.1"
      )
      // Deslizar el overlay como cortina hacia la izquierda
      .to(
        overlayRef.current,
        {
          x: "-100%",
          duration: 0.5,
          ease: "power2.in",
        },
        "-=0.1"
      );
  };

  // Configuración inicial de GSAP
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { x: "-100%" });
    }
    if (menuItemsRef.current) {
      gsap.set(menuItemsRef.current.children, { y: 30, opacity: 0 });
    }
  }, []);

  return {
    overlayRef,
    menuItemsRef,
    line1Ref,
    line2Ref,
    line3Ref,
    openMenu,
    closeMenu,
  };
};
