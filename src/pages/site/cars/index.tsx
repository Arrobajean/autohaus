import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types";
import { generateCarSlug } from "@/data/carsHelpers";
import { useCars, Category } from "./hooks/useCars";

const categories = [
  { id: "all" as Category, label: "Todos los Coches" },
  { id: "luxury" as Category, label: "Lujo" },
  { id: "suv" as Category, label: "SUV" },
  { id: "premium" as Category, label: "Premium" },
];

const Cars = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const { cars, loading } = useCars(selectedCategory);
  const navigate = useNavigate();

  const handleCardClick = (car: Car) => {
    const slug = generateCarSlug(car);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/coches/${slug}`);
  };

  return (
    <div
      className="min-h-screen bg-white pt-24 md:pt-32"
      style={{ backgroundColor: "#F5F4F2" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <section className="py-16">
          <h1 className="text-5xl md:text-[5rem] mb-8">Nuestros Coches</h1>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={
                  selectedCategory === category.id
                    ? { backgroundColor: "var(--black-custom)" }
                    : undefined
                }
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
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
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200" style={{ backgroundColor: "#F5F4F2" }}>
              <p className="text-gray-500 text-lg">
                No vehicles found in this category. Check back soon!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Cars;
