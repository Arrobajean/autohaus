import { Car } from "@/types";
import { useNavigate } from "react-router-dom";
import { generateCarSlug } from "@/data/carsHelpers";

interface SimilarCarsSectionProps {
  similarCars: Car[];
}

export const SimilarCarsSection = ({
  similarCars,
}: SimilarCarsSectionProps) => {
  const navigate = useNavigate();

  if (!similarCars || similarCars.length === 0) {
    return null;
  }

  const handleCardClick = (car: Car) => {
    const slug = generateCarSlug(car);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/coches/${slug}`);
  };

  return (
    <div className="mb-16 max-w-7xl mx-auto">
      <div className="max-w-4xl mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Coches que quizás te gusten
        </h2>
        <p className="text-base text-gray-500">
          Basado en características similares, estos vehículos podrían
          interesarte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarCars.map((car) => (
          <div
            key={car.id}
            onClick={() => handleCardClick(car)}
            className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 relative aspect-[3/4]"
          >
            {/* Full Image Background */}
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <span className="text-sm">No Image Available</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Card Content - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-2">
                {car.make} {car.model}
              </h3>
              <p className="text-3xl font-bold">
                {car.price.toLocaleString("es-ES")} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

