import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type RollingTextButtonProps = {
  /**
   * Texto principal que se muestra inicialmente
   */
  primaryText: string;
  /**
   * Texto secundario que aparece al hacer hover (opcional)
   * Si no se proporciona, el botón no tendrá animación de ruleta
   */
  secondaryText?: string;
  /**
   * Ruta a la que navegará el botón
   */
  to: string;
  /**
   * Label de accesibilidad
   */
  ariaLabel?: string;
  /**
   * Clases adicionales para el botón
   */
  className?: string;
  /**
   * Color de fondo del botón
   */
  backgroundColor?: string;
  /**
   * Color del texto
   */
  textColor?: string;
};

const RollingTextButton = memo(
  ({
    primaryText,
    secondaryText,
    to,
    ariaLabel,
    className = "",
    backgroundColor = "bg-white",
    textColor = "text-black",
  }: RollingTextButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [textWidth, setTextWidth] = useState<number | null>(null);
    const primaryRef = useRef<HTMLSpanElement>(null);
    const secondaryRef = useRef<HTMLSpanElement>(null);
    const hasRollingEffect = !!secondaryText;

    useEffect(() => {
      if (hasRollingEffect && primaryRef.current && secondaryRef.current) {
        const primaryWidth = primaryRef.current.offsetWidth;
        const secondaryWidth = secondaryRef.current.offsetWidth;
        setTextWidth(Math.max(primaryWidth, secondaryWidth));
      }
    }, [hasRollingEffect, primaryText, secondaryText]);

    return (
      <div className="inline-block" style={{ transform: 'translateZ(0)' }}>
        <Link 
          to={to} 
          aria-label={ariaLabel || primaryText} 
          className="inline-block no-underline" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <motion.button
            type="button"
            className={`relative inline-flex items-center justify-center rounded-full ${backgroundColor} ${textColor} text-sm font-medium px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              minHeight: hasRollingEffect ? '44px' : 'auto',
              height: hasRollingEffect ? '44px' : 'auto',
              transformOrigin: 'center center',
              willChange: 'transform',
              minWidth: textWidth ? `${textWidth}px` : 'auto',
              backgroundColor: backgroundColor === 'bg-black' || backgroundColor === 'bg-gray-900' ? 'var(--black-custom)' : undefined,
              color: textColor === 'text-white' ? '#ffffff' : textColor === 'text-black' ? 'var(--black-custom)' : undefined
            } as React.CSSProperties}
          >
          {hasRollingEffect ? (
            <>
              <span ref={primaryRef} className="absolute opacity-0 whitespace-nowrap pointer-events-none" aria-hidden="true">
                {primaryText}
              </span>
              <span ref={secondaryRef} className="absolute opacity-0 whitespace-nowrap pointer-events-none" aria-hidden="true">
                {secondaryText}
              </span>
              <div className="relative h-[20px] overflow-hidden" style={{ width: textWidth ? `${textWidth}px` : 'auto' }}>
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ y: isHovered ? -20 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                  }}
                >
                  <span className={`h-[20px] leading-[20px] flex items-center justify-center whitespace-nowrap ${textColor}`} style={{ color: textColor === 'text-white' ? '#ffffff' : textColor === 'text-black' ? 'var(--black-custom)' : undefined } as React.CSSProperties}>
                    {primaryText}
                  </span>
                  <span className={`h-[20px] leading-[20px] flex items-center justify-center whitespace-nowrap ${textColor}`} style={{ color: textColor === 'text-white' ? '#ffffff' : textColor === 'text-black' ? 'var(--black-custom)' : undefined } as React.CSSProperties}>
                    {secondaryText}
                  </span>
                </motion.div>
              </div>
            </>
          ) : (
            <span className={`whitespace-nowrap ${textColor}`} style={{ color: textColor === 'text-white' ? '#ffffff' : textColor === 'text-black' ? 'var(--black-custom)' : undefined } as React.CSSProperties}>{primaryText}</span>
          )}
          </motion.button>
        </Link>
      </div>
    );
  }
);

RollingTextButton.displayName = "RollingTextButton";

export default RollingTextButton;

