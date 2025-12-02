import React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  gradientPosition?: "top" | "bottom";
  className?: string;
  /**
   * When set to "video", the media area will render a <video> element
   * instead of an <img>, keeping the same fade overlay effect.
   */
  mediaType?: "image" | "video";
  /**
   * Optional custom content. When provided, it will replace the default
   * title + description block inside the card content area.
   */
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  gradientPosition = "bottom",
  className,
  mediaType = "image",
  children,
}) => {
  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col",
        gradientPosition === "top" && "flex-col-reverse",
        className
      )}
    >
      {/* Media Container (image or video) */}
      <div className="relative aspect-[4/3] md:aspect-[4/3] overflow-hidden flex-shrink-0">
        {mediaType === "video" ? (
          <video
            src={image}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={image}
            alt={imageAlt || title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}

        {/* Gradient Overlay - More concentrated near text area (25% of media height) */}
        {gradientPosition === "bottom" ? (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, white 0%, white 5%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.1) 20%, transparent 25%)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, white 0%, white 5%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.1) 20%, transparent 25%)",
            }}
          />
        )}
      </div>

      {/* Content - Separate section with white background */}
      <div className="bg-white p-5 md:p-8 flex-shrink-0">
        {children ? (
          children
        ) : (
          <>
            <h3 className="text-lg md:text-xl mb-2 md:mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
