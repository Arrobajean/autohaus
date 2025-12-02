import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardSimpleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "frosted";
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const LiquidGlassCardSimple: React.FC<LiquidGlassCardSimpleProps> = ({
  variant = "default",
  imageSrc,
  imageAlt,
  title,
  description,
  className,
  children,
  ...props
}) => {
  const baseClasses = [
    "relative overflow-hidden rounded-3xl transition-all duration-500",
    "group cursor-pointer backdrop-blur-xl border shadow-lg",
    "hover:scale-105 hover:-translate-y-2",
  ];

  const variantClasses = {
    default: [
      "bg-white/10 border-white/20 shadow-black/25",
      "hover:bg-white/20 hover:shadow-xl hover:shadow-black/30",
    ],
    glass: [
      "bg-white/5 border-white/10 shadow-black/20",
      "hover:bg-white/15 hover:shadow-2xl hover:shadow-black/40",
    ],
    frosted: [
      "bg-white/15 border-white/30 shadow-white/10",
      "hover:bg-white/25 hover:shadow-xl hover:shadow-white/20",
    ],
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {/* Image Section */}
      {imageSrc && (
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt || ""}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Glass reflection on image */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* Content Section */}
      {(title || description || children) && (
        <div className="relative p-6">
          {/* Glass reflection for content */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10">
            {title && (
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                {title}
              </h3>
            )}

            {description && (
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {description}
              </p>
            )}

            {children}
          </div>
        </div>
      )}

      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default LiquidGlassCardSimple;
