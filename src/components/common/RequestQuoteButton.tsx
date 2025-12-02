import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type RequestQuoteButtonProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  to?: string;
};

const RequestQuoteButton = memo(
  ({
    size = "sm",
    className = "",
    children,
    ariaLabel = "Ir a contacto para solicitar primera consulta",
    to = "/contacto",
  }: RequestQuoteButtonProps) => {
    return (
      <Link to={to} aria-label={ariaLabel}>
        <Button
          size={size}
          className={`group flex items-center glass-button-dark bg-white text-black hover:bg-gray-100 font-medium px-6 fast-transitions touch-optimized optimize-interactions shadow-glass hover:shadow-glass-lg border-0 transition-all duration-300 ease-out ${className}`}
        >
          <span>{children ?? "Primera Consulta"}</span>
          <ArrowRight
            size={18}
            className="ml-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-out"
            aria-hidden="true"
          />
        </Button>
      </Link>
    );
  }
);

RequestQuoteButton.displayName = "RequestQuoteButton";

export default RequestQuoteButton;
