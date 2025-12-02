import { Helmet, HelmetProvider } from "react-helmet-async";
import ContactHeader from "./components/ContactHeader";
import ContactTeam from "./components/ContactTeam";
import ContactFormSection from "./components/ContactFormSection";
import ContactMap from "./components/ContactMap";

const Contact = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Contacto | AutoHaus - Concesionario de Lujo en Madrid</title>
        <meta
          name="description"
          content="Contacta con AutoHaus, tu concesionario de confianza en Madrid. Ofrecemos vehículos de lujo y servicio excepcional."
        />
      </Helmet>
      <div
        className="min-h-screen bg-white pt-24 md:pt-32"
        style={{ backgroundColor: "#F5F4F2" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ContactHeader />
          <ContactTeam />
          <ContactFormSection />
          <ContactMap />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Contact;
