import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassButtonSimpleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "gradient";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const LiquidGlassButtonSimple: React.FC<LiquidGlassButtonSimpleProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses = [
    "relative inline-flex items-center justify-center gap-2",
    "font-medium rounded-2xl transition-all duration-300",
    "backdrop-blur-xl border shadow-lg overflow-hidden group",
    "hover:scale-105 active:scale-95",
    "focus:outline-none focus:ring-2 focus:ring-white/50",
  ];

  const variantClasses = {
    default: [
      "bg-white/10 border-white/20 text-white",
      "hover:bg-white/20 shadow-black/25",
    ],
    primary: [
      "bg-blue-500/20 border-blue-400/30 text-white",
      "hover:bg-blue-500/30 shadow-blue-500/25",
    ],
    gradient: [
      "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20",
      "border-white/20 text-white shadow-purple-500/25",
      "hover:from-purple-500/30 hover:via-pink-500/30 hover:to-blue-500/30",
    ],
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm h-9",
    md: "px-6 py-3 text-sm h-11",
    lg: "px-8 py-4 text-base h-14",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Glass reflection */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

      {/* Animated glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default LiquidGlassButtonSimple;
