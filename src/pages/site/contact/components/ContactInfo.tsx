import { contactInfo } from "../data/contactData";
import { SiYoutube, SiTiktok, SiInstagram } from "react-icons/si";

const ContactInfo = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-0 md:space-y-8">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-black mb-2">Dirección</h3>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors inline-block text-sm"
          >
            {contactInfo.address}
          </a>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-black mb-2">Teléfono</h3>
          <a
            href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
            className="text-gray-600 hover:text-black transition-colors text-sm"
          >
            {contactInfo.phone}
          </a>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-black mb-2">Correo electrónico</h3>
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-gray-600 hover:text-black transition-colors text-sm break-all"
          >
            {contactInfo.email}
          </a>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-black mb-2">Horario de atención</h3>
          <div className="md:hidden">
            <span className="text-gray-600 block" style={{ fontSize: '14px', lineHeight: '1.25rem' }}>
              {contactInfo.scheduleDays}
            </span>
            <span className="text-gray-600 block" style={{ fontSize: '14px', lineHeight: '1.25rem' }}>
              {contactInfo.scheduleHours}
            </span>
          </div>
          <span className="text-gray-600 hidden md:block" style={{ fontSize: '14px', lineHeight: '1.25rem' }}>
            {contactInfo.schedule}
          </span>
        </div>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-sm font-bold text-black mb-2">Nuestras redes sociales</h3>
        <div className="flex gap-6 md:gap-8 justify-center md:justify-start">
          <a
            href="https://www.youtube.com/@autohaus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="Visitar canal de YouTube de AutoHaus"
          >
            <SiYoutube size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@autohaus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="Visitar perfil de TikTok de AutoHaus"
          >
            <SiTiktok size={24} />
          </a>
          <a
            href="https://www.instagram.com/autohaus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="Visitar perfil de Instagram de AutoHaus"
          >
            <SiInstagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;

