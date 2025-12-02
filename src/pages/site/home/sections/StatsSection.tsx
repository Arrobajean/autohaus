import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: "15+",
    label: "Años de Experiencia",
    description: "Liderando el mercado de vehículos premium",
  },
  {
    value: "2,500+",
    label: "Coches Vendidos",
    description: "Satisfaciendo a conductores exigentes",
  },
  {
    value: "98%",
    label: "Clientes Satisfechos",
    description: "Valoraciones de 5 estrellas",
  },
  {
    value: "20+",
    label: "Marcas Premium",
    description: "Las mejores marcas del mundo",
  },
];

const StatsSection = memo(() => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="py-12 md:py-20 bg-white"
      style={{ backgroundColor: "#F5F4F2" }}
      ref={ref}
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
            Nuestra trayectoria nos respalda
          </h2>
          <div
            className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed"
            style={{ textWrap: "pretty" }}
          >
            <span className="md:hidden">
              Más de una década de excelencia en el mercado
              <br />
              de vehículos de lujo y deportivos.
            </span>
            <span className="hidden md:inline">
              <div>
                Más de una década de excelencia en el mercado de vehículos de
                lujo
              </div>
              <div>y deportivos, construyendo relaciones duraderas.</div>
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div
                className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 transition-transform duration-500 group-hover:scale-110"
                style={{
                  fontWeight: 600,
                  fontFamily: '"Inter Display", sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                {stat.label}
              </div>
              <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";

export default StatsSection;

