const ContactMap = () => {
  const address = "Calle de Serrano 87, 28006 Madrid, España";
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d_s6X4cuYZ1_T8&q=${encodedAddress}`;

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-16">
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="AutoHaus Location - Calle de Serrano 87, Madrid"
        ></iframe>
      </div>
    </section>
  );
};

export default ContactMap;

