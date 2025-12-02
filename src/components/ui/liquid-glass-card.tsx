import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassCardVariants = cva(
  "relative overflow-hidden rounded-3xl transition-all duration-500 group cursor-pointer",
  {
    variants: {
      variant: {
        default: [
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-black/25",
          "hover:bg-white/20 hover:shadow-2xl hover:shadow-black/30",
          "hover:scale-105 hover:-translate-y-2",
        ],
        glass: [
          "bg-white/5 backdrop-blur-2xl border border-white/10",
          "shadow-xl shadow-black/20",
          "hover:bg-white/15 hover:shadow-2xl hover:shadow-black/40",
          "hover:scale-[1.02] hover:-translate-y-1",
        ],
        frosted: [
          "bg-white/15 backdrop-blur-xl border border-white/30",
          "shadow-lg shadow-white/10",
          "hover:bg-white/25 hover:shadow-xl hover:shadow-white/20",
          "hover:scale-105 hover:-translate-y-2",
        ],
        gradient: [
          "bg-gradient-to-br from-white/20 via-white/5 to-transparent",
          "backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-purple-500/20",
          "hover:from-white/30 hover:via-white/10 hover:to-white/5",
          "hover:shadow-xl hover:shadow-purple-500/30",
          "hover:scale-105 hover:-translate-y-2",
        ],
        // Variantes para fondos claros
        light: [
          "bg-white/80 backdrop-blur-xl border border-gray-200/50",
          "shadow-lg shadow-gray-300/25",
          "hover:bg-white/95 hover:shadow-2xl hover:shadow-gray-300/40",
          "hover:scale-105 hover:-translate-y-2",
        ],
        lightGlass: [
          "bg-gray-50/60 backdrop-blur-2xl border border-gray-200/30",
          "shadow-xl shadow-gray-200/20",
          "hover:bg-gray-100/80 hover:shadow-2xl hover:shadow-gray-200/40",
          "hover:scale-[1.02] hover:-translate-y-1",
        ],
        lightFrosted: [
          "bg-gray-100/70 backdrop-blur-xl border border-gray-300/50",
          "shadow-lg shadow-gray-300/20",
          "hover:bg-gray-200/80 hover:shadow-xl hover:shadow-gray-300/30",
          "hover:scale-105 hover:-translate-y-2",
        ],
        lightGradient: [
          "bg-gradient-to-br from-white/90 via-gray-50/70 to-gray-100/60",
          "backdrop-blur-xl border border-gray-200/50",
          "shadow-lg shadow-blue-200/15",
          "hover:from-white hover:via-gray-50/90 hover:to-gray-100/80",
          "hover:shadow-xl hover:shadow-blue-200/25",
          "hover:scale-105 hover:-translate-y-2",
        ],
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface LiquidGlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidGlassCardVariants> {
  imageSrc: string;
  imageAlt: string;
  title?: string;
  description?: string;
  badge?: string;
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
  onCardClick?: () => void;
  lightMode?: boolean; // Nueva prop para activar modo claro
}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  (
    {
      className,
      variant,
      size,
      imageSrc,
      imageAlt,
      title,
      description,
      badge,
      showOverlay = true,
      overlayContent,
      onCardClick,
      lightMode = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(liquidGlassCardVariants({ variant, size, className }))}
        onClick={onCardClick}
        {...props}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-20">
              <span
                className={cn(
                  "px-3 py-1 text-xs font-semibold backdrop-blur-md rounded-full",
                  lightMode
                    ? "text-gray-800 bg-white/80 border border-gray-200/50"
                    : "text-white bg-white/20 border border-white/30"
                )}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Glass Reflection Effect on Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        {(title || description || children) && (
          <div className="relative p-6">
            {/* Glass reflection for content area */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              {title && (
                <h3
                  className={cn(
                    "text-xl font-bold mb-2 transition-colors",
                    lightMode
                      ? "text-gray-800 group-hover:text-gray-600"
                      : "text-white group-hover:text-white/90"
                  )}
                >
                  {title}
                </h3>
              )}

              {description && (
                <p
                  className={cn(
                    "text-sm leading-relaxed mb-4 text-wrap-safe",
                    lightMode ? "text-gray-600" : "text-white/80"
                  )}
                >
                  {description}
                </p>
              )}

              {children}
            </div>
          </div>
        )}

        {/* Overlay Content */}
        {showOverlay && overlayContent && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm",
              lightMode ? "bg-white/60" : "bg-black/20"
            )}
          >
            <div
              className={cn(
                "text-center",
                lightMode ? "text-gray-800" : "text-white"
              )}
            >
              {overlayContent}
            </div>
          </div>
        )}

        {/* Animated Border Glow */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ animation: "liquid-glow 3s ease-in-out infinite" }}
        />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full"
            style={{ animation: "liquid-shimmer 2s ease-in-out infinite" }}
          />
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

export { LiquidGlassCard, liquidGlassCardVariants };
