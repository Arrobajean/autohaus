import { Helmet, HelmetProvider } from "react-helmet-async";
import { Wrench, Shield, Clock, Star } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Mantenimiento y Reparación",
      description:
        "Servicio técnico especializado para todas las marcas de lujo. Nuestros técnicos certificados garantizan el mejor cuidado para tu vehículo.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Garantía Extendida",
      description:
        "Protege tu inversión con nuestras garantías extendidas. Cobertura completa para tu tranquilidad.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Financiación Personalizada",
      description:
        "Opciones de financiación flexibles adaptadas a tus necesidades. Hacemos que tu vehículo de lujo sea accesible.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Servicio Premium",
      description:
        "Atención personalizada y servicio de excelencia. Tu satisfacción es nuestra prioridad.",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Servicios | AutoHaus - Concesionario de Lujo en Madrid</title>
        <meta
          name="description"
          content="Servicios premium para tu vehículo de lujo. Mantenimiento, garantía extendida, financiación y más en AutoHaus."
        />
      </Helmet>
      <div className="min-h-screen bg-white pt-24 md:pt-32" style={{ backgroundColor: '#F5F4F2' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Section */}
          <section className="py-16">
            <h1 className="text-5xl md:text-[5rem] mb-8">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Ofrecemos una experiencia completa para tu vehículo de lujo, 
              desde la compra hasta el mantenimiento y más allá.
            </p>
          </section>

          {/* Services Grid */}
          <section className="px-4 md:px-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-black mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-semibold text-black mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-wrap-safe">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 md:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-6">
                ¿Necesitas más información?
              </h2>
              <p className="text-gray-600 mb-8">
                Contacta con nosotros y te ayudaremos a encontrar la mejor solución para ti.
              </p>
              <a
                href="/contacto"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Contactar ahora
              </a>
            </div>
          </section>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Services;

