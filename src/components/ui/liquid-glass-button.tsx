import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden group",
  {
    variants: {
      variant: {
        default: [
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "text-white shadow-lg shadow-black/25",
          "hover:bg-white/20 hover:shadow-xl hover:shadow-black/30",
          "active:scale-95 active:bg-white/30",
        ],
        primary: [
          "bg-blue-500/20 backdrop-blur-xl border border-blue-400/30",
          "text-white shadow-lg shadow-blue-500/25",
          "hover:bg-blue-500/30 hover:shadow-xl hover:shadow-blue-500/30",
          "active:scale-95 active:bg-blue-500/40",
        ],
        dark: [
          "bg-black/20 backdrop-blur-xl border border-gray-800/50",
          "text-white shadow-lg shadow-black/50",
          "hover:bg-black/30 hover:shadow-xl hover:shadow-black/60",
          "active:scale-95 active:bg-black/40",
        ],
        gradient: [
          "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20",
          "backdrop-blur-xl border border-white/20",
          "text-white shadow-lg shadow-purple-500/25",
          "hover:from-purple-500/30 hover:via-pink-500/30 hover:to-blue-500/30",
          "hover:shadow-xl hover:shadow-purple-500/30",
          "active:scale-95",
        ],
        // Variantes para fondos claros
        light: [
          "bg-white/70 backdrop-blur-xl border border-gray-200/50",
          "text-gray-800 shadow-lg shadow-gray-300/25",
          "hover:bg-white/90 hover:shadow-xl hover:shadow-gray-300/40",
          "active:scale-95 active:bg-white",
        ],
        lightPrimary: [
          "bg-blue-50/80 backdrop-blur-xl border border-blue-200/50",
          "text-blue-800 shadow-lg shadow-blue-200/25",
          "hover:bg-blue-100/90 hover:shadow-xl hover:shadow-blue-200/40",
          "active:scale-95 active:bg-blue-100",
        ],
        lightGradient: [
          "bg-gradient-to-r from-gray-50/80 via-white/80 to-gray-100/80",
          "backdrop-blur-xl border border-gray-200/50",
          "text-gray-800 shadow-lg shadow-gray-200/25",
          "hover:from-gray-100/90 hover:via-white/90 hover:to-gray-200/90",
          "hover:shadow-xl hover:shadow-gray-200/40",
          "active:scale-95",
        ],
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2 text-xs",
        lg: "h-14 rounded-3xl px-8 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidGlassButtonVariants> {
  asChild?: boolean;
  showRipple?: boolean;
}

const LiquidGlassButton = React.forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      showRipple = true,
      children,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<
      Array<{ x: number; y: number; id: number }>
    >([]);
    const rippleId = React.useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (showRipple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
          x,
          y,
          id: rippleId.current++,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) =>
            prev.filter((ripple) => ripple.id !== newRipple.id)
          );
        }, 600);
      }

      props.onClick?.(e);
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(liquidGlassButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

        {/* Animated border glow */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: "liquid-glow 3s ease-in-out infinite" }}
        />

        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full"
            style={{ animation: "liquid-shimmer 2s ease-in-out infinite" }}
          />
        </div>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              animation: "liquid-ripple 0.6s ease-out",
            }}
          />
        ))}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Comp>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton, liquidGlassButtonVariants };
