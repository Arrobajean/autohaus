import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "¿Ofrecen opciones de financiación?",
    answer:
      "Sí, trabajamos con múltiples instituciones financieras para ofrecer planes de financiación personalizados con tasas competitivas. Nuestro equipo te ayudará a encontrar la mejor opción según tu situación financiera.",
  },
  {
    question: "¿Puedo hacer una prueba de manejo?",
    answer:
      "Por supuesto. Programar una prueba de manejo es fácil. Simplemente contáctanos a través de nuestro formulario o llámanos directamente. Te preparamos el vehículo de tu elección para que lo experimentes de primera mano.",
  },
  {
    question: "¿Aceptan coches como parte de pago?",
    answer:
      "Sí, aceptamos tu vehículo actual como parte de pago. Realizamos una evaluación justa y transparente del valor de tu coche para aplicarlo como adelanto en tu nueva compra.",
  },
  {
    question: "¿Qué garantía incluyen los vehículos?",
    answer:
      "Todos nuestros vehículos pasan por una inspección exhaustiva de múltiples puntos. Ofrecemos garantía extendida y opciones de servicio post-venta para tu tranquilidad.",
  },
  {
    question: "¿Cuánto tiempo toma el proceso de compra?",
    answer:
      "Una vez que encuentras tu vehículo ideal, el proceso puede completarse en el mismo día. Esto incluye la financiación, documentación y entrega, siempre que toda la documentación esté en orden.",
  },
  {
    question: "¿Ofrecen servicio de mantenimiento?",
    answer:
      "Sí, contamos con un centro de servicio completo con técnicos especializados en vehículos premium. Ofrecemos mantenimiento preventivo, reparaciones y accesorios originales.",
  },
];

const FAQSection = memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-20 bg-white" style={{ backgroundColor: "#F5F4F2" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
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
            Preguntas Frecuentes
          </h2>
          <div
            className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed"
            style={{ textWrap: "pretty" }}
          >
            <span className="md:hidden">
              Encuentra respuestas a las preguntas más
              <br />
              comunes sobre nuestros servicios.
            </span>
            <span className="hidden md:inline">
              <div>
                Encuentra respuestas a las preguntas más comunes sobre nuestros
                servicios.
              </div>
              <div>¿No encuentras lo que buscas? Contáctanos directamente.</div>
            </span>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between text-left focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 pr-3 md:pr-4 group-hover:text-gray-700 transition-colors leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;

