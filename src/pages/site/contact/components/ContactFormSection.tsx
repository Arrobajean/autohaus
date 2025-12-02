import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

const ContactFormSection = () => {
  return (
    <section id="contact-form" className="px-4 md:px-8 mb-12 md:mb-16">
      <div className="mb-6 md:mb-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 md:mb-4">
          Envíanos un mensaje
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto text-center px-4" style={{ textWrap: 'pretty' }}>
          Ya sea que estés interesado en una prueba de manejo, opciones de financiación, o tengas una consulta general, nuestro equipo está aquí para ayudarte.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactFormSection;

