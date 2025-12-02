import { memo } from "react";
import LogoLoop from "@/components/ui/LogoLoop";

const TrustedBrandsSection = memo(() => {
  return (
    <section
      className="bg-white pt-16 pb-12 md:pt-32 md:pb-24 relative"
      style={{ backgroundColor: "#F5F4F2" }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-center text-black text-[2.5rem] md:text-[52px]"
            style={{
              lineHeight: "1.2em",
              letterSpacing: "-0.04em",
              fontWeight: 500,
              fontFamily: '"Inter Display", sans-serif',
              marginBottom: "15px",
            }}
          >
            Ofrecemos vehículos de las
            <br className="hidden md:block" />
            marcas más icónicas del mundo
          </h2>
          <div className="text-[1.125rem] md:text-lg text-black/80 text-center">
            <div>
              Nuestro éxito está impulsado por personas que comparten una pasión
            </div>
            <div>por los coches, la precisión y un servicio excepcional.</div>
          </div>
        </div>
        <div className="-mx-4 md:-mx-8">
          <LogoLoop
            ariaLabel="Logos de marcas de vehículos disponibles en el concesionario"
            speed={80}
            logoHeight={48}
            gap={72}
            fadeOut
            pauseOnHover
            scaleOnHover
            logos={[
              {
                src: "/images/brand-logos/porsche.png",
                alt: "Porsche",
                title: "Porsche",
              },
              {
                src: "/images/brand-logos/lamborghini.png",
                alt: "Lamborghini",
                title: "Lamborghini",
              },
              {
                src: "/images/brand-logos/mclaren.png",
                alt: "McLaren",
                title: "McLaren",
              },
              {
                src: "/images/brand-logos/ferrari.png",
                alt: "Ferrari",
                title: "Ferrari",
              },
              {
                src: "/images/brand-logos/bugatti.png",
                alt: "Bugatti",
                title: "Bugatti",
              },
              {
                src: "/images/brand-logos/bentley.png",
                alt: "Bentley",
                title: "Bentley",
              },
              {
                src: "/images/brand-logos/aston-martin.png",
                alt: "Aston Martin",
                title: "Aston Martin",
              },
              {
                src: "/images/brand-logos/jaguar.png",
                alt: "Jaguar",
                title: "Jaguar",
              },
              {
                node: (
                  <img
                    src="/images/brand-logos/chevrolet.png"
                    alt="Chevrolet"
                    title="Chevrolet"
                    className="h-[calc(var(--logoloop-logoHeight)*1.4)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-auto [image-rendering:-webkit-optimize-contrast] motion-reduce:transition-none filter grayscale opacity-80 transition-all duration-300 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-125"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ),
                title: "Chevrolet",
              },
              {
                node: (
                  <img
                    src="/images/brand-logos/ford-logo-icon-png-14227.png"
                    alt="Ford"
                    title="Ford"
                    className="h-[calc(var(--logoloop-logoHeight)*1.4)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-auto [image-rendering:-webkit-optimize-contrast] motion-reduce:transition-none filter grayscale opacity-80 transition-all duration-300 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-125"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ),
                title: "Ford",
              },
              {
                src: "/images/brand-logos/gta-spano.png",
                alt: "GTA Spano",
                title: "GTA Spano",
              },
              {
                src: "/images/brand-logos/logo-design-49597.png",
                alt: "Marca de vehículo",
                title: "Marca de vehículo",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
});

TrustedBrandsSection.displayName = "TrustedBrandsSection";

export default TrustedBrandsSection;
