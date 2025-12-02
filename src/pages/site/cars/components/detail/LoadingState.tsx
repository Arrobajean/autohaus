export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">Cargando detalles del vehículo...</p>
      </div>
    </div>
  );
};

