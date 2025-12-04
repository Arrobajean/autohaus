import { motion, MotionValue } from "framer-motion";
import { Car } from "@/types";
import { distributeParallaxImages } from "../../utils/carUtils";

interface ParallaxAnimations {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  y3: MotionValue<number>;
  y4: MotionValue<number>;
  opacity1: MotionValue<number>;
  opacity2: MotionValue<number>;
  opacity3: MotionValue<number>;
  opacity4: MotionValue<number>;
  textOpacity: MotionValue<number>;
  subtitleOpacity: MotionValue<number>;
}

interface ParallaxSectionProps {
  car: Car;
  animations: ParallaxAnimations;
}

export const ParallaxSection = ({ car, animations }: ParallaxSectionProps) => {
  const parallaxImages = distributeParallaxImages(car.images || []);

  if (parallaxImages.length === 0 || !parallaxImages[0]) {
    return null;
  }

  return (
    <div className="relative min-h-[150vh] flex items-center justify-center mb-20 pt-24 md:pt-12 pb-32">
      {/* Background subtle gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, #F5F4F2, rgba(245, 244, 242, 0.3), #F5F4F2)` }}></div>

      {/* Left Side Cards - Positioned absolutely with parallax */}
      <div className="absolute left-4 md:left-8 lg:left-12 top-0 bottom-0 flex flex-col justify-around py-20 hidden md:flex">
        {/* Card 1 - Left Top */}
        <motion.div
          className="w-[200px] lg:w-[280px] h-[250px] lg:h-[350px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            y: animations.y1,
            opacity: animations.opacity1,
          }}
        >
          {parallaxImages[0] && (
            <img
              src={parallaxImages[0]}
              alt={`${car.make} ${car.model} - Vista 1`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Card 2 - Left Bottom */}
        <motion.div
          className="w-[200px] lg:w-[280px] h-[250px] lg:h-[350px] rounded-2xl overflow-hidden shadow-2xl ml-8 lg:ml-16"
          style={{
            y: animations.y2,
            opacity: animations.opacity2,
          }}
        >
          {parallaxImages[1] && (
            <img
              src={parallaxImages[1]}
              alt={`${car.make} ${car.model} - Vista 2`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </div>

      {/* Right Side Cards - Positioned absolutely with parallax */}
      <div className="absolute right-4 md:right-8 lg:right-12 top-0 bottom-0 flex flex-col justify-around py-20 hidden md:flex">
        {/* Card 3 - Right Top */}
        <motion.div
          className="w-[200px] lg:w-[280px] h-[250px] lg:h-[350px] rounded-2xl overflow-hidden shadow-2xl mr-8 lg:mr-16"
          style={{
            y: animations.y3,
            opacity: animations.opacity3,
          }}
        >
          {parallaxImages[2] && (
            <img
              src={parallaxImages[2]}
              alt={`${car.make} ${car.model} - Vista 3`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Card 4 - Right Bottom */}
        <motion.div
          className="w-[200px] lg:w-[280px] h-[250px] lg:h-[350px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            y: animations.y4,
            opacity: animations.opacity4,
          }}
        >
          {parallaxImages[3] && (
            <img
              src={parallaxImages[3]}
              alt={`${car.make} ${car.model} - Vista 4`}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
          style={{
            opacity: animations.textOpacity,
            color: 'var(--black-custom)',
          }}
        >
          {car.parallaxTitle || `El ${car.year} ${car.make} ${car.model} ofrece rendimiento y precisión`}
        </motion.h2>
        <motion.p
          className="text-base md:text-lg lg:text-xl text-black leading-relaxed max-w-2xl mx-auto"
          style={{
            opacity: animations.subtitleOpacity,
            color: 'var(--black-custom)',
          }}
        >
          {car.parallaxSubtitle || "Un verdadero icono que combina la usabilidad diaria con la velocidad de un supercar, construido para aquellos que no esperan nada menos que la perfección."}
        </motion.p>
      </div>
    </div>
  );
};

