import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type RotatingTextButtonProps = {
  /**
   * Texto que rotará continuamente
   */
  text: string;
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
  /**
   * Duración de la animación en segundos
   */
  duration?: number;
};

const RotatingTextButton = memo(
  ({
    text,
    to,
    ariaLabel,
    className = "",
    backgroundColor = "bg-white",
    textColor = "text-black",
    duration = 2,
  }: RotatingTextButtonProps) => {
    return (
      <Link to={to} aria-label={ariaLabel || text}>
        <motion.button
          type="button"
          className={`relative inline-flex items-center justify-center rounded-full ${backgroundColor} ${textColor} text-sm font-medium px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="relative h-[20px] overflow-hidden">
            <motion.div
              className="flex flex-col items-center"
              animate={{
                y: [0, -20],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5,
              }}
            >
              <span className="h-[20px] leading-[20px] flex items-center justify-center whitespace-nowrap">
                {text}
              </span>
              <span className="h-[20px] leading-[20px] flex items-center justify-center whitespace-nowrap">
                {text}
              </span>
            </motion.div>
          </div>
        </motion.button>
      </Link>
    );
  }
);

RotatingTextButton.displayName = "RotatingTextButton";

export default RotatingTextButton;

