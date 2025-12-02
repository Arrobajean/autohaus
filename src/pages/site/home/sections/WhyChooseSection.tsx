import { memo } from "react";
import FeatureCard from "@/components/ui/feature-card";

const features = [
  {
    title: "Financiación Personal",
    description:
      "Elige un plan de financiación que se adapte a tu estilo de vida con condiciones de pago flexibles.",
    image: "/images/UI/Koenigsegg-jesko-card.avif",
    gradientPosition: "top" as const,
  },
  {
    title: "Valor Justo de Intercambio",
    description:
      "Intercambia tu coche actual de forma fácil con una evaluación justa, transparente y rápida.",
    image: "/images/UI/porshe-card.avif",
    gradientPosition: "bottom" as const,
  },
  {
    title: "Opciones de Leasing Modernas",
    description:
      "Conduce los coches más nuevos con programas de leasing flexibles y convenientes.",
    image: "/images/UI/Mercedes-AMG-GT-card.avif",
    gradientPosition: "top" as const,
  },
];

const WhyChooseSection = memo(() => {
  return (
    <section
      className="py-12 md:py-20 bg-white"
      style={{ backgroundColor: "#F5F4F2" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-center text-[2.5rem] md:text-[52px]"
            style={{
              lineHeight: "1.2em",
              letterSpacing: "-0.04em",
              fontWeight: 500,
              fontFamily: '"Inter Display", sans-serif',
              marginBottom: "15px",
            }}
          >
            ¿Por qué elegir AutoHaus?
          </h2>
          <div className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed" style={{ textWrap: 'pretty' }}>
            <span className="md:hidden">
              Experimenta un proceso de compra de coches<br />
              sin complicaciones construido sobre<br />
              transparencia, flexibilidad y confianza.
            </span>
            <span className="hidden md:inline">
              <div>Experimenta un proceso de compra de coches sin complicaciones</div>
              <div>construido sobre transparencia, flexibilidad y confianza.</div>
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              imageAlt={feature.title}
              gradientPosition={feature.gradientPosition}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

WhyChooseSection.displayName = "WhyChooseSection";

export default WhyChooseSection;

