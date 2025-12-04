import { memo, useState, useEffect } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car } from "@/types";
import { CARS_DATA } from "@/data/carsData";
import { getAvailableCars, generateCarSlug } from "@/data/carsHelpers";
import { useNavigate } from "react-router-dom";
import RollingTextButton from "@/components/common/RollingTextButton";

interface FeaturedVehiclesSectionProps {
  featuredCarsCount?: number;
}

const FeaturedVehiclesSection = memo(({ featuredCarsCount = 6 }: FeaturedVehiclesSectionProps) => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      if (!db) {
        setFeaturedCars(getAvailableCars().slice(0, featuredCarsCount));
        setLoading(false);
        return;
      }
      try {
        // Primero intentar obtener coches marcados como destacados
        // Nota: Si Firestore da error por índice compuesto, se usará el fallback
        try {
          const featuredQuery = query(
            collection(db, "cars"),
            where("status", "==", "available"),
            where("featured", "==", true),
            limit(featuredCarsCount)
          );
          const featuredSnapshot = await getDocs(featuredQuery);
          
          if (!featuredSnapshot.empty) {
            const cars = featuredSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Car)
            );
            setFeaturedCars(cars);
            return;
          }
        } catch (queryError: any) {
          // Si la consulta falla (por ejemplo, falta índice compuesto), usar fallback
          console.warn("Error en consulta de destacados, usando fallback:", queryError);
        }
        
        // Si no hay destacados o la consulta falló, usar los primeros disponibles como fallback
        const fallbackQuery = query(
          collection(db, "cars"),
          where("status", "==", "available"),
          limit(featuredCarsCount)
        );
        const fallbackSnapshot = await getDocs(fallbackQuery);
        if (fallbackSnapshot.empty) {
          setFeaturedCars(getAvailableCars().slice(0, featuredCarsCount));
        } else {
          // Filtrar manualmente los destacados si existen
          const allCars = fallbackSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Car)
          );
          const featured = allCars.filter(car => car.featured === true);
          setFeaturedCars(featured.length > 0 ? featured.slice(0, featuredCarsCount) : allCars.slice(0, featuredCarsCount));
        }
      } catch (error) {
        console.error("Error fetching featured cars:", error);
        setFeaturedCars(getAvailableCars().slice(0, featuredCarsCount));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, [featuredCarsCount]);

  const handleCardClick = (car: Car) => {
    const slug = generateCarSlug(car);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/coches/${slug}`);
  };

  return (
    <section className="py-12 md:py-20 bg-white" style={{ backgroundColor: "#F5F4F2" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-center text-[2.5rem] md:text-[52px]"
            style={{
              lineHeight: "1.2em",
              letterSpacing: "-0.04em",
              fontWeight: 500,
              fontFamily: '"Inter Display", sans-serif',
              marginBottom: "15px",
            }}
          >
            Coches Destacados
          </h2>
          <div className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed mb-6 md:mb-8" style={{ textWrap: 'pretty' }}>
            <span className="md:hidden">
              Experimenta la verdadera excelencia en<br />
              conducción con vehículos diseñados para<br />
              el rendimiento y el diseño atemporal.
            </span>
            <span className="hidden md:inline">
              <div>
                Experimenta la verdadera excelencia en conducción con vehículos
              </div>
              <div>diseñados para el rendimiento y el diseño atemporal.</div>
            </span>
          </div>
          <div className="flex justify-center">
            <RollingTextButton
              primaryText="Ver Todos"
              secondaryText="Explorar Ahora"
              to="/coches"
              ariaLabel="Ver todos los coches"
              backgroundColor="bg-gray-900"
              textColor="text-white"
              className="text-lg px-8 py-4"
            />
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            {Array.from({ length: featuredCarsCount }, (_, i) => i + 1).map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            {featuredCars.map((car) => (
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
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">
                    {car.price.toLocaleString("es-ES")} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-8 md:mt-12" style={{ backgroundColor: "#F5F4F2" }}>
            <p className="text-gray-500 text-base md:text-lg">
              No hay vehículos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
});

FeaturedVehiclesSection.displayName = "FeaturedVehiclesSection";

export default FeaturedVehiclesSection;
