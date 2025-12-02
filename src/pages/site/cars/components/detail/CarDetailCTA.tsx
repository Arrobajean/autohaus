import RollingTextButton from "@/components/common/RollingTextButton";

export const CarDetailCTA = () => {
  return (
    <div className="mb-16 text-center py-8 md:py-16 bg-white rounded-2xl" style={{ backgroundColor: "#F5F4F2" }}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        ¿Listo para dar el siguiente paso?
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-wrap-safe">
        Programa una prueba de manejo o contacta con nuestro equipo para más información
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <RollingTextButton
          primaryText="Prueba de Manejo"
          secondaryText="Reserva Ahora"
          to="/contacto"
          ariaLabel="Reservar prueba de manejo"
          backgroundColor="bg-black"
          textColor="text-white"
          className="text-lg px-8 py-4"
        />
        <RollingTextButton
          primaryText="Contactar Ventas"
          secondaryText="Hablar con Expertos"
          to="/contacto"
          ariaLabel="Contactar con ventas"
          backgroundColor="bg-black"
          textColor="text-white"
          className="text-lg px-8 py-4"
        />
      </div>
    </div>
  );
};

