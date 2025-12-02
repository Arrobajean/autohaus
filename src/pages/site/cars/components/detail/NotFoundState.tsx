import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundState = () => {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-[5rem] mb-4">Vehículo no encontrado</h1>
        <p className="text-gray-600 text-lg mb-8">
          Lo sentimos, no pudimos encontrar el vehículo que buscas. 
          Puede que ya no esté disponible o la URL sea incorrecta.
        </p>
        <Link to="/coches">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            Ver todos los vehículos
          </Button>
        </Link>
      </div>
    </div>
  );
};

