import { Car } from "@/types";

interface CarImageGalleryProps {
  car: Car;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

export const CarImageGallery = ({
  car,
  selectedImageIndex,
  onImageSelect,
}: CarImageGalleryProps) => {
  if (!car.images || car.images.length === 0) {
    return (
      <div className="w-full max-w-[380px] h-[400px] mx-auto md:w-full md:h-[996px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No Image Available</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-[380px] mx-auto md:max-w-full mb-6 md:mb-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <img
          src={car.images[selectedImageIndex]}
          alt={`${car.make} ${car.model} - Vista ${selectedImageIndex + 1}`}
          className="w-full h-auto object-contain transition-opacity duration-300"
        />
      </div>

      {/* Image Gallery Thumbnails */}
      {car.images.length > 1 && (
        <div className="flex gap-4 justify-center overflow-x-auto pt-4 pb-2">
          {car.images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImageIndex === index
                  ? "ring-4 ring-gray-900 scale-105"
                  : "ring-2 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${index + 1} de ${car.images.length}`}
            >
              <img
                src={image}
                alt={`${car.make} ${car.model} - Miniatura ${index + 1}`}
                className="w-14 h-14 md:w-16 md:h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

