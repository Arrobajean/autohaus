import { Helmet, HelmetProvider } from "react-helmet-async";
import { Award, Users, Heart, Target } from "lucide-react";
import { motion } from "framer-motion";
import RollingTextButton from "@/components/common/RollingTextButton";
import ContactTeam from "@/pages/site/contact/components/ContactTeam";

const About = () => {
  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excelencia",
      description:
        "Comprometidos con la excelencia en cada aspecto de nuestro servicio, desde la selección de vehículos hasta la atención al cliente.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Confianza",
      description:
        "Construimos relaciones duraderas basadas en la transparencia, honestidad y compromiso con nuestros clientes.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Pasión",
      description:
        "Nuestra pasión por los automóviles de lujo se refleja en cada vehículo que ofrecemos y en cada interacción.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Compromiso",
      description:
        "Dedicados a superar las expectativas y proporcionar una experiencia excepcional en cada paso del proceso.",
    },
  ];

  const imageCards = [
    {
      image: "/images/coches/Porsche 911 GT3 RS.avif",
      alt: "Porsche 911 GT3 RS en carretera de montaña",
    },
    {
      image: "/images/coches/Mercedes AMG GT-R.avif",
      alt: "Mercedes AMG GT-R",
    },
    {
      image: "/images/coches/McLaren 720S.avif",
      alt: "McLaren 720S",
    },
  ];

  const storyImageCards = [
    {
      image: "/images/coches/Porsche 911 GT3 RS.avif",
      alt: "Porsche 911 GT3 RS en movimiento",
    },
    {
      image: "/images/coches/Mercedes AMG GT-R.avif",
      alt: "Mercedes AMG GT-R en movimiento",
    },
  ];


  return (
    <HelmetProvider>
      <Helmet>
        <title>Sobre Nosotros | AutoHaus® - Concesionario de Lujo en Madrid</title>
        <meta
          name="description"
          content="Conoce AutoHaus, tu concesionario de confianza en Madrid. Especialistas en vehículos de lujo con más de dos décadas de experiencia."
        />
      </Helmet>
      <div className="min-h-screen bg-white pt-24 md:pt-32" style={{ backgroundColor: "#F5F4F2" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header Section */}
          <section className="py-16">
            <h1 className="text-5xl md:text-[5rem] mb-8">
              Sobre AutoHaus®
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed text-wrap-safe">
              Durante más de dos décadas, AutoHaus ha redefinido la experiencia automotriz,
              combinando precisión con confianza duradera.
            </p>
          </section>

          {/* Image Cards Section */}
          <section className="py-8 md:py-12 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {imageCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-xl aspect-[4/3]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 md:py-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Nuestra Historia
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Fundado en 2004, AutoHaus se propuso hacer que la compra de coches reflejara vehículos refinados. 
                A lo largo de los años, nos convertimos en una marca de confianza reconocida por la calidad y la excelencia.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {storyImageCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-xl aspect-[4/3]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Meet the Team Section */}
          <section className="py-16 md:py-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Conoce al Equipo de AutoHaus®
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Nuestro éxito está impulsado por personas que comparten una pasión por los coches, la precisión y el servicio excepcional.
              </p>
            </div>
            <ContactTeam compact={false} />
          </section>

          {/* Values Section */}
          <section className="px-4 md:px-8 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="p-8 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-black mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-wrap-safe">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 md:px-8 mb-24">
            <div className="text-center bg-white rounded-2xl p-12 md:p-16" style={{ backgroundColor: "#F5F4F2" }}>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                ¿Listo para encontrar tu vehículo perfecto?
              </h2>
              <p className="text-gray-600 mb-8 text-lg text-center max-w-2xl mx-auto">
                Explora nuestra selección de vehículos de lujo o contacta con 
                nosotros para una consulta personalizada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <RollingTextButton
                  primaryText="Ver Vehículos"
                  secondaryText="Explorar Ahora"
                  to="/coches"
                  ariaLabel="Ver vehículos disponibles"
                  backgroundColor="bg-black"
                  textColor="text-white"
                  className="text-lg px-8 py-4"
                />
                <RollingTextButton
                  primaryText="Contactar"
                  secondaryText="Hablar con Expertos"
                  to="/contacto"
                  ariaLabel="Contactar con nosotros"
                  backgroundColor="bg-black"
                  textColor="text-white"
                  className="text-lg px-8 py-4"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default About;

